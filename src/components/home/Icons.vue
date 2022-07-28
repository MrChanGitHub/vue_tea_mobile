<template>
  <div>
    <ul class="icons">
      <li v-for="(item, index) in iconsList" :key="index">
        <img :src="item.imgUrl" alt="" />
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Icons',
  components: {},
  props: ['iconsList'],
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
.icons {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 0.6667rem;
    height: 0.6667rem;
  }
  span {
    font-size: 0.426rem;
  }
}
</style>
