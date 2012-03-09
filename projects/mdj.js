/*!
 * Mse Tiles2D Game Engine v0.1
 * Encre Nomade
 *
 * Author: BOULANGER Julie, GEORGE Kevin, NGUYEN Minh-Hai
 * Copyright 2011, MseEdition
 *
 * Date: 25/11/2011
 */
 



var mdj = function() {};
 
mdj.setGame = function(game) {
 	mdj.currGame = game;
 };
 
 /*********************** PARTIE SCENE *********************/
 mdj.Scene = function(map) {
 	this.setMap(map);
 	this.target = null;
 };
 mdj.Scene.prototype = {
 	constructor: mdj.Scene,
  	setMap: function(map){
  		this.map = map;
  	},
  	setCamera: function(width,height,target){
  		this.target = target;
  		var camera = new mdj.Camera(width,height,target,target.width/2,target.height/2);
  		camera.scene = this;
  	},
	draw: function(ctx,x,y){
		this.map.draw(ctx,x,y);
	},
	setPosition : function(offx, offy){
		this.map.posX = offx;
		this.map.posY = offy;
	},
	move : function(dx,dy){
		this.map.posX += dx;
		this.map.posY += dy;
	},
	setCollision: function(target){
	var collision = new mdj.Collision(this.map,target);
	}
 };
 
 
  /********* PARTIE VIEW ********/
mdj.View= function (img, frames) {
	this.model = null;
};

