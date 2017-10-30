# CRLF 注入

> CRLF 是 "回车 + 换行"（`\r\n`）的简称。在 HTTP 协议中，HTTP Header 与 HTTP Body 是用两个 CRLF 分隔的，浏览器就是根据这两个CRLF 来取出 HTTP 内容并显示出来。所以，一旦我们能够控制 HTTP 消息头中的字符，注入一些恶意的换行，这样我们就能注入一些会话 Cookie 或者 HTML 代码，所以 CRLF Injection 又叫 HTTP Response Splitting，简称 HRS。
>
> 对于 HRS 最简单的利用方式是注入两个 `\r\n`，之后在写入 XSS 代码，来构造一个 xss。

流程大概如下：

进行 30x 跳转到 `http://127.0.0.1:8903/crlf?abc=123%0d%0a%0d%0a%3Cimg%20src=0%20onerror=alert(123)%3E`，组成头部信息如下

```
HTTP/1.1 302 Moved Temporarily 
Date: Fri, 27 Jun 2014 17:52:17 GMT 
Content-Type: text/html 
Content-Length: 154 
Connection: close 
Location:

<img src=0 onerror=alert(123)>
```

## 防范

* 过滤 `\r`、`\n` 之类的换行符，推测前端输入方，一般会发生在 textarea 区域

* 使用新版浏览器，Chrome 61、Firefox 56、IE 7 均不会出现该注入

## 参考文章

* [CRLF Injection漏洞的利用与实例分析](http://blog.csdn.net/think_ycx/article/details/50267801)

* [crlf 注入攻击](http://www.cnblogs.com/wfzWebSecuity/p/6648767.html)
