const { isInt } = require('validator')
const Defender = require('../models/defender')

const ShipPositionPattern = (position) => {
  if (position.length > 1) {
    for (let i = 0; i < position.length; i++) {
      // Check row and col undefined, null
      if (!position[i].row || !position[i].col) {
        console.log('undefined')
        return false
      }

      // Row must be int
      if (!isInt(position[i].row)) {
        return false
      }

      // Row must be 1 - 10
      if (position[i].row < 1 || position[i].row > 10) {
        return false
      }

      // Column must be a Char
      if (position[i].col.length > 1) {
        return false
      }

      // Column must be A - J
      if (!position[i].col.match(/[A-J]/)) {
        return false
      }
    }

    let direction
    if (!position.reduce((a, b) => a.row === b.row || a.col === b.col ? b : NaN)) {
      return false
    }

    // Horizontal
    if (!!position.reduce((a, b) => a.row === b.row ? a : NaN )) {
      direction = 'horizontal'
    }

    // Vertical
    if (!!position.reduce((a, b) => a.col === b.col ? a : NaN )) {
      // Overlap
      if (direction === 'horizontal') {
        return false
      } else {
        direction = 'vertical'
      }
    }

    // Check consecutive
    if (direction === 'horizontal') {
      // Sort position by col
      position.sort((a, b) => {
        return (a.col).charCodeAt(0) - (b.col).charCodeAt(0)
      })

      const isConsecutive = !!position.reduce((a, b) => {
        if ((b.col).charCodeAt(0) - (a.col).charCodeAt(0) === 1) {
          return b
        }
        return NaN
      })

      if (!isConsecutive) return false


    } else if (direction === 'vertical') {
      // Sort position by row
      position.sort((a, b) => {
        return a.row - b.row
      })
      const isConsecutive = !!position.reduce((a, b) => b.row - a.row === 1 ? b : NaN)
      if (!isConsecutive) return false
    }
  }

  return true
}

const ShipPositionOverlap = async (gameId, position) => {
  // Check overlap
  try {
    const shipPosition = await Defender.find({ gameId }, 'position', (err, position) => {
      return position
    })
    let allPosition = []
    shipPosition.map(({ position }) => {
      position.map((value) => {
        allPosition.push(value)
      })
    })

    for (let i = 0; i < position.length; i++) {
      for (let j = 0; j < allPosition.length; j++) {
        for (let k = parseInt(position[i].row) - 1; k <= parseInt(position[i].row) + 1; k++) {
          for (let h = position[i].col.charCodeAt(0) - 1; h <= position[i].col.charCodeAt(0) + 1; h++) {
            // console.log(allPosition[j].row, k.toString(), allPosition[j].col, String.fromCharCode(h))
            if (allPosition[j].row === k.toString() && allPosition[j].col === String.fromCharCode(h)) {
              console.log('overlap')
              return false
              // return Promise.resolve(false)
            }
          }
        }
      }
    }
  } catch (err) {
    return false
  }
  return Promise.resolve(true)
}
module.exports = {
  ShipPositionPattern,
  ShipPositionOverlap
}
