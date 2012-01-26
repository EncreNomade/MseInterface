/*!
 * Mse Canvas JavaScript Library v0.1
 * MseEdition
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright 2011, MseEdition
 *
 * Date: 21/03/2011
 */

var __currContextOwner__;

(function( window, $ ) {

var mse = function() {};

mse.configs = {
	font 	: 'Verdana',
	srcPath	: ''
};
// Shortcut
var cfs = mse.configs;

mse.root = null;
mse.currTimeline = null;


// Gestion de ressources
mse.Ressource = function() {};
mse.Ressource.prototype = {
	constructor	: mse.Ressource,
	list 		: {},
	loading		: [],
	preload		: new Array(),
	loadInfo	: 'Chargement ressources: ',
	init		: function() {
		var ctx, angle;
		for(var i = 0; i < 12; i++) {
			this.loading[i] = document.createElement('canvas');
			this.loading[i].width = 300; this.loading[i].height = 300;
			ctx = this.loading[i].getContext('2d');
			ctx.translate(150,150);
			//ctx.fillStyle = 'rgba(0,0,0,0.4)';
			//ctx.fillRoundRect(-50,-50, 100,100, 10);
			angle = 2*Math.PI / 12;
			ctx.fillStyle = '#AAAAAA';
			for(var j = 0; j < 12; j++) {
				if(j == i) {
					ctx.fillStyle = '#EEEEEE';
					ctx.fillRect(60, -9, 60, 18);
					ctx.fillStyle = '#AAAAAA';
				}
				else ctx.fillRect(60, -9, 60, 18);
				ctx.rotate(angle);
			}
		}
	},
	addSource	: function(name, file, type, pre) {
		switch(type) {
		case 'img' :
			this.list[name] = new Image();
			this.list[name].src = cfs.srcPath + file;
			this.list[name].lid = 0; // Loading current index
			break;
		case 'aud' :
			this.list[name] = document.createElement('audio');
			switch(MseConfig.browser) {
			case 'Chrome': case 'Firefox': case 'Opera':
				this.list[name].src = cfs.srcPath+file+'.ogg';break;
			case 'Safari': case 'Explorer':
				this.list[name].src = cfs.srcPath+file+'.mp3';break;
			this.list[name].load();
			}
			break;
		}
		this.list[name].type = type;
		if(pre) this.preload.push(this.list[name]);
	},
	getSrc		: function(name) {
		var res = this.list[name];
		if(!res) return null;
		switch(res.type) {
		case 'img':
			if(!res || res.complete) return res;
			else {
				if(res.lid == 12) res.lid = 0;
				return this.loading[(res.lid++)];
			}
		case 'aud':
			return res;
		}
	},
	preloadProc	: function() {
		var count = 0;
		for(var i = 0; i < this.preload.length; i++)
			if(this.preload[i].complete) count++;
		return [count, this.preload.length];
	},
	preloadPage	: function(ctx, fini, total) {
		ctx.clearRect(0, 0, mse.root.width, mse.root.height);
		ctx.save();
		ctx.strokeStyle = '#333333';
		ctx.lineWidth = 2;
		ctx.strokeRoundRect((mse.root.width-280)/2, mse.root.height-100, 281, 11, 5);
		ctx.fillStyle = '#555555';
		ctx.fillRoundRect((mse.root.width-280)/2, mse.root.height-100, (fini/total)*280, 10, 5);
		var txt = this.loadInfo + fini + '/' + total;
		var w = ctx.measureText(txt).width;
		ctx.font = '20px '+cfs.font;
		ctx.fillStyle = '#000000';
		ctx.fillText(txt, (mse.root.width-w)/2, mse.root.height-60);
		ctx.restore();
	}
};
mse.src	= new mse.Ressource();

mse.init = function(configs) {
	$.extend(cfs, configs);

	mse.src.init();
	mse.src.addSource('imgNotif', 'turn_comp.png', 'img');
	mse.src.addSource('fbBar', 'barre/fb.png', 'img');
	mse.src.addSource('wikiBar', 'barre/wiki.png', 'img');
	mse.src.addSource('wikiBn', 'button/wiki.png', 'img');
	mse.src.addSource('bookBn', 'button/book.png', 'img');
	mse.src.addSource('illuBn', 'button/illu.png', 'img');
	mse.src.addSource('audBn', 'button/audIcon.png', 'img');
	mse.src.addSource('speedCtrBn', 'button/vitesse.png', 'img', true);
	mse.src.addSource('ratImg', 'rat.png', 'img');
};


var DIST_PARAG = 15;
var __count__ = 0;

var linkColor = {fb		: 'rgb(74,108,164)',
				 wiki	: 'rgb(230,82,82)',
				 audio	: '#FFB11B'};
				 
var __bgLayers = {};

// Animations
mse.fade = function(obj, t, begin, end, callback) {
	if(!obj) return;
	var fade = new mse.KeyFrameAnimation(obj, {
			frame	: [0, t],
			opacity	: [begin, end]
		}, 1);
	if(callback) fade.evtDeleg.addListener('end', callback);
	fade.start();
};
mse.fadein = function(obj, t, callback) {
	mse.fade(obj, t, 0, 1, callback);
};
mse.fadeout = function(obj, t, callback) {
	mse.fade(obj, t, 1, 0, callback);
};
mse.slidein = function(obj, t, movement, callback, destalpha) {
	if(!obj instanceof mse.UIObject) return;
	if(isNaN(destalpha)) destalpha = 1;
	var slide = new mse.KeyFrameAnimation(obj, {
			frame	: [0, t],
			pos		: movement,
			opacity	: [0, destalpha]
		}, 1);
	if(callback) slide.evtDeleg.addListener('end', callback);
	slide.start();
};
mse.slideout = function(obj, t, movement, callback) {
	if(!obj instanceof mse.UIObject) return;
	var slide = new mse.KeyFrameAnimation(obj, {
			frame	: [0, t],
			pos		: movement,
			opacity	: [obj.globalAlpha, 0]
		}, 1);
	if(callback) slide.evtDeleg.addListener('end', callback, false);
	slide.start();
};
mse.transition = function(obj1, obj2, t, callback) {
	mse.fadeout(obj1, t);
	mse.fadein(obj2, t, callback);
};
mse.setCursor = function(cursor) {
	mse.root.jqObj.get(0).style.cursor = cursor;
};

mse.changePage = function(tar) {
	tar.evtDeleg.addListener(
			'click', 
			new mse.Callback(mse.root.transition, mse.root, mse.root.container), 
			true);
	mse.root.transition(tar);
}

mse.createBackLayer = function(img) {
	if(__bgLayers[img]) return __bgLayers[img];
	var bg = new mse.Layer(null, 0, {size:[mse.root.width,mse.root.height]});
	bg.addObject(new mse.Image(bg, {size:[mse.root.width,mse.root.height]}, img));
	__bgLayers[img] = bg;
	return bg;
};


// Event System

mse.Callback = function(func, caller) {
	this.func = func;
	this.caller = caller;
	if(arguments.length > 2) {
		this.args = new Array();
		for(var i = 2; i < arguments.length; i++)
			this.args.push(arguments[i]);
	}
	
	this.link = function(cb) {
		if(!this.linked) this.linked = new Array();
		this.linked.push(cb);
	};
	
	this.invoke = function(paramSup) {
		var arr = null;
		if(this.args) arr = (paramSup ? this.args.concat(paramSup) : this.args);
		else if(!this.args && paramSup) var arr = [paramSup];
		this.func.apply(caller, arr);
		
		if(this.linked) {
			for(var i in this.linked) this.linked[i].invoke();
		}
	};
}

mse.EventListener = function(evtName, callback, prevent, target) {
	this.evtName = evtName;
	this.callback = callback;
	this.target = (target ? target : callback.caller);
	this.preventBubbling = prevent ? prevent : false;
	
	this.inObj = function(x, y) {
//??? Attention: x, y undefined means not in object???
		if(x && y) {
			if(!this.target.inObj) return true;
			else if(this.target.inObj(x,y))
				return true;
			else return false;
		}
		else return true;
	};
	
	this.notify = function(evt) {
		this.callback.invoke(evt);
	};
};


// Event delegate
mse.EventDelegateSystem = function() {
	this.listeners = {};
	this.domObj = null;
	
	// Sort function for sort the obj in z-index order
	function zSort(la, lb) {
		var a = la.target;
		var b = lb.target;
//!!! Attention if a or b null
		if(!a || !a.getZindex) return -1;
		else if(!b || !b.getZindex) return 1;
		
		else if(a.getZindex() < b.getZindex()) 
			return 1;
		else if(a.getZindex() > b.getZindex())
			return -1;
		else return 0;
	};
	
	this.setDominate = function(dom) {
		this.domObj = dom;
	};

	// Managerment of listeners
	this.addListener = function(evtName, callback, prevent, target) {
		// Listener array not until exist
		if( !this.listeners[evtName] ) this.listeners[evtName] = new Array();
		var exist = false;
		var listener = new mse.EventListener(evtName,callback,prevent,target);
		var arr = this.listeners[evtName];
		for(var i in arr) {
			if(arr[i].callback==callback && (!target || arr[i].target==target)) {
				exist = true;
				// Replace in listener list
				arr.splice(i, 1, listener);
			}
		}
		// Push to the listener list
		if(!exist) this.listeners[evtName].push(listener);
	
		this.listeners[evtName].sort(zSort);
	};
	this.removeListeners = function(evtName) {
		delete this.listeners[evtName];
		this.listeners.length--;
	};
	this.removeListener = function(evtName, callback) {
		var arr = this.listeners[evtName];
		if(arr) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].callback == callback){
					// Delete listener
					arr.splice(i,1); break;
				}
			}
		}
	};
	this.eventNotif = function(evtName, evt) {
		switch(evtName) {
		case 'move':
			var ls = this.listeners['enter'];
			if(ls) {
				for(var i in ls) {
					if( ls[i].target.inObj(evt.offsetX, evt.offsetY) 
						&& !ls[i].target.inObj(evt.prev[0], evt.prev[1]) ) {
						ls[i].notify(evt);break;
					}
				}
			}
		break;
		}
		
		var arr = this.listeners[evtName];
		if(arr) {
			// No dominate listener
			for(val in arr) {
				if( (!this.domObj || this.domObj==arr[val].target) 
					&& (!evt || arr[val].inObj(evt.offsetX, evt.offsetY)) ) {
					var prev = arr[val].preventBubbling;
					arr[val].notify(evt);
				}
				if(prev) break;
			}
		}
	};
};
// Event distributor
mse.EventDistributor = function(src, jqObj, deleg) {
	this.distributor = function(e) {
		this.rootEvt.eventNotif(e.type, e);
		if(this.delegate) this.delegate.eventNotif(e.type, e);
	};
	this.setDelegate = function(deleg) {
		this.delegate = deleg;
	};

	this.src = src;
	jqObj.mseInteraction(this);
	jqObj.mseInteraction('setDelegate', this.distributor);
	
	this.rootEvt = new mse.EventDelegateSystem();
	
	if(deleg) this.setDelegate(deleg);
	
	this.setDominate = function(dom) {
		this.rootEvt.setDominate(dom);
		if(this.delegate) this.delegate.setDominate(dom);
	}
	this.addListener = function(evtName, callback, pr, target) {
		this.rootEvt.addListener(evtName,callback,pr,target);
	};
	this.removeListeners = function(evtName) {
		this.rootEvt.removeListeners(evtName);
	};
	this.removeListener = function(evtName, callback) {
		this.rootEvt.removeListener(evtName, callback);
	};
};


// Link system
mse.Link = function(src, index, type, link, width, height) {
	this.src = src;
	this.index = index;
	this.type = type;
	this.link = link;
	switch(this.type) {
	case 'fb':
		this.image='fbBar'; break;
	case 'wiki':
		this.image='wikiBar'; break;
	case 'illu':
		this.width = (width ? width : 300);
		this.height = (height ? height : 400);
		break;
	}
};
function sortLink(a, b) {
	return (a.index > b.index ? -1 : (a.index == b.index ? 0 : 1));
};



