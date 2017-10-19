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
  describe('isEvenOrOdd', () => {
    it('should return odd for odd value', () => {
      expect(plotter.isEvenOrOdd(1)).to.equal('odd')
    })
    it('should return even for 0', () => {
      expect(plotter.isEvenOrOdd(0)).to.equal('even')
    })
    it('should return even for even value', () => {
      expect(plotter.isEvenOrOdd(2)).to.equal('even')
    })
  })

  describe('getLabelPos', () => {
    it('should return 40 * 2.1 - 60 = 24 for even value with %4 equal to 0', () => {
      expect(plotter.getLabelPosition(0, 40)).to.equal(24)
    })
    it('should return 40 * 2.1 - 50 = 34 for even value with %4 not equal to 0', () => {
      expect(plotter.getLabelPosition(2, 40)).to.equal(34)
    })
    it('should return 40 * 2.1 - 10 = 74 for odd value with %4 equal to 1', () => {
      expect(plotter.getLabelPosition(1, 40)).to.equal(74)
    })
    it('should return 40 * 2.1      = 84 for odd value with %4 not equal to 1', () => {
      expect(plotter.getLabelPosition(3, 40)).to.equal(84)
    })
  })
})
