<template>
  <div>
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <slot><span>我的地址</span></slot>
      <i class="iconfont icon-kefu" @click="$router.back()"></i>
    </header>
  </div>
</template>

<script>
export default {
  name: 'PathHeader',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.173rem;
  color: #fff;
  background-color: #b0352f;
  i {
    padding: 0 0.4rem;
    font-size: 21.975px;
  }
  span {
    font-size: 16px;
  }
}
</style>
