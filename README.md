# video-player-vue

> A video player plugin with vue2.

## public
``` bash
npm run build

npm public --access public

```
## Build Setup

``` bash
npm i videojs-vue2

import VideojsVue2 from 'videojs-vue2'
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
https://www.npmjs.com/

### Options
+ url - video的路径
+ autopay: Boolean
+ controls: Boolean
+ muted
+ loop
+ preload
+ disablepictureinpicture: Boolean
+ poster
+ customControls: Boolean - controls为false的时候生效，自定义进度条和样式等
+ options - customControls为true的时候的参数配置