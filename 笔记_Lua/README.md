## 准备

1. 软件
  * [Lua for Windows v5.1.4-45 官方安装版](http://www.cr173.com/soft/44725.html)
  * [英文官网-下载页](http://www.lua.org/download.html)

2. 学习链接
  * [英文官网-源码与用户手册](http://www.lua.org/ftp/)
  * [中国官网](http://www.luaer.cn/)
  * [网文-lua脚本入门](http://job.17173.com/content/2009-01-22/20090122143452606,1.shtml)

## 基本知识点

### 注释

1. 单行注释
  ```
  print("hello"); -- 打印你好
  ```

1. 多行注释
  ```
  --[[
  打印
  你好
  ]]
  print("hello");
  ```

  * `--`和`[[`之间不能有空格
  * 如果多行注释中有两个`[[`或`]]`，请用转义替换`\[\[`或`\]\]`

### 条件语句

#### if 语句
if ... then ... elseif ... then ... else ... end
```
if a == 1 then
  print("1")
elseif a == 2 then
  print("2")
else
  print("other")
end
```

#### while 语句

while ... do ... end
```
while a < len do
  print(a)
  a++;
end
```

#### repeat 语句
repeat ... until ...
```
repeat
  print（a）;
  a--;
until a < len
```

#### for 语句（[讲解1](http://blog.csdn.net/dawn_moon/article/details/7916760)）

1. 数字型：for 变量 = 初值, 终点值[, 步长] do … end

	```
  arr = {"hello", 2};

  for i = 0, 2, 1 do
    print(arr[i]);
  end

  --[[
  输出：
  nil
  hello
  2
  ]]
  ```

  * 步长为可选值，默认为 1

2. 泛型：for 变量1, 变量2, ... , 变量N in表或枚举函数 do … end

  ```
  days = {"Suanday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}

  for i, v in ipairs(days) do print("i : "..i.."; v : "..v) end

  --[[
  输出：
  i : 1; v : Suanday
  i : 2; v : Monday
  i : 3; v : Tuesday
  i : 4; v : Wednesday
  i : 5; v : Thursday
  i : 6; v : Friday
  i : 7; v : Saturday
  ]]
  ```

### 语句块

```
do print("Hello") end

do
  a = a + 1;
  b = b + 1;
  print(a + b);
end
```

### 赋值语句

```
a, b, c, d = 1, 2, 3, 4

a, b = b, a -- a 与 b 的值互换

local a,b,c = 1,2,3 -- a,b,c都是局部变量
```

### 数值运算

| 符号 | 解释 | 事例 |
|-|-|-|
| + | 加 | 1 + 1 == 2 |
| - | 减 | 1 - 1 == 0 |
| * | 乘 | 1 * 1 == 1 |
| / | 除 | 1 / 1 == 1 |
| ^ | 指数乘方运算 | 2 ^ 3 == 8 |
| .. | 字符串连接符 | "hello".." world" == "hello world" |

### 比较运算

| 符号 | 解释 |
|-|-|
| < | 小于 |
| > | 大于 |
| <= | 小于等于 |
| >= | 大于等于 |
| == | 相等 |
| ~= | 不相等 |

所有这些操作符总是返回true或false。

Table， Function 和 Userdata 类型的数据，只有 == 和 ~=

```
a={1,2}
b=a
print(a==b, a~=b) -- true, false
a={1,2}
b={1,2}
print(a==b, a~=b) -- false, true
```

### 逻辑运算符

| 符号 | 解释 |
|-|-|
| and | 与 |
| or | 或 |
| not | 否 |

1. 在Lua中，只有false和nil才计算为false，其它任何数据都计算为true，0也是true！

1. and 和 or的运算结果不是true和false，而是和它的两个操作数相关。
  * a and b：如果a为false，则返回a；否则返回b
  * a or b：如果 a 为true，则返回a；否则返回b

```
print(4 and 5) --> 5
print(nil and 13) --> nil
print(false and 13) --> false
print(4 or 5) --> 4
print(false or 5) --> 5
```

模拟C语言中的语句：x = a ? b : c，在Lua中，可以写成：`x = a and b or c`

`x = x or v`，它相当于：`if not x then x = v end`

运算符优先级，从高到低顺序如下
```
not - （一元运算）
* /
+ -
..（字符串连接）
< > <= >= ~= ==
and
or
```

### 关键字

|-|-|-|-|-|-|-|
|-|-|-|-|-|-|-|
| and | break | do | else | elseif | end | false |
|  for | function | if | in | local | nil | not |
|  or | repeat | return | then | true | until | while |

### 变量类型

| 变量 | 说明 | 事例 |
|-|-|-|
| Nil | 空值，所有没有使用过的变量，都是nil。nil既是值，又是类型。 | a = nil; |
| Boolean | 布尔值 | a = true, b = false; |
| Number | 数值，在Lua里，数值相当于C语言的double | a = 0.1 |
| String | 字符串，如果你愿意的话，字符串是可以包含'\0'字符的 | a = "hello" |
| Table | 关系表类型，这个类型功能比较强大，我们在后面慢慢说。 | a = {1,2,h="mc"} |
| Function | 函数类型，不要怀疑，函数也是一种类型，也就是说，所有的函数，它本身就是一个变量。 | - |
| Userdata | 嗯，这个类型专门用来和Lua的宿主打交道的。宿主通常是用C和C++来编写的，在这种情况下，Userdata可以是宿主的任意数据类型，常用的有Struct和指针| - |
| Thread | 线程类型，在Lua中没有真正的线程。Lua中可以将一个函数分成几部份运行。如果感兴趣的话，可以去看看Lua的文档。 | - |

### 变量定义

#### 全局变量与局部变量

```
a = 1; -- 全局变量 a
do
  local a = 3; -- 局部变量 a
  print(a); -- 3
end
print(a); -- 1
```

#### 转义字符

| 名称 | 说明 |
|-|-|
| `\a` | bell |
| `\b` | back space |
| `\f` | form feed |
| `\n` | newline |
| `\r` | carriage return |
| `\t` | horizontal tab |
| `\v` | vertical tab |
| `\\` | backslash |
| `\"` | double quote |
| `\'` | single quote |
| `\[` | left square bracket |
| `\]` | right square bracket |

#### 多行字符

```
page = [[
  <HTML>
    <HEAD>
      <TITLE>An HTML Page</TITLE>
    </HEAD>
    <BODY>
      <A HREF="http://www.lua.org">Lua</A>
        \[\[a text between double brackets\]\]
    </BODY>
  </HTML>
]]
```

在这种字符串中，如果含有单独使用的"[["或"]]"就仍然得用"\["或"\]"来避免歧义

### Table 类型

在Lua中，你可以用任意类型来作数组(table)的索引，除了nil
在Lua中，你也可以用任意类型的值来作数组的内容，除了nil

```
T1 = {} -- 定义一个空表

T1[1] = 10 -- 然后我们就可以象C语言一样来使用它了。
T1["John"] = {Age = 27, Gender = "Male"}
--[[
  这一句相当于：
  T1["John"] = {} -- 必须先定义成一个表，还记得未定义的变量是nil类型吗
  T1["John"]["Age"] = 27
  T1["John"]["Gender"] = "Male"
]]

-- 当表的索引是字符串的时候，我们可以简写成：
T1.John = {}
T1.John.Age = 27
T1.John.Gender = "Male"

-- 或
T1.John = {Age=27, Gender="Male"}
```

一下同上

```
T1=
{
  10, -- 相当于 [1] = 10
  [100] = 40,
  John = -- 如果你原意，你还可以写成：["John"] =
  {
    Age = 27, -- 如果你原意，你还可以写成：["Age"] = 27
    Gender = Male -- 如果你原意，你还可以写成：["Gender"] = Male
  },
  20 -- 相当于 [2] = 20
}
```

需要注意三点：
* 第一，所有元素之间，总是用逗号 "," 隔开；
* 第二，所有索引值都需要用 "[" 和 "]" 括起来；如果是字符串，还可以去掉引号和中括号；
* 第三，如果不写索引，则索引就会被认为是数字，并按顺序自动从 1 往后编；

表类型的构造是如此的方便，以致于常常被人用来代替配置文件。是的，不用怀疑，它比ini文件要漂亮，并且强大的多。

Lua对Table占用内存的处理是自动的, 如下面这段代码
```
a = {}
a["x"] = 10
b = a -- 'b' refers to the same table as 'a'
print(b["x"]) --> 10
b["x"] = 20
print(a["x"]) --> 20
a = nil -- now only 'b' still refers to the table
b = nil -- now there are no references left to the table

-- b和a都指向相同的table, 只占用一块内存, 当执行到a = nil时, b仍然指向table,
-- 而当执行到b=nil时, 因为没有指向table的变量了, 所以Lua会自动释放table所占内存
```

### Function 类型

```
-- 写法 1
function add(a, b) -- add 是函数名字，a 和 b 是参数名字
  return a + b -- return 用来返回函数的运行结果
end

-- 写法 2
add = function(a, b) return a + b end

-- 写法 3 （多参数型）
add = function(a, ...) return a + arg[1] end

-- 写法 4 （多参数型）
add = function(...) return arg[1] + arg[2] end
```

使用多参数型时，想取得 "..." 所代表的参数，可以在函数中访问arg局部变量（表类型）得到，第一个参数为 arg[1]，第二个参数为 arg[2]，后面的如此类推

Function 也可以同时返回多个结果

```
function s()
  return 1, 2, 3, 4
end

a, b, c, d = s() -- 此时，a = 1, b = 2, c = 3, d = 4
```

### 面向对象(但不存在继承...)

```
t =
{
  Age = 27
  add = function(self, n) self.Age = self.Age+n end
}
print(t.Age) -- 27
t.add(t, 10)
print(t.Age) -- 37

-- 不过，t.add(t,10) 这一句实在是有点土对吧？没关系，在Lua中，你可以简写成：
t:add(10) -- 相当于 t.add(t,10)
```


## 扩展

### 将 lua 脚本编译成可执行文件（[链接](http://blog.chinaunix.net/uid-579398-id-2733576.html)）

到 http://wxlua.sourceforge.net/ 下载最新的win32 binary 包, 目前最新版为 2.8.7.0, 对应的包为: wxLua-2.8.7.0-MSW-bin.zip

解压到某目录(如: C:\), 方便起见, 将 C:\wxLua\bin 添加到系统环境变量 %path%, 这样做能延长键盘寿命.
在 C:\wxLua\bin\ 下建立一个批处理文件 clua.cmd 内容如下:

`wxlua C:\wxLua\bin\wxluafreeze.lua C:\wxLua\bin\wxluafreeze.exe %1 %2`

以后需要编译脚本成 .exe 时, 只需要在命令提示符下输入 "clua xxx.lua xxx.exe" 就可生成对应的 .exe 程序了.


### LuaDoc 3.0.1 Lua源代码文档生成工具（[链接](http://blog.csdn.net/akof1314/article/details/7688990)）