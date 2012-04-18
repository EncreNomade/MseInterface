/*
 * Mse 2D Game Engine
 * Encre Nomade
 *
 * Copyright 2011, MseEdition
 *
 * Date: 25/11/2011
 */
 



var mdj = function() {};
 
mdj.setGame = function(game) {
    mdj.currGame = game;
};
 

mdj.Scene = function() {
    this.layers = [];
    this.ox = 0;
    this.oy = 0;
};
mdj.Scene.prototype = {
    constructor: mdj.Scene,
    // Layer managerment
    addLayer: function(layer){
    	if(layer instanceof mdj.Layer) {
    		this.layers.push(layer);
    		this.sortLayer();
    	}
    },
    delLayer: function(name) {
    	if(name == null) return;
    	for(var i in this._layers) {
    		if(this.layers[i].name == name) this.layers.splice(i,1);
    	}
    },
    getLayer: function(name) {
    	if(name == null) return;
    	for(var i in this.layers) {
    		if(this.layers[i].name == name) return this.layers[i];
    	}
    },
    sortLayer: function() {
    	this.layers.sort(function(a, b) {
    		if(a.zid < b.zid)
    			return -1;
    		else if(a.zid > b.zid)
    			return 1;
    		else return 0;
    	});
    },
    
	draw: function(ctx){
	    ctx.save();
	    ctx.translate(this.ox, this.oy);
		for(var i in this.layers) {
		    this.layers[i].draw(ctx);
		}
		ctx.restore();
	},
	setPosition: function(offx, offy){
		this.ox = offx;
		this.oy = offy;
	},
	getX: function() {
	    return this.ox;
	},
	getY: function() {
	    return this.oy;
	},
	move: function(dx, dy){
		this.ox += dx;
		this.oy += dy;
	},
	setCollision: function(target){
	    
	}
};

mdj.TileMapScene = function(mapurl, lazyInit){
    mdj.Scene.call(this);
    this.tilesets = [];
    
    if(typeof lazyInit == "function") this.lazyInit = lazyInit;
    var scene = this;
    $.ajax({
        url: mapurl,
        dataType: 'xml',
        success: function(map){
            scene.initWithTMX(map);
        }
    });
};
extend(mdj.TileMapScene, mdj.Scene);
$.extend(mdj.TileMapScene.prototype, {
    initWithTMX : function(xml) {
    	var map = $(xml).find("map");
    	var col = parseInt(map.attr("width"));
    	var row = parseInt(map.attr("height"));
    	var tilew = parseInt(map.attr("tilewidth"));
    	var tileh = parseInt(map.attr("tileheight"));
    	if(isNaN(row) || isNaN(col) || isNaN(tilew) || isNaN(tileh)) return;
    	// Tile set
    	var tileset = map.children("tileset").attr("name");
    	// Layers
    	var layers = map.children("layer");
    	for(var i = 0; i < layers.length; i++) {
    	    var layernode = $(layers.get(i));
            var name = layernode.attr("name");
            var datanode = layernode.children("data");
            if(datanode.length == 0) continue;
            var data = datanode.text();
            var encoding = datanode.attr("encoding");
            var comp = datanode.attr("compression");
            
            if(!data) continue;
            // Decoding data
            switch(encoding) {
            case "base64":
                var map = Base64.decodeBase64AsArray(data, 4);break;
            default: continue;
            }
            // Decompress data
            switch(comp) {
            case "zlib":
                continue;
            case "gzip":
                continue;
            case "": 
                break;
            }
            // Init Layer
            var layer = new mdj.TileLayer(name, this, i, col, row, tilew, tileh, map, tileset);
            this.addLayer(layer);
        }
        // Lazy Init
        this.lazyInit();
    },
    lazyInit: function(){
    }
});






/********************************************* PARTIE LAYER ***********************************************/

mdj.Layer = function(name, parent, zid, ox, oy){
    this.name = name;
	this.parent = parent;
	this.zid = isNaN(zid) ? 0 : zid;
	this.ox = isNaN(ox) ? 0 : ox;
	this.oy = isNaN(oy) ? 0 : oy;
};
mdj.Layer.prototype = {
    setOrigin: function(ox, oy) {
        this.ox = isNaN(ox) ? 0 : ox;
        this.oy = isNaN(oy) ? 0 : oy;
    },
    getX: function() {
        if(this.parent) return this.parent.getX() + this.ox;
        else return this.ox;
    },
    getY: function() {
        if(this.parent) return this.parent.getY() + this.oy;
        else return this.oy;
    },
    getScene: function() {
        return this.parent;
    },
	draw: function(context) {}
};


