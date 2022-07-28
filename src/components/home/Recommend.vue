<template>
  <div class="recommend">
    <Card><span>小七推荐</span></Card>
    <ul>
      <li v-for="(item, index) in recommendList" :key="index">
        <h2><img :src="item.imgUrl" alt="" /></h2>
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.content }}</p>
          <div class="price">
            <span>￥</span>
            <b>{{ item.price }}</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from '@/components/home/Card.vue'
export default {
  name: '',
  components: { Card },
  props: ['recommendList'],
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
.recommend ul li {
  position: relative;
  h2 {
    text-align: center;
  }
  img {
    width: 9.6rem;
    height: 3.84rem;
    border-radius: 0.32rem;
  }
  & > div {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    padding: 23px 0.5333rem;
  }
  & > div h3 {
    font-size: 0.32rem;
  }
  & > div p {
    font-size: 0.426rem;
  }
}

.price {
  margin-top: 0.6rem;
  text-align: right;
  color: #b0352f;
  span {
    font-size: 0.373rem;
  }
}
</style>
