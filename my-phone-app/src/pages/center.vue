<template>
  <div class="center">
    <img :src="my_bg_img" alt="">
    <div class="audio-component" id="my-audio">
      <!--audio播放器-->
      <audio :src="my_audio_url" controls 
      ref="music"
      @canplay="updateTime()"
      v-show="false"></audio>
      <!--旋转效果-->
      <div class="img-box">
        <span class="s-tip" :class="{active:is_play}"></span>
        <div class="img-ct" :class="{active:is_play,poused:!is_play}">
          <img :src="my_audio_img" alt="">
        </div> 
      </div>
      <!--歌词-->
      <div class="v-lyr">
        <div class="lyr-text" ref="lyrText" v-show="false" v-html="lyr"></div>
        <div class="lyr-list" ref="lyr">
          <p
            v-for="(s, index) in lyrList"
            :class = "{'on': s.dis}">
            {{ s.txt }}
          </p>
        </div>
      </div>
      <!--歌曲控制器-->
      <div class="audio-operator">
        <!--时间线-->
        <div class="time-line" ref="bar">
          <div class="go-bar" :style="{ width: (nowTime/allTime) * 100 + '%'}" ref="lineIn">
            <svg class="_icon" @mousedown="drap($event)" @touchstart="drap($event)">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my-go-cicle"></use>
            </svg>
          </div>
          <span class="current-time">{{resultTime.nowTime}}</span>
          <span class="all-time">{{resultTime.allTime}}</span>
        </div>
        <!--播放时间-->
        
        <div class="controle-info">
          <!--前一首歌曲 -->
          <span
          data-role="audio-play-prev" 
          class="audio-play-prev"
          @click="preveAudio">
          <svg class="_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my-prev"></use>
          </svg>
          </span>
          <!--启动/暂停-->
          <b class="play" 
          :class="{active:is_play}"
          @click="toggelPlay($event)">
            <svg class="_icon">
              <use v-if="is_play" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my-playing"></use>         
              <use v-else xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my-pause"></use>
            </svg>
          </b>
          <!--后一首歌曲-->
          <span 
          data-role="audio-play-next" 
          class="audio-play-next"
          @click="nextAudio">
          <svg class="_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#my-next"></use>
          </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        center: 'center',
        is_play: false,
        lrc: null,
        nowTime: null,
        allTime: null,
        set: null,
        lyrList: [],
        musicList: [
          {
            audio_url: '../../static/musics/dwsj/薛之谦 - 动物世界.mp3',
            lrc_url: '../../static/musics/dwsj/薛之谦 - 动物世界.lrc',
            audio_img: '../../static/musics/dwsj/dwsj.png',
            audio_bg_img: '../../static/musics/dwsj/dwsj-blur.png'
          },
          {
            audio_url: '../../static/musics/tn/罗大佑 - 童年.mp3',
            lrc_url: '../../static/musics/tn/罗大佑 - 童年.lrc',
            audio_img: '../../static/musics/tn/tn.png',
            audio_bg_img: '../../static/musics/tn/tn-blur.png'
          },
          {
            audio_url: '../../static/musics/ll/杨宗纬 张碧晨 - 凉凉.mp3',
            lrc_url: '../../static/musics/ll/杨宗纬 张碧晨 - 凉凉.lrc',
            audio_img: '../../static/musics/ll/ll.png',
            audio_bg_img: '../../static/musics/ll/ll-blur.png'
          },
          {
            audio_url: '../../static/musics/wlyjn/戚薇,杨宗纬 - 为了遇见你.mp3',
            lrc_url: '../../static/musics/wlyjn/戚薇,杨宗纬 - 为了遇见你.lrc',
            audio_img: '../../static/musics/wlyjn/wlyjn.png',
            audio_bg_img: '../../static/musics/wlyjn/wlyjn-blur.png'
          },
          {
            audio_url: '../../static/musics/ynzj/张杰,莫文蔚 - 一念之间.mp3',
            lrc_url: '../../static/musics/ynzj/张杰,莫文蔚 - 一念之间.lrc',
            audio_img: '../../static/musics/ynzj/ynzj.png',
            audio_bg_img: '../../static/musics/ynzj/ynzj-blur.png'
          }
        ],
        cur_music: null,
        lyr: '',
        my_audio_url: '',
        my_lrc_url: '',
        my_audio_img: '',
        my_bg_img: '',
        my_audio_index: 0,
        my_cur_time_width: 3,
        nowX: 0,
        nowLine: 0
      }
    },
    watch: {
      is_play () {
        if (this.is_play === true) {
          this.$refs.music.play()
          this.start()
        } else {
          this.$nextTick(() => {
            this.$refs.music.pause()
            this.stop()
          })
        }
      }
    },
    created () {
      // 添加微信监听
      let self = this
      let audio = self.$refs.music
      document.addEventListener('WeixinJSBridgeReady', function () {
        audio.play()
      }, false)
    },
    mounted  () {
      let self = this
      self.my_audio_url = self.musicList[0].audio_url
      self.my_lrc_url = self.musicList[0].lrc_url
      self.my_audio_img = self.musicList[0].audio_img
      self.my_bg_img = self.musicList[0].audio_bg_img
      self.nowTime = 0
      self.getLrc(data => {
        self.lyr = data.data
        self.updateLyr()
        self.showLyr()
      })
    },
    computed: {
      resultTime () {
        // 生成时间展示
        var two = (data) => {
          var m = ~~(data / 60)
          var s = ~~(data % 60)
          m = m > 9 ? m : '0' + m
          s = s > 9 ? s : '0' + s
          return m + ':' + s
        }
        return {nowTime: two(this.nowTime), allTime: two(this.allTime)}
      }
    },
    methods: {
      // 更新歌词
      updateLyr () {
        if (this.lyrList.length < 1) {
          return false
        }
        // 每次循环歌词 如果当前时间小于自己 那么显示上一个歌词
        var i = 0
        var loading = true
        this.lyrList.forEach((val, index) => {
          this.lyrList[index].dis = false
          if ((val.total - this.nowTime) > 0 && loading === true) {
            i = index - 1
            i = i > 0 ? i : 0
            loading = false
          } else {
            this.lyrList[index].dis = false
          }
        })
        this.lyrList[i].dis = true
        var nowLry = i - 1 > 0 ? i - 1 : 0
        this.$refs.lyr.style.transform = 'translate3d(0, -' + nowLry * 27 + 'px, 0)'
      },
      // 提取歌词 并展示
      showLyr () {
        let self = this
        if (this.lyr.length <= 0) {
          return false
        }
        this.$nextTick(() => {
          // 转义字符
          var lyrics = self.lyr
          // 切割成数组
          lyrics = lyrics.split('\n')
          var lyrObj = []
          // 提取时间轴
          lyrics.forEach(function (val, index) {
            if (index > 4) {
              // 去除两边空格
              val = val.replace(/(^\s*)|(\s*$)/g, '')
              var obj = {}
              let indeofLastTime = val.indexOf(']')
              let timeStr = val.substring(1, indeofLastTime)
              let minSec = ''
              let timeMsIndex = timeStr.indexOf('.')
              if (timeMsIndex !== -1) {
                minSec = timeStr.substring(1, val.indexOf('.'))
                obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))
              } else {
                minSec = timeStr
                obj.ms = 0
              }
              let curTime = minSec.split(':')
              obj.min = parseInt(curTime[0])
              obj.sec = parseInt(curTime[1])
              obj.txt = val.substring(indeofLastTime + 1, val.length)
              obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
              obj.dis = false
              obj.total = obj.min * 60 + obj.sec + obj.ms / 100
              if (obj.txt.length > 0) {
                lyrObj.push(obj)
              }
            }
            // 提取时间
            // var time = /[[\d:\d((.|)\d\])]/g.exec(val)
          })
          // 添加一个空的p
          lyrObj.push({min: 999, sec: 999, ms: 999, total: 999, txt: ''})
          this.lyrList = lyrObj
          // 第一个选中
          this.updateLyr()
        })
      },
      // 更新时间
      updateTime () {
        let self = this
        if (!self.$refs) {
          return ''
        }
        if (self.$refs && self.$refs.music !== 'undefined') {
          self.nowTime = self.$refs.music.currentTime
          self.allTime = self.$refs.music.duration
          if (self.$refs.music.ended) {
            // self.is_play = false // 播放暂停
            self.nextAudio() // 播放下一首
          }
        }
      },
      // 开始计时 并更新时间
      start () {
        let self = this
        // 更新时间
        self.is_play = true
        this.set = setInterval(() => {
          if (!self.$refs || !self.$refs.music) {
            clearInterval(self.set)
            return ''
          }
          this.updateTime()
          // 更新展示歌词
          this.updateLyr()
        }, 100)
      },
      // 暂停计时
      stop () {
        let self = this
        clearInterval(self.set)
      },
      // 暂停或启动
      toggelPlay (e) {
        let self = this
        if (!self.is_play) {
          self.is_play = true
        } else {
          self.is_play = false
        }
      },
      // 获取歌词的方法
      getLrc (callback) {
        let self = this
        this.$http.get(self.my_lrc_url).then(function (data) {
          console.log(data)
          if (typeof callback === 'function') {
            callback(data)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      playMusic (index) {
        let self = this
        self.my_audio_url = self.musicList[index].audio_url
        self.my_lrc_url = self.musicList[index].lrc_url
        self.my_audio_img = self.musicList[index].audio_img
        self.my_bg_img = self.musicList[index].audio_bg_img
        self.nowTime = 0
        self.getLrc(data => {
          self.lyr = data.data
          self.showLyr()
        })
        this.$nextTick(() => {
          this.is_play = true
          this.$refs.music.play()
        })
      },
      // 下一首歌曲
      nextAudio () {
        let self = this
        if (self.my_audio_index < self.musicList.length - 1) {
          self.my_audio_index++
        } else {
          self.my_audio_index = 0
        }
        self.playMusic(self.my_audio_index)
      },
      // 上一首歌曲
      preveAudio () {
        let self = this
        if (self.my_audio_index === 0) {
          self.my_audio_index = self.musicList.length - 1
        } else {
          self.my_audio_index--
        }
        self.playMusic(self.my_audio_index)
      },
      // 拖拽时间轴
      drap (e) {
        // 先停止更新时间和歌词
        let self = this
        this.stop()
        e.preventDefault()
        this.oldX = e.clientX ? e.clientX : e.touches[0].clientX
        this.nowLine = window.getComputedStyle(this.$refs.lineIn).width
        this.nowLine = this.nowLine.replace('px', '')
        this.$refs.lineIn.style.transitionDuration = '0s'
        window.addEventListener('mousemove', self.move)
        window.addEventListener('touchmove', self.move)
        window.addEventListener('mouseup', self.leave)
        window.addEventListener('touchend', self.leave)
      },
      move (e) {
        var all = window.getComputedStyle(this.$refs.bar).width
        all = all.replace('px', '')
        this.nowX = e.clientX ? e.clientX : e.touches[0].clientX
        var end = Number(this.nowX - this.oldX) + Number(this.nowLine)
        end = end > all ? all : end < 0 ? 0 : end
        this.nowTime = Number(((end / all) * this.allTime).toFixed(3))
        // 拖拽时歌词
        this.updateLyr()
      },
      // 结束拖拽
      leave (e) {
        let self = this
        if (self.oldX !== 0) {
          self.oldX = 0
          self.$refs.music.currentTime = self.nowTime
          self.$refs.lineIn.style.transitionDuration = '0.05s'
        }
        if (self.is_play) {
          self.start()
        }
        window.removeEventListener('mousemove', self.move)
        window.removeEventListener('touchmove', self.move)
        window.removeEventListener('mouseup', self.leave)
        window.removeEventListener('touchend', self.leave)
      }
    },
    directives: {
      demo: {
        bind: function (el, binding, vnode) {

        },
        unbind: function (el, binding, vnode) {

        },
        inserted: function (el, binding, vnode) {

        },
        update: function (el, binding, vnode) {

        }
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.set)
      next(vm => {
        // 通过 `vm` 访问组件实例
        clearInterval(vm.set)
      })
    }
}
</script>

<style lang="less" scoped>
  @import '../assets/layout.less';
  .center{
    position: relative;
    overflow-x: hidden;
    font-size: .3rem;
    &:before,
    &:after{
      display: block;
      content: ' ';
      clear: both;
    }
    &>img{
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      // 滤镜开销比较大
      // -webkit-filter: blur(10px); /* Chrome, Opera */
      //  -moz-filter: blur(10px);
      //   -ms-filter: blur(10px);
      //       filter: blur(10px);
      // filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); /* IE6~IE9 */
    }
  }
  .audio-component{
    padding-top: 45px;
    margin: 0 auto;
    text-align: center;
    border-radius: 2px;
  }
  .play{
    position: relative;
    display: inline-block;
    width: .6rem;
    height: .6rem;
    background-color: @them-color;
    border-radius: 100%;
    cursor: pointer;
    text-align: center;
    line-height: 2.1;
    &>._icon{
      width: .2rem;
      height: .2rem;
      fill: @white;
    }
  }
  .v-lyr {
      height: 90px;
      text-align: center;
      overflow: hidden;
      margin: 10px 0 10px;
      opacity: 1;
      .lyr-list {
        transition: transform 0.4s ease-out;
      }
      p {
        display: block;
        font-size: 12px;
        line-height: 15px;
        color: @white;
        opacity: .4;
      }
      p.on {
        opacity: 1;
      }
    }

  .img-box{
    position: relative;
    margin: 0 auto;
    height: 4rem;
    width: 4rem;
    top: 18px;
    background-size: cover;
    .s-tip{
      display: inline-block;
      position: absolute;
      z-index: 10;
      top: -1.2rem;
      left: 1.5rem;
      height: 2rem;
      width: 1.4rem;
      background-image: url('../../static/images/s-tip.png');
      background-size: cover;
      transform: rotate(-15deg);
      transition: all .3s linear;
      -ms-transform-origin: 0 0;
      -webkit-transform-origin: 0 0;
      -moz-transform-origin: 0 0;
      -o-transform-origin: 0 0;
      &.active{
        top: -1.2rem;
        transform: rotate(0deg)
      }
    }
    .img-ct{
      height: 4rem;
      width: 4rem;
      overflow: hidden;
      border-radius: 100%;
      background-image: url('../../static/images/s-cicle.png');
      background-size: cover;
      animation:cicle 10s infinite;
      -webkit-animation:cicle 10s linear infinite;
      -moz-animation:cicle 10s linear infinite;
      -ms-animation:cicle 10s linear infinite
      &.active{
        animation:cicle 10s infinite;
        -webkit-animation:cicle 10s linear infinite;
        -moz-animation:cicle 10s linear infinite;
        -ms-animation:cicle 10s linear infinite
      }
      &.poused{
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
          -moz-animation-play-state: paused;
          -ms-animation-play-state: paused;
      }
      img{
        position: relative;
        top: .75rem;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 150%;
      }
    }
  }
  @-webkit-keyframes cicle {
    from {
      -webkit-transform:rotate(0deg)    
    }
    to {
      -webkit-transform:rotate(360deg)
    }
  }
  @-moz-keyframes cicle {
    from {
      -moz-transform:rotate(0deg)
    }
    to {
      -moz-transform:rotate(360deg)
    }
  }
  @-ms-keyframes cicle {
    from {
      -ms-transform:rotate(0deg)
    }
    to {
      -ms-transform:rotate(360deg)
    }
  }
  @keyframes cicle {
    from {
      transform:rotate(0deg)
    }
    to {
      transform:rotate(360deg)
    }
  }

  .audio-operator{
        position: relative;
        .time-line{
          margin: 0 auto;
          width: 5rem;
          height: 3px;
          background-color: @font-color;
          .go-bar{
            position: relative;
            width: 0;
            height: 3px;
            background-color: @them-color;
            &>._icon{
              transition: all .01s linear;
              position: absolute;
              top: -.1rem;
              right: -.1rem;
              width: .25rem;
              height: .25rem;
              fill: @them-color;
            }
          }
          .current-time,
          .all-time{
            display: block;
            position: absolute;
            font-size: .2rem;
            top: -.12rem;
          }
          .current-time{
            left: .5rem;
          }
          .all-time{
            right: .5rem;
          }
        }
        .controle-info{
          margin-top: 50px;
          .audio-play-prev,
          .audio-play-next{
            position: relative;
            display: inline-block;
            width: .6rem;
            height: .6rem;
            border-radius: 100%;
            background-color: @them-color;
            line-height: 2.1;
            text-align: center;
            cursor: pointer;
            transition: background-color .2s linear;
            color: @white;
          }
          .audio-play-prev{
            left: -70px;
          }
          .audio-play-next{
            left: 70px;
          }
          & ._icon{
          position: relative;
          top: .07rem;
          width: .4rem;
          height: .4rem;
          fill: @white;
          stroke: @white;
        }
      }   
      }
</style>
