## 基础函数 part 4

### 描述

缓存

### 行数

893 ~ 961

### 源码

```
ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // 阉割这个节点，以致我们不用再次尝试去 unmemoize 它
                if (node.parentNode)
                    node.parentNode.removeChild(node); // 如果可能的话，完全删除它（有可能别人会传参到它里面然后再次调用 unmemoizeDomNodeAndDescendants）
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
```

### 分析

#### 1) `memos` : 缓存对象

```
memos = {
    "f702111361f6da1" : function() {...},
    ...
};
```

#### 2) `randomMax8HexChars()` : 生成 16 进制的随机值

```
/**
 * @return {string} : [] 16 进制值，如 "f702111"、"361f6da1"
 */
function randomMax8HexChars() {
    return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
}
```

样例：

```
randomMax8HexChars();
//  ↓
// "f702111"
```

#### 3) `generateRandomId()` : 生成随机 ID（即合并两个 16 进制随机值）

```
/**
 * @use {function} randomMax8HexChars
 *
 * @return {string} : [] 16 进制值，如 "f702111361f6da1"
 */
function generateRandomId() {
    return randomMax8HexChars() + randomMax8HexChars();
}
```

样例：

```
generateRandomId();
//  ↓
// "f702111361f6da1"
```

#### 4) `findMemoNodes(rootNode, appendToArray)` : 寻找 `rootNode` 最近的缓存节点（如`<!--[ko_memo:f702111361f6da1]-->`）并将 `{ domNode: rootNode, memoId: memoId }` 添加到 `appendToArray`

```
/**
 * @use {function} ko.memoization.parseMemoText
 *
 * @param {object} rootNode     : [] 根节点
 * @param {array} appendToArray : [] 需要添加数据的数组
 */
function findMemoNodes(rootNode, appendToArray) {
    if (!rootNode)
        return;
    if (rootNode.nodeType == 8) {
        var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
        if (memoId != null)
            appendToArray.push({ domNode: rootNode, memoId: memoId });
    } else if (rootNode.nodeType == 1) {
        for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
            findMemoNodes(childNodes[i], appendToArray);
    }
}
```

样例：

```
<div id="div">
    <!--[ko_memo:f702111361f6da1]-->
    <!--[ko_memo:f702111361f6123]-->
    <!--[ko_memo:f702111361f6456]-->
</div>

...

var
    div = document.getElementById("div"),
    arr = [];

findMemoNodes(div, arr);
//  ↓
// arr
//  ↓
// [Object { domNode=Comment, memoId="f702111361f6da1"}, Object { domNode=Comment, memoId="f702111361f6123"}, Object { domNode=Comment, memoId="f702111361f6456"}]
```

#### 5) \<public\> `ko.memoization.memoize(callback)` : 保存回调函数到 memos 中（键为随机 ID），并返回对应的缓存节点

```
/**
 * @use {object} memos
 * @use {function} generateRandomId
 *
 * @param {function} callback   : [] 回调函数
 *
 * @return {string}             : [] 缓存节点，如 "<!--[ko_memo:f702111361f6da1]-->"
 */
function (callback) {
    if (typeof callback != "function")
        throw new Error("You can only pass a function to ko.memoization.memoize()");
    var memoId = generateRandomId();
    memos[memoId] = callback;
    return "<!--[ko_memo:" + memoId + "]-->";
}
```

#### 6) \<public\> `ko.memoization.unmemoize(memoId, callbackParams)` : 执行 memos[memoId] 的函数（传入 callbackParams 参数数组），然后清除 memos[memoId]

```
/**
 * @use {object} memos
 *
 * @param {string} memoId           : [] 回调函数
 * @param {array} callbackParams    : [] 参数数组
 *
 * @return {boolean|undefined}      : [ undefined ] 回调函数是否执行成功，成功返回 true
 */
function (memoId, callbackParams) {
    var callback = memos[memoId];
    if (callback === undefined)
        throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
    try {
        callback.apply(null, callbackParams || []);
        return true;
    }
    finally { delete memos[memoId]; }
}
```

#### 7) \<public\> `ko.memoization.unmemoizeDomNodeAndDescendants(domNode, extraCallbackParamsArray)` : 清除缓存与节点

```
/**
 * @use {function} findMemoNodes
 * @use {function} ko.utils.arrayPushAll
 * @use {function} ko.memoization.unmemoize
 *
 * @param {object} domNode                  : [] 目标节点
 * @param {array} extraCallbackParamsArray  : [] 附加的回调参数数组
 */
function (domNode, extraCallbackParamsArray) {
    var memos = [];
    findMemoNodes(domNode, memos);
    for (var i = 0, j = memos.length; i < j; i++) {
        var node = memos[i].domNode;
        var combinedParams = [node];
        if (extraCallbackParamsArray)
            ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
        ko.memoization.unmemoize(memos[i].memoId, combinedParams);
        node.nodeValue = ""; // 清空这个节点，从而我们不用再次尝试去 unmemoize 它
        if (node.parentNode)
            node.parentNode.removeChild(node); // 如果可能的话，完全删除它（有可能别人会传参到它里面然后再次调用 unmemoizeDomNodeAndDescendants）
    }
}
```

#### 8) \<public\> `ko.memoization.parseMemoText(memoText)` : 获取缓存的 ID 值

```
/**
 * @param {string} memoText : [] 缓存节点的 ID 值
 *
 * @return {string}         : [ null ] 匹配到的 ID 值
 */
function (memoText) {
    var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
    return match ? match[1] : null;
}
```

样例：

```
ko.memoization.parseMemoText("<!--[ko_memo:f702111361f6da1]-->");
//  ↓
// "f702111361f6da1"

ko.memoization.parseMemoText("<!--[nothing]-->");
//  ↓
// null
```

#### 9) 暴露接口

```
ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
```