mdj.TileLayer = function(name, parent, zid, col, row, tilew, tileh, map, tileset){
	mdj.Layer.call(this, name, parent, zid);
	if(!map || !tileset) return;
	this.col = isNaN(col) ? 0 : col;
	this.row = isNaN(row) ? 0 : row;
	this.tilew = isNaN(tilew) ? 0 : tilew;
	this.tileh = isNaN(tileh) ? 0 : tileh;
	
	this.map = map;
	this.tileset = tileset;
};
extend(mdj.TileLayer, mdj.Layer);
$.extend(mdj.TileLayer.prototype, {
	drawTile: function(ctx, gid, offx, offy) {
		var col = gid % this.col;
		var row = Math.floor(gid / col);
		var src = mse.src.getSrc(this.tileset);
		if(src)
			ctx.drawImage(src, col*this.tilew, row*this.tileh, this.tilew, this.tileh, offx, offy, this.tilew, this.tileh);
	},
	draw: function(ctx) {
	    for(var i = 0; i < this.map.length; ++i){
	        var gid = this.map[i];
	        this.drawTile(ctx, gid, this.ox+(i%this.col)*this.tilew, this.oy+Math.floor(i/this.col)*this.tileh);
	    }
	}
});


mdj.ObjLayer = function(name, parent, zid, ox, oy){
    mdj.Layer.call(this, name, parent, zid, ox, oy);
	this.objs = [];
};
extend(mdj.ObjLayer, mdj.Layer);
$.extend(mdj.ObjLayer.prototype, {
	addObj: function(obj){
		if(obj instanceof mdj.View) { 
		    this.objs.push(obj);
		    obj.parent = this;
		}
	},
	draw: function(ctx){
		for(var i = 0; i < this.objs.length; ++i) {
			this.objs[i].draw(ctx);
		}
	}
});




/********************************************* PARTIE VIEW ***********************************************/



mdj.View = function (model) {
	this.setModel(model);
};
mdj.View.prototype= {
	constructor: mdj.View,
	getScene: function() {
	    if(this.parent)
	        return this.parent.getScene();
	    else return null;
	},
	setModel: function(model){
		this.model = model;
	}
};


mdj.Image = function (model, img) {
	mdj.View.call(this, model);
	this.img = img;
};
extend(mdj.Image, mdj.View);
$.extend(mdj.Image.prototype, {
	draw: function (ctx){
		var img = mse.src.getSrc(this.img);
		if(img){
		    ctx.save();
		    var box = this.model.getBoundingBox();
		    ctx.translate(box.x + box.w/2, box.y + box.h/2);
		    ctx.rotate(this.model.rotation);
		    ctx.drawImage(img, -box.w/2, -box.h/2, box.w, box.h);
		    ctx.restore();
		}
	}
});


mdj.Sprite = function(model, src, config) {
	mdj.View.call(this, model);
	this.model = null;
	this.src = src;
	this.currfr = 0;
	this.animations = {};
	this.currAnime = null;
	
	this.fw = config.w;
	this.fh = config.h;
	this.sx = config.sx;
	this.sy = config.sy;
	this.sw = config.sw;
	this.sh = config.sh;
	
	this.col = Math.floor(this.sw/this.fw); 
	this.row = Math.floor(this.sh/this.fh);
};
extend( mdj.Sprite, mdj.View);
$.extend( mdj.Sprite.prototype, {
    setFrame: function(fr) {
        this.currfr = fr;
    },
	draw: function(ctx){
		var img = mse.src.getSrc(this.src);
		var sx = this.sx + (this.currfr % this.col) * this.fw;
		var sy = this.sy + Math.floor(this.currfr / this.col) * this.fh;
		
		if(this.model){
		    ctx.save();
		    var box = this.model.getBoundingBox();
		    ctx.translate(box.x + box.w/2, box.y + box.h/2);
		    ctx.rotate(this.model.rotation);
		    ctx.drawImage(img, sx, sy, this.fw, this.fh, -box.w/2, -box.h/2, box.w, box.h);
		    ctx.restore();
		}
	},
	logic: function () {
		if (this.currAnime) {
			this.currAnime.logic();
		}
	},
	addAnime: function (name, anime) {
	    if (anime instanceof mdj.AnimationSprite)
		    this.animations[name] = anime;
	},
	playAnime: function(name) {
	    if(this.animations[name]) {
		    this.currAnime = this.animations[name];
		    this.currAnime.start();
		}
	},
	stopAnime: function(name) {
	    if(this.currAnime) {
		    this.currAnime.stop();
		    this.currAnime = null;
		}
	},
	deleteAnime: function(name) {
		delete this.animations[name];
	}
});


