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
	defaultFont : '18px Arial',
	srcPath	: '',
	getSrcPath : function(path) {
	    // Path complete
	    if(path[0] == '.') return path;
	    else return mse.configs.srcPath + path;
	}
};
// Shortcut
var cfs = mse.configs;

mse.root = null;
mse.currTimeline = null;


// Gestion de ressources
mse.src = function() {
    return {
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
	    		this.list[name].src = cfs.getSrcPath(file);
	    		this.list[name].lid = 0; // Loading current index
	    		break;
	    	case 'aud' : case 'audio':
	    		this.list[name] = document.createElement('audio');
	    		if(file.search(this.audExtCheck) == -1) {
	    		    switch(MseConfig.browser) {
	    		    case 'Chrome': case 'Firefox': case 'Opera':
	    			    this.list[name].src = cfs.getSrcPath(file)+'.ogg';break;
	    		    case 'Safari': case 'Explorer':
	    			    this.list[name].src = cfs.getSrcPath(file)+'.mp3';break;
	    		    }
	    		}
	    		else this.list[name].src = cfs.getSrcPath(file);
	    		//this.list[name].load();
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
}();

var initCoordinateSys = function(){
    mse.coords = {};
    mse.coorRatio = 1;
    mse.joinCoor = function(coor) {
        if(isNaN(coor)) return "";
        var cid = 0;
        for (var i in mse.coords) {
            if (coor == mse.coords[i]) return i;
            
            var reg = i.match(/cid(\d+)/);
            if(reg[1]) var id = parseInt(reg[1]);
            if(!isNaN(id) && id >= cid) cid = id + 1;
        }
        var key = "cid"+cid;
        mse.coords[key] = mse.coorRatio == 1 ? coor : parseFloat(new Number(mse.coorRatio * coor).toFixed(2));
        return key;
    };
    mse.coor = function(key) {
        if(isNaN(mse.coords[key])) return 0;
        else return mse.coords[key];
    };
    mse.realCoor = function(coor) {
        if(isNaN(coor)) return 0;
        else return mse.coorRatio == 1 ? coor : parseFloat(new Number(mse.coorRatio * coor).toFixed(2));
    };
}();

function changeCoords() {
    mse.coorRatio = MseConfig.pageHeight / mse.coords['cid1'];
    for(var i in mse.coords) {
        mse.coords[i] = parseFloat(new Number(mse.coorRatio * mse.coords[i]).toFixed(2));
    }
    if(window.autoFitCallback) window.autoFitCallback();
    window.autoFitCallback = null;
}

mse.autoFitToWindow = function(f) {
    if(f) window.autoFitCallback = f;
    if(mse.coords['cid1']) {
        if(MseConfig.pageHeight > 250) changeCoords();
        else setTimeout(mse.autoFitToWindow, 1000);
    }
}

mse.init = function(configs) {
	$.extend(cfs, configs);

    mse.src.init();
	mse.src.addSource('imgNotif', './UI/turn_comp.png', 'img');
	mse.src.addSource('fbBar', './UI/barre/fb.png', 'img');
	mse.src.addSource('wikiBar', './UI/barre/wiki.png', 'img');
	mse.src.addSource('aideBar', './UI/barre/aide.png', 'img');
	mse.src.addSource('wikiBn', './UI/button/wiki.png', 'img');
	mse.src.addSource('bookBn', './UI/button/book.png', 'img');
	mse.src.addSource('illuBn', './UI/button/illu.png', 'img');
	mse.src.addSource('audBn', './UI/button/audIcon.png', 'img');
	mse.src.addSource('accelerBn', './UI/button/accelere.png', 'img', true);
	mse.src.addSource('upBn', './UI/button/monter.png', 'img', true);
	mse.src.addSource('ralentiBn', './UI/button/ralenti.png', 'img', true);
	mse.src.addSource('downBn', './UI/button/descend.png', 'img', true);
	mse.src.addSource('playBn', './UI/button/play.png', 'img', true);
	mse.src.addSource('pauseBn', './UI/button/pause.png', 'img', true);
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
	    // Correction coordinates with root viewport
	    if(mse.root.viewport && evt && !evt.corrected && !isNaN(evt.offsetX)) {
	        evt.offsetX += mse.root.viewport.x;
	        evt.offsetY += mse.root.viewport.y;
	        evt.corrected = true;
	    }
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
			var ox = this.getX()+this.insideRec[0], oy = this.getY()+this.insideRec[1], w = this.insideRec[2], h = this.insideRec[3];
		}
		else var ox = this.getX(), oy = this.getY(), w = this.getWidth(), h = this.getHeight();
		
		if(x>ox-0.1*w && x<ox+1.1*w && y>oy-0.1*h && y<oy+1.1*h) return true;
		else return false;
	},
	
	// Z-index
	getZindex: function() {
		return this.zid ? this.zid : (this.parent ? this.parent.zid : 0);
	},
	
	// Container
	getContainer: function() {
		if(this instanceof mse.BaseContainer) return this;
		else if(this.parent) return this.parent.getContainer();
		else return mse.root.container;
	},
	
	setAlpha: function(a) {this.globalAlpha = a;},
	// Alpha composition
	getAlpha: function() {
		if(this.parent) {
		    var pa = this.parent.getAlpha();
		    return ((isNaN(pa)?1:pa) * this.globalAlpha);
		}
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
		    if(this.animes[i].block) block = true;
			if(this.animes[i].logic(delta))
			    // Delete finish animation
			    this.animes.splice(i,1);
		}
		if(block) return;
		
		if(this.gamewindow.logic(delta)) return;
		
		if(this.container) this.container.logic(delta);
	};
	
	this.draw = function() {
	    this.ctx.clearRect(0, 0, this.width, this.height);
		
        if(!this.gamewindow.isFullScreen()){
		    if(this.container) this.container.draw(this.ctx);
		    if(this.dest) this.dest.draw(this.ctx);
		}
		if(this.gamewindow.currGame) this.gamewindow.draw(this.ctx);
		
		for(var i in this.animes) this.animes[i].draw(this.ctx);
		
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
	
	if(MseConfig.iOS) this.setCenteredViewport();
	
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
	//this.video = video.flareVideo($('body'));
	this.video = video.hide();
	// Game element
	this.gamewindow = new mse.GameShower();
	
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
	
	if(MseConfig.iPhone) {
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
    	if(!MseConfig.iPhone || (orien != 'landscape' && orien != 'portrait')) return;
    	
    	this.orientation = orien;
    },
    orientChange: function(orien) {
    	__currContextOwner__ = mse.root;
    	// Normal state
    	if(orien == this.orientation) this.normal = true;
    	else this.normal = false;
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
    	
    	if(MseConfig.iPhone) {
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
    		ctx.drawImage(mse.src.getSrc('imgNotif'), (mse.root.width-50)/2, (mse.root.height-80)/2, 50, 80);
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
		if(this.parent instanceof mse.BaseContainer) this.parent.delLayer(this.name);
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
	this.styled = styled ? true : false;
	this.links = [];
	this.zid = 12;
	
	this.text = text;
	// Check if text real width is longer than object width, if true, wrap the text
	var ctx = mse.root.ctx;
	ctx.save();
	if(this.styled) ctx.font = this.font;
	else if(this.parent && this.parent.font) ctx.font = this.parent.font;
	else ctx.font = mse.configs.defaultFont;
	// Define lineHeight
	if(param.lineHeight) this.lineHeight = param.lineHeight;
	else this.lineHeight = checkFontSize(ctx.font)*1.2;
	// Wrap text
	if(ctx.measureText(this.text).width > this.width) {
	    this.lines = wrapText(this.text, ctx, this.width);
	    // Redefine height of text object
	    this.height = this.lineHeight * this.lines.length;
	}
	else this.lines = [this.text];
	ctx.restore();
	
	// Centralize the text
	if(this.textAlign == "center" && this.width > 0)
	    this.offx += this.width/2;
	
	//Integraion d'effets
	this.currentEffect = null;
	this.firstShow = false;
	
	this.visible = false;
};
extend(mse.Text, mse.UIObject);
$.extend(mse.Text.prototype, {
    toString: function() {
	    return "[object mse.Text]";
    },
    setText: function(text) {
        this.text = text;
        this.links.splice(0, this.links.length);
        // Check if text real width is longer than object width, if true, wrap the text
        var ctx = mse.root.ctx;
        ctx.save();
        if(this.styled) ctx.font = this.font;
        else if(this.parent && this.parent.font) ctx.font = this.parent.font;
        else ctx.font = mse.configs.defaultFont;
        // Wrap text
        if(ctx.measureText(this.text).width > this.width) {
            this.lines = wrapText(this.text, ctx, this.width);
            // Redefine height of text object
            this.height = this.lineHeight * this.lines.length;
        }
        else this.lines = [this.text];
        ctx.restore();
    },
    addLink: function(linkObj){
        var linkInit = false;
        var ctx = mse.root.ctx;
        var prevfont = ctx.font;
        ctx.font = mse.configs.defaultFont; 
        if(this.styled) {
            if(this.font) ctx.font = this.font;
            else if(this.parent && this.parent.font) ctx.font = this.parent.font;
        }   
        // Init link relative position
        for(var i in this.lines) {
            var index = this.lines[i].indexOf(linkObj.src);
            // Link found
            if(index >= 0) {
                var begin = this.lines[i].substring(0, index);
                linkObj.offx = ctx.measureText(begin).width;
                linkObj.offy = i * this.lineHeight;
                linkObj.width = ctx.measureText(linkObj.src).width;
                linkInit = true;
            }
        }
        ctx.font = prevfont;
        if(!linkInit) return;
        
        if(this.links.length == 0) {
            this.getContainer().evtDeleg.addListener(
            	'click', 
            	new mse.Callback(this.clicked, this), 
            	false, 
        		this);
        }
        
        // Audio auto play
        if(linkObj.type == 'audio')
        	this.evtDeleg.addListener('firstShow', new mse.Callback(linkObj.link.play, linkObj.link));
        
        linkObj.owner = this;
        this.links.push(linkObj); 
    },
    startEffect: function (dictEffectAndConfig) {
    	this.styled = true;
    	if(mse.initTextEffect) this.currentEffect = mse.initTextEffect(dictEffectAndConfig,this);
    },
    endEffect: function (){
    	this.currentEffect = null;
    },
    inObj: function(x, y) {
        if(!this.visible) return false;
        var ox = this.getX(), oy = this.getY(), w = this.getWidth(), h = this.getHeight();
        if(x>ox-0.1*w && x<ox+1.1*w && y>oy-0.1*h && y<oy+1.1*h) return true;
        else return false;
    },
    clicked: function(e) {
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
    	for(var i in this.links) {
    	    var link = this.links[i];
    		if(x >= link.offx-15 && x <= link.offx+link.width+15 && y >= link.offy && y <= link.offy+this.lineHeight+24) {
    		    switch(link.type) {
    		    case 'audio': link.link.play();break;
    		    case 'wiki': link.link.init(this.getContainer());break;
    		    case 'fb': window.open(linkObj.link);break;
    		    }
    		    break;
    		}
    	}
    },
    logic: function(delta){
    	if(this.currentEffect != null) this.currentEffect.logic(delta);
    },
    draw: function(ctx, x, y) {
        if(!this.firstShow) {
        	this.firstShow = true;
        	this.visible = true;
        	this.evtDeleg.eventNotif('firstShow');
        }
        
    	if(x!=null && y!=null) this.setPos(x, y);
    	var loc = [ this.getX(), this.getY() ];
    	
    	if(this.styled) {ctx.save();this.configCtxFlex(ctx);}
    	    
    	if(this.currentEffect != null) this.currentEffect.draw(ctx);
    	else {
    	    for(var i in this.lines) {
    	        ctx.fillText(this.lines[i], loc[0], loc[1]+this.lineHeight*i);
    	    }
    	    // Link inside
    	    for(var i in this.links) {
    	    	ctx.save();
    	    	ctx.fillStyle = linkColor[this.links[i].type];
    	    	ctx.fillText(this.links[i].src, loc[0]+this.links[i].offx, loc[1]+this.links[i].offy);
    	    	ctx.restore();
    	    }
    	}
    	
    	if(this.styled) ctx.restore();
    }
});



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
		
		this.ctrUI = new mse.Layer(null, this.zid+1, {pos:[this.getX()+(this.width-250)/2,mse.root.height-50], size:[250,50]});
		this.ctrUI.accelere = new mse.Image(this.ctrUI, {pos:[220,10],size:[30,30]}, 'accelerBn');
		this.ctrUI.ralenti = new mse.Image(this.ctrUI, {pos:[0,10],size:[30,30]}, 'ralentiBn');
		this.ctrUI.up = new mse.Image(this.ctrUI, {pos:[170,10],size:[30,30]}, 'upBn');
		this.ctrUI.down = new mse.Image(this.ctrUI, {pos:[50,10],size:[30,30]}, 'downBn');
		this.ctrUI.play = new mse.Image(this.ctrUI, {pos:[110,10],size:[30,30]}, 'playBn');
		this.ctrUI.pause = new mse.Image(this.ctrUI, {pos:[110,10],size:[30,30]}, 'pauseBn');
		this.ctrUI.tip = new mse.Text(null, {textBaseline:'middle',textAlign:'center',font:'italic 20px '+cfs.font,fillStyle:'#FFF'}, '', true);
		this.ctrUI.layer = this;
		this.ctrUI.draw = function(ctx) {
		    this.accelere.draw(ctx);
		    this.ralenti.draw(ctx);
		    this.up.draw(ctx);
		    this.down.draw(ctx);
		    if(this.layer.pause) this.play.draw(ctx);
		    else this.pause.draw(ctx);
			this.tip.draw(ctx);
		};
		
		this.ctrUI.ctrEffect = function(e) {
			if(this.ralenti.inObj(e.offsetX, e.offsetY)) {
				// Left button clicked, Reduce the speed
				this.layer.interval += 200;
				this.layer.interval = (this.layer.interval > 2000) ? 2000 : this.layer.interval;
				this.tip.setText('moins rapide');
			}
			else if(this.accelere.inObj(e.offsetX, e.offsetY)) {
				// Right button clicked, augmente the speed
				this.layer.interval -= 200;
				this.layer.interval = (this.layer.interval < 600) ? 600 : this.layer.interval;
				this.tip.setText('plus rapide');
			}
			else if(this.play.inObj(e.offsetX, e.offsetY)) {
			    this.layer.pause = !this.layer.pause;
			    if(this.layer.pause) this.tip.setText('pause');
			    else this.tip.setText('reprendre'); 
			}
			else return;
			this.tip.globalAlpha = 1;
			mse.slideout(this.tip, 10, [[e.offsetX, e.offsetY], [e.offsetX, e.offsetY-50]]);
		};
		
		this.ctrUI.upDownStart = function(e) {
		    if(this.down.inObj(e.offsetX, e.offsetY)) {
		        // Down button clicked, scroll up the layer
		        this.layer.scrollEvt.rolled = -10;
		    }
		    else if(this.up.inObj(e.offsetX, e.offsetY)) {
		        // Up button clicked, scroll down the layer
		        this.layer.scrollEvt.rolled = 10;
		    }
		};
		this.ctrUI.upDownEnd = function(e) {
		    this.layer.scrollEvt.rolled = 0;
		};
		
		var cb = new mse.Callback(this.ctrUI.ctrEffect, this.ctrUI);
		this.getContainer().evtDeleg.addListener('click', cb, true, this.ctrUI);
		// Listener to scroll the layer with up down buttons
		this.getContainer().evtDeleg.addListener('gestureStart', new mse.Callback(this.ctrUI.upDownStart, this.ctrUI), true, this.ctrUI);
		this.getContainer().evtDeleg.addListener('gestureEnd', new mse.Callback(this.ctrUI.upDownEnd, this.ctrUI));
		
		// Key event for control of speed
		this.speedCtr = function(e) {
			switch(e.keyCode) {
			case __KEY_LEFT:
				this.interval += 100;
				this.interval = (this.interval > 2000) ? 2000 : this.interval;
				break;
			case __KEY_RIGHT:
				this.interval -= 100;
				this.interval = (this.interval < 600) ? 600 : this.interval;
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
	    if(!game.directShow) {
	        var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	        expose.setX(this.width*0.1);
	        this.addObject(expose);
	    }
	    else {
	        game.parent = this;
	        game.evtDeleg.addListener('firstShow', new mse.Callback(game.start, game));
	        this.addObject(game);
	    }
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
	    if(!game.directShow) {
	        var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	        expose.setX(this.width*0.1);
	        this.insertObject(expose, index);
	    }
	    else {
	        game.parent = this;
	        game.evtDeleg.addListener('firstShow', new mse.Callback(game.start, game));
	        this.insertObject(game, index);
	    }
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
			for(var i = this.startId; i < start; i++) {
				this.objList[i].evtDeleg.eventNotif('disapear');
				if(this.objList[i].visible === true) this.objList[i].visible = false;
			}
		}
		else if(start < this.startId) {
			for(var i = start; i < this.startId; i++) {
				this.objList[i].evtDeleg.eventNotif('show');
				if(this.objList[i].visible === false) this.objList[i].visible = true;
			}
		}
		if(end > this.endId) {
			for(var i = this.endId+1; i <= end; i++) {
				this.objList[i].evtDeleg.eventNotif('show');
				if(this.objList[i].visible === false) this.objList[i].visible = true;
			}
		}
		else if(end < this.endId) {
			for(var i = end+1; i <= this.endId; i++) {
				this.objList[i].evtDeleg.eventNotif('disapear');
				if(this.objList[i].visible === true) this.objList[i].visible = false;
			}
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
			var dt = (this.currIndex!=0 && this.objList[this.currIndex-1] instanceof mse.Image) ? 4000 : this.interval;
			if(this.currTime >= dt) {
				this.currTime = 0;
				// Move layer to right place
				if(this.currIndex < this.objList.length) {
					var focusy = this.objList[this.currIndex].offy + this.objList[this.currIndex].height/2;
					var nbfr = this.objList[this.currIndex].height/4;
					if(nbfr < 15) nbfr = 15;
					else if(nbfr > 70) nbfr = 70;
					if(focusy > mse.root.height/2) {
						var move = new mse.KeyFrameAnimation(this, {
								frame	: [0, nbfr],
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
				this.addObject( new mse.Text( this, {size:[this.width, this.lineHeight], 'lineHeight':this.lineHeight}, arr[i].substr(j, next) ) );
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
    	if(mse.initImageEffect) this.currentEffect = mse.initImageEffect(dictEffectAndConfig,this);
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
    drawFrame: function(frame, ctx, ox, oy){
        this.configCtxFlex(ctx);
        if(isNaN(ox)) var ox = this.getX();
        if(isNaN(oy)) var oy = this.getY();
        var img = mse.src.getSrc(this.img);
        if(!this.frames) {
        	var x = this.sx + (frame % this.col) * this.fw;
        	var y = this.sy + (Math.floor(frame / this.col)) * this.fh;
        	ctx.drawImage(img, x, y, this.fw,this.fh, ox,oy, this.getWidth(), this.getHeight());
        }
        else {
        	var x = this.frames[frame][0]; var y = this.frames[frame][1];
        	var fw = this.frames[frame][2]; var fh = this.frames[frame][3];
        	ctx.drawImage(img, x, y, fw,fh, ox,oy, this.getWidth(), this.getHeight());
        }
    },
    draw: function(ctx, ox, oy) {
    	this.drawFrame(this.curr, ctx, ox, oy);
    }
});



// Game object
mse.Game = function(params) {
    this.offx = 0.2*mse.root.width;
    this.offy = 0.2*mse.root.height;
    this.width = 0.6*mse.root.width;
    this.height = 0.6*mse.root.height;
    
    mse.UIObject.call(this, null, params);
    
    if(params) {
        this.fillback = params.fillback ? true : false;
    }
    this.type = "DEP";
    this.directShow = false;
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
    setDirectShow: function(direct) {
        this.directShow = direct;
    },
    addTo: function(layer) {
        this.parent = layer;
        this.setPos(0,0);
        this.setSize(layer.getWidth(), layer.getHeight());
        layer.addObject(this);
    },
    start: function() {
    	mse.root.container.evtDeleg.setDominate(this);
        if(!this.directShow) mse.root.gamewindow.loadandstart(this);
        else this.init();
    },
    draw: function(ctx) {},
    end: function() {
        if(!this.directShow) mse.root.gamewindow.end();
        else mse.root.container.evtDeleg.setDominate(null);
        if(this.expo) this.expo.endGame();
    },
    lose: function() {
        if(!this.directShow) mse.root.gamewindow.lose();
    },
    init: function(){},
    mobileLazyInit: function() {}
});


// GameShower object, window of the games, one object for all the games
mse.GameShower = function() {
	// Super constructor
	mse.UIObject.call(this, null, {});
	
	this.currGame = null;
	this.globalAlpha = 0;
	this.state = "DESACTIVE";
	mse.src.addSource('gameover', './UI/gameover.jpg', 'img', true);
	this.loseimg = new mse.Image(this, {pos:[0,0]}, 'gameover');
	this.losetext = new mse.Text(this, {font:'Bold 36px '+mse.configs.font,fillStyle:'#FFF',textBaseline:'middle',textAlign:'center'},'Perdu ...',true);
	this.losetext.evtDeleg.addListener('show', new mse.Callback(this.losetext.startEffect, this.losetext, {"typewriter":{speed:2}}));
	this.passBn = new mse.Button(this, {size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue plus', 'wikiBar');
	this.restartBn = new mse.Button(this, {size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je rejoue', 'aideBar');
	this.firstShow = false;
	
	this.isFullScreen = function() {
	     if(MseConfig.iPhone && this.state == "START" && this.currGame && this.currGame.type == "INDEP")
	         return true;
	     else return false;
	};
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
	    this.restartBn.setPos(this.currGame.width-115, this.currGame.height-50);
	    this.passBn.setPos(10, this.currGame.height-50);
	    // Init game
	    this.currGame.init();
	    this.state = "START";
	};
	this.loadandstart = function(game) {
	    this.load(game);
	    this.start();
	};
	this.restart = function(e){
	    if(this.passBn.inObj(e.offsetX, e.offsetY)) {
	        this.currGame.end();
	        mse.root.evtDistributor.removeListener('click', cbrestart);
	    }
	    else if(this.restartBn.inObj(e.offsetX, e.offsetY)) {
	        this.state = "START";
	        this.currGame.init();
	        mse.root.evtDistributor.removeListener('click', cbrestart);
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
	    else if(MseConfig.iPhone && MseConfig.orientation != "landscape") return true;
	    else this.currGame.logic(delta);
	    return true;
	};
	this.draw = function(ctx) {
	    if(this.globalAlpha < 0.1) return;
	    
	    this.configCtxFlex(ctx);
	    
	    // Border
	    if(!MseConfig.iPhone){
	        if(this.currGame.fillback) {
	            ctx.fillStyle = "#000";
	            ctx.shadowColor ="black";
	            ctx.shadowBlur = 20;
	            ctx.fillRect(this.offx, this.offy, this.width, this.height);
	            ctx.shadowBlur = 0;
	        }
	        else {
	            ctx.strokeStyle = "rgb(188,188,188)";
	            ctx.lineWidth = 5;
	            ctx.strokeRect(this.offx-2.5, this.offy-2.5, this.width, this.height);
	            ctx.lineWidth = 1;
	        }
	    }
	    
	    if(this.currGame.type == "INDEP" && MseConfig.iPhone && MseConfig.orientation != "landscape") {
	        // Draw orientation change notification page
	        ctx.drawImage(mse.src.getSrc('imgNotif'), (mse.root.width-50)/2, (mse.root.height-80)/2, 50, 80);
	    }
	    else if(this.state == "START") {
	        if(!this.firstShow){
	            this.firstShow = true;
	            if(this.currGame.type == "INDEP") {
	                this.evtDeleg.eventNotif("firstShow");
	                if(MseConfig.iPhone){
	                    this.currGame.setPos(mse.root.viewport.x,mse.root.viewport.y);
	                    this.currGame.setSize(480, 270);
	                    this.currGame.mobileLazyInit();
	                }
	            }
	        }
    	    this.currGame.draw(ctx);
    	}
    	else if(this.state == "LOSE") {
    	    //this.loseimg.draw(ctx);
    	    ctx.fillStyle = "#000";
    	    ctx.fillRect(this.offx+5, this.offy+5, this.width-10, this.height-10);
    	    this.losetext.draw(ctx);
    	    this.passBn.draw(ctx);
    	    this.restartBn.draw(ctx);
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
    this.passBn = new mse.Button(this, {pos:[10,this.height-60],size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue pas', 'wikiBar');
    
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
	if(!MseConfig.iOS)
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
        window.open(this.link);
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



mse.Card = function(parent, param, ui) {
    mse.UIObject.call(this, parent, param);
    this._layers = new Array();
    
    this.ui = ui;
    if(ui) this.addLayer('ui', ui);
    this.margin = [15, 15, 15, 15];
    // Angle between -10 and 10
    this.angle = randomInt(20) - 10;
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
        if(!this.ui)
            this.drawDefaultUI(ctx, this.getX(), this.getY());
    },
    drawDefaultUI: function(ctx, x, y) {
        ctx.fillStyle = "rgb(252,250,242)";
        ctx.shadowColor ="black";
        ctx.shadowBlur = 10;
        //ctx.strokeStyle = "#4d4d4d";
        //ctx.lineWidth = 1;
        ctx.fillRoundRect(x, y, this.width, this.height, 20);
        //ctx.strokeRoundRect(x, y, this.width, this.height, 16);
        ctx.shadowBlur = 0;
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
        if(!this.ui) this.drawDefaultUI(ctx, 0, 0);
        if(!this.img) return;
        
        ctx.shadowColor ="black";
        ctx.shadowBlur = 7;
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
        if(!this.ui) this.drawDefaultUI(ctx, 0, 0);
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
    					var x = Math.floor(this.calTrans[trans](ratio, curr[0], next[0])*2)/2;
    					var y = Math.floor(this.calTrans[trans](ratio, curr[1], next[1])*2)/2;
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
	else mse.UIObject.call(this, container, param?param:{});
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
            if(this.statiq) obj.parent = this;
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
        else if(!this.statiq && $.inArray(this, mse.root.animations) == -1) {
            for(var i in this.animes)
                this.animes[i].resetAnimation();
            mse.root.animations.push(this);
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
        	    
        	for(var i in this.animes){
        	    if(!this.animes[i].isEnd())
        	        return false;
        	}
        	this.state = 0;
        	return false;
        }
        else {
            this.evtDeleg.eventNotif('end');
            return true;
        }
    },
    draw: function(ctx){
        for(var key in this.objs)
            this.objs[key].draw(ctx);
    }
});



window.mse = mse;

})(window, $);

// System of script
(function (mse, $) {

	var defaultEvents = ['click', 'doubleClick', 'longPress', 'move', 'swipe', 'gestureStart', 'gestureUpdate', 'gestureEnd', 'gestureSingle', 'keydown', 'keypress', 'keyup', 'scroll', 'swipeleft', 'swiperight'];
	
	mse.Script = function(cds) {
	    if(!cds) return;
		this.scripts = [];
		this.states = {};
		this.expects = {};
		this.success = {};
		
		// Initialize script
		for(var i in cds) {
			var id = "c"+i;
			this.states[id] = cds[i].initial ? cds[i].expect : "";
			this.expects[id] = cds[i].expect ? cds[i].expect : "everytime";
			this.success[id] = false;
			var src = cds[i].src;
			if($.inArray(cds[i].type, defaultEvents)!=-1 && !(cds[i].src instanceof mse.BaseContainer)) {
			    src = src.getContainer();
			    src.evtDeleg.addListener(cds[i].type, new mse.Callback(this.conditionChanged, this, [id]), false, cds[i].src);
			}
			else 
			    src.evtDeleg.addListener(cds[i].type, new mse.Callback(this.conditionChanged, this, [id]), false);
		}
	};
	mse.Script.prototype = {
	    constructor: mse.Script,
	    invoke: function() {
	        for(var i in this.scripts) {
//			    if(this.scripts[i].delay) setTimeout(this.scripts[i].delay, );
				if(typeof(this.scripts[i].script) == 'function') this.scripts[i].script.call(this);
				else this.scripts[i].script.invoke();
	        }
		},
		checkConditions: function() {
			for(var i in this.success)
				if(!this.success[i]) return;
				
			this.invoke();
		},
		conditionChanged: function(id, state) {
			if(this.expects[id] == "everytime" || (this.expects[id]== "once" && this.states[id] != "triggered")) {
				this.success[id] = true;
				this.checkConditions();
			}
			this.states[id] = (typeof(state)=="string" ? state : "triggered");
		},
		register: function(script, delay) {
		    if((script.invoke instanceof mse.Callback) || typeof(script) == 'function') {
		        this.scripts.push({'script':script, 'delay':delay?delay:0});
		    }
		}
	};


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


})(window, mse);// effet : affectation des effets sur le texte ou l'image
(function( mse ){

__KEY_S	= 83;
__KEY_D	= 68;
__KEY_O = 79;
__KEY_N = 78;
__KEY_B = 66;
__KEY_V = 86;
__KEY_C = 67;
__E = 0.000001;

Number.prototype.toHexString = function(){
	return this.toString(16);
}

/*******************************************************************/
mse.EffectScreen = function (){
	this.cbProcess = new mse.Callback(this.process,this);
};
mse.EffectScreen.prototype = {
	constructor	: mse.EffectScreen,
	config : {} ,
	startEffect : function(){
		mse.root.evtDistributor.addListener('drawover', this.cbProcess);
	},
	process : function(ctx){},
	endEffect : function(){
		mse.root.evtDistributor.removeListener('drawover', this.cbProcess);
	},
	toString : function(){return "[object mse.EffectScreen]"}
};
/*******************************************************************/
mse.ESDropdownByCss = function (config){
	mse.EffectScreen.call(this);
	
	this.config = {
		target : 'book',
		duration : 500,
		g : 9.8
	};
	
	if(config)$.extend(this.config,config);	
	
	this.count = 0;
	var canvas = document.getElementById(this.config.target);
	this.defaultLeft = checkFontSize(canvas.style.left);
	this.defaultTop = checkFontSize(canvas.style.top);

    this.markFalling = true;
           
	this.buffH = 0;
    this.g = this.config.g;
    this.h = 0;
    this.Vo = 0;
    this.Vt = 0;
    this.t = 0;	
};
extend(mse.ESDropdownByCss,mse.EffectScreen);
$.extend(mse.ESDropdownByCss.prototype, {
	label : "dropdownByCss",
	process : function(ctx){
        if(this.markFalling)this.falling();
        else this.rising();
        
		mse.root.setPos(this.defaultLeft,this.h-ctx.canvas.height);
		
        this.count++; this.t++;
        if(this.count > this.config.duration) this.endEffect();
	},
    falling : function(){
        this.Vt = this.Vo + this.g*this.t;
        this.h = this.buffH + 0.5*this.g*this.t*this.t;
        if(this.h > 600){
            this.h = 600;
            this.t = 0;
            this.Vo = this.Vt/1.7;
            this.markFalling = false;
        }
    },
    rising : function(){
        this.Vt = this.Vo + (-this.g)*this.t;
        this.h = 600 - (this.Vt*this.Vt - this.Vo*this.Vo)/(2*(-this.g));
        if(this.Vt < 0){
            this.buffH = this.h;
            this.t = 0;
            this.Vo = 0;
            this.markFalling = true;           
        }
    },
	toString : function(){
		return this.label;
	}
});
	
/*******************************************************************/
mse.EffectText = function (subject,config,multi) {
	this.config = config;
	this.subject = subject;	
	this.multi = multi;
};
mse.EffectText.prototype = {
	constructor	: mse.EffectText,
	config : {} ,
	draw : function(ctx){},
	logic : function(delta){},
	toString : function(){return "[object mse.EffectText]"}
};
/*******************************************************************/
mse.ETFade = function(subject,config,multi) {
	mse.EffectText.call(this,subject,config,multi);
	this.count = 0;
	
	this.config = {
		duration : 30,
		start : 0,
		end : 1
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETFade,mse.EffectText);
$.extend(mse.ETFade.prototype, {
	label : "fade",
	logic : function(delta){
		if(this.count <= this.config.duration){
			this.subject.globalAlpha = this.config.start + (this.count/this.config.duration)*(this.config.end-this.config.start);
			this.count++;
			if(this.multi) return true;
		}
		else{
			if(this.multi) return false;
			this.subject.endEffect();
		}
	},
	draw : function (ctx){
		ctx.fillText(this.subject.text,this.subject.getX(),this.subject.getY());
	},
	toString : function(){
		return this.label;
	}
});

/*******************************************************************/
mse.ETTypewriter = function(subject,config,multi) { //Effect Type 4
	mse.EffectText.call(this,subject,config,multi);
	
	this.indice = 0;
	this.phraseAffichage = "";
	this.controlSpeed = 0;
	this.alphabetsDePhrase = this.subject.text.split('');
	
	this.config = {
		speed : 1
	};
	
	if(config)$.extend(this.config,config);
	this.config.speed = this.config.speed - 1;
};
extend(mse.ETTypewriter,mse.EffectText);
$.extend(mse.ETTypewriter.prototype, {
	label : "typewriter",
	logic : function(delta){
		if(this.indice != this.alphabetsDePhrase.length){
			if(this.config.speed == this.controlSpeed){
				this.phraseAffichage += this.alphabetsDePhrase[this.indice];
				this.indice++;
				this.controlSpeed = 0;
			}
			else this.controlSpeed++;
			if(this.multi) return true;
		}
		else{
			//this.subject.fillStyle = "#78A8FF";
			//this.subject.strokeStyle = "blue";
			if(this.multi) return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx){
		ctx.fillText(this.phraseAffichage,this.subject.getX(),this.subject.getY());
	},
	toString : function(){
		return this.label;
	}	
});
/*******************************************************************/
mse.MultiEffectContainer = function (subject,dictObjEffects){
	mse.EffectText.call(this,subject);
	this.dictObjEffects = dictObjEffects;
	this.arrayEffectName = Object.keys(this.dictObjEffects);
	
	this.filtered = this.filterEffect(this.arrayEffectName);	
};
extend(mse.MultiEffectContainer,mse.EffectText);
$.extend(mse.MultiEffectContainer.prototype, {
	label : "multieffect",
	classification : {
		"fadein" : "param",
		"colored" : "param",
		"zoomtext" : "zoom",
		"flytext" : "trajet",
		"painttext" : "imageData",
		"typewriter" : "content",
		"twisttext" : "content",
		"twistmultitext" : "content"
	},
	conflict : {
		"param" : [],
		"zoom" : ["imageData"],
		"trajet" : ["imageData","content","trajet"],
		"imageData" : ["trajet","zoom","content","imageData"],
		"content" : ["imageData","trajet","content"]		
	},
	filterEffect : function (listEffect){
		var principalDraw = null;
		var conflictArray = new Array();
		var filteredEffectArray = new Array();
		
		for(var i=0; i<listEffect.length; i++){
			var typeEffect = mse.MultiEffectContainer.prototype.classification[listEffect[i]];
			var flagDelete = false;
			
			for(var checkConflict in conflictArray){
				if(conflictArray[checkConflict] == typeEffect){
					delete listEffect[i];
					flagDelete = true;
					break;
				}
			}
				
			if(!flagDelete){
				filteredEffectArray.push(listEffect[i]);
				conflictArray = conflictArray.concat(mse.MultiEffectContainer.prototype.conflict[typeEffect]);
				//Determine the type of draw
				switch(typeEffect){
					case "trajet" :
					case "imageData" :
					case "content" : principalDraw = listEffect[i];break;
					default : if(null == principalDraw)principalDraw = listEffect[i];break;
				}
			}
		}
		return {"filteredEffectArray":filteredEffectArray,"principalDraw": principalDraw};		
	},
	logic : function(delta){
		var endMultiEffect = true;
		for(var effect in this.filtered["filteredEffectArray"]){
			if(this.dictObjEffects[this.filtered["filteredEffectArray"][effect]].logic(delta))endMultiEffect = false;
		}
		if(endMultiEffect)this.subject.endEffect();
	},
	draw : function (ctx){
		this.dictObjEffects[this.filtered["principalDraw"]].draw(ctx);
	},
	toString : function(){
		return this.label;
	}	
});
/*******************************************************************/
mse.initTextEffect = function (effectConf,subject) {
	if(Object.keys(effectConf).length < 2){
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fade" : return (new mse.ETFade(subject,effectConf[nEffect],false));
				case "colored": return (new mse.ETColored(subject,effectConf[nEffect],false));
				case "typewriter": return (new mse.ETTypewriter(subject,effectConf[nEffect],false));
				case "painttext": return (new mse.ETPainttext(subject,effectConf[nEffect],false));
				case "flytext": return (new mse.ETFlytext(subject,effectConf[nEffect],false));
				case "zoomtext" : return (new mse.ETZoomtext(subject,effectConf[nEffect],false));
				case "twisttext" : return (new mse.ETTwisttext(subject,effectConf[nEffect],false));
				case "twistmultitext" : return (new mse.ETTwistMultiText(subject,effectConf[nEffect],false));
				default : return null;
			}
		}
		return null;
	}
	else{
		var dictObjEffects = {};
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fade" : dictObjEffects[nEffect] = new mse.ETFade(subject,effectConf[nEffect],true);break;
				case "colored": dictObjEffects[nEffect] = new mse.ETColored(subject,effectConf[nEffect],true);break;
				case "typewriter": dictObjEffects[nEffect] = new mse.ETTypewriter(subject,effectConf[nEffect],true);break;
				case "painttext": dictObjEffects[nEffect] = new mse.ETPainttext(subject,effectConf[nEffect],true);break;
				case "flytext": dictObjEffects[nEffect] = new mse.ETFlytext(subject,effectConf[nEffect],true);break;
				case "zoomtext": dictObjEffects[nEffect] = new mse.ETZoomtext(subject,effectConf[nEffect],true);break;
				case "twisttext": dictObjEffects[nEffect] = new mse.ETTwisttext(subject,effectConf[nEffect],true);break;
				case "twistmultitext": dictObjEffects[nEffect] = new mse.ETTwistMultiText(subject,effectConf[nEffect],true);break;
				default: break;
			}
		}
		return new mse.MultiEffectContainer(subject,dictObjEffects);
	}
};
/*******************************************************************/
mse.EffectImage = function (subject,config,multi) {
	this.config = config;
	this.subject = subject;	
	this.multi = multi;
};
mse.EffectImage.prototype = {
	constructor	: mse.EffectImage,
	config : {} ,
	draw : function(ctx,x,y){},
	logic : function(delta){},
	toString : function(){return "[object mse.EffectImage]"}
};
/*******************************************************************/
mse.MultiImageEffectContainer = function (subject,dictObjEffects){
	mse.EffectImage.call(this,subject);
	this.dictObjEffects = dictObjEffects;
	this.arrayEffectName = Object.keys(this.dictObjEffects);
	
	this.filtered = this.filterEffect(this.arrayEffectName);	
};
extend(mse.MultiImageEffectContainer,mse.EffectImage);
$.extend(mse.MultiImageEffectContainer.prototype, {
	label : "multieffectImage",
	conflict : {
		"param" : [],
		"weather" : ["weather","pixel","candle"],
		"pixel" : ["pixel","weather","candle"],
		"candle" : ["pixel","weather"]
	},
	classification : {
		"fade" : "param",
		"snow" : "weather",
		"rain" : "weather",
		"fog" : "weather",
		"erase" : "pixel",
		"vibration" : "weather",
		"colorswitch" : "pixel",
		"blur" : "pixel",
		"sunrise" : "pixel",
		"lightcandle" : "candle"
	},
	filterEffect : function (listEffect){
		var principalDraw = null;
		var conflictArray = new Array();
		var filteredEffectArray = new Array();
		
		for(var i=0; i<listEffect.length; i++){
			var typeEffect = mse.MultiImageEffectContainer.prototype.classification[listEffect[i]];
			var flagDelete = false;
			
			for(var checkConflict in conflictArray){
				if(conflictArray[checkConflict] == typeEffect){
					delete listEffect[i];
					flagDelete = true;
					break;
				}
			}
				
			if(!flagDelete){
				filteredEffectArray.push(listEffect[i]);
				conflictArray = conflictArray.concat(mse.MultiImageEffectContainer.prototype.conflict[typeEffect]);
				//Determine the type of draw
				switch(typeEffect){
					case "pixel" :
					case "weather" : principalDraw = listEffect[i];break;
					default : if(null == principalDraw)principalDraw = listEffect[i];break;
				}
			}
		}
		return {"filteredEffectArray":filteredEffectArray,"principalDraw": principalDraw};		
	},
	logic : function(delta){
		var endMultiEffect = true;
		for(var effect in this.filtered["filteredEffectArray"]){
			if(this.dictObjEffects[this.filtered["filteredEffectArray"][effect]].logic(delta))endMultiEffect = false;
		}
		if(endMultiEffect)this.subject.endEffect();
	},
	draw : function (ctx,x,y){
		this.dictObjEffects[this.filtered["principalDraw"]].draw(ctx,x,y);
	},
	toString : function(){
		return this.label;
	}	
});
/*******************************************************************/
mse.initImageEffect = function (effectConf,subject) {
	if(Object.keys(effectConf).length < 2){
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fade" : return (new mse.EIFade(subject,effectConf[nEffect],false));
				case "snow" : return (new mse.EISnow(subject,effectConf[nEffect],false));
				case "rain" : return (new mse.EIRain(subject,effectConf[nEffect],false));
				case "fog" : return (new mse.EIFog(subject,effectConf[nEffect],false));
				case "colorswitch" : return (new mse.EIColorSwitch(subject,effectConf[nEffect],false));
				case "blur" : return (new mse.EIBlur(subject,effectConf[nEffect],false));
				case "lightcandle" : return (new mse.EILightcandle(subject,effectConf[nEffect],false));
				case "erase" : return (new mse.EIErase(subject,effectConf[nEffect],false));
				case "vibration" : return (new mse.EIVibration(subject,effectConf[nEffect],false));
				case "sunrise" : return (new mse.EISunrise(subject,effectConf[nEffect],false));
				default : return null;				
			}
		}
		return null;
	}
	else{
		var dictObjEffects = {};
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fade" : dictObjEffects[nEffect] = new mse.EIFade(subject,effectConf[nEffect],true);break;
				case "snow": dictObjEffects[nEffect] = new mse.EISnow(subject,effectConf[nEffect],true);break;
				case "rain": dictObjEffects[nEffect] = new mse.EIRain(subject,effectConf[nEffect],true);break;
				case "fog": dictObjEffects[nEffect] = new mse.EIFog(subject,effectConf[nEffect],true);break;
				case "colorswitch": dictObjEffects[nEffect] = new mse.EIColorSwitch(subject,effectConf[nEffect],true);break;
				case "blur": dictObjEffects[nEffect] = new mse.EIBlur(subject,effectConf[nEffect],true);break;
				case "lightcandle": dictObjEffects[nEffect] = new mse.EILightcandle(subject,effectConf[nEffect],true);break;
				case "erase": dictObjEffects[nEffect] = new mse.EIErase(subject,effectConf[nEffect],true);break;
				case "vibration": dictObjEffects[nEffect] = new mse.EIVibration(subject,effectConf[nEffect],true);break;
				case "sunrise": dictObjEffects[nEffect] = new mse.EISunrise(subject,effectConf[nEffect],true);break;
				default: break;
			}
		}
		return new mse.MultiImageEffectContainer(subject,dictObjEffects);
	}
};
/*******************************************************************/
mse.distance = function (x1,y1,x2,y2) {
		var X = Math.abs(x1 - x2);
		var Y = Math.abs(y1 - y2);	
		return Math.sqrt(X*X + Y*Y);
};
/*******************************************************************/
mse.sin = function (t,A,w,c) {
		if(undefined == A)A = 1;
		if(undefined == w)w = 1;
		if(undefined == c)c = 0;
		return (A*Math.sin(w*t*(Math.PI/180))+c);
};
/*******************************************************************/
mse.cos = function (t,A,w,c) {
		if(undefined == A)A = 1;
		if(undefined == w)w = 1;
		if(undefined == c)c = 0;
		return (A*Math.cos(w*t*(Math.PI/180))+c);
};
/*******************************************************************/
mse.min3num = function(a,b,c){
	var temp = a;
	if(a>b) temp = b;
	if(temp>c) return c;
	else return temp;
}
/*******************************************************************/
mse.max3num = function(a,b,c){
	var temp = a;
	if(a<b) temp = b;
	if(temp<c) return c;
	else return temp;
}
/*******************************************************************/
mse.rgb_hsl = function(R,G,B){
	var min, max;
	var convR = R/255.0; var convG = G/255.0; var convB = B/255.0;
	var H,S,L;
	
	min = mse.min3num(convR,convG,convB);
	max = mse.max3num(convR,convG,convB);
	
	if(Math.abs(max-min) <= __E)H = 0.0;
	else if(Math.abs(max-convR) <= __E){
		H = 60.0*((convG-convB)/(max-min))+360.0;
		if(H > 360) H -= 360.0;
	}
	else if(Math.abs(max-convG) <= __E){
		H = 60.0*((convB-convR)/(max-min))+120.0;
	}
	else if(Math.abs(max-convB) <= __E){
		H = 60.0*((convR-convG)/(max-min))+240.0;	
	}
	else return false;
	
	if(Math.abs(max) <= __E) S = 0;
	else S = (max-min)/max;
	
	L = max;
	
	S = S*255.0;
	L = L*255.0;

	return [H,S,L];
}
/*******************************************************************/
mse.hsl_rgb = function(H,S,L){
	var f,p,q,u;
	var Hi;
	var R,G,B;
	
	var convS = S/255.0;
	var convL = L/255.0;
	
	Hi = (Math.floor(H/60.0))%6;
	f = (H/60.0) - Math.floor(H/60.0);
	
	p = convL*(1.0-convS);
	q = convL*(1.0-f*convS);
	u = convL*(1.0-(1.0-f)*convS);
	
	switch(Hi){
		case 0 : R=convL; G=u; B=p; break;
		case 1 : R=q; G=convL; B=p; break;
		case 2 : R=p; G=convL; B=u; break;
		case 3 : R=p; G=q; B=convL; break;
		case 4 : R=u; G=p; B=convL; break;
		case 5 : R=convL; G=p; B=q; break;
		default : return false;
	}
	
	R = R*255.0;
	G = G*255.0;
	B = B*255.0;
	
	return [R,G,B];
}
/*******************************************************************/
var FPS = 0;
var logger={ frameCount : 0 };

mse.showFPS = function(game){	
	if (game==null){
		return;
	}
	if (game.logger==null){
		game.logger={ frameCount : 0 };
	}
	var div=document.getElementById("fpsBar");
	if (div==null){
		div=document.createElement("div");
		document.body.appendChild(div);
		var style={
			backgroundColor:"rgba(0,0,0,0.5)",
			position:"absolute",
			left:"300px",
			top:"1px",
			color:"#fff",
			width:"100px",
			height:"30px",
			border:"solid 1px #ccc",
			fontSize:"22px",
			zIndex : 99999
		}
		for (var key in style){
			div.style[key]=style[key];
		}
	}
	function _core(){			
		div.innerHTML = "FPS:" + game.logger.frameCount;
		game.logger.frameCount = 0;	
	}
	setInterval(_core ,1000-1);
}
})(mse);mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":340,"cid7":590,"cid8":230,"cid9":10,"cid10":22.5,"cid11":30,"cid12":425,"cid13":37.5,"cid14":521.25}');initMseConfig();mse.init();function createbook(){mse.configs.srcPath='./Voodoo_Ch3/';var root = new mse.Root('Voodoo_Ch3',mse.coor('cid0'),mse.coor('cid1'),'portrait');var temp = {};var animes={};var games={};var wikis={};mse.src.addSource('src0','images/src0.jpeg','img',true);var pages = {};var layers = {};var objs = {};pages.Couverture=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});layers.Couverturedefault=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);pages.Titre=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});layers.Titredefault=new mse.Layer(pages.Titre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});pages.Titre.addLayer('Titredefault',layers.Titredefault);pages.Content=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});objs.obj0=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src0');layers.Contentdefault.addObject(objs.obj0);pages.Content.addLayer('Contentdefault',layers.Contentdefault);layers.mask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});objs.obj2=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"});layers.mask.addObject(objs.obj2);pages.Content.addLayer('mask',layers.mask);layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Verdana","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid11')},null);objs.obj3=new mse.UIObject(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]});layers.content.addObject(objs.obj3);objs.obj4=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Perdu. Simon était perdu.',true);layers.content.addObject(objs.obj4);objs.obj5=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il avait tourné à gauche. ',true);layers.content.addObject(objs.obj5);objs.obj6=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Puis à droite.',true);layers.content.addObject(objs.obj6);objs.obj7=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il s’était accroupi dans la ',true);layers.content.addObject(objs.obj7);objs.obj8=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'boue. Avait rampé sous des ',true);layers.content.addObject(objs.obj8);objs.obj9=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'grilles, des arches de pierre. ',true);layers.content.addObject(objs.obj9);objs.obj10=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il s’était enfoncé dans le ',true);layers.content.addObject(objs.obj10);objs.obj11=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ventre de la terre. ',true);layers.content.addObject(objs.obj11);objs.obj12=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Toujours plus loin. ',true);layers.content.addObject(objs.obj12);objs.obj13=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Par moments, les parois ',true);layers.content.addObject(objs.obj13);objs.obj14=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'étaient tellement friables ',true);layers.content.addObject(objs.obj14);objs.obj15=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'qu’elles s’effondraient au ',true);layers.content.addObject(objs.obj15);objs.obj16=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'moindre contact. À d’autres ',true);layers.content.addObject(objs.obj16);objs.obj17=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'endroits, c’était l’eau qui ',true);layers.content.addObject(objs.obj17);objs.obj18=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'envahissait tout. Un liquide ',true);layers.content.addObject(objs.obj18);objs.obj19=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'saumâtre, chargé de ',true);layers.content.addObject(objs.obj19);objs.obj20=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'particules dont il préférait ne ',true);layers.content.addObject(objs.obj20);objs.obj21=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pas connaître la provenance. ',true);layers.content.addObject(objs.obj21);objs.obj22=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Les galeries succédaient aux ',true);layers.content.addObject(objs.obj22);objs.obj23=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'galeries, toutes identiques, ',true);layers.content.addObject(objs.obj23);objs.obj24=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'creusées à même la roche. ',true);layers.content.addObject(objs.obj24);objs.obj25=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Impossible de se repérer ',true);layers.content.addObject(objs.obj25);objs.obj26=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dans ce dédale troglodyte où ',true);layers.content.addObject(objs.obj26);objs.obj27=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'régnait une moiteur ',true);layers.content.addObject(objs.obj27);objs.obj28=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'étouffante. ',true);layers.content.addObject(objs.obj28);objs.obj29=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon commençait à ',true);layers.content.addObject(objs.obj29);objs.obj30=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'désespérer. Il se demandait ',true);layers.content.addObject(objs.obj30);objs.obj31=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'même s’il n’aurait pas mieux ',true);layers.content.addObject(objs.obj31);objs.obj32=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'fait de rejoindre la Meute. ',true);layers.content.addObject(objs.obj32);objs.obj33=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Perché sur son épaule, Dark ',true);layers.content.addObject(objs.obj33);objs.obj34=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tentait de rasséréner son ',true);layers.content.addObject(objs.obj34);objs.obj35=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'maitre par quelques coups ',true);layers.content.addObject(objs.obj35);objs.obj36=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'de langue.',true);layers.content.addObject(objs.obj36);objs.obj37=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},' - Heureusement que tu es ',true);layers.content.addObject(objs.obj37);objs.obj38=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'là...',true);layers.content.addObject(objs.obj38);objs.obj39=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'L’adolescent interrogea les ',true);layers.content.addObject(objs.obj39);objs.obj40=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ténèbres à la lueur vacillante ',true);layers.content.addObject(objs.obj40);objs.obj41=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'de sa lampe.',true);layers.content.addObject(objs.obj41);objs.obj42=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Trois chatières s’ouvraient ',true);layers.content.addObject(objs.obj42);objs.obj43=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'face à lui. Trois boyaux qui ',true);layers.content.addObject(objs.obj43);objs.obj44=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pouvaient être autant de ',true);layers.content.addObject(objs.obj44);objs.obj45=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pièges.  ',true);layers.content.addObject(objs.obj45);objs.obj46=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},' - Eh bien, si tu as une idée, ',true);layers.content.addObject(objs.obj46);objs.obj47=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'je t’écoute. ',true);layers.content.addObject(objs.obj47);objs.obj48=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Aussitôt, comme s’il avait ',true);layers.content.addObject(objs.obj48);objs.obj49=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'compris, Dark abandonna ',true);layers.content.addObject(objs.obj49);objs.obj50=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'son perchoir et se coula à ',true);layers.content.addObject(objs.obj50);objs.obj51=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'terre. Il se dressa sur ses ',true);layers.content.addObject(objs.obj51);objs.obj52=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pattes postérieures, tendit le ',true);layers.content.addObject(objs.obj52);objs.obj53=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'museau et s’engouffra dans ',true);layers.content.addObject(objs.obj53);objs.obj54=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'le passage le plus étroit.',true);layers.content.addObject(objs.obj54);objs.obj55=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},' - Bon, ben je suppose qu’il ',true);layers.content.addObject(objs.obj55);objs.obj56=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ne me reste plus qu’à te ',true);layers.content.addObject(objs.obj56);objs.obj57=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'faire confiance…',true);layers.content.addObject(objs.obj57);objs.obj58=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Et Simon s’engagea à son ',true);layers.content.addObject(objs.obj58);objs.obj59=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tour dans le trou. La ',true);layers.content.addObject(objs.obj59);objs.obj60=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'progression était difficile, ',true);layers.content.addObject(objs.obj60);objs.obj61=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'laborieuse et les parois ',true);layers.content.addObject(objs.obj61);objs.obj62=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'semblaient se refermer peu ',true);layers.content.addObject(objs.obj62);objs.obj63=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'à peu sur lui. ',true);layers.content.addObject(objs.obj63);objs.obj64=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Soudain, une lueur. À ',true);layers.content.addObject(objs.obj64);objs.obj65=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'quelques mètres à peine. ',true);layers.content.addObject(objs.obj65);objs.obj66=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'S’il en avait été capable, ',true);layers.content.addObject(objs.obj66);objs.obj67=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon se serait frotté les ',true);layers.content.addObject(objs.obj67);objs.obj68=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'yeux. Mais ses bras étaient ',true);layers.content.addObject(objs.obj68);objs.obj69=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'coincés, tendus devant lui. ',true);layers.content.addObject(objs.obj69);objs.obj70=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Prudemment, il éteignit sa ',true);layers.content.addObject(objs.obj70);objs.obj71=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'torche.',true);layers.content.addObject(objs.obj71);objs.obj72=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'De la lumière. Ou plutôt, des ',true);layers.content.addObject(objs.obj72);objs.obj73=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'points lumineux. ',true);layers.content.addObject(objs.obj73);objs.obj74=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'L’adolescent accéléra sa ',true);layers.content.addObject(objs.obj74);objs.obj75=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'reptation. ',true);layers.content.addObject(objs.obj75);objs.obj76=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Des bougies. Par centaines. ',true);layers.content.addObject(objs.obj76);objs.obj77=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'C’est ce qu’il découvrit ',true);layers.content.addObject(objs.obj77);objs.obj78=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'lorsqu’il déboucha, enfin, ',true);layers.content.addObject(objs.obj78);objs.obj79=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dans une vaste cavité ',true);layers.content.addObject(objs.obj79);objs.obj80=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'soutenue par des ',true);layers.content.addObject(objs.obj80);objs.obj81=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'empilements de pierres ',true);layers.content.addObject(objs.obj81);objs.obj82=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'plates. ',true);layers.content.addObject(objs.obj82);objs.obj83=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'C’était la première fois ',true);layers.content.addObject(objs.obj83);objs.obj84=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'depuis des heures qu’il ',true);layers.content.addObject(objs.obj84);objs.obj85=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'découvrait un espace aussi ',true);layers.content.addObject(objs.obj85);objs.obj86=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'grand. Un espace dont il ne ',true);layers.content.addObject(objs.obj86);objs.obj87=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pouvait pas apercevoir les ',true);layers.content.addObject(objs.obj87);objs.obj88=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'limites malgré les flammes ',true);layers.content.addObject(objs.obj88);objs.obj89=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'qui vacillaient aux quatre ',true);layers.content.addObject(objs.obj89);objs.obj90=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'coins.',true);layers.content.addObject(objs.obj90);objs.obj91=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Épuisé, il se laissa glisser le ',true);layers.content.addObject(objs.obj91);objs.obj92=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'long d’un pilier.',true);layers.content.addObject(objs.obj92);objs.obj93=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Dark le fixait de ses yeux ',true);layers.content.addObject(objs.obj93);objs.obj94=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'rouges, comme s’il attendait ',true);layers.content.addObject(objs.obj94);objs.obj95=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'quelque chose.',true);layers.content.addObject(objs.obj95);objs.obj96=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},' - Mon vieux, tu es un ',true);layers.content.addObject(objs.obj96);objs.obj97=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'véritable champion, déclara ',true);layers.content.addObject(objs.obj97);objs.obj98=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon en fouillant dans son ',true);layers.content.addObject(objs.obj98);objs.obj99=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'sac. Je crois qu’il est grand ',true);layers.content.addObject(objs.obj99);objs.obj100=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'temps que nous fêtions cela.',true);layers.content.addObject(objs.obj100);objs.obj101=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Dans un large sourire, il ',true);layers.content.addObject(objs.obj101);objs.obj102=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'exhiba une barre de ',true);layers.content.addObject(objs.obj102);objs.obj103=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'céréales. Il arracha ',true);layers.content.addObject(objs.obj103);objs.obj104=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'l’emballage, cassa un ',true);layers.content.addObject(objs.obj104);objs.obj105=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'morceau qu’il tendit au ',true);layers.content.addObject(objs.obj105);objs.obj106=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'rongeur.  ',true);layers.content.addObject(objs.obj106);objs.obj107=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Dark émit quelques ',true);layers.content.addObject(objs.obj107);objs.obj108=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'couinements de satisfaction, ',true);layers.content.addObject(objs.obj108);objs.obj109=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tandis que l’adolescent ',true);layers.content.addObject(objs.obj109);objs.obj110=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'s’efforçait de mâcher ',true);layers.content.addObject(objs.obj110);objs.obj111=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'lentement. ',true);layers.content.addObject(objs.obj111);objs.obj112=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il ne sentit pas le sommeil ',true);layers.content.addObject(objs.obj112);objs.obj113=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'s’abattre sur ses épaules. ',true);layers.content.addObject(objs.obj113);objs.obj114=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il s’effondra d’un coup, ',true);layers.content.addObject(objs.obj114);objs.obj115=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'endormi.',true);layers.content.addObject(objs.obj115);objs.obj116=new mse.UIObject(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]});layers.content.addObject(objs.obj116);objs.obj117=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Des voix. Plusieurs, graves, ',true);layers.content.addObject(objs.obj117);objs.obj118=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'inquiétantes. ',true);layers.content.addObject(objs.obj118);objs.obj119=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Une langue inconnue et ',true);layers.content.addObject(objs.obj119);objs.obj120=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'des… des poules !?',true);layers.content.addObject(objs.obj120);objs.obj121=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon se réveilla en sursaut. ',true);layers.content.addObject(objs.obj121);objs.obj122=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Un cauchemar? Mais non, il ',true);layers.content.addObject(objs.obj122);objs.obj123=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ne rêvait pas. ',true);layers.content.addObject(objs.obj123);objs.obj124=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'À moins de vingt mètres de ',true);layers.content.addObject(objs.obj124);objs.obj125=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'lui, légèrement sur sa ',true);layers.content.addObject(objs.obj125);objs.obj126=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'gauche, un homme affublé ',true);layers.content.addObject(objs.obj126);objs.obj127=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'d’un haut de forme ',true);layers.content.addObject(objs.obj127);objs.obj128=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'psalmodiait. À ses pieds, une ',true);layers.content.addObject(objs.obj128);objs.obj129=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'poule noire tentait ',true);layers.content.addObject(objs.obj129);objs.obj130=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'vainement de s’échapper en ',true);layers.content.addObject(objs.obj130);objs.obj131=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tirant sur la corde qui la ',true);layers.content.addObject(objs.obj131);objs.obj132=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'retenait. ',true);layers.content.addObject(objs.obj132);objs.obj133=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Un peu plus loin, deux ',true);layers.content.addObject(objs.obj133);objs.obj134=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'femmes, la poitrine dénudée ',true);layers.content.addObject(objs.obj134);objs.obj135=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'enluminée de motifs blancs, ',true);layers.content.addObject(objs.obj135);objs.obj136=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dansaient en poussant des ',true);layers.content.addObject(objs.obj136);objs.obj137=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'cris.',true);layers.content.addObject(objs.obj137);objs.obj138=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'L’adolescent n’en croyait pas ',true);layers.content.addObject(objs.obj138);objs.obj139=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ses yeux. Il se recroquevilla ',true);layers.content.addObject(objs.obj139);objs.obj140=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dans l’ombre d’un pilier. ',true);layers.content.addObject(objs.obj140);objs.obj141=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'L’homme, torse nu sous une ',true);layers.content.addObject(objs.obj141);objs.obj142=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'redingote rouge, arborait un ',true);layers.content.addObject(objs.obj142);objs.obj143=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'maquillage effrayant : un ',true);layers.content.addObject(objs.obj143);objs.obj144=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'mélange d’ocres et de craie ',true);layers.content.addObject(objs.obj144);objs.obj145=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'qui recouvrait entièrement ',true);layers.content.addObject(objs.obj145);objs.obj146=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'sa peau noire, figurant ',true);layers.content.addObject(objs.obj146);objs.obj147=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'muscles et tendons comme ',true);layers.content.addObject(objs.obj147);objs.obj148=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'s’il était écorché. ',true);layers.content.addObject(objs.obj148);objs.obj149=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Les yeux révulsés, il chantait ',true);layers.content.addObject(objs.obj149);objs.obj150=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'une mélopée lugubre tout en ',true);layers.content.addObject(objs.obj150);objs.obj151=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'exécutant de grands cercles ',true);layers.content.addObject(objs.obj151);objs.obj152=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dans le vide à l’aide d’une ',true);layers.content.addObject(objs.obj152);objs.obj153=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'machette. Les danseuses, ',true);layers.content.addObject(objs.obj153);objs.obj154=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pour leur part, se ',true);layers.content.addObject(objs.obj154);objs.obj155=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'déplaçaient à l’intérieur d’un ',true);layers.content.addObject(objs.obj155);objs.obj156=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'curieux motif peint à même ',true);layers.content.addObject(objs.obj156);objs.obj157=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'le sol.',true);layers.content.addObject(objs.obj157);objs.obj158=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Un Vévé !',true);layers.content.addObject(objs.obj158);objs.obj159=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon se souvint soudain de ',true);layers.content.addObject(objs.obj159);objs.obj160=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'ce documentaire qu’il avait ',true);layers.content.addObject(objs.obj160);objs.obj161=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'vu au foyer. Une plongée ',true);layers.content.addObject(objs.obj161);objs.obj162=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'hallucinante en Haïti dans le ',true);layers.content.addObject(objs.obj162);objs.obj163=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'monde du Vaudou. ',true);layers.content.addObject(objs.obj163);objs.obj164=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Papa Legba. Celui qui ouvre ',true);layers.content.addObject(objs.obj164);objs.obj165=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'les portes. L’homme était ',true);layers.content.addObject(objs.obj165);objs.obj166=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'déguisé en Papa Legba ! ',true);layers.content.addObject(objs.obj166);objs.obj167=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Hypnotisé par le spectacle, ',true);layers.content.addObject(objs.obj167);objs.obj168=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'l’adolescent rampa pour se ',true);layers.content.addObject(objs.obj168);objs.obj169=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'rapprocher. Quelques ',true);layers.content.addObject(objs.obj169);objs.obj170=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'mètres. ',true);layers.content.addObject(objs.obj170);objs.obj171=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Soudain, les deux femmes ',true);layers.content.addObject(objs.obj171);objs.obj172=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'hurlèrent.',true);layers.content.addObject(objs.obj172);objs.obj173=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon sursauta et tenta de ',true);layers.content.addObject(objs.obj173);objs.obj174=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'réconforter Dark qui ',true);layers.content.addObject(objs.obj174);objs.obj175=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tremblait de tous ses ',true);layers.content.addObject(objs.obj175);objs.obj176=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'membres.',true);layers.content.addObject(objs.obj176);objs.obj177=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Elles se figèrent un instant ',true);layers.content.addObject(objs.obj177);objs.obj178=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'puis s’effondrèrent aux pieds ',true);layers.content.addObject(objs.obj178);objs.obj179=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'de l’homme.',true);layers.content.addObject(objs.obj179);objs.obj180=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Papa Legba leva alors son ',true);layers.content.addObject(objs.obj180);objs.obj181=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'bras armé et l’abattit sur le ',true);layers.content.addObject(objs.obj181);objs.obj182=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'pauvre gallinacé. Un flot ',true);layers.content.addObject(objs.obj182);objs.obj183=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'rouge se répandit à terre, ',true);layers.content.addObject(objs.obj183);objs.obj184=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'abreuvant le mystérieux ',true);layers.content.addObject(objs.obj184);objs.obj185=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'dessin tracé dans la boue. ',true);layers.content.addObject(objs.obj185);objs.obj186=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Un silence surnaturel ',true);layers.content.addObject(objs.obj186);objs.obj187=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'envahit la grotte tandis que ',true);layers.content.addObject(objs.obj187);objs.obj188=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'l’homme se penchait sur un ',true);layers.content.addObject(objs.obj188);objs.obj189=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'étrange sac noir que Simon ',true);layers.content.addObject(objs.obj189);objs.obj190=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'n’avait pas remarqué ',true);layers.content.addObject(objs.obj190);objs.obj191=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'jusqu’alors.',true);layers.content.addObject(objs.obj191);objs.obj192=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Le prêtre se saisit du poulet ',true);layers.content.addObject(objs.obj192);objs.obj193=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'et aspergea le sac. ',true);layers.content.addObject(objs.obj193);objs.obj194=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Il prononça quelques paroles ',true);layers.content.addObject(objs.obj194);objs.obj195=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'gutturales et…',true);layers.content.addObject(objs.obj195);objs.obj196=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},' - Police ! On ne bouge plus !',true);layers.content.addObject(objs.obj196);objs.obj197=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'La voix avait claqué comme ',true);layers.content.addObject(objs.obj197);objs.obj198=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'un coup de révolver, se ',true);layers.content.addObject(objs.obj198);objs.obj199=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'répercutant en milliers ',true);layers.content.addObject(objs.obj199);objs.obj200=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'d’échos sur les parois ',true);layers.content.addObject(objs.obj200);objs.obj201=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'minérales. Une voix chargée ',true);layers.content.addObject(objs.obj201);objs.obj202=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'de menaces, surgie de nulle ',true);layers.content.addObject(objs.obj202);objs.obj203=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'part.',true);layers.content.addObject(objs.obj203);objs.obj204=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Papa Legba hésita un ',true);layers.content.addObject(objs.obj204);objs.obj205=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'instant. Puis il étendit les ',true);layers.content.addObject(objs.obj205);objs.obj206=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'bras. Aussitôt, une violente ',true);layers.content.addObject(objs.obj206);objs.obj207=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'bourrasque souffla toutes les ',true);layers.content.addObject(objs.obj207);objs.obj208=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'bougies. Un bruit de ',true);layers.content.addObject(objs.obj208);objs.obj209=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'cavalcade résonna et puis ',true);layers.content.addObject(objs.obj209);objs.obj210=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'plus rien. Rien de rien du ',true);layers.content.addObject(objs.obj210);objs.obj211=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tout.',true);layers.content.addObject(objs.obj211);objs.obj212=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'Simon n’osait bouger. Après ',true);layers.content.addObject(objs.obj212);objs.obj213=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'tout, il s’agissait peut-être ',true);layers.content.addObject(objs.obj213);objs.obj214=new mse.Text(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]},'vraiment d’un cauchemar…',true);layers.content.addObject(objs.obj214);objs.obj215=new mse.UIObject(layers.content,{"size":[mse.coor('cid12'),mse.coor('cid13')]});layers.content.addObject(objs.obj215);objs.obj216=new mse.Text(layers.content,{"size":[mse.coor('cid6'),mse.coor('cid13')],"pos":[mse.coor('cid2'),mse.coor('cid14')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Verdana","textAlign":"center"},'À SUIVRE...',true);layers.content.addObject(objs.obj216);layers.content.setDefile(1300);temp.layerDefile=layers.content;pages.Content.addLayer('content',layers.content);var action={};var reaction={};mse.currTimeline.start();};mse.autoFitToWindow(createbook);