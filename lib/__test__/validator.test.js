const Validator = require('../validator')

describe('Validator ship position place', () => {
  it('should return false if place BATTLESHIP overflow left', () => {
    const position = [
      { row: '1', col: 'z' },
      { row: '1', col: 'A' },
      { row: '1', col: 'B' },
      { row: '1', col: 'C' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return false if place BATTLESHIP overflow right', () => {
    const position = [
      { row: '1', col: 'H' },
      { row: '1', col: 'I' },
      { row: '1', col: 'J' },
      { row: '1', col: 'K' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return false if place BATTLESHIP overflow top', () => {
    const position = [
      { row: '0', col: 'A' },
      { row: '1', col: 'A' },
      { row: '2', col: 'A' },
      { row: '3', col: 'A' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return false if place BATTLESHIP overflow bottom', () => {
    const position = [
      { row: '9', col: 'A' },
      { row: '10', col: 'A' },
      { row: '11', col: 'A' },
      { row: '12', col: 'A' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return false if place BATTLESHIP diagonal direction (top-left to bottom-right)', () => {
    const position = [
      { row: '1', col: 'A' },
      { row: '2', col: 'B' },
      { row: '3', col: 'C' },
      { row: '4', col: 'D' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return false if place BATTLESHIP diagonal direction (bottom-left to top-right)', () => {
    const position = [
      { row: '7', col: 'D' },
      { row: '8', col: 'C' },
      { row: '9', col: 'B' },
      { row: '10', col: 'A' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(false)
  })

  it('should return true if place BATTLESHIP horizontal direction', () => {
    const position = [
      { row: '1', col: 'A' },
      { row: '1', col: 'B' },
      { row: '1', col: 'C' },
      { row: '1', col: 'D' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(true)
  })

  it('should return true if place BATTLESHIP vertical direction', () => {
    const position = [
      { row: '1', col: 'A' },
      { row: '2', col: 'A' },
      { row: '3', col: 'A' },
      { row: '4', col: 'A' },
    ]
    const validatorResult = Validator.ShipPositionPattern(position)
    expect(validatorResult).toEqual(true)
  })
})
