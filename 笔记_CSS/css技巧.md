# CSS技巧

## 页脚置底（兼容低版本IE）

主要代码：

```
#wrap {
	min-height:100%;
	margin-bottom:-60px;
	padding-bottom:60px; /* 预防min-height不起作用时引起的错位现象 */
}			
#footer {
	height:60px;
}
```

事例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
		...
		<style>
			#wrap {
				min-height:100%;
				margin-bottom:-60px;
				padding-bottom:60px; /* 预防min-height不起作用时引起的错位现象 */
			}

			#footer {
				height:60px;
			}
		<style>
	</head>

	<body>

		<div id="wrap">
  			...
		</div>

		<div id="footer">
  			<div class="container">
    			<p class="text-muted">
    				Place sticky footer content here.
    			</p>
  			</div>
		</div>

	</body>
</html>
```

## 元素垂直居中（兼容低版本IE）

### 块元素、行内元素、行内块元素均可【三层嵌套，复杂些】

主要代码：

```
.wrap {
	#height: 300px;
	#position: relative;
}
.wrap .inner {
	#position: absolute;
	#top: 50%;
	#left: 0;
}
.wrap .cell {
	#position: relative;
	#top: -50%;
	#left: 0;
}

.wrap {
	height: 300px;
	display: table;
}
.wrap .inner {
	display: table-cell;
	vertical-align: middle;
}
```

事例代码：

```
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<style>
			* {
				padding: 0;
				margin: 0;
			}
			.wrap {
				width: 300px;
				margin: 0 auto;
				background: #eee;
			}
		</style>
		<!--[if lte IE 7]>
		<style>
			.wrap {
				height: 300px;
				position: relative;
			}
			.wrap .inner {
				position: absolute;
				top: 50%;
				left: 0;
			}
			.wrap .cell {
				position: relative;
				top: -50%;
				left: 0;
			}
		</style>
		<![endif]-->
		<style>
			.wrap {
				height: 300px;
				display: table;
			}
			.wrap .inner {
				display: table-cell;
	 			vertical-align: middle;
			}
		</style>
	</head>

	<body>
		<div class="wrap">
			<div class="inner">
				<p class="cell">
					内容
				</p>
			</div>
		</div>
	</body>
</html>
```

### 行内元素、行内块元素【多一个尾元素，简单，块元素兼容到 IE8】

主要代码：

```
.fn_middle {
	display: inline-block;
	height: 100%;
	vertical-align: middle;
}
```

实例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        div {
	            height: 200px;
	            background: #666;
	            margin: 1%;
	        }
	        .fn_middle {
	        	display: inline-block;
	        	height: 100%;
	        	vertical-align: middle;
	        }
	    </style>
	</head>
	<body>

	    <!-- 兼容低版本 IE -->
	    <div>
	        你好吗？<i class="fn_middle"></i>
	    </div>

	    <!-- 兼容低版本 IE -->
	    <style>
	        .txt01 {display: inline-block;}
	    </style>
	    <div>
	        <span class="txt01">你好吗？<br>不是吧？</span><i class="fn_middle"></i>
	    </div>

	    <!-- 兼容 IE8 -->
	    <div>
	        <p class="txt01">你好吗？<br>不是吧？</p><i class="fn_middle"></i>
	    </div>

	</body>
</html>
```

## 元素水平居中（兼容低版本IE）

### 目标元素宽度已知，可视范围内居中，可视范围外靠左【简单好用，宽度必须已知】

主要代码：

```
.box {
	width: 1960px; /* 目标元素宽度 */
	margin: 0 auto;
}
```

事例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        * {
	            padding: 0;
	            margin: 0;
	        }
	        .box {
	            width: 1960px;
	            margin: 0 auto
	        }
	    </style>
	</head>
	<body>
	    <div class="box">
	        <img src="http://c1.kgimg.com/games/20160422/20160422101016959979.jpg">
	    </div>
	</body>
</html>
```

### 目标元素宽度已知（宽度可大于可视范围），可视范围内外均居中【两层嵌套，宽度必须已知】

主要代码：

```
.box_01 {
	position: relative;
	overflow: hidden; /* 设了会好看些，不引起 body 底部滚动条出现 */
}
.box_02 {
	position: absolute;
	left: 50%;
	margin-left: -960px; /* 一半的已知宽度 */
}
```

事例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        * {
	            padding: 0;
	            margin: 0;
	        }
	        .box_01 {
	            position: relative;
	            overflow: hidden;
	        }
	        .box_02 {
	            position: absolute;
	            left: 50%;
	            margin-left: -960px;
	        }
	    </style>
	</head>
	<body>
	    <div class="box_01">
	        <div class="box_02">
	            <img src="http://c1.kgimg.com/games/20160422/20160422101016959979.jpg">
	        </div>
	    </div>
	</body>
</html>
```

