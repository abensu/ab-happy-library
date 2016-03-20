## 1. 演变

目标：文本框输入数据，展示内容发生改变（以标准浏览器为例）

模板：

```
  <input placeholder="名字">
  <input placeholder="年龄">
  <input placeholder="特长">

  <p>
      名字：<span></span><br>
      年龄：<span></span><br>
      特长：<span></span>
  </p>
```

[下方事例链接](example/w-1-1.html)

### 1.1. 阶段一

```
  var
      node_doc    = document,
      node_main   = node_doc.getElementById("level_1"),
      node_name   = node_main.getElementsByTagName("input")[0],
      node_age    = node_main.getElementsByTagName("input")[1],
      node_spec   = node_main.getElementsByTagName("input")[2],
      node_sName  = node_main.getElementsByTagName("a")[0],
      node_sAge   = node_main.getElementsByTagName("a")[1],
      node_sSpec  = node_main.getElementsByTagName("a")[2];

  node_name.addEventListener("input", function(event) {

      node_sName.textContent = this.value;

  }, false);

  node_age.addEventListener("input", function(event) {

      node_sAge.textContent = this.value;

  }, false);

  node_spec.addEventListener("input", function(event) {

      node_sSpec.textContent = this.value;

  }, false);
```

* 利于 “设值” 的动作，但不利于 “取值” 动作

### 1.2. 阶段二

```
  var
      node_doc    = document,
      node_main   = node_doc.getElementById("level_2"),
      node_name   = node_main.getElementsByTagName("input")[0],
      node_age    = node_main.getElementsByTagName("input")[1],
      node_spec   = node_main.getElementsByTagName("input")[2],
      node_sName  = node_main.getElementsByTagName("a")[0],
      node_sAge   = node_main.getElementsByTagName("a")[1],
      node_sSpec  = node_main.getElementsByTagName("a")[2],
      data_store;

  data_store = {
      "name"  : "",
      "age"   : 0,
      "spec"  : "",
      "set"   : function(type, val, node) {

                      var
                          node_tar;

                      if (type in this) {
                          this[type] = val;
                      }

                      node_tar = node ? node : {};

                      node_tar.textContent = val;
                  },
      "get"   : function(type) {

                      var this_tar;

                      if (type in this) {
                          this_tar = this[type];
                      }

                      return this_tar;
                  }
  };

  // 设值

  node_name.addEventListener("input", function(event) {

      data_store.set("name", this.value, node_sName);

  }, false);

  ...

  // 取值

  node_sName.addEventListener("click", function(event) {

      alert( data_store.get("name") );

  }, false);

  ...
```

* 利于 “设值” 的动作，也利于 “取值” 动作

* 但耦合度也比较高

### 1.3. 阶段三

```
  var
      ViewModel,
      viewmodel;

  ViewModel = function(root) {

      var self = this;

      self._model = {};

      self._view = {};

      self._root = root || document;

      self._bindName = "data-b";
  };

  ViewModel.prototype.set = function(key, val) {

      var self = this;

      self._model[key] = val;
  };

  ViewModel.prototype.get = function(key) {

      var self = this;

      return self._model[key];
  };

  ViewModel.prototype.broadcast = function(key, exceptNode) {

      var
          self        = this,
          val         = self.get(key),
          nodelist    = self._view[key],
          len         = nodelist.length,
          tar         = null,
          index       = 0;

      for (; index < len; index++) {

          tar = nodelist[index];

          if (tar === exceptNode) { // 对于自身不再进行赋值操作
              continue;
          }

          "value" in tar ? tar.value = val : tar.textContent = val;
      }
  };

  ViewModel.prototype.bind = function(key, node) {

      var self = this;

      !(key in self) && (self[key] = "");

      node.addEventListener("input", function(event) {
          self.set(key, this.value || this.textContent);
          self.broadcast(key, this);
      }, false);
  };

  ViewModel.prototype.init = function() {

      var
          self        = this,
          bindName    = self._bindName,
          nodelist    = self._root.querySelectorAll("[" + bindName + "]"),
          len         = nodelist.length,
          index       = 0,
          tar         = null,
          nodeKey     = "";

      for (; index < len; index ++) {

          tar     = nodelist[index];
          nodeKey = tar.getAttribute(bindName);

          if (nodeKey && !( /^\s+$/.test(nodeKey) ) ) {

              !self._view[nodeKey] && (self._view[nodeKey] = []);

              self._view[nodeKey].push(tar);

              self.bind(nodeKey, tar);
          }
      }

      return nodelist;
  };

  viewmodel = new ViewModel( document.getElementById('level_3') );

  viewmodel.init();
```

