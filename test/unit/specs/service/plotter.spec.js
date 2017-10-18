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
    it('should return 7 for even value with modulo 4 equal to 0', () => {
      expect(plotter.getLabelPos(0)).to.equal(7)
    })
    it('should return 17 for even value with modulo 4 not equal to 0', () => {
      expect(plotter.getLabelPos(2)).to.equal(17)
    })
    it('should return 55 for odd value with modulo 4 equal to 1', () => {
      expect(plotter.getLabelPos(1)).to.equal(55)
    })
    it('should return 65 for odd value with modulo 4 not equal to 1', () => {
      expect(plotter.getLabelPos(3)).to.equal(65)
    })
  })
})
