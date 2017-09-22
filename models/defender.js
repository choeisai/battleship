const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Game = require('./game')

const Position = Schema({
  row: { type: String },
  col: { type: String }
}, { _id: false })

const defenderSchema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'game' },
  ship: {
    type: String,
    require: true,
    enum: ['BATTLESHIP', 'CRUISER', 'DESTROYER', 'SUBMARINE']
  },
  position: [Position],
  hitCount: { type: Number, default: 0 }
}, { timestamps: true })

// Validate gameId
defenderSchema.pre('save', async function (next, done) {
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

// Validate ship limit
defenderSchema.pre('save', async function (next, done) {
  let shipLimit
  switch (this.ship) {
  case 'BATTLESHIP':
    shipLimit = 1
    break
  case 'CRUISER':
    shipLimit = 2
    break
  case 'DESTROYER':
    shipLimit = 3
    break
  case 'SUBMARINE':
    shipLimit = 4
    break
  default:
    shipLimit = 0
  }

  // Get ship
  const shipResult = await Defender.find({
    gameId: this.gameId, ship: this.ship
  }, (err, result) => {
    if (err) return next(err)
    return result
  })

  if (shipResult.length < 0 || shipResult.length >= shipLimit) {
    const err = new Error(`${this.ship} limit is exeeded`)
    return next(err)
  }

  // Validate ship
  return next()
})

const Defender = mongoose.model('defender', defenderSchema)

module.exports = Defender
