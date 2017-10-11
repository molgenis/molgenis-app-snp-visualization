export const SET_MESSAGE = '__SET_MESSAGE__'
export const SET_PARSED_DEF_OBJ = '__SET_PARSED_DEF_OBJ__'
export const SET_DATA_INDEX = '__SET_DATA_INDEX__'

export default {
  [SET_MESSAGE] (state, message) {
    state.message = message
  },
  [SET_PARSED_DEF_OBJ] (state, parsedDefObj) {
    state.parsedDefObj = parsedDefObj
  },
  [SET_DATA_INDEX] (state, dataIndex) {
    state.dataIndex = dataIndex
  }
}
