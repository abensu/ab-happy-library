# XSS（Cross-Site Scripting，跨站脚本攻击）

导致 XSS 的原因

* 前因：JavaScript 在浏览器是公认的可执行脚本

* 诱因 1：对非预期输入的信任（内忧）

* 诱因 2：线路安全性不能保证（外患）

## 种类

### 反射型 XSS（Reflected XSS Attacks，Non-persistent XSS，非持久型 XSS）

> 通过给别人发送带有恶意脚本代码参数的 URL，当 URL 地址被打开时，特有的恶意代码参数被 HTML 解析、执行。

关键点：

* 非长效

* 前后端对文本的不作为

* 更趋于前端防御

场景：

* 搜索、即时聊天

防范：

* 输入：对内容进行转义

* 输入、输出：过滤含标签的非法内容或敏感内容（替换为空格比直接剔除会更安全）

* 输出：（JavaScript 上）使用 `textContent`，而不是 `innerHTML` 注入内容

* 将重要的 `cookie` 标记为 `http only`

参考文档：

* [反射型xss实战演示](http://netsecurity.51cto.com/art/201311/417201.htm)

* [反射型XSS攻击](http://blog.163.com/biaoxiaoqun@126/blog/static/376791602014718103941487/)

### 存储型 XSS（Stored XSS Attacks，Persistent XSS，持久型 XSS）

> 恶意代码被成功入库，导致其可以长期驻守，并当用户打开受感页面时，将其激活

关键点：

* 长效

* 前后端对文本的不作为

* 更趋于后端防御（`localStorage` 引起的 XSS 也要注意）

场景：

* 论坛

防范：

* 处理方法与反射型 XSS 一致

衍生：

* XSS Worm（XSS 蠕虫），[世界第一个XSS攻击蠕虫的原理](http://netsecurity.51cto.com/art/201312/421917.htm)、[蠕虫来了！小议xss worm的前世今生](http://netsecurity.51cto.com/art/201305/395107.htm)

### Dom XSS（DOM-base XSS，文档对象模型 XSS）

> 对 DOM 结构进行慕改，引起的 XSS。包括，数据（页面、引用资源等）被劫持而注入的脚本、反射型 XSS 和 存储型 XSS 注入的脚本等。

关键点：

* DOM 的慕改

防范：

* 节点安全性检测与处理（由于一般是一块区域出事，简单点可通过所上报的异常数据去判断有问题的 IP 段落，并对该段落的用户进行提示等处理）

* `X-Frame-Options` 头信息

* SRI（子域资源验证）

* CSP（内容安全策略）

* HTTPS 等

参考文档：

* [Paypal的一个Dom型XSS漏洞分析](http://www.freebuf.com/articles/web/29177.html)

* [驱散前端安全梦魇——DOMXSS典型场景分析与修复指南](https://security.tencent.com/index.php/blog/msg/107)

* [关于DOM型XSS漏洞的学习笔记](http://blog.csdn.net/ski_12/article/details/60468362)

### 通用型 XSS（UXSS，Universal Cross-Site Scripting）

> 利用浏览器或者浏览器扩展漏洞来制造产生 XSS 的条件并执行代码的一种攻击类型。

关键点：

* 浏览器 BUG

防范：

* 积极打补丁，尽快升级浏览器版本

* 减少或避免安装插件

参考文章：

* [通用跨站脚本攻击(UXSS)](http://www.91ri.org/10665.html)

### 其他 XSS

《[跨站的艺术-XSS入门与介绍](http://www.fooying.com/the-art-of-xss-1-introduction/)》一文介绍了现行多种的 XSS 类型，如：

* mXSS（突变型 XSS，因二次解码导致 XSS）

* Flash XSS（非劫持的情况下，发生在对 url 参数上的处理，与反射性 XSS 类似）

* UTF-7 XSS（低版本 IE 专属）

* MHTML XSS（低版本 IE 专属，mhtml 协议加载问题资源）

* CSS XSS（低版本 IE 专属，css 中通过 `expression(...)` 调用 js）

* VBScript XSS（低版本 IE 专属）

## 推荐资源

* [给开发者的终极XSS防护备忘录.pdf](http://blog.knownsec.com/wp-content/uploads/2014/07/%E7%BB%99%E5%BC%80%E5%8F%91%E8%80%85%E7%9A%84%E7%BB%88%E6%9E%81XSS%E9%98%B2%E6%8A%A4%E5%A4%87%E5%BF%98%E5%BD%95.pdf)

## 推荐库

### [DOMPurify](https://github.com/cure53/DOMPurify)，前端或 node 均可以使用的库，支持 UMD，主要应对反射型 XSS 和存储型 XSS

文件链接：[purify.js](https://raw.githubusercontent.com/cure53/DOMPurify/master/dist/purify.js)

```
DOMPurify.sanitize('<img src=x onerror=alert(1)//>'); // becomes <img src="x">
DOMPurify.sanitize('<svg><g/onload=alert(2)//<p>'); // becomes <svg><g></g></svg>
DOMPurify.sanitize('<p>abc<iframe/\/src=jAva&Tab;script:alert(3)>def'); // becomes <p>abcdef</p>
DOMPurify.sanitize('<math><mi//xlink:href="data:x,<script>alert(4)</script>">'); // becomes <math><mi></mi></math>
DOMPurify.sanitize('<TABLE><tr><td>HELLO</tr></TABL>'); // becomes <table><tbody><tr><td>HELLO</td></tr></tbody></table>
DOMPurify.sanitize('<UL><li><A HREF=//google.com>click</UL>'); // becomes <ul><li><a href="//google.com">click</a></li></ul>
```

### [Client side HTML encoding and decoding](https://www.strictly-software.com/htmlencode)，这是个前端用的小库，用于编码和解码

文件链接：[encoder.js](https://www.strictly-software.com/scripts/downloads/encoder.js)

```
//使用html example输入对象

//即设置了输入的种类对数字个体&而不是&
Encoder.EncodeType = "numerical";

//即或设置它输入到html个体&而不是&
Encoder.EncodeType = "entity";

// HTML输入从输入元素的文本
//这将防止双重内码。
var encoded = Encoder.htmlEncode(document.getElementById('input'));

//输入，但是允许意味所有现有的个体的双重内码的
// &amp; 将被转换成 &amp;amp;
var dblEncoded = Encoder.htmlEncode(document.getElementById('input'),true);

//解码现在编码文本
var decoded = Encoder.htmlDecode(encoded);

//检查文本是否仍然包含HTML/Numerical个体
var containsEncoded = Encoder.hasEncoded(decoded);
```

## 其他参考文章

* [细数 Web 2.0 下的十大安全威胁](http://blog.csdn.net/techweb/article/details/1936240)

* [Cross-site Scripting (XSS)](https://www.owasp.org/index.php/XSS)

* [mXSS](http://www.thespanner.co.uk/2014/05/06/mxss/)
