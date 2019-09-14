## 事件
#### 事件基础
JS是以事件驱动来实现页面交互，与HTML之间的交互是通过事件实现的，事件是将JS与网页联系在一起的主要方式。

事件驱动的核心是以消息为基础，以事件为驱动。事件是文档或浏览器窗口中发生的一些特定的交互行为。可以使用侦听器来预定事件，以便事件发生时执行相应的代码。当事件发生时，浏览器会自动生成事件对象（`event`），并沿着DOM节点有序进行传播，直到被脚本捕获。这种观察模式确保了JS与HTML保持松耦合的关系。

在使用事件时，需要考虑如下一些内存与性能方面的问题：
1. 有必要限制一个页面中事件处理程序的数量，数量太多或占用大量的内存，而且会让用户感觉页面反映不够灵敏；
2. 建立在事件冒泡机制之上的事件委托技术，可以有效减少事件处理程序的时间；
3. 建议在浏览器卸载页面之前移除所有事件处理程序。
#### 事件流
事件流描述的是从页面中接收事件的顺序。

IE的事件流是事件冒泡流，Netscape的事件流是事件捕获流。
##### 事件冒泡
事件开始时由最具体的元素（文档中嵌套最深的节点）接受，然后逐级向上传播到较为不具体的节点。
##### 事件捕获
不太具体的节点最早接收到事件，而具体的节点 最后接收到事件。
#### 事件对象
在DOM上触发某个事件，会产生一个事件对象event，这个对象包含所有与对象有关的信息。

事件属性和方法

|属性方法|类型|说明|
|:---|:---:|:---|
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
|returnValue|Boolean|旧版本IE相当于`Event.preventDefault()`和`Event.defaultPreventd`|
|srcElement|Element|旧版本的IE相当于`Event.target`|

在事件处理程序内部，对象this始终等于`currentTarget`的值，而`target`则只包含事实的实际目标。
##### IE中的事件对象
与访问DOM中的event对象不同，要访问IE中的event对象，有几种不同的方式，取决于指定事件处理程序的方法。

<center>IE event对象属性与方法</center>

|属性/方法|类型|读/写|说明|
|:---:|:---:|:---:|:---|
|cancelBubble|Boolean|读/写|默认值为false，但将其设置为true就可以取消事件冒泡（与DOM中的`stopProPagation()`方法的作用相同）|
|returnValue|Boolean|读/写|默认值为true，但将其设置为false就可以取消事件的默认行为（与DOM中的`preventDefault()`方法的作用相同|
|srcElement|Element|只读|事件的目标（与DOM中的`target`属性相同）|
|type|String|只读|被触发事件的类型|

##### 跨浏览器的事件对象
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
在HTML文档未完成加载前，DOM是不完整的，此时执行脚本操作DOM无法正常工作。应该确认在网页加载完毕之后立即执行脚本，网页加载完毕之后会触发一个`onload`事件，这个事件与`window`相关。 

在页面加载完成后由多个函数执行，使代码将函数`function1`和`function2`逐一绑定到`onload`事件上，则会导致最后的那个函数才会被实际执行，代码如下：

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
##### UI事件
|事件名称|说明|
|:---:|:---|
|load|当页面完全（包括图像、JS、CSS文件等外部资源）加载后在window上面触发，当所有框架都加载完毕时在框架集上面触发，当图像加载完毕时在`<img>`上面触发，或者当嵌入的内容加载完毕时在`<object>`元素上面触发|
|unload|页面完全卸载后在window上面触发。当所有框架都卸载后在框架集上面触发，或者当嵌入的内容写在完毕后在`<object>`元素上面触发|
|abort|当用户 停止下载过程中，如果潜入的内容没有加载完，则在`<object>`元素上面触发|
|error|当发生JS错误时在window上面触发。当无法加载图像时在`<img>`上面触发，当无法加载嵌入内容时在`<object>`元素上面触发，或者当有一个或多个框架无法加载时在框架集上面触发|
|select|当用户选择文本框(`<input>`或`<textarea>`)中的一个或多个字符时触发|
|resize|当窗口或框架的大小变化时在window或框架上面触发|
|scroll|当用户滚动带滚动条的元素中的内容时，在该元素上面触发。`<body>`元素中包含所加载页面的滚动条|

