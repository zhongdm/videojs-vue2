# video-player-vue

> A video player plugin with vue2.

## public
``` bash
npm run build

npm publish --access public

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
- 以下是customControls为true的时候生效的属性
  + options - 参数配置
  + screenshot - 截图功能
  + videoRecord - 录屏功能