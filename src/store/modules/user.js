export default {
  state: {
    loginStatus: false, //登录状态
    token: null, //token
    userInfo: {}, //用户信息
  },
  getter: {},
  mutations: {
    //获取用户信息
    USER_LOGIN(state, user) {
      state.loginStatus = true
      state.token = user.token
      state.userInfo = user
      //持久化存储,刷新页面数据仍然存在
      /* 
        这里不能直接传用户信息,不安全
      */
      sessionStorage.setItem('nickName', JSON.stringify(user.nickName))
      sessionStorage.setItem('imgUrl', JSON.stringify(user.imgUrl))
      sessionStorage.setItem('token', JSON.stringify(user.token))
    },

    //页面加载时,若已登录则赋值
    checkLogin(state) {
      state.token = JSON.parse(sessionStorage.getItem('token'))
      if (state.token) {
        state.loginStatus = true
      }
    },

    //退出登录
    loginOut(state) {
      state.loginStatus = false
      state.token = null
      state.userInfo = {}
      sessionStorage.removeItem('nickName')
      sessionStorage.removeItem('imgUrl')
      sessionStorage.removeItem('token')
      window.location.reload()
    },
  },
  actions: {},
}
