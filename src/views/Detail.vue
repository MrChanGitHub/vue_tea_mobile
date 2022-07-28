<template>
  <div class="detail">
    <header>
      <div class="header-returns" v-show="isShow">
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <i class="iconfont icon-kefu"></i>
      </div>
      <div class="header-bar" v-show="!isShow" :style="styleOption">
        <div>
          <i class="iconfont icon-fanhui" @click="goBack"></i>
        </div>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class="iconfont icon-kefu"></i>
        </div>
      </div>
    </header>
    <section ref="wrapper">
      <div>
        <div class="swiper-main">
          <!-- 轮播图插件 -->
          <swiper :options="swiperOption">
            <swiper-slide v-for="(item, index) in swiperList" :key="item.id">
              <img :src="item.imgUrl" alt="" />
            </swiper-slide>
          </swiper>
          <!-- 圆点切换 -->
          <div class="swiper-pagination"></div>
        </div>
        <div class="goods-name">
          <h1>{{ goods.name }}</h1>
          <div>{{ goods.content }}</div>
        </div>
        <div class="goods-price">
          <div class="oprice">
            <span>￥</span>
            <b>{{ goods.price }}</b>
            <span class="num"> / 100g</span>
          </div>
          <div class="cprice">
            <span>价格:</span>
            <del>￥{{ Number.parseFloat(goods.price) + 20.0 }}</del>
          </div>
        </div>

        <div class="goods-detail">
          <h6>商品详情</h6>
          <img :src="goods.imgUrl" alt="" width="100%" />
          <img :src="goods.imgUrl" alt="" width="100%" />
          <img :src="goods.imgUrl" alt="" width="100%" />
          <img :src="goods.imgUrl" alt="" width="100%" />
          <img :src="goods.imgUrl" alt="" width="100%" />
        </div>
      </div>
    </section>

    <footer>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" dot />
        <van-goods-action-icon icon="cart-o" text="购物车" dot />
        <van-goods-action-icon icon="shop-o" text="店铺" dot />
        <van-goods-action-button type="warning" text="加入购物车" @click="addCart" />
        <van-goods-action-button type="danger" text="立即购买" />
      </van-goods-action>
    </footer>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Toast } from 'mint-ui'

//引入滚动插件
import BetterScroll from 'better-scroll'

//引入二次封装的axios
import http from '@/common/api/request.js'

export default {
  name: 'Detail',
  components: { swiper, swiperSlide },
  props: {},
  data() {
    return {
      //轮播图配置项
      swiperOption: {
        autoplay: 3000,
        speed: 1000,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
      },

      //轮播图死数据
      swiperList: [
        { imgUrl: './images/goods1.png' },
        { imgUrl: './images/goods2.png' },
        { imgUrl: './images/goods3.png' },
        { imgUrl: './images/goods4.png' },
      ],

      //控制头部区域的显示与隐藏
      isShow: true,

      //滚动数据
      BetterScroll: '',

      //头部区域显示与隐藏的过渡效果
      styleOption: {},

      //查询到的当前商品数据
      goods: {},

      id: 0,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  activated() {
    //提高性能
    //缓存组件,判断当前查询的商品id是否与上一个id相同,相同则使用缓存展示，否则重新发起请求
    if (this.$route.query.id != this.id) {
      this.getData()
      this.id = this.$route.query.id
    }
  },
  methods: {
    //根据商品id请求数据
    async getData() {
      const id = this.$route.query.id
      const res = await http.$axios({
        url: '/api/goods/id',
        params: {
          id,
        },
      })
      this.goods = res
      this.$nextTick(() => {
        this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
          click: true,
          probeType: 3,
          bounce: false,
        })
        this.BetterScroll.on('scroll', (pos) => {
          let posY = Math.abs(pos.y)
          //显示与隐藏的过渡效果
          let opacity = posY / 180
          opacity = opacity > 1 ? 1 : opacity
          this.styleOption = {
            opacity: opacity,
          }

          //显示与隐藏
          if (posY >= 100) {
            this.isShow = false
          } else {
            this.isShow = true
          }
        })
      })
    },

    //返回上一页
    goBack() {
      this.$router.back()
    },

    //添加购物车
    addCart() {
      let id = this.$route.query.id
      http
        .$axios({
          url: '/api/addCart',
          method: 'POST',
          data: {
            goodsId: id,
          },
          headers: {
            token: true,
          },
        })
        .then((res) => {
          //判断token是否超时
          if (res.isTokenOut) {
            this.$router.push('/login')
            Toast({
              message: res.msg,
              position: 'bottom',
              duration: 3000,
              className: 'toasts',
            })
            return
          }
          if (res.success) {
            Toast({
              message: '已添加到购物车',
              position: 'bottom',
              duration: 3000,
              className: 'toasts',
            })
          }
        })
    },
  },
}
</script>

<style scoped lang="scss">
header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 1.173rem;
  .header-returns {
    width: 100%;
    height: 0.88rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      margin-top: 10px;
      margin-left: 8px;
      margin-right: 8px;
      padding: 4px;
      color: #fff;
      background-color: rgb(0, 0, 0, 0.3);
      border-radius: 50%;
      font-size: 23px;
    }
  }
  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 0.88rem;
    font-size: 0.426rem;
    background-color: #fff;
    span {
      padding: 0 0.266rem;
    }
    i {
      padding: 0 0.26rem;
      font-size: 0.586rem;
    }
  }
}
.swiper-main {
  position: relative;
  width: 100%;
  height: 10rem;

  img {
    width: 100%;
    height: 10rem;
    border-bottom: 1px solid rgb(231, 231, 231);
  }
  /* 圆点切换 */
  .swiper-pagination {
    text-align: right;
    font-size: 15px;
    span {
      margin: 0;
      padding: 0;
    }
  }
}
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
section {
  flex: 1;
  overflow: hidden;
  .goods-name {
    padding: 0.53rem 0.266rem;
    border-bottom: 1px solid rgb(240, 240, 240);
    h1 {
      font-size: 0.533rem;
      font-weight: 500;
    }
    div {
      padding: 0.08rem 0;
      font-size: 0.273rem;
      color: #999;
    }
  }
  .goods-price {
    padding: 0rem 0.266rem;

    .oprice {
      color: #d22531;
      .num {
        font-size: 0.35rem;
        color: #999;
      }
    }
    .cprice {
      font-size: 0.35rem;
      color: #999;
    }
  }
  .goods-detail {
    h6 {
      margin: 0.6rem 0.266rem 0rem;
      padding-left: 10px;
      font-size: 18px;
      font-weight: 600;
      border-left: 3px solid #b0352f;
    }
  }
}
</style>
