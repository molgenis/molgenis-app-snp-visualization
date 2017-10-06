import SnpDescentPlots from 'components/SnpDescentPlots.vue'

describe('SnpDescentPlots', () => {
  describe('Name', () => {
    it('should use "SnpDescentPlots" as name', () => {
      expect(SnpDescentPlots.name).to.equal('snp-descent-plot')
    })
  })
  describe('compareAlleles', () => {
    it('should return 2 when comparing AA to AA ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AA', 'AA')).to.equal(2)
    })
    it('should return 2 when comparing BB to BB ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('BB', 'BB')).to.equal(2)
    })
    it('should return 1 when comparing BB to BA ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('BB', 'BA')).to.equal(1)
    })
    it('should return 1 when comparing BB to AB ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('BB', 'AB')).to.equal(1)
    })
    it('should return 1 when comparing AA to BA ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AA', 'BA')).to.equal(1)
    })
    it('should return 1 when comparing AA to AB ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AA', 'AB')).to.equal(1)
    })
    it('should return 0 when comparing AA to BB ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AA', 'BB')).to.equal(0)
    })
    it('should return 2 when comparing AB to AB ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AB', 'AB')).to.equal(2)
    })
    it('should return 2 when comparing BA to BA ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('BA', 'BA')).to.equal(2)
    })
    it('should return 2 when comparing AB to BA ', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AB', 'BA')).to.equal(2)
    })
    it('should return -1 when comparing when p1 is NC', () => {
      expect(SnpDescentPlots.methods.compareAlleles('NC', 'BA')).to.equal(-1)
    })
    it('should return -1 when comparing when p2 is NC', () => {
      expect(SnpDescentPlots.methods.compareAlleles('AB', 'NC')).to.equal(-1)
    })
  })
})
