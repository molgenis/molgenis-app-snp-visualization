import api from '@molgenis/molgenis-api-client'

export const GET_ENTITY_TYPES = '__GET_ENTITY_TYPES__'

export default {
  /**
   * Example action for retrieving all EntityTypes from the server
   */
  [GET_ENTITY_TYPES] ({commit}) {
    /**
     * Pass options to the fetch like body, method, x-molgenis-token etc...
     * @type {{}}
     */
    const options = {}
    api.get('/api/v2/sys_md_EntityTypes?num=1000', options).then(response => {
      console.log(response)
    }, error => {
      console.log(error)
    })
  },
  [PARSE_DEF_FILE] ({commit}, file) {
    const self = this
    let defObj = {}
    const reader = new FileReader()
    reader.onload = function () {
      const lines = reader.result.split('\n')
      const columns = lines[0].split('\t')
      columns.shift()
      const defs = lines[1].split('\t')
      for (var i = 0; i < columns.length; i++) {
        defObj[columns[i]] = defs[i + 1]
      }
      console.log(self.calculatePlotCombinations(defObj))
      return self.calculatePlotCombinations(defObj)
    }
    reader.readAsText(file)
    commit(SET_PARSED_DEF_FILE, 'blabla')
  }
}
