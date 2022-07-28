<template>
  <div class="list">
    <header>
      <div class="returns">
        <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      </div>
      <div class="search" @click="$router.push('/search')">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜你喜欢的.....</span>
      </div>
      <div class="go-home"></div>
    </header>
    <section>
      <div class="list-left" ref="left">
        <ul class="item-left">
          <li
            v-for="(item, index) in leftData"
            :key="item.id"
            :class="{ active: index == currentIndex }"
            @click="goScroll(index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="list-right" ref="right">
        <div>
          <img src="/images/zishahu.jpeg" alt="" />
          <ul class="list-li" v-for="(item, index) in rightData" :key="index">
            <li v-for="(item2, index2) in item" :key="index2">
              <h2>—— {{ item2.name }} ——</h2>
              <ul class="list-content">
                <li
                  v-for="(item3, index3) in item2.list"
                  :key="index3"
                  @click="
                    $router.push({
                      name: 'searchlist',
                      query: {
                        key: item3.name,
                      },
                    })
                  "
                >
                  <img :src="item3.imgUrl" alt="" />
                  <span>{{ item3.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import http from '@/common/api/request.js'
import BetterScroll from 'better-scroll'
export default {
  name: 'List',
  components: { Tabbar },
  props: {},
  data() {
    return {
      //左侧数据
      leftData: [],
      //右侧数据
      rightData: [],
      //右侧数据滚动
      rightBScroll: '',
      //保存每个菜单项的高度进行定位
      allHeight: [],
      //右侧滚动数据
      scrollY: '',
    }
  },
  computed: {
    currentIndex() {
      return this.allHeight.findIndex((item, index) => {
        return this.scrollY >= item && this.scrollY < this.allHeight[index + 1]
      })
    },
  },
  watch: {},
  async created() {
    const res = await http.$axios({
      url: '/api/goods/catelist',
    })
    const leftArr = []
    const rightArr = []
    res.forEach((item) => {
      leftArr.push({
        id: item.id,
        name: item.name,
      })
      rightArr.push(item.data)
    })
    this.leftData = leftArr
    this.rightData = rightArr
    this.$nextTick(() => {
      //左侧滑动
      new BetterScroll(this.$refs.left, {
        click: true, //滚动插件默认关闭点击事件(不生效),根据业务需要开启
      })
      //右侧滑动
      this.rightBScroll = new BetterScroll(this.$refs.right, {
        click: true,
        probeType: 3,
      })

      //统计右侧所有板块的高度值,并保存到数组中
      let height = 138.39
      this.allHeight.push(height)
      let rightUlData = this.$refs.right.getElementsByClassName('list-li')
      //将dom对象转换成数组调用forEach方法,并遍历添加到当前数组中
      Array.from(rightUlData).forEach((v) => {
        height += v.clientHeight
        this.allHeight.push(height)
      })
      //得到右侧滚动的值,同步给左侧导航栏添加active样式
      this.rightBScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(pos.y)
      })
    })
  },
  mounted() {},
  methods: {
    goScroll(index) {
      //BetterScroll插件滚动到指定位置
      this.rightBScroll.scrollTo(0, -this.allHeight[index])
    },
  },
}
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.733rem;
    background-color: #b0352f;
    .returns {
      line-height: 1.733rem;
      padding: 0 0.533rem;
      i {
        color: #fff;
        font-size: 0.6933rem;
      }
    }
    .search {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 0.16rem 0.266rem;
      background-color: #fff;
      border-radius: 0.64rem;
      i {
        padding-right: 0.16rem;
        color: #666;
        font-size: 0.48rem;
      }
      span {
        color: #666;
        font-size: 0.373rem;
      }
    }
    .go-home {
      padding: 0 0.266rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
  }
  section {
    display: flex;
    flex: 1;
    overflow: hidden;
    .list-left {
      width: 2.48rem;
      background-color: #fff;
      border-right: 1px solid #ccc;
      overflow: hidden;
      .item-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        li {
          width: 100%;
          line-height: 1.3333rem;
          text-align: center;
          font-size: 0.373rem;
          &.active {
            color: #b54f4a;
            border-left: 2px solid #b54f4a;
          }
        }
      }
    }
    .list-right {
      flex: 1;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .list-li {
        text-align: center;
        h2 {
          padding: 0.533rem 0px;
          font-size: 0.45rem;
          font-weight: 400;
        }
        .list-content {
          display: flex;
          flex-wrap: wrap;
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 33.3%;
            padding: 0.266rem 0;
            img {
              width: 1.413rem;
              height: 1.413rem;
            }
            span {
              font-size: 0.35rem;
            }
          }
        }
      }
    }
  }
}
::v-deep.tabbar {
  border-top: 1px solid #ccc;
}
</style>
