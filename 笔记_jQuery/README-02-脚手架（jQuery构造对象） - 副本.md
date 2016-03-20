# 脚手架（构造jQuery对象）

```
(function( window, undefined ) {

    var jQuery = (function() {

       // 构建jQuery对象

       var jQuery = function( selector, context ) {

           return new jQuery.fn.init( selector, context, rootjQuery );

       }


       // jQuery对象原型

       jQuery.fn = jQuery.prototype = {

           constructor: jQuery,

           init: function( selector, context, rootjQuery ) {

              // selector有以下7种分支情况：

              // DOM元素

              // body（优化）

              // 字符串：HTML标签、HTML字符串、#id、选择器表达式

              // 函数（作为ready回调函数）

              // 最后返回伪数组

           }

       };



       // Give the init function the jQuery prototype for later instantiation

       jQuery.fn.init.prototype = jQuery.fn;



       // 合并内容到第一个参数中，后续大部分功能都通过该函数扩展

       // 通过jQuery.fn.extend扩展的函数，大部分都会调用通过jQuery.extend扩展的同名函数

       jQuery.extend = jQuery.fn.extend = function() {};



       // 在jQuery上扩展静态方法

       jQuery.extend({

           // ready bindReady

           // isPlainObject isEmptyObject

           // parseJSON parseXML

           // globalEval

           // each makeArray inArray merge grep map

           // proxy

           // access

           // uaMatch

           // sub

           // browser

       });


        // 到这里，jQuery对象构造完成，后边的代码都是对jQuery或jQuery对象的扩展

       return jQuery;

    })();

    window.jQuery = window.$ = jQuery;

})(window);
```

jQuery对象不是通过 new jQuery 创建的，而是通过 new jQuery.fn.init 创建的

```
var jQuery = function( selector, context ) {

       return new jQuery.fn.init( selector, context, rootjQuery );

}
```


## 补充说明

jQuery对象就是jQuery.fn.init对象

如果执行new jQeury(),生成的jQuery对象会被抛弃，最后返回 jQuery.fn.init对象；因此可以直接调用jQuery( selector, context )，没有必要使用new关键字

先执行 jQuery.fn = jQuery.prototype，再执行 jQuery.fn.init.prototype = jQuery.fn，合并后的代码如下：

```
jQuery.fn.init.prototype = jQuery.fn = jQuery.prototype
```

所有挂载到jQuery.fn的方法，相当于挂载到了jQuery.prototype，即挂载到了jQuery 函数上（一开始的 jQuery = function( selector, context ) ），但是最后都相当于挂载到了 jQuery.fn.init.prototype，即相当于挂载到了一开始的jQuery 函数返回的对象上，即挂载到了我们最终使用的jQuery对象上。


## jQuery.fn.init

jQuery.fn.init的功能是对传进来的selector参数进行分析，进行各种不同的处理，然后生成jQuery对象。

| 类型（selector） | 处理方式 |
|-|-|
| DOM元素 | 包装成jQuery对象，直接返回 |
| body（优化） | 从document.body读取 |
| 单独的HTML标签 | document.createElement |
| HTML字符串 | document.createDocumentFragment |
| #id | document.getElementById |
| 选择器表达式 | $(…).find |
| 函数 | 注册到dom ready的回调函数 |


## jQuery.extend = jQuery.fn.extend

```
// 合并两个或更多对象的属性到第一个对象中，jQuery后续的大部分功能都通过该函数扩展

// 通过jQuery.fn.extend扩展的函数，大部分都会调用通过jQuery.extend扩展的同名函数

// 如果传入两个或多个对象，所有对象的属性会被添加到第一个对象target

// 如果只传入一个对象，则将对象的属性添加到jQuery对象中。

// 用这种方式，我们可以为jQuery命名空间增加新的方法。可以用于编写jQuery插件。

// 如果不想改变传入的对象，可以传入一个空对象：$.extend({}, object1, object2);

// 默认合并操作是不迭代的，即便target的某个属性是对象或属性，也会被完全覆盖而不是合并

// 第一个参数是true，则会迭代合并

// 从object原型继承的属性会被拷贝

// undefined值不会被拷贝

// 因为性能原因，JavaScript自带类型的属性不会合并

// jQuery.extend( target, [ object1 ], [ objectN ] )

// jQuery.extend( [ deep ], target, object1, [ objectN ] )

jQuery.extend = jQuery.fn.extend = function() {

    var options, name, src, copy, copyIsArray, clone,

       target = arguments[0] || {},

       i = 1,

       length = arguments.length,

       deep = false;



    // Handle a deep copy situation

    // 如果第一个参数是boolean型，可能是深度拷贝

    if ( typeof target === "boolean" ) {

       deep = target;

       target = arguments[1] || {};

       // skip the boolean and the target

       // 跳过boolean和target，从第3个开始

       i = 2;

    }


    // Handle case when target is a string or something (possible in deep copy)

    // target不是对象也不是函数，则强制设置为空对象

    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {

       target = {};

    }


    // extend jQuery itself if only one argument is passed

    // 如果只传入一个参数，则认为是对jQuery扩展

    if ( length === i ) {

       target = this;

       --i;

    }


    for ( ; i < length; i++ ) {

       // Only deal with non-null/undefined values

       // 只处理非空参数

       if ( (options = arguments[ i ]) != null ) {

           // Extend the base object

           for ( name in options ) {

              src = target[ name ];

              copy = options[ name ];


              // Prevent never-ending loop

              // 避免循环引用

              if ( target === copy ) {

                  continue;

              }


              // Recurse if we're merging plain objects or arrays

              // 深度拷贝且值是纯对象或数组，则递归

              if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {

                  // 如果copy是数组

                  if ( copyIsArray ) {

                     copyIsArray = false;

                     // clone为src的修正值

                     clone = src && jQuery.isArray(src) ? src : [];

                  // 如果copy的是对象

                  } else {

                     // clone为src的修正值

                     clone = src && jQuery.isPlainObject(src) ? src : {};

                  }


                  // Never move original objects, clone them

                  // 递归调用jQuery.extend

                  target[ name ] = jQuery.extend( deep, clone, copy );


              // Don't bring in undefined values

              // 不能拷贝空值

              } else if ( copy !== undefined ) {

                  target[ name ] = copy;

              }

           }

       }

    }


    // Return the modified object

    // 返回更改后的对象

    return target;
};
```

[来源](http://nuysoft.iteye.com/blog/1182087)