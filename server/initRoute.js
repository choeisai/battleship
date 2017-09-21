// Init app route
const initRoute = (app) => {
  app.get('/', (req, res) => {
    return res.send('Hello battleship api')
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
