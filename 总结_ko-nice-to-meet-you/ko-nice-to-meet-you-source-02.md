## 基础函数 part 1

### 描述

第一部分的基础函数

### 行数

51 ~ 621

### 源码

```
ko.utils = (function() {

    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);

    // 用一种紧凑的方式去表示已知的事件类型，然后在运行时将它转变成一个事件名称的哈希值作为索引表（为了快速查找）
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // 一个 IE 9 的解决方法 - https://github.com/SteveSanderson/knockout/issues/406

    // 检测 IE 版本来解决某些 bug （为了更为健壮地检测，采用 IE 条件注释方式，而不是通过 UA 来判断）
    // 注意，由于 IE 10 不再支持条件注释的写法，以下的逻辑仅解决 IE 10 以下的版本
    // 当前 ko 还是继续这样设计，因为 IE 10 以上版本的行为接近于标准的浏览器
    // 如果有一个功能在 IE 10 以上版本需要被解决，我们会修改它
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    // 详细阐述改变节点的 class 值的模式
    // 请看 https://github.com/knockout/knockout/issues/1597
    var cssClassNameRegex = /\S+/g;

    function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
        var addOrRemoveFn;
        if (classNames) {
            if (typeof node.classList === 'object') {
                addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    addOrRemoveFn.call(node.classList, className);
                });
            } else if (typeof node.className['baseVal'] === 'string') {
                // SVG 标签 .classNames 是一个 SVGAnimatedString 实例
                toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
            } else {
                // node.className 应该是一个字符串
                toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
            }
        }
    }

    function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
        // obj/prop 是一对 node/'className' 或是一对 SVGAnimatedString/'baseVal'.
        var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
        ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
            ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
        });
        obj[prop] = currentClassNames.join(" ");
    }

    return {

        fieldsIncludedWithJsonPost : ['authenticity_token', /^__RequestVerificationToken(_.*)?$/] // 包含 JSON POST 的域（仅下方 postJson 使用）

        arrayForEach(array, action)                     // 遍历数组，并将各元素作为 action 参数，供其执行
        arrayIndexOf(array, item)                       // 数组中，对应某项的索引
        arrayFirst(array, predicate, predicateOwner)    // 找到数组中第一个匹配的元素，否则返回 null
                                                        //（仅下方 anyDomNodeIsAttachedToDocument 使用）
        arrayRemoveItem(array, itemToRemove)            // 移除数组某项
        arrayGetDistinctValues(array)                   // 数组排重，并返回新数组
        arrayMap(array, mapping)                        // 对数组每个元素进行处理，并返回新数组
        arrayFilter(array, predicate)                   // 数组过滤
        arrayPushAll(array, valuesToPush)               // 将 valuesToPush（数组或伪数组）的每项添加到数组末尾
        addOrRemoveItem(array, value, included)         // （不重复）添加或删除数组某项

        canSetPrototype                                 // 是否能设置原型
        extend(target, source)                          // 浅层继承
        setPrototypeOf(obj, proto)                      // 设置对象的原型
        setPrototypeOfOrExtend : canSetPrototype ? setPrototypeOf : extend

        objectForEach(obj, action)                      // arrayForEach 的对象版（浅层遍历）
        objectMap(source, mapping)                      // arrayMap 的对象版（浅层遍历）

        emptyDomNode(domNode)                           // 清空 dom 元素
        moveCleanedNodesToContainerElement(nodes)       // 将解除掉双向绑定的节点（event 绑定未解除）集挪到 div 容器中
        cloneNodes(nodesArray, shouldCleanNodes)        // 复制节点，并返回复制好的节点集
        setDomNodeChildren(domNode, childNodes)         // 设置 dom 元素的子节点（先清空，再添加子节点）
        replaceDomNodes(nodeToReplaceOrNodeArray, newNodesArray)    // 替换 dom 元素或节点集合

        fixUpContinuousNodeArray(continuousNodeArray, parentNode)   // 修复连续节点数组（非同级按顺序排列的节点集合，最终返回 undefined）

        setOptionNodeSelectionState(optionNode, isSelected)         // 设置 option 节点选中状态

        stringTrim(string)                              // 清除首尾空白字符和 16 进制的空格（"\xa0"）
        stringStartsWith(string, startsWith)            // 字符串 string 是否以 startsWith 字符串为开头

        domNodeIsContainedBy(node, containedByNode)     // containedByNode 是否包含 node（或为自身）
        domNodeIsAttachedToDocument(node)               // node 元素是否挂载到了 document 中
        anyDomNodeIsAttachedToDocument(nodes)           // 一些 node 元素是否挂载到了 document 中（只是判断是否存在一个符合的元素）

        tagNameLower(element)                               // 小写的标签名
        registerEventHandler(element, eventType, handler)   // 注册事件
        triggerEvent(element, eventType)                    // 促发事件

        unwrapObservable(value)     // 获取 KO 观察者的值
        peekObservable(value)       // 窥视 KO 观察者（如果是 KO 观测者，促发其 peek 方法）

        toggleDomNodeCssClass(node, classNames, shouldHaveClass) // 添加或移除 dom 元素中指定的 className 值

        setTextContent(element, textContent)    // 设置文本内容到 dom 元素中
        setElementName(element, name)           // 设置 dom 元素的 name 值
        forceRefresh(node)                      // 强制刷新，渲染节点
        ensureSelectElementIsRenderedCorrectly(selectElement) // 确定 select 元素被正确渲染

        range(min, max)             // 输出所在范围的数组（步长为 1，min 和 max 接受 KO 观察者）
        makeArray(arrayLikeObject)  // 伪数组变为数组

        isIe6       // 是否为 IE 6
        isIe7       // 是否为 IE 7
        ieVersion   // 输出 IE 版本（4 < version ≤ 9）,默认为 undefined

        getFormFields(form, fieldName)          // 获取表单元素中属性 name 值与 fieldName 一致的列表
                                                //（筛选 input 和 textarea）
        parseJson(jsonString)                   // JSON 字符串 -> JSON 对象（仅下方 postJson 使用）
        stringifyJson(data, replacer, space)    // JSON 对象 -> JSON 字符串（仅支持原生方法或引入json2.js）
        postJson(urlOrForm, data, options)      // 通过临时或指定的 form 元素 post JSON 数据
    };
})();

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // 简写, 因为该方法会经常用到
```

### 分析

#### 1) `objectForEach(obj, action)` : 遍历对象，并执行 action

```
/**
 * @param {object} obj      : [] 目标对象
 * @param {function} action : [ action(objKey, objKeyValue) ] 执行的函数
 *                              |- @param {string} objKey : [] 对象中的键值
 *                              `- @param {*} objKeyValue : [] 对象中的键值对应的值
 */
function objectForEach(obj, action) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            action(prop, obj[prop]);
        }
    }
}
```

#### 2) `extend(target, source)` : 浅层继承

```
/**
 * @param {object} target   : [] 目标对象
 * @param {object} source   : [] 参考对象
 */
