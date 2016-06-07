/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	var dom = __webpack_require__(2);
	var url = __webpack_require__(4);
	var com = __webpack_require__(5);
	var MZGame = __webpack_require__(6);
	var $loading = $('#loading'), playImages = [], lucky={},
	    $fourth = $('#fourth'), $third = $('#third'), $second=$('#second'), $btnGame=$('#btn-game'),
	    rem=75, rankHeight=240,
	    scale = +document.getElementsByTagName('html')[0].getAttribute('data-dpr'), $rankProcess=$('#rankProcess');
	var dev = '../data.json',
	    h5 = '../data.json';
	var current = url.current(h5, dev),
	    addUrl = current,
	    giftUrl = current;

	Zepto(function() {
	    /**
	     * 预加载图片
	     */
	    $("img[data-src]").each(function() {
	        var $this = $(this);
	        var src = $this.data('src');
	        dom.preImage(src, function() {
	            $this.attr('src', src);
	        });
	    });
	    function next() {
	        var $next = $(this).closest('section').hide().removeClass('fadeIn').next();
	        $next.show().addClass('fadeIn');
	        $next.find('aside').addClass('zoomIn');
	    }

	    /**
	     * 游戏规则
	     */
	    $('#rule').on('click', function() {
	        $(this).siblings('.dialog').show().addClass('zoomIn').removeClass('fadeOut');
	    });
	    /**
	     * 开始游戏
	     */
	    $('#begin').on('click', function() {
	        next.call(this);
	    });
	    /**
	     * 弹出框
	     */
	    $('.btn-dialog').on('touchstart', function(e) {
	        e.preventDefault();
	        $(this).closest('aside').removeClass('zoomIn').hide();
	        //$(this).hide();
	    });
	    /**
	     * 开始游戏
	     */
	    $btnGame.on('touchstart', function() {
	        interval();
	        //requestAnimationFrame(interval2);
	        MZGame.playGame();
	        //move1();
	    });
	    /**
	     * 选择战队
	     */
	    var $corps = $('#corps');
	    var corps = ['车轮','喜马拉雅FM', '墨迹天气', '高夫']
	    $corps.on('click', 'li', function(e) {
	        var icon = +$(this).data('icon');
	        $corps.data('current', icon);
	        //选完后要将龙舟上的Logo标志修改
	        $('#dragon-logo').attr('class', 'brand-'+icon);
	        next.call(this);
	    });
	    /**
	     * 查看优惠券
	     */
	    $('#btn-go').on('click', function() {
	        next.call(this);
	    });
	    /**
	     * 跳转
	     */
	    $('[data-href]').on('click', function() {
	       location.href = $(this).data('href');
	    });

	    /**
	     * 领奖逻辑
	     */
	    var $alert = $fourth.find('aside');
	    $('#btnPrice').on('click', function() {
	        var mobile = $.trim($('#mobile').val());
	        if(!com.regex.mobile.test(mobile)) {
	            $alert.find('p').html('请输入正确的手机号');
	            $alert.show();
	            return;
	        }
	        $loading.show();
	        $.get(giftUrl, {}, function (json) {
	            $loading.hide();

	            if(json.code != 0) {
	                $alert.find('p').html(json.message);
	                $alert.show();
	                return;
	            }
	            $alert.find('p').html('提交成功');
	            $alert.show();
	            setTimeout(function() {
	                next.call($fourth);
	            }, 1500);
	        }, 'json');
	    });
	    var countdown, second = 9, count = 100;

	    /**
	     * 倒计时与游戏逻辑
	     */
	    var $thousand = $('#thousand'), $hundred=$('#hundred'), $decade = $('#decade');
	    function interval() {
	        countdown = setInterval(function() {
	            if(second < 0) {
	                $decade.html(0);//小数位赋0
	                MZGame.gameover();
	                clearInterval(countdown);
	                //发送消息给服务器 添加游戏信息
	                $loading.show();
	                $.get(addUrl, {team_id: $corps.data('current')}, function(json) {
	                    if(json.code != 0) {
	                        $loading.find('p').html(json.message);
	                        return;
	                    }
	                    var data = json.data;
	                    lucky.is_lucky = data.is_lucky;
	                    lucky.lucky_num = data.lucky_num;
	                    lucky.rank_num = data.rank_num;
	                    //处理第四屏
	                    $('#luckNum').html(data.lucky_num);
	                    $('#rankNum').html(data.rank_num);
	                    if(lucky.is_lucky) {
	                        $('#has-gift').show();
	                    }else {
	                        $('#no-gift').show();
	                    }
	                    //计算排行
	                    var total = 0, numbers = [];
	                    for(var i=1; i<=4; i++) {
	                        var key = 'team_'+i, number;
	                        if(!data[key]) {
	                            number = 0;
	                        }else {
	                            number = +data[key];
	                            total += number;
	                        }
	                        numbers.push(number);
	                    }

	                    numbers.forEach(function(value, key) {
	                        var $p = $rankProcess.children('td').eq(key).find('p');
	                        var height = value / total * rankHeight / rem;//计算柱状图，最后换算rem单位
	                        $p.last().css('height', height+'rem');
	                        $p.first().html(value);
	                        //$last.html(value);
	                    });

	                    next.call($third);
	                    $loading.hide();
	                }, 'json');
	            }
	            count--;
	            if(count <= 0) {
	                count = 100;
	                second--;
	                if(second >= 0) {
	                    $thousand.html(second);
	                }
	            }
	            if(second >= 0) {
	                $decade.html(count % 10);
	                $hundred.html((count /10 >>0) % 10);
	            }
	            //$('#hundred').html((count /10) % 10);

	        }, 10);
	    }

	    /**
	     * 再玩一次
	     */
	    $('#btn-again').on('click', function() {
	        $('#fifth').hide().removeClass('fadeIn');
	        $second.show().addClass('fadeIn');
	        $second.find('aside').addClass('zoomIn');

	        //初始化游戏
	        second = 9;
	        count = 100;
	        $thousand.html(second);
	        MZGame.Stage.clear();
	        $btnGame.closest('aside').show();
	        $('#has-gift').hide();
	        $('#no-gift').hide();
	        //gameInit();
	        //interval();
	        //requestAnimationFrame(interval2);
	        //MZGame.playGame();
	    });

	    /**
	     * 炫耀一下
	     */
	    var $flaunt = $('#flaunt');
	    $('#btnFlaunt').on('click', function() {
	        if($flaunt.css('height') == '0px') {
	            $flaunt.css('height', $(document).height());
	        }
	        $flaunt.show();
	    });
	    $flaunt.on('click', function() {
	        $(this).hide();
	    });

	    var $canvas = $('#game');
	    /**
	     * 画布初始化
	     */
	    function canvas() {
	        var winW = window.innerWidth,
	            winH = window.innerHeight;
	        $canvas[0].width = winW;
	        $canvas[0].height = winH;
	        $canvas.css({position:'absolute', display:'block', left:0, top:'20%'});
	    }
	    canvas();

	    /**
	     * 游戏图片预加载
	     */
	    playImages = [
	        'img/gift1.png',
	        'img/gift2.png',
	        'img/gift3.png',
	        'img/gift4.png',
	        'img/gift5.png',
	        'img/gift6.png',
	        'img/gift7.png',
	        'img/dragon-boat.png',
	        'img/score.png',
	        'img/corps.png',//display:none中的背景图将不会加载
	        'img/game-bac.png',
	        'img/countdown.png',
	        'img/river.png',
	        'img/boat-opacity-bac.png',
	        'img/coupon-bac.png',
	        'img/coupon.png',
	        'img/weixin.jpg'
	    ];
	    dom.preImage(playImages, function() {
	        //this.style.width = (this.width / rem) + 'rem';
	        //this.style.height = (this.height / rem) + 'rem';
	        //console.log(this)
	    });

	});

	/**
	 * 游戏初始化
	 */
	function gameInit() {
	    var stage = new createjs.Stage("game");
	    if(scale <= 1) {
	        stage.scaleX = stage.scaleY = 0.5;
	    }
	    createjs.Ticker.on("tick", function(){
	        if(!MZGame.gameEnd){
	            stage.update();
	        }
	    });
	    createjs.Ticker.setFPS(60);
	    MZGame.init(stage);
	    //使得画布可以触摸
	    createjs.Touch.enable(stage, true);
	}

	window.onload = function() {
	    gameInit();
	    $loading.hide();
	    $('#first').show();
	};

	/**
	 * 错误信息
	 * @param msg
	 * @param url
	 * @param line
	 * @param col
	 * @param error
	 */
	//window.onerror = function(msg, url, line, col, error) {
	//    var newMsg = msg;
	//    //alert(error)
	//    if (error && error.stack) {
	//        var stack = error.stack.replace(/\n/gi, "").split(/\bat\b/).slice(0, 9).join("@").replace(/\?[^:]+/gi, "");
	//        var msg = error.toString();
	//        if (stack.indexOf(msg) < 0) {
	//            stack = msg + "@" + stack;
	//        }
	//        newMsg = stack;
	//    }
	//    var obj = {msg:newMsg, target:url, rowNum:line, colNum:col};
	//    $('body')[0].innerHTML += line + ':'+''+'：<p>'+obj.msg+'</p>';
	//    console.log(obj.msg)
	//};

