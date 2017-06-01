# video 全屏控制

## 来源

* [video 标签在微信浏览器的问题解决方法](http://www.bubuko.com/infodetail-1918217.html)

* [html5--移动端视频video的android兼容，去除播放控件、全屏等](https://segmentfault.com/a/1190000006857675)

## 属性

* `style="object-fit:fill"`：加这个style会让 Android / web 的视频在微信里的视频全屏，如果是在手机上预览，会让视频的封面同视频一样大小

* `webkit-playsinline="true"` 或 `playsinline="true"`：这个属性在 ios 10 中设置，可以让视频在小窗内播放，而不是全屏播放

* `x-webkit-airplay="true"`：未知

* `x5-video-player-type="h5"`：启用 H5 播放器,是 wechat 安卓版特性，启用后可在 video 上层放 DOM 元素（不过在安卓机上测，来回退出进入视频全屏 3 次后，webview cash 掉。。。，用了这个属性就会全屏，不一定要和 `x5-video-player-fullscreen="true"` 同时使用）

* `x5-video-orientation="portraint"`：播放器支付的方向，landscape横屏，portraint竖屏，默认值为竖屏

* `x5-video-player-fullscreen="true"`：全屏设置，设置为 true 是防止横屏

* `preload="auto"`：这个属性规定页面加载完成后载入视频

## 事件

* `ended` 和 `timeupdate` 在手机浏览器表现上，表现趋于统一