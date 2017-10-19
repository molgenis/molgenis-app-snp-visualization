import SnpDescentPlots from 'components/SnpDescentPlots.vue'

describe('SnpDescentPlots', () => {
  describe('Name', () => {
    it('should use "SnpDescentPlots" as name', () => {
      expect(SnpDescentPlots.name).to.equal('snp-descent-plot')
    })
  })
  describe('forEachLine', () => {
    it('should', () => {
      SnpDescentPlots.forEachLine('unicorns\tare\tawesome', true)
    })
  })
})
