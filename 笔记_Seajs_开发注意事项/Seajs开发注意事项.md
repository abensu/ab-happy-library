# [Seajs](https://github.com/seajs/seajs)开发注意事项

## 1、路径设置

目录结构

	website
		|-- index.html  
		`-- scripts
				|-- sea.js
				`-- helloworld.js
				
helloworld.js

	define(function(require, exports, module) {
		exports.helloworld = function() {
			alert("Hello World!");
		};
	});
	
index.html

	<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>测试</title>
    </head>
    <body>
        <script type="text/javascript" src="/scripts/sea.js"></script>
        <script type="text/javascript">
        
        	// 绝对路径
            seajs.use(['/scripts/helloworld'], function(hw){
                hw.helloworld();
            });
            
            // 相对路径
            seajs.use(['helloworld'], function(hw){
                hw.helloworld();
            });
        </script>
    </body>
    </html>
    
**由于默认情况下，`seajs.config`中的`base`会设置为`sea.js`文件所在的目录，所以采用相对路径引入文件时，`use`中的路径是以`http://localhost/scripts/`或者`/usr/desktop/website/scripts/`等为基础的路径，使用时请小心**


## 2、define(id, dependences, callback)中，id在产品环境下的重要作用

目录结构

	website
		|-- index.html  
		`-- scripts
				|-- sea.js
				`-- helloworld.js

### 》开发环境（Developement）

helloworld.js

	define(function(require, exports, module) {
		exports.helloworld = function() {
			alert("Hello World!");
		};
	});
	
index.html

	<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>测试</title>
    </head>
    <body>
        <script type="text/javascript" src="/scripts/sea.js"></script>
        <script type="text/javascript">
        
            seajs.use(['/scripts/helloworld'], function(hw){
                hw.helloworld();
            });
        </script>
    </body>
    </html>

### 》产品环境（Production）

helloworld.js

	define(function(require, exports, module) {
		exports.helloworld = function() {
			alert("Hello World!");
		};
	});
	
index.html

	<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>测试</title>
    </head>
    <body>
        <script type="text/javascript" src="/scripts/sea.js"></script>        
        <script type="text/javascript">

            seajs.use(['/scripts/helloworld'], function(hw){
                hw.helloworld();
            });
            
        </script>
        <script>
        
        	// helloworld.js的内容合并到页面中，以此减少http请求
        	define('/scripts/helloworld', function(require, exports, module) {
				exports.helloworld = function() {
					alert("Hello World!");
				};
			});
			
        </script>
    </body>
    </html>
    
* `define`负责注册，将`id`和函数注册到seajs中，`use`负责调用对应`id`的函数；