function extend(target, source) {
    if (source) {
        for(var prop in source) {
            if(source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
}
```

#### 3) `setPrototypeOf(obj, proto)` : 设置对象的原型

```
/**
 * @param {object} obj      : [] 目标对象
 * @param {object} proto    : [] 需要被设置到原型的对象
 */
function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
    return obj;
}
```

#### 4) `canSetPrototype` : 是否能设置原型

```
var canSetPrototype = ({ __proto__: [] } instanceof Array);
```

#### 5) `knownEvents` `knownEventTypesByEventName` : 已知事件的哈希表

```
// 用一种紧凑的方式去表示已知的事件类型，然后在运行时将它转变成一个事件名称的哈希值作为索引表（为了快速查找）
var knownEvents = {}, knownEventTypesByEventName = {};
var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
objectForEach(knownEvents, function(eventType, knownEventsForType) {
    if (knownEventsForType.length) {
        for (var i = 0, j = knownEventsForType.length; i < j; i++)
            knownEventTypesByEventName[knownEventsForType[i]] = eventType;
    }
});
```

#### 6) `eventsThatMustBeRegisteredUsingAttachEvent` : 是否使用 `attachEvent` 注册事件，而不是 `addEventListener`

```
var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true };
// 一个 IE 9 的解决方法 - https://github.com/SteveSanderson/knockout/issues/406
// jQuery 的 bind() 事件在 IE 9 中的一些问题 - http://bugs.jquery.com/ticket/8485
// IE 9 的 propertychange 仅支持 attachEvent 进行注册- https://msdn.microsoft.com/en-us/library/ms536956%28v=vs.85%29.aspx
```

科普知识（[js监听输入框值的即时变化onpropertychange、oninput](http://www.jb51.net/article/27684.htm)）：

* `onpropertychange` 和 `oninput` 事件都是在（表单）元素的值改变时触发（不像 `onchange` 要失焦时才促发）

* IE （≤ 8）支持 `onpropertychange` 事件，标准浏览器支持 `oninput` 事件

* IE （≤ 8）支持 `attachEvent` 注册事件，标准浏览器支持 `addEventListener` 注册事件

* `oninput` 事件只能通过 `addEventListener` 注册事件，同理 `onpropertychange` 事件只能通过 `attachEvent` 注册事件

* 从[测试页](example/s-2-1.html)来看，`onpropertychange` `oninput`应用于文本框效果最佳

`ko` 这段代码为了解决：

* IE 9 支持同时 `attachEvent` 和 `addEventListener` 注册事件，但不支持 `oninput`，所以如果检测到浏览器为 IE 且支持 `propertychange` 事件，则用 `attachEvent` 注册 `onpropertychange` 事件

* jQuery 中，`bind` 事件由于优先使用 `addEventListener` 注册事件，所以在 IE 9 注册 `propertychange` 事件无效

所以**如果元素支持 `propertychange` 事件且在 IE 下，则优先用 `attachEvent` 注册**

#### 7) `ieVersion` `isIe6` `isIe7` : IE 版本判断（`ieVersion` 默认为 `undefined`，4 < version ≤ 9）

```
// 检测 IE 版本来解决某些 bug （为了更为健壮地检测，采用 IE 条件注释方式，而不是通过 UA 来判断）
// 注意，由于 IE 10 不再支持条件注释的写法，以下的逻辑仅解决 IE 10 以下的版本
// 当前 ko 还是继续这样设计，因为 IE 10 以上版本的行为接近于标准的浏览器
// 如果有一个功能在 IE 10 以上版本需要被解决，我们会修改它
var ieVersion = document && (function() {
    var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (
        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
        iElems[0]
    ) {}
    return version > 4 ? version : undefined;
}());
var isIe6 = ieVersion === 6,
    isIe7 = ieVersion === 7;
```

#### 8) `isClickOnCheckableElement(element, eventType)` : 点击的元素是否为 checkbox 或 radio

```
/**
 * @use {function} ko.utils.tagNameLower
 *
 * @param {object} element      : [] 被点击的元素
 * @param {string} eventType    : [] 事件（如 "click"）
 */
function isClickOnCheckableElement(element, eventType) {
    if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
    if (eventType.toLowerCase() != "click") return false;
    var inputType = element.type;
    return (inputType == "checkbox") || (inputType == "radio");
}
```

#### 9) `cssClassNameRegex` : 匹配 class 值的正则
#### 10) `toggleDomNodeCssClass(node, classNames, shouldHaveClass)` : 切换对象的 class 值（基于 toggleObjectClassPropertyString）
#### 11) `toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass)` : 切换对象中指定节点的值

```
// 详细阐述改变节点的 class 值的模式
// 请看 https://github.com/knockout/knockout/issues/1597
var cssClassNameRegex = /\S+/g;
//      ↓
// "123 456 789".match(cssClassNameRegex)
//      ↓
// ["123", "456", "789"]

/**
 * @use {regexp} cssClassNameRegex
 * @use {function} toggleObjectClassPropertyString
 *
 * @param {object} node             : [] dom 节点
 * @param {string} classNames       : [] 类名
 * @param {boolean} shouldHaveClass : [] 是否添加 classNames。为 false 则删除 classNames
 */
function toggleDomNodeCssClass(node, classNames, shouldHaveClass) {
    var addOrRemoveFn;
    if (classNames) {
        if (typeof node.classList === 'object') {
            addOrRemoveFn = node.classList[shouldHaveClass ? 'add' : 'remove'];
            ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                addOrRemoveFn.call(node.classList, className);
            });
        } else if (typeof node.className['baseVal'] === 'string') {
            // SVG 标签 .classNames 是一个 SVGAnimatedString 实例
            toggleObjectClassPropertyString(node.className, 'baseVal', classNames, shouldHaveClass);
        } else {
            // node.className 应该是一个字符串
            toggleObjectClassPropertyString(node, 'className', classNames, shouldHaveClass);
        }
    }
}

/**
 * @use {regexp} cssClassNameRegex
 *
 * @param {object} obj              : [] 对象
 * @param {string} prop             : [] 节点名
 * @param {string} classNames       : [] 类名
 * @param {boolean} shouldHaveClass : [] 是否添加 classNames。为 false 则删除 classNames
 */
function toggleObjectClassPropertyString(obj, prop, classNames, shouldHaveClass) {
    // obj/prop 是一对 node/'className' 或是一对 SVGAnimatedString/'baseVal'.
    var currentClassNames = obj[prop].match(cssClassNameRegex) || [];
    ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
        ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
    });
    obj[prop] = currentClassNames.join(" ");
}
```

#### 12) \<public\> `ko.utils.arrayForEach(array, action)` : 遍历数组，并将各元素作为 action 参数，供其执行

```
/**
 * @param {array} array     : [] 数组
 * @param {function} action : [ function(cell, index) ] 遍历执行的函数
 *                              |- @param {*} cell  : [] 数组中的元素
 *                              `- @param {number} index : [] 数组中的元素对应的索引
 */
arrayForEach: function (array, action) {
    for (var i = 0, j = array.length; i < j; i++)
        action(array[i], i);
}
```

#### 13) \<public\> `ko.utils.arrayIndexOf(array, item)` : 数组中，对应某项的索引

```
/**
 * @param {array} array : [] 数组
 * @param {*} item      : [] 需要找寻其索引的元素
 *
 * @return {number}     : [ -1 ] 元素的索引值
 */
arrayIndexOf: function (array, item) {
    if (typeof Array.prototype.indexOf == "function")
        return Array.prototype.indexOf.call(array, item);
    for (var i = 0, j = array.length; i < j; i++)
        if (array[i] === item)
            return i;
    return -1;
}
```

#### 14) \<public\> `ko.utils.arrayFirst(array, predicate, predicateOwner)` : 找到数组中第一个匹配的元素，否则返回 null

```
/**
 * @param {array} array             : [] 数组
 * @param {function} predicate      : [ function(cell, index) ] 判断函数，必须 return 正假值
 *                                      |- @param {*} cell          : [] 数组中的元素
 *                                      `- @param {number} index    : [] 数组中的元素对应的索引
 * @param {object} predicateOwner   : [] 被动调用 predicate 的对象
 */
