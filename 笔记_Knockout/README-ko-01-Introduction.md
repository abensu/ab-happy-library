# Knockoutjs笔记


## [简介](http://www.cnblogs.com/TomXu/archive/2011/11/21/2256749.html)

Knockout是一个轻量级的UI类库，通过应用MVVM模式使JavaScript前端UI简单化。

1. 重要概念：

  - ** 声明式绑定 (Declarative Bindings) **：使用简明易读的语法很容易地将模型(model)数据关联到DOM元素上。

  - ** UI界面自动刷新 (Automatic UI Refresh) **：当您的模型状态(model state)改变时，您的UI界面将自动更新。

  - ** 依赖跟踪 (Dependency Tracking) **：为转变和联合数据，在你的模型数据之间隐式建立关系。

  - ** 模板 (Templating) **：为您的模型数据快速编写复杂的可嵌套的UI。

2. Knockout重要特性：

  - ** 优雅的依赖追踪 ** - 不管任何时候你的数据模型更新，都会自动更新相应的内容。

  - ** 声明式绑定 ** - 浅显易懂的方式将你的用户界面指定部分关联到你的数据模型上。

  - ** 灵活全面的模板 ** - 使用嵌套模板可以构建复杂的动态界面。

  - ** 轻易可扩展 ** - 几行代码就可以实现自定义行为作为新的声明式绑定。

3. 好处：

  - ** 纯JavaScript类库 ** – 兼容任何服务器端和客户端技术

  - ** 可添加到Web程序最上部 ** – 不需要大的架构改变

  - ** 简洁的 ** – Gzip之前大约25kb

  - ** 兼容任何主流浏览器 ** (IE 6+、Firefox 2+、Chrome、Safari、其它)

  - ** Comprehensive suite of specifications （采用行为驱动开发）** - 意味着在新的浏览器和平台上可以很容易通过验证。

简称：KO

