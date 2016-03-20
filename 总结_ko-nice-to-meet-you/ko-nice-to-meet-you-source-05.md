## 基础函数 part 3

### 描述

解析与设置 HTML

### 行数

795 ~ 891

### 源码

```
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html, documentContext) {
        documentContext || (documentContext = document);
        var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;

        // 基于 jQuery 的 clean 函数，不过仅用于 table 相关的元素
        // 如果你的页面已经引用了 jQuery，simpleHtmlParse 函数则不会被使用 - KO 会使用 jQuery 的 clean 函数

        // 注意仍有 1 个 IE9 以下的 bug，它会忽视元素的下一级子代的第 1 个注释元素
        // 例如："<div><!-- mycomment -->abc</div>" 会被解析成 "<div>abc</div>"
        // 这不影响那些使用 jQuery 的人，并且有一种解决方法是添加 1 个假元素
        // （有可能是 1 个文本节点）在注释元素前。所以，现阶段 KO 不会尝试自动去处理这个 IE 的问题

        // 清除前后空白符，否则 indexOf 函数不会达到预期效果
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = documentContext.createElement("div");

        // 从左栏寻找第 1 个匹配，并且从右栏返回相应的 “容器” 数据
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /*    其他元素   */                                 [0, "", ""];

        // 来回扫描 html，然后剥离额外的容器
        // 注意我们经常前缀一些假文本，否则，IE9 以下会在子代除去重要的注释元素。超级疯狂啊！
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof windowContext['innerShiv'] == "function") {
            div.appendChild(windowContext['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // 移到右边深度
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html, documentContext) {
        // jQuery 的 parseHTML 函数在 jQuery 1.8.0 被引进并且是 1 个正式的公共接口
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html, documentContext) || []; // 确保我们返回的是 1 个数组，决不能是 null
        } else {
            // 为了 jQuery 1.8.0 以下版本，我们回退使用未正式公开的内部函数 clean
            var elems = jQueryInstance['clean']([html], documentContext);

            // 自 jQuery 1.7.1 起，jQuery 解析 HTML 是通过添加一些假的父元素在一个缓存的 document fragment 中进行
            // 不幸的是，它没有在 document fragment 清除那些假元素，所以它会造成内存溢出
            // 解决方式是通过寻找最顶层的假元素的父节点，并从 fragment 删除它
            if (elems && elems[0]) {
                // 找到最顶级父元素，即 document 下一级元素
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* 例如 DocumentFragment */)
                    elem = elem.parentNode;
                // ... 然后清除它
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html, documentContext) {
        return jQueryInstance ? jQueryHtmlParse(html, documentContext)   // 如下所示，尽可能地从 jQuery 的优化中获益
                              : simpleHtmlParse(html, documentContext);  // ... 否则，会用简单的逻辑去处理
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // 没有任何理由不去 unwrap 它来显示一个字符串化的观察者，所以我们要 unwrap 它
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery 包含很多复杂的代码去解析任意的 HTML fragment 元素，
            // 例如 <tr> 元素一般不会被允许存在在他们的自身当中
            // 如果你已经引入 jQuery，我们会使用它，而不是复制它的代码
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... 否则，使用 KO 自身的解析逻辑
                var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);
```

### 分析

#### 1) `leadingCommentRegex` : 匹配注释的正则

```
var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;
```

#### 2) `simpleHtmlParse(html, documentContext)` : 简单的 html 解析

```
/**
 * @param {string} html             : [] html 字符串
 * @param {object} documentContext  : [ document ] 顶级文档域
 *
 * @return {array}                  : [] 返回处理好的元素数组
 */
function simpleHtmlParse(html, documentContext) {
    documentContext || (documentContext = document);
    var windowContext = documentContext['parentWindow'] || documentContext['defaultView'] || window;

    // 基于 jQuery 的 clean 函数，不过仅用于 table 相关的元素
    // 如果你的页面已经引用了 jQuery，simpleHtmlParse 函数则不会被使用 - KO 会使用 jQuery 的 clean 函数

    // 注意仍有 1 个 IE9 以下的 bug，它会忽视元素的下一级子代的第 1 个注释元素
    // 例如："<div><!-- mycomment -->abc</div>" 会被解析成 "<div>abc</div>"
    // 这不影响那些使用 jQuery 的人，并且有一种解决方法是添加 1 个假元素
    // （有可能是 1 个文本节点）在注释元素前。所以，现阶段 KO 不会尝试自动去处理这个 IE 的问题

    // 清除前后空白符，否则 indexOf 函数不会达到预期效果
    var tags = ko.utils.stringTrim(html).toLowerCase(), div = documentContext.createElement("div");

    // 从左栏寻找第 1 个匹配，并且从右栏返回相应的 “容器” 数据
    var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
               !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
               (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
               /*    其他元素   */                                 [0, "", ""];

    // 来回扫描 html，然后剥离额外的容器
    // 注意我们经常前缀一些假文本，否则，IE9 以下会在子代除去重要的注释元素。超级疯狂啊！
    var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
    if (typeof windowContext['innerShiv'] == "function") {
        div.appendChild(windowContext['innerShiv'](markup));
    } else {
        div.innerHTML = markup;
    }

    // 移到右边深度
    while (wrap[0]--)
        div = div.lastChild;

    return ko.utils.makeArray(div.lastChild.childNodes);
}
```

* `documentContext || (documentContext = document);` 这步可以通过严格模式的检测，因为 `documentContext` 已存在内部函数中

* `document.parentWindow` `document.defaultView` : 返回当前 window （针对 frame 和 iframe）

