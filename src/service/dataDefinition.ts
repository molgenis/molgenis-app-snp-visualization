type dataIndex = Record<string, { gPos1: number, gPosColumnNr1: number, gPos2: number, gPosColumnNr2: number }>

export default {
  buildDataIndex (parsedDefData: any, columnHeaders: any): dataIndex {
    const combinations = Object.keys(parsedDefData)
    const dataIndex: dataIndex = {}
    for (const combination of combinations) {
      const gPosColumnNr1 = parsedDefData[combination][0]
      const gPos1 = columnHeaders.indexOf(gPosColumnNr1 + '.GType')
      const gPosColumnNr2 = parsedDefData[combination][1]
      const gPos2 = columnHeaders.indexOf(gPosColumnNr2 + '.GType')
      dataIndex[combination] = {gPos1, gPosColumnNr1, gPos2, gPosColumnNr2}
    }
    return dataIndex
  },
  calculatePlotCombinations(defs: Record<string, string>): Record<string, [string, string]> {
    const keys = Object.keys(defs)
    const results: Record<string, [string, string]> = {}
    for (let i = 0; i < keys.length - 1; i++) {
      // This is where you'll capture that last value
      for (let j = i + 1; j < keys.length; j++) {
        results[`${keys[i]}-${keys[j]}`] = [defs[keys[i]], defs[keys[j]]]
      }
    }
    return results
  },
  readDefinitionLines(lineData: string): Record<string, string> {
    const defObj: Record<string, string> = {}
    const lines = lineData.split('\n')
    const columns = lines[0].replace(/\r/g, '').split('\t')
    columns.shift()
    const defs = lines[1].replace(/\r/g, '').split('\t')
    for (let i = 0; i < columns.length; i++) {
      defObj[columns[i]] = defs[i + 1]
    }
    return defObj
  }
}