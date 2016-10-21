## Part：程序

### > 对可视元素（如 `View` `Image` `ScrollView` 等）必须定义宽高或 `flex` 样式，因为默认宽高均为 `0`

### > 子元素不能撑大父元素

### > 样式的值，如果写错了（类型错、写了不存在的值等），就会红屏报错

### > `Image` 组件

* 为块元素，会独占一行，多图片平铺一行可以使用 `flex` 布局

* `Image` 可以理解为带 `background` 样式的 `div` 元素，其背景一定会居中占满，不会留白

![实际效果](pic/0001.png)

[原图地址](https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg)

### > FlexBox 布局

#### `flex` 同级元素占比：`<number>`

```
<View style={{width: 300, height: 400}}>
    <View style={{flex: 1, backgroundColor: '#f00'}} />
    <View style={{flex: 1, backgroundColor: '#0f0'}} />
    <View style={{flex: 1, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0006.png)

```
<View style={{width: 300, height: 400}}>
    <View style={{flex: 1, backgroundColor: '#f00'}} />
    <View style={{flex: 2, backgroundColor: '#0f0'}} />
    <View style={{flex: 3, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0004.png)

```
<View style={{width: 300, height: 400}}>
    <View style={{flex: 1, backgroundColor: '#f00'}} />
    <View style={{width: 50, height: 50, backgroundColor: '#0f0'}} />
    <View style={{flex: 1, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0007.png)

```
<View style={{flex: 1}}>
    <View style={{flex: 1, backgroundColor: '#f00'}} />
    <View style={{flex: 2, backgroundColor: '#0f0'}} />
    <View style={{flex: 3, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0005.png)

#### `flexDirection` 容器中各子元素的排列方式（或叫主轴方向）：`column` `row`【默认为 `column`】

* `column` ：垂直排列

```
<View style={{flex: 1, flexDirection: 'column'}}>
    <View style={{width: 50,height: 50, backgroundColor: '#f00'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#0f0'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0003.png)

* `row` ：水平排列

```
<View style={{flex: 1, flexDirection: 'row'}}>
    <View style={{width: 50,height: 50, backgroundColor: '#f00'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#0f0'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0002.png)

#### `justifyContent` 子元素沿主轴的定位：`flex-start` `center` `flex-end` `space-around` `space-between`【默认为 `flex-start`】

```
<View style={{flex: 1, flexDirection: 'row', justifyContent: '<flex-start|center|flex-end|space-around|space-between>'}}>
    <View style={{width: 50,height: 50, backgroundColor: '#f00'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#0f0'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0008.png)

从左到右依次为：`flex-start` `center` `flex-end` `space-around` `space-between`

```
<View style={{flex: 1, flexDirection: 'column', justifyContent: '<flex-start|center|flex-end|space-around|space-between>'}}>
    <View style={{width: 50,height: 50, backgroundColor: '#f00'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#0f0'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0009.png)

从左到右依次为：`flex-start` `center` `flex-end` `space-around` `space-between`

#### `alignItems` 子元素沿着次轴（与主轴垂直的轴，比如若主轴方向为 `row`，则次轴方向为 `column`）的排列方式：`flex-start` `center` `flex-end` `stretch`【默认为 `stretch`】

```
<View
    style={{
        flex            : 1,
        flexDirection   : 'column',
        justifyContent  : 'space-between',
        alignItems      : '<stretch|flex-start|center|flex-end>',
    }}
>
    <View style={{width: 50,height: 50, backgroundColor: '#f00'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#0f0'}} />
    <View style={{width: 50,height: 50, backgroundColor: '#00f'}} />
</View>
```

![实际效果](pic/0010.png)

从左到右依次为：`stretch` `flex-start` `center` `flex-end`

### > `View` 组件不支持 `onPress` 事件，`Touchable` 系列组件才支持

### > 触摸事件（较底层的，非封装好的 onPress）

* [React Native 触摸事件处理详解](http://www.tuicool.com/articles/IreaYfv)

### > 浏览器启动 App【暂时发现：仅成功打包后的文件有效，调试阶段是实现不了的】

修改文件 `<项目根目录>/android/app/src/main/AndroidManifest.xml`，具体如下：

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    ...
    <application
      android:name=".MainApplication"
      android:allowBackup="true"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>

        <!-- 在浏览器通过 mylovelyapp://start 启动 app -->
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="mylovelyapp"
                  android:host="start" />
        </intent-filter>

        <!-- 在浏览器通过 http://mylovelyapp.com/download 启动 app -->
        <!-- √ http://mylovelyapp.com/download -->
        <!-- √ http://mylovelyapp.com/download?v=1 -->
        <!-- × http://mylovelyapp.com/download/ -->
        <!-- × http://mylovelyapp.com/download/t.html -->
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="http"
                  android:host="mylovelyapp.com"
                  android:path="/download" />
        </intent-filter>

        <!-- 在浏览器通过 http://mylovelyapp.com/download/t.html 启动 app -->
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="http"
                  android:host="mylovelyapp.com"
                  android:path="/download/t.html" />
        </intent-filter>

      </activity>
      <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
    </application>
</manifest>
```

注意：

1. `AndroidManifest.xml` 默认的 `intent-filter` 不用改（原来那个是通过手机主页的图标打开 app），新加一个 `intent-filter` 用于浏览器调起 app

2. `<a href="[scheme]://[host]/[path]?[query]">启动应用程序</a>` 方括号对应的是 `android:scheme`、`android:host`、`android:path`、`android:query`（貌似 `android:host` 加上端口号就会匹配失败，就算加上 `android:port` 也没用），点击这样的 `http` 链接后浏览器会弹窗问你选择哪种 app 打开，其中有个选项就是你的 app


## 文章收集

暂无
