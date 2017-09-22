const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Game = require('./game')
const Defender = require('./defender')

const Position = Schema({
  row: { type: String },
  col: { type: String }
}, { _id: false })

const attackerSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'game' },
  fire: Position,
  result: { type: String, enum: ['MISS', 'HIT' ]},
  message: { type: String },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true })

// Validate gameId
attackerSchema.pre('save', async function (next, done) {
  const gameResult = await Game.findOne({ _id: this.gameId }, (err, game) => {
    if (err) return next(err)
    return game
  })

  // gameId not exists
  if (gameResult === null) {
    // debug.error('Invalid gameId')
    const err = new Error('Invalid gameId')
    return next(err)
  }
  return next()
})

// Check existing position
attackerSchema.pre('save', async function(next) {
  const attackerResult = await Attacker.findOne({ gameId: this.gameId, fire: this.fire }, (err, attacker) => {
    if (err) return next(err)
    return attacker
  })

  if (attackerResult !== null) {
    const err = new Error('Invalid position')
    return next(err)
  }

  return next()
})

// Get result
attackerSchema.pre('save', async function(next) {
  const fireResult = await Defender.findOneAndUpdate({
    gameId: this.gameId,
    position: {
      $elemMatch: { row: this.fire.row, col: this.fire.col }
    }
  }, {$inc: { hitCount: 1} }, (err, result) => {
    if (result) {
      this.result = 'HIT'
      switch (result.ship) {
      case 'BATTLESHIP':
        if ((result.hitCount + 1) === 4) {
          this.result = `You just sank the ${result.ship}`
        }
        break
      case 'CRUISER':
        if ((result.hitCount + 1) === 3) {
          this.result = `You just sank the ${result.ship}`
        }
        break
      case 'DESTROYER':
        if ((result.hitCount + 1) === 2) {
          this.result = `You just sank the ${result.ship}`
        }
        break
      case 'SUBMARINE':
        if ((result.hitCount + 1) === 1) {
          this.result = `You just sank the ${result.ship}`
        }
        break
      }
    } else {
      this.result = 'MISS'
    }
    return next()
  })
})

// Check game complete
attackerSchema.pre('save', async function(next) {
  const fireResult = await Defender.find({
    $or: [
      {
        gameId: this.gameId,
        ship: 'BATTLESHIP',
        hitCount: 4
      },
      {
        gameId: this.gameId,
        ship: 'CRUISER',
        hitCount: 3
      },
      {
        gameId: this.gameId,
        ship: 'DESTROYER',
        hitCount: 2
      },
      {
        gameId: this.gameId,
        ship: 'SUBMARINE',
        hitCount: 1
      },
    ]
  }, async (err, result) => {
    if (result.length === 10) {
      const moveResult = await Attacker.find({ gameId: this.gameId }, (err, attackerResult) => {
        return attackerResult
      })
      const missResult = await Attacker.find({ gameId: this.gameId,  result: 'MISS' }, (err, missResult) => {
        return missResult
      })
      const totalMove = moveResult.length + 1
      this.result = `Win ! You completed the game in ${totalMove} moves, HIT ${totalMove - missResult.length} moves and MISS ${missResult.length} moves.`
      return next()
    }
  })
})

const Attacker = mongoose.model('attacker', attackerSchema)

module.exports = Attacker