mdj.View.prototype= {
	constructor: mdj.View,
	configModel : function(model){
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
	if (this.course.length && this.course.length >0){
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


 
mdj.ObjLayer = function(offx,offy,depth){
	this.objList = new Array();
	this.parent=null;
	
	if(depth) this.depth = depth;
	else this.depth = null;
	
	if(offx) this.offx=offx
	else this.offx = 0;
	if(offy) this.offy = offy
	else this.offy = 0;
};
mdj.ObjLayer.prototype = {
	addObj: function(obj){
		if(!obj instanceof mdj.Model) return; 
		
		this.objList.push(obj);
		obj.parent=this;
		
	},
	draw: function(ctx){
		for(var i = 0; i < this.objList.length; i++) {
			this.objList[i].view.draw(ctx);
		}
	},
	getOffset: function(){
		if(this.parent) {
			var offs = this.parent.getOffset();
		}
		else{
			var offs = [0,0];
		}
		offs[0] += this.offx;
		offs[1] += this.offy;
		return offs;
	}
	
};






/* **************************Layer***************************/
mdj.Layer = function(parent, dictioLayer, nbre_col, tileheight, width_img, tilewidth, image, posX, posY, depth){
		this.parent = parent;
		this.dictioLayer = dictioLayer;
		this.nbre_col = nbre_col;
		this.tileheight = tileheight;
		this.width_img = width_img;
		this.tilewidth = tilewidth;
		this.image = image;
		this.posX = posX;
		this.posY = posY;
		this.depth = depth;
	};
	

mdj.Layer.prototype = {
	
	drawTile : function(numTile, context, posOffx, posOffy) {

		var column = numTile % (this.width_img / this.tilewidth);
		if(column == 0)
			column = this.width_img / this.tilewidth;

		var row = Math.ceil(numTile / (this.width_img / this.tilewidth));

		var posxTile = (column - 1) * this.tilewidth;
		var posyTile = (row - 1) * this.tileheight;
		var dx = posOffx + this.posX;
		var dy = posOffy + this.posY;
		var src = mse.src.getSrc(this.image);
		if(src && posxTile > -1 && posyTile > -1)
			context.drawImage(src, posxTile, posyTile, this.tilewidth, this.tileheight, dx, dy, this.tilewidth, this.tileheight);
	},
	
	draw : function(context) {
		
			//if (this.verif==true){
			var y = 0;
			var v = 0;
			var k = -1;

			for(var n = 0, p = this.dictioLayer.array.length; n < p; n++) {
				if(n > this.nbre_col - 1 && n % this.nbre_col == 0) {
					y++;
					v = y * this.tileheight;
					k = -1;
				}

				if(k < this.nbre_col) {
					k++;
				}
				this.drawTile(this.dictioLayer.array[n], context, k * this.tilewidth, v);
			}
		//	}
			/*if(this.verif==false){
				console.log("toto");
				var src2 = mse.src.getSrc(this.image);
				context.drawImage(src2,this.posX,this.posY,this.tilewidth,this.tileheight); 
			}*/
	}
};


	
/*****************************MAP******************************/

mdj.Map = function(posX, posY, url_tmx){
	
	this.posX = posX;
	this.posY = posY;
	this.url_tmx = url_tmx;
	this.layers = [];
	
		$.ajax({
			type : "GET",
			url : url_tmx,
			dataType : "xml",
			context: this,
			complete: function(xhr, code) {
				this.parseXml(xhr.responseText);
			}
		});
};

extend(mdj.Map, mdj.Layer);
$.extend(mdj.Map.prototype, {
	getOffset : function(){
		var offs;
		return offs[this.posX,this.posY];
	},
	parseXml : function(xml) {
		
		var xmlDoc = $.parseXML(xml);
		var xml = $(xmlDoc);
		var map = xml.find("map");
		var tileset = xml.find("tileset");
		var image = xml.find("image");
		var layer = xml.find("layer");
		var data = xml.find("data");
		var orientation = map.attr("orientation");
		var nbre_col = map.attr("width");
		var nbre_ligne = map.attr("height");
		var tilewidth = map.attr("tilewidth");
		var tileheight = map.attr("tileheight");
		var firstgid = tileset.attr("firstgid");
		var name_tileset = tileset.attr("name");
		var tilewidth_tileset = tileset.attr("tilewidth");
		var tileheight_tileset = tileset.attr("tileheight");
		
		var source_img = image.attr("source");
		var width_img = image.attr("width");
		var height_img = image.attr("height");
		
		mse.src.addSource("img_tileset", source_img, "img",true);
		var image = "img_tileset";
		
		var depth = 0;
		
		var nbre_couche = 0;
		
		layer.each(function(){
		nbre_couche= nbre_couche +1;
		});	
	 	var saveheight;
	 	var savewidth;
	 	for(g=1; g<nbre_couche + 1;g++)
	 		{
	 			dictioLayer = {};
	 			if (g==1){
	 			dictioLayer.name = layer.attr("name");
				dictioLayer.encoding = data.attr("encoding");
				dictioLayer.compression = data.attr("compression");
				dictioLayer.width = layer.attr("width");
				dictioLayer.height = layer.attr("height");
				saveheight=layer.attr("height");
				savewidth=layer.attr("width");}
				dictioLayer.tmxmap = data.text();
	 			dictioLayer.array = Utils.decodeBase64AsArray(dictioLayer.tmxmap,4);
	 			var sep = saveheight*savewidth;
	 			
	 			if(g==1){dictioLayer.array.splice(sep,sep*nbre_couche);}
	 			
	 			else if(g==nbre_couche){dictioLayer.array.splice(0,sep*(nbre_couche-1));}
	 			
	 			else {
	 				dictioLayer.array.splice(0,sep*(g-1));
	 				dictioLayer.array.splice(sep,sep*(nbre_couche-g+1));
	 			}
	 			depth++;
	 			dictioLayer.depth = depth;
	 			
				var layer = new mdj.Layer(this, dictioLayer, nbre_col, tileheight, width_img, tilewidth, image, this.posX, this.posY, depth);
				this.addLayer(layer);
	 		}
	},
	

	addLayer : function(layer,depth) {
		if( layer instanceof mdj.Layer || layer instanceof mdj.ObjLayer) {
			console.log(this.layers.length);
			this.putDepth(layer, depth);
			layer.parent=this;
			this.layers.push(layer);

			for(var i = 0; i < this.layers.length - 1; i++) {

				if(layer.depth == this.layers[i].depth) {
					for(var j = i; j < this.layers.length - 1; j++) {
						this.layers[j].depth = this.layers[j].depth + 1;
					}
				}

			}
			this.sortElement();
		}
	}, sortElement : function() {
		this.layers.sort(function(a, b) {

			if(a.depth < b.depth)
				return -1;
			else if(a.depth > b.depth)
				return 1;
			else
				return 0;

			//return a.dictioLayer.depth - b.dictioLayer.depth;
		});
	}, putDepth : function(layer,depth) {

		if(!isNaN(depth))
			layer.depth = depth;
		else if(layer.depth == undefined) {
			layer.depth = (this.layers.length==0)?0:(this.layers[(this.layers.length) - 1].depth + 1);
		}

		/*	for(vari=0;i<this.layers.length;i++){
		 var checknb = isNaN(this.layers[i].dictioLayer.depth);
		 if(checknb==true){
		 this.layers[i].dictioLayer.depth =this.layers[i-1].dictioLayer.depth;
		 }
		 }*/
	}, draw : function(context,x,y) {
		context.save();
		context.beginPath();
		context.rect(0, 0, 475, 356);
		context.clip();
		context.translate(this.posX, this.posY);
		for(var e = 0; e < this.layers.length; e++) {
			this.layers[e].draw(context);
		}
		context.restore();
	}

	
	/*this.getPosX = function(){
		return this.posX;	
	};
	
	this.getPosY = function(){
		return this.posY;	
	};
	
	
	this.setPosX = function(posX){
		this.posX = posX;
	};

	this.setPosX = function(posX) {
		this.posX = posX;
	};

	this.addLayer = function(){
		
	};
	
	this.delLayer = function(){
		
	};*/
});

var Base64 = {

		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		decode : function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			while(i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);

				if(enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if(enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}

			}
			output = Base64._utf8_decode(output);

			return output;

		},

		_utf8_decode : function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;

			while(i < utftext.length) {
				c = utftext.charCodeAt(i);

				if(c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}

			}

			return string;
		}
	}


	var Utils =  {

		decodeBase64 : function(input) {
			return Base64.decode(input);
		},

		decodeBase64AsArray : function(input, bytes) {
			bytes = bytes || 1;

			var dec = Base64.decode(input), ar = [], i, j, len;

			for (i = 0, len = dec.length / bytes; i < len; i++) {
				ar[i] = 0;
				for (j = bytes - 1; j >= 0; --j) {
					ar[i] += dec.charCodeAt((i * bytes) + j) << (j << 3);
				}
			}
			return ar;
		}
	};

/***************************ObjectLAyer***********************/

mdj.ObjectLayer = function(){
	
	this.method = function(){
		
	}
	
};
extend(mdj.ObjectLayer, mdj.Layer);
$.extend(mdj.ObjectLayer.prototype, {

});

/***************************PersoLayer***********************/

mdj.PersoLayer = function(){
	
	this.methode = function(){
		
	};	
};

extend(mdj.PersoLayer, mdj.Layer);
$.extend(mdj.PersoLayer.prototype, {

});

/***************************TileLAyer***********************/

mdj.TileLayer = function(){
		
	this.methode = function(){
		
	};
};

extend(mdj.TileLayer, mdj.Layer);
$.extend(mdj.TileLayer.prototype, {

});

/***************************UlLAyer***********************/

mdj.UlLayer = function(){
	
	this.methode = function(){
		
	};
};

extend(mdj.UlLayer, mdj.Layer);
$.extend(mdj.UlLayer.prototype, {

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

