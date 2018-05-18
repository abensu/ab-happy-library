# oppo 手机 app 内 webview 闪屏

## 场景

OPPO 手机上，在酷狗唱模块的 webview 打开 `http://acsing.kugou.com/sing7/vue/dist/downktv/index.html`，拖动屏幕、`setTimeout`、`setInterval`、`animation css` 等都会引起 webview 中部分或全部图片（`img` 标签、`background-image css`）闪烁。

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

## 解决

## 参考

1. [硬件加速引发的bug（关闭硬件加速即可解决）](https://blog.csdn.net/lamp_zy/article/details/51536746)

1. [【报Bug】安卓5.0页面打开，会有非常严重的闪屏现象，求解决？？？](http://ask.dcloud.net.cn/question/6521)

1. [Android WebView 在开发过程中有哪些坑？](https://www.zhihu.com/question/31316646)
