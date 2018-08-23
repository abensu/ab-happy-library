# iPhone X底部间隔（安全域）问题

## 场景

iPhone X 底部会有间隔问题，即使 `body` 和 `html` 的高度都为 `100%`。

## 过程

略

## 解决

最简单，给 `viewport` 添加 `viewport-fit=cover`，即 `<meta name="viewport" content="width=device-width, viewport-fit=cover">`。

CSS 属性判断，则查看参考的第一个链接。

## 参考

1. [网页适配 iPhoneX，就是这么简单](https://aotu.io/notes/2017/11/27/iphonex/)
