## 基础函数 part 2

### 描述

* `ko.utils.domData`

获取、设置、清除、记录 DOM 元素上唯一的 KO 标记值

低版本的浏览器（IE8 或以下）会在 tag 上进行标示：

```
<select data-bind="..." __ko__1429083851993="ko11">
    ...
</select>
```

> 其策略与 jQuery 同出一致

* `ko.utils.domNodeDisposal`

KO 数据与 DOM 之间的绑定、清除操作

### 行数

643 ~ 794

### 源码

```
ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // 如果我们当前正在删除一个值时，确保不会立刻出创建一个新的 domData 键
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // 无论什么东西一直按预期被清除，完全暴露 “不干净” 的标记以致规格能够做出推断
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear);

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // 运行所有处理的回调
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // 克隆，因为数据在遍历时有可能被修改（通常，回调会清除它们自身）
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // 擦除 DOM 上的 KO 数据
        ko.utils.domData.clear(node);

        // 执行清理需要依赖外部库（当前仅能是 jQuery，但可以去扩展）
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // 清除一些下一级注释型子代元素，因为他们通过 cleanNode() 方法
        // 不会被 node.getElementsByTagName("*") 找到（注释节点不是元素）
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // 首先清除这个节点，在适合的地方
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... 然后它的后裔，在适合的地方
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // 克隆后裔列表以防它在迭代时改变
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // 这里特别支持 jQuery，因为它被普遍使用
            // 很多 jQuery 插件（包括 jquery.tmpl）缓存数据使用等效于 domData 的 jQuery 机制
            // 所以这里通知它去卸载与节点和子孙相关的所有资源
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    };
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // 为了方便使用而简写
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // 为了方便使用而简写
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
```

### 分析1（`ko.utils.domData`）

#### 1) `uniqueId` `dataStoreKeyExpandoPropertyName` `dataStore` : 内部缓存变量

`<select data-bind="..." __ko__1429083851993="ko11">`

* `uniqueId` : 唯一值（从 0 开始，不断累积上去），如 ko11 中的 11

* `dataStoreKeyExpandoPropertyName` : 暴露的 KO 标记属性（每刷新一次会更新一次，以防缓存），如 __ko__1429083851993

* `dataStore` : DOM 与 KO 的索引表，结构如下：

```
dataStore = {
    "ko11" : {
        "__ko__1429083851993" : [function, function ...] // 这个是通过 ko.utils.domNodeDisposal.addDisposeCallback 产生的
    },
    ...
}
```

#### 2) `getAll(node, createIfNotFound)` : 通过 node 中 KO 的标记，获取 `dataStore` 对应的数据，如果找不到标记或对应数据则进行标记和分配

```
/**
 * @param {object} node               : [] 某元素
 * @param {boolean} createIfNotFound  : [] 如果找不到数据，是否进行标记和分配
 *
 * @return {object}                   : [] dataStore 对应的对象
 */
function getAll(node, createIfNotFound) {
    var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
    var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
    if (!hasExistingDataStore) {
        if (!createIfNotFound)
            return undefined;
        dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
        dataStore[dataStoreKey] = {};
    }
    return dataStore[dataStoreKey];
}
```

#### 3) `ko.utils.domData.get(node, key)` : 获取 dataStore 对应 node 元素的对象中的对应 key 的值

```
/**
 * @param {object} node : [] 某元素
 * @param {string} key  : [] 想要获取的 dataStore 的键值
 *
 * @param {*}           : [ undefined ] 对应的值
 */
function (node, key) {
    var allDataForNode = getAll(node, false);
    return allDataForNode === undefined ? undefined : allDataForNode[key];
}
```

#### 4) `ko.utils.domData.set(node, key, value)` : 设置 dataStore 对应 node 元素的对象中的对应 key 的 value 值

```
/**
 * @param {object} node : [] 某元素
 * @param {string} key  : [] 要设置的键
 * @param {*} value     : [] 要设置的值
 */
function (node, key, value) {
    if (value === undefined) {
        // 如果我们当前正在删除一个值时，确保不会立刻出创建一个新的 domData 键
        if (getAll(node, false) === undefined)
            return;
    }
    var allDataForNode = getAll(node, true);
    allDataForNode[key] = value;
}
```

