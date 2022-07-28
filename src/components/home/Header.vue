<template>
  <header>
    <h1>
      <img src="@/assets/images/logo.png" alt="" />
    </h1>
    <div class="search" @click="goSearch">
      <i class="iconfont icon-fangdajing">
        <span>搜索您喜欢的...</span>
      </i>
    </div>
    <div class="kefu">
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
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
    goSearch() {
      this.$router.push('/search')
    },
  },
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 1.6rem;
  background-color: #b0352f;
  h1 {
    img {
      width: 2.1rem;
      height: 0.93338rem;
    }
  }
}
.search {
  display: flex;
  align-items: center;
  width: 6.56rem;
  height: 0.8rem;
  background-color: #fff;
  border-radius: 12px;
  i {
    padding: 16px;
    color: #ccc;
  }
  span {
    font-size: 0.3733rem;
    color: #ccc;
  }
}
.icon-kefu {
  font-size: 0.8rem;
  color: white;
}
</style>
