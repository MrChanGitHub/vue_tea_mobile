<template>
  <div class="path-index container">
    <Header
      ><span v-show="pathStatus">添加地址</span><span v-show="!pathStatus">编辑地址</span></Header
    >
    <section v-if="pathStatus">
      <van-address-edit
        :area-list="areaList"
        show-set-default
        show-search-result
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
      />
    </section>
    <section v-else>
      <van-address-edit
        :area-list="areaList"
        show-delete
        show-set-default
        show-search-result
        :address-info="item"
        :search-result="searchResult"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onEdit"
        @delete="onDelete"
      />
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from '@/components/path/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
import { Toast } from 'vant'
import { areaList } from '@vant/area-data'
import http from '@/common/api/request.js'
export default {
  name: 'PathList',
  components: { Header, Tabbar },
  props: {},
  data() {
    return {
      areaList,
      searchResult: [],
      item: {},
    }
  },
  computed: {},
  watch: {},
  created() {
    //通过添加进来该页面
    if (this.$route.params.key === 'add') {
      this.pathStatus = true
    } else {
      //通过点击地址项进来该页面进行修改
      this.pathStatus = false
      this.item = this.$route.params.item
    }
  },
  mounted() {},
  methods: {
    //点击保存事件
    onSave(content) {
      //是否为默认地址,默认值为true和false,存数据库需要转换一下
      content.isDefault = content.isDefault ? '1' : '0'
      http
        .$axios({
          url: '/api/addAddress',
          method: 'post',
          headers: {
            token: true,
          },
          data: {
            content,
          },
        })
        .then((res) => {
          if (res.success) {
            Toast(res.msg)
            this.$router.push('/path')
          }
        })
    },
    //处理删除逻辑
    onDelete() {
      //获取地址id
      const id = this.item.id
      //发送请求
      http
        .$axios({
          url: '/api/delAddress',
          method: 'post',
          headers: {
            token: true,
          },
          data: {
            id,
          },
        })
        .then((res) => {
          if (res.success) {
            Toast.success(res.msg)
            this.$router.push('/path')
          }
        })
    },

    //处理编辑逻辑
    onEdit(content) {
      //修改地址需要当前地址的id号和用户的uId,这里为content添加id属性
      content['id'] = this.item.id
      //是否为默认地址,默认值为true和false,存数据库需要转换一下
      content.isDefault = content.isDefault ? '1' : '0'
      http
        .$axios({
          url: '/api/editAddress',
          method: 'post',
          headers: {
            token: true,
          },
          data: {
            content,
          },
        })
        .then((res) => {
          if (res.success) {
            Toast.success(res.msg)
            this.$router.push('/path')
          }
        })
    },
  },
}
</script>

<style scoped lang="scss">
section {
  background-color: #f7f7f7;
  ::v-deep .van-button--danger {
    background-color: #b0352f;
  }
  ::v-deep .van-button--round {
    border-radius: 13px;
    border: 0px;
  }
}
</style>
