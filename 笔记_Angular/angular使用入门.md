# Angular使用入门

## 1. 结构与对应angular变量的解释

### 1.1. Lv1 结构（基本结构）

```
<!doctype html>
<html lang="en" ng-app>
	<head>
		<meta charset="UTF-8">
		<title>Lv1</title>
	</head>

	<body>
		{{1 + 2}}
		
		<script src="lib/angular/1.2/angular.min.js"></script>
	</body>
</html>
```

注意事项：

* `ng-app`（必须）：锁定angular的UI作用区域，可以是`html`、`body`、`div`等元素

* 引入`angular.js`文件

===

### 1.2. Lv2 结构（常规结构）

```
<!doctype html>
<html lang="en" ng-app>
	<head>
		<meta charset="UTF-8">
		<title>Your Shoping Cart</title>
	</head>

	<body ng-controller="CartController">
		<h1>Your Order</h1>
		<div ng-repeat="item in items">
			<span>{{item.title}}</span>
			<input type="text" ng-model="item.quantity" />
			<span>{{item.price | currency}}</span>
			<span>{{item.price * item.quantity | currency}}</span>
			<button ng-click="remove($index)">Remove</button>
		</div>
		
		<script src="lib/angular/1.2/angular.min.js"></script>
		<script>
			var CartController = ['$scope', function($scope) {
				$scope.items = [
					{title: 'Paint pots', quantity: 8, price: 3.95},
					{title: 'Polka dots', quantity: 17, price: 12.95},
					{title: 'Pebbles', quantity: 5, price: 6.95}
				];

				$scope.remove = function(index) {
					$scope.items.splice(index, 1);
				};
			}];
		</script>
	</body>
</html>
```

注意事项：

* `{{...}}`：angular表达式作用域，用于进行数据绑定（单向关系，只读）、逻辑运算等

* `{{...}}`的`currency`：内置的货币过滤器，实现美元格式化

* `ng-controller`：控制器，管理所在区域（这里是`body`）的所有内容，包括函数依赖（这里是`$scope`）、数据模型（这里是`$scope.items`）、事件（这里是`$scope.remove`）、双向绑定关系等

* `ng-model`：数据绑定（双向关系，读写），一般与可编辑组件（如表单组件、）组合使用

* `ng-repeat`：重复使用的模板元素

* `ng-repeat`的`$index`：`ng-repeat`的循环计数

* `ng-click`：点击事件

* `$scope`：控制器（这里是`CartController`）的域，用于数据储存、MV绑定、该域的各种函数声明（这里是`$scope.remove`）

===

### 1.3. Lv3 结构（模块结构）

```
<!doctype html>
<html lang="en" ng-app="myApp">
	<head>
		<meta charset="UTF-8">
		<title>Your Shoping Cart</title>
	</head>

	<body ng-controller="CartController">
		<h1>Your Order</h1>
		<div ng-repeat="item in items">...</div>

		<script src="lib/angular/1.2/angular.min.js"></script>
		<script>
			var myAppModule = angular.module('myApp', []);
			
			// 方式一：函数式
			myAppModule.controller('CartController', function($scope) {
				$scope.items = [
					{title: 'Paint pots', quantity: 8, price: 3.95},
					{title: 'Polka dots', quantity: 17, price: 12.95},
					{title: 'Pebbles', quantity: 5, price: 6.95}
				];

				$scope.remove = function(index) {
					$scope.items.splice(index, 1);
				};
			});
			
			// 方式二：数组式
			myAppModule.controller('CartController', ['$scope', function($scope) {
				$scope.items = [
					{title: 'Paint pots', quantity: 8, price: 3.95},
					{title: 'Polka dots', quantity: 17, price: 12.95},
					{title: 'Pebbles', quantity: 5, price: 6.95}
				];

				$scope.remove = function(index) {
					$scope.items.splice(index, 1);
				};
			}]);
		</script>
	</body>
</html>
```

注意事项：

* `ng-app="myApp"`：定义对应的app模块，方便管理状态机


## Angular运作流程

1. 用户请求应用起始页

2. 用户的浏览器向服务器发起一次 HTTP 连接，然后加载 index.html 页面，这个页面里面包含了模板

3. Angular 被加载到页面中，等待页面加载完成，然后查找 ng-app 指令，用来定义模板边界

