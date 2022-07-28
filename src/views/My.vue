<template>
  <div class="my container">
    <header>
      <div class="login" @click="goLogin" v-if="!loginStatus">登录/注册</div>
      <div class="user-info" v-else>
        <img :src="imgUrl" alt="" />
        <span>{{ nickName }}</span>
      </div>
    </header>
    <section>
      <ul>
        <li @click="goPath">地址管理</li>
        <li v-if="loginStatus" @click="loginOut">退出登录</li>
      </ul>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'My',
  components: { Tabbar },
  props: {},
  data() {
    return {
      //获取用户头像
      /*
        sessionStorage传过来的值头尾包含引号,通过substring返回需要的值即可
      */
      imgUrl: '',
      //获取用户名称
      nickName: '',
      //获取用户登录状态
      loginStatus: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  activated() {
    this.getUserInfo()
  },
  methods: {
    goLogin() {
      this.$router.push('/login')
    },

    goPath() {
      this.$router.push({
        path: '/path',
        query: {
          type: 'edit',
        },
      })
    },

    getUserInfo() {
      if (sessionStorage.getItem('imgUrl')) {
        this.imgUrl = sessionStorage
          .getItem('imgUrl')
          .substring(1, sessionStorage.getItem('imgUrl').length - 1)
      }

      if (sessionStorage.getItem('nickName')) {
        this.nickName = sessionStorage
          .getItem('nickName')
          .substring(1, sessionStorage.getItem('nickName').length - 1)
        this.loginStatus = true
      } else {
        this.loginStatus = false
      }
    },

    //
    ...mapMutations(['loginOut']),
  },
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4.266rem;
  background-color: #b0352f;
  .login {
    padding: 0.16rem 0.4rem;
    font-size: 0.426rem;
    color: #fff;
    background-color: #f6ab32;
    border-radius: 6px;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      width: 1.76rem;
      height: 1.76rem;
      border-radius: 50%;
    }
    span {
      padding: 0.533rem 0;
      font-size: 0.48rem;
      color: #fff;
    }
  }
}
section {
  flex: 1;
  overflow: hidden;
  ul li {
    padding: 0.4rem;
    font-size: 0.4266rem;
  }
}
</style>
