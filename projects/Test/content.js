/*!
 * Mse Canvas JavaScript Library v0.85
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
	waitinglist : {},
	audExtCheck : /(.ogg|.mp3)/,
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
		case 'img' : case 'image':
			this.list[name] = new Image();
			this.list[name].src = cfs.srcPath + file;
			this.list[name].lid = 0; // Loading current index
			break;
		case 'aud' : case 'audio':
			this.list[name] = document.createElement('audio');
			if(file.search(this.audExtCheck) == -1) {
			    switch(MseConfig.browser) {
			    case 'Chrome': case 'Firefox': case 'Opera':
				    this.list[name].src = cfs.srcPath+file+'.ogg';break;
			    case 'Safari': case 'Explorer':
				    this.list[name].src = cfs.srcPath+file+'.mp3';break;
			    }
			}
			else this.list[name].src = cfs.srcPath+file;
			this.list[name].load();
			break;
		default: return;
		}
		this.list[name].type = type;
		if(pre && type != 'aud' && type != 'audio') this.preload.push(this.list[name]);
	},
	getSrc		: function(name) {
		var res = this.list[name];
		if(!res) return null;
		switch(res.type) {
		case 'img': case 'image':
			if(!res || res.complete) return res;
			else {
				if(res.lid == 12) res.lid = 0;
				return this.loading[(res.lid++)];
			}
		case 'aud': case 'audio':
			return res;
		}
	},
	waitSrc     : function(name, callback) {
	    if(!this.list[name]) return;
	    if(this.list[name].complete) {
	        callback.invoke();
	        return;
	    }
	    if(!this.waitinglist[name]) this.waitinglist[name] = new Array();
	    var wlist = this.waitinglist[name];
	    wlist.push(callback);
	    this.list[name].onload = function() {
	        for(var cb in wlist) wlist[cb].invoke();
	    };
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

function changeCoords() {
    var ratio = MseConfig.pageHeight / coords['cid1'];
    for(var i in coords) {
        coords[i] = parseFloat(new Number(ratio * coords[i]).toFixed(2));
    }
    if(window.autoFitCallback) window.autoFitCallback();
    window.autoFitCallback = null;
}

mse.autoFitToWindow = function(f) {
    if(f) window.autoFitCallback = f;
    if(coords && coords['cid1']) {
        if(MseConfig.pageHeight > 250) changeCoords();
        else setTimeout(mse.autoFitToWindow, 1000);
    }
}

mse.init = function(configs) {
	$.extend(cfs, configs);

    mse.src.init();
	mse.src.addSource('imgNotif', '../images/turn_comp.png', 'img');
	mse.src.addSource('fbBar', '../images/barre/fb.png', 'img');
	mse.src.addSource('wikiBar', '../images/barre/wiki.png', 'img');
	mse.src.addSource('wikiBn', '../images/button/wiki.png', 'img');
	mse.src.addSource('bookBn', '../images/button/book.png', 'img');
	mse.src.addSource('illuBn', '../images/button/illu.png', 'img');
	mse.src.addSource('audBn', '../images/button/audIcon.png', 'img');
	mse.src.addSource('accelerBn', '../images/button/accelere.png', 'img', true);
	mse.src.addSource('upBn', '../images/button/monter.png', 'img', true);
	mse.src.addSource('ralentiBn', '../images/button/ralenti.png', 'img', true);
	mse.src.addSource('downBn', '../images/button/descend.png', 'img', true);
	mse.src.addSource('playBn', '../images/button/play.png', 'img', true);
	mse.src.addSource('pauseBn', '../images/button/pause.png', 'img', true);
	mse.src.addSource('ratImg', '../images/rat.png', 'img');
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
    var layer = obj1.parent;
    if(layer instanceof mse.Layer) {
        layer.insertBefore(obj2, obj1);
    }
	mse.fadein(obj2, t, callback);
	mse.fadeout(obj1, t, new mse.Callback(layer.delObject, layer, obj1));
};
mse.setCursor = function(cursor) {
    if(cursor.indexOf(".") != -1) 
        mse.root.jqObj.css('cursor', 'url("'+cursor+'"), auto');
	else mse.root.jqObj.get(0).style.cursor = cursor;
};

mse.changePage = function(tar, quitonclick) {
	if(quitonclick)
	    tar.evtDeleg.addListener(
			'click', 
			new mse.Callback(mse.root.transition, mse.root, mse.root.container), 
			true);
	mse.root.transition(tar);
};

mse.createBackLayer = function(img) {
	if(__bgLayers[img]) return __bgLayers[img];
	var bg = new mse.Layer(null, 0, {size:[mse.root.width,mse.root.height]});
	bg.addObject(new mse.Image(bg, {size:[mse.root.width,mse.root.height]}, img));
	__bgLayers[img] = bg;
	return bg;
};


// Event System

mse.Callback = function(func, caller) {
    if(!func) return null; 
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
	    if(typeof evtName != "string" || !callback) return;
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
	    var success = false;
		switch(evtName) {
		case 'move':
			var ls = this.listeners['enter'];
			if(ls) {
				for(var i in ls) {
					if( ls[i].target.inObj(evt.offsetX, evt.offsetY) 
						&& !ls[i].target.inObj(evt.prev[0], evt.prev[1]) ) {
						ls[i].notify(evt);
						success = true;
						break;
					}
				}
			}
		break;
		}
        
		var arr = this.listeners[evtName];
		if(arr) {
			// No dominate listener
			for(var val in arr) {
				if( (!this.domObj || this.domObj==arr[val].target || this.domObj==arr[val].target.parent) 
					&& (!evt || arr[val].inObj(evt.offsetX, evt.offsetY)) ) {
					var prev = arr[val].preventBubbling;
					arr[val].notify(evt);
					success = true;
				}
				if(prev) break;
			}
		}
		return success;
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
    if(parent) {
    	this.parent = parent;
    	this.fixed = false;
    }
    else this.parent = null;
    
    // Event handling
    this.evtDeleg = new mse.EventDelegateSystem();
    
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
};
mse.UIObject.prototype = {
    offx: 0,
    offy: 0,
    width: 0,
    height:0,
    // Position fixed or not to the parent
    fixed: true,
	// Setter of position, the position can be fixed or related to another object
	setPos: function(x, y, relat) {
		if(relat) {
			this.offx = x + (this.fixed ? relat.getX() : relat.offx);
			this.offy = y + (this.fixed ? relat.getY() : relat.offy);
		}
		else {
			this.offx = x;
			this.offy = y;
		}
	},
	setX: function(x, relat) {
		if(relat) this.offx = x + (this.fixed ? relat.getX() : relat.offx);
		else this.offx = x;
	},
	setY: function(y, relat) {
		if(relat) this.offy = y + (this.fixed ? relat.getY() : relat.offy);
		else this.offy = y;
	},
	// Getter of position in Root Canvas object, chaining to the parent if not fixed
	getX: function() {
		if(this.parent) return (this.parent.getX() + this.offx);
		else return this.offx;
	},
	getY: function() {
		if(this.parent) return (this.parent.getY() + this.offy);
		else return this.offy;
	},
	//
	getCanvasX: function(){
	    if(this.parent) return (this.parent.getCanvasX() + this.offx);
	    else {
	        var vx = 0;
	        if(mse.root.viewport) vx = -mse.root.viewport.x;
	        return vx+this.offx;
	    }
	},
	getCanvasY: function(){
	    if(this.parent) return (this.parent.getCanvasY() + this.offy);
	    else {
	        var vy = 0;
	        if(mse.root.viewport) vy = -mse.root.viewport.y;
	        return vy+this.offy;
	    }
	},
	
	// Setter for size
	setSize: function(width, height) {
		this.width = width;
		this.height = height;
	},
	// Getter for size
	getWidth: function() {
		return this.width;
	},
	getHeight: function() {
		return this.height;
	},
	
	// Check if a point located in the bounding box
	inObj: function(x,y) {
		if(this.getAlpha() < 1) return false;
		if(this.insideRec) {
			var ox = this.getCanvasX()+this.insideRec[0], oy = this.getCanvasY()+this.insideRec[1], w = this.insideRec[2], h = this.insideRec[3];
		}
		else var ox = this.getCanvasX(), oy = this.getCanvasY(), w = this.getWidth(), h = this.getHeight();
		
		if(x>ox && x<ox+w && y>oy && y<oy+h) return true;
		else return false;
	},
	
	// Z-index
	getZindex: function() {
		return this.zid ? this.zid : (this.parent ? this.parent.zid : 0);
	},
	
	// Container
	getContainer: function() {
		if(this instanceof mse.BaseContainer || this instanceof mse.CardContainer) return this;
		else if(this.parent) return this.parent.getContainer();
		else return mse.root.container;
	},
	
	setAlpha: function(a) {this.globalAlpha = a;},
	// Alpha composition
	getAlpha: function() {
		if(this.parent) return (this.parent.getAlpha() * this.globalAlpha);
		else return this.globalAlpha;
	},
	// Scale composition
	getScale: function() {
		if(isNaN(this.scale)) {
			if(this.parent) return this.parent.getScale();
			else return 1;
		}
		else {
			if(this.parent) return (this.parent.getScale() * this.scale);
			else return this.scale;
		}
	},
	
	// Mouvement
	move: function(dx, dy) {
		this.offx += dx;
		this.offy += dy;
	},
	
	addListener: function() {
		this.evtDeleg.addListener.apply(this.evtDeleg, arguments);
	},
	removeListener: function() {
		this.evtDeleg.removeListener.apply(this.evtDeleg, arguments);
	},
	
	// Config drawing context
	configCtxFlex: function(ctx) {
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
	},
	configCtx: function(ctx) {
	    ctx.restore();
	    ctx.save();
		this.configCtxFlex(ctx);
		var s = this.getScale();
		if(s != 1) ctx.scale(s, s);
	},
	
	// Abstract methods
	draw: function(ctx) {},
    logic: function(delta) {},
    toString: function() {
    	return "[object MseUIObject]";
    }
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
	this.setCenteredViewport = function(){
	    this.viewport = {};
	    this.viewport.x = (this.width - MseConfig.pageWidth)/2;
	    this.viewport.y = (this.height - MseConfig.pageHeight)/2;
	    this.jqObj.attr({'width':MseConfig.pageWidth, 'height':MseConfig.pageHeight});
	    this.jqObj.css({'left':"0px",'top':"0px"});
	    this.ctx.translate(-this.viewport.x, -this.viewport.y);
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
			mse.fadeout( this.container, 20, new mse.Callback(this.setContainer, this, container) );
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
		
		var block = false;
		for(var i in this.animes) {
			this.animes[i].logic(delta);
			if(this.animes[i].block) block = true;
		}
		if(block) return;
		
		if(this.gamewindow.logic(delta)) return;
		
		if(this.container) this.container.logic(delta);
	};
	
	this.draw = function() {
	    if(MseConfig.mobile)
	        this.ctx.clearRect(0, 0, MseConfig.pageWidth, MseConfig.pageHeight);
		else this.ctx.clearRect(0, 0, this.width, this.height);
		
        if(!(MseConfig.mobile && this.gamewindow.currGame && this.gamewindow.currGame.type == "INDEP")){
		    if(this.container) this.container.draw(this.ctx);
		    if(this.dest) this.dest.draw(this.ctx);
		}
		if(this.gamewindow.currGame) this.gamewindow.draw(this.ctx);
		
		for(var i in this.animes)
			if(this.animes[i].draw(this.ctx))
				// Delete finish animation
				this.animes.splice(i,1);
				
		this.evtDistributor.rootEvt.eventNotif("drawover",this.ctx);
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
	
	mse.root = this;
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
	
	if(MseConfig.mobile) {
	    this.setCenteredViewport();
	    $(window).bind('orientationchange', 
	    	function(e){
	    		mse.root.setCenteredViewport();
	    	});
	}
	
	this.evtDistributor = new mse.EventDistributor(this, this.jqObj);
	
	this.container = null;
	this.end = false;
	this.init = false;
	this.animations = new Array();
	// Animation complete
	this.animes = [];
	// Video element
	var video = $('<div id="video">');
	video.css({'position':'absolute',
	           'width':width*0.8+'px',
	           'height':height*0.8+'px',
	           'left':x+width*0.1+'px',
	           'top':height*0.1+'px'
	           });
	$('body').prepend(video);
	this.video = video.flareVideo($('body'));
	this.video.hide();
	// Game element
	this.gamewindow = new mse.GameShower();
	
	// Stack of containers
	//this.stack = new Array();
	//this.setScale(1.5);
	
	// Launch Timeline
	mse.currTimeline = new mse.Timeline(this, this.interval);
};



// Container object
mse.BaseContainer = function(root, param, orientation) {
	// Super constructor
	mse.UIObject.call(this, null, param);
	
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
extend(mse.BaseContainer, mse.UIObject);
$.extend(mse.BaseContainer.prototype, {
    // Orientation management
    setOrientation: function(orien) {
    	if(!MseConfig.mobile || (orien != 'landscape' && orien != 'portrait')) return;
    	
    	this.orientation = orien;
    },
    orientChange: function(orien) {
    	__currContextOwner__ = mse.root;
    	// Normal state
    	if(orien == this.orientation) this.normal = true;
    	else this.normal = false;
    		
    	mse.root.jqObj.attr({'width':MseConfig.pageWidth, 
    						'height':MseConfig.pageHeight});
    	mse.root.width = MseConfig.pageWidth;
    	mse.root.height = MseConfig.pageHeight;
    },
    // Layer managerment
    addLayer: function(name, layer){
    	if(name != null && layer instanceof mse.UIObject) {
    		layer.name = name;
    		this._layers.push(layer);
    		this.sortLayer();
    	}
    },
    delLayer: function(name) {
    	if(name == null) return;
    	for(var i in this._layers) {
    		if(this._layers[i].name == name) this._layers.splice(i,1);
    	}
    },
    getLayer: function(name) {
    	if(name == null) return;
    	for(var i in this._layers) {
    		if(this._layers[i].name == name) return this._layers[i];
    	}
    },
    sortLayer: function() {
    	this._layers.sort(function(a, b) {
    		if(a.zid < b.zid)
    			return -1;
    		else if(a.zid > b.zid)
    			return 1;
    		else return 0;
    	});
    },
    setLayerActivate: function(name, active) {
    	if(name != null && this._layers[name] != null) {
    		this._layers[name].setActivate(active);
    	}
    },
    desactiveOthers: function(name) {
    	for(var i in this._layers) {
    		if(this._layers[i].active && this._layers[i].name != name) {
    			this._layers[i].setActivate(false);
    			this._changed.push(i);
    		}
    	}
    },
    reactiveOthers: function() {
    	var l = this._changed.length;
    	for(var i = 0; i < l; i++)
    		this._layers[this._changed.pop()].setActivate(true);
    },
    logic: function(delta) {
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
    },
    // Draw
    draw: function(ctx) {
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
    },
    toString: function() {
	    return "[object MseBaseContainer]";
    }
});



// Layer object
mse.Layer = function(container, z, param) {
	// Super constructor
	mse.UIObject.call(this, container, param);
	// Parametres
	this.zid = z;
	
	this.active = true;
	this.objList = new Array();
}
extend(mse.Layer, mse.UIObject);
$.extend(mse.Layer.prototype, {
	// Objects managerment
	getObjectIndex: function(o){
	    // Sauf IE
	    if(this.objList.indexOf)
	    	var id = this.objList.indexOf(o);
	    // IE
	    else {
	    	for(var i in this.objList)
	    		if(this.objList[i] === o) {
	    			var id = i;
	    			break;
	    		}
	    }
	    // Found
	    if(id != null && id != -1) return id;
	    // Not found
	    else return -1;
	},
	addObject: function(obj) {
		if(obj instanceof mse.UIObject) {
			this.objList.push(obj);
			return true;
		}
		else return false;
	},
	insertObject: function(obj, index) {
		if(obj instanceof mse.UIObject && index>=0 && index<this.objList.length) {
			this.objList.splice(index, 0, obj);
			return true;
		}
		else return false;
	},
	insertBefore: function(obj, tar) {
	    var index = this.getObjectIndex(tar);
	    if(index != -1) this.insertObject(obj, index);
	},
	insertAfter: function(obj, tar) {
	    var index = this.getObjectIndex(tar);
	    if(index != -1) {
	        if(index+1 == this.objList.length) this.addObject(obj);
	        else this.insertObject(obj, index+1);
	    }
	},
	delObject: function(o) {
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
	},
	delAll: function() {
		for(var i in this.objList)
			delete this.objList[i];
		this.objList.length = 0;
	},
	getObject: function(i) {
		if(i >= 0 && i < this.objList.length)
			return this.objList[i];
		return null;
	},
	delSelf: function() {
		if(this.parent instanceof mse.BaseContainer || this.parent instanceof mse.CardContainer) this.parent.delLayer(this.name);
	},
	
	// Activate or desactivate the layer
	setActivate: function(active) {
		this.active = active;
	},
	
	// Logic
	logic: function(delta) {
		if(this.active) {
			for(var i = 0; i < this.objList.length; i++) {
				this.objList[i].logic(delta);
			}
		}
	},
	// Draw
	draw: function(ctx) {
		this.configCtx(ctx);
		for(var i = 0; i < this.objList.length; i++) {
			this.objList[i].draw(ctx);
		}
	}
});




// Text obj
mse.Text = function(parent, param, text, styled) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	this.text = text;
	this.styled = styled ? true : false;
	this.linkInit = false;
	this.zid = 12;
	
	//Integraion d'effets
	this.currentEffect = null;
	this.firstShow = false;
	
	this.addLink = function(linkObj){
	    switch(linkObj.type) {
	    case 'audio':
	    	this.evtDeleg.addListener('firstShow', new mse.Callback(linkObj.link.play, linkObj.link));
	    	this.getContainer().evtDeleg.addListener(
	    			'click', 
	    			new mse.Callback(linkObj.link.play, linkObj.link), 
	    			true, 
	    			this);
	    	break;
	    case 'wiki':
	        //linkObj.link.getLayer('content').setQuitTarget(this.getContainer());
	    	this.getContainer().evtDeleg.addListener(
	    			'click', 
	    			new mse.Callback(linkObj.link.init, linkObj.link, this.getContainer()), 
	    			true, 
	    			this);
	    	break;
	    case 'fb':
	        this.getContainer().evtDeleg.addListener(
	        		'click', 
	        		new mse.Callback(window.open, window, linkObj.link,'_newtab'), 
	        		true, 
	        		this);
	        break;
	    }
	    linkObj.offset = this.text.indexOf(linkObj.src);;
	    linkObj.owner = this;
	    this.link = linkObj;
	};
		
	this.startEffect = function (dictEffectAndConfig) {
		this.styled = true;
		this.currentEffect = mse.initTextEffect(dictEffectAndConfig,this);
	};
	this.endEffect = function (){
		this.currentEffect = null;
	};
	
	this.inObj = function(x, y) {
		if(this.link) {
			if(x >= this.getCanvasX()+this.linkOffs && x <= this.getCanvasX()+this.endOffs+20 && y >= this.getCanvasY() && y <= this.getCanvasY()+20) return true;
			else return false;
		}
		else return this.constructor.prototype.inObj.call(this, x, y);
	};

    this.logic = function(delta){
    	if(this.currentEffect != null)this.currentEffect.logic(delta);
    };
	this.draw = function(ctx, x, y) {
	    if(!this.firstShow) {
	    	this.firstShow = true;
	    	this.evtDeleg.eventNotif('firstShow');
	    }
	    
		if(x!=null && y!=null) this.setPos(x, y);
		var loc = [ this.getX(), this.getY() ];
		
		if(this.styled) {ctx.save();this.configCtxFlex(ctx);}
		
		if(this.currentEffect != null) this.currentEffect.draw(ctx);
		else {
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
		}
		
		if(this.styled) ctx.restore();
	};
};
extend(mse.Text, mse.UIObject);
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
		
		this.ctrUI = new mse.UIObject(null, {pos:[this.getX()+50,mse.root.height-45], size:[this.width-100,50]});
		this.ctrUI.accelere = new mse.Image(null, {size:[30,30]}, 'accelerBn');
		this.ctrUI.ralenti = new mse.Image(null, {size:[30,30]}, 'ralentiBn');
		this.ctrUI.up = new mse.Image(null, {size:[30,30]}, 'upBn');
		this.ctrUI.down = new mse.Image(null, {size:[30,30]}, 'downBn');
		this.ctrUI.play = new mse.Image(null, {size:[30,30]}, 'playBn');
		this.ctrUI.pause = new mse.Image(null, {size:[30,30]}, 'pauseBn');
		this.ctrUI.tip = new mse.Text(null, {textBaseline:'middle',textAlign:'center',font:'italic 20px '+cfs.font,fillStyle:'#FFF'}, '', true);
		this.ctrUI.layer = this;
		this.ctrUI.draw = function(ctx) {
			ctx.save();
			ctx.translate(this.offx, this.offy);
			this.accelere.draw(ctx, this.width-30, 0);
			this.up.draw(ctx, this.width-70, 0);
			if(this.layer.pause) this.play.draw(ctx, this.width/2-15, 0);
			else this.pause.draw(ctx, this.width/2-15, 0);
			this.ralenti.draw(ctx, 0, 0);
			this.down.draw(ctx, 40, 0);
			ctx.restore();
			this.tip.draw(ctx);
		};
		
		this.ctrEffect = function(e) {
		    var vx = 0, vy = 0;
		    if(mse.root.viewport) {vx = mse.root.viewport.x;vy = mse.root.viewport.y;}
			var ex = vx+e.offsetX - this.ctrUI.offx;
			var ey = vy+e.offsetY - this.ctrUI.offy;
			if(ey < 0 || ey > 50) return;
			if(ex >= 0 && ex <= 30) {
				// Left button clicked, Reduce the speed
				this.interval += 200;
				this.interval = (this.interval > 2000) ? 2000 : this.interval;
				this.ctrUI.tip.text = 'moins rapide';
			}
			else if(ex >= this.width-130 && ex <= this.width-100) {
				// Right button clicked, augmente the speed
				this.interval -= 200;
				this.interval = (this.interval < 300) ? 300 : this.interval;
				this.ctrUI.tip.text = 'plus rapide';
			}
			else if(ex >= this.ctrUI.width/2-15 && ex <= this.ctrUI.width/2+15) {
			    this.pause = !this.pause;
			    if(this.pause) this.ctrUI.tip.text = 'pause';
			    else this.ctrUI.tip.text = 'reprendre'; 
			}
			else return;
			this.ctrUI.tip.globalAlpha = 1;
			mse.slideout(this.ctrUI.tip, 10, [[e.offsetX+vx, e.offsetY+vy], [e.offsetX+vx, e.offsetY+vy-50]]);
		};
		
		this.upDownStart = function(e) {
		    var vx = 0, vy = 0;
		    if(mse.root.viewport) {vx = mse.root.viewport.x;vy = mse.root.viewport.y;}
		    var ex = vx+e.offsetX - this.ctrUI.offx;
		    var ey = vy+e.offsetY - this.ctrUI.offy;
		    if(ex >= 40 && ex <= 70) {
		        // Down button clicked, scroll up the layer
		        this.scrollEvt.rolled = -10;
		    }
		    else if(ex >= this.width-170 && ex <= this.width-140) {
		        // Up button clicked, scroll down the layer
		        this.scrollEvt.rolled = 10;
		    }
		};
		this.upDownEnd = function(e) {
		    this.scrollEvt.rolled = 0;
		};
		
		var cb = new mse.Callback(this.ctrEffect, this);
		this.getContainer().evtDeleg.addListener('click', cb, true, this.ctrUI);
		// Listener to scroll the layer with up down buttons
		this.getContainer().evtDeleg.addListener('gestureStart', new mse.Callback(this.upDownStart, this), true, this.ctrUI);
		this.getContainer().evtDeleg.addListener('gestureEnd', new mse.Callback(this.upDownEnd, this));
		
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
		this.slider = new mse.Slider(this, {}, 'vertical');
		this.updateListScreen();
		
		// Scroll event
		this.slider.evtDeleg.addListener('rolling', new mse.Callback(function(){
		    //if(this.active && this.dominate instanceof mse.UIObject) return;
		    this.pause = true;
		}, this) );
		this.slider.evtDeleg.addListener('hide', new mse.Callback(function(){
		    var nb = this.complete ? this.objList.length : this.currIndex;
		    if( nb==0 || this.objList[nb-1].getY() < mse.root.height*0.55 ) {
		    	this.pause = false;
		    }
		}, this) );
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
					list[l].index = i;
					this.objList[i].addLink(list[l]);
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
		if(last >= 0)
			obj.setY(this.objList[last].height, this.objList[last]);
		else obj.setY(0);
		this.length += obj.height;
		this.endId = this.objList.length-1;
		return this.constructor.prototype.addObject.call(this, obj);
	};
	this.addGame = function(game) {
	    var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	    expose.setX(this.width*0.1);
	    this.addObject(expose);
	};
	this.insertObject = function(obj, index) {
		var res = this.constructor.prototype.insertObject.call(this, obj, index);
		if(!res) return res;
		
		this.updateIndexs(index, 1);
		
		if(index == 0) {
			obj.setY(0);
			index = 1;
		}
		for(var i = index; i < this.objList.length; i++)
			this.objList[i].setY(this.objList[i-1].height, this.objList[i-1]);
		this.length += obj.height;
		return res;
	};
	this.insertGame = function(game, index) {
	    var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	    expose.setX(this.width*0.1);
	    this.insertObject(expose, index);
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
		if(this.active && this.dominate instanceof mse.UIObject) {
			this.dominate.logic(delta);
			return;
		}
		
		if(this.scrollEvt.rolled) this.slider.scroll(this.scrollEvt);
		
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
								pos		: [[this.offx,this.offy], [this.offx, this.height/2-focusy]]
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
	    this.configCtx(ctx);
		for(var i = this.startId; i <= this.endId; i++) {
			this.objList[i].draw(ctx);
		}
		if(this.ctrUI) this.ctrUI.draw(ctx);
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
	this.lineHeight = param.lineHeight ? param.lineHeight : Math.round( 1.4*(this.font ? checkFontSize(this.font) : 16) );
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
	this.scrollEvt = {}; this.scrollEvt.rolled = 0;
	this.vide = new mse.UIObject();
	// Dominate obj, if exist, logic and draw dominated by this obj
	this.dominate = null;
};
extend(mse.ArticleLayer, mse.Layer);




// Image object
mse.Image = function(parent, param, src) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	this.img = src;
    //Integraion d'effets
	this.currentEffect = null;
	this.firstShow = false;
	mse.src.waitSrc(this.img, new mse.Callback(this.init, this));
};
extend(mse.Image, mse.UIObject);
$.extend(mse.Image.prototype, {
    init: function() {
        if(!this.width){
        	var img = mse.src.getSrc(this.img);
        	this.width = img.width;
        	this.height = img.height;
        }
    },
    startEffect: function (dictEffectAndConfig) {
    	this.currentEffect = mse.initImageEffect(dictEffectAndConfig,this);
    },
    endEffect: function (){
    	this.currentEffect = null;
    },
    logic: function(delta){
		if(!this.firstShow) {
			this.firstShow = true;
			this.evtDeleg.eventNotif('firstShow');
		}

		if(this.currentEffect != null)this.currentEffect.logic(delta);		
	},
    draw: function(ctx, x, y) {
    	var img = mse.src.getSrc(this.img);
    	this.configCtxFlex(ctx);
    	if(isNaN(x) || isNaN(y)) {x = this.getX(); y = this.getY();}
    	
    	if(this.currentEffect != null) this.currentEffect.draw(ctx,x,y);
    	else ctx.drawImage(img, x, y, this.width, this.height);
    },
    toString: function() {
    	return "[object mse.Image]";
    }
});


// Mask object
mse.Mask = function(parent, param, z) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	if(z != null) this.zid = z;
	if(param.cornerRatio) this.cr = param.cornerRatio;
	
	this.draw = function(ctx) {
		this.configCtxFlex(ctx);
		if(!this.cr) ctx.fillRect(this.getX(), this.getY(), this.width, this.height);
		else ctx.fillRoundRect(this.getX(),this.getY(),this.width,this.height,this.cr);
	};
};
mse.Mask.prototype = new mse.UIObject();
mse.Mask.prototype.constructor = mse.Mask;



// Sprite
mse.Sprite = function(parent, param, src, fw0frames, fh, sx, sy, sw, sh) {
	mse.Image.call(this, parent, param, src);
	if(arguments.length == 4) this.frames = fw0frames;
	else {
		// Frame width and height
		this.fw = fw0frames; this.fh = fh;
		// Source region
		if(arguments.length == 9) {
			this.sx = sx; this.sy = sy; this.sw = sw; this.sh = sh;
		}
		else {
			this.sx = 0; this.sy = 0; 
			this.sw = this.img.width; this.sh = this.img.height;
		}
		// Number of column and row in the sprite
		if(fw0frames < this.sw) this.col = Math.floor(this.sw/fw0frames);
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
};
extend(mse.Sprite, mse.Image);
$.extend(mse.Sprite.prototype, {
    init: function(){},
    appendFrames: function(frames){
        if(this.frames) this.frames = this.frames.concat(frames);
    },
    appendFrame: function(frame){
        if(this.frames) this.frames.push(frame);
    },
    draw: function(ctx, ox, oy) {
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
    		ctx.drawImage(img, x, y, fw,fh, ox,oy, this.getWidth(), this.getHeight());
    	}
    }
});



// Game object
mse.Game = function() {
    mse.UIObject.call(this, null, {});
    
    this.offx = 0.2*mse.root.width;
    this.offy = 0.2*mse.root.height;
    this.width = 0.6*mse.root.width;
    this.height = 0.6*mse.root.height;
    this.type = "DEP";
};
extend(mse.Game, mse.UIObject);
$.extend(mse.Game.prototype, {
    state: "DEFAULT",
    msg: {
        "DEFAULT": "C'est un jeu, sans message......"
    },
    getMsg: function() {
        return this.msg[this.state];
    },
    setExpose: function(expo) {
        this.expo = expo;
        this.type = "INDEP";
    },
    addTo: function(layer) {
        this.parent = layer;
        this.setPos(0,0);
        this.setSize(layer.getWidth(), layer.getHeight());
        layer.addObject(this);
    },
    start: function() {
    	mse.root.container.evtDeleg.setDominate(this);
        mse.root.gamewindow.loadandstart(this);
    },
    draw: function(ctx) {},
    end: function() {
        mse.root.gamewindow.end();
        if(this.expo) this.expo.endGame();
    },
    lose: function() {
        mse.root.gamewindow.lose();
    }
});


// GameShower object, window of the games, one object for all the games
mse.GameShower = function() {
	// Super constructor
	mse.UIObject.call(this, null, {});
	
	this.currGame = null;
	this.globalAlpha = 0;
	this.state = "DESACTIVE";
	mse.src.addSource('gameover', '../images/gameover.jpg', 'img', true);
	this.loseimg = new mse.Image(this, {pos:[0,0]}, 'gameover');
	this.losetext = new mse.Text(this, {font:'Bold 36px '+mse.configs.font,fillStyle:'#FFF',textBaseline:'middle',textAlign:'center'},'GAME OVER...',true);
	this.losetext.evtDeleg.addListener('show', new mse.Callback(this.losetext.startEffect, this.losetext, {"typewriter":{speed:2}}));
	this.passBn = new mse.Button(this, {size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue plus', 'aideBar');
	this.firstShow = false;
	
	this.load = function(game) {
	    if(!game || !(game instanceof mse.Game)) return;
	    this.currGame = game;
	    this.firstShow = false;
	    this.state = "LOAD";
	    mse.fadein(this, 15);
	    mse.fadein(this.currGame, 15);
	};
	this.start = function() {
	    if(!this.currGame) return;
	    // Init game shower size and pos
	    this.setPos(this.currGame.offx, this.currGame.offy);
	    this.setSize(this.currGame.width, this.currGame.height);
	    this.loseimg.setSize(this.width-5, this.height-5);
	    this.losetext.setPos(this.width/2, this.height/2);
	    this.passBn.setPos(this.currGame.width-115, this.currGame.height-50);
	    // Init game
	    if(this.currGame.init) this.currGame.init();
	    this.state = "START";
	};
	this.loadandstart = function(game) {
	    this.load(game);
	    this.start();
	};
	this.restart = function(e){
	    mse.root.evtDistributor.removeListener('click', cbrestart);
	    if(this.passBn.inObj(e.offsetX, e.offsetY)) {
	        this.currGame.end();
	    }
	    else {
	        this.state = "START";
	        this.currGame.init();
	    }
	};
	var cbrestart = new mse.Callback(this.restart, this);
	this.lose = function() {
	    this.state = "LOSE";
	    //mse.fadein(this.loseimg, 5);
	    this.losetext.evtDeleg.eventNotif('show');
	    mse.root.evtDistributor.addListener('click', cbrestart, true, this.currGame);
	};
	this.end = function() {
	    mse.fadeout(this.currGame, 25);
	    mse.fadeout(this, 25, this.cbdesact);
	};
	this.desactive = function() {
	    this.state = "DESACTIVE";
	    mse.root.evtDistributor.setDominate(null);
	};
	this.cbdesact = new mse.Callback(this.desactive, this);
	
	this.logic = function(delta) {
	    if(this.state == "LOSE") this.losetext.logic();
	    if(this.state != "START" && this.state != "LOAD") return false;
	    // Mobile orientation fault
	    else if(MseConfig.mobile && MseConfig.orientation != "landscape") return true;
	    else this.currGame.logic(delta);
	    return true;
	};
	this.draw = function(ctx) {
	    if(this.globalAlpha == 0) return;
	    
	    this.configCtx(ctx);
	    
	    // Border
	    if(!MseConfig.mobile){
	        ctx.strokeStyle = 'rgb(188,188,188)';
	        ctx.lineWidth = 5;
	        ctx.strokeRect(this.offx-2.5, this.offy-2.5, this.width, this.height);
	        ctx.lineWidth = 1;
	    }
	    
	    if(this.currGame.type == "INDEP" && MseConfig.mobile && MseConfig.orientation != "landscape") {
	        // Draw orientation change notification page
	        ctx.drawImage(mse.src.getSrc('imgNotif'), (ctx.canvas.width-50)/2, (ctx.canvas.height-80)/2, 50, 80);
	        return;
	    }
	    else if(this.state == "START") {
	        if(!this.firstShow){
	            this.firstShow = true;
	            if(this.currGame.type == "INDEP") {
	                this.evtDeleg.eventNotif("firstShow");
	            }
	            if(MseConfig.mobile){
	                this.currGame.setPos(0,0);
	                this.currGame.setSize(MseConfig.pageWidth, MseConfig.pageHeight);
	            }
	        }
    	    this.currGame.draw(ctx);
    	}
    	else if(this.state == "LOSE") {
    	    //this.loseimg.draw(ctx);
    	    ctx.fillStyle = "#000";
    	    ctx.fillRect(this.getX(),this.getY(),this.width-5,this.height-5);
    	    this.losetext.draw(ctx);
    	    this.passBn.draw(ctx);
    	}
	};
};
mse.GameShower.prototype = new mse.UIObject();
mse.GameShower.prototype.constructor = mse.GameShower;


// GameExpose is the small object integrate in the articles, it can be clicked for load the game in GameShower and start it
mse.GameExpose = function(parent, param, game) {
    // Super constructor
    mse.UIObject.call(this, parent, param);
    
    this.firstShow = false;
    this.game = game;
    this.game.setExpose(this);
    this.msg = "";
    this.msginlines = new Array();
    if(!this.font) this.font = "12px Verdana";
    this.lineHeight = Math.round( 1.2*checkFontSize(this.font) );
    this.evtDeleg.addListener('firstShow', new mse.Callback(parent.interrupt, parent));
    this.passBn = new mse.Button(this, {pos:[this.width-115,this.height-60],size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue pas', 'aideBar');
    
    this.launchGame = function(e) {
        this.getContainer().evtDeleg.removeListener('click', this.launchcb);
        if(this.passBn.inObj(e.offsetX, e.offsetY)) this.endGame();
        else this.game.start();
    };
    this.launchcb = new mse.Callback(this.launchGame, this);
    
    this.endGame = function() {
        if(parent.play) parent.play();
    };
    
    this.logic = function() {
        if(!this.firstShow) {
            this.firstShow = true;
            this.evtDeleg.eventNotif('firstShow');
            this.getContainer().evtDeleg.addListener('click',  this.launchcb, true);
        }
        // Message changed
        if(this.msg != this.game.getMsg()) {
            this.msg = this.game.getMsg();
            this.msginlines.splice(0,this.msginlines.length);
            this.bullWidth = this.width; this.bullHeight = 0;
            
            if(!this.msg || this.msg == '') {this.bullHeight = 0; return;}
            var ctx = mse.root.ctx;
            ctx.save();
            ctx.font = this.font;
            var maxM = Math.floor( (this.bullWidth-20)/ctx.measureText('A').width );
            
            for(var j = 0; j < this.msg.length;) {
            	// Find the index of next line
            	var next = checkNextLine(ctx, this.msg.substr(j), maxM, this.bullWidth-20);
            	this.msginlines.push( this.msg.substr(j, next) );
            	j += next;
            }
            ctx.restore();
        }
    };
    
    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.getX(), this.getY()+15);
        
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.width, this.height-30);
        // Border
        ctx.strokeStyle = 'rgb(188,188,188)';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, -2.5, this.width, this.height-30);
        ctx.lineWidth = 1;
        
        // Msg
        ctx.font = this.font;
        ctx.textBaseline = "top";
        ctx.fillStyle = "#FFF";
        var top = (this.height-30 - this.msginlines.length * this.lineHeight)/2;
        for(var i = 0; i < this.msginlines.length; i++) {
            ctx.fillText(this.msginlines[i], 10, top+i*this.lineHeight);
        }
        
        ctx.restore();
        ctx.save();
        this.passBn.draw(ctx);
        ctx.restore();
    };
};
mse.GameExpose.prototype = new mse.UIObject();
mse.GameExpose.prototype.constructor = mse.GameExpose;



// Slider
mse.Slider = function(target, param, orientation, offset, parent) {
    if(!parent) parent = target.parent ? target.parent : mse.root.container;
	// Super constructor
	mse.UIObject.call(this, parent, param);
	if(parent.addLayer) parent.addLayer('slider', this);
	else if(parent.addObject) parent.addObject(this);
	
	this.fillStyle = 'rgba(145,152,159, 0.7)';
	this.tar = target;
	if(!offset) offset = 0;
	this.enScroll = false;
	this.scrollT = 0;
	this.globalAlpha = 0;
	
	if(orientation=='horizontal') {
		this.orientation = 'horizontal';
		this.setPos(this.tar.getX(), this.tar.getY()+this.tar.getHeight()+offset);
		this.setSize(this.tar.getWidth(), 10);
		// Location of cursor
		this.loc = 0;
		this.length = this.width;
	}
	else {
		this.orientation = 'vertical';
		this.setPos(this.tar.getX()+this.tar.getWidth()+offset, this.tar.getY());
		this.setSize(10, this.tar.getHeight());
		this.loc = 0;
		this.length = this.height;
	}
	
	this.cbScroll = new mse.Callback(this.scroll, this);
	this.cbGest = new mse.Callback(this.gestUpdate, this);
	this.getContainer().evtDeleg.addListener('gestureUpdate', this.cbGest, false, this.tar);
	if(!MseConfig.mobile)
		this.getContainer().evtDeleg.addListener('mousewheel', this.cbScroll, false, this.tar);
};
extend(mse.Slider, mse.UIObject);
$.extend(mse.Slider.prototype, {
    show: function() {
        mse.fadein(this, 4);
        this.enScroll = true;
        this.evtDeleg.eventNotif("show");
    },
    hide: function() {
        if(this.globalAlpha == 1) mse.fadeout(this, 4);
        this.enScroll = false;
        this.evtDeleg.eventNotif("hide");
    },
    scroll: function(e) {
        if(this.globalAlpha == 0) this.show();
        this.scrollT = 0;
        if(this.orientation == 'vertical') {
            this.tar.offy += e.rolled;
            // Adjustement
            if(this.tar.offy > 100 || this.tar.offy+this.tar.getHeight() < this.tar.parent.getHeight()/2)
                this.tar.offy -= e.rolled;
        }
        else {
            this.tar.offx += e.rolled;
            // Adjustement
            if(this.tar.offx > 100 || this.tar.offx+this.tar.getWidth() < this.tar.parent.getWidth()/2)
                this.tar.offx -= e.rolled;
        }
        this.evtDeleg.eventNotif("rolling", e.rolled);
    },
    gestUpdate: function(e) {
    	if(e.listX.length > 4) {
    		e.rolled = e.listY[e.listY.length-1] - e.listY[e.listY.length-2];
    		this.scroll(e);
    	}
    },
    logic: function(delta) {
        // Scroll timeout
        if(this.enScroll) {
        	this.scrollT += delta;
        	if(this.scrollT > 600) {
        	    this.hide();
        	    return;
        	}
        	
        	if(this.orientation == 'vertical') {
        	    var ph = this.tar.parent.getHeight();
        	    var height = this.tar.getHeight();
        	    var offset = -this.tar.offy;
        	}
        	else {
        	    var ph = this.tar.parent.getWidth();
        	    var height = this.tar.getWidth();
        	    var offset = -this.tar.offx;
        	}
        	this.length = ph*ph/height;
        	this.loc = ph*offset/height;
        	if(this.loc + this.length > ph-30) this.length = ph-this.loc-30;
        	else if(this.loc < 0) {
        	    this.length = this.length+this.loc;
        	    this.loc = 0;
        	}
        }
    },
    draw: function(ctx) {
        if(this.globalAlpha == 0) return;
        ctx.save();
        this.configCtxFlex(ctx);
        ctx.translate(this.getX(), this.getY());
        ctx.beginPath();
        if(this.orientation == 'vertical') {
        	var r = this.width/2;
        	// Top semi elipse
        	ctx.arc(r,this.loc+r,r,0,Math.PI,true);
        	// Body left
        	ctx.lineTo(0, this.loc+this.length-r);
        	// Bottom semi elipse
        	ctx.arc(r,this.loc+this.length-r,r,Math.PI,2*Math.PI,true);
        	// Body right
        	ctx.lineTo(this.width, this.loc+r);
        }
        else {
        	var r = this.height/2;
        	// Left semi elipse
        	ctx.arc(this.loc+r,r,r,1.5*Math.PI,0.5*Math.PI,false);
        	// Body top
        	ctx.lineTo(this.loc+l-r, 0);
        	// Right semi elipse
        	ctx.arc(this.loc+l-r,r,r,0.5*Math.PI,1.5*Math.PI,false);
        	// Body bottom
        	ctx.lineTo(this.loc+r, this.height);
        }
        ctx.fill();
        ctx.restore();
    }
});



// Button
mse.Button = function(parent, param, txt, image, link, type) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	this.txt = txt;
	this.img = image;
	this.setLink(link, type);
};
extend(mse.Button, mse.UIObject);
$.extend(mse.Button.prototype, {
    urlClicked: function() {
        window.open(this.link, '_newtab');
    },
    setLink: function(link, type) {
        if(link) this.link = link;
        if(type == 'url') {
            this.getContainer().evtDeleg.addListener('click', new mse.Callback(this.urlClicked, this), true, this);
        }
    },
    draw: function(ctx, x, y) {
    	this.configCtxFlex(ctx);
    	ctx.fillStyle = "rgb(255,255,255)";
    	ctx.textAlign = "center";
    	ctx.textBaseline = "middle";
    	
    	if(x == null) var ox = this.getX(), oy = this.getY();
    	else var ox = x, oy = y;
    	var img = mse.src.getSrc(this.img);
    	if(img) ctx.drawImage(img, ox, oy, this.width, this.height);
    	
    	if(this.txt)
    		ctx.fillText(this.txt, ox+this.width/2, oy+this.height/2);
    }
});


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
			var ox = this.getCanvasX()-this.zonex+this.insideRec[0], oy = this.getCanvasY()+this.insideRec[1], w = this.insideRec[2], h = this.insideRec[3];
		else var ox = this.getCanvasX()-this.zonex, oy = this.getCanvasY(), w = 2*this.getWidth(), h = 2*this.getHeight();
		
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
			this.configCtxFlex(ctx);
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



mse.Card = function(parent, param, ui) {
    mse.UIObject.call(this, parent, param);
    this._layers = new Array();
    
    this.ui = ui;
    if(ui) this.addLayer('ui', ui);
    this.margin = [15, 15, 15, 15];
    // Angle between -20 and 20
    this.angle = randomInt(40) - 20;
    this.lw = this.width - this.margin[1] - this.margin[3];
    this.lh = this.height - this.margin[0] - this.margin[2];
};
extend(mse.Card, mse.UIObject);
$.extend(mse.Card.prototype, {
    addLayer: mse.BaseContainer.prototype.addLayer,
    delLayer: mse.BaseContainer.prototype.delLayer,
    getLayer: mse.BaseContainer.prototype.getLayer,
    sortLayer: mse.BaseContainer.prototype.sortLayer,
    
    draw: function(ctx){
        if(!this.ui) {
            ctx.fillStyle = "rgb(252,250,242)";
            ctx.fillRoundRect(this.getX(), this.getY(), this.width, this.height, 20);
        }
    },
    ptRotate: function(x, y) {
        var ox = this.getX()+this.width/2, oy = this.getY()+this.height/2;
        var dx = x-ox, dy = y-oy;
        var a = this.angle*Math.PI/180;
        var sina = Math.sin(a), cosa = Math.cos(a);
        var xp = dx*cosa + dy*sina;
        var yp = -dx*sina + dy*cosa;
        return [ox+xp, oy+yp];
    },
    inObj: function(x, y) {
        var pt = this.ptRotate(x, y);
        if(mse.UIObject.prototype.inObj.call(this, pt[0], pt[1])) return true;
        else return false;
    }
});

mse.ImageCard = function(parent, param, ui, img, legend) {
    mse.Card.call(this, parent, param, ui);
    
    if(img && mse.src.getSrc(img)) {
        this.img = img;
        this.legend = legend;
    }
    mse.src.waitSrc(this.img, new mse.Callback(this.init, this));
};
extend(mse.ImageCard, mse.Card);
$.extend(mse.ImageCard.prototype, {
    legendheight: 35,
    setImage: function(img, legend) {
        if(img && mse.src.getSrc(img)) {
            this.img = img;
            this.legend = legend;
        }
    },
    init: function() {
        var iw = this.lw;
        var ih = this.height - this.margin[0] - this.margin[2] - this.legendheight;
        var src = mse.src.getSrc(this.img);
        var rx = iw/src.width, ry = ih/src.height;
        var r = (rx < ry) ? rx : ry;
        this.iw = src.width * r;
        this.ih = src.height * r;
        this.ix = this.margin[3] + (iw-this.iw)/2;
        this.iy = this.margin[0] + (ih-this.ih)/2;
    },
    draw: function(ctx){
        ctx.save();
        // Rotation
        ctx.translate(this.getX()+this.width/2, this.getY()+this.height/2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.width/2, -this.height/2);
        
        for(var i in this._layers) {
        	this._layers[i].draw(ctx);
        }
        // Default UI
        if(!this.ui) {
            ctx.fillStyle = "rgb(252,250,242)";
            ctx.fillRoundRect(0, 0, this.width, this.height, 20);
        }
        if(!this.img) return;
        
        ctx.drawImage(mse.src.getSrc(this.img), this.ix, this.iy, this.iw, this.ih);
        ctx.font = "italic 12px Verdana";
        ctx.textBaseline = "top";
        ctx.textAlign = "center";
        ctx.fillStyle = "#000";
        ctx.fillTextWrapped(this.legend, this.ix+this.iw/2, this.iy+this.ih+5, this.lw, 15);
        ctx.restore();
    }
});

mse.TextContent = function(parent, param) {
    mse.UIObject.call(this, parent, param);
    if(!this.font) this.font = "14px Verdana";
    if(!this.textAlign) this.textAlign = "left";
    if(!this.fillStyle) this.fillStyle = "#000";
    this.textBaseline = "top";
    
    this.sections = new Array();
    this.length = 0;
};
extend(mse.TextContent, mse.UIObject);
$.extend(mse.TextContent.prototype, {
    seplineoff: -3.5,
    titletextoff: 5,
    sectionsep: 12,
    lineHeight: 18,
    addSection: function(type, title, text){
        if(typeof title != 'string' || typeof text != 'string') return;
        switch(type) {
        case "text": var content = text;break;
        case "link": 
            var content = new mse.Button(this, {pos:[15,this.length+this.titletextoff+this.lineHeight],size:[80,this.lineHeight],font:this.font,fillStyle:'#FFF'}, 'Lien', 'wikiBar', text, 'url');
        break;
        }
        this.sections.push([type, title, content]);
        this.configCtx(mse.root.ctx);
        var l = wrapText(title, mse.root.ctx, this.width).length;
        l += wrapText(text, mse.root.ctx, this.width-15).length;
        l = l*this.lineHeight + this.titletextoff + this.sectionsep;
        this.length += l;
    },
    getHeight: function() {
        return this.length;
    },
    draw: function(ctx) {
        ctx.save();
        ctx.translate(this.offx, this.offy);
        this.configCtxFlex(ctx);
        ctx.lineCap = "round";
        var y = 0;
        for(var i = 0; i < this.sections.length; i++) {
            ctx.font = "bold "+this.font;
            y += ctx.fillTextWrapped(this.sections[i][1], 0, y, this.width, this.lineHeight) + this.titletextoff;
            ctx.beginPath();
            ctx.moveTo(0, y+this.seplineoff);
            ctx.lineTo(this.width, y+this.seplineoff);
            ctx.stroke();
            ctx.font = this.font;
            switch(this.sections[i][0]) {
            case "text":
                y += ctx.fillTextWrapped(this.sections[i][2], 15, y, this.width-15, this.lineHeight) + this.sectionsep;break;
            case "link":
                this.sections[i][2].draw(ctx, 15, y);
                y += this.lineHeight + this.sectionsep;break;
            }
        }
        ctx.restore();
    }
});
mse.TextCard = function(parent, param, ui) {
    mse.Card.call(this, parent, param, ui);
    this.content = new mse.TextContent(this, {pos:[this.margin[3], this.margin[0]], size:[this.lw, this.lh]});
    this.addLayer('content', this.content);
    
    this.slider = new mse.Slider(this.content, {}, 'vertical');
    this.slider.setPos(this.width-this.margin[1], 0);
};
extend(mse.TextCard, mse.Card);
$.extend(mse.TextCard.prototype, {
    getContainer: function() {
        return this;
    },
    addSection: function(title, text) {
        this.content.addSection('text', title, text);
    },
    addLink: function(title, url) {
        this.content.addSection('link', title, url);
    },
    draw: function(ctx) {
        ctx.save();
        // Rotation
        ctx.translate(this.getX()+this.width/2, this.getY()+this.height/2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.width/2, -this.height/2);
        
        // Default UI
        if(!this.ui) {
            ctx.fillStyle = "rgb(252,250,242)";
            ctx.fillRoundRect(0, 0, this.width, this.height, 20);
        }
        for(var i in this._layers) {
        	this._layers[i].draw(ctx);
        }
        
        ctx.restore();
    }
});

mse.WikiLayer = function() {
    mse.Layer.call(this, null, 11, {});
    
    this.currCard = null;
    this.cbDragStart = new mse.Callback(this.dragStart, this);
    this.cbDragMove = new mse.Callback(this.dragMove, this);
    this.cbDragEnd = new mse.Callback(this.dragEnd, this);
};
extend(mse.WikiLayer, mse.Layer);
$.extend(mse.WikiLayer.prototype, {
    cardw: 250,
    cardh: 320,
    hide: function() {
        var container = this.getContainer();
        if(container) {
            container.evtDeleg.removeListener('gestureStart', this.cbDragStart);
            container.evtDeleg.removeListener('gestureUpdate', this.cbDragMove);
            container.evtDeleg.removeListener('gestureEnd', this.cbDragEnd);
        }
        
        this.parent.reactiveOthers();
        this.globalAlpha = 0;
        this.parent.delLayer('wiki');
    },
    init: function(container) {
        if(!container instanceof mse.UIObject) return;
        this.parent = container;
        this.setSize(container.getWidth(), container.getHeight());
        this.setPos(0,0);
        this.cardx = (this.width - this.cardw)/2;
        this.cardy = (this.height - this.cardh)/2;
        for(var card in this.objList)
            this.objList[card].setPos(this.cardx, this.cardy);
        
        container.evtDeleg.addListener('gestureStart', this.cbDragStart, true, this);
        container.evtDeleg.addListener('gestureUpdate', this.cbDragMove, true, this);
        container.evtDeleg.addListener('gestureEnd', this.cbDragEnd, true, this);
        
        container.addLayer('wiki', this);
        this.globalAlpha = 1;
        container.desactiveOthers('wiki');
    },
    addImage: function(img, legend) {
        var param = {size: [this.cardw, this.cardh]};
        this.addObject(new mse.ImageCard(this, param, null, img, legend));
    },
    addTextCard: function() {
        var param = {size: [this.cardw, this.cardh]};
        this.textCard = new mse.TextCard(this, param, null);
        this.addObject(this.textCard);
    },
    addExplication: function(title, text) {
        this.addTextCard();
        this.textCard.addSection(title, text);
    },
    addLink: function(title, link) {
        if(!this.textCard) this.addTextCard();
        this.textCard.addLink(title, link);
    },
    dragStart: function(e){
        for(var i = this.objList.length-1; i >= 0; i--) {
            if(this.objList[i].inObj(e.offsetX, e.offsetY)) {
                if( !this.objList[i].evtDeleg.eventNotif('click', e) )
                    this.currCard = this.objList[i];
                return;
            }
        }
        this.hide();
    },
    dragMove: function(e){
        if(!this.currCard) return;
        var dx = e.listX[e.listX.length-1] - e.listX[e.listX.length-2];
        var dy = e.listY[e.listY.length-1] - e.listY[e.listY.length-2];
        this.currCard.move(dx, dy);
    },
    dragEnd: function(e){
        this.currCard = null;
    }
});



// Page Wiki, Title + Galery Photo + Wiki Content
mse.PageWiki = function(parent, z, param, title, photos, content) {
	// Super constructor
	mse.Layer.call(this, parent, z, param);
	parent.addLayer('content', this);
	// Define the size of title
	var ctx = mse.root.ctx;
	ctx.font = '22px '+cfs.font;
	var w = ctx.measureText(title).width * 1.2;
	// Title wiki
	// Problem of offset X of mask and title
	this.title = new mse.Button(this, {pos:[(this.width-w)/2,15],size:[w,35],font:'22px '+cfs.font,fillStyle:'#FFF'}, title, 'wikiBar');
	// Quit button
	var text = "Revenir à l'histoire";
	ctx.font = 'bold 14px Arial Narrow';
	w = ctx.measureText(text).width * 1.2;
	this.quit = new mse.Button(this, {pos:[this.width-w-30,this.height-30],size:[w,25],font:'bold 14px Arial Narrow',fillStyle:'#FFF'}, text, 'wikiBar');
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
	param.pos = [this.offx+30,this.offy+210];
	param.size = [this.width-60,this.height-165];
	this.content = new mse.ArticleLayer(parent, z, param, content);
	this.content.setSlider();
	
	this.v = 0;
	
	this.setQuitTarget = function(tar) {
	    this.getContainer().evtDeleg.addListener(
	    	'click', 
	    	new mse.Callback(mse.root.transition, mse.root, tar), 
	    	true,
	    	this.quit);
	};
	
	this.addPhoto = function(img) {
		this.photos.push(img);
	};
	
	this.logic = function(delta) {
		if(this.v != 0 && this.photos != null) {
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

		this.content.logic(delta);
	};
	
	this.draw = function(ctx) {	
		// Content
		this.content.draw(ctx);
		
		this.mask.draw(ctx);		
		this.title.draw(ctx);
		this.quit.draw(ctx);
		
		// Galery photos
		ctx.save();
		ctx.globalAlpha = 1;
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
		
		// No Photos
		if(this.photos == null) {
		    ctx.restore();
		    return;
		}
		
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


// Video element
mse.Video = function(parent, param, srcs) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	this.srcs = srcs;
	
	this.launch = function() {
	    mse.root.video.load(srcs);
	    mse.root.video.show();
	};
	
	this.draw = function(ctx) {
	    ctx.save();
	    ctx.fillStyle = "#000";
	    ctx.strokeStyle = "#FFF";
	    ctx.lineWidth = 4;
	    ctx.translate(this.getX(), this.getY());
	    ctx.strokeRoundRect(0, 0, this.width, this.height, 5);
	    ctx.fillRoundRect(0, 0, this.width, this.height, 5);
	    ctx.beginPath();
	    ctx.moveTo(this.width/2-25, this.height/2-20);
	    ctx.lineTo(this.width/2+25, this.height/2);
	    ctx.lineTo(this.width/2-25, this.height/2+20);
	    ctx.lineTo(this.width/2-25, this.height/2-20);
	    ctx.fillStyle = "#FFF";
	    ctx.fill();
	    ctx.restore();
	};
	
	this.getContainer().evtDeleg.addListener('click', new mse.Callback(this.launch, this), true, this);
};
mse.Video.prototype = new mse.UIObject();
mse.Video.prototype.constructor = mse.Video;




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
				this.timer = setTimeout("mse.currTimeline.run()", this.timeprog[this.currIndex]);
				this.src.runTimeline(this.timeprog[this.currIndex-1]);
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
	
	this.resetAnimation();
	this.evtDeleg = new mse.EventDelegateSystem();
	
	if(this.map['opacity']) // Avoid the bug of opacity in javacript
		this.element.globalAlpha = this.map['opacity'][0]==0 ? 0.01 : this.map['opacity'][0];
};
mse.KeyFrameAnimation.prototype = {
    construction: mse.KeyFrameAnimation,
    setNoTransition: function() {
    	this.notransition = true;
    },
    resetAnimation: function() {
    	this.currId = -1;
    	this.currFr = 0;
    	this.nextKf = this.map['frame'][0];
    	this.currRp = 1;
    },
    start: function() {
    	for(var i in mse.root.animations)
    		if(mse.root.animations[i] == this) return;
    	mse.root.animations.push(this);
    },
    isEnd: function() {
        if(this.currFr > this.duration && this.currRp == this.repeat) return true;
        else return false;
    },
    
    logic: function(delta) {
    	if(this.currFr <= this.duration) {
    		// Passed a timestamp, move to next
    		if(this.currFr == this.nextKf) {
    			// Update states
    			this.currId++;
    			this.nextKf = this.map['frame'][this.currId+1];
    			
    			for( var key in this.map ) {
    			    var curr = this.map[key][this.currId];
    				switch(key) {
    				case 'frame': continue; // Ignore timestamps
    				case 'pos':
    					this.element.setPos(curr[0], curr[1]);break;
    				case 'size':
    					this.element.setSize(curr[0], curr[1]);break;
    				case 'opacity':
    					this.element.globalAlpha = curr;break;
    				case 'fontSize':
    					var size = curr;
    					var s = checkFontSize(this.element.font);
    					this.element.font=this.element.font.replace(s,size.toString());
    					break;
    				case 'scale':
    					this.element.scale = curr;break;
    				case 'spriteSeq':
    				    this.element.curr = curr;break;
    				}
    			}
    		}
    		// No transition calculated between the frames
    		else if(!this.notransition){
    			// Play the transition between currFr and nextKf
    			var ratio = (this.currFr - this.map['frame'][this.currId]) / (this.nextKf - this.map['frame'][this.currId]);
    			// Iterate in attributes for animation
    			for( var key in this.map ) {
    			    var curr = this.map[key][this.currId];
    			    var next = this.map[key][this.currId+1];
    				switch(key) {
    				case 'frame': case 'spriteSeq': continue; // Ignore timestamps and sprite sequences
    				case 'pos':
    				    var trans = curr[2] ? (this.calTrans[curr[2]] ? curr[2] : 2) : 2;
    					var x = this.calTrans[trans](ratio, curr[0], next[0]);
    					var y = this.calTrans[trans](ratio, curr[1], next[1]);
    					this.element.setPos(x, y);break;
    				case 'size':
    				    var trans = curr[2] ? (this.calTrans[curr[2]] ? curr[2] : 2) : 2;
    					var w = this.calTrans[trans](ratio, curr[0], next[0]);
    					var h = this.calTrans[trans](ratio, curr[1], next[1]);
    					this.element.setSize(w, h);break;
    				case 'opacity':
    				    var trans = curr[1] ? (this.calTrans[curr[1]] ? curr[1] : 2) : 2;
    					this.element.globalAlpha = this.calTrans[trans](ratio, (curr[0]?curr[0]:curr), (next[0]?next[0]:next));
    					break;
    				case 'fontSize': 
    				    var trans = curr[1] ? (this.calTrans[curr[1]] ? curr[1] : 2) : 2;
    					var size = Math.floor(this.calTrans[trans](ratio, (curr[0]?curr[0]:curr), (next[0]?next[0]:next)));
    					var s = checkFontSize(this.element.font);
    					this.element.font=this.element.font.replace(s,size.toString());
    					break;
    				case 'scale':
    				    var trans = curr[1] ? (this.calTrans[curr[1]] ? curr[1] : 2) : 2;
    					this.element.scale = this.calTrans[trans](ratio, (curr[0]?curr[0]:curr), (next[0]?next[0]:next));
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
    },
    
    calTrans: {
        // No transition
        1:function(ratio, prevState, nextState) {
            return prevState;
        },
        // Float interpolation
    	2:function(ratio, prevState, nextState) {
    		return prevState + ratio * (nextState-prevState);
    	}
    }
};


mse.Animation = function(duration, repeat, statiq, container, param){
    this.statiq = statiq ? true : false;
    // Super constructor
    if(this.statiq) mse.UIObject.call(this, null, {});
	else mse.UIObject.call(this, container, param);
	this.objs = {};
	this.animes = [];
	this.duration = duration;
	this.repeat = repeat;
	this.state = 0;
	this.startCb = new mse.Callback(this.start, this);
	this.block = false;
};
extend(mse.Animation, mse.UIObject);
$.extend(mse.Animation.prototype, {
    addObj: function(name, obj){
        if(obj instanceof mse.UIObject){
            this.objs[name] = obj;
            obj.parent = this;
        }
    },
    getObj: function(name){
        return this.objs[name];
    },
    addAnimation: function(objname, keyFrameMap, notransition){
        if(!this.objs[objname]) return;
        var anime = new mse.KeyFrameAnimation(this.objs[objname], keyFrameMap, this.repeat);
        if(anime) {
            if(notransition) anime.setNoTransition();
            this.animes.push(anime);
        }
    },
    start: function(){
        this.state = 1;
        if(this.statiq && $.inArray(this, mse.root.animes) == -1) {
            for(var i in this.animes)
                this.animes[i].resetAnimation();
            mse.root.animes.push(this);
        }
        this.evtDeleg.eventNotif('start');
    },
    pause: function(){
        this.state = 0;
    },
    logic: function(delta){
        if(this.state){
            for(var i in this.animes)
        	    this.animes[i].logic(delta);
        }
    },
    draw: function(ctx){
        for(var key in this.objs)
            this.objs[key].draw(ctx);

        for(var i in this.animes){
            if(!this.animes[i].isEnd())
                return false;
        }
        this.state = 0;
        this.evtDeleg.eventNotif('end');
        return true;
    }
});



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
	    this.ctx.globalAlpha = 1;
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
};
extend(mse.CardContainer, mse.BaseContainer);
$.extend(mse.CardContainer.prototype, {
    logic: function(delta) {
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
    },
    toString: function() {
    	return "[object CardContainer]";
    }
});


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
		var w = new mse.Image(this, param.wiki, 'wikiBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback(this.getWiki, this), 
				true, w);
		this.addObject(w);
	}
	// Button book
	if(param.book) {
		var b = new mse.Image(this, param.book, 'bookBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback((param.up?this.getBookUp:this.getBookDown), this), 
				true, b);
		this.addObject(b);
	}
	// Button illustration
	if(param.illu) {
		var i = new mse.Image(this,param.illu,'illuBn');
		this.getContainer().evtDeleg.addListener(
				'click', 
				new mse.Callback(this.getIllu, this), 
				true, i);
		this.addObject(i);
	}
};
extend(mse.CardUILayer, mse.Layer);
$.extend(mse.CardUILayer.prototype, {
    getBookDown: function() {mse.root.pullup();},
    getBookUp: function() {mse.root.dropdown();},
    getIllu: function() {mse.root.pullup();},
    getWiki: function() {mse.root.dropdown();},
    toString: function() {
	    return "[object mse.CardUILayer]";
    }
});



mse.TextLayer = function(container, z, param, content, begin, end) {
	mse.Layer.call(this, container, z, param);
	
	this.content = content; this.begin = begin; this.end = end;
};
extend(mse.TextLayer, mse.Layer);
$.extend(mse.TextLayer.prototype, {
    draw: function(ctx){
    	this.configCtx(ctx);
    	
    	var x = this.getX();
    	var y = this.getY();
    	for(var i = this.begin; i < this.end; i++) {
    		this.content.list[i].draw(ctx, x, y);
    		y += this.content.list[i].height;
    	}
    }
});



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
				gameLayer = new mse.Layer(gameCard, 3, {size:cardParam.size});
				gameCard.addLayer('game', gameLayer);
				lk.addTo(gameLayer);
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
	txtLayer.addObject(new mse.Text(txtLayer, {pos:[width/2, height/2],textBaseline:'middle',textAlign:'center',font:'italic 28px '+cfs.font,fillStyle:'#FFF'}, 'À Suivre...', true));
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
(function (mse, $) {

	var defaultEvents = ['click', 'doubleClick', 'longPress', 'move', 'swipe', 'gestureStart', 'gestureUpdate', 'gestureEnd', 'gestureSingle', 'keydown', 'keypress', 'keyup', 'scroll', 'swipeleft', 'swiperight'];
	
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
			sc.states[id] = cds[i].initial ? cds[i].expect : "";
			sc.expects[id] = cds[i].expect ? cds[i].expect : "everytime";
			sc.success[id] = false;
			sc.delay = (delay ? delay : 0);
			var src = cds[i].src;
			if($.inArray(cds[i].type, defaultEvents)!=-1 && !(cds[i].src instanceof mse.BaseContainer)) {
			    src = src.getContainer();
			    src.evtDeleg.addListener(cds[i].type, new mse.Callback(sc.conditionChanged, sc, [id]), false, cds[i].src);
			}
			else 
			    src.evtDeleg.addListener(cds[i].type, new mse.Callback(sc.conditionChanged, sc, [id]), false);
		}
		sc.script = script;
	}


})(mse, $);




// System of 2D coordinates
(function (window, mse) {


    mse.Point2 = function(x, y) {
        this.x = x;
        this.y = y;
    }
    
    window.crePoint2 = function(x,y) {
        return new mse.Point2(x,y);
    }


})(window, mse);var coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":-1.25,"cid3":-2.5,"cid4":20,"cid5":360,"cid6":220,"cid7":0,"cid8":151.25,"cid9":188.75,"cid10":66.25,"cid11":61.25,"cid12":330,"cid13":235,"cid14":27.5,"cid15":187.5,"cid16":245,"cid17":16.5,"cid18":231.25,"cid19":181.25,"cid20":366.25,"cid21":51.25}');initMseConfig();mse.init();function createbook(){var root = new mse.Root('Test',coords.cid0,coords.cid1,'portrait');var temp = {};var animes={};var games={};var wikis={};mse.src.addSource('src0_image','./images/src0_image.jpeg','img',true);mse.src.addSource('src1_image','./images/src1_image.jpeg','img',true);mse.src.addSource('src2_image','./images/src2_image.jpeg','img',true);mse.src.addSource('src3_image','./images/src3_image.png','img',true);mse.src.addSource('src4_image','./images/src4_image.png','img',true);wikis.sac_wiki=new mse.WikiLayer();wikis.sac_wiki.addTextCard();wikis.sac_wiki.textCard.addSection('Sac', 'Sac a dos');wikis.sac_wiki.textCard.addSection('like', 'jki ghjy guyghf iug tyfd');wikis.sac_wiki.addImage('src3_image', 'sac');mse.src.addSource('src5_image','./images/src5_image.jpeg','img',true);mse.src.addSource('src6_image','./images/src6_image.jpeg','img',true);mse.src.addSource('src9_image','./images/src9_image.jpeg','img',true);var pages = {};var layers = {};var objs = {};pages.back=new mse.BaseContainer(root,{size:[coords.cid0,coords.cid1]});layers.backdefault=new mse.Layer(pages.back,1,{"globalAlpha":1,"size":[coords.cid0,coords.cid1]});objs.obj200=new mse.Image(layers.backdefault,{"size":[coords.cid0,coords.cid1],"pos":[coords.cid2,coords.cid3],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+coords.cid4+"px Times","textAlign":"left"},'src5_image');layers.backdefault.addObject(objs.obj200);pages.back.addLayer('backdefault',layers.backdefault);layers.mask=new mse.Layer(pages.back,2,{"globalAlpha":1,"size":[coords.cid0,coords.cid1]});objs.obj201=new mse.Mask(layers.mask,{"size":[coords.cid5,coords.cid1],"pos":[coords.cid6,coords.cid7],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.69,"font":"normal "+coords.cid4+"px Times","textAlign":"left"});layers.mask.addObject(objs.obj201);objs.obj203=new mse.Image(layers.mask,{"size":[coords.cid8,coords.cid9],"pos":[coords.cid10,coords.cid11]},'src4_image');layers.mask.addObject(objs.obj203);pages.back.addLayer('mask',layers.mask);layers.art=new mse.ArticleLayer(pages.back,3,{"size":[coords.cid12,coords.cid1],"pos":[coords.cid13,coords.cid7],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+coords.cid4+"px Helvetical","textAlign":"left","textBaseline":"top","lineHeight":coords.cid14},null);objs.obj202=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Durant quelques instants, Simon resta ',true);layers.art.addObject(objs.obj202);objs.obj203=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'suspendu dans les airs. Une sensation ',true);layers.art.addObject(objs.obj203);objs.obj204=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'unique, enivrante. Comme s’il volait.',true);layers.art.addObject(objs.obj204);objs.obj205=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il est malade$nbsp;ce type !',true);layers.art.addObject(objs.obj205);objs.obj206=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Et soudain, la chute. Interminable. ',true);layers.art.addObject(objs.obj206);objs.obj207=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il se mit à paniquer. Devant lui, il n’y ',true);layers.art.addObject(objs.obj207);objs.obj208=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'avait qu’un trou noir, béant, une porte ',true);layers.art.addObject(objs.obj208);objs.obj209=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'de ténèbres ouverte sur les Enfers.',true);layers.art.addObject(objs.obj209);objs.obj210=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Après tout ce n’était peut-être pas une ',true);layers.art.addObject(objs.obj210);objs.obj211=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'bonne idée.',true);layers.art.addObject(objs.obj211);objs.obj404=new mse.Image(layers.art,{"size":[coords.cid15,coords.cid16],"pos":[coords.cid17,coords.cid4]},'src3_image');layers.art.addObject(objs.obj404);objs.obj212=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'On fait le tour et on le récupère en bas.',true);layers.art.addObject(objs.obj212);objs.obj213=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Ce fut la dernière chose qu’il entendit ',true);layers.art.addObject(objs.obj213);objs.obj214=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'avant d’atterrir avec violence dans un ',true);layers.art.addObject(objs.obj214);objs.obj215=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'épais taillis. Le choc lui arracha un cri. ',true);layers.art.addObject(objs.obj215);objs.obj216=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Tout son corps lui faisait mal, ses bras ',true);objs.obj216.addLink(new mse.Link('lui',15,'wiki',wikis.sac_wiki));layers.art.addObject(objs.obj216);objs.obj217=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'zébrés d’écorchures, le souffle ',true);layers.art.addObject(objs.obj217);objs.obj218=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'définitivement coupé. ',true);layers.art.addObject(objs.obj218);objs.obj219=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il n’était pas tombé sur le sol. Il était ',true);objs.obj219.addLink(new mse.Link('tombé',18,'fb','http://www.facebook.com/pandamicro'));layers.art.addObject(objs.obj219);objs.obj220=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'suspendu juste au-dessus de la voie ',true);layers.art.addObject(objs.obj220);objs.obj221=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'ferrée, sauvé par un buisson ',true);layers.art.addObject(objs.obj221);objs.obj222=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'providentiel qui poussait dans le vide. ',true);layers.art.addObject(objs.obj222);objs.obj223=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Waouh, songea-t-il en essayant de se ',true);layers.art.addObject(objs.obj223);objs.obj224=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dégager, je l’ai échappé belle…',true);layers.art.addObject(objs.obj224);objs.obj225=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Mais, alors qu’il pensait s’en être sorti, ',true);layers.art.addObject(objs.obj225);objs.obj226=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'les racines du taillis cédèrent d’un seul ',true);layers.art.addObject(objs.obj226);objs.obj227=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'coup, propulsant Simon deux mètres ',true);layers.art.addObject(objs.obj227);objs.obj228=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'plus bas. ',true);layers.art.addObject(objs.obj228);objs.obj229=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Ne pas atterrir sur mon sac, surtout ne ',true);layers.art.addObject(objs.obj229);objs.obj230=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'pas atterrir sur mon sac, fut sa seule ',true);layers.art.addObject(objs.obj230);objs.obj231=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'pensée avant de rejoindre le ballast. ',true);layers.art.addObject(objs.obj231);objs.obj232=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Les angles aigus des pierres pénétrèrent ',true);layers.art.addObject(objs.obj232);objs.obj233=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dans ses côtes et sa tête heurta le métal ',true);layers.art.addObject(objs.obj233);objs.obj234=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'de la voie abandonnée. ',true);layers.art.addObject(objs.obj234);objs.obj235=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il était allongé sur une traverse, son ',true);layers.art.addObject(objs.obj235);objs.obj236=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'regard bleu inondé par la lueur de la ',true);layers.art.addObject(objs.obj236);objs.obj237=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'pleine lune. Il n’avait plus envie de ',true);layers.art.addObject(objs.obj237);objs.obj238=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'bouger, absorbé par les dessins ',true);layers.art.addObject(objs.obj238);objs.obj239=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'mystérieux que traçaient les étoiles ',true);layers.art.addObject(objs.obj239);objs.obj240=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dans le ciel.',true);layers.art.addObject(objs.obj240);objs.obj241=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Une étrange sensation – humide et ',true);layers.art.addObject(objs.obj241);objs.obj242=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'râpeuse à la fois - le tira de sa rêverie. ',true);layers.art.addObject(objs.obj242);objs.obj243=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'C’était la minuscule langue de Dark. ',true);layers.art.addObject(objs.obj243);objs.obj244=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dark$nbsp;! Tu n’as rien$nbsp;! s’exclama Simon ',true);layers.art.addObject(objs.obj244);objs.obj245=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'en se redressant.',true);layers.art.addObject(objs.obj245);objs.obj246=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Aussitôt le rat se lova dans son cou, ',true);layers.art.addObject(objs.obj246);objs.obj247=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'rassuré à son tour par l’état de santé de ',true);layers.art.addObject(objs.obj247);objs.obj248=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'son maître.  ',true);layers.art.addObject(objs.obj248);objs.obj249=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il est là. Vivant$nbsp;!',true);layers.art.addObject(objs.obj249);objs.obj250=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La Fouine$nbsp;! ',true);layers.art.addObject(objs.obj250);objs.obj251=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La Meute n’avait pas mis bien ',true);layers.art.addObject(objs.obj251);objs.obj252=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'longtemps pour le retrouver. La traque ',true);layers.art.addObject(objs.obj252);objs.obj253=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'allait recommencer. Mais l’adolescent ',true);layers.art.addObject(objs.obj253);objs.obj254=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'était fourbu, perclus de douleurs et il se ',true);layers.art.addObject(objs.obj254);objs.obj255=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'voyait mal fuir encore une fois. ',true);layers.art.addObject(objs.obj255);objs.obj256=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il se releva, fouillant  l’obscurité ',true);layers.art.addObject(objs.obj256);objs.obj257=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'alentour. ',true);layers.art.addObject(objs.obj257);objs.obj258=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'A droite, le danger...',true);layers.art.addObject(objs.obj258);objs.obj259=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'A gauche, l’œil béant d’un tunnel ',true);layers.art.addObject(objs.obj259);objs.obj260=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'ferroviaire qui plongeait sous le Parc.',true);layers.art.addObject(objs.obj260);objs.obj261=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il n’y avait pas à hésiter.',true);layers.art.addObject(objs.obj261);objs.obj262=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il ramassa sa besace et se remit en ',true);layers.art.addObject(objs.obj262);objs.obj263=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'route. Il avait faim, il avait froid et sa ',true);layers.art.addObject(objs.obj263);objs.obj264=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'cheville le faisait affreusement souffrir. ',true);layers.art.addObject(objs.obj264);objs.obj265=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il extirpa la lampe de son sac et caressa ',true);layers.art.addObject(objs.obj265);objs.obj266=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'la fourrure de Dark.',true);layers.art.addObject(objs.obj266);objs.obj267=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Eh bien, mon vieux, je crois que nous ',true);layers.art.addObject(objs.obj267);objs.obj268=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'sommes en bien mauvaise posture. ',true);layers.art.addObject(objs.obj268);objs.obj269=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Désolé de t’avoir entraîné là-dedans. ',true);layers.art.addObject(objs.obj269);objs.obj270=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Le rongeur l’écoutait d’un air attentif, ',true);layers.art.addObject(objs.obj270);objs.obj271=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dressé sur ses pattes postérieures, le nez ',true);layers.art.addObject(objs.obj271);objs.obj272=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'tendu. ',true);layers.art.addObject(objs.obj272);objs.obj273=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Voilà que je me mets à parler à mon rat ',true);layers.art.addObject(objs.obj273);objs.obj274=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'comme s’il comprenait quelque chose$nbsp;!',true);layers.art.addObject(objs.obj274);objs.obj275=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dans la pénombre, l’entrée du tunnel ',true);layers.art.addObject(objs.obj275);objs.obj276=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'ressemblait au porche d’un temple ',true);layers.art.addObject(objs.obj276);objs.obj277=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'mystérieux. ',true);layers.art.addObject(objs.obj277);objs.obj278=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Indiana Jones. ',true);layers.art.addObject(objs.obj278);objs.obj279=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Sauf que l’adolescent ne possédait ni ',true);layers.art.addObject(objs.obj279);objs.obj280=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'chapeau, ni fouet. ',true);layers.art.addObject(objs.obj280);objs.obj281=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon … Simon … Reviens…',true);layers.art.addObject(objs.obj281);objs.obj282=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La voix de Kevin s’élevait dans la nuit. ',true);layers.art.addObject(objs.obj282);objs.obj283=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Mielleuse, sournoise. ',true);layers.art.addObject(objs.obj283);objs.obj284=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon, tu as gagné. Si tu t’ rends ',true);layers.art.addObject(objs.obj284);objs.obj285=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'maintenant, j’te promets qu’on t’fera ',true);layers.art.addObject(objs.obj285);objs.obj286=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'pas trop souffrir, ajouta-t-il en raclant la ',true);layers.art.addObject(objs.obj286);objs.obj287=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'lame de son couteau contre les pierres ',true);layers.art.addObject(objs.obj287);objs.obj288=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'d’un muret.',true);layers.art.addObject(objs.obj288);objs.obj289=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Un bruit affreux, qui fit dresser les poils ',true);layers.art.addObject(objs.obj289);objs.obj290=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'de l’adolescent. ',true);layers.art.addObject(objs.obj290);objs.obj291=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Hors de question de tomber entre leurs ',true);layers.art.addObject(objs.obj291);objs.obj292=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'mains! Il s’avança dans les ténèbres du ',true);layers.art.addObject(objs.obj292);objs.obj293=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'tunnel, guidé par le minuscule halo de ',true);layers.art.addObject(objs.obj293);objs.obj294=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'sa lampe torche. ',true);layers.art.addObject(objs.obj294);objs.obj295=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La voûte minérale répercutait le bruit de ',true);layers.art.addObject(objs.obj295);objs.obj296=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'ses pas. ',true);layers.art.addObject(objs.obj296);objs.obj297=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon balaya les murs et… hurla$nbsp;!',true);layers.art.addObject(objs.obj297);objs.obj298=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Là, dans la lueur blafarde, était apparu ',true);layers.art.addObject(objs.obj298);objs.obj299=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'un visage. Démesuré. Grimaçant.',true);layers.art.addObject(objs.obj299);objs.obj300=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Une fresque.',true);layers.art.addObject(objs.obj300);objs.obj301=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Quel idiot$nbsp;! songea-t’il.',true);layers.art.addObject(objs.obj301);objs.obj302=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'L’œuvre représentait une créature ',true);layers.art.addObject(objs.obj302);objs.obj303=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'démoniaque qui semblait vouloir ',true);layers.art.addObject(objs.obj303);objs.obj304=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dévorer l’intrus. Une sorte ',true);layers.art.addObject(objs.obj304);objs.obj305=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'d’avertissement.',true);layers.art.addObject(objs.obj305);objs.obj306=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Impressionné, Simon trébucha et s’étala ',true);layers.art.addObject(objs.obj306);objs.obj307=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'de tout son long. ',true);layers.art.addObject(objs.obj307);objs.obj308=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Et merde$nbsp;!',true);layers.art.addObject(objs.obj308);objs.obj309=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Une chute sans gravité. Sauf que Dark, ',true);layers.art.addObject(objs.obj309);objs.obj310=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'sans doute agacé d’être de nouveau ',true);layers.art.addObject(objs.obj310);objs.obj311=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'balloté, avait disparu$nbsp;!',true);layers.art.addObject(objs.obj311);objs.obj312=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dark$nbsp;! Dark$nbsp;!',true);layers.art.addObject(objs.obj312);objs.obj313=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'L’adolescent avait presque crié. ',true);layers.art.addObject(objs.obj313);objs.obj314=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Les conséquences ne se firent pas ',true);layers.art.addObject(objs.obj314);objs.obj315=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'attendre. ',true);layers.art.addObject(objs.obj315);objs.obj316=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Venez les gars, il est là$nbsp;! Tout prêt$nbsp;!',true);layers.art.addObject(objs.obj316);objs.obj317=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon entendit un bruit de cavalcade ',true);layers.art.addObject(objs.obj317);objs.obj318=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dans sa direction. Il balaya la surface du ',true);layers.art.addObject(objs.obj318);objs.obj319=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'tunnel. Mais il n’y avait rien qui ',true);layers.art.addObject(objs.obj319);objs.obj320=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'ressembla à une cachette. Pas la ',true);layers.art.addObject(objs.obj320);objs.obj321=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'moindre anfractuosité, pas le moindre ',true);layers.art.addObject(objs.obj321);objs.obj322=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'bloc où se dissimuler. ',true);layers.art.addObject(objs.obj322);objs.obj323=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Juste la queue de Dark qui disparaissait ',true);layers.art.addObject(objs.obj323);objs.obj324=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'dans le mur, quelques mètres devant lui. ',true);layers.art.addObject(objs.obj324);objs.obj325=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon se précipita.',true);layers.art.addObject(objs.obj325);objs.obj326=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Derrière lui, les prédateurs se ',true);layers.art.addObject(objs.obj326);objs.obj327=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'regroupaient.',true);layers.art.addObject(objs.obj327);objs.obj328=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'On se met en ligne et on avance. Il n’a ',true);layers.art.addObject(objs.obj328);objs.obj329=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'aucune chance de nous échapper.',true);layers.art.addObject(objs.obj329);objs.obj330=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Une sueur froide inondait le dos de ',true);layers.art.addObject(objs.obj330);objs.obj331=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'l’adolescent. La peur.',true);layers.art.addObject(objs.obj331);objs.obj332=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dark$nbsp;?',true);layers.art.addObject(objs.obj332);objs.obj333=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Un couinement, juste devant lui. ',true);layers.art.addObject(objs.obj333);objs.obj334=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon s’approcha et découvrit un trou, ',true);layers.art.addObject(objs.obj334);objs.obj335=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'de la taille de son poing, qui semblait ',true);layers.art.addObject(objs.obj335);objs.obj336=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'avoir été creusé à hauteur d’homme. Le ',true);layers.art.addObject(objs.obj336);objs.obj337=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'rat l’attendait là, comme pour l’inviter à ',true);layers.art.addObject(objs.obj337);objs.obj338=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'le suivre.',true);layers.art.addObject(objs.obj338);objs.obj339=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Et comment veux-tu que je rentre ',true);layers.art.addObject(objs.obj339);objs.obj340=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'là-dedans$nbsp;? ',true);layers.art.addObject(objs.obj340);objs.obj341=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La Meute se rapprochait encore. ',true);layers.art.addObject(objs.obj341);objs.obj342=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Ll’adolescent plongea ses mains dans ',true);layers.art.addObject(objs.obj342);objs.obj343=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'l’orifice et s’aperçut que les parois ',true);layers.art.addObject(objs.obj343);objs.obj344=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'étaient friables. Sans doute une chatière ',true);layers.art.addObject(objs.obj344);objs.obj345=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'que l’on avait dissimulée à la hâte. En ',true);layers.art.addObject(objs.obj345);objs.obj346=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'quelques gestes, il dégagea un espace ',true);layers.art.addObject(objs.obj346);objs.obj347=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'suffisant pour qu’il puisse s’y engager. ',true);layers.art.addObject(objs.obj347);objs.obj348=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dark, tu es un génie, murmura Simon en ',true);layers.art.addObject(objs.obj348);objs.obj349=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'songeant à cette vieille comptine que lui ',true);layers.art.addObject(objs.obj349);objs.obj350=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'chantait sa mère, jadis$nbsp;: «$nbsp;Muruzé, ',true);layers.art.addObject(objs.obj350);objs.obj351=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Troussifée, Rassimais$nbsp;». ',true);layers.art.addObject(objs.obj351);objs.obj352=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Des mots magiques, qu’il avait mis des ',true);layers.art.addObject(objs.obj352);objs.obj353=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'années à comprendre$nbsp;: «$nbsp;Mur usé, trou ',true);layers.art.addObject(objs.obj353);objs.obj354=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'s’y fait, rat s’y met…$nbsp;».',true);layers.art.addObject(objs.obj354);objs.obj355=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il sourit un instant puis plongea le ',true);layers.art.addObject(objs.obj355);objs.obj356=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'faisceau de sa lampe dans le minuscule ',true);layers.art.addObject(objs.obj356);objs.obj357=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'passage. Impossible d’en apercevoir le ',true);layers.art.addObject(objs.obj357);objs.obj358=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'bout. Impossible de savoir où il allait. ',true);layers.art.addObject(objs.obj358);objs.obj359=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Des bruits de pas sur le gravier, juste ',true);layers.art.addObject(objs.obj359);objs.obj360=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'derrière lui. Pas le choix$nbsp;!',true);layers.art.addObject(objs.obj360);objs.obj361=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il se faufila entre les étroites parois, les ',true);layers.art.addObject(objs.obj361);objs.obj362=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'bras en avant, poussant son sac. Il ',true);layers.art.addObject(objs.obj362);objs.obj363=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'n’avait même pas la place de ramper, ',true);layers.art.addObject(objs.obj363);objs.obj364=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'contraint d’onduler à la manière d’un ',true);layers.art.addObject(objs.obj364);objs.obj365=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'serpent. ',true);layers.art.addObject(objs.obj365);objs.obj366=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'La poussière l’aveuglait, de la boue ',true);layers.art.addObject(objs.obj366);objs.obj367=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'s’engouffrait dans sa bouche et il ',true);layers.art.addObject(objs.obj367);objs.obj368=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'commençait à suffoquer.',true);layers.art.addObject(objs.obj368);objs.obj369=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},' Le salaud, il essaye encore de nous ',true);layers.art.addObject(objs.obj369);objs.obj370=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'échapper$nbsp;!',true);layers.art.addObject(objs.obj370);objs.obj371=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Repéré$nbsp;!',true);layers.art.addObject(objs.obj371);objs.obj372=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'L’adolescent tenta d’accélérer le ',true);layers.art.addObject(objs.obj372);objs.obj373=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'mouvement. Mais plus il avançait, plus ',true);layers.art.addObject(objs.obj373);objs.obj374=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'il avait l’impression que le boyau allait ',true);layers.art.addObject(objs.obj374);objs.obj375=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'l’avaler, qu’il allait mourir là. Il aurait ',true);layers.art.addObject(objs.obj375);objs.obj376=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'voulu hurler mais sa cage thoracique ',true);layers.art.addObject(objs.obj376);objs.obj377=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'était trop oppressée.',true);layers.art.addObject(objs.obj377);objs.obj378=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Vas-y$nbsp;! Suis-le$nbsp;! hurlait Kevin.',true);layers.art.addObject(objs.obj378);objs.obj379=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Mais…',true);layers.art.addObject(objs.obj379);objs.obj380=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Discute pas la Fouine, vas-y$nbsp;!',true);layers.art.addObject(objs.obj380);objs.obj381=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Simon tremblait, la sueur collait à son ',true);layers.art.addObject(objs.obj381);objs.obj382=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'front tandis que l’autre se faufilait déjà ',true);layers.art.addObject(objs.obj382);objs.obj383=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'à sa poursuite. Il était mince, agile et ',true);layers.art.addObject(objs.obj383);objs.obj384=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'surtout il avait encore plus peur de ',true);layers.art.addObject(objs.obj384);objs.obj385=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Kevin que lui. ',true);layers.art.addObject(objs.obj385);objs.obj386=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Cette fois, Simon était bel et bien foutu.',true);layers.art.addObject(objs.obj386);objs.obj387=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Soudain, un éclair blanc le fit sursauter. ',true);layers.art.addObject(objs.obj387);objs.obj388=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Une silhouette spectrale venait de ',true);layers.art.addObject(objs.obj388);objs.obj389=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'passer entre son corps et la paroi.',true);layers.art.addObject(objs.obj389);objs.obj390=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Dans les secondes qui suivirent, un ',true);layers.art.addObject(objs.obj390);objs.obj391=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'hurlement ébranla le tunnel. ',true);layers.art.addObject(objs.obj391);objs.obj392=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Mais l’adolescent n’eut pas le temps de ',true);layers.art.addObject(objs.obj392);objs.obj393=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'s’y intéresser car il venait, enfin, de ',true);layers.art.addObject(objs.obj393);objs.obj394=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'déboucher sur un espace plus grand. ',true);layers.art.addObject(objs.obj394);objs.obj395=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Il s’assit un instant pour reprendre son ',true);layers.art.addObject(objs.obj395);objs.obj396=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'souffle tandis que Dark lissait ses ',true);layers.art.addObject(objs.obj396);objs.obj397=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'moustaches à ses côtés. Quelques ',true);layers.art.addObject(objs.obj397);objs.obj398=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'gouttes de sang poissaient son museau. ',true);layers.art.addObject(objs.obj398);objs.obj399=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Le visage de Simon s’éclaira : l’éclair ',true);layers.art.addObject(objs.obj399);objs.obj400=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'blanc, le hurlement.',true);layers.art.addObject(objs.obj400);objs.obj401=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'Sacré Dark$nbsp;! Sans toi, je n’avais aucune ',true);layers.art.addObject(objs.obj401);objs.obj402=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'chance… Maintenant, la question est de ',true);layers.art.addObject(objs.obj402);objs.obj403=new mse.Text(layers.art,{size:[coords.cid12,coords.cid14]},'savoir où nous avons atterri$nbsp;!',true);layers.art.addObject(objs.obj403);layers.art.setDefile(1300);temp.layerDefile=layers.art;pages.back.addLayer('art',layers.art);pages.back2=new mse.BaseContainer(null,{size:[coords.cid0,coords.cid1]});layers.back2default=new mse.Layer(pages.back2,1,{"globalAlpha":1,"size":[coords.cid0,coords.cid1]});objs.obj405=new mse.Image(layers.back2default,{"size":[coords.cid0,coords.cid1],"pos":[coords.cid7,coords.cid7]},'src6_image');layers.back2default.addObject(objs.obj405);objs.obj406=new mse.Image(layers.back2default,{"size":[coords.cid18,coords.cid19],"pos":[coords.cid20,coords.cid21]},'src9_image');layers.back2default.addObject(objs.obj406);pages.back2.addLayer('back2default',layers.back2default);var action={};var reaction={};mse.currTimeline.start();};mse.autoFitToWindow(createbook);