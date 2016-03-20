# 总体架构

```
(function( window, undefined ) {

    // 构造jQuery对象

    var jQuery = function( selector, context ) {

        return new jQuery.fn.init( selector, context, rootjQuery );

    }

    // 工具函数 Utilities

    // 异步队列 Deferred

    // 浏览器测试 Support

    // 数据缓存 Data

    // 队列 queue

    // 属性操作 Attribute

    // 事件处理 Event

    // 选择器 Sizzle

    // DOM遍历

    // DOM操作

    // CSS操作

    // 异步请求 Ajax

    // 动画 FX

    // 坐标和大小

    window.jQuery = window.$ = jQuery;

})(window);
```

[来源](http://nuysoft.iteye.com/blog/1177451)