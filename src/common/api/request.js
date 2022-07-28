import { Indicator } from 'mint-ui'
import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'
import { Toast } from 'mint-ui'

export default {
  common: {
    method: 'GET',
    data: {},
    params: {},
    headers: {},
  },
  $axios(options = {}) {
    options.method = options.method || this.common.method
    options.data = options.data || this.common.data
    options.params = options.params || this.common.params
    options.headers = options.headers || this.common.headers

    //是否为登录状态
    if (options.headers.token) {
      options.headers.token = store.state.user.token
      if (!options.headers.token) {
        Toast('请先登录')
        router.push('/login')
        return new Promise((res, rej) => {
          const data = {
            success: false,
            msg: '请重新登录',
          }
          res(data)
        })
      }
    }

    //请求前显示加载提示
    Indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle',
    })
    return axios(options).then((result) => {
      return new Promise((res, rej) => {
        if (!result) return rej()
        const data = result.data.data
        res(data)
        //请求成功后关闭加载提示
        Indicator.close()
      })
    })
  },
}
