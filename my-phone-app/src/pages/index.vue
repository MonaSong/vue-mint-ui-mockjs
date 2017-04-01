<template>
  <div class="index">
    <div class="user-lsit">

      <div class="user-info" v-for="item in user_list">
        <div class="img">
          <img :src="item.img" alt="">
        </div>
        <div class="info">
          <p><span>姓名：</span><b>{{item.name}}</b></p>
          <p><span>邮件：</span><b>{{item.email}}</b></p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      index: '首页',
      user_list: null
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      let self = this
      this.$http.get('/api/user').then(function (data) {
        self.user_list = data.data.result
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../assets/layout.less';

  .index{
    padding: 15px;
    min-height: 100%;
    overflow-y:scroll;
  }
  .user-info{
    width: 100%;
    height: 100px;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 15px;
    &:before,
    &:after{
      display: block;
      height: 0;
      content: ' ';
      clear: both;
    }
    .img{
      float: left;
      width: 20%;
      height: 70px;
      overflow: hidden;
      margin: 10px;
      img{
        width: 100%;
        height: 70px;
      }
    }
    .info{
      float: left;
      margin-top: .2rem;
      text-align: left;
      font-size: .3rem;
      width: 70%;
      overflow: hidden;
      span{
        color: #999;
      }
      b{
        color: #666;
      }
    }
  }
  
</style>