arrayFirst: function (array, predicate, predicateOwner) {
    for (var i = 0, j = array.length; i < j; i++)
        if (predicate.call(predicateOwner, array[i], i))
            return array[i];
    return null;
}
```

样例：

```
ko.utils.arrayFirst(
    [
        NaN,
        "123",
        null,
        undefined,
        {}
    ],
    function(cell, index) {
        return !isNaN(cell);
    }
);
// 返回 "123"
```

#### 15) \<public\> `ko.utils.arrayRemoveItem(array, itemToRemove)` : 移除数组某项

```
/**
 * @use {function} ko.utils.arrayIndexOf
 *
 * @param {array} array     : [] 数组
 * @param {*} itemToRemove  : [] 要删除的项目
 */
arrayRemoveItem: function (array, itemToRemove) {
    var index = ko.utils.arrayIndexOf(array, itemToRemove);
    if (index > 0) {
        array.splice(index, 1);
    }
    else if (index === 0) {
        array.shift();
    }
}
```

#### 16) \<public\> `ko.utils.arrayGetDistinctValues(array)` : 数组排重，并返回新数组

```
/**
 * @use {function} ko.utils.arrayIndexOf
 *
 * @param {array} array : [] 数组
 */
arrayGetDistinctValues: function (array) {
    array = array || [];
    var result = [];
    for (var i = 0, j = array.length; i < j; i++) {
        if (ko.utils.arrayIndexOf(result, array[i]) < 0)
            result.push(array[i]);
    }
    return result;
}
```

#### 17) \<public\> `ko.utils.arrayMap(array, mapping)` : 对数组每个元素进行处理，并返回新数组

```
/**
 * @param {array} array         : [] 数组
 * @param {function} mapping    : [ function(cell, index) ] 元素处理函数，必须有返回值
 *                                  |- @param {*} cell          : [] 数组中的元素
 *                                  `- @param {number} index    : [] 数组中的元素对应的索引
 */
arrayMap: function (array, mapping) {
    array = array || [];
    var result = [];
    for (var i = 0, j = array.length; i < j; i++)
        result.push(mapping(array[i], i));
    return result;
}
```

#### 18) \<public\> `ko.utils.arrayFilter(array, predicate)` : 数组过滤

```
/**
 * @param {array} array         : [] 数组
 * @param {function} predicate  : [ function(cell, index) ] 判断函数，必须 return 正假值
 *                                  |- @param {*} cell          : [] 数组中的元素
 *                                  `- @param {number} index    : [] 数组中的元素对应的索引
 */
arrayFilter: function (array, predicate) {
    array = array || [];
    var result = [];
    for (var i = 0, j = array.length; i < j; i++)
        if (predicate(array[i], i))
            result.push(array[i]);
    return result;
}
```

样例：

```
ko.utils.arrayFilter(
    [
        1,
        2,
        3
    ],
    function(cell, index) {

        return cell < 3;
    }
);
// 返回 [1, 2]
```

#### 19) \<public\> `ko.utils.arrayPushAll(array, valuesToPush)` : 将 valuesToPush（数组或伪数组）的每项添加到数组末尾

```
/**
 * @param {array} array                 : [] 数组
 * @param {array|object} valuesToPush   : [] 数组或伪数组
 */
arrayPushAll: function (array, valuesToPush) {
    if (valuesToPush instanceof Array)
        array.push.apply(array, valuesToPush);
    else
        for (var i = 0, j = valuesToPush.length; i < j; i++)
            array.push(valuesToPush[i]);
    return array;
}
```

#### 20) \<public\> `ko.utils.addOrRemoveItem(array, value, included)` : （不重复）添加或删除数组某项

```
/**
 * @use {function} ko.utils.arrayIndexOf
 * @use {function} ko.utils.peekObservable
 *
 * @param {array} array         : [] 数组
 * @param {*} value             : [] 添加或删除的值
 * @param {boolean} included    : [] 真值用于添加，假值用于删除
 */
addOrRemoveItem: function(array, value, included) {
    var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
    if (existingEntryIndex < 0) {
        if (included)
            array.push(value);
    } else {
        if (!included)
            array.splice(existingEntryIndex, 1);
    }
}
```

#### 21) `ko.utils.canSetPrototype` : 与 4) 相同

#### 22) \<public\> `ko.utils.extend(target, source)` : 与 2) 相同

#### 23) `ko.utils.setPrototypeOf(obj, proto)` : 与 3) 相同

#### 24) `ko.utils.setPrototypeOfOrExtend(target, source)` : 根据 21) 返回值，执行 2) 或 3)

```
setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend
```

#### 25) \<public\> `ko.utils.objectForEach(obj, action)` : 与 1) 相同

#### 26) `ko.utils.objectMap` : arrayMap 的对象版（浅层遍历）

```
function(source, mapping) {
    if (!source)
        return source;
    var target = {};
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = mapping(source[prop], prop, source);
        }
    }
    return target;
}
```

#### 27) `ko.utils.emptyDomNode(domNode)` : 清空 dom 元素

```
function (domNode) {
    while (domNode.firstChild) {
        ko.removeNode(domNode.firstChild);
    }
}
```

科普知识（[Remove child nodes (or elements) or set innerHTML=“”?](http://stackoverflow.com/questions/18084941/remove-child-nodes-or-elements-or-set-innerhtml)）

* `innerHTML = ""` 对清除节点内容较快，但不完全兼容

* `select` 元素不能通过 `innerHTML` 来清空节点，具体请看[BUG： Internet Explorer 设置 innerHTML 选择对象的属性失败](http://support.microsoft.com/zh-cn/kb/276228)

#### 28) `ko.utils.moveCleanedNodesToContainerElement(nodes)` : 将解除掉双向绑定的节点（event 绑定未解除）集挪到 div 容器中

```
/**
 * @use {function} ko.utils.makeArray
 * @use {function} ko.cleanNode （解除 dom 元素的双向绑定，event 绑定并不解除）
 *
 * @param {array} nodes : [] 节点数组
 *
 * @return {object}     : [ div ] 返回容器元素
 */
function(nodes) {
    // 确保 nodes 为真正的数组，因为我们将会重塑 nodes 的父级，
    // 并且我们不想在修改的时候，那些基础的集合会改变
    var nodesArray = ko.utils.makeArray(nodes);
    var templateDocument = (nodesArray[0] && nodesArray[0].ownerDocument) || document;

    var container = templateDocument.createElement('div');
    for (var i = 0, j = nodesArray.length; i < j; i++) {
        container.appendChild(ko.cleanNode(nodesArray[i]));
    }
    return container;
}
```

样例 1 ：

```
<div id="nodesTar">
    <ul>
        <li>1</li>
        <li>2</li>
        <li>
            <i>hello</i>
        </li>
    </ul>
</div>

...

var
    nodeTar     = document.getElementById("nodesTar"),
    container1  = ko.utils.moveCleanedNodesToContainerElement(nodeTar); // <div></div>

var
    nodesTar    = nodeTar.getElementsByTagName("li"),
    container2  = ko.utils.moveCleanedNodesToContainerElement(nodesTar); // <div><li>1</li><li>2</li><li><i>hello</i></li></div>
```

[样例 2](s-2-2.html)：

```
<form id="formTar">
    <input type="text" data-bind="value: val, valueUpdate: 'afterkeydown'">
    <input type="text" data-bind="textInput: val" disabled>
    <input type="text" data-bind="visible: isShow" value="你应该看不到我">
    <input type="text" data-bind="attr: {show: isShow}" value="show属性应该为 0">
    <span data-bind="text: val">&nbsp;</span>
    <input type="button" data-bind="click: alt" value="点击我就alert">
    <div id="copyedBox"></div>
