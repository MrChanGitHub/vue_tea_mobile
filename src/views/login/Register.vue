<template>
  <div class="login container">
    <Header>
      <span>注册</span>
    </Header>
    <section>
      <div class="login-tel">
        <input type="text" placeholder="请输入手机号" v-model="userTel" />
      </div>
      <div class="login-code">
        <input type="password" placeholder="请设置密码" v-model="userPwd" />
      </div>
      <div class="login-code">
        <input type="text" placeholder="请输入短信验证码" v-model="userCode" />
        <button @click="sendCode" :disabled="disabled">{{ codeMsg }}</button>
      </div>
      <div class="login-btn" @click="Register">注 册</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/views/login/Header.vue'
import http from '@/common/api/request'
import { Toast } from 'mint-ui'
export default {
  name: 'Register',
  components: { Tabbar, Header },
  props: {},
  data() {
    return {
      //手机号
      userTel: '',
      //验证码
      userCode: '',
      //密码
      userPwd: '',
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
      //控制验证码按钮是否可用
      disabled: false,
      //验证码获取间隔second
      codeNum: 6,
      codeMsg: '获取短信验证码',
      //存储短信验证码
      code: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goUserLogin() {
      this.$router.push({
        path: '/userLogin',
      })
    },
    goRegister() {
      this.$router.push({
        path: '/register',
      })
    },
    //获取短信验证码
    async sendCode() {
      //校验手机号
      if (!this.validate('userTel')) return

      //请求短信验证码接口
      const res = await http.$axios({
        url: '/api/code',
        method: 'POST',
        data: {
          userTel: this.userTel,
        },
      })
      //获取短信验证码成功
      if (res.success) {
        Toast({
          message: '短信已发送',
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        this.code = res.data
      }
      console.log(this.code)

      //禁用按钮
      this.disabled = true
      //倒计时
      let timer = setInterval(() => {
        --this.codeNum
        this.codeMsg = `重新发送 ${this.codeNum}`
      }, 1000)

      //按照获取验证码的时间间隔停止定时器
      setTimeout(() => {
        clearInterval(timer)
        this.codeNum = 6
        this.disabled = false
        this.codeMsg = '获取短信验证码'
      }, 6000)
    },

    //校验正则匹配
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

    //注册
    async Register() {
      //校验手机号
      if (!this.validate('userTel')) return
      //校验密码
      if (!this.validate('userPwd')) return
      //检查手机验证码是否被获取
      if (!this.code) {
        Toast({
          message: '请获取验证码',
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        return
      }

      //校验验证码
      if (this.code == this.userCode) {
        //验证通过后请求接口存储用户信息
        const res = await http.$axios({
          url: '/api/addUser',
          method: 'POST',
          data: {
            userTel: this.userTel,
            userPwd: this.userPwd,
          },
        })
        if (res.success) {
          Toast({
            message: res.msg,
            position: 'bottom',
            duration: 3000,
            className: 'toasts',
          })
          this.$router.push('/userLogin')
        }
      } else {
        Toast({
          message: '验证码错误',
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        return
      }
    },
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
}
.toasts {
  bottom: 60px !important;
  font-size: 12px !important;
}
</style>
