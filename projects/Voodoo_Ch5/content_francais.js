
//Game Esquive

// class for enemies  
var Enemi = function(parent, trajCoor, number) {
    this.sprite = (function(){
        if (number%2 == 1)
            return new mse.Sprite(parent,{ pos:[0,0], size:[50*0.25, 118*0.25] },'enemi', 50, 118, 0, 0, 600, 118);
        else 
            return new mse.Sprite(parent,{ pos:[0,0], size:[50*0.25, 99*0.25] }, 'enemi', 50, 99, 0, 118, 600, 99);
    })();
    
    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2,3,4,5,6,7,8,9,10,11],0,0); // Set the animation
    this.height = this.sprite.height;
    this.width = this.sprite.width;    
    
    this.colMask = {};
    this.colWidth = this.sprite.width * 0.95;
    
    
    this.trajCoor = trajCoor;
    this.startY = trajCoor.sy;
    this.endY = trajCoor.ey;
    
    this.originalWidth = this.sprite.width;
    this.originalHeight = this.sprite.height;
    
    this.parent = parent;
    
    this.state = 'INACTIVE';
};
Enemi.prototype = {
    init: function(way){
        this.time = 0;
        this.anime.start();
        this.state = 'RUNNING';
        
        this.sprite.width = this.originalWidth;
        this.sprite.height = this.originalHeight;
        this.sprite.globalAlpha = 1;
        
        this.startX = this.trajCoor.sx[way]
        this.endX = this.trajCoor.ex[way];
        
        var min = 4, max = 8;
        this.speed = Math.floor(Math.random() * (max - min + 1) + max);
        
        this.position = 'background';
    },
    logic: function(){
        if (this.y > (this.parent.height) && this.state != 'FINISH')
            this.state = 'FINISH';
                 
        if (this.y > this.endY && this.position == 'background')
            this.position = 'foreground';
            
        if(this.sprite.globalAlpha < 0.05) {
            this.anime.stop();
            this.state = 'INACTIVE';
        }
    },
    draw: function(ctx, position){
        if(this.state != 'INACTIVE' && position == this.position) {
            this.sprite.height += (this.speed/4);
            this.sprite.width += (this.speed/4);
            var x1 = this.startX;
            var y1 = this.startY;
            
            var x2 = this.endX;
            var y2 = this.endY;
            var prog = this.time / (y2 - y1);
            
            this.x = x1+(x2-x1)*prog;
            var x = this.x - this.anime.sprite.width/2;
            
            this.y = y1+(y2-y1)*prog;
            var y = this.y - this.anime.sprite.height;
            this.time += this.speed;
            this.sprite.draw(ctx, x, y); // draw the enemie at the good position
            
            // Colision mask update
            this.colMask.x = x+this.sprite.width*0.25;
            this.colMask.y = y;
            this.colMask.w = this.sprite.width*0.7;
            this.colMask.h = this.sprite.height;
            
            /* Colision mask Draw            
            ctx.fillStyle = "rgba(255,0,0, 0.5)"; 
            ctx.fillRect(this.colMask.x, this.colMask.y, this.colMask.w, this.sprite.height);
            ctx.fillStyle = 'rgba(0,0,0, 1)';
            // */
            
            if (this.state == 'FINISH') this.sprite.globalAlpha -= 0.2;   
        }            
    }
};

// Class for Simon
var Simon = function(parent, endY, gameWidth){
    this.line = endY;
    this.gameWidth = gameWidth;
    this.dir = 'WAIT';
    this.state = 'ALIVE';
    this.life = 3;
    this.redTime = 25;
    this.pas = 15;
    this.heartSize = 15;
    
    // Colision mask
    this.colMask = {};
    
    this.sprite = new mse.Sprite(parent,{ pos:[0,0], size:[58, 84] }, 'simon', 58, 84, 0, 0  , 174, 84);
    this.effect = mse.initImageEffect({ "colorfilter": {rMulti: 0.7, alpha: 0.6, duration: this.redTime} }, this.sprite);
    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2],0,2); 
}
Simon.prototype = {
    init: function(){
        this.anime.start();                
        this.x = this.gameWidth/2-this.sprite.width/2;
        this.y = this.line - this.sprite.height;
        this.life = 3;
    },
    logic: function(){
        // Move
        if(this.dir == 'LEFT' && this.x > 0) this.x-= this.pas;
        else if (this.dir == 'RIGHT' && (this.x+this.sprite.width) < this.gameWidth) this.x+= this.pas;
        
        // Update collision mask
        this.colMask.x = this.x+ this.sprite.width*0.25;
        this.colMask.w = this.sprite.width*0.75;
        
        this.sprite.logic();
        
        // Life management
        if(this.touched) this.touchedTime++;
        if(this.touchedTime > this.redTime) this.touched = false;
    },
    draw: function(ctx){
        this.sprite.draw(ctx,this.x,this.y);
        
        var coeur = mse.src.getSrc('coeur');
        for(var i = 0; i < this.life; i++) 
            ctx.drawImage(coeur, 5+(this.heartSize+1)*i, 5, this.heartSize, this.heartSize);
        /* Colision mask Draw            
        ctx.fillStyle = "rgba(0,255,0, 0.5)"; 
        ctx.fillRect(this.colMask.x, this.colMask.y, this.colMask.w, this.colMask.h);
        ctx.fillStyle = 'rgba(0,0,0, 1)';
        // */
    },
    changeDir: function(dir){
        if(dir != this.dir){
            this.anime.stop();
            this.dir = dir;
            switch (dir) {
                case 'WAIT':
                    this.sprite.configSprite(58, 84, 0, 0, 174, 84, 58, 84);
                    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2],0,2);
                break;
                case 'LEFT':
                    this.sprite.configSprite(75, 85, 0, 169, 450, 85, 75, 85);
                    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2,3,4,5],0,2);
                break;
                case 'RIGHT':
                    this.sprite.configSprite(75, 85, 0, 84 , 450, 85, 75, 85);
                    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2,3,4,5],0,2);
                break;
            }
            this.anime.start();
        }
    },
    touch: function(){
        if(!this.touched) {            
            this.sprite.startEffect(this.effect);
            this.life--;            
            this.touched = true;
            this.touchedTime = 0;
        }
    }
}

