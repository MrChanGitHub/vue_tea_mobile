<template>
  <div class="search">
    <Header></Header>
    <section>
      <router-view />
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from '@/components/search/Header.vue'
export default {
  name: 'Search',
  components: { Header, Tabbar },
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
.search {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-size: 14px;
}
section {
  flex: 1;
  overflow: hidden;
}
</style>
