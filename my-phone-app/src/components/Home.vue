<template>
  <div class="home">
    <v-header></v-header>
    <transition name="fade-slid" mode="out-in">
      <router-view></router-view>
    </transition>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import vHeader from './Head'
  import vFooter from './Footer'
  export default {
    data () {
      return {
        home: '首页'
      }
    },
    components: {
      vHeader,
      vFooter
    }
  }
</script>

<style lang="less" scoped> 
  .home{
    padding-top: 60px;
  }
</style>
