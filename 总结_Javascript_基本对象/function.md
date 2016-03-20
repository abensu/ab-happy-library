# function用法集

## [试题](http://perfectionkills.com/javascript-quiz/)和[解答](http://www.cnblogs.com/qiongmiaoer/archive/2012/10/11/javascript_Quiz.html)

### 1.

	(function(){
    	return typeof arguments;
    })();
    
* "object"
* "array"
* "arguments"
* "undefined"

> ` "object"（所有主流浏览器 √ ）`
> 
> 1. `typeof`会返回 `string` / `number` / `undefined` / `object` / `function`；
> 2. 而`arguments`属于特殊的`Object`，并不是`Array`的子类


    
### 2.

	var f = function g(){ return 23; };
	typeof g();
	
* "number"
* "undefined"
* "function"
* Error

> `Error（所有主流浏览器 √ ）`
>
> 根据标准，命名函数表达式的函数名只对函数体内可见，因此报"g is not defined"错误
> 有点类似 `var f = (function g(){ return 23; });`


	
### 3.

	(function(x){
    	delete x;
    	return x;
	})(1);
	
* 1
* null
* undefined
* Error

> `1（所有主流浏览器 √ ）`
>
> 参数不可删除



### 4.

	var y = 1, x = y = typeof x;
	x;
	
* 1
* "number"
* undefined
* "undefined"

> `"undefined"（所有主流浏览器 √ ）`
>
> 由于x未赋值，但已定义，所以`typeof x`返回`"undefined"`，算式`x = y = typeof x`由右向左进行，所以`x`为`"undefined"`



### 5.

	(function f(f){
    	return typeof f();
    })(function(){ return 1; });
    
* "number"
* "undefined"
* "function"
* Error

> `"number"（所有主流浏览器 √ ）`
>
> 上面的式子可以简写成`typeof function(){ return 1; }()`



### 6.

	var foo = {
    	bar: function() { return this.baz; },
    	baz: 1
	};
	(function(){
		return typeof arguments[0]();
	})(foo.bar);

* "undefined"
* "object"
* "number"
* "function"

> `"undefined"（所有主流浏览器 √ ）`
>
> 上面的式子可以简写成`typeof this.baz`，由于`this`指向全局`window`，而`window`中没有`baz`变量，所以为`"undefined"`


### 7.

	var foo = {
    	bar: function(){ return this.baz; },
    	baz: 1
	}
	typeof (f = foo.bar)();
	
* "undefined"
* "object"
* "number"
* "function"

> `"undefined"（所有主流浏览器 √ ）`
>
> 与第6题同理


### 8.

	var f = (function f(){ return "1"; }, function g(){ return 2; })();
	typeof f;
	
* "string"
* "number"
* "function"
* "undefined"

> `"number"（所有主流浏览器 √ ）`
>
> 由于此形式`(x, y, z)`只会执行/返回最后一个参数，即`z`，所以这里只执行`function g(){ return 2; }`，即`typeof 2`返回`"number"`


### 9.

	var x = 1;
	if (function f(){}) {
		x += typeof f;
	}
	x;
	
* 1
* "1function"
* "1undefined"
* NaN

> `"1function"（FF √ ）`
> `"1undefined"（IE/Chrome √ ）`
>
> 如下书写才会使主流浏览器执行结果一致

	var x = 1;
	if (!!function f(){}) {
		x += typeof f;
	}
	x;

> 在此处，`if`的执行（非FF）类似为`if(!!(function f() {})){...}`，所以全局变量中不存在函数`f`，即`f`为`undefined`，所以可以简写为`1 += "undefined"`


### 10.

	var x = [typeof x, typeof y][1];
	typeof typeof x;
	
* "number"
* "string"
* "undefined"
* "object"

> `"string"（所有主流浏览器 √ ）`
>
> 简写为`typeof "undefined"`


### 11.

	(function(foo){
    	return typeof foo.bar;
	})({ foo: { bar: 1 } });
	
* "undefined"
* "object"
* "number"
* Error

> `"undefined"（所有主流浏览器 √ ）`
>
> 简写为`typeof "undefined"`



### 12.

	(function f(){
    	function f(){ return 1; }
    	return f();
    	function f(){ return 2; }
	})();
	
* 1
* 2
* Error(e.g. "Too much recusion")
* undefined

> `2（所有主流浏览器 √ ）`
>
> 函数声明会在预编译阶段之前执行，而越往后的的同名函数会覆盖之前的函数



### 13.

	function f(){ return f; }
	new f() instanceof f;
	
* true
* false

> `false（所有主流浏览器 √ ）`
>
> 由于`new f()`返回`f`，自身不为自身的实例，所以为`false`
	
### 14.

	with (function(x, undefined){}) length;
	
* 1
* 2
* undefined
* Error

> `2（所有主流浏览器 √ ）`
>
> 由于`with`会改变执行的上下文区域，在此会提取函数的`length`，而函数的length就是指它形参的长度（个人理解为将`arguments.length`，提升为`this.length`）








