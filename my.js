(function() {
    if (!window.VTeam) {
        window['VTeam'] = {};
    }

    //$()方法
    function $() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (arguments.length === 1) {
                return element;
            }
            elements.push(element);
        }
        return elements;
    }
    window['VTeam']['$'] = $;

    //添加事件侦听器
    function addEvent(node, type, listener) {
        if (node.addEventListener) {
            node.addEventListener(type, listener, false);
            return true;
        } else if (node.attachEvent) {
            node['e' + type + listener] = listener;
            node[type + listener] = function() { node['e' + type + listener](window.event); }
            node.attachEvent('on' + type, node[type + listener]);
            return true;
        }
        return false;
    };
    window['VTeam']['addEvent'] = addEvent;

    //移除事件侦听器
    function removeEvent(node, type, listener) {
        if (!(node = $(node))) return false;
        if (node.removeEventListener) {
            node.removeEventListener(type, listener, false);
            return true;
        } else if (node.detachEvent) {
            node.detachEvent('on' + type, node[type + listener]);
            node[type + listener] = null;
            return true;
        }
        return false;
    };
    window['VTeam']['removeEvent'] = removeEvent;

    //在页面加载完成后添加事件侦听器
    function addLoadEvent(func) {
        var oldonload = window.onload;
        if (typeof oldonload != 'function') {
            window.onload = func;
        }
        else {
            oldonload;
            func();
        }
    }
    window['VTeam']['addLoadEvent'] = addLoadEvent;

    function getElementsByClassName(className, tag, parent) {
        parent = parent || document;
        var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchingElements = new Array();
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
        var element;
        for (var i = 0; i < allTags.length; i++) {
            element = allTags[i];
            if (regex.test(element.className)) {
                matchingElements.push(element);
            }
        }
        return matchingElements;
    };
    window['VTeam']['getElementsByClassName'] = getElementsByClassName;

    //在指定元素后面添加新的DOM元素
    function insertAfter(newElement, targetElement) {
        if (!(newElement = $(newElement))) return false;
        if (!(targetElement = $(targetElement))) return false;
        var parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
            return parent.appendChild(newElement);
        }
        else {
            return parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    window['VTeam']['insertAfter'] = insertAfter;

    //取得当前浏览器的事件对象
    function getEventObject(W3CEvent) {
        return W3CEvent || window.event;
    }
    window['VTeam']['getEventObject'] = getEventObject;

    //获得鼠标相对于文档原点的位置,包括滚动偏移
    function getPointerPositionInDocument(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var x = eventObject.pageX || (eventObject.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = eventObject.pageY || (eventObject.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
        return { 'x': x, 'y': y };
    }
    window['VTeam']['getPointerPositionInDocument'] = getPointerPositionInDocument;

    //获得鼠标相对于浏览器窗口的偏移量
    function getPointerPositionInScreen(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var x = eventObject.pageX || eventObject.clientX;
        var y = eventObject.pageY || eventObject.clientY;
        return { 'x': x, 'y': y };
    }
    window['VTeam']['getPointerPositionInScreen'] = getPointerPositionInScreen;

    //获取按键对象
    function getKeyPressed(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var code = eventObject.keyCode;
        var value = String.fromCharCode(code);
        return { 'code': code, 'value': value };
    }
    window['VTeam']['getKeyPressed'] = getKeyPressed;

    //根据key得到Cookie的值
    function getCookie(sName) {
        var RegularExp = "(?:; )?" + sName + "=([^;]*);?";
        var regExp = new RegExp(RegularExp);
        if (regExp.test(document.cookie)) {
            return decodeURIComponent(RegExp["$1"]);
        }
        else {
            return null;
        }
    }
    window['VTeam']['getCookie'] = getCookie;

    //记录Cookie
    function setCookie(name, value, expires, path, domain, secure) {
        var today = new Date();
        today.setTime(today.getTime());
        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24;
        }
        var expires_date = new Date(today.getTime() + (expires));
        document.cookie = name + '=' + escape(value) +
        ((expires) ? ';expires=' + expires_date.toGMTString() : '') +
        ((path) ? ';path=' + path : '') +
        ((domain) ? ';domain=' + domain : '') +
        ((secure) ? ';secure' : '');
    }
    window['VTeam']['setCookie'] = setCookie;

    //删除指定Cookie
    function deleteCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    window['VTeam']['deleteCookie'] = deleteCookie;

    //解析JSON
    function parseJSON(s, filter) {
        var j;
        function walk(k, v) {
            var i;
            if (v && typeof v === 'object') {
                for (i in v) {
                    if (v.hasOwnProperty(i)) {
                        v[i] = walk(i, v[i]);
                    }
                }
            }
            return filter(k, v);
        }
        if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.
            test(s)) {
            try {
                j = eval('(' + s + ')');
            } catch (e) {
                throw new SyntaxError("parseJSON");
            }
        } else {
            throw new SyntaxError("parseJSON");
        }
        if (typeof filter === 'function') {
            j = walk('', j);
        }
        return j;
    };
    window['VTeam']['parseJSON'] = parseJSON;

    //简单的Ajax框架
    function ajaxRequest(method, url, completeListener) {
        var request = createRequest();
        request.open(method, url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                completeListener.apply(request, arguments);
            }
        }
        request.send(null);
    }
    window['VTeam']['ajaxRequest'] = ajaxRequest;

    //创建XMLHttpRequest
    function createRequest() {
        var request;
        if (window.XMLHttpRequest) {
            request = new window.XMLHttpRequest();
        }
        else {
            request = new window.ActiveXObject('Microsfot.XMLHTTP');
        }
        return request;
    }
    window['VTeam']['createRequest'] = createRequest;
    
        //追加或者添加class属性
    function addClass(element, value) {
        if (!element.className) {
            element.className = value;
        }
        else {
            var newClassName = element.className;
            newClassName += " ";
            newClassName += value;
            element.className = newClassName;
        }
    }
    window['VTeam']['addClass'] = addClass;

})();
