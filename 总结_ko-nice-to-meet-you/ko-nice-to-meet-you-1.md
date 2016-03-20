# 1. 小知识


## 1.1. 工厂模式（构造函数模式）与构造函数+原型模式


### 1.1.1. 工厂模式

```
  /* 人类 */
  var People = function() {

      var self = this;

      self.name = "";

      self.age = 0;

      self.set = function(name, age) {

          self.name = name;

          self.age = age;
      };

      self.say = function() {

          alert("My Name: " + self.name + "\nMy age: " + self.age);
      };
  };

  /* 某男 */
  var man = new People();
  man.set("John", 15);
  man.say();

  /* 某女 */
  var lady = new People();
  lady.set("LiLy", 20);
  lady.say();
```

[实例](example/1-1-1.html)


### 1.1.2. 构造+原型模式

```
  /* 人类 */
  var People = function() {

      this.name = "";

      this.age = 0;
  };

  People.prototype = {

      constructor : People,

      set : function(name, age) {

          this.name = name;

          this.age = age;
      },

      say : function() {

          alert("My Name: " + this.name + "\nMy age: " + this.age);
      }
  };

  /* 某男 */
  var man = new People();
  man.set("John", 15);
  man.say();

  /* 某女 */
  var lady = new People();
  lady.set("LiLy", 20);
  lady.say();
```

[实例](example/1-1-2.html)


### 1.1.3. 总结

- 以上两种构建对象的方法，都较为常用，两者的区别在于是否利用`prototype`来保存公共部分

- **工厂模式（构造函数模式）**：优点——直观（观感上）；缺点——占用内存（多个实例时）

- **构造函数+原型模式**：优点——节省内存（多个实例时）；缺点——不够直观（观感上）

- 在**工厂模式（构造函数模式）**中，建议使用`var self = this`来保证`this`的指向

- 在**构造函数+原型模式**中，`xx.prototype.constructor`是必须的，否则`set`和`say`中的`this`会指向全局作用域（这里是`window`）


## 1.2. 单向绑定与双向绑定


### 1.2.1. 演变

```
  model.val = 123 -> input.value = "123"
```

> `model` 代表某对象，`input`代表某输入框

要使上面的过程得以实现，一般需要如下处理：

```
  <input type="text" name="input" id="input">
  <input type="text" name="output" id="output" disabled>

  ...

  var
      model = {},
      input = document.getElementById("input"),
      output = document.getElementById("output");

  model.val = 123;

  input.value = output.value = model.val;
```

[实例](example/1-2-1-a.html)

此时，`input`和`output`均显示`123`

但如果，当`model.val`的值变成`456`，`input`和`output`的值也要跟着变化的话，则需要通过如下方式来实现：

```
  var
      model = {},
      input = document.getElementById("input"),
      output = document.getElementById("output");

  model.val = 123;

  model.setVal = function(val) { // new

      input.value = output.value = this.val = val;
  };

  input.value = output.value = model.val;

  model.setVal(456);
```

[实例](example/1-2-1-b.html)

此时，`input`和`output`都显示`456`，而且只要每次通过`model.setVal`的方法，`input`和`output`都会发生改变

ok，那如果反过来，想通过改变`input`的值来改变`model.val`和`output`的值呢？

```
  var
      model = {},
      input = document.getElementById("input"),
      output = document.getElementById("output");

  model.val = 123;

  model.setVal = function(val) {

      input.value = output.value = this.val = val;
  };

  input.value = output.value = model.val;

  model.setVal(456);

  input.onkeyup = function() { // new

      output.value = model.val = this.value;
  };
```

[实例](example/1-2-1-c.html)

以上演变过程可以概括为：静态赋值 -> 单向绑定（超原始的）-> 双向绑定（超原始的）

虽然上面的实例可以满足到我们的需求，但随着配对（1个`model`的节点 + 1个对应的函数 + 多个`dom`元素）数量的上升，`model`会愈发臃肿以致不可维护，并且`model`也不能称为（纯粹的）**数据对象**了


### 1.2.2. 观察者模式

为了解决上述问题，可以通过中间元素作为调度来解决：

