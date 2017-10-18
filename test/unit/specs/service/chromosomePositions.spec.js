import chromosomePositions from 'service/chromosomePositions.js'

describe('chromosomePositions', () => {
  const selectedChromosome = 'Y'
  describe('chromosomeCentromere', () => {
    it('should return the position of the centromere', () => {
      const center = chromosomePositions.chromosomeCentromere(selectedChromosome)
      expect(center).to.equal(12500000)
    })
  })
  describe('chromosomeSize', () => {
    it('should return the size of the centromere', () => {
      const size = chromosomePositions.chromosomeSize(selectedChromosome)
      expect(size).to.equal(59373566)
    })
  })
})
