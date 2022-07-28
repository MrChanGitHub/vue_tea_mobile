<template>
  <div class="search-index">
    <div class="search-history">
      <h2>
        <i class="iconfont icon-shijian"></i>
        <span>历史搜索</span>
        <span @click="clearSearch">清空历史记录</span>
      </h2>
      <ul v-if="searchArr.length > 0">
        <li v-for="(item, index) in searchArr" :key="index" @click="goSearchList(item)">
          {{ item }}
        </li>
      </ul>
      <ul v-else>
        <li style="border: 0px; color: gray">暂无搜索数据</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
export default {
  name: 'searchIndex',
  components: {},
  props: {},
  data() {
    return {
      searchArr: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getSearch()
  },

  mounted() {},
  methods: {
    getSearch() {
      let s = localStorage.getItem('searchList')
      if (s) {
        this.searchArr = s.split(',')
      }
    },

    async clearSearch() {
      const meg = await MessageBox({
        title: '提示',
        message: '确定删除搜索历史?',
        showCancelButton: true,
      })
      if (meg === 'confirm') {
        //删除本地存储
        localStorage.removeItem('searchList')
        //删除数据
        this.searchArr = []
      }
    },

    //点击历史搜索关键字进行查询
    goSearchList(item) {
      this.$router.push({
        name: 'searchlist',
        query: {
          key: item,
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.search-history {
  h2 {
    position: relative;
    padding: 0.433rem;
    font-weight: 550;
    font-size: 0.48rem;
    i {
      color: red;
    }
    span:last-child {
      position: absolute;
      right: 0.2667rem;
    }
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.266rem;
    li {
      margin: 0 3px;
      padding: 0.08rem 0.16rem;
      font-size: 0.373rem;
      color: gray;
    }
  }
}
</style>
