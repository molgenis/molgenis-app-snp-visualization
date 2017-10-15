export default {
  computeScore (p1, p2) {
    if (p1 === p2 || (p1 === 'AB' && p2 === 'BA') || (p1 === 'BA' && p2 === 'AB')) {
      return 2
    }
    if ((p1 === 'AA' && p2 === 'BB') || (p1 === 'BB' && p2 === 'AA')) {
      return 0
    }
    if (p1 !== 'NC' && p2 !== 'NC') {
      const p1Allele1 = p1.charAt(0)
      const p1Allele2 = p1.charAt(1)
      const p2Allele1 = p1.charAt(0)
      const p2Allele2 = p1.charAt(1)
      if (p1Allele1 === p2Allele1 || p1Allele1 === p2Allele2 || p1Allele2 === p2Allele1 || p1Allele2 === p2Allele2) {
        return 1
      }
    } else {
      return -1
    }
  }
}
