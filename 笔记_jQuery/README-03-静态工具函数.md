# 其他静态工具函数

```
// 扩展工具函数

jQuery.extend({

    // http://www.w3school.com.cn/jquery/core_noconflict.asp

    // 释放$的 jQuery 控制权

    // 许多 JavaScript 库使用 $ 作为函数或变量名，jQuery 也一样。

    // 在 jQuery 中，$ 仅仅是 jQuery 的别名，因此即使不使用 $ 也能保证所有功能性。

    // 假如我们需要使用 jQuery 之外的另一 JavaScript 库，我们可以通过调用 $.noConflict() 向该库返回控制权。

   

    // 通过向该方法传递参数 true，我们可以将 $ 和 jQuery 的控制权都交还给另一JavaScript库。

    noConflict: function( deep ) {

       // 交出$的控制权

       if ( window.$ === jQuery ) {

           window.$ = _$;

       }

       // 交出jQuery的控制权

       if ( deep && window.jQuery === jQuery ) {

           window.jQuery = _jQuery;

       }

   

       return jQuery;

    },

   

    // Is the DOM ready to be used? Set to true once it occurs.

    isReady: false,

   

    // A counter to track how many items to wait for before

    // the ready event fires. See #6781

    // 一个计数器，用于跟踪在ready事件出发前的等待次数

    readyWait: 1,

   

    // Hold (or release) the ready event

    // 继续等待或触发

    holdReady: function( hold ) {

       if ( hold ) {

           jQuery.readyWait++;

       } else {

           jQuery.ready( true );

       }

    },

   

    // Handle when the DOM is ready

    // 文档加载完毕句柄

    // http://www.cnblogs.com/fjzhou/archive/2011/05/31/jquery-source-4.html

    ready: function( wait ) {

       // Either a released hold or an DOMready/load event and not yet ready

       //

       if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {

           // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).

           // 确保document.body存在

           if ( !document.body ) {

              return setTimeout( jQuery.ready, 1 );

           }

   

           // Remember that the DOM is ready

           jQuery.isReady = true;

   

           // If a normal DOM Ready event fired, decrement, and wait if need be

           if ( wait !== true && --jQuery.readyWait > 0 ) {

              return;

           }

   

           // If there are functions bound, to execute

           readyList.resolveWith( document, [ jQuery ] );

   

           // Trigger any bound ready events

           if ( jQuery.fn.trigger ) {

              jQuery( document ).trigger( "ready" ).unbind( "ready" );

           }

       }

    },

   

    // 初始化readyList事件处理函数队列

    // 兼容不同浏览对绑定事件的区别

    bindReady: function() {

       if ( readyList ) {

           return;

       }

   

       readyList = jQuery._Deferred();

   

       // Catch cases where $(document).ready() is called after the

       // browser event has already occurred.

       if ( document.readyState === "complete" ) {

           // Handle it asynchronously to allow scripts the opportunity to delay ready

           return setTimeout( jQuery.ready, 1 );

       }

   

       // Mozilla, Opera and webkit nightlies currently support this event

       // 兼容事件，通过检测浏览器的功能特性，而非嗅探浏览器

       if ( document.addEventListener ) {

           // Use the handy event callback

           // 使用较快的加载完毕事件

           document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

   

           // A fallback to window.onload, that will always work

           // 注册window.onload回调函数

           window.addEventListener( "load", jQuery.ready, false );

   

       // If IE event model is used

       } else if ( document.attachEvent ) {

           // ensure firing before onload,

           // maybe late but safe also for iframes

           // 确保在onload之前触发onreadystatechange，可能慢一些但是对iframes更安全

           document.attachEvent( "onreadystatechange", DOMContentLoaded );

   

           // A fallback to window.onload, that will always work

           // 注册window.onload回调函数

           window.attachEvent( "onload", jQuery.ready );

   

           // If IE and not a frame

           // continually check to see if the document is ready

           var toplevel = false;

   

           try {

              toplevel = window.frameElement == null;

           } catch(e) {}

   

           if ( document.documentElement.doScroll && toplevel ) {

              doScrollCheck();

           }

       }

    },

   

    // See test/unit/core.js for details concerning isFunction.

    // Since version 1.3, DOM methods and functions like alert

    // aren't supported. They return false on IE (#2968).

    // 是否函数

    isFunction: function( obj ) {

       return jQuery.type(obj) === "function";

    },

   

    // 是否数组

    // 如果浏览器有内置的 Array.isArray 实现，就使用浏览器自身的实现方式，

    // 否则将对象转为String，看是否为"[object Array]"。

    isArray: Array.isArray || function( obj ) {

       return jQuery.type(obj) === "array";

    },

   

    // A crude way of determining if an object is a window

    // 简单的判断（判断setInterval属性）是否window对象

    isWindow: function( obj ) {

       return obj && typeof obj === "object" && "setInterval" in obj;

    },

   

    // 是否是保留字NaN

    isNaN: function( obj ) {

       // 等于null 或 不是数字 或调用window.isNaN判断

       return obj == null || !rdigit.test( obj ) || isNaN( obj );

    },

    // 获取对象的类型

    type: function( obj ) {

       // 通过核心API创建一个对象，不需要new关键字

       // 普通函数不行

       // 调用Object.prototype.toString方法，生成 "[object Xxx]"格式的字符串

       // class2type[ "[object " + name + "]" ] = name.toLowerCase();

       return obj == null ?

           String( obj ) :

           class2type[ toString.call(obj) ] || "object";

    },

   

    // 检查obj是否是一个纯粹的对象（通过"{}" 或 "new Object"创建的对象）

    // console.info( $.isPlainObject( {} ) ); // true

    // console.info( $.isPlainObject( '' ) ); // false

    // console.info( $.isPlainObject( document.location ) ); // true

    // console.info( $.isPlainObject( document ) ); // false

    // console.info( $.isPlainObject( new Date() ) ); // false

    // console.info( $.isPlainObject( ) ); // false

   

    // isPlainObject分析与重构 http://www.jb51.net/article/25047.htm

    // 对jQuery.isPlainObject()的理解 http://www.cnblogs.com/phpmix/articles/1733599.html

    isPlainObject: function( obj ) {

       // Must be an Object.

       // Because of IE, we also have to check the presence of the constructor property.

       // Make sure that DOM nodes and window objects don't pass through, as well

       // 必须是一个对象

       // 因为在IE8中会抛出非法指针异常，必须检查constructor属性

       // DOM节点和window对象，返回false

      

       // obj不存在 或 非object类型 或 DOM节点 或 widnow对象，直接返回false

       // 测试以下三中可能的情况：

       // jQuery.type(obj) !== "object" 类型不是object，忽略

       // obj.nodeType 认为DOM节点不是纯对象

       // jQuery.isWindow( obj ) 认为window不是纯对象

       if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {

           return false;

       }

   

       // Not own constructor property must be Object

       // 测试constructor属性

       // 具有构造函数constructor，却不是自身的属性（即通过prototype继承的），

       if ( obj.constructor &&

           !hasOwn.call(obj, "constructor") &&

           !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {

           return false;

       }

   

       // Own properties are enumerated firstly, so to speed up,

       // if last one is own, then all properties are own.

   

       var key;

       for ( key in obj ) {}

       // key === undefined及不存在任何属性，认为是简单的纯对象

       // hasOwn.call( obj, key ) 属性key不为空，且属性key的对象自身的（即不是通过prototype继承的）

       return key === undefined || hasOwn.call( obj, key );

    },

    // 是否空对象

    isEmptyObject: function( obj ) {

       for ( var name in obj ) {

           return false;

       }

       return true;

    },

    // 抛出一个异常

    error: function( msg ) {

       throw msg;

    },

    // 解析JSON

    // parseJSON把一个字符串变成JSON对象。

    // 我们一般使用的是eval。parseJSON封装了这个操作，但是eval被当作了最后手段。

    // 因为最新JavaScript标准中加入了JSON序列化和反序列化的API。

    // 如果浏览器支持这个标准，则这两个API是在JS引擎中用Native Code实现的，效率肯定比eval高很多。

    // 目前来看，Chrome和Firefox4都支持这个API。

    parseJSON: function( data ) {

       if ( typeof data !== "string" || !data ) {

           return null;

       }

   

       // Make sure leading/trailing whitespace is removed (IE can't handle it)

       data = jQuery.trim( data );

   

       // Attempt to parse using the native JSON parser first

       // 原生JSON API。反序列化是JSON.stringify(object)

       if ( window.JSON && window.JSON.parse ) {

           return window.JSON.parse( data );

       }

   

       // Make sure the incoming data is actual JSON

       // Logic borrowed from http://json.org/json2.js

       // ... 大致地检查一下字符串合法性

       if ( rvalidchars.test( data.replace( rvalidescape, "@" )

           .replace( rvalidtokens, "]" )

           .replace( rvalidbraces, "")) ) {

   

           return (new Function( "return " + data ))();

   

       }

       jQuery.error( "Invalid JSON: " + data );

    },

   

    // Cross-browser xml parsing

    // (xml & tmp used internally)

    // 解析XML 跨浏览器

    // parseXML函数也主要是标准API和IE的封装。

    // 标准API是DOMParser对象。

    // 而IE使用的是Microsoft.XMLDOM的 ActiveXObject对象。

    parseXML: function( data , xml , tmp ) {

   

       if ( window.DOMParser ) { // Standard 标准XML解析器

           tmp = new DOMParser();

           xml = tmp.parseFromString( data , "text/xml" );

       } else { // IE IE的XML解析器

           xml = new ActiveXObject( "Microsoft.XMLDOM" );

           xml.async = "false";

           xml.loadXML( data );

       }

   

       tmp = xml.documentElement;

   

       if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {

           jQuery.error( "Invalid XML: " + data );

       }

   

       return xml;

    },

    // 无操作函数

    noop: function() {},

   

    // Evaluates a script in a global context

    // Workarounds based on findings by Jim Driscoll

    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context

    // globalEval函数把一段脚本加载到全局context（window）中。

    // IE中可以使用window.execScript。

    // 其他浏览器 需要使用eval。

    // 因为整个jQuery代码都是一整个匿名函数，所以当前context是jQuery，如果要将上下文设置为window则需使用globalEval。

    globalEval: function( data ) {

       // data非空

       if ( data && rnotwhite.test( data ) ) {

           // We use execScript on Internet Explorer

           // We use an anonymous function so that context is window

           // rather than jQuery in Firefox

           ( window.execScript || function( data ) {

              window[ "eval" ].call( window, data );

           } )( data );

       }

    },

    // 判断节点名称是否相同

    nodeName: function( elem, name ) {

       // 忽略大小写

       return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();

    },

   

    // args is for internal usage only

    // 遍历对象或数组

    each: function( object, callback, args ) {

       var name, i = 0,

           length = object.length,

           isObj = length === undefined || jQuery.isFunction( object );

       // 如果有参数args，调用apply，上下文设置为当前遍历到的对象，参数使用args

       if ( args ) {

           if ( isObj ) {

              for ( name in object ) {

                  if ( callback.apply( object[ name ], args ) === false ) {

                     break;

                  }

              }

           } else {

              for ( ; i < length; ) {

                  if ( callback.apply( object[ i++ ], args ) === false ) {

                     break;

                  }

              }

           }

   

       // A special, fast, case for the most common use of each

       // 没有参数args则调用，则调用call，上下文设置为当前遍历到的对象，参数设置为key/index和value

       } else {

           if ( isObj ) {

              for ( name in object ) {

                  if ( callback.call( object[ name ], name, object[ name ] ) === false ) {

                     break;

                  }

              }

           } else {

              for ( ; i < length; ) {

                  if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {

                     break;

                  }

              }

           }

       }

   

       return object;

    },

   

    // Use native String.trim function wherever possible

    // 尽可能的使用本地String.trim方法，否则先过滤开头的空格，再过滤结尾的空格

    trim: trim ?

       function( text ) {

           return text == null ?

              "" :

              trim.call( text );

       } :

   

       // Otherwise use our own trimming functionality

       function( text ) {

           return text == null ?

              "" :

              text.toString().replace( trimLeft, "" ).replace( trimRight, "" );

       },

   

    // results is for internal usage only

    // 将伪数组转换为数组

    makeArray: function( array, results ) {

       var ret = results || [];

   

       if ( array != null ) {

           // The window, strings (and functions) also have 'length'

           // The extra typeof function check is to prevent crashes

           // in Safari 2 (See: #3039)

           // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930

           // 一大堆浏览器兼容性测试，真实蛋疼

           var type = jQuery.type( array );

           // 测试：有没有length属性、字符串、函数、正则

           // 不是数组，连伪数组都不是

           if ( array.length == null

                  || type === "string"

                  || type === "function"

                  || type === "regexp"

                  || jQuery.isWindow( array ) ) {

              push.call( ret, array );

           } else {

              // $.type( $('div') ) // object

              jQuery.merge( ret, array );

           }

       }

   

       return ret;

    },

    //

    inArray: function( elem, array ) {

       // 是否有本地化的Array.prototype.indexOf

       if ( indexOf ) {

           // 直接调用Array.prototype.indexOf

           return indexOf.call( array, elem );

       }

       // 遍历数组，查找是否有完全相等的元素，并返回下标

       // 循环的小技巧：把array.length存放到length变量中，可以减少一次作用域查找

       for ( var i = 0, length = array.length; i < length; i++ ) {

           if ( array[ i ] === elem ) {

              return i;

           }

       }

       // 如果返回-1，则表示不在数组中

       return -1;

    },

    // 将数组second合并到数组first中

    merge: function( first, second ) {

       var i = first.length, //

           j = 0;

      

       // 如果second的length属性是Number类型，则把second当数组处理

       if ( typeof second.length === "number" ) {

           for ( var l = second.length; j < l; j++ ) {

              first[ i++ ] = second[ j ];

           }

   

       } else {

           // 遍历second，将非undefined的值添加到first中

           while ( second[j] !== undefined ) {

              first[ i++ ] = second[ j++ ];

           }

       }

       // 修正first的length属性，因为first可能不是真正的数组

        first.length = i;

   

       return first;

    },

    // 过滤数组，返回新数组；callback返回true时保留；如果inv为true，callback返回false才会保留

    grep: function( elems, callback, inv ) {

       var ret = [], retVal;

       inv = !!inv;

   

       // Go through the array, only saving the items

       // that pass the validator function

       // 遍历数组，只保留通过验证函数callback的元素

       for ( var i = 0, length = elems.length; i < length; i++ ) {

           // 这里callback的参数列表为：value, index，与each的习惯一致

           retVal = !!callback( elems[ i ], i );

           // 是否反向选择

           if ( inv !== retVal ) {

              ret.push( elems[ i ] );

           }

       }

   

       return ret;

    },

   

    // arg is for internal usage only

    // 将数组或对象elems的元素/属性，转化成新的数组

    map: function( elems, callback, arg ) {

       var value, key, ret = [],

           i = 0,

           length = elems.length,

           // jquery objects are treated as arrays

           // 检测elems是否是（伪）数组

           // 1. 将jQuery对象也当成数组处理

           // 2. 检测length属性是否存在，length等于0，或第一个和最后一个元素是否存在，或jQuery.isArray返回true

           isArray = elems instanceof jQuery

              || length !== undefined && typeof length === "number"

                  && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

      

       // 是数组或对象的差别，仅仅是遍历的方式不同，没有其他的区别

      

       // Go through the array, translating each of the items to their

       // 遍历数组，对每一个元素调用callback，将返回值不为null的值，存入ret

       if ( isArray ) {

           for ( ; i < length; i++ ) {

              // 执行callback，参数依次为value, index, arg

              value = callback( elems[ i ], i, arg );

              // 如果返回null，则忽略（无返回值的function会返回undefined）

              if ( value != null ) {

                  ret[ ret.length ] = value;

              }

           }

   

       // Go through every key on the object,

       // 遍历对象，对每一个属性调用callback，将返回值不为null的值，存入ret

       } else {

           for ( key in elems ) {

              // 执行callback，参数依次为value, key, arg

              value = callback( elems[ key ], key, arg );

              // 同上

              if ( value != null ) {

                  ret[ ret.length ] = value;

              }

           }

       }

   

       // Flatten any nested arrays

       // 使嵌套数组变平

       // concat：

       // 如果某一项为数组，那么添加其内容到末尾。

       // 如果该项目不是数组，就将其作为单个的数组元素添加到数组的末尾。

       return ret.concat.apply( [], ret );

    },

   

    // A global GUID counter for objects

    guid: 1,

   

    // Bind a function to a context, optionally partially applying any

    // arguments.

    // 代理方法：为fn指定上下文（即this）

    // jQuery.proxy( function, context )

    // jQuery.proxy( context, name )

    proxy: function( fn, context ) {

       // 如果context是字符串，设置上下文为fn，fn为fn[ context ]

       // 即设置fn的context方法的上下文为fn（默认不是这样吗？？？TODO）

       if ( typeof context === "string" ) {

           var tmp = fn[ context ];

           context = fn;

           fn = tmp;

       }

   

       // Quick check to determine if target is callable, in the spec

       // this throws a TypeError, but we will just return undefined.

       // 快速测试fn是否是可调用的（即函数），在文档说明中，会抛出一个TypeError，

       // 但是这里仅返回undefined

       if ( !jQuery.isFunction( fn ) ) {

           return undefined;

       }

   

       // Simulated bind

       var args = slice.call( arguments, 2 ), // 从参数列表中去掉fn,context

           proxy = function() {

              // 设置上下文为context和参数

              return fn.apply( context, args.concat( slice.call( arguments ) ) );

           };

   

       // Set the guid of unique handler to the same of original handler, so it can be removed

       // 统一guid，使得proxy能够被移除

       proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

   

       return proxy;

    },

   

    // Mutifunctional method to get and set values to a collection

    // The value/s can be optionally by executed if its a function

    // 多功能函数，读取或设置集合的属性值；值为函数时会被执行

    // fn：jQuery.fn.css, jQuery.fn.attr, jQuery.fn.prop

    access: function( elems, key, value, exec, fn, pass ) {

       var length = elems.length;

   

       // Setting many attributes

       // 如果有多个属性，则迭代

       if ( typeof key === "object" ) {

           for ( var k in key ) {

              jQuery.access( elems, k, key[k], exec, fn, value );

           }

           return elems;

       }

   

       // Setting one attribute

       // 只设置一个属性

       if ( value !== undefined ) {

           // Optionally, function values get executed if exec is true

           exec = !pass && exec && jQuery.isFunction(value);

   

           for ( var i = 0; i < length; i++ ) {

              fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );

           }

   

           return elems;

       }

   

       // Getting an attribute

       // 读取属性

       return length ? fn( elems[0], key ) : undefined;

    },

    // 获取当前时间的便捷函数

    now: function() {

       return (new Date()).getTime();

    },

   

    // Use of jQuery.browser is frowned upon.

    // More details: http://docs.jquery.com/Utilities/jQuery.browser

    // 不赞成使用jQuery.browser，推荐使用jQuery.support

    // Navigator 正在使用的浏览器的信息

    // Navigator.userAgent 一个只读的字符串，声明了浏览器用于HTPP请求的用户代理头的值

    uaMatch: function( ua ) {

       ua = ua.toLowerCase();

       // 依次匹配各浏览器

       var match = rwebkit.exec( ua ) ||

           ropera.exec( ua ) ||

           rmsie.exec( ua ) ||

           ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||

           [];

       // match[1] || ""

       // match[1]为false（空字符串、null、undefined、0等）时，默认为""

       // match[2] || "0"

       // match[2]为false（空字符串、null、undefined、0等）时，默认为"0"

       return { browser: match[1] || "", version: match[2] || "0" };

    },

    // 创建一个新的jQuery副本，副本的属性和方法可以被改变，但是不会影响原始的jQuery对象

    // 有两种用法：

    // 1. 覆盖jQuery的方法，而不破坏原始的方法

    // 2.封装，避免命名空间冲突，可以用来开发jQuery插件

    // 值得注意的是，jQuery.sub()函数并不提供真正的隔离，所有的属性、方法依然指向原始的jQuery

    // 如果使用这个方法来开发插件，建议优先考虑jQuery UI widget工程

    sub: function() {

       function jQuerySub( selector, context ) {

           return new jQuerySub.fn.init( selector, context );

       }

       jQuery.extend( true, jQuerySub, this ); // 深度拷贝，将jQuery的所有属性和方法拷贝到jQuerySub

       jQuerySub.superclass = this;

       jQuerySub.fn = jQuerySub.prototype = this(); //

       jQuerySub.fn.constructor = jQuerySub;

       jQuerySub.sub = this.sub;

       jQuerySub.fn.init = function init( selector, context ) {

           if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {

              context = jQuerySub( context );

           }

   

           return jQuery.fn.init.call( this, selector, context, rootjQuerySub );

       };

       jQuerySub.fn.init.prototype = jQuerySub.fn;

       var rootjQuerySub = jQuerySub(document);

       return jQuerySub;

    },

    // 浏览器类型和版本：

    // $.browser.msie/mozilla/webkit/opera

    // $.browser.version

    // 不推荐嗅探浏览器类型jQuery.browser，而是检查浏览器的功能特性jQuery.support

    // 未来jQuery.browser可能会移到一个插件中

    browser: {}

});
```

[来源](http://nuysoft.iteye.com/blog/1183554)