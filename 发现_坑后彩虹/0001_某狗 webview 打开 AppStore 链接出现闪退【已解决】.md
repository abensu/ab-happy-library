# 某狗 webview 打开 AppStore 链接出现闪退【已解决】

## 场景

IOS 平台的某狗 app 的 webview 中，打开链接 `https://itunes.apple.com/app/id951557681`，导致某狗 app 闪退（IOS 7、IOS 8、IOS 9 都会崩，该问题和越狱不越狱无关）

## 过程

增鑫童鞋提出添加 `?m=8` 参数的解决方法，果真链接变成 `https://itunes.apple.com/app/id951557681?m=8` 之后，可以顺利打开！

后查看 [App Store 链接中的 mt=8 是什么意思](http://note.rpsh.net/posts/2014/03/26/mt-8-in-itunes-links-for-appstore/) 得知 `mt=8` 在 ios 中，代表 **媒体类型是移动软件应用** 的链接，系统会根据类型，找到相应的软件进行打开。

```
1   Music
2   Podcasts
3   Audiobooks
4   TV Shows
5   Music Videos
6   Movies
7   iPod Games
8   Mobile Software Applications   AppStore 打开
9   Ringtones
10  iTunes U
11  E-Books                        iBook 打开
12  Desktop Apps
```

[What is “mt=8” in iTunes links for the appstore?](http://stackoverflow.com/questions/1781427/what-is-mt-8-in-itunes-links-for-the-appstore) 问题中有句答复 “When you don't add the mt part and you link to an app the OS will first fire up the iTunes app. This one then figures out that the link points to an app and then switches over to the App Store app.”，其简述了无 `mt=8` 的大概执行逻辑： `链接 -> iTunes -> 应用 -> AppStore`，然后发现出现闪退的 iPhone 都没有 `iTunes`，推测是启动不存在的 iTunes app 时，导致闪退现象。

## 解决

`https://itunes.apple.com/app/id951557681` 改为 `https://itunes.apple.com/app/id951557681?m=8`
