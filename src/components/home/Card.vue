<template>
  <div class="title">
    <slot>
      <span>火爆推荐</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
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
.title {
  padding: 0.26rem 0;
  width: 100%;
  text-align: center;
  font-size: 0.426rem;
  span {
    position: relative;
  }
}
.title span::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
  background: #d4c0a7;
  top: 50%;
  margin-top: -4px;
  right: -0.5rem;
}
.title span::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
  background: #d4c0a7;
  top: 50%;
  margin-top: -4px;
  left: -0.5rem;
}
</style>