// Librarie canvas goes here
// Root object for all the UI object
mse.UIObject = function(parent, param) {
	// Setter of position, the position can be fixed or related to another object
	this.setPos = function(x, y, relat) {
		if(relat) {
			this.offx = x + (this.fixed ? relat.getX() : relat.offx);
			this.offy = y + (this.fixed ? relat.getY() : relat.offy);
		}
		else {
			this.offx = x;
			this.offy = y;
		}
	};
	this.setX = function(x, relat) {
		if(relat) this.offx = x + (this.fixed ? relat.getX() : relat.offx);
		else this.offx = x;
	};
	this.setY = function(y, relat) {
		if(relat) this.offy = y + (this.fixed ? relat.getY() : relat.offy);
		else this.offy = y;
	};
	// Getter of position in Root Canvas object, chaining to the parent if not fixed
	this.getX = function() {
		if(this.parent) return (this.parent.getX() + (Math.abs(this.offx)<1 ? this.offx*this.parent.getWidth() : this.offx));
		else return (Math.abs(this.offx)<1 ? this.offx*mse.root.width : this.offx);
	};
	this.getY = function() {
		if(this.parent) return (this.parent.getY() + (Math.abs(this.offy)<1 ? this.offy*this.parent.getHeight() : this.offy));
		else return (Math.abs(this.offy)<1 ? this.offy*mse.root.height : this.offy);
	};
	
	// Setter for size
	this.setSize = function(width, height) {
		this.width = width;
		this.height = height;
	};
	// Getter for size
	this.getWidth = function() {
		if(this.parent) return this.width<1 ? this.width*this.parent.getWidth() : this.width;
		else return (this.width<1 ? this.width*mse.root.width : this.width);
	};
	this.getHeight = function() {
		if(this.parent) return this.height<1 ? this.height*this.parent.getHeight() : this.height;
		else return (this.height<1 ? this.height*mse.root.height : this.height);
	};
	
	// Check if a point located in the bounding box
	this.inObj = function(x,y) {
		if(this.getAlpha() < 1) return false;
		if(this.insideRec) {
			var ox = this.getX()+this.insideRec[0], oy = this.getY()+this.insideRec[1], w = this.insideRec[2], h = this.insideRec[3];
		}
		else var ox = this.getX(), oy = this.getY(), w = this.getWidth(), h = this.getHeight();
		
		if(x>ox && x<ox+w && y>oy && y<oy+h) return true;
		else return false;
	};
	
	// Z-index
	this.getZindex = function() {
		return this.zid ? this.zid : (this.parent ? this.parent.zid : 0);
	};
	
	// Container
	this.getContainer = function() {
		if(this instanceof mse.BaseContainer || this instanceof mse.CardContainer) return this;
		else if(this.parent) return this.parent.getContainer();
		else return mse.root.container;
	};
	
	this.setAlpha = function(a) {this.globalAlpha = a;};
	// Alpha composition
	this.getAlpha = function() {
		if(this.parent) return (this.parent.getAlpha() * this.globalAlpha);
		else return this.globalAlpha;
	}
	// Scale composition
	this.getScale = function() {
		if(isNaN(this.scale)) {
			if(this.parent) return this.parent.getScale();
			else return 1;
		}
		else {
			if(this.parent) return (this.parent.getScale() * this.scale);
			else return this.scale;
		}
	}
	
	// Mouvement
	this.move = function(dx, dy) {
		this.offx += dx;
		this.offy += dy;
	};
	
	// Event handling
	this.evtDeleg = new mse.EventDelegateSystem();
	this.addListener = function() {
		this.evtDeleg.addListener.apply(this.evtDeleg, arguments);
	}
	this.removeListener = function() {
		this.evtDeleg.removeListener.apply(this.evtDeleg, arguments);
	}
	
	this.offx = 0; this.offy = 0;
	this.width = 0; this.height = 0;
	// Position fixed or not to the parent
	this.fixed = true;
	if(parent) {
		this.parent = parent;
		this.fixed = false;
	}
	
	// Parameters
	if(param) {
		if(param.pos)
			this.setPos(param.pos[0], param.pos[1]);
		if(param.size)
			this.setSize(param.size[0], param.size[1]);
		if(param.font)
			this.font = param.font;
		if(param.fillStyle)
			this.fillStyle = param.fillStyle;
		if(param.strokeStyle)
			this.strokeStyle = param.strokeStyle;
		if(!isNaN(param.globalAlpha))
			this.globalAlpha = param.globalAlpha;
		else this.globalAlpha = 1;
		if(param.lineWidth)
			this.lineWidth = param.lineWidth;
		if(param.shadow)
			this.shadow = param.shadow;
		if(param.textAlign)
			this.textAlign = param.textAlign;
		if(param.textBaseline)
			this.textBaseline = param.textBaseline;
		if(param.insideRec)
			this.insideRec = param.insideRec;
	}
	
	
	// Config drawing context
	this.configCtxFlex = function(ctx) {
		if(this.font)
			ctx.font = this.font;
		if(this.fillStyle)
			ctx.fillStyle = this.fillStyle;
		if(this.strokeStyle)
			ctx.strokeStyle = this.strokeStyle;
		if(this.lineWidth)
			ctx.lineWidth = this.lineWidth;
		if(this.shadow) {
			ctx.shadowOffsetX = this.shadow.shadowOffsetX;
			ctx.shadowOffsetY = this.shadow.shadowOffsetY;
			ctx.shadowBlur = this.shadow.shadowBlur;
			ctx.shadowColor = this.shadow.shadowColor;
		}
		else ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.shadowBlur = 0;
		if(this.textAlign)
			ctx.textAlign = this.textAlign;
		if(this.textBaseline)
			ctx.textBaseline = this.textBaseline;
		ctx.globalAlpha = this.getAlpha();
	};
	this.configCtx = function(ctx) {
		if(__currContextOwner__ == this)
			return;
		else ctx.restore();
	
		ctx.save();
		this.configCtxFlex(ctx);
		var s = this.getScale();
		if(s != 1) ctx.scale(s, s);
		
		// Register as the current context owner for avoiding the repeat work
		__currContextOwner__ = this;
	};
	
	// Abstract methods
	this.draw = function(ctx) {};
	this.logic = function(delta) {};
};
mse.UIObject.prototype.toString = function() {
	return "[object MseUIObject]";
};



// Root object, a canvas Dom element
mse.Root = function(id, width, height, orientation) {
	this.setPos = function(x, y) {
		this.jqObj.css({'left':x+'px', 'top':y+'px'});
	};
	this.setSize = function(width, height) {
		this.width = width;
		this.height = height;
		this.jqObj.attr({'width':width, 'height':height});
	};
	this.setScale = function(scale) {
		// Scale
		if(scale > 1) {
			if(this.height*scale > MseConfig.pageHeight) scale = MseConfig.pageHeight/this.height;
			if(this.width*scale > MseConfig.pageWidth) scale = MseConfig.pageWidth/this.width;
			var width = this.width * scale;
			var height = this.height * scale;
			var x = (MseConfig.pageWidth - width)/2;
			var y = (MseConfig.pageHeight - height)/2;
			this.setPos(x,y);
			this.setSize(width, height);
			this.scale = scale;
		}
	};
	
	this.setContainer = function(container) {
		// Reset first show state to prepare for calling the show event
		if(this.container) this.container.firstShow = false;
		container.root = this;
		this.container = container;
		this.evtDistributor.setDelegate(container.evtDeleg);
		this.dest = null;
		this.container.scale = this.scale;
	};
	
	this.transition = function(container) {
		if(this.dest) return;
		if(this.container) {
			mse.fadeout(this.container, 20, new mse.Callback(this.setContainer, this, container) );
			this.dest = container;
		}
		else this.setContainer(container);
		mse.fadein(container, 20);
	};
	
	this.inObj = function(x,y) {return true;};
		
	this.logic = function(delta) {
		for(var i in this.animations)
			if(this.animations[i].logic(delta))
				// Delete finish animation
				this.animations.splice(i,1);
		
		if(this.container) this.container.logic(delta);
	};
	
	this.draw = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		if(this.container) {
			this.container.draw(this.ctx);
		}
		if(this.dest) this.dest.draw(this.ctx);
	};
	
	// Timeline delegate
	this.initTimeline = function(timeline) {};
	
	this.runTimeline = function(delta) {
		if(!this.init) {
			var proc = mse.src.preloadProc();
			if(proc[0] < proc[1]) {
				mse.src.preloadPage(this.ctx, proc[0], proc[1]);
			}
			else this.init = true;
		}
		else if(!this.end) {
			this.logic(delta);
			this.draw();
		}
		else mse.currTimeline.end = true;
	};
	
	// Canvas obj parameters
	this.jqObj = $('<canvas></canvas>');
	this.jqObj.attr({'id':id});
	var x = (MseConfig.pageWidth - width)/2;
	this.jqObj.css({'margin':'0px auto',
				   'padding':'0px',
				  'position':'absolute',
				  	  'left':x+'px',
				  	   'top':'0px'});
	$('body').css({'position':'relative'}).append(this.jqObj);
	
	this.scale = 1;
	this.setSize(width, height);
	this.interval = 40;
	this.ctx = this.jqObj.get(0).getContext("2d");
	
	this.evtDistributor = new mse.EventDistributor(this, this.jqObj);
	
	this.container = null;
	this.end = false;
	this.init = false;
	this.animations = new Array();
	// Stack of containers
	this.stack = new Array();
	mse.root = this;
	//this.setScale(1.5);
	
	// Launch Timeline
	mse.currTimeline = new mse.Timeline(this, this.interval);
};



// Container object
mse.BaseContainer = function(root, param, orientation) {
	// Super constructor
	mse.UIObject.call(this, null, param);
	
	// Orientation management
	this.setOrientation = function(orien) {
		if(!MseConfig.mobile || (orien != 'landscape' && orien != 'portrait')) return;
		
		this.orientation = orien;
	};
	this.orientChange = function(orien) {
		__currContextOwner__ = null;
		// Normal state
		if(orien == this.orientation) this.normal = true;
		else this.normal = false;
			
		mse.root.jqObj.attr({'width':MseConfig.pageWidth, 
							'height':MseConfig.pageHeight});
		mse.root.width = MseConfig.pageWidth;
		mse.root.height = MseConfig.pageHeight;
	};
	
	// Layer managerment
	this.addLayer = function(name, layer){
		if(name != null && layer instanceof mse.UIObject) {
			layer.name = name;
			this._layers.push(layer);
			this.sortLayer();
		}
	};
	this.delLayer = function(name) {
		if(name == null) return;
		for(var i in this._layers) {
			if(this._layers[i].name == name) this._layers.splice(i,1);
		}
	};
	this.getLayer = function(name) {
		if(name == null) return;
		for(var i in this._layers) {
			if(this._layers[i].name == name) return this._layers[i];
		}
	};
	this.sortLayer = function() {
		this._layers.sort(function(a, b) {
			if(a.zid < b.zid)
				return -1;
			else if(a.zid > b.zid)
				return 1;
			else return 0;
		});
	};
	this.setLayerActivate = function(name, active) {
		if(name != null && this._layers[name] != null) {
			this._layers[name].setActivate(active);
		}
	};
	this.desactiveOthers = function(name) {
		for(var i in this._layers) {
			if(this._layers[i].active && this._layers[i].name != name) {
				this._layers[i].setActivate(false);
				this._changed.push(i);
			}
		}
	};
	this.reactiveOthers = function() {
		var l = this._changed.length;
		for(var i = 0; i < l; i++)
			this._layers[this._changed.pop()].setActivate(true);
	};
	
	this.logic = function(delta) {
		if(!this.firstShow) {
			this.firstShow = true;
			this.evtDeleg.eventNotif('show');
			for(var i in this._layers) 
				this._layers[i].evtDeleg.eventNotif('show');
		}
		
		if(MseConfig.mobile) {
			if(this.normal && MseConfig.orientation!=this.orientation)
				this.orientChange(MseConfig.orientation);
			else if(!this.normal && MseConfig.orientation==this.orientation)
				this.orientChange(MseConfig.orientation);
		}
		if(this.normal) {
			if(this.deleg) this.deleg.logic(delta);
			else {
				for(var i in this._layers) {
					this._layers[i].logic(delta);
				}
			}
		}
		this.count++;
	};
	// Draw
	this.draw = function(ctx) {
		if(this.normal){
			if(this.deleg) this.deleg.draw(ctx);
			else {
				this.configCtx(ctx);
				for(var i in this._layers) {
					this._layers[i].draw(ctx);
				}
			}
		}
		else{
			// Draw orientation change notification page
			ctx.drawImage(mse.src.getSrc('imgNotif'), (ctx.canvas.width-50)/2, (ctx.canvas.height-80)/2, 50, 80);
		}
	};
	
	this._layers = new Array();
	this._changed = new Array();
	this.deleg = null;
	
	// Parametres
	this.scale = 1.0;
	this.count = 0;
	this.firstShow = false;
	
	if(MseConfig.mobile) {
		// Initialization for orientation
		this.orientation = MseConfig.orientation;
		this.normal = true;
		
		this.setOrientation(orientation ? orientation : 'portrait');
	}
	else this.normal = true;
	
	if(root)
		root.setContainer(this);
};
mse.BaseContainer.prototype = new mse.UIObject();
mse.BaseContainer.prototype.constructor = mse.BaseContainer;
mse.BaseContainer.prototype.toString = function() {
	return "[object MseBaseContainer]";
};



