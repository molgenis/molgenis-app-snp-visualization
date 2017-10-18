import plotter from 'service/plotter.js'

describe('plotter', () => {
  describe('calculateXScaleCoefficient', () => {
    it('should calculate the X scale coefficient', () => {
      const width = 1020
      const paddingLeft = 10
      const paddingRight = paddingLeft
      const maxPosition = 5000
      const coefficient = plotter.calculateXScaleCoefficient(width, paddingLeft, paddingRight, maxPosition)
      expect(coefficient).to.equal(0.2)
    })
  })
})