var Esquive = function(){
    mse.Game.call(this, {fillback:true});
    this.config.title = "Le Concert";
    
    this.width = 600; 
    this.height = 440;
    
    // some variable to manage the way's line
    var dStart = 30;
    var dEnd = this.width / 6;
    var middle = this.width / 2;
    
    // starts points for ways (x)
    this.startPoints = [];
    for(var i = 3; i>0; i--)        // 3 firsts
        this.startPoints.push(middle - i*dStart);
    this.startPoints.push(middle);  // middle
    for(var i = 1; i<=3; i++)       // 3 lasts
        this.startPoints.push(middle + i*dStart);
        
    // end points for the ways (x)
    this.endPoints = [];
    for(var i = 0; i < 7; i++)
        this.endPoints.push(i*dEnd);
        
    this.startLine = 170;   // (y)
    this.endLine = 410;     // (y)
    this.colTolerance = 20;
    
    // Sources
    mse.src.addSource('enemi', 'games/Ennemi-course.png', 'img', true);    
    mse.src.addSource('simon', 'games/Simon.png', 'img', true);
    mse.src.addSource('premierPlan', 'games/1er-plan.png', 'img', true);
    mse.src.addSource('arrierePlan', 'games/arriere-plan.png', 'img', true);
    mse.src.addSource('coeur', 'games/heart.png', 'img', true);

    // Objects
    var trajectoriesCoor = {
        sx: this.startPoints,
        sy: this.startLine,
        ex: this.endPoints,
        ey: this.endLine
    };
    this.sprinters = [];
    for(var i = 0; i<7; i++)
        this.sprinters.push(new Enemi(this, trajectoriesCoor, i));
    
    this.simon = new Simon(this, this.endLine, this.width);
    
    this.spots = new Spot();
    
    // Help message
    if(MseConfig.iOS) var help = "L’intervention de l’inspecteur Angeli fait fuir le public du concert. \nAide Simon à ne pas se faire piétiner par les fuyards !\nTouche l'écran pour contrôler Simon.";
    else var help = "L’intervention de l’inspecteur Angeli fait fuir le public du concert. \nAide Simon à ne pas se faire piétiner par les fuyards !\nUtilises les flèches pour contrôler Simon.";
    this.info = new mse.Text(null, {
		pos:[10,50],
		size:[this.width-20,0],
		fillStyle:"rgba(255,255,255,1)",
		font:"20px Arial",
		textAlign:"center",
		textBaseline:"top",
		lineHeight:25}, help, true
	);
	if(MseConfig.iOS) var help2 = "Touche pour commencer !";
    else var help2 = "Clique pour commencer !";
    this.info2 = new mse.Text(null, {
		pos:[10,this.height-50],
		size:[this.width-20,0],
		fillStyle:"rgba(255,255,255,1)",
		font:"15px Arial",
		textAlign:"center",
		textBaseline:"top",
		lineHeight:25}, help2, true
	);
        
        
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    this.state = "INIT";
	 
	this.init = function() {
        this.state = "INIT";
        this.currTime = 0;
        this.level = 0;
        this.simon.init();
        for(var i in this.sprinters) this.sprinters[i].state = 'INACTIVE';
        
        this.getEvtProxy().addListener('click', this.clickcb, true, this); // Mouse        
        this.getEvtProxy().addListener('keydown', this.keyDowncb); // Keyboard        
        this.getEvtProxy().addListener('keyup', this.keyUpcb); // Keyboard
        
        this.getEvtProxy().addListener('gestureStart', this.startGestCb);
        this.getEvtProxy().addListener('gestureUpdate', this.updateGestCb);
        this.getEvtProxy().addListener('gestureEnd', this.endGestCb);
        
        this.state = 'HELP';
    }
	 
    this.logic = function(delta) {
        if(this.state == "PLAYING" || this.state == "STARTING") this.currTime += delta/1000;
        
        if(this.state == "PLAYING"){
			// Manage level
			if(this.currTime > 1 && this.currTime < 2 && this.level != 1) this.level = 1;
			else if(this.currTime > 2 && this.currTime < 6 && this.level != 2) this.level = 2;
			else if(this.currTime > 6 && this.currTime < 14 && this.level != 3) this.level = 3;
			else if(this.currTime > 15 && this.currTime < 40 && this.level != 4) this.level = 4;
			
			this.simon.logic();
			
			var runningEnemies = 7;
			for(var i in this.sprinters) {
				this.sprinters[i].logic();
				// Collision
				var yDiff = this.endLine - this.sprinters[i].colMask.y - this.sprinters[i].colMask.h;
				if(yDiff < this.colTolerance  && yDiff > 0 && this.sprinters[i].state == 'RUNNING'){
					// When Simon & enemie are on the same line
					if( (this.sprinters[i].colMask.x >= this.simon.colMask.x 
							&& this.sprinters[i].colMask.x <= this.simon.colMask.x+this.simon.colMask.w) ||
						(this.simon.colMask.x >= this.sprinters[i].colMask.x 
							&& this.simon.colMask.x <= this.sprinters[i].colMask.x+this.sprinters[i].colMask.w) )
					{
						this.simon.touch();
					}
				}
				if (this.sprinters[i].state == 'INACTIVE') 
					runningEnemies--;
			}
			
			// Generate enemies
			this.generateEnemies(runningEnemies);
			
			this.checkFinish();    
		}    
    }
    
    this.draw = function(ctx) {
		ctx.save();	
		
		if(MseConfig.android || MseConfig.iPhone) ctx.scale(0.8, 0.62);
		            
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.width, 0);
		ctx.lineTo(this.width, this.height);
		ctx.lineTo(0,this.height);
		ctx.closePath();
		ctx.clip();
		
		if(this.state != 'WIN'){
			ctx.drawImage(mse.src.getSrc('arrierePlan'), 0, 0, this.width,this.height);            
			this.spots.draw(ctx);
			ctx.drawImage(mse.src.getSrc('premierPlan'), 0, 0, this.width,this.height);
		}
        
       if(this.state == 'HELP') {
            ctx.fillStyle = 'rgba(0,0,0, 0.8)';
            ctx.fillRect(0,0,this.width, this.height);            
            
            ctx.fillStyle = 'rgba(255,255,255, 1)';
            this.info.draw(ctx);
            this.info2.draw(ctx);
        }
        else if(this.state == 'STARTING') {
			// Draw 3-2-1-GO!
			ctx.fillStyle = 'rgba(0,0,0, 0.4)';
			ctx.fillRect(0,0,this.width, this.height);
			
			ctx.fillStyle = 'rgba(255,255,255, 1)';
			ctx.font = "30px Arial";
			if (this.currTime < 1)var text = "3";
			else if(this.currTime < 2) var text = "2";
			else if(this.currTime < 3) var text = "1";
			else {
				this.currTime = 0;
				this.state = "PLAYING";
				this.generateEnemies();
				this.simon.init();
				var text = "GO !";
			}
			ctx.fillText(text,this.width/2-20,this.height/2-30);
        }
        else if(this.state == 'PLAYING'){
                         
            /* DEBUG
            // trace the 7 ways            
            ctx.fillStyle = "rgb(255,255,255)"; 
            ctx.fillRect(0,0, this.width, this.height);
            ctx.fillStyle = "rgb(0,0,0)"; 
            
            for (var i in this.startPoints) {
                for(var j = 0; j<this.endLine - this.startLine; j++) {
                    var y1 = this.startLine;
                    var x1 = this.startPoints[i];
                    var y2 = this.endLine;
                    var x2 = this.endPoints[i];
                    var prog = j / (this.endLine - this.startLine);
                    
                    var x = x1+(x2-x1)*prog;
                    var y = y1+(y2-y1)*prog;
                    ctx.fillRect(x, y, 1, 1);
                }
            }
            // */
            
            for(var i in this.sprinters) this.sprinters[i].draw(ctx, 'background'); // draw only background sprinters
            this.simon.draw(ctx);
            for(var i in this.sprinters) this.sprinters[i].draw(ctx, 'foreground');
            
            // draw time
            var timestr = Math.floor(this.currTime/600) +""+ Math.floor((this.currTime%600)/60) +":"+ Math.floor((this.currTime%60)/10) +""+ Math.floor(this.currTime%10);
            ctx.font = "15px Arial";
            ctx.fillText(timestr, this.width-50, 10);
        }
        
        ctx.restore();
    }
    
    this.generateEnemies = function(runningEnemies){
        switch(this.level){
            /*case 0: if (!runningEnemies) this.sprinters[Math.floor(Math.random() * 7)].init(Math.floor(Math.random() * 7)); 
            // if in the level 0 generate one enemi (function call only 1 time in this level)
                break;*/
            case 1: var maxRun = 3; var maxGenerate = 4;
                break;
            case 2: var maxRun = 4; var maxGenerate = 4;
                break;
            case 3: var maxRun = 4; var maxGenerate = 5;
                break;
            case 4: var maxRun = 5; var maxGenerate = 6;
                break;
        }
        
        if(typeof(maxGenerate) != 'undefined' && runningEnemies < maxRun){
            var nbEnemies = 1 + Math.floor(Math.random() * maxGenerate);
            var position = [];
            for(var i = 0; i<nbEnemies; i++){
                var number = Math.floor(Math.random() * 7); // random way for each new enemi
                position.push(number);
            }
            
            for (var i = 0; i < nbEnemies; i++)
                if (this.sprinters[position[i]].state == 'INACTIVE') this.sprinters[position[i]].init(position[i]);
        }
    };

    this.checkFinish = function(){
        if(this.simon.life == 0) {
            this.state = 'LOSE';
            this.getEvtProxy().removeListener('click', this.clickcb); // Mouse        
            this.getEvtProxy().removeListener('keydown', this.keyDowncb); // Keyboard        
            this.getEvtProxy().removeListener('keyup', this.keyUpcb);
            this.setScore( 100 * this.currTime / 40 );
            this.lose();
        }
        else if (this.currTime > 40) {
            this.state = 'WIN';
            this.getEvtProxy().removeListener('click', this.clickcb); // Mouse        
            this.getEvtProxy().removeListener('keydown', this.keyDowncb); // Keyboard        
            this.getEvtProxy().removeListener('keyup', this.keyUpcb);
            this.setScore( 100 + this.simon.life * this.simon.life * 5 );
            this.win();
        }
    };
     
    this.click = function (e) {
        if(this.state == 'HELP') {
            this.state = 'STARTING';  
        };
	};
	
    this.clickcb = new mse.Callback(this.click, this);       
    
    this.keyDown = function(e) {
        if(e.keyCode == __KEY_LEFT && this.simon.dir != 'LEFT')
            this.simon.changeDir('LEFT');
        else if(e.keyCode == __KEY_RIGHT  && this.simon.dir != 'RIGHT') 
            this.simon.changeDir('RIGHT');
    };
    this.keyDowncb = new mse.Callback(this.keyDown, this);    
  
    this.keyUpcb = new mse.Callback(function(){this.simon.changeDir('WAIT');}, this);
    
    this.gestureMove = function(e){
        if(MseConfig.android || MseConfig.iPhone) var x = e.offsetX/0.8;
        else var x = e.offsetX;
        if(x<this.simon.x+this.simon.sprite.width/2 && this.simon.dir != 'LEFT')
            this.simon.changeDir('LEFT');
        else if (x>this.simon.x+this.simon.sprite.width/2 && this.simon.dir != 'RIGHT')
            this.simon.changeDir('RIGHT');
    };
    
    this.startGestCb = new mse.Callback(this.gestureMove, this);    
    this.updateGestCb = new mse.Callback(this.gestureMove, this);
    this.endGestCb = new mse.Callback(function(){this.simon.changeDir('WAIT');}, this);
};
extend(Esquive, mse.Game);

