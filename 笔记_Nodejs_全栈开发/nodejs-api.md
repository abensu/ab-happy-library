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

    res.setEncoding( 'binary' ); // 这里的 encoding 要注意，如果不设置，res 默认数据类型为 Buffer，该例子其实可以不设置

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

### 检测文件类型

`fs.stat`、`fs.lstat`、`fs.fstat` 的回调参数会包含 `fs.Stats` 对象：

```
// 以下数据来自 Windows 平台某文件夹对应的 fs.Stats：
Stats {
  dev: 919206,
  mode: 16822,
  nlink: 1,
  uid: 0,
  gid: 0,
  rdev: 0,
  blksize: undefined,
  ino: 4785074604196865,
  size: 0,
  blocks: undefined,
  atime: 2017-12-01T01:44:15.633Z,
  mtime: 2017-12-01T01:44:15.633Z,
  ctime: 2017-12-01T01:44:15.633Z,
  birthtime: 2017-12-01T01:43:57.139Z }

// Stats 还包含下列方法：
Stats.isFile()
Stats.isDirectory()
Stats.isBlockDevice()
Stats.isCharacterDevice()
Stats.isSymbolicLink() (仅对 fs.lstat() 有效)
Stats.isFIFO()
Stats.isSocket()
```

大概解释一下各个属性：

* `dev`：文件所在的磁盘位置索引（和 `ino` 的含义相似）

* `mode`：文件类型（7 类文件）与权限

    * `4480` 即 `010600`（八进制）或 `0001000110000000`（二进制）对应 `prw-------`

    * `8630` 即 `020666`（八进制）或 `0010000110110110`（二进制）对应 `crw-rw-rw-`

    * `16822` 即 `040666`（八进制）或 `0100000110110110`（二进制）对应 `drwxr-xr-x`【普通文件夹】

    * `25008` 即 `060660`（八进制）或 `0110000110110000`（二进制）对应 `brw-rw----`

    * `33204` 即 `100664`（八进制）或 `1000000110110100`（二进制）对应 `-rw-rw-r--`【不可执行的普通文件】，`33279` 即 `100777`（八进制）或 `1000000111111111`（二进制）对应 `-rwxrwxrwx`【可执行的高权限文件】

    * `41471` 即 `120777`（八进制）或 `1010000111111111`（二进制）对应 `lrwxrwxrwx`【需要调用 `fs.lstat` 才能成功获取】

    * `49536` 即 `140600`（八进制）或 `1100000110000000`（二进制）对应 `srw-------`（该值仅通过推测得来）

    * 以二进制形式分析，该值由 3 部分组成，前 4 位为文件类型，中间 3 位为间隔，后 9 位（共分 3 组）为操作权限：

        1. `ll` 信息的第 1 位是，及 `mode` 信息前 7 位
        
            * `-`：`1000`，文件
            * `d`：`0100`，目录
            * `c`：`0010`，character device
            * `b`：`0110`，block device
            * `l`：`1010`，链接
            * `p`：`0001`，FIFO / named pipe
            * `s`：`1100`（推测得来），socket
        
        1.  `mode` 信息第 8 至第 16 位

            1. 是否可读 for 文件所有者（有：`r`，无：`-`）
            1. 是否可写 for 文件所有者（有：`w`，无：`-`）
            1. 是否可执行 for 文件所有者（有：`x`，无：`-`）
            1. 是否可读 for 文件所有者所在群组（有：`r`，无：`-`）
            1. 是否可写 for 文件所有者所在群组（有：`w`，无：`-`）
            1. 是否可执行 for 文件所有者所在群组（有：`x`，无：`-`）
            1. 是否可读 for 其他用户（有：`r`，无：`-`）
            1. 是否可写 for 其他用户（有：`w`，无：`-`）
            1. 是否可执行 for 其他用户（有：`x`，无：`-`）

* `nlink`：该文件的硬连接数（一般大于等于 1）

* `uid`：用户 ID（0 一般表示为 root 用户）

* `gid`：用户组 ID（0 一般表示为 root 用户所在的组）

* `rdev`：字符设备文件或者块设备文件所在的设备 ID

* `blksize`：一个 block 的大小（在 Linux 称 `“IO Block”`），一般为 1024 字节或 4096 字节（系统分区默认给 1K，非系统分区默认给 4K），企业一般建议使用 4K，该值需要在格式化磁盘的时候设置

* `ino`：索引节点编号（即 `“index node”` Linux 中也称 `“inode”`），即该文件或目录在磁盘里的唯一标识

* `size`：文件的大小，单位为字节（`byte`）

* `blocks`：该文件需要多少个 block，取值为 8 的倍数，因其以八进制运算，所以

  * 1 block（八进制的） == 8 block（十进制）
  * 2 block（八进制的） == 16 block（十进制）
  * 3 block（八进制的） == 24 block（十进制），以此类推
  * 计算上：`1`（八进制）-> `010`（JS 的八进制表示）-> `8`（十进制）

* `atime`：【本人觉得是】添加文件的日期（Append Time），新建或删除再添加同名文件或目录，该时间会更新

* `mtime`：修改文件的日期（Modify Time），修改文件内容会变，修改文件名不会变

* `ctime`：改变文件的日期（Change Time），修改文件内容会变，修改文件名也会变

* `birthtime`：诞生文件的日期（Birth Time），如果当前目录曾有过同名文件，则沿用之前的 `birthtime`（前提是系统还缓存文件操作的记录），可理解为当前目录某文件名的创建时间

补充：

> 各个 `time` 的排序：`birthtime` ≤ `atime` ≤ `mtime` ≤ `ctime`

> 文件占磁盘的大小，是根据 `size` 去划分多个 `block`。每 1 个 block 会消耗 1 次磁盘 I/O。
>
> 如果磁盘设置了 1 block 大小为 1KB，就算文件只有 1B，实际也需要 1KB 的大小（浪费了 1023B 的空间，请遐想一下某些数据小频率高的网络攻击实现，原理就是使服务器在 GC 或清缓存前使磁盘迅速被占满）
>
> ![红框为占位大小，绿框为实际大小](resource/0001-0001.png)

> `blksize`、`size`、`blocks` 的关系：`blocks = Math.ceil( size / blksize ) * 8`

> Linux 中创建硬/软连接方法：硬连接 `ln <源文件名> <目标文件名>`，软连接 `ln -s <源文件名> <目标文件名>`。Windows 中创建 “快捷方式” 为软连接

参考文档：

* [Linux运维四：文件属性及文件权限](https://www.cnblogs.com/ginvip/p/6353647.html)

* [详解nodejs 文本操作模块-fs模块（四）](http://wenku.55.la/h-43384.html)

* [Linux "ls -l"文件列表权限详解](http://blog.csdn.net/jenminzhang/article/details/9816853)

* [使用 mkfifo 命令创建 pipe 管道文件，如 "mkfifo -m 600 my-fifo"](https://baike.baidu.com/item/FIFO%E7%AE%A1%E9%81%93/8466221?fr=aladdin)

扩展阅读：

* [http 请求流程 && 5种 IO 模型](https://www.cnblogs.com/carllife/p/7018717.html)