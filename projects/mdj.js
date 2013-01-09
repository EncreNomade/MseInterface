/*
 * 2D Game Graphic Engine
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date of creation: 25/11/2011
 */
 



window.mdj = {};
 
(function(window, mse, $) {

mdj.setGame = function(game) {
    mdj.currGame = game;
};

mdj.getZoneVisible = function(width, height, x, y, w, h) {
    if(x >= 0) var sx = 0;
    else var sx = -x;
    if(y >= 0) var sy = 0;
    else var sy = -y;
    
    if(x + width > w) var sw = (x >= 0 ? w - x : w);
    else var sw = (x >= 0 ? width : width - sx);
    if(y + height > h) var sh = (y >= 0 ? h - y : h);
    else var sh = (y >= 0 ? height : height - sy);
    return {'sx':sx, 'sy':sy, 'sw':sw, 'sh':sh};
};


mdj.Scene = function(game, w, h) {
    if(game instanceof mse.Game) this.game = game;
    else return;
    this.layers = [];
    this.uilayer = null;
    this.ox = 0;
    this.oy = 0;
    this.width = isNaN(w) ? this.game.width : w;
    this.height = isNaN(h) ? this.game.height : h;
    
    if(MseConfig.iOS) {
        var path = "./UI/";
        if(config.publishMode == "release") path = "./assets/img/season13/story/";
        mse.src.addSource('vPadBase', path+'button/padbase.png', 'img', true);
        mse.src.addSource('vPadHandler', path+'button/padhandler.png', 'img', true);
    }
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
    setUILayer: function(uilayer) {
        if(uilayer instanceof mdj.Layer)
            this.uilayer = uilayer;
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
    
    logic: function(delta) {
        for(var i in this.layers) {
            this.layers[i].logic(delta);
        }
        if(this.uilayer) this.uilayer.logic(delta);
    },
	drawInRect: function(ctx, x, y, w, h){
	    ctx.save();
	    ctx.translate(x, y);
	    
	    if(x >= 0) var sx = 0;
	    else var sx = -x;
	    if(y >= 0) var sy = 0;
	    else var sy = -y;
	    
	    if(x + this.width > w) var sw = (x >= 0 ? w - x : w);
	    else var sw = (x >= 0 ? this.width : this.width - sx);
	    if(y + this.height > h) var sh = (y >= 0 ? h - y : h);
	    else var sh = (y >= 0 ? this.height : this.height - sy);
	    
	    for(var i in this.layers) {
	        this.layers[i].draw(ctx, sx, sy, sw, sh);
	    }
	    ctx.restore();
	    if(this.uilayer) this.uilayer.draw(ctx);
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

mdj.TileMapScene = function(game, w, h, mapurl, srcRelatPath, lazyInit) {
    mdj.Scene.call(this, game, w, h);
    this.srcRelatPath = srcRelatPath;
    this.tilesetConfig = {};
    
    if(lazyInit instanceof mse.Callback) this.lazyInit = lazyInit;
    else this.lazyInit = null;
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
    	// Tilesets
    	var tilesets = map.children("tileset");
    	var srcRelatPath = this.srcRelatPath;
    	var tilesetConfig = this.tilesetConfig;
    	tilesets.each(function() {
    	    var name = $(this).attr('name');
    	    var firstgid = parseInt($(this).attr('firstgid'));
    	    var tilew = parseInt($(this).attr('tilewidth'));
    	    var tileh = parseInt($(this).attr('tileheight'));
    	    var srcnode = $(this).children('image');
    	    var src = srcRelatPath + srcnode.attr("source");
    	    var srcw = parseInt(srcnode.attr('width'));
    	    var srch = parseInt(srcnode.attr('height'));
    	    tilesetConfig[name] = {'src':src, 'srcw':srcw, 'srch':srch, 'fgid':firstgid, 'tilew':tilew, 'tileh':tileh};
    	    mse.src.addSource(name, src, 'img', true);
    	});
    	
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
            var layer = new mdj.TileLayer(name, this, i, col, row, tilew, tileh, map);
        }
        // Lazy Init
        if(this.lazyInit) this.lazyInit.invoke();
    },
    init: function() {
        this.tileset = new mdj.Tileset(this);
        for(var i in this.tilesetConfig) {
            var conf = this.tilesetConfig[i];
            this.tileset.addTileset(i, conf.srcw, conf.srch, conf.fgid, conf.tilew, conf.tileh);
        }
        for(var i in this.layers) {
            if(typeof this.layers[i].init == "function") this.layers[i].init();
        }
    }
});






/********************************************* Tileset ***********************************************/
mdj.Tileset = function(scene) {
    if(scene instanceof mdj.Scene) this.scene = scene;
    
    this.grids = [];
};
mdj.Tileset.prototype = {
    constructor: mdj.Tileset,
    getGrid: function(gid) {
        if(this.grids[gid]) return this.grids[gid];
        else return null;
    },
    addTileset: function(srcname, srcw, srch, firstgid, tilew, tileh) {
        if((typeof srcname != "string") || mse.src.getSrc(srcname) == null || isNaN(srcw) || isNaN(srch) || isNaN(firstgid) || isNaN(tilew) || isNaN(tileh)) return;
        
        var row = Math.floor(srch / tileh);
        var col = Math.floor(srcw / tilew);
        var gid = firstgid;
        for(var r = 0; r < row; ++r) {
            for(var c = 0; c < col; ++c) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = tilew;
                canvas.style.width = tilew;
                canvas.height = tileh;
                canvas.style.height = tileh;
                ctx.drawImage(mse.src.getSrc(srcname), c*tilew, r*tileh, tilew, tileh, 0, 0, tilew, tileh);
                this.grids[gid] = canvas;
                gid++;
            }
        }
    }
};






/********************************************* PARTIE LAYER ***********************************************/

mdj.Layer = function(name, parent, zid){
    this.name = name;
	this.parent = (parent instanceof mdj.Scene) ? parent : null;
	this.zid = isNaN(zid) ? 0 : zid;
	this.ox = 0;
	this.oy = 0;
	if(this.parent) {
	    this.parent.addLayer(this);
	    this.width = this.parent.width;
	    this.height = this.parent.height;
	}
	else {
	    this.width = 0;
	    this.height = 0;
	}
};
mdj.Layer.prototype = {
    getX: function() {
        return 0;
    },
    getY: function() {
        return 0;
    },
    getScene: function() {
        return this.parent;
    },
    logic: function(){},
	draw: function(context) {}
};


mdj.TileLayer = function(name, parent, zid, col, row, tilew, tileh, map){
	mdj.Layer.call(this, name, parent, zid);
	if(!map) return;
	this.col = isNaN(col) ? 0 : col;
	this.row = isNaN(row) ? 0 : row;
	this.tilew = isNaN(tilew) ? 0 : tilew;
	this.tileh = isNaN(tileh) ? 0 : tileh;
	
	this.map = map;
};
extend(mdj.TileLayer, mdj.Layer);
$.extend(mdj.TileLayer.prototype, {
    init: function() {
        this.cache = document.createElement("canvas");
        var ctx = this.cache.getContext("2d");
        this.cache.width = this.col * this.tilew;
        this.cache.style.width = this.col * this.tilew;
        this.cache.height = this.row * this.tileh;
        this.cache.style.height = this.row * this.tileh;
        
        for(var r = 0; r < this.row; ++r){
            for(var c = 0; c < this.col; ++c) {
                var gid = this.map[r * this.col + c];
                this.drawTile(ctx, gid, Math.floor(c*this.tilew), Math.floor(r*this.tileh));
            }
        }
    },
	drawTile: function(ctx, gid, offx, offy) {
		if(this.parent.tileset) {
		    var grid = this.parent.tileset.getGrid(gid);
		    if(grid) ctx.drawImage(grid, offx, offy);
		}
	},
	draw: function(ctx, sx, sy, sw, sh) {
	    if(this.cache) {
	        ctx.drawImage(this.cache, sx, sy, sw, sh, sx, sy, sw, sh);
	    }
	    else {
	        if(arguments.length < 5) {
	            var cmin = 0;
	            var rmin = 0;
	            var cmax = this.col;
	            var rmax = this.row;
	        }
	        else {
	            var cmin = Math.floor(sx/this.tilew);
	            var rmin = Math.floor(sy/this.tileh);
	            var cmax = Math.ceil((sx+sw)/this.tilew);
	            var rmax = Math.ceil((sy+sh)/this.tileh);
	        }
	        
	        for(var r = rmin; r < rmax; ++r){
	            for(var c = cmin; c < cmax; ++c) {
	                var gid = this.map[r * this.col + c];
	                this.drawTile(ctx, gid, c*this.tilew, r*this.tileh);
	            }
	        }
	    }
	}
});


mdj.ObjLayer = function(name, parent, zid, cachable){
    mdj.Layer.call(this, name, parent, zid);
	this.objs = [];
	this.firstDraw = false;
	this.cachable = cachable===true ? true : false;
};
extend(mdj.ObjLayer, mdj.Layer);
$.extend(mdj.ObjLayer.prototype, {
    init: function() {
        if(!this.cache) this.cache = document.createElement("canvas");
        this.cacheCtx = this.cache.getContext("2d");
        this.cache.width = this.parent.width;
        this.cache.style.width = this.parent.width;
        this.cache.height = this.parent.height;
        this.cache.style.height = this.parent.height;
        
        for(var i = 0; i < this.objs.length; ++i) {
        	this.objs[i].draw(this.cacheCtx);
        }
    },
	addObj: function(obj){
		if(obj instanceof mdj.View) {
		    this.objs.push(obj);
		    obj.parent = this;
		}
		else if(obj instanceof mse.UIObject) {
		    this.objs.push(obj);
		    obj.parent = null;
		}
		else return;
		
		if(this.firstDraw && this.cachable) this.init();
	},
	logic: function(delta) {
	    for(var i = 0; i < this.objs.length; ++i) {
	    	if(this.objs[i] instanceof mdj.View) this.objs[i].model.logic(delta);
	    	else this.objs[i].logic(delta);
	    }
	},
	draw: function(ctx, sx, sy, sw, sh){
	    if(!this.firstDraw) {
	        this.firstDraw = true;
	        if(this.cachable) this.init();
	    }
	    if(!this.cachable || isNaN(sx) || isNaN(sy) || isNaN(sw) || isNaN(sh)) {
	        for(var i = 0; i < this.objs.length; ++i)
	            this.objs[i].draw(ctx);
	    }
	    else ctx.drawImage(this.cache, sx, sy, sw, sh, sx, sy, sw, sh);
	}
});


mdj.UILayer = function(name, parent, zid, logic, draw){
    mdj.Layer.call(this, name, parent, zid);
    if(typeof draw == "function") this.draw = draw;
    if(typeof logic == "function") this.logic = logic;
};
extend(mdj.UILayer, mdj.Layer);




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
	    if(model instanceof mdj.Model)
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
		    ctx.globalAlpha = this.model.opacity;
		    var box = this.model.getBoundingBox();
		    ctx.translate(box.x + box.w/2, box.y + box.h/2);
		    ctx.rotate(this.model.getOrientation());
		    ctx.drawImage(img, -box.w/2, -box.h/2, box.w, box.h);
		    ctx.restore();
		}
	}
});


