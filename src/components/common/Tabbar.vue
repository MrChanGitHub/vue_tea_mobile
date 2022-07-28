<template>
  <div class="tabbar">
    <ul>
      <li v-for="(item, index) in routerList" :key="index" @click="switchTab(item.path)">
        <img
          :src="$route.path.includes(item.path) ? item.selected : item.active"
          alt=""
          width="28px"
          height="28px"
        />
        <span :class="$route.path.includes(item.path) ? 'active' : ''">{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      routerList: [
        {
          title: '首页',
          path: '/home',
          active: '/images/home.png',
          selected: '/images/home-select.png',
        },
        {
          title: '分类',
          path: '/list',
          active: '/images/list.png',
          selected: '/images/list-select.png',
        },
        {
          title: '购物车',
          path: '/cart',
          active: '/images/cart.png',
          selected: '/images/cart-select.png',
        },
        {
          title: '我的',
          path: '/my',
          active: '/images/my.png',
          selected: '/images/my-select.png',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    switchTab(path) {
      //拒绝重复跳转当前页面
      if (this.$route.path === path) return
      this.$router.replace(path)
    },
  },
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 1.4rem;
  background-color: #fff;
  ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 100px;
    li {
      display: flex;
      line-height: 20px;
      flex-direction: column;
      align-items: center;
      img {
        width: 31.0012px;
        height: 31.0012px;
      }
      span {
        font-size: 0.2667rem;
      }
    }
  }
}
.active {
  color: red;
}
</style>
