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
|returnValue|Boolean|旧版本IE相当于Event.preventDefault()和Event.defaultPreventd|
|srcElement|Element|旧版本的IE相当于Event.target|

在事件处理程序内部，对象this始终等于currentTarget的值，而target则只包含事实的实际目标。
###### IE中的事件对象
与访问DOM中的event对象不同，要访问IE中的event对象，有几种不同的方式，取决于指定事件处理程序的方法。
<center>IE event对象属性与方法</center>
|属性/方法|类型|读/写|说明|
|:---:|:---:|:---:|:---|
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

