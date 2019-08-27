# 短信中的 URL 启动 APP

> 严选短信中的 `u.163.com`，点击可以启动网易严选 APP

假设想通过 `http://acsing.kugou.com/app` 启动 APP...

1. Android scheme 设置（以下是假设性代码）：

    ```
    <activity
        android:name=".SchemeTargetActivity"
        android:launchMode="singleTask">
        <!-- 要想在别的App上能成功调起App，必须添加intent过滤器 -->
        <intent-filter>
            <!-- 协议部分 可以随便设置 还可以加一些host port path 等，协议规则越详细定位界面更精确，-->
            <!--<data android:scheme="bruce"></data>-->

            <data android:scheme="http"
                android:host="acsing.kugou.com"
                android:port="80"
                android:path="/app"
                ></data>
            <!-- 必须设置 -->
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <!-- 如果需要外部网页打开本页面，还需要设置这个 -->
            <category android:name="android.intent.category.BROWSABLE" />
        </intent-filter>
    </activity>
    ```

1. iOS scheme 设置（以下是假设性代码）：

    > 设置 scheme 打开项目的 info.plist 文件，添加一个 scheme，相当于给宝箱设置一个开启密码，密码可以随便设置，所以 scheme 也可以随便设置，但是一般我们都设置同项目Bundle identifier一样

    ![123](https://upload-images.jianshu.io/upload_images/2785125-156d2ee0ed8f1e3d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000)

    ```
    /**
     *  支付接口
     *
     *  @param orderStr       订单信息——该字符串从公司后台接口获取
     *  @param schemeStr      调用支付的app注册在info.plist中的scheme
     *  @param compltionBlock 支付结果回调Block，用于wap支付结果回调（非跳转钱包支付）
     */
    [[AlipaySDK defaultService] payOrder:signedString fromScheme:@"com.kugou.acsing" callback:nil];
    ```

1. 后端添加跳转：

    * 对 `http://acsing.kugou.com/app`（或 `http://acsing.kugou.com/app/xxx` 等）进行 30X 的跳转设置（避免因 APP 没有安装，页面报 404），跳转到下载页（`http://acsing.kugou.com/sing7/static/staticPub/mobile/download/views/v2.html`）或者是下一个业务的跳转

1. web 前端对下载页的接收参数进行统一处理

注意点：

1. 考虑到需要在**短信**进行传播，地址（即上例的 `http://acsing.kugou.com/app`）不应过长

1. 短信中的地址无需添加 `http://`（如短信上是 `acsing.kugou.com/app`，系统会补全为 `http://acsing.kugou.com/app`），但如果是 `https：//`，估计需要加上

1. 地址（即 `http://acsing.kugou.com/app`）不应与现有接口、静态地址、动态地址重合，以免在日后业务中出现问题

1. 上述地址，在思路上，暂支持启动 APP，至于跳到对应哪个页面，需要进一步商榷（如果沿用现有的 H5 请求参数，即问号及其后字符串 `?type=xx&yy=zz`，有可能部分地址，在短信中过长）

1. 上述通过 URL 打开 APP，不适用于在 APP、浏览器内直接打开 URL，从而打开 APP

1. IOS 个人发出的短信，例如含有地址，貌似不能带协议头，地址两端要有其他文本包裹，不然文本和地址会分开发。。。

1. IOS 通用链相关：
    1. 在 H5 中，IOS 系统下，A 页面想通过通用链启动 APP，必须跨域（即 A 页面域名和通用链的域名要不一样，至于为啥，也暂未知，听说是从 IOS 9.2 开始有这个规则）；
    1. 如果在短信、备忘录等，长按具有通用链作用的链接，促发菜单，点击使用 Safari 打开，那么之后，使用通用链都会启动 APP 失败（就算域名不同），除非用户长按链接，使用对应 APP 启动，或者在通用链页面的顶部（要上拉一下），点击系统添加的 “打开” APP 按钮，那么之后，才能通过通用链打开 APP 成功；
    1. 如果客户端下载通用链配置文件失败，那么走通用链链接，是不会启动 APP 成功的；
    1. IOS 9，通用链配置文件路径应为 `/apple-app-site-association`，IOS 9.3 开始，通用链配置文件路径应为 `/.well-known/apple-app-site-association`
    1. 补充：IOS 客户端说，通用链的地址必须不能为 404，不然会启动 APP 失败（暂未考证）
    1. 补充：IOS 客户端说，下载通用链走的协议，其实是 http（还是让服务器支持 https 和 http 安全些）

参考：

1. [在Android中的用法](https://www.jianshu.com/p/4e006f9a7821)

1. [iOS scheme跳转机制](https://www.jianshu.com/p/138b44833cda)

1. [Incoming requests for /.well-known/apple-app-site-association file](https://www.cnblogs.com/xilifeng/p/5382109.html)

1. [通用链接(Universal Links)实践笔记](https://blog.csdn.net/leochang130731/article/details/60143994)

1. [iOS 10 Universal Links(通用连接),从微信网页连接跳转到公司APP之官方指南翻译](https://blog.csdn.net/kuangdacaikuang/article/details/52955070)

1. [iOS Universal Links(通用链接)](https://blog.csdn.net/yohunl/article/details/51036027)