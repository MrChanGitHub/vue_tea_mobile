export default {
  state: {
    goods: [],
    totalNum: '',
    totalPrice: '',
  },
  getters: {},
  mutations: {
    //存储商品数据
    initGoods(state, data) {
      state.goods = data
      //通过本地存储,在刷新页面时仍能显示数据
      sessionStorage.setItem('cartgoods', JSON.stringify(data))
    },

    //存储商品总价
    initNum(state, data) {
      state.totalPrice = data
      //通过本地存储,在刷新页面时仍能显示数据
      sessionStorage.setItem('totalNum', data)
    },

    //存储商品总量
    initPrice(state, data) {
      state.totalNum = data
      //通过本地存储,在刷新页面时仍能显示数据
      sessionStorage.setItem('totalPrice', data)
    },
  },
  actions: {},
  modules: {},
}
