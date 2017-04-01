<template>
  <div class="header">
    <div class="logo">
      <img src="../../static/images/test-user.png" alt="">
    </div>
    <div class="search">
      <input type="text">
      <span>搜索</span>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        header: '页头'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/layout.less';
  .header{
    position: fixed;
    top: 0;
    height: 60px;
    width: 100%;
    background-color: @them-color;
    color: @white;
    font-size: .3rem;
    .logo{
      float:left;
      margin-left: 10px;
      margin-top: 5px;
      height: 50px;
      width: 50px;
      overflow: hidden;
      border-radius: 100%;
      img{
        height: 50px;
        width: 50px;
      }
    }
    .search {
      float: right;
      margin-right: 15px;
      margin-top: 4px;
      font-size: .3rem;
      input{
        margin-top: 10px;
        display: inline-block;
        height: 30px;
        border-radius: 30px;
        border: 1px solid @light-dark;
        padding-left: 15px;
        padding-right: 15px;
        &:focus{
          outline: none;
        }
      }
    }
  }
</style>
