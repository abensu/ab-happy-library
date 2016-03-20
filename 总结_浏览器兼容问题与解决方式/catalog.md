# 浏览器兼容问题与解决方式


## 前言

案例与解决方案来自平时所遇与网络资源、书籍等提供的方案。

主要针对ie6~ie10、FF、chrome


## 书写格式

```
问题描述：xxx

不兼容的浏览器：ie6

解决方案
1、xxx
```


## 提纲

### CSS方面

1.1 (浮动与其在 ie7 及以下版本引起的双边距问题)[1_1.md]

1.2 (清除浮动)[1_2.md]

1.3 chrome 下自动填充引起的黄色背景

1.4 chrome 下表单自动填充的小问题

1.5 自定义字体

1.6 背景颜色渐变

1.7 垂直居中

1.8 水平居中

1.9 脚注固定在底部

1.10 最大/最小宽度/高度

1.11 最小文字大小

1.12 元素与元素之间的间距问题

1.13 position: fixed

1.14 ie6 下，body 为 height:100%，各种有浮动+相对定位的元素（含其子元素），会有错位现象（后面发现，即使 body 不添加 heigth:100%，float+position:relative 也会有错位现象，有些情况会出现在页面还没有完全加载时，加载后又没问题），所以如果碰到要用这两种布局，要分开两个元素各自设置（一个float、一个position）

1.15 阴影（`filter: progid:DXImageTransform.Microsoft.Shadow( color='#000000', Direction=135, Strength=2);` 只在元素为 float 或 block/inline-block，才起作用，有 background 则是 box-shadow 效果，无则是 text-shadow 效果）

1.16 Firefox（v35.0.1）下对 div 使用 fn_clearfix 的清浮动的方法，改 div 添加 margin-bottom，margin-top 也会添加相应的值，反之则不成立


### HTML方面

2.1 支持 html5 标签

2.2 结构完整性（ul/ol + li）

2.3 placeholder 的设置、字体颜色控制、上下居中


### Javascript方面

3.1 事件绑定与解绑

3.2 获取元素

3.3 document.write 引起的页面清空问题

3.4 特性检测/功能支持检测


### 浏览器

4.1 兼容模式【ie】

4.2 支持 png【ie6】

4.3 UC浏览器默认左右切换事件屏蔽【uc】

4.4 空白字符的影响【ie6】

4.5 注释型头部和 http-equiv="X-UA-Compatible" 的冲突【ie】

4.6 css3 属性的支持【ie】

4.7 滚动条

4.8 禁止选中文字【ie的用js，非ie的用css】


### 调试工具/方式

a.1 ieTester

a.2 虚拟机


## 附录

b.1 网页脚手架

b.2 引入falsh的模板