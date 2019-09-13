## 事件
#### 事件基础
JS是以事件驱动来实现页面交互，与HTML之间的交互是通过事件实现的，事件是将JS与网页联系在一起的主要方式。

事件驱动的核心是以消息为基础，以事件为驱动。事件是文档或浏览器窗口中发生的一些特定的交互行为。可以使用侦听器来预定事件，以便事件发生时执行相应的代码。当事件发生时，浏览器会自动生成事件对象（event），并沿着DOM节点有序进行传播，直到被脚本捕获。这种观察模式确保了JS与HTML保持松耦合的关系。

在使用事件时，需要考虑如下一些内存与性能方面的问题：
1. 有必要限制一个页面中事件处理程序的数量，数量太多或占用大量的内存，而且会让用户感觉页面反映不够灵敏；
2. 建立在事件冒泡机制之上的事件委托技术，可以有效减少事件处理程序的时间；
3. 建议在浏览器卸载页面之前移除所有事件处理程序。
#### 事件流
事件流描述的是从页面中接收事件的顺序。

IE的事件流是事件冒泡流，Netscape的事件流是事件捕获流。
###### 事件冒泡
事件开始时由最具体的元素（文档中嵌套最深的节点）接受，然后逐级向上传播到较为不具体的节点。
###### 事件捕获
不太具体的节点最早接收到事件，而具体的节点 最后接收到事件。
#### 事件对象
在DOM上触发某个事件，会产生一个事件对象event，这个对象包含所有与对象有关的信息。

<center>事件属性和方法 </center>

|属性方法|类型|说明|
|:----|:----:|:----|
|bubbles|Boolean|用来表示该事件是否在DOM中冒泡|
|cancelBubble|Boolean|表示这个事件是否可以取消|
|currentTarget|Element|当前注册事件的对象引用，这个值会在事件中传递的过程中改变|
|defaultPrevented|Boolean|是否已经阻止默认行为|
|detail|Interger|指示事件正在处理阶段：1.表示捕获阶段；2.表示“处于目标”；3.表示冒泡阶段|
|preventDefault()|Function|取消事件（如果该事件可以取消）|
|stopPropagation()|Function|通过在一个事件处理程序返回当前设置这个属性的值为真，来阻止事件冒泡|
|stopImmediatePropagation()|Function|取消事件的进一步捕获或冒泡，同时阻止任何事件处理程序被调用|
|target|Element|对事件起源目标的引用|
|type|String|Event事件的类型（不区分大小写）|
|deepPath|Array|一个由事件流经过了的DOMNODE组成的Array|
|returnValue|Boolean|旧版本IE相当于Event.preventDefault()和Event.defaultPreventd|
|srcElement|Element|旧版本的IE相当于Event.target|

在事件处理程序内部，对象this始终等于currentTarget的值，而target则只包含事实的实际目标。
###### IE中的事件对象
与访问DOM中的event对象不同，要访问IE中的event对象，有几种不同的方式，取决于指定事件处理程序的方法。

<center>IE event对象属性与方法</center>

|属性/方法|类型|读/写|说明|
|:----:|:----:|:----:|:----|
|cancelBubble|Boolean|读/写|默认值为false，但将其设置为true就可以取消事件冒泡（与DOM中的stopProPagation()方法的作用相同）|
|returnValue|Boolean|读/写|默认值为true，但将其设置为false就可以取消事件的默认行为（与DOM中的preventDefault()方法的作用相同|
|srcElement|Element|只读|事件的目标（与DOM中的target属性相同）|
|type|String|只读|被触发事件的类型|

###### 跨浏览器的事件对象
IE中的event对象的全部信息和方法，DOM对象中全都有，只不过实现方法不一样，可以通过以下方法来实现跨浏览器兼容。
```javascript
var EventUtil = {
    // 事件绑定通用程序
    addHandler = (element,type, handler) => {
        // 针对标准浏览器，如chrome、Firefox、Opera、Safari
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            // IE5~IE8的事件注册方法
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    },
    // 获取事件对象
    getEvent = (event) => {
        return event ? event : window.event;
    },
    // 获取触发事件目标元素
    getTarget = (event) => {
        return event.target || event.srcElement;
    },
    // 阻止事件的默认行为
    preventDefault = (event) => {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    // 阻止事件流
    stopPropagation = (event) => {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    // 事件移除通用程序
    removeHandler = (element, type, handler) => {
        if (element.addEventListener) { 
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }    
    },
}
```
#### 共享onload事件
在HTML文档未完成加载前，DOM是不完整的，此时执行脚本操作DOM无法正常工作。应该确认在网页加载完毕之后立即执行脚本，网页加载完毕之后会触发一个onload事件，这个事件与window相关。 

