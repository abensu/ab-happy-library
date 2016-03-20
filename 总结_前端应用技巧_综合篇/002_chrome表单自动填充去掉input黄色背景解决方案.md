方法1：重置文本框自动填充时的样式

```
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset; /* 必须要有颜色，使用 rgba(0,0,0,0) 是无效的 */
    border: 1px solid #CCC!important;
}
```

方法2：屏蔽文本框的自动填充功能

```
<input type="text" autocomplete=”off”/>
```

> 如果文本框里面有较为复杂的背景（不是纯色、多渐变），可能需要屏蔽


来源：[http://blog.csdn.net/wangxiaohui6687/article/details/10149579](http://blog.csdn.net/wangxiaohui6687/article/details/10149579)