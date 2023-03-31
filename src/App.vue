<template>
  <div id="app">
    <VideoPlayerVue :autoplay="false" :controls="false" screenshot video-record custom-controls :options="{}" :url="require('./assets/video.webm')" style="width: 700px;height: 300px;"></VideoPlayerVue>
  </div>
</template>

<script>
import VideoPlayerVue from './components/VideoPlayerVue.vue';

export default {
  name: 'video-player-vue-app',
  components: {
    VideoPlayerVue
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
