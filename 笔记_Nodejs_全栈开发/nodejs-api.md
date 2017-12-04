# nodejs api

## `fs`

文件 IO 操作是由标准的 POSIX 方法提供的简单封装。使用该模块需要 `require('fs')`。大部分的方法均有异步和同步的形式。

异步的形式，一般提供回调函数作为最后一个参数。完成后的状态会依赖于这个方法作为参数传入到回调函数中，但第一个参数一般保留为异常。如果（文件）操作顺利完成，第一个参数将会是 `null` 或者 `undefined`。

当使用同步形式，错误会立刻抛出。你可以使用 `try/catch` 去控制错误，或允许错误冒泡。

异步版本的例子：

```
const fs = require('fs');

fs.unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

同步版本的例子：

```
const fs = require('fs');

fs.unlinkSync('/tmp/hello');
console.log('successfully deleted /tmp/hello');
```

使用异步方法不能保证按顺序执行。所以下面容易出错：

```
fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```

这需要在 `fs.rename` 之前调用 `fs.stat`。正确的方式是串联这些回调。

```
fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  fs.stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

在繁忙的进程中，十分鼓励程序员使用异步版本。同步版本将阻塞整个进程，直到它们完成——停止所有连接为止。

相对路径的文件名可以被使用。但记住，无论怎样，这个路径是相对于 `process.cwd()`。

大多数 `fs` 方法可以省略回调参数。如果你这么做，默认的回调是用于重新抛出错误。为了得到报错地方的来源信息，可以设置 `NODE_DEBUG` 环境变量：

```
$ cat script.js
function bad() {
  require('fs').readFile('/');
}
bad();

$ env NODE_DEBUG=fs node script.js
fs.js:88
        throw backtrace;
        ^
Error: EISDIR: illegal operation on a directory, read
    <stack trace.>
```

> 更多请查看 [《fs|Node.js API 文档》](http://nodejs.cn/api/fs.html#fs_threadpool_usage)。

### `fs.writeFile` 与 `fs.createWriteStream` 简例

保存二进制文件，`encoding` 记得要设为 `binary`，因为其默认是 `utf8`。

```
// 将网络上某视频保存到本地（fs.writeFile）
http.get( 'http://a.com/video.mp4', ( res ) => {

    let d_rawData = '';

    res.setEncoding( 'binary' ); // 这里的 encoding 要注意

    res.on( 'data', ( chunk  ) => {
        d_rawData += chunk;
    } );

    res.on( 'end', () => {

        mod_fs.writeFile( `${+new Date}.mp4`, d_rawData, { encoding : 'binary' } ); // 这里的 encoding 要注意
    } );
} )

// 或者：

// 将网络上某视频保存到本地（fs.createWriteStream）
http.get( 'http://a.com/video.mp4', ( res ) => {

    let d_w_stream = mod_fs.createWriteStream( `${+new Date}.mp4`, { encoding : 'binary' } ); // 这里的 encoding 要注意

    res.setEncoding( 'binary' ); // 这里的 encoding 要注意

    res.pipe( d_w_stream );
} )
```

补充：

* 同步写入会比异步写入要慢，而且会阻塞当前线程。

### `fs.watch`

* 新建文件仅促发 1 次 `change` 事件，回调参数 `eventType` 为 `rename`。

* 按 `Ctrl + S` 或保存，会促发 1 次 `change` 事件，如果文件内容有改动，会额外促发 1 次 `change` 事件，所以每次保存文件会促发 1 ~ 2 次 `change` 事件，回调参数 `eventType` 均为 `change`。

* 删除文件仅促发 1 次 `change` 事件，回调参数 `eventType` 为 `rename`。

* 使用 `change` 去调用其他函数，要注意频率带来的问题，如果不做限制，有可能会导致线程阻塞而报错！

* `fs.watchFile()` 是基于 `stat` 的轮询，虽然兼容性更好（非虚拟化软件系统，建议还是用 `fs.watch`），但会更慢，而且可靠性也更低。

