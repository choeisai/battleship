module.exports = async (config) => {
  // Express
  const app = require('./initExpress')(config)

  return require('./initRoute')(config, app)
}
