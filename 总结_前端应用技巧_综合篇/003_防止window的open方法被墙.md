```
<a class="btn rechargeBtn" title="充值" href="javascript:getPayUrl();">充&#12288;值</a>

<script>
    function getPayUrl() {
        ...
        window.open('http://kugou.com/');
    }
</script>
```

如果用 `onclick` 去调用该方法的话，必被墙

估计 `href` 的促发的检测机制不同，所以不墙 `open`

但是如果延迟调用的话，也会出现被墙