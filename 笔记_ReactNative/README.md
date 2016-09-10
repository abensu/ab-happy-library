## Could not get BatchedBridge, make sure your bundle is packaged correctly

问题现象：

* 打开 app 就一个大红屏，并显示标题的错误

问题来源：

* 此问题主要是没有 `.bundle` 文件导致的

环境：

* react [ 15.3.1 ]
* react-native [ 0.32.1 ]

参考：

* [零基础用react-native开发android app](https://segmentfault.com/a/1190000003915315)
* [Could not get BatchedBridge, make sure your bundle is packaged correctly](http://blog.csdn.net/b992379702b/article/details/52234479)

### 解决方法

1. 本地调试服务器不能关！

1. 在 `<项目>/android/app/src/main` 文件夹新建 `assets` 文件夹

1. 在 chrome 浏览器地址栏输入 `http://localhost:8081/index.android.bundle?platform=android`，调试服务器的 CMD 界面会输出一些东西，等片刻后，页面会有 `bundle` 文件的内容出现，将其保存至 `<项目>/android/app/src/main/assets` 文件夹下

1. 修改 `<项目>/package.json`，给 `scripts` 添加 `"bundle-android":"react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --sourcemap-output android/app/src/main/assets/index.android.map --assets-dest android/app/src/main/res/"`

 ![修改 scripts](http://img.blog.csdn.net/20160817201817455)

1. 在项目根目录的 CMD 界面输入 `react-native run-android`（如果后，还是报标题的错误，那就先执行 `bundle-android` 对应的那句 cmd 命令，再执行 `react-native run-android`）

注意：

* `assets` 文件夹可以设置在自己觉得合适的地方，但对应的路径（cmd 中的那些 assets 路径）也要进行修改


## Could not connect to development server

问题现象：

* 点击菜单栏的 `Reload`，app 就一个大红屏，并显示标题的错误

问题来源：

* 此问题主要是没有 `.bundle` 文件导致的

环境：

* react [ 15.3.1 ]
* react-native [ 0.32.1 ]

### 解决方法

根据他的提示一步一步试，最后点击 `<菜单栏> -> Dev Settiongs -> DEBUGGING / Debug server host & port for device` 填写本地服务器的地址，如 `192.168.88.105:8081`，重新点击 `<菜单栏> -> Reload` 即可


## 文章收集

空
