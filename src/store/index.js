import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user.js'
import address from './modules/address.js'
import cart from './modules/cart.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    address,
    cart,
  },
})
