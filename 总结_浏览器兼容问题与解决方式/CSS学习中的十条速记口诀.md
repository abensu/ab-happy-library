# CSS学习中的十条速记口诀


## 1、IE边框若显若无，须注意，定是高度设置已忘记

> 注释:在IE下，如果边框若显若无，那肯定是忘记设置高度了。


## 2、浮动产生有缘故，若要父层包含住，紧跟浮动要清除，容器自然显其中

  如果浮动的子元素要被外面的父层元素包含住，那么就要在父元素中的某个地方添加一条clear:both;的样式，那么浮动的子元素就会出现在父元素中了。

```
.news {
    background-color: gray;
    border: solid 1px black;
}
.news img {float: left;}
.news p {float: right;}
.clear {clear: both;} /* 该处添加一条清除浮动样式*/
<div class="news">
    <img src="news-pic.jpg" />
    <p>some text</p>
    <div class="clear"></div> <!--清除浮动-->
</div>
```

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=30f2d797ce1b9d168ac79a69c3dfb4eb/2fcceffdfc03924590bca4478794a4c27d1e256b.jpg)


## 3、三像素文本慢移不必慌，高度设置帮你忙

> 当文本与一个浮动元素相邻时,在IE6下会出现文本和元素间会出现一个3像素间隙的bug.

```
<style type="text/css">
/*解决IE6下3像素bug */
* html p { height:1%; margin-left:0;}
* html .myFloat { margin-right:-3px;}
.myFloat {
    float:left;
    width:200px;
    height:200px;
    background:lightgreen;
}
p {
    margin-left:200px;
    background:lightblue;
}
</style>
<div class="myFloat"></div>
<p >ooooooooooooooo
<br />ogqetonbqew;fljaioftrddd
<br />ddddfaeeeeeeeeeeeeeeedass
<br />ssssssdddddddddddddd
<br />dddddddddddddddddddddddddd
</p>
```

添加样式前（IE6）：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=f2107b6990ef76c6d0d2fb23ad17fdf6/ab129512c8fcc3ced430607b9245d688d53f208c.jpg)

添加样式后：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=99aaeef34710b912bfc1f6f6f3fcfcb5/a692da03738da9776da92f63b051f8198718e3f3.jpg)


## 4、兼容各个浏览须注意，默认设置行高可能是杀手

> 各浏览器的默认行高不同，设置行高最好设置为具体的数字如lineheight:30px;之类的，避免设置lineheight:30%;之类的，因为浏览器的默认行高不同，所以最终显示效果可能不同。


## 5、独立清除浮动须铭记，行高设无，高设零，设计效果兼浏览

> 空标签可以是div标签，也可以是P标签，也有很多人用&lt;hr&gt;，只是需要另外为其清除边框，但理论上可以是任何标签。这种方式是在需要清除浮动的父级元素内部的所有浮动元素后添加这样一个标签清除浮动，并为其定义CSS代码：clear:both。此方法的弊端在于增加了无意义的结构元素。

```
<style type=”text/css”>
* {margin: 0;padding: 0;}
body {font: 36px bold;color: #F00;text-align: center;}
.layout {background:#FF9;}
.left {float:left;width:20%;height:200px;background:#DDD;line-height:200px;}
.right {float:right;width:30%;height:80px;background:#DDD;line-height:80px;}
.clr {clear:both;}
</style>

<div class="layout">
<div class="left">Left</div>
<div class="right">Right</div>
<p class="clr"></p>
</div>
```

清除前：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=9880fd1834a85edffa8cfe2b795509d8/6dc915dbb6fd5266f4a7a85cab18972bd50736e8.jpg)

清除后：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=4070741a8535e5dd902ca5d746c7a7f5/56a3e111728b4710b6a06984c3cec3fdfd0323e9.jpg)


## 6、学布局须思路，路随布局原理自然直，轻松驾驭html，流水布局少hack，代码清爽，兼容好，友好引擎喜欢迎


## 7、所有标签皆有源，只是默认各不同，span是无极，无极生两仪——内联和块级，img较特殊，但也遵法理，其他只是改造各不同，一个*号全归原，层叠样式理须多练习，万物皆规律


## 8、图片链接排版须小心，图片链接文字链接若对齐，padding和vertical-align:middle要设定，虽差微细倒无妨


## 9、IE浮动双边距，请用display：inline拘

什么是双边距Bug？先看图：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=7fb825b57b899e51788e3a1c72a6d990/e6792e087bf40ad1289b31ab572c11dfa9ecce7a.jpg)

我们要让绿色盒模型在蓝色盒模型之内向左浮动，并且距蓝色盒模型左侧100像素。这个例子很常见，比如在网页布局中，侧边栏靠左侧内容栏浮动，并且要留出内容栏的宽度。要实现这样的效果，我们给绿色盒模型应用以下CSS属性：

```
.floatbox {
    float: left;
    width: 150px;
    height: 150px;
    margin: 5px 0 5px 100px;
    /*外边距的最后一个值保证了100像素的距离*/
}
```

但是当我们在IE6中查看时，会发现左侧外边距100像素，被扩大到200个像素。如下图：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=e577ca8f90529822053339cbe7cb7b3b/61122de93901213f1b5ab89454e736d12f2e9514.jpg)

这种情况出现的条件是当浮动元素的浮动方向和浮动边界的方向一致时才会出现。如同上面的例子一样，元素向左浮动并且设置了左侧的外边距出现了这样的双边距bug。同理，元素向右浮动并且设置右边距也会出现同样的情况。同一行如果有多个浮动元素，第一个浮动元素会出现这个双边距bug，其它的浮动元素则不会。

如何修正这个Bug?

很简单，只需要给浮动元素加上display:inline;这样的CSS属性就可以了。就这么简单？对，就这么简单。如下图：

![photo](http://imgsrc.baidu.com/forum/w%3D580/sign=96e60e69728b4710ce2ffdc4f3cfc3b2/55036690f603738d8530fa6ab31bb051f819ec07.jpg)

CSS代码如下：

```
.floatbox {
float: left;
width: 150px;
height: 150px;
margin: 5px 0 5px 100px;
display: inline;
}
```


## 10、列表横向排版，列表代码须紧靠，空隙自消须铭记