// Class for spots
var Spot = function(parent, type){
    mse.src.addSource('spot-left', 'games/spot-left.png', 'img', true);
    
    var x = -30;    
    var y = x;
    
    var left = new mse.Image(null, {pos:[x,y],size:[374,306]},'spot-left');
    var right = new mse.Image(null, {pos:[x,y]},'spot-left');
    
    this.effectL = mse.initImageEffect({ "colorfilter": {rMulti: 0.7, alpha: 0.6} }, left);
    this.effectR = mse.initImageEffect({ "colorfilter": {rMulti: 0.7, alpha: 0.6} }, right);
    
    this.width = 600;
    //~ this.height = mse.coor(mse.joinCoor(440));
    
    this.angleR = 100;
    this.angleL = 0;
    
    var upL = true;
    var upR = true;
    
    this.logic = function(){
        // Left
        if(upL) this.angleL++;
        else this.angleL--;        
        if(this.angleL>10) {
            upL = false;
            this.randomColorEffect('left');
        }
        else if(this.angleL<-40) {
            upL = true;
            this.randomColorEffect('left');
        }
        left.logic();
        
        // Right
        if(upR) this.angleR++;
        else this.angleR--;       
        if(this.angleR>110) {
            upR = false;
            this.randomColorEffect('right');
        }
        else if(this.angleR<80) {        
            upR = true;
            this.randomColorEffect('right');
        }
        right.logic();
    };
    
    this.draw = function(ctx){
        // left
        ctx.save();
        ctx.rotate(this.angleL*Math.PI/180);
        left.draw(ctx);   
        ctx.restore();
        
        // right
        ctx.save();
        ctx.translate(this.width, 0);
        ctx.rotate(this.angleR*Math.PI/180); 
        right.draw(ctx);
        ctx.restore();
        
        this.logic();
    };
    
    var color = [
        {rMulti: 0.8 ,gMulti: 1   ,bMulti: 1  },    // light red
        {rMulti: 1   ,gMulti: 0.7 ,bMulti: 1  },    // light green      
        {rMulti: 0   ,gMulti: 0   ,bMulti: 1  },    // full green
        {rMulti: 1   ,gMulti: 0 ,bMulti: 0  },      // full blue
        {rMulti: 0.5   ,gMulti: 0.5 ,bMulti: 1  },
        {rMulti: 0.33   ,gMulti: 0.98 ,bMulti: 0.69  },
        {rMulti: 0.1   ,gMulti: 0.7 ,bMulti: 1  },  // orange        
        {rMulti: 0.3   ,gMulti: 0.65 ,bMulti: 1  }  // jaune
        
    ];
    this.randomColorEffect = function(name){
        if(name == 'left') {
            var spot = left;
            var effect = this.effectL;
        }
        else {
            var spot = right;
            var effect = this.effectR;
        }
        var conf = color[Math.floor(Math.random()*color.length)];   
        // var conf = {rMulti: Math.random()   ,gMulti: Math.random() ,bMulti: Math.random()  };
        effect.init(conf, spot);
        spot.startEffect(effect);
    };
}
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":448.75,"cid7":108.75,"cid8":173.75,"cid9":107.5,"cid10":32.5,"cid11":396.25,"cid12":56.25,"cid13":201.25,"cid14":246.25,"cid15":357.5,"cid16":181.25,"cid17":222.5,"cid18":398.75,"cid19":17.5,"cid20":340,"cid21":590,"cid22":230,"cid23":10,"cid24":22.5,"cid25":36.25,"cid26":425,"cid27":306,"cid28":404.11428571429,"cid29":17,"cid30":295,"cid31":223.75,"cid32":496.25,"cid33":18,"cid34":223,"cid35":399,"cid36":358,"cid37":181,"cid38":33,"cid39":174,"cid40":108,"cid41":449,"cid42":109,"cid43":201,"cid44":246,"cid45":396,"cid46":56,"cid47":305,"cid48":140,"cid49":126,"cid50":239,"cid51":160,"cid52":314,"cid53":300,"cid54":69,"cid55":175,"cid56":29,"cid57":60,"cid58":708,"cid59":23,"cid60":683,"cid61":63,"cid62":70,"cid63":50,"cid64":700,"cid65":323,"cid66":128,"cid67":153,"cid68":234,"cid69":365}');
initMseConfig();
mse.init();
window.pages={};
var layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch5/';
	window.root = new mse.Root('Voodoo_Ch5',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src2','images/src2.jpeg','img',true);
	mse.src.addSource('src3','images/src3.png','img',true);
	mse.src.addSource('src4','images/src4.png','img',true);
	mse.src.addSource('src5','images/src5.png','img',true);
	mse.src.addSource('src6','images/src6.png','img',true);
	mse.src.addSource('soncoup','audios/soncoup','aud',false);
	mse.src.addSource('src10','images/src10.jpeg','img',true);
	mse.src.addSource('src11','images/src11.jpeg','img',true);
	mse.src.addSource('sonphoque','audios/sonphoque','aud',false);
	games.Esquive = new Esquive();
	mse.src.addSource('src13','images/src13.jpeg','img',true);
	mse.src.addSource('src14','images/src14.jpeg','img',true);
	mse.src.addSource('src16','images/src16.jpeg','img',true);
	mse.src.addSource('src17','images/src17.png','img',true);
	mse.src.addSource('src18','images/src18.png','img',true);
	wikis.Apocalypse=new mse.WikiLayer();
	wikis.Apocalypse.addTextCard();
	wikis.Apocalypse.textCard.addSection('Apocalypse', 'Nom féminin : Texte ancien, judaïque ou chrétien, contenant des révélations sur la destinée du monde.\nPar extension : catastrophe qui entraîne la fin du monde.');
	wikis.Phoque=new mse.WikiLayer();
	wikis.Phoque.addImage('src13', 'Otarie.  Photo de loloieg');
	wikis.Phoque.addImage('src14', 'Phoques. Photo de Pascal');
	wikis.Phoque.addTextCard();
	wikis.Phoque.textCard.addSection('Espèce menacée', 'Les phoques sont menacés par les épidémies, la pollution des mers, les filets de pêche (dans lesquels ils meurent asphyxiés). Ils souffrent de la fonte de la banquise due au réchauffement climatique et de la chasse au phoque.');
	wikis.Phoque.textCard.addLink('Wikipédia', 'http:\/\/fr.wikipedia.org\/wiki\/Phoque ');
	wikis.Phoque.addTextCard();
	wikis.Phoque.textCard.addSection('Phoque', 'Nom masculin :\nMammifère amphibie, à pelage ras, aux oreilles dépourvues de pavillons, aux membres courts, terminés par des doigts palmés en forme de nageoires. Chassé pour sa fourrure, sa chair et sa graisse. A ne pas confondre avec l’otarie qui est, elle, pourvue de petits pavillons auriculaires.');
	wikis.Esoterique=new mse.WikiLayer();
	wikis.Esoterique.addTextCard();
	wikis.Esoterique.textCard.addSection('Esotérique', 'Adjectif : Que seuls les initiés peuvent comprendre.\nSynonymes : \nHermétique, abstrus, abscons.');
	mse.src.addSource('src19','images/src19.jpeg','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('concert','audios/concert','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Couverturedefault=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj315=new mse.Image(layers.Couverturedefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src16'); layers.Couverturedefault.addObject(objs.obj315);
	pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);
	pages.Title=new mse.BaseContainer(null,'Title',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Titledefault=new mse.Layer(pages.Title,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj593=new mse.Image(layers.Titledefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src19'); layers.Titledefault.addObject(objs.obj593);
	pages.Title.addLayer('Titledefault',layers.Titledefault);
	layers.titlemask=new mse.Layer(pages.Title,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj4=new mse.Mask(layers.titlemask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.titlemask.addObject(objs.obj4);
	pages.Title.addLayer('titlemask',layers.titlemask);
	layers.titletxt=new mse.Layer(pages.Title,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj5=new mse.Text(layers.titletxt,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},' LES ENFANTS DE L’APOCALYPSE',true); layers.titletxt.addObject(objs.obj5);
	objs.obj6=new mse.Text(layers.titletxt,{"size":[mse.coor('cid11'),mse.coor('cid12')],"pos":[mse.coor('cid13'),mse.coor('cid14')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Chapitre V',true); layers.titletxt.addObject(objs.obj6);
	objs.obj7=new mse.Text(layers.titletxt,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top"},'Encore bouleversé par l’inquiétante cérémonie à laquelle il a assisté, Simon s’est retrouvé face à un bien étrange sac, remuant et parlant ! En l’ouvrant, l’adolescent a ainsi fait la connaissance d\'un inspecteur sympathique et au demeurant décédé…',true); layers.titletxt.addObject(objs.obj7);
	pages.Title.addLayer('titletxt',layers.titletxt);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back1=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj8=new mse.Image(layers.back1,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid5')+"px Times"},'src19'); layers.back1.addObject(objs.obj8);
	pages.Content.addLayer('back1',layers.back1);
	layers.Contentdefault=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj278=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"},'src11'); layers.Contentdefault.addObject(objs.obj278);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.contentmask=new mse.Layer(pages.Content,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj274=new mse.Mask(layers.contentmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.60,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.contentmask.addObject(objs.obj274);
	pages.Content.addLayer('contentmask',layers.contentmask);
	layers.content=new mse.ArticleLayer(pages.Content,4,{"size":[mse.coor('cid20'),mse.coor('cid21')],"pos":[mse.coor('cid22'),mse.coor('cid23')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid24')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid25')},null);
	objs.obj316=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Lorsqu’il ouvrit les yeux, Simon ',true); layers.content.addObject(objs.obj316);
	objs.obj317=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'hésita entre pousser un cri ',true); layers.content.addObject(objs.obj317);
	objs.obj318=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’horreur ou éclater de rire. Face ',true); layers.content.addObject(objs.obj318);
	objs.obj319=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'à lui, l’inspecteur Angéli dodelinait ',true); layers.content.addObject(objs.obj319);
	objs.obj320=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'de la tête en faisant les cent pas.',true); layers.content.addObject(objs.obj320);
	objs.obj584=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj584);
	objs.obj587=new mse.Image(layers.content,{"size":[mse.coor('cid27'),mse.coor('cid28')],"pos":[mse.coor('cid29'),mse.coor('cid5')]},'src2');
	objs.obj587.activateZoom(); layers.content.addObject(objs.obj587);
	objs.obj585=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj585);
	objs.obj321=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Un phoque !',true);
	objs.obj321.addLink(new mse.Link('Un',8,'audio',mse.src.getSrc('sonphoque')));
	objs.obj321.addLink(new mse.Link('phoque',8,'wiki',wikis.Phoque)); layers.content.addObject(objs.obj321);
	objs.obj322=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’homme était engoncé dans une ',true); layers.content.addObject(objs.obj322);
	objs.obj323=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'combinaison de vinyle noir qu’il ',true); layers.content.addObject(objs.obj323);
	objs.obj324=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'avait grossièrement taillée dans le ',true); layers.content.addObject(objs.obj324);
	objs.obj325=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sac où il avait été enfermé. Il ',true); layers.content.addObject(objs.obj325);
	objs.obj326=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'ressemblait à un énorme phoque -',true); layers.content.addObject(objs.obj326);
	objs.obj327=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},' un lion de mer à la réflexion - ',true); layers.content.addObject(objs.obj327);
	objs.obj328=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'échoué sur un banc de sable.',true); layers.content.addObject(objs.obj328);
	objs.obj329=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Simon opta pour la seconde ',true); layers.content.addObject(objs.obj329);
	objs.obj330=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'option.',true); layers.content.addObject(objs.obj330);
	objs.obj331=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj331);
	objs.obj332=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Quoi ? Qu’est ce qu’il y a ? ',true);
	objs.obj331.addObject(objs.obj332);
	objs.obj333=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'tonna l’inspecteur en se ',true);
	objs.obj331.addObject(objs.obj333);
	objs.obj335=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'tournant vers l’adolescent.',true);
	objs.obj331.addObject(objs.obj335);
	objs.obj336=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Mais l’adolescent était incapable ',true); layers.content.addObject(objs.obj336);
	objs.obj337=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'de répondre, secoué par les ',true); layers.content.addObject(objs.obj337);
	objs.obj338=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'hoquets de son fou rire.',true); layers.content.addObject(objs.obj338);
	objs.obj339=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj339);
	objs.obj340=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Je ne vois pas ce qu’il y a de ',true);
	objs.obj339.addObject(objs.obj340);
	objs.obj341=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'drôle…',true);
	objs.obj339.addObject(objs.obj341);
	objs.obj342=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Angéli tournait sur lui-même, ',true); layers.content.addObject(objs.obj342);
	objs.obj343=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'tentant de comprendre ce qui ',true); layers.content.addObject(objs.obj343);
	objs.obj344=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'avait bien pu déclencher l’hilarité ',true); layers.content.addObject(objs.obj344);
	objs.obj345=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'du jeune garçon.',true); layers.content.addObject(objs.obj345);
	objs.obj346=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Puis il se figea, l’air contrarié.',true); layers.content.addObject(objs.obj346);
	objs.obj347=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj347);
	objs.obj348=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Bon, ça suffit à présent. Tu ',true);
	objs.obj347.addObject(objs.obj348);
	objs.obj349=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'vas te décider à me dire ce qui ',true);
	objs.obj347.addObject(objs.obj349);
	objs.obj351=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'se passe, oui ou non ?',true);
	objs.obj347.addObject(objs.obj351);
	objs.obj352=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Simon s’interrompit net.',true); layers.content.addObject(objs.obj352);
	objs.obj353=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'La peur revenait.',true); layers.content.addObject(objs.obj353);
	objs.obj354=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj354);
	objs.obj355=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Je… Vous…',true);
	objs.obj354.addObject(objs.obj355);
	objs.obj356=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj356);
	objs.obj357=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Articule, je ne comprends rien!',true);
	objs.obj356.addObject(objs.obj357);
	objs.obj359=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj359);
	objs.obj360=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'C’est juste que vous avez ',true);
	objs.obj359.addObject(objs.obj360);
	objs.obj361=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'l’air… bizarre, habillé comme ',true);
	objs.obj359.addObject(objs.obj361);
	objs.obj363=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'cela.',true);
	objs.obj359.addObject(objs.obj363);
	objs.obj364=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’inspecteur jeta un œil à son ',true); layers.content.addObject(objs.obj364);
	objs.obj365=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'accoutrement.',true); layers.content.addObject(objs.obj365);
	objs.obj366=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj366);
	objs.obj367=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Ah oui ?',true);
	objs.obj366.addObject(objs.obj367);
	objs.obj368=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’adolescent hocha la tête en ',true); layers.content.addObject(objs.obj368);
	objs.obj369=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'guise de confirmation. L’homme ',true); layers.content.addObject(objs.obj369);
	objs.obj370=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'avait l’air déçu et il en était ',true); layers.content.addObject(objs.obj370);
	objs.obj371=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'touchant.',true); layers.content.addObject(objs.obj371);
	objs.obj372=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj372);
	objs.obj373=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Oui. Bon. C’est pas tout ça ',true);
	objs.obj372.addObject(objs.obj373);
	objs.obj374=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'mais ça ne m’explique pas ce ',true);
	objs.obj372.addObject(objs.obj374);
	objs.obj378=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'qui m’est arrivé... Allez relève-toi ',true);
	objs.obj372.addObject(objs.obj378);
	objs.obj379=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'maintenant, on va essayer de ',true);
	objs.obj372.addObject(objs.obj379);
	objs.obj380=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'trouver la sortie.',true);
	objs.obj372.addObject(objs.obj380);
	objs.obj381=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Mais Simon refusa de bouger.',true); layers.content.addObject(objs.obj381);
	objs.obj382=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Pas question de suivre ce… enfin, ',true); layers.content.addObject(objs.obj382);
	objs.obj383=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'cette chose qui, en toute logique, ',true); layers.content.addObject(objs.obj383);
	objs.obj384=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'aurait dû rejoindre la terre d’un ',true); layers.content.addObject(objs.obj384);
	objs.obj385=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'cimetière.',true); layers.content.addObject(objs.obj385);
	objs.obj386=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj386);
	objs.obj387=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Qu’est ce qu’il y a encore ? ',true);
	objs.obj386.addObject(objs.obj387);
	objs.obj388=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'On dirait que tu as peur de ',true);
	objs.obj386.addObject(objs.obj388);
	objs.obj390=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'moi.',true);
	objs.obj386.addObject(objs.obj390);
	objs.obj391=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj391);
	objs.obj392=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Oh oui ! Enfin je veux dire que ',true);
	objs.obj391.addObject(objs.obj392);
	objs.obj393=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'vous ne devriez pas… euh…',true);
	objs.obj391.addObject(objs.obj393);
	objs.obj394=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj394);
	objs.obj395=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Quoi ?',true);
	objs.obj394.addObject(objs.obj395);
	objs.obj396=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj396);
	objs.obj397=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Eh bien, vos cicatrices, le trou ',true);
	objs.obj396.addObject(objs.obj397);
	objs.obj398=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'dans votre cœur… Vous ',true);
	objs.obj396.addObject(objs.obj398);
	objs.obj400=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'devriez…',true);
	objs.obj396.addObject(objs.obj400);
	objs.obj401=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj401);
	objs.obj402=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Je devrais ou je ne devrais ',true);
	objs.obj401.addObject(objs.obj402);
	objs.obj403=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'pas, quoi ?',true);
	objs.obj401.addObject(objs.obj403);
	objs.obj404=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj404);
	objs.obj405=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Logiquement vous devriez ',true);
	objs.obj404.addObject(objs.obj405);
	objs.obj406=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'être mort, non ?',true);
	objs.obj404.addObject(objs.obj406);
	objs.obj407=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Les paupières d’Angéli ',true); layers.content.addObject(objs.obj407);
	objs.obj408=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’écarquillèrent et il s’assit ',true); layers.content.addObject(objs.obj408);
	objs.obj409=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'lourdement sur un rocher. ',true); layers.content.addObject(objs.obj409);
	objs.obj410=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’homme semblait en proie à une ',true); layers.content.addObject(objs.obj410);
	objs.obj411=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'intense réflexion. Il descendit la ',true); layers.content.addObject(objs.obj411);
	objs.obj412=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'fermeture éclair de sa ',true); layers.content.addObject(objs.obj412);
	objs.obj413=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'« combinaison », regarda l’orifice ',true); layers.content.addObject(objs.obj413);
	objs.obj414=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'qui s’ouvrait dans sa poitrine puis ',true); layers.content.addObject(objs.obj414);
	objs.obj415=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'soupira.',true); layers.content.addObject(objs.obj415);
	objs.obj416=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj416);
	objs.obj417=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Mort ?',true);
	objs.obj416.addObject(objs.obj417);
	objs.obj418=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Il leva son regard azur vers ',true); layers.content.addObject(objs.obj418);
	objs.obj419=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'l’adolescent.',true); layers.content.addObject(objs.obj419);
	objs.obj420=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj420);
	objs.obj421=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Tu crois vraiment ?',true);
	objs.obj420.addObject(objs.obj421);
	objs.obj422=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Simon acquiesça, soudain ému ',true); layers.content.addObject(objs.obj422);
	objs.obj423=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'par la mélancolie qui submergeait ',true); layers.content.addObject(objs.obj423);
	objs.obj424=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'les traits de l’inspecteur.',true); layers.content.addObject(objs.obj424);
	objs.obj425=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj425);
	objs.obj426=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Ben merde, alors.',true);
	objs.obj425.addObject(objs.obj426);
	objs.obj427=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj427);
	objs.obj428=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')],"pos":[mse.coor('cid2'),mse.coor('cid31')]},'Ils marchèrent, en silence, côte à ',true); layers.content.addObject(objs.obj428);
	objs.obj429=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'côte, durant un long moment. ',true); layers.content.addObject(objs.obj429);
	objs.obj430=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Chacun perdu dans ses réflexions. ',true); layers.content.addObject(objs.obj430);
	objs.obj431=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Evitant les passages trop étroits ',true); layers.content.addObject(objs.obj431);
	objs.obj432=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'- l’inspecteur avait failli rester ',true); layers.content.addObject(objs.obj432);
	objs.obj433=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'coincé plus d’une fois -, ils ',true); layers.content.addObject(objs.obj433);
	objs.obj434=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'traversèrent d’interminables ',true); layers.content.addObject(objs.obj434);
	objs.obj435=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'galeries, de vastes salles désertes. ',true); layers.content.addObject(objs.obj435);
	objs.obj436=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Parfois, ils tombaient sur de ',true); layers.content.addObject(objs.obj436);
	objs.obj437=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'véritables œuvres d’art ',true); layers.content.addObject(objs.obj437);
	objs.obj438=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'abandonnées au milieu des ',true); layers.content.addObject(objs.obj438);
	objs.obj439=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'souterrains : de minuscules ',true); layers.content.addObject(objs.obj439);
	objs.obj440=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'céramiques agencées en motifs ',true); layers.content.addObject(objs.obj440);
	objs.obj441=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'ésotériques, des gargouilles ',true);
	objs.obj441.addLink(new mse.Link('ésotériques',84,'wiki',wikis.Esoterique)); layers.content.addObject(objs.obj441);
	objs.obj442=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sculptées dans le roc ou ',true); layers.content.addObject(objs.obj442);
	objs.obj443=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’étranges mobiles de fer forgé. ',true); layers.content.addObject(objs.obj443);
	objs.obj444=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Un musée troglodyte érigé à la ',true); layers.content.addObject(objs.obj444);
	objs.obj445=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'gloire d’artistes anonymes.',true); layers.content.addObject(objs.obj445);
	objs.obj592=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj592);
	objs.obj446=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Mais impossible de trouver la ',true); layers.content.addObject(objs.obj446);
	objs.obj447=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sortie.',true); layers.content.addObject(objs.obj447);
	objs.obj448=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Angéli marchait d’un bon pas',true); layers.content.addObject(objs.obj448);
	objs.obj449=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'-l’avantage des morts-vivants, c’est ',true); layers.content.addObject(objs.obj449);
	objs.obj450=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'qu’ils ne se fatiguent pas vite-',true); layers.content.addObject(objs.obj450);
	objs.obj451=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'tandis que Simon s’épuisait. ',true); layers.content.addObject(objs.obj451);
	objs.obj452=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Bientôt, il ne pourrait plus ',true); layers.content.addObject(objs.obj452);
	objs.obj453=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'avancer et il refusait encore l’idée ',true); layers.content.addObject(objs.obj453);
	objs.obj454=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’être transporté par l’inspecteur. ',true); layers.content.addObject(objs.obj454);
	objs.obj455=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Rien que de penser au contact de ',true); layers.content.addObject(objs.obj455);
	objs.obj456=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sa peau froide, il en frissonnait ',true); layers.content.addObject(objs.obj456);
	objs.obj457=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’avance.',true); layers.content.addObject(objs.obj457);
	objs.obj458=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'La situation paraissait désespérée.',true); layers.content.addObject(objs.obj458);
	objs.obj459=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Soudain, ils perçurent les ',true); layers.content.addObject(objs.obj459);
	objs.obj460=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'vibrations sourdes d’une batterie.',true); layers.content.addObject(objs.obj460);
	objs.obj461=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'De la musique ! Ici, au beau milieu ',true); layers.content.addObject(objs.obj461);
	objs.obj462=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'de nulle part !',true); layers.content.addObject(objs.obj462);
	objs.obj463=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Improbable.',true); layers.content.addObject(objs.obj463);
	objs.obj464=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj464);
	objs.obj465=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Ventre-Dieu ! En plus d’être ',true);
	objs.obj464.addObject(objs.obj465);
	objs.obj466=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'mort, voilà que j’ai des ',true);
	objs.obj464.addObject(objs.obj466);
	objs.obj468=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'hallucinations à présent !',true);
	objs.obj464.addObject(objs.obj468);
	objs.obj469=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj469);
	objs.obj470=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Je les entends aussi, précisa ',true);
	objs.obj469.addObject(objs.obj470);
	objs.obj471=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Simon.',true);
	objs.obj469.addObject(objs.obj471);
	objs.obj472=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj472);
	objs.obj473=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Excellent ! Qui dit musique, ',true);
	objs.obj472.addObject(objs.obj473);
	objs.obj474=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'dit quelqu’un et ce quelqu’un ',true);
	objs.obj472.addObject(objs.obj474);
	objs.obj477=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'doit connaître la sortie. Allons-y !',true);
	objs.obj472.addObject(objs.obj477);
	objs.obj478=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’adolescent n’eut pas le temps ',true); layers.content.addObject(objs.obj478);
	objs.obj479=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'de retenir l’inspecteur que celui-ci ',true); layers.content.addObject(objs.obj479);
	objs.obj480=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’était déjà engagé dans la ',true); layers.content.addObject(objs.obj480);
	objs.obj481=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'direction des bruits.',true);
	objs.obj481.addLink(new mse.Link('bruits',114,'audio',mse.src.getSrc('concert'))); layers.content.addObject(objs.obj481);
	objs.obj482=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Il courait et Simon avait du mal à ',true); layers.content.addObject(objs.obj482);
	objs.obj483=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'suivre.',true); layers.content.addObject(objs.obj483);
	objs.obj484=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj484);
	objs.obj485=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Attendez ! Inspecteur…',true);
	objs.obj484.addObject(objs.obj485);
	objs.obj486=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Mais Angéli ne l’écoutait pas, bien ',true); layers.content.addObject(objs.obj486);
	objs.obj487=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'décidé à s’extraire de ces sous-sols ',true); layers.content.addObject(objs.obj487);
	objs.obj488=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'humides.',true); layers.content.addObject(objs.obj488);
	objs.obj489=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj489);
	objs.obj490=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Attendez ! Vous oubliez que ',true);
	objs.obj489.addObject(objs.obj490);
	objs.obj491=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'vous êtes m…',true);
	objs.obj489.addObject(objs.obj491);
	objs.obj492=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Les dernières syllabes volèrent en ',true); layers.content.addObject(objs.obj492);
	objs.obj493=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'éclat, dispersées par un solo de ',true); layers.content.addObject(objs.obj493);
	objs.obj494=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'guitare électrique endiablé. Simon ',true); layers.content.addObject(objs.obj494);
	objs.obj495=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'se figea, saisi par le spectacle qui ',true); layers.content.addObject(objs.obj495);
	objs.obj496=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’étalait sous ses yeux.',true); layers.content.addObject(objs.obj496);
	objs.obj497=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Dans une vaste grotte saturée de ',true); layers.content.addObject(objs.obj497);
	objs.obj498=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'fumigènes et d’effets lumineux, ',true); layers.content.addObject(objs.obj498);
	objs.obj499=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'une centaine de personnes ',true); layers.content.addObject(objs.obj499);
	objs.obj500=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’agitait au pied d’une scène ',true); layers.content.addObject(objs.obj500);
	objs.obj501=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'encombrée d’énormes ',true); layers.content.addObject(objs.obj501);
	objs.obj502=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'haut-parleurs.',true); layers.content.addObject(objs.obj502);
	objs.obj503=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Sur l’estrade, un groupe - les ',true); layers.content.addObject(objs.obj503);
	objs.obj504=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Enfants de l’Apocalypse - bardé de ',true);
	objs.obj504.addLink(new mse.Link('l’Apocalypse',134,'wiki',wikis.Apocalypse)); layers.content.addObject(objs.obj504);
	objs.obj505=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'cheveux longs et de cuir, ',true); layers.content.addObject(objs.obj505);
	objs.obj506=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’évertuait à massacrer les ',true); layers.content.addObject(objs.obj506);
	objs.obj507=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'derniers morceaux de Metallica.',true); layers.content.addObject(objs.obj507);
	objs.obj508=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Effectivement, il y avait bien ',true); layers.content.addObject(objs.obj508);
	objs.obj509=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'quelqu’un !',true); layers.content.addObject(objs.obj509);
	objs.obj510=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Mais où était donc passé ',true); layers.content.addObject(objs.obj510);
	objs.obj511=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'l’inspecteur?',true); layers.content.addObject(objs.obj511);
	objs.obj512=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'L’adolescent se haussa sur la ',true); layers.content.addObject(objs.obj512);
	objs.obj513=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'pointe des pieds pour tenter de ',true); layers.content.addObject(objs.obj513);
	objs.obj514=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'l’apercevoir dans la foule.',true); layers.content.addObject(objs.obj514);
	objs.obj515=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Là ! Juste à côté de la scène.',true); layers.content.addObject(objs.obj515);
	objs.obj516=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Le policier, oubliant sans doute sa ',true); layers.content.addObject(objs.obj516);
	objs.obj517=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'condition, tentait désespérément ',true); layers.content.addObject(objs.obj517);
	objs.obj518=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'de rejoindre le groupe. Moulé dans ',true); layers.content.addObject(objs.obj518);
	objs.obj519=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sa combinaison noire, dissimulé ',true); layers.content.addObject(objs.obj519);
	objs.obj520=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'par les jeux de lumières, il était ',true); layers.content.addObject(objs.obj520);
	objs.obj521=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'passé inaperçu.',true); layers.content.addObject(objs.obj521);
	objs.obj522=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Il grimpa sur l’estrade au grand ',true); layers.content.addObject(objs.obj522);
	objs.obj523=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'étonnement du batteur. Puis il ',true); layers.content.addObject(objs.obj523);
	objs.obj524=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’avança vers le centre.',true); layers.content.addObject(objs.obj524);
	objs.obj525=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Ecartant le chanteur d’une ',true); layers.content.addObject(objs.obj525);
	objs.obj526=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'bourrade, il se saisit du micro. ',true); layers.content.addObject(objs.obj526);
	objs.obj527=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Derrière, les musiciens ',true); layers.content.addObject(objs.obj527);
	objs.obj528=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'continuaient comme si de rien ',true); layers.content.addObject(objs.obj528);
	objs.obj529=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'n’était, pensant qu’il devait s’agir ',true); layers.content.addObject(objs.obj529);
	objs.obj530=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’un excentrique en mal de gloire.',true); layers.content.addObject(objs.obj530);
	objs.obj531=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Lorsque l’inspecteur hurla «Police!»',true); layers.content.addObject(objs.obj531);
	objs.obj532=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'la foule s’agita de plus belle, ',true); layers.content.addObject(objs.obj532);
	objs.obj533=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'ravie de cette improvisation. ',true); layers.content.addObject(objs.obj533);
	objs.obj534=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Angéli était désespéré. Personne ',true); layers.content.addObject(objs.obj534);
	objs.obj535=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'ne semblait vouloir l’écouter.',true); layers.content.addObject(objs.obj535);
	objs.obj536=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Tout aurait pu bien se finir si le ',true); layers.content.addObject(objs.obj536);
	objs.obj537=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'chanteur, piqué au vif, ne s’était ',true); layers.content.addObject(objs.obj537);
	objs.obj538=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'pas attaqué au policier. Vexé ',true); layers.content.addObject(objs.obj538);
	objs.obj539=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'qu’un inconnu lui ait volé la ',true); layers.content.addObject(objs.obj539);
	objs.obj540=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'vedette, il asséna un formidable ',true); layers.content.addObject(objs.obj540);
	objs.obj541=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'coup de poing à l’inspecteur. Ce ',true); layers.content.addObject(objs.obj541);
	objs.obj542=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'dernier n’eut pas le temps ',true); layers.content.addObject(objs.obj542);
	objs.obj543=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'d’esquiver l’assaut.  Et, dans un ',true); layers.content.addObject(objs.obj543);
	objs.obj544=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'formidable craquement, sa ',true); layers.content.addObject(objs.obj544);
	objs.obj545=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'mâchoire se décrocha, tandis que ',true); layers.content.addObject(objs.obj545);
	objs.obj546=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'son œil gauche sortait de son ',true); layers.content.addObject(objs.obj546);
	objs.obj547=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'orbite.',true); layers.content.addObject(objs.obj547);
	objs.obj548=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Un vent se stupeur souffla ',true); layers.content.addObject(objs.obj548);
	objs.obj549=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'instantanément dans la salle. Les ',true); layers.content.addObject(objs.obj549);
	objs.obj550=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'spectateurs commencèrent à ',true); layers.content.addObject(objs.obj550);
	objs.obj551=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’enfuir en hurlant.',true); layers.content.addObject(objs.obj551);
	objs.obj588=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj588);
	objs.obj591=new Esquive(); layers.content.addGame(objs.obj591);
	objs.obj589=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj589);
	objs.obj552=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'En quelques instants à peine, il ne ',true); layers.content.addObject(objs.obj552);
	objs.obj553=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'restait plus qu’un peu de ',true); layers.content.addObject(objs.obj553);
	objs.obj554=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'poussière et de fumée.',true); layers.content.addObject(objs.obj554);
	objs.obj555=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Simon rejoignit l’inspecteur.',true); layers.content.addObject(objs.obj555);
	objs.obj556=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj556);
	objs.obj557=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Vous êtes fou ! Pourquoi avez-',true);
	objs.obj556.addObject(objs.obj557);
	objs.obj558=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'vous fait ça ?',true);
	objs.obj556.addObject(objs.obj558);
	objs.obj559=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Angéli se redressa, l’air penaud. ',true); layers.content.addObject(objs.obj559);
	objs.obj560=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'Enfin, aussi penaud que lui ',true); layers.content.addObject(objs.obj560);
	objs.obj561=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'permettait son visage déformé.',true); layers.content.addObject(objs.obj561);
	objs.obj562=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj562);
	objs.obj563=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Il suffisait de leur demander ',true);
	objs.obj562.addObject(objs.obj563);
	objs.obj564=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'poliment…',true);
	objs.obj562.addObject(objs.obj564);
	objs.obj565=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'D’un geste sec, le policier ',true); layers.content.addObject(objs.obj565);
	objs.obj566=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'s’empressa de remettre son œil et ',true); layers.content.addObject(objs.obj566);
	objs.obj567=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'sa mâchoire en place.',true); layers.content.addObject(objs.obj567);
	objs.obj568=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'angeli', 'src17' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj568);
	objs.obj569=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'J’ai essayé, s’excusa-t-il, mais ',true);
	objs.obj568.addObject(objs.obj569);
	objs.obj570=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'ils n’entendaient rien… Alors ',true);
	objs.obj568.addObject(objs.obj570);
	objs.obj574=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'j’ai pensé les effrayer pour qu’ils ',true);
	objs.obj568.addObject(objs.obj574);
	objs.obj575=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'se précipitent vers la sortie.',true);
	objs.obj568.addObject(objs.obj575);
	objs.obj576=new mse.Speaker( layers.content,{"size":[mse.coor('cid20'),mse.coor('cid2')]}, 'simon', 'src18' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj576);
	objs.obj577=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'Eh bien, c’est réussi ! ajouta ',true);
	objs.obj576.addObject(objs.obj577);
	objs.obj578=new mse.Text(layers.content,{"size":[mse.coor('cid30'),mse.coor('cid25')]},'l’adolescent en colère. Il ne ',true);
	objs.obj576.addObject(objs.obj578);
	objs.obj581=new mse.Text(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]},'nous reste plus qu’à les suivre.',true);
	objs.obj576.addObject(objs.obj581);
	objs.obj582=new mse.UIObject(layers.content,{"size":[mse.coor('cid26'),mse.coor('cid25')]}); layers.content.addObject(objs.obj582);
	objs.obj583=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid25')],"pos":[mse.coor('cid2'),mse.coor('cid32')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid25')+"px Gudea","textAlign":"center"},'À SUIVRE...',true); layers.content.addObject(objs.obj583);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.resumeAnime=new mse.Animation(89,1,false);
	animes.resumeAnime.block=true;
	animes.resumeAnime.addObj('obj7',objs.obj7);
	animes.resumeAnime.addAnimation('obj7',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.maskAnime=new mse.Animation(89,1,false);
	animes.maskAnime.block=true;
	animes.maskAnime.addObj('obj4',objs.obj4);
	animes.maskAnime.addAnimation('obj4',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.titleAnime=new mse.Animation(89,1,false);
	animes.titleAnime.block=true;
	animes.titleAnime.addObj('obj5',objs.obj5);
	animes.titleAnime.addAnimation('obj5',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chaAnime=new mse.Animation(89,1,false);
	animes.chaAnime.block=true;
	animes.chaAnime.addObj('obj6',objs.obj6);
	animes.chaAnime.addAnimation('obj6',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chBack2Anime=new mse.Animation(26,1,false);
	animes.chBack2Anime.block=true;
	animes.chBack2Anime.addObj('obj278',objs.obj278);
	animes.chBack2Anime.addAnimation('obj278',{'frame':JSON.parse('[0,25,26]'),'opacity':JSON.parse('[0,1,1]')});
	animes.objAnime=new mse.Animation(367,1,true);
	animes.objAnime.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid47'),mse.coor('cid48')],'size':[mse.coor('cid4'),mse.coor('cid3')]},'src4');
	animes.objAnime.addObj('src4',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid27'),mse.coor('cid49')],'size':[mse.coor('cid4'),mse.coor('cid3')]},'src5');
	animes.objAnime.addObj('src5',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid50'),mse.coor('cid51')],'size':[mse.coor('cid52'),mse.coor('cid53')]},'src3');
	animes.objAnime.addObj('src3',temp.obj);
	animes.objAnime.addAnimation('src4',{'frame':JSON.parse('[0,50,51,64,114,152,202,240,290,328,353,366,367]'),'pos':[[mse.coor('cid47'),mse.coor('cid48')],[mse.coor('cid47'),mse.coor('cid48')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid53'),mse.coor('cid49')],[mse.coor('cid53'),mse.coor('cid49')],[mse.coor('cid64'),mse.coor('cid55')],[mse.coor('cid64'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')],[mse.coor('cid54'),mse.coor('cid55')]],'size':[[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')]],'opacity':JSON.parse('[0,0,0,1,1,1,1,1,1,1,1,0,0]')});
	animes.objAnime.addAnimation('src5',{'frame':JSON.parse('[0,50,51,64,114,152,202,240,290,328,353,366,367]'),'pos':[[mse.coor('cid27'),mse.coor('cid49')],[mse.coor('cid27'),mse.coor('cid49')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid65'),mse.coor('cid66')],[mse.coor('cid65'),mse.coor('cid66')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid58'),mse.coor('cid55')],[mse.coor('cid58'),mse.coor('cid55')]],'size':[[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid4'),mse.coor('cid3')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid67'),mse.coor('cid3')],[mse.coor('cid67'),mse.coor('cid3')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')],[mse.coor('cid59'),mse.coor('cid57')]],'opacity':JSON.parse('[0,0,0,1,1,1,1,1,1,1,1,0,0]')});
	animes.objAnime.addAnimation('src3',{'frame':JSON.parse('[0,50,51,64,114,152,202,240,290,328,353,366,367]'),'opacity':JSON.parse('[0,0,0,1,1,1,1,1,1,1,1,0,0]'),'pos':[[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid60'),mse.coor('cid55')],[mse.coor('cid60'),mse.coor('cid55')],[mse.coor('cid63'),mse.coor('cid55')],[mse.coor('cid63'),mse.coor('cid55')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid50'),mse.coor('cid51')]],'size':[[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid61'),mse.coor('cid57')],[mse.coor('cid61'),mse.coor('cid57')],[mse.coor('cid61'),mse.coor('cid57')],[mse.coor('cid61'),mse.coor('cid57')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')]]});
	animes.hitAngeli=new mse.Animation(95,1,true);
	animes.hitAngeli.block=true;
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid4'),mse.coor('cid68')],'size':[mse.coor('cid3'),mse.coor('cid69')]},'src6',436,400, 0,0,2180,800);
	animes.hitAngeli.addObj('src6',temp.obj);
	animes.hitAngeli.addAnimation('src6',{'frame':JSON.parse('[0,13,38,40,42,44,46,48,50,52,54,56,81,94,95]'),'spriteSeq':JSON.parse('[0,0,0,1,2,3,4,5,6,7,8,9,9,9,9]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]')});
	var action={};
	var reaction={};
	action.transTitle=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transTitle=function(){ 
		root.transition(pages.Title); 
	};
	action.transTitle.register(reaction.transTitle);
	action.startMaskAn=new mse.Script([{src:pages.Title,type:'show'}]);
	reaction.startMaskAn=function(){ 
		animes.maskAnime.start(); 
	};
	action.startMaskAn.register(reaction.startMaskAn);
	action.startResumeAn=action.startMaskAn;
	reaction.startResumeAn=function(){ 
		animes.resumeAnime.start(); 
	};
	action.startResumeAn.register(reaction.startResumeAn);
	action.startChaAnime=action.startMaskAn;
	reaction.startChaAnime=function(){ 
		animes.chaAnime.start(); 
	};
	action.startChaAnime.register(reaction.startChaAnime);
	action.startTitleAn=action.startMaskAn;
	reaction.startTitleAn=function(){ 
		animes.titleAnime.start(); 
	};
	action.startTitleAn.register(reaction.startTitleAn);
	action.transContent=new mse.Script([{src:pages.Title,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransSc=new mse.Script([{src:animes.maskAnime,type:'end'}]);
	reaction.addTransSc=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransSc.register(reaction.addTransSc);
	action.cursorCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.cursorCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorCouv.register(reaction.cursorCouv);
	action.cursorTitle=action.startMaskAn;
	reaction.cursorTitle=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorTitle.register(reaction.cursorTitle);
	action.cursorTitlePt=action.addTransSc;
	reaction.cursorTitlePt=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorTitlePt.register(reaction.cursorTitlePt);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.startsoundcoup=new mse.Script([{src:animes.hitAngeli,type:'start'}]);
	reaction.startsoundcoup=function(){ 
		mse.src.getSrc('soncoup').play(); 
	};
	action.startsoundcoup.register(reaction.startsoundcoup);
	action.addSpotEffet=new mse.Script([{src:animes.chBack2Anime,type:'end'}]);
	reaction.addSpotEffet=function(){ 
		objs.obj278.count = 0;
objs.obj278.filterConfig = function() {
    var principal = false;
    var multi = [];
    for(var i = 0; i < 3; ++i) {
        if(principal)
            multi[i] = 255;
        else {
            multi[i] = randomInt(50)+200;
            if(multi[i] < 225) principal = true;
        }
    }
    return {rMulti:multi[0]/255,gMulti:multi[1]/255,bMulti:multi[2]/255,alpha:0.4};
}
objs.obj278.spotEffet = new mse.EIColorFilter(objs.obj278, objs.obj278.filterConfig());
objs.obj278.logic = function(delta) {
    mse.Image.prototype.logic.call(this, delta);
    if(this.count < 40) this.count++;
    else {
        this.spotEffet.init(this.filterConfig());
        this.count = 0;
    }
}
objs.obj278.startEffect(objs.obj278.spotEffet) 
	};
	action.addSpotEffet.register(reaction.addSpotEffet);
	action.chBack1=new mse.Script([{src:objs.obj428,type:'firstShow'}]);
	reaction.chBack1=function(){ 
		temp.width=objs.obj8.getWidth();temp.height=objs.obj8.getHeight();temp.boundingbox=imgBoundingInBox('src10',temp.width,temp.height);temp.obj=new mse.Image(objs.obj8.parent,temp.boundingbox,'src10');mse.transition(objs.obj8,temp.obj,25); 
	};
	action.chBack1.register(reaction.chBack1);
	action.chBack2=new mse.Script([{src:objs.obj492,type:'firstShow'}]);
	reaction.chBack2=function(){ 
		animes.chBack2Anime.start(); 
	};
	action.chBack2.register(reaction.chBack2);
	action.startHitAngeli=new mse.Script([{src:objs.obj548,type:'show'}]);
	reaction.startHitAngeli=function(){ 
		animes.hitAngeli.start(); 
	};
	action.startHitAngeli.register(reaction.startHitAngeli);
	action.startObjAnime=new mse.Script([{src:objs.obj446,type:'show'}]);
	reaction.startObjAnime=function(){ 
		animes.objAnime.start(); 
	};
	action.startObjAnime.register(reaction.startObjAnime);
	action.addTextEffect=action.cursorCouv;
	reaction.addTextEffect=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.content.objList.length; i++){
	var objCible = layers.content.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffect.register(reaction.addTextEffect);
	action.startBeginIntro=action.transTitle;
	reaction.startBeginIntro=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startBeginIntro.register(reaction.startBeginIntro);
	action.startFinIntro=new mse.Script([{src:objs.obj583,type:'firstShow'}]);
	reaction.startFinIntro=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startFinIntro.register(reaction.startFinIntro);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);