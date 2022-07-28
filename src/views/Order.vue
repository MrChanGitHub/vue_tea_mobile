<template>
  <div class="order container">
    <header>
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <slot><span>提交订单</span></slot>
      <i class="iconfont icon-kefu"></i>
    </header>
    <section class="wrapper">
      <div>
        <div class="path">
          <h1 class="path-title">收货信息</h1>
          <div class="path-content" @click="goPath">
            <div>
              <span>{{ path.name }}</span>
              <span>{{ path.tel }}</span>
            </div>
            <div class="hidden">
              <span>{{ path.province }}</span>
              <span>{{ path.city }}</span>
              <span>{{ path.county }}</span>
              <span>{{ path.addressDetail }}</span>
            </div>
          </div>
        </div>
        <div class="pay">
          <div class="path-title">支付方式</div>
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell title="微信支付" clickable @click="radio = 'WeChatPay'">
                <template #right-icon>
                  <van-radio name="WeChatPay" />
                </template>
              </van-cell>
              <van-cell title="支付宝" clickable @click="radio = 'aliPay'">
                <template #right-icon>
                  <van-radio name="aliPay" />
                </template>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <van-swipe-cell v-for="item in cartgoods" :key="item.id">
          <van-card
            :num="item.goods_num"
            :price="item.goods_price"
            :desc="item.goods_content"
            :title="item.goods_name"
            :thumb="item.goods_imgUrl"
          />
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" />
          </template>
        </van-swipe-cell>
        <van-field
          v-model="message"
          rows="1"
          autosize
          type="textarea"
          placeholder="给商家留言....."
        />
        <!-- 优惠券单元格 -->
        <van-coupon-cell
          :coupons="coupons"
          :chosen-coupon="chosenCoupon"
          @click="showList = true"
        />
        <!-- 优惠券列表 -->
        <van-popup v-model="showList" round position="bottom">
          <van-coupon-list
            :coupons="coupons"
            :chosen-coupon="chosenCoupon"
            :disabled-coupons="disabledCoupons"
            @change="onChange"
            @exchange="onExchange"
          />
        </van-popup>
        <h1 class="path-title">账单明细</h1>
        <div class="bill-content">
          <div class="bill-left">
            <ul>
              <li>订单总价</li>
              <li>运费：</li>
              <li>优惠券：</li>
              <li>实付款：</li>
            </ul>
          </div>
          <div class="bill-right">
            <ul>
              <li>￥88.00</li>
              <li>￥5</li>
              <li>-￥0.00</li>
              <li>￥93.00</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div></div>
      <div class="total">
        <span>共</span>
        <span class="total-active">{{ getTotalNum }}</span>
        <span>件,</span>
        <span>总金额：</span>
        <span class="total-active fsize">￥{{ getTotalPrice }}</span>
      </div>
      <div class="order" @click="addOrder">提交订单</div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import http from '@/common/api/request.js'
//引入滚动插件
import BetterScroll from 'better-scroll'
import { Toast } from 'vant'
//引入qs
import qs from 'qs'

//优惠券配置数据