3. Angular 遍历模板，查找指令和绑定关系，这将触发一系列动作：注册监听器、执行一些 DOM 操作、从服务器获取初始化数据。这项工作的最后结果是，应用将会启动起来，并且模板被转换成了 DOM 视图

5. 连接到服务器去加载需要展示给用户的其他数据

对于 Angular 应用来说，[步骤 1 到步骤 3 都是标准化，步骤 4 和步骤5 是可选的](#none)。这些步骤可以是同步或者异步进行。为了提升性能，对于[第一个视图，请将数据和 HTML 模板一起加载](#none)，避免多次请求。


## Angular基本变量、服务、结构等解释

### 显示文本

#### 》{{...}}：

	<p>{{expression}}</p>
	
	// 如：
	// <p>{{greeting}}</p>
	// <p>{{greeting + 1 + ' hello '}}</p>
	// <p>{{greeting + 1 + ' hello '}} <span>123</span></p>
	
* 有利：阅读自然，输入内容少；灵活性较好（可嵌套元素）
* 不利：当内容未被渲染时，模板会显露出来

#### 》ng-bind：

	<p ng-bind="expression"></p>
	
	// 如：
	// <p ng-bind="greeting"></p>
	// <p ng-bind="greeting + 1 + ' hello'"></p>
	// <p ng-bind="greeting + 1 + ' hello'"><span>123</span></p> // p中的元素会被清空，再植入ngBind的值
	
* 有利：当内容未被渲染时，模板不会显露出来
* 不利：灵活性欠佳（不可嵌套元素）
	
上面效果如下：

	<p>Hi there</p>
	
===

### 观测者模式

#### 》$scope.$watch(watchFn, watchAction, isDeepWatch)

* watchFn
	* Angular表达式 / 函数字符串
	* 返回被监控的数据模型当前值
	
* watchAction(newValue, oldValue, scope)
	* 函数 / 表达式
	* 接收`watchFn`的新旧两值，以及作用域对象的引用
	
* isDeepWatch
	* 默认为`false`，如为`true`时，会检查被监控对象的每个属性是否发生了变化，集合较大时，运算负担较重

例子：

	function StartUpController($scope) {
		$scope.funding = { startingEstimate: 0 };
		
		computeNeeded = function() {
			$scope.funding.needed = $scope.funding.startingEstimate * 10;
		};
		
		$scope.$watch('funding.startingEstimate', computeNeeded);
	}
	
监视`funding.startingEstimeate`属性，如果有变化则调用`computeNeeded`函数

#### * 注销监控

	...
	var dereg = $scope.$watch('someModel.someProperty', callbackOnChange);
	...
	dereg();
	
#### * 性能注意事项

	<div ng-controller="CartController">
		...
		<div>Total: {{totalCart() | currency}}</div>
		<div>Discount: {{bill.discount | currency}}</div>
		<div>Subtotal: {{subtotal() | currency}}</div>
	</div>
	...
	var CartController = ['$scope', function($scope) {
		$scope.bill = {};
		
		$scope.items = [
			{title: 'Paint pots', quantity: 8, price: 3.95},
			{title: 'Polka dots', quantity: 17, price: 12.95},
			{title: 'Pebbles', quantity: 5, price: 6.95}
		];
		
		// 计算总价
		$scope.totalCart = function() {
			...
		};
		
		// 计算优惠后的价格
		$scope.subtotal = function() {
			return $scope.totalCart() - $scope.discount;
		};
		
		// 计算优惠额
		function calculateDiscount(newValue, oldValue, scope) {
			$scope.bill.discount = newValue > 100 ? 10 : 0;
		};
		
		// 当 $scope.totalCart 变化时，调用calculateDiscount函数
		$scope.$watch($scope.totalCart, calculateDiscount);
	}];

当在`totalCart()`打上调试断点时，会发现渲染这个页面，该函数被调用了**6**次

以下每种情况下它都会运行一次：

* 模板 {{totalCart() | currency}}
* subtotal()函数
* $watch()函数

然后Angular会把以上整个过程又重复一遍，最终就是**6**次

Angular的做法是：[把所有被监控的属性都拷贝一份，然后把它们和当前的值进行比较，看看是否发生了变化](#none)。而实际上，Angular可能会把以上过程运行**10次**，从而确保进行了完整的传播

由于Angular需要用JavaScript实现数据绑定，所以和TC39团队一起开发了一个叫`Object.observe()`的底层本地化实现，并在所有需要实现的地方自动使用`Object.observe()`，使其像本地代码一样快速

根据以上作出的优化为：

	<div ng-controller="CartController">
		...
		<div>Total: {{bill.total | currency}}</div>
		<div>Discount: {{bill.discount | currency}}</div>
		<div>Subtotal: {{bill.subtotal | currency}}</div>
	</div>
	...
	var CartController = ['$scope', function($scope) {
		$scope.bill = {};
		
		$scope.items = [
			{title: 'Paint pots', quantity: 8, price: 3.95},
			{title: 'Polka dots', quantity: 17, price: 12.95},
			{title: 'Pebbles', quantity: 5, price: 6.95}
		];
		
		// 计算总价、优惠额、优惠价
		var calculateTotals = function() {
			var total = 0;

			for (var i = 0, len = $scope.items.length; i < len; i++) {
				total = total + $scope.items[i].price * $scope.items[i].quantity;
			}

			$scope.bill.total = total;
			$scope.bill.discount = total > 100 ? 10 : 0;
			$scope.bill.subtotal = total - $scope.bill.discount;
		};
		
		// 方式1：当 $scope.items 变化时，调用calculateDiscount函数
		$scope.$watch('items', calculateDiscount, true);
		
		// 方式2：当 $scope.bill 对应属性变化时，调用calculateDiscount函数（此处仅示范监控多个属性的做法）
		$scope.$watch('bill.total + bill.discount + bill.subtotal', calculateDiscount);
		
		// 方式3：当 $scope 有变化时，调用calculateDiscount
		$scope.$watch(calculateDiscount);
	}];

===

### 表单

	<form ng-submit="requestFunding()" ng-controller="StartUpController">
		Starting: <input ng-change="computeNeeded()" ng-model="startingEstimate" />
		Recommendation: {{needed}}
		<button>Fund my Startup!</button>
		<button ng-click="reset()">Reset</button>
	</form>
	...
	function StartUpController($scope) {
		$scope.computeNeed = function() {
			$scope.needed = $scope.startingEstimate * 10;
		};
		
		$scope.requestFunding = function() {
			window.alert("Sorry, please get more customers first.");
		};
		
		$scope.reset = function() {
			$scope.startingEstimate = 0;
		};
	};
	
#### 》ng-submit

> 提交表单时，会自动阻止浏览器执行默认的POST操作

#### 》ng-change

#### 》ng-click

===

### 列表、表格以及其他迭代型元素

	var AppController = ['$scope', function($scope) {
		$scope.students = [
			{name:'Mary Contrary', id:'1'},
			{name:'Jack Sprat', id:'2'},
			{name:'Jill Hill', id:'3'},
			{name:'Chen Huang', id:'4'}
		];
	}];
	...
	<ul ng-controller="AppController">
		<li ng-repeat='student in students'>
			<a href="/student/view/{{student.id}}">{{student.name}}</a>
			<p>序号：{{$index}}</p>
			<p>第一：{{$first}}</p>
			<p>中间：{{$middle}}</p>
			<p>最后：{{$last}}</p>
		</li>
	</ul>
	
上面效果如下：

	<ul>
		<li>
			<a href="/student/view/1">Mary Contrary</a>
			<p>序号：0</p>
			<p>第一：true</p>
			<p>中间：false</p>
			<p>最后：false</p>
		</li>
		<li>
			<a href="/student/view/2">Jack Sprat</a>
			<p>序号：1</p>
			<p>第一：false</p>
			<p>中间：true</p>
			<p>最后：false</p>
		</li>
		<li>
			<a href="/student/view/3">Jill Hill</a>
			<p>序号：2</p>
			<p>第一：false</p>
			<p>中间：true</p>
			<p>最后：false</p>
		</li>
		<li>
			<a href="/student/view/1">Chen Huang</a>
			<p>序号：3</p>
			<p>第一：false</p>
			<p>中间：false</p>
			<p>最后：true</p>
		</li>
	</ul>

#### 》ng-repeat

> 根据集合中的项目一次创建一组元素的多份拷贝

#### 》$index

> 返回当前引用的元素序号

#### 》$first

> 返回布尔值，是否第一个元素

#### 》$middle

> 返回布尔值，是否中间的某个元素（第一个与最后一个之间的元素）

#### 》$last

> 返回布尔值，是否最后一个元素

===

### 隐藏和显示

	<ul ng-show="menuState.show">
	...
	$scope.menuState.show = false;

#### 》ng-show

> 当为`true`时，设置为`display:blcok`来显示元素

#### 》ng-hide

> 当为`true`时，设置`display:none`来隐藏元素

===

### CSS类和样式

#### 》ng-class

* 表示CSS类名的字符串，以空格分隔

		<li ng-class="'errorClass baseClass'">
		
	或
	
		<li ng-class="{{liClass}}">
		...
		$scope.liClass = "'errClass baseClass'";

* CSS类名数组

		<li ng-class="['errorClass', 'baseClass']">
		
	或
	
		<li ng-class="{{liClass}}">
		...
		$scope.liClass = ['errorClass', 'baseClass'];

* CSS类名到布尔值的映射

		<li ng-class="{errClass: isError, baseClass: isBase}">
		...
		$scope.isError = true;
		$scope.isBase = true;
		
	或
	
		<li ng-class="{{liClass}}">
		...
		$scope.liClass = {errClass: $scope.isError, baseClass: $scope.isBase};


#### 》ng-style

===

### 反思src和href属性

当在`img`或者`a`标签（还有`iframe`、`ember`等需引用资源的元素）上进行数据绑定时，在src或者href属性上简单使用`{{}}`无法很好运行。

由于浏览器会优先使用并行方式来加载图片和其他内容，所以Angular没有机会拦截到数据绑定请求（需要渲染完成后才可以），而向服务器发送`/images/cats/{{favoriteCat}}`这样的请求会触发404等不利效果。

#### 》ng-src

	<img ng-src="/images/cats/{{favoriteCat}}" />

#### 》ng-href

	<a ng-href="/shop/category={{numberOfBalloons}}">some text</a>

===

### 表达式

#### 》{{...}}

数学运算：`+` `-` `/` `*` `%`

比较元素：`==` `!=` `>` `<` `>=` `<=`

布尔逻辑：`&&` `||` `!`

位运算：`\^` `&` `|`

支持：`$scope的函数` `引用数组` `对象符号（[]、{}、.）`

===

### 区分UI和控制器的职责

#### 控制器职责

* 为应用中的模型设置初始状态
* 通过$scope对象把数据模型和函数暴露给视图（UI模板）
* 监视模型其余部分的变化，并采取相应的动作

#### 创建控制器建议

* 保持小巧和可管理
* 为视图中的每一块功能区域创建一个控制器，即菜单一个控制器`MenuController`、面包屑一个控制器`BreadcrumbController`等

#### UI与控制器关联的方法

* ng-controller
* 路由+视图

#### 控制器嵌套

	<div ng-controller="ParentController">
		<div ng-controller="ChildController">...</div>
	</div>

* 通过内部的原型继承机制，`ChildController`的`$scope`对象可以访问`ParentController`的`$scope`对象上的所有属性（和函数）

===

### 利用$scope暴露模型数据

#### 通过表达式（单向）

	<button ng-click="count=3">Set count to three</button>
	
等同于：

	<div ng-controller="CountController">
		<button ng-click="setCount()">Set count to three</button>
	</div>
	...
	function CountController($scope) {
		$scope.setCount = function() {
			$scope.count = 3;
		}
	}
	
#### 通过ng-model（双向绑定）


### 使用Module（模块）组织依赖关系

#### * 为解决...

代码块高度耦合问题

#### * So...

Module是为了组织应用中一块功能区域的依赖关系

同时提供一种机制，可以自动解析依赖关系（又叫[依赖注入](http://angularjs.cn/A00z)），一般称为依赖服务，因它会为应用提供特殊的服务

> 某程度上看，类似于jQuery的插件模式，都是为了解决复用问题，但方式完全不同！

通过依赖注入，以下例子均能正常运行，效果一致：

例1

	function ShoppingController($scope, $location, $route) {
		...
	}

例2：

	function ShoppingController($location, $route, $scope) {
		...
	}

> 依赖注入同时也解决了参数顺序的问题，只要名称对应，则可使用对应的功能

依赖注入的服务都是单例（Singleton），而Angular内置了很多的服务，如：

* ##### 》 $location

	> 和浏览器的地址栏进行交互

* ##### 》$route

	> 根据URL地址的变化切换视图
	
* ##### 》$http

	> 和服务器进行交互
	
由于Angular内置的服务以 **$** 符号开头，建议自定义的服务 **不要以$开头**

#### * 如何编写自定服务

* ##### 》provider( name, Object Or Constructor() )

	> 一个可配置的服务，创建逻辑比较复杂
	
	> Object 作为参数：这个 Object 对象必须带有一个名为 $get 的函数，这个函数需要返回服务的名称
	
	> Constructor 作为参数：调用构造函数会返回服务实例对象
	
* ##### 》factory( name, $getFunction() )

	> 一个不可配置的服务，创建逻辑比较复杂
	
	> 需要指定一个函数，当调用这个函数的时候，会返回服务的实例
	
	> provider(name, { $get: $getFunction() } )
	
	controller.js
	
		// 创建一个模型用来支撑我们的购物视图
		var shoppingModule = angular.module('ShoppingModule', []);
		
		// 设置好服务工厂，用来创建我们的Items接口，以便访问服务端数据库
		shoppingModule.factory('Items', function() {
			var items = {};
			
			items.query = function() {
				// 在真实的应用中，我们会从服务端拉取这块数据...
				return [
					{title: 't1', description: 'd1', price: 1},
					...
				];
			};
			
			return items;
		});
		
		// 调用
		function ShoppingController($scope, Items) {...}
		
	index.html
	
		<html ng-app="ShoppingModule">
			...
			<body ng-controller="ShoppingController">
				<h1>Shop!</h1>
				<table>
					<tr>
						<td>{{item.title}}</td>
						<td>{{item.description}}</td>
						<td>{{item.price | currency}}</td>
					</tr>
				</table>
			</body>
		</html>
	
* service( name, constructor() )

	> 一个不可配置的服务，创建逻辑比较简单
	
	> 与上面 provider 函数的 constructor 参数类似，Angular 调用它可以创建服务实例
	
#### * 模块的依赖

服务自身可以互相依赖，使用Module接口来定义模块之间的依赖关系

	var appMod = angular.module('app', ['SnazzyUIWidgets', 'SuperDataSync']);

===

### 使用过滤器格式化数据

使用过滤器声明变换数据的格式，然后再显示，语法如下：

	{{ expression | filterName : parameter1 : ...parameterN }}
	
多过滤器语法：

	{{ expression | filterName1 | filterName2 | ... }}
	
Angular内置的过滤器有：

* currency

	> 转换成美元格式

		 {{12.9 | currency}} // $12.90
	
* date

* number

	> 把小数点后面的数值格式化掉（四舍五入，通过 `round` 函数实现）
	
		{{12.9 | currency | number:0 }} // $13

* uppercase

===

### 自定义过滤器

filter.js

	var homeModule = angular.module('HomeModule', []);
	
	// 首字母大写
	homeModule.filter('titleCase', function() {
		var titleCaseFilter = function(input) {
			var words = input.split(' ');
			
			for (var i = 0; i < words.length; i++) {
				words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
			}
			
			return words.join(' ');
		};
		
		return titleCaseFilter;
	});

index.html

	<body ng-app="HomeModule" ng-controller="HomeController">
		<h1>{{pageHeading | titleCase}}</h1>
	</body>
	
controller.js

	function HomeController($scope) {
		$scope.pageHeading = 'behold the majesty of your page title';
	}

===

### 使用路由和$location切换视图

#### 》$route

对于浏览器所指向的特定 URL，Angular 将会加载并并显示一个模板，并实例化一个控制器来为模板提供内容

#### 》$routeProvider

创建路由，把需要创建的路由当成一个配置块传给这些函数即可

	var someModule = angular.module('someModule', [...module dependencies...]);
	
	someModule.config(function($routeProvider) {
		$routeProvider.
			when('url', {controller: aController, templateUrl: '/path/to/template'}).
			when(...).
			...
			otherwise({...});
	});

#### * 邮箱实例（单页面应用）

index.html（框架）

	<html ng-app="AMail">
		<head>
			<script src="src/angular.js"></sciprt>
			<script src="src/controllers.js"></script>
		</head>
		
		<body>
			<h1>A-Mail</h1>
			<div ng-view></div>
		</body>
	</html>

list.html（模板：列表页）

	<table>
		<tr>
			<td>
				<strong>Sender</strong>
			</td>
			<td>
				<strong>Subject</strong>
			</td>
			<td>
				<strong>Date</strong>
			</td>
		</tr>
		<tr ng-repeat="message in messages">
			<td>
				{{message.sender}}
			</td>
			<td>
				<a href="#/view/{{message.id}}">{{message.subject}}</a>
			</td>
			<td>
				{{message.date}}
			</td>
		</tr>
	</table>

detail.html（模板：详情页）

	<div>
		<strong>Subject:</strong> {{message.subject}}
	</div>
	<div>
		<strong>Sender:</strong> {{message.sender}}
	</div>
	<div>
		<strong>To:</strong>
		<span ng-repeat="recipient in message.recipients">{{recipient}}</span>
	<div>
		{{message.message}}
	</div>
	<a href="#/">Back to message list</a>

controllers.js（控制器）

	// 为核心的AMail服务创建模块
	var aMailServices = angular.module('AMail', []);
	
	// 在 URL、模板和控制器之间建立映射关系
	function emailRouteConfig($routeProvider) {
		$routeProvider.
			when('/', {
				controller: ListController,
				templateUrl: 'list.html'
			}).
			when('/view/:id', {
				controller: DetailController,
				templateUrl: 'detail.html'
			}).
			otherwise({
				redirectTo: '/'
			});
	};
	
	// 配置我们的路由，以便 AMail 服务能够找到它
	aMailServices.config(emainRouteConfig);
	
	// 一些虚拟的邮件
	var messages = [
		{
			id: 0,
			sender: 'jean@somecompany.com',
			subject: 'Hi there, old friend',
			date: 'Dec 7, 2013 12:32:00',
			recipients: ['greg@somecompany.com'],
			message: 'Hey, we should get together for lunch sometime and catch up.'
				+ 'There are many things we should collaborate on this year.'
		},
		{
			id: 1,
			sender: 'maria@somecompany.com',
			subject: 'Where did you leave my laptop?',
			date: 'Dec 7, 2013 8:15:12',
			recipients: ['greg@somecompany.com'],
			message: 'I thought you were going to put it in my desk drawer.'
				+ 'But it does not seem to be there.'
		},
		{
			id: 2,
			sender: 'bill@somecompany.com',
			subject: 'Lost python',
			date: 'Dec 6, 2013 20:35:02',
			recipients: ['greg@somecompany.com'],
			message: 'Nobody panic, but my pet python is missing from her cage.'
				+ 'she doesn\'t move too fast, so just call me if you see her.'
		}
	];
	
	// 把我们的邮件发布给邮件列表模板
	function ListController($scope) {
		$scope.message = message;
	};
	
	// 从路由信息（从 URL 中解析出来的）中获取邮件id，然后用它找到正确的邮件对象
	function DetailController($scope, $routeParams) {
		$scope.message = messages[$routeParams.id];
	};

===

### 与服务器交互

#### 》$http

* 支持 HTTP、JSONP 和 CORS 方式

* 包含安全性支持，避免 JSON 格式的脆弱性和 XSRF （跨站请求伪造）

* 可以轻松转换请求和响应数据，甚至可以实现简单的缓存

> 类似jQuery.json的作用

服务器返回请求信息：

	[
		{
			"id": 0,
			"title": "Paint pots",
			"description": "Pots full of paint",
			"price": 3.95
		},
		{
			"id": 1,
			"title": "Polka dots",
			"description": "Dots with that polka groove",
			"price": 12.95
		},
		{
			"id": 2,
			"title": "Pebbles",
			"description": "Just little rocks, really",
			"price": 6.95
		},
		... etc ...
	]

controller.js

	function ShoppingController($scope, $http) {
		$http.get('/products').success(function(data, status, headers, config) {
			$scope.items = data;
		});
	}

index.html

	<body ng-controller="ShoppingController">
		<h1>Shop!</h1>
		<table>
			<tr ng-repeat="item in items">
				<td>{{item.title}}</td>
				<td>{{item.description}}</td>
				<td>{{item.price | currency}}</td>
			</tr>
		</table>
	</body>

===

### 使用指令修改DOM

#### 》direct('directiveName', directiveFunction)

* 指令扩展了HTML语法，同时可以使用自定义的元素和属性把行为和 DOM 转换关联到一起

* 可创建可复用的 UI 组件，配置你的应用，并且可以做到你能想象到的几乎所有事情，这些事情都可以在你的 UI 模板中实现

> Angular 默认有`ng-click` `ng-dbclick` `ng-change`等，但区别在于，`direct` 更趋向于 jQuery.fn 中**UI+行为的绑定**


结构如下：

	var appModule = angular.module('appModule', [...]);
	
	appModule.directive('directiveName', directiveFunction);

#### * 让 `autofocus` 得到兼容

directive.js

	var appModule = angular.module('app', []);
	
	appModule.directive('ngbkFocus', function() {
		return {
			link: function(scope, element, attrs, controller) {
				element[0].focus();
			}
		};
	});

* `link` 函数会获得外层 scope 的引用、它所存在的 DOM 元素、传递给指令的一个属性数组，以及 DOM 元素上的控制器——如果有控制器存在的话

* 这里，我们只需要获取元素，然后调用它的 `focus()` 方法即可

index.html

	<html lang="en" ng-app="app">
		... include angular and other scripts ...
		<body ng-controller="SomeController">
			<button ng-click="clickUnfocused()">Not focused</button>
			<button ngbk-focus ng-click="clickFocused()">I'm very focused!</button>
			<div>{{message.text}}</div>
		</body>
	</html>

controller.js

	function SomeController($scope) {
		$scope.message = { text: 'nothing clicked yet' };
		
		$scope.clickUnfocused = function() {
			$scope.message.text = 'unfocused button clicked';
		};
		
		$scope.clickFocused = function() {
			$scope.message.text = 'focus button clicked';
		};
	}
	
	var appModule = angular.module('app', ['directives']);

当页面渲染完后，“I'm very focused!”的 button 获得焦点

===

### 检验用户输入

Angular 自动为 <form> 元素增加了一些很好用的特性，如检验合法性、是否为数字、是否为日期、是否必填等

	<h1>Sign Up</h1>
	<form name="addUserForm">
		<div>
			First name: <input ng-model="user.first" required />
		</div>
		<div>
			Last name: <input ng-model="user.last" required />
		</div>
		<div>
			Email: <input type="email" ng-model="user.email" required />
		</div>
		<div>
			Age: <input type="number" ng-model="user.age" ng-maxlength="3" ng-minlength="1" />
		</div>
		<div>
			<button>Submit</button>
		</div>
	</form>

Angular 会使老式的不支持 HTML5 的浏览器，通过自动使用指令来适配，实现 required 属性以及 email 和 number 两种输入类型的功能

最终版：

index.html

	<h1>Sign Up</h1>
	<form name="addUserForm" ng-controller="AddUserController">
		<div ng-show="message">{{message}}</div>
		<div>
			First name: <input name="firstName" ng-model="user.first" required />
		</div>
		<div>
			Last name: <input ng-model="user.last" required />
		</div>
		<div>
			Email: <input type="email" ng-model="user.email" required />
		</div>
		<div>
			Age: <input type="number" ng-model="user.age" ng-maxlength="3" ng-minlength="1" />
		</div>
		<div>
			<button ng-click="addUser()" ng-disabled="!addUserForm.$valid">Submit</button>
		</div>
	</form>

* 在控制器中，我们可以通过 `$valid` 属性获取表单的检验状态；当表单中的所有输入项都合法时候，Angular 将会把这个属性设置为 true，默认为 false

* `ng-disabled` 禁用 Submit 按钮，避免提交非法状态的表单

controller.js

	function AddUserController($scope) {
		$scope.message = "";
		
		$scope.addUser = function() {
			// 由读者自己实现：把 user 真正保存到数据库中...
			$scope.message = 'Thanks, ' + $scope.user.first + ', we added you!';
		};
	};