</form>

...

var
    formTar     = document.getElementById("formTar"),
    inputs      = formTar.getElementsByTagName("input"),
    copyedBox   = document.getElementById("copyedBox"),
    TestModel   = function() {

                        var self = this;

                        self.val = ko.observable();

                        self.alt = function() { alert("你点我了"); };
                    },
    testModel   = new TestModel,
    container   = null;

ko.applyBindings(testModel, formTar);

testModel.val("hello kitty");

container = ko.utils.moveCleanedNodesToContainerElement(inputs);

copyedBox.appendChild(container);

// <form id="formTar">
//
//
//
//
//     <span data-bind="text: val"></span>
//
//     <div id="copyedBox"><div><input type="text" data-bind="value: val, valueUpdate: 'afterkeydown'" value="hello kitty"><input type="text" disabled="" data-bind="textInput: val" value="hello kitty"><input type="text" value="你应该看不到我" data-bind="visible: isShow" style="display: none;"><input type="text" value="show属性应该为 0" data-bind="attr: {show: isShow}" show="0"><input type="button" value="点击我就alert" data-bind="click: alt"></div></div>
// </form>
//
// 实测现象：
//      1) value 的绑定：
//              input -> 输入文字 -> testModel.val 发生改变
//              testModel.val -> 求改 val 值 -> input 的值不发生改变
//      2) click 的绑定有效
//      3) textInput 的绑定无效
```

结论：

ko.utils.moveCleanedNodesToContainerElement 会把一堆指定的 DOM 元素集从原来位置剪切到新容器（div）中，并解除双向绑定（event 绑定没有被解除）。

[Knockout JS 增加、去除、修改绑定](http://blog.csdn.net/hongweigg/article/details/43731413)

#### 29) `ko.utils.cloneNodes(nodesArray, shouldCleanNodes)` : 复制节点，并返回复制好的节点集

```
/**
 * @use {function} ko.cleanNode （解除 dom 元素的双向绑定，event 绑定并不解除）
 *
 * @param {array} nodesArray            : [] 节点数组
 * @param {boolean} shouldCleanNodes    : [] 是否清除节点的双向绑定
 *
 * @return {array}                      : [ [] ] 新的节点数组
 */
function (nodesArray, shouldCleanNodes) {
    for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
        var clonedNode = nodesArray[i].cloneNode(true);
        newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
    }
    return newNodesArray;
}
```

#### 30) `ko.utils.setDomNodeChildren(domNode, childNodes)` : 设置 dom 元素的子节点（先清空，再添加子节点）

```
/**
 * @use {function} ko.utils.emptyDomNode
 *
 * @param {object} domNode      : [] 根节点
 * @param {object} childNodes   : [] 新增子节点
 */
function (domNode, childNodes) {
    ko.utils.emptyDomNode(domNode);
    if (childNodes) {
        for (var i = 0, j = childNodes.length; i < j; i++)
            domNode.appendChild(childNodes[i]);
    }
}
```

#### 31) `ko.utils.replaceDomNodes(nodeToReplaceOrNodeArray, newNodesArray)` : 替换 dom 元素或节点集合

```
/**
 * @use {function} ko.removeNode （清除节点）
 *
 * @param {object} nodeToReplaceOrNodeArray : [] 替换的目标节点或节点列表
 * @param {object} newNodesArray            : [] 新节点列表
 */
function (nodeToReplaceOrNodeArray, newNodesArray) {
    var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
    if (nodesToReplaceArray.length > 0) {
        var insertionPoint = nodesToReplaceArray[0];
        var parent = insertionPoint.parentNode;
        for (var i = 0, j = newNodesArray.length; i < j; i++)
            parent.insertBefore(newNodesArray[i], insertionPoint);  // 插入新节点
        for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
            ko.removeNode(nodesToReplaceArray[i]);                  // 清除旧节点
        }
    }
}
```

#### 32) `ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode)` : 修复连续节点数组（非同级按顺序排列的节点集合，最终返回 undefined）

```
/**
 * @param {array} continuousNodeArray   : [] 连续节点数组
 * @param {object} parentNode           : [] 父节点
 *
 * @return                              : [] 处理好的连续节点数组
 */
function(continuousNodeArray, parentNode) {
    // 在对一组通过 template 函数生成的节点起效之前，我们必须立刻在 DOM 里清除它们。
    // 也许一些节点已经被清除，或者新节点可能已经注入其中，例如通过一个绑定。
    // 同时，有可能之前已是重要注释节点（被基于字符串模板重写而创建）在绑定的时候会被移除。
    // 因此，这个函数会将旧的输出数组 “索引表” 转化为它的一组当前 DOM 节点的最佳推测。
    //
    // 规则：
    //   [A] 一些被删除的重要节点应该被忽略
    //       这些最有可能对应于在绑定时已经被删除的 memoization 节点
    //       详情请看 https://github.com/SteveSanderson/knockout/pull/440
    //   [B] 我们想输出一系列连续的节点。所以，忽略一些已经被删除的节点，
    //       包括一些已经被插在之前的集合的节点

    if (continuousNodeArray.length) {
        // 如果 parentNode 为注释元素，则要获取其父元素；否则之前当 parentNode 为父元素
        parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

        // 规则 [A]
        //      当 continuousNodeArray 不为空，且第 1 个元素的父级不是 parentNode 时，剔除它
        //          ↓
        //      直到数组清空，或第 1 个元素为 parentNode
        //
        while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
            continuousNodeArray.splice(0, 1);

        // 规则 [B]
        //      continuousNodeArray 不为空时，继续执行。
        //          ↓
        //      通过 current 和 last 变量保存第 1 个节点和最后 1 个节点
        //          ↓
        //      清空 continuousNodeArray （continuousNodeArray.length = 0）
        //          ↓
        //      但 current !== last 时，continuousNodeArray 添加 current，然后 current 指向 current.nextSibling
        //      如果 current 为 undefined 时，跳出整个函数，一般由于：
        //          1、在循环过程中手动删除元素
        //          2、continuousNodeArray 中的元素为非同级且连续的节点集合
        //          ↓
        //      continuousNodeArray 添加 last
        //
        if (continuousNodeArray.length > 1) {
            var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
            // 替换为当前的新的连续的节点集
            continuousNodeArray.length = 0;
            while (current !== last) {
                continuousNodeArray.push(current);
                current = current.nextSibling;
                if (!current) // 不会促发，除非开发者手动删除一些 DOM 元素（或者 current 为 undefined，一般是由于 continuousNodeArray 为非连续的同级节点集合）
                    return;
            }
            continuousNodeArray.push(last);
        }
    }
    return continuousNodeArray;
}
```

科普知识：

* 被移除的节点的 parentNode 属性为 null

```
var domtest = document.createElement("div");

document.body.appendChild(domtest);

console.log(domtest.parentNode);    // <body>

document.body.removeChild(domtest);

console.log(domtest.parentNode);    // null
```

[样例](example/s-2-3.html)：

```
<div id="testTar">
    <ul>
        <li></li>
        <li></li>
    </ul>
    <div>
        <span></span>
        <span></span>
    </div>
    <ol>
        <li></li>
        <li></li>
    </ol>
</div>

...