`document.parentWindow` 针对 IE（≤ 10）

`document.defaultView` 针对非 IE

> 很显然，坑就在这里了，当使用Firefox 3.6时，其frame中需要使用document.defaultView去获取window对象，才能使用其getComputedStyle方法。

[关于Document.defaultView](http://keleyi.com/a/bjad/vviscg60.htm)

* `innerShiv` : 解析 html 字符串，返回解析好的 html 对象（或数组）【ES5方法】

```
/**
 * @example : innerShiv(htmlString, getArray)
 *
 * @param {string} htmlString   : [] html 字符串
 * @param {boolean} getArray    : [ undefined | false ] 返回值为数组
 *
 * @return {object|array}       : [] 解析好的 html 对象或数组
 */

document.body.appendChild( innerShiv('<myDiv><div>Hi!</div></myDiv>') );

// 类似于以下操作

var myDiv = document.createElement('myDiv');
myDiv.innerHTML = "<div>Hi!</div>";
document.body.appendChild(myDiv);
```

[Fix Inserted HTML5 Content with HTML5 innerShiv](https://css-tricks.com/html5-innershiv/)

[HTML5 innerShiv 翻译文档](http://wange.im/html5-innershiv-translated-doc.html?replytocom=101027)

* `condition1 && value1 || contion2 && value2` 等价于 `if (condition1) { return value1 } else if (condition2) { return value2 }`

样例：

```
simpleHtmlParse('123<div><span>456</span><select><option>789</option></select></div>');
//  ↓
// [<TextNode textContent="123">, div]
```

#### 3) `jQueryHtmlParse(html, documentContext)` : 解析 html 字符串，返回解析好的 html 对象（By jQuery）

```
/**
 * @use {function} jQuery.parseHTML
 * @use {function} jQuery.clean
 *
 * @param {string} html             : [] html 字符串
 * @param {object} documentContext  : [ document ] 顶级文档域
 *
 * @return {array}                  : [] 返回处理好的元素数组
 */
function jQueryHtmlParse(html, documentContext) {
    // jQuery 的 parseHTML 函数在 jQuery 1.8.0 被引进并且是 1 个正式的公共接口
    if (jQueryInstance['parseHTML']) {
        return jQueryInstance['parseHTML'](html, documentContext) || []; // 确保我们返回的是 1 个数组，决不能是 null
    } else {
        // 为了 jQuery 1.8.0 以下版本，我们回退使用未正式公开的内部函数 clean
        var elems = jQueryInstance['clean']([html], documentContext);

        // 自 jQuery 1.7.1 起，jQuery 解析 HTML 是通过添加一些假的父元素在一个缓存的 document fragment 中进行
        // 不幸的是，它没有在 document fragment 清除那些假元素，所以它会造成内存溢出
        // 解决方式是通过寻找最顶层的假元素的父节点，并从 fragment 删除它
        if (elems && elems[0]) {
            // 找到最顶级父元素，即 document 下一级元素
            var elem = elems[0];
            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* 例如 DocumentFragment */)
                elem = elem.parentNode;
            // ... 然后清除它
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
        }

        return elems;
    }
}
```

* `jQuery.parseHTML`

```
jQuery.parseHTML('456<select><option value="123">456</option></select>');
//  ↓
// [<TextNode textContent="123">, div]
```

* `jQuery.clean`

```
jQuery.clean(['456<select><option value="123">456</option></select>']);
//  ↓
// [<TextNode textContent="123">, div]

// 如果这样调用：

jQuery.clean('456<select><option value="123">456</option></select>');
//  ↓
// [<TextNode textContent="4">, <TextNode textContent="5">, <TextNode textContent="6">, <TextNode textContent="<">, <TextNode textContent="s">, <TextNode textContent="e">, <TextNode textContent="l">, ...>]
```

#### 4) \<public\> `ko.utils.parseHtmlFragment(html, documentContext)` : html 解析（使用合适的解析方法）

```
function(html, documentContext) {
    return jQueryInstance ? jQueryHtmlParse(html, documentContext)   // 如下所示，尽可能地从 jQuery 的优化中获益
                          : simpleHtmlParse(html, documentContext);  // ... 否则，会用简单的逻辑去处理
};
```

#### 5) \<public\> `ko.utils.setHtml(node, html)` :  html 注入到 node

```
/**
 * @use {function} ko.utils.emptyDomNode
 * @use {function} ko.utils.unwrapObservable
 * @use {function} ko.utils.parseHtmlFragment
 * @use {function} jQuery.fn.html
 *
 * @param {object} node : [] 目标元素
 * @param {string} html : [] html 字符串
 */
function(node, html) {
    ko.utils.emptyDomNode(node);

    // 没有任何理由不去 unwrap 它来显示一个字符串化的观察者，所以我们要 unwrap 它
    html = ko.utils.unwrapObservable(html);

    if ((html !== null) && (html !== undefined)) {
        if (typeof html != 'string')
            html = html.toString();

        // jQuery 包含很多复杂的代码去解析任意的 HTML fragment 元素，
        // 例如 <tr> 元素一般不会被允许存在在他们的自身当中
        // 如果你已经引入 jQuery，我们会使用它，而不是复制它的代码
        if (jQueryInstance) {
            jQueryInstance(node)['html'](html);
        } else {
            // ... 否则，使用 KO 自身的解析逻辑
            var parsedNodes = ko.utils.parseHtmlFragment(html, node.ownerDocument);
            for (var i = 0; i < parsedNodes.length; i++)
                node.appendChild(parsedNodes[i]);
        }
    }
};
```

#### 6) 暴露接口

```
ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);
```