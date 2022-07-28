<template>
  <div class="AdvertiMent">
    <ul>
      <li v-for="(item, index) in AdvertiMent" :key="index">
        <img :src="item.imgUrl" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdvertiMent',
  components: {},
  props: ['AdvertiMent'],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.AdvertiMent {
  width: 100%;
  height: 2.98rem;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
