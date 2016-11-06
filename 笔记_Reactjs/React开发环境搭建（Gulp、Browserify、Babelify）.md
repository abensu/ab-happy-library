## React开发环境搭建（Gulp、Browserify、Babelify）

### 目录结构

```
project
    |
    |- subProject
    |   |
    |   |- bin
    |   |   |
    |   |   |- gulpfile.bat 【执行指向 gulpfile.js 的 gulp 命令】
    |   |   `- gulpfile.js  【gulp 的配置】
    |   |
    |   |- com
    |   |   |
    |   |   |- app.jsx          【app 的主入口，使用 es6 语法】
    |   |   `- mod_speaker.jsx  【随便写的模块，使用 es6 语法】
    |   |
    |   |- dist
    |   |   |
    |   |   |- app.js       【会自动生成】
    |   |   `- app.min.js   【会自动生成】
    |   |
    |   `- index.html
    |
    `- node_modules【下面的文件夹均是安装生成】
        |
        |- .bin
        |- babel-preset-es2015  【必须，es6 编译规则】
        |- babel-preset-react   【必须，react 编译规则】
        |- babel-preset-stage-2 【必须，es6 新属性编译规则】
        |- babelify             【必须，编译 jsx 文件所需】
        |- browserify           【必须，解决前端 require 依赖问题，会将所有 require 到的文件合并到一起】
        |- gulp                 【必须，流程执行】
        |- gulp-rename          【可选，文件重命名】
        |- gulp-replace         【可选，文件中对应字段的替换】
        |- gulp-rev-append      【可选，替换文件中 ?rev=xxx 字段，xxx 为文件 hash 值，资源路径字段要使用相对路径】
        |- gulp-yuicompressor   【可选，代码压缩，用 gulp-uglify 会压缩过度导致代码出错，所以用这个】
        `- vinyl-source-stream  【必须，将 browserify 流变为 gulp 流】
```

### 文件说明

#### `project/subProject/bin/gulpfile.js` 基础版

```
var gulp        = require( '../../node_modules/gulp' );
var browserify  = require( '../../node_modules/browserify' );
var babelify    = require( '../../node_modules/babelify' );
var source      = require( '../../node_modules/vinyl-source-stream' );

gulp.task( 'react', function() {

    // 通过 browserify 管理依赖
    return browserify( '../com/app.jsx' )
        // babel 预处理文件
        .transform( babelify, { presets: [ 'es2015', 'react', 'stage-2' ] } )
        // 转换为 gulp 能识别的流
        .bundle()
        // 合并输出为 app.js
        .pipe( source( '../dist/app.js' ) )
        // 将未压缩版放在 dist 目录
        .pipe( gulp.dest( './' ) )
        ;
} );

// 任务执行的主入口
gulp.task( 'default', [ 'react' ] );
```

#### `project/subProject/bin/gulpfile.js` 升级版【附加可序列化执行、代码压缩并生成 .min.js 文件、自动执行更新、更新 index.html 对应位置的时间戳等功能】

