# Knockoutjs 3.1.0 笔记

## 目录

***

- [简介](#)

  - ** 兼容广 **（兼容IE6），** 入门低 **（入门时间1星期以内），** 够直观 **（在标签属性调用），** 好调试 **（修改对应model的值即可查看效果）

  - 适用于页面各模块的开发（如分页、带下拉选择的搜索框、智能表单、筛选表格等）


- 观察者对象

  - ** [observable](#) ** =&gt; 针对 value/{} 的观察者

  - ** [computed](#) ** =&gt; 针对组合 observable 并返回 observable 的观察者

    - ko.computed( evaluator [, targetObject, options] ) / ko.computed( options )

      - evaluator

      - targetObject

      - options

        - read

        - write

        - owner

        - deferEvaluation

        - disposeWhen

        - disposeWhenNodeIsRemoved

    - ko.computed(...).xx()

      - dispose()

      - extend(extenders)

      - getDependenciesCount()

      - getSubscriptionsCount()

      - isActive()

      - peek()

      - subscribe( callback [,callbackTarget, event] )

    - ko.computedContext.xx()

      - isInitial()

      - getDependenciesCount()

  - ** [observableArray](#) ** =&gt; 针对 array 的观察者

    - observableArray().xx()

      - indexOf(string)

      - slice(startIndex, [length])

      - push('Some new value')

      - pop()

      - unshift('Some new value')

      - shift()

      - reverse()

      - sort()

      - remove(someItem) / remove(function(item) { return item.age < 18 })

      - removeAll() / removeAll(['Chad', 132, undefined])

      - destroy(someItem) / destroy(function(item) { return item.age < 18 })

      - destroyAll() / destroyAll(['Chad', 132, undefined])


- 文字和结构表现绑定

  - ** [visible](#) ** =&gt; 展示/隐藏结构

  - ** [text](#) ** =&gt; 文本显示(针对非form元素)

    - &lt;!-- ko text: someVal --&gt; ... &lt;!-- /ko --&gt;

  - ** [html](#) ** =&gt; 结构显示

  - ** [css](#) ** =&gt; 样式类名添加

  - ** [style](#) ** =&gt; 样式kv添加

  - ** [attr](#) ** =&gt; 标签属性添加


- 流控制绑定（模板制作）

  - ** [foreach](#) ** =&gt; 遍历数组，生成对象

    - &lt;!-- ko foreach: someArr --&gt; ... &lt;!-- /ko --&gt;

  - ** [if](#) **

    - &lt;!-- ko if: someVal --&gt; ... &lt;!-- /ko --&gt;

  - ** [ifnot](#) **

    - &lt;!-- ko ifnot: someVal --&gt; ... &lt;!-- /ko --&gt;

  - ** [with](#) ** =&gt; 创建新的上下文（如原生js用法相当）

    - &lt;!-- ko with: someVal --&gt; ... &lt;!-- /ko --&gt;


- 表单元素和交互绑定（添加下面的动作都会阻止冒泡，解决的方法会在下面的例子提供）

  - ** [click](#) ** =&gt; 点击

  - ** [event](#) ** =&gt; 动作事件（除 click 外），如 keypress / mouseover / mouseout 等

  - ** [submit](#) ** =&gt; 针对 form 元素的 submit 事件

  - ** [enable](#) ** =&gt; 针对 input / select / textarea 等具有 disabled 属性的元素

  - ** [disable](#) ** =&gt; 与上用法相反

  - ** [value](#) ** =&gt; 针对 input / select / textarea 等具有 value 属性的元素

    - valueUpdate

      - change

      - input / IE9+

      - keyup

      - keypress

      - afterkeydown

    - valueAllowUnset =&gt; 针对 select，取值 true / false

  - ** [hasFocus](#) ** =&gt; 聚焦事件，取值 true / false

  - ** [checked](#) ** =&gt; 针对 radio / checkbox 的选中事件，取值 true / false

    - checkedValue

  - ** [options](#) ** =&gt; 针对 select 的数据绑定

    - optionsCaption

    - optionsText

    - optionsValue

    - optionsIncludeDestroyed

    - optionsAfterRender

    - selectedOptions

    - valueAllowUnset

  - ** [selectedOptions](#) ** =&gt; 针对多项选择下拉框

  - **[uniqueName](#) ** =&gt; 生成唯一 name 值，取值 true / false

- 模板

  - ** [template](#) ** =&gt; 模板渲染

    - template: options

      - name

      - data

      - if

      - foreach

      - as

      - afterRender / afterAdd / beforeRemove

- 绑定语法

  - ** [data-bind](#) **

  - ** [bindingContext](#) ** =&gt; 绑定区域上下文


- 创建自定义绑定

  - ** [ko.bindingHandlers.yourBindingName](#) ** =&gt; 创建自定义绑定（支持使用虚拟元素 &lt;!-- ko --&gt;...&lt;!-- /ko --&gt;）

  - ** [{ controlsDescendantBindings: false }](#) ** =&gt; 创建能控制后代绑定的自定义绑定（通过 init 函数返回 { controlsDescendantBindings: false }，使后代元素的绑定失效）

  - ** [&lt;!-- ko --&gt; ... &lt;!-- /ko --&gt;](#) ** =&gt; 虚拟元素

  - ** [ko.utils.domNodeDisposal](#) ** =&gt; 自定义处理逻辑

    - ** [ko.utils.domNodeDisposal.addDisposeCallback(node, callback)](#) **

    - ** [ko.utils.domNodeDisposal.cleanExternalData(node)](#) **


- 高级技巧

  - ** [ko.toJS / ko.toJSON](#) ** =&gt; 转换 ko 观测者为原生值

  - ** [ko.extenders / ko.observable(...).extend](#) ** =&gt; 使用 extenders 增加观测者

  - ** [someObservableOrComputed.extend({ rateLimit: ... })](#) ** =&gt; 观测者的订阅发布的更新速度限制（** v3.1.0 **）

  - ** [ko.dataFor(element) / ko.contextFor(element)](#) ** =&gt; 从当前 DOM 获取当前 model 数据

  - ** [ko.subscribable.fn / ko.observable.fn / ko.observableArray.fn / ko.computed.fn](#) ** =&gt; 为观测者添加自定义事件

  - ** [ko.bindingHandlers.&lt;name&gt;.preprocess(value, name, addBindingCallback) / ko.bindingProvider.instance.preprocessNode(node)](#) ** =&gt; 使用 preprocess 扩展 ko 语法（** v3.0 **）


- 插件

  - ** [mapping](#) ** =&gt; 自动为 object 的各子孙元素添加观测者（这是主要功能，还有...）
