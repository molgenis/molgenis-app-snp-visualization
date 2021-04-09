import identityByDecent from '@/service/identityByDecent'

describe('identityByDecent', () => {
    describe('computeScore', () => {
        it('should return 2 when comparing AA to AA ', () => {
            expect(identityByDecent.computeScore('AA', 'AA')).toEqual(2)
        })
        it('should return 2 when comparing BB to BB ', () => {
            expect(identityByDecent.computeScore('BB', 'BB')).toEqual(2)
        })
        it('should return 1 when comparing BB to BA ', () => {
            expect(identityByDecent.computeScore('BB', 'BA')).toEqual(1)
        })
        it('should return 1 when comparing BB to AB ', () => {
            expect(identityByDecent.computeScore('BB', 'AB')).toEqual(1)
        })
        it('should return 1 when comparing AA to BA ', () => {
            expect(identityByDecent.computeScore('AA', 'BA')).toEqual(1)
        })
        it('should return 1 when comparing AA to AB ', () => {
            expect(identityByDecent.computeScore('AA', 'AB')).toEqual(1)
        })
        it('should return 0 when comparing AA to BB ', () => {
            expect(identityByDecent.computeScore('AA', 'BB')).toEqual(0)
        })
        it('should return 2 when comparing AB to AB ', () => {
            expect(identityByDecent.computeScore('AB', 'AB')).toEqual(2)
        })
        it('should return 2 when comparing BA to BA ', () => {
            expect(identityByDecent.computeScore('BA', 'BA')).toEqual(2)
        })
        it('should return 2 when comparing AB to BA ', () => {
            expect(identityByDecent.computeScore('AB', 'BA')).toEqual(2)
        })
        it('should return -1 when comparing when p1 is NC', () => {
            expect(identityByDecent.computeScore('NC', 'BA')).toEqual(-1)
        })
        it('should return -1 when comparing when p2 is NC', () => {
            expect(identityByDecent.computeScore('AB', 'NC')).toEqual(-1)
        })
    })
})