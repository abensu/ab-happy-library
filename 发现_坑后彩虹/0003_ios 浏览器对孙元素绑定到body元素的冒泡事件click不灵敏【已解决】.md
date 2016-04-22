# ios 浏览器对孙元素绑定到body元素的冒泡事件click不灵敏【已解决】

## 场景

如题

## 过程

[IOS上给body绑定click事件的bug](http://www.tuicool.com/articles/ZvquiiR)

[ios下Safari无法触发click事件的处理](http://www.cnblogs.com/hongchenok/p/3975689.html)

## 解决

```
$( "body" ).delegate( ".node", "click", function() {...} )
// 改为
$( ".node" ).on( "click", function() {...} )
```
