import identityByDecent from 'service/identityByDecent.js'

describe('identityByDecent', () => {
  describe('computeScore', () => {
    it('should return 2 when comparing AA to AA ', () => {
      expect(identityByDecent.computeScore('AA', 'AA')).to.equal(2)
    })
    it('should return 2 when comparing BB to BB ', () => {
      expect(identityByDecent.computeScore('BB', 'BB')).to.equal(2)
    })
    it('should return 1 when comparing BB to BA ', () => {
      expect(identityByDecent.computeScore('BB', 'BA')).to.equal(1)
    })
    it('should return 1 when comparing BB to AB ', () => {
      expect(identityByDecent.computeScore('BB', 'AB')).to.equal(1)
    })
    it('should return 1 when comparing AA to BA ', () => {
      expect(identityByDecent.computeScore('AA', 'BA')).to.equal(1)
    })
    it('should return 1 when comparing AA to AB ', () => {
      expect(identityByDecent.computeScore('AA', 'AB')).to.equal(1)
    })
    it('should return 0 when comparing AA to BB ', () => {
      expect(identityByDecent.computeScore('AA', 'BB')).to.equal(0)
    })
    it('should return 2 when comparing AB to AB ', () => {
      expect(identityByDecent.computeScore('AB', 'AB')).to.equal(2)
    })
    it('should return 2 when comparing BA to BA ', () => {
      expect(identityByDecent.computeScore('BA', 'BA')).to.equal(2)
    })
    it('should return 2 when comparing AB to BA ', () => {
      expect(identityByDecent.computeScore('AB', 'BA')).to.equal(2)
    })
    it('should return -1 when comparing when p1 is NC', () => {
      expect(identityByDecent.computeScore('NC', 'BA')).to.equal(-1)
    })
    it('should return -1 when comparing when p2 is NC', () => {
      expect(identityByDecent.computeScore('AB', 'NC')).to.equal(-1)
    })
  })
})
