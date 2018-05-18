# oppo 手机 app 内 webview 闪屏

## 场景

OPPO 手机上，在酷狗唱模块的 webview 打开 `http://acsing.kugou.com/sing7/vue/dist/downktv/index.html`，拖动屏幕、`setTimeout`、`setInterval`、`animation css` 等都会引起 webview 中部分或全部图片（`img` 标签、`background-image css`）闪烁。

## 过程

略过

## 解决

给某个元素（`html`、`body`除外，因为有可能会导致 `fixed` 无效等问题）设置带 3D 效果的样式，如：

```
.header {
    /* bugfix：促发硬件加速，避免 oppo 手机出现闪屏现象 */
    -webkit-transform:translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
```

## 原理

促发硬件加速（GPU）修复渲染问题
