import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//公共css文件
import '@/assets/css/global.css'
//引入字体图标样式
import '@/assets/css/iconfont.css'

//引入适配文件
import '@/assets/js/flexible.js'

//全局引入Mint组件,这里暂时不考虑性能
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint)

//全局引入Vant组件
import Vant from 'vant'
import 'vant/lib/index.css'

//引入fastclick,禁止双击放大缩小界面
import fastClick from 'fastclick'
fastClick.attach(document.body)

Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