* 可以理解为，`id`在**开发环境**中充当[url](#)，（建议）在**产品环境**（上线产品）中充当[唯一标识](#)。引用官网的原话：

	> Sea.js 的模块启动接口秉承的是路径即 ID 的设计原则


* 以下情况的id实际是一样的：

	```
	seajs.use(['call'], function(call){
		call.callPython(); // 返回"Call Her Python"，而非"Call Your Python"
	});
	
	seajs.use(['/scripts/call'], function(call){
		call.callPython(); // 返回"Call Her Python"，而非"Call Your Python"
	});

	define('/scripts/call', function(require, exports) {

		function callPython() {
			alert("Call Her Python");
		};

		exports.callPython = callPython;
	});

	define('call', function(require, exports) {

		function callPython() {
			alert("Call Your Python");
		};

		exports.callPython = callPython;
	});
	```

	上例说明了两点：

	1. 真实的id是`seajs.config.base + define id`，所以无论以相对还是绝对路径进行命名，最后都以绝对路径为准
	
	2. [当前页](#)的define[高于](#)文件[引入](#)的define，当前页[越前](#)的define[高于](#)当前页[越后](#)的define

* 而要实现这种合并功能，可使用 [seajs-combo](https://github.com/seajs/seajs-combo) + [seajs-flush](https://github.com/seajs/seajs-flush) + 服务器的相应处理（对`http://localhost/scripts/??a.js,b.js,c.js,d.js`这种类型的请求进行文件合并处理），这样可以有效减少http请求的数量；

**建议在开发环境中也要将`id`设置好，同理，如果module存在依赖，`dependences`也要设置好**


## 3、seajs.config(options) seajs配置方法

```
seajs.config({

	// 别名配置
	alias: {
		'es5-safe': 'gallery/es5-safe/0.9.3/es5-safe',
		'json': 'gallery/json/1.0.2/json',
		'jquery': 'jquery/jquery/1.10.1/jquery'
	},

	// 路径配置
	paths: {
		'gallery': 'https://a.alipayobjects.com/gallery'
	},

	// 变量配置
	vars: {
		'locale': 'zh-cn'
	},

	// 映射配置
	map: [
		['http://example.com/js/app/', 'http://localhost/js/app/']
	],

	// 预加载项
	preload: [
		Function.prototype.bind ? '' : 'es5-safe',
		this.JSON ? '' : 'json'
	],

	// 调试模式
	debug: true,

	// Sea.js 的基础路径
	base: 'http://example.com/path/to/base/',

	// 文件编码
	charset: 'utf-8'
});
```

常用的配置项是 alias、paths、base，其他配置项有需要时，具体可查看[文档](https://github.com/seajs/seajs/issues/262)。


## 4、相关插件及其使用实例

### seajs-text

> 文本插件

> 在 JavaScript 中嵌入 HTML 模板很不方便，特别是当模板内容有多行时。有了 Sea.js, 一切迎刃而解。

实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-text.js"></script>

	<script>
		define("main", function(require) {

			// You can require `.tpl` file directly
			var tpl = require("./data.tpl")

		})
	</script>

[注意事项](https://github.com/seajs/seajs-text/issues/1)

===

### seajs-style

> 样式插件

> importStyle 方法会创建一个 style 元素，并将其内容设置为 cssText，然后插入到当前文档中。
值。

实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-style.js"></script>

	<script>

		// seajs has importStyle method after loading style plugin.
		// 使用后会生成：
		// <style>body { margin: 0}</style>
		seajs.importStyle("body { margin: 0 }");

	</script>
	
[注意事项](https://github.com/seajs/seajs-style/issues/1)

===

### seajs-combo（重要）

> combo 插件

> 减少 HTTP 请求数是性能优化中非常重要的一条准则。使用 combo 插件，配合服务器的 nginx-http-concat 服务（安装指南），可自动对同一批次的多个模块进行合并下载。

实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-combo.js"></script>

	<script>
		// The requests of a.js and b.js are combined to `http://test.com/path/to/??a.js,b.js`
		seajs.use(['a', 'b'], function(a, b) {
    		// ...
		});
		
		// The requests of a.js and b.js are combined to `http://test.com/path/to/??c.js,d.js`
		seajs.use(['c', 'd'], function(c, d) {
    		// ...
		});
	</script>
	
[注意事项](https://github.com/seajs/seajs-combo/issues/3)

===

### seajs-flush（重要）

> flush 插件

> 通过 combo 插件，我们可以对同一数组中的加载项进行合并加载。通过 flush 插件，我们可以更进一步减少 HTTP 请求数。

实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-combo.js"></script>
	<script src="path/to/seajs-flush.js"></script>

	<script>
		seajs.use(['a', 'b'], function(a, b) {
			// ...
		})

		seajs.use(['c', 'd'], function(c, d) {
			// ...
		})

		// The combined request is http://test.com/path/to/??a.js,b.js,c.js,d.js
		seajs.flush()
	</script>

[注意事项](https://github.com/seajs/seajs-flush/issues/7)

===

###  seajs-debug

> 调试插件

> Sea.js 非常在意代码的可维护性，下面是用于开发调试的插件。


实例

第一步：设置seajs配置文件的别名

	seajs.config({
		"alias": {
			"seajs-debug": "path/to/seajs-debug"
		}
	})

第二步：为uri添加“?seajs-debug”，刷新后，调试浮动框则会出现在页面上

![sea.js debug console](https://f.cloud.github.com/assets/36899/1065557/07956652-1394-11e3-8d78-12d76597bd98.png)

[注意事项](https://github.com/seajs/seajs-debug/issues/4)

===

### seajs-log

> console插件

> 为的是上线后，如果某个浏览器不支持 console ，代码不会抛错。


实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-log.js"></script>

	<script>

		seajs.log('hello world')

	</script>
	
[注意事项](https://github.com/seajs/seajs-log/issues/1)

===

### seajs-health

> 多版本共存-探察插件

> 通过 health 插件，可以分析当前页面模块的健康情况。

实例

	<script src="path/to/sea.js"></script>
	<script src="path/to/seajs-health.js"></script>

	<script>

		// You can use seajs.health method to collecting health data.
		var healthData = seajs.health()

	</script>
	
[注意事项](https://github.com/seajs/seajs-health/issues/2)

