<template>
  <div class="center">
    <div class="audio-component" id="my-audio">
      <audio :src="audio_url" controls 
      @timeupdate.native="timeUpdate($event)" 
      ref="music"
      @canplay="updateTime()"
      v-show="false"></audio>
      <div class="img-box">
        <span class="s-tip" :class="{active:is_play}"></span>
        <div class="img-ct" :class="{active:is_play}">
          <img :src="audio_img" alt="">
        </div> 
      </div>
      <span>{{cur_txt}}</span>
      <div class="time-line"></div>
      <span>{{resultTime}}</span>
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
        <span data-role="audio-play-prev" class="audio-play-prev">&lt;</span>
        <b class="play" 
        :class="{active:is_play}"
        @click="toggelPlay($event)"></b>
        <span data-role="audio-play-next" class="audio-play-next">&gt;</span>
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
        cur_txt: null,
        nowTime: null,
        allTime: null,
        set: null,
        lyrList: [],
        lyr: '',
        base_audio: '../../static/musics',
        audio_url: '../../static/musics/zqzm/孙楠,许茹芸 - 真情真美.mp3',
        lrc_url: '../../static/musics/zqzm/孙楠,许茹芸 - 真情真美.lrc',
        audio_img: '../../static/musics/zqzm/zqzm.png'
        // audio_url: '../../static/musics/tn/罗大佑 - 童年.mp3',
        // lrc_url: '../../static/musics/tn/罗大佑 - 童年.lrc',
        // audio_img: '../../static/musics/tn/tn.png'
      }
    },
    created () {
      let self = this
      self.getLrc(function (data) {
        console.log(JSON.stringify(data.data))
        // self.lrc = self.parseLyric(data.data)
        self.lyr = data.data
        console.log('当前')
        console.log(self.lrc)
        self.lyrList = [
          {
            min: 999,
            sec: 999,
            ms: 999,
            total: 999,
            txt: '歌词正在疯狂加载中...'
          }
        ]
      })
    },
    mounted  () {
      const self = this
      let audio = self.$refs.music
      // 得到播放音乐的时间
      audio.addEventListener('loadeddata', function () {
        let audioDuration = audio.duration
        let audioCurrentTime = audio.currentTime
        self.allTime = audioDuration
        self.nowTime = audioCurrentTime
      }, false)
      self.nowTime = 0
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
      updateTime () {
        this.nowTime = this.$refs.music.currentTime
        this.allTime = this.$refs.music.duration
      },
      // 开始计时 并更新时间
      start () {
        if (this.songname === '') {
          return false
        }
        this.set = setInterval(() => {
          // 更新时间
          this.updateTime()
          // 更新展示歌词
          this.updateLyr()
        }, 100)
      },
      // 暂停计时
      stop () {
        clearInterval(this.set)
      },
      toggelPlay (e) {
        let self = this
        let audioDom = e.target.parentNode.parentNode.getElementsByTagName('audio')[0]
        if (!self.is_play) {
          audioDom.play()
          self.is_play = true
          self.start()
          self.showLyr()
          self.updateTime()
        } else {
          audioDom.pause()
          self.is_play = false
          self.stop()
        }
      },
      getLrc (callback) {
        let self = this
        this.$http.get(self.lrc_url).then(function (data) {
          console.log(data)
          if (typeof callback === 'function') {
            callback(data)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      timeUpdate (e) {
        let self = this
        let curAudioDom = e.target
        curAudioDom.addEventListener('timeupdate', () => {
          if (curAudioDom.currentTime > self.lrc[1][0]) {
            let self = this
            self.lrc = self.lrc[1][1]
            self.cur_txt = self.lrc
            self.lrc.shift()
          }
        }, false)
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
    font-size: .3rem;
    .history_right{
      fill: #aaa;
      width: 40px;
      height: 40px;
    }
  }

  .audio-component{
      // height: 60px;
      line-height: 60px;
      width: 300px;
      margin: 100px auto;
      text-align: center;
      border-radius: 2px;
    }
    .play{
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #f5f5f5;
      border-radius: 100%;
      cursor: pointer;
      text-align: center;
      &:before{
        top: 5px;
        left: 5px;
        display: inline-block;
        position: relative;
        content: ' ';
        height: 0;
        width: 0;
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent @them-color;
        
      }
      &.active:before{
        top: -1px;
        left: -4px;
        display: inline-block;
        content: '||';
        border: none;
        color: @them-color;
      }
    }
    .audio-play-prev,
    .audio-play-next{
      position: relative;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      background-color: @them-color;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      transition: background-color .2s linear;
      color: @white;
    }
    .audio-play-prev:hover,
    .audio-play-next:hover {
      background-color: #eaeaea;
      transition: background-color .2s linear;
    }
    .audio-play-prev{
      left: -70px;
    }
    .audio-play-next{
      left: 70px;
    }

    .v-lyr {
        height: 90px;
        background: #fff;
        text-align: center;
        overflow: hidden;
        margin: -10px 0 7px;
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
        height: 200px;
        width: 200px;
        top: 18px;
        background-size: cover;
        .s-tip{
          display: inline-block;
          position: absolute;
          z-index: 10;
          top: -63px;
          left: 38px;
          height: 100px;
          width: 100px;
          background-image: url('../../static/images/s-tip.png');
          background-size: cover;
          transform: rotate(-20deg);
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
          height: 200px;
          width: 200px;
          border-radius: 100%;
          background-image: url('../../static/images/s-cicle.png');
          background-size: cover;
          &.active{
            animation:cicle 10s infinite;
            -webkit-animation:cicle 10s linear infinite;
            -moz-animation:cicle 10s linear infinite;
            -ms-animation:cicle 10s linear infinite
          }
          img{
            position: relative;
            top: 35px;
            width: 135px;
            height: 135px;
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
      }

</style>
