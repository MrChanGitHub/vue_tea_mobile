<template>
  <div class="cart container">
    <header>
      <i class="iconfont icon-fanhui" @click="goBack"></i>
      <span>购物车</span>
      <span @click="edit" v-show="!isNavStatus">编辑</span>
      <span @click="finish" v-show="isNavStatus">完成</span>
    </header>
    <section class="wrapper" v-if="cartData.length > 0">
      <div>
        <ul>
          <li v-for="(item, index) in cartData" :key="item.id">
            <div>
              <van-checkbox v-model="item.checked" @change="isAllChecked"></van-checkbox>
            </div>
            <h2><img :src="item.goods_imgUrl" alt="" /></h2>
            <div class="cart-goods">
              <div class="goods-title">
                <span>{{ item.goods_name }}</span>
                <i class="iconfont icon-kefu" @click="delGoodsItem(item.id)"></i>
              </div>
              <div class="goods-price">￥{{ item.goods_price }}</div>
              <van-stepper v-model="item.goods_num" integer @change="changeNum($event, item.id)" />
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section v-else>
      <van-empty description="你的购物车暂无商品">
        <van-button round class="bottom-button" @click="$router.push('/home')"
          >去首页逛逛</van-button
        >
      </van-empty>
    </section>
    <footer v-show="cartData.length > 0">
      <div class="radio">
        <van-checkbox v-model="checkAll" @click="checkedAll"></van-checkbox>
      </div>
      <div class="total" v-show="!isNavStatus">
        <div>
          共有<span class="total-active">{{ getTotalNum }}</span
          >件商品
        </div>
        <div>
          <span>总计:</span><span class="total-active">￥{{ getTotalPrice }}</span>
        </div>
      </div>
      <div class="total" v-show="isNavStatus">
        <div>
          选择了<span class="total-active">{{ getTotalNum }}</span
          >件商品
        </div>
      </div>
      <div class="order" v-show="!isNavStatus" @click="goOrder">去结算</div>
      <div class="order" v-show="isNavStatus" @click="delGoods">删除</div>
    </footer>
  </div>
</template>

<script>
import http from '@/common/api/request.js'
//引入滚动插件
import BetterScroll from 'better-scroll'
import { Dialog } from 'vant'
import { Toast } from 'mint-ui'
import { mapMutations } from 'vuex'