// Layer object
mse.Layer = function(container, z, param) {
	// Super constructor
	mse.UIObject.call(this, container, param);
	// Parametres
	this.zid = z;
	this.active = true;
	
	this.objList = new Array();
	
	// Objects managerment
	this.addObject = function(obj) {
		if(obj instanceof mse.UIObject) {
			this.objList.push(obj);
			return true;
		}
		else return false;
	};
	this.insertObject = function(obj, index) {
		if(obj instanceof mse.UIObject && index>=0 && index<this.objList.length) {
			this.objList.splice(index, 0, obj);
			return true;
		}
		else return false;
	};
	this.delObject = function(o) {
		// Index of object
		if( !isNaN(o) ) {
			this.objList.splice(o, 1);
			return o;
		}
		// Object itself
		else if(o instanceof mse.UIObject) {
			// Sauf IE
			if(this.objList.indexOf) {
				var id = this.objList.indexOf(o);
			}
			// IE
			else {
				for(var i in this.objList)
					if(this.objList[i] === o) {
						var id = i;
						break;
					}
			}
			// Found
			if(id != null && id != -1) {
				this.objList.splice(id, 1);
				return id;
			}
			// Not found
			else return false;
		}
	};
	this.delAll = function() {
		for(var i in this.objList)
			delete this.objList[i];
		this.objList.length = 0;
	};
	this.getObject = function(i) {
		if(i >= 0 && i < this.objList.length)
			return this.objList[i];
		return null;
	};
	this.delSelf = function() {
		if(this.parent instanceof mse.BaseContainer || this.parent instanceof mse.CardContainer) this.parent.delLayer(this.name);
	};
	
	// Activate or desactivate the layer
	this.setActivate = function(active) {
		this.active = active;
	};
	
	// Logic
	this.logic = function(delta) {
		if(this.active) {
			for(var i = 0; i < this.objList.length; i++) {
				this.objList[i].logic(delta);
			}
		}
	};
	// Draw
	this.draw = function(ctx) {
		this.configCtx(ctx);
		for(var i = 0; i < this.objList.length; i++) {
			this.objList[i].draw(ctx);
		}
	};
};
mse.Layer.prototype = new mse.UIObject();
mse.Layer.prototype.constructor = mse.Layer;



// Text obj
mse.Text = function(parent, param, text, styled) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	this.text = text;
	this.styled = styled ? true : false;
	this.linkInit = false;
	this.zid = 12;
	
	this.inObj = function(x, y) {
		if(this.link) {
			if(x >= this.getX()+this.linkOffs && x <= this.getX()+this.endOffs+20 && y >= this.getY() && y <= this.getY()+20) return true;
			else return false;
		}
		else return this.constructor.prototype.inObj.call(this, x, y);
	};

	this.draw = function(ctx, x, y) {
		if(x!=null && y!=null) this.setPos(x, y);
		var loc = [ this.getX(), this.getY() ];
		
		if(this.styled) {ctx.save();this.configCtxFlex(ctx);}
		
		// Link inside
		if(this.link && this.link.offset>=0) {
			if(!this.linkInit) {
				this.begin = this.text.substring(0,this.link.offset);
				this.linkOffs = ctx.measureText(this.begin).width;
				this.endOffs = this.linkOffs + ctx.measureText(this.link.src).width;
				this.end = this.text.substr(this.link.offset+this.link.src.length);
				if(this.link.type == 'audio')
					this.evtDeleg.removeListener('show', this.link.link.play);
				this.linkInit = true;
			}
			ctx.fillText(this.begin, loc[0], loc[1]);
			ctx.save();
			ctx.fillStyle = linkColor[this.link.type];
			ctx.fillText(this.link.src, loc[0]+this.linkOffs, loc[1]);
			ctx.restore();
			ctx.fillText(this.end, loc[0]+this.endOffs, loc[1]);
		}
		else ctx.fillText(this.text, loc[0], loc[1]);
		
		if(this.styled) ctx.restore();
	};
};
mse.Text.prototype = new mse.UIObject();
mse.Text.prototype.constructor = mse.Text;
mse.Text.prototype.toString = function() {
	return "[object mse.Text]";
};



// Article Layer for showing the article content
mse.ArticleLayer = function(container, z, param, article) {
	mse.Layer.call(this, container, z, param);
	
	this.setDefile = function(interval) {
		this.currTime = 0;
		this.currIndex = 0;
		this.interval = interval;
		this.complete = false;
		this.endId = 0;
		this.setSlider();
		
		this.speedCtrUI = new mse.UIObject(null, {pos:[this.getX()+50,mse.root.height-35], size:[this.width-100,50]});
		this.speedCtrUI.plus = new mse.Image(null, {size:[30,30]}, 'speedCtrBn');
		this.speedCtrUI.tip = new mse.Text(null, {textBaseline:'middle',textAlign:'center',font:'italic 20px '+cfs.font,fillStyle:'#FFF'}, '', true);
		this.speedCtrUI.draw = function(ctx) {
			ctx.save();
			ctx.translate(this.offx, this.offy);
			this.plus.draw(ctx, this.width-30, 0);
			ctx.rotate(Math.PI);
			this.plus.draw(ctx, -30, -30);
			ctx.restore();
			this.tip.draw(ctx);
		};
		
		this.speedCtrBn = function(e) {
			var ex = e.offsetX - this.speedCtrUI.offx;
			var ey = e.offsetY - this.speedCtrUI.offy;
			if(ey < 0 || ey > 50) return;
			if(ex >= 0 && ex <= 50) {
				// Left button clicked, Reduce the speed
				this.interval += 200;
				this.interval = (this.interval > 2000) ? 2000 : this.interval;
				this.speedCtrUI.tip.text = 'moins rapide';
			}
			else if(ex >= this.width-150 && ex <= this.width-100) {
				// Right button clicked, augmente the speed
				this.interval -= 200;
				this.interval = (this.interval < 300) ? 300 : this.interval;
				this.speedCtrUI.tip.text = 'plus rapide';
			}
			this.speedCtrUI.tip.globalAlpha = 1;
			mse.slideout(this.speedCtrUI.tip, 10, [[e.offsetX, e.offsetY], [e.offsetX, e.offsetY-50]]);
		};
		
		var cb = new mse.Callback(this.speedCtrBn, this);
		this.getContainer().evtDeleg.addListener('click', cb, true, this.speedCtrUI);
		
		// Key event for control of speed
		this.speedCtr = function(e) {
			switch(e.keyCode) {
			case __KEY_LEFT:
				this.interval += 100;
				this.interval = (this.interval > 2000) ? 2000 : this.interval;
				break;
			case __KEY_RIGHT:
				this.interval -= 100;
				this.interval = (this.interval < 300) ? 300 : this.interval;
				break;
			}
		};
		cb = new mse.Callback(this.speedCtr, this);
		this.getContainer().evtDeleg.addListener('keydown', cb);
	};
	
	this.setSlider = function() {
		// Slider
		this.slider = new mse.Slider(this, {}, 'vertical', this.getX()+this.getWidth()-10, 10);
		this.slider.desactive();
		mse.fadeout(this.slider, 2);
		this.updateListScreen();
		
		// Scroll event
		this.scroll = function(e) {
			if(this.active && this.dominate instanceof mse.UIObject) return;
			if(!this.slider.on) {
				this.slider.active();
				if(this.slider.getAlpha()<1) mse.fadein(this.slider, 4);
				this.pause = true;
				this.enScroll = true;
			}
			this.scrollT = 0;
			this.offy += e.rolled;
			// Adjustement
			if(this.offy > 250) this.offy = 250;
			if(this.offy+this.getHeight() < mse.root.height/4)
				this.offy = mse.root.height/4 - this.getHeight();
		};
		this.gestUpdate = function(e) {
			if(this.active && this.dominate instanceof mse.UIObject) return;
			if(e.listX.length > 4) {
				e.rolled = e.listY[e.listY.length-1] - e.listY[e.listY.length-2];
				this.scroll(e);
			}
		};
		
		this.getContainer().evtDeleg.addListener('gestureUpdate', new mse.Callback(this.gestUpdate, this));
		if(!MseConfig.mobile)
			this.getContainer().evtDeleg.addListener('mousewheel', new mse.Callback(this.scroll, this));
	};
	
	this.updateIndexs = function(start, offset) {
		for(var i in this.phraseIndexs) {
			if(this.phraseIndexs[i] >= start) this.phraseIndexs[i] += offset;
		}
	};
	
	this.setLinklist = function(list) {
		for(var l in list) {
			// Change the initial paragraph index to line index for identifing the link more precisely
			var parag = list[l].index;
			for(var i = this.phraseIndexs[parag]; i < this.phraseIndexs[parag+1]; i++) {
				if( !this.objList[i].text ) continue;
				var offset = this.objList[i].text.indexOf(list[l].src);
				if( offset >= 0 ) {
					switch(list[l].type) {
					case 'audio':
						this.objList[i].evtDeleg.addListener('show', 
								new mse.Callback(list[l].link.play, list[l].link));
						this.getContainer().evtDeleg.addListener(
								'click', 
								new mse.Callback(list[l].link.play, list[l].link), 
								true, 
								this.objList[i]);
						break;
					case 'wiki':
						this.getContainer().evtDeleg.addListener(
								'click', 
								new mse.Callback(mse.changePage, null, list[l].link), 
								true, 
								this.objList[i]);
						break;
					}
					list[l].index = i;
					list[l].offset = offset;
					list[l].owner = this.objList[i];
					this.objList[i].link = list[l];
					break;
				}
			}
		}
		this.links = list;
	};
	
	this.setLinkDelegate = function(deleg, type) {
		if(!this.links) return;
		
		for(var l in this.links) {
			if(this.links[l].type == type) {
				this.objList[this.links[l].index].evtDeleg.addListener('show', new mse.Callback(deleg.linkShowHandler, deleg, this.links[l]));
				this.objList[this.links[l].index].evtDeleg.addListener('disapear', new mse.Callback(deleg.linkDisapearHandler, deleg, this.links[l]));
			}
		}
	};
	
	this.addObject = function(obj) {
		var last = this.objList.length-1;
		if(last >= 0) {
			obj.setX(obj.offx);
			obj.setY(this.objList[last].height, this.objList[last]);
		}
		else obj.setPos(0, 0);
		this.length += obj.height;
		this.endId = this.objList.length-1;
		return this.constructor.prototype.addObject.call(this, obj);
	};
	this.insertObject = function(obj, index) {
		var res = this.constructor.prototype.insertObject.call(this, obj, index);
		if(!res) return res;
		
		this.updateIndexs(index, 1);
		
		if(index == 0) {
			obj.setPos(0, 0);
			index = 1;
		}
		for(var i = index; i < this.objList.length; i++) {
			this.objList[i].setX(this.objList[i].offx);
			this.objList[i].setY(this.objList[i-1].height, this.objList[i-1]);
		}
		this.length += obj.height;
		return res;
	};
	this.delObject = function(obj) {
		var res = this.constructor.prototype.delObject.call(this, obj);
		if(!isNaN(res)) {
			this.length -= obj.height;
			this.updateIndexs(res, -1);
			this.endId = this.objList.length-1;
		}
		return res;
	};
	this.getHeight = function() {
		var nb = this.complete ? this.objList.length : this.currIndex;
		if(nb == 0) return 0;
		return this.objList[nb-1].offy+this.objList[nb-1].height;
	};
	
	// Get obj list on screen
	this.updateListScreen = function() {
		// Screen offset
		var topOffy = this.oy-this.offy;
		topOffy = (topOffy < 0 ? 0 : topOffy);
		var botOffy = topOffy + this.height*0.8;
		var last = this.complete ? this.objList.length-1 : this.currIndex-1;
		last = last < 0 ? 0 : last;
		var start = -1, end = -1;
		// Layer up : position of start obj in previous objs on screen less than current screen position
		if(this.prevOffy <= topOffy) {
			for(var i = this.startId; i <= last; i++) {
				if(start==-1 && this.objList[i].offy+this.objList[i].height > topOffy) start = i;
				if(end==-1 && this.objList[i].offy > botOffy) {end = i;break;}
			}
			start = start==-1 ? last : start;
			end = end==-1 ? last : end;
		}
		// Layer down
		else {
			for(var i = this.endId; i >= 0; i--) {
				if(end==-1 && this.objList[i].offy <= botOffy) end = i;
				if(start==-1 && this.objList[i].offy+this.objList[i].height <= topOffy) {start = i;break;}
			}
			start = start==-1 ? 0 : start;
			end = end==-1 ? 0 : end;
		}
		
		// Link show or disapear event notification
		if(start > this.startId) {
			for(var i = this.startId; i < start; i++)
				if(this.objList[i].link)
					this.objList[i].evtDeleg.eventNotif('disapear');
				else this.objList[i].evtDeleg.eventNotif('disapear');
		}
		else if(start < this.startId) {
			for(var i = start; i < this.startId; i++)
				if(this.objList[i].link)
					this.objList[i].evtDeleg.eventNotif('show');
				else this.objList[i].evtDeleg.eventNotif('show');
		}
		if(end > this.endId) {
			for(var i = this.endId+1; i <= end; i++)
				if(this.objList[i].link)
					this.objList[i].evtDeleg.eventNotif('show');
				else this.objList[i].evtDeleg.eventNotif('show');
		}
		else if(end < this.endId) {
			for(var i = end+1; i <= this.endId; i++)
				if(this.objList[i].link)
					this.objList[i].evtDeleg.eventNotif('disapear');
				else this.objList[i].evtDeleg.eventNotif('disapear');
		}
		
		this.startId = start;
		this.endId = end;
	};
		
	this.logic = function(delta) {
		if(this.slider) {
// TODO !!!
			this.slider.setLength(this.height * (this.height/this.length>1 ? 0.7 : this.height/this.length));
			var loc = this.oy+this.height * (-this.getY() / this.length);
			loc = (loc < 0 ? this.oy+this.parent.getY() : loc);
			this.slider.setLoc(loc);
		}
		
		if(this.active && this.dominate instanceof mse.UIObject) {
			this.dominate.logic(delta);
			return;
		}
		
		// Scroll timeout
		if(this.enScroll) {
			this.scrollT += delta;
			if(this.scrollT > 600) {
				this.enScroll = false;
				this.slider.desactive();
				var nb = this.complete ? this.objList.length : this.currIndex;
				
				if( nb==0 || this.objList[nb-1].getY() < mse.root.height*0.8 ) {
					mse.fadeout(this.slider, 4);
					this.pause = false;
				}
			}
		}
		
		if(this.slider) this.updateListScreen();
		for(var i = this.startId; i <= this.endId; i++)
			this.objList[i].logic(delta);
		if(this.complete || !this.active) {
			this.prevOffy = (this.oy-this.offy<0 ? 0 : this.oy-this.offy);
			return;
		}
	
		if(!this.pause) {
			this.currTime += delta;
			var dt = (this.currIndex!=0 && this.objList[this.currIndex-1] instanceof mse.Image) ? 3000 : this.interval;
			if(this.currTime >= dt) {
				this.currTime = 0;
				// Move layer to right place
				if(this.currIndex < this.objList.length) {
					var focusy = this.objList[this.currIndex].offy + this.objList[this.currIndex].height/2;
					if(focusy > mse.root.height/2) {
						var move = new mse.KeyFrameAnimation(this, {
								frame	: [0, 15],
								pos		: [[this.offx,this.offy], [this.offx, mse.root.height/2-focusy]]
							}, 1);
						move.start();
					}
					this.currIndex++;
				}
				else this.complete = true;
			}
		}
		
		this.prevOffy = (this.oy-this.offy<0 ? 0 : this.oy-this.offy);
	};
	
	this.draw = function(ctx) {
		for(var i = this.startId; i <= this.endId; i++) {
			this.configCtx(ctx);
			this.objList[i].draw(ctx);
		}
		
		if(this.slider) this.slider.draw(ctx);
		if(this.speedCtrUI) this.speedCtrUI.draw(ctx);
	};
	this.inObj = function(x, y) {
		return this.parent.inObj(x,y);
	};
	
	this.interrupt = function() {
		this.dominate = this.vide;
	};
	this.play = function() {
		this.dominate = null;
	};
	
	
//!!! Strange fontSize access
	// Init the size and lines information
	this.length = 0;
	this.oy = this.offy;
	this.prevOffy = this.oy;
	this.lineHeight = Math.round( 1.4*(this.font ? checkFontSize(this.font) : 16) );
	this.phraseIndexs = new Array();

	if(article) {
		var ctx = mse.root.ctx;
		this.configCtx(ctx);
		var maxM = Math.floor( this.width/ctx.measureText('A').width );	
		
		var arr = article.split('\n');
		var sep = 0;
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].length == 0) { // Separator paragraph
				this.addObject( new mse.UIObject(this, {size:[this.width, DIST_PARAG]}) );
				sep++;
				continue;
			}
			
			this.phraseIndexs[i-sep] = this.objList.length;
			for(var j = 0; j < arr[i].length;) {
				// Find the index of next line
				var next = checkNextLine(ctx, arr[i].substr(j), maxM, this.width);
				this.addObject( new mse.Text( this, {size:[this.width, this.lineHeight]}, arr[i].substr(j, next) ) );
				j += next;
			}
			// Separator phrase
			//this.addObject( new mse.UIObject(this, {size:[this.width, DIST_PARAG]}) );
		}
	}
	this.startId = 0;
	this.endId = this.objList.length-1;
	this.complete = true;
	this.pause = false;
	this.enScroll = false;
	this.scrollT = 0;
	this.vide = new mse.UIObject();
	// Dominate obj, if exist, logic and draw dominated by this obj
	this.dominate = null;
};
mse.ArticleLayer.prototype = new mse.Layer();
mse.ArticleLayer.prototype.constructor = mse.ArticleLayer;




