<template>
  <div class="info">
    <div class="info-box" v-for="item in info_list">
      <p class="info-title">{{item.info_title}}</p>
      <p class="info-de">{{item.date}}</p>
      <div class="info-img">
        <img :src="item.img" alt="">
      </div>
      <div class="info-text">
        <p>{{item.info_text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        info_list: null
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      getInfo () {
        let self = this
        self.$http.get('/api/info').then(function (data) {
          console.log(data.data)
          self.info_list = data.data.data
          console.log(self.info_list)
        }).catch(function (err) {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/layout.less';
  .info{
    overflow: hidden;
    font-size: .3rem;
    padding: 10px;
    .info-box{
      padding: 10px;
      margin-bottom: 15px;
      border-bottom: 1px solid @gray;
      background-color: @white;
      .info-img{
        width: 100%;
        height: 150px;
        overflow: hidden;
        img{
          width: 100%;
          height: 150px;
        }
      }
      .info-title{
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: .4rem;
      }
      .info-de{
        color: @font-color;
      }
      .info-text{
        p{
          font-size: .3rem;
          text-indent: 2em;
        }
      }
    }
  }
  
</style>