/***/ },
/* 1 */
/***/ function(module, exports) {

	;(function (global, factory) {
		if (typeof module === "object" && typeof module.exports === "object") {
			module.exports = factory(global);
		} else {
			factory(global);
		}
	})(typeof window !== "undefined" ? window : this, function (window) {

		var Zepto = (function () {
			var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
				document = window.document,
				elementDisplay = {}, classCache = {},
				cssNumber = {
					'column-count': 1,
					'columns': 1,
					'font-weight': 1,
					'line-height': 1,
					'opacity': 1,
					'z-index': 1,
					'zoom': 1
				},
				fragmentRE = /^\s*<(\w+|!)[^>]*>/,
				singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
				tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
				rootNodeRE = /^(?:body|html)$/i,
				capitalRE = /([A-Z])/g,

			// special attributes that should be get/set via method calls
				methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

				adjacencyOperators = ['after', 'prepend', 'before', 'append'],
				table = document.createElement('table'),
				tableRow = document.createElement('tr'),
				containers = {
					'tr': document.createElement('tbody'),
					'tbody': table, 'thead': table, 'tfoot': table,
					'td': tableRow, 'th': tableRow,
					'*': document.createElement('div')
				},
				readyRE = /complete|loaded|interactive/,
				simpleSelectorRE = /^[\w-]*$/,
				class2type = {},
				toString = class2type.toString,
				zepto = {},
				camelize, uniq,
				tempParent = document.createElement('div'),
				propMap = {
					'tabindex': 'tabIndex',
					'readonly': 'readOnly',
					'for': 'htmlFor',
					'class': 'className',
					'maxlength': 'maxLength',
					'cellspacing': 'cellSpacing',
					'cellpadding': 'cellPadding',
					'rowspan': 'rowSpan',
					'colspan': 'colSpan',
					'usemap': 'useMap',
					'frameborder': 'frameBorder',
					'contenteditable': 'contentEditable'
				},
				isArray = Array.isArray ||
					function (object) {
						return object instanceof Array
					}

			zepto.matches = function (element, selector) {
				if (!selector || !element || element.nodeType !== 1) return false
				var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
					element.oMatchesSelector || element.matchesSelector
				if (matchesSelector) return matchesSelector.call(element, selector)
				// fall back to performing a selector:
				var match, parent = element.parentNode, temp = !parent
				if (temp) (parent = tempParent).appendChild(element)
				match = ~zepto.qsa(parent, selector).indexOf(element)
				temp && tempParent.removeChild(element)
				return match
			}

			function type(obj) {
				return obj == null ? String(obj) :
				class2type[toString.call(obj)] || "object"
			}

			function isFunction(value) {
				return type(value) == "function"
			}

			function isWindow(obj) {
				return obj != null && obj == obj.window
			}

			function isDocument(obj) {
				return obj != null && obj.nodeType == obj.DOCUMENT_NODE
			}

			function isObject(obj) {
				return type(obj) == "object"
			}

			function isPlainObject(obj) {
				return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
			}

			function likeArray(obj) {
				return typeof obj.length == 'number'
			}

			function compact(array) {
				return filter.call(array, function (item) {
					return item != null
				})
			}

			function flatten(array) {
				return array.length > 0 ? $.fn.concat.apply([], array) : array
			}

			camelize = function (str) {
				return str.replace(/-+(.)?/g, function (match, chr) {
					return chr ? chr.toUpperCase() : ''
				})
			}
			function dasherize(str) {
				return str.replace(/::/g, '/')
					.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
					.replace(/([a-z\d])([A-Z])/g, '$1_$2')
					.replace(/_/g, '-')
					.toLowerCase()
			}

			uniq = function (array) {
				return filter.call(array, function (item, idx) {
					return array.indexOf(item) == idx
				})
			}

			function classRE(name) {
				return name in classCache ?
					classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
			}

			function maybeAddPx(name, value) {
				return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
			}

			function defaultDisplay(nodeName) {
				var element, display
				if (!elementDisplay[nodeName]) {
					element = document.createElement(nodeName)
					document.body.appendChild(element)
					display = getComputedStyle(element, '').getPropertyValue("display")
					element.parentNode.removeChild(element)
					display == "none" && (display = "block")
					elementDisplay[nodeName] = display
				}
				return elementDisplay[nodeName]
			}

			function children(element) {
				return 'children' in element ?
					slice.call(element.children) :
					$.map(element.childNodes, function (node) {
						if (node.nodeType == 1) return node
					})
			}

			// `$.zepto.fragment` takes a html string and an optional tag name
			// to generate DOM nodes nodes from the given html string.
			// The generated DOM nodes are returned as an array.
			// This function can be overriden in plugins for example to make
			// it compatible with browsers that don't support the DOM fully.
			zepto.fragment = function (html, name, properties) {
				var dom, nodes, container

				// A special case optimization for a single tag
				if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

				if (!dom) {
					if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
					if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
					if (!(name in containers)) name = '*'

					container = containers[name]
					container.innerHTML = '' + html
					dom = $.each(slice.call(container.childNodes), function () {
						container.removeChild(this)
					})
				}

				if (isPlainObject(properties)) {
					nodes = $(dom)
					$.each(properties, function (key, value) {
						if (methodAttributes.indexOf(key) > -1) nodes[key](value)
						else nodes.attr(key, value)
					})
				}

				return dom
			}

			// `$.zepto.Z` swaps out the prototype of the given `dom` array
			// of nodes with `$.fn` and thus supplying all the Zepto functions
			// to the array. Note that `__proto__` is not supported on Internet
			// Explorer. This method can be overriden in plugins.
			zepto.Z = function (dom, selector) {
				dom = dom || []
				dom.__proto__ = $.fn
				dom.selector = selector || ''
				return dom
			}

			// `$.zepto.isZ` should return `true` if the given object is a Zepto
			// collection. This method can be overriden in plugins.
			zepto.isZ = function (object) {
				return object instanceof zepto.Z
			}

			// `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
			// takes a CSS selector and an optional context (and handles various
			// special cases).
			// This method can be overriden in plugins.
			zepto.init = function (selector, context) {
				var dom
				// If nothing given, return an empty Zepto collection
				if (!selector) return zepto.Z()
				// Optimize for string selectors
				else if (typeof selector == 'string') {
					selector = selector.trim()
					// If it's a html fragment, create nodes from it
					// Note: In both Chrome 21 and Firefox 15, DOM error 12
					// is thrown if the fragment doesn't begin with <
					if (selector[0] == '<' && fragmentRE.test(selector))
						dom = zepto.fragment(selector, RegExp.$1, context), selector = null
					// If there's a context, create a collection on that context first, and select
					// nodes from there
					else if (context !== undefined) return $(context).find(selector)
					// If it's a CSS selector, use it to select nodes.
					else dom = zepto.qsa(document, selector)
				}
				// If a function is given, call it when the DOM is ready
				else if (isFunction(selector)) return $(document).ready(selector)
				// If a Zepto collection is given, just return it
				else if (zepto.isZ(selector)) return selector
				else {
					// normalize array if an array of nodes is given
					if (isArray(selector)) dom = compact(selector)
					// Wrap DOM nodes.
					else if (isObject(selector))
						dom = [selector], selector = null
					// If it's a html fragment, create nodes from it
					else if (fragmentRE.test(selector))
						dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
					// If there's a context, create a collection on that context first, and select
					// nodes from there
					else if (context !== undefined) return $(context).find(selector)
					// And last but no least, if it's a CSS selector, use it to select nodes.
					else dom = zepto.qsa(document, selector)
				}
				// create a new Zepto collection from the nodes found
				return zepto.Z(dom, selector)
			}

			// `$` will be the base `Zepto` object. When calling this
			// function just call `$.zepto.init, which makes the implementation
			// details of selecting nodes and creating Zepto collections
			// patchable in plugins.
			$ = function (selector, context) {
				return zepto.init(selector, context)
			}

			function extend(target, source, deep) {
				for (key in source)
					if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
						if (isPlainObject(source[key]) && !isPlainObject(target[key]))
							target[key] = {}
						if (isArray(source[key]) && !isArray(target[key]))
							target[key] = []
						extend(target[key], source[key], deep)
					}
					else if (source[key] !== undefined) target[key] = source[key]
			}

			// Copy all but undefined properties from one or more
			// objects to the `target` object.
			$.extend = function (target) {
				var deep, args = slice.call(arguments, 1)
				if (typeof target == 'boolean') {
					deep = target
					target = args.shift()
				}
				args.forEach(function (arg) {
					extend(target, arg, deep)
				})
				return target
			}

			// `$.zepto.qsa` is Zepto's CSS selector implementation which
			// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
			// This method can be overriden in plugins.
			zepto.qsa = function (element, selector) {
				var found,
					maybeID = selector[0] == '#',
					maybeClass = !maybeID && selector[0] == '.',
					nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
					isSimple = simpleSelectorRE.test(nameOnly)
				return (isDocument(element) && isSimple && maybeID) ?
					( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
					(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
						slice.call(
							isSimple && !maybeID ?
								maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
									element.getElementsByTagName(selector) : // Or a tag
								element.querySelectorAll(selector) // Or it's not simple, and we need to query all
						)
			}

			function filtered(nodes, selector) {
				return selector == null ? $(nodes) : $(nodes).filter(selector)
			}

			$.contains = document.documentElement.contains ?
				function (parent, node) {
					return parent !== node && parent.contains(node)
				} :
				function (parent, node) {
					while (node && (node = node.parentNode))
						if (node === parent) return true
					return false
				}

			function funcArg(context, arg, idx, payload) {
				return isFunction(arg) ? arg.call(context, idx, payload) : arg
			}

			function setAttribute(node, name, value) {
				value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
			}

			// access className property while respecting SVGAnimatedString
			function className(node, value) {
				var klass = node.className || '',
					svg = klass && klass.baseVal !== undefined

				if (value === undefined) return svg ? klass.baseVal : klass
				svg ? (klass.baseVal = value) : (node.className = value)
			}

			// "true"  => true
			// "false" => false
			// "null"  => null
			// "42"    => 42
			// "42.5"  => 42.5
			// "08"    => "08"
			// JSON    => parse if valid
			// String  => self
			function deserializeValue(value) {
				try {
					return value ?
					value == "true" ||
					( value == "false" ? false :
						value == "null" ? null :
							+value + "" == value ? +value :
								/^[\[\{]/.test(value) ? $.parseJSON(value) :
									value )
						: value
				} catch (e) {
					return value
				}
			}

			$.type = type
			$.isFunction = isFunction
			$.isWindow = isWindow
			$.isArray = isArray
			$.isPlainObject = isPlainObject

			$.isEmptyObject = function (obj) {
				var name
				for (name in obj) return false
				return true
			}

			$.inArray = function (elem, array, i) {
				return emptyArray.indexOf.call(array, elem, i)
			}

			$.camelCase = camelize
			$.trim = function (str) {
				return str == null ? "" : String.prototype.trim.call(str)
			}

			// plugin compatibility
			$.uuid = 0
			$.support = {}
			$.expr = {}

			$.map = function (elements, callback) {
				var value, values = [], i, key
				if (likeArray(elements))
					for (i = 0; i < elements.length; i++) {
						value = callback(elements[i], i)
						if (value != null) values.push(value)
					}
				else
					for (key in elements) {
						value = callback(elements[key], key)
						if (value != null) values.push(value)
					}
				return flatten(values)
			}

			$.each = function (elements, callback) {
				var i, key
				if (likeArray(elements)) {
					for (i = 0; i < elements.length; i++)
						if (callback.call(elements[i], i, elements[i]) === false) return elements
				} else {
					for (key in elements)
						if (callback.call(elements[key], key, elements[key]) === false) return elements
				}

				return elements
			}

			$.grep = function (elements, callback) {
				return filter.call(elements, callback)
			}

			if (window.JSON) $.parseJSON = JSON.parse

			// Populate the class2type map
			$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
				class2type["[object " + name + "]"] = name.toLowerCase()
			})

			// Define methods that will be available on all
			// Zepto collections
			$.fn = {
				// Because a collection acts like an array
				// copy over these useful array functions.
				forEach: emptyArray.forEach,
				reduce: emptyArray.reduce,
				push: emptyArray.push,
				sort: emptyArray.sort,
				indexOf: emptyArray.indexOf,
				concat: emptyArray.concat,

				// `map` and `slice` in the jQuery API work differently
				// from their array counterparts
				map: function (fn) {
					return $($.map(this, function (el, i) {
						return fn.call(el, i, el)
					}))
				},
				slice: function () {
					return $(slice.apply(this, arguments))
				},

				ready: function (callback) {
					// need to check if document.body exists for IE as that browser reports
					// document ready when it hasn't yet created the body element
					if (readyRE.test(document.readyState) && document.body) callback($)
					else document.addEventListener('DOMContentLoaded', function () {
						callback($)
					}, false)
					return this
				},
				get: function (idx) {
					return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
				},
				toArray: function () {
					return this.get()
				},
				size: function () {
					return this.length
				},
				remove: function () {
					return this.each(function () {
						if (this.parentNode != null)
							this.parentNode.removeChild(this)
					})
				},
				each: function (callback) {
					emptyArray.every.call(this, function (el, idx) {
						return callback.call(el, idx, el) !== false
					})
					return this
				},
				filter: function (selector) {
					if (isFunction(selector)) return this.not(this.not(selector))
					return $(filter.call(this, function (element) {
						return zepto.matches(element, selector)
					}))
				},
				add: function (selector, context) {
					return $(uniq(this.concat($(selector, context))))
				},
				is: function (selector) {
					return this.length > 0 && zepto.matches(this[0], selector)
				},
				not: function (selector) {
					var nodes = []
					if (isFunction(selector) && selector.call !== undefined)
						this.each(function (idx) {
							if (!selector.call(this, idx)) nodes.push(this)
						})
					else {
						var excludes = typeof selector == 'string' ? this.filter(selector) :
							(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
						this.forEach(function (el) {
							if (excludes.indexOf(el) < 0) nodes.push(el)
						})
					}
					return $(nodes)
				},
				has: function (selector) {
					return this.filter(function () {
						return isObject(selector) ?
							$.contains(this, selector) :
							$(this).find(selector).size()
					})
				},
				eq: function (idx) {
					return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
				},
				first: function () {
					var el = this[0]
					return el && !isObject(el) ? el : $(el)
				},
				last: function () {
					var el = this[this.length - 1]
					return el && !isObject(el) ? el : $(el)
				},
				find: function (selector) {
					var result, $this = this
					if (!selector) result = $()
					else if (typeof selector == 'object')
						result = $(selector).filter(function () {
							var node = this
							return emptyArray.some.call($this, function (parent) {
								return $.contains(parent, node)
							})
						})
					else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
					else result = this.map(function () {
							return zepto.qsa(this, selector)
						})
					return result
				},
				closest: function (selector, context) {
					var node = this[0], collection = false
					if (typeof selector == 'object') collection = $(selector)
					while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
						node = node !== context && !isDocument(node) && node.parentNode
					return $(node)
				},
				parents: function (selector) {
					var ancestors = [], nodes = this
					while (nodes.length > 0)
						nodes = $.map(nodes, function (node) {
							if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
								ancestors.push(node)
								return node
							}
						})
					return filtered(ancestors, selector)
				},
				parent: function (selector) {
					return filtered(uniq(this.pluck('parentNode')), selector)
				},
				children: function (selector) {
					return filtered(this.map(function () {
						return children(this)
					}), selector)
				},
				contents: function () {
					return this.map(function () {
						return slice.call(this.childNodes)
					})
				},
				siblings: function (selector) {
					return filtered(this.map(function (i, el) {
						return filter.call(children(el.parentNode), function (child) {
							return child !== el
						})
					}), selector)
				},
				empty: function () {
					return this.each(function () {
						this.innerHTML = ''
					})
				},
				// `pluck` is borrowed from Prototype.js
				pluck: function (property) {
					return $.map(this, function (el) {
						return el[property]
					})
				},
				show: function () {
					return this.each(function () {
						this.style.display == "none" && (this.style.display = '')
						if (getComputedStyle(this, '').getPropertyValue("display") == "none")
							this.style.display = defaultDisplay(this.nodeName)
					})
				},
				replaceWith: function (newContent) {
					return this.before(newContent).remove()
				},
				wrap: function (structure) {
					var func = isFunction(structure)
					if (this[0] && !func)
						var dom = $(structure).get(0),
							clone = dom.parentNode || this.length > 1

					return this.each(function (index) {
						$(this).wrapAll(
							func ? structure.call(this, index) :
								clone ? dom.cloneNode(true) : dom
						)
					})
				},
				wrapAll: function (structure) {
					if (this[0]) {
						$(this[0]).before(structure = $(structure))
						var children
						// drill down to the inmost element
						while ((children = structure.children()).length) structure = children.first()
						$(structure).append(this)
					}
					return this
				},
				wrapInner: function (structure) {
					var func = isFunction(structure)
					return this.each(function (index) {
						var self = $(this), contents = self.contents(),
							dom = func ? structure.call(this, index) : structure
						contents.length ? contents.wrapAll(dom) : self.append(dom)
					})
				},
				unwrap: function () {
					this.parent().each(function () {
						$(this).replaceWith($(this).children())
					})
					return this
				},
				clone: function () {
					return this.map(function () {
						return this.cloneNode(true)
					})
				},
				hide: function () {
					return this.css("display", "none")
				},
				toggle: function (setting) {
					return this.each(function () {
						var el = $(this)
							;
						(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
					})
				},
				prev: function (selector) {
					return $(this.pluck('previousElementSibling')).filter(selector || '*')
				},
				next: function (selector) {
					return $(this.pluck('nextElementSibling')).filter(selector || '*')
				},
				html: function (html) {
					return 0 in arguments ?
						this.each(function (idx) {
							var originHtml = this.innerHTML
							$(this).empty().append(funcArg(this, html, idx, originHtml))
						}) :
						(0 in this ? this[0].innerHTML : null)
				},
				text: function (text) {
					return 0 in arguments ?
						this.each(function (idx) {
							var newText = funcArg(this, text, idx, this.textContent)
							this.textContent = newText == null ? '' : '' + newText
						}) :
						(0 in this ? this[0].textContent : null)
				},
				attr: function (name, value) {
					var result
					return (typeof name == 'string' && !(1 in arguments)) ?
						(!this.length || this[0].nodeType !== 1 ? undefined :
								(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
						) :
						this.each(function (idx) {
							if (this.nodeType !== 1) return
							if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
							else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
						})
				},
				removeAttr: function (name) {
					return this.each(function () {
						this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
							setAttribute(this, attribute)
						}, this)
					})
				},
				prop: function (name, value) {
					name = propMap[name] || name
					return (1 in arguments) ?
						this.each(function (idx) {
							this[name] = funcArg(this, value, idx, this[name])
						}) :
						(this[0] && this[0][name])
				},
				data: function (name, value) {
					var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

					var data = (1 in arguments) ?
						this.attr(attrName, value) :
						this.attr(attrName)

					return data !== null ? deserializeValue(data) : undefined
				},
				val: function (value) {
					return 0 in arguments ?
						this.each(function (idx) {
							this.value = funcArg(this, value, idx, this.value)
						}) :
						(this[0] && (this[0].multiple ?
								$(this[0]).find('option').filter(function () {
									return this.selected
								}).pluck('value') :
								this[0].value)
						)
				},
				offset: function (coordinates) {
					if (coordinates) return this.each(function (index) {
						var $this = $(this),
							coords = funcArg(this, coordinates, index, $this.offset()),
							parentOffset = $this.offsetParent().offset(),
							props = {
								top: coords.top - parentOffset.top,
								left: coords.left - parentOffset.left
							}

						if ($this.css('position') == 'static') props['position'] = 'relative'
						$this.css(props)
					})
					if (!this.length) return null
					var obj = this[0].getBoundingClientRect()
					return {
						left: obj.left + window.pageXOffset,
						top: obj.top + window.pageYOffset,
						width: Math.round(obj.width),
						height: Math.round(obj.height)
					}
				},
				css: function (property, value) {
					if (arguments.length < 2) {
						var computedStyle, element = this[0]
						if (!element) return
						computedStyle = getComputedStyle(element, '')
						if (typeof property == 'string')
							return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
						else if (isArray(property)) {
							var props = {}
							$.each(property, function (_, prop) {
								props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
							})
							return props
						}
					}

					var css = ''
					if (type(property) == 'string') {
						if (!value && value !== 0)
							this.each(function () {
								this.style.removeProperty(dasherize(property))
							})
						else
							css = dasherize(property) + ":" + maybeAddPx(property, value)
					} else {
						for (key in property)
							if (!property[key] && property[key] !== 0)
								this.each(function () {
									this.style.removeProperty(dasherize(key))
								})
							else
								css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
					}

					return this.each(function () {
						this.style.cssText += ';' + css
					})
				},
				index: function (element) {
					return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
				},
				hasClass: function (name) {
					if (!name) return false
					return emptyArray.some.call(this, function (el) {
						return this.test(className(el))
					}, classRE(name))
				},
				addClass: function (name) {
					if (!name) return this
					return this.each(function (idx) {
						if (!('className' in this)) return
						classList = []
						var cls = className(this), newName = funcArg(this, name, idx, cls)
						newName.split(/\s+/g).forEach(function (klass) {
							if (!$(this).hasClass(klass)) classList.push(klass)
						}, this)
						classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
					})
				},
				removeClass: function (name) {
					return this.each(function (idx) {
						if (!('className' in this)) return
						if (name === undefined) return className(this, '')
						classList = className(this)
						funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
							classList = classList.replace(classRE(klass), " ")
						})
						className(this, classList.trim())
					})
				},
				toggleClass: function (name, when) {
					if (!name) return this
					return this.each(function (idx) {
						var $this = $(this), names = funcArg(this, name, idx, className(this))
						names.split(/\s+/g).forEach(function (klass) {
							(when === undefined ? !$this.hasClass(klass) : when) ?
								$this.addClass(klass) : $this.removeClass(klass)
						})
					})
				},
				scrollTop: function (value) {
					if (!this.length) return
					var hasScrollTop = 'scrollTop' in this[0]
					if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
					return this.each(hasScrollTop ?
						function () {
							this.scrollTop = value
						} :
						function () {
							this.scrollTo(this.scrollX, value)
						})
				},
				scrollLeft: function (value) {
					if (!this.length) return
					var hasScrollLeft = 'scrollLeft' in this[0]
					if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
					return this.each(hasScrollLeft ?
						function () {
							this.scrollLeft = value
						} :
						function () {
							this.scrollTo(value, this.scrollY)
						})
				},
				position: function () {
					if (!this.length) return

					var elem = this[0],
					// Get *real* offsetParent
						offsetParent = this.offsetParent(),
					// Get correct offsets
						offset = this.offset(),
						parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {top: 0, left: 0} : offsetParent.offset()

					// Subtract element margins
					// note: when an element has margin: auto the offsetLeft and marginLeft
					// are the same in Safari causing offset.left to incorrectly be 0
					offset.top -= parseFloat($(elem).css('margin-top')) || 0
					offset.left -= parseFloat($(elem).css('margin-left')) || 0

					// Add offsetParent borders
					parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
					parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

					// Subtract the two offsets
					return {
						top: offset.top - parentOffset.top,
						left: offset.left - parentOffset.left
					}
				},
				offsetParent: function () {
					return this.map(function () {
						var parent = this.offsetParent || document.body
						while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
							parent = parent.offsetParent
						return parent
					})
				}
			}

			// for now
			$.fn.detach = $.fn.remove

				// Generate the `width` and `height` functions
			;
			['width', 'height'].forEach(function (dimension) {
				var dimensionProperty =
					dimension.replace(/./, function (m) {
						return m[0].toUpperCase()
					})

				$.fn[dimension] = function (value) {
					var offset, el = this[0]
					if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
						isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
						(offset = this.offset()) && offset[dimension]
					else return this.each(function (idx) {
						el = $(this)
						el.css(dimension, funcArg(this, value, idx, el[dimension]()))
					})
				}
			})

			function traverseNode(node, fun) {
				fun(node)
				for (var i = 0, len = node.childNodes.length; i < len; i++)
					traverseNode(node.childNodes[i], fun)
			}

			// Generate the `after`, `prepend`, `before`, `append`,
			// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
			adjacencyOperators.forEach(function (operator, operatorIndex) {
				var inside = operatorIndex % 2 //=> prepend, append

				$.fn[operator] = function () {
					// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
					var argType, nodes = $.map(arguments, function (arg) {
							argType = type(arg)
							return argType == "object" || argType == "array" || arg == null ?
								arg : zepto.fragment(arg)
						}),
						parent, copyByClone = this.length > 1
					if (nodes.length < 1) return this

					return this.each(function (_, target) {
						parent = inside ? target : target.parentNode

						// convert all methods to a "before" operation
						target = operatorIndex == 0 ? target.nextSibling :
							operatorIndex == 1 ? target.firstChild :
								operatorIndex == 2 ? target :
									null

						var parentInDocument = $.contains(document.documentElement, parent)

						nodes.forEach(function (node) {
							if (copyByClone) node = node.cloneNode(true)
							else if (!parent) return $(node).remove()

							parent.insertBefore(node, target)
							if (parentInDocument) traverseNode(node, function (el) {
								if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
									(!el.type || el.type === 'text/javascript') && !el.src)
									window['eval'].call(window, el.innerHTML)
							})
						})
					})
				}

				// after    => insertAfter
				// prepend  => prependTo
				// before   => insertBefore
				// append   => appendTo
				$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
					$(html)[operator](this)
					return this
				}
			})

			zepto.Z.prototype = $.fn

			// Export internal API functions in the `$.zepto` namespace
			zepto.uniq = uniq
			zepto.deserializeValue = deserializeValue
			$.zepto = zepto

			return $
		})()

		window.Zepto = Zepto
		window.$ === undefined && (window.$ = Zepto)

		;
		(function ($) {
			var _zid = 1, undefined,
				slice = Array.prototype.slice,
				isFunction = $.isFunction,
				isString = function (obj) {
					return typeof obj == 'string'
				},
				handlers = {},
				specialEvents = {},
				focusinSupported = 'onfocusin' in window,
				focus = {focus: 'focusin', blur: 'focusout'},
				hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'}

			specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

			function zid(element) {
				return element._zid || (element._zid = _zid++)
			}

			function findHandlers(element, event, fn, selector) {
				event = parse(event)
				if (event.ns) var matcher = matcherFor(event.ns)
				return (handlers[zid(element)] || []).filter(function (handler) {
					return handler
						&& (!event.e || handler.e == event.e)
						&& (!event.ns || matcher.test(handler.ns))
						&& (!fn || zid(handler.fn) === zid(fn))
						&& (!selector || handler.sel == selector)
				})
			}

			function parse(event) {
				var parts = ('' + event).split('.')
				return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
			}

			function matcherFor(ns) {
				return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
			}

			function eventCapture(handler, captureSetting) {
				return handler.del &&
					(!focusinSupported && (handler.e in focus)) || !!captureSetting
			}

			function realEvent(type) {
				return hover[type] || (focusinSupported && focus[type]) || type
			}

			function add(element, events, fn, data, selector, delegator, capture) {
				var id = zid(element), set = (handlers[id] || (handlers[id] = []))
				events.split(/\s/).forEach(function (event) {
					if (event == 'ready') return $(document).ready(fn)
					var handler = parse(event)
					handler.fn = fn
					handler.sel = selector
					// emulate mouseenter, mouseleave
					if (handler.e in hover) fn = function (e) {
						var related = e.relatedTarget
						if (!related || (related !== this && !$.contains(this, related)))
							return handler.fn.apply(this, arguments)
					}
					handler.del = delegator
					var callback = delegator || fn
					handler.proxy = function (e) {
						e = compatible(e)
						if (e.isImmediatePropagationStopped()) return
						e.data = data
						var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
						if (result === false) e.preventDefault(), e.stopPropagation()
						return result
					}
					handler.i = set.length
					set.push(handler)
					if ('addEventListener' in element)
						element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
				})
			}

			function remove(element, events, fn, selector, capture) {
				var id = zid(element)
					;
				(events || '').split(/\s/).forEach(function (event) {
					findHandlers(element, event, fn, selector).forEach(function (handler) {
						delete handlers[id][handler.i]
						if ('removeEventListener' in element)
							element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
					})
				})
			}

			$.event = {add: add, remove: remove}

			$.proxy = function (fn, context) {
				var args = (2 in arguments) && slice.call(arguments, 2)
				if (isFunction(fn)) {
					var proxyFn = function () {
						return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
					}
					proxyFn._zid = zid(fn)
					return proxyFn
				} else if (isString(context)) {
					if (args) {
						args.unshift(fn[context], fn)
						return $.proxy.apply(null, args)
					} else {
						return $.proxy(fn[context], fn)
					}
				} else {
					throw new TypeError("expected function")
				}
			}

			$.fn.bind = function (event, data, callback) {
				return this.on(event, data, callback)
			}
			$.fn.unbind = function (event, callback) {
				return this.off(event, callback)
			}
			$.fn.one = function (event, selector, data, callback) {
				return this.on(event, selector, data, callback, 1)
			}

			var returnTrue = function () {
					return true
				},
				returnFalse = function () {
					return false
				},
				ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
				eventMethods = {
					preventDefault: 'isDefaultPrevented',
					stopImmediatePropagation: 'isImmediatePropagationStopped',
					stopPropagation: 'isPropagationStopped'
				}

			function compatible(event, source) {
				if (source || !event.isDefaultPrevented) {
					source || (source = event)

					$.each(eventMethods, function (name, predicate) {
						var sourceMethod = source[name]
						event[name] = function () {
							this[predicate] = returnTrue
							return sourceMethod && sourceMethod.apply(source, arguments)
						}
						event[predicate] = returnFalse
					})

					if (source.defaultPrevented !== undefined ? source.defaultPrevented :
							'returnValue' in source ? source.returnValue === false :
							source.getPreventDefault && source.getPreventDefault())
						event.isDefaultPrevented = returnTrue
				}
				return event
			}

			function createProxy(event) {
				var key, proxy = {originalEvent: event}
				for (key in event)
					if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

				return compatible(proxy, event)
			}

			$.fn.delegate = function (selector, event, callback) {
				return this.on(event, selector, callback)
			}
			$.fn.undelegate = function (selector, event, callback) {
				return this.off(event, selector, callback)
			}

			$.fn.live = function (event, callback) {
				$(document.body).delegate(this.selector, event, callback)
				return this
			}
			$.fn.die = function (event, callback) {
				$(document.body).undelegate(this.selector, event, callback)
				return this
			}

			$.fn.on = function (event, selector, data, callback, one) {
				var autoRemove, delegator, $this = this
				if (event && !isString(event)) {
					$.each(event, function (type, fn) {
						$this.on(type, selector, data, fn, one)
					})
					return $this
				}

				if (!isString(selector) && !isFunction(callback) && callback !== false)
					callback = data, data = selector, selector = undefined
				if (isFunction(data) || data === false)
					callback = data, data = undefined

				if (callback === false) callback = returnFalse

				return $this.each(function (_, element) {
					if (one) autoRemove = function (e) {
						remove(element, e.type, callback)
						return callback.apply(this, arguments)
					}

					if (selector) delegator = function (e) {
						var evt, match = $(e.target).closest(selector, element).get(0)
						if (match && match !== element) {
							evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
							return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
						}
					}

					add(element, event, callback, data, selector, delegator || autoRemove)
				})
			}
			$.fn.off = function (event, selector, callback) {
				var $this = this
				if (event && !isString(event)) {
					$.each(event, function (type, fn) {
						$this.off(type, selector, fn)
					})
					return $this
				}

				if (!isString(selector) && !isFunction(callback) && callback !== false)
					callback = selector, selector = undefined

				if (callback === false) callback = returnFalse

				return $this.each(function () {
					remove(this, event, callback, selector)
				})
			}

			$.fn.trigger = function (event, args) {
				event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
				event._args = args
				return this.each(function () {
					// handle focus(), blur() by calling them directly
					if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
					// items in the collection might not be DOM elements
					else if ('dispatchEvent' in this) this.dispatchEvent(event)
					else $(this).triggerHandler(event, args)
				})
			}

			// triggers event handlers on current element just as if an event occurred,
			// doesn't trigger an actual event, doesn't bubble
			$.fn.triggerHandler = function (event, args) {
				var e, result
				this.each(function (i, element) {
					e = createProxy(isString(event) ? $.Event(event) : event)
					e._args = args
					e.target = element
					$.each(findHandlers(element, event.type || event), function (i, handler) {
						result = handler.proxy(e)
						if (e.isImmediatePropagationStopped()) return false
					})
				})
				return result
			}

				// shortcut methods for `.bind(event, fn)` for each event type
			;
			('focusin focusout focus blur load resize scroll unload click dblclick ' +
			'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
			'change select keydown keypress keyup error').split(' ').forEach(function (event) {
				$.fn[event] = function (callback) {
					return (0 in arguments) ?
						this.bind(event, callback) :
						this.trigger(event)
				}
			})

			$.Event = function (type, props) {
				if (!isString(type)) props = type, type = props.type
				var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
				if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
				event.initEvent(type, bubbles, true)
				return compatible(event)
			}

		})(Zepto)

		;
		(function ($) {
			var jsonpID = 0,
				document = window.document,
				key,
				name,
				rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
				scriptTypeRE = /^(?:text|application)\/javascript/i,
				xmlTypeRE = /^(?:text|application)\/xml/i,
				jsonType = 'application/json',
				htmlType = 'text/html',
				blankRE = /^\s*$/,
				originAnchor = document.createElement('a')

			originAnchor.href = window.location.href

			// trigger a custom event and return false if it was cancelled
			function triggerAndReturn(context, eventName, data) {
				var event = $.Event(eventName)
				$(context).trigger(event, data)
				return !event.isDefaultPrevented()
			}

			// trigger an Ajax "global" event
			function triggerGlobal(settings, context, eventName, data) {
				if (settings.global) return triggerAndReturn(context || document, eventName, data)
			}

			// Number of active Ajax requests
			$.active = 0

			function ajaxStart(settings) {
				if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
			}

			function ajaxStop(settings) {
				if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
			}

			// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
			function ajaxBeforeSend(xhr, settings) {
				var context = settings.context
				if (settings.beforeSend.call(context, xhr, settings) === false ||
					triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
					return false

				triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
			}

			function ajaxSuccess(data, xhr, settings, deferred) {
				var context = settings.context, status = 'success'
				settings.success.call(context, data, status, xhr)
				if (deferred) deferred.resolveWith(context, [data, status, xhr])
				triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
				ajaxComplete(status, xhr, settings)
			}

			// type: "timeout", "error", "abort", "parsererror"
			function ajaxError(error, type, xhr, settings, deferred) {
				var context = settings.context
				settings.error.call(context, xhr, type, error)
				if (deferred) deferred.rejectWith(context, [xhr, type, error])
				triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
				ajaxComplete(type, xhr, settings)
			}

			// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
			function ajaxComplete(status, xhr, settings) {
				var context = settings.context
				settings.complete.call(context, xhr, status)
				triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
				ajaxStop(settings)
			}

			// Empty function, used as default callback
			function empty() {
			}

			$.ajaxJSONP = function (options, deferred) {
				if (!('type' in options)) return $.ajax(options)

				var _callbackName = options.jsonpCallback,
					callbackName = ($.isFunction(_callbackName) ?
							_callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
					script = document.createElement('script'),
					originalCallback = window[callbackName],
					responseData,
					abort = function (errorType) {
						$(script).triggerHandler('error', errorType || 'abort')
					},
					xhr = {abort: abort}, abortTimeout

				if (deferred) deferred.promise(xhr)

				$(script).on('load error', function (e, errorType) {
					clearTimeout(abortTimeout)
					$(script).off().remove()

					if (e.type == 'error' || !responseData) {
						ajaxError(null, errorType || 'error', xhr, options, deferred)
					} else {
						ajaxSuccess(responseData[0], xhr, options, deferred)
					}

					window[callbackName] = originalCallback
					if (responseData && $.isFunction(originalCallback))
						originalCallback(responseData[0])

					originalCallback = responseData = undefined
				})

				if (ajaxBeforeSend(xhr, options) === false) {
					abort('abort')
					return xhr
				}

				window[callbackName] = function () {
					responseData = arguments
				}

				script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
				document.head.appendChild(script)

				if (options.timeout > 0) abortTimeout = setTimeout(function () {
					abort('timeout')
				}, options.timeout)

				return xhr
			}

			$.ajaxSettings = {
				// Default type of request
				type: 'GET',
				// Callback that is executed before request
				beforeSend: empty,
				// Callback that is executed if the request succeeds
				success: empty,
				// Callback that is executed the the server drops error
				error: empty,
				// Callback that is executed on request complete (both: error and success)
				complete: empty,
				// The context for the callbacks
				context: null,
				// Whether to trigger "global" Ajax events
				global: true,
				// Transport
				xhr: function () {
					return new window.XMLHttpRequest()
				},
				// MIME types mapping
				// IIS returns Javascript as "application/x-javascript"
				accepts: {
					script: 'text/javascript, application/javascript, application/x-javascript',
					json: jsonType,
					xml: 'application/xml, text/xml',
					html: htmlType,
					text: 'text/plain'
				},
				// Whether the request is to another domain
				crossDomain: false,
				// Default timeout
				timeout: 0,
				// Whether data should be serialized to string
				processData: true,
				// Whether the browser should be allowed to cache GET responses
				cache: true
			}

			function mimeToDataType(mime) {
				if (mime) mime = mime.split(';', 2)[0]
				return mime && ( mime == htmlType ? 'html' :
						mime == jsonType ? 'json' :
							scriptTypeRE.test(mime) ? 'script' :
							xmlTypeRE.test(mime) && 'xml' ) || 'text'
			}

			function appendQuery(url, query) {
				if (query == '') return url
				return (url + '&' + query).replace(/[&?]{1,2}/, '?')
			}

			// serialize payload and append it to the URL for GET requests
			function serializeData(options) {
				if (options.processData && options.data && $.type(options.data) != "string")
					options.data = $.param(options.data, options.traditional)
				if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
					options.url = appendQuery(options.url, options.data), options.data = undefined
			}

			$.ajax = function (options) {
				var settings = $.extend({}, options || {}),
					deferred = $.Deferred && $.Deferred(),
					urlAnchor
				for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

				ajaxStart(settings)

				if (!settings.crossDomain) {
					urlAnchor = document.createElement('a')
					urlAnchor.href = settings.url
					urlAnchor.href = urlAnchor.href
					settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
				}

				if (!settings.url) settings.url = window.location.toString()
				serializeData(settings)

				var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
				if (hasPlaceholder) dataType = 'jsonp'

				if (settings.cache === false || (
						(!options || options.cache !== true) &&
						('script' == dataType || 'jsonp' == dataType)
					))
					settings.url = appendQuery(settings.url, '_=' + Date.now())

				if ('jsonp' == dataType) {
					if (!hasPlaceholder)
						settings.url = appendQuery(settings.url,
							settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
					return $.ajaxJSONP(settings, deferred)
				}

				var mime = settings.accepts[dataType],
					headers = {},
					setHeader = function (name, value) {
						headers[name.toLowerCase()] = [name, value]
					},
					protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
					xhr = settings.xhr(),
					nativeSetHeader = xhr.setRequestHeader,
					abortTimeout

				if (deferred) deferred.promise(xhr)

				if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
				setHeader('Accept', mime || '*/*')
				if (mime = settings.mimeType || mime) {
					if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
					xhr.overrideMimeType && xhr.overrideMimeType(mime)
				}
				if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
					setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

				if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
				xhr.setRequestHeader = setHeader

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						xhr.onreadystatechange = empty
						clearTimeout(abortTimeout)
						var result, error = false
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
							dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
							result = xhr.responseText

							try {
								// http://perfectionkills.com/global-eval-what-are-the-options/
								if (dataType == 'script')    (1, eval)(result)
								else if (dataType == 'xml')  result = xhr.responseXML
								else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
							} catch (e) {
								error = e
							}

							if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
							else ajaxSuccess(result, xhr, settings, deferred)
						} else {
							ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
						}
					}
				}

				if (ajaxBeforeSend(xhr, settings) === false) {
					xhr.abort()
					ajaxError(null, 'abort', xhr, settings, deferred)
					return xhr
				}

				if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

				var async = 'async' in settings ? settings.async : true
				xhr.open(settings.type, settings.url, async, settings.username, settings.password)

				for (name in headers) nativeSetHeader.apply(xhr, headers[name])

				if (settings.timeout > 0) abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = empty
					xhr.abort()
					ajaxError(null, 'timeout', xhr, settings, deferred)
				}, settings.timeout)

				// avoid sending empty string (#319)
				xhr.send(settings.data ? settings.data : null)
				return xhr
			}

			// handle optional data/success arguments
			function parseArguments(url, data, success, dataType) {
				if ($.isFunction(data)) dataType = success, success = data, data = undefined
				if (!$.isFunction(success)) dataType = success, success = undefined
				return {
					url: url
					, data: data
					, success: success
					, dataType: dataType
				}
			}

			$.get = function (/* url, data, success, dataType */) {
				return $.ajax(parseArguments.apply(null, arguments))
			}

			$.post = function (/* url, data, success, dataType */) {
				var options = parseArguments.apply(null, arguments)
				options.type = 'POST'
				return $.ajax(options)
			}

			$.getJSON = function (/* url, data, success */) {
				var options = parseArguments.apply(null, arguments)
				options.dataType = 'json'
				return $.ajax(options)
			}

			$.fn.load = function (url, data, success) {
				if (!this.length) return this
				var self = this, parts = url.split(/\s/), selector,
					options = parseArguments(url, data, success),
					callback = options.success
				if (parts.length > 1) options.url = parts[0], selector = parts[1]
				options.success = function (response) {
					self.html(selector ?
						$('<div>').html(response.replace(rscript, "")).find(selector)
						: response)
					callback && callback.apply(self, arguments)
				}
				$.ajax(options)
				return this
			}

			var escape = encodeURIComponent

			function serialize(params, obj, traditional, scope) {
				var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
				$.each(obj, function (key, value) {
					type = $.type(value)
					if (scope) key = traditional ? scope :
					scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
					// handle data in serializeArray() format
					if (!scope && array) params.add(value.name, value.value)
					// recurse into nested objects
					else if (type == "array" || (!traditional && type == "object"))
						serialize(params, value, traditional, key)
					else params.add(key, value)
				})
			}

			$.param = function (obj, traditional) {
				var params = []
				params.add = function (key, value) {
					if ($.isFunction(value)) value = value()
					if (value == null) value = ""
					this.push(escape(key) + '=' + escape(value))
				}
				serialize(params, obj, traditional)
				return params.join('&').replace(/%20/g, '+')
			}
		})(Zepto)

		;
		(function ($) {
			$.fn.serializeArray = function () {
				var name, type, result = [],
					add = function (value) {
						if (value.forEach) return value.forEach(add)
						result.push({name: name, value: value})
					}
				if (this[0]) $.each(this[0].elements, function (_, field) {
					type = field.type, name = field.name
					if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
						((type != 'radio' && type != 'checkbox') || field.checked))
						add($(field).val())
				})
				return result
			}

			$.fn.serialize = function () {
				var result = []
				this.serializeArray().forEach(function (elm) {
					result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
				})
				return result.join('&')
			}

			$.fn.submit = function (callback) {
				if (0 in arguments) this.bind('submit', callback)
				else if (this.length) {
					var event = $.Event('submit')
					this.eq(0).trigger(event)
					if (!event.isDefaultPrevented()) this.get(0).submit()
				}
				return this
			}

		})(Zepto)

		;
		(function ($) {
			// __proto__ doesn't exist on IE<11, so redefine
			// the Z function to use object extension instead
			if (!('__proto__' in {})) {
				$.extend($.zepto, {
					Z: function (dom, selector) {
						dom = dom || []
						$.extend(dom, $.fn)
						dom.selector = selector || ''
						dom.__Z = true
						return dom
					},
					// this is a kludge but works
					isZ: function (object) {
						return $.type(object) === 'array' && '__Z' in object
					}
				})
			}

			// getComputedStyle shouldn't freak out when called
			// without a valid element as argument
			try {
				getComputedStyle(undefined)
			} catch (e) {
				var nativeGetComputedStyle = getComputedStyle;
				window.getComputedStyle = function (element) {
					try {
						return nativeGetComputedStyle(element)
					} catch (e) {
						return null
					}
				}
			}
		})(Zepto);

		return window.Zepto = Zepto;

	});




