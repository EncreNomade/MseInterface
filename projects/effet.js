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

mse.src.addSource('fogEffectImg', 'src/CL15.png', 'img', true);
mse.src.addSource('fogBetaImg', 'src/blue_fog.jpg', 'img', true);

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
mse.ESVibration = function (){
	mse.EffectScreen.call(this);
	
	this.count = 0;
	this.imgPixels = null;
};
extend(mse.ESVibration,mse.EffectScreen);
$.extend(mse.ESVibration.prototype, {
	label : "vibration",
	process : function(ctx){
		if(!(this.count%1)){
			this.offsetX = (Math.random()-0.5)*8;
			this.offsetY = (Math.random()-0.5)*8;
		}

		this.imgPixels = ctx.getImageData(0,0,800,600);
		ctx.clearRect(0,0,800,600);
		ctx.putImageData(this.imgPixels,this.offsetX,this.offsetY,0,0,this.imgPixels.width,this.imgPixels.height);
		
		this.count++;
		if(this.count > 2000) this.endEffect();
	},
	toString : function(){
		return this.label;
	}
});
	
/*******************************************************************/
mse.ESDropdown = function (){
    mse.EffectScreen.call(this);
    this.count = 0;
    
    this.imgPixels = null;
    this.offsetY = 0;
    this.markFalling = true;
           
	this.buffH = 0;
    this.g = 9.8;
    this.h = 0;
    this.Vo = 0;
    this.Vt = 0;
    this.t = 0;
};
extend(mse.ESDropdown,mse.EffectScreen);
$.extend(mse.ESDropdown.prototype, {
    label : "dropdown",
    process : function(ctx){
    	this.offsetY = -ctx.canvas.height;
    	
        if(this.markFalling)this.falling(ctx);
        else this.rising(ctx);

        this.imgPixels = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.putImageData(this.imgPixels,0,this.offsetY+this.h,0,0,this.imgPixels.width,this.imgPixels.height);

        this.count++; this.t++;
        if(this.count > 800) this.endEffect();
    },
    falling : function(ctx){
        this.Vt = this.Vo + this.g*this.t;
        this.h = this.buffH + 0.5*this.g*this.t*this.t;
        if(this.h > ctx.canvas.height){
            this.h = ctx.canvas.height;
            this.t = 0;
            this.Vo = this.Vt/2;
            this.markFalling = false;
        }
    },
    rising : function(ctx){
        this.Vt = this.Vo + (-this.g)*this.t;
        this.h = ctx.canvas.height - (this.Vt*this.Vt - this.Vo*this.Vo)/(2*(-this.g));
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
	//Can not use "if" statement here.
};
/*******************************************************************/
mse.ETFadein = function(subject,config,multi) { //Effect Type 1.1
	mse.EffectText.call(this,subject,config,multi);
	this.count = 0;
	
	this.config = {
		duration : 30,
		start : 0,
		end : 1
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETFadein,mse.EffectText);
$.extend(mse.ETFadein.prototype, { //Only constants we should put into prototype!!!
	label : "fadein",
	logic : function(delta){
		if(this.count <= this.config.duration){
			this.subject.globalAlpha = this.config.start + (this.count/this.config.duration)*(this.config.end-this.config.start);
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
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
mse.ETColored = function(subject,config,multi) { //Effect Type 1.2
	mse.EffectText.call(this,subject,config,multi);
	
	this.valR = 255; this.valG = 255; this.valB = 255;
	this.count = 0;
	
	this.config = {
		duration : 30,
		typeColor : Math.round(Math.random()*5),
		endColor : "#ffffff"
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETColored,mse.EffectText);
$.extend(mse.ETColored.prototype, {
	label : "colored",
	logic : function(delta){
		//Nouvelle idée : var gr=ctx.createLinearGradient(0,400,300,0); ctx.fillStyle=gr;
		if(this.count <= this.config.duration){
			var hexvalR = Math.round(this.valR).toHexString();
			var hexvalG = Math.round(this.valG).toHexString();
			var hexvalB = Math.round(this.valB).toHexString();
			hexvalR = hexvalR.length<2 ? ("0"+hexvalR) : hexvalR;
			hexvalG = hexvalG.length<2 ? ("0"+hexvalG) : hexvalG;
			hexvalB = hexvalB.length<2 ? ("0"+hexvalB) : hexvalB;
			this.subject.fillStyle = "#"+hexvalR+hexvalG+hexvalB;

			switch(this.config.typeColor){
				case 0 : this.valR -= 3.5; this.valG -= 1; this.valB -= 0.5; break;
				case 1 : this.valR -= 6; this.valG -= 3.5; this.valB -= 3; break;
				case 2 : this.valR -= 4; this.valG -= 2; this.valB -= 6; break;
				case 3 : this.valR -= 1; this.valG -= 6; this.valB -= 2.5; break;
				case 4 : this.valR -= 5; this.valG -= 7; this.valB -= 4.5; break;
				case 5 : this.valR -= 2; this.valG -= 4; this.valB -= 8; break;
				default : break;	 
			}
			this.count++;
			if(this.multi)return true;
		}
		else{
			this.subject.fillStyle = this.config.endColor; //reset to the color White
			if(this.multi)return false;
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
		speed : 0
	};
	
	if(config)$.extend(this.config,config);
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
			if(this.multi)return true;
		}
		else{
			//this.subject.fillStyle = "#78A8FF";
			//this.subject.strokeStyle = "blue";
			if(this.multi)return false;
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
mse.ETPainttext = function(subject,config,multi) { //Effect Type 3
	mse.EffectText.call(this,subject,config,multi);
	
	this.count = 0;
	this.measureText = false;
	this.frameTextHeight = 18+5; //equal to fontSize+2(because of french accents)
	this.frameTextWidth = 0; //should be measured later
	
	this.config = {
		duration : 30,
		direction : "drop"
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETPainttext,mse.EffectText);
$.extend(mse.ETPainttext.prototype, {
	label : "painttext",
	logic : function(delta){
		//Nothing to do
		if(this.multi){
			if(this.count<=this.config.duration)return true;
			else return false;
		}
	},
	draw : function (ctx){
		if(this.count<=this.config.duration){
			if(!this.measureText){
				/**For security reason, you should turn on UniversalBrowserRead in Firefox**/
				//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				/**Or you can directly configure it in your browser--about:config->signed.applets.codebase_principal_support:"true"**/ 
				
				this.frameTextWidth = ctx.measureText(this.subject.text).width;
				this.measureText = true;
			}
			
			switch(this.config.direction){
				case "pull" :
				case "push" :
				case "raise" : this.imageText = ctx.getImageData(this.subject.getX(),this.subject.getY()-4,this.frameTextWidth,this.frameTextHeight);break;
				case "drop" : this.imageText = ctx.getImageData(this.subject.getX(),this.subject.getY(),this.frameTextWidth,this.frameTextHeight);break;
				default : break;
			}
			
			ctx.fillText(this.subject.text,this.subject.getX(),this.subject.getY());
			
			switch(this.config.direction){
				case "raise" : ctx.putImageData(this.imageText,this.subject.getX(),this.subject.getY()-4,0,0,this.frameTextWidth,this.frameTextHeight*(1-this.count/this.config.duration));break;
				case "push" : ctx.putImageData(this.imageText,this.subject.getX(),this.subject.getY()-4,this.frameTextWidth*(this.count/this.config.duration),0,this.frameTextWidth*(1-this.count/this.config.duration),this.frameTextHeight);break;
				case "pull" : ctx.putImageData(this.imageText,this.subject.getX(),this.subject.getY()-4,0,0,this.frameTextWidth*(1-this.count/this.config.duration),this.frameTextHeight);break;
				case "drop" : ctx.putImageData(this.imageText,this.subject.getX(),this.subject.getY(),0,this.frameTextHeight*(this.count/this.config.duration),this.frameTextWidth,this.frameTextHeight*(1-this.count/this.config.duration));break;
				default : break;
			}
			
			this.count++;
		}
		else{
			ctx.fillText(this.subject.text,this.subject.getX(),this.subject.getY()); //To avoid flashing during the change
			if(!this.multi)this.subject.endEffect();
		}
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.ETFlytext = function(subject,config,multi) { //Effect Type 2
	mse.EffectText.call(this,subject,config,multi);
	this.index1X = Math.round(Math.random()*1);
	this.index1Y = Math.round(Math.random()*1);
	this.index2X = Math.round(Math.random()*3);
	this.index2Y = Math.round(Math.random()*3);
	
	this.count = 0;
	
	this.config = {
		duration : 30
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETFlytext,mse.EffectText);
$.extend(mse.ETFlytext.prototype, {
	label : "flytext",
	logic : function(delta){
		this.originX = this.subject.getX();
		this.originY = this.subject.getY();
		if(this.count <= this.config.duration){
			
			var val1 = mse.sin(this.count,30,360/this.config.duration);
			var val2 = this.originX*(-1+this.count/this.config.duration);
			var val3 = this.originY*(-1+this.count/this.config.duration);
			
			this.data1 = [val1,-val1];
			this.data2 = [val2,val3,-val2,-val3];
			
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx){
		ctx.fillText(this.subject.text,this.originX+this.data1[this.index1X]+this.data2[this.index2X],this.originY+this.data1[this.index1Y]+this.data2[this.index2Y]);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.ETZoomtext = function(subject,config,multi) { //Effect Type 1.3
	mse.EffectText.call(this,subject,config,multi);
	
	this.count = 0;
	
	this.config = {
		duration : 30,
		start : 18,
		end : 18,
		max : 33,
		ratio : 0.5
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETZoomtext,mse.EffectText);
$.extend(mse.ETZoomtext.prototype, {
	label : "zoomtext",
	logic : function(delta){
		if(this.count <= this.config.duration){
			if(this.count <= this.config.duration*this.config.ratio){
				this.subject.font = (this.config.start+(this.count/(this.config.duration*this.config.ratio))*(this.config.max-this.config.start)).toString() + "px " + mse.configs.font;
			}
			else{
				this.subject.font = (this.config.end+(1-((this.count-(this.config.duration*this.config.ratio))/((1-this.config.ratio)*this.config.duration)))*(this.config.max-this.config.end)).toString() + "px " + mse.configs.font;
			}
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
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
mse.ETDeformtext = function(subject,config,multi) { //Effect Type 4
	mse.EffectText.call(this,subject,config,multi);
	
	this.count = 0;
	this.alphabetsDePhrase = this.subject.text.split('');
	this.longueur = this.alphabetsDePhrase.length;
	this.fontsizeArray = new Array();
	
	this.config = {
		duration : 30,
		variation : 10,
		ratio : 0.5,
		height : 10
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.ETDeformtext,mse.EffectText);
$.extend(mse.ETDeformtext.prototype, {
	label : "deformtext",
	logic : function(delta){
		if(this.count <= this.config.duration){
			for(var i = 0; i < this.longueur; i++){
				var size = 0;
				var valueCos = (-Math.cos((i/this.longueur)*360*(Math.PI/180)));
				if(this.count <= this.config.duration*this.config.ratio){
					size = this.config.variation*(this.count/(this.config.duration*this.config.ratio))*valueCos+18+this.config.height*(this.count/(this.config.duration*this.config.ratio));
				}
				else{
					size = this.config.variation*((this.config.duration-this.count)/(this.config.duration*(1-this.config.ratio)))*valueCos+18+this.config.height*((this.config.duration-this.count)/(this.config.duration*(1-this.config.ratio)));
				}
				size = Math.round(size);
				this.fontsizeArray[i] = size.toString() + "px " + mse.configs.font;
			}
			
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}
	},
	draw : function (ctx){
		var stringWidth = 0, stringWidthArray = [0];
		var initialStringWidth = ctx.measureText(this.subject.text).width;;
		var offsetX = 0;
		for(var i = 0; i < this.longueur; i++){
			ctx.font = this.fontsizeArray[i];
			//ctx.fillText(this.alphabetsDePhrase[i],this.subject.getX()+stringWidth,this.subject.getY());
			stringWidth += ctx.measureText(this.alphabetsDePhrase[i]).width;
			stringWidthArray[i+1] = stringWidth;
		}
		offsetX = -(stringWidth - initialStringWidth)/2;
		for(var i = 0; i < this.longueur; i++){
			ctx.font = this.fontsizeArray[i];
			ctx.fillText(this.alphabetsDePhrase[i],this.subject.getX()+stringWidthArray[i]+offsetX,this.subject.getY());
		}
		
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
	conflict : {
		"param" : [],
		"zoom" : ["imageData"],
		"trajet" : ["imageData","content","trajet"],
		"imageData" : ["trajet","zoom","content","imageData"],
		"content" : ["imageData","trajet","content"]		
	},
	classification : {
		"fadein" : "param",
		"colored" : "param",
		"zoomtext" : "zoom",
		"flytext" : "trajet",
		"painttext" : "imageData",
		"typewriter" : "content",
		"deformtext" : "content"
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
				case "fadein" : return (new mse.ETFadein(subject,effectConf[nEffect],false));
				case "colored": return (new mse.ETColored(subject,effectConf[nEffect],false));
				case "typewriter": return (new mse.ETTypewriter(subject,effectConf[nEffect],false));
				case "painttext": return (new mse.ETPainttext(subject,effectConf[nEffect],false));
				case "flytext": return (new mse.ETFlytext(subject,effectConf[nEffect],false));
				case "zoomtext" : return (new mse.ETZoomtext(subject,effectConf[nEffect],false));
				case "deformtext" : return (new mse.ETDeformtext(subject,effectConf[nEffect],false));
				default : return null;				
			}
		}
		return null;
	}
	else{
		var dictObjEffects = {};
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fadein" : dictObjEffects[nEffect] = new mse.ETFadein(subject,effectConf[nEffect],true);break;
				case "colored": dictObjEffects[nEffect] = new mse.ETColored(subject,effectConf[nEffect],true);break;
				case "typewriter": dictObjEffects[nEffect] = new mse.ETTypewriter(subject,effectConf[nEffect],true);break;
				case "painttext": dictObjEffects[nEffect] = new mse.ETPainttext(subject,effectConf[nEffect],true);break;
				case "flytext": dictObjEffects[nEffect] = new mse.ETFlytext(subject,effectConf[nEffect],true);break;
				case "zoomtext": dictObjEffects[nEffect] = new mse.ETZoomtext(subject,effectConf[nEffect],true);break;
				case "deformtext": dictObjEffects[nEffect] = new mse.ETDeformtext(subject,effectConf[nEffect],true);break;
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
mse.EIFadein = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);

	this.count = 0;
	
	this.config = {
		duration : 30,
		start : 0,
		end : 1
	};
	
	if(config)$.extend(this.config,config);
};
extend(mse.EIFadein,mse.EffectImage);
$.extend(mse.EIFadein.prototype, {
	label : "fadeinImage",
	logic : function(delta){
		if(this.count <= this.config.duration){
			this.subject.globalAlpha = this.config.start + (this.count/this.config.duration)*(this.config.end-this.config.start);
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img, x, y,this.subject.width,this.subject.height);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EISnow = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.count = 0;
	this.arrayX = new Array();
	this.arrayY = new Array();
	this.sfSin = new Array();
	this.arrayR = new Array();
	this.arrayAlpha = new Array();
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
		numSnowflake : 800,
		ratioSmallFlake : 0.833,
		minR : 0.8,
		maxR : 13
	};
	
	if(config)$.extend(this.config,config);

	for (i = 0; i <= this.config.numSnowflake; i++) {
    	var posX = Math.floor(Math.random()*this.subject.width);
        var posY = Math.floor(Math.random()*this.subject.height);
        var useRandomSin = Math.floor(Math.random()*5.999);
        
        if(i < this.config.numSnowflake*this.config.ratioSmallFlake){
        	var radius = Math.random()*2;
        	if(radius < this.config.minR)radius = this.config.minR;
        }
        else var radius = Math.random()*this.config.maxR;
        
        var sfAlpha = 1.0-radius/this.config.maxR;
          
        this.arrayX.push(posX);
        this.arrayY.push(posY);
        this.sfSin.push(useRandomSin);
        this.arrayR.push(radius);
        this.arrayAlpha.push(sfAlpha);
   }
};
extend(mse.EISnow,mse.EffectImage);
$.extend(mse.EISnow.prototype, {
	label : "snowImage",
	logic : function(delta){
		if(this.count <= this.config.duration){			
			this.arraySin = [mse.sin(this.count,8,5,this.count),mse.sin(this.count,8,7,this.count),mse.sin(this.count,8,9,this.count),
			mse.cos(this.count,8,5,this.count),mse.cos(this.count,8,7,this.count),mse.sin(this.count,8,9,this.count)];
								
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
		
        for (var i = 0; i <= this.config.numSnowflake; i++) {
			var snowX = this.arrayX[i]+this.arraySin[this.sfSin[i]];
			var snowY = this.arrayY[i]+3*this.count;
			if(snowX>this.subject.width)snowX %= this.subject.width;
			if(snowY>this.subject.height)snowY %= this.subject.height;

			//var rgSnow = ctx.createRadialGradient(snowX,snowY,this.arrayR[i]/2,snowX,snowY,this.arrayR[i]);
			//rgSnow.addColorStop(0,"rgba(255,255,255," + this.arrayAlpha[i] + ")");
			//rgSnow.addColorStop(1,"rgba(255,255,255,0)");
			//ctx.fillStyle = rgSnow;

			ctx.fillStyle = "white";
			var cacheAlpha = this.arrayAlpha[i];
			ctx.globalAlpha = cacheAlpha/Math.floor(this.arrayR[i]/2);			
			
			for(var j=0; j<Math.ceil(this.arrayR[i]/2);j++){
				ctx.beginPath();
				ctx.arc(snowX,snowY,this.arrayR[i]-j*(this.arrayR[i]/(Math.ceil(this.arrayR[i]/2)*2)),0,Math.PI*2,true);
				ctx.closePath();
				ctx.fill();
			}
        }		
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIRain = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);

	this.count = 0;
	this.arrayX = new Array();
	this.arrayY = new Array();
	this.arrayRainLength = new Array();
	this.arrayRainAlpha = new Array();
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
		numRainline : 120,
		minL : 15,
		maxL : 40,
		rainDirection : 5, //Il égale à speedRain si PAS DE 0
		speedRain : 25
	};
	
	if(config)$.extend(this.config,config);

	for (i = 0; i <= this.config.numRainline; i++) {
    	var posX = Math.floor(Math.random()*this.subject.width);
        var posY = Math.floor(Math.random()*this.subject.height);
        var rainLength = Math.ceil(Math.random()*(this.config.maxL-this.config.minL))+this.config.minL; 
         
        var cacheAlpha = Math.random()+0.05;
        var alphaRain = (cacheAlpha>0.18) ? 0.18 : cacheAlpha;
          
        this.arrayX.push(posX);
        this.arrayY.push(posY);
        this.arrayRainLength.push(rainLength);
        this.arrayRainAlpha.push(alphaRain);
   }
};
extend(mse.EIRain,mse.EffectImage);
$.extend(mse.EIRain.prototype, {
	label : "rainImage",
	logic : function(delta){
		if(this.count <= this.config.duration){							
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
		
        for (var i = 0; i <= this.config.numRainline; i++) {
        	if(this.config.speedRain > 10)var offsetX = this.config.rainDirection*1.5;
        	else var offsetX = this.config.rainDirection*4;
        	
			var offsetY = this.arrayRainLength[i];        	
      	
			var rainX = this.arrayX[i]+0.5+this.config.rainDirection*this.count;
			var rainY = this.arrayY[i]+0.5+this.config.speedRain*this.count;
			
			if(rainX>this.subject.width)rainX %= this.subject.width;
			if(rainY>this.subject.height)rainY %= this.subject.height;
			
			ctx.lineWidth = 1;
			ctx.lineCap  = "round";
			ctx.strokeStyle = "#ffffff";
			ctx.globalAlpha = this.arrayRainAlpha[i];

			ctx.beginPath();
			ctx.moveTo(rainX,rainY);
			ctx.lineTo(rainX-offsetX,rainY-offsetY);
			ctx.stroke();
			ctx.closePath();	

			ctx.globalAlpha = this.arrayRainAlpha[i]/1.8;

			ctx.beginPath();
			ctx.moveTo(rainX+1,rainY+1);
			ctx.lineTo(rainX+1-offsetX,rainY-1-offsetY);
			ctx.stroke();
			ctx.closePath();
						
			ctx.beginPath();
			ctx.moveTo(rainX-1,rainY+1);
			ctx.lineTo(rainX-1-offsetX,rainY-1-offsetY);
			ctx.stroke();
			ctx.closePath();	
			
			ctx.globalAlpha = this.arrayRainAlpha[i]/2.5;
			
			ctx.beginPath();
			ctx.moveTo(rainX+2,rainY+2);
			ctx.lineTo(rainX+2-offsetX,rainY-2-offsetY);
			ctx.stroke();
			ctx.closePath();			
			
			ctx.beginPath();
			ctx.moveTo(rainX-2,rainY+2);
			ctx.lineTo(rainX-2-offsetX,rainY-2-offsetY);
			ctx.stroke();
			ctx.closePath();	
        }		
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIFog = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.count = 0;
	this.newTime = 0;
	this.oldTime = 0;
	this.timeFac = 0;
	this.imgFog = new Image();
	this.puffs = new Array();
	this.canvas1 = document.createElement('canvas'); //Temporary printing
	this.canvas2 = document.createElement('canvas'); //Source of FOG
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
		density : 5,
		speed : 3
	};
	
	if(config)$.extend(this.config,config);
	
	this.canvas1.width = this.subject.width/2;
	this.canvas1.height = this.subject.height/2;
	this.ctx1 = this.canvas1.getContext('2d');
	
	this.imgFog = mse.src.getSrc('fogEffectImg');
	this.canvas2.width = this.subject.width;
	this.canvas2.height = this.subject.height;
	this.ctx2 = this.canvas2.getContext('2d');
	this.ctx2.globalAlpha = 1;
	this.ctx2.fillStyle = this.ctx2.createPattern(this.imgFog,'repeat');
	this.ctx2.fillRect(0,0,this.subject.width,this.subject.height);
	//this.ctx2.drawImage(this.imgFog,0,0,this.subject.width,this.subject.height);
	
	for(var i=0; i<this.config.density; i++){
		this.puffs.push(new this.Puff(i*15,this.canvas1.width,this.canvas1.height));
	}
};
extend(mse.EIFog,mse.EffectImage);
$.extend(mse.EIFog.prototype, {
	label : "fogImage",
	Puff : function(p,w,h){
		this.sx = (Math.random()*w)>>0; this.sy = (Math.random()*h)>>0;
		this.p = p; this.w = w; this.h = h;
		this.move = function(timeFac,ctx1,canvas2) {
			var p = this.p + 0.3*timeFac;
			var opacity = (Math.sin(p*0.05)*0.5);
			if(opacity <0) {
				p = opacity = 0;
				this.sy = (Math.random()*this.h)>>0;
				this.sx = (Math.random()*this.w)>>0;
			}
			this.p = p;
			ctx1.globalAlpha = opacity;
			ctx1.drawImage(canvas2,this.sx+p,this.sy+p,this.w-(p*2),this.h-(p*2),0,0,this.w,this.h);
		};
	},
	sortPuff : function(p1,p2){
		return p1.p-p2.p;
	},
	logic : function(delta){
		if(this.count <= this.config.duration){	
 			this.newTime = new Date().getTime();
 			if(0 === this.oldTime)this.oldTime = this.newTime;
 			this.timeFac = (this.newTime - this.oldTime)*0.1;
 			if(this.timeFac>this.config.speed)this.timeFac = this.config.speed;
 			this.oldTime = this.newTime;
 			this.puffs.sort(this.sortPuff);	
 								
			for(var i=0; i<this.puffs.length; i++){
 				this.puffs[i].move(this.timeFac,this.ctx1,this.canvas2);
 			}
						
			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
 		ctx.drawImage(this.canvas1,x,y,this.subject.width,this.subject.height);
 		this.ctx1.clearRect(0,0,this.canvas1.width,this.canvas1.height);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIVibration = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	this.count = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
	};	
	if(config)$.extend(this.config,config);

};
extend(mse.EIVibration,mse.EffectImage);
$.extend(mse.EIVibration.prototype, {
	label : "vibration",
	logic : function(delta){
		if(this.count <= this.config.duration){	
			if(!(this.count%2)){
				this.offsetX = (Math.random()-0.5)*30;
				this.offsetY = (Math.random()-0.5)*30;
			}

			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x+this.offsetX,y+this.offsetY,this.subject.width,this.subject.height);

	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIFogBeta2 = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.count = 0;
	this.timeFac = 0;
	this.imgFog = new Image();
	this.flagGetlist = false;
	this.listX = new Array();
	this.listY = new Array();
	
	this.seuil = 10;
	
	this.previousX = 0;
	this.previousY = 0;
	
	this.r = 1;
	this.R = 15;
	this.k = 1;
	
	this.imgPixels = null;
	
	this.canvas2 = document.createElement('canvas');
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
	};
	
	if(config)$.extend(this.config,config);
	
	var cbStart = new mse.Callback(this.dragStart, this);
	var cbMove = new mse.Callback(this.dragMove, this);
	var cbEnd = new mse.Callback(this.dragEnd, this);
	this.subject.getContainer().evtDeleg.addListener('gestureStart', cbStart);
	this.subject.getContainer().evtDeleg.addListener('gestureUpdate', cbMove);
	this.subject.getContainer().evtDeleg.addListener('gestureEnd', cbEnd);
	
	this.imgFog = mse.src.getSrc('fogBetaImg');
	this.canvas2.width = this.subject.width;
	this.canvas2.height = this.subject.height;
	this.ctx2 = this.canvas2.getContext('2d');
	this.ctx2.globalAlpha = 0.7;
	this.ctx2.drawImage(this.imgFog,0,0,this.canvas2.width,this.canvas2.height);

};
extend(mse.EIFogBeta2,mse.EffectImage);
$.extend(mse.EIFogBeta2.prototype, {
	label : "fogbetaImage2",
	dragStart : function(e){
		this.previousX = e.offsetX;
		this.previousY = e.offsetY;
		/*
		this.imgPixels = this.ctx2.getImageData(this.previousX-this.R,this.previousY-this.R,2*this.R+1,2*this.R+1);
		
		for(var y = 0; y < 2*this.R+1; y++){
			for(var x = 0; x < 2*this.R+1; x++){
				var i = (y*4) * (2*this.R+1) + x*4; 
				var d = mse.distance(this.previousX,this.previousY,x+this.previousX-this.R,y+this.previousY-this.R);
				if(d <= this.r){						
					this.imgPixels.data[i+3] = 0;
				}
				else if (d > this.r && d <= this.R){
					var ttt = ((d - this.r)/(this.R - this.r)) * this.k;
					this.imgPixels.data[i+3] = this.imgPixels.data[i+3]*ttt;
				}
				else ;
			}
		}
		
		this.ctx2.putImageData(this.imgPixels,this.previousX-this.R,this.previousY-this.R,0,0,this.imgPixels.width,this.imgPixels.height);
		*/
		this.imgPixels = null;
		this.firstDraw = false;
	},
	dragMove : function(e){	
		var testX = e.listX[e.listX.length-1];
		var testY = e.listY[e.listY.length-1];
		var d = mse.distance(this.previousX,this.previousY,testX,testY);

		if(d > this.seuil){
			//if(!this.firstDraw){
				
				/*
				
				this.imgPixels = this.ctx2.getImageData(this.previousX-this.R,this.previousY-this.R,2*this.R+1,2*this.R+1);
		
				for(var y = 0; y < 2*this.R+1; y++){
					for(var x = 0; x < 2*this.R+1; x++){
						var i = (y*4) * (2*this.R+1) + x*4; 
						var d = mse.distance(this.previousX,this.previousY,x+this.previousX-this.R,y+this.previousY-this.R);
						if(d <= this.r){						
							this.imgPixels.data[i+3] = 0;
						}
						else if (d > this.r && d <= this.R){
							var ttt = ((d - this.r)/(this.R - this.r)) * this.k;
							this.imgPixels.data[i+3] = this.imgPixels.data[i+3]*ttt;
						}
						else ;
					}
				}
		
				this.ctx2.putImageData(this.imgPixels,this.previousX-this.R,this.previousY-this.R,0,0,this.imgPixels.width,this.imgPixels.height);
				
				*/
				
				
			//	this.firstDraw = true;
			//}else{
			
			var alpha = angleForLine(this.previousX,this.previousY,testX,testY);
			var gamma = Math.PI/2 - alpha;
			var decalageY = Math.abs(Math.sin(gamma)*this.R);
			var decalageX = Math.abs(Math.cos(gamma)*this.R);
			
			
			
			
			var getimgOx = Math.min(this.previousX,testX)-decalageX, getimgOy = Math.min(this.previousY,testY)-decalageY;
			var getimgWidth = Math.abs(this.previousX-testX)+2*decalageX, getimgHeight = Math.abs(this.previousY-testY)+2*decalageY;
			this.imgPixels = this.ctx2.getImageData(getimgOx,getimgOy,getimgWidth,getimgHeight);			
			
			//var alpha = angleForLine(this.previousX,this.previousY,testX,testY);
			//var getimgOx = Math.min(this.previousX,testX)-this.R, getimgOy = Math.min(this.previousY,testY)-this.R;
			//var getimgWidth = Math.abs(this.previousX-testX)+2*this.R, getimgHeight = Math.abs(this.previousY-testY)+2*this.R;
			//this.imgPixels = this.ctx2.getImageData(getimgOx,getimgOy,getimgWidth,getimgHeight);
			
			//var Ox = (this.previousX + testX)/2, Oy = (this.previousY + testY)/2;
			//var gamma = 90 - alpha;
			//var x1 = Ox - this.R*Math.cos(gamma), y1 = Oy - this.R*Math.sin(gamma);
			//var x2 = Ox + this.R*Math.cos(gamma), y2 = Oy + this.R*Math.sin(gamma);

			for(var y = 0; y < this.imgPixels.height; y++){
				for(var x = 0; x < this.imgPixels.width; x++){
					var i = (y*4) * this.imgPixels.width + x*4;
					var offX = x + getimgOx, offY = y + getimgOy;
					
					//if(offX > x1 && offY < y1){
						var dis = mse.distance(this.previousX,this.previousY,offX,offY);
						var beta = angleForLine(this.previousX,this.previousY,offX,offY);
						var h = Math.abs(dis*Math.sin(beta-alpha));
						
						var dis2 = mse.distance(testX,testY,offX,offY);
						if(h <= this.R){
							this.imgPixels.data[i+3] = this.imgPixels.data[i+3]*(h/this.R);
						}
						
						
					//	if(h <= this.R){
							
					//	}				
					//}else if (offY >= y1 && offY <= y2) {
					//	if(h <= this.R){
							
					//	}
					//}else if (offY < x2 && offY > y2){
					
					//}

					
					
					
				}
			}
			this.ctx2.putImageData(this.imgPixels,getimgOx,getimgOy,0,0,this.imgPixels.width,this.imgPixels.height);

			this.previousX = testX;
			this.previousY = testY;
		//	}
		}

	},
	dragEnd : function(e){
		//var x = e.offsetX;
		//var y = e.offsetY;
		this.listX = this.listY = [];
		this.flagGetlist = false;
		this.imgPixels = null;
	},
	logic : function(delta){
		if(this.count <= this.config.duration){

			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
 		ctx.drawImage(this.canvas2,x,y,this.canvas2.width,this.canvas2.height);
 		//this.ctx1.clearRect(0,0,this.canvas1.width,this.canvas1.height);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIFogBeta = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.canvas2 = document.createElement('canvas');
	this.imgFog = new Image();
	//this.listX = new Array(); this.listY = new Array();
	this.imgPixels = null;
	this.count = 0;
	
	this.eraseAll = false;
	this.eraseAllRatio = 0.2;
	this.opacityBlur = 0.7;
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
		k : 1,
		r : 1,
		R : 15,
		eraseZone : [[0,0,this.subject.width,this.subject.height]]
	};
	
	if(config)$.extend(this.config,config);
	
	this.cbStart = new mse.Callback(this.dragStart, this);
	this.cbMove = new mse.Callback(this.dragMove, this);
	this.cbEnd = new mse.Callback(this.dragEnd, this);
	this.subject.getContainer().evtDeleg.addListener('gestureStart', this.cbStart);
	this.subject.getContainer().evtDeleg.addListener('gestureUpdate', this.cbMove);
	this.subject.getContainer().evtDeleg.addListener('gestureEnd', this.cbEnd);
	
	this.imgFog = mse.src.getSrc('fogBetaImg');
	this.canvas2.width = this.subject.width;
	this.canvas2.height = this.subject.height;
	this.ctx2 = this.canvas2.getContext('2d');
	this.ctx2.globalAlpha = this.opacityBlur;
	this.ctx2.drawImage(this.imgFog,0,0,this.canvas2.width,this.canvas2.height);

};
extend(mse.EIFogBeta,mse.EffectImage);
$.extend(mse.EIFogBeta.prototype, {
	label : "fogbetaImage",
	dragStart : function(e){
		var x = e.offsetX;
		var y = e.offsetY;
	},
	dragMove : function(e){
		//var centerX = this.listX[this.listX.length-1];
		//var centerY = this.listY[this.listY.length-1];
		var centerX = e.offsetX;
		var centerY = e.offsetY;

		this.imgPixels = this.ctx2.getImageData(centerX-this.config.R,centerY-this.config.R,2*this.config.R+1,2*this.config.R+1);
		for(var y = 0; y < this.imgPixels.height; y++){
			for(var x = 0; x < this.imgPixels.width; x++){
				var i = (y*4) * this.imgPixels.width + x*4; 
				var d = mse.distance(centerX,centerY,x+centerX-this.config.R,y+centerY-this.config.R);
				if(d <= this.config.r){						
					this.imgPixels.data[i+3] = 0;
				}
				else if (d > this.config.r && d <= this.config.R){
					var ttt = ((d - this.config.r)/(this.config.R - this.config.r)) * this.config.k;
					this.imgPixels.data[i+3] = this.imgPixels.data[i+3]*ttt;
				}
				else ;
			}
		}
		this.ctx2.putImageData(this.imgPixels,centerX-this.config.R,centerY-this.config.R,0,0,this.imgPixels.width,this.imgPixels.height);

	},
	dragEnd : function(e){
		if(!this.eraseAll){
			var numTotalPixels = 0, opacityZero = 0;
			for(var k = 0; k < this.config.eraseZone.length; k++){
				this.imgPixels = this.ctx2.getImageData(this.config.eraseZone[k][0],this.config.eraseZone[k][1],this.config.eraseZone[k][2],this.config.eraseZone[k][3]);
				for(var y = 0; y < this.config.eraseZone[k][3]; y++){
					for(var x = 0; x < this.config.eraseZone[k][2]; x+=10){	
						var i = (y*4) * this.config.eraseZone[k][2] + x*4; 
						if(this.imgPixels.data[i+3]<128)opacityZero++;
					}
				}
				numTotalPixels += this.config.eraseZone[k][2]*this.config.eraseZone[k][3];
			}
			if((opacityZero/(numTotalPixels/10))>this.eraseAllRatio)this.eraseAll = true;
		}
		
		this.imgPixels = null;
		//this.listX = this.listY = [];
	},
	logic : function(delta){
		if(this.count <= this.config.duration){

			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){		
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
		if(this.eraseAll){
			var alphaCache = ctx.globalAlpha;
			this.opacityBlur -= 0.01;
			if(this.opacityBlur >= 0){
				ctx.globalAlpha = this.opacityBlur;
				ctx.drawImage(this.canvas2,x,y,this.canvas2.width,this.canvas2.height);
				ctx.globalAlpha = alphaCache;
			}
			else {
				this.subject.getContainer().evtDeleg.removeListener('gestureStart', this.cbStart);
				this.subject.getContainer().evtDeleg.removeListener('gestureUpdate', this.cbMove);
				this.subject.getContainer().evtDeleg.removeListener('gestureEnd', this.cbEnd);
				this.subject.endEffect();
			}
		}
		else ctx.drawImage(this.canvas2,x,y,this.canvas2.width,this.canvas2.height);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EICandle = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);

	this.count = 0;
	this.newTime = 0;
	this.oldTime = 0;
	this.timeFac = 0;
	this.fires = new Array();
	this.canvas1 = document.createElement('canvas'); //Temporary printing
	

	this.config = {
		duration : Number.POSITIVE_INFINITY,
	};

	var cb = new mse.Callback(this.interaction, this);
	this.subject.getContainer().evtDeleg.addListener('click', cb);

	if(config)$.extend(this.config,config);

	this.canvas1.width = this.subject.width;
	this.canvas1.height = this.subject.height;
	this.ctx1 = this.canvas1.getContext('2d');

	//this.canvas2.width = this.subject.width;
	//this.canvas2.height = this.subject.height;
	//this.ctx2 = this.canvas2.getContext('2d');

};
extend(mse.EICandle,mse.EffectImage);
$.extend(mse.EICandle.prototype, {
	label : "candle",
	firePos : [[135,320,false],[596,370,false],[323,277,false],[503,306,false]],
	Fire : function(seq,x,y,maxR,minR,t,w,h){

		this.sx = x; this.sy = y; this.maxR = maxR; this.minR = minR; this.t = t; this.w = w; this.h = h; this.initSeq = seq;//const
		this.seq = seq; 
		this.R = 1; this.opacity=0.5; this.ratio = 0; this.zoom = true;
		this.startFire = true;

		this.move = function(timeFac,ctx1) {
			//determine all the parameters
			this.seq += 0.3*timeFac;

			if(this.seq - this.initSeq >= this.t){
				this.zoom = !this.zoom;
				this.seq = this.initSeq;
			}

			this.ratio = Math.sin(((this.seq - this.initSeq)/this.t)*Math.PI/2);

			if(this.zoom){
				if(this.startFire){
					this.R = this.maxR*this.ratio;
				}
				else{
					this.R = this.minR+(this.maxR-this.minR)*this.ratio;
				}
			}
			else{
				if(this.startFire)this.startFire = false;
				this.R = this.maxR+(this.minR-this.maxR)*this.ratio;
			}

			ctx1.globalAlpha = this.opacity + 0.2*Math.random();
		
			/*	
			//set the size of canvas to draw the fire
			var canvas2 = document.createElement('canvas'); //Source of Fire
			canvas2.height = canvas2.width = 2*this.R;
			
			var ctx2 = canvas2.getContext('2d');
			//draw fire
			var rg = ctx2.createRadialGradient(this.R,this.R,this.R/2,this.R,this.R,this.R);
			rg.addColorStop(0,"rgba(" + Math.floor(255-this.R*5) + "," + Math.floor(153+this.R*2) + ",0," + 0.9 + ")");
			rg.addColorStop(1,"rgba(255,255,0," + 0 + ")");
			ctx2.fillStyle = rg;

			ctx2.beginPath();
			ctx2.arc(this.R,this.R,this.R,0,Math.PI*2,true);
			ctx2.closePath();
			ctx2.fill();

			//put this fire onto ctx1
			ctx1.drawImage(canvas2,0,0,canvas2.width,canvas2.height,this.sx-this.R,this.sy-this.R,2*this.R,2*this.R);
			*/
			
			var rg = ctx1.createRadialGradient(this.sx,this.sy,this.R/4,this.sx,this.sy,this.R);
			rg.addColorStop(0,"rgba(" + Math.floor(255-this.R*3) + "," + Math.floor(153+this.R*1.3) + ",0," + 0.75 + ")");
			rg.addColorStop(1,"rgba(255,255,0," + 0 + ")");
			ctx1.fillStyle = rg;
			
			ctx1.beginPath();
			ctx1.arc(this.sx,this.sy,this.R,0,Math.PI*2,true);
			ctx1.closePath();
			ctx1.fill();			
			
		};
		
	},
	
	sortFire : function(f1,f2){
		return f1.seq-f2.seq;
	},
	interaction : function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		
		for(var arrayFire in this.firePos){
			if((x > this.firePos[arrayFire][0]-15) && (x < this.firePos[arrayFire][0]+15) && (y > this.firePos[arrayFire][1]-15) && (y < this.firePos[arrayFire][1]+15) && !this.firePos[arrayFire][2]){
				this.fires.push(new this.Fire(15,this.firePos[arrayFire][0],this.firePos[arrayFire][1],20,15,30,this.canvas1.width,this.canvas1.height));
				this.firePos[arrayFire][2] = true;
			}
		}
		
	},
	logic : function(delta){
		if(this.count <= this.config.duration){
			
 			this.newTime = new Date().getTime();
 			if(0 === this.oldTime)this.oldTime = this.newTime;
 			this.timeFac = (this.newTime - this.oldTime)*0.1;
 			if(this.timeFac>3)this.timeFac = 3;
 			this.oldTime = this.newTime;
 			this.fires.sort(this.sortFire);	
 								
			for(var i=0; i<this.fires.length; i++){
 				this.fires[i].move(this.timeFac,this.ctx1);
 			}

			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}		
	},
	draw : function (ctx,x,y){
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
 		ctx.drawImage(this.canvas1,x,y,this.subject.width,this.subject.height);
 		this.ctx1.clearRect(0,0,this.canvas1.width,this.canvas1.height);
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIBougie = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);

	this.count = 0;
	this.timeFac = 0;
	this.lightR = this.initlightR = 75;
	this.lightX = 0;
	this.lightY = 0;
	this.arrayAlpha = [0.0,0.0,0.0,0.0];
	
	this.canvas1 = document.createElement('canvas');
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
	};

	var cb = new mse.Callback(this.interaction, this);
	this.subject.getContainer().evtDeleg.addListener('click', cb);

	var cb2 = new mse.Callback(this.intermove, this);
	this.subject.getContainer().evtDeleg.addListener('move', cb2);

	if(config)$.extend(this.config,config);

	this.imgBG = mse.src.getSrc('bougieAImg');
	this.canvas1.width = 1256;
	this.canvas1.height = 600;
	this.ctx1 = this.canvas1.getContext('2d');
	this.ctx1.drawImage(this.imgBG,0,0,this.canvas1.width,this.canvas1.height);
		
};
extend(mse.EIBougie,mse.EffectImage);
$.extend(mse.EIBougie.prototype, {
	label : "bougie",
	firePos : [[135,320,false],[596,370,false],[323,277,false],[503,306,false]],
	intermove : function(e){
		this.lightX = e.offsetX;
		this.lightY = e.offsetY;
	},
	interaction : function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		for(var arrayFire in this.firePos){
			if((x > this.firePos[arrayFire][0]-15) && (x < this.firePos[arrayFire][0]+15) && (y > this.firePos[arrayFire][1]-15) && (y < this.firePos[arrayFire][1]+15) && !this.firePos[arrayFire][2]){
				this.firePos[arrayFire][2] = true;
			}
		}
	},
	logic : function(delta){
		if(this.count <= this.config.duration){
			this.lightR = this.initlightR * (0.95+Math.random()*0.1);

			this.count++;
			if(this.multi)return true;
		}
		else{
			if(this.multi)return false;
			this.subject.endEffect();
		}
	},
	draw : function (ctx,x,y){
		var img = mse.src.getSrc(this.subject.img);
		ctx.drawImage(img,x,y,this.subject.width,this.subject.height);
		
 		var rg = ctx.createRadialGradient(this.lightX,this.lightY,this.lightR/1.5,this.lightX,this.lightY,this.lightR);
 		rg.addColorStop(1,"rgba(0,0,0, 0.8)");
 		rg.addColorStop(0,"rgba(0,0,0, 0)");
 		ctx.fillStyle = rg;
 		ctx.fillRect(0,0,this.subject.width,this.subject.height);		
		
		if(this.firePos[0][2]){
			this.arrayAlpha[0] += 0.03;
			var alphaCache = ctx.globalAlpha;
			if(this.arrayAlpha[0] < 1)ctx.globalAlpha = this.arrayAlpha[0];
			else ctx.globalAlpha = 1;
			ctx.drawImage(this.canvas1,0,0,350,600,0,0,280,600);
			ctx.globalAlpha = alphaCache;
		}
		
		if(this.firePos[1][2]){
			this.arrayAlpha[1] += 0.03;
			var alphaCache = ctx.globalAlpha;
			if(this.arrayAlpha[1] < 1)ctx.globalAlpha = this.arrayAlpha[1];
			else ctx.globalAlpha = 1;
			ctx.drawImage(this.canvas1,605,0,650,600,279,0,521,600);
			ctx.globalAlpha = alphaCache;
		}
		
		if(this.firePos[2][2]){
			this.arrayAlpha[2] += 0.03;
			var alphaCache = ctx.globalAlpha;
			if(this.arrayAlpha[2] < 1)ctx.globalAlpha = this.arrayAlpha[2];
			else ctx.globalAlpha = 1;			
			ctx.drawImage(this.canvas1,350,0,110,382,280,0,89,386);
			ctx.globalAlpha = alphaCache;
		}
		
		if(this.firePos[3][2]){
			this.arrayAlpha[3] += 0.03;
			var alphaCache = ctx.globalAlpha;
			if(this.arrayAlpha[3] < 1)ctx.globalAlpha = this.arrayAlpha[3];
			else ctx.globalAlpha = 1;				
			ctx.drawImage(this.canvas1,460,0,140,295,447,100,114,295);
			ctx.globalAlpha = alphaCache;
		}
		
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIBlur = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.count = 0;
	
	this.active = false;
	this.radius = 20;
	this.iteration = 1;
	this.imgPixels = null;
	this.img = mse.src.getSrc(this.subject.img);
	
	this.frainSimon = false;
	this.timeStamp = 0;
	this.frainDuration = 200;
	
	this.canvasBuffer = document.createElement('canvas');
	this.canvasBuffer.width = this.subject.width;
	this.canvasBuffer.height = this.subject.height;
	this.ctxBuff = this.canvasBuffer.getContext('2d');	

	this.canvasBlur = document.createElement('canvas');
	this.canvasBlur.width = this.subject.width;
	this.canvasBlur.height = this.subject.height;
	this.ctxBlur = this.canvasBlur.getContext('2d');
	
	var cb = new mse.Callback(this.interaction, this);
	this.subject.getContainer().evtDeleg.addListener('keydown', cb);
	
	this.config = {
		duration : Number.POSITIVE_INFINITY,
		speedRefresh : Math.ceil(this.frainDuration/10),
		startRadius : 10,
		endRadius : 1,
		iteration : 1
	};
	
	if(config)$.extend(this.config,config);
	
};
extend(mse.EIBlur,mse.EffectImage);
$.extend(mse.EIBlur.prototype, {
	label : "blur",
	mul_table : [1,57,41,21,203,34,97,73,227,91,149,62,105,45,39,137,241,107,3,173,39,71,65,238,219,101,187,87,81,151,141,133,249,117,221,209,197,187,177,169,5,153,73,139,133,127,243,233,223,107,103,99,191,23,177,171,165,159,77,149,9,139,135,131,253,245,119,231,224,109,211,103,25,195,189,23,45,175,171,83,81,79,155,151,147,9,141,137,67,131,129,251,123,30,235,115,113,221,217,53,13,51,50,49,193,189,185,91,179,175,43,169,83,163,5,79,155,19,75,147,145,143,35,69,17,67,33,65,255,251,247,243,239,59,29,229,113,111,219,27,213,105,207,51,201,199,49,193,191,47,93,183,181,179,11,87,43,85,167,165,163,161,159,157,155,77,19,75,37,73,145,143,141,35,138,137,135,67,33,131,129,255,63,250,247,61,121,239,237,117,29,229,227,225,111,55,109,216,213,211,209,207,205,203,201,199,197,195,193,48,190,47,93,185,183,181,179,178,176,175,173,171,85,21,167,165,41,163,161,5,79,157,78,154,153,19,75,149,74,147,73,144,143,71,141,140,139,137,17,135,134,133,66,131,65,129,1],
	shg_table : [0,9,10,10,14,12,14,14,16,15,16,15,16,15,15,17,18,17,12,18,16,17,17,19,19,18,19,18,18,19,19,19,20,19,20,20,20,20,20,20,15,20,19,20,20,20,21,21,21,20,20,20,21,18,21,21,21,21,20,21,17,21,21,21,22,22,21,22,22,21,22,21,19,22,22,19,20,22,22,21,21,21,22,22,22,18,22,22,21,22,22,23,22,20,23,22,22,23,23,21,19,21,21,21,23,23,23,22,23,23,21,23,22,23,18,22,23,20,22,23,23,23,21,22,20,22,21,22,24,24,24,24,24,22,21,24,23,23,24,21,24,23,24,22,24,24,22,24,24,22,23,24,24,24,20,23,22,23,24,24,24,24,24,24,24,23,21,23,22,23,24,24,24,22,24,24,24,23,22,24,24,25,23,25,25,23,24,25,25,24,22,25,25,25,24,23,24,25,25,25,25,25,25,25,25,25,25,25,25,23,25,23,24,25,25,25,25,25,25,25,25,25,24,22,25,25,23,25,25,20,24,25,24,25,25,22,24,25,24,25,24,25,25,24,25,25,25,25,22,25,25,25,24,25,24,25,18],
	interaction : function(e){
		switch(e.keyCode){
			case __KEY_S:
				if(this.active){
					this.radius += 2; 
					this.flagInit = false;
					this.imgPixels = null;
				}
				if(this.radius > 20)this.radius = 1;
				break;
			case __KEY_D:
				this.active = !this.active;
				break;
			case __KEY_O:
				if(this.active){
					this.iteration++;
					this.flagInit = false;
					this.imgPixels = null;
				}
				if(this.iteration > 3)this.iteration = 1;
				break;
			case __KEY_N:
				this.frainSimon = true;
				this.timeStamp = this.count;
				break;
			default : break;
		}
	},	
	blurCanvasRGBA : function(imgPixels, radius, iterations){
		if (isNaN(radius) || radius < 1) return;
		radius |= 0;
		if (isNaN(iterations)) iterations = 1;
		iterations |= 0;
		if (iterations > 3) iterations = 3;
		if (iterations < 1) iterations = 1;

		var pixels = imgPixels.data, height = imgPixels.height, width = imgPixels.width;

		var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx,pa;
		var wm = width - 1, hm = height - 1;
		var wh = width * height;
		var rad1 = radius + 1;

		var mul_sum = this.mul_table[radius];
		var shg_sum = this.shg_table[radius];

		var r = [], g = [], b = [], a = [];
		var vmin = [], vmax = [];

		while (iterations-- > 0){
			yw = yi = 0;

			for ( y=0; y < height; y++ ){
				rsum = pixels[yw]   * rad1;
				gsum = pixels[yw+1] * rad1;
				bsum = pixels[yw+2] * rad1;
				asum = pixels[yw+3] * rad1;

				for(i = 1; i <= radius; i++){
					p = yw + (((i > wm ? wm : i )) << 2 );
					rsum += pixels[p++];
					gsum += pixels[p++];
					bsum += pixels[p++];
					asum += pixels[p];
				}

				for(x = 0; x < width; x++) {
					r[yi] = rsum;
					g[yi] = gsum;
					b[yi] = bsum;
					a[yi] = asum;

					if(y==0) {
						vmin[x] = ( ( p = x + rad1) < wm ? p : wm ) << 2;
						vmax[x] = ( ( p = x - radius) > 0 ? p << 2 : 0 );
					} 

					p1 = yw + vmin[x];
					p2 = yw + vmax[x];

					rsum += pixels[p1++] - pixels[p2++];
					gsum += pixels[p1++] - pixels[p2++];
					bsum += pixels[p1++] - pixels[p2++];
					asum += pixels[p1]   - pixels[p2];

					yi++;
				}
				yw += (width << 2);
			}

			for (x = 0; x < width; x++) {
				yp = x;
				rsum = r[yp] * rad1;
				gsum = g[yp] * rad1;
				bsum = b[yp] * rad1;
				asum = a[yp] * rad1;

				for(i = 1; i <= radius; i++) {
					yp += ( i > hm ? 0 : width );
					rsum += r[yp];
					gsum += g[yp];
					bsum += b[yp];
					asum += a[yp];
				}

				yi = x << 2;
				for (y = 0; y < height; y++) {
					pixels[yi+3] = pa = (asum * mul_sum) >>> shg_sum;
					if ( pa > 0 )
					{
						pa = 255 / pa;
						pixels[yi]   = ((rsum * mul_sum) >>> shg_sum) * pa;
						pixels[yi+1] = ((gsum * mul_sum) >>> shg_sum) * pa;
						pixels[yi+2] = ((bsum * mul_sum) >>> shg_sum) * pa;
					} 
					else {
						pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
					}				
					if( x == 0 ) {
						vmin[y] = ( ( p = y + rad1) < hm ? p : hm ) * width;
						vmax[y] = ( ( p = y - radius) > 0 ? p * width : 0 );
					} 

					p1 = x + vmin[y];
					p2 = x + vmax[y];

					rsum += r[p1] - r[p2];
					gsum += g[p1] - g[p2];
					bsum += b[p1] - b[p2];
					asum += a[p1] - a[p2];

					yi += width << 2;
				}
			}
		}
		//return imgPixels;
	},
	initBuff : function(){
				this.ctxBuff.clearRect(0,0,this.subject.width,this.subject.height);
				this.ctxBuff.drawImage(this.img,0,0,this.subject.width,this.subject.height);
				this.imgPixels = this.ctxBuff.getImageData(0,0,this.subject.width,this.subject.height);		
	},
	logic : function(delta){
		if(this.count <= this.config.duration){
			if(!this.flagInit && this.active && !this.frainSimon){
				this.initBuff();
				this.blurCanvasRGBA(this.imgPixels, this.radius, this.iteration);
				this.ctxBlur.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
				this.flagInit = true;
			}
			
			if(this.frainSimon){
				if(this.count - this.timeStamp <= this.frainDuration){
					this.active = true;
					if((this.count - this.timeStamp)%this.config.speedRefresh == 0){
						this.initBuff();
						this.blurCanvasRGBA(this.imgPixels, this.config.startRadius + ((this.count - this.timeStamp)/this.frainDuration)*(this.config.endRadius-this.config.startRadius), this.config.iteration);
						this.ctxBlur.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
					}
				}
				else{
					this.active = false;
					this.frainSimon = false;
				}
			}
			
			this.count++;
			if(this.multi)return true;
		}
		else{
			this.subject.getContainer().evtDeleg.removeListener('keydown', cb);
			if(this.multi)return false;
			this.subject.endEffect();
		}
	},
	draw : function (ctx,x,y){
		if(!this.active){
			ctx.drawImage(this.img,x,y,this.subject.width,this.subject.height);
		}
		else{
			ctx.drawImage(this.canvasBlur,x,y,this.subject.width,this.subject.height);
		}
	},
	toString : function(){
		return this.label;
	}
});
/*******************************************************************/
mse.EIColorSwitch = function(subject,config,multi) {
	mse.EffectImage.call(this,subject,config,multi);
	
	this.count = 0;
	this.flagInit = false;
	this.img = mse.src.getSrc(this.subject.img);
	this.imgPixels = null;
	this.active = 0;
	this.buff = 1;
	this.styleColor = 0;
	
	this.timeStamp = 0;
	this.numScenario = new Array();
	
	this.concert = false;
	this.concertDuration = 300;
	
	this.flicker = false;
	this.flickerDuration = 600;
	
	this.sunrise = false;
	this.sunriseDuration = 600;
	
	this.canvasColorSwitch = document.createElement('canvas');
	this.canvasColorSwitch.width = this.subject.width;
	this.canvasColorSwitch.height = this.subject.height;
	this.ctxCS = this.canvasColorSwitch.getContext('2d');
	
	this.canvasBuffer = document.createElement('canvas');
	this.canvasBuffer.width = this.subject.width;
	this.canvasBuffer.height = this.subject.height;
	this.ctxBuff = this.canvasBuffer.getContext('2d');

	var cb = new mse.Callback(this.interaction, this);
	this.subject.getContainer().evtDeleg.addListener('keydown', cb);

	this.config = {
		duration : Number.POSITIVE_INFINITY,
		paramHSL : [36,1.6,0.95],
		concertSpeedRefresh : Math.ceil(this.concertDuration/10),
		flickerSpeedRefresh : Math.ceil(this.flickerDuration/30),
		sunriseSpeedRefresh : Math.ceil(this.sunriseDuration/150)
	};
	
	if(config)$.extend(this.config,config);
	
};
extend(mse.EIColorSwitch,mse.EffectImage);
$.extend(mse.EIColorSwitch.prototype, {
	label : "colorswitch",
	interaction : function(e){
		switch(e.keyCode){
			case __KEY_S:
				if(this.active){
					this.active++; 
					this.flagInit = false;
					this.imgPixels = null;
				}
				if(this.active > 2)this.active = 1;
				break;
			case __KEY_D:
				var buff = this.active;
				this.active = this.buff;
				this.buff = buff;
				this.flagInit = false;
				this.imgPixels = null;
				break;
			case __KEY_O:
				if(2 == this.active){
					this.styleColor += 0.5;
					this.flagInit = false;
					this.imgPixels = null;
				}
				if(this.styleColor > 9)this.styleColor = 0;
				break;
			case __KEY_N:
				this.concert = true;
				this.timeStamp = this.count;
				for (var i = 0; i < 10; i++){
					this.numScenario.push(Math.round(18*Math.random()+1)/2);
				}
				break;
			case __KEY_B:
				this.flicker = true;
				this.timeStamp = this.count;
				for (var i = 0; i < 30; i++){
					this.numScenario.push(0.15+0.85*Math.random());
				}
				break;
			case __KEY_C:
				this.sunrise = true;
				this.timeStamp = this.count;
				for (var i = 0; i < 150; i++){
					this.numScenario.push((200-i)/150);
				}
				break;
			default : break;
		}
	},
	initBuff : function(){
			this.ctxBuff.clearRect(0,0,this.subject.width,this.subject.height);
			this.ctxBuff.drawImage(this.img,0,0,this.subject.width,this.subject.height);
			this.imgPixels = this.ctxBuff.getImageData(0,0,this.subject.width,this.subject.height);		
	},
	logic : function(delta){
		if(this.count <= this.config.duration){
			if(!this.flagInit && this.active && !this.concert && !this.flicker && !this.sunrise){
				this.initBuff();
				for(var y = 0; y < this.imgPixels.height; y++){
					for(var x = 0; x < this.imgPixels.width; x++){
						var i = (y*4) * this.imgPixels.width + x*4; 
						switch(this.active){
							case 1 : 
								var avg = (this.imgPixels.data[i]+this.imgPixels.data[i+1]+this.imgPixels.data[i+2])/3;
								this.imgPixels.data[i] = this.imgPixels.data[i+1] = this.imgPixels.data[i+2] = avg;
								break;
							case 2 :
								var hsl = mse.rgb_hsl(this.imgPixels.data[i],this.imgPixels.data[i+1],this.imgPixels.data[i+2]);
								hsl[0] = this.config.paramHSL[0]*this.styleColor; if(hsl[0]>360)hsl[0]=360;
								hsl[1] = hsl[1]*this.config.paramHSL[1]; if(hsl[1]>255)hsl[1]=255;
								hsl[2] = hsl[2]*this.config.paramHSL[2]; if(hsl[2]>255)hsl[2]=255;
								var rgb = mse.hsl_rgb(hsl[0],hsl[1],hsl[2]);
								this.imgPixels.data[i] = rgb[0]; this.imgPixels.data[i+1] = rgb[1];this.imgPixels.data[i+2] = rgb[2];
								break;
							default : break;
						}
					}
				}
				this.ctxCS.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
				this.flagInit = true;
			}
			
			if(this.concert && !this.flicker){
				if(this.count - this.timeStamp < this.concertDuration){
					this.active = true;
					if((this.count - this.timeStamp)%this.config.concertSpeedRefresh == 0){
						this.initBuff();
						var scenario = this.numScenario.pop();
						for(var y = 0; y < this.imgPixels.height; y++){
							for(var x = 0; x < this.imgPixels.width; x++){
								var i = (y*4) * this.imgPixels.width + x*4; 
								var hsl = mse.rgb_hsl(this.imgPixels.data[i],this.imgPixels.data[i+1],this.imgPixels.data[i+2]);
								hsl[0] = this.config.paramHSL[0]*scenario; if(hsl[0]>360)hsl[0]=360;
								hsl[1] = hsl[1]*this.config.paramHSL[1]; if(hsl[1]>255)hsl[1]=255;
								hsl[2] = hsl[2]*this.config.paramHSL[2]; if(hsl[2]>255)hsl[2]=255;
								var rgb = mse.hsl_rgb(hsl[0],hsl[1],hsl[2]);	
								this.imgPixels.data[i] = rgb[0]; this.imgPixels.data[i+1] = rgb[1];this.imgPixels.data[i+2] = rgb[2];							
							}
						}
						this.ctxCS.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
					}
				}
				else{
					this.active = false;
					this.concert = false;					
				}
			}
			
			if(this.flicker && !this.concert){
				if(this.count - this.timeStamp < this.flickerDuration){
					this.active = true;
					if((this.count - this.timeStamp)%this.config.flickerSpeedRefresh == 0){
						this.initBuff();
						var scenario = this.numScenario.pop();
						for(var y = 0; y < this.imgPixels.height; y++){
							for(var x = 0; x < this.imgPixels.width; x++){
								var i = (y*4) * this.imgPixels.width + x*4; 
								var hsl = mse.rgb_hsl(this.imgPixels.data[i],this.imgPixels.data[i+1],this.imgPixels.data[i+2]);
								hsl[0] = hsl[0]; if(hsl[0]>360)hsl[0]=360;
								hsl[1] = hsl[1]; if(hsl[1]>255)hsl[1]=255;
								hsl[2] = hsl[2]*scenario; if(hsl[2]>255)hsl[2]=255;
								var rgb = mse.hsl_rgb(hsl[0],hsl[1],hsl[2]);
								this.imgPixels.data[i] = rgb[0]; this.imgPixels.data[i+1] = rgb[1];this.imgPixels.data[i+2] = rgb[2];							
							}
						}
						this.ctxCS.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
					}
				}
				else{
					this.active = false;
					this.flicker = false;					
				}
			}
			
			if(this.sunrise){
				if(this.count - this.timeStamp < this.sunriseDuration){
					this.active = true;
					if((this.count - this.timeStamp)%this.config.sunriseSpeedRefresh == 0){
						this.initBuff();
						var scenario2 = this.numScenario.pop();
						var scenario1 = scenario2 > 1 ? 1 : scenario2;
						for(var y = 0; y < this.imgPixels.height; y++){
							for(var x = 0; x < this.imgPixels.width; x++){
								var i = (y*4) * this.imgPixels.width + x*4; 
								var hsl = mse.rgb_hsl(this.imgPixels.data[i],this.imgPixels.data[i+1],this.imgPixels.data[i+2]);
								if(hsl[2] < 70) continue;
								//hsl[0] = this.config.paramHSL[0]; if(hsl[0]>360)hsl[0]=360;
								if(scenario1 < 0.5)hsl[0] = 36;
								hsl[1] = hsl[1]*scenario1; if(hsl[1]>255)hsl[1]=255;
								hsl[2] = hsl[2]*scenario2; if(hsl[2]>255)hsl[2]=255;//*(0.5+(1.5-scenario)/3); 
								var rgb = mse.hsl_rgb(hsl[0],hsl[1],hsl[2]);
								this.imgPixels.data[i] = rgb[0]; this.imgPixels.data[i+1] = rgb[1];this.imgPixels.data[i+2] = rgb[2];							
							}
						}
						this.ctxCS.putImageData(this.imgPixels,0,0,0,0,this.imgPixels.width,this.imgPixels.height);
						
						var cpt = (this.count - this.timeStamp)/this.config.sunriseSpeedRefresh;
						cpt = cpt / 3;
						var rg = this.ctxCS.createRadialGradient(350-cpt,260-cpt*2,(8+cpt/2)/2,350-cpt,260-cpt*2,8+cpt/2);
						rg.addColorStop(0,"rgba(" + Math.floor(255-cpt*2.5) + "," + Math.floor(153+cpt*2.5) + "," + Math.floor(153+cpt*2.5) + "," + 0.9 + ")");
						rg.addColorStop(1,"rgba(255,255,0," + 0 + ")");
						this.ctxCS.fillStyle = rg;
						
						this.ctxCS.beginPath();
						this.ctxCS.arc(350-cpt,260-cpt*2,8+cpt/2,0,Math.PI*2,true);
						this.ctxCS.closePath();
						this.ctxCS.fill();
						
					}
				}
				else{
					this.active = false;
					this.sunrise = false;					
				}				
			}
			
			this.count++;
			if(this.multi)return true;
		}
		else{
			this.subject.getContainer().evtDeleg.removeListener('keydown', cb);
			if(this.multi)return false;
			this.subject.endEffect();
		}
	},
	draw : function (ctx,x,y){
		if(!this.active){
			ctx.drawImage(this.img,x,y,this.subject.width,this.subject.height);
		}
		else{
			ctx.drawImage(this.canvasColorSwitch,x,y,this.subject.width,this.subject.height);
		}
	},
	toString : function(){
		return this.label;
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
		"candle" : ["pixel","weather"]
	},
	classification : {
		"fadein" : "param",
		"snow" : "weather",
		"rain" : "weather",
		"fog" : "weather",
		"fogbeta" : "weather",
		"fogbeta2" : "weather",
		"vibration" : "weather",
		"colorswitch" : "pixel",
		"blur" : "pixel",
		"candle" : "candle",
		"bougie" : "candle"
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
				case "fadein" : return (new mse.EIFadein(subject,effectConf[nEffect],false));
				case "snow" : return (new mse.EISnow(subject,effectConf[nEffect],false));
				case "rain" : return (new mse.EIRain(subject,effectConf[nEffect],false));
				case "fog" : return (new mse.EIFog(subject,effectConf[nEffect],false));
				case "colorswitch" : return (new mse.EIColorSwitch(subject,effectConf[nEffect],false));
				case "blur" : return (new mse.EIBlur(subject,effectConf[nEffect],false));
				case "candle" : return (new mse.EICandle(subject,effectConf[nEffect],false));
				case "bougie" : return (new mse.EIBougie(subject,effectConf[nEffect],false));
				case "fogbeta" : return (new mse.EIFogBeta(subject,effectConf[nEffect],false));
				case "fogbeta2" : return (new mse.EIFogBeta2(subject,effectConf[nEffect],false));
				case "vibration" : return (new mse.EIVibration(subject,effectConf[nEffect],false));
				default : return null;				
			}
		}
		return null;
	}
	else{
		var dictObjEffects = {};
		for(var nEffect in effectConf){
			switch(nEffect){
				case "fadein" : dictObjEffects[nEffect] = new mse.EIFadein(subject,effectConf[nEffect],true);break;
				case "snow": dictObjEffects[nEffect] = new mse.EISnow(subject,effectConf[nEffect],true);break;
				case "rain": dictObjEffects[nEffect] = new mse.EIRain(subject,effectConf[nEffect],true);break;
				case "fog": dictObjEffects[nEffect] = new mse.EIFog(subject,effectConf[nEffect],true);break;
				case "colorswitch": dictObjEffects[nEffect] = new mse.EIColorSwitch(subject,effectConf[nEffect],true);break;
				case "blur": dictObjEffects[nEffect] = new mse.EIBlur(subject,effectConf[nEffect],true);break;
				case "candle": dictObjEffects[nEffect] = new mse.EICandle(subject,effectConf[nEffect],true);break;
				case "bougie": dictObjEffects[nEffect] = new mse.EIBougie(subject,effectConf[nEffect],true);break;
				case "fogbeta": dictObjEffects[nEffect] = new mse.EIFogBeta(subject,effectConf[nEffect],true);break;
				case "fogbeta2": dictObjEffects[nEffect] = new mse.EIFogBeta2(subject,effectConf[nEffect],true);break;
				case "vibration": dictObjEffects[nEffect] = new mse.EIVibration(subject,effectConf[nEffect],true);break;
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
})(mse);