(function() {

    var
        testTar     = document.getElementById("testTar"),
        ul          = testTar.getElementsByTagName("ul")[0],
        lis         = ko.utils.makeArray( testTar.getElementsByTagName("li") ),
        spans       = ko.utils.makeArray( testTar.getElementsByTagName("span") ),
        nodes       = ( [].concat(lis) ).concat(spans);

    console.log(nodes); // [li, li, li, li, span, span]
    console.log( ko.utils.fixUpContinuousNodeArray(nodes, ul) ); // undefined
    //  ↓
    // nodes
    //  ↓
    // [li, <TextNode textContent="\n ">, li, <TextNode textContent="\n ">]
    //  ↓
    // 处理的结果为 undefined

})();

(function() {

    var
        testTar     = document.getElementById("testTar"),
        ul          = testTar.getElementsByTagName("ul")[0],
        ulLis       = ko.utils.makeArray( ul.getElementsByTagName("li") ),
        nodes       = [].concat(ulLis);

    console.log(nodes); // [li, li]
    console.log( ko.utils.fixUpContinuousNodeArray(nodes, ul) ); // [li, <TextNode textContent="\n ">, li]
    //  ↓
    // nodes
    //  ↓
    // [li, <TextNode textContent="\n ">, li]
    //  ↓
    // 处理的结果为 [li, <TextNode textContent="\n ">, li]

})();

(function() {

    var
        testTar     = document.getElementById("testTar"),
        ul          = testTar.getElementsByTagName("ul")[0],
        ulLis       = ko.utils.makeArray( ul.getElementsByTagName("li") ),
        nodes       = [].concat(ulLis.reverse());

    console.log(nodes); // [li, li]
    console.log( ko.utils.fixUpContinuousNodeArray(nodes, ul) ); // undefined
    //  ↓
    // nodes
    //  ↓
    // [ ulLis[1], <TextNode textContent="\n ">, ulLis[0] ]
    //  ↓
    // 处理的结果为 undefined

})();
```

#### 33) `ko.utils.setOptionNodeSelectionState(optionNode, isSelected)` : 设置 option 节点选中状态

```
/**
 * @param {object} optionNode   : [] option 节点
 * @param {boolean} isSelected  : [] 是否要选中
 */
function (optionNode, isSelected) {
    // 如果你尝试直接 optionNode.selected = isSelected，IE 6 有时会报出 "unknown error" 错误，而火狐是不使用 setAttribute 方法来设置。请基于浏览器选择一种吧。
    if (ieVersion < 7)
        optionNode.setAttribute("selected", isSelected);
    else
        optionNode.selected = isSelected;
}
```

科普知识（[IE6下 option标签selected设置的问题 ](http://blog.csdn.net/jinbi/article/details/7293496)）：

* IE6 下成功设置 selected 方式 1：`setTimeout(function() { optionNode.selected = isSelected; }, 60)`

* IE6 下成功设置 selected 方式 2：`optionNode.setAttribute("selected", isSelected)`

* 通过 `setAttribute` 设置 `selected` 为 `true` 时，各浏览器表现不同（具体请看下方样例）

[样例](example/s-2-4.html)

```
// 方式一（ optionNode[i].setAttribute("selected", true) , 0 ≤ i ≤ 2 ，下值对应 optionNode[i].getAttribute("selected") ）：
//      IE 6 : true -> false -> false
//      IE 7 : true -> false -> false
//      IE 8 : selected -> (空) -> (空)
//      IE 9 : true -> true -> true
//      FF 36: true -> true -> true
//      CH 41: true -> true -> true

// 方式二（ optionNode[i].selected = true , 0 ≤ i ≤ 2 ，下值对应 optionNode[i].selected ）：
//      IE 6 : true -> false -> false
//      IE 7 : true -> false -> false
//      IE 8 : true -> false -> false
//      IE 9 : true -> false -> false
//      FF 36: true -> false -> false
//      CH 41: true -> false -> false

// 以上只截取数据部分
```

#### 34) `ko.utils.stringTrim(string)` : 清除首尾空白字符和 16 进制的空格（"\xa0"）

```
/**
 * @param {string} string   : [ "" ] 要处理的字符串
 *
 * @return {string}         : [ "" ] 处理完的字符串
 */
function (string) {
    return string === null || string === undefined ? '' :
        string.trim ?
            string.trim() :
            string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
}
```

#### 35) `ko.utils.stringStartsWith(string, startsWith)` : 字符串 string 是否以 startsWith 字符串为开头

```
/**
 * @param {string} string       : [ "" ] 要判断的字符串
 * @param {string} startsWith   : [] 用于参考的最前的字符串
 *
 * @return {boolean}            : [ false ] 是否以参考字符串为开头
 */
function (string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length)
        return false;
    return string.substring(0, startsWith.length) === startsWith;
}
```

#### 36) `ko.utils.domNodeIsContainedBy(node, containedByNode)` : containedByNode 是否包含 node（或为自身）

```
/**
 * @param {object} node             : [] 子节点
 * @param {object} containedByNode  : [] 父节点
 *
 * @return {boolean}                : [ false ] containedByNode 是否包含 node（或为自身）
 */
function (node, containedByNode) {
    if (node === containedByNode)
        return true;
    if (node.nodeType === 11)
        return false; // 修复问题 #1162 - 在 IE 8 下不能对 document fragments 使用 node.contains 方法
    if (containedByNode.contains)
        return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
    if (containedByNode.compareDocumentPosition)
        return (containedByNode.compareDocumentPosition(node) & 16) == 16;
    while (node && node != containedByNode) {
        node = node.parentNode;
    }
    return !!node;
}
```

科普知识：

* `node.nodeType`

```
Node.ELEMENT_NODE                   (1)     元素节点【常用】
Node.ATTRIBUTE_NODE                 (2)     属性节点【常用】
Node.TEXT_NODE                      (3)     文字节点【常用】
Node.CDATA_SECTION_NODE             (4)     子节点一定为TextNode
Node.ENTITY_REFERENCE_NODE          (5)
Node.ENTITY_NODE                    (6)     DTD中的实体定义<!ENTITY foo“foo”>，无子节点
Node.PROCESSING_INSTRUCTION_NODE    (7)     PI，无子节点
Node.COMMENT_NODE                   (8)     注释节点【常用】
Node.DOCUMENT_NODE                  (9)     document【常用】
Node.DOCUMENT_TYPE_NODE             (10)    DTD，<!DOCTYPE………..>
Node.DOCUMENT_FRAGMENT_NODE         (11)    frame 节点
Node.NOTATION_NODE                  (12)    DTD中的Nation定义
```

[nodeType 属性](http://baike.baidu.com/link?url=k_XeIKYnxUZve-2tkfoF67Zel0Ghve6aQw4rJgysqOrMY_9ibbrbzP1ornfEMVttvFYOn4nyWcVl3tqYCs3_WK)

[Node的种类一共有12种，通过Node.nodeType的取值来确定(2010-11-25 ）转载](http://www.cnblogs.com/zcjnever/articles/2019615.html)

* `parentNode.contains(childNode)` : `parentNode` 包含 `childNode` 元素，返回 `true`

* `parentNode.compareDocumentPosition(childNode)` : `parentNode` 包含 `childNode` 元素，返回 010000 ，即 16

```
// parentNode.compareDocumentPosition(childNode) 返回的值，与对应的关系
//
// Bits         Number      Meaning
// 000000       0           元素一致
// 000001       1           节点在不同的文档（或者一个在文档之外）
// 000010       2           节点 B 在节点 A 之前
// 000100       4           节点 A 在节点 B 之前
// 001000       8           节点 B 包含节点 A
// 010000       16          节点 A 包含节点 B
// 100000       32          浏览器的私有使用
```

[js contains方法实现代码（包含 compareDocumentPosition 的讲解）](http://www.jb51.net/article/26158.htm)

* 模运算符 `&` : `16 & 16 === 16` `8 & 16 === 0` `8 & 8 === 8` `010000 & 16 === 0`

#### 37) `ko.utils.domNodeIsAttachedToDocument(node)` : node 元素是否挂载到了 document 中

```
/**
 * @use {function} ko.utils.domNodeIsContainedBy
 *
 * @param {object} node     : [] 节点元素
 *
 * @return {boolean}        : [ false ] 是否挂载到了 document 中
 */
