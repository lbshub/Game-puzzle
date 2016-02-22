/**
 * LBS Puzzle 
 * Date: 2011-03-30
 * ===================================================
 * opts.parent 游戏容器放在哪里 默认为body
 * opts.level 难度级别 默认1级
 * opts.step 游戏关数 默认第一关开始
 * opts.imgdata 图片的url数据 是一个数组 有几张图片就有几关
 * ===================================================
 * setLevel 设置游戏难度等级
 * setStep 设置游戏为哪一关
 * loadimg 加载游戏图片	
 * create 创建游戏
 * ===================================================
 **/

var Puzzle = function(opts) {
	opts = opts || {};
	this.parent = opts.parent || LBS.$('body')[0];
	this.imgdata = opts.imgdata || [];
	this.len = this.imgdata.length;
	if (this.len < 1) return;
	this.level = opts.level || 1;
	this.step = opts.step || 1;

	this.gameBox = LBS.create('div');
	this.imgBox = LBS.create('div');
	this.url = 'blank.gif';

	this.num = this.imgWidth = this.imgHeight = 0;
	this.startTime = this.endTime = this.gameTime = 0;
	this.animated = true;
	this.img_arr = [];
	this.img_arr_bak = [];
	this.rimgArr = [];
	this.pos_arr = [];

	this.init();
};
Puzzle.prototype = {
	init: function() {
		LBS.css(this.gameBox, {
			'position': 'relative'
		}).addClass(this.imgBox, 'puzzleBox').append(this.imgBox, this.gameBox).append(this.gameBox, this.parent);
		this.loadGame();
		this.click();
	},
	loadGame: function() {
		this.setLevel(this.level);
		this.loadimg(this.imgdata[this.step - 1]);
		return this;
	},
	loadimg: function(url) {
		var img = new Image(),
			_this = this;
		img.src = url;
		this.url = url;
		img.onload = function() {
			_this.imgWidth = img.width;
			_this.imgHeight = img.height;
			LBS.css(_this.imgBox, {
				'width': _this.imgWidth,
				'height': _this.imgHeight,
				'background': 'url(' + url + ')'
			});
			_this.setMask();
		};
		return this;
	},
	setMask: function() {
		if (!this.mask) {
			this.mask = LBS.create('div');
			LBS.css(this.mask, {
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'z-index': 20,
				'background-color': '#FFF',
				'opacity': 40
			}).addClass(this.mask, 'puzzleMask').append(this.mask, this.gameBox);
		}
		LBS.css(this.mask, {
			'width': this.imgWidth,
			'height': this.imgHeight
		}).show(this.mask);
		return this;
	},
	setLevel: function(level) {
		var arr = [4, 9, 16, 25, 36, 49];
		switch (level) {
			case 1:
				this.num = 9;
				break;
			case 2:
				this.num = 16;
				break;
			case 3:
				this.num = 25;
				break;
			case 4:
				this.num = 36;
				break;
			case 5:
				this.num = 49;
				break;
		}
		return this;
	},
	setStep: function(step) {
		this.step = step;
		return this;
	},
	endGame: function() {
		if (this.step == this.len) {
			alert('通关啦！');
			this.clear();
			LBS.html(this.imgBox, '恭喜，通关啦！').css(this.imgBox, {
				'color': '#FFF',
				'font-size': '100px',
				'text-align': 'center',
				'background': '#000',
				'line-height': LBS.height(this.imgBox) + 'px'
			});
			return this;
		}
		this.endTime = +new Date() - this.startTime;
		alert('第' + this.step + '关游戏用时' + parseInt(this.endTime / 1000) + '秒！');
		LBS.show(this.mask);
		this.clear().nextStep();
		return this;
	},
	nextStep: function() {
		this.step++;
		this.loadGame();
		return this;
	},
	clear: function() {
		LBS.empty(this.imgBox);
		this.img_arr.length = 0;
		this.img_arr_bak.length = 0;
		this.rimgArr.length = 0;
		this.pos_arr.length = 0;
		return this;
	},
	create: function() {
		this.clear();
		var s = this.num,
			html = document.createDocumentFragment(),
			li = null,
			i = 0,
			j = 0,
			x = 0,
			y = 0,
			row = Math.sqrt(s),
			col = Math.sqrt(s),
			w = parseInt(this.imgWidth / row),
			h = parseInt(this.imgHeight / col);
		for (; i < s; i++) {
			li = LBS.create('div');
			!(i % row) && j++;
			x = (i % row) * w;
			y = ((j - 1) % col) * h;
			li.pos = {
				'left': x,
				'top': y
			};
			LBS.css(li, {
				'position': 'absolute',
				'left': x,
				'top': y,
				'width': w,
				'height': h,
				'backgroundImage': 'url(' + this.url + ')',
				'background-position': (-x) + 'px ' + (-y) + 'px'
			}).addClass(li, 'puzzleItem').append(li, html);
			this.img_arr.push(li);
			this.img_arr_bak.push(li);
			this.pos_arr.push([i, x, y]);
		}
		LBS.append(html, this.imgBox);
		return this;
	},
	randomOrder: function() {
		var i = 0,
			len = this.num,
			li, pos;
		while (len > 0) {
			li = this.img_arr.splice(Math.floor(Math.random() * len), 1);
			pos = this.pos_arr.splice(Math.floor(Math.random() * len), 1);
			this.rimgArr.push(li[0]);
			LBS.animate(li[0], {
				'left': pos[0][1],
				'top': pos[0][2]
			}, {
				duration: 300
			});
			len--;
		}
		return this;
	},
	getIntersect: function(o, arr) {
		var els = [],
			i = 0,
			len = arr.length,
			oW = o.offsetWidth,
			oH = o.offsetHeight,
			oL = o.offsetLeft,
			oT = o.offsetTop;
		for (; i < len; i++) {
			var el = arr[i],
				eW = el.offsetWidth,
				eH = el.offsetHeight,
				eL = el.offsetLeft,
				eT = el.offsetTop;
			if (o !== el) {
				var x = (oL + oW / 2) - (eL + eW / 2),
					y = (oT + oH / 2) - (eT + eH / 2),
					s = Math.ceil(Math.sqrt(x * x + y * y));
				if (els.length == 0) {
					els.push([el, s]);
				} else {
					els.push([el, s]);
					els[0][1] >= els[1][1] ? els.shift() : els.pop();
				}
			}
		}
		return els[0][0];
	},
	isOverlap: function(a, b) {
		var aW = LBS.width(a),
			aH = LBS.height(a),
			aL = LBS.getPosition(a).x,
			aT = LBS.getPosition(a).y,
			bW = LBS.width(b),
			bH = LBS.height(b),
			bL = LBS.getPosition(b).x,
			bT = LBS.getPosition(b).y;
		return (aL <= bW + bL) && (aL >= bL - aW) && (aT <= bH + bT) && (aT >= bT - aH);
	},
	click: function() {
		var _this = this, target;
		LBS.on(this.parent, 'click', function(e) {
			target = e.target;
			if (LBS.hasClass(target, 'puzzleMask')) {
				LBS.hide(target).css(_this.imgBox, {
					'background': '#000'
				});
				_this.create().randomOrder().move();
			}
		});
		return this;
	},
	move: function() {
		var _this = this;
		this.startTime = new Date() - 0;
		LBS.on(this.imgBox, 'mousedown', _down);

		function _down(e) {
			if (!_this.animated) return;
			_this.animated = false;
			var el = e.target;
			if (el.tagName.toUpperCase() == 'DIV' && LBS.hasClass(el, 'puzzleItem')) {
				LBS.css(el, {
					'cursor': 'move'
				});
				var mX = e.clientX,
					mY = e.clientY,
					eX = el.offsetLeft,
					eY = el.offsetTop,
					disX = mX - eX,
					disY = mY - eY,
					eL = LBS.css(el, 'left'),
					eT = LBS.css(el, 'top'),
					cX = 0,
					cY = 0;

				function _move(e) {
					e.stopPropagation();
					e.preventDefault();
					cX = e.clientX - disX;
					cY = e.clientY - disY;
					LBS.css(el, {
						'left': cX,
						'top': cY,
						'z-index': 10
					});
				}

				function _up(e) {
					LBS.off(document, 'mousemove', _move).off(document, 'mouseup', _up);
					var o = _this.getIntersect(el, _this.rimgArr);
					if (!_this.isOverlap(el, o) || cX == 0 || cY == 0) {
						if (parseInt(LBS.css(el, 'left')) == parseInt(eL) && parseInt(LBS.css(el, 'top')) == parseInt(eT)) {
							LBS.css(el, {
								'z-index': 0,
								'cursor': 'default'
							});
							_this.animated = true;
							return _this;
						}
						LBS.animate(el, {
							'left': eL,
							'top': eT
						}, {
							duration: 150,
							callback: function() {
								_this.animated = true;
								LBS.css(el, {
									'z-index': 0,
									'cursor': 'default'
								});
							}
						});
						return _this;
					}
					var oL = LBS.css(o, 'left'),
						oT = LBS.css(o, 'top');
					LBS.css(o, {
						'z-index': 10
					}).animate(o, {
						'left': eL,
						'top': eT
					}, {
						duration: 300
					}).animate(el, {
						'left': oL,
						'top': oT
					}, {
						duration: 300,
						callback: function() {
							LBS.css(el, {
								'z-index': 0,
								'cursor': 'default'
							}).css(o, {
								'z-index': 0
							});
							_this.animated = true;
							if (_this.check()) {
								_this.endGame();
							}
						}
					});
				}
				
				LBS.on(document, 'mousemove', _move).on(document, 'mouseup', _up);
			}
		}
		return this;
	},
	check: function() {
		var arr = this.img_arr_bak,
			len = this.num,
			i = 0;
		for (; i < len; i++) {
			if (parseInt(LBS.css(arr[i], 'left')) !== parseInt(arr[i].pos.left)) return false;
			if (parseInt(LBS.css(arr[i], 'top')) !== parseInt(arr[i].pos.top)) return false;
		}
		return true;
	}
}