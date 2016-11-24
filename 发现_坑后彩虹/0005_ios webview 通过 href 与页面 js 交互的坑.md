# ios webview 通过 href 与页面 js 交互的坑

## 场景

* 同步调用接口，只有最后一个有回调

* 回调有 `alert`，会导致 `webview` 卡住然后崩溃

## 过程

`webview` 有两个通讯接口 `methodA` `methodB`，私有协议为 `MyApp`，两个接口对应的全局回调为 `methodACallback` `methodBCallback`

两个方法的封装：

```
function MyMethodA( callback ) {

    window.methodACallback = callback;

    location.href = 'MyApp://methodA';
};

function MyMethodB( callback ) {

    window.methodBCallback = callback;

    location.href = 'MyApp://methodB';
};
```

如果像以下方法调用，只会促发一次，同时也存在崩溃的风险（`alert` 引起）：

```
MyMethodA( function() {

    alert( 1 );
} );

MyMethodB( function() {

    alert( 2 );
} );
```


## 解决

```
function MyMethodA( callback ) {

    window.methodACallback = function() {

        var d_args = arguments;

        // 防止 alert 引起的崩溃
        setTimeout( function() {

            callback.apply( null, d_args );

        }, 100 );
    };

    location.href = 'MyApp://methodA';
};

function MyMethodB( callback ) {

    // 和 MyMethodA 写法一致
    ...
};

...

// 下面两个 setTimeout 的延迟时间不能一样，不然 MyMethodB 会阻塞 MyMethodA

setTimeout( function() {

    MyMethodA( function() {

        alert( 1 );
    } );

}, 50 );

setTimeout( function() {

    MyMethodB( function() {

        alert( 2 );
    } );

}, 100 );
```