##### 焦点事件
焦点事件会在页面获得或失去 焦点时触发。利用这些事件并与`document.hasFocus()`方法及`document.activeElement`属性配合，可以知晓用户在页面上的行踪。
|事件名称|说明|
|:---:|:---|
|blur|在元素失去焦点时触发。此事件不会冒泡，所有浏览器都支持|
|focus|在元素获得焦点时触发。此事件不会冒泡，所有浏览器都支持|
|focusin|在元素获得焦点时触发。此事件与HTML事件`focus`等价，**但它冒泡**。支持这个事件的浏览器有IE5.5+、Opera11.5+、Safari5.1+和Chrome|
|focusout|在元素失去焦点时触发。此事件是HTML事件`blur`的通用版本。支持这个事件的浏览器有IE5.5+、Opera11.5+、Safari5.1+和Chrome|

当焦点从页面中的一个元素移动到另一个元素，会依次触发下列事件：
1. `focusout`在失去焦点的元素上触发；
2. `focusin`在在获得焦点的元素上触发；
3. `blur`在失去焦点的元素上触发；
4. `DOMFOCUSOut`在失去焦点的元素上触发；
5. `focus`在获得焦点的元素上触发；
6. `DOMFocusIn`在获得焦点的元素上触发。
要确定浏览器是否支持这些事件，可以使用如下代码：

```javascript
var isSupported = document.implementation.hasFeature('FocusEvent', '3.0');
```

##### 鼠标事件
|属性|描述|DOM|
|:---:|:---|:---:|
|click|在用户单击鼠标左键或者按下回车键时触发。|2|
|dblclick|双击鼠标按键时触发|2|
|mousedown|用户按下任意鼠标按键时触发。不能通过键盘触发这个事件|2|
|mouseenter|在鼠标光标从元素外部首次移动到元素范围之内时触发。此事件不冒泡，在光标移动到后代元素上不触发|2|
|mouseleave|位于元素上方的鼠标光标移动到元素范围之外时触发。此事件不冒泡，而且光标移动到后代元素上不触发|2|
|mousemove|当鼠标指针在元素内部移动时重复触发。不能通过键盘触发此事件|2|
|mouseover|在鼠标指针位于一个元素外部，然后用户将其首次移入到另一个元素边界之内时触发。不能通过键盘触发此事件|2|
|mouseout|在鼠标指针位于一个元素上方，然后用户将其首次移入到另一个元素的边界之内时触发。又移到的另一个元素可能位于前一个元素的外部，也可能是这个元素的子元素。不能通过键盘触发此事件|2|
|mouseup|用户释放鼠标按钮时触发。不能通过键盘触发此事件|2|

页面上的所有元素都支持鼠标事件，除了`mouseenter`和`mouseleave`。所有鼠标事件都会冒泡，也可以被取消，而取消鼠标事件将会影响浏览器的默认行为，因为鼠标事件与其他事件有着密不可分的关系。只有在同一个元素上相继触发`mousedown`和`mouseup`事件才会触发`click`事件。如果`mousedown`或`mouseup`中一个被取消，就不会触发`click`事件。同样，只有触发两次`click`事件才会触发一个`dblclick`事件，如果有代码阻止了连续两次触发`click`事件，可能是直接取消`click`事件，也可能通过取消`mousedown`或`mouseup`间接实现，那么就不会触发`dblclick`事件。

这4个事件的触发顺序为： `mousedown`-->`mouseup`-->`click`-->`mousedown`-->`mouseup`-->`click`-->`dblclick`

要检测浏览器是否支持上面的所有事件，可以使用以下代码：

```javascript
var isSupported = document.implementation.hasFeature('MouseEvents', '2.0');
var isSupported = document.implementation.hasFeature('MouseEvent', '3.0');
```

