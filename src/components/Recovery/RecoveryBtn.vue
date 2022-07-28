<template>
  <div class="login container">
    <Header><span>找回密码</span></Header>
    <section>
      <div class="login-code">
        <input type="password" placeholder="请输入密码" v-model="userPwd" />
      </div>
      <div class="login-code">
        <input type="password" placeholder="请再次输入密码" v-model="userPwd2" />
      </div>
      <div class="login-btn" @click="update">确认修改</div>
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
  name: 'RecoveryBtn',
  components: { Tabbar, Header },
  props: {},
  data() {
    return {
      //密码
      userPwd: '',
      //确认密码
      userPwd2: '',
      //校验规则
      rules: {
        //手机号验证
        userPwd: {
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且应为6~12位',
        },
        userPwd2: {
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且应为6~12位',
        },
      },
      userTel: this.$route.params.userTel,
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

    //校验正则匹配
    validate(key) {
      let bool = true
      if (!this.rules[key].rule.test(this[key])) {
        //提示信息
        Toast(this.rules[key].msg)
        bool = false
        return false
      }
      return bool
    },

    //修改密码
    async update() {
      //密码框基本校验
      if (!this.validate('userPwd')) return
      if (!this.validate('userPwd2')) return
      //校验两个密码是否一致
      if (!(this.userPwd === this.userPwd2)) {
        Toast('密码不一致,请重新输入')
        return
      }

      //发起请求,修改信息
      const res = await http.$axios({
        url: '/api/updateUser',
        method: 'POST',
        data: {
          userTel: this.userTel,
          userPwd: this.userPwd,
        },
      })
      //如果手机号不存在则弹出提示,拒绝执行
      if (res.success) {
        this.$router.push('/userLogin')
        Toast(res.msg)
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
</style>
