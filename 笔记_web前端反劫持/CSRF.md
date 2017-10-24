# CSRF（Cross Site Request Forgery，跨站域请求伪造）

## 原理

![CSRF原理图](resource/0000-csrf-0001.jpg)

## 防范

1. 检测 `referrer` 是否来自当前域（成本低廉，疗效显著）

1. get 请求参数或头信息中的 token（生成与验证会带来一定性能消耗，有可能加大前端和后端的工作量，[JWT（JSON Web Token）](http://www.jianshu.com/p/576dbf44b2ae) 是其中一种应用体现）

1. 发送验证码到短信、邮箱（可能需要花些银子，延迟接收到信息需要考虑一定的提示方式）

1. 避免站内提供访问不安全的第三方链接（A.com->B.com->点击有问题的 A 链接->A.com）

## 参考文章

* [浅谈CSRF](http://www.jianshu.com/p/7f33f9c7997b)

* [CSRF攻击与防御](http://blog.csdn.net/stpeace/article/details/53512283)