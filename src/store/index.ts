/* eslint-disable @typescript-eslint/ban-ts-comment */
import Vue from 'vue'
import Vuex from 'vuex'

// @ts-ignore
import state from './state'
// @ts-ignore
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations
})