mdj.Sprite = function(model, src, config) {
	mdj.View.call(this, model);
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
	    if (this.currAnime)
	    	this.currAnime.logic();
	    
		var img = mse.src.getSrc(this.src);
		var sx = this.sx + (this.currfr % this.col) * this.fw;
		var sy = this.sy + Math.floor(this.currfr / this.col) * this.fh;
		
		if(this.model){
		    ctx.save();
		    ctx.globalAlpha = this.model.opacity;
		    var box = this.model.getBoundingBox();
		    ctx.translate(box.x + box.w/2, box.y + box.h/2);
		    ctx.rotate(this.model.getOrientation());
		    ctx.drawImage(img, sx, sy, this.fw, this.fh, -box.w/2, -box.h/2, box.w, box.h);
		    ctx.restore();
		}
	},
	getAnime: function(name){
	    if(this.animations[name]) return this.animations[name];
	    else return null;
	},
	addAnime: function(name, anime) {
	    if (anime instanceof mdj.AnimationSprite)
		    this.animations[name] = anime;
	},
	playAnime: function(name) {
	    if(this.animations[name]) {
		    this.currAnime = this.animations[name];
		    this.currAnime.start();
		}
	},
	stopAnime: function() {
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
mdj.AnimationSprite = function(sprite, seq, rep, delay) {
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
	this.width = 0;
	this.height = 0;
	this.rotation = isNaN(rotation) ? 0 : rotation;
	this.opacity = 1;
	this.prevOx = this.ox;
	this.prevOy = this.oy;
	this.proxy = new mse.EventDelegateSystem();
	this.parent = null;
};
mdj.Model.prototype = {
	move: function(disx, disy) {
	    this.prevOx = this.ox;
	    this.prevOy = this.oy;
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
	setPos: function(x, y) {
	    var e = {
	    	'dx' : x-this.ox,
	    	'dy' : y-this.oy,
	    	'x'  : x,
	    	'y'  : y
	    };
	    this.ox = x;
	    this.oy = y;
	    this.proxy.eventNotif('movement', e);
	},
	cancelMove: function() {
	    this.ox = this.prevOx;
	    this.oy = this.prevOy;
	},
	getBoundingBox: function() {
	    return {
	        x: this.getRelatX(),
	        y: this.getRelatY(),
	        w: this.getWidth(),
	        h: this.getHeight()
	    };
	},
	setCollisionBox: function(x, y, w, h) {
	    this.colliBox = {'x': x, 'y': y, 'w': w, 'h': h};
	},
	getCollisionBox: function() {
	    if(this.colliBox) return {
	            x: this.getRelatX()+this.colliBox.x,
	            y: this.getRelatY()+this.colliBox.y,
	            w: this.colliBox.w,
	            h: this.colliBox.h
	        };
	    else return this.getBoundingBox();
	},
	getRelatX: function() {
	    return this.ox;
	},
	getRelatY: function() {
	    return this.oy;
	},
	getX: function() {
	    if(this.parent) return this.parent.getX() + this.getRelatX();
	    else return this.getRelatX();
	},
	getY: function() {
	    if(this.parent) return this.parent.getY() + this.getRelatY();
	    else return this.getRelatY();
	},
	getWidth: function() {
	    return 0;
	},
	getHeight: function() {
	    return 0;
	},
	getOrientation: function() {
	    return this.rotation;
	},
	logic: function() {}
};

mdj.BoxModel = function(ox, oy, width, height, rotation) {
    mdj.Model.call(this, ox, oy, rotation);
    this.width = isNaN(width) ? 0 : width;
    this.height = isNaN(height) ? 0 : height;
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

mdj.Box2DModel = function(ox, oy, rotation, worldObj, width, height, fixDefParam) {
    this.sceneW = worldObj.data.sceneW;
    this.sceneH = worldObj.data.sceneH;
    
    var RATIO = 30;
    
    var fixDef = new Box2D.Dynamics.b2FixtureDef;
    if(typeof fixDefParam != 'object') fixDefParam = {};    
    fixDef.density = isNaN(fixDefParam.density)? 1 : fixDefParam.density;
    fixDef.friction = isNaN(fixDefParam.friction)? 0.3 : fixDefParam.friction;
    fixDef.restitution = isNaN(fixDefParam.restitution)? 0.2 : fixDefParam.restitution;
    this.boxW = width / 2;
    this.boxH = width / 2;
    
    fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
    fixDef.shape.SetAsBox(this.boxW / RATIO,  this.boxH / RATIO);
    
    
    var bodyDef = new Box2D.Dynamics.b2BodyDef;
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = ox / RATIO;
    bodyDef.position.y = oy / RATIO;
    bodyDef.angle = rotation;
    
    this.body = worldObj.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
    
    mdj.Model.call(this, ox, oy, rotation);
    
    this.width = width;
    this.height = height;
};
extend(mdj.Box2DModel, mdj.Model);
$.extend(mdj.Box2DModel.prototype, {
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    },
    getOrientation: function() {
        return this.body.GetAngle();
    },
    getRelatX: function() {
        return this.body.GetPosition().x * 30 - this.width/2;
    },
    getRelatY: function() {
        return this.body.GetPosition().y * 30 - this.height/2;
    },
    setPos: function(x,y){
        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x/30, y/30));
    }
});




