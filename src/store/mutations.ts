export const SET_MESSAGE = "__SET_MESSAGE__";
export const SET_PARSED_DEF_OBJ = "__SET_PARSED_DEF_OBJ__";
export const SET_DATA_INDEX = "__SET_DATA_INDEX__";

export default {
  [SET_MESSAGE](state: any, message: string): void {
    state.message = message;
  },
  [SET_PARSED_DEF_OBJ](state: any, parsedDefObj: Record<string, unknown>): void {
    state.parsedDefObj = parsedDefObj;
  },
  [SET_DATA_INDEX](state: any, dataIndex: string): void {
    state.dataIndex = dataIndex;
  },
};
