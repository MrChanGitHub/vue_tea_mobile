<template>
  <header>
    <div class="search-return">
      <i class="iconfont icon-fanhui" @click="goBack"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <input type="text" placeholder="搜索您喜欢的产品" v-model="searchValue" />
      </form>
    </div>
    <div class="search-btn" @click="goSearchList">搜索</div>
  </header>
</template>

<script>
export default {
  name: 'searchHeader',
  components: {},
  props: {},
  data() {
    return {
      searchValue: '',
      searchArray: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //路由回到主页
    goBack() {
      this.$router.push('/home')
    },

    goSearchList() {
      //如果搜索框内容为空,不做处理
      if (!this.searchValue.trim()) return

      //往本地存储添加数据
      this.searchArray.unshift(this.searchValue)
      //数组去重
      let newArr = Array.from(new Set(this.searchArray))
      //给本地存储赋值
      localStorage.setItem('searchList', newArr)

      //需要给路由添加query和拒绝当前搜索框相同内容执行二次搜索，否则在当前路径下再请求相同链接会报错
      if (this.searchValue === this.$route.query.key) return
      this.$router.push({
        name: 'searchlist',
        query: {
          key: this.searchValue,
        },
      })
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
  height: 1.6rem;
  background-color: #b0352f;
  .search-return {
    padding: 0 0.26rem;
    color: #fff;
    i {
      font-size: 0.7467rem;
    }
  }

  .search-main {
    display: flex;
    align-items: center;
    width: 6.93rem;
    height: 0.8rem;
    border-radius: 0.32rem;
    background-color: #fff;
    i {
      padding: 0 0.26rem;
      color: #666;
    }
    form {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .search-btn {
    padding: 0 0.26rem;
    font-size: 0.4267rem;
    color: #fff;
  }
}
</style>
