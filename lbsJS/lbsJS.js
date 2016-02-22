/**
 * LBS JS Library 
 * Date: 2010-09-01
 * ==================================
 * each size index grep extend / implement inherit proxy Class / type 
 * getId getTag getClass / query == $ 
 * create append insert after before remove empty clone next prev parent siblings first last 
 * css attr html text val / hasClass addClass removeClass / hide show
 * width height scrollTop scrollLeft / getMouse getPosition getScroll
 * on off delegate trigger onload
 * queue dequeue clearQueue data removeData
 * animate isAnimate stopAnimate fadeIn fadeOut fadeTo slideUp slideDown
 * ajax get post param serialize ajaxForm
 * camelCase uncamelCase trim repeat
 * ==================================
 **/

(function() {
	var LBS = (function() {
		var lbs = function() {
			this.version = 'v1.0';
			this.date = '2012.03.01';
		};
		lbs.prototype = {
			fn: function(s) {
				for (var k in s) {
					if (s[k] != undefined) this[k] = s[k];
				}
				return this;
			}
		}
		return new lbs();
	}());

	window.LBS = LBS;
	//window.$ === undefined && (window.$ = LBS);

	/*=====================工具实用=======================*/
	(function() {
		function each(arr, fn) {
			for (var i = 0, len = arr.length; i < len; i++) fn.call(arr[i], arr[i], i);
			return this;
		}

		function size(arr) {
			return arr.length;
		}

		function index(o, arr) {
			each(arr, function(e, i) {
				if (o === e) return i;
			});
		}

		function grep(arr, fn) {
			var newarr = [];
			each(arr, function(e, i) {
				if (fn(e, i)) newarr.push(e);
			});
			return newarr;
		}

		function extend(d, s) {
			for (var p in s) {
				if (s[p] !== undefined) d[p] = s[p];
			}
			return d;
		}

		function implement(d, s) {
			for (var p in s) !d.prototype[p] && s[p] !== undefined && (d.prototype[p] = s[p]);
			return this;
		}

		function inherit(C, P) {
			var F = function() {};
			F.prototype = P.prototype;
			C.prototype = new F();
			C.uber = P.prototype;
			C.prototype.constructor = C;
			return this;
		}

		function proxy(fn, o) {
			return (function() {
				return fn.apply(o, arguments);
			});
		}

		function contains(o, p) {
			if (p.contains) {
				return p.contains(o);
			} else if (p.compareDocumentPosition) {
				return !!(p.compareDocumentPosition(o) & 16);
			}
		}

		function type(o) {
			var _toS = {}.toString,
				_types = {
					'undefined': 'undefined',
					'number': 'number',
					'boolean': 'boolean',
					'string': 'string',
					'[object Function]': 'function',
					'[object RegExp]': 'regexp',
					'[object Array]': 'array',
					'[object Date]': 'date',
					'[object Error]': 'error'
				};
			return _types[typeof o] || _types[_toS.call(o)] || (o ? 'object' : 'null');
		}

		function isObject(o) {
			return typeof o === 'object';
		}

		function isArray(o) {
			return type(o) === 'array';
		}

		function inArray(o, arr) {
			each(arr, function(e, i) {
				if (o === e) return true;
			});
			return false;
		}

		function toArray(likearr) {
			var arr = [];
			each(likearr, function(e, i) {
				newarr.push(e);
			});
			return arr;
		}

		function _class(parent) {
			var klass = function() {
				this.init.apply(this, arguments);
			};

			//继承
			if (parent) {
				var subclass = function() {};
				subclass.prototype = parent.prototype;
				klass.prototype = new subclass();
			}

			klass.prototype.init = function() {};
			klass.fn = klass.prototype;
			klass.fn.parent = klass;
			klass._super = klass.__proto__;

			//类 静态属性
			klass.extend = function(obj) {
				var extended = obj.extended;
				for (var i in obj) {
					klass[i] = obj[i];
				}
				if (extended) extended(klass);
			};

			//类 实例属性
			klass.include = function(obj) {
				var included = obj.included;
				for (var i in obj) {
					klass.fn[i] = obj[i];
				}
				if (included) included(klass);
			};

			//类 作用域
			klass.proxy = function(func) {
				var self = this;
				return (function() {
					return func.apply(self, arguments);
				});
			};

			klass.fn.proxy = klass.proxy;

			return klass;
		}

		function Class(parent) {
			return new _class(parent);
		}

		LBS.fn({
			each: each,
			size: size,
			index: index,
			grep: grep,
			extend: extend,
			implement: implement,
			inherit: inherit,
			proxy: proxy,
			contains: contains,
			type: type,
			isObject: isObject,
			isArray: isArray,
			inArray: inArray,
			toArray: toArray,
			Class: Class
		});
	}());

	/*=====================选择对象=======================*/
	(function() {
		function getId(id) {
			return typeof id == 'string' ? document.getElementById(id) : id;
		}

		function getTag(t, o) {
			return (o || document).getElementsByTagName(t);
		}

		function getClass(c, n, t) {
			if (document.getElementsByClassName) return (n || document).getElementsByClassName(c);
			var arr = [],
				re = new RegExp('(^| )' + c + '( |$)'),
				els = getTag(t || '*', n),
				i = 0,
				l = els.length;
			for (; i < l; i++) {
				if (re.test(els[i].className)) arr.push(els[i]);
			}
			return arr;
		}

		function query(selector, context) {
			var s = selector,
				doc = document,
				arr = [],
				sub = s.substring(1),
				tags, n = 0,
				i = 0;
			context = context || doc;
			if (typeof s == 'string') {
				switch (s.charAt(0)) {
					case '#':
						return doc.getElementById(sub);
						break;
					case '.':
						if (context.getElementsByClassName) return context.getElementsByClassName(sub);
						tags = context.getElementsByTagName('*');
						n = tags.length;
						for (; i < n; i++) {
							if ((' ' + tags[i].className + ' ').indexOf(' ' + sub + ' ') > -1) arr.push(tags[i]);
						}
						return arr;
						break;
					default:
						return context.getElementsByTagName(s);
				}
			}
		}

		LBS.fn({
			$: query,
			getId: getId,
			getTag: getTag,
			getClass: getClass
		});
	}());

	/*=====================文档处理=======================*/
	(function() {
		function create(o) {
			return document.createElement(o);
		}

		function append(n, o) {
			o.appendChild(n);
			return this;
		}

		function insert(n, o, s) {
			var len = o.children.length;
			switch (s) {
				case s >= len || !!s == false:
					o.appendChild(n);
					break;
				case s <= 0:
					o.insertBefore(n, o.children[0]);
					break;
				default:
					o.insertBefore(n, o.children[s - 1]);
			}
			return this;
		}

		function after(n, o) {
			var parent = o.parentNode;
			parent.lastChild == o ? parent.appendChild(n) : parent.insertBefore(n, o.nextSibling);
			return this;
		}

		function before(n, o) {
			var parent = o.parentNode;
			parent.insertBefore(n, o);
			return this;
		}

		function remove(o) {
			o.parentNode.removeChild(o);
			return this;
		}

		function empty(o) {
			while (o.firstChild) o.removeChild(o.firstChild);
			return this;
		}

		function clone(o, b) {
			return o.cloneNode(b);
		}

		function next(o) {
			var next = o.nextSibling;
			if (next && next.nodeType != 1) next = next.nextSibling;
			return next;
		}

		function prev(o) {
			var prev = o.previousSibling;
			if (prev && prev.nodeType != 1) prev = prev.previousSibling;
			return prev;
		}

		function parent(o) {
			return o.parentNode;
		}

		function siblings(o) {
			var arr = o.parentNode.children,
				len = arr.length,
				i = 0,
				siblings = [];
			if (len < 2) return null;
			for (; i < len; i++) {
				if (arr[i] != o && arr[i].nodeType == 1) siblings.push(arr[i]);
			}
			return siblings;
		}

		function first(o) {
			var first = o.firstChild;
			if (first && first.nodeType != 1) first = next(first);
			return first;
		}

		function last(o) {
			var last = o.lastChild;
			if (last && last.nodeType != 1) last = prev(last);
			return last;
		}

		LBS.fn({
			create: create,
			append: append,
			insert: insert,
			after: after,
			before: before,
			remove: remove,
			empty: empty,
			clone: clone,
			next: next,
			prev: prev,
			parent: parent,
			siblings: siblings,
			first: first,
			last: last
		});
	}());

	/*=====================样式 属性=======================*/
	(function() {
		function getOpacity(o) {
			var hasOpacity = (o.style.opacity != null),
				reAlpha = /alpha\(opacity=([\d.]+)\)/i,
				filter, opacity;
			if (hasOpacity) {
				opacity = o.style.opacity || getComputedStyle(o, null).opacity;
				return (opacity == '') ? 100 : opacity * 100;
			} else {
				filter = o.style.filter || o.currentStyle.filter;
				if (filter) opacity = filter.match(reAlpha);
				return (opacity == null || filter == null) ? 100 : (opacity[1]);
			}
		}

		function setOpacity(o, v) {
			o.style.opacity != null ? o.style.opacity = v / 100 : o.style.filter = 'alpha(opacity=' + v + ')';
			return this;
		}

		function getStyle(o, n) {
			n = n.camelCase();
			if (n.toLowerCase() == 'opacity') return getOpacity(o);
			return o.currentStyle ? o.currentStyle[n] : getComputedStyle(o, null)[n];
		}

		function setStyle(o, n, v) {
			n = n.camelCase();
			switch (n) {
				case 'left':
				case 'right':
				case 'top':
				case 'bottom':
					v = parseFloat(v) + 'px';
					break;
				case 'width':
				case 'height':
				case 'marginLeft':
				case 'marginRight':
				case 'marginTop':
				case 'marginBottom':
				case 'paddingLeft':
				case 'paddingRight':
				case 'paddingTop':
				case 'paddingBottom':
				case 'borderLeftWidth':
				case 'borderRightWidth':
				case 'borderTopWidth':
				case 'borderBottomWidth':
					v = parseFloat(v) < 0 ? 0 : parseFloat(v) + 'px';
					break;
			}
			n.toLowerCase() == 'opacity' ? setOpacity(o, v) : o.style[n] = v;
			return this;
		}

		function setStyles(o, styles) {
			for (var n in styles) setStyle(o, n, styles[n]);
			return this;
		}

		function css(o, n, v) {
			var len = arguments.length;
			if (len == 2 && typeof n == 'string') return getStyle(o, n);
			if (len == 2 && typeof n == 'object') setStyles(o, n);
			if (len == 3 && typeof n == 'string') setStyle(o, n, v);
			return this;
		}

		function getAttr(o, n) {
			return o[n] || o.getAttribute(n);
		}

		function setAttr(o, n, v) {
			if (o.setAttribute) o.setAttribute(n, v);
			return this;
		}

		function setAttrs(o, attrs) {
			for (var n in attrs) setAttr(o, n, attrs[n]);
			return this;
		}

		function removeAttr(o, n) {
			if (o.removeAttribute) o.removeAttribute(n);
			return this;
		}

		function attr(o, n, v) {
			var len = arguments.length;
			if (len == 2 && typeof n == 'string') return getAttr(o, n);
			if (len == 2 && typeof n == 'object') setAttrs(o, n);
			if (len == 3 && typeof n == 'string') setAttr(o, n, v);
			return this;
		}

		function html(o, v) {
			var len = arguments.length;
			if (len == 1) return o.innerHTML;
			if (len == 2) o.innerHTML = v;
			return this;
		}

		function text(o, v) {
			var len = arguments.length;
			if (len == 1) return o.innerText || o.textContent;
			if (len == 2) o.innerHTML = v;
			return this;
		}

		function val(o, v) {
			var len = arguments.length;
			if (len == 1) return o.value;
			if (len == 2) o.value = v;
			return this;
		}

		function hasClass(o, c) {
			return -1 < (' ' + o.className + ' ').indexOf(' ' + c + ' ');
		}

		function addClass(o, c) {
			if (!hasClass(o, c)) o.className += ' ' + c;
			return this;
		}

		function removeClass(o, c) {
			if (hasClass(o, c)) {
				var reg = new RegExp('(\\s|^)' + c + '(\\s|$)');
				o.className = o.className.replace(reg, '');
			}
			return this;
		}

		function show(o) {
			hide(o);
			o.style.display = o.$old || 'block';
			return this;
		}

		function hide(o) {
			var $old = css(o, 'display');
			if ($old != 'none') o.$old = $old;
			o.style.display = 'none';
			return this;
		}

		LBS.fn({
			getOpacity: getOpacity,
			setOpacity: setOpacity,
			getStyle: getStyle,
			setStyle: setStyle,
			setStyles: setStyles,
			css: css,
			getAttr: getAttr,
			setAttr: setAttr,
			setAttrs: setAttrs,
			removeAttr: removeAttr,
			attr: attr,
			html: html,
			text: text,
			val: val,
			hasClass: hasClass,
			addClass: addClass,
			removeClass: removeClass,
			show: show,
			hide: hide
		});
	}());

	/*=====================窗口 文档=======================*/
	(function() {
		function getWindowSize() {
			var d = document,
				doc = d.documentElement,
				body = d.body;
			if (document.compatMode == 'CSS1Compat') return {
				w: doc.clientWidth || body.clientWidth,
				h: doc.clientHeight || body.clientHeight
			};
			return {
				w: body.clientWidth,
				h: body.clientHeight
			};
		}

		function getPageSize() {
			var d = document,
				doc = d.documentElement,
				body = d.body;
			if (document.compatMode == 'CSS1Compat') return {
				w: doc.scrollWidth || body.scrollWidth,
				h: doc.scrollHeight || body.scrollHeight
			};
			return {
				w: body.scrollWidth,
				h: body.scrollHeight
			};
		}

		function getScroll(o) {
			var d = o ? o.ownerDocument : document,
				doc = d.documentElement,
				body = d.body;
			if (document.compatMode == 'CSS1Compat') return {
				x: doc.scrollLeft || body.scrollLeft,
				y: doc.scrollTop || body.scrollTop
			};
			return {
				x: body.scrollLeft,
				y: body.scrollTop
			};
		}

		function getMousePosition(e) {
			var e = e || window.event,
				d = document,
				doc = d.documentElement,
				body = d.body,
				x = e.pageX || (e.clientX + Math.max(doc.scrollLeft, body.scrollLeft)),
				y = e.pageY || (e.clientY + Math.max(doc.scrollTop, body.scrollTop));
			return {
				x: x,
				y: y
			};
		}

		function getElemPosition(o) {
			var box = o.getBoundingClientRect(),
				doc = o.ownerDocument,
				body = doc.body,
				html = doc.documentElement,
				clientTop = html.clientTop || body.clientTop || 0,
				clientLeft = html.clientLeft || body.clientLeft || 0,
				x = box.left + (self.pageXOffset || html.scrollLeft || body.scrollLeft) - clientLeft,
				y = box.top + (self.pageYOffset || html.scrollTop || body.scrollTop) - clientTop;
			return {
				x: x,
				y: y
			};
		}

		function width(o, v) {
			var len = arguments.length;
			if (len == 1 && o == window) return getWindowSize().w;
			if (len == 1 && o == document) return getPageSize().w;
			if (len == 1) return parseFloat(o.clientWidth) - parseFloat(LBS.css(o, 'padding-left')) - parseFloat(LBS.css(o, 'padding-right'));
			if (len == 2) LBS.css(o, 'width', v);
			return this;
		}

		function height(o, v) {
			var len = arguments.length;
			if (len == 1 && o == window) return getWindowSize().h;
			if (len == 1 && o == document) return getPageSize().h;
			if (len == 1) return parseFloat(o.clientHeight) - parseFloat(LBS.css(o, 'padding-top')) - parseFloat(LBS.css(o, 'padding-bottom'));
			if (len == 2) LBS.css(o, 'height', v);
			return this;
		}

		function scrollTop(o) {
			return getScroll(o).y;
		}

		function scrollLeft(o) {
			return getScroll(o).x;
		}

		LBS.fn({
			getWindowSize: getWindowSize,
			getPageSize: getPageSize,
			getScroll: getScroll,
			getMouse: getMousePosition,
			getPosition: getElemPosition,
			width: width,
			height: height,
			scrollTop: scrollTop,
			scrollLeft: scrollLeft
		});
	}());

	(function() {
		function isHiddenInPage(el) {
			if (LBS.css(el, 'display') == 'none') return true;
			while (el = el.parentNode) {
				if (el.nodeType !== 1) continue;
				if (LBS.css(el, 'display') == 'none') return true;
			}
			return false;
		}

		function isVisibleInWindow(el, w) {
			w = w || window;
			var ex = LBS.getPosition(el).x,
				ey = LBS.getPosition(el).y,
				ew = ex + el.offsetWidth,
				eh = ey + el.offsetHeight,
				sx = LBS.getScroll().x,
				sy = LBS.getScroll().y,
				sw = sx + LBS.getWindowSize().w,
				sh = sy + LBS.getWindowSize().h;
			if (w == window) {
				return ((ex < sw && ew > sx) && (ey < sh && eh > sy));
			} else {
				var wx = LBS.getPosition(w).x,
					wy = LBS.getPosition(w).y,
					ww = wx + w.offsetWidth,
					wh = wy + w.offsetHeight;
				return ((wx < sw && ww > sx) && (wy < sh && wh > sy)) && ((ex < ww && ew > wx) && (ey < wh && eh > wy));
			}
		}

		LBS.fn({
			isHidden: isHiddenInPage,
			isVisible: isVisibleInWindow
		});
	}());

	/*=====================事件=======================*/
	(function() {
		/*
		var events = {};
		events.handlers = {};
		
		function fixEvent(e) {
		if(e) return e;
		e = window.event;
		e.target = e.srcElement;
		e.pageX = e.clientX + LBS.scrollLeft();
		e.pageY = e.clientY + LBS.scrollTop();
		e.stopPropagation = function(){ e.cancelBubble = true; };
		e.preventDefault = function(){ e.returnValue = false; }
		return e;
	}

	function _add(o,type,fn){
		!events[o] && (events[o] = {});
		!events[o][type] && (events[o][type] = []);
		!events[o][type].guid && (events[o][type].guid = 0);	
		!fn.$$guid && (fn.$$guid = events[o][type].guid++);
		events[o][type].push(fn);
	}

	function _remove(o,type,fn){
		var hasQueue = events[o] && events[o][type] && events[o][type][fn.$$guid];
    	if(!hasQueue) return;
		o.removeEventListener ? o.removeEventListener(type, events[o][type][fn.$$guid], false) : o.detachEvent(type, events[o][type][fn.$$guid])
    	delete events[o][type][fn.$$guid];
	}

	function addEvent(o,type,fn){		 
		_add(o,type,fn);
		var i = 0, len = events[o][type].length;
		events._fn = function(e){
			e = fixEvent();
			if(events[o][type].guid == len){
				events[o][type].guid = 0;
			}else{
				for(;i < len; i++){
					var _fn = events[o][type][i];									
					typeof _fn === 'function' && _fn.call(o,e);
					events[o][type].guid++;
				}
			}
		}
		o.addEventListener  ? o.addEventListener(type, events._fn, false) : o.attachEvent('on' + type, events._fn);
		return this;
	}

	function removeEvent(o,type,fn){
		_remove(o,type,fn);
		return this;
	}  
	=========================================2010.02.20 未完成*/

		/*
		var events = {};
		function fixEvent(e) {
			if(e) return e;
			e = window.event;
			e.target = e.srcElement;
			e.pageX = e.clientX + LBS.scrollLeft();
			e.pageY = e.clientY + LBS.scrollTop();
			e.stopPropagation = function(){ e.cancelBubble = true; };
			e.preventDefault = function(){ e.returnValue = false; }
			return e;
		};
		function add(o,type,fn){
			if(!events[o]) events[o] = {};
			if(!events[o][type]) events[o][type] = [];
			if(!events[o][type].num) events[o][type].num = 0;
			events[o][type].push(fn);
		}
		function fire(o,type){
			if(!events[o][type]) return this;
			var handlers = events[o][type], i = 0, len = handlers.length;
			if(len == 0) return this;
			if(handlers.num == len) handlers.timer = setTimeout(function(){handlers.num = 0;},10);
			else for(; i < len; i++) {
				handlers.num++;	
				handlers.timer && clearTimeout(handlers.timer);
				handlers[i].call(o,fixEvent());
			}
		}
		function addEvent(o,type,fn){
			if(o.attachEvent){
				add(o,type,fn);
				events[o][type].handler = function(){
					fire(o,type);
				} 
				o.attachEvent("on" + type, events[o][type].handler);
			} else o.addEventListener(type, fn, false);
			return this;
		}
		function removeEvent(o,type,fn){
			if(o.detachEvent){
				if(!events[o][type]) return this;
				var handlers = events[o][type], i = 0, len = handlers.length;
				if(len == 0) return this;
				if(typeof fn === 'function'){
					for(; i < len; i++) {
						if(handlers[i] === fn){
							handlers.splice(i, 1);
							handlers.num--;
							break;
						}
					}
				}else{
					o.detachEvent("on" + type, handlers.handler);
					delete events[o][type];
				}
			} else o.removeEventListener(type, fn, false);
			return this;
		}
	 	====================================== 2010.04.10 */

		function fixEvent(e) {
			if (e) return e;
			e = window.event;
			e.target = e.srcElement;
			e.pageX = e.clientX + LBS.scrollLeft();
			e.pageY = e.clientY + LBS.scrollTop();
			e.stopPropagation = function() {
				e.cancelBubble = true;
			};
			e.preventDefault = function() {
				e.returnValue = false;
			};
			return e;
		}

		function addEvent(o, type, fn) {
			if (o.attachEvent) {
				o['e' + type + fn] = fn;
				o[type + fn] = function() {
					o['e' + type + fn].call(o, fixEvent());
				};
				o.attachEvent('on' + type, o[type + fn]);
			} else o.addEventListener(type, fn, false);
			return this;
		}

		function removeEvent(o, type, fn) {
			if (o.detachEvent) {
				o.detachEvent('on' + type, o[type + fn]);
				o[type + fn] = null;
			} else o.removeEventListener(type, fn, false);
			return this;
		}

		function delegate(o, tag, type, fn, b) { // b默认false true冒泡 false不冒泡
			addEvent(o, type, function(e) {
				var t = e.target;
				!b && e.stopPropagation();
				if (t.tagName.toUpperCase() === tag.toUpperCase()) {
					fn.call(t, e);
					e.preventDefault();
				}
			});
			return this;
		}

		function mouseScroll(fn, s, b) { //x向下-1 向上+1 s间隔时间  b默认true true不取消 false取消默认
			var time = +new Date(),
				roll = function(e) {
					var e = fixEvent(),
						x = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
					if (+new Date() - time > (s || 100)) {
						time = new Date() - 0;
						fn(x);
					}!!b && preventDefault(e);
				};
			window.netscape ? document.addEventListener('DOMMouseScroll', roll, false) : document.onmousewheel = roll;
			return this;
		}

		var triggerEvent = {
			events: {},
			Add: function(type, fn) {
				!this.events[type] && (this.events[type] = []);
				typeof fn === 'function' && this.events[type].push(fn);
				return this;
			},
			Fire: function(type) {
				var events = this.events[type];
				if (events instanceof Array) {
					for (var i = 0, len = events.length; i < len; i++) {
						typeof events[i] === 'function' && events[i]({
							type: type
						});
					}
				}
				return this;
			},
			Delete: function(type, fn) {
				var events = this.events[type];
				if (typeof type === 'string' && events instanceof Array) {
					if (typeof fn === 'function') {
						for (var i = 0, len = events.length; i < len; i++) {
							if (events[i] === fn) {
								this.events[type].splice(i, 1);
								break;
							}
						}
					} else {
						delete this.events[type];
					}
				}
				return this;
			}
		};

		var whenReady = (function() { //whenReady(function(){ ... } 
			var funcs = [],
				doc = document,
				ready = false;

			function handler(e) {
				if (ready) return;
				if (e.type === 'readystatechange' && doc.readyState !== 'complete') return;
				for (var i = 0; i < funcs.length; i++) funcs[i].call(doc);
				ready = true;
				funcs = null;
			}
			if (doc.addEventListener) {
				doc.addEventListener('DOMContentLoaded', handler, false);
				doc.addEventListener('readystatechange', handler, false);
				window.addEventListener('load', handler, false);
			} else if (doc.attachEvent) {
				doc.attachEvent('onreadystatechange', handler);
				window.attachEvent('onload', handler);
			}
			return function whenReady(f) {
				if (ready) f.call(doc);
				else funcs.push(f);
			};
		}());

		LBS.fn({
			addEvent: addEvent,
			removeEvent: removeEvent,
			fixEvent: fixEvent,
			on: addEvent,
			off: removeEvent,
			mouse: mouseScroll,
			delegate: delegate, //事件委托
			trigger: triggerEvent, //自定义事件
			onload: whenReady
		});
	}());

	/*=====================队列 缓存  Start=======================*/
	(function() {
		var oQueue = {},
			oData = {};

		function queue(o, type, data) {
			!oQueue[o] && (oQueue[o] = {});
			!oQueue[o][type] && (oQueue[o][type] = []);
			if (data) oQueue[o][type].push(data);
			return oQueue[o][type];
		}

		function dequeue(o, type) {
			var arr = queue(o, type),
				len = arr.length,
				fn;
			if (!len) return null;
			fn = arr.shift();
			typeof fn === 'function' && fn.call(o);
		}

		function clearQueue(o, type) {
			oQueue[o][type].length = 0;
		}

		function data(o, n, v) {
			var len = arguments.length,
				K;
			!oData[o] && (oData[o] = {});
			if (len == 3 && typeof n === 'string') oData[o][n] = v;
			if (len == 2 && typeof n == 'object') {
				for (k in n) oData[o][k] = n[k];
			}
			if (len == 2 && typeof n == 'string') {
				if (oData[o][n]) return oData[o][n];
				else return 'undefined';
			}
			return this;
		}

		function removeData(o, n) {
			if (oData[o][n]) delete oData[o][n];
			return this;
		}

		LBS.fn({
			queue: queue,
			dequeue: dequeue,
			clearQueue: clearQueue,
			data: data,
			removeData: removeData
		});
	}());

	/*=====================动画=======================*/
	(function() {
		//动画公式
		var tween = {
			linear: function(pos) {
				return pos;
			},
			spring: function(pos) {
				return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
			},
			wobble: function(pos) {
				return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
			},
			swing: function(pos) {
				return 0.5 - Math.cos(pos * Math.PI) / 2;
			},
			bounce: function(pos) {
				if (pos < (1 / 2.75)) {
					return (7.5625 * pos * pos);
				} else if (pos < (2 / 2.75)) {
					return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
				} else if (pos < (2.5 / 2.75)) {
					return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
				} else {
					return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
				}
			},
			easeIn: function(pos) {
				return -Math.cos(pos * (Math.PI / 2)) + 1;
			},
			easeOut: function(pos) {
				return Math.sin(pos * (Math.PI / 2));
			},
			easeInOut: function(pos) {
				return (-.5 * (Math.cos(Math.PI * pos) - 1));
			},
			easeFrom: function(pos) {
				return Math.pow(pos, 4);
			},
			easeTo: function(pos) {
				return Math.pow(pos, 0.25);
			},
			easeOutBounce: function(pos) {
				if ((pos) < (1 / 2.75)) {
					return (7.5625 * pos * pos);
				} else if (pos < (2 / 2.75)) {
					return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
				} else if (pos < (2.5 / 2.75)) {
					return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
				} else {
					return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
				}
			},
			easeInOutBack: function(pos) {
				var s = 1.70158;
				if ((pos /= 0.5) < 1) return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
				return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
			},
			easeInOutQuad: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
				return -0.5 * ((pos -= 2) * pos - 2);
			},
			easeInOutCubic: function(pos) {
				if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
				return 0.5 * (Math.pow((pos - 2), 3) + 2);
			}
		};

		function animate(el, props, opts) {
			el = typeof el === 'string' ? document.getElementById(el) : el;
			if (!el) return;
			opts = opts || {};
			var duration = opts.duration || 400,
				fps = opts.fps || 60,
				easing = (opts.easing && tween[opts.easing]) || tween.linear,
				callback = opts.callback || function() {},
				p, prop, count = 0,
				amount = 0;
			for (p in props) amount++;
			el.stopAnimate = false;
			for (prop in props) {
				(function(prop) {
					var start = parseInt(LBS.getStyle(el, prop)),
						end = parseInt(props[prop]),
						change = end - start,
						startTime = new Date() - 0;
					!el.animated && (el.animated = true);
					! function play() {
						var newTime = new Date() - 0,
							timestamp = newTime - startTime,
							delta = easing(timestamp / duration);
						LBS.setStyle(el, prop, parseInt(start + delta * change));
						if (timestamp > duration) {
							LBS.setStyle(el, prop, end);
							if (++count === amount) {
								el.animated = null;
								callback && callback();
							}
						} else {
							if (el.stopAnimate && el.gotoEnd) {
								LBS.setStyle(el, prop, end);
								if (++count === amount) {
									el.animated = null;
									callback && callback();
									return;
								}
							}
							if (!el.stopAnimate) {
								setTimeout(play, 1000 / fps);
							}
						}
					}();
				})(prop);
			}
			return this;
		}

		function isAnimate(el) {
			return !el.animated ? false : true;
		}

		function stopAnimate(el, b) {
			el.stopAnimate = true;
			!!b && (el.gotoEnd = true);
		}

		function fadeTo(o, v, fn) {
			if (LBS.css(o, 'display') == 'none') LBS.show(o);
			animate(o, {
				'opacity': v
			}, {
				callback: function() {
					fn && fn.call(o)
				}
			});
			return this;
		}

		function fadeIn(o, fn) {
			if (LBS.css(o, 'opacity') == 100) return this;
			if (LBS.css(o, 'display') == 'none') LBS.show(o);
			if (LBS.css(o, 'width') == 'auto' && LBS.css(o, 'height') == 'auto') LBS.css(o, {
				'zoom': 1
			});
			animate(o, {
				'opacity': 100
			}, {
				callback: function() {
					fn && fn.call(o)
				}
			});
			return this;
		}

		function fadeOut(o, fn) {
			if (LBS.css(o, 'opacity') == 0) return this;
			if (LBS.css(o, 'width') == 'auto' && LBS.css(o, 'height') == 'auto') LBS.css(o, {
				'zoom': 1
			});
			animate(o, {
				'opacity': 0
			}, {
				callback: function() {
					LBS.hide(o);
					fn && fn.call(o)
				}
			});
			return this;
		}

		function slideUp(o, fn) {
			if (LBS.height(o) == 0 || LBS.css(o, 'display') == 'none') return;
			var $height = LBS.height(o),
				$overflow = LBS.css(o, 'overflow');
			if ($overflow != 'hidden') LBS.css(o, 'overflow', 'hidden');
			LBS.height(o, $height);
			animate(o, {
				'height': 0
			}, {
				callback: function() {
					LBS.hide(o).height(o, $height).css(o, {
						'overflow': $overflow
					});
					fn && fn.call(o)
				}
			});
			return this;
		}

		function slideDown(o, fn) {
			if (LBS.css(o, 'display') != 'none') return;
			LBS.show(o);
			var $height = LBS.height(o),
				$overflow = LBS.css(o, 'overflow');
			if ($overflow != 'hidden') LBS.css(o, 'overflow', 'hidden');
			LBS.height(o, 0);
			animate(o, {
				'height': $height
			}, {
				callback: function() {
					LBS.css(o, {
						'overflow': $overflow
					});
					fn && fn.call(o)
				}
			});
			return this;
		}

		LBS.fn({
			animate: animate,
			isAnimate: isAnimate,
			stopAnimate: stopAnimate,
			fadeTo: fadeTo,
			fadeIn: fadeIn,
			fadeOut: fadeOut,
			slideUp: slideUp,
			slideDown: slideDown
		});
	}());

	/*=====================ajax=======================*/
	(function() {
		function serilizeUrl(url) {
			var result = {}, map, i;
			url = url.split("?")[1];
			map = url.split("&");
			for (i = 0, len = map.length; i < len; i++) {
				result[map[i].split("=")[0]] = map[i].split("=")[1];
			}
			return result;
		}

		function param(obj) {
			var re = /(^\S+\=[.]?\&?)+/,
				result = [];
			if (typeof obj == 'string' && re.test(obj)) return obj;
			if (typeof obj == undefined || obj == null || obj == '') return '$_$=$_$';
			for (var key in obj) obj[key] != undefined && result.push(key + '=' + obj[key]);
			return result.join('&');
		}

		function serialize(o) {
			var parts = [],
				field = null,
				i = 0,
				els = o.elements,
				len = els.length;
			for (; i < len; i++) {
				field = els[i];
				switch (field.type.toLowerCase()) {
					case 'select-one':
					case 'select-multiple':
						var opts = field.options,
							optlen = opts.length,
							j = 0,
							option = null;
						for (; j < optlen; j++) {
							option = opts[j];
							if (option.selected) {
								parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(option.value));
							}
						}
						break;
					case 'undefined':
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;
					case 'radio':
					case 'checkbox':
						if (!field.checked) break;
					default:
						if (field.value.length < 1) field.value = '';
						parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
				}
			}
			return parts.join("&");
		}

		function ajax(opt) {
			var _opt = {
					url: "url",
					method: "GET",
					data: null,
					timeout: 5,
					cache: true,
					async: true,
					load: function() {},
					error: function() {},
					success: function() {},
					complete: function() {}
				},
				key, xhr, aborted = false;
			for (key in opt) {
				_opt[key] = opt[key];
			}
			if (_opt.method.toUpperCase() == 'GET' && _opt.data) {
				_opt.url += (_opt.url.indexOf('?') < 0 ? '?' : '&') + param(_opt.data);
				_opt.data = null;
			}
			_opt.cache && (_opt.url += (_opt.url.indexOf('?') < 0 ? '?' : '&') + 'timestamp=' + (new Date() - 0));
			xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			function checkTimeout() {
				if (xhr.readyState != 4) {
					aborted = true;
					xhr.abort();
				}
			}
			setTimeout(checkTimeout, _opt.timeout * 1000);

			xhr.onreadystatechange = function() {
				if (xhr.readyState !== 4) _opt.load && _opt.load(xhr);
				if (xhr.readyState == 4) {
					var s = xhr.status,
						xhrdata = xhr.responseText;
					if (!aborted && s >= 200 && s < 300) {
						_opt.success && _opt.success(xhrdata);
					} else {
						_opt.error && _opt.error(xhrdata);
					}
					_opt.complete && _opt.complete();
				}
			};
			xhr.open(_opt.method, _opt.url, _opt.async);
			if (_opt.method.toUpperCase() == 'POST') {
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}
			xhr.send(_opt.method.toUpperCase() == 'GET' ? null : param(_opt.data));
			return this;
		}

		function get(url, data, fn) {
			ajax({
				url: url,
				method: 'GET',
				data: data,
				success: function(data) {
					fn && fn(data);
				}
			});
			return this;
		}

		function post(url, data, fn) {
			ajax({
				url: url,
				method: 'POST',
				data: data,
				success: function(data) {
					fn && fn(data);
				}
			});
			return this;
		}

		function ajaxForm(o, url, fn) {
			post(url, serialize(o), function(data) {
				fn && fn(data);
			});
			return this;
		}

		LBS.fn({
			param: param,
			serialize: serialize,
			ajax: ajax,
			get: get,
			post: post,
			ajaxForm: ajaxForm
		});
	}());

	/*============================================*/
	(function() {
		function camelize(str) {
			return str.replace(/-+(.)?/g, function(match, chr) {
				return chr ? chr.toUpperCase() : ''
			})
		}

		function uncamelize(s, sep) {
			sep = sep || '-';
			return s.replace(/([a-z])([A-Z])/g, function(strMatch, p1, p2) {
				return p1 + sep + p2.toLowerCase();
			});
		}

		function trim(str) {
			return String(str).replace(/^\s+|\s+$/g, '');
		}

		function repeat(str, n) {
			return new Array(n + 1).join(str);
		}

		LBS.fn({
			camelCase: camelize,
			uncamelCase: uncamelize,
			trim: trim,
			repeat: repeat
		});
	}());

	(function() {
		function loadCSS(url) {
			var doc = document,
				head = doc.getElementsByTagName("head")[0],
				link = doc.createElement("link");
			link.type = 'text/css';
			link.href = url;
			head.appendChild(link);
		}

		function addCSS(css) { //addCSS(' div{font-size:100px;} .top{color:red;} ');
			var doc = document,
				head = doc.getElementsByTagName("head")[0],
				style = doc.createElement("style");
			style.type = "text/css";
			try {
				style.appendChild(document.createTextNode(css));
			} catch (ex) {
				style.styleSheet.cssText = css;
			};
			head.appendChild(style);
		}

		function loadJS(url, callback) {
			var doc = document,
				script = doc.createElement('script'),
				head = doc.getElementsByTagName('head')[0];
			script.type = 'text/javascript';
			if (script.readyState) {
				script.onreadystatechange = function() {
					if (script.readyState == 'loaded' || script.readyState == 'complete') {
						script.onreadystatechange = null;
						callback && callback();
					}
				};
			} else {
				script.onload = function() {
					callback && callback();
				};
			}
			script.src = url;
			head.appendChild(script);
		}

		LBS.fn({
			loadCSS: loadCSS,
			addCSS: addCSS,
			loadJS: loadJS
		});
	}());
	/*============================================*/

	/*====================== prototype ======================*/
	LBS.implement(String, {
		camelCase: function() {
			return String(this).replace(/-\D/g, function(match) {
				return match.charAt(1).toUpperCase();
			});
		},
		trim: function() {
			return String(this).replace(/^\s+|\s+$/g, '');
		},
		repeat: function(n) {
			return new Array(n + 1).join(this);
		}
	});

	/*
	LBS.implement(Array,{
		each: function(){
			
		}
	});
	if(typeof Array.prototype.indexOf != "function"){
		Array.prototype.indexOf = function(searchElement, fromIndex){
			var index = -1, i = 0, n = this.length;
			fromIndex = fromIndex * 1 || 0;
			for(; i < n; i++){
	  			if(i >= fromIndex && this[i] === searchElement){
					index = i;
					break;
	  			}
			}
			return index;
		}
	}
	if(typeof Array.prototype.lastIndexOf != "function"){
		Array.prototype.lastIndexOf = function(searchElement, fromIndex){
			var index = -1, i, n = this.length, l = n - 1;
			fromIndex = fromIndex * 1 || l;
			for(i = l; i > -1; i--){
	  			if(i <= fromIndex && this[i] === searchElement){
					index = i;
					break;
	  			}
			}
			return index;
		}
	}
	*/
	/*====================== prototype ======================*/
}());