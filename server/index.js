require('./debug')
const config = require('./config')

const start = async () => {
  // Initializer
  const initializer = require('./initializer')
  await initializer(config)

  // Ready
  debug.info(`Battleship API is ready to use ${process.env.NODE_ENV} `)
  debug.info(`Battleship API is running on ${process.env.BASE_URL}`)
}

module.exports = {
  start
}
