import dataDefinition from 'service/dataDefinition.js'

describe('dataDefinition', () => {
  describe('buildDataIndex', () => {
    const parsedDefData = {
      'father-mother': ['1', '2'],
      'mother-child': ['2', '3'],
      'father-child': ['1', '3']
    }
    const columnHeaders = ['Name', 'Chr', 'Position', '1.GType', '1.B Allele Freq', '1.Log R Ratio', '2.GType', '2.B Allele Freq', '2.Log R Ratio', '3.GType', '3.B Allele Freq', '3.Log R Ratio']
    it('should build the data index based on the definition data and the column headers', () => {
      const expectedResult = {
        'father-mother': {'gPos1': 3, 'gPosColumnNr1': '1', 'gPos2': 6, 'gPosColumnNr2': '2'},
        'mother-child': {'gPos1': 6, 'gPosColumnNr1': '2', 'gPos2': 9, 'gPosColumnNr2': '3'},
        'father-child': {'gPos1': 3, 'gPosColumnNr1': '1', 'gPos2': 9, 'gPosColumnNr2': '3'}
      }
      const result = dataDefinition.buildDataIndex(parsedDefData, columnHeaders)
      expect(result).to.deep.equal(expectedResult)
    })
  })
  describe('calculatePlotCombinations', () => {
    it('should return an object all combinations in the definition file', () => {
      const defs = {'father': '1', 'mother': '2', 'child': '3'}
      const result = dataDefinition.calculatePlotCombinations(defs)
      const expectedResult = {
        'father-mother': ['1', '2'],
        'mother-child': ['2', '3'],
        'father-child': ['1', '3']
      }
      expect(result).to.deep.equal(expectedResult)
    })
  })
  describe('readDefinitionLines', () => {
    it('should return an object with as keys the columns, except from the id, and as values the values in the columns', () => {
      const lineData = 'trioID\tfather\tmother\tchild\ntrio_1\t25\t26\t27\n'
      const result = dataDefinition.readDefinitionLines(lineData)
      const expectedResult = {father: '25', mother: '26', child: '27'}
      expect(result).to.deep.equal(expectedResult)
    })
    it('should parse the definition file, splitting on all end of line characters', () => {
      const lineData = 'trioID\tfather\tmother\tchild\ntrio_1\t25\t26\t27\r\n'
      const result = dataDefinition.readDefinitionLines(lineData)
      const expectedResult = '27'
      expect(result.child).to.equal(expectedResult)
    })
  })
})
