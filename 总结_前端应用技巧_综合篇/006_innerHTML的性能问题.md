## innerHTML的性能问题

```
    function replaceHtml(el, html) {  
        var oldEl = typeof el === "string" ? document.getElementById(el) : el;  
        /*@cc_on // Pure innerHTML is slightly faster in IE 
            oldEl.innerHTML = html; 
            return oldEl; 
        @*/  
        var newEl = oldEl.cloneNode(false);  
        newEl.innerHTML = html;  
        oldEl.parentNode.replaceChild(newEl, oldEl);  
        /* Since we just removed the old element from the DOM, return a reference 
        to the new element, which can be used to restore variable references. */  
        return newEl;  
    };  
```

用这个函数来代替innerHTML后在不同浏览器中的性能表现为：

```
Safari 3:

    5000 elements…
        innerHTML (destroy only): 63ms
        innerHTML (create only): 390ms
        innerHTML (destroy & create): 484ms

        replaceHtml (destroy only): 47ms (1.3x faster)
        replaceHtml (create only): 15ms (26.0x faster)
        replaceHtml (destroy & create): 62ms (7.8x faster)
    Done.

    10000 elements…
        innerHTML (destroy only): 110ms
        innerHTML (create only): 3500ms
        innerHTML (destroy & create): 4735ms

        replaceHtml (destroy only): 110ms (~ same speed)
        replaceHtml (create only): 31ms (112.9x faster)
        replaceHtml (destroy & create): 141ms (33.6x faster)
    Done.

Firefox 3:

    5000 elements…
        innerHTML (destroy only): 863ms
        innerHTML (create only): 522ms
        innerHTML (destroy & create): 1421ms

        replaceHtml (destroy only): 20ms (43.1x faster)
        replaceHtml (create only): 225ms (2.3x faster)
        replaceHtml (destroy & create): 239ms (5.9x faster)
    Done.

    10000 elements…
        innerHTML (destroy only): 5521ms
        innerHTML (create only): 2626ms
        innerHTML (destroy & create): 8528ms

        replaceHtml (destroy only): 39ms (141.6x faster)
        replaceHtml (create only): 373ms (7.0x faster)
        replaceHtml (destroy & create): 422ms (20.2x faster)
    Done.

Opera 9.5:

    5000 elements…
        innerHTML (destroy only): 16ms
        innerHTML (create only): 141ms
        innerHTML (destroy & create): 94ms

        replaceHtml (destroy only): 16ms (~ same speed)
        replaceHtml (create only): 78ms (1.8x faster)
        replaceHtml (destroy & create): 125ms (1.3x slower)
    Done.

    10000 elements…
        innerHTML (destroy only): 31ms
        innerHTML (create only): 156ms
        innerHTML (destroy & create): 312ms

        replaceHtml (destroy only): 31ms (~ same speed)
        replaceHtml (create only): 203ms (1.3x slower)
        replaceHtml (destroy & create): 157ms (2.0x faster)
    Done.

IE7:

    1000 elements…
        innerHTML (destroy only): 0ms
        innerHTML (create only): 0ms
        innerHTML (destroy & create): 0ms

        replaceHtml (destroy only): 0ms (~ same speed)
        replaceHtml (create only): 0ms (~ same speed)
        replaceHtml (destroy & create): 0ms (~ same speed)
    Done.

    15000 elements…
        innerHTML (destroy only): 31ms
        innerHTML (create only): 156ms
        innerHTML (destroy & create): 172ms

        replaceHtml (destroy only): 32ms (~ same speed)
        replaceHtml (create only): 157ms (~ same speed)
        replaceHtml (destroy & create): 188ms (1.1x slower)
    Done. 
```

[来源](http://lveyo.iteye.com/blog/182891)
[其来源参考的 e 文来源](http://blog.stevenlevithan.com/archives/faster-than-innerhtml)


## 浅析 innerHTML 性能优化的原理

浏览器在 el.innerHTML = newHTML 时所做的工作:

====================================
原始方法

1) 创建一个fragment(document碎片)
2) 将 newHTML 设置到 fragment 内部 (这里怎么设置的不必关心,反正不是用的innerHTML 呵呵)
3) 清除el下的所有子节点 ,  类似 el.removeChildren()
4) 将fragment加入到 el内, 类似 el.appendChild(fragment) 

====================================
文章里的新方法

1)克隆el节点(不包含子节点),相当于
newEl=document.createElement(el.tagName);
然或将el的所有属性赋值给 newEl  (通过 el.getAttribute  newEl.setAttribute)

2) 创建一个fragment(document碎片)
3) 将 newHTML 设置到 fragment 内部 (这里怎么设置的不必关心,反正不是用的innerHTML 呵呵)
4) 清除 newEl 下的所有子节点 ,  类似 newEl.removeChildren()
5) 将 fragment 加入到 newEl 内, 类似 newEl.appendChild(fragment)
6) 用 fragment 替换 el. 相当于 el.parentNode.replaceChild(newEl, el);

新方法看起来比原始方法更麻烦, 但是为什么速度会更快呢?

关键点就是在 新方法的步骤 4 5 6 .
首先看4:
newEl 是clone的el,但是没有子结点,所以removeChildren很快就返回.相当于没有执行.
而且就算newEL有子结点,由于newEl不是一个在dom树里的节点, 也省去了其中复杂的一步

而 el.removeChildren 这个操作 相比之下自然要耗时很多.原因有三:removeChild操作比较复杂;el有子节点;el和el的子结点都在dom树内.

再来看5
newEl 和 fragment 本身都是脱离dom树独立存在的,这个操作速度也要比el.appendChild(fragment)快.

再来看6. 
6的操作就是 在el.parentNode中移除el,然后再在原始位置加入newEl. 这个步骤并没有速度优势.
但是 4 5 6这3个操作加起来,当el和newHTML足够复杂时,还是要比原始方法的 3 4 步更快


(来源)[http://fins.iteye.com/blog/183373]