// Image object
mse.Image = function(parent, param, src) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	this.img = src;
	
	this.draw = function(ctx, x, y) {
		var img = mse.src.getSrc(this.img);
		this.configCtxFlex(ctx);
		if(isNaN(x) || isNaN(y)) {
			if(this.width) ctx.drawImage(img, this.getX(), this.getY(), this.width, this.height);
			else ctx.drawImage(img, this.getX(), this.getY());
		}
		else {
			if(this.width) ctx.drawImage(img, x, y, this.width, this.height);
			else ctx.drawImage(img, x, y);
		}
	};
};
mse.Image.prototype = new mse.UIObject();
mse.Image.prototype.constructor = mse.Image;
mse.Image.prototype.toString = function() {
	return "[object mse.Image]";
};


// Mask object
mse.Mask = function(parent, param, z) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	if(z != null) this.zid = z;
	if(param.cornerRatio) this.cr = param.cornerRatio;
	
	this.draw = function(ctx) {
		this.configCtx(ctx);
		if(!this.cr) ctx.fillRect(this.getX(), this.getY(), this.width, this.height);
		else ctx.fillRoundRect(this.getX(),this.getY(),this.width,this.height,this.cr);
	};
};
mse.Mask.prototype = new mse.UIObject();
mse.Mask.prototype.constructor = mse.Mask;



// Sprite
mse.Sprite = function(parent, param, src, fw, fh, sx, sy, sw, sh, frames) {
	mse.Image.call(this, parent, param, src);
	if(frames) this.frames = frames;
	else {
		// Frame width and height
		this.fw = fw; this.fh = fh;
		// Source region
		if(arguments.length == 9) {
			this.sx = sx; this.sy = sy; this.sw = sw; this.sh = sh;
		}
		else {
			this.sx = 0; this.sy = 0; 
			this.sw = this.img.width; this.sh = this.img.height;
		}
		// Number of column and row in the sprite
		if(fw < this.sw) this.col = Math.floor(this.sw/fw);
		else {
			this.fw = this.sw; this.col = 1;
		}
		if(fh < this.sh) this.row = Math.floor(this.sh/fh);
		else {
			this.fh = this.sh; this.row = 1;
		}
		// Number of frame
		this.nb = this.col * this.row;
		// Destination region
		if(this.width==0) this.width = this.fw;
		if(this.height==0) this.height = this.fh;
	}
	this.curr = 0;
	
	this.draw = function(ctx, ox, oy) {
		this.configCtxFlex(ctx);
		if(isNaN(ox)) var ox = this.getX();
		if(isNaN(oy)) var oy = this.getY();
		var img = mse.src.getSrc(this.img);
		if(!this.frames) {
			var x = this.sx + (this.curr % this.col) * this.fw;
			var y = this.sy + (Math.floor(this.curr / this.col)) * this.fh;
			ctx.drawImage(img, x, y, this.fw,this.fh, ox,oy, this.getWidth(), this.getHeight());
		}
		else {
			var x = this.frames[this.curr][0]; var y = this.frames[this.curr][1];
			var fw = this.frames[this.curr][2]; var fh = this.frames[this.curr][3];
			ctx.drawImage(img, x, y, fw,fh, ox,oy, fw,fh);
		}
	};
};
mse.Sprite.prototype = new mse.Image();
mse.Sprite.prototype.constructor = mse.Sprite;



// Game object
// interru: the layer who is interrupted by this game
mse.Game = function(parent, z, param, interru) {
	// Super constructor
	mse.Layer.call(this, parent, z, param);
	
	delete this.objList;
	delete this.addObject;
	delete this.insertObject;
	delete this.delObject;
	delete this.getObject;
	
	this.state = "INIT";
	this.score = 0;
	this.interru = interru;
	
	// Our little rat friend
	this.ratSit = new mse.Sprite(this,{}, 'ratImg', 80,50, 0,0,400,100);
	this.ratHead = new mse.Sprite(this,{}, 'ratImg', 39,34, 400,0,39,34);
	this.ratParole = new Array();
	this.setParole = function(s) {
		var h = 0.2*50*this.width/(80*this.height);
		var wh = 0.2*39/80;
		var hh = wh*34*this.width/(39*this.height);
		this.ratSit.setSize(0.2,h);
		this.ratHead.setSize(wh,hh);
		this.bullWidth = 0.5*this.width; this.bullHeight = 0;
		
		this.ratParole.splice(0,this.ratParole.length);
		if(!s || s == '') {this.bullHeight = 0; return;}
		var ctx = mse.root.ctx;
		this.configCtx(ctx);
		var maxM = Math.floor( (this.bullWidth-20)/ctx.measureText('A').width );
		var lineHeight = Math.round( 1.1*(this.font ? checkFontSize(this.font) : 20) );
		
		for(var j = 0; j < s.length;) {
			// Find the index of next line
			var next = checkNextLine(ctx, s.substr(j), maxM, this.bullWidth-20);
			this.ratParole.push( new mse.Text( null, {size:[this.bullWidth-20, lineHeight]}, s.substr(j, next) ) );
			j += next;
		}
		this.bullHeight = this.ratParole.length * lineHeight * 1.5;
	};
	
	this.drawRat = function(ctx, x, y) {
		if(this.bullHeight) {
			ctx.save();
			ctx.translate((x ? x : 0.2*this.width), (y ? y : 0.5*this.height));
			// Draw rat
			this.ratSit.draw(ctx,0,0);
			ctx.translate(0.0625*this.ratSit.getWidth()-0.38*this.ratHead.getWidth(), 0.1*this.ratSit.getHeight()-0.7*this.ratHead.getHeight());
			this.ratHead.draw(ctx,0,0);
			// Draw bull
			ctx.fillStyle = "#FFF";
			ctx.translate(this.ratHead.getWidth()*1.2, -0.8*this.bullHeight);
			ctx.beginPath();
			ctx.moveTo(-10,this.bullHeight);
			ctx.lineTo(0,this.bullHeight-15);
			ctx.lineTo(10,this.bullHeight);
			ctx.lineTo(-10,this.bullHeight);
			ctx.fill();
			ctx.fillRoundRect(0, 0, this.bullWidth, this.bullHeight, 10);
			ctx.fillStyle = "#000";
			ctx.textBaseline = 'top';
			var ty = this.bullHeight/5;
			for(var i in this.ratParole) {
				this.ratParole[i].draw(ctx,10,ty);
				ty += this.ratParole[i].height;
			}
			ctx.restore();
		}
	};
	
	this.draw = function(ctx) {
		if(!this.active) return;

		this.configCtx(ctx);
		ctx.save();
		ctx.translate(this.getX(), this.getY());
		
		// Border
		ctx.strokeStyle = 'rgb(188,188,188)';
		ctx.lineWidth = 5;
		ctx.strokeRect(0, 0, this.width, this.height);
		ctx.lineWidth = 1;
		
		switch(this.state) {
		case "INIT":
			// Start page
			this.startPage(ctx);break;
		case "START":
			this.drawGame(ctx);break;
		case "LOST":
			this.lostPage(ctx);break;
		case "END":
			// End page
			this.endPage(ctx);break;
		}
		ctx.restore();
	};
};
mse.Game.prototype = new mse.Layer();
mse.Game.prototype.constructor = mse.Game;
// Delete non useful methode
delete mse.Game.prototype.objList;
delete mse.Game.prototype.addObject;
delete mse.Game.prototype.insertObject;
delete mse.Game.prototype.delObject;
delete mse.Game.prototype.getObject;