```
  1)  control -> model.val
          |
          `----> input.value

  2)  input.value -> control -> model.val
```

具体如下：

```
  var
      model       = {
                          val : 123
                      },
      ctrl        = null,
      Control     = null,
      input       = document.getElementById("input"),
      output      = document.getElementById("output");

  // 观察者类
  Control = function(model) {

      this.model      = model;

      this.targets    = [];
  };

  Control.prototype = {

      constructor : Control,

      set : function(name, value) {

          var
              _self       = this,
              _model      = _self.model,
              _targets    = _self.targets;

          if (name in _model) {

              _model[name] = value;

              for (var _i = 0, _len = _targets.length; _i < _len; _i++) {

                  _targets[_i].value = value;
              }
          }

          return _self;
      },

      bind : function(name, ele) {

          var
              _self = this,
              _type = "change",
              _func;

          _func = function(event) {

              // 由于 attatchEvent 存在 this 指向 window 的问题，所以采用此方式去兼容
              var _tar = event.target || event.srcElement;

              _self.set(name, _tar.value);
          };

          _self.targets.push(ele);

          if (ele.addEventListener) {

              ele.addEventListener(_type, _func, false);

          } else {

              ele.attachEvent("on" + _type, _func);
          }

          return _self;
      },

      init : function() {

          var
              _self   = this,
              _model  = _self.model;

          for (var _key in _model) {

              // 由于 ie 下，页面加载完，input 不会立刻修改其 value 值，要通过此 hack 才行
              setTimeout(function() {
                  _self.set(_key, _model[_key]);
              }, 0);
          }

          return _self;
      }
  };

  // 实例
  ctrl = new Control(model);

  ctrl
      .bind("val", input)
      .bind("val", output)
      .init();
```

[实例](example/1-2-2.html)


### 1.2.3. 订阅/发布模式

同样的，我们也可以通过订阅/发布模式来实现同样的目的：

```
  var
      model       = {
                          val : 123
                      },
      broadcast   = null,
      Broadcast   = null,
      input       = document.getElementById("input"),
      output      = document.getElementById("output");


  // 发布/订阅类
  Broadcast = function() {

      this.store = {};
  };

  Broadcast.prototype.sub = function(name, func) { // 订阅（Subscribe）

      var _store = this.store;

      if (!(name in _store)) {

          _store[name] = [];
      }

      _store[name].push(func);

      return this;
  };

  Broadcast.prototype.pub = function(name, data) { // 发布（Public）

      var _store = this.store;

      if (name in _store) {

          for (var _i = 0, _list = _store[name], _len = _list.length; _i < _len; _i++) {

              _list[_i](data);
          }

      } else {

          alert(name + " 不存在，请先订阅");
      }

      return this;
  };

  // 实例
  broadcast = new Broadcast();

  // 订阅相关事件
  broadcast
      .sub("/update/value", function(data) {

          var _val = data.val;

          model.val = _val;

          // 由于 ie 下，页面加载完，input 不会立刻修改其 value 值，要通过此 hack 才行
          setTimeout(function() {
              input.value = _val;
              output.value = _val;
          }, 0);

      })
      .sub("/init/ele", function() {

          var func = function(event) {

              var _tar = event.target || event.srcElement;

              broadcast.pub("/update/value", { val : _tar.value });
          };

          // 绑定 1 个事件
          if (input.addEventListener) {

              input.addEventListener("change", func, "false");

          } else {

              input.attachEvent("onchange", func);
          }
      });

  // 发布相关事件
  broadcast
      .pub("/update/value", { val : model.val })
      .pub("/init/ele");
```

[实例](example/1-2-3.html)


### 1.2.4. 总结

- 由于业务要求越来越高，促使 web 前端开发这一块，在`数据-页面元素-调度对象`不断分化，形成各种`MV*`

- 本节所使用的 **观测者模式** 和 **订阅/发布模式** 都比较简陋，主要是让大家对这两种模式有个初步的了解

- 个人鄙见：**观察者模式**适用于不同元素之间的连接；而**订阅/发布模式**适用于更为弹性的调度