在页面加载完成后由多个函数执行，使代码将函数function1和function2逐一绑定到onload事件上，则会导致最后的那个函数才会被实际执行，代码如下：

```javascript
window.onload = function1;
window.onload = function2;
```

为此，一种弹性最佳的解决方案是通过编写`addLoadEvent`函数，把多个函数绑定到`window.onload`事件，代码如下

```javascript
function addLoadEvent (func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}
```

函数实现步骤：把现有的`window.onload`事件处理函数的值存入变量`oldonload`，如果这个处理函数上还没有绑定任何函数，则把新函数添加给它，如果这个处理函数已经绑定了一些函数，则把新函数追加到现有指令的末尾。使用该函数，无论页面加载完毕要执行多少个函数，只要多写一条语句即可。

#### 事件委托
当页面中存在大量绑定事件处理器的元素时，web应用前端的性能会变差，页面代码变得冗长，运行执行时间变长。一个简单优雅的处理DOM事件的技术是事件委托，它基于事件处理模型，事件逐层冒泡并能被父级元素捕获。使用事件代理，只需给外层元素绑定一个处理器，就可以处理其子元素上出发的所有事件，示例代码如下：

```html
<div id="content">
    <ul id="menu">
        <li><a href="menu1.html"></a></li>
        <li><a href="menu2.html"></a></li>
        <li><a href="menu3.html"></a></li>
    </ul>
</div>
```

事件委托JS示例代码如下：

```javascript
document.getElementById('menu').onclick = e => {
    e = e || window.event;
    var target = e.target || e.srcElement;
    var pageid, hrefURL;
    if (target.nodeName !== "A") {
        return;
    }
    hrefURL = target.href.split('/');
    pageid = hrefURL[hrefURL.length - 1];
    pageid = pageid.replace('.html','');
    if (typeof e.preventDefault === 'function') {
        e.preventDefault();
        e.stopPropagation();
    } else {
        e.returnValue = false;
        e.cancelBubble = true;
    }
}
```
 
当页面中存在大量元素都需要绑定同一个事件处理的时候，这种情况可能会影响性能。每绑定一个事件都加重了页面的负担或者是运行期间的负担。对于一个富前端的应用，页面上需要建立大量的交互行为，过多的绑定会占用过多内存。一个简单优雅的方式就是 事件委托，它是基于事件的工作流：逐层捕获，到达目标，逐层冒泡。可以通过给外层绑定事件，来处理所有的子元素触发的事件，示例代码如下：

```javascript
var table = document.getElementsByTagName('table')[0];
table.addEventListener('mouseover', e => {
    var target = e.target.parentNode;
    cconsole.log(target);
    if (target.nodeName !== 'TR') {
        return;
    }
    target.style.cssText = "background-color: '#234ab7'; color: '#fff'; font-weight:'bold';";
}, false);
table.addEventListener('mouseout', e => {
    var target = e.target.parentNode;
    if (target.nodeName !== 'TR') {
        return;
    }
    target.style.cssText = "";
}, false);
```

#### 事件类型
+ UI(User Interface, 用户界面)事件，当用户与页面上的元素交互时触发
+ 焦点事件，当元素获得或失去焦点时触发
+ 鼠标事件，当用户通过鼠标在页面上执行操作时触发
+ 文本事件，当在文档中输入文本时触发
+ 键盘事件，当用户通过键盘在页面上执行操作时触发
+ 合成事件，当为IME(Input Method Editor，输入法编辑器)输入字符时触发
+ 变动(mutation)事件，当底层DOM结构发生变化时触发
###### UI事件
|事件名称|说明|
|:---:|:---|
|load|当页面完全（包括图像、JS、CSS文件等外部资源）加载后在window上面触发，当所有框架都加载完毕时在框架集上面触发，当图像加载完毕时在`<img>`上面触发，或者当嵌入的内容加载完毕时在`<object>`元素上面触发|
|unload|页面完全卸载后在window上面触发。当所有框架都卸载后在框架集上面触发，或者当嵌入的内容写在完毕后在`<object>`元素上面触发|
|abort|当用户 停止下载过程中，如果潜入的内容没有加载完，则在`<object>`元素上面触发|
|error|当发生JS错误时在window上面触发。当无法加载图像时在`<img>`上面触发，当无法加载嵌入内容时在`<object>`元素上面触发，或者当有一个或多个框架无法加载时在框架集上面触发|
|select|当用户选择文本框(`<input>`或`<texterea>`)中的一个或多个字符时触发|
