# PPT 大概思路

## 前言

在一个明朗的早上，我和我的亲愉悦地浏览我的小站，突然我的亲说：“你啥时候上广告了？”，我一脸懵 B 地拿她手机看，哎哟，还真有。。。可我手机刷了好几遍也没有出现，带着疑惑的我郁闷了一整天。。。

第二天，情况依然出现，而且这次轮到我，经过昨天基本的测试之后发现，这是花生地铁 wifi 对百度统计脚本进行劫持，并慕改，导致广告插入。

小弟怒了，在亲的催促之下，找到了病症与良方（迷之微笑。。。）

## XSS

对！就是它——XSS，跨站脚本攻击。

作为浏览器的亲儿子，Javascript 能够在插入到页面后顺利执行（需要配合 script 等标签）。利用这一特性，可以进行多种不可描述的事情，这就是 XSS 的本质。

## 现行办法（无客户端的光环）

前端：

* `CSP`（Content Security Policy，内容安全策略）

* `SRI`（Subresource Integrity，子资源完整性）

* DIY 脚本对 DOM 进行监控

后端：

* 设置头信息

    * `X-Frame-Options`（子框架展示授权）

    * `Content-Security-Policy`（内容安全策略，后端设置后，前端的 CSP 设置会无效）

    * `X-XSS-Protection`（跨脚本攻击防御，兼容低版本浏览器，现代浏览器默认都有该设置，防御效果一般，建议使用 CSP 即可）

    * `Strict-Transport-Security`（强制使用 HTTPS 协议访问资源，如果是 HTTP 访问，会被强制升级为 HTTPS 访问，可通过 `HSTS` 关键字查找相关内容）

    * `Public-Key-Pins`（证书公钥，防止中间人伪造证书，和 HTTPS 连用）

    * `Upgrade-Insecure-Requests`（使用 HTTPS 协议访问资源，一般配合 CSP 连用，对指定类型的资源升级访问）

* HTTPS

**以上方法均可一起使用！**

## 我是这样解决的。。。

受到 XSS 主要是因为线路不安全，导致百度脚本被慕改，从而插入第三方广告，而本质上它是非破坏性的。

因此，我给页面头部加入了 `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src *; script-src 'self' 'unsafe-eval' hm.baidu.com" />`，然后到现在也一直天下太平 (*^▽^*)

下面简单解释一下这段页面头信息的作用：

* `default-src 'self'`：给 CSP 各属性设默认值为 “仅当前域有效”

* `img-src *`：图片可以任意来源和任意类型（如 `data:` 这种）

* `script-src 'self' 'unsafe-eval' hm.baidu.com"`：js 脚本只能是当前域和 `hm.baidu.com` 相关源，允许执行 `setTimeout`、`eval` 等方法

由此，可以阻断非图片的第三方资源的加载，和阻止行内脚本、样式的执行。

简单来说，这个第三方广告需要先插入第三方脚本，但由于 CSP 起效，第三方脚本加载失败，广告就插入不了了。

事情到这里，大概就解决完了，但本着不折腾不死的心，然我们来了解一下 XSS 是啥货路？！

## XSS 族谱

这货离我们这么近，又那么远。

近，是因为我们每个页面都会有资源引入的行为，html、js、css、图片、flash、字体等资源一般都通过链接来引入（或 base64 等编码形式），自己的、隔壁老王的、远房亲戚的都有。这给劫持导致的 XSS 提供一条光明的道路。

远，是因为发现它的存在并不容易。在你调试页面的时候，它一般是不会出现的，但当你放到伟大的 “线上” 之后，就会促发一堆不可描述的事情。

大概梳理一下 XSS 的种类：

* 反射型 XSS

* 存储型 XSS

* 文档对象模型 XSS

* 通用型 XSS

* 其他种类

    * mXSS（突变型 XSS，因二次解码导致 XSS）

    * Flash XSS（非劫持的情况下，发生在对 url 参数上的处理，与反射性 XSS 类似）

    * UTF-7 XSS（低版本 IE 专属）

    * MHTML XSS（低版本 IE 专属，mhtml 协议加载问题资源）

    * CSS XSS（低版本 IE 专属，css 中通过 expression(...) 调用 js）

    * VBScript XSS（低版本 IE 专属）