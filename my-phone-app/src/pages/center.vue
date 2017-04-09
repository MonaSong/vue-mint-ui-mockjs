<template>
  <div class="center">
    <img :src="my_audio_img" alt="">
    <div class="audio-component" id="my-audio">
      <audio :src="my_audio_url" controls 
      ref="music"
      @canplay="updateTime()"
      v-show="false" autoplay></audio>
      <div class="img-box">
        <span class="s-tip" :class="{active:is_play}"></span>
        <div class="img-ct" :class="{active:is_play,poused:!is_play}">
          <img :src="my_audio_img" alt="">
        </div> 
      </div>
      <span>{{cur_txt}}</span>
      <div class="time-line"></div>
      <br><br>
      <span>{{resultTime}}</span>
      <br><br>
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
      <div class="audio-operator">
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
</template>

<script>
  export default {
    data () {
      return {
        center: 'center',
        is_play: true,
        lrc: null,
        cur_txt: null,
        nowTime: null,
        allTime: null,
        set: null,
        lyrList: [],
        musicList: [
          {
            audio_url: '../../static/musics/zqzm/孙楠,许茹芸 - 真情真美.mp3',
            lrc_url: '../../static/musics/zqzm/孙楠,许茹芸 - 真情真美.lrc',
            audio_img: '../../static/musics/zqzm/zqzm.png'
          },
          {
            audio_url: '../../static/musics/tn/罗大佑 - 童年.mp3',
            lrc_url: '../../static/musics/tn/罗大佑 - 童年.lrc',
            audio_img: '../../static/musics/tn/tn.png'
          },
          {
            audio_url: '../../static/musics/ll/杨宗纬 张碧晨 - 凉凉.mp3',
            lrc_url: '../../static/musics/ll/杨宗纬 张碧晨 - 凉凉.lrc',
            audio_img: '../../static/musics/ll/ll.png'
          },
          {
            audio_url: '../../static/musics/wlyjn/戚薇,杨宗纬 - 为了遇见你.mp3',
            lrc_url: '../../static/musics/wlyjn/戚薇,杨宗纬 - 为了遇见你.lrc',
            audio_img: '../../static/musics/wlyjn/wlyjn.png'
          },
          {
            audio_url: '../../static/musics/ynzj/张杰,莫文蔚 - 一念之间.mp3',
            lrc_url: '../../static/musics/ynzj/张杰,莫文蔚 - 一念之间.lrc',
            audio_img: '../../static/musics/ynzj/ynzj.png'
          }
        ],
        cur_music: null,
        lyr: '',
        my_audio_url: '',
        my_lrc_url: '',
        my_audio_img: '',
        my_audio_index: 0
      }
    },
    created () {
    },
    mounted  () {
      let self = this
      self.startMusic()
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
        return two(this.nowTime) + ' / ' + two(this.allTime)
      }
    },
    methods: {
      startMusic () {
        let self = this
        let audio = self.$refs.music
        // 得到播放音乐的时间
        audio.addEventListener('loadeddata', function () {
          let audioDuration = audio.duration
          let audioCurrentTime = audio.currentTime
          self.allTime = audioDuration
          self.nowTime = audioCurrentTime
          self.start()
          self.showLyr()
        }, false)
        self.nowTime = 0
        self.getMusicInfo()
      },
      // 拿到歌词
      getMusicInfo () {
        let self = this
        // 将当前歌词赋值给歌词变量
        self.cur_music = self.musicList[self.my_audio_index]
        self.my_audio_url = self.cur_music.audio_url
        self.my_lrc_url = self.cur_music.lrc_url
        self.my_audio_img = self.cur_music.audio_img
        // 拿到当前歌词
        self.getLrc(function (data) {
          self.lyr = data.data
          console.log('当前歌词数据')
          console.log(self.lrc)
          // 以下是歌词没加载时的默认显示数据
          // self.lyrList = [
          //   {
          //     min: 999,
          //     sec: 999,
          //     ms: 999,
          //     total: 999,
          //     txt: '歌词正在疯狂加载中...'
          //   }
          // ]
        })
      },
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
          // var lyrics = this.$refs.lyrText.innerHTML
          var lyrics = self.lyr
          // 切割成数组
          lyrics = lyrics.split('\n')
          console.log('lyrics')
          console.log(lyrics)
          var lyrObj = []
          let timeArr = []
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
          console.log('timeArr')
          console.log(timeArr)
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
        if (self.$refs && self.$refs.music !== 'undefined') {
          self.nowTime = self.$refs.music.currentTime
          self.allTime = self.$refs.music.duration
          if (self.$refs.music.ended) {
            self.is_play = false
          }
        }
      },
      // 开始计时 并更新时间
      start () {
        let self = this
        self.is_play = true
        if (this.songname === '') {
          return false
        }
        this.set = setInterval(() => {
          // 更新时间
          if (!self.$refs || !self.$refs.music) {
            return ''
          }
          this.updateTime()
          // 更新展示歌词
          this.updateLyr()
        }, 100)
      },
      // 暂停计时
      stop () {
        clearInterval(this.set)
      },
      // 暂停或启动
      toggelPlay (e) {
        let self = this
        let audioDom = self.$refs.music
        if (!self.is_play) {
          audioDom.play()
          self.is_play = true
          self.start()
          self.showLyr()
        } else {
          audioDom.pause()
          self.is_play = false
          self.stop()
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
      // 下一首歌曲
      nextAudio () {
        let self = this
        if (self.my_audio_index < self.musicList.length - 1) {
          self.my_audio_index++
        } else {
          self.my_audio_index = 0
        }
        self.startMusic()
      },
      // 上一首歌曲
      preveAudio () {
        let self = this
        if (self.my_audio_index === 0) {
          self.my_audio_index = self.musicList.length - 1
        } else {
          self.my_audio_index--
        }
        self.startMusic()
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
    }
}
</script>

<style lang="less" scoped>
  @import '../assets/layout.less';
  .center{
    position: relative;
    overflow-x: hidden;
    font-size: .3rem;
    .history_right{
      fill: #aaa;
      width: 40px;
      height: 40px;
    }
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
      opacity: .2;
    }
  }
  .audio-component{
      // height: 60px;
      /*line-height: 60px;*/
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
      &>._icon{
        width: .2rem;
        height: .2rem;
        fill: @white;
      }
    }
    .audio-play-prev,
    .audio-play-next{
      position: relative;
      display: inline-block;
      width: .6rem;
      height: .6rem;
      border-radius: 100%;
      background-color: @them-color;
      line-height: 28px;
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
    .v-lyr {
        height: 90px;
        text-align: center;
        overflow: hidden;
        margin: -10px 0 10px;
        opacity: 1;
        .lyr-list {
          transition: transform 0.4s ease-out;
        }
        p {
          display: block;
          font-size: 12px;
          line-height: 15px;
          color: #666;
          opacity: .4;
        }
        p.on {
          opacity: 1;
        }
      }

      .img-box{
        position: relative;
        margin: 0 auto;
        height: 300px;
        width: 300px;
        top: 18px;
        background-size: cover;
        .s-tip{
          display: inline-block;
          position: absolute;
          z-index: 10;
          top: -63px;
          left: 140px;
          height: 140px;
          width: 100px;
          background-image: url('../../static/images/s-tip.png');
          background-size: cover;
          transform: rotate(-15deg);
          transition: all .3s linear;
          -ms-transform-origin: 0 0;
          -webkit-transform-origin: 0 0;
          -moz-transform-origin: 0 0;
          -o-transform-origin: 0 0;
          &.active{
            transform: rotate(0deg)
          }
        }
        .img-ct{
          height: 300px;
          width: 300px;
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
            top: 49px;
            width: 200px;
            height: 200px;
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
        height: 50px;
        & ._icon{
          position: relative;
          top: .07rem;
          width: .4rem;
          height: .4rem;
          fill: @white;
          stroke: @white;
        }
      }
</style>
