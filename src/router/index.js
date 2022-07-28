import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)
//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/list',
    name: 'List',
    component: () => import(/* webpackChunkName: "about" */ '@/views/List.vue'),
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Cart.vue'),
  },
  {
    path: '/my',
    name: 'My',
    component: () => import(/* webpackChunkName: "about" */ '@/views/My.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    children: [
      {
        path: '/',
        name: 'searchindex',
        component: () => import('@/components/search/Search-index.vue'),
      },
      {
        path: 'searchlist',
        name: 'searchlist',
        component: () => import('@/components/search/Search-list.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "about" */ '@/views/Search.vue'),
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Detail.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Login.vue'),
  },
  {
    path: '/userLogin',
    name: 'Userlogin',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Userlogin.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Register.vue'),
  },
  {
    path: '/recovery',
    name: 'Recovery',
    children: [
      {
        path: '/',
        name: 'recoveryIndex',
        component: () => import('@/components/Recovery/RecoveryIndex.vue'),
      },
      {
        path: '/recoverybtn',
        name: 'recoveryBtn',
        component: () => import('@/components/Recovery/RecoveryBtn.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "about" */ '@/views/login/Recovery.vue'),
  },
  {
    path: '/path',
    name: 'Path',
    children: [
      {
        path: '/',
        name: 'Index',
        component: () => import('@/components/path/Path-Index.vue'),
      },
      {
        path: '/pathlist',
        name: 'Pathlist',
        component: () => import('@/components/path/Path-List.vue'),
      },
    ],
    component: () => import(/* webpackChunkName: "about" */ '@/views/Path.vue'),
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Order.vue'),
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Payment.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  //定义需要守卫的路由名称
  let nextRoute = ['Payment', 'Order', 'Pathlist', 'Path', 'Cart']

  //是否存在登录信息
  let userToken = JSON.parse(sessionStorage.getItem('token'))

  //判断即将前往的路由是否需要守卫
  if (nextRoute.indexOf(to.name) >= 0) {
    //判断是否已登录
    if (!userToken) {
      router.push('/login')
    }
  }
  //验证通过后,放行前往
  next()
})

export default router