function (node) {
    return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
}
```

#### 38) `ko.utils.anyDomNodeIsAttachedToDocument(nodes)` : 一些 node 元素是否挂载到了 document 中（只是判断是否存在一个符合的元素）

```
/**
 * @use {function} ko.utils.arrayFirst
 * @use {function} ko.utils.domNodeIsAttachedToDocument
 *
 * @param {object} nodes    : [] 节点元素集合
 *
 * @return {boolean}        : [ false ] 是否挂载到了 document 中
 */
function(nodes) {
    return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
}
```

#### 39) `ko.utils.tagNameLower(element)` : 小写的标签名

```
/**
 * @param {object} element  : [] 节点元素集合
 *
 * @return {boolean}        : [ false ] 是否挂载到了 document 中
 */
function(element) {
    // 对于 HTML 元素，标签名一般为大小；对于 XHTML 元素，它一般为小写。
    // 未来可能的优化：如果我们知道它是从一个 XHTML 文档来的元素（而不是HTML），
    // 我们不需要去使用 "toLowerCase" 方法，因为它一般为小写
    return element && element.tagName && element.tagName.toLowerCase();
}
```

#### 40) \<public\> `ko.utils.registerEventHandler(element, eventType, handler)` : 注册事件

```
/**
 * @param {object} element      : [] 目标节点
 * @param {string} eventType    : [] 事件类型
 * @param {function} handler    : [] 绑定的函数
 */
function (element, eventType, handler) {
    var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
    if (!mustUseAttachEvent && jQueryInstance) {
        jQueryInstance(element)['bind'](eventType, handler);
    } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
        element.addEventListener(eventType, handler, false);
    else if (typeof element.attachEvent != "undefined") {
        var attachEventHandler = function (event) { handler.call(element, event); },
            attachEventName = "on" + eventType;
        element.attachEvent(attachEventName, attachEventHandler);

        // IE 不能自动关闭 attachEvent 绑定的函数（不像 addEventListerer）
        // 因此为了避免内存泄露，我们必须手动删除他们。请看 bug #856
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            element.detachEvent(attachEventName, attachEventHandler);
        });
    } else
        throw new Error("Browser doesn't support addEventListener or attachEvent");
}
```

注意：

* 请看 6) 的解释，由于 `jQuery` 的 `bind` 的缺陷，对 `propertychange` 事件要另外处理

#### 41) \<public\> `ko.utils.triggerEvent(element, eventType)` : 促发事件

```
/**
 * @use {object} isClickOnCheckableElement
 * @use {object} knownEventTypesByEventName
 *
 * @param {object} element      : [] 目标节点
 * @param {string} eventType    : [] 事件类型
 */
function (element, eventType) {
    if (!(element && element.nodeType))
        throw new Error("element must be a DOM node when calling triggerEvent");

    // 对于在 checkbox 和 radio 元素的 click 事件，jQuery 切换元素 checked 状态是在事件所绑定的函数促发之后进行，
    // 而不是在之前进行（这个问题已经在 1.9 版本被修复，不过只修复了 checkbox 部分，radio 还未被修复）
    // 当你使用 "fireEvent" 促发点击事件，IE 不会改变 checked 状态。
    // 由于这两个问题，我们将使用 click 事件代替。
    var useClickWorkaround = isClickOnCheckableElement(element, eventType);

    if (jQueryInstance && !useClickWorkaround) {
        jQueryInstance(element)['trigger'](eventType);
    } else if (typeof document.createEvent == "function") {
        if (typeof element.dispatchEvent == "function") {
            var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
            var event = document.createEvent(eventCategory);
            event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
            element.dispatchEvent(event);
        }
        else
            throw new Error("The supplied element doesn't support dispatchEvent");
    } else if (useClickWorkaround && element.click) {
        element.click();
    } else if (typeof element.fireEvent != "undefined") {
        element.fireEvent("on" + eventType);
    } else {
        throw new Error("Browser doesn't support triggering events");
    }
}
```

科普知识：

* `document.createEvent(eventType)` : 创建新的 Event 对象

```
// 参数             事件接口        初始化方法
// HTMLEvents       HTMLEvent       iniEvent()
// MouseEvents      MouseEvent      iniMouseEvent()
// UIEvents         UIEvent         iniUIEvent()
//
// 其实浏览器会自动判断采用哪一种初始方法，
```

[XML DOM createEvent() 方法](http://www.w3school.com.cn/xmldom/met_document_createevent.asp)

* `document.createEvent(eventClass).initEvent(...)` : 初始化 Event 对象

```
/**
 * document.createEvent(eventClass).initMouseEvent(eventType, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget)
 *
 * @param {string} eventClass   : [] 事件类型，如 "HTMLEvents"、"MouseEvents"、"UIEvents"
 *
 * @param {string} eventType    : [] 事件的类型
 * @param {boolean} canBubble   : [] 事件是否起泡
 * @param {boolean} cancelable  : [] 是否可以用 `preventDefault()` 方法取消事件
 * @param {object} view         : [ window ] 激活的 window 对象或 null
 * @param {number} detail       : [ 0 ] 一个可以提供关于事件的其他信息的数字
 * @param {number} screenX      : [ 0 ] 鼠标相对于屏幕的 X 坐标
 * @param {number} screenY      : [ 0 ] 鼠标相对于屏幕的 Y 坐标
 * @param {number} clientX      : [ 0 ] 鼠标相对于浏览器的 X 坐标
 * @param {number} clientY      : [ 0 ] 鼠标相对于浏览器的 Y 坐标
 * @param {boolean} ctrlKey     : [ false ] 是否按着 ctrl 键
 * @param {boolean} altKey      : [ false ] 是否按着 alt 键
 * @param {boolean} shiftKey    : [ false ] 是否按着 shift 键
 * @param {boolean} metaKey     : [ false ] 是否按着 meta 键
 * @param {number} button       : [ 0 ] 促发事件的鼠标按键
 *                                  |- -1 : 没有按任何鼠标按键
 *                                  |- 0  : 左键
 *                                  |- 1  : 中键
 *                                  |- 2  : 右键
 *                                  |- 3  : 1 下向后滚动
 *                                  `- 4  : 2 下向前滚动
 * @param {object} relatedTarget : [ node ] 促发事件的元素（即 event.target 对应的值）
 *
 *
 * 1) initEvent 使用的参数：
 *      eventType, canBubble, cancelable
 *
 * 2) initMouseEvent 使用的参数：
 *      eventType, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget
 *
 * 3) iniUIEvent 使用的参数：
 *      eventType, canBubble, cancelable, view, detail
 *
 *
 * 根据 W3C 文案，Example 39：
 *      Initializing all the attributes of a MutationEvent requires calls to two initializer methods: initEvent and initMutationEvent.
 *      初始化 1 个 MutationEvent （突变事件）所有属性需要调用 2 个初始化方法：initEvent 和 initMutationEvent
 *
 * 所以：
 *      调用 initCustomEvent、initUIEvent、initFocusEvent、initMouseEvent、initWheelEvent 方法，最终还是调用 initEvent
 */
