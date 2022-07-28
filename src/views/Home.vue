<template>
  <div class="home">
    <div class="headers">
      <div class="headers-main">
        <Header></Header>
        <ly-tabs v-model="value" :activeColor="activeColor" @change="changeTab">
          <ly-tab-item v-for="(item, index) in topBar" :key="index" :name="item.id" :title="item.label" />
        </ly-tabs>
      </div>
    </div>

    <section class="wrapper">
      <div>
        <div v-for="(item, index) in otherData" :key="index">
          <Swiper v-if="item.type === 'swiperList'" :swiperList="item.data"></Swiper>
          <Icons v-if="item.type === 'iconsList'" :iconsList="item.data"></Icons>
          <Recommemd v-if="item.type === 'recommendList'" :recommendList="item.data"> </Recommemd>
          <Like v-if="item.type === 'likeList'" :likeList="item.data"></Like>
          <AdvertiseMent v-if="item.type === 'AdvertiMent'" :AdvertiMent="item.data"></AdvertiseMent>
          <AdvertiseMent v-else-if="item.type === '铁观音'" :AdvertiMent="item.data"></AdvertiseMent>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/components/home/Header.vue'
import Swiper from '@/components/home/Swiper.vue'
import Icons from '@/components/home/Icons.vue'
import Recommemd from '@/components/home/Recommend.vue'
import AdvertiseMent from '@/components/home/AdvertiseMent.vue'
import Like from '@/components/home/Like.vue'
import { LyTabs, LyTabBar, LyTabItem } from 'ly-tab'
//引入滚动插件
import BetterScroll from 'better-scroll'

//引入mint-ui组件
import { Indicator } from 'mint-ui'

import axios from 'axios'

//引入二次封装的axios
import http from '@/common/api/request'

export default {
  name: 'Home',
  components: {
    Tabbar,
    Header,
    Swiper,
    Icons,
    Recommemd,
    Like,
    AdvertiseMent,
    Indicator,
    LyTabs,
    LyTabBar,
    LyTabItem,
  },
  props: {},
  data() {
    return {
      //topBar数据列表
      topBar: [],
      //首页(topBar外)其余的数据列表
      otherData: [],

      //激活状态下 tab 文案及下划线的颜色
      activeColor: '#b0352f',
      //当前激活的 tab 的 name 属性值
      value: 0,
    }
  },
  computed: {},
  watch: {},
  created() {
    //接口请求
    this.getTopbar()
    //元素挂载之后调用滚动插件配置
    this.getData(0)
  },
  mounted() {},
  methods: {
    //切换激活 tab 项的回调
    changeTab(index) {
      this.getData(index)
    },

    //请求首页推荐数据
    async getData(index) {
      //调用二次封装的axios
      const res = await http.$axios({
        url: `/api/index_list/${index}/data/1`,
      })
      this.otherData = res
      this.$nextTick(() => {
        new BetterScroll('.wrapper', {
          movable: true,
          zoom: true,
          click: true,
          bounce: false,
        })
      })
    },

    //请求Topbar数据
    async getTopbar() {
      const { data: res } = await axios({ url: '/api/index_list/0/topBar' })
      this.topBar = res.data
    },
  },
}
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.headers {
  width: 100%;
  height: 2.88rem;
}
.headers-main {
  width: 100%;
  position: fixed;
  left: 0rem;
  top: 0rem;
}
section {
  flex: 1;
  overflow: hidden;
}
</style>
