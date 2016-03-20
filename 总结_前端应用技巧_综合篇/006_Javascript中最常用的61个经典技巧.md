＃ Javascript中最常用的61个经典技巧[转]

1. oncontextmenu="window.event.returnValue=false" 将彻底屏蔽鼠标右键
<table border oncontextmenu=return(false)><td>no</table> 可用于Table

2. <body onselectstart="return false"> 取消选取、防止复制

3. onpaste="return false" 不准粘贴

4. oncopy="return false;" oncut="return false;" 防止复制

5. <link rel="Shortcut Icon" href="favicon.ico"> IE地址栏前换成自己的图标

6. <link rel="Bookmark" href="favicon.ico"> 可以在收藏夹中显示出你的图标


7. <input style="ime-mode:disabled"> 关闭输入法


8. 永远都会带着框架
<script language="JavaScript"><!--
if (window == top)top.location.href = "frames.htm"; //frames.htm为框架网页
// --></script>


9. 防止被人frame
<SCRIPT LANGUAGE=JAVASCRIPT><!-- 
if (top.location != self.location)top.location=self.location;
// --></SCRIPT>


10. 网页将不能被另存为
<noscript><*** src="/*.html>";</***></noscript>


11. <input type=button value="/查看网页源代码 
onclick="window.location = "view-source:"+ "http://www.pconline.com.cn"">
12.删除时确认
<a href=""javascript :if(confirm("确实要删除吗?"))location="boos.asp?&areyou=删除&page=1"">删除</a>


13. 取得控件的绝对位置
//Javascript
<script language="Javascript">
function getIE(e){
var t=e.offsetTop;
var l=e.offsetLeft;
while(e=e.offsetParent){
t+=e.offsetTop;
l+=e.offsetLeft;
}
alert("top="+t+"/nleft="+l);
}
</script>
//VBScript
<script language="VBScript"><!--
function getIE()
dim t,l,a,b
set a=document.all.img1
t=document.all.img1.offsetTop
l=document.all.img1.offsetLeft
while a.tagName<>"BODY"
set a = a.offsetParent
t=t+a.offsetTop
l=l+a.offsetLeft
wend
msgbox "top="&t&chr(13)&"left="&l,64,"得到控件的位置"
end function
--></script>


14. 光标是停在文本框文字的最后
<script language="javascript">
function cc()
{
var e = event.srcElement;
var r =e.createTextRange();
r.moveStart("character",e.value.length);
r.collapse(true);
r.select();
}
</script>
<input type=text name=text1 value="123" onfocus="cc()">


15. 判断上一页的来源
javascript :
document.referrer


16. 最小化、最大化、关闭窗口
<object id=hh1 classid="clsid:ADB880A6-D8FF-11CF-9377-00AA003B7A11"> 
<param name="Command" value="Minimize"></object>
<object id=hh2 classid="clsid:ADB880A6-D8FF-11CF-9377-00AA003B7A11"> 
<param name="Command" value="Maximize"></object>
<OBJECT id=hh3 classid="clsid:adb880a6-d8ff-11cf-9377-00aa003b7a11">
<PARAM NAME="Command" value="/Close"></OBJECT>
<input type=button value="/最小化 onclick=hh1.Click()>
<input type=button value="/blog/最大化 onclick=hh2.Click()>
<input type=button value=关闭 onclick=hh3.Click()>
本例适用于IE


17.屏蔽功能键Shift,Alt,Ctrl
<script>
function look(){ 
if(event.shiftKey) 
alert("禁止按Shift键!"); //可以换成ALT　CTRL
} 
document.onkeydown=look; 
</script>


18. 网页不会被缓存
<META HTTP-EQUIV="pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
<META HTTP-EQUIV="expires" CONTENT="Wed, 26 Feb 1997 08:21:57 GMT">
或者<META HTTP-EQUIV="expires" CONTENT="0">


19.怎样让表单没有凹凸感？
<input type=text style="""border:1 solid #000000"> 
或
<input type=text style="border-left:none; border-right:none; border-top:none; border-bottom: 
1 solid #000000"></textarea>


20.<div><span>&<layer>的区别？ 
<div>(division)用来定义大段的页面元素，会产生转行 
<span>用来定义同一行内的元素，跟<div>的唯一区别是不产生转行 
<layer>是ns的标记，ie不支持，相当于<div>


21.让弹出窗口总是在最上面:
<body onblur="this.focus();">


22.不要滚动条? 
让竖条没有: 
<body style="overflow:scroll;overflow-y:hidden"> 
</body> 
让横条没有: 
<body style="overflow:scroll;overflow-x:hidden"> 
</body> 
两个都去掉？更简单了 
<body scroll="no"> 
</body>


23.怎样去掉图片链接点击后，图片周围的虚线？
<a href="#" onFocus="this.blur()"><img src="/logo.jpg" border=0></a>


24.电子邮件处理提交表单
<form name="form1" method="post" action=mailto:****@***.com 
enctype="text/plain"> 
<input type=submit>
</form>


25.在打开的子窗口刷新父窗口的代码里如何写？
window.opener.location.reload()


26.如何设定打开页面的大小
<body onload="top.resizeTo(300,200);">
打开页面的位置<body onload="top.moveBy(300,200);">


27.在页面中如何加入不是满铺的背景图片,拉动页面时背景图不动 
<STYLE> 
body 
{background-image:url(/logo.gif); background-repeat:no-repeat; 
background-position:center;background-attachment: fixed} 
</STYLE>


28. 检查一段字符串是否全由数字组成
<script language="Javascript"><!--
function checkNum(str){return str.match(//D/)==null}
alert(checkNum("1232142141"))
alert(checkNum("123214214a1"))
// --></script>


29. 获得一个窗口的大小
document.body.clientWidth; document.body.clientHeight


30. 怎么判断是否是字符
if (/[^/x00-/xff]/g.test(s)) alert("含有汉字");
else alert("全是字符");


31.TEXTAREA自适应文字行数的多少
<textarea rows=1 name=s1 cols=27 onpropertychange
="this.style.posHeight=this.scrollHeight">
</textarea>


32. 日期减去天数等于第二个日期
<script language=Javascript>
function cc(dd,dadd)
{
//可以加上错误处理
var a = new Date(dd)
a = a.valueOf()
a = a - dadd * 24 * 60 * 60 * 1000
a = new Date(a)
alert(a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日")
}
cc("12/23/2002",2)
</script>


33. 选择了哪一个Radio
<HTML><script language="vbscript">
function checkme()
for each ob in radio1
if ob.checked then 
window.alert ob.value
next
end function
</script><BODY>
<INPUT name="radio1" type="radio" value="/style" checked>Style
<INPUT name="radio1" type="radio" value="/blog/barcode">Barcode
<INPUT type="button" value="check" onclick="checkme()">
</BODY></HTML>


34.脚本永不出错
<SCRIPT LANGUAGE="JavaScript"> 
<!-- Hide 
function killErrors() { 
return true; 
} 
window.onerror = killErrors; 
// --> 
</SCRIPT>


35.ENTER键可以让光标移到下一个输入框
<input onkeydown="if(event.keyCode==13)event.keyCode=9">


36. 检测某个网站的链接速度：
把如下代码加入<body>区域中:
<script language=Javascript>
tim=1
setInterval("tim++",100)
b=1
var autourl=new Array()
autourl[1]=1000){this.resized=true;this.style.width=1000;}" align=absMiddle border=0>life.netskycn.com"
autourl[2]="javacool.3322.net"
autourl[3]=1000){this.resized=true;this.style.width=1000;}" align=absMiddle border=0>www.netskycn.com"
autourl[4]="www.nuaa.edu.cn"
autourl[5]=1000){this.resized=true;this.style.width=1000;}" align=absMiddle border=0>bbs.netskycn.com"
function butt(){
***("<form name=autof>")
for(var i=1;i<autourl.length;i++)
***("<input type=text name=txt"+i+" size=10 value="/测试中……> =》<input type=text 
name=url"+i+" size=40> =》<input type=button value="/blog/GO 
onclick=window.open(this.form.url"+i+".value)><br>")
***("<input type=submit value=刷新></form>")
}
butt()
function auto(url){
document.forms[0]["url"+b].value=url
if(tim>200)
{document.forms[0]["txt"+b].value="/链接超时"}
else
{document.forms[0]["txt"+b].value="/blog/时间"+tim/10+"秒"}
b++
}
function run(){for(var i=1;i<autourl.length;i++)***("<img src=http://"+autourl+"/"+Math.random()+" width=1 height=1 
onerror=auto("http://"+autourl+"")>")}
run()</script>


37. 各种样式的光标
auto ：标准光标
default ：标准箭头
hand ：手形光标
wait ：等待光标
text ：I形光标
vertical-text ：水平I形光标
no-drop ：不可拖动光标
not-allowed ：无效光标
help ：?帮助光标
all-scroll ：三角方向标
move ：移动标
crosshair ：十字标
e-resize
n-resize
nw-resize
w-resize
s-resize
se-resize
sw-resize


38.页面进入和退出的特效
进入页面<meta http-equiv="Page-Enter" content="revealTrans(duration=x, transition=y)">
推出页面<meta http-equiv="Page-Exit" content="revealTrans(duration=x, transition=y)">  
这个是页面被载入和调出时的一些特效。duration表示特效的持续时间，以秒为单位。transition表示使用哪种特效，取值为1-23:
　　0 矩形缩小 
　　1 矩形扩大 
　　2 圆形缩小
　　3 圆形扩大 
　　4 下到上刷新 
　　5 上到下刷新
　　6 左到右刷新 
　　7 右到左刷新 
　　8 竖百叶窗
　　9 横百叶窗 
　　10 错位横百叶窗 
　　11 错位竖百叶窗
　　12 点扩散 
　　13 左右到中间刷新 
　　14 中间到左右刷新
　　15 中间到上下
　　16 上下到中间 
　　17 右下到左上
　　18 右上到左下 
　　19 左上到右下 
　　20 左下到右上
　　21 横条 
　　22 竖条 
　　23 以上22种随机选择一种


39.在规定时间内跳转
<META http-equiv=V="REFRESH" content="5;URL=http://www.netskycn.com">


40.网页是否被检索
<meta name="ROBOTS" content="属性值">
　　其中属性值有以下一些:
　　属性值为"all": 文件将被检索，且页上链接可被查询；
　　属性值为"none": 文件不被检索，而且不查询页上的链接；
　　属性值为"index": 文件将被检索；
　　属性值为"follow": 查询页上的链接；
　　属性值为"noindex": 文件不检索，但可被查询链接；
　　属性值为"nofollow": 文件不被检索，但可查询页上的链接。


41、email地址的分割
把如下代码加入<body>区域中
<a href="mailto:webmaster@sina.com">webmaster@sina.com</a>


42、流动边框效果的表格
把如下代码加入<body>区域中
<SCRIPT>
l=Array(6,7,8,9,'a','b','b','c','d','e','f')
Nx=5;Ny=35
t="<table border=0 cellspacing=0 cellpadding=0 height="+((Nx+2)*16)+"><tr>"
for(x=Nx;x<Nx+Ny;x++)
t+="<td width=16 id=a_mo"+x+">　</td>"
t+="</tr><tr><td width=10 id=a_mo"+(Nx-1)+">　</td><td colspan="+(Ny-2)+" rowspan="+(Nx)+">　</td><td width=16 id=a_mo"+(Nx+Ny)+"></td></tr>"
for(x=2;x<=Nx;x++)
t+="<tr><td width=16 id=a_mo"+(Nx-x)+">　</td><td width=16 id=a_mo"+(Ny+Nx+x-1)+">　</td></tr>"
t+="<tr>"
for(x=Ny;x>0;x--)
t+="<td width=16 id=a_mo"+(x+Nx*2+Ny-1)+">　</td>"
***(t+"</tr></table>")
var N=Nx*2+Ny*2
function f1(y){
for(i=0;i<N;i++){
c=(i+y)%20;if(c>10)c=20-c
document.all["a_mo"+(i)].bgColor=""""#0000"+l[c]+l[c]+"'"}
y++
setTimeout('f1('+y+')','1')}
f1(1)
</SCRIPT>


43、JavaScript主页弹出窗口技巧
窗口中间弹出
<script>
window.open("http://www.cctv.com","","width=400,height=240,top="+(screen.availHeight-240)/2+",left="+(screen.availWidth-400)/2);
</script>
============
<html>
<head>
<script language="LiveScript">
function WinOpen() {
    msg=open("","DisplayWindow","toolbar=no,directories=no,menubar=no");
    msg.***("<HEAD><TITLE>哈 罗!</TITLE></HEAD>");
    msg.***("<CENTER><H1>酷 毙 了!</H1><h2>这 是<B>JavaScript</B>所 开 的 视 窗!</h2></CENTER>");
}
</script>
</head>
<body>
<form>
<input type="button" name="Button1" value="Push me" onclick="WinOpen()">
</form>
</body>
</html>
==============
一、在下面的代码中，你只要单击打开一个窗口，即可链接到天下网。而当你想关闭时，只要单击一下即可关闭刚才打开的窗口。
　　代码如下： 
　　<SCRIPT language="JavaScript"> 
　　<！-- 
　　function openclk() { 
　　another=open('1000){this.resized=true;this.style.width=1000;}" align=absMiddle border=0>www.netskycn.com'，'NewWindow'); 
　　} 
　　function closeclk() { 
　　another.close(); 
　　} 
　　//--> 
　　</SCRIPT> 
　　<FORM> 
　　<INPUT TYPE="BUTTON" NAME="open" value="/打开一个窗口" onClick="openclk()"> 
　　<BR> 
　　<INPUT TYPE="BUTTON" NAME="close" value="/blog/关闭这个窗口" onClick="closeclk()"> 
　　</FORM> 
　　二、上面的代码也太静了，为何不来点动感呢？如果能给页面来个降落效果那该多好啊！ 
　　代码如下： 
　　<script> 
　　function drop(n) { 
　　if(self.moveBy){ 
　　self.moveBy (0，-900); 
　　for(i = n; i > 0; i--){ 
　　self.moveBy(0，3); 
　　} 
　　for(j = 8; j > 0; j--){ 
　　self.moveBy(0，j); 
　　self.moveBy(j，0); 
　　self.moveBy(0，-j); 
　　self.moveBy(-j，0); 
　　} 
　　} 
　　} 
　　</script> 
　　<body onLoad="drop(300)"> 
　　三、讨厌很多网站总是按照默认窗口打开，如果你能随心所欲控制打开的窗口那该多好。 
　　代码如下: 
　　<SCRIPT LANGUAGE="JavaScript"> 
　　<！-- Begin 
　　function popupPage(l， t， w， h) { 
　　var windowprops = "location=no，scrollbars=no，menubars=no，toolbars=no，resizable=yes" + 
　　"，left=" + l + "，top=" + t + "，width=" + w + "，height=" + h; 
　　var URL = "http://www.netskycn.com"; 
　　popup = window.open(URL，"MenuPopup"，windowprops); 
　　} 
　　// End --> 
　　</script> 
　　<table> 
　　<tr> 
　　<td> 
　　<form name=popupform> 
　　<pre> 
　　打开页面的参数<br> 
　　离开左边的距离: <input type=text name=left size=2 maxlength=4> pixels 
　　离开右边的距离: <input type=text name=top size=2 maxlength=4> pixels 
　　窗口的宽度: <input type=text name=width size=2 maxlength=4> pixels 
　　窗口的高度: <input type=text name=height size=2 maxlength=4> pixels 
　　</pre> 
　　<center> 
　　<input type=button value="打开这个窗口！" onClick="popupPage(this.form.left.value， this.form.top.value， this.form.width.value，
this.form.height.value)"> 
　　</center> 
　　</form> 
　　</td> 
　　</tr> 
　　</table>你只要在相对应的对话框中输入一个数值即可，将要打开的页面的窗口控制得很好。


44、页面的打开移动
把如下代码加入<body>区域中
<SCRIPT LANGUAGE="JavaScript">
<!-- Begin
for (t = 2; t > 0; t--) {
for (x = 20; x > 0; x--) {
for (y = 10; y > 0; y--) {
parent.moveBy(0,-x);
   }
}
for (x = 20; x > 0; x--) {
for (y = 10; y > 0; y--) {
parent.moveBy(0,x);
   }
}
for (x = 20; x > 0; x--) {
for (y = 10; y > 0; y--) {
parent.moveBy(x,0);
   }
}
for (x = 20; x > 0; x--) {
for (y = 10; y > 0; y--) {
parent.moveBy(-x,0);
     }
   } 
}
//-->
//   End -->
</script>


45、显示个人客户端机器的日期和时间
<script language="LiveScript">
<!-- Hiding
   today = new Date()
   ***("现 在 时 间 是： ",today.getHours(),":",today.getMinutes())
   ***("<br>今 天 日 期 为： ", today.getMonth()+1,"/",today.getDate(),"/",today.getYear());
// end hiding contents -->
</script>


46、自动的为你每次产生最後修改的日期了： 
<html>
<body>
This is a simple HTML- page.
<br>
Last changes:
   <script language="LiveScript">
   <!--   hide script from old browsers
     ***(document.lastModified)
   // end hiding contents -->
   </script>
</body>
</html>


47、不能为空和邮件地址的约束：
<html>
<head>
<script language="JavaScript">
<!-- Hide
function test1(form) {
   if (form.text1.value == "")
     alert("您 没 写 上 任 何 东 西， 请 再 输 入 一 次 !")
   else { 
    alert("嗨 "+form.text1.value+"! 您 已 输 入 完 成 !");
   }
}
function test2(form) {
   if (form.text2.value == "" || 
       form.text2.value.indexOf('@', 0) == -1) 
         alert("这 不 是 正 确 的 e-mail address! 请 再 输 入 一 次 !");
   else alert("您 已 输 入 完 成 !");
}
// -->
</script>
</head>
<body>
<form name="first">
Enter your name:<br>
<input type="text" name="text1">
<input type="button" name="button1" value="输 入 测 试" onClick="test1(this.form)">
<P>
Enter your e-mail address:<br>
<input type="text" name="text2">
<input type="button" name="button2" value="输 入 测 试" onClick="test2(this.form)">
</body>


48、跑马灯
<html>
<head>
<script language="JavaScript">
<!-- Hide
var scrtxt="怎麽样 ! 很酷吧 ! 您也可以试试."+"Here goes your message the visitors to your 
page will "+"look at for hours in pure fascination...";
var lentxt=scrtxt.length;
var width=100;
var pos=1-width;
function scroll() {
   pos++;
   var scroller="";
   if (pos==lentxt) {
     pos=1-width;
   }
   if (pos<0) {
     for (var i=1; i<=Math.abs(pos); i++) {
       scroller=scroller+" ";}
     scroller=scroller+scrtxt.substring(0,width-i+1);
   }
   else {
     scroller=scroller+scrtxt.substring(pos,width+pos);
   }
   window.status = scroller;
   setTimeout("scroll()",150);
   }
//-->
</script>
</head>
<body onLoad="scroll();return true;">
这里可显示您的网页 !
</body>
</html>


49、在网页中用按钮来控制前页，后页和主页的显示。
<html>
<body>
<FORM NAME="buttonbar">
      <INPUT TYPE="button" VALUE="Back" onClick="history.back()">
      <INPUT TYPE="button" VALUE="JS- Home" onClick="location='script.html'">
      <INPUT TYPE="button" VALUE="Next" onCLick="history.forward()">
</FORM>
</body>
</html>
50、查看某网址的源代码
把如下代码加入<body>区域中
<SCRIPT>
function add()
{
var ress=document.forms[0].luxiaoqing.value
window.location="view-source:"+ress;
}
</SCRIPT>
输入要查看源代码的URL地址:
<FORM><input type="text" name="luxiaoqing" size=40 value="http://"></FORM>
<FORM><br>
<INPUT type="button" value="查看源代码" onClick=add()>
</FORM>


51、title显示日期
把如下代码加入<body>区域中:
<script language="JavaScript1.2">
<!--hide
var isnMonth = new
Array("1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月");
var isnDay = new
Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六","星期日");
today = new Date () ;
Year=today.getYear();
Date=today.getDate();
if (document.all)
document.title="今天是: "+Year+"年"+isnMonth[today.getMonth()]+Date+"日"+isnDay[today.getDay()]
//--hide-->
</script>


52、显示所有链接
把如下代码加入<body>区域中
<script language="JavaScript1.2">
<!--
function extractlinks(){
var links=document.all.tags("A")
var total=links.length
var win2=window.open("","","menubar,scrollbars,toolbar")
win2.***("<font size='2'>一共有"+total+"个连接</font><br>")
for (i=0;i<total;i++){
win2.***("<font size='2'>"+links[i].outerHTML+"</font><br>")
}
}
//-->
</script>
<input type="button" onClick="extractlinks()" value="显示所有的连接">


53、回车键换行
把如下代码加入<body>区域中
<script type="text/javascript">                
function handleEnter (field, event) {
   var keyCode = event.keyCode ? event.keyCode : event.which ?
event.which : event.charCode;
   if (keyCode == 13) {
    var i;
    for (i = 0; i < field.form.elements.length; i++)
     if (field == field.form.elements[i])
      break;
    i = (i + 1) % field.form.elements.length;
    field.form.elements[i].focus();
    return false;
   } 
   else
   return true;
}      
</script>
<form>
<input type="text" onkeypress="return handleEnter(this, event)"><br>
<input type="text" onkeypress="return handleEnter(this, event)"><br>
<textarea>回车换行


54、确认后提交
把如下代码加入<body>区域中
<SCRIPT LANGUAGE="JavaScript">
<!--
function msg(){
if (confirm("你确认要提交嘛！"))
document.lnman.submit()
}
//-->
</SCRIPT>
<form name="lnman" method="post" action="">
   <p>
     <input type="text" name="textfield" value="确认后提交">
   </p>
   <p>
     <input type="button" name="Submit" value="提交" onclick="msg();">
   </p>
</form>


55、改变表格的内容
把如下代码加入<body>区域中
<script ***script>
var arr=new Array()
arr[0]="一一一一一";
arr[1]="二二二二二";
arr[2]="三三三三三";
</script>
<select onchange="zz.cells[this.selectedIndex].innerHTML=arr[this.selectedIndex]">
   <option value=a>改变第一格</option>
   <option value=a>改变第二格</option>
   <option value=a>改变第三格</option>
</select>
<table id=zz border=1>
   <tr height=20>
     <td width=150>第一格</td>
<td width=150>第二格</td>
<td width=150>第三格</td>
   </tr>
</table>

56获取当前浏览器地址URL:
<script language=”JavaScript”>
var myURL = document.URL;
window.alert(myURL);
</script>

57定时执行函数
<script>
<!--
function hello() 
{ 
window.alert(“Hello”);
window.setTimeout(“hello()”,5000);
}
window.setTimeout(“hello()”,5000);
// -->
</script>

58取消定时执行
<script>
<!--
function hello() 
{ 
window.alert(“Hello”);
}
var myTimeout = window.setTimeout(“hello()”,5000);
window.clearTimeout(myTimeout);
// -->
</script>

59读取URL参数
<script language=”JavaScript”>
var urlParts = document.URL.split(“?”);
var parameterParts = urlParts[1].split(“&”);
for (i = 0; i < parameterParts.length; i++) 
{ 
var pairParts = parameterParts[i].split(“=”);
var pairName = pairParts[0];
var pairValue = pairParts[1];
document.write(pairName + “ ：“ +pairValue );
}
</script>

60读取图像属性
<img src="/image1.jpg" name=”myImage”>
<a href=”# ” onClick=”window.alert(document.myImage.width)”>Width</a>

61创建幻灯片
<script language=”JavaScript”>
var imageList = new Array;
imageList[0] = new Image;
imageList[0].src = “image1.jpg”;
imageList[1] = new Image;
imageList[1].src = “image2.jpg”;
imageList[2] = new Image;
imageList[2].src = “image3.jpg”;
imageList[3] = new Image;
imageList[3].src = “image4.jpg”;
function slideShow(imageNumber) {
document.slideShow.src = imageList[imageNumber].src;
imageNumber += 1;
if (imageNumber < imageList.length) {
window.setTimeout(“slideShow(“ + imageNumber + “)”,3000);
}
}
</script>
</head>
<body onLoad=”slideShow(0)”>
<img src="/”image1.jpg"” width=100 name=”slideShow”>