# oppo 手机 app 内 webview 闪屏

## 场景

OPPO R9M 手机上，在酷狗唱模块的 `webview` 打开 `http://acsing.kugou.com/sing7/vue/dist/downktv/index.html` 时。

第一次打开没有问题，退出页面，再进入页面，页面会开始闪烁，触控（拖动、点击等）屏幕、`setTimeout`、`setInterval`、`animation css` 等都会引起 `webview` 中部分或全部图片（`img` 标签、`background-image css`）闪烁。

## 过程

### 阶段一

开始以为可以通过 **促发硬件加速（GPU）修复渲染问题**，手段就是给某个元素（`html`、`body`除外，因为有可能会导致 `fixed` 无效等问题）设置带 3D 效果的样式，如：

```
.header {
    /* bugfix：促发硬件加速，避免 oppo 手机出现闪屏现象 */
    -webkit-transform:translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
```

发现然并卵。。。

### 阶段二

发现另一页面不会出现闪烁问题（`http://res.ktv.mobile.kugou.com/Assets/h5/ktv_h5_test/index.html?kg_page_type=1&tid=0`），该页面是通过 canvas 进行 webgl 绘图的，估计可以试试用 canvas 每帧绘制一次图试试。

### 阶段三

在查 bug 时发现，图片资源返回的头信息不带有缓存字段 `Last-Modified` 等，不会出现闪屏现象。

会有闪屏的头信息：

```
Accept-Ranges: bytes
Connection: keep-alive
Content-Length: 11517
Content-Type: image/png
Date: Mon, 21 May 2018 08:18:44 GMT
Keep-Alive: timeout=20
KG-Via: Https2.0SD-T-98-28
Kugou-Memory: HIT
Kugou-Memory: HIT
Last-Modified: Mon, 14 May 2018 04:04:21 GMT
Server: KugouCDN
```

不会有闪屏的头信息（Fiddler 配置跳转本地资源，所产生的头信息）：

```
Cache-Control: max-age=0, must-revalidate
Content-Length: 11517
Content-Type: image/png
Date: Mon, 21 May 2018 09:35:45 GMT
```

## 解决

1. 针对 `background-image` 闪屏，图片路径必须是动态时间戳，禁止读取缓存中的图片资源，如：

    ```
    some_element.style.backgroundImage = 'url(/path/to/some_img.png?' + ( +new Date ) + ')'
    ```

1. 针对 `img` 元素闪屏，可使用上者，或使用 `canvas` 的 `2d` 绘图，绘制图片，元素上的 `width` 和 `height` 建议设置为原图宽高，如：

    ```
    <canvas width="325" height="570" data-img="http://static.5sing.kugou.com/topic/downktv/images/renwu.png" class="person"></canvas>

    ...

    let d_canvas_list = document.querySelectorAll( 'canvas[data-img]' );

    for ( var i = d_canvas_list.length; i--; ) {

        let n_canvas = d_canvas_list[ i ];

        let n_ctx = n_canvas.getContext( '2d' );

        let d_img_url = n_canvas.dataset.img;

        let n_img = new Image;

        n_img.src = d_img_url;

        n_img.addEventListener( 'load', function () {

            n_ctx.drawImage( n_img, 0, 0 );

        }, false );
    }
    ```

1. 服务器返回的头信息，不含有 `Last-Modified` 等促发客户端缓存的信息（和第一点同理，不过因为服务端不能更改设置，所以这条仅供参考）

1. 页面单张的图片最好控制在 `100kb` 以内，面积不要太大（感觉 `png` 图片越多越大越容易促发硬件加速，导致这个灵异问题）

## 分析

大面积或大体积的图片，在使用缓存进行绘制时，可能会引起 `app` 内 `webview` 的绘图优化，促发硬件加速。

但 OPPO R9M 的硬件加速，在读取缓存图片并进行绘制时会有 bug，导致触控页面、`css animation`、`setInterval`、`setTimeout` 引起重绘时掉帧，而且机身背后的温度会越来越高。

暂时的解决方式是，强制使用 `canvas` 进行 `2d` 绘图，或给图片设置动态时间戳。

## 参考

1. [硬件加速引发的bug（关闭硬件加速即可解决）](https://blog.csdn.net/lamp_zy/article/details/51536746)

1. [【报Bug】安卓5.0页面打开，会有非常严重的闪屏现象，求解决？？？](http://ask.dcloud.net.cn/question/6521)

1. [Android WebView 在开发过程中有哪些坑？](https://www.zhihu.com/question/31316646)
