<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit('checkLogin')
  },
}
</script>

<style lang="scss">
#app {
  max-width: 10rem;
}
</style>
