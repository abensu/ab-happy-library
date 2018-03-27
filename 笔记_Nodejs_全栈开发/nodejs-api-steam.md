# nodejs api

## `steam` 模块

### `highWaterMark` 的设置

#### 写文件

```
const fs = require( 'fs' );

let ws = fs.createWriteStream( 'write.txt', {
    highWaterMark   : 3,
    encoding        : 'utf8'
} );

let index = 9;

function write () {

    let flag = true;

    while ( flag && index > 0 ) {

        console.log( index ); // 看输出的内容

        flag = ws.write( index-- + '' );
    }

    if ( index == 0 ) {

        ws.end( '0', function () {

            console.log( 'finished' );
        } );
    }
}

write();

ws.on( 'drain', function () {

    write();

    console.log( 'drain' );
} );

ws.on( 'error', function ( err ) {

    console.log( err );
} );

ws.on( 'finish', function () {

    console.log( 'finish' );
} );

ws.on( 'close', function () {

    console.log( 'close' );
} );
```

执行后输出：

```
9
8
7
6
5
4
drain
3
2
1
drain
finish
finished
close
```

> 写的第一次，会分配 2 倍的 highWaterMark 字节数空间，之后每次会按对应的 highWaterMark 大小写入

#### 读文件

```
const fs = require( 'fs' );

let rs = fs.createReadStream( 'write.txt', {
    highWaterMark   : 3,
    encoding        : 'utf8'
} );

rs.on( 'data', function ( chunk ) {

    console.log( chunk );
} );
```

执行后输出：

```
987
654
321
0
```

> 每次读取都会按 highWaterMark 的字节数进行

## 参考文档：

* [nodejs学习备忘录系列之Stream(一)](https://zhuanlan.zhihu.com/p/33488104?hmsr=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)