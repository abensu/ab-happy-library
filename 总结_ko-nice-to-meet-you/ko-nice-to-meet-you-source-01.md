## 外框

### 描述

整体结构

### 行数

7 ~ 5475

### 源码

```
(function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') 是一个强大的方式获得对全局对象的引用
    // 具体请看 http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // 支持 3 种模块加载场景
    if (typeof define === 'function' && define['amd']) {
        // [1] AMD 匿名模块
        define(['exports', 'require'], factory);
    } else if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [2] CommonJS/Node.js
        factory(module['exports'] || exports);  // module.exports is for Node.js
    } else {
        // [3] 无模块加载 (普通 <script> 标签) - 直接放进全局命名空间中
        factory(window['ko'] = {});
    }
}(function(koExports, amdRequire){
// 在内部，所有 KO 对象会挂载到 koexports (而那些没有被挂载的命名会被 closure compiler 压缩).
// 在未来，下面 "ko" 变量会不同于 "koExports"，从而私有对象不会被外部触及
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler 助手 (使用它是为了让压缩文件更小)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // 在未来，"ko" 会区别于 "koexports"（从而使没有暴露的对象不能被外部接触）
    // 在这一点上，"target" 会被设置为：(typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.3.0";

ko.exportSymbol('version', ko.version);

...

}));
}());
})();
```

### 分析

#### 1) 打开调试模式（具体分析会在以后对应位置进行解释）

```
var DEBUG=true;

/**
 * 以下列出受影响的代码
 */

// line 1284
if (DEBUG) observable._latestValue = _latestValue;

// line 1298
if (DEBUG) observable._latestValue = _latestValue;

// line 1759
if (DEBUG) dependentObservable._latestValue = _latestValue;

// line 4320
if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;

// line 4333
var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;

// line 4362
if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
```

#### 2) 缓存通用对象

```
var window = this || (0, eval)('this'),
    document = window['document'],
    navigator = window['navigator'],
    jQueryInstance = window["jQuery"],
    JSON = window["JSON"];
```

而以下这段是为了解决**化石级 ie **中，闭包中的 `this` 不是指向 `window` 而是 `undefined` 的问题。

```
(0, eval)('this')
```

由于 `eval` 函数中的 `this` 会指向全局（即 `window`），从而解决全局指向的问题。

#### 3) 模块加载

```
// [0] 总式
(function(factory) {...})(function(koExports, amdRequire) {...});
//      ↓
// factory === function(koExports, amdRequire) {...}

// [1] AMD 匿名模块
define(['exports', 'require'], factory);
// ['exports', 'require']
//      ↓           ↓
// koExports, amdRequire
//      ↓           ↓
// koExports  === 'exports' 模块
// amdRequire === 'require' 模块

// [2] CommonJS/Node.js
factory(module['exports'] || exports);
// module['exports'] || exports
//      ↓
// koExports
//      ↓
// koExports  === 'exports' 模块

// [3] 无模块加载 (普通 <script> 标签) - 直接放进全局命名空间中
factory(window['ko'] = {});
// window['ko'] = {}
//      ↓
// koExports
//      ↓
// koExports  === window['ko']
```

#### 4) 定义内部总对象

```
var ko = typeof koExports !== 'undefined' ? koExports : {};
```

> 貌似 `koExports` 不会出现 `undefined` 的情况，不过这里算是最低限度的保障吧

#### 5) `ko.exportSymbol(koPath, object)` : 挂载函数（暴露标志）

```
/**
 * 根据 `koPath` （`.` 分割的路径），让 `object` 挂载到 `ko` 对象的指定节点中
 *
 * @attention :
 *
 *      此方法的存在是因为 Google Closure Compiler 会将函数和对象压缩到简写形式，如：
 *
 *          ko.someFunction
 *              ↓
 *          经过压缩
 *              ↓
 *          a.a （即 ko.a）
 *              ↓
 *          外部使用 ko.someFunction 失败
 *
 *      如果在外部使用 ko.someFunction 时，只能通过 ko.a 来使用，
 *      所以通过这个挂载函数，可以将方法重现，如：
 *
 *          ko.someFunction
 *              ↓
 *          经过压缩
 *              ↓
 *          a.a （即 ko.a）
 *              ↓
 *          ko.exportSymbol("someFunction", a.a)
 *              ↓
 *          外部使用 ko.someFunction 成功
 *
 *      PS: 所以在提示器里打 `ko.` 会出现一堆单字母 Σ( ° △ °|||)︴
 *
 * @param {string} koPath   : [] 点路径，如，"utils.arrayForEach"
 * @param {*} object        : [] 源对象，如，{ key : "value" } 或 function() {...} 等
 */
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
```

#### 6) `ko.exportProperty(owner, publicName, object)` : 暴露属性

```
/**
 * 功能类似于 ko.exportSymbol ，但主要是给非 ko 对象用的，而且仅支持单层
 *
 * @param {object} owner        : [] 目标对象
 * @param {string} publicName   : [] 属性名
 * @param {*} object            : [] 源对象，如，{ key : "value" } 或 function() {...} 等
 */
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
```

#### 7) `ko.version` : 版本

```
ko.version = "3.3.0";

ko.exportSymbol('version', ko.version);
```
