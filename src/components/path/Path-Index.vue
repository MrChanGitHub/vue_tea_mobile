<template>
  <div class="path-index container">
    <Header></Header>
    <section v-if="addressList.length > 0" class="wrapper">
      <div>
        <ul>
          <li v-for="item in addressList" :key="item.id" @click="editAddress(item)">
            <div>
              <span>{{ item.name }}</span>
              <span>{{ item.tel }}</span>
            </div>
            <div>
              <span class="active">{{ item.isDefault == true ? '[默认]' : '[地区]' }}</span>
              <span>{{ item.province }}</span>
              <span>{{ item.city }}</span>
              <span>{{ item.county }}</span>
              <span></span>
            </div>
            <div class="hidden">
              <span>{{ item.addressDetail }}</span>
            </div>
          </li>
        </ul>
        <div class="add-path" @click="goList()">添加地址</div>
      </div>
    </section>
    <section v-else>
      请添加地址
      <div class="add-path" @click="goList()">添加地址</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from '@/components/path/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
import http from '@/common/api/request.js'
//引入滚动插件
import BetterScroll from 'better-scroll'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'PathIndex',
  components: { Header, Tabbar },
  props: {},
  data() {
    return {
      isOrderPath: false,
    }
  },
  computed: {
    ...mapState({
      addressList: (state) => state.address.addressList,
    }),
  },
  watch: {},
  created() {
    this.getData()
  },
  activated() {
    //从订单的页面进来
    if (this.$route.query.type === 'select') {
      this.isOrderPath = true
    }
    //从地址管理进来
    if (this.$route.query.type === 'edit') {
      this.isOrderPath = false
    }
    this.getData()
  },
  deactivated() {},
  mounted() {},
  methods: {
    //请求数据
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
          this.initData(res.data)
        })
      this.$nextTick(() => {
        new BetterScroll('.wrapper', {
          zoom: true,
          click: true,
          bounce: false,
        })
      })
    },
    ...mapMutations(['initData']),

    //添加地址
    goList() {
      this.$router.push({
        name: 'Pathlist',
        params: {
          key: 'add',
        },
      })
    },

    editAddress(item) {
      //从订单页过来,传回所选择的地址
      if (this.isOrderPath) {
        this.$router
          .push({
            name: 'Order',
            params: {
              path: item,
            },
          })
          .catch((err) => {})
        return
      }

      //传递需要修改地址的信息,并且将是否为默认地址改变为原始类型boolean,方便接收识别
      item.isDefault = item.isDefault == '1' ? true : false
      this.$router
        .push({
          name: 'Pathlist',
          params: {
            key: 'edit',
            item,
          },
        })
        .catch((err) => {})
    },
  },
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  div {
    width: 100%;
  }
  ul {
    width: 100%;
    font-size: 14px;
    li {
      border-radius: 0.08rem;
      box-shadow: 4px 3px 12px #888888;
      padding: 0.2rem 0.6rem;
      margin: 0.08rem;
      background-color: #ffffff;
      div {
        height: 25px;
      }
      .hidden {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      span {
        margin-left: 0.22rem;

        font-style: 0.4266rem;
      }
      .active {
        color: #b0352f;
      }
    }
  }
  .add-path {
    margin: 0.8rem auto;
    width: 2.666rem;
    line-height: 1.066rem;
    font-size: 15px;
    text-align: center;
    color: #fff;
    background-color: #b0352f;
  }
}
</style>