export default {
  name: 'Cart',
  components: {},
  props: {},
  data() {
    return {
      checkAll: true,
      cartData: [],
      //编辑|完成切换状态
      isNavStatus: false,
    }
  },
  computed: {
    //计算总价
    getTotalPrice() {
      let sum = 0
      this.cartData.forEach((v) => {
        if (v.checked) {
          sum += Number.parseFloat(v.goods_price) * v.goods_num
        }
      })
      return sum
    },

    //计算商品总数
    getTotalNum() {
      let num = 0
      this.cartData.forEach((v) => {
        if (v.checked) {
          num += Number.parseInt(v.goods_num)
        }
      })
      return num
    },
  },
  watch: {},
  created() {},
  activated() {
    this.getData()
  },
  mounted() {},
  methods: {
    //发起请求获取购物车数据
    async getData() {
      const res = await http.$axios({
        url: '/api/selectCart',
        method: 'POST',
        headers: {
          token: true,
        },
      })

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

      if (res.success) {
        //为每一个数据对象添加一个checked为true的数据,用于全选和单选
        res.data.forEach((v) => {
          v['checked'] = true
        })
        this.cartData = res.data
      }
      this.$nextTick(() => {
        new BetterScroll('.wrapper', {
          click: true,
          zoom: true,
          bounce: false,
        })
      })
    },

    goBack() {
      this.$router.back()
    },

    //全选和全不选
    checkedAll() {
      if (!this.checkAll) {
        this.cartData.forEach((v) => {
          v.checked = false
        })
      } else {
        this.cartData.forEach((v) => {
          v.checked = true
        })
      }
    },

    //检查所有的复选框选中状态来判断全选复选框是否打勾
    isAllChecked() {
      let status = true
      this.cartData.forEach((v) => {
        if (!v.checked) {
          status = false
          return
        }
      })
      this.checkAll = status
    },

    //点击编辑
    edit() {
      //切换到完成
      this.isNavStatus = true
      //将所有复选框改变为未选中状态
      this.cartData.forEach((v) => {
        v.checked = false
      })
    },

    //点击完成
    /* 如果需要恢复到之前的选中/未选状态,可以临时存储起来,这里就不处理了，需要再解决*/
    finish() {
      //切换到编辑
      this.isNavStatus = false
      //将所有复选框改变为已选中状态
      this.cartData.forEach((v) => {
        v.checked = true
      })
    },

    //改变商品数量
    changeNum(num, id) {
      /*
        @params
        value:当前数量
        id:商品id
      */
      //获取当前商品的id以及商品数量发起网络请求
      http.$axios({
        url: '/api/updateNum',
        method: 'POST',
        headers: {
          token: true,
        },
        data: {
          id,
          num,
        },
      })
    },

    //删除多个商品
    delGoods() {
      //定义临时存储的数组
      const temp = []
      //如果当前无选择的商品则提示'请选择商品'
      this.cartData.forEach((v) => {
        if (v.checked) {
          temp.push(v.id)
        }
      })
      if (!temp.length) {
        Toast({
          message: '请选择需要删除的商品',
          position: 'bottom',
          duration: 3000,
          className: 'toasts',
        })
        return
      }
      Dialog.confirm({
        title: '提示',
        message: '确认删除?',
      }).then((res) => {
        if (res === 'confirm') {
          //发送请求删除商品
          http
            .$axios({
              url: '/api/delete/id',
              method: 'DELETE',
              data: {
                id: temp,
              },
            })
            .then((res) => {
              if (res.success) {
                this.getData()
                Toast({
                  message: '删除成功',
                  position: 'bottom',
                  duration: 3000,
                  className: 'toasts',
                })
                this.isNavStatus = false
              }
            })
        }
      })
    },

    //删除单个商品
    delGoodsItem(id) {
      const temp = [id]
      //弹框询问是否确认删除
      Dialog.confirm({
        title: '提示',
        message: '确认删除该商品?',
      }).then((res) => {
        if (res === 'confirm') {
          //发送请求删除商品
          http.$axios({
            url: '/api/delete/id',
            method: 'DELETE',
            data: {
              id: temp,
            },
          })
          Toast({
            message: '删除成功',
            position: 'bottom',
            duration: 3000,
            className: 'toasts',
          })
        }
        this.getData()
      })
    },

    //跳转订单页
    goOrder() {
      let status = false
      let goods = []
      //判断是否有选中任意商品,并将其存储起来传递
      this.cartData.forEach((v) => {
        if (v.checked) {
          goods.push(v)
          status = true
        }
      })
      if (!status) {
        Toast('请至少选择一件商品')
        return
      }
      //将商品存储Vuex中
      this.initGoods(goods)
      this.$router.push({
        name: 'Order',
      })
    },

    ...mapMutations(['initGoods']),
  },
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background-color: #b0352f;
  color: #fff;
  i {
    padding: 0 15px;
    font-size: 21.975px;
  }
  span {
    padding: 0 15px;
    font-size: 15.975px;
  }
}
section {
  background-color: #f5f5f5;
  .cart-title {
    display: flex;
    padding: 19.9875px;
    span {
      padding: 0 15px;
      font-weight: 500;
      font-size: 18px;
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 19.9875px;
      margin: 0.0533rem 0;
      background-color: #fff;
      .cart-goods {
        display: flex;
        flex-direction: column;
        padding-left: 0.4rem;
        font-size: 0.32rem;
        width: 100%;
        .goods-title {
          display: flex;
          justify-content: space-between;
          i {
            font-size: 0.5867rem;
          }
        }
        .goods-price {
          padding: 0.08rem 0;
          color: #b0352f;
        }
        ::v-deep .van-stepper {
          text-align: right;
        }
      }
      img {
        width: 73.9875px;
        height: 1.9733rem;
      }
    }
  }
  .bottom-button {
    width: 160px;
    height: 40px;
    background-color: #b0352f;
    color: #fff;
  }
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-top: 1.9875px solid #ccc;
  .radio {
    padding: 0 15px;
  }
  .total {
    font-size: 12px;
  }
  .total-active {
    color: #b0352f;
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
</style>
