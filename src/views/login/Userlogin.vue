<template>
  <div class="login container">
    <Header> </Header>
    <section>
      <div class="login-tel">
        <input type="text" placeholder="请输入手机号" v-model="userTel" />
      </div>
      <div class="login-code">
        <input type="password" placeholder="请输入密码" v-model="userPwd" />
      </div>
      <div class="login-btn" @click="login">登 录</div>
      <div class="tab">
        <span @click="goLogin">短信登录</span>
        <span @click="goRecovery">找回密码</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/views/login/Header.vue'
//引入二次封装的axios
import http from '@/common/api/request'
import { Toast } from 'mint-ui'
import { mapMutations } from 'vuex'
export default {
  name: 'Userlogin',
  components: { Tabbar, Header },
  props: {},
  data() {
    return {
      userTel: '', //手机号
      userPwd: '', //密码
      //校验规则
      rules: {
        //手机号校验
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: '请输入11位正确的手机号',
        },
        //密码校验
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: '请输入6~12位密码',
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goLogin() {
      this.$router.push({
        path: '/login',
      })
    },
    goRegister() {
      this.$router.push({
        path: '/register',
      })
    },
    goRecovery() {
      this.$router.push({
        path: '/recovery',
      })
    },

    //点击登录按钮
    async login() {
      //前端验证
      if (!this.validate('userTel')) return
      if (!this.validate('userPwd')) return

      //发送请求后端验证
      const res = await http.$axios({
        url: '/api/login',
        method: 'POST',
        data: {
          userTel: this.userTel,
          userPwd: this.userPwd,
        },
      })
      //登录失败
      if (!res.success) {
        Toast({
          message: res.msg,
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        return
      }
      //登录成功(验证通过后存储用户信息并跳转页面、传递存储token)
      if (res.success) {
        Toast({
          message: res.msg,
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        //存入状态管理数据池中
        this.USER_LOGIN(res.data)
        this.$router.push('/my')
      }
    },

    //正则匹配函数
    validate(key) {
      let bool = true
      if (!this.rules[key].rule.test(this[key])) {
        //提示信息
        Toast({
          message: this.rules[key].msg,
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        bool = false
        return false
      }
      return bool
    },

    //存储用户信息到状态管理中
    ...mapMutations(['USER_LOGIN']),
  },
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  div {
    margin: 0.2667rem 0;
    width: 8.933rem;
    height: 1.173rem;
  }
  input {
    box-sizing: border-box;
    padding: 0 0.266rem;
    line-height: 1.173rem;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 0.16rem;
    font-size: 0.3733rem;
  }
  .login-tel {
    margin-top: 0.8rem;
    input {
      width: 8.933rem;
    }
  }
  .login-code {
    display: flex;
    input {
      flex: 1;
    }
    button {
      line-height: 1.173rem;
      height: 1.173rem;
      background-color: #b0352f;
      color: #fff;
      border: 0;
      padding: 0 5px;
      border-radius: 5px;
      font-size: 0.3733rem;
    }
  }
  .login-btn {
    font-size: 0.3733rem;
    line-height: 44px;
    color: #fff;
    text-align: center;
    background-color: #b0352f;
    border-radius: 0.16rem;
  }
  .tab {
    display: flex;
    justify-content: space-between;
    font-size: 0.3733rem;
  }
}
</style>