* 利于 “设值” 的动作，也利于 “取值” 动作

* 耦合度降低了

### 1.4. 小结

上面三个阶段主要是回顾了：

* 阶段一：简单的值显示

```
  input -> (event:input) -> a.textContent
```

* 阶段二：简单的 MVC （单向绑定）

```
  input -> (event:input) -> data_store -> a.textContent
                                |
                                `-------> 通过对应的键，获取所需的值
```

* 阶段三：简单的 MVVM （双向绑定）

```
  input <-> viewmodel <-> a.textContent
                |
                `-------> 获取所需的值
```

当然，时代仍继续前进，手法还不断优化。

而接下来，将介绍 MVVM 方面具代表性的库 —— Knockout

### 1.5. 扩展阅读

* [从MVC在前端开发中的局限性谈起](http://www.infoq.com/cn/articles/starting-from-limitations-of-mvc-in-front-end-development/)

* [MVC,MVP,MVVM之异曲同工](http://www.cnblogs.com/changxiangyi/archive/2012/07/16/2594297.html)


## 2. 初识Knockoutjs（v 3.3.0）

### 2.1. 经典马克思问题：What、Why、How

#### 2.1.1. What

Knockout 是一个能够帮助你创建丰富可响应展现的，同时通过一种清晰且强调数据模型的方式去编辑你的用户界面的 JavaScript 库。有时你会有部分需要动态更新的 UI（例如，依赖用户行为去改变或当一个外部数据源发生改变），KO 就能帮助你用更简单和可维护的方式去实现它。

#### 2.1.2. Why

重要特性：

- **优雅的依赖追踪** - 不管任何时候你的数据模型更新，都会自动更新相应的内容。

- **声明式绑定** - 浅显易懂的方式将你的用户界面指定部分关联到你的数据模型上。

- **灵活全面的模板** - 使用嵌套模板可以构建复杂的动态界面。（这条貌似现在已经没有标出来了...）

- **轻易可扩展**- 几行代码就可以实现自定义行为作为新的声明式绑定。

额外的好处：

- **纯JavaScript类库** – 兼容任何服务器端和客户端技术

- **可添加到Web程序最上部** – 不需要大的架构改变

- **简洁的** – Gzip之前大约25kb

- **兼容任何主流浏览器** (IE 6+、Firefox 2+、Chrome、Safari、其它)

- **具说明性的套件** （采用行为驱动开发） - 意味着在新的浏览器和平台上可以很容易通过验证。

#### 2.1.3. How

官方事例：

![官方事例](http://knockoutjs.com/img/homepage-example.png)

[链接](http://knockoutjs.com/)

### 2.2. 基本对象与绑定

#### 2.2.1. 基本对象

* observable（值观察者）

```
  this.name = ko.observable( "App Name" );
```

* observableArray（数组观察者）

```
  this.list = ko.observableArray( [1, 2, 3, 4] );
```

* computed（智能观察者）

```
  this.othername = ko.computed(function() { return "Yo " + this.name() }, this);
```

* pureComputed（纯粹的智能观察者）

```
  this.othername = ko.pureComputed(function() { return "Yo " + this.name() }, this);

  // 等价于
  // this.othername = ko.computed(function() { return "Yo " + this.name() }, this, {pure: true});
```

`computed` 与 `pureComputed` 的联系与区别：

* `pureComputed` 继承自 `computed`（其实都是 `computed`，只是多传了一个 `{pure: true}` 的参数）

* `computed` 中不存在 `ko` 的观察者，则只会调用一次（`pureComputed` 同理）

* `computed` 会大概如下工作：

```
  first ：

    ko.computed -> (link) -> ko.observable / ko.observableArray -> (combine) -> ... (e.g. render UI)

  then :

    ko.observable / ko.observableArray -> (change) -> ko.computed -> (combine) -> ... (e.g. render UI)
```

* `pureComputed` 会大概如下工作：

```
  first :

    UI -> (bind) -> ko.pureComputed -> (link) -> ko.observable / ko.observableArray -> (combine) -> UI

  then :

    ko.observable / ko.observableArray -> (change) -> ko.computed -> (combine) -> UI
```

[例子](example/w-2-1.html)

#### 2.2.2. 绑定

```
  分类
    |
    |- 文本和表现
    |   |
    |   |- visible          Boolean           是否可视（添加或删除 display:none 样式）
    |   |- text             String            显示的文本
    |   |- html             String            注入的 HTML
    |   |- css              String or Object  添加或删除指定 class 名
    |   |- style            Object            添加、删除或更改指定样式（内联方式写入）
    |   `- attr             Object            修改元素指定属性
    |
    |- 控制流
    |   |
    |   |- foreach          Array or Object   循环遍历输出 HTML
    |   |- if               Boolean           为真时，输出 HTML，否则清空
    |   |- ifnot            Boolean           为真时，清空，否则输出 HTML
    |   |- with             Object            改变作用域
    |   `- component        String or Object  组件
    |
    |- 表单与事件绑定
    |   |
    |   |- click            Function          点击事件
    |   |- event            Object            DOM 事件
    |   |- submit           Function          提交事件
    |   |- enable           Boolean           为真时，清除 disabled，否则设置 disabled
    |   |- disable          Boolean           为真时，设置 disabled，否则清除 disabled
    |   |- value            String or Number  默认，绑定的表单元素的 value 属性 change 后，促发观察者
    |   |                   Object            用于 select 元素（非 mutli-select） selected 的对象
    |   |- textInput        String or Number  默认，绑定的表单元素的 value 属性 input 后，促发观察者
    |   |- hasFocus         Boolean           是否要聚焦到该元素上
    |   |- checked          Boolean           是否设置 checked（针对 checkbox）
    |   |- options          Array             循环遍历输出 HTML（针对 select）
    |   |- selectedOptions  Array             给匹配的 option 项添加 selected（针对 mutli-select）
    |   `- uniqueName       Boolean           设置唯一的 name 属性值（如 name="ko_unique_1"）
    |
    `- 模板渲染
        |
        `- template         String or Object  根据提供的模板和数据输出 HTML
```

### 2.3. 事例

#### 2.3.1 迷你购物

[样例-模板](example/w-1-2-step-1-html.html)

[样例-绑定](example/w-1-2-step-2-binding.html)

[样例-测试](example/w-1-2-step-3-test.html)

```
  页面
    |
    |- 搜索区域
    |     |
    |     |- 关键词
    |     |- 分  类：内容：全部、上衣、裤子、包袋
    |     `- 对  象：内容：未知、男、女
    |
    |- 列表展示区域
    |     |
    |     `- 单个商品
    |           |
    |           |- 图片
    |           |- 名称
    |           |- 单价
    |           `- 按钮：状态：购买、取消购买
    |
    |- 分页区域
    |     |
    |     |- 单个页码：状态：当前、非当前
    |     |- 上 一 页：状态：可视、隐藏
    |     `- 下 一 页：状态：可视、隐藏
    |
    |- 购物车区域
    |     |
    |     |- 标题
    |     |- 单个商品
    |     |     |
    |     |     |- 图片
    |     |     |- 名字
    |     |     |- 单价
    |     |     |- 购买数量
    |     |     |- 按钮-增
    |     |     |- 按钮-减
    |     |     `- 按钮-删除
    |     |
    |     |- 按钮-确认购买
    |     `- 总价
    |
    `- 缓存区域
          |
          |- 图片路径
          |- 名称
          |- 单价
          |- 类型
          |- 对象/性别
          `- 购买数量
```

1. 区分：模块、元素

1. 区分：状态、行为

### 2.4. 建议与现象

* ie6 下标签前后的空白字符引起错位与渲染错误

![实际效果图](example/images/w-0001.png)

* smarty 对 `<` 敏感， UI 中的 `<` 需要在其后添加一个空格

* 继承使用寄生继承 `BaseClass.apply(this)`

* DOM 事件的时机问题（如需实现搜索框下拉区域带点击确认的效果）

* 可以单向绑定就尽量单向绑定

* 注释风格 `<!-- ko key: value -->...<!-- /ko -->`

* DIY 你的路由、指令：[简单的单页面应用](example/w-2-2.html)

* 多用 `template`，少用 `foreach`

* `class.prototype.func_do` 与 `class.func_do` 的区别

* `ko.observable` 的值为对象时，里面的值改变不会引起 UI 更新；同理，`ko.observableArray` 中的元素也是

* 如需智能观测者，请尽量使用 `ko.pureComputed` 以减少副作用

* `ko.component` 的愿景与 AMD