// Basic Game object with a start page and a end page
mse.BasicGame = function(parent, z, param, interru) {
	// Super constructor
	mse.Game.call(this, parent, z, param, interru);
	
	this.initWindow = function(e) {
		this.origin = [this.offx, this.offy];
		this.originS = [this.width, this.height];
		if(MseConfig.mobile) {
			this.getContainer().setOrientation('landscape');
			this.fixed = true;
			this.setPos(0, 0);
			this.setSize(480, 268);
			this.getContainer().deleg = this;
			this.init();
		}
		else {
			var start = new mse.KeyFrameAnimation(this, {
					frame	: [0, 16],
					pos		: [[this.offx,this.offy], [this.offx-0.5*this.width,this.offy-0.5*this.height]],
					size	: [[this.width,this.height], [this.width*2,this.height*2]]
				}, 1);
			start.evtDeleg.addListener('end', new mse.Callback(this.init, this));
			start.start();
		}
		this.getContainer().evtDeleg.removeListener('click', this.cbInitWin);
		this.getContainer().evtDeleg.addListener('click', this.cbStart, true);
	};
	this.start = function(e) {
		// Unbind listener for starting the game
		this.getContainer().evtDeleg.removeListener('click', this.cbStart);
		this.startGame();
		this.state = "START";
	};
	this.over = function(e) {
		this.getContainer().evtDeleg.removeListener('click', this.cbOver);
		this.interru.dominate = null;
		if(MseConfig.mobile) {
			this.getContainer().setOrientation('portrait');
			this.fixed = false;
			this.setPos(this.origin[0], this.origin[1]);
			this.setSize(this.originS[0], this.originS[1]);
			this.getContainer().deleg = null;
		}
		else {
			var end = new mse.KeyFrameAnimation(this, {
					frame	: [0, 16],
					pos		: [[this.offx,this.offy], this.origin],
					size	: [[this.width,this.height], this.originS]
				}, 1);
			end.evtDeleg.addListener('end', new mse.Callback(mse.root.evtDistributor.setDominate, mse.root.evtDistributor, null));
			end.start();
		}
	};
	this.gameEnd = function() {
		this.state = "END";
		this.getContainer().evtDeleg.addListener('click', this.cbOver);
	};
	
	this.showHandler = function(evt) {
		this.setParole('Clique pour jouer');
		this.interru.dominate = this;
		mse.root.evtDistributor.setDominate(this);
		this.getContainer().evtDeleg.addListener('click',this.cbInitWin,true);
		this.evtDeleg.removeListener('show', this.cbShow);
	};
	
	this.cbStart = new mse.Callback(this.start, this);
	this.cbOver = new mse.Callback(this.over, this);
	this.cbInitWin = new mse.Callback(this.initWindow, this);
	this.cbShow = new mse.Callback(this.showHandler, this);
	// When parent is a Article layer, guarantee that the game is a obj dominate when it shows up
	this.evtDeleg.addListener('show', this.cbShow);
};
mse.BasicGame.prototype = new mse.Game();
mse.BasicGame.prototype.constructor = mse.BasicGame;



// Slider
mse.Slider = function(parent, param, orientation, offset, width) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	this.fillStyle = 'rgba(145,152,159, 0.7)';
	
	if(orientation=='horizontal') {
		this.orientation = 'horizontal';
		this.setPos(0, offset);
		this.setSize(mse.root.width, width);
		this.loc = 0;
		this.length = this.width;
	}
	else {
		this.orientation = 'vertical';
		this.setPos(offset, 0);
		this.setSize(width, mse.root.height);
		this.loc = 0;
		this.length = this.height;
	}
	this.on = true;
	
	this.setLoc = function(loc) {
		if(loc < 0) this.loc = 0;
		else this.loc = loc;
	};	
	this.setLength = function(l) {
		if(l < 0) this.length = 0;
		else this.length = l;
	};
	this.active = function() {
		this.on = true;
	};
	this.desactive = function() {
		this.on = false;
	};
	this.draw = function(ctx) {
		this.configCtx(ctx);
		ctx.beginPath();
		if(this.orientation == 'vertical') {
			var l = this.loc+this.length > mse.root.height ? mse.root.height-this.loc : this.length;
			var r = this.width/2;
			// Top semi elipse
			ctx.arc(this.offx+r,this.loc+r,r,0,Math.PI,true);
			// Body left
			ctx.lineTo(this.offx, this.loc+l-r);
			// Bottom semi elipse
			ctx.arc(this.offx+r,this.loc+l-r,r,Math.PI,2*Math.PI,true);
			// Body right
			ctx.lineTo(this.offx+this.width, this.loc+r);
		}
		else {
			var l = this.loc+this.length > mse.root.width ? mse.root.width-this.loc : this.length;
			var r = this.height/2;
			// Left semi elipse
			ctx.arc(this.loc+r,this.offy+r,r,1.5*Math.PI,0.5*Math.PI,false);
			// Body top
			ctx.lineTo(this.loc+l-r, this.offy);
			// Right semi elipse
			ctx.arc(this.loc+l-r,this.offy+r,r,0.5*Math.PI,1.5*Math.PI,false);
			// Body bottom
			ctx.lineTo(this.loc+r, this.offy+this.height);
		}
		ctx.fill();
	};
};
mse.Slider.prototype = new mse.UIObject();
mse.Slider.prototype.constructor = mse.Slider;


// Button
mse.Button = function(parent, param, txt, image, link) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	this.txt = txt;
	this.img = image;
	this.link = link;
	
	this.draw = function(ctx, x, y) {
		this.configCtx(ctx);
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		if(x == null) var ox = this.getX(), oy = this.getY();
		else var ox = x, oy = y;
		var img = mse.src.getSrc(this.img);
		if(img) ctx.drawImage(img, ox, oy, this.width, this.height);
		
		if(this.txt)
			ctx.fillText(this.txt, ox+this.width/2, oy+this.height/2);
	};
};
mse.Button.prototype = new mse.UIObject();
mse.Button.prototype.constructor = mse.Button;


// Menu item
mse.MenuItem = function(parent, param, txt, image, linkType, link) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	this.txt = txt;
	this.img = image;
	this.zid = 11;
	// Guarentee the link works
	this.linkType = ((linkType!=null && link!=null) ? linkType : 'None');
	this.link = link;
	
	this.linkClicked = function(e) {
		// A new container link, transition from current container to the link
		switch(this.linkType) {
		case 'None' : break;
		case 'SubMenu' :
			this.parent.subShow = this.link;
			var items = this.parent.subMenu[this.link];
			for(var i in items)
				mse.fadein(items[i], 8);
			break;
		case 'Card' :
			this.link.evtDeleg.addListener('click', new mse.Callback(mse.root.revealCard, mse.root, mse.root.container), true);
			mse.root.poseCard(this.link);
			break;
		case 'Page' : default :
			mse.changePage(this.link);
			break;
		}
	};
	
	var cbLink = new mse.Callback(this.linkClicked, this);
	switch(this.linkType) {
	case 'None' : break;
	case 'SubMenu' :
		if(MseConfig.mobile) mse.root.evtDistributor.addListener('click', cbLink, true);
		else mse.root.evtDistributor.addListener('enter', cbLink, true);
		break;
	case 'Page': case 'Card': default : 
		 mse.root.evtDistributor.addListener('click', cbLink, true);
		break;
	}
	
	this.draw = function(ctx) {
		this.configCtxFlex(ctx);
		if(this.img) {
			var img = mse.src.getSrc(this.img);
			ctx.drawImage(img, this.getX(), this.getY(), this.width, this.height);
		}
		else ctx.fillRect(this.getX(), this.getY(), this.width, this.height);
		
		if(this.txt) ctx.fillText(this.txt, this.getX()+this.width/2, this.getY()+this.height/2);
	};
};
mse.MenuItem.prototype = new mse.UIObject();
mse.MenuItem.prototype.constructor = mse.MenuItem;


// Menu
var SLIDETIME = 500;
mse.Menu = function(parent, param, iwidth, iheight) {
	// Super constructor
	mse.Layer.call(this, parent, 10, param);
	
	this.iwidth = iwidth;
	this.iheight = iheight;
	this.ioffx = (this.width - iwidth)/2;
	this.espace = iheight/2 > 20 ? iheight/2 : 20;
	this.fillStyle = 'rgb(145,152,159)';
	this.maskAlpha = 0.45;
	this.shadow = {shadowOffsetX:0, shadowOffsetY:0, shadowBlur:5, shadowColor:'rgb(67, 67, 67)'};
	this.subMenu = new Array();
	this.subShow = -1;
	this.offx -= this.width;
	this.state = 'PRESENT';
	this.zonex = this.width;
	
	this.inObj = function(x, y) {
		if(this.insideRec)
			var ox = this.getX()-this.zonex+this.insideRec[0], oy = this.getY()+this.insideRec[1], w = this.insideRec[2], h = this.insideRec[3];
		else var ox = this.getX()-this.zonex, oy = this.getY(), w = 2*this.getWidth(), h = 2*this.getHeight();
		
		if(x>ox && x<ox+w && y>oy && y<oy+h) return true;
		else return false;
	};
	this.getX = function() {
		var x = (this.parent ? this.parent.getX() : 0);
		return x+this.offx+this.zonex;
	};
	
	this.slideInOut = function(evt) {
		switch(this.state) {
		case 'HIDE': 
			if(this.name) mse.root.container.desactiveOthers(this.name);
			this.state = 'IN';break;
		case 'PRESENT': 
			if(this.name) mse.root.container.reactiveOthers();
			this.state = 'OUT';break;
		}
	};
	this.hide = function(){
		this.state = 'HIDE';
		this.zonex = 0;
		this.globalAlpha = 0;
	};
	
	this.addItem = function(txt, image, type, link) {
		var l = this.objList.length;
		if(type == "SubMenu") link = l;
		if(l == 0) y = this.espace;
		else var y = this.objList[l-1].offy + this.iheight + this.espace;
		var item=new mse.MenuItem(this,{pos:[this.ioffx,y],size:[this.iwidth,this.iheight]},txt,image,type,link);
		this.addObject(item);
		return item;
	};
	this.addSubItem = function(subTo, txt, image, type, link) {
		if(!this.objList[subTo]) return;
		var y = this.objList[subTo].offy;
		var item=new mse.MenuItem(this,{pos:[this.width+6,y],size:[180,this.iheight],globalAlpha:0,font:'Bold 16px '+cfs.font,textAlign:'center',fillStyle:'#FFF',textBaseline:'middle'},txt,image,type,link);
		if(!this.subMenu[subTo]) this.subMenu[subTo] = new Array();
		this.subMenu[subTo].push(item);
		return item;
	};
	this.delItem = function(i) {
		this.objList.splice(i, 1);
	};
	this.delSubItem = function(i, subTo) {
		if(this.subMenu[subTo]) this.subMenu[subTo].splice(i, 1);
	};
	
	this.logic = function(delta) {
		switch(this.state) {
		case 'HIDE': case 'PRESENT': break;
		case 'OUT':
			if(this.zonex > 0) {
				this.globalAlpha -= delta/SLIDETIME;
				if(this.globalAlpha < 0) this.globalAlpha = 0;
				this.zonex -= delta/SLIDETIME * this.width;
			}
			else {this.state = 'HIDE';this.globalAlpha = 0;}
			break;
		case 'IN':
			if(this.zonex < this.width) {
				this.globalAlpha += delta/SLIDETIME;
				if(this.globalAlpha > 1) this.globalAlpha = 1;
				this.zonex += delta/SLIDETIME * this.width;
			}
			else {this.state = 'PRESENT';this.globalAlpha = 1;}
			break;
		}
	};
	this.draw = function(ctx) {
		if(this.state != 'HIDE'){
			// Background mask
			var a = this.maskAlpha*this.getAlpha();
			ctx.fillStyle = 'rgba(0,0,0,'+a+')';
			ctx.fillRect(this.getX(), this.getY(), 256, this.height);
			
			// Menu items
			this.configCtx(ctx);
			ctx.fillRect(this.getX(), this.getY(), this.width, this.height);
			for(var i in this.objList) this.objList[i].draw(ctx);
			
			// Submenu items
			if(this.subShow >= 0) {
				for(var i in this.subMenu[this.subShow])
					this.subMenu[this.subShow][i].draw(ctx);
			}
		}
	};
	
	this.getContainer().evtDeleg.addListener('click', new mse.Callback(this.slideInOut, this), true);
};
mse.Menu.prototype = new mse.Layer();
mse.Menu.prototype.constructor = mse.Menu;



