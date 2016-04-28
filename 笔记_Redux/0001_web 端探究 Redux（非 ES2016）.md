# web 端探究 Redux（非 ES2016）

版本：3.5.2

环境：浏览器

来源：[https://npmcdn.com/redux@3.5.2/dist/redux.min.js](https://npmcdn.com/redux@3.5.2/dist/redux.min.js)

源码：[https://npmcdn.com/redux@3.5.2/dist/redux.js](https://npmcdn.com/redux@3.5.2/dist/redux.js)

## Redux 的 api

```
Redux
    |
    |- @prop {boolean}  __esModule
    |                   说明：用于 babel （预）处理时，import 的正确使用
    |                   参考：http://cnodejs.org/topic/565c65c4b31692e827fdd00c
    |
	|- @prop {function} applyMiddleware
    |                   范式：( ...middleware )
    |                   说明：中间件，处于 action 与 store 之间
    |                   参考：http://www.tuicool.com/articles/VNnUfuZ
    |
    |- @prop {function} bindActionCreators
    |                   范式：( actionCreators, dispatch )
    |                   说明：action 和 dispatch 的映射表
    |                   参考：http://www.tuicool.com/articles/bMzeEzF
    |
	|- @prop {function} combineReducers
    |                   范式：( reducers )
    |                   说明：将多个 reducer 合并成一个 reducer
    |                   参考：http://www.open-open.com/lib/view/open1451735705370.html
    |
	|- @prop {function} compose
    |                   范式：( ...chinFn, dispatch )
    |                   说明：dispatch 的链式调用
    |                   参考：源码 123 行
    |
	`- @prop {function} createStore
                        范式：( reducer, initialState, enhancer )
                        说明：生成一个用于控制 state 树的 Redux store
                        参考：源码 204 行
```

## Redux 中的 Reducer、Store 和 Action

流程图：

![Redux流程简图](http://p6.qhimg.com/d/inn/9a312dcc/reduxFlow.png)

web 端官方事例：

[官方事例](0001_0001.html)

### Reducer

> `state` 生成器

建议：
1. 一个组件使用一个 `Reducer`

特征：
1. `Reducer` 必须含有两个参数，第一个是 `state`，第二个为 `action`
1. `Reducer` 会根据 `action` 的 `type` 来对旧的 `state` 进行操作，返回新的 `state`

```
/**
 * 计算
 *
 * @param {*} state         : [ undefined ] 上一次的 state，第一次的 state 为 initialState
 * @param {object} action   : [] dispatch 传入的 action，如 { type : "UP" }
 *
 * @return {*}              : [] 新的 state
 */

function counter( state, action ) {

    if (typeof state === 'undefined') {

        return 0;
    }

    switch ( action.type ) {

        case 'INCREMENT':
            return state + 1;

        case 'DECREMENT':
            return state - 1;

        default:
            return state;
    }
};
```

注意：
1. 不要修改 `state`，而是每次返回新 `state`
1. 在 `default` 情况下返回旧的 `state`。遇到未知的 `action` 时，一定要返回旧的 `state`
1. 如果没有旧的 `State`，就返回一个 `initialState`，这很重要！！！

### Store

> `Reducer` 控制器

建议：
1. 一个应用只有一个 `Store`，一个 `Store` 可以含有多个 `Reducer`

```
var store = Redux.createStore( counter );
```

`Store` 的结构

```
Store
    |- @prop {function} getState
    |       范式：()
    |       说明：获取应用当前 State
    |       参考：源码 237 行
    |
    |- @prop {function} subscribe
    |       范式：( listener )
    |       说明：添加一个变化监听器
    |       参考：源码 246 行
    |
    |- @prop {function} dispatch
    |       范式：( action )
    |       说明：分发 Action，修改 State
    |       参考：源码 292 行
    |
    `- @prop {function} replaceReducer
            范式：( nextReducer )
            说明：替换 Store 当前用来处理 state 的 reducer
            参考：源码 345 行

```

职责：
1. 维持应用的 `state`
1. 提供 `getState()` 方法获取 `state`
1. 提供 `dispatch(action)` 方法更新 `state`
1. 通过 `subscribe( listener )` 注册监听器

### Action

> 命令信息（必须带 `type` 字段）

```
store.dispatch( { type: 'INCREMENT' } );
```

特征：
1. `Action` 是一个普通对象，如这里的 `{ type: 'INCREMENT' }`
1. Redux 要求 `Action` 内使用 `type` 字段来表示将要执行的动作

注意：
1. `Reducer.createStore` 时，会调用一次初始化 `action`（即 `{ type : "@@redux/INIT" }`），自己的应用最好不要有与此同名的 `action`

衍生：
1. actionCreator（action 生成器），方便修改 `Action` 和防止多次手写 `Action` 出错

```
function increment() {
    return { type : 'INCREMENT' };
};
...
store.dispatch( increment() );
```

## Redux 中的 applyMiddleware、bindActionCreators、combineReducers、compose 和 createStore

### applyMiddleware( ...middleware )( createStore )

> 带指定中间件的 `createStore`

```
/**
 * 创建带中间件的 store
 */

// 中间件：logger
function logger( store ) {

    return function( next ) {

        return function( action ) {

            console.log( 'logger', 'action', action );

            var result = next( action ); // 这里会调用 crashReporter 函数 -> store 的 state 值更新完毕 -> 下面的才会调用

            console.log( 'logger', 'next state', store.getState() );

            return result;
        };
    };
};

// 中间件：crashReporter
function crashReporter( store ) {

    return function( next ) {

        return function( action ) {

            console.log( 'crashReporter', 'all', store, next, action );

            return next( action );
        };
    };
};

// reducer
function reducer( state, action ) {

    console.log( "reducer", "state", state );

    switch ( action.type ) {

        case "UP" :
            return state + 1;

        default :
            return state || 0;
    }
};

var
    createStoreWithMiddleware   = Redux.applyMiddleware( logger, crashReporter )( Redux.createStore );
    store                       = createStoreWithMiddleware( reducer );

store.dispatch( { type : "UP" } );
// 输出：
// reducer state undefined
// logger action Object { type="UP" }
// crashReporter all Object { getState=i(),  dispatch=function()} s(t) Object { type="UP" }
// reducer state 0
// logger next state 1
```

### bindActionCreators( actions, dispatch )

> `action - dispatch` 映射表生成器

```
// reducer
function reducer( state, action ) {

    console.log( action );

    switch ( action.type ) {

        case "UP" :
            return state + 1;

        case "DOWN" :
            return state - 1;

        default :
            return state || 0;
    }
};

var store = Redux.createStore( reducer );

var storeActions = Redux.bindActionCreators( {
    up : function() {
        return { type : 'UP' };
    },
    down : function() {
        return { type : 'DOWN' };
    },
    none : function() {
        return { type : 'NONE' };
    }
}, store.dispatch );

storeActions.up();    // 即 store.dispatch( { type : 'UP' } )
storeActions.down();  // 即 store.dispatch( { type : 'DOWN' } )
storeActions.none();  // 即 store.dispatch( { type : 'NONE' } )
```

### compose( ...fn_with_action_param, dispatch )

> 组合多个函数，返回新的 `dispath`（链式调用）

注意：
1. 记得是从右到左调用哟，最右边必须是一个 `dispatch`，其他的函数均要返回自己的第一个参数作为后续函数的参数
1. 下面的例子可以简单等价于：`fn_1( fn_2( fn_3( store.dispatch( { type : "UP" } ) ) ) )`

```
// 函数 1
function fn_1( action ) {

    console.log( "fn_1", action );

    return action; // 下一个函数的参数数据
};

// 函数 2
function fn_2( action ) {

    console.log( "fn_2", action );

    return action; // 下一个函数的参数数据
};

// 函数 3
function fn_3( action ) {

    console.log( "fn_3", action );

    return action; // 下一个函数的参数数据
};

// reducer
function reducer( state, action ) {

    console.log( "reducer", action );

    switch ( action.type ) {

        case "UP" :
            return state + 1;

        case "DOWN" :
            return state - 1;

        default :
            return state || 0;
    }
};

var store = Redux.createStore( reducer );

var newDispatch = Redux.compose( fn_1, fn_2, fn_3, store.dispatch );

newDispatch( { type : "UP" } );
// 输出：
// reducer Object { type="UP"}
// fn_3 Object { type="UP"}
// fn_2 Object { type="UP"}
// fn_1 Object { type="UP"}
```

### combineReducers( reducers )

> 合并多个 `reducer` 为一个 `reducer`

```
function yearReducer( state, action ) {

    switch ( action.type ) {

        case 'YEAR_UP' :
            return state + 1;

        case 'YEAR_DOWN' :
            return state - 1;

        default :
            return state || ( new Date ).getFullYear();
    }
};

function monthReducer( state, action ) {

    switch ( action.type ) {

        case 'MONTH_UP' :
            return state + 1;

        case 'MONTH_DOWN' :
            return state - 1;

        default :
            return state || ( new Date ).getMonth();
    }
};

var
    rootReducer = Redux.combineReducers( { year : yearReducer, month : monthReducer } ),
    store       = Redux.createStore( rootReducer );

console.log( store.getState() );
// 返回 { year : 2016, month : 3 }

store.dispatch( { type : 'YEAR_DOWN' } );
store.dispatch( { type : 'MONTH_UP' } );

console.log( store.getState() );
// 返回 { year : 2015, month : 4 }
```

在 `combineReducers` 后：
1. `state` 是独立的，每个 `reducer` 对应自己的一个 `state`，`reducer` 之间互不影响（仅该事例）
2. `action` 是公用的，所以 `switch` 中的 `default` 必须写上，且返回默认的 `state`（不能是 undefined！）

### createStore( reducer, initialState, enhancer )

> 生成一个 `Store`（相关请看上面的 `Store` 部分，下面为更详细的使用说明）

翻译源码注释：

```
创建一个 Reducer store，用于控制 state 树。
唯一能改变 store 中的数据的方式是 `dispatch()`。

在你的应用中，必须仅有一个 store。为了指定不同部分的 state 树来响应 action，你也许需要使用 `combineReducers` 去合并多个 reducer 为一个 reducer。

参数说明：
    reducer
        函数类型。这是一个能够返回下一个 state 树的函数，接受两个参数，第一个是当前的 state 树，第二个是 action。

    initialState
        【可选参数】任意类型。初始的 state。用于融合服务端的通用应用和 state，或恢复上一次序列化的用户会话。
        如果你使用了 `combineReducers` 生成了一个根 reducer 函数，该参数必须为对象，且结构必须和所生成的根 reducer 一致（key 都要有）。

    enhancer
        【可选参数】函数类型。store 增强器。使用第三方功能（如中间件、时间穿梭、持久化等等）去增强 store。store 增强器只能是 `applyMiddleware()`。

返回值说明：
    返回一个 Redux store，其可让你读取 state，分发 action 和促发改变后的回调事件
```

#### createStore( reducer, initialState ) 范例

```
// reducer
function reducer( state, action ) {

    console.log( "reducer", state );

    switch ( action.type ) {

        case "UP" :
            return state + 1;

        case "DOWN" :
            return state - 1;

        default :
            return state || 0;
    }
};

var store = Redux.createStore( reducer, 5 );
// 输出：
// reducer 5
```

如果无 `initialState`，会输出 `undefined`

#### createStore( reducer, initialState, enhancer ) 范例

```
// 中间件1
function middleware_1( store ) {

    return function( next ) {

        return function( action ) {

            console.log( 'middleware_1' );

            return next( action );
        };
    };
};

// 中间件2
function middleware_2( store ) {

    return function( next ) {

        return function( action ) {

            console.log( 'middleware_2' );

            return next( action );
        };
    };
};

// reducer
function reducer( state, action ) {

    console.log( "reducer", state );

    switch ( action.type ) {

        case "UP" :
            return state + 1;

        case "DOWN" :
            return state - 1;

        default :
            return state;
    }
};

var store = Redux.createStore( reducer, 5, Redux.applyMiddleware( middleware_1, middleware_2 ) );

store.dispatch( { type : "UP" } );
// 输出：
// middleware_1
// middleware_2
// reducer 5
```

## 参考

* [深入浅出 - Redux - w3ctech - 中国最大的前端技术社区](http://www.w3ctech.com/topic/1561)
* [Redux 核心概念 - 简书](http://www.jianshu.com/p/3334467e4b32)
* [解读redux工作原理 - 推酷](http://www.tuicool.com/articles/ZZVJR3)
