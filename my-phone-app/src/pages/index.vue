<template>
  <div class="index">
    <div class="user-lsit">

      <div class="user-info" v-for="item in user_list">
        <div class="img">
          <img :src="item.img" alt="">
        </div>
        <div class="info">
          <span>姓名</span>
          <p><b>{{item.name}}</b></p>
          <span>邮件</span>
          <p><b>{{item.email}}</b></p>
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
      height: 80px;
      overflow: hidden;
      margin: 10px;
      img{
        width: 100%;
        height: 80px;
      }
    }
    .info{
      float: left;
      margin-top: .2rem;
      text-align: left;
      font-size: .2rem;
      width: 70%;
      overflow: hidden;
      p{
        // height: 20px;
        overflow: hidden;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      span{
        color: #999;
      }
      b{
        color: #666;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  
</style>
