import VideoPlayerVue from './src/components/VideoPlayerVue.vue';
import _Vue from 'vue'

VideoPlayerVue.install = Vue => {
  if (!Vue) {
    window.Vue = Vue = _Vue
  }
  Vue.component(VideoPlayerVue.name, VideoPlayerVue)
}

export default VideoPlayerVue