const coupon = [
  {
    available: 1,
    condition: '无使用门槛\n最多优惠12元',
    reason: '',
    value: 150,
    name: '优惠券名称',
    startAt: 1489104000,
    endAt: 1514592000,
    valueDesc: '1.5',
    unitDesc: '元',
  },
  {
    available: 1,
    condition: '无使用门槛\n最多优惠12元',
    reason: '',
    value: 880,
    name: '优惠券名称',
    startAt: 1489104000,
    endAt: 1514592000,
    valueDesc: '8.8',
    unitDesc: '元',
  },
]
export default {
  name: 'Order',
  components: {},
  props: {},
  data() {
    return {
      //支付方式的值
      radio: '',
      //当前地址
      path: {},
      //购物车商品
      cartgoods: [],
      //总价
      totalPrice: '',
      //总件
      totalNum: '',
      //商家留言
      message: '',

      //优惠券
      showList: false,
      chosenCoupon: -1,
      coupons: coupon,
      disabledCoupons: coupon,
    }
  },
  computed: {
    //计算总价
    getTotalPrice() {
      let sum = 0
      this.cartgoods.forEach((v) => {
        sum += Number.parseFloat(v.goods_price) * v.goods_num
      })
      this.initPrice(sum)
      this.totalPrice = sessionStorage.getItem('totalPrice')
      return this.totalPrice
    },

    //计算总数
    getTotalNum() {
      let num = 0
      this.cartgoods.forEach((v) => {
        num += Number.parseInt(v.goods_num)
      })
      this.initNum(num)
      this.totalNum = sessionStorage.getItem('totalNum')
      return this.totalNum
    },

    //用户地址数据
    ...mapState({
      addressList: (state) => state.address.addressList,
    }),

    //用户购物车数据
    ...mapState({
      goods: (state) => state.cart.goods,
    }),

    //用户默认的地址
    ...mapGetters(['defaultPath']),
  },
  watch: {},
  created() {
    this.getData()
    this.cartgoods = JSON.parse(sessionStorage.getItem('cartgoods'))
  },
  activated() {
    //每次激活组件,隐藏优惠券界面
    this.showList = false
    this.getData()
    this.cartgoods = JSON.parse(sessionStorage.getItem('cartgoods'))
    //如果从地址页接收到地址数据,则将当前地址更改为传递的地址数据
    if (this.$route.params.path) {
      this.path = this.$route.params.path
    }
  },
  deactivated() {},
  mounted() {},
  methods: {
    ...mapMutations(['initData', 'initNum', 'initPrice']),
    //请求地址数据
    getData() {
      http
        .$axios({
          url: '/api/selectAddress',
          method: 'post',
          headers: {
            token: true,
          },
        })
        .then((res) => {
          //为状态管理的地址数据赋值
          this.initData(res.data)
          //如果从地址页接收到地址数据,则将当前地址更改为传递的地址数据
          if (this.$route.params.path) {
            this.path = this.$route.params.path
          } else {
            //如果存在默认地址,则显示默认地址,如果没有则显示查询到的第一个地址
            if (this.defaultPath.length) {
              this.path = this.defaultPath[0]
            } else {
              this.path = res.data[0]
            }
          }
        })
      this.$nextTick(() => {
        new BetterScroll('.wrapper', {
          zoom: true,
          click: true,
          bounce: false,
        })
      })
    },

    //选择收获地址
    goPath() {
      this.$router
        .push({
          path: '/path',
          query: {
            type: 'select',
          },
        })
        .catch((err) => {})
    },

    //提交订单
    addOrder() {
      //检查是否选择了支付方式
      if (!this.radio) {
        Toast('请选择支付方式')
        return
      }
      //检查是否选择了地址
      if (!this.path) {
        Toast('请选择收获地址')
        return
      }
      //配置生成订单传递的参数,然后通过qs序列化,提高数据安全性
      const orderData = {
        //商品数据
        goods: this.cartgoods,
        //地址数据
        path: this.path,
        //其他数据(支付方式,总件数,总金额)
        payment: this.radio,
        totalprice: this.getTotalPrice,
        totalnum: this.getTotalNum,
      }
      http
        .$axios({
          url: '/api/addOrder',
          method: 'post',
          headers: {
            token: true,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify(orderData),
        })
        .then((res) => {
          //判断token是否超时
          if (res.isTokenOut) {
            Toast({
              message: res.msg,
              position: 'bottom',
              duration: 3000,
              className: 'toasts',
            })
            this.$router.push('/login')
            return
          }
          window.location.href = res.paymentUrl
        })
    },

    //优惠券事件
    onChange(index) {
      this.showList = false
      this.chosenCoupon = index
    },
    onExchange(code) {
      this.coupons.push(coupon)
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
section {
  background-color: #f7f7f7;
  .path-title {
    padding: 0.28rem;
    font-size: 0.4rem;
    font-weight: 450;
    color: gray;
  }
  .path-content {
    padding: 0.35rem 0.28rem;
    font-size: 0.373rem;
    background-color: #fff;
    div {
      padding-top: 0.2rem;
    }
    span {
      padding-right: 0.16rem;
    }
    //省略超出部分
    .hidden {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .van-card {
    border-bottom: 1px solid rgb(219, 219, 219);
  }
  .van-card__desc {
    color: #959697;
  }
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-top: 1.9875px solid #ccc;
  .total {
    font-size: 14px;
  }
  .total-active {
    color: #b0352f;
  }
  .fsize {
    font-size: 17px;
  }
  .order {
    width: 120px;
    line-height: 48px;
    color: #fff;
    text-align: center;
    font-size: 15.975px;
    background-color: #b0352f;
  }
}
.delete-button {
  height: 100%;
}

.van-field,
.van-coupon-cell {
  margin: 10px 0;
}

.bill-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.28rem;
  font-size: 0.373rem;
  background-color: #fff;
  div {
    padding-top: 0.2rem;
  }
  span {
    padding-right: 0.16rem;
  }
  ul {
    li {
      padding: 5px;
    }
  }
  .bill-left {
    color: gray;
    text-align: left;
  }
  .bill-right {
    text-align: right;
    & li:last-child {
      font-weight: 600;
      color: #b0352f;
    }
  }
}
</style>