```
var gulp            = require( '../../node_modules/gulp' );
var browserify      = require( '../../node_modules/browserify' );
var babelify        = require( '../../node_modules/babelify' );
var source          = require( '../../node_modules/vinyl-source-stream' );
var rename          = require( '../../node_modules/gulp-rename' );
var yuicompress     = require( '../../node_modules/gulp-yuicompressor' );
var replace         = require( '../../node_modules/gulp-replace' );
var rev             = require( '../../node_modules/gulp-rev-append' );

// jsx 文件转为 js
function task_jsx2js() {

    return new Promise( function( resolve, rejcet ) {

        browserify( '../com/app.jsx' )
            // babel 预处理文件
            .transform( babelify, { presets: [ 'es2015', 'react', 'stage-2' ] } )
            // 转换为 gulp 能识别的流
            .bundle()
            // 合并输出为 app.js
            .pipe( source( '../dist/app.js' ) )
            // 将未压缩版放在 dist 目录
            .pipe( gulp.dest( './' ) )
            // 执行 Promise.resolve
            .on( 'end', resolve )
            ;
    } );
};

// js 压缩
function task_jsmin() {

    return new Promise( function( resolve, rejcet ) {

        gulp.src( '../dist/app.js' )
            // 新建压缩文件
            .pipe( rename( '../dist/app.min.js' ) )
            // 压缩
            .pipe( yuicompress( { type : 'js' } ) )
            // 输出到 source 所操作的文件夹
            .pipe( gulp.dest( '../dist' ) )
            // 执行 Promise.resolve
            .on( 'end', resolve )
            ;
    } );
};

// 修改 index.html 的时间戳（带 gulpv 字段）
function task_index_mark() {

    return new Promise( function( resolve, rejcet ) {

        // 修改 index.html 的时间戳（带 gulpv 字段）
        return gulp.src( '../index.html' )
            // 修改文件中带 ?rev=xxx 的字段（正则为 (?:href|src)="(.*)[\?]rev=(.*)[\"] ）
            .pipe( rev() )
            .pipe( gulp.dest( '../' ) )
            .on( 'end', resolve )
            ;
    } );
};

// 所有任务开始执行
gulp.task( 'all-task', function() {

    return task_jsx2js()
        .then( task_jsmin )
        .then( task_index_mark )
        .catch( function( err ) { console.log( err ); } )
        ;
} );

// 启动观察者模式（对应的文件有改动就重新编译）
gulp.watch( '../com/*.*', [ 'all-task' ] ).on( 'change', function( evt ) {

    console.log( 'File ' + evt.path + ' was ' + evt.type + ', running tasks...' );
} );

// 任务执行的主入口
gulp.task( 'default', [ 'all-task' ] );
```

#### `project/subProject/bin/gulpfile.bat` 省去每次启动 gulp 命令的麻烦

```
..\..\node_modules\.bin\gulp --gulpfile gulpfile.js

pause()
```

#### `project/subProject/com/app.jsx`

```
var Speacker = require( './mod_speaker.jsx' );

class App extends React.Component {

    constructor( props ) {

        super( props );
    }

    render() {
        return(
            <div>
                <h1>Hello, world!</h1>
                <Speacker />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById( 'app' )
);
```

#### `project/subProject/com/mod_speaker.jsx`

```
class Speacker extends React.Component {

    constructor( props ) {

        super( props );
    }

    render() {

        return(
            <div>Speack ha ha ~~</div>
        );
    }
}

module.exports = Speacker;
```

#### `project/subProject/index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>react</title>
    <meta name="viewport" content="width=device-width,user-scalable=no">
</head>
<body>
    <div id="app"></div>

    <script src="//cdn.bootcss.com/react/15.3.2/react.min.js"></script>
    <script src="//cdn.bootcss.com/react/15.3.2/react-dom.min.js"></script>
    <script src="dist/app.js?rev=@@hash"></script><!-- 路径要用相对路径，"?rev=@@hash" 也可是 "?rev=1" 等形式的值 -->
</body>
</html>
````

### 其他说明

* 启动 gulpfile.bat 有点慢（20s 以内），之后每次修改完模块文件都能很快编译

* `gulp` 的 `task` 列表执行是同步执行，而不是按顺序执行，若要按顺序执行 `task`，需引入 `gulp-sequence` 插件

```
gulp.task( 'default', [ 'react', 'index-mark' ], callback );
```

`react` 的 `task`、`index-mark` 的 `task` 和 `callback` 是同步执行的，要使用 `Promise` 方式去实现串联化执行

实践中发现，使用 `gulp-sequence` 来实现串联化，搭配 `gulp.watch`，目标文件修改后，会报 `thunderFunction is filled` 错误

串联化 `task` 会在 `gulp 4.0` 版得到实现，但现在还在 alpha 中。。。