/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * DOM相关操作
	 */
	var is = __webpack_require__(3);
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var dom = {}, pres=[];

	    /**
	     * 预加载私有函数
	     */
	    function _loadImage() {
	        var img = new Image(), callback = arguments[1];
	        img.src = arguments[0];
	        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
	            callback && callback.call(img);
	            return; // 直接返回，不用再处理onload事件
	        }
	        img.onload = function () { //图片下载完毕时异步调用callback函数。
	            callback && callback.call(img);//将回调函数的this替换为Image对象
	        };
	        return img;
	    }
	    /**
	     * 预加载图片
	     * @param {Array|String} urls 图片地址
	     * @param {Function} callback 回调函数
	     * @returns {Array} 图片对象数组
	     */
	    dom.preImage = function(urls, callback) {
	        if(is.isArray(urls)) {
	            urls.forEach(function(url) {
	                pres.push(_loadImage(url, callback));
	            });
	        }else {
	            pres.push(_loadImage(urls, callback));
	        }
	        return pres;
	    };

	    /**
	     * 元素偏移尺寸对象
	     * 左、右、宽、高
	     * @param {Element} el 单个元素 通过document.getElementById等方式获取
	     * @returns {Object} {left,top,width,height}
	     */
	    dom.offset = function(el) {
	        var obj = el.getBoundingClientRect();
	        return {
	            left: obj.left + window.pageXOffset,
	            top: obj.top + window.pageYOffset,
	            width: Math.round(obj.width),//整数位 四舍五入
	            height: Math.round(obj.height)
	        };
	    };

	    /**
	     * 获取对象的高度或宽度
	     * 例如屏幕的高度
	     * @param {Element} el 单个元素 通过document.getElementById等方式获取
	     * @returns {Number} 数值
	     */
	    ['width', 'height'].forEach(function(property) {
	        var dimension = property.replace(/./, function(m){ return m[0].toUpperCase()});
	        dom[property] = function(el) {
	            var offset;
	            if(is.isWindow(el)) return el['inner' + dimension];
	            if(is.isDocument(el)) return el.documentElement['scroll' + dimension];
	            return (offset = this.offset(el)) && offset[property];
	        };
	    });

	    /**
	     * 节流
	     * 函数调用的频度控制器，到了时间就执行
	     * 例如mousemove 事件、window对象的resize和scroll事件
	     * 预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行该动作，然后进入下一个新周期
	     *
	     * @param fn {Function} 要调用的函数
	     * @param delay {Number} 空闲时间
	     * @param immediate {Boolean} 给immediate参数传递false，绑定的函数先执行，而不是delay后执行
	     * @param debounce {Boolean} 是否执行debounce方式
	     * @returns {Function}
	     */
	    dom.throttle = function(fn, delay, immediate, debounce) {
	        var curr = +new Date(),//当前时间
	            last_call = 0,//最后一次回调的时间，用于debounce的重新计算时间
	            last_exec = 0,//最后一次执行传入函数的时间
	            timer = null,//定时器
	            diff, //时间差
	            context,//上下文
	            args,//回调函数的参数
	            exec = function () {
	                last_exec = curr;
	                fn.apply(context, args);
	            };
	        return function () {
	            curr = +new Date();
	            context = this;
	            args = arguments;
	            diff = curr - (debounce ? last_call : last_exec);
	            clearTimeout(timer);
	            if (debounce) {
	                if(immediate) {
	                    timer = setTimeout(exec, delay);
	                }else if(diff >= delay) {
	                    exec();
	                }
	            } else {
	                if(diff >= delay) {
	                    exec();
	                }else if(immediate) {
	                    timer = setTimeout(exec, -diff);
	                }
	            }
	            last_call = curr;
	        }
	    };

	    /**
	     * 去抖动
	     * 空闲时间的间隔控制
	     * 例如文本输入keydown 事件，keyup 事件，做autocomplete等
	     * 当调用动作n毫秒后，才会执行该动作，若在这n毫秒内又调用此动作则将重新计算执行时间
	     */
	    dom.debounce = function(fn, delay, immediate) {
	        return this.throttle(fn, delay, immediate, true);
	    };

	    /**
	     * 判断当前浏览器支持哪种TransitionEnd事件
	     */
	    dom.transitionEnd = function(el){
	        var transitions = {
	            'WebkitTransition' : 'webkitTransitionEnd',
	            'MozTransition'    : 'transitionend',
	            'OTransition'      : 'oTransitionEnd otransitionend',
	            'transition'       : 'transitionend'
	        };
	        for(var t in transitions){
	            if(el.style[t] !== undefined){
	                return transitions[t];
	            }
	        }
	        return null;
	    };

	    return global.dom = dom;
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * 判断函数
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var is = {}, toString = Object.prototype.toString;
	    /**
	     * 判断是否是数组
	     */
	    is.isArray = Array.isArray || function(obj) {
	            return toString.call(obj) === '[object Array]';
	    };

	    /**
	     * 判断是否是HTML标签
	     */
	    is.isElement = function(obj) {
	        return !!(obj && obj.nodeType === 1);
	    };

	    /**
	     * 判断是函数、日期、字符串、数字、日期、正则、错误
	     */
	    ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function(key) {
	        is['is'+key] = function(obj) {
	            return toString.call(obj) === '[object '+key+']';
	        }
	    });

	    /**
	     * 判断是NaN
	     * 原生的isNaN 函数不一样，如果变量是undefined，原生的isNaN 函数也会返回 true
	     */
	    is.isNaN = function(obj) {
	        return is.isNumber(obj) && obj !== +obj;
	    };

	    /**
	     * 判断是window对象
	     */
	    is.isWindow = function(obj) {
	        return obj != null && obj == obj.window;
	    };

	    /**
	     * 判断是document对象
	     */
	    is.isDocument = function(obj) {
	        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    };

	    return global.is = is;
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * URL地址
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var jurl = {};

	    /**
	     * 创建地址
	     */
	    jurl.buildUrl = function (url, params) {
	        if(!url) return '';
	        var last = url[url.length - 1];
	        var args = [], params = params || {}, has=false;
	        for (var key in params) {
	            if(params.hasOwnProperty(key)) {
	                args.push(key + '=' + encodeURIComponent(params[key]));
	                has = true;//判断是否传参进来
	            }
	        }
	        //有参数就加符号 排除params是{}情况
	        if(!has) return url;
	        if (url.indexOf('?') == -1) {
	            url += '?';
	        } else if (last != '&' && last != '?') {
	            url += '&';
	        }
	        return url + args.join('&');
	    };

	    /**
	     * 格式化地址参数
	     */
	    jurl.parseUrl = function(url) {
	        var parsed = {};
	        url = url || global.location.search;
	        if (typeof url !== "string" || url.length < 0) return parsed;
	        var urls = url.split('?');
	        if(urls.length == 1 || !urls[1]) return parsed;
	        var params = urls[1].split('&');
	        //参数赋值
	        for(var i= 0, length=params.length; i<length; i++) {
	            var element = params[i],
	                eqPos = element.indexOf('='),
	                keyValue, elValue;
	            if (eqPos >= 0) {
	                keyValue = element.substr(0, eqPos);//参数名
	                elValue = element.substr(eqPos + 1);//参数值
	            } else {
	                keyValue = element;
	                elValue = '';
	            }
	            parsed[keyValue] = decodeURIComponent(elValue); //简单点操作，将后面的值覆盖前面赋的值
	        }
	        return parsed;
	    };

	    /**
	     * 测试环境返回测试地址
	     * 正式环境返回正式地址
	     */
	    jurl.current = function(h5, dev) {
	        var url = global.location.href;
	        if(url.indexOf('dev.') > 0 || url.indexOf('10.10.') > 0)
	            return dev;
	        return h5;
	    };

	    return global.jurl = jurl;
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * 常量与正则
	 */
	;(function (global, factory) {
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(global);
	    } else {
	        factory(global);
	    }
	})(typeof window !== "undefined" ? window : this, function (global) {
	    var common = {};

	    /**
	     * 正则
	     */
	    common.regex = {
	        mobile: /^1[0-9]{10}$/,//手机号码
	        chinese: /^[\u4E00-\u9FA5]+$/, //全部是中文
	        card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X)$)/, //简单的身份证
	        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, //邮箱
	        digits: /^\d+$/ //整数
	    };
	    return global.common = common;
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
	;(function (factory) {
	    /* CommonJS module. */
	    if (typeof module === "object" && typeof module.exports === "object") {
	        module.exports = factory(window);
	        /* AMD module. */
	    } else if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory(window)), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        /* Browser globals. */
	    } else {
	        factory(window);
	    }
	}(function(global, undefined) {
	    /**
	     * 图片资源
	     */
	    var res = {
	        img: {
	            path: "img/",
	            manifest: [{
	                src: "gift1.png",
	                id: "gift1"
	            },{
	                src: "gift2.png",
	                id: "gift2"
	            },{
	                src: "gift3.png",
	                id: "gift3"
	            },{
	                src: "gift4.png",
	                id: "gift4"
	            },{
	                src: "gift5.png",
	                id: "gift5"
	            },{
	                src: "gift6.png",
	                id: "gift6"
	            },{
	                src: "gift7.png",
	                id: "gift7"
	            },{
	                src: "score.png",
	                id: "score"
	            }]
	        }
	    };

	    /**
	     * 资源载入
	     */
	    var Loading = {};
	    Loading.queue = {};
	    Loading.init = function(stage,successCallBack){
	        Loading.queue = new createjs.LoadQueue();
	        Loading.queue.setMaxConnections(20);
	        //Loading.queue.on("complete",successCallBack, null, !0);
	        res.img && Loading.queue.loadManifest(res.img, !1);
	        Loading.queue.load();

	    };
	    Loading.getResult = function(resName){
	        return Loading.queue.getResult(resName);
	    };

	    var W, H;
	    var JCGame = (function(obj){
	        obj.score = 0;
	        obj.init = false; //刚进入页面还未游戏
	        obj.getResult = function(a) {
	            return Loading.getResult(a)
	        };
	        obj.init = function(stage, $$Img) {
	            Loading.init(stage);
	            this.Stage = JCStage.Stage = stage;
	            W = 750;
	            H = 800;
	            //Loading.loadImg($$Img);
	        };
	        //开始游戏
	        obj.initGame = function() {
	            //显示坑洞视图
	            obj.score = 0;
	        };
	        //开始游戏
	        obj.playGame = function(replay) {
	            JCGame.gameEnd = false;
	            JCGame.score = 0;
	            JCStage.gameover = false;
	            obj.vMove = new JCStage.vMove;
	            this.Stage.addChild(obj.vMove);
	        };
	        function intNumber(n){
	            return n < 10 ? '0'+n : n;
	        }
	        obj.gameover = function() {
	            obj.gameEnd = true;
	            JCStage.gameover = true;
	        };
	        return obj;
	    })(JCGame || {})

	    var JCStage = (function(obj){
	        //var documentBounding = document.documentElement.getBoundingClientRect();
	        obj.gameTime = 20,
	            obj.interval = 1,
	            obj.vStart = function(){
	                this.initialize();
	                this.x = this.y = 0;
	                JCGame.init = true;
	            };

	        //顶部分数、计时器视图
	        obj.vMove = function(){
	            var _this = this;
	            var gifts = new obj.vGift();
	            this.addChild(gifts);
	        };
	        //礼物
	        obj.vGift = function(){
	            var _this = this;
	            _this.y = 0;
	            var timer = setInterval(function() {
	                if(obj.gameover){
	                    clearInterval(timer);
	                    return;
	                }

	                var number = Math.randomInt(7) + 1;
	                var gift = new createjs.Bitmap(Loading.getResult('gift'+number));

	                gift.y = Math.randomInt(250);
	                gift.x = 750;
	                createjs.Tween.get(gift).to({ x:-750 }, 5000).call(function(){
	                    gift.parent.removeChild(gift);
	                });
	                var bounds = gift.getBounds();
	                gift.hitArea = new createjs.Shape;
	                gift.hitArea.graphics.beginFill("#000").drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
	                if(number < 5) {
	                    gift.addEventListener('mousedown', function() {
	                        //$('body').innerHTML += 1;
	                        createjs.Tween.get(gift).to({y:550-gift.y},800*((550-gift.y)/550)).to({y:700-gift.y,alpha:0},300).call(function(){
	                            if(gift.x > 15){
	                                JCGame.score += 2;
	                                var img = new createjs.Bitmap(Loading.getResult('score'));
	                                //img.y = 500;
	                                //img.x = 500;
	                                img.regX = -(document.documentElement.getBoundingClientRect().width / 2);
	                                img.regY = -(window.innerHeight / 2);
	                                if(JCStage.Stage.scaleX < 1) {
	                                    img.regX *= 2;
	                                    img.regY *= 2;
	                                }
	                                //img.regX = 0;
	                                //img.regY = 0;
	                                _this.addChild(img);
	                                //log(JCGame.score);
	                                //var txt = new createjs.Text();
	                                //txt.font = "130px Arial";
	                                //txt.textBaseline = "middle";
	                                //txt.textAlign = "center";
	                                //txt.color = "#ff007d";
	                                //txt.text = "+2";
	                                //txt.y = -150;
	                                //txt.X = 80;
	                                //txt.regX = -txt.getBounds().width - 20;
	                                //txt.regY = -txt.getBounds().height*5 + 10;
	                                //_this.addChild(txt);
	                                createjs.Tween.get(img).to({
	                                        //y: txt.y - 50,
	                                        y: img.y - 50,
	                                        alpha: 0
	                                    }, 500).call(function() {
	                                    //txt.parent.removeChild(txt)
	                                    img.parent.removeChild(img);
	                                });
	                            }
	                        })
	                    });
	                }

	                _this.addChild(gift);
	            }, 400);
	        };
	        obj.vMove.prototype      =  new createjs.Container;
	        obj.vGift.prototype      =  new createjs.Container;
	        //createjs.DisplayObject.prototype.onClick = function(a){
	        //    this.on("click",function(event) {
	        //        createjs.Touch.isSupported() && event.nativeEvent.constructor == MouseEvent || a(event);
	        //    })
	        //};
	        return obj;
	    })(JCStage || {});

	    Array.prototype.indexOf = function(a) {
	        for (var b = 0; b < this.length; b++) {
	            if (this[b] == a) return b;
	        }
	        return -1
	    };
	    Array.prototype.remove = function(a) {
	        a = this.indexOf(a);
	        a > -1 && this.splice(a, 1)
	    };
	    Math.randomInt = function(a) {
	        return parseInt(Math.random() * a);
	    };

	    return JCGame;
	}));

/***/ }
/******/ ]);