##### 键盘事件
|属性|描述|DOM|
|:---:|:---|:---:|
|onkeydown|按下键盘上的任意键时触发，而且如果按住不放的话，会重复触发此事件|2|
|onkeypress|当用户按下键盘上的**字符键**时触发，如果按住不放的话，会重复触发此事件。按下`ESC`键也会触发这个事件。Safari3.1版本之前也会在用户按下非字符键时触发keypress事件|2|
|onkeyup|当用户释放键盘上的按键时触发|2|

在用户按下一个键盘上的字符键时，触发的键盘事件顺序是：`keydown`-->`keypress`-->`keyup`。其中，`keydown`和`keypress`都是在文本框发生变化之前被触发的，而`keyup`则是在文本框发生变化之后才被触发的。如果用户按下了一个字符按键不放，就会重复触发`keydown`和`keypress`事件，直到用户松开按键为止。

如果用户按下的是非字符按键，触发的键盘事件是：`keydown`-->`keyup`。如果按住这个键不放，那么`keydown`这个事件就会重复触发，直到用户松开这个键。

##### 鼠标/键盘事件对象属性
|属性|描述|DOM|
|:---:|:---|:---:|
|altKey|返回当事件被触发时，`Alt`键是否被按下|2|
|ctrlKey|返回当事件被触发时，`Ctrl`键是否被按下|2|
|shiftKey|返回当事件被触发时，`Shift`键是否被按下|2|
|button|返回当事件被触发时，哪个鼠标按键被单击|2|
|clientX|返回当事件被触发时，鼠标指针的水平坐标|2|
|clientY|返回当事件被触发时，鼠标指针的垂直坐标|2|
|Location|返回按键在设备上的位置|3|
|charCode|返回`onkeypress`事件触发键值的字母代码|2|
|key|在按下按键时返回按键的标识符|3|
|keyCode|返回`onkeypress`事件触发键值的字符代码，或者`onkeydown`或`onkeyup`事件的键的代码|2|
|which|返回`onkeypress`事件触发键值的字符代码，或者`onkeydown`或`onkeyup`事件的键的代码|2|
|metaKey|返回当事件被触发时，Meta键是否被按下（`windows`系统键盘上的`windows`键，`mac`系统上相对应的键）|2|
|relatedTarget|返回与事件的目标节点相关的节点|2|
|screenX|返回当事件被触发时，鼠标指针的水平坐标|2|
|screenY|返回当事件被触发时，鼠标指针的垂直坐标|2|

##### 键盘/鼠标事件方法
|方法|描述|DOM|
|:---:|:---|:---:|
|initMouseEvennt()|初始化鼠标事件对象的值|2|
|initKeyboardEvent()|初始化键盘事件对象的值|3|

##### 框架/对象（Frame/Object)事件
|属性|描述|DOM|
|:---:|:---|:---:|
|onabort|图像的加载被中断(`<object>`)|2|
|onbeforeunload|该事件在即将离开页面（刷新或关闭）时触发|2|
|onerror|在加载文档或图像时发生错误(`<object>`、`<body>`和`<frameset>`)| |
|onhashchange|该事件在当前URL的锚部分修改时触发| |
|onload|一张页面或一幅图像完成加载|2|
|onpageshow|该事件在用户访问页面时触发| |
|onpagehide|该事件在用户离开当前页面跳转到另外一个页面时触发| |
|onresize|窗口或框架被重新调整大小|2|
|onscroll|当文档被滚动时发生的事件|2|
|onunload|当用户退出页面(`<body>`和`<frameset>`)|2|

##### 表单事件
|属性|描述|DOM|
|:---:|:---|:---:|
|onblur|元素失去焦点时触发|2|
|onchange|表单元素的内容改变时触发(`<input>`、`<keygen>`、`<select>`和`<textarea>`)|2|
|onfocus|元素获得焦点时触发|2|
|onfocusin|元素即将获得焦点时触发|2|
|onfocusout|元素即将失去焦点时触发|2|
|oninput|元素获取用户输入时触发|3|
|onreset|表单重置时触发|2|
|onsearch|用户向搜索域(`<input="search">`)输入文本时触发| |
|onselect|用户选取文本(`<input>`和`<textarea>`)时触发|2|
|onsubmit|表单提交时触发|2|

