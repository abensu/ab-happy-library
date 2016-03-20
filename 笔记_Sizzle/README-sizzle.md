# Sizzle


## 简介

* jQuery 默认使用的元素选择器

* 浏览器支持 IE 6+, Firefox 3+, Safari 3+, Chrome 4+, and Opera 10+


## 原理

* **优先使用浏览器原生方法**（querySelectorAll / getElementById / getElementsByTag / getElementsByClassName）,不支持则使用 Sizzle 自身方法

* **使用缓存机制**，当第一次执行 `sizzle(selector)` 后，会缓存相关的匹配函数、分词结果等，到之后再使用会优先提取缓存中的结果

> 来自[《Sizzle效率高的原因分析》中“Sizzle原理”一节](http://www.haogongju.net/art/2539481)，对原文有删改


## 使用建议

1. 多用 ID 选择器 , 总是从 `#id` 选择器来继承

  ```
  // 快
  $("#demo li:nth-child(1)") // 先匹配所有 li 元素，再匹配 #demo

  // 非常快
  $("#demo").find("li:nth-child(1)") // 先匹配 #demo，再从中找匹配 li
  ```

2. 右边描述比左边具体 <= sizzle 对 css 字符串的匹配方向是 **从右到左**

  ```
  // 未优化
  $( "div.data .gonzalez" );

  // 优化
  $( ".data td.gonzalez" );
  ```

3. 避免过度的特征描述 <= 减少字符块从而减少过滤次数

  ```
  $( ".data table.attendees td.gonzalez" );

  // 如果可以的话，删除中间部分更好
  $( ".data td.gonzalez" );
  ```

4. 避免全局选择器 <= 与 2 同理

  ```
  $( ".buttons > *" );          // 非常消耗
  $( ".buttons" ).children();   // 比上面好些

  $( ".category :radio" );      // 隐式的全局选择器
  $( ".category *:radio" );     // 效果同上
  $( ".category input:radio" ); // 比上面好些
  ```

5. 尽量使用 sizzle 独立支持的写法

  * $("input:text") 效率高于 $("input[type='text']")

6. 少直接使用 class 选择器，多与 tag 配合使用

7. 多用父子关系，少用嵌套关系 <= 因为 ">" 是 child 选择器，只从子节点里匹配，不递归；而 " " 是后代选择器，递归匹配所有子节点及子节点的子节点，即后代节点

8. $parent.find('.child')为最佳选择 <= 由于$parent往往在前面的操作已经生成，jQuery会进行缓存，所以进一步加快了执行速度

  | 速度排名 | 表达式 | 说明 | 与最快的速度差距 |
  |-|-|-|-|
  | 1 | $parent.find('.child') | .find()方法会调用浏览器的原生方法（getElementById，getElementByName，getElementByTagName等等），所以速度较快 | 0% |
  |-|-|-|-|
  | 2 | $('.child', $parent) | jQuery会自动把这条语句转成$.parent.find('child')，这会导致一定的性能损失 | 5%~10% |
  |-|-|-|-|
  | 3 | $('.child', $('#parent')) | jQuery内部会将这条语句转成$('#parent').find('.child') | 23% |
  |-|-|-|-|
  | 4 | parent.children('.child') | 这条语句在jQuery内部，会使用$.sibling()和javascript的nextSibling()方法，一个个遍历节点 | 50% |
  |-|-|-|-|
  | 5 | $('#parent > .child') |  jQuery内部使用Sizzle引擎，处理各种选择器。Sizzle引擎的选择顺序是从右到左，所以这条语句是先选.child，然后再一个个过滤出父元素#parent | 70% |
  |-|-|-|-|
  | 6 | $('#parent .child') | 上一条只选择直接的子元素，这一条可以于选择多级子元素，所以它的速度更慢 | 77% |

9. 缓存 jQuery 对象

  * 通过链式调用，采用find(),end(),children(),has,filter()等方法，来过滤结果集，减少$()查找方法调用，提升性能

  ```
  $('#news').find('tr.alt').removeClass('alt').end().find('tbody').each(function() {
      $(this).children(':visible').has('td').filter(':group(3)').addClass('alt');
  });
  ```

  * 通过声明$news变量缓存$(‘#news’)结果集，从而提升后面结果集对象调用方法的性能

  ```
  var $news = $('#news');

  $news.find('tr.alt').removeClass('alt');
  $news.find('tbody').each(function() {
      $(this).children(':visible').has('td').filter(':group(3)').addClass('alt');
  });
  ```

___

> 来自[《Sizzle效率高的原因分析》中“选择器性能优化建议”一节](http://www.haogongju.net/art/2539481)，对原文有删改

> 来自[《Optimize Selectors》](http://learn.jquery.com/performance/optimize-selectors/)，对原文有删改