## 全局原型改写 part 1

### 描述

保证函数中 `this` 指向目标对象

### 行数

623 ~ 641

### 源码

```
if (!Function.prototype['bind']) {
    // Function.prototype.bind 是 ECMAScript 5th Edition 的 1 个标准部分(发布于2009年12月, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // 为避免部分浏览器原生不支持此方法，提供一种 JavaScript 实施手段。这种手段基于 prototype.js。
    Function.prototype['bind'] = function (object) {
        var originalFunction = this;
        if (arguments.length === 1) {
            return function () {
                return originalFunction.apply(object, arguments);
            };
        } else {
            var partialArgs = Array.prototype.slice.call(arguments, 1);
            return function () {
                var args = partialArgs.slice(0);
                args.push.apply(args, arguments);
                return originalFunction.apply(object, args);
            };
        }
    };
}
```

### 分析

#### [Mozilla Developer 提供的另一种方案](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

```
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

#### `bind` 的作用

> 其实它就是用来静态绑定函数执行上下文的this属性，并且不随函数的调用方式而变化

```
test('Function.prototype.bind', function(){
    function orig(){
     return this.x;
    };
    var bound = orig.bind({x: 'bind'});
    equal(bound(), 'bind', 'invoke directly');
    equal(bound.call({x: 'call'}), 'bind', 'invoke by call');
    equal(bound.apply({x: 'apply'}), 'bind', 'invoke by apply');
});
```

[Function.prototype.bind的作用](http://www.cnblogs.com/fsjohnhuang/p/3712965.html)

#### `apply` `call` `bind` 的区别

```
var xw = {
    name    : "小王",
    gender  : "男",
    age     : 24,
    say     : function() {
                    alert(this.name + " , " + this.gender + " ,今年" + this.age);
                }
};

var xh = {
    name    : "小红",
    gender  : "女",
    age     : 18
};

xw.say(); 

// 调用（用 xw 的 say 方法来显示 xh）
xw.say.call(xh);
xw.say.apply(xh);
xw.say.bind(xh)();

// 传参
xw.say.call(xh, "实验小学", "六年级");
xw.say.apply(xh, ["实验小学", "六年级郑州牛皮癣医院"]);
xw.say.bind(xh, "实验小学", "六年级")(); // 方式 1
xw.say.bind(xh)("实验小学", "六年级"); // 方式 2
```

总结：

* `call` `apply` `bind` 都是用于改变 `this` 的指向

* `call` `apply` 会立即调用函数；`bind` 会返回 1 个修改完 `this` 指向的函数

[javascript中apply、call和bind的区别](http://blog.itpub.net/29592957/viewspace-1159067/)

#### 回归到 `KO` ...

* `KO` 会在源码多处使用该方法，如：

  ```
  var ko_subscribable_fn = {
      subscribe: function (callback, callbackTarget, event) {
          var self = this;

          event = event || defaultEvent;
          var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
  ```

* UI 中的使用（必须牢记！）

  ```
  <div data-bind="click : clickFunc.bind(null, $index)">...</div>

  ...

  clickFunc = function(index) {...};
  ```