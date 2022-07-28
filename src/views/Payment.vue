<template>
  <div v-if="payStatus">
    <van-empty description="付款成功">
      <van-button round class="bottom-button" @click="$router.push('/my')">查看订单</van-button>
    </van-empty>
  </div>
  <div v-else>
    <van-empty description="交易失败,请重新提交">
      <van-button round class="bottom-button" @click="$router.push('/my')"
        >查看订单</van-button
      ></van-empty
    >
  </div>
</template>

<script>
import http from '@/common/api/request'
import qs from 'qs'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      data: {
        out_trade_no: this.$route.query.out_trade_no,
        trade_no: this.$route.query.trade_no,
      },
      payStatus: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    //发起请求,判断支付成功与否
    getData() {
      http
        .$axios({
          url: '/api/PaymentStatus',
          method: 'post',
          headers: {
            token: true,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify(this.data),
        })
        .then((res) => {
          console.log(res)
          if (res.code === 200 || res.code === 201) {
            this.payStatus = true
          } else if (res.code === 202) {
            this.payStatus = true
          } else {
            this.payStatus = false
          }
        })
    },
  },
}
</script>

<style scoped lang="scss"></style>
