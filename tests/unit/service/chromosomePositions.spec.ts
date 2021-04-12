import chromosomePositions from '@/service/chromosomePositions'

describe('chromosomePositions', () => {
    const selectedChromosome = 'Y'
    describe('chromosomeCentromere', () => {
        it('should return the position of the centromere', () => {
            const center = chromosomePositions.chromosomeCentromere(selectedChromosome)
            expect(center).toEqual(12500000)
        })
    })
    describe('chromosomeSize', () => {
        it('should return the size of the centromere', () => {
            const size = chromosomePositions.chromosomeSize(selectedChromosome)
            expect(size).toEqual(59373566)
        })
    })
})