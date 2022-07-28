<template>
  <div class="search-list">
    <div class="headers">
      <ul>
        <li v-for="(item, index) in searchList.data" :key="index">
          <div :class="isActive(index)" @click="changeTab(index)">
            {{ item.name }}
          </div>
          <div class="search-filter" v-if="index != 0">
            <i class="iconfont icon-arrow_up_fat" :class="item.status == 1 ? 'active' : ''"></i>
            <i class="iconfont icon-arrow_down_fat" :class="item.status == 2 ? 'active' : ''"></i>
          </div>
        </li>
      </ul>
    </div>
    <section class="section">
      <ul v-if="searchData">
        <li
          v-for="(item, index) in searchData"
          :key="index"
          @click="
            $router.push({
              path: '/detail',
              query: {
                id: item.id,
              },
            })
          "
        >
          <img v-lazy="item.imgUrl" alt="" />
          <h3>{{ item.name }}</h3>
          <div class="price">
            <div>
              <span>￥</span>
              <b>{{ item.price }}</b>
            </div>
            <div>立即购买</div>
          </div>
        </li>
      </ul>
      <h6 v-else>
        <!-- 搜索提示 -->
        <van-empty image="search" description="暂无该商品数据" />
      </h6>
    </section>
  </div>
</template>

<script>
//引入二次封装的axios
import http from '@/common/api/request'

export default {
  name: 'searchList',
  components: {},
  props: {},
  data() {
    return {
      searchData: [],
      //按标签内容对搜索的结果进行排序
      searchList: {
        currentIndex: 0,
        data: [
          /*
            status:0 都不亮
            status:1 上箭头亮
            status:0 下箭头亮
          */
          { name: '综合', key: 'allquery' },
          { name: '价格', status: 0, key: 'price' },
          { name: '销量', status: 0, key: 'num' },
        ],
      },
    }
  },
  computed: {
    orderBy() {
      //当前对象
      const obj = this.searchList.data[this.searchList.currentIndex]
      //判断当前状态是执行升序还是降序
      const val = obj.status === 1 ? 'asc' : 'desc'
      return {
        [obj.key]: val,
      }
    },
  },
  watch: {
    //监听当前路由地址发生变化时,再次请求数据
    $route() {
      this.getData()
    },
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    async getData() {
      http
        .$axios({
          url: '/api/goods/shopList',
          params: {
            /* 
              searchName:搜索的关键字
              ...this.orderBy：执行升序还是降序
            */
            searchName: this.$route.query.key,
            ...this.orderBy,
          },
        })
        .then((res) => {
          this.searchData = res
          //如果没有数据,则展示无数据页面
          try {
            if (!this.searchData.length) {
              this.searchData = false
            }
          } catch (error) {}
        })
    },

    //按照当前currentIndex值决定哪个排序标签高亮
    isActive(index) {
      return this.searchList.currentIndex === index ? 'active' : ''
    },

    //
    changeTab(index) {
      this.searchList.currentIndex = index

      //点击的下标对应数据的哪一个
      let item = this.searchList.data[index]
      //在改变状态之前,将其他状态都恢复默认样式
      this.searchList.data.forEach((value, newIndex) => {
        if (newIndex != index) {
          value.status = 0
        }
      })
      //当前点击的排序箭头元素相互改变状态
      if (index === this.searchList.currentIndex) {
        item.status = item.status == 1 ? 2 : 1
      }
      //请求数据
      this.getData()
    },
  },
}
</script>

<style scoped lang="scss">
.headers {
  ul {
    display: flex;
    justify-content: space-around;
    padding: 0.22rem 0;
    font-size: 0.426rem;
    li {
      display: flex;
      align-items: center;
      .search-filter {
        display: flex;
        flex-direction: column;
        padding: 0 0.08rem;
        i {
          font-size: 0.32rem;
        }
      }
    }
  }
}

.section {
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 42%;
      padding: 0 10px;
      img {
        width: 4.5333rem;
        height: 4.5333rem;
      }
      h3 {
        width: 100%;
        font-size: 0.3733rem;
        color: #222;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .price {
        display: flex;
        justify-content: space-between;
        padding: 0.266rem 0;
        width: 100%;
        font-size: 14px;
        color: #b0352f;
        div:last-child {
          color: #fff;
          background-color: #b0352f;
          padding: 3px 6px;
          border-radius: 6px;
        }
      }
    }
  }
}

/* */
.active {
  color: #b0352f;
}
</style>
