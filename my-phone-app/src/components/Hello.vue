<template>
  <div class="hello">   
    <p class="animate-hello" :class="{animated:animated_class,rubberBand:animated_class}"><img src="../../static/images/flower.png"></p>
    <!--<p :class="{animated:hua_h,bounceInUp:hua_h,'animate-h':hua_h,fade:leave}"><img src="../../static/images/flower-h.png" alt=""></p>-->
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Hello',
      animated_class: false,
      hua_h: false,
      leave: true,
      win_h: 0
    }
  },
  created () {
    let self = this
    this.win_h = (window.innerHeight - 150)
    self.skip()
    self.animated_class = true
    setTimeout(() => {
      self.leave = false
      self.hua_h = true
    }, 1000)
  },
  methods: {
    skip () {
      let self = this
      setTimeout(() => {
        self.$router.push('/home')
        self.animated_class = false
      }, 5000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .hello{
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    .animate-hello{
      position: relative;
      top: 100px;
      z-index: 11;
      overflow: hidden;
      max-width: 300px;
      text-align: center;
      margin: 0 auto;
      img{
        width: 100%;
      }
    }
    .animate-h{
      position: relative;
      top: -300px;
      z-index: 10;
      opacity: 1;
      img{
        display: block;
        position: relative;
        transform:rotate(90deg);
      }
    }
    .fade{
      opacity: 0;
    }
  }
</style>
