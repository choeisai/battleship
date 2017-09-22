const config = {
  base_url: process.env.BASE_URL || 'localhost:3000',
  mongo_url: process.env.MONGODB_URI || 'mongodb://localhost:27017/my_db'
}

module.exports = config
