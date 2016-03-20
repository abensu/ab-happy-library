# 2. 初识Knockoutjs（v 3.3.0）


## 2.1. What Why How（马列主义经典问题...）


### 2.1.1. What

官方原文（[链接](http://knockoutjs.com/documentation/introduction.html)）：

> Knockout is a JavaScript library that helps you to create rich, responsive display and editor user interfaces with a clean underlying data model. Any time you have sections of UI that update dynamically (e.g., changing depending on the user’s actions or when an external data source changes), KO can help you implement it more simply and maintainably.

鄙人译文：

> Knockout 是一个能够帮助你创建丰富可响应展现的，同时通过一种清晰且强调数据模型的方式去编辑你的用户界面的 JavaScript 库。有时你会有部分需要动态更新的 UI（例如，依赖用户行为去改变或当一个外部数据源发生改变），KO 就能帮助你用更简单和可维护的方式去实现它。


### 2.1.2. Why

官方原文（[链接](http://knockoutjs.com/documentation/introduction.html)）：

> Headline features:
>
> - **Elegant dependency tracking** - automatically updates the right parts of your UI whenever your data model changes.
>
> - **Declarative bindings** - a simple and obvious way to connect parts of your UI to your data model. You can construct a complex dynamic UIs easily using arbitrarily nested binding contexts.
>
> - **Trivially extensible** - implement custom behaviors as new declarative bindings for easy reuse in just a few lines of code.
>
> Additional benefits:
>
> - **Pure JavaScript library** - works with any server or client-side technology
>
> - **Can be added on top of your existing web application** without requiring major architectural changes
>
> - **Compact** - around 13kb after gzipping
>
> - **Works on any mainstream browser** (IE 6+, Firefox 2+, Chrome, Safari, other
>
> - **Comprehensive suite of specifications** (developed BDD-style) means its correct functioning can easily be verified on new browsers and platforms

汤姆大叔译文（[链接](http://www.cnblogs.com/TomXu/archive/2011/11/21/2256749.html)）：

> 重要特性：
>
> - **优雅的依赖追踪** - 不管任何时候你的数据模型更新，都会自动更新相应的内容。
>
> - **声明式绑定** - 浅显易懂的方式将你的用户界面指定部分关联到你的数据模型上。
>
> - **灵活全面的模板** - 使用嵌套模板可以构建复杂的动态界面。（这条貌似现在已经没有标出来了...）
>
> - **轻易可扩展**- 几行代码就可以实现自定义行为作为新的声明式绑定。
>
> 额外的好处：
>
> - **纯JavaScript类库** – 兼容任何服务器端和客户端技术
>
> - **可添加到Web程序最上部** – 不需要大的架构改变
>
> - **简洁的** – Gzip之前大约25kb
>
> - **兼容任何主流浏览器** (IE 6+、Firefox 2+、Chrome、Safari、其它)
>
> - **具说明性的套件** （采用行为驱动开发） - 意味着在新的浏览器和平台上可以很容易通过验证。


### 2.1.3. How

官方事例：

![官方事例](http://knockoutjs.com/img/homepage-example.png)

[链接](http://knockoutjs.com/)


## 2.2. 基本对象（观察者）【model 部分】


### 2.2.1. observable（值观察者）

```
  The name is <span data-bind="text: personName"></span>

  ...

  var myViewModel = {
      personName: ko.observable('Bob'),
      personAge: ko.observable(123)
  };

  myViewModel.personName(); // 返回 'Bob'
  myViewModel.personAge();  // 返回 123

  myViewModel.personName('Mary'); // 其值设置为 'Mary'

  myViewModel.personName('Mike').personAge(50); // 支持链式语法
```

### 2.2.2. observableArray（数组观察者）

```
  // 空值定义数组观测者
  var myObservableArray = ko.observableArray();    // 定义了一个空数组
  myObservableArray.push('Some value');            // 添加一个值，并且通知观察者

  // 非空值定义数组观察者
  var anotherObservableArray = ko.observableArray([ // 此观察者数组在定义时，包括了三个对象
      { name: "Bungle", type: "Bear" },
      { name: "George", type: "Hippo" },
      { name: "Zippy", type: "Unknown" }
  ]);

  alert('The length of the array is ' + anotherObservableArray().length); // 3
  alert('The first element is ' + anotherObservableArray()[0]); // { name: "Bungle", type: "Bear" }
```

#### 方法：

> 以下方法具体使用请参考 [javascript array](http://www.w3school.com.cn/jsref/jsref_obj_array.asp) 的标准用法

- indexOf

```
  myObservableArray.indexOf('Blah'); // 返回 -1，因为值不存在与数组
```

- slice

```
  anotherObservableArray.slice(0, 1); // 返回 { name: "Bungle", type: "Bear" }
```

- pop

```
  myObservableArray.pop(); // 移除数组最后一个值，并返回它
```

- push

```
  myObservableArray.push('Some new value'); // 添加一个新值到数组最后
```

- shift

```
  myObservableArray.shift(); // 移除数组第一个值，并返回它
```

- unshift

```
  myObservableArray.unshift('Some new value'); // 添加一个新值到数组最前
```

- sort

```
  myObservableArray.sort(); // 顺序排序数组

  myObservableArray.sort(function(left, right) { // 自定义排序
      return left.lastName == right.lastName ? 0 : (left.lastName < right.lastName ? -1 : 1)
  });
```

- splice

```
  myObservableArray.splice(1, 3); // 移除数组第 2 个元素开始的 3 个元素，并返回它们
```

> 以下方法为 knockout 自定的数组方法

- remove

```
  // 移除数组中的某项
  myObservableArray.remove(someItem);
  myObservableArray.remove(function(item) { return item.age < 18 });
```

- removeAll

```
  // 移除数组中的某些项或全部
  myObservableArray.removeAll(['Chad', 132, undefined]); // 移除等于 'Chad'、132 或 undefined 的元素
  myObservableArray.removeAll(); // 数组清空
```

> 以下方法适用于 Ruby on Rails 的开发者，使用时，数组中每一项都要设置 `_destory` 为 `true`

- destroy （用法与效果与 remove 一致，用于 RoR）

- destroyAll （用法与效果与 removeAll 一致，用于 RoR）


### 2.2.3. computed（智能观察者）

```
  The name is <span data-bind="text: fullName"></span>

  ...

  function AppViewModel() {

      var self = this;
   
      self.firstName = ko.observable('Bob');
      self.lastName = ko.observable('Smith');

      self.fullName = ko.computed(function() {
          return self.firstName() + " " + self.lastName();
      });
  };
```

当 `firstName` 和 `lastName` 任一值或都发生变化，`fullName` 也会发生变化


### 2.2.4. pureComputed（纯粹的智能观察者）

**此观测者为 `ko.computed` 的文静版**

```
  The name is <span data-bind="text: fullName"></span>

  ...

  function AppViewModel() {

      var self = this;
   
      self.firstName = ko.observable('Bob');
      self.lastName = ko.observable('Smith');

      self.fullName = ko.pureComputed(function() {
          return self.firstName() + " " + self.lastName();
      });

      // 等价于
      // this.fullName = ko.computed(function() {
      //     return this.firstName() + " " + this.lastName();
      // }, this, { pure : true });
  };
```

官方原文（[链接](http://knockoutjs.com/documentation/computedObservables.html)）：

> If your computed observable simply calculates and returns a value based on some observable dependencies, then it’s better to declare it as a ko.pureComputed instead of a ko.computed.
>
> Since this computed is declared to be pure (i.e., its evaluator does not directly modify other objects or state), Knockout can more efficiently manage its re-evaluation and memory use. Knockout will automatically suspend or release it if no other code has an active dependency on it.

鄙人译文：

> 如果你的智能观察者只是简单地计算和返回基于某些观察者的依赖，那么最好将它声明为一个 `ko.pureComputed`，而不是 `ko.computed`。
>
> 因为智能观察者被声明为 pure 类型（例如，它的促发不是直接修改其他对象或状态），knockout 就能够更有效管理它的反射和内存使用。如果回调函数中没有对应依赖的观测者，knockout 会自动暂停或减少促发。


## 2.3. 各类绑定【UI 部分】

```
  绑定一般有两种：

  1) 值绑定:
     <div data-bind="visible: shouldShowMessage">...</div>

  2) 对象绑定:
     <div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black' }">...</div>
```

### 2.3.1. 文本和表现

- [visible](http://knockoutjs.com/documentation/visible-binding.html) `Boolean`

- [text](http://knockoutjs.com/documentation/text-binding.html) `String or Number`

- [html](http://knockoutjs.com/documentation/html-binding.html) `String or Number`

- [css](http://knockoutjs.com/documentation/css-binding.html) `Object or String`

- [style](http://knockoutjs.com/documentation/style-binding.html) `Object`

- [attr](http://knockoutjs.com/documentation/attr-binding.html) `Object`


### 2.3.2. 控制流

- [foreach](http://knockoutjs.com/documentation/foreach-binding.html) `Array`

- [if](http://knockoutjs.com/documentation/if-binding.html) `Boolean`

- [ifnot](http://knockoutjs.com/documentation/ifnot-binding.html) `Boolean`

- [with](http://knockoutjs.com/documentation/with-binding.html) `Object`

- [component](http://knockoutjs.com/documentation/component-binding.html) `Object`

本部分绑定支持强大的虚拟绑定，如 `foreach` 的虚拟绑定：

```
  <ul>
      <li class="header">Header item</li>
      <!-- ko foreach: myItems -->
          <li>Item <span data-bind="text: $data"></span></li>
      <!-- /ko -->
  </ul>

  <script type="text/javascript">
      ko.applyBindings({
          myItems: [ 'A', 'B', 'C' ]
      });
  </script>
```


### 2.3.3. 表单与事件绑定

- [click](http://knockoutjs.com/documentation/click-binding.html) `Function`

- [event](http://knockoutjs.com/documentation/event-binding.html) `Object :: Function`

- [submit](http://knockoutjs.com/documentation/submit-binding.html) `Function`

- [enable](http://knockoutjs.com/documentation/enable-binding.html) `Boolean`

- [disable](http://knockoutjs.com/documentation/disable-binding.html) `Boolean`

- [value](http://knockoutjs.com/documentation/value-binding.html) `String or Number`

- [textInput](http://knockoutjs.com/documentation/textinput-binding.html) `String or Number`

- [hasFocus](http://knockoutjs.com/documentation/hasfocus-binding.html) `Boolean`

- [checked](http://knockoutjs.com/documentation/checked-binding.html) `Boolean`

- [options](http://knockoutjs.com/documentation/options-binding.html) `String or Number`

- [selectedOptions](http://knockoutjs.com/documentation/selectedOptions-binding.html) `Boolean`

- [uniqueName](http://knockoutjs.com/documentation/uniqueName-binding.html) `Boolean`


### 2.3.4. 模板渲染

- [template](http://knockoutjs.com/documentation/template-binding.html) `Object or String`

实例：

```
  <h2>Participants</h2> 
  Here are the participants:
  <div data-bind="template: { name: 'person-template', data: buyer }"></div>
  <div data-bind="template: { name: 'person-template', data: seller }"></div>

  <script type="text/html" id="person-template">
    <h3 data-bind="text: name"></h3>
    <p>Credits: <span data-bind="text: credits"></span></p>
  </script>

  <script type="text/javascript">
      function MyViewModel() {
          this.buyer = { name: 'Franklin', credits: 250 };
          this.seller = { name: 'Mario', credits: 5800 };
      }
      ko.applyBindings(new MyViewModel());
  </script>
```

属性：

- name `String`

- nodes `Array`

- data `String`

- if `String`

- foreach `String`

- as `String`

- afterRender, afterAdd, or beforeRemove `Function`

[链接](http://knockoutjs.com/documentation/template-binding.html)


## 2.4. 创建自定义绑定

```
  <div data-bind="yourBindingName: someValue"> </div>

  ...

  ko.bindingHandlers.yourBindingName = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          // 当第一次绑定到一个元素时，init函数会被调用
          // 例如这里就是设置一些初始状态、事件绑定等
      },
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          // 当第一次绑定到一个元素时，update 函数会被调用
          // 而当观测者的值发生改变时，会再次调用 update
          // 在此，会根据提供的值，更新 DOM 元素
      }
  };
```
- ** init / update **

  初始化 / 更新调用的函数（只要其中一种即可；一般设置update即可）

- ** element **

  当前 html 元素

- ** valueAccessor **

  当前 model 的对应绑定的属性值（如属性值有绑定，调用 ko.unwrap 获取其值）

- ** allBindings **

  当前元素所有的binding

- ** viewModel **

  当前的 viewModel（可以用 bindingContext.$data 或者 bindingContext.$rawData替代）

- ** bindingContext **

  （包括$parent，$parents，$root）

```
  <p>Name: <input data-bind="hasFocus: editingName" /></p>

  <!-- Showing that we can both read and write the focus state -->
  <div data-bind="visible: editingName">You're editing the name</div>
  <button data-bind="enable: !editingName(), click:function() { editingName(true) }">Edit name</button>

  <script type="text/javascript">
      var viewModel = {
          editingName: ko.observable()
      };
      ko.applyBindings(viewModel);
  </script>
```

  - 解释：

    `element` —— input

    `valueAccessor` —— hasFocus 绑定的 editingName

    `viewModel` —— viewModel

    `bindingContext` —— 绑定的上下文

- ** 创建能控制后代绑定的自定义绑定 **

通过 init 函数返回 { controlsDescendantBindings: false }，使后代元素的绑定失效

```
  <div data-bind="allowBindings: true">
    <!-- 这会显示'Replacement'，因为绑定被应用 -->
    <div data-bind="text: 'Replacement'">Original</div>
  </div>

  <div data-bind="allowBindings: false">
    <!-- 这会显示'Original'，因为绑定不被应用 -->
    <div data-bind="text: 'Replacement'">Original</div>
  </div>

  ko.bindingHandlers.allowBindings = {
    init: function(elem, valueAccessor) {
        // 使绑定正常进行，除非当值为false
        var shouldAllowBindings = ko.unwrap(valueAccessor());
        return { controlsDescendantBindings: !shouldAllowBindings };
    }
  };
```


## 2.5. Components（组件开发）

### 2.5.1 入门事例

```
  <ul data-bind="foreach: products">
      <li class="product">
          <strong data-bind="text: name"></strong>
          <like-widget params="value: userRating"></like-widget>
      </li>
  </ul>

  <script src="http://knockoutjs.com/downloads/knockout-3.3.0.js"></script>
  <script>
      ko.components.register('like-widget', {
          viewModel: function(params) {

              var self = this;

              // Data: value is either null, 'like', or 'dislike'
              self.chosenValue = params.value;
               
              // Behaviors
              self.like = function() { self.chosenValue('like'); };
              self.dislike = function() { self.chosenValue('dislike'); };
          },
          template:
              '<div class="like-or-dislike" data-bind="visible: !chosenValue()">\
                  <button data-bind="click: like">Like it</button>\
                  <button data-bind="click: dislike">Dislike it</button>\
              </div>\
              <div class="result" data-bind="visible: chosenValue">\
                  You <strong data-bind="text: chosenValue"></strong> it\
              </div>'
      });

      function Product(name, rating) {
          this.name = name;
          this.userRating = ko.observable(rating || null);
      }
       
      function MyViewModel() {
          this.products = [
              new Product('Garlic bread'),
              new Product('Pain au chocolat'),
              new Product('Seagull spaghetti', 'like') // This one was already 'liked'
          ];
      }
       
      ko.applyBindings( new MyViewModel() );

  </script>
```

[事例](example/2-5-1-a.html)

```
  ko.components.register('like-widget', {
      viewModel: { require: '2-5-1-b-model' },
      template: { require: 'text!2-5-1-b-tmpl.html' }
  });
```

> 必须在服务器环境中才能进行

[事例（requirejs版）](example/2-5-1-b.html)

### 2.5.2 `ko.components.register` 使用

```
  ko.components.register('some-component-name', {
      viewModel: <see below>,
      template: <see below>
  });
```

#### viewModel

* A constructor function

```
  function SomeComponentViewModel(params) {
      // 'params' is an object whose key/value pairs are the parameters
      // passed from the component binding or custom element.
      this.someProperty = params.something;
  }
   
  SomeComponentViewModel.prototype.doSomething = function() { ... };
   
  ko.components.register('my-component', {
      viewModel: SomeComponentViewModel,
      template: ...
  });
```

* A shared object instance

```
  var sharedViewModelInstance = { ... };
   
  ko.components.register('my-component', {
      viewModel: { instance: sharedViewModelInstance },
      template: ...
  });
```

* A createViewModel factory function

```
  ko.components.register('my-component', {
      viewModel: {
          createViewModel: function(params, componentInfo) {
              // - 'params' is an object whose key/value pairs are the parameters
              //   passed from the component binding or custom element
              // - 'componentInfo.element' is the element the component is being
              //   injected into. When createViewModel is called, the template has
              //   already been injected into this element, but isn't yet bound.
              // - 'componentInfo.templateNodes' is an array containing any DOM
              //   nodes that have been supplied to the component. See below.
   
              // Return the desired view model instance, e.g.:
              return new MyViewModel(params);
          }
      },
      template: ...
  });
```

* An AMD module whose value describes a viewmodel

```
  ko.components.register('my-component', {
      viewModel: { require: 'some/module/name' },
      template: ...
  });
```

对应的 `some/module/name` 文件

```
  // AMD module whose value is a component viewmodel constructor
  define(['knockout'], function(ko) {
      function MyViewModel() {
          // ...
      }
   
      return MyViewModel;
  });
```

* 其他形式的 AMD 形式

a shared object instance

```
  // AMD module whose value is a shared component viewmodel instance
  define(['knockout'], function(ko) {
      function MyViewModel() {
          // ...
      }
   
      return { instance: new MyViewModel() };
  });
```

a createViewModel function

```
  // AMD module whose value is a 'createViewModel' function
  define(['knockout'], function(ko) {
      function myViewModelFactory(params, componentInfo) {
          // return something
      }
       
      return { createViewModel: myViewModelFactory };
  });
```

a reference to a different AMD module

```
  // AMD module whose value is a reference to a different AMD module,
  // which in turn can be in any of these formats
  define(['knockout'], function(ko) {
      return { module: 'some/other/module' };
  });
```

#### template

* An existing element ID

```
  <template id='my-component-template'>
      <h1 data-bind='text: title'></h1>
      <button data-bind='click: doSomething'>Click me right now</button>
  </template>

  ko.components.register('my-component', {
      template: { element: 'my-component-template' },
      viewModel: ...
  });
```

* An existing element instance

```
  var elemInstance = document.getElementById('my-component-template');
   
  ko.components.register('my-component', {
      template: { element: elemInstance },
      viewModel: ...
  });
```

* A string of markup

```
  ko.components.register('my-component', {
      template: '<h1 data-bind="text: title"></h1>\
                 <button data-bind="click: doSomething">Clickety</button>',
      viewModel: ...
  });
```

* An array of DOM nodes

```
  var myNodes = [
      document.getElementById('first-node'),
      document.getElementById('second-node'),
      document.getElementById('third-node')
  ];
   
  ko.components.register('my-component', {
      template: myNodes,
      viewModel: ...
  });
```

* A document fragment

```
  ko.components.register('my-component', {
      template: someDocumentFragmentInstance,
      viewModel: ...
  });
```

* An AMD module whose value describes a template

```
  ko.components.register('my-component', {
      template: { require: 'some/template' },
      viewModel: ...
  });
```

> `some/template` 为标准 js 文件

通过使用 requirejs 的 text 插件，可以这样使用：

```
  ko.components.register('my-component', {
      template: { require: 'text!path/my-html-file.html' },
      viewModel: ...
  });
```

#### 额外的参数

* `synchronous` : [ false ] 是否使用同步方式加载

```
  ko.components.register('my-component', {
      viewModel: { ... anything ... },
      template: { ... anything ... },
      synchronous: true // 如果已经加载则使用同步注入，否则仍使用异步
  });
```

#### KO 的 components 是如何使用 AMD

```
  ko.components.register('my-component', {
      viewModel: { require: 'some/module/name' },
      template: { require: 'text!some-template.html' }
  });
```

这样会促发 KO 在内部执行：

```
  require(['some/module/name'], callback)

  require(['text!some-template.html'], callback)
```

不过要注意：

> * require 的使用并不严格依赖与 require.js 或者其他特别的模块加载。一些提供一种 AMD 风格的模块加载需要 API 才能运行。如果你想整合一个不同 API 的模块加载，你可以实现一种自定义的组建加载。
>
> * Knockout 不会以任何方式整合模块名 —— 它只是把它传到 require() 中。所以 Knockout 当然不能知道或在乎你的模块是从何加载。这全靠你的 AMD 加载器和你如何注册它。
>
> * Knockout 不知道也关心你的 AMD 模块是否异步。通常我们发现最方便的组件定义是通过异步模块，而那样的关注点是如何从 KO 中完全分离出来。

#### 作为一个单独的 AMD 模块注册组件

```
  ko.components.register('my-component', { require: 'some/module' });
```

some/module.js 文件：

```
  define(['knockout'], function(ko) {
      function MyComponentViewModel(params) {
          this.personName = ko.observable(params.name);
      }
   
      return {
          viewModel: MyComponentViewModel,
          template: 'The name is <strong data-bind="text: personName"></strong>'
      };
  });
```

> 其实还是要这种对象 `{ viewModel : ..., template : ... }`

#### 一种推荐的 AMD 模块模式

```
  ko.components.register('my-component', { require: 'path/my-component' });
```

path/my-component.js 文件：

```
  // 推荐理由:
  //  - 通过一个单独的 'require' 声明就能被应用
  //  - 可以包含一系列 r.js 参数
  define(['knockout', 'text!./my-component.html'], function(ko, htmlString) {

      function MyComponentViewModel(params) {
          // 设置对象属性等
      }
   
      // 使用 prototype 去声明一些公共方法
      MyComponentViewModel.prototype.doSomething = function() { ... };
   
      // 返回定义好的组件
      return { viewModel: MyComponentViewModel, template: htmlString };
  });
```


## 2.6. 实用技巧

### 加载与保存 JSON 数据

```
  var viewModel = {
      firstName : ko.observable("Bert"),
      lastName : ko.observable("Smith"),
      pets : ko.observableArray(["Cat", "Dog", "Fish"]),
      type : "Customer"
  };
  viewModel.hasALotOfPets = ko.computed(function() {
      return this.pets().length > 2
  }, viewModel)

  var jsonData = ko.toJSON(viewModel);
  // 返回：
  // '{"firstName":"Bert","lastName":"Smith","pets":["Cat","Dog","Fish"],"type":"Customer","hasALotOfPets":true}'

  var plainJs = ko.toJS(viewModel);
  // 返回：
  //   {
  //      firstName: "Bert",
  //      lastName: "Smith",
  //      pets: ["Cat","Dog","Fish"],
  //      type: "Customer",
  //      hasALotOfPets: true
  //   }
```

`ko.toJSON` 即调用 `JSON.stringify`（如果没有原生 JSON 或引入 json2.js 文件，会报错）

### 扩展观察者对象

创建 `extender`

```
  ko.extenders.logChange = function(target, option) {
      target.subscribe(function(newValue) {
         console.log(option + ": " + newValue);
      });
      return target; // 这样写可以在下式进行 chain 的写法
  };

  ...

  this.firstName = ko.observable("Bob").extend({logChange: "first name"});
```

[样例](example/2-6-1.html)

如果 `firstName` 观测者的值被改变成 "Ted"，那么 `console.log` 会在控制台打印 "first name: Ted"

其参数对应关系如下：

```
  ko.observable("Bob").extend({logChange: "first name"});
  --------------------         ---------  ------------
          |                        |          |
          |                        |           ---------------
          |                        ↓                          ↓
          |       ko.extenders.logChange = function(target, option)
          |                                           ↑
           -------------------------------------------
```

`ko.extenders.logChange` 对应的函数仅会被调用一次（初始化时）

[更多样例](http://knockoutjs.com/documentation/extenders.html)

### 观察者延迟广播（≥ 3.1.0，以下版本通过 `extender` 定义）

```
  this.firstName = ko.observable("Bob").extend( {rateLimit: 500} );
  this.secondName = ko.observable("Tim").extend( {rateLimit: {timeout: 500, method: "notifyWhenChangesStop"} } );

  this.fTimes = ko.observable(0);
  this.sTimes = ko.observable(0);

  this.fName = ko.computed(function() {
      this.fTimes(this.fTimes() + 1);
      return this.firstName().toUpperCase();
  }, this);
  this.sName = ko.computed(function() {
      this.sTimes(this.sTimes() + 1);
      return this.secondName().toUpperCase();
  }, this);
```

[样例](example/2-6-2.html)

一般情况下，一个观察者的值被改变时会立刻广播到订阅者，所以一些 computed 观察者或依赖于观测者的绑定会同步更新。然而，`rateLimit` 扩展会阻止观测者立刻广播并延迟到一个设定的时间进行。因此一个 rateLimit 观察者更新依赖对象是异步执行的。

`rateLimit` 扩展能设置到任何类型的观察者中，如数组观察者和智能观察者，其主要应用场景为：

1、让反应延迟到一个确切的时间内发生

2、把多次的更新合并到一次进行

```
  // 简易版: 声明一个延迟时间，单位为微秒
  someObservableOrComputed.extend({ rateLimit: 500 });
   
  // 详细版: 声明一个包含 timeout（和 method，非必须）的对象
  someObservableOrComputed.extend({ rateLimit: { timeout: 500, method: "notifyWhenChangesStop" } });

  // method 取值，及其解释
  //  |
  //  |- "notifyAtFixedRate"      : 每次更新都会在延迟到相应的时间点广播（默认值）,如下所示：
  //  |
  //  |                             | update update ... | update update ... | update update ... |
  //  |                              ----- timeout -----|----- timeout -----|----- timeout -----|
  //  |                                                 ↓                   ↓                   ↓
  //  |                                               notify              notify              notify
  //  |
  //  |
  //  `- "notifyWhenChangesStop"  : 在延迟的时间内还有更新，则不进行上一次的广播，只广播最后一次,如下所示：
  //
  //                                | update update ... |                   |
  //                                                    |----- timeout -----|
  //                                                                        ↓
  //                                                                      notify
```

[更多样例](http://knockoutjs.com/documentation/rateLimit-observable.html)

#### 对于智能观察者的特殊考虑

对于智能观察者，当其所依赖的对象改变时，而不是它自身的值改变，rateLimit 的定时器会被促发。智能观察者不会被再次执行，直到当某些对象改变所引发的广播发生后并延迟改变它的值，或当智能观察者的值被直接访问时。如果你需要访问智能观察者中最近促发的值，你可以使用 peek 方法。

#### 强制促发使用 rateLimit 的观察者进行广播

当任何观察者的值是原始的（一个数字，布尔，字符串，或者 null），仅当它被设置一个与当前不一致的值时，其依赖的观察者才被通知。所以，设置了 rateLimit 的观察者的原始值与最终延迟后设置的值确实不一致时才会进行广播。从另一方面看，如果（设置了 rateLimit 的）观察者的值变成新值后，在延迟结束前又变回原来的值，就不会产生任何广播。

如果你确定任何更新都要进行广播，即使是设置相同的值，你就必须使用 notify 扩展添加到 rateLimit 中：

```
  myViewModel.fullName = ko.computed(function() {
      return myViewModel.firstName() + " " + myViewModel.lastName();
  }).extend({ notify: 'always', rateLimit: 500 });
```

#### 比较节流扩展与 rateLimit 扩展

如果你想从使用过时的节流扩展迁移代码，你需要注意以下 rateLimit 扩展与节流扩展的区别。

当使用 rateLimit 时：

The default rate-limit method is different from the throttle algorithm. To match the throttle behavior, use the notifyWhenChangesStop method.

1. 向观察者写入信息是不会延迟的；观察者的值会马上改变。对于可写的智能观察者，这意味着写入的方法总是立即运行。

1. 所有改变引起的广播会延迟，包括正在手动调用 valueHasMutated 时。这意味着你不能使用 valueHasMutated 去强迫设置了 rateLimit 的观察者去广播一个不能改变的值。

1. rateLimit 中 method 的默认方法有别于节流算法。为了接近节流的行为，请使用 notifyWhenChangesStop 方法。

1. 设置了 rateLimit 的智能观察者的赋值并不受 rateLimit 控制；如果你读取它的值，它会再次求值。

#### 使用不显眼的事件处理程序

大多数情况下，`data-bind` 属性提供一种清晰简洁的方式去绑定 `view model`。然而，事件处理是一个往往导致 `data-bind` 属性繁冗的位置，作为匿名函数通常被推荐的方法是传递参数。例如：

```
  <a href="#" data-bind="click: function() { viewModel.items.remove($data); }">
      remove
  </a>
```

作为替代，Knockout 提供 2 个辅助函数去让你确定 1 个与 DOM 元素相关联的数据：

* `ko.dataFor(element)` - 返回用于绑定到元素的数据

* `ko.contextFor(element)` - 返回绑定到 DOM 元素的整个上下文

这些辅助函数可用于在不使用像 jQuery 的 `bind` 或 `click` 事件处理程序上。以上功能可以通过 1 个 `remove` 类连接到每一个环节上，如：

```
  $(".remove").click(function () {
      viewModel.items.remove(ko.dataFor(this));
  });
```

更好的是，这种技术可以用来支持事件代理。jQuery 的 `live/delegate/on` 函数是一个简单的方法来做到这一点：

```
  $(".container").on("click", ".remove", function() {
      viewModel.items.remove(ko.dataFor(this));
  });
```

现在，一个单独的事件处理依附到一个更高的级别中，并且处理带有 `remove` 类的 `a` 标签的点击事件。该方法具有自动处理动态添加到文档的附加 `a` 标签的好处（例如一个项目被添加到一个数组观察者中）。

[样例](http://knockoutjs.com/documentation/unobtrusive-event-handling.html)

#### 使用 `fn` 添加自定义函数

有时，你会寻找机会通过附加新功能到 Knockout 核心类型值中去简化你的代码。你可以使用如下方式去声明自定义方法：

![继承图](http://knockoutjs.com/documentation/images/fn/type-hierarchy.png)

由于继承，如果你添加一个函数到 `ko.subscribable` 中，它对其他所有类型都可用。如果你添加一个函数到 `ko.observable` 中，它会被 `ko.observableArray` 继承，但不会被 `ko.computed` 继承。

为了添加一个自定义函数，将它添加到下面的一个扩展点上：

* `ko.subscribable.fn`

* `ko.observable.fn`

* `ko.observableArray.fn`

* `ko.computed.fn`

然后，从创建那时起，你的自定义函数将对所有类型值可用。

注意：此扩展点最好仅用于自定义功能，在大范围的场景下十分适用。如果你只打算使用它一次，你不需要添加一个自定义函数到这些命名空间中。

```
  ko.observableArray.fn.filterByProperty = function(propName, matchValue) {
      return ko.pureComputed(function() {
          var allItems = this(), matchingItems = [];
          for (var i = 0; i < allItems.length; i++) {
              var current = allItems[i];
              if (ko.unwrap(current[propName]) === matchValue)
                  matchingItems.push(current);
          }
          return matchingItems;
      }, this);
  }

  function Task(title, done) {
      this.title = ko.observable(title);
      this.done = ko.observable(done);
  }
   
  function AppViewModel() {
      this.tasks = ko.observableArray([
          new Task('Find new desktop background', true),
          new Task('Put shiny stickers on laptop', false),
          new Task('Request more reggae music in the office', true)
      ]);
   
      // 使用自定义函数
      this.doneTasks = this.tasks.filterByProperty("done", true);
  }
   
  ko.applyBindings(new AppViewModel());
```

[样例](example/2-6-3.html)

#### 使用 `preprocess` 扩展 Knockout 的绑定语法（≥ 3.0.0）

这是一种先进的技术，通常仅当创建可重用的绑定库或扩展语法才使用。在构建 Knockout 的应用程序时，此方法并不经常需要你用到。

从 Knockout 3.0 开始，在绑定过程中，开发者声明自定义语法可以通过提供回调函数去重写 DOM 节点和字符串绑定。

##### `preprocess` 用于字符串绑定

为了一个特殊的绑定处理（例如 `click`，`visible`，或任何自定义绑定处理），通过提供一个绑定预处理，你可以把钩子加载到 Knockout 的逻辑中去解析 `data-bind` 属性。

例如，添加一个 `preprocess` 函数到 `bindingHandlers` 的一个自定义函数中：

```
  ko.bindingHandlers.yourBindingHandler.preprocess = function(stringFromMarkup) {
      // Return stringFromMarkup if you don't want to change anything, or return
      // some other string if you want Knockout to behave as if that was the
      // syntax provided in the original HTML

      // 如果你不想改变任何东西，就直接 `return stringFromMarkup`
      // 或返回其他字符串，如果你想 Knockout 像原来 HTML 所提供的语法去运作
  }
```

##### 例子 1 ：给绑定设置默认值

如果你没有设置一个绑定的值，它默认会是 `undefined`。如果你想给绑定一个不同的默认值，你可以使用 `preprocess`。例如，你可以让 `uniqueName` 在不传入值的情况下返回它的默认值为 `true`：

```
  ko.bindingHandlers.uniqueName.preprocess = function(val) {
      return val || 'true';
  }
```

现在你可以这样绑定：

```
  <input data-bind="value: someModelProperty, uniqueName" />
```

##### 例子 2 ：绑定表达式到事件

如果你想绑定表达式到 `click` 事件（而不是一个 Knockout 暴露的函数引用），你可以设置一个预处理给 `click` 去支持这样的语法：

```
  ko.bindingHandlers.click.preprocess = function(val) {
      return 'function($data,$event){ ' + val + ' }';
  }
```

现在你可以想这样绑定 `click` 事件：

```
  <button type="button" data-bind="click: myCount(myCount()+1)">Increment</button>
```

##### 绑定预处理引用

```
  ko.bindingHandlers.<name>.preprocess(value, name, addBindingCallback)
```

如果进行定义，这个函数会在绑定生效前调用每个 `<name>` 的绑定。

参数：

* `value` : 在 Knockout 进行解析它之前，与绑定连接的值（例如，对于 `yourBinding: 1 + 1`，其对应的值是作为字符串的 `1 + 1`）

* `name` : 绑定的名字（例如，对于 `yourBinding: 1 + 1`，其对应的名字为 `yourBinding`）

* ` addBindingCallback` : 一个回调函数，你可以在一个当前元素中随意地插入其他绑定。它需要两个参数，`name` 和 `value`。例如，在你的 `preprocess` 函数中，调用 `addBindingCallback('visible', 'acceptsTerms()');` 去使 Knockout 表现就像元素有 `visible: acceptsTerms()` 绑定在其中。

返回值：

* 你的 `preprocess` 函数必须返回新的字符串去被解析和传到绑定中，或者返回 `undefined` 去清除绑定。

例如，如果你返回 `value + ".toUpperCase()"` 作为字符串，那么 `yourBinding: "Bert"` 就像注入 `yourBinding: "Bert".toUpperCase()` 这样的标记。Knockout 会用正常的方式解析返回值，所以它必须是一个合法的 Javascript 表达式。

不要返回空字符串。那样做没有意义，因为标记一般为字符串。

##### 预处理 DOM 节点

通过为节点提供 `preprocessor`，你可以加载钩子到 Knockout 的逻辑中去贯穿 DOM 元素。这种函数，Knockout 会在每次遍历 DOM 节点时调用一次，包括 UI 第一次绑定时和之后新的 DOM 子树被进入时（例如，通过 `foreach` 进行的绑定）。

为了达到这目的，定义一个 `preprocessNode` 函数到你的绑定中：

```
  ko.bindingProvider.instance.preprocessNode = function(node) {
      // 如果你需要的话，使用 DOM 原生的 API，如 setAttribute，去修改节点。
      // 如果你想去除 DOM 中的节点，可以通过 `return null` 或不带有 `return` 的声明。
      // 如果你想用其他一些列的节点去替换目标节点，
      //    - 使用 DOM 原生 API 的 insertChild 去注入新的节点到目标节点的前面
      //    - 使用 DOM 原生 API 的 removeChild 去移除目标节点（如果你需要的话）
      //    - 返回一个包含你想插入的新节点的数组让 Knockout 能够对他们应用任何绑定
  }
```

##### 例子 3 ：虚拟 `template` 元素

如果你经常使用包含模板内容的虚拟元素，一般的语法会让你觉得那么些冗长。使用预处理，你就能使用一个独立的注释添加一个新的模板格式：

```
  ko.bindingProvider.instance.preprocessNode = function(node) {
      // 仅当注释节点为 <!-- template: ... --> 才起作用
      if (node.nodeType == 8) {
          var match = node.nodeValue.match(/^\s*(template\s*:[\s\S]+)/);
          if (match) {
              // 创建一对注释去替换单独的注释
              var c1 = document.createComment("ko " + match[1]), // "ko template: ..."
                  c2 = document.createComment("/ko");
              node.parentNode.insertBefore(c1, node);
              node.parentNode.replaceChild(c2, node);
   
              // 告诉 Knockout 新的节点，让新节点能够使用任何绑定
              return [c1, c2];
          }
      }
  }
```

现在你可以包含一个 `template` 在你的 UI 中：

```
  <!-- template: 'some-template' -->
```

预处理引用：

```
  ko.bindingProvider.instance.preprocessNode(node)
```

如果定义了，这个函数会在每个 DOM 节点被绑定执行之前被调用。这个函数能够修改、移除和替换节点。任何新的节点必须立即插入到节点前面，并且任何节点被添加或移除，函数都必须返回一个当前在 document 中用于替换元素组成的新元素数组。


## 2.7. 插件

### 映射（`mapping`）插件

Knockout 被设计用于让你使用任意 Javascript 对象作为 `view model`。只要你的 `view model` 的某些属性是观察者（observables），你就能通过 KO 去绑定到你的 UI 上，并且 UI 会在观察者的属性发生改变时立刻自动更新。

大部分应用需要从后端服务器拉取数据。因为服务器没有任何观察者的概念，它仅能提供纯 Javascript 对象（一般会是 JSON）。`mapping` 插件会给予你一种简单的方式去将带有（Knockout 的）观察者的 `view model` 绘制成纯 Javascript 对象。从而替代你手动写入一个构建基于从服务器所拉取的部分数据的 `view model` 的 Javascript 代码。

#### 下载

* [版本 2.0](https://github.com/SteveSanderson/knockout.mapping/tree/master/build/output) (压缩版为 8.6 kb)

#### 例子：手动映射，不使用 `ko.mapping` 插件

你想在页面展示当前服务器时间和用户数。你可以用下面的 `view model` 展现这些信息：

```
  var viewModel = {
      serverTime: ko.observable(),
      numUsers: ko.observable()
  }
```

你可以如下将 `view model` 绑定到某些 HTML 中：

```
  The time on the server is: <span data-bind='text: serverTime'></span>
  and <span data-bind='text: numUsers'></span> user(s) are connected.
```

由于 `view model` 的属性是观察者，每当这些属性发生改变，KO 会自动更新到 HTML 元素中。

之后，如果你想从服务器获取最新的数据。每 5 秒调用一次异步请求（例如，使用 jQuery 的 `$.getJSON` 或 `$.ajax` 函数）：

```
  var data = getDataUsingAjax();          // 从服务器获取数据
```

服务器会返回像下面的数据：

```
  {
      serverTime: '2010-01-07',
      numUsers: 3
  }
```

最终，使用些数据（不使用 `mapping` 插件）去更新你的 `view model`，你会这样写：

```
  // data 是每次从服务器获取的数据
  viewModel.serverTime(data.serverTime);
  viewModel.numUsers(data.numUsers);
```

你必须为每个你想展示到页面的变量做这些事。如果你的数据结构变得更加复杂（例如，它们包含子代或数组），这会变得难以手动操作。而 `mapping` 插件允许你去创建一个从标准 Javascript 对象（或 JSON 结构）映射到一个带有观察者的 `view model`。

#### 使用 `ko.mapping`

通过 `mapping` 插件去创建一个 `view model`，使用 `ko.mapping.fromJS` 函数替换上面创建 `viewModel` 的代码：

```
  var viewModel = ko.mapping.fromJS(data);
```

这样的方式会为每个 `data` 中的属性自动创建观察者。然后，每次从服务器接收新数据，你可以一下子通过再次调用 `ko.mapping.fromJS` 函数去更新所有 `viewModel` 的属性：

```
  // data 是每次从服务器接收到的数据:
  ko.mapping.fromJS(data, viewModel);
```

#### 它是怎么进行映射：

* 一个对象中的所有属性会被转成一个观察者。如果有更新改变了值，它会更新观察者。

* 数组会被转成观察者数组。如果更新改变了数组的总数，它会执行适当的添加或删除动作。它也会尝试去保持与原 Javascript 数组一样的规律（次序）。

#### 解除映射

如果你想把已经映射了的对象返回到原来的 JS 对象，你可以使用：

```
  var unmapped = ko.mapping.toJS(viewModel);
```

这会创建一个去除包含仅原 JS 对象被映射了的那部分属性的映射的对象。所以换言之，任何你手动添加到 `view model` 中的属性或函数都会被忽视。通常，只有 `_destroy` 属性是例外的，因为它是一个当你销毁一个 `ko.observableArray` 中的一个项目时 Knockout 会生成的属性。更多详情请查看“高级用法”中如何配置它。

