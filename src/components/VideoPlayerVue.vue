<template>
  <div class="video-main">
    <video
      ref="player"
      class="video-containter"
      :src="url"
      :loop="loop"
      :muted="muted"
      :autoplay="isAutoPlay"
      :controls="isControls"
      :poster="poster"
      :disablepictureinpicture="disablepictureinpicture"
      @loadeddata="onloadeddata"
      @loadedmetadata="onloadedmetadata"
      @play="onplay"
      @playing="onplaying"
      @volumechange="onvolumechange"
      @timeupdate="ontimeupdate"
      @pause="onpause"
      @abort="onabort"
    >
    抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以 <a :href="url">下载</a>并用你喜欢的播放器观看！
    </video>
    <div class="video-controls" v-if="!controls && !!customControls">
      <div class="video-context">
        <div class="processor-bar-container">
          <div ref="processorBar" class="video-progress-bar" @click="onClickProgressBar">
            <span ref="runningBar" class="running-bar" @click="onClickRunningBar"></span>
            <span id="processorPoint" ref="processorPoint" class="progress-point"></span>
          </div>
        </div>
        <div class="other-bar">
          <div class="bar-left">
            <div class="time-container">
            <span class="current-time">{{format(currentTime)}}</span>
            <span class="all-time">{{format(allTime)}}</span>
            </div>
            <span class="icon-span video-voice" 
              :style="{backgroundImage: 'url('+require('../assets/icon/'+ volumeIcon) + ')'}"
              @click="onvolumetoggle">
            </span>
          </div>
          <div class="bar-right">
            <span v-if="screenshot" class="icon-span video-screenshot" title="截屏"
              :style="{backgroundImage: 'url('+require('../assets/icon/camera.svg') + ')'}"
              @click="onscreenshot">
            </span>
            <span v-if="videoRecord" class="icon-span video-recording" title="录屏"
              :style="{backgroundImage: 'url('+require('../assets/icon/recording-sharp.svg') + ')'}"
              @click="onrecording">
            </span>
          </div>
          <canvas ref="canvas" v-show="false"></canvas>
        </div>
      </div>
    </div>
    <button class="play-btn toggle-show"
      :style="{backgroundImage: 'url('+require('../assets/icon/'+ bgAvatar) + ')'}"
      @click="btnClick"></button>
  </div>
</template>

<script>