#### 5) \<public\> `ko.utils.domData.clear(node)` : 清除 node 和 dataStore 对应的值

```
/**
 * @param {object} node : [] 某元素
 *
 * @return {boolean}    : [ false ] 是否清除成功
 */
function (node) {
    var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
    if (dataStoreKey) {
        delete dataStore[dataStoreKey];
        node[dataStoreKeyExpandoPropertyName] = null;
        return true; // 无论什么东西一直按预期被清除，完全暴露 “不干净” 的标记以致规格能够做出推断
    }
    return false;
}
```

#### 6) `ko.utils.domData.nextKey()` : 获取新键

```
/**
 * @return {string} : [] 键
 */
function () {
    return (uniqueId++) + dataStoreKeyExpandoPropertyName;
}
```

#### 7) 暴露接口

```
ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear);
```

### 分析2（`ko.utils.domNodeDisposal`） 

#### 1) `domDataKey` `cleanableNodeTypes` `cleanableNodeTypesWithDescendants` : 内部缓存变量

* `domDataKey` : domData的新键（如 “__ko__1429083851993” ）

* `cleanableNodeTypes` : 可以清除的元素类型索引表（nodeType 为 1、8、9）

* `cleanableNodeTypesWithDescendants` : 可以清除其后代的元素类型索引表（nodeType 为 1、9）

```
var domDataKey = ko.utils.domData.nextKey();
var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document
```

#### 2) `getDisposeCallbacksCollection(node, createIfNotFound)` : 获取目标元素的 KO 的回调列表

```
/**
 * @use {function} ko.utils.domData.get
 * @use {function} ko.utils.domData.set
 *
 * @param {object} node               : [] 目标元素
 * @param {boolean} createIfNotFound  : [] 如果找不到对应的 domData 数据，是否进行标记和分配
 *
 * @return {array|undefined}          : [ undefined ] 回调列表
 */
function getDisposeCallbacksCollection(node, createIfNotFound) {
    var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
    if ((allDisposeCallbacks === undefined) && createIfNotFound) {
        allDisposeCallbacks = [];
        ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
    }
    return allDisposeCallbacks;
}
```

#### 3) `destroyCallbacksCollection(node)` : 破坏目标元素的回调列表（将 domData 和元素对应的数据设为 undefined）

```
/**
 * @use {function} ko.utils.domData.set
 *
 * @param {object} node : [] 目标元素
 */
function destroyCallbacksCollection(node) {
    ko.utils.domData.set(node, domDataKey, undefined);
}
```

#### 4) `cleanSingleNode(node)` : 净化单个元素（解除 KO 和 jQuery 绑定到元素的数据，再清除注释节点，而非删除该元素）

```
/**
 * @use {object} cleanableNodeTypesWithDescendants
 * @use {function} getDisposeCallbacksCollection
 * @use {function} cleanImmediateCommentTypeChildren
 * @use {function} ko.utils.domData.clear
 * @use {function} ko.utils.domNodeDisposal["cleanExternalData"]
 *
 * @param {object} node : [] 目标元素
 */
function cleanSingleNode(node) {
    // 运行所有处理的回调
    var callbacks = getDisposeCallbacksCollection(node, false);
    if (callbacks) {
        callbacks = callbacks.slice(0); // 克隆，因为数据在遍历时有可能被修改（通常，回调会清除它们自身）
        for (var i = 0; i < callbacks.length; i++)
            callbacks[i](node);         // 推测类似于 C++ 的析构函数，在删除时调用
    }

    // 擦除 DOM 上的 KO 数据
    ko.utils.domData.clear(node);

    // 需要依赖外部库执行清理（当前仅能是 jQuery，但可以去扩展）
    ko.utils.domNodeDisposal["cleanExternalData"](node);

    // 清除一些下一级注释型子代元素，因为他们通过 cleanNode() 方法
    // 不会被 node.getElementsByTagName("*") 找到（注释节点不是元素）
    if (cleanableNodeTypesWithDescendants[node.nodeType])
        cleanImmediateCommentTypeChildren(node);
}
```