### 宽度自由，高度已知，可视范围内外均居中【三层嵌套，高度必须已知】

主要代码：

```
.box_01 {
	position: relative;
	overflow: hidden;
	height: 406px; /* 必须设置，不然高度为 0，啥都会看不到 */
}
.box_02 {
	position: absolute;
	left: 50%;
}
.box_03 {
	position: relative;;
	left: -50%;
}
```

事例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        * {
	            padding: 0;
	            margin: 0;
	        }
	        .box_01 {
	            position: relative;
	            overflow: hidden;
	            height: 406px;
	        }
	        .box_02 {
	            position: absolute;
	            left: 50%;
	        }
	        .box_03 {
	            position: relative;;
	            left: -50%;
	        }
	    </style>
	</head>
	<body>

	    <div class="box_01">
	        <div class="box_02">
	            <div class="box_03">
	                <img src="http://c1.kgimg.com/games/20160422/20160422101016959979.jpg">
	            </div>
	        </div>
	    </div>

	</body>
</html>
```

## 清除浮动

主要代码：

```
.clearfix:after {
	visibility: hidden;
	display: block;
	font-size: 0;
	content: " ";
	clear: both;
	height: 0;
}
.clearfix {
	*zoom:1;
}
```

事例代码：

```
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<style type="text/css">
			.clearfix:after {
				visibility: hidden;
				display: block;
				font-size: 0;
				content: " ";
				clear: both;
				height: 0;
			}

			.clearfix {
				*zoom: 1;
			}

			.wrap {
				background: #ccc;
			}

			.fl {
				width: 120px;
				height: 120px;
				background: #c00;
				float: left;
			}

			.fr {
				width: 300px;
				height: 300px;
				background: #0c0;
				float: right;
			}
		</style>
	</head>
	<body>
		<div class="wrap clearfix">
			<div class="fl">左边</div>
			<div class="fr">右边</div>
		</div>
	</body>
</html>
```

## 绝对定位趣用

### 无宽高 div 全屏铺满

主要代码：

```
.box {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}
```

实例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        * {
	            padding: 0;
	            margin: 0;
	        }
	        body, html {
	            height: 100%;
	        }
	        .box {
	            position: absolute;
	            left: 0;
	            right: 0;
	            top: 0;
	            bottom: 0;
	            background: #f00;
	        }
	    </style>
	</head>
	<body>
	    <div class="box"></div>
	</body>
</html>
```

### 多栏布局【不及 float 方便，但对内在的清浮免疫】

主要代码：

```
.lan {
    position: absolute;
    top: 0;
    bottom: 0;
}
.lan01 {
    left: 0;
    right: 75%;
}
.lan02 {
    left: 25%;
    right: 50%;
}
.lan03 {
    left: 50%;
    right: 25%;
}
.lan04 {
    left: 75%;
    right: 0;
}
```

实例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        * {
	            padding: 0;
	            margin: 0;
	        }
	        body, html {
	            height: 100%;
	        }
	        .lan {
	            position: absolute;
	            top: 0;
	            bottom: 0;
	        }
	        .lan01 {
	            left: 0;
	            right: 75%;
                background: #f00;
	        }
	        .lan02 {
	            left: 25%;
	            right: 50%;
                background: #0f0;
	        }
	        .lan03 {
	            left: 50%;
	            right: 25%;
                background: #00f;
	        }
	        .lan04 {
	            left: 75%;
	            right: 0;
                background: #666;
	        }
	    </style>
	</head>
	<body>
        <div class="lan lan01"></div>
        <div class="lan lan02"></div>
        <div class="lan lan03"></div>
	    <div class="lan lan04"></div>
	</body>
</html>
```

### 上标

主要代码：

```
.sub {
	position: absolute;
	margin: -0.5em 0 0 -1em;
	line-height: normal;
}
```

实例代码：

```
<!DOCTYPE html>
<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Document</title>
	    <style>
	        p {
	            line-height: 2em;
	        }
	        .sub {
	            position: absolute;
	            margin: -0.5em 0 0 -1em;
	            #margin: -0.6em 0 0 -0.6em;
	            line-height: normal;
	            color: #f00;
	            font-size: 9px;
	        }
	    </style>
	</head>
	<body>
	    <p>
	        《这是本书》<span class="sub">[1]</span>描述的是一个XXOO世界。<br>
	        《这是本书》<span class="sub">[1]</span>描述的是一个XXOO世界。
	    </p>
	</body>
</html>
```