export default {
  name: 'video-player-vue',
  props: {
    url: String,
    controls: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    preload: {
      type: Boolean,
      default: true
    },
    disablepictureinpicture: {
      type: Boolean,
      default: false
    },
    poster: String,
    muted: Boolean,
    customControls: {
      type: [Boolean, null, undefined],
      default: false
    },
    options: Object,
    screenshot: Boolean,
    videoRecord: Boolean,
  },
  data() {
    return {
      bgAvatar: 'play.svg',
      steps: 1, // 1s
      clickedPoint: false,
      currentTime: 0,
      allTime: 0,
      volumeIcon: 'volume_close.svg',
      mediaRecorder: null,
      recording: false
    }
  },
  computed: {
    isAutoPlay() {
      return this.autoplay ? 'autoplay' : null
    },
    isControls() {
      return this.controls ? 'controls' : null
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
    if (!this.controls && !!this.customControls) {
      this.$refs.processorPoint.addEventListener('mousedown', this.onMouseDown)
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    }
  },
  methods: {
    format(time) {
      let mm = Math.floor(time / 60)
      mm = mm < 10 ? '0' + mm : mm
      let sec = Math.floor(time % 60)
      sec = sec < 10 ? '0' + sec : sec
      return mm + ':' + sec
    },
    onvolumechange(args) {
    },
    onloadeddata(args) {
      const player = args.target;
      this.toggleVolume(player)
      this.allTime = args.target.duration
    },
    onloadedmetadata(args) {
      const player = args.target;
      this.toggleVolume(player)
      this.allTime = args.target.duration
      if (this.videoRecord) {
        this.loadRecorder()
      }
    },
    onplay(args) {
      this.bgAvatar = 'pause.svg';
      this.updatePointPosition();
    },
    onplaying(args) {
      this.currentTime = args.target.currentTime
      this.updatePointPosition();
    },
    onabort(args) {
      this.bgAvatar = 'play.svg';
    },
    onpause(args) {
      this.bgAvatar = 'play.svg';
    },
    ontimeupdate(args) {
      this.currentTime = args.target.currentTime
      this.updatePointPosition();
    },
    onvolumetoggle(args) {
      const player = this.$refs.player;
      player.volume = player.volume === 1 ? 0 : 1
      this.toggleVolume(player)
    },
    toggleVolume(player) {
      player.muted = player.volume === 0 ? true : false
      this.volumeIcon = player.volume === 0 ? 'volume_close.svg' : 'volume.svg'
    },
    onscreenshot(args) {
      const video = this.$refs.player
      const vWidth = video.clientWidth
      const vHeight = video .clientHeight;

      const canvas = this.$refs.canvas
      canvas.width = vWidth
      canvas.height = vHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, vWidth, vHeight)

      const imgUrl = canvas.toDataURL('image/png')
      this.downloadImage(imgUrl, 'screenshot.png')
    },
    downloadImage(imgUrl, filename) {
      const link = document.createElement('a')
      link.href = imgUrl
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    onrecording() {
      this.recording = !this.recording
      if (this.recording) {
        console.log('开始录制')
        this.mediaRecorder.start(1000)
      } else {
        console.log('结束录制')
        this.mediaRecorder.stop()
      }
    },
    loadRecorder() {
      const video = this.$refs.player
      const videoData = []
      this.mediaRecorder = new MediaRecorder(video.captureStream(25))

      this.mediaRecorder.ondataavailable = (e) => {
        videoData.push(e.data)
      }

      this.mediaRecorder.onstop = (e) => {
        const blob = new Blob(videoData, { type: 'video/webm;codecs=vp8,opus'})
        const videoUrl = window.URL.createObjectURL(blob)
        this.downloadImage(videoUrl, '录屏.webm')
      }
    },
    btnClick(evt) {
      const player = this.$refs.player;
      if (player.paused) {
        player.play();
        this.bgAvatar = 'pause.svg';
      } else {
        player.pause();
        this.bgAvatar = 'play.svg';
      }
    },
    onClickProgressBar (event) {
      console.log('pb')
      if (event.target.childNodes.length) {
        this.updateTime(event.offsetX, event.target.clientWidth, event.target.childNodes[0])
      }
    },
    onClickRunningBar(event) {
      console.log('rn')
      event.stopPropagation()
      this.updateTime(event.offsetX, event.target.parentNode.clientWidth, event.target)
    },
    onKeyDown(event) {
      switch(event.keyCode) {
        case 37: // left
          this.$refs.player.currentTime -= 1
          break;
        case 39: // right
          this.$refs.player.currentTime += 1
          break;
        case 32: // space
          this.btnClick(event)
          break
      }
    },
    onMouseDown(event) {
      this.clickedPoint = true
    },
    onMouseUp(event) {
      this.clickedPoint = false
    },
    onMouseMove(event) {
      if (this.clickedPoint) {
        event.preventDefault();
        const barReact = this.$refs.processorBar.getBoundingClientRect();
        const movedPos = event.clientX - barReact.left;
        const target = this.$refs.processorBar
        this.updateTime(movedPos, target.clientWidth, target.childNodes[target.childNodes.length-1])
      }
    },
    updateTime(pointX, barX, event) {
      const percent = pointX / barX;
      const truePercent = (barX + 0) / barX
      const cutPercent = 12 / barX
      if (percent >= 0 && percent <= truePercent) {
        event.style.left = (percent - cutPercent) * 100 + '%';
        this.$refs.player.currentTime = percent * this.$refs.player.duration
        this.$refs.runningBar.style.width = percent * 100 + '%';
      }
    },
    updatePointPosition() {
      const currentPercent = this.$refs.player.currentTime / this.$refs.player.duration * 100 + '%'
      this.$refs.processorPoint.style.left = currentPercent;
      this.$refs.runningBar.style.width = currentPercent;
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
    this.$refs.processorPoint.removeEventListener('mousemove', this.onMouseMove)
  }
}
</script>

<style>
.video-main {
  position: relative;
  width: 500px;
  height: 400px;
  margin: 0 auto;
  background: #000;
}
.video-main:hover {
  cursor: pointer;
}
.video-containter {
  width: 100%;
  height: 100%;
}
.play-btn {
  position: absolute;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
}
.video-main .toggle-show, .toggle-show {
  display: none;
  cursor: none;
}
.video-main:hover .toggle-show, .toggle-show:hover{
  display: block;
  cursor: pointer;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, .5));
  border-radius:8px;
}

.video-controls {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.video-context {
  /* display: none; */
  width: 100%;
  height: 4px;
  position: absolute;
  bottom: 0;
}
.video-controls:hover .video-context {
  display: block;
  height: 40px;
}
.video-controls .processor-bar-container {
  position: absolute;
  bottom: -1px;
  width: 100%;
  height: 100%;
  background: transparent;
}
.video-controls .video-progress-bar {
  width: 100%;
  height: 100%;
  background: #696969;
}
.video-controls:hover .video-progress-bar {
  position: absolute;
  width: 96%;
  left: 2%;

}
.video-controls .video-progress-bar .progress-point{
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: -8px;
  background: #00AEEC;
  display: none;
}
.video-controls:hover .processor-bar-container {
  top: 20%;
  height: 8%;
}
.video-controls:hover .processor-bar-container:hover {
  height: 10%;
}
.video-controls:hover .processor-bar-container:hover .video-progress-bar:hover {
  height: 100%;
}
.video-controls:hover .video-progress-bar:hover .progress-point{
  display: block;
  height: 12px;
}
.running-bar {
  display: block;
  bottom: 40%;
  width: 0;
  height: 100%;
  background:#00AEEC;
}
/** currentTime **/
.video-controls:hover .other-bar {
  position: absolute;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  bottom: 10%;
  left: 2%;
  font-size: .8rem;
}
.other-bar .bar-left,
.other-bar .bar-right {
  display: flex;
  gap: 1rem;
}
.other-bar .time-container {
  color: #fff;
}
.icon-span {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
}
.icon-span {
  cursor: pointer;
}
.video-voice {
  /* display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain; */
}
</style>
