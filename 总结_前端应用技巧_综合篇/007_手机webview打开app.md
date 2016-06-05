使用 chrome 的手机调试模式打开页面 http://www.bilibili.com/mobile/video/av4372849.html

```
<a href="bilibili://" id="open_app" target="_blank">安卓打开“哔哩哔哩app”</a>
<script>
    document.getElementById( "open_app" ).onclick = function() {
    	// 其实还要区分 微信打开、微博打开、普通打开，都不行就下载，不过微信要特殊处理
    	setTimeout( function() {
    		location.href = "http://wsdownload.hdslb.net/app/BiliPlayer_bilih5.apk";
    	}, 100 );
    };
</script>
```