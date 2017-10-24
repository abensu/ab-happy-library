# XSS（Cross-Site Scripting，跨站脚本攻击）

导致 XSS 的原因

> 对非预期输入的信任

## 种类

### 反射型 XSS（Reflected XSS Attacks，Non-persistent XSS，非持久型 XSS）

> 通过给别人发送带有恶意脚本代码参数的 URL，当 URL 地址被打开时，特有的恶意代码参数被 HTML 解析、执行。

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

场景：

* 论坛

防范：

* 处理方法与反射型 XSS 一致

衍生：

* XSS Worm（XSS 蠕虫），[世界第一个XSS攻击蠕虫的原理](http://netsecurity.51cto.com/art/201312/421917.htm)、[蠕虫来了！小议xss worm的前世今生](http://netsecurity.51cto.com/art/201305/395107.htm)

### Dom XSS（DOM-base XSS，文档对象模型 XSS）

> 一种基于文档对象模型（Document Object Model，DOM）的 Web 前端漏洞，简单来说就是 JavaScript 代码缺陷造成的漏洞。一般是对文档树进行修改。

防范：

* 处理方法与反射型 XSS 一致

参考文档：

* [Paypal的一个Dom型XSS漏洞分析](http://www.freebuf.com/articles/web/29177.html)

* [驱散前端安全梦魇——DOMXSS典型场景分析与修复指南](https://security.tencent.com/index.php/blog/msg/107)

### 通用型 XSS（UXSS，Universal Cross-Site Scripting）

> 利用浏览器或者浏览器扩展漏洞来制造产生 XSS 的条件并执行代码的一种攻击类型。

防范：

* 积极打补丁，尽快升级浏览器版本

* 减少或避免安装插件

参考文章：

* [通用跨站脚本攻击(UXSS)](http://www.91ri.org/10665.html)

### 其他

以下介绍了现行多种的 XSS 类型

* [跨站的艺术-XSS入门与介绍](http://www.fooying.com/the-art-of-xss-1-introduction/)

## 其他参考文章

* [细数 Web 2.0 下的十大安全威胁](http://blog.csdn.net/techweb/article/details/1936240)

* [Cross-site Scripting (XSS)](https://www.owasp.org/index.php/XSS)

* [mXSS](http://www.thespanner.co.uk/2014/05/06/mxss/)
