export default {
  state: {
    addressList: [],
  },
  getters: {
    //过滤出默认的地址
    defaultPath(state) {
      return state.addressList.filter((v) => {
        return v.isDefault === '1'
      })
    },
  },
  mutations: {
    //存储地址数据
    initData(state, data) {
      state.addressList = data
    },
  },
  actions: {},
  modules: {},
}