// Page Wiki, Title + Galery Photo + Wiki Content
mse.PageWiki = function(parent, z, param, title, photos, content) {
	// Super constructor
	mse.Layer.call(this, parent, z, param);
	// Define the size of title
	var ctx = mse.root.ctx;
	ctx.font = '22px '+cfs.font;
	var w = ctx.measureText(title).width * 1.2;
	// Title wiki
	// Problem of offset X of mask and title
	this.title = new mse.Button(this, {pos:[(this.width-w)/2,15],size:[w,35],font:'22px '+cfs.font,fillStyle:'#FFF'}, title, 'wikiBar');
	// Photo list
	this.photos = photos;
	this.phOff = this.width/2; // Photos offset
	this.espace = this.width/10;
	// Mask for title and photos
	this.mask = new mse.Mask(this, {
		pos:[0,0],
		size:[this.width,185],
		fillStyle:'#434343'
		});
	
	// Define the content of wiki
	param.pos = [this.offx+20,this.offy+210];
	param.size = [this.width-40,this.height-190];
	this.content = new mse.ArticleLayer(parent, z, param, content);
	this.content.setSlider();
	
	this.v = 0;
	
	this.addPhoto = function(img) {
		this.photos.push(img);
	};
	
	this.logic = function(delta) {
		if(this.v != 0) {
			// Movement of photos
			this.phOff += this.v;
			// Adjustment
			// The photos width
			var phWidth = -this.espace*3, src;
			for(var i in this.photos) {
				src = mse.src.getSrc(this.photos[i]);
				phWidth += 100*src.width/src.height+this.espace;
			}
			if(this.phOff > this.width/2) this.phOff = this.width/2;
			if(this.phOff+phWidth < this.width/2) this.phOff = this.width/2-phWidth;
		}
		/*
		// Slider
		this.content.slider.setLength(this.content.height * (this.content.height/this.content.length));
		this.content.slider.setLoc(200 + this.content.height * (-this.content.getY()/this.content.length));
		
		// Scroll timeout
		if(this.content.enScroll) {
			this.content.scrollT += delta;
			if(this.content.scrollT > 600) {
				mse.fadeout(this.content.slider, 4, new mse.Callback(this.content.slider.desactive, this.content.slider) );
				this.content.enScroll = false;
			}
		}*/
		this.content.logic(delta);
	};
	
	this.draw = function(ctx) {	
		// Content
		this.content.draw(ctx);
		
		this.mask.draw(ctx);		
		this.title.draw(ctx);
		
		// Galery photos
		ctx.save();
		ctx.strokeStyle = '#FFF';
		ctx.fillStyle = '#727272';
		ctx.translate(this.getX(), this.getY()+65);
		ctx.fillRect(0,1,this.width,118);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(this.width,0);
		ctx.moveTo(0,120);
		ctx.lineTo(this.width,120);
		ctx.stroke();
		
		if(this.photos.length > 0) var x = this.phOff-50;
		var w, src;
		for(var i in this.photos) {
			src = mse.src.getSrc(this.photos[i]);
			w = 100*src.width/src.height;
			if(x < 0) {
				if(x+w > 0) {// A part of photo to draw
					var sx = -x*src.width/w;
					ctx.drawImage(src, sx,0, src.width-sx,src.height, 0, 10, w+x, 100);
				}
			}
			else if(x+w > this.width) {
				if(x < this.width) {// A part of photo to draw
					var sw = (this.width-x)*src.width/w;
					ctx.drawImage(src, 0,0, sw,src.height, x, 10, this.width-x, 100);
				}
			}
			else ctx.drawImage(src, x, 10, w, 100);
			x += w + this.espace;
		}
		ctx.restore();
	};
	
	this.onMove = function(e) {
		var x = e.offsetX - this.getX();
		var y = e.offsetY - this.getY();
		// Out the region of galery photo
		if(y <= 65 || y >= 185) {this.v = 0; return;}
		// Distance from the center
		var dis = x - this.width/2;
		if(Math.abs(dis) > 30)
			this.v = dis/20;
		else this.v = 0;
	};
	this.getContainer().evtDeleg.addListener('move', new mse.Callback(this.onMove, this), true);
};
mse.PageWiki.prototype = new mse.Layer();
mse.PageWiki.prototype.constructor = mse.PageWiki;




// Time line
// It can be either interval fixed "interval" or interval no fixed define by a list of timestamp progressive "timeprog"
mse.Timeline = function(src, interval, timeprog, length) {
	if(!src.initTimeline || !src.runTimeline)
		return null;
	// Parameters
	this.src = src;
	if(interval > 0) {
		this.tsFixed = true;
		this.interval = interval;
		this.length = length != null ? length : 0;
	}
	else {
		if(!timeprog instanceof Array) return null;
		this.tsFixed = false;
		this.timeprog = timeprog;
		this.length = timeprog.length;
	}
	
	this.src.initTimeline(this);
	
	this.start = function() {
		// Parameters
		this.currTimestamp = 0;
		this.currIndex = 0;
		this.end = false;
		this.inPause = false;
	
		// First run
		this.src.runTimeline();
	
		// Start timer
		mse.currTimeline = this;
		if(this.tsFixed)
			this.timer = setInterval("mse.currTimeline.run()", this.interval);
		else this.timer = setTimeout("mse.currTimeline.run()", this.timeprog[this.currIndex]);
	};
	
	this.run = function() {
		if(this.end) {
			if(this.tsFixed)
				clearInterval(this.timer);
			else clearTimeout(this.timer);
			return;
		}
		if(this.inPause)
			return;
			
		this.currTimestamp += this.tsFixed ? this.interval : this.timeprog[this.currIndex];
		this.currIndex++;
		// Not End
		if(this.length == 0 || this.currIndex < length) {	
			// Interval no fixed
			if(!this.tsFixed) {
				this.src.runTimeline(this.timeprog[this.currIndex-1]);
				this.timer = setTimeout("mse.currTimeline.run()", this.timeprog[this.currIndex]);
			}
			else this.src.runTimeline(this.interval);
		}
		// END
		else {
			this.end = true;
		}
	};
	
	this.playpause = function() {
		if(this.end) return;
		this.inPause = !this.inPause;
		if(!this.inPause) {
			if(mse.currTimeline != this) mse.currTimeline = this;
			this.timer = setTimeout("mse.currTimeline.run()", 1200);
		}
	};
	this.play = function() {
		if(this.end) return;
		this.inPause = false;
		if(mse.currTimeline != this) mse.currTimeline = this;
		this.timer = setTimeout("mse.currTimeline.run()", 1200);
	};
	this.pause = function() {
		if(this.end) return;
		this.inPause = true;
	};
};



// Frame Animation
mse.FrameAnimation = function(sprite, seq, rep, delay){
	if(!seq instanceof Array || !sprite instanceof mse.Sprite) return null;
	
	this.sprite = sprite;
	this.seq = seq;
	this.rep = isNaN(rep) ? 1 : rep;
	this.delay = delay ? delay : 0;
	this.active = false;
	this.evtDeleg = new mse.EventDelegateSystem();
	mse.root.animations.push(this);
	
	this.start = function() {
		this.currFr = 0;
		this.currRep = 1;
		this.delayCount = this.delay;
		this.active = true;
		this.evtDeleg.eventNotif('start');
	};
	
	this.stop = function() {
		this.currFr = 0;
		this.currRep = 0;
		this.active = false;
		this.evtDeleg.eventNotif('end');
	};
	
	this.logic = function(delta) {
		if (!this.active) return false;
		
		if (this.currFr < this.seq.length-1) {
			if (this.delay != 0) {
				if (this.delayCount == 0) {
					this.currFr++;
					this.delayCount = this.delay;
				}
				this.delayCount--;
			}
			else this.currFr++;
		}
		else {
			if (this.currRep < this.rep || this.rep == 0) {
				this.currRep++;
				this.currFr = 0;
			}
			else {
				this.active = false;
				this.evtDeleg.eventNotif('end');
				return true;
			}
		}
		this.sprite.curr = this.seq[this.currFr];
		return false;
	};
};




// Key Frame Animation
mse.KeyFrameAnimation = function(elem, keyFrameMap, repeat) {
	if(!elem instanceof mse.UIObject) {mseLog('Type Error', 'Element isn\'t a Mse UI Element');return null;}
	// No time stamp defined
	if( !keyFrameMap || !keyFrameMap['frame'] ) {mseLog('Parameter Error','No frame stamp defined');return null;}
	// Length error
	for(var key in keyFrameMap) {
		if(keyFrameMap[key].length != keyFrameMap['frame'].length)
		{mseLog('Parameter Error','KeyFrame length not compatible with the frame stamp');return null;}
	}
	this.length = keyFrameMap['frame'].length;
	if(this.length < 2) {mseLog('Length Error','KeyFrame Length must be larger than 2');return null;}
	// First frame stamp isn't 0
	if(keyFrameMap['frame'][0] != 0) {mseLog('Error','Frame start point is not 0');return null;}
	
	this.duration = keyFrameMap['frame'][this.length-1];
	
	this.element = elem;
	this.repeat = (repeat == null) ? 1 : repeat;
	this.map = keyFrameMap;
	
	this.currId = 0;
	this.currFr = 0;
	this.nextKf = this.map['frame'][1];
	this.currRp = 1;
	this.evtDeleg = new mse.EventDelegateSystem();
	
	if(this.map['opacity']) // Avoid the bug of opacity in javacript
		this.element.globalAlpha = this.map['opacity'][0]==0 ? 0.01 : this.map['opacity'][0];
	
	this.setNoTransition = function() {
		this.notransition = true;
	};
	this.resetAnimation = function() {
		this.currId = 0;
		this.currFr = 0;
		this.nextKf = this.map['frame'][1];
		this.currRp = 1;
	};
	this.start = function() {
		for(var i in mse.root.animations)
			if(mse.root.animations[i] == this) return;
		mse.root.animations.push(this);
	};
	
	this.logic = function(delta) {
		if(this.currFr <= this.duration) {
			// Passed a timestamp, move to next
			if(this.currFr > this.nextKf) {
				// Update states
				this.currId++;
				this.nextKf = this.map['frame'][this.currId+1];
			}
			// No transition calculated between the frames
			if(this.notransition){
				for( var key in this.map ) {
					switch(key) {
					case 'frame': continue; // Ignore timestamps
					case 'pos':
						this.element.setPos(this.map[key][this.currId][0], this.map[key][this.currId][1]);break;
					case 'size':
						this.element.setSize(this.map[key][this.currId][0], this.map[key][this.currId][1]);break;
					case 'opacity':
						this.element.globalAlpha = this.map[key][this.currId];break;
					case 'fontSize':
						var size = this.map[key][this.currId];
						var s = checkFontSize(this.element.font);
						this.element.font=this.element.font.replace(s,size.toString());
						break;
					case 'scale':
						this.element.scale = this.map[key][this.currId];break;
					}
				}
			}
			else {
				// Play the transition between currFr and nextKf
				var ratio = (this.currFr - this.map['frame'][this.currId]) / (this.nextKf - this.map['frame'][this.currId]);
				// Iterate in attributes for animation
				for( var key in this.map ) {
					switch(key) {
					case 'frame': continue; // Ignore timestamps
					case 'pos':
						var x = calTransition['Float'](ratio, this.map[key][this.currId][0], this.map[key][this.currId+1][0]);
						var y = calTransition['Float'](ratio, this.map[key][this.currId][1], this.map[key][this.currId+1][1]);
						this.element.setPos(x, y);break;
					case 'size':
						var w = calTransition['Float'](ratio, this.map[key][this.currId][0], this.map[key][this.currId+1][0]);
						var h = calTransition['Float'](ratio, this.map[key][this.currId][1], this.map[key][this.currId+1][1]);
						this.element.setSize(w, h);break;
					case 'opacity':
						this.element.globalAlpha = calTransition['Float'](ratio, this.map[key][this.currId], this.map[key][this.currId+1]);
						break;
					case 'fontSize':
						var size = Math.floor(calTransition['Float'](ratio, this.map[key][this.currId], this.map[key][this.currId+1]));
						var s = checkFontSize(this.element.font);
						this.element.font=this.element.font.replace(s,size.toString());
						break;
					case 'scale':
						this.element.scale = calTransition['Float'](ratio, this.map[key][this.currId], this.map[key][this.currId+1]);
						break;
					}
				}
			}
			// Time increase
			this.currFr++;
		}
		// Repeat or not
		else if( this.repeat === 0 || this.currRp < this.repeat ) {
			this.currRp++;
			// Reset all states
			this.currId = 0;
			this.currFr = 0;
			this.nextKf = this.map['frame'][1];
		}
		// Stop
		else {
			this.evtDeleg.eventNotif('end');
			return true;
		}
		return false;
	};
	
	
	// Implementation for several types of CSS animation
	var calTransition = {
		'Float'	: function(ratio, prevState, nextState) {
				return prevState + ratio * (nextState-prevState);
			}
	};
};



window.mse = mse;

})(window, $);




