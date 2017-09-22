const router = require('express').Router()
const Game = require('../models/game')
const Defender = require('../models/defender')
const Attacker = require('../models/attacker')
const bodyParser = require('body-parser')
const Validator = require('../lib/validator')

/*
  Route
  /api/v1/games GET
 */

const version = 'v1'

// Init app route
const initRoute = (app) => {
  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // Parse application/json
  app.use(bodyParser.json())

  // Define prefix api
  app.use(`/api/${version}`, router)

  router.route('/games')
    // create new game
    .post(async (req, res) => {
      const NewGame = Game({})
      try {
        const result = await NewGame.save((err, game) => {
          if (err) throw err
          return game
        })
        debug.info(`game created: ${result._id}`)
        return res.json({ gameId: result._id, message: 'game created' })
      } catch(error) {
        return res.status(500).json({ error })
      }
    })

  // Update defender
  router.route('/games/:game_id/defender')
    .post(async (req, res) => {
      const gameId = req.params.game_id
      let { position } = req.body

      // Verfity position
      if (!Validator.ShipPositionPattern(position)) {
        return res.status(500).json({
          error: {
            message: 'Invalid ship position'
          }
        })
      }
      if (!await Validator.ShipPositionOverlap(gameId, position)) {
        return res.status(500).json({
          error: {
            message: 'Invalid ship position'
          }
        })

      }

      let ship
      switch (position.length) {
      case 1:
        ship = 'SUBMARINE'
        break
      case 2:
        ship = 'DESTROYER'
        break
      case 3:
        ship = 'CRUISER'
        break
      case 4:
        ship = 'BATTLESHIP'
        break
      default:
        debug.info('Invalid ship type')
        ship = undefined
      }

      // Insert defender move to database
      const NewDefender = Defender({
        gameId,
        ship: ship,
        position
      })

      try {
        // Save defender data
        const result = await NewDefender.save((err, defender) => {
          return defender
        })

        debug.info(`Defender place ${ship} position: ${position.map((value) => value.row + value.col)}`)

        // Response result
        return res.json({
          gameId: result.gameId,
          message: 'defender move created',
          ship: result.ship,
          position: result.position
        })
      } catch (error) {
        debug.error(error.name, error.message)
        return res.status(500).json({
          error: {
            name: error.name,
            message: error.message
          }
        })
      }
    })


  // Attacker
  router.route('/games/:game_id/attacker')
    .post(async (req, res) => {
      const gameId = req.params.game_id
      let { position } = req.body

      const NewAttacker = Attacker({
        gameId,
        fire: position
      })

      try {
        const result = await NewAttacker.save((err, attacker) => {
          return attacker
        })
        return res.json(result)
      } catch (error) {
        debug.error(error.name, error.message)
        return res.status(500).json({
          error: {
            name: error.name,
            message: error.message
          }
        })
      }
    })
}



// Graceful shutdown server
const gracefulShutdown = (server, signal) => {
  debug.info(`Received kill signal (${signal}), shutting down gracefullty\n`)
  server.close(() => {
    debug.info('Closed out remaining connections.')
    process.exit()
  })
}

const init = ({ base_url }, app) => {
  new Promise((resolve, reject)  => {
    // initRoute
    initRoute(app)

    // Server
    const { URL } = require('url')
    const port = new URL(base_url).port
    const server = app.listen(port, (err) => {
      if (err) return reject(err)
      // debug.info(`Express : ${base_url}`)
      return resolve(app)
    })

    // Graceful server shutdown
    // listen for TERM signal e.g. kill
    process.on('SIGTERM', () => {
      gracefulShutdown(server, 'SIGTERM')
    })

    // listen for TERM signal e.g. Ctrl-c
    process.on('SIGINT', () => {
      gracefulShutdown(server, 'SIGINT')
    })
  })
}

module.exports = init
