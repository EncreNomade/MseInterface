/*!
 * Encre Nomade Canvas JavaScript Library v0.85
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright 2011, Encre Nomade
 *
 * Date: 21/03/2011
 */

var __currContextOwner__;

(function( window, $ ) {

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            // 33 means 33ms, which will do the loop in 30fps
            var timeToCall = Math.max(0, 33 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var mse = window.mse;

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
mse.Callback = Callback;


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
	    	case 'script':
	    	    this.list[name] = {};
	    	    this.list[name].complete = false;
	    	    $.ajax({
	    	        url: cfs.getSrcPath(file),
	    	        dataType: "script",
	    	        async: false,
                    success: function(script){
                        mse.src.list[name].complete = true;
                    }
	    	    });
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
	    	ctx.font = '20px '+cfs.font;
	    	ctx.fillStyle = '#000000';
	    	ctx.textAlign = 'center';
	    	ctx.fillText(txt, mse.root.width/2, mse.root.height-60);
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
	mse.src.addSource('zoomIcon', './UI/button/zoom.png', 'img', true);
	mse.src.addSource('closeBn', './UI/button/close.png', 'img', true);
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
    this.evtDeleg = new mse.EventDelegateSystem(this);
    
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
		
		if(x>ox-0.1*w && x<ox+1.2*w && y>oy-0.1*h && y<oy+1.2*h) return true;
		else return false;
	},
	
	// Z-index
	getZindex: function() {
		return this.zid ? this.zid : (this.parent ? this.parent.getZindex() : 0);
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
	
	// Event management
	eventCheck: function(type, e) {
	    // In object, notify the event and get the return value that give the prevent bubbling value
	    if(this.inObj(e.offsetX, e.offsetY))
	        return this.evtDeleg.eventNotif(type, e);
	    // Not in object, don't prevent bubbling
	    else return false;
	},
	addListener: function() {
		this.evtDeleg.addListener.apply(this.evtDeleg, Array.prototype.slice.call(arguments));
	},
	removeListener: function() {
		this.evtDeleg.removeListener.apply(this.evtDeleg, Array.prototype.slice.call(arguments));
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
		this.evtDistributor.setDispatcher(container.dispatcher);
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
				  	   'top':'0px',
				   'z-index':10});
	$('body').css({'position':'relative'}).append(this.jqObj);
	this.scale = 1;
	this.setSize(width, height);
	this.interval = 40;
	this.ctx = this.jqObj.get(0).getContext("2d");
	
	if(MseConfig.mobile) this.setCenteredViewport();
	
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
	           'top':height*0.1+'px',
	           'z-index':0
	           });
	$('body').prepend(video);
	//this.video = video.flareVideo($('body'));
	//this.video = video.hide();
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
	this.dispatcher = new mse.EventDispatcher(this);
	
	// Parametres
	this.scale = 1.0;
	this.count = 0;
	this.firstShow = false;
	
	if(MseConfig.iPhone||MseConfig.android) {
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
    	if(!(MseConfig.iPhone||MseConfig.android) || (orien != 'landscape' && orien != 'portrait')) return;
    	
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
    	
    	if(MseConfig.iPhone||MseConfig.android) {
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
	    this.lines = wrapTextWithWrapIndice(this.text, ctx, this.width);
	    // Redefine height of text object
	    this.height = this.lineHeight * this.lines.length;
	}
	else this.lines = [this.text];
	ctx.restore();
	
	// Centralize the text
	if(this.textAlign == "center" && this.width > 0)
	    this.offx += Math.round(this.width/2);
	
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
            this.addListener('click', new mse.Callback(this.clicked, this), false);
        }
        
        // Audio auto play
        if(linkObj.type == 'audio')
        	this.addListener('firstShow', new mse.Callback(this.autoplay, this, linkObj.link));
        
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
    autoplay: function(audio) {
        /*
        if(MseConfig.iOS) {
            var div = $("<div id='audiodiv'/>");
            div.attr('src', audio.src);
            div.attr('width', '1px');
            div.attr('height', '1px');
            div.attr('scrolling', 'no');
            div.css({'border': "0px", 'left': '-1px', 'top': '0px'});
            if($('#audiodiv').length > 0)
                $('#audiodiv').replaceWith(div);
            else $('body').append(div);
            div.click(function(){
                audio.play();
            }).click();
        }
        else */
        audio.play();
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
$.extend( mse.ArticleLayer.prototype , {
	setDefile : function(interval) {
		this.currTime = 0;
		this.currIndex = 0;
		this.interval = interval;
		this.complete = false;
		this.endId = 0;
		this.setSlider();
		
		this.ctrUI = new mse.Layer(this.parent, this.zid+1, {pos:[this.offx+(this.width-250)/2,this.offy+this.height-50], size:[250,50]});
		this.parent.addLayer('CTRLUI', this.ctrUI);
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
		this.ctrUI.addListener('click', cb, true);
		// Listener to scroll the layer with up down buttons
		this.ctrUI.addListener('gestureStart', new mse.Callback(this.ctrUI.upDownStart, this.ctrUI), true);
		this.ctrUI.addListener('gestureEnd', new mse.Callback(this.ctrUI.upDownEnd, this.ctrUI), true);
		
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
		this.addListener('keydown', cb);
	},
	setSlider : function() {
		// Slider
		this.slider = new mse.Slider(this, {}, 'vertical');
		this.updateListScreen();
		
		// Scroll event
		this.slider.addListener('rolling', new mse.Callback(function(){
		    //if(this.active && this.dominate instanceof mse.UIObject) return;
		    this.pause = true;
		}, this) );
		this.slider.addListener('hide', new mse.Callback(function(){
		    var nb = this.complete ? this.objList.length : this.currIndex;
		    if( nb==0 || this.objList[nb-1].getY() < mse.root.height*0.55 ) {
		    	this.pause = false;
		    }
		}, this) );
	},
	updateIndexs : function(start, offset) {
		for(var i in this.phraseIndexs) {
			if(this.phraseIndexs[i] >= start) this.phraseIndexs[i] += offset;
		}
	},
	setLinklist : function(list) {
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
	},
	setLinkDelegate : function(deleg, type) {
		if(!this.links) return;
		
		for(var l in this.links) {
			if(this.links[l].type == type) {
				this.objList[this.links[l].index].addListener('show', new mse.Callback(deleg.linkShowHandler, deleg, this.links[l]));
				this.objList[this.links[l].index].addListener('disapear', new mse.Callback(deleg.linkDisapearHandler, deleg, this.links[l]));
			}
		}
	},
	addObject : function(obj) {
		var last = this.objList.length-1;
		if(last >= 0)
			obj.setY(this.objList[last].height, this.objList[last]);
		else obj.setY(0);
		this.length += obj.height;
		this.endId = this.objList.length-1;
        
		return mse.Layer.prototype.addObject.call(this, obj);
	},
	addGame : function(game) {
	    if(!game.directShow) {
	        var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	        expose.setX(this.width*0.1);
	        this.addObject(expose);
	    }
	    else {
	        game.parent = this;
	        game.addListener('firstShow', new mse.Callback(game.start, game));
	        this.addObject(game);
	    }
	},
	insertObject : function(obj, index) {
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
	},
	insertGame : function(game, index) {
	    if(!game.directShow) {
	        var expose = new mse.GameExpose(this, {size:[this.width*0.8, this.width*0.65]}, game);
	        expose.setX(this.width*0.1);
	        this.insertObject(expose, index);
	    }
	    else {
	        game.parent = this;
	        game.addListener('firstShow', new mse.Callback(game.start, game));
	        this.insertObject(game, index);
	    }
	},
	delObject : function(obj) {
		var res = this.constructor.prototype.delObject.call(this, obj);
		if(!isNaN(res)) {
			this.length -= obj.height;
			this.updateIndexs(res, -1);
			this.endId = this.objList.length-1;
		}
		return res;
	},
	getHeight : function() {
		var nb = this.complete ? this.objList.length : this.currIndex;
		if(nb == 0) return 0;
		return this.objList[nb-1].offy+this.objList[nb-1].height;
	},
	
	// Get obj list on screen
	updateListScreen : function() {
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
	},
	logic : function(delta) {
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
	},
	draw : function(ctx) {
	    this.configCtx(ctx);
		for(var i = this.startId; i <= this.endId; i++) {
			this.objList[i].draw(ctx);
		}
		if(this.ctrUI) this.ctrUI.draw(ctx);
	},
	inObj : function(x, y) {
		return this.parent.inObj(x,y);
	},	
	interrupt : function() {
		this.dominate = this.vide;
	},
	play : function() {
		this.dominate = null;
	}
} );






// Image object
// Src accept image src name(in srcMgr) or a canvas object
mse.Image = function(parent, param, src) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	
	if(typeof src == 'string') {
	    this.img = src;
	    mse.src.waitSrc(this.img, new mse.Callback(this.init, this));
	}
	else this.cache = src;
    
    this.zoomable = false;
	
    //Integraion d'effets
	this.currentEffect = null;
	this.firstShow = false;
};
extend(mse.Image, mse.UIObject);
$.extend(mse.Image.prototype, {
    init: function() {
        var img = mse.src.getSrc(this.img);
        if(!this.width){
        	this.width = img.width;
        	this.height = img.height;
        }
        this.cache = document.createElement("canvas");
        var ctx = this.cache.getContext("2d");
        this.cache.width = this.width;
        this.cache.style.width = this.width;
        this.cache.height = this.height;
        this.cache.style.height = this.height;
        ctx.drawImage(img, 0, 0, this.width, this.height);
        
        if(this.zoomable) 
            this.activateZoom();
    },
    activateZoom: function() {
        this.zoomable = true;
        if(!this.width) return;
        this.zoomIcon = new mse.Image(this, {pos:[this.width-20, 0]}, 'zoomIcon');
        var cb = new mse.Callback(function(){
            if(!(this.imgShower instanceof mse.ImageShower))
                this.imgShower = new mse.ImageShower(this);
            this.imgShower.show();
            // console.log('zoom');
        }, this);
        this.zoomIcon.addListener('click', cb, true);
    },
    startEffect: function (effet) {
    	if(!this.currentEffect && effet instanceof mse.EffectImage && effet.subject == this) { 
    	    this.currentEffect = effet;
    	    this.currentEffect.init();
    	}
    },
    endEffect: function (){
    	this.currentEffect = null;
    },
    logic: function(delta){
		if(!this.firstShow) {
			this.firstShow = true;
			this.evtDeleg.eventNotif('firstShow');
		}

		if(this.currentEffect != null) this.currentEffect.logic(delta);		
	},
    draw: function(ctx, x, y) {
    	var img = (this.cache ? this.cache : mse.src.getSrc(this.img));
    	this.configCtxFlex(ctx);
    	if(isNaN(x) || isNaN(y)) {x = this.getX(); y = this.getY();}
    	
    	if(this.currentEffect != null && this.currentEffect.draw) 
    	    this.currentEffect.draw(ctx, img, x,y, this.width, this.height);
    	else 
            ctx.drawImage(img, x, y, this.width, this.height);
        
        if (this.zoomable) 
            this.zoomIcon.draw(ctx);
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
			this.sw = this.width; this.sh = this.height;
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
		if(!this.width) this.width = this.fw;
		if(!this.height) this.height = this.fh;
	}
	this.curr = 0;
	
	mse.Image.call(this, parent, param, src);
};
extend(mse.Sprite, mse.Image);
$.extend(mse.Sprite.prototype, {
    init: function() {
        this.cache = document.createElement("canvas");
        this.setFrame(this.curr);
    },
    configSprite: function(fw, fh, sx, sy, sw, sh, width, height) {
        if(!fw || !fh || isNaN(sx) || isNaN(sy) || !sw || !sh) return;
        // Frame width and height
        this.fw = fw; this.fh = fh;
        // Source region
        this.sx = sx; this.sy = sy; this.sw = sw; this.sh = sh;
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
        if(!width) this.width = this.fw;
        if(!height) this.height = this.fh;
        // Reset properties
        this.endEffect();
        // Reset frame
        this.curr = 0;
        this.setFrame(this.curr);
    },
    setFrame: function(fr) {
        if(!this.cache) return;
        this.curr = fr;
        var img = mse.src.getSrc(this.img);
        var ctx = this.cache.getContext("2d");
        if(this.frames){
            this.cache.width = this.frames[fr][2];
            this.cache.style.width = this.frames[fr][2];
            this.cache.height = this.frames[fr][3];
            this.cache.style.height = this.frames[fr][3];
            
            ctx.drawImage(img, this.frames[fr][0], this.frames[fr][1], this.frames[fr][2], this.frames[fr][3], 0, 0, this.frames[fr][2], this.frames[fr][3]);
        }
        else {
            this.cache.width = this.fw;
            this.cache.style.width = this.fw;
            this.cache.height = this.fh;
            this.cache.style.height = this.fh;
            var x = this.sx + (fr % this.col) * this.fw;
            var y = this.sy + (Math.floor(fr / this.col)) * this.fh;
            
            ctx.drawImage(img, x, y, this.fw, this.fh, 0, 0, this.fw, this.fh);
        }
        
        if(this.currentEffect && this.currentEffect.update) this.currentEffect.update();
    },
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
        	ctx.drawImage(img, x, y, this.fw,this.fh, ox,oy, this.width, this.height);
        }
        else {
        	var x = this.frames[frame][0]; var y = this.frames[frame][1];
        	var fw = this.frames[frame][2]; var fh = this.frames[frame][3];
        	ctx.drawImage(img, x, y, fw,fh, ox,oy, this.width, this.height);
        }
    },
    draw: function(ctx, ox, oy) {
    	this.configCtxFlex(ctx);
    	if(isNaN(ox)) var ox = this.getX();
    	if(isNaN(oy)) var oy = this.getY();
    	if(this.cache) {
    	    if(this.currentEffect != null && this.currentEffect.draw)
    	        this.currentEffect.draw(ctx, this.cache, ox,oy, this.width,this.height);
    	    else ctx.drawImage(this.cache, ox,oy, this.width, this.height);
    	}
    }
});