##### 剪贴板事件
|属性|描述|
|:---:|:---|
|oncopy|用户拷贝元素内容时触发|
|oncut|用户剪切元素内容时触发|
|onpaste|用户粘贴元素内容时触发|

##### 打印事件
|属性|描述|
|:---:|:---|
|onafterprint|在页面已经开始打印，或者打印窗口已经关闭时触发|
|onbeforeprint|在页面即将开始打印时触发|

##### 拖动事件
|事件|描述|
|:---:|:---|
|ondrag|元素正在拖动时触发|
|ondragend|拖动结束时触发|
|ondragenter|拖动的元素放入目标时触发|
|ondragleave|拖动的元素离开目标时触发|
|ondragover|拖动的元素放置在目标上时触发|
|ondragstart|开始拖动元素时触发|
|ondrop|拖动元素放置在目标区域时触发|

##### 多媒体(Media)事件
|事件|描述|
|:---:|:---|
|onabort|事件在视频/音频(audio/video)终止加载时触发|
|oncanplay|事件在用户可以开始播放视频/音频(audio/video)时触发|
|oncanplaythrough|事件在视频/音频(audio/video)可以正常播放且无需停顿和缓冲时触发|
|ondurationchange|事件在视频/音频(audio/video)的时长发生变化时触发|
|onemptied|当期播放列表为空时触发|
|onended|事件在视频/音频(audio/video)播放结束时触发|
|onerror|事件在视频/音频(audio/video)数据加载期间发生错误时触发|
|onloadeddata|事件在浏览器加载视频/音频(audio/video)当前帧时触发|
|onloadedmetadata|事件在指定视频/音频(audio/video)的元数据加载后触发|
|onloadstart|事件在浏览器开始寻找指定视频/音频(audio/video)触发|
|onpause|事件在视频/音频(audio/video)暂停时触发|
|onplay|事件在视频/音频(audio/video)开始播放时触发|
|onplaying|事件在视频/音频(audio/video)暂停或者缓冲后准备重新开始播放时触发|
|onprogress|事件在浏览器下载指定的视频/音频(audio/video)时触发|
|onratechange|事件在视频/音频(audio/video)的播放速度发生改变时触发|
|onseeked|事件在用户重新定位视频/音频(audio/video)的播放位置后触发|
|onseeking|事件在用户开始重新定位视频/音频(audio/video)时触发|
|onsuspend|事件在浏览器读取媒体数据中止时触发|
|onstalled|事件在浏览器获取媒体数据，但媒体数据不可用时触发|
|ontimeupdate|事件在当前的播放位置发生改变时触发|
|onvolumechange|事件在音量发生变化时触发|
|onwaiting|事件在视频由于要播放下一帧 而需要缓冲时触发|

##### 动画事件
|事件|描述|
|:---:|:---|
|animationend|在CSS动画结束播放时触发|
|animationiteration|在CSS动画重复播放时触发|
|animationstart|在CSS动画开始播放时触发|

##### 过渡事件
|事件|描述|
|:---:|:---|
|transitionend|在CSS完成过渡后触发|

##### 其他事件
|事件|描述|
|:---:|:---|
|onmessage|该事件通过或者从对象(`WebSocket`、`WebWorker`、`EventSource`、子`frame`或父窗口)接收到消息时触发|
|onwheel|鼠标滚轮在元素上下滚动时触发|
|ononline|在浏览器开始在线工作时触发|
|onoffline|在浏览器开始离线工作时触发|
|onpopstate|在窗口的浏览历史(history对象)发生改变时触发|
|onshow|当`<menu>`元素在上下文菜单显示时触发|
|onstorage|在`WebStorage`(HTML5Web存储)更新时触发|
|ontoggle|在用户打开或关闭`<details>`元素时触发|