```

* 只有在新创建的 Event 对象被 Document 对象或 Element 对象的 dispatchEvent() 方法促发之前，才能调用 Event.initEvent() 方法。

[XML DOM initEvent() 方法](http://www.w3school.com.cn/xmldom/met_event_initevent.asp)

[initMouseEvent method](https://msdn.microsoft.com/en-us/library/windows/apps/hh453145.aspx)

[UI Events (formerly DOM Level 3 Events)](http://www.w3.org/TR/DOM-Level-3-Events/#legacy-event-initializers)

* `node.dispatchEvent(event)` : 促发 node 元素的 event 事件

* `event` : 要分派的 Event 对象

* 该方法将分派一个合成事件，它由 Document.createEvent() 创建，由 Event 接口或它的某个子接口定义的初始化方法初始化。调用该方法的节点将成为事件的目标节点，该事件在捕捉阶段中第一次沿着文档树向下传播。如果该事件的 bubbles 属性为 true，那么在事件的目标节点自身处理事件后，它将沿着文档树向上起泡。

[XML DOM dispatchEvent() 方法](http://www.w3school.com.cn/xmldom/met_element_dispatchevent.asp)

* `node.fireEvent("on" + eventType)` : 促发 node 元素的 eventType 事件

[IE的fireEvent方法概述及应用](http://www.jb51.net/article/34202.htm)

[fireEvent method](https://msdn.microsoft.com/en-us/library/ms536423%28v=vs.85%29.aspx)

#### 42) \<public\> `ko.utils.unwrapObservable(value)` : 获取 KO 观察者的值

```
/**
 * @use ko.isObservable（是否为 KO 观察者）
 *
 * @param {*} value : 目标值
 */
function (value) {
    return ko.isObservable(value) ? value() : value;
}
```

#### 43) \<public\> `ko.utils.peekObservable(value)` : 窥视 KO 观察者（如果是 KO 观测者，促发其 peek 方法）

```
/**
 * @use ko.isObservable（是否为 KO 观察者）
 *
 * @param {*} value : 目标值
 */
function (value) {
    return ko.isObservable(value) ? value.peek() : value;
}
```

#### 44) \<public\> `ko.utils.toggleDomNodeCssClass(node, classNames, shouldHaveClass)` : 与 10) 相同

#### 45) \<public\> `ko.utils.setTextContent(element, textContent)` : 设置文本内容到 dom 元素中

```
/**
 * @use {function} ko.utils.unwrapObservable
 * @use {function} ko.virtualElements.firstChild（获取指定元素的第 1 个子节点）
 * @use {function} ko.virtualElements.nextSibling（获取指定元素的下一个同级元素）
 * @use {function} ko.virtualElements.setDomNodeChildren（设置指定元素的子节点，先清空，再添加）
 * @use {function} ko.utils.forceRefresh
 *
 * @param {object} element              : [] 目标元素
 * @param {string|obect} textContent    : [] 文本或 KO 观测者
 */
function(element, textContent) {
    var value = ko.utils.unwrapObservable(textContent);
    if ((value === null) || (value === undefined))
        value = "";

    // 我们需要有 1 个子节点：1 个文本节点
    // 如果没有 1 个子节点（大于 1 个），或者如果它不是 1 个文本节点
    // 我们会清空所有并创建 1 个独立的文本节点
    var innerTextNode = ko.virtualElements.firstChild(element);
    if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
        // 以下条件...
        //      1) 没有子节点，如 <div><img id="target"></div>
        //      2) 子节点不是文本节点
        //      3) 子节点拥有同级节点
        // 会执行清空目标子节点并设置新的子节点
        ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
    } else {
        innerTextNode.data = value;
    }

    ko.utils.forceRefresh(element);
}
```

科普知识：

* 文本节点（nodeType === 3）`document.createTextNode(string)`

```
var textNode = document.createTextNode('message');
//      ↓
// <TextNode textContent="message">
//      ↓
textNode.data = "your message";
//      ↓
// <TextNode textContent="your message">
```

#### 46) `ko.utils.setElementName(element, name)` : 设置 dom 元素的 name 值

```
/**
 * @param {object} element  : [] 目标元素
 * @param {string} name     : [] 要设置的 name 值
 */
function(element, name) {
    element.name = name;

    // IE 6/7 问题的解决方法
    // - https://github.com/SteveSanderson/knockout/issues/197
    //   IE 6/7 下，radio 必要要有 name 才能正常工作
    // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
    //   IE 下的表单元素不能直接设置 name 属性，要通过 mergeAttributes 来实现
    if (ieVersion <= 7) {
        try {
            element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
        }
        catch(e) {} // 对于 IE9 使用文档模式为 "IE9 Standards" 和浏览器模式为 "IE9 Compatibility View"
    }
}
```

科普知识：

* `node.mergeAttributes(mergeSource, dontCopyIdentitiedAttr)` : 把 mergeSource 所有可读写属性复制到 node 上

```
/**
 * @param {object} mergeSource              : [] 要被复制属性的节点
 * @param {boolean} dontCopyIdentitiedAttr  : [ true ] 是否不复制可识别属性（name 和 id）到 node 中
 */
```

[mergeAttributes method](https://msdn.microsoft.com/en-us/library/ms536614%28VS.85%29.aspx)

[mergeAttributes Method Sample](http://samples.msdn.microsoft.com/workshop/samples/author/dhtml/refs/mergeAttributes.htm)

* `document.createElement('<img src="http://baidu.com">')` : IE8 及以下版本支持这种创建元素的写法

#### 47) `ko.utils.forceRefresh(node)` : 强制刷新，渲染节点（针对 IE9 及以上版本，现只能针对 IE9）

```
/**
 * @param {object} node : [] 目标元素
 */
function(node) {
    // IE9 渲染文本问题的解决方法（文本不能在修改后立刻更新到最新）
    // - https://github.com/SteveSanderson/knockout/issues/209
    if (ieVersion >= 9) {
        // 为了文本节点和注释节点（例如虚拟元素），我们必须刷新容器
        var elem = node.nodeType == 1 ? node : node.parentNode;
        if (elem.style)
            elem.style.zoom = elem.style.zoom;
    }
}
```

#### 48) `ko.utils.ensureSelectElementIsRenderedCorrectly(selectElement)` : 确定 select 元素被正确渲染（针对 IE）

```
/**
 * @param {object} selectElement : [] 目标 select 元素
 */
function(selectElement) {
    // IE9 渲染问题的解决方法 - 它不能有效地显示通过动态添加 select 框而产生的所有文本，除非你强制改变其宽度来让其重新渲染
    // （具体请看 https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option）
    // 同样，通过使 select 元素（被 'if' 或 'with' 虚拟元素所封闭）的宽度变为 0，解决 IE7 和 IE8 的 bug。
    // （具体请看问题 #839）
    if (ieVersion) {
        var originalWidth = selectElement.style.width;
        selectElement.style.width = 0;
        selectElement.style.width = originalWidth;
    }
}
```

#### 49) \<public\> `ko.utils.range(min, max)` : 输出所在范围的数组（步长为 1，min 和 max 接受 KO 观察者）

```
/**
 * @param {object|number} min   : [] 最小值（可为 KO 观察者）
 * @param {object|number} max   : [] 最大值（可为 KO 观察者）
 *
 * @return {array}              : [] 数值范围数组
 */
