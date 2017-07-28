# 手机网页复制文本功能（execCommand大法）

## 场景

需要找个能在手机页面上实现复制的方法，但不能借助 Flash 的雄威（不过也借助不了。。。）

## 过程

[第一版](0007_copy-text-for-phone.html)开发后，经真机测试发现（仅在 iphone 6s 的 ios 10），Safari 和微信因安全原因，不允许调用复制功能。。。MGJJ

仅能在 PC 浏览器正常调用（ie8 及以下版本不支持），汗颜。。。

![浏览器支持情况](http://upload-images.jianshu.io/upload_images/1275262-5a589a115f415933.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后某同事说 [cilpboard.js](https://clipboardjs.com/) 声称能兼容，然后在手机上测试了一下 demo，果真可以复制了，Duang！（但 [zeroClipboard.js](http://zeroclipboard.org/) 却不行 /(ㄒoㄒ)/~~）

同时 [cilpboard.js](https://clipboardjs.com/) 支持 umd 模式，强烈赞一个 ~\(≧▽≦)/~

最后封装一下，开发了[第二版](0007_copy-text-for-phone-v2.html)，喜极而泣呀。。。

【通过源码看到，手法上是通过 `document.execCommand` 的方法，但我的第一版不行，后期要解析一下。。。】

## 解决

[第一版](0007_copy-text-for-phone.html)

```
/**
 * 封装好的复制方法
 *
 * @param {string}                          text        需要复制的文字
 * @param {( err_msg?: string ) => void}    callback    回调，如果复制失败，err_msg 为 undefined
 */
function func_copy( text, callback ) {

    var
        d_is_support    = typeof document.execCommand === 'function', // 检测是否支持 execCommand
        d_cb            = typeof callback === 'function' ? callback : function( err_msg ) {};
    
    // 【中断】如果不支持 execCommand，则立刻调用
    if ( !d_is_support ) {

        return d_cb( 'not support execCommand' );
    }

    // 【中断】safari、微信等出于安全原因，屏蔽复制功能
    if ( !document.execCommand( 'copy' ) ) {

        prompt( '复制失败。请手动全选以下内容，并复制', text );

        return d_cb( 'does not support copy, you should manual copy' );
    }

    var n_new_input = document.createElement( 'input' );
    
    document.body.appendChild( n_new_input );

    n_new_input.type = 'text';
    n_new_input.value = '' + text;

    // n_new_input.style.display = 'none'; // bugtip : 设置这个，复制内容会无效
    n_new_input.style.position = 'absolute';
    n_new_input.style.zIndex = '-9999';

    n_new_input.focus(); // 聚焦文本框
    n_new_input.select(); // 全选文本框中的文字

    // 复制选中文字，第一个参数是方法名，第二个是是否展示默认 UI，第三个是可选参数列表，对 Copy 来说后两个都用不到
    var d_is_success = document.execCommand( 'Copy', false, null );

    n_new_input.parentNode.removeChild( n_new_input );

    d_cb( d_is_success ? undefined : 'copy fail' );
};
```

[第二版](0007_copy-text-for-phone-v2.html)，需要引入 [clipboard.js](0007_dist/clipboard.js) 文件，和封装好的 [MyClipboard 对象](0007_dist/MyClipboard.js)

```
// dist/MyClipboard.js
var MyClipboard = {

    /**
     * 具有复制功能的元素的 id
     */
    node_id : 'copy-src',

    /**
     * 初始化（页面加载完调用）
     */
    init : function() {

        var n_self = this;

        var n_copy_src = document.createElement( 'span' );

        n_copy_src.id = n_self.node_id;
        n_copy_src.style.display = 'none';
        n_copy_src.setAttribute( 'data-clipboard-text', '' );

        document.body.appendChild( n_copy_src );

        var clipboard = new Clipboard( '#' + n_self.node_id );

        clipboard.on( 'success', function(e) {
            typeof n_self.success === 'function' && n_self.success( e );
        } );

        clipboard.on( 'error', function(e) {
            typeof n_self.error === 'function' && n_self.error( e );
        } );
    },

    /**
     * 复制成功的回调
     */
    success : function( e ) {},

    /**
     * 复制失败的回调
     */
    error : function(e) {},

    /**
     * 复制文本
     * 
     * @param {string} copy_text 需要复制的文本
     */
    copy : function( copy_text ) {

        var n_copy_src = document.getElementById( this.node_id );

        n_copy_src.setAttribute( 'data-clipboard-text' , copy_text );

        n_copy_src.click();
    }
};

...

// 0007_copy-text-for-phone-v2.html

// 复制初始化（必选）
MyClipboard.init();

// 复制成功的回调（可选）
MyClipboard.success = function( e ) {
    document.querySelector( '.tip' ).textContent = '复制 "' + e.text + '" 成功';
};

// 复制失败的回调（可选）
MyClipboard.error = function( e ) {
    document.querySelector( '.tip' ).textContent = '复制失败';
};

// 测试用例
document.getElementById( 'random-copy' ).addEventListener( 'click', function() {

    var d_random = Math.random(); // 产生随机值

    document.getElementById( 'paste-field' ).value = ''; // 清空黏贴区域

    // 复制文本（必选）
    MyClipboard.copy( d_random );

}, false );
```

## 参考

1. [Javascript中document.execCommand()的用法](http://blog.csdn.net/woshinia/article/details/18664903)

1. [前端复制功能的若干 -- document.execCommand()](http://www.cnblogs.com/xhyu/p/5370111.html)

1. [clipBoardEvent, execCommand等粘贴板相关研究](http://blog.csdn.net/twoByte/article/details/52250205)

1. [怎么在微信浏览器中用js触发copy事件？](https://segmentfault.com/q/1010000006072576)

1. [clipboardjs 官网](https://clipboardjs.com/)

1. [clipboardjs 包地址](https://github.com/zenorocha/clipboard.js/archive/master.zip)