官方网站：[http://knockoutjs.com](http://knockoutjs.com)


## 事例

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>

    <h2 data-bind="text: fullInfo"></h2>

    <h3 data-bind="text: titleText">Meal upgrades</h3>
    <p>Make your flight more bearable by selecting a meal to match your social and economic status.</p>
Chosen meal: <select data-bind="options: availableMeals, optionsText: 'mealName', value: chosenMeal"></select>

    <p>
        You've chosen:
        <b data-bind="text: chosenMeal().description"></b>
        (price: <span data-bind="text: formatPrice(chosenMeal().extraCost)"></span>)
    </p>

    <script src="js/knockout-3.1.0.js"></script>
    <script>
        var availableMeals = [
            { mealName: 'Standard', description: 'Dry crusts of bread', extraCost: 0 },
            { mealName: 'Premium', description: 'Fresh bread with cheese', extraCost: 9.95 },
            { mealName: 'Deluxe', description: 'Caviar and vintage Dr Pepper', extraCost: 18.50 }
        ];

        var viewModel = {
            titleText : ko.observable("Meal Meal"),
            infoText : ko.observable(1),
            chosenMeal : ko.observable(availableMeals[0])
        };

        viewModel.fullInfo = ko.dependentObservable(function() {
            return this.titleText() + this.infoText();
        }, viewModel);

        function formatPrice(price) {
            return price === 0 ? "Free" : "$" + price;
        };

        ko.applyBindings(viewModel);
    </script>
</body>
</html>
```

![事例效果图](http://pic002.cnblogs.com/images/2011/349491/2011112109242037.png "事例效果图")


## 体系

1. 观察者对象 / Observables

  - ** observable ** 针对 value/{} 的观察者

    ```
    var myViewModel = {
        personName: ko.observable('Bob'),
        personAge: ko.observable(123)
    };
    ```

  - ** computed ** 针对组合 observable 并返回 observable 的观察者

    ```
    The name is <span data-bind="text: fullName"></span>
    ...
    function AppViewModel() {
        var self = this;
        // ... leave firstName and lastName unchanged ...

        self.fullName = ko.computed(function() {
            return self.firstName() + " " + self.lastName();
        }, this);
    };
    ```

  - ** observableArray ** 针对 array 的观察者

    ```
    var myObservableArray = ko.observableArray(); // 初始化空数组
    // 或者
    // var myObservableArray = ko.observableArray(['Mike']);
    myObservableArray.push('Some value');
    ```

2. 文字和结构表现绑定 / Bindings for Controlling text and appearance

  - ** visible ** 展示/隐藏结构

    - false / 0 / null / undefined => yourElement.style.display = 'none'

    - true / 非null对象 / array => 移除 yourElement.style.display 的值

    ```
    <div data-bind="visible: shouldShowMessage">...</div>
    ```

  - ** text ** 文本显示(针对非form元素)

    ```
    <span data-bind="text: myMessage"></span>
    ```

  - ** html ** 结构显示

    ```
    <div data-bind="html: details"></div>
    ```

  - ** css ** 样式类名添加

    ```
    <!-- 当为 true 时，div 元素添加 profitWarning 类名 -->
    <div data-bind="css: { profitWarning: currentProfit() < 0 }">...</div>
    ...
    <!-- 当为 true 时，div 元素添加 profit-Warning 类名 -->
<div data-bind="css: { 'profit-Warning': currentProfit() < 0 }">...</div>
    ...
    <!-- 直接赋类名值 hello，可以结合 computed 等观测者进行使用 -->
    <div data-bind="css: 'hello'">...</div>
    ```

  - ** style ** 样式kv添加

    ```
    <div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black' }">
    ```

  - ** attr ** 标签属性添加

    ```
    <a data-bind="attr: { href: url, title: details }">...</div>
    ```

3. 流控制绑定（模板制作）/ Bindings for Control flow

  - ** foreach ** 遍历数组，生成对象

    ```
    <table>
        <thead>
            <tr><th>First name</th><th>Last name</th></tr>
        </thead>
        <tbody data-bind="foreach: people">
            <tr>
                <td data-bind="text: firstName"></td>
                <td data-bind="text: lastName"></td>
            </tr>
        </tbody>
    </table>
    <script type="text/javascript">
        ko.applyBindings({
            people: [
                { firstName: 'Bert', lastName: 'Bertington' },
                { firstName: 'Charles', lastName: 'Charlesforth' },
                { firstName: 'Denise', lastName: 'Dentiste' }
            ]
        });
    </script>
    ```

  - ** if **

    ```
    <!-- 用法1：效果如 visible -->
    <div data-bind="if: displayMessage">Here is a message. Astonishing.</div>

    <!-- 用法2：当满足假值时，div 的内容不生成 -->
    <ul data-bind="foreach: planets">
        <li>
            Planet: <b data-bind="text: name"> </b>
            <div data-bind="if: capital">
                Capital: <b data-bind="text: capital.cityName"> </b>
            </div>
        </li>
    </ul>
    ```

  - ** ifnot ** （用法同上）

  - ** with ** 创建新的上下文（如原生js用法相当）

    ```
    <h1 data-bind="text: city"> </h1>
    <p data-bind="with: coords">
        Latitude: <span data-bind="text: latitude"> </span>,
        Longitude: <span data-bind="text: longitude"> </span>
    </p>

    <script type="text/javascript">
        ko.applyBindings({
            city: "London",
            coords: {
                latitude: 51.5001524,
                longitude: -0.1262362
            }
        });
    </script>
    ```

  - ** &lt;!-- ko --&gt; ... &lt;!-- /ko --&gt; ** 虚拟元素（强大啊！），此元素可有效减少不必要的标签存在

    - ** foreach **

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

    - ** if / ifnot **

      ```
      <ul>
          <li>This item always appears</li>
          <!-- ko if: someExpressionGoesHere -->
              <li>I want to make this item present/absent dynamically</li>
          <!-- /ko -->
          <!-- ko ifnot: someExpressionGoesHere -->
              <li>OMG</li>
          <!-- /ko -->
      </ul>
      ```

    - ** with **

      ```
      <!-- 当 outboundFlight 存在时，则生成里面的元素，否则不生成；inboundFlight 同理 -->
      <ul>
          <li>Header element</li>
          <!-- ko with: outboundFlight -->
              ...
          <!-- /ko -->
          <!-- ko with: inboundFlight -->
              ...
          <!-- /ko -->
      </ul>
      ```

4. 表单元素和交互绑定（添加下面的动作都会阻止冒泡，解决的方法会在下面的例子提供）/ Bindings for Working with form fields 

  - ** click ** 点击

    ```
    <!-- 添加 clickBubble: false，解除阻止冒泡，如无必要，不必添加 -->
    <button data-bind="click: myFunction, clickBubble: false">
        Click me
    </button>

    <script type="text/javascript">
        var viewModel = {
            myFunction: function(data, event) {
                // data 为当前绑定的 model
                if (event.shiftKey) {
                    // 当按下 shift 键时触发的事件
                } else {
                    // 其他键的普通事件
                }
            }
        };
        ko.applyBindings(viewModel);
    </script>
    ```

  - ** event ** 动作事件（除 click 外），如 keypress / mouseover / mouseout 等

    ```
    <div>
        <div data-bind="event: { mouseover: enableDetails, mouseout: disableDetails }, mouseoverBubble: false">
            Mouse over me
        </div>
        <div data-bind="visible: detailsEnabled">
            Details
        </div>
    </div>
    ```

  - ** submit ** 针对 form 元素的 submit 事件

    ```
    <form data-bind="submit: doSomething">
        ... form contents go here ...
        <button type="submit">Submit</button>
    </form>

    <script type="text/javascript">
        var viewModel = {
            doSomething : function(formElement) {
                // ... now do something
            }
        };
    </script>
    ```

  - ** enable ** 针对 input / select / textarea 等具有 disabled 属性的元素

    ```
    <input type='text' data-bind="value: cellphoneNumber, enable: hasCellphone" />
    ```

  - ** disable ** 与上用法相反

  - ** value ** 针对 input / select / textarea 等具有 value 属性的元素

    ```
    <p>Login name: <input data-bind="value: userName" /></p>
    <p>Password: <input type="password" data-bind="value: userPassword" /></p>

    <script type="text/javascript">
        var viewModel = {
            userName: ko.observable(""), // Initially blank
            userPassword: ko.observable("abc"), // Prepopulate
            ...
        };
    </script>
    ```

    - ** valueUpdate ** 取值 change / input / keyup / keypress / afterkeydown

      更新所需的动作（默认是 change 事件），input 事件需要 IE9 以上才支持（针对input / textarea）

    - ** valueAllowUnset ** 取值 true / false （针对 select）

      允许默认值不在列表中
    
      ```
      <p>
          Select a country:
          <select data-bind="options: countries,
                             optionsCaption: 'Choose one...',
                             value: selectedCountry,
                             valueAllowUnset: true"></select>
      </p>

      <script type="text/javascript">
          var viewModel = {
              countries: ['Japan', 'Bolivia', 'New Zealand'],
              selectedCountry: ko.observable('Latvia')
          };
      </script>
      ```

  - ** hasFocus ** 聚焦事件

    ```
    <input data-bind="hasFocus: isSelected" />
    ```

  - ** checked ** 针对 radio / checkbox 的选中事件，取值 true / false

    - checkbox

      ```
      <p>Send me spam: <input type="checkbox" data-bind="checked: wantsSpam" /></p>
      <div data-bind="visible: wantsSpam">
          Preferred flavors of spam:
          <div><input type="checkbox" value="cherry" data-bind="checked: spamFlavors" /> Cherry</div>
          <div><input type="checkbox" value="almond" data-bind="checked: spamFlavors" /> Almond</div>
          <div><input type="checkbox" value="msg" data-bind="checked: spamFlavors" /> Monosodium Glutamate</div>
      </div>

      <script type="text/javascript">
          var viewModel = {
              wantsSpam: ko.observable(true),
              spamFlavors: ko.observableArray(["cherry","almond"]) // Initially checks the Cherry and Almond checkboxes
          };

          // ... then later ...
          viewModel.spamFlavors.push("msg"); // Now additionally checks the Monosodium Glutamate checkbox
      </script>
      ```

    - radio

      ```
      <p>Send me spam: <input type="checkbox" data-bind="checked: wantsSpam" /></p>
      <div data-bind="visible: wantsSpam">
          Preferred flavor of spam:
          <div><input type="radio" name="flavorGroup" value="cherry" data-bind="checked: spamFlavor" /> Cherry</div>
          <div><input type="radio" name="flavorGroup" value="almond" data-bind="checked: spamFlavor" /> Almond</div>
          <div><input type="radio" name="flavorGroup" value="msg" data-bind="checked: spamFlavor" /> Monosodium Glutamate</div>
      </div>

      <script type="text/javascript">
          var viewModel = {
              wantsSpam: ko.observable(true),
              spamFlavor: ko.observable("almond") // Initially selects only the Almond radio button
          };

          // ... then later ...
          viewModel.spamFlavor("msg"); // Now only Monosodium Glutamate is checked
      </script>
      ```

  - ** options ** 针对 select 的数据绑定

    ```
    <p>
        Destination country:
        <select data-bind="options: availableCountries"></select>
    </p>

    <script type="text/javascript">
        var viewModel = {
            // These are the initial options
            availableCountries: ko.observableArray(['France', 'Germany', 'Spain'])
        };

    // ... then later ...
    viewModel.availableCountries.push('China'); // Adds another option
    </script>
    ```

    - ** optionsText **

      设置&lt;option&gt;文本&lt;/option&gt;

    - ** optionsCaption **

      为空 value 的默认选中 option 元素

    - ** optionsValue **

      设置&lt;option&gt;的 value 值

    - ** optionsIncludeDestroyed **

      展示销毁的option元素，取值 true / false

    - ** optionsAfterRender **

      针对 option 生成的动作

    - ** selectedOptions **

      针对多选选择下拉框，选中的项目

    - ** valueAllowUnset **

      ```
      <select size=3 data-bind="options: myItems,
                                optionsCaption: 'Select...',
                                optionsText: 'name',
                                optionsValue: 'id',
                                optionsAfterRender: setOptionDisable">
      </select>

      <script type="text/javascript">
          var vm = {
              myItems: [
                  { name: 'Item 1', id: 1, disable: ko.observable(false)},
                  { name: 'Item 3', id: 3, disable: ko.observable(true)},
                  { name: 'Item 4', id: 4, disable: ko.observable(false)}
              ],
              setOptionDisable: function(option, item) {
                  ko.applyBindingsToNode(option, {disable: item.disable}, item);
              }
          };
          ko.applyBindings(vm);
      </script>
      ```

  - ** selectedOptions ** 针对多项选择下拉框

    ```
    <p>
        Choose some countries you'd like to visit:
        <select data-bind="options: availableCountries, selectedOptions: chosenCountries" size="5" multiple="true"></select>
    </p>

    <script type="text/javascript">
        var viewModel = {
            availableCountries : ko.observableArray(['France', 'Germany', 'Spain']),
            chosenCountries : ko.observableArray(['Germany']) // Initially, only Germany is selected
        };

        // ... then later ...
        viewModel.chosenCountries.push('France'); // Now France is selected too
    </script>
    ```

  - ** uniqueName ** 生成唯一 name 值，取值 true / false

    ```
    <input data-bind="value: someModelProperty, uniqueName: true" />
    ```

5. 模板 / Bindings for Rendering templates

  - ** template ** 模板渲染

    ```
    <h2>Participants</h2>
        Here are the participants:
        <div data-bind="template: { name: 'person-template', data: buyer }"></div>
        <div data-bind="template: { name: 'person-template', data: seller }"></div>
    ...

    <script type="text/html" id="person-template">
        <h3 data-bind="text: name"></h3>
        <p>Credits: <span data-bind="text: credits"></span></p>
    </script>

    <script type="text/javascript">
        function MyViewModel() {
            this.buyer = { name: 'Franklin', credits: 250 };
            this.seller = { name: 'Mario', credits: 5800 };
        };
        ko.applyBindings(new MyViewModel());
    </script>
    ```

    - ** name **

      模板ID名

    - ** data **

      当前 model 对象（非数组型）

    - ** if **

      当为 true 时，模板渲染

    - ** foreach **

      遍历的数组对象

    - ** as **

      类似于 with 的用法

    - ** afterRender / afterAdd / beforeRemove **

      模板渲染后 / 插入后 / 移除前调用函数

      事例1：

      ```
      <h2>Participants</h2>
      Here are the participants:
      <div data-bind="template: { name: 'person-template', data: buyer }"></div>
      <div data-bind="template: { name: 'person-template', data: seller }"></div>
      ...

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

      事例2：

      ```
      <ul data-bind="template: { name: 'seasonTemplate', foreach: seasons, as: 'season' }"></ul>

      <script type="text/html" id="seasonTemplate">
          <li>
              <strong data-bind="text: name"></strong>
              <ul data-bind="template: { name: 'monthTemplate', foreach: months, as: 'month' }"></ul>
          </li>
      </script>

      <script type="text/html" id="monthTemplate">
          <li>
              <span data-bind="text: month"></span>
              is in
              <span data-bind="text: season.name"></span>
          </li>
      </script>

      <script>
          var viewModel = {
              seasons: ko.observableArray([
                  { name: 'Spring', months: [ 'March', 'April', 'May' ] },
                  { name: 'Summer', months: [ 'June', 'July', 'August' ] },
                  { name: 'Autumn', months: [ 'September', 'October', 'November' ] },
                  { name: 'Winter', months: [ 'December', 'January', 'February' ] }
              ])
          };
          ko.applyBindings(viewModel);
      </script>
      ```

      事例3：

      ```
      <div data-bind='template: { name: "personTemplate",
                                   data: myData,
                                   afterRender: myPostProcessingLogic }'> </div>

      viewModel.myPostProcessingLogic = function(elements) {
          // "elements" is an array of DOM nodes just rendered by the template
          // You can add custom post-processing logic here
      }
      ```

6. 绑定语法 / Binding syntax

  - ** data-bind **

  - ** bindingContext ** 绑定区域上下文（应用与 with / foreach）

    - ** $parents ** 上N级的 context（model）

      - ** $parents[0] ** 上一级 context（model）

      - ** $parents[1] ** 上一级的上一级 context（model）

      - ** $parents[2] ** 上一级的上一级的上一级 context（model）

      - ...等等

    - ** $root ** 最上级的 context（model）

    - ** $data ** 当前 model 的数据

    - ** $index ** 当前的索引

    - ** $parentContext ** 上一级 context

    - ** $rawData ** 当前 model 的原数据

    - ** $context ** 当前 context

    - ** $element ** 当前 html 元素

7. 创建自定义绑定 / Creating custom bindings

  - ** 创建自定义绑定 ** （支持使用虚拟元素 &lt;!-- ko --&gt;...&lt;!-- /ko --&gt;）

    ```
    ko.bindingHandlers.yourBindingName = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // 当第一次绑定到一个元素时，init函数会被调用
            // 设置一些初始状态、事件绑定等
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // 当第一次绑定到一个元素时，update函数会被调用
            // observable 改变值时，会再次调用
            // 根据提供的值，更新DOM元素
        }
    };
    ```

    - ** init / update **

      初始化 / 更新调用的函数（只要其中一种即可；一般设置update即可）

    - ** element **

      当前 html 元素

    - ** valueAccessor **

      当前 model 的对应绑定的属性值（如属性值有绑定，调用 ko.unwrap 获取其值）

    - ** allBindings **

      当前元素所有的binding

    - ** viewModel **

      当前的 viewModel（可以用 bindingContext.$data 或者 bindingContext.$rawData替代）

    - ** bindingContext **

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

        element —— input

        valueAccessor —— hasFocus 绑定的 editingName

        viewModel —— viewModel

        bindingContext —— 绑定的上下文

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