(function (mse) {

var cfs = mse.configs;

var tTransition = 20;

// Root object for card system on mobile, a canvas Dom element
mse.CardRootMob = function(id, width, height, orientation) {
	// Super constructor
	mse.Root.call(this, id, width, height, orientation);
	
	this.precBg = null;
	
	// Move event handler
	this.gestStartHandler = function(e) {this.dir = 'undefined';};
	this.gestEndHandler = function(e) {
		var dest;
		switch(this.dir){
		case 'left':
			if(e.listX[0]-e.listX[e.listX.length-1] > 150)
				dest = this.container.right;
			break;
		case 'right':
			if(e.listX[e.listX.length-1]-e.listX[0] > 150)
				dest = this.container.left;
			break;
		case 'up':
			if(e.listY[0]-e.listY[e.listY.length-1] > 150)
				dest = this.container.down;
			break;
		case 'down':
			if(e.listY[e.listY.length-1]-e.listY[0] > 150)
				dest = this.container.up;
			break;
		}
		this.dir = 'undefined';
		if(!dest) {
			// Return animation
			var x = this.container.getX();
			var y = this.container.getY();
			var ffeedback = new mse.KeyFrameAnimation(this.container, {
					frame	: [0, 12],
					pos		: [[x,y], [0,0]]
				}, 1);
			ffeedback.start();
		}
		else {
			// Switch animation
			this.setContainer(dest);
			var switchAnim = new mse.KeyFrameAnimation(dest, {
					frame	: [0, 12],
					pos		: [[dest.getX(),dest.getY()], [0,0]]
				}, 1);
			switchAnim.start();
		}
	};
	this.gestUpdateHandler = function(e) {
		var length = e.listX.length;
		// Direction detection
		if(length == 5) {
			// Calcul angle between p(length-1) and p0, angle [-180, 180]
			var angle = mseAngleForLine(e.listX[0], e.listY[0], e.offsetX, e.offsetY);
			// Direction detection gluton
			if(angle>-45 && angle<45) this.dir = 'right';
			else if(angle>45 && angle<135) this.dir = 'down';
			else if(angle<-45 && angle>-135) this.dir = 'up';
			else this.dir = 'left';
			for(var i = 1; i < length; i++){
				switch(this.dir) {
				case 'right':
					if(e.listX[i] < e.listX[i-1]) this.dir = 'undefined';break;
				case 'left':
					if(e.listX[i] > e.listX[i-1]) this.dir = 'undefined';break;
				case 'up':
					if(e.listY[i] > e.listY[i-1]) this.dir = 'undefined';break;
				case 'down':
					if(e.listY[i] < e.listY[i-1]) this.dir = 'undefined';break;
				}
			}
		}
		// Move
		else if(this.dir!='undefined' && length > 5) {
			switch(this.dir) {
			case 'right':case 'left':
				this.container.setPos(e.offsetX-e.listX[0], 0);break;
			case 'up':case 'down':
				this.container.setPos(0, e.offsetY-e.listY[0]);break;
			}
		}
	};
	
	// Switch by move event of container Version realtime
	this.evtDistributor.addListener('gestureStart', new mse.Callback(this.gestStartHandler, this));
	this.evtDistributor.addListener('gestureUpdate', new mse.Callback(this.gestUpdateHandler, this));
	this.evtDistributor.addListener('gestureEnd', new mse.Callback(this.gestEndHandler, this));
	
	this.transOver = function() {
		this.transOrigin = null;
	};
	
	this.draw = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		if(this.container) {
			if(this.container.bg != this.precBg) {
				this.transOrigin = this.precBg;
				mse.transition(this.precBg,this.container.bg,20,
							   new mse.Callback(this.transOver,this));
			}
			if(this.container.bg) this.container.bg.draw(this.ctx);
			if(this.transOrigin) this.transOrigin.draw(this.ctx);
			// Draw neighbor
			var x = this.container.getX();
			var y = this.container.getY();
			if(x<-20 && this.container.right) {
				this.container.right.setX(x+20+this.container.getWidth());
				this.container.right.draw(this.ctx);
			}
			else if(x>20 && this.container.left){
				this.container.left.setX(x-20-this.container.left.getWidth());
				this.container.left.draw(this.ctx);
			}
			else if(y<-20 && this.container.down) {
				this.container.down.setY(y+20+this.container.getHeight());
				this.container.down.draw(this.ctx);
			}
			else if(y>20 && this.container.up) {
				this.container.up.setY(y-20-this.container.up.getHeight());
				this.container.up.draw(this.ctx);
			}
			this.container.draw(this.ctx);
			this.precBg = this.container.bg;
		}
	};
};


// Root object for card system on desktop, a canvas Dom element
mse.CardRoot = function(id, width, height) {
	// Super constructor
	mse.Root.call(this, id, width, height);
	this.anime = false;
	this.precBg = null;
	
	this.setAnime = function(a){this.anime = a;};
	this.clickHandler = function(e) {
		if(!this.container || this.anime) return;
		var x=e.offsetX, y=e.offsetY, w=this.container.width, h=this.container.height;
		if(this.container.inObj(x, y)) return;
		// Switch Container
		else if(y > this.height/2-0.25*h && y < this.height/2+0.25*h){
			if(this.container.right && x>this.width/2+w/2 && x<this.width/2+w) {
				this.anime = true;
				var menu = this.container.getLayer('menu');
				if(menu) {
					menu.hide();
					menu.parent = this.container.right;
				}
				this.setContainer(this.container.right);
				// Original right card
				var middle = new mse.KeyFrameAnimation(this.container, {
					frame	: [0, tTransition],
					scale	: [0.5, 1],
					pos		: [[this.rightx, this.sidey], [this.middlex, this.middley]],
					opacity	: [0.5, 1]
					}, 1);
				// Original middle card
				var left = new mse.KeyFrameAnimation(this.container.left, {
					frame	: [0, tTransition],
					scale	: [1, 0.5],
					pos		: [[this.middlex, this.middley], [this.leftx, this.sidey]],
					opacity	: [1, 0.5]
					}, 1);
				// Original at the right of the right card
				if(this.container.right) {
					this.container.right.setPos(this.rightx, this.sidey);
					this.container.right.scale = 0.5;
					var right = new mse.KeyFrameAnimation(this.container.right, {
							frame	: [0, tTransition],
							opacity	: [0, 0.5]
						}, 1);
					right.start();
				}
				left.evtDeleg.addListener('end', new mse.Callback(this.setAnime, this, false), false);
				middle.start();
				left.start();
			}
			else if(this.container.left && x<this.width/2-w/2 && x>this.width/2-w) {
				this.anime = true;
				var menu = this.container.getLayer('menu');
				if(menu) {
					menu.hide();
					menu.parent = this.container.left;
				}
				this.setContainer(this.container.left);
				// Original middle card, move to right
				var right = new mse.KeyFrameAnimation(this.container.right, {
					frame	: [0, tTransition],
					scale	: [1, 0.5],
					pos		: [[this.middlex, this.middley], [this.rightx, this.sidey]],
					opacity	: [1, 0.5]
					}, 1);
				// Original left card, move to middle
				var middle = new mse.KeyFrameAnimation(this.container, {
					frame	: [0, tTransition],
					scale	: [0.5, 1],
					pos		: [[this.leftx, this.sidey], [this.middlex, this.middley]],
					opacity	: [0.5, 1]
					}, 1);
				if(this.container.left) {
					this.container.left.setPos(this.leftx, this.sidey);
					this.container.left.scale = 0.5;
					var left = new mse.KeyFrameAnimation(this.container.left, {
							frame	: [0, tTransition],
							opacity	: [0, 0.5]
						}, 1);
					left.start();
				}
				right.evtDeleg.addListener('end', new mse.Callback(this.setAnime, this, false), false);
				middle.start();
				right.start();
			}
		}
	};
	
	this.evtDistributor.addListener('click', new mse.Callback(this.clickHandler, this));

	this.initContainer = function(container) {
		this.pleftx = this.leftx; this.pmiddlex = this.middlex; this.prightx = this.rightx; this.pmiddley = this.middley; this.psidey = this.sidey;
		this.leftx = this.width-1.8*container.width;
		this.middlex = (this.width-container.width)/2;
		this.rightx = this.width+0.8*container.width;
		this.middley = (this.height-container.height)/2;
		this.sidey = this.height-0.5*container.height;
		
		container.setPos(this.middlex, this.middley);
		container.scale = 1;
		container.globalAlpha = 1;
		if(container.right) {
			container.right.setPos(this.rightx, this.sidey);
			container.right.scale = 0.5;
			container.right.globalAlpha = 0.5;
		}
		if(container.left){
			container.left.setPos(this.leftx, this.sidey);
			container.left.scale = 0.5;
			container.left.globalAlpha = 0.5;
		}
	};
	this.poseCard = function(card) {
		if(this.dest) return;
		mse.slidein(card, 20, 
			[[this.width,this.middley],[this.middlex,this.middley]],
			new mse.Callback(this.setContainer, this, card));
		mse.fadeout(this.container, 20);
		if(this.container.left) mse.fade(this.container.left, 20, 0.5, 0);
		if(this.container.right) mse.fade(this.container.right, 20, 0.5, 0);
		this.dest = card;
	};
	this.revealCard = function(card) {
		if(this.dest) return;
		mse.slideout(this.container, 20, 
			[[this.middlex,this.middley],[-this.container.width,this.middley]],
			new mse.Callback(this.setContainer, this, card));
		mse.fadein(card, 20);
		if(card.left) mse.fade(card.left, 20, 0, 0.5);
		if(card.right) mse.fade(card.right, 20, 0, 0.5);
		this.dest = card;
	};
	this.dropdown = function() {
		if(this.dest || !this.container.up) return;
		this.initContainer(this.container.up);
		mse.slidein(this.container.up, 20,
			[[this.middlex,-this.container.height],[this.middlex,this.middley]],
			new mse.Callback(this.setContainer, this, this.container.up));
		mse.slideout(this.container, 20,
			[[this.pmiddlex,this.pmiddley],[this.pmiddlex,this.height]]);
		if(this.container.left) mse.slideout(this.container.left, 20,
			[[this.pleftx,this.psidey],[this.pleftx,this.height]]);
		if(this.container.right) mse.slideout(this.container.right, 20,
			[[this.prightx,this.psidey],[this.prightx,this.height]]);
		this.dest = this.container.up;
	};
	this.pullup = function() {
		if(this.dest || !this.container.down) return;
		this.initContainer(this.container.down);
		mse.slidein(this.container.down, 20,
			[[this.middlex,this.height],[this.middlex,this.middley]],
			new mse.Callback(this.setContainer, this, this.container.down));
		mse.slideout(this.container, 20,
			[[this.pmiddlex,this.pmiddley],[this.pmiddlex,-this.container.height]]);
		if(this.container.left) mse.slideout(this.container.left, 20,
			[[this.pleftx,this.psidey],[this.pleftx,-this.container.height]]);
		if(this.container.right) mse.slideout(this.container.right, 20,
			[[this.prightx,this.psidey],[this.prightx,-this.container.height]]);
		this.dest = this.container.down;
	};
	this.transOver = function() {
		this.transOrigin = null;
	};
	
	this.draw = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		if(this.container) {
			if(this.container.bg != this.precBg) {
				this.transOrigin = this.precBg;
				mse.transition(this.precBg,this.container.bg,20,
							   new mse.Callback(this.transOver,this));
			}
			if(this.container.bg) this.container.bg.draw(this.ctx);
			if(this.transOrigin) this.transOrigin.draw(this.ctx);
			this.ctx.save();
			// Draw neighbor
			if(this.container.right) this.container.right.draw(this.ctx);
			if(this.container.left) this.container.left.draw(this.ctx);
			
			this.container.draw(this.ctx);
			if(this.dest) {
				// Draw neighbor
				if(this.dest.right) this.dest.right.draw(this.ctx);
				if(this.dest.left) this.dest.left.draw(this.ctx);
				this.dest.draw(this.ctx);
			}
			this.ctx.restore();
			this.precBg = this.container.bg;
		}
	};
};



mse.CardContainer = function(root, param, orientation) {
	// Super constructor
	mse.BaseContainer.call(this, root, param, orientation);
	
	// Add Card back mask
	this.addLayer('back', new mse.Mask(this, {pos:[15,15], size:[this.width-30,this.height-30], cornerRatio:5, fillStyle:'rgba(48,48,48,0.85)'}, 1));
	
	this.up = null;
	this.down = null;
	this.right = null;
	this.left = null;
	this.front = null;
	this.end = null;
	
	this.firstShow = false;
	
	this.logic = function(delta) {
		if(!this.firstShow) {
			this.firstShow = true;
			this.evtDeleg.eventNotif('show', null);
			for(var i in this._layers) 
				this._layers[i].evtDeleg.eventNotif('show');
		}
		
		if(MseConfig.mobile) {
			if(this.normal && MseConfig.orientation!=this.orientation)
				this.orientChange(MseConfig.orientation);
			else if(!this.normal && MseConfig.orientation==this.orientation)
				this.orientChange(MseConfig.orientation);
		}
		if(this.normal) {
			if(this.deleg) this.deleg.logic(delta);
			else {
				for(var i in this._layers) {
					this._layers[i].logic(delta);
				}
			}
		}
	};
};
mse.CardContainer.prototype = new mse.UIObject();
mse.CardContainer.prototype.constructor = mse.CardContainer;
mse.CardContainer.prototype.toString = function() {
	return "[object CardContainer]";
};


