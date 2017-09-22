module.exports = async (config) => {
  // Express
  const app = require('./initExpress')(config)

  // Mongoose
  const mongoose = await require('./initMongoose')(config)
        .catch(err => debug.error(`MongoDB :`, err))

  return require('./initRoute')(config, app)
}
