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
    
  	setCamera: function(width,height,target){
  		this.target = target;
  		var camera = new mdj.Camera(width,height,target,target.width/2,target.height/2);
  		camera.scene = this;
  	},
	draw: function(ctx){
	    ctx.save();
	    ctx.translate(this.ox, this.oy);
		for(var i in this.layers) {
		    this.layers[i].draw(ctx);
		}
		ctx.restore();
	},
	setPosition : function(offx, offy){
		this.ox = offx;
		this.oy = offy;
	},
	move : function(dx, dy){
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






/***************************Layer***************************/

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







mdj.View = function (model) {
	this.setModel(model);
};
mdj.View.prototype= {
	constructor: mdj.View,
	setModel: function(model){
		this.model = model;
	}
};


//Les animations de sprite
mdj.AnimationSprite= function (sprite, anime, speed) {
	this.currentid=0;
	this.sprite= sprite;
	this.anime= anime;
	this.speed = isNaN(speed) ? 2 : speed;
};
mdj.AnimationSprite.prototype= {
	constructor: mdj.AnimationSprite,
	start: function() {
		this.currentid= 0;
		this.speedGestion= 0;
		
	},
	stop: function() {
		this.currentid= 0;
	},
	logic: function () {
		
	if(this.speedGestion != this.speed) 
		this.speedGestion++;
	else {
		if( this.currentid < this.anime.length-1) this.currentid++;
		else this.currentid=0;
		this.speedGestion =  0;
	}
	this.sprite.currentframe = this.anime[this.currentid]; //currentid = l'endroit où l'on est dans le frame
	}
};



//les sprites
mdj.Sprite= function (img, frames) {
	mdj.View.call(this, img, frames);
	this.model = null;
	this.img = img;
	this.currentframe = 0;
	this.animations = {}; 
	
	this.fw = frames[0]; // frame width
	this.fh = frames[1]; // frame height
	this.sx = frames[2]; // position de la frame selon x
	this.sy = frames[3]; // position de la frame selon y
	this.sw = frames[4]; // taille de toute les frames d'un même objet
	this.sh = frames[5]; // taille de toute les frames d'un même objet
	// pour trouver où se situe le sprite dans le currentframe
	this.cols = Math.floor(this.sw/this.fw); 
	this.rows = Math.floor(this.sh/this.fh);
	//nombre de frames
	this.number= this.cols * this.rows;
	this.currAnime = null;
};

extend( mdj.Sprite, mdj.View);
$.extend( mdj.Sprite.prototype, {
	draw: function(ctx){
		var img = mse.src.getSrc(this.img);
		var x = this.sx + (this.currentframe % this.cols) * this.fw;
		var y = this.sy + (Math.floor(this.currentframe / this.cols)) * this.fh;
		
		if(this.model!=null){
		ctx.save();
		ctx.translate(this.model.posX, this.model.posY);
		ctx.rotate(this.model.rotation);
		ctx.drawImage(img,x,y, this.fw, this.fh, -this.model.width/2, -this.model.height/2, this.model.width, this.model.height)
		ctx.restore();
		}else return;
	},
	logic: function () {
		if (this.currAnime instanceof mdj.AnimationSprite) {
			this.currAnime.logic();
		}else return;
		
	},
	addAnim: function (name, anime) {
		this.animations[name]=anime;
	},
	playAnim: function(name) {
		this.currAnime = this.animations[name];
		this.animations[name].start();
	},
	stopAnim: function(name) {
		this.currAnime.stop();
		this.currAnime = null;
	},
	deleteAnim: function(name) {
		delete this.animations[name];
	}
});



//les images statiques
mdj.ImgStatic= function (img, rotat) {
	mdj.View.call(this, img);
	this.model=null;
	this.img =img;
	this.rotation=rotat;
};
extend(mdj.ImgStatic, mdj.View);
$.extend ( mdj.ImgStatic.prototype, {
	addMoveWithTarget : function(target){
		this.moveCb = new mse.Callback(this.move, this);
		target.evtDelegate.addListener('deplace',this.moveCb);
	},
	move : function(e){
		this.model.posX+=e.dx;
		this.model.posY+=e.dy;
		switch(e.dir){
			case "right": this.rotation = 0;break;
			case "left": this.rotation = Math.PI;break;
			case "up": this.rotation = Math.PI*3/2;break;
			case "down": this.rotation = Math.PI/2;break;
		}
	},
	draw: function (ctx){
			var img = mse.src.getSrc(this.img);
			ctx.save();
			ctx.translate(this.model.posX+this.model.width/2, this.model.posY+this.model.height/2);
			ctx.rotate(this.rotation);
			ctx.drawImage(img,-this.model.width/2, -this.model.height/2,this.model.width,this.model.height);
			ctx.restore();
	}
});

 
 
 
/********************************************* PARTIE MODEL ***********************************************/

mdj.Model = function(posX,posY,width,height, view){
	this.height = height;
	this.width = width;
	this.posX = posX;
	this.posY = posY;
	this.evtDelegate = new mse.EventDelegateSystem();
	this.parent=null;
	this.configView(view);
};
mdj.Model.prototype ={ 
	configView : function(view){
		if (view instanceof mdj.View){
		this.view=view;
		this.view.configModel(this);
		}
	},
	move : function(disx,disy,dir) {
		this.posX += disx;
		this.posY += disy;
		var e={
			dx : disx,
			dy : disy,
			dir : dir
		};
		this.evtDelegate.eventNotif('deplace', e);
	},
	draw: function(ctx){
		if(this.view) this.view.draw(ctx);
	},
	getOffset: function(){
		if(this.parent) {
			var offs = this.parent.getOffset();
		}
		else{
			var offs = [0,0];
		}
		offs[0] += this.posX;
		offs[1] += this.posY;
		return offs;
	}
	
};
 
 
 
// Hero
mdj.Hero = function(posX, posY, width, height, view){
	mdj.Model.call(this, posX, posY, width, height, view);
	this.posX=posX;
	this.posY=posY;
	this.input = new mdj.Input(this, mse.root.evtDistributor);

};
extend(mdj.Hero, mdj.Model);

$.extend(mdj.Hero.prototype, {

	init : function(posX,posY) {
		this.posX = posX;
		this.posY = posY;
	}
});



// gestion input clavier
mdj.Input = function(target, evtdistr){
		this.target = target;
		this.evtdistr = evtdistr;
		
		this.movecb = new mse.Callback(this.move, this);
		this.moveovercb = new mse.Callback(this.moveover, this);
		
		this.evtdistr.addListener('keydown', this.movecb, true, mdj.currGame);
		this.evtdistr.addListener('keyup', this.moveovercb, true, mdj.currGame);
	};

mdj.Input.prototype = {
	move : function(e) {
	    switch(e.keyCode) {
	    case __KEY_LEFT:
	        this.disx = -4; this.disy = 0;
	        dir = "left";
	        valid = true;
	    	break;
	    case __KEY_RIGHT:
	        this.disx = 4; this.disy = 0;
	        dir = "right";
	        valid = true;
	    	break;
	    case __KEY_UP:
	        this.disy = -4; this.disx = 0;
	        dir = "up";
	        valid = true;
	    	break;
	    case __KEY_DOWN:
	        this.disy = 4; this.disx = 0;
	        dir = "down";
	        valid = true;
	    	break;
	    default : dir = null; return;break;
	    }
	    this.target.move(this.disx,this.disy,dir);
	    
	    if(valid && !this.onmove) {
	        this.onmove = true;
	        switch(dir){
	        	case "right" : this.target.view.playAnim("right"); break;
	        	case "left" : this.target.view.playAnim("left"); break;
	        	case "up" : this.target.view.playAnim("up"); break;
	        	case "down" : this.target.view.playAnim("down"); break;
	        }
	    }
	},
	moveover : function(e) {
	    this.disx = 0; this.disy = 0;
	    this.onmove = false;
	    if(dir){
	    switch(dir){
	    	case "right" : this.target.view.playAnim("stopRight"); break;
	        case "left" : this.target.view.playAnim("stopLeft"); break;
	        case "up" : this.target.view.playAnim("stopUp"); break;
	        case "down" : this.target.view.playAnim("stopDown"); break;
	    }
	    this.target.move(this.disx,this.disy);
	    }
	}
};


// Camera
mdj.Camera = function(width, height, target, offx, offy){
	this.offx=offx;
	this.offy=offy;
	this.scene = null;
	this.height = height;
	this.width = width;
	this.moveCb = new mse.Callback(this.move, this);
	this.setTarget(target,offx,offy);
};
mdj.Camera.prototype = {
	move : function(e){
		if(this.scene)
		{
			this.scene.move(-e.dx, -e.dy);
		}
	},
	setTarget : function(target, offx, offy){
		if(!target instanceof mdj.Model) return;
		this.target = target;
		this.offx = isNaN(offx)?0:offx;
		this.offy = isNaN(offy)?0:offy;
		target.evtDelegate.addListener('deplace',this.moveCb);
	}
};



// Interaction avec les objets
mdj.InteractionObj = function(posX, posY, width, height,view){
	mdj.Model.call(this, posX, posY, width, height, view);

};
extend(mdj.InteractionObj, mdj.Model);
$.extend(mdj.InteractionObj.prototype, {
	interagir : function(target) {
		this.posCenter=[target.posX+(target.width/2),target.posY+(target.height/2)];
		if((this.posCenter[0] >= this.posX) && (this.posCenter[0] <= (this.posX+this.width)) && (this.posCenter[1] >= this.posY) && (this.posCenter[1] <=(this.posY+this.height))){
			mse.root.evtDistributor.removeListener('keydown', this.movecb);
		    mse.root.evtDistributor.removeListener('keyup', this.moveovercb);
		    alert('Tu as perdu ! Retente ta chance en cliquant sur OK');
		  	mdj.currGame.init();
		}; 
	}
});

mdj.angleFor2Point = function (p1, p2) {
	var angle = 0;
	var dx = p2[0] - p1[0];
	var dy = p2[1] - p1[1];
	angle = Math.atan2(dy, dx);
	return angle;
};

mdj.distance2Pts = function (p1,p2) {
    return Math.sqrt(Math.pow(p2[0]-p1[0], 2)+Math.pow(p2[1]-p1[1], 2));
};


// Les npc
mdj.Npc = function(posX, posY, width, height,course, vitesse, rotat, view){
	mdj.InteractionObj.call(this, posX, posY, width,height, view);
	this.rotat = rotat;
	this.posX=posX;
	this.posY=posY;
	this.course = course; 
	if (this.course.length && this.course.length >0) {
	    this.v=vitesse;
	    this.current=0;
	    this.next=1;
	}
};
extend(mdj.Npc, mdj.InteractionObj);
$.extend(mdj.Npc.prototype, {
	
	move: function(dir){
		switch(dir){
	        case "right" : this.state=1;this.view.playAnim("rightNpc"); break;
	        case "left" : this.state=2;this.view.playAnim("leftNpc"); break;
	        case "up" : this.state=4;this.view.playAnim("upNpc"); break;
	        case "down" : this.state=3;this.view.playAnim("downNpc"); break;
	        case "run" : this.state=5;this.view.playAnim("run"); break;
	        case "stop" : this.state=5;this.view.playAnim("stop"); break;
	    }
	},
	play : function(){
		this.startP = this.course[this.current];
		this.endP = this.course[this.next];
	    this.angle = mdj.angleFor2Point(this.startP, this.endP);
	    this.distance = mdj.distance2Pts(this.startP, this.endP);
	    
	    var px = this.course[this.next][0] - this.posX;
	    var py = this.course[this.next][1] - this.posY;
	    
	    var dx = Math.cos(this.angle)*this.v;
	    var dy = Math.sin(this.angle)*this.v;
	    
	    if(this.rotat){
	    	this.rotation = this.angle;
	    	if(this.state!=5)this.move("run");
	    	this.posY += dy;
            this.posX += dx;
	    }else{
			 if(px ==0) {
                 //Movement vertical
                if(py < -this.v) {if(this.state!=4){this.move("up")};this.posY -= this.v;return;}
                else if(py > this.v) {if(this.state!=3){this.move("down")};this.posY += this.v;return;}
            }
            else {
                // Movement horizontal
                if(px < -this.v) {if(this.state!=2){this.move("left")};this.posX -= this.v;return;}
                else if(px > this.v) {if(this.state!=1){this.move("right")};this.posX += this.v;return;}
            };
            
		}
        // Movement over
	    this.posX = this.course[this.next][0];
	    this.posY = this.course[this.next][1];
	    if(this.current < this.next) {
		    this.current = this.next;
		    this.next = (this.next == this.course.length-1) ? this.next-1 : this.next+1;
	    }
	    else {
		    this.current = this.next;
		    this.next = (this.next == 0) ? 1 : this.next-1;
	    }
	}
});


// Les items
mdj.Item = function(posX, posY, width, height, view){
	mdj.InteractionObj.call(this, posX, posY, width, height, view);
};
extend(mdj.Item, mdj.InteractionObj);
$.extend(mdj.Item.prototype, {
	init : function (posX,posY) {
		this.posX=posX;
		this.posY=posY;
	}
});




/*************************** Collision ***********************/
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
		target.evtDelegate.addListener('deplace',this.detectCb);
	}
};