/********************************************* INPUT CONTROL ***********************************************/

// gestion input clavier
mdj.DirectionalInput = function(game, target, tarProxy){
    if(!(target instanceof mdj.Model)) return;
	this.target = target;
	this.tarProxy = tarProxy;
	this.game = game;
	this.onmove = false;
	this.dir = "LEFT";
	this.prevDir = "NONE";
	this.proxy = new mse.EventDelegateSystem();
	this.enabled = false;
	
	// Add default step move function in target model
	if(!this.target.stepMove && this.target.inputv == null) {
	    this.target.inputv = 4;
	    this.target.stepMove = this.stepMovefn;
	}
	
	this.movecb = new mse.Callback(this.move, this);
	this.moveEndcb = new mse.Callback(this.moveEnd, this);
	this.touchStartcb = new mse.Callback(this.touchStart, this);
	this.touchMovecb = new mse.Callback(this.touchMove, this);
	this.disableCb = new mse.Callback(this.disable, this);
	
	// Add vitural pad
	if(MseConfig.iOS && mse && !this.vPadActive) {
	    if(!game.currScene.uilayer)
	        game.currScene.setUILayer(new mdj.ObjLayer('ui', null, 10));
	    this.addVituralPadTo(game.currScene.uilayer);
    }
    // Add directionalInput callback to target logic, but not a good implementation
    var directionalInput = this;
    var logic = game.currScene.logic;
    game.currScene.logic = function() {
        logic.call(this);
        directionalInput.frameMove();
    }
	
	this.enable();
	game.evtDeleg.addListener("end", this.disableCb);
};
mdj.DirectionalInput.prototype = {
    enable: function() {
        if(!this.tarProxy || this.enabled) return;
        this.tarProxy.addListener('keydown', this.movecb);
        this.tarProxy.addListener('keyup', this.moveEndcb);
        if(MseConfig.iOS){
            this.tarProxy.addListener('gestureStart', this.touchStartcb);
            this.tarProxy.addListener('gestureUpdate', this.touchMovecb);
            this.tarProxy.addListener('gestureEnd', this.moveEndcb);
        }
        this.enabled = true;
    },
    disable: function() {
        if(!this.tarProxy || !this.enabled) return;
        this.tarProxy.removeListener('keydown', this.movecb);
        this.tarProxy.removeListener('keyup', this.moveEndcb);
        if(MseConfig.iOS){
            this.tarProxy.removeListener('gestureStart', this.touchStartcb);
            this.tarProxy.removeListener('gestureUpdate', this.touchMovecb);
            this.tarProxy.removeListener('gestureEnd', this.moveEndcb);
        }
        this.onmove = false;
        this.enabled = false;
    },
    setTarProxy: function(tarProxy) {
        if(this.enabled) this.disable();
        this.tarProxy = tarProxy;
        if(this.enabled) this.enable();
    },
    stepMovefn: function(dir) {
        switch(dir) {
        case "LEFT":
            var disx = -1, disy = 0;break;
        case "RIGHT":
            var disx = 1, disy = 0;break;
        case "UP":
            var disx = 0, disy = -1;break;
        case "DOWN":
            var disx = 0, disy = 1;break;
        default : return;
        }
        this.move(disx*this.inputv, disy*this.inputv);
    },
    touchStart: function(e) {
        if(inrect(e.offsetX, e.offsetY, this.touchZone)) this.touchValid = true;
        this.onmove = false;
    },
    frameMove: function() {
        if(this.target.stepMove && this.onmove) this.target.stepMove(this.dir);
    },
    touchMove: function(e) {
        if(this.touchValid) {
            var ox = this.touchZone[0]+40, oy = this.touchZone[1]+40;
            var a = mseAngleForLine(ox, oy, e.offsetX, e.offsetY);
            var dis = distance2Pts(ox, oy, e.offsetX, e.offsetY);
            if(dis < 40) this.padHandler.setPos(e.offsetX-40, e.offsetY-40);
            else this.padHandler.setPos(ox+40/dis*(e.offsetX-ox)-40, oy+40/dis*(e.offsetY-oy)-40);
            if((a >= 0 && a <= 15) || (a <= 0 && a >= -15)){
                // Right
                var disx = 4, disy = 0;
                this.dir = "RIGHT";
            }
            else if(a >= 75 && a <= 105) {
                // Down
                var disy = -4, disx = 0;
                this.dir = "DOWN";
            }
            else if(a >= 165 || a <= -165) {
                // Left
                var disx = -4, disy = 0;
                this.dir = "LEFT";
            }
            else if(a <= -75 && a >= -105) {
                // Up
                var disy = 4, disx = 0;
                this.dir = "UP";
            }
            else return;
            
            // Direction change
            if(this.prevDir != this.dir) {
                this.proxy.eventNotif("dirChange", {'dir':this.dir});
            }
            
            if(!this.onmove) {
                this.onmove = true;
                if(typeof this.target.startMove == "function") this.target.startMove(this.dir);
            }
            this.prevDir = this.dir;
        }
    },
	move: function(e) {
	    switch(e.keyCode) {
	    case __KEY_LEFT:
	        this.dir = "LEFT";break;
	    case __KEY_RIGHT:
	        this.dir = "RIGHT";break;
	    case __KEY_UP:
	        this.dir = "UP";break;
	    case __KEY_DOWN:
	        this.dir = "DOWN";break;
	    default : return;
	    }
	    
	    // Direction change
	    if(this.prevDir != this.dir) {
	        this.proxy.eventNotif("dirChange", {'dir':this.dir});
	    }
	    
	    if(!this.onmove) {
	        this.onmove = true;
	        if(typeof this.target.startMove == "function") this.target.startMove(this.dir);
	    }
	    this.prevDir = this.dir;
	},
	moveEnd: function(e) {
	    this.onmove = false;
	    this.touchValid = false;
	    this.proxy.eventNotif("dirChange", {'prev':this.prevDir,'dir':'NONE'});
	    this.prevDir = "NONE";
	    if(typeof this.target.endMove == "function") superthis.target.endMove(dir);
	    if(this.padHandler) this.padHandler.setPos(this.touchZone[0], this.touchZone[1]);
	    this.startPt = null;
	},
	addVituralPadTo: function(layer) {
	    if(!mse) return;
	    this.padBase = new mse.Image(null, {pos:[46, this.game.height-103],size:[48,48],globalAlpha:0.6}, 'vPadBase');
	    this.padHandler = new mse.Image(null, {pos:[30, this.game.height-119],size:[80,80],globalAlpha:0.6}, 'vPadHandler');
	    layer.addObj(this.padBase);
	    layer.addObj(this.padHandler);
	    this.touchZone = [30, this.game.height-119, 80, 80];
	    this.vPadActive = true;
	}
};




