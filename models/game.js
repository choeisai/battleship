const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
}, { timestamps: true })

const Game = mongoose.model('game', gameSchema)

module.exports = Game