//Les animations de sprite
mdj.AnimationSprite = function (sprite, seq, rep, delay) {
	if(!seq instanceof Array || !sprite instanceof mdj.Sprite) return null;
	
	this.sprite = sprite;
	this.seq = seq;
	this.rep = isNaN(rep) ? 1 : rep;
	this.delay = isNaN(delay) ? 0 : delay;
	this.active = false;
};
mdj.AnimationSprite.prototype = {
	constructor: mdj.AnimationSprite,
	start: function() {
		this.currFr = 0;
		this.currRep = 1;
		this.delayCount = this.delay;
		this.active = true;
	},
	stop: function() {
		this.currFr = 0;
		this.currRep = 0;
		this.active = false;
	},
	logic: function(delta) {
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
				return true;
			}
		}
		this.sprite.setFrame(this.seq[this.currFr]);
		return false;
	}
};


 
 
 
/********************************************* PARTIE MODEL ***********************************************/

mdj.Model = function(ox, oy, rotation) {
	this.ox = isNaN(ox) ? 0 : ox;
	this.oy = isNaN(oy) ? 0 : oy;
	this.proxy = new mse.EventDelegateSystem();
	this.parent = null;
	this.configView(view);
};
mdj.Model.prototype ={
	move: function(disx, disy) {
		this.ox += disx;
		this.oy += disy;
		var e = {
			dx : disx,
			dy : disy,
			x  : this.ox,
			y  : this.oy
		};
		this.proxy.eventNotif('movement', e);
	},
	getBoundingBox: function() {
	    return {
	        x: this.ox,
	        y: this.oy,
	        w: this.getWidth(),
	        h: this.getHeight()
	    };
	},
	getX: function() {
	    if(this.parent) return this.parent.getX() + this.ox;
	    else return this.ox;
	},
	getY: function() {
	    if(this.parent) return this.parent.getY() + this.oy;
	    else return this.oy;
	},
	getWidth: function() {
	    return 0;
	},
	getHeight: function() {
	    return 0;
	}
};

mdj.BoxModel = function(ox, oy, width, height, rotation) {
    mdj.Model.call(this, ox, oy, rotation);
    this.width = isNaN(width) ? 0 : this.width;
    this.height = isNaN(height) ? 0 : this.height;
};
extend(mdj.BoxModel, mdj.Model);
$.extend(mdj.BoxModel.prototype, {
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    }
});




/********************************************* INPUT CONTROL ***********************************************/

