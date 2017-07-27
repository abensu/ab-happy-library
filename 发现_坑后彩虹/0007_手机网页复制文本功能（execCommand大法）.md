# 手机网页复制文本功能（execCommand大法）

## 场景

需要找个能在手机页面上实现复制的方法，但不能借助 Flash 的雄威（不过也借助不了。。。）

## 过程

但这真机测试发现（仅在 iphone 6s 的 ios 10），Safari 和微信因安全原因，不允许调用复制功能。。。MGJJ

仅能在 PC 浏览器正常调用（ie8 及以下版本不支持），汗颜。。。

![浏览器支持情况](http://upload-images.jianshu.io/upload_images/1275262-5a589a115f415933.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 解决

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

[测试页面](0007_copy-text-for-phone.html)

## 参考

1. [Javascript中document.execCommand()的用法](http://blog.csdn.net/woshinia/article/details/18664903)

1. [前端复制功能的若干 -- document.execCommand()](http://www.cnblogs.com/xhyu/p/5370111.html)

1. [clipBoardEvent, execCommand等粘贴板相关研究](http://blog.csdn.net/twoByte/article/details/52250205)

1. [怎么在微信浏览器中用js触发copy事件？](https://segmentfault.com/q/1010000006072576)
