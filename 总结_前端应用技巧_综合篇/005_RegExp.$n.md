```
var newLine = "<br />";

var re = /(\w+)@(\w+)\.(\w+)/g
var src = "Please send mail to george@contoso.com and someone@example.com. Thanks!"

var result;
var s = "";

// Get the first match.
result = re.exec(src);

while (result != null) {
    // Show the entire match.
    s += newLine;

    // Show the match and submatches from the RegExp global object.
    s += "RegExp.lastMatch: " + RegExp.lastMatch + newLine;
    s += "RegExp.$1: " + RegExp.$1 + newLine;
    s += "RegExp.$2: " + RegExp.$2 + newLine;
    s += "RegExp.$3: " + RegExp.$3 + newLine;

    // Show the match and submatches from the array that is returned
    // by the exec method.
    for (var index = 0; index < result.length; index++) {
        s +=  index + ": ";
        s += result[index];
        s += newLine;
    }

    // Get the next match.
    result = re.exec(src);
}
document.write(s);

// Output:
//  RegExp.lastMatch: george@contoso.com
//  RegExp.$1: george
//  RegExp.$2: contoso
//  RegExp.$3: com
//  0: george@contoso.com
//  1: george
//  2: contoso
//  3: com

//  RegExp.lastMatch: someone@example.com
//  RegExp.$1: someone
//  RegExp.$2: example
//  RegExp.$3: com
//  0: someone@example.com
//  1: someone
//  2: example
//  3: com
```

每当产生一个带括号的成功匹配时，$1...$9 属性的值就被修改。 可以在一个正则表达式模式中指定任意多个带括号的子匹配，但只能存储最新的九个。

> 每轮匹配最多存9个括号匹配项，每轮匹配都会重新重置 RegExp.$n，最终结束后，RegExp会保存最后一轮的匹配

IE在以下文档模式中受支持：Quirks、Internet Explorer 6 标准模式、Internet Explorer 7 标准模式、Internet Explorer 8 标准模式、Internet Explorer 9 标准模式、Internet Explorer 10 标准模式和 Internet Explorer 11 标准模式。此外，也在应用商店应用（Windows 8 和 Windows Phone 8.1）中受支持。

其他主流浏览器也支持。

来源：[http://msdn.microsoft.com/zh-cn/library/24th3sah%28v=VS.94%29.aspx](http://msdn.microsoft.com/zh-cn/library/24th3sah%28v=VS.94%29.aspx)