// gestion input clavier
mdj.DirectionalInput = function(game, target, proxy){
    if(!(target instanceof mdj.Model)) return;
	this.target = target;
	this.proxy = proxy;
	this.game = game;
	this.onmove = false;
	
	// Add default step move function in target model
	if(!this.target.stepMove)
	    this.target.stepMove = this.stepMovefn;
	
	this.movecb = new mse.Callback(this.move, this);
	this.moveEndcb = new mse.Callback(this.moveEnd, this);
	this.touchStartcb = new mse.Callback(this.touchStart, this);
	this.touchMovecb = new mse.Callback(this.touchMove, this);
	
	this.proxy.addListener('keydown', this.movecb, true, game);
	this.proxy.addListener('keyup', this.moveEndcb, true, game);
	if(MseConfig.iOS){
	    this.proxy.addListener('gestureStart', this.touchStartcb, true, game);
	    this.proxy.addListener('gestureUpdate', this.touchMovecb, true, game);
	    this.proxy.addListener('gestureEnd', this.moveEndcb, true, game);
	    
	    // Add vitural pad
	    if(game.currScene.uiLayer) game.currScene.uiLayer.addObj(this.vituralPad());
	}
};
mdj.DirectionalInput.prototype = {
    stepMovefn: function(dir) {
        switch(dir) {
        case "LEFT":
            var disx = -4, disy = 0;break;
        case "RIGHT":
            var disx = 4, disy = 0;break;
        case "UP":
            var disx = 0, disy = -4;break;
        case "DOWN":
            var disx = 0, disy = 4;break;
        default : return;
        }
        this.move(disx, disy);
    },
    touchStart: function(e) {
        this.startPt = {x:e.offsetX,y:e.offsetY};
        this.onmove = false;
    },
    touchMove: function(e) {
        var valid = true;
        var end = {x:e.offsetX,y:e.offsetY};
        
        var a = angleFor2Point(this.startPt, end);
        if((a >= 0 && a <= 15) || (a <= 0 && a >= -15)){
            //Left
            var disx = -4, disy = 0;
            var dir = "LEFT";
        }
        else if(a >= 75 && a <= 105) {
            // Down
            var disy = -4, disx = 0;
            var dir = "DOWN";
        }
        else if(a >= 165 || a <= -165) {
            // Right
            var disx = 4, disy = 0;
            var dir = "RIGHT";
        }
        else if(a <= -75 && a >= -105) {
            // Up
            var disy = 4, disx = 0;
            var dir = "UP";
        }
        else return;
        if(!this.onmove) {
            this.onmove = true;
            if(typeof this.target.startMove == "function") this.target.startMove(dir);
        }
    },
	move: function(e) {
	    switch(e.keyCode) {
	    case __KEY_LEFT:
	        var dir = "LEFT";break;
	    case __KEY_RIGHT:
	        var dir = "RIGHT";
	    	break;
	    case __KEY_UP:
	        var dir = "UP";break;
	    case __KEY_DOWN:
	        var dir = "DOWN";break;
	    default : return;
	    }
	    this.target.stepMove(dir);
	    
	    if(!this.onmove) {
	        this.onmove = true;
	        if(typeof this.target.startMove == "function") this.target.startMove(dir);
	    }
	},
	moveEnd: function(e) {
	    this.onmove = false;
	    if(typeof this.target.endMove == "function") superthis.target.endMove(dir);
	    this.startPt = null;
	},
	vituralPad: function() {
	}
};




/********************************************* CAMERA ***********************************************/

mdj.Camera = function(width, height, scene, target, tarOffx, tarOffy){
	this.height = isNaN(height) ? 0 : height;
	this.width = isNaN(width) ? 0 : width;
	this.moveCb = new mse.Callback(this.move, this);
	this.setTarget(scene, target, tarOffx, tarOffy);
};
mdj.Camera.prototype = {
	move: function(e){
		this.ox += e.dx;
		this.oy += e.dy;
	},
	setTarget: function(scene, target, tarOffx, tarOffy){
		if(!target instanceof mdj.Model || !(scene instanceof mdj.Scene)) return;
		this.target = target;
		this.scene = scene;
		this.tarOffx = isNaN(tarOffx) ? 0 : tarOffx;
		this.tarOffy = isNaN(tarOffy) ? 0 : tarOffy;
		target.proxy.addListener('movement',this.moveCb);
		this.ox = target.getX() - (this.width/2 - this.tarOffx);
		this.oy = target.getY() - (this.height/2 - this.tarOffy);
	},
	drawScene: function(ctx) {
	    if(this.target && this.scene) {
	        ctx.save();
	        ctx.translate(-this.ox, -this.oy);
	        // Clip masque for NPCs
	        ctx.beginPath();
	        ctx.moveTo(this.ox, this.oy);
	        ctx.lineTo(this.width, 0);
	        ctx.lineTo(this.width, this.height);
	        ctx.lineTo(0,this.height);
	        ctx.closePath();
	        ctx.clip();
	        // Draw scene
	        this.scene.draw();
	        ctx.restore();
	    }
	}
};




/********************************************* COLLISION ***********************************************/

mdj.Collision = function(map, target){
	this.detectCb = new mse.Callback(this.detect, this);
	this.setDetect(target);
};
mdj.Collision.prototype = {
	detect : function(e){
		e.dx;
		e.dy;
	},
	setDetect : function(target){
		target.proxy.addListener('movement',this.detectCb);
	}
};

