## 一、this的工作原理（理解方式1）

1. 全局范围内

		this
	
	当在全局范围内使用`this`，他将指向全局对象
	
2. 函数调用

		foo();
		
	这里`this`也会指向全局对象
	
3. 方法调用

		test.foo();
		
	this指向test对象
	
4. 调用构造函数

		new foo();
		
	如果函数倾向与和`new`关键字一块使用，则我们称这个函数是**构造函数**。在函数内部，`this`指向新创建的对象
	
5. 显式的设置`this`

		function foo(a, b, c) {};
		
		var bar = {};
		foo.apply(bar, [1, 2, 3]); // 数组将会被扩展，如下所示
		foo.call(bar, 1, 2, 3); // 传递foo的参数是：a = 1, b = 2, c = 3
		
	当使用`Function.prototype`上的`call`或者`apply`方法时，函数内的`this`将会被**显式设置**为函数的第一个参数
	
	因此函数调用的规则在上例中已经不适用了，在`foo`函数内`this`被设置成了`bar`，下例同理
	
		(function(){
			alert(this);
		}).call("hello world"); // 返回"hello world"


### 常见误解

尽管大部分的情况都说的过去，不过第二个规则被认为是JavaScript语言另外一个错误设计的地方，因为它从来就没有实际的用途。

	Foo.method = function() {
		function test() {
			// this 将会被设置为全局对象
		};
		test();
	};

一个常见的误解是`this`中的`this`将会指向`Foo`对象，实际上不是这样子的。

为了在`test`中获取对`Foo`对象的引用，我们需要在`method`函数内部创建一个局部变量指向`Foo`对象。

	Foo.method = function() {
		var that = this;
		
		function test() {
			// that 指向Foo对象
		};
		test();
	};

`that`只是我们随意起的名字，不过这个名字被广泛的用来指向外部的`this`对象。


### 方法的赋值表达式

另一个看起来奇怪的地方是函数别名，也就是将一个方法赋值给一个变量。

	var test = someObject.methodTest;
	test();
	
上例中，`test`就像一个普通的函数被调用；因此，函数内的`this`将不再被指向`someObject`对象。

虽然`this`的晚绑定特性似乎并不友好，但这确实是**基于原型继承**赖以生存的土壤。

	function Foo() {};
	Foo.prototype.method = function() {};
	
	function Bar() {};
	Bar.prototype = Foo.prototype;
	
	new Bar().method(); // 可以理解为(new Bar).method()
	
当`method`被调用时，`this`将会指向`Bar`的实例对象。


## 二、this的工作原理（理解方式2）

### 1.this指向调用该函数的物件

Javascript中的**this看的是究竟是谁调用该函数，而不是看该函数被定义在那个物件内**
	
公式
	
	物件.函数(); //函数内的this指向该物件
	
范例
	
	var obj = {
		x: 20,
		f: function(){ console.log(this.x); }
	};

	obj.f(); //由于调用f函式时，点前面物件为obj，故f內的this指向obj，则输出为20。

	obj.innerobj = {
		x: 30,
		f: function(){ console.log(this.x); }
	};

	obj.innerobj.f(); //由于调用f函数时，点前面物件为obj.innerobj，故f內的this指向obj.innerobj，则输出为30。
		
### 2.this指向全局物件（浏览器：window；nodejs：GLOBAL）

公式
	
	函数(); // 函数内的this指向全局物件
		
范例
	
	var x = 10;
	var f = function(){
		console.log(this.x);
	};

	f(); //由於調用f函式時，前方並未有[物件.]的形式，故f內的this指向全域物件，則輸出全域變數的x(10)。
		
例外：在使用node.js时，若使用node file.js这样的方式执行js文档，并不会宣告全局变量挂在全局物件上（意指会利用function将code整个包起来执行），故输出为undefined。
	
#### 前两种情况常见误导范例

##### 范例一、物件的成员函数内有函数

	var x = 10;
	var obj = {
		x: 20,
		f: function(){
			console.log(this.x);
			var foo = function(){ console.log(this.x); }
			foo(); // (2)
		}
	};

	obj.f();  // (1)
	
输出结果：20 10

（1）obj.f()调用时，f前面物件为obj，故f内的this指向obj

（2）foo()调用时，前方并无物件，故foo内的this指向全局物件，即全局变量x

若要让foo内使用obj.x的值，解法如下：

	var x = 10;
	var obj = {
		x: 20,
		f: function(){
			console.log(this.x);
			var that = this; //使用that保留在這個函式內的this
			var foo = function(){ console.log(that.x); } //使用that取得obj
			foo();
		}
	};

	obj.f();

#### 范例二、借用函数

	var x = 10;
	var obj = {
		x: 20,
		f: function(){ console.log(this.x); }
	};

	obj.f(); // (1)

	var fOut = obj.f;
	fOut(); // (2)

	var obj2 = {
		x: 30,
		f: obj.f
	}

	obj2.f(); // (3)
	