mse.createLink = function(relation, begin, end) {
	if( !(begin instanceof mse.CardContainer) || !(end instanceof mse.CardContainer) )
		return;
	switch(relation) {
	case 'leftright':
		begin.right = end;
		end.left = begin;
		break;
	case 'updown':
		begin.down = end;
		end.up = begin;
		break;
	case 'down': begin.down = end;break;
	case 'up': begin.up = end;break;
	/*
	case 'frontback':
		begin.back = end;
		end.front = begin;
		begin.evtDeleg.addListener('dblClick', begin.switchTo, begin);
		break;
		*/
	}
};



mse.ArticleContent = function(content, param, links) {
	if(!param.font) {mseLog('Parameter Error', 'No font defined!');return null;}
	//this.phraseIndexs = [];
	this.list = [];
	
	// Links index
	var curr = 0;
	
	var ctx = mse.root.ctx;
	ctx.font = param.font;
	var maxM = Math.floor( param.size[0]/ctx.measureText('A').width );
	var arr = content.split('\n');
	for(var i = 0; i < arr.length; i++) {
		//this.phraseIndexs[i] = this.list.length;
		var begin = this.list.length;
		for(var j = 0; j < arr[i].length;) {
			// Find the index of next line
			var next = checkNextLine(ctx, arr[i].substr(j), maxM, param.size[0]);
			this.list.push( new mse.Text( null, {size:[param.size[0], param.lineHeight]}, arr[i].substr(j, next) ) );
			j += next;
		}
		// Find the link
		while(curr < links.length && links[curr].index == i) {
			if(links[curr].src) {
				for(j = begin; j < this.list.length; j++) {
					var offset = this.list[j].text.indexOf(links[curr].src);
					if( offset >= 0 ) {
						links[curr].index = j;
						links[curr].offset = offset;
						this.list[j].link = links[curr];
						break;
					}
				}
			}
			else links[curr].index = this.list.length-1;
	
			curr++;
		}
		this.list.push( new mse.UIObject(null, {size:[this.width, param.lineHeight*0.6]}) );
	}
	links.splice(curr, links.length-curr);
};



mse.CardUILayer = function(container, z, param) {
	param.pos = [0,0], param.size = [container.width, container.height];
	mse.Layer.call(this, container, z, param);
	
	var border = new mse.UIObject(this, param);
	border.draw = function(ctx) {
		var x = this.getX(), y = this.getY(), w = this.width, h = this.height;
		ctx.strokeStyle = '#ececec';
		ctx.lineWidth = 5;
		ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; 
		ctx.shadowBlur = 10; ctx.shadowColor = '#000000';
		ctx.strokeRoundRect(x+12.5,y+12.5, w-25,h-25, 10);
	};
	this.addObject(border);
	
	// Button wiki
	if(param.wiki) {
		this.getWiki = function(){
			mse.root.dropdown();
		};
		var w = new mse.Image(this, param.wiki, 'wikiBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback(this.getWiki, this), 
				true, w);
		this.addObject(w);
	}
	// Button book
	if(param.book) {
		this.getBookDown = function() {mse.root.pullup();};
		this.getBookUp = function() {mse.root.dropdown();};
		var b = new mse.Image(this, param.book, 'bookBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback((param.up?this.getBookUp:this.getBookDown), this), 
				true, b);
		this.addObject(b);
	}
	// Button illustration
	if(param.illu) {
		this.getIllu = function(){
			mse.root.pullup();
		};
		var i = new mse.Image(this,param.illu,'illuBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback(this.getIllu, this), 
				true, i);
		this.addObject(i);
	}
};
mse.CardUILayer.prototype = new mse.Layer();
mse.CardUILayer.prototype.constructor = mse.CardUILayer;
mse.CardUILayer.prototype.toString = function() {
	return "[object mse.CardUILayer]";
};



mse.TextLayer = function(container, z, param, content, begin, end) {
	mse.Layer.call(this, container, z, param);
	
	this.content = content; this.begin = begin; this.end = end;
	
	this.draw = function(ctx){
		this.configCtx(ctx);
		
		var x = this.getX();
		var y = this.getY();
		for(var i = this.begin; i < this.end; i++) {
			this.content.list[i].draw(ctx, x, y);
			y += this.content.list[i].height;
		}
	};
};
mse.TextLayer.prototype = new mse.Layer();
mse.TextLayer.prototype.constructor = mse.TextLayer;



mse.CardGraph = function(root, cardParam, txtParam, content, links) {
	if(!txtParam.lineHeight) txtParam.lineHeight = Math.round(1.4*checkFontSize(txtParam.font));
	// Init
	var width = cardParam.size[0], height = cardParam.size[1];
	txtParam.pos = [25,55]; txtParam.size = [width-50,height-80];
	var maxW = width*1.5, maxH = height*1.1;
	this.textCards = new Array();
	this.gameCards = new Array();
	this.illuCards = new Array();
	this.wikiCards = new Array();
	var illuBnParam = {pos:[width-55,height-45],size:[40,30]};
	var bookUpParam = {pos:[15,15],size:[40,30]};
	var wikiBnParam = {pos:[width-55,15],size:[40,30]};
	this.currbg = null;
	
	// List of line of text
	this.content = new mse.ArticleContent(content, txtParam, links);
	// Number of lines in one card
	var lines = Math.floor(0.9 * height / txtParam.lineHeight);
	// Create card graph of article pages
	var nbline = this.content.list.length;
	var prev = null; var begin = 0;
	// Links index
	var l = 0;
	while(begin < nbline) {
		// Create Cards
		var curr = new mse.CardContainer(null, cardParam, 'portrait');
		if(begin == 0) this.entry = curr;
		
		var end = (begin+lines>nbline) ? nbline-1 : begin+lines;
		for(var i = end; i > begin; i--) {
			if(!this.content.list[i].text) {
				end = i+1; break;
			}
		}
		
		// Solve Links
		var wiki = false, illu = false, game = false;
		var lastWiki = null, lastIllu = null;
		while(l < links.length && end > links[l].index) {
			var lk = links[l].link;
			switch(links[l].type) {
			case 'fb':
				break;
			case 'wiki':
				if(!lk) break;
				lk.bg = this.currbg;
				// Link wiki card
				if(!wiki) mse.createLink('updown', lk, curr);   // Link to up
				else {
					mse.createLink('leftright', lastWiki, lk);	// Link to right
					mse.createLink('down', lk, curr);			// Link down to book
				}
				lastWiki = lk;
				wiki = true;
				this.wikiCards.push(lk);break;
			case 'illu':
				// Create illu card
				var imgw = links[l].width, imgh = links[l].height;
				// Find the right scale
				if(maxW*imgh/imgw > maxH) var scale = maxH/imgh;
				else var scale = maxW/imgw;
				// Container
				var c = new mse.CardContainer(null, {size:[scale*imgw+30, scale*imgh+30]}, 'portrait');
				// UI Layer
				c.addLayer('ui', new mse.CardUILayer(c, 5, {book:bookUpParam,up:true}));
				// Image Layer
				var img = new mse.Image(c, {pos:[15,15],size:[scale*imgw, scale*imgh]}, lk);
				img.zid = 2;
				c.addLayer('illu', img);
				links[l].link = lk = c;
				// Back
				lk.bg = this.currbg;
				// Link illu card
				if(!illu) mse.createLink('updown', curr, lk);   // Link to bottom
				else {
					mse.createLink('leftright', lastIllu, lk);	// Link to right
					mse.createLink('up', lk, curr);			// Link down to book
				}
				lastIllu = lk;
				illu = true;
				this.illuCards.push(lk);break;
			case 'game':
				// Break the text
				end = links[l].index+1;
				game = true;
				// Card
				var gameCard = new mse.CardContainer(null, cardParam, 'portrait');
				// UI Layer
				gameCard.addLayer('ui', new mse.CardUILayer(gameCard, 5, {}));
				// Game Layer
				gameCard.addLayer('game', lk);
				lk.parent = gameCard;
				// Back
				gameCard.bg = this.currbg;
				// Insert Card
				mse.createLink('leftright', curr, gameCard);
				this.gameCards.push(gameCard);break;
			case 'anime':
				// Add anime layer to top of current container
				curr.addLayer('anime', lk);
				lk.parent = curr;
				break;
			case 'audio':
				// Link the audio button click listener to container
				curr.evtDeleg.addListener('click', new mse.Callback(lk.play, lk), true, this.content.list[links[l].index]);
				break;
			case 'background':
				this.currbg = lk;
				break;
			}
			l++;
		}
		// Add UI layer
		curr.addLayer('ui', new mse.CardUILayer(curr, 5, {'wiki':(wiki?wikiBnParam:null),'illu':(illu?illuBnParam:null)}));
		// Add text layer
		curr.addLayer('txt', new mse.TextLayer(curr, 2, txtParam, this.content, begin, end));
		// Set background
		curr.bg = this.currbg;
		
		if(prev) mse.createLink('leftright', prev, curr);
		this.textCards.push(curr);
		if(game) prev = gameCard;
		else prev = curr;
		begin = end;
	}
	
	// Page A suivre
	var suivre = new mse.CardContainer(null, cardParam, 'portrait');
	// UI Layer
	suivre.addLayer('ui', new mse.CardUILayer(suivre, 5, {}));
	// Text
	var txtLayer = new mse.Layer(suivre, 2, {pos:[0,0],size:cardParam.size});
	txtLayer.addObject(new mse.Text(txtLayer, {pos:[cardS[0]/2, cardS[1]/2],textBaseline:'middle',textAlign:'center',font:'italic 28px '+cfs.font,fillStyle:'#FFF'}, 'À Suivre...', true));
	suivre.addLayer('1', txtLayer);
	suivre.bg = curr.bg;
	mse.createLink('leftright', curr, suivre);
	
	this.enter = function() {
		mse.root.initContainer(this.entry);
		mse.root.setContainer(this.entry);
	};
	this.insertToLeft = function(nouveau, exist) {
		if(exist == this.entry)
			this.entry = nouveau;
		else if(exist.left)
			mse.createLink('leftright', exist.left, nouveau);
		mse.createLink('leftright', nouveau, exist);
	};
	
	this.search = function(nb) {
		if(nb < 0) return null;
		for(var i = 0; i < this.textCards.length; i++) {
			if(this.textCards[i].getLayer('txt').begin > nb)
				return i-1;
		}
		return null;
	};
	// Set the back of the text cards between begin and end(end exclus)
	this.setBackground = function(back, begin, end) {
		if(begin < 0) return;
		if(!end || end < begin || end > this.textCards.length) 
			end = this.textCards.length;
		var card, tmp;
		for(var i = begin; i < end; i++) {
			card = this.textCards[i];
			card.bg = back;
			tmp = card.up;
			if(tmp) {
				tmp.bg = back;
				while(tmp = tmp.right) tmp.bg = back;
			}
			tmp = card.down;
			if(tmp) {
				tmp.bg = back;
				while(tmp = tmp.right) tmp.bg = back;
			}
		}
		for(i = 0; i < this.gameCards.length; i++)
			if(tmp = this.gameCards[i].left) this.gameCards[i].bg = tmp.bg;
	};
};



})(mse);






// System of script
(function (mse) {


	mse.Script = function() {
		this.script = null;
		this.states = {};
		this.expects = {};
		this.success = {};
		
		this.invoke = function() {
//			if(this.delay) setTimeout(this.delay, );
			if(typeof(this.script) == 'function') this.script.call(this);
			else if(this.script instanceof mse.Callback) this.script.invoke();
		};
		this.checkConditions = function() {
			for(var i in this.success)
				if(!this.success[i]) return;
				
			this.invoke();
		};
		this.conditionChanged = function(id, state) {
			if(this.expects[id] == "everytime" || (this.expects[id]== "once" && this.states[id] != "triggered")) {
				this.success[id] = true;
				this.checkConditions();
			}
			this.states[id] = (typeof(state)=="string" ? state : "triggered");
		};
	};
	mse.Script.register	= function(cds, script, delay) {
		var sc = new mse.Script();
		// Initialize script
		for(var i in cds) {
			var id = "c"+i;
			sc.states[id] = cds[i].initial;
			sc.expects[id] = cds[i].expect;
			sc.success[id] = false;
			sc.delay = (delay ? delay : 0);
			cds[i].src.evtDeleg.addListener(cds[i].type, new mse.Callback(sc.conditionChanged, sc, [id]), false);
		}
		sc.script = script;
	}


})(mse);