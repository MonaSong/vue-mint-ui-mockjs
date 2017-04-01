<template>
  <div class="footer">
    <ul>
      <router-link to="/home" tag="li" :class="{active:(onRoutes === 'home')}">首页</router-link>
      <router-link to="/home/information" tag="li" :class="{active:(onRoutes === 'information')}">资讯</router-link>
      <router-link to="/home/center" tag="li" :class="{active:(onRoutes === 'center')}">我的</router-link>
      <router-link to="/home/money" tag="li" :class="{active:(onRoutes === 'money')}">钱包</router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        footer: '页脚',
        is_index: false
      }
    },
    created () {

    },
    computed: {
      onRoutes () {
        let curRoute = this.$route.path
        let firstOne = curRoute.indexOf('/')
        let lastOne = curRoute.lastIndexOf('/')
        let curPath = ''
        if (firstOne === lastOne && firstOne !== -1) {
          curPath = curRoute.replace('/', '')
        } else {
          curPath = curRoute.substring(lastOne + 1, curRoute.length)
        }
        return curPath
      }
    },
    methods: {
    }
  }
</script> 

<style lang="less" scoped>
  @import '../assets/layout.less';
  .footer{
    position: fixed;
    width: 100%;
    z-index: 1000;
    border-top: 1px solid #eaeaea;
    background-color: @white;
    bottom: 0;
    ul{ 
      font-size: 0;
      li{
        position: relative;
        width: 25%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        display: inline-block;
        font-size: 15px;
        color: @them-color;
        transition: all .2s linear;
        cursor: pointer;
        &:before{
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 50px;
          width: 2px;
          // background-color: @light-dark;
        }
        &:first-child::before{
          display: none;
        }
        &.active{
          background-color: @them-color;
          color: @white;
          transition: all .2s linear;
        }
        
      }
      
    }
  }
</style>