输出结果：20 10 30

（1）obj.f()的f所指向的是obj，故输出20

（2）fOut()调用时，前方无物件，this指向全局物件，故输出10

（3）obj2.f()则是obj2去呼叫f，故this指向的是obj2，输出为30

### 3.this指向利用call或apply所指派给this的物件

call与apply都是呼叫该函数并让函数的this指向给予call或apply的第一个参数

公式

	// 函数的this指向B物件（若B物件为null，则指向全局物件）
	
	(A物件.)函数.call(B物件, 参数1, 参数2, 参数3, ...);
	
	(A物件.)函数.apply(B物件, [参数1, 参数2, 参数3, ...]);
	
范例

	var obj = {
		x: 20;
		f: function(){ console.log(this.x); }
	};

	var obj2 = {
		x: 30;
	};

	obj1.f.call(obj2); // 利用call指派f的this為指向obj2，故输出为30

### 4.this指向new所产生的新物件

若将函数当作建构式（constructor）来用，则内部的this则指向于new所产生之新物件

公式

	new 建构式(); // 建构式内的this指向new所产生的新物件
	
范例

	function Monster(){
		this.hp = 100;
	};

	var monster = new Monster(); //Monster的this指向new出來之新物件並回傳回來，new的寫法就類似於下面的寫法。
	var monster = (function(){
		var _new = { constructor: Monster, __proto__: Monster.prototype }; //在IE內可能不相似
		_new.constructor(); //這也是為何說可以利用前三種情況來變化的原因，constructor呼叫時，this指向的即是_new這個物件。
		return _new;
	})();

### 5.callback函数内的this会指向与调用放入该callback的函数的this指向的物件

通过jQuery，可以让元素#button，click后将内容改为“Clicked”这样的字符串

	$("#button").click(function() {
		this.html("Clicked");
	});
	
此时这个this居然指向了$("#button")这个物件，而不是全局物件，真神奇啊！假设要写一个function，它可以在里面呼叫传入的function，该如何写呢？

	var f = function(innerf){
		//前面的处理
		
		innerf(arg1, arg2, arg3, ......);
		
		//后面的处理
	};
	
但如果这样写的话，innerf里的this就会指向全局物件的！那怎样才能让this指向调用此callback的物件呢？大家必须要遵守一个规则，让自己的this传给callback，使其当作自己的this来用！

	var f = function(innerf){
		//前面的處理
		
		innerf.call(this, arg1, arg2, arg3, ......);
		//或是innerf.apply(this, [arg1, arg2, arg3, ......])
		
		//後面的處理
	};


## 三、其他场景下this的指向

### 1.`setTimeout`与`setInterval`

`setTimeout`和`setInterval`中调用`this`，其将指向全局对象

		function Foo() {
    		this.value = 42;
    		this.method = function() {
        		// this 指向全局对象
        		console.log(this.value); // 输出：undefined
    		};
    		setTimeout(this.method, 500);
		}；
		new Foo();
		
作为第一个参数的函数将会在全局作用域中执行，因此函数内的 this 将会指向这个全局对象
	
### 2.闭包

**闭包**中的中的this将指向全局变量

	var a = 1;
	
	(function() {
    	var a = 2;
    	alert(this.a); // 返回 1
	})();
	
### 3.DOM

#### 例1

	<div onclick="alert(this.tagName);">
		division element
	</div>

`this`指向`div`，点击后弹出"DIV"

#### 例2

	<div id="container">
		division element
	</div>
	
	<script>
		var div = document.getElementById("container");
		
		div.addEventListener("click", function() {
			alert(this.tagName); // "DIV"
		}, false);
	</script>
	
`this`指向id为container的`div`，点击后弹出"DIV"

#### 例3

	<div onclick="func();">
		division element
	</div>
	
	<script>
		function func() {
			alert(this.tagName); // undefined
		};
	</script>
	
`this`指向window，由于window没有定义tagName，所以点击后弹出"undefined"

但可以通过`例1`的传参方式，从而返回正确的值

	<div onclick="func(this);">
		division element
	</div>
	
	<script>
		function func(tar) {
			alert(tar.tagName); // "DIV"
		};
	</script>

#### 例4

	 <table width="100" height="100">
	 	<tr>
			<td>
				<div style="width: expression(this.parentElement.width);height: expression(this.parentElement.height);">
					division element
				</div>
          	</td>
     	</tr>
	</table>
	
`this`指向`div`，其宽度和高度会根据父元素的宽度和高度作出实时调整


## 参考资料

1. this的工作原理，http://bonsaiden.github.io/JavaScript-Garden/zh/#function.this

2. Javascript的this用法，http://www.ruanyifeng.com/blog/2010/04/using_this_keyword_in_javascript.html

3. Javascript：this用法整理，http://software.intel.com/zh-cn/blogs/2013/10/09/javascript-this