/********************************************* CAMERA ***********************************************/

mdj.Camera = function(width, height, scene, target, tarOffx, tarOffy){
	this.height = isNaN(height) ? 0 : height;
	this.width = isNaN(width) ? 0 : width;
	//this.moveCb = new mse.Callback(this.move, this);
	this.setTarget(scene, target, tarOffx, tarOffy);
};
mdj.Camera.prototype = {
	move: function(e){
		this.ox += e.dx;
		this.oy += e.dy;
	},
	setTarget: function(scene, target, tarOffx, tarOffy){
		if(!target instanceof mdj.Model || !target instanceof mse.UIObject || !scene instanceof mdj.Scene) return;
		this.target = target;
		this.scene = scene;
		this.tarOffx = isNaN(tarOffx) ? 0 : tarOffx;
		this.tarOffy = isNaN(tarOffy) ? 0 : tarOffy;
		// Already positioned
		if(!isNaN(this.ox)) {
		    this.movecount = 15;
		    this.prevox = this.ox;
		    this.prevoy = this.oy;
		}
		// Reposition the camera
		this.ox = target.getX() - (this.width/2 - this.tarOffx);
		this.oy = target.getY() - (this.height/2 - this.tarOffy);
	},
	drawScene: function(ctx) {
	    if(this.target && this.scene) {
	        // Reposition the camera
	        this.ox = Math.round(this.target.getX() - (this.width/2 - this.tarOffx));
	        this.oy = Math.round(this.target.getY() - (this.height/2 - this.tarOffy));
	        
	        // Calibration when the camera is at the border of the scene
	        if(this.ox < 0) this.ox = 0;
	        if(this.oy < 0) this.oy = 0;
	        if(this.ox + this.width > this.scene.width) this.ox = this.scene.width - this.width;
	        if(this.oy + this.height > this.scene.height) this.oy = this.scene.height - this.height;
	        
	        // Transition of camera
	        if(this.movecount > 0) {
	            var ratio = (15 - this.movecount)/15;
	            this.ox = this.prevox + Math.round((this.ox - this.prevox)*ratio);
	            this.oy = this.prevoy + Math.round((this.oy - this.prevoy)*ratio);
	            this.movecount--;
	        }
	        
	        // Draw scene
	        this.scene.drawInRect(ctx, -this.ox, -this.oy, this.width, this.height);
	    }
	}
};




