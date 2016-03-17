## 游走笔记

### 子组件调用父组件的某个方法【关键字：`prop`】

```
var
    Child = React.createClass( {
        callFromChild : function() {
            this.props.triggleByChild();
        },
        render : function() {
            return (
                <div onClick={this.callFromChild}>Children：点击我就可以调用子组件的方法</div>
            );
        }
    } ),
    Parent = React.createClass( {
        callFromParent : function() {
            alert( "子组件调用父组件" );
        },
        render : function() {
            return (
                <div>
                    Parent
                    <Child triggleByChild={this.callFromParent} />
                </div>
            )
        }
    } );

ReactDOM.render(
    <Parent />,
    document.body
);
```

### 父组件调用子组件的某个方法【关键字：`ref`】

```
var
    Child = React.createClass( {
        callFromParent : function() {
            alert( "父组件调用子组件" );
        },
        render : function() {
            return (
                <div>Children</div>
            );
        }
    } ),
    Parent = React.createClass( {
        callFromChild : function() {
            this.refs.babyChildren.callFromParent();
        },
        render : function() {
            return (
                <div>
                    Parent
                    <a onClick={this.callFromChild}>Parent：点击我就可以调用子组件的方法</a>
                    <Child ref="babyChildren" />
                </div>
            )
        }
    } );

ReactDOM.render(
    <Parent />,
    document.body
);
```

### 异步操作 `component` 时，要配合 `this.isMounted()` （检测组件的状态是否还是 mounted ）使用，不然 `component` 已移除，但回调还执行，有可能会引起错误

[通过 AJAX 加载初始数据](http://www.reactjs.cn/react/tips/initial-ajax.html)

### React 的继承方式——“混合”（只能一个`React.createClass()`对象混合多个“普通对象”）【关键字：`mixins`】

正确事例：

```
var
    Cls01 = {
        componentWillMount : function() {
            console.log( "componentWillMount from Cls01" );
        }
        , handClick : function() {
            console.log( "handClick from Cls01" );
        }
    };

var
    Cls02 = React.createClass( {
        mixins      : [ Cls01 ]
        , render    : function() {
            return <div onClick={this.handClick}>点我啊</div>
        }
    } );

ReactDOM.render(
    <Cls02 />,
    document.body
);
```

错误事例（节点重复）：

```
var
    Cls01 = {
        componentWillMount : function() {
            console.log( "componentWillMount from Cls01" );
        }
        , handClick : function() {
            console.log( "handClick from Cls01" );
        }
    };

var
    Cls02 = React.createClass( {
        mixins      : [ Cls01 ]
        , handClick : function() { // 引起错误的原因：重复的节点
            console.log( "handClick from Cls02" );
        }
        , render    : function() {
            return <div onClick={this.handClick}>点我啊</div>
        }
    } );

ReactDOM.render(
    <Cls02 />,
    document.body
);
```

错误事例（两个 `React Class` 混合）：

```
var
    Cls01 = React.createClass( { // 引起错误的原因：Cls01 为 React Class
        componentWillMount : function() {
            console.log( "componentWillMount from Cls01" );
        }
        , handClick : function() {
            console.log( "handClick from Cls01" );
        }
    } );

var
    Cls02 = React.createClass( {
        mixins      : [ Cls01 ]
        , handClick : function() { // 引起错误的原因：重复的节点
            console.log( "handClick from Cls02" );
        }
        , render    : function() {
            return <div onClick={this.handClick}>点我啊</div>
        }
    } );

ReactDOM.render(
    <Cls02 />,
    document.body
);
```

### 父组件的 `event` 事件直接挂载到子组件引用的地方，会无效（自定义的虚拟元素仅能起到 namespace 挂载的作用）

只有孙组件能 log 出来

```
var
    SunCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from SunCls" );
        }
        , render : function() {
            return (
                <div onClick={this.handClick}>孙组件，点击我！</div>
            );
        }
    } ),
    ChildCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from ChildCls" );
        }
        , render : function() {
            return (
                <SunCls onClick={this.handClick} />
            );
        }
    } ),
    ParentCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from ParentCls" );
        }
        , render : function() {
            return (
                <ChildCls onClick={this.handClick} />
            );
        }
    } );

ReactDOM.render(
    <ParentCls />,
    document.body
);
```

孙组件、子组件、父组件都能 log 出来（顺序：孙 -> 子 -> 父）

```
var
    SunCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from SunCls" );
        }
        , render : function() {
            return (
                <div onClick={this.handClick}>孙组件，点击我！</div>
            );
        }
    } ),
    ChildCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from ChildCls" );
        }
        , render : function() {
            return (
                <div onClick={this.handClick}>
                    <SunCls />
                </div>
            );
        }
    } ),
    ParentCls = React.createClass( {
        handClick : function() {
            console.log( "handClick from ParentCls" );
        }
        , render : function() {
            return (
                <div onClick={this.handClick}>
                    <ChildCls />
                </div>
            );
        }
    } );

ReactDOM.render(
    <ParentCls />,
    document.body
);
```

### 单例的实现方式【关键：保存好 `this`】

```
var
    Child = React.createClass( {
        handleClick : function() {
            this.props.appdata.app.setState( { name : Math.random() + " from Child" } );
        }
        , render : function() {
            return (
                <div>
                    Sun: {this.props.appdata.name}
                    <br />
                    <button onClick={this.handleClick}>Click me!</button>
                </div>
            );
        }
    } ),
    Parent = React.createClass( {
        handleClick : function() {
            this.props.appdata.app.setState( { name : Math.random() + " from Parent" } );
        }
        , render : function() {
            return (
                <div>
                    Parent: {this.props.appdata.name}
                    <br />
                    <button onClick={this.handleClick}>Click me!</button>
                    <Child appdata={this.props.appdata} />
                </div>
            );
        }
    } ),
    App = React.createClass( {
        getInitialState : function() {
            return {
                app     : this // 保存好顶级组件的引用
                , name  : ""
            };
        }
        , handleClick : function() {
            this.setState( { name : Math.random() + " from App" } );
        }
        , render : function() {
            return (
                <div>
                    App: {this.state.name}
                    <br />
                    <button onClick={this.handleClick}>Click me!</button>
                    <Parent appdata={this.state} />
                </div>
            );
        }
    } );

ReactDOM.render( <App />, document.body );
```

## 文章收集

[React.js最佳实践](http://dmyz.org/archives/690)

[React.js 2016 最佳实践](http://www.tuicool.com/articles/jiQnuqj)

[React 中文索引](http://nav.react-china.org/)
