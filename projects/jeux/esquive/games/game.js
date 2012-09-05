
//Game Esquive

// class for enemies  
var Enemi = function(parent, trajCoor, number) {
    this.sprite = (function(){
        if (number%2 == 1)
            return new mse.Sprite(parent,{ pos:[0,0], size:[mse.coor(mse.joinCoor(50))*0.25, mse.coor(mse.joinCoor(118))*0.25] },'enemi', 50, 118, 0, 0, 600, 118);
        else 
            return new mse.Sprite(parent,{ pos:[0,0], size:[mse.coor(mse.joinCoor(50))*0.25, mse.coor(mse.joinCoor(99))*0.25] }, 'enemi', 50, 99, 0, 118, 600, 99);
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
            ctx.fillRect(this.colMask.x, this.colMask.y + this.sprite.height-10, this.colMask.w, 10);
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
    this.pas = mse.coor(mse.joinCoor(15));
    this.heartSize = mse.coor(mse.joinCoor(15));
    
    // Colision mask
    this.colMask = {};
    
    this.sprite = new mse.Sprite(parent,{ pos:[0,0], size:[mse.coor(mse.joinCoor(58)), mse.coor(mse.joinCoor(84))] }, 'simon', 58, 84, 0, 0  , 174, 84);
    this.effect = mse.initImageEffect({ "colorfilter": {rMulti: 0.7, duration: this.redTime} }, this.sprite);
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
        ctx.fillRect(this.colMask.x, this.y+this.sprite.height-10, this.colMask.w, 10);
        ctx.fillStyle = 'rgba(0,0,0, 1)';
        // */
    },
    changeDir: function(dir){
        if(dir != this.dir){
            this.anime.stop();
            this.dir = dir;
            switch (dir) {
                case 'WAIT':
                    this.sprite.configSprite(58, 84, 0, 0, 174, 84, mse.coor(mse.joinCoor(58)), mse.coor(mse.joinCoor(84)));
                    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2],0,2);
                break;
                case 'LEFT':
                    this.sprite.configSprite(75, 85, 0, 169, 450, 85, mse.coor(mse.joinCoor(75)), mse.coor(mse.joinCoor(85)));
                    this.anime = new mse.FrameAnimation(this.sprite,[0,1,2,3,4,5],0,2);
                break;
                case 'RIGHT':
                    this.sprite.configSprite(75, 85, 0, 84 , 450, 85, mse.coor(mse.joinCoor(75)), mse.coor(mse.joinCoor(85)));
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
    
    // this.offx = mse.coor(mse.joinCoor(100));
    // this.offy = mse.coor(mse.joinCoor(80));
    this.width = mse.coor(mse.joinCoor(600)); 
    this.height = mse.coor(mse.joinCoor(440));
    
    // some variable to manage the way's line
    var dStart = mse.coor(mse.joinCoor(30));
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
        
    this.startLine = mse.coor(mse.joinCoor(170));   // (y)
    this.endLine = mse.coor(mse.joinCoor(410));     // (y)
    this.colTolerance = mse.coor(mse.joinCoor(20));
    
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
	if(MseConfig.iOS) var help2res = {francais:"Touches pour commencer !", anglais:"Touch to start"};
    else var help2res = {francais:"Cliques pour commencer !", anglais: "Click to start"};
    var langRes = new mse.LanguageRessource('francais');
    langRes.addElem('help2', help2res);
    this.info2 = new mse.Text(null, {
		pos:[10,this.height-50],
		size:[this.width-20,0],
		fillStyle:"rgba(255,255,255,1)",
		font:"15px Arial",
		textAlign:"center",
		textBaseline:"top",
		lineHeight:25}, langRes.getElem('help2'), true
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
		// ctx.translate(this.offx, this.offy);		
		
		            
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
            
            this.simon.draw(ctx);
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
            this.lose();
        }
        else if (this.currTime > 40) {
            this.state = 'WIN';
            this.getEvtProxy().removeListener('click', this.clickcb); // Mouse        
            this.getEvtProxy().removeListener('keydown', this.keyDowncb); // Keyboard        
            this.getEvtProxy().removeListener('keyup', this.keyUpcb);
            this.end();            
        }
    };
     
    this.click = function (e) {
        // var x = e.offsetX - this.offx;
        // var y = e.offsetY - this.offy;
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
        var x = e.offsetX;
        if(x<this.simon.x+this.simon.sprite.width/2 && this.simon.dir != 'LEFT')
            this.simon.changeDir('LEFT');
        else if (x>this.simon.x+this.simon.sprite.width/2 && this.simon.dir != 'RIGHT')
            this.simon.changeDir('RIGHT');
    };
    
    this.startGestCb = new mse.Callback(this.gestureMove, this);    
    this.updateGestCb = new mse.Callback(this.gestureMove, this);
    this.endGestCb = new mse.Callback(function(){this.simon.changeDir('WAIT');}, this);
    
    this.mobileLazyInit = function(){
        this.width = mse.coor(mse.joinCoor(480)); 
        this.height = mse.coor(mse.joinCoor(315));
    };
};
extend(Esquive, mse.Game);

// Class for spots
var Spot = function(parent, type){
    mse.src.addSource('spot-left', 'games/spot-left.png', 'img', true);
    
    var x = mse.coor(mse.joinCoor(-30));    
    var y = x;
    
    var left = new mse.Image(null, {pos:[x,y],size:[mse.coor(mse.joinCoor(374)),mse.coor(mse.joinCoor(306))]},'spot-left');
    var right = new mse.Image(null, {pos:[x,y]},'spot-left');
    
    this.effectL = mse.initImageEffect({ "colorfilter": {rMulti: 0.7} }, left);
    this.effectR = mse.initImageEffect({ "colorfilter": {rMulti: 0.7} }, right);
    
    this.width = mse.coor(mse.joinCoor(600));    
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