/********************************************* COLLISION ***********************************************/

mdj.CollisionDetector = function(target){
    this.setTarget(target);
    this.detectors = {};
    this.callbacks = {};
};
mdj.CollisionDetector.prototype = {
    // Register detectors
	register: function(ref, detector, cb){
		if(ref && (cb instanceof mse.Callback || typeof cb == 'function')) {
		    this.detectors[ref] = detector;
		    this.callbacks[ref] = cb;
		}
	},
	// Set the collision detect target
	setTarget: function(target){
	    if(target instanceof mdj.Model) {
	        this.tar = target;
		    target.proxy.addListener('movement', new mse.Callback(this.detect, this));
		    target.proxy.addListener('collision', new mse.Callback(this.triger, this));
		}
	},
	// Triger of all callbacks
	triger: function(e) {
	    var ref = e.detector;
	    if( this.detectors[ref] && this.callbacks[ref] ) {
	        e.detector = this.detectors[ref];
	        cb = this.callbacks[ref];
	        if(cb instanceof mse.Callback)
	            cb.invoke(e);
	        else if(typeof cb == 'function')
	            cb.call(this.tar, e);
	    }
	},
	// Detect collision function
	detect: function(e) {
	    if(this.tar) {
	        var box = this.tar.getCollisionBox();
	        for(var i in this.detectors) {
	            var detector = this.detectors[i];
	            // Detect collision between objs
	            if(detector instanceof mdj.Model) {
	                var comp = detector.getCollisionBox();
	                // Detect for two rectangle no rotation
	                if( ((comp.x >= box.x && comp.x <= box.x+box.w) ||
	                    (box.x >= comp.x && box.x <= comp.x+comp.w)) &&
	                    ((comp.y >= box.y && comp.y <= box.y+box.h) ||
	                    (box.y >= comp.y && box.y <= comp.y+comp.h)) ) {
	                    
	                    this.tar.proxy.eventNotif('collision', {
	                        'detector':i,
	                        'offx':box.x+box.w-comp.x,
	                        'offy':box.y+box.h-comp.y
	                    });
	                    return;
	                }
	            }
	            // Detect collision between obj and tile layer
	            else if(detector instanceof mdj.TileLayer) {
	                var colmin = Math.floor(box.x/detector.tilew);
	                var rowmin = Math.floor(box.y/detector.tileh);
	                var colmax = Math.floor((box.x+box.w)/detector.tilew);
	                var rowmax = Math.floor((box.y+box.h)/detector.tileh);
	                for(var r = rowmin; r <= rowmax; ++r) {
	                    for(var c = colmin; c <= colmax; ++c) {
	                        // Collision
	                        var gid = r * detector.col + c;
	                        if(detector.map[gid] != 0) {
	                            var offy = r * detector.tileh;
	                            var offx = c * detector.tilew;
	                            this.tar.proxy.eventNotif('collision', {
	                                'detector':i,
	                                'gid':gid,
	                                'offx':box.x+box.w-offx,
	                                'offy':box.y+box.h-offy
	                            });
	                            return;
	                        }
	                    }
	                }
	            }
	        }
	    }
	}
};



})(window, mse, $);