// Game object
mse.Game = function(params) {
    if(MseConfig.iPhone){
        this.setPos(0, 0);
        this.setSize(480, 270);
    }
    else if(MseConfig.android) {
        this.setPos(0, 0);
        this.setSize(480, 270);
    }
    else {
        this.offx = 0;
        this.offy = 0;
        this.width = Math.round(0.6*mse.root.width);
        this.height = Math.round(0.6*mse.root.height);
    }
    
    mse.UIObject.call(this, null, params);
    
    if(params) {
        this.fillback = params.fillback ? true : false;
    }
    this.type = "DEP";
    this.directShow = false;
    this.setEvtProxy(mse.root.evtDistributor);
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
    setEvtProxy: function(proxy) {
        if(proxy instanceof mse.EventDistributor || 
           proxy instanceof mse.EventDispatcher || 
           proxy instanceof mse.EventDelegateSystem) {
            this.proxy = proxy;
        }
    },
    getEvtProxy: function() {
        return this.proxy;
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
    	mse.root.evtDistributor.setDominate(this);
        if(!this.directShow) mse.root.gamewindow.loadandstart(this);
        else this.init();
        this.evtDeleg.eventNotif("start");
    },
    getContainer: function() {
        if(!this.directShow) return mse.root.gamewindow;
        else return this.parent.getContainer();
    },
    draw: function(ctx) {},
    end: function() {
        this.evtDeleg.eventNotif("end");
        mse.root.evtDistributor.setDominate(null);
        if(!this.directShow) mse.root.gamewindow.end();
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
	this.jqObj = $("<canvas id='game' width=50 height=50></canvas>");
	$('body').append(this.jqObj);
	this.jqObj.css("display", "none");
	this.ctx = this.jqObj.get(0).getContext('2d');
	
	this.dispatcher = new mse.EventDispatcher(this);
	this.distributor = new mse.EventDistributor(this, this.jqObj, this.dispatcher);
	
	this.currGame = null;
	this.state = "DESACTIVE";
	mse.src.addSource('gameover', './UI/gameover.jpg', 'img', true);
	this.loseimg = new mse.Image(null, {pos:[0,0]}, 'gameover');
	this.losetext = new mse.Text(null, {font:'Bold 36px '+mse.configs.font,fillStyle:'#FFF',textBaseline:'middle',textAlign:'center'}, 'Perdu ...', true);
	this.losetext.addListener('show', new mse.Callback(this.losetext.startEffect, this.losetext, {"typewriter":{speed:2}}));
	this.passBn = new mse.Button(null, {size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue plus', 'wikiBar');
	this.restartBn = new mse.Button(null, {size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je rejoue', 'aideBar');
	this.firstShow = false;
	
	// used by lose()
	this.cbrestart = new mse.Callback(this.restart, this);
	
};
mse.GameShower.prototype = {
	contructor : mse.GameShower,
	isFullScreen : function() {
	     if((MseConfig.iPhone||MseConfig.android) && this.state == "START" && this.currGame && this.currGame.type == "INDEP")
	         return true;
	     else return false;
	},
	relocate : function() {
	    if(this.state == "DESACTIVE") return;
	    if(isNaN(this.currGame.canvasox))
	        this.left = (MseConfig.iPhone||MseConfig.android) ? -1.5 : Math.round(MseConfig.pageWidth-this.width)/2;
	    else this.left = mse.root.jqObj.offset().left - (mse.root.viewport?mse.root.viewport.x:0) + this.currGame.canvasox;
	    if(isNaN(this.currGame.canvasoy))
	        this.top = (MseConfig.iPhone||MseConfig.android) ? -1.5 : Math.round(MseConfig.pageHeight-this.height)/2;
	    else this.top = mse.root.jqObj.offset().top - (mse.root.viewport?mse.root.viewport.y:0) + this.currGame.canvasoy;
	    this.jqObj.css({
	        'left': this.left,
	        'top': this.top,
	        'width': this.width,
	        'height': this.height,
	        'z-index': 11
	    });
	},
	load : function(game) {
	    if(!game || !(game instanceof mse.Game)) return;
	    this.currGame = game;
	    this.currGame.setEvtProxy(this.distributor);
	    this.firstShow = false;
	    this.state = "LOAD";
	    
	    // Init game shower size and pos
	    this.jqObj.get(0).width = this.currGame.width;
	    this.jqObj.get(0).height = this.currGame.height;
	    this.width = this.currGame.width;
	    this.height = this.currGame.height;
	    this.relocate();
	    if(MseConfig.iPhone || MseConfig.android) {
	        this.loseimg.setSize(480, 270);
	        this.losetext.setPos(480/2, 270/2);
	        this.restartBn.setPos(480-115, 270-50);
	        this.passBn.setPos(10, 270-50);
	    }
	    else {
            this.loseimg.setSize(this.width-5, this.height-5);
            this.losetext.setPos(this.width/2, this.height/2);
            this.restartBn.setPos(this.width-115, this.height-50);
            this.passBn.setPos(10, this.height-50);
	    }
	    this.jqObj.show();
	},
	start : function() {
	    if(!this.currGame) return;
	    // Init game
	    this.currGame.init();
	    this.state = "START";
	},
	loadandstart : function(game) {
	    this.load(game);
	    this.start();
	},
	restart : function(e){
	    if(this.passBn.inObj(e.offsetX, e.offsetY)) {
	        this.currGame.end();
	    }
	    else if(this.restartBn.inObj(e.offsetX, e.offsetY)) {
	        this.state = "START";
	        this.currGame.init();
	    }
	    else return;
	    this.distributor.removeListener('click', this.cbrestart);
	},
	lose : function() {
	    this.state = "LOSE";
	    //mse.fadein(this.loseimg, 5);
	    this.distributor.removeListeners('click');
	    this.losetext.evtDeleg.eventNotif('show');
	    this.distributor.addListener('click', this.cbrestart);
	},
	end : function() {
	    this.jqObj.hide(1000);
	    this.jqObj.css('z-index', 1);
	    this.state = "DESACTIVE";
	},
	logic : function(delta) {
	    if(this.state == "LOSE") this.losetext.logic();
	    if(this.state != "START" && this.state != "LOAD") return false;
	    // Mobile orientation fault
	    else if((MseConfig.iPhone||MseConfig.android) && MseConfig.orientation != "landscape") return true;
	    else this.currGame.logic(delta);
	    return true;
	},
	draw : function() {
	    this.ctx.clearRect(0,0,this.width,this.height);
	    if(this.currGame.fillback) {
	        this.ctx.fillStyle = "#000";
	        this.ctx.fillRect(0, 0, this.width, this.height);
	    }
	    
	    if(this.currGame.type == "INDEP" && (MseConfig.android||MseConfig.iPhone) && MseConfig.orientation != "landscape") {
	        // Draw orientation change notification page
	        this.ctx.drawImage(mse.src.getSrc('imgNotif'), (this.width-50)/2, (this.height-80)/2, 50, 80);
	    }
	    else if(this.state == "START") {
	        if(!this.firstShow){
	            this.firstShow = true;
	            if(this.currGame.type == "INDEP") {
	                this.evtDeleg.eventNotif("firstShow");
	                if(MseConfig.iPhone || MseConfig.android){
	                    this.currGame.mobileLazyInit();
	                }
	            }
	        }
    	    this.currGame.draw(this.ctx);
    	}
    	else if(this.state == "LOSE") {
    	    //this.loseimg.draw(ctx);
    	    this.ctx.fillStyle = "#000";
    	    this.ctx.fillRect(0, 0, this.width, this.height);
    	    this.losetext.draw(this.ctx);
    	    this.passBn.draw(this.ctx);
    	    this.restartBn.draw(this.ctx);
    	}
	}
};

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
    this.addListener('firstShow', new mse.Callback(parent.interrupt, parent));
    this.passBn = new mse.Button(this, {pos:[10,this.height-60],size:[105,35],font:'12px '+cfs.font,fillStyle:'#FFF'}, 'Je ne joue pas', 'wikiBar');

    this.launchcb = new mse.Callback(this.launchGame, this);
};
extend( mse.GameExpose , mse.UIObject );
$.extend( mse.GameExpose.prototype , {
	launchGame : function(e) {
        if(this.passBn.inObj(e.offsetX, e.offsetY)) this.endGame();
        else {
            this.removeListener('click', this.launchcb);
            this.game.start();
        }
        this.passBn = null;
    },
    endGame : function() {
        if(parent.play) parent.play();
    },
	logic : function() {
        if(!this.firstShow) {
            this.firstShow = true;
            this.evtDeleg.eventNotif('firstShow');
            this.addListener('click', this.launchcb, true);
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
    },
    draw : function(ctx) {
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
        if(this.passBn) this.passBn.draw(ctx);
        ctx.restore();
    }
} );



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
	this.tar.addListener('gestureUpdate', this.cbGest, false);
	if(!MseConfig.mobile)
		this.tar.addListener('mousewheel', this.cbScroll, false);
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
            this.addListener('click', new mse.Callback(this.urlClicked, this), true);
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
    getContainer: function(){
        return this;
    },
    
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
        
        this.zoomIcon = new mse.Image(this,{pos:[this.ix+this.iw-24-5, this.iy+5]}, 'zoomIcon');
        var cb = new mse.Callback(function(){
            if(!(this.imgShower instanceof mse.ImageShower))
                this.imgShower = new mse.ImageShower(this);
            this.imgShower.show();
            // console.log('zoom');
        }, this);
        this.zoomIcon.addListener('click', cb, true);
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
		this.zoomIcon.draw(ctx,this.ix+this.iw-24-5, this.iy+5);
        ctx.shadowBlur = 0;
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
        l += wrapTextWithWrapIndice(text, mse.root.ctx, this.width-15).length;
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
        var container = this.parent;
        if(container) {
            this.removeListener('gestureStart', this.cbDragStart);
            this.removeListener('gestureUpdate', this.cbDragMove);
            this.removeListener('gestureEnd', this.cbDragEnd);
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
        
        this.addListener('gestureStart', this.cbDragStart, true);
        this.addListener('gestureUpdate', this.cbDragMove, true);
        this.addListener('gestureEnd', this.cbDragEnd, true);
        
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
            var card = this.objList[i];
            var pt = card.ptRotate(e.offsetX, e.offsetY);
            if(card.inObj(pt[0], pt[1])) {
                e.offsetX = pt[0];
                e.offsetY = pt[1];
                if( !card.evtDeleg.eventNotif('click', e) )
                    this.currCard = card;
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




// Video element
mse.Video = function(parent, param, srcs) {
	// Super constructor
	mse.UIObject.call(this, parent, param);
	this.srcs = srcs;
	
	this.addListener('click', new mse.Callback(this.launch, this), true);
};
extend( mse.Video , mse.UIObject );
$.extend( mse.Video.prototype , { 
	launch : function() {
	    mse.root.video.load(srcs);
	    mse.root.video.show();
	},
	
	draw : function(ctx) {
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
	}
});

/*           ImageShower
*  display the target img in fullscreen
*  Usage : call the show method to an event
*  See mse.Image.prototype.init() 
*  & mse.ImageCard.init() (association with an icon)
*/ 
mse.ImageShower = function(target){
    if(!(target instanceof mse.Image) && !(target instanceof mse.ImageCard)) {
        console.error('The target obj is not an instance of mse.Image or mse.ImageCard');
        return;
    }
    this.target = target;
    
	$('body').css({
		'position': 'absolute',
		'width'   : '100%',
		'height'  : '100%'
	});
    
    this.container = $('<div id="imgShower"></div>').css({
		'position'  : 'absolute',
		'z-index'   : '12',
		'width'     : '100%',
		'height'    : '100%',
		'background': 'rgba(0, 0, 0, 0.6)',
        'text-align': 'center'
	});
    
    this.img = $(mse.src.getSrc(target.img)).css({
		'width' : '100%',
		'height': '100%'
	});
    
    this.closeButton = $(mse.src.getSrc('closeBn')).prop('id', 'closeBn').css({
        'position': 'absolute',
        'top'     : '-20px',
        'right'   : '-20px'
    });


   
    this.container.bind('click',{showerObj: this},function(e){
        // close the image on click in div
        var pos = e.data.showerObj.getOriginalPos();
        $(this).children('div').animate({
            'height' : pos.h+'px',
            'width'  : pos.w+'px',
            'top'    : pos.y+'px',
            'left'   : pos.x+'px',
            'opacity': '0'
        });
        $(this).fadeOut(500, function(){
            $(this).detach();
            $(this).children('div').remove();
            var parent = e.data.showerObj.target.parent;
            if(parent.play)
                parent.play();
        });
    }); // no close on click in image
};
mse.ImageShower.prototype = {
    getOriginalPos: function(){
        if(this.target instanceof mse.Image){ // Illu
            var pos = {
                x: mse.root.jqObj.position().left + this.target.getX(),
                y: mse.root.jqObj.position().top + this.target.getY(),
                w: this.target.getWidth(),
                h: this.target.getHeight(),
                angle: 'rotate(0deg)'
            };
        }
        else { // Wiki
            var pos = {
                x: mse.root.jqObj.position().left + this.target.getX() + this.target.ix,
                y: mse.root.jqObj.position().top + this.target.getY() + this.target.iy,
                w: this.target.iw,
                h: this.target.ih,
                angle: 'rotate('+this.target.angle+'deg)'
            };
        }
        return pos;
    },
    show: function(){
        var pos = this.getOriginalPos();
        $('<div></div>').css({
            'position': 'absolute',
            'z-index': '13',
            'width'  : pos.w+'px',
            'height' : pos.h+'px',
            'top'    : pos.y+'px',
            'left'   : pos.x+'px',
            'opacity': '0'
        }).append(this.img)
          .append(this.closeButton)
          .appendTo(this.container);

        this.closeButton.click(function(){$('#imgShower').click();});
        this.img.click(function(e){e.preventDefault();e.stopPropagation();});
        
        var ratio = pos.w/pos.h;
        var finalH = 0.8 * MseConfig.pageHeight;
        var finalW = finalH * ratio;
        var imgX = MseConfig.pageWidth/2 - finalW/2;
        this.container.children('div').animate({ // animate image size to 80% of window size
            'height'    : finalH+'px',
            'width'     : finalW+'px',
            'top'       : '0px',
            'margin-top': '10%',
            'left'      : imgX + 'px',
            'opacity'   : '1'
        });
        this.container.fadeIn(500);
        
        $('body').append(this.container);
        
        var parent = this.target.parent;
        if (parent.interrupt)
            parent.interrupt();
    }
};


// Time line
// It can be either interval fixed "interval" or interval no fixed define by a list of timestamp progressive "timeprog"
mse.Timeline = function(src, interval, timeprog, length) {
	if(!src.initTimeline || !src.runTimeline)
		return null;
	// Parameters
	this.src = src;
	if(interval > 0) {
		this.tsFixed = true;
		this.interval = 33;
		this.length = length != null ? length : 0;
	}
	else {
		if(!timeprog instanceof Array) return null;
		this.tsFixed = false;
		this.timeprog = timeprog;
		this.length = timeprog.length;
	}
	this.src.initTimeline(this);
	// For reduce the fps to 30
	this.switch = false;
};
mse.Timeline.prototype = {
	constructor : mse.Timeline ,
	frameFn : function() {
	    mse.currTimeline.run();
	},
	start : function() {
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
			this.timer = requestAnimationFrame(this.frameFn);
		else this.timer = setTimeout(this.frameFn, this.timeprog[this.currIndex]);
	},
	run : function() {
		if(this.end) {
			if(this.tsFixed)
				clearInterval(this.timer);
			else cancelAnimationFrame(this.timer);
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
				this.timer = setTimeout(this.frameFn, this.timeprog[this.currIndex]);
				this.src.runTimeline(this.timeprog[this.currIndex-1]);
			}
			else {
			    this.timer = requestAnimationFrame(this.frameFn);
			    if(this.switch) this.src.runTimeline(this.interval);
			    this.switch = !this.switch;
			}
		}
		// END
		else {
			this.end = true;
		}
	},
	playpause : function() {
		if(this.end) return;
		this.inPause = !this.inPause;
		if(!this.inPause) {
			if(mse.currTimeline != this) mse.currTimeline = this;
			if(this.tsFixed) this.timer = requestAnimationFrame(this.frameFn);
			else this.timer = setTimeout(this.frameFn, 1200);
		}
	},
	play : function() {
		if(this.end) return;
		this.inPause = false;
		if(mse.currTimeline != this) mse.currTimeline = this;
		if(this.tsFixed) this.timer = requestAnimationFrame(this.frameFn);
		else this.timer = setTimeout(this.frameFn, 1200);
	},
	pause : function() {
		if(this.end) return;
		this.inPause = true;
	}
};


// Frame Animation
mse.FrameAnimation = function(sprite, seq, rep, delay){
	if(!seq instanceof Array || !sprite instanceof mse.Sprite) return null;
	
	this.sprite = sprite;
	this.seq = seq;
	this.rep = isNaN(rep) ? 1 : rep;
	this.delay = isNaN(delay) ? 0 : delay;
	this.active = false;
	this.evtDeleg = new mse.EventDelegateSystem();
};
mse.FrameAnimation.prototype = {
    constructor: mse.FrameAnimation,
    start: function() {
    	this.currFr = 0;
    	this.currRep = 1;
    	this.delayCount = this.delay;
    	this.active = true;
    	this.evtDeleg.eventNotif('start');
    	for(var i in mse.root.animations)
    		if(mse.root.animations[i] == this) return;
        mse.root.animations.push(this);
        this.sprite.setFrame(this.seq[this.currFr]);
    },
    stop: function() {
    	this.currFr = 0;
    	this.currRep = 0;
    	this.active = false;
    	this.evtDeleg.eventNotif('end');
    },
    logic: function(delta) {
    	if (!this.active) return false;
    	
    	if (this.currFr < this.seq.length) {
    		if (this.delay != 0) {
    			if (this.delayCount == 0) {
    				this.currFr++;
    				this.delayCount = this.delay;
    			}
    			this.delayCount--;
    		}
    		else this.currFr++;
    	}
    	if(this.currFr >= this.seq.length) {
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
    	this.sprite.setFrame(this.seq[this.currFr]);
    	return false;
    }
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
    				    this.element.setFrame(curr);break;
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
			src.addListener(cds[i].type, new mse.Callback(this.conditionChanged, this, [id]), false);
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


})(window, mse);