#### 5) `cleanImmediateCommentTypeChildren(nodeWithChildren)` : 清除下一级的注释型的子代元素

```
/**
 * @use {function} cleanSingleNode
 *
 * @param {object} nodeWithChildren : [] 带有子代的节点
 */
function cleanImmediateCommentTypeChildren(nodeWithChildren) {
    var child, nextChild = nodeWithChildren.firstChild;
    while (child = nextChild) {
        nextChild = child.nextSibling;
        if (child.nodeType === 8)
            cleanSingleNode(child);
    }
}
```

#### 6) \<public\> `ko.utils.domNodeDisposal.addDisposeCallback(node, callback)` : 添加 KO 的回调函数

```
/**
 * @use {function} getDisposeCallbacksCollection
 *
 * @param {object} node       : [] 目标元素
 * @param {function} callback : [] 要添加的回调函数
 */
function(node, callback) {
    if (typeof callback != "function")
        throw new Error("Callback must be a function");
    getDisposeCallbacksCollection(node, true).push(callback);
}
```

#### 7) \<public\> `ko.utils.domNodeDisposal.removeDisposeCallback(node, callback)` : 删除对应的 KO 的回调函数

```
/**
 * @use {function} getDisposeCallbacksCollection
 * @use {function} destroyCallbacksCollection
 * @use {function} ko.utils.arrayRemoveItem
 *
 * @param {object} node       : [] 目标元素
 * @param {function} callback : [] 要删除的回调函数
 */
function(node, callback) {
    var callbacksCollection = getDisposeCallbacksCollection(node, false);
    if (callbacksCollection) {
        ko.utils.arrayRemoveItem(callbacksCollection, callback);
        if (callbacksCollection.length == 0)
            destroyCallbacksCollection(node);
    }
}
```

#### 8) \<public\> `ko.utils.domNodeDisposal.cleanNode(node)` : 净化目标元素及其子代元素

```
/**
 * @use {object} cleanableNodeTypes
 * @use {object} cleanableNodeTypesWithDescendants
 * @use {function} cleanSingleNode
 * @use {function} cleanSingleNode
 * @use {function} ko.utils.arrayPushAll
 *
 * @param {object} node : [] 目标元素
 *
 * @return {object}     : [] 处理后的目标元素
 */
function(node) {
    // 首先清除这个节点，在适合的地方
    if (cleanableNodeTypes[node.nodeType]) {
        cleanSingleNode(node);

        // ... 然后它的后裔，在适合的地方
        if (cleanableNodeTypesWithDescendants[node.nodeType]) {
            // 克隆后裔列表以防它在迭代时改变
            var descendants = [];
            ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
            for (var i = 0, j = descendants.length; i < j; i++)
                cleanSingleNode(descendants[i]);
        }
    }
    return node;
}
```

#### 9) \<public\> `ko.utils.domNodeDisposal.removeNode(node)` : 清除元素（先净化，再删除）

```
/**
 * @use {function} ko.cleanNode
 *
 * @param {object} node : [] 要被清除的元素
 */
function(node) {
    ko.cleanNode(node);
    if (node.parentNode)
        node.parentNode.removeChild(node);
}
```

#### 10) `ko.utils.domNodeDisposal["cleanExternalData"](node)` : 清除其他库绑定到该元素的数据（如有 `jQuery`，则调用 `jQuery.cleanData(node)`）

```
/**
 * @param {object} node : [] 目标元素
 */
function (node) {
    // 这里特别支持 jQuery，因为它被普遍使用
    // 很多 jQuery 插件（包括 jquery.tmpl）缓存数据使用等效于 domData 的 jQuery 机制
    // 所以这里通知它去卸载与节点和子孙相关的所有资源
    if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
        jQueryInstance['cleanData']([node]);
}
```

#### 11) \<public\> `ko.cleanNode(node)` : 具体请看 分析2 的 8)

#### 12) \<public\> `ko.removeNode(node)` : 具体请看 分析2 的 9)

#### 13) 暴露接口与缩短命名

```
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode;
ko.removeNode = ko.utils.domNodeDisposal.removeNode;
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
```