<template>
  <div class="like">
    <Card><span>猜你喜欢</span></Card>
    <ul>
      <li v-for="(item, index) in likeList" :key="item.id" @click="goDetail(item.id)">
        <h2><img v-lazy="item.imgUrl" alt="" /></h2>
        <h3>{{ item.name }}</h3>
        <div>
          <span
            ><b>￥{{ item.price }}</b>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from '@/components/home/Card.vue'

export default {
  name: 'Like',
  components: { Card },
  props: ['likeList'],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goDetail(itemId) {
      this.$router.push({
        path: '/detail',
        query: {
          id: itemId,
        },
      })
    },
  },
}
</script>

<style scoped lang="scss">
.like {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      & > div {
        width: 93%;

        text-align: left;
        span {
          color: #b0352f;
          font-size: 0.45rem;
        }
      }
    }
  }
  h3 {
    padding: 0.16rem;
    width: 93%;
    font-size: 0.373rem;
    font-weight: 400px;
    color: #222;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  img {
    width: 175.875px;
    height: 175.875px;
    border: 1px solid rgb(235, 235, 235);
  }
}
</style>