function (min, max) {
    min = ko.utils.unwrapObservable(min);
    max = ko.utils.unwrapObservable(max);
    var result = [];
    for (var i = min; i <= max; i++)
        result.push(i);
    return result;
}
```

#### 50) `ko.utils.makeArray(arrayLikeObject)` : 伪数组变为数组

```
/**
 * @param {object} arrayLikeObject  : [] 类数组对象（至少要有 length 属性）
 *
 * @return {array}                  : [] 数组
 */
function(arrayLikeObject) {
    var result = [];
    for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
        result.push(arrayLikeObject[i]);
    };
    return result;
}
```

#### 51) `ko.utils.isIe6` `ko.utils.isIe7` `ko.utils.ieVersion` : 与 7) 相同

#### 52) \<public\> `ko.utils.getFormFields(form, fieldName)` : 获取表单元素中属性 name 值与 fieldName 一致的列表（筛选 input 和 textarea）

```
/**
 * @param {object} form             : [] 目标 form 元素
 * @param {string|regexp} fieldName : [] 要获取的表单元素的 name 值（支持正则）
 *
 * @return {array}                  : [] 匹配的表单元素列表
 */
function(form, fieldName) {
    var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
    var isMatchingField = (typeof fieldName == 'string')
        ? function(field) { return field.name === fieldName }
        : function(field) { return fieldName.test(field.name) };
    var matches = [];
    for (var i = fields.length - 1; i >= 0; i--) {
        if (isMatchingField(fields[i]))
            matches.push(fields[i]);
    };
    return matches;
}
```

#### 53) \<public\> `ko.utils.parseJson(jsonString)` : JSON 字符串 -> JSON 对象（仅下方 postJson 使用）

```
/**
 * @use {function} ko.utils.stringTrim
 *
 * @param {string} jsonString   : [] json 字符串
 *
 * @return {object}             : [ null ] json 对象
 */
function (jsonString) {
    if (typeof jsonString == "string") {
        jsonString = ko.utils.stringTrim(jsonString);
        if (jsonString) {
            if (JSON && JSON.parse) // Use native parsing where available
                return JSON.parse(jsonString);
            return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
        }
    }
    return null;
}
```

#### 54) \<public\> `ko.utils.stringifyJson(data, replacer, space)` : JSON 对象 -> JSON 字符串（仅支持原生方法或引入json2.js）

```
/**
 * @use {function} ko.utils.unwrapObservable
 *
 * @param {object} data             : [] 对象
 * @param {funtion|array} replacer  : [] 预处理（选填）
 * @param {string|number} space     : [] 分隔符或间隔数量，为 number 时，0 ≤ number ≤ 10（选填）
 *
 * @return {string}                 : [] json 字符串
 */
function (data, replacer, space) {   // replacer and space are optional
    if (!JSON || !JSON.stringify)
        throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
    return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
}
```

[JSON.stringify 语法实例讲解](http://www.jb51.net/article/29893.htm)

样例：

* `JSON.stringify(object)`

```
var student = new Object();
student.name = "Lanny";
student.age = "25";
student.location = "China";
var json = JSON.stringify(student);
alert(student); 
```

![JSON.stringify(object)](http://files.jb51.net/upload/201203/20120314150604999.png)

* `JSON.stringify(array, function)`

```
var students = new Array();
students[0] = "Lanny";
students[1] = "dong";
students[2] = "I love you";
var json = JSON.stringify(students,switchUpper);
function switchUpper(key, value) {
    return value.toString().toUpperCase();
}
alert(json);
```

![JSON.stringify(array, function)](http://files.jb51.net/upload/201203/20120314150604337.png)

* `JSON.stringify(array, array)`

```
var students = new Array() ;
students[0] = "Lanny";
students[1] = "dong";
students[2] = "I love you";
var stu = new Array();
stu[0] = "1";
stu[1] = "2";
var json = JSON.stringify(students,stu);
alert(json); 
```

![JSON.stringify(array, array)](http://files.jb51.net/upload/201203/20120314150605876.png)

* `JSON.stringify(object, array)`

```
var student = new Object();
student.qq = "5485891512";
student.name = "Lanny";
student.age = 25;

var stu = new Array();
stu[0] = "qq";
stu[1] = "age";
stu[2] = "Hi";//这个student对象里不存在。

var json = JSON.stringify(student,stu);
alert(json); 
```

![JSON.stringify(object, array)](http://files.jb51.net/upload/201203/20120314150606776.png)

* `JSON.stringify(object, array, number)`

```
var student = new Object();
student.qq = "5485891512";
student.name = "Lanny";
student.age = 25;

var stu = new Array();
stu[0] = "qq";
stu[1] = "age";
stu[2] = "Hi";

var json = JSON.stringify(student,stu,100);//注意这里的100
alert(json); 
```

![JSON.stringify(object, array, number)](http://files.jb51.net/upload/201203/20120314150606953.png)

* `JSON.stringify(object, array, string)`

```
var student = new Object();
student.qq = "5485891512";
student.name = "Lanny";
student.age = 25;

var stu = new Array();
stu[0] = "qq";
stu[1] = "age";
stu[2] = "Hi";

var json = JSON.stringify(student,stu,"HaiKou");
alert(json); 
```

![JSON.stringify(object, array, string)](http://files.jb51.net/upload/201203/20120314150606568.png)

#### 55) \<public\> `ko.utils.fieldsIncludedWithJsonPost` : 包含 JSON POST 的域（仅下方 postJson 使用）

```
fieldsIncludedWithJsonPost : ['authenticity_token', /^__RequestVerificationToken(_.*)?$/]
```

#### 56) \<public\> `ko.utils.postJson(urlOrForm, data, options)` : 通过临时或指定的 form 元素 post JSON 数据

```
/**
 * @use {function} ko.utils.unwrapObservable
 * @use {function} ko.utils.fieldsIncludedWithJsonPost
 * @use {function} ko.utils.getFormFields
 * @use {function} ko.utils.stringifyJson
 * @use {function} objectForEach
 *
 * @param {string|object} urlOrForm : [] 目标地址或目标 form 元素
 * @param {object} data             : [] 要发送的数据对象
 * @param {object} options          : [ {} ] 寄存对象（options.params ≈ data）
 */
function (urlOrForm, data, options) {
    options = options || {};
    var params = options['params'] || {};
    var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
    var url = urlOrForm;

    // 如果我们得到了一个 form，利用它的 "action" 地址和获取所需的字段值
    if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
        var originalForm = urlOrForm;
        url = originalForm.action;
        for (var i = includeFields.length - 1; i >= 0; i--) {
            var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
            for (var j = fields.length - 1; j >= 0; j--)
                params[fields[j].name] = fields[j].value;
        }
    }

    data = ko.utils.unwrapObservable(data);
    var form = document.createElement("form");
    form.style.display = "none";
    form.action = url;
    form.method = "post";
    for (var key in data) {
        // 因为 "data" 是 1 个模型对象，包括我们所有属性（包含从原型继承来的属性）
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
        form.appendChild(input);
    }
    objectForEach(params, function(key, value) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });
    document.body.appendChild(form);
    options['submitter'] ? options['submitter'](form) : form.submit();
    setTimeout(function () { form.parentNode.removeChild(form); }, 0);
}
```

#### 57) \<public\> `ko.unwrap(value)` : 与 42) 相同

#### 58) 暴露接口

```
ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('utils.setTextContent', ko.utils.setTextContent);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // 简写, 因为该方法会经常用到
```
