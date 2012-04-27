// effet : affectation des effets sur le texte ou l'image
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
    if(!this.config) this.config = {};
	if(config) $.extend(this.config, config);
	this.subject = subject;
	this.multi = multi===true ? true : false;
	this.count = 0;
};
mse.EffectImage.prototype = {
	constructor	: mse.EffectImage,
	init : function() {},
	end : function() {},
	logic : function(delta){
		if(this.count <= this.config.duration){							
			this.count++;
			if(this.multi) return true;
		}
		else{
		    this.end();
			if(this.multi) return false;
			this.subject.endEffect();
		}
	},
	toString : function(){return "[object mse.EffectImage]"}
};
/*******************************************************************/
mse.EIColorFilter = function(subject, config, multi) {    
    this.config = {
    	duration : Number.POSITIVE_INFINITY,
    	rMulti: 1,
    	gMulti: 1,
    	bMulti: 1
    };
    if(config.rMulti > 1 || config.rMulti < 0) delete config.rMulti;
    if(config.gMulti > 1 || config.gMulti < 0) delete config.gMulti;
    if(config.bMulti > 1 || config.bMulti < 0) delete config.bMulti;
    mse.EffectImage.call(this, subject, config, multi);
    
    this.canvas = document.createElement("canvas");
}
extend(mse.EIColorFilter, mse.EffectImage);
$.extend(mse.EIColorFilter.prototype, {
    init: function(config, subject) {
        if(config) $.extend(this.config, config);
        if(subject) this.subject = subject;
        this.count = 0;
        this.update();
    },
    update : function (){
        var cache = this.subject.cache;
        if(!cache) return;
        var ctx = this.canvas.getContext("2d");
        if(this.canvas.width != cache.width) {
            this.canvas.width = cache.width;
            this.canvas.style.width = cache.width;
        }
        if(this.canvas.height != cache.height) {
            this.canvas.height = cache.height;
            this.canvas.style.height = cache.height;
        }
        
        ctx.save();
        ctx.clearRect(0, 0, cache.width, cache.height);
    	ctx.drawImage(cache, 0,0, cache.width, cache.height);
    	ctx.globalCompositeOperation = "source-atop";
    	
    	ctx.fillStyle = "#f00";
    	ctx.globalAlpha = 1 - this.config.rMulti;
    	ctx.fillRect(0, 0, cache.width, cache.height);
    	ctx.fillStyle = "#0f0";
    	ctx.globalAlpha = 1 - this.config.gMulti;
    	ctx.fillRect(0, 0, cache.width, cache.height);
    	ctx.fillStyle = "#00f";
    	ctx.globalAlpha = 1 - this.config.bMulti;
    	ctx.fillRect(0, 0, cache.width, cache.height);
    	ctx.restore();
    },
    draw: function(ctx, cache, ox, oy, width, height) {
        ctx.drawImage(this.canvas, ox, oy, width, height);
    }
});
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
		"candle" : ["pixel","weather"],
		"filter": []
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
		"lightcandle" : "candle",
		"colorfilter": "filter"
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
				    case "filter": break;
					case "pixel" :
					case "weather" : principalDraw = listEffect[i];break;
				}
			}
		}
		return {"filteredEffectArray":filteredEffectArray,"principalDraw": principalDraw};		
	},
	init : function() {
	    for(var effect in this.filtered["filteredEffectArray"])
	        this.dictObjEffects[this.filtered["filteredEffectArray"][effect]].init();
	},
	logic : function(delta){
		var endMultiEffect = true;
		for(var effect in this.filtered["filteredEffectArray"]){
			if(this.dictObjEffects[this.filtered["filteredEffectArray"][effect]].logic(delta))
			    endMultiEffect = false;
		}
		if(endMultiEffect) this.subject.endEffect();
	},
	draw : function (ctx,x,y){
		if(this.filtered["principalDraw"]) 
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
				case "colorfilter" : return (new mse.EIColorFilter(subject,effectConf[nEffect],false));
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
				case "colorfilter" : dictObjEffects[nEffect] = new mse.EIColorFilter(subject,effectConf[nEffect],false);break;
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
})(mse);