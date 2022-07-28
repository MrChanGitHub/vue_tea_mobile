<template>
  <header>
    <div>
      <i class="iconfont icon-fanhui" @click="goMy"></i>
    </div>
    <div>
      <slot><span>登录</span></slot>
    </div>
    <div><i class="iconfont icon-kefu"></i></div>
  </header>
</template>

<script>
export default {
  name: 'loginHeader',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goMy() {
      this.$router.back()
    },
  },
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #fff;
  height: 1.173rem;
  background-color: #b0352f;
  span {
    font-size: 0.4rem;
  }
  i {
    padding: 0 0.4rem;
    font-size: 0.586rem;
  }
}
</style>
