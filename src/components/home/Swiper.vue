<template>
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
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'Swiper',
  components: { swiper, swiperSlide },
  props: ['swiperList'],
  data() {
    return {
      //轮播图配置项
      swiperOption: {
        autoplay: 3000,
        speed: 1000,
        pagination: {
          el: '.swiper-pagination',
        },
      },
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.swiper-main {
  position: relative;
  width: 100%;
  height: 4.4rem;

  img {
    width: 100%;
    height: 4.4rem;
  }
}

/* 圆点切换 */
.swiper-pagination {
  height: 35px;
  width: 100%;
  bottom: 0px;
}

::v-deep .swiper-pagination-bullet-active {
  background-color: #b0352f;
}
::v-deep .swiper-pagination-bullet {
  margin: 0 0.1rem;
}
</style>
