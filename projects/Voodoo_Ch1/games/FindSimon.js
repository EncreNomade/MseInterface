var FindSimon = function() {
    mse.Game.call(this, {fillback:true});
    this.msg = {
        "INIT": "Clique pour aider Simon à échapper à la Meute.",//Utilise les flèches de direction pour diriger Simon dans le parc.
        "WIN": "Bravo!!! Tu as gagné."
    };
    this.state = "INIT";
    
    mse.src.addSource('parc', 'games/Parc.jpg', 'img', true);
    mse.src.addSource('perso_parc', 'games/personnages.png', 'img', true);
    mse.src.addSource('notice_parc', 'games/points-persos.png', 'img', true);
    //var parc = new mse.Image(null, {pos:[0, 0]}, 'parc');
    var mechants = new Array();
    mechants[0] = new mse.Sprite(null, {}, 'perso_parc', 40,37, 0,37,280,37);
    mechants[1] = new mse.Sprite(null, {}, 'perso_parc', 40,37, 0,74,280,37);
    mechants[2] = new mse.Sprite(null, {}, 'perso_parc', 40,37, 0,111,280,37);
    mechants[3] = new mse.Sprite(null, {}, 'perso_parc', 40,37, 0,148,280,37);
    
    // Possible movement area
    var freerect = {
        vertical:  [[190,250,60,650],
                    [390,250,60,650],
                    [580,250,60,320],
                    [640,960,60,190],
                    [830,570,60,390],
                    [1030,320,60,380],
                    [1350,320,60,770],
                    [1660,190,60,960]],
        horizontal:[[190,190,450,60],
                    [1090,320,260,60],
                    [640,510,390,60],
                    [1410,570,250,60],
                    [890,700,460,60],
                    [190,900,640,60],
                    [700,1090,960,60]]
    };
    
    // Course of NPC
    var courses = [
        [crePoint2(415,925), crePoint2(415,225)],
        [crePoint2(810,925), crePoint2(675,925), crePoint2(675,1115)],
        [crePoint2(1695,335), crePoint2(1695,605), crePoint2(1695,840)],
        [crePoint2(1060,335), crePoint2(1060,540), crePoint2(1060,735), crePoint2(1370,735)]
    ];

    // Direction of vision
    var dirs = [
        [[180,0],[0,180]],
        [[90],[],[0]],
        [[180],[180],[180]],
        [[0],[180],[],[90,-90]]
    ];
    
    // Init NPCs
    this.npc = new Array();
    for(var i = 0; i < 4; i++) {
        this.npc[i] = new NPC(mechants[i], courses[i], dirs[i]);
    }
    // Init Simon
    this.simon = new mse.Sprite(null, {}, 'perso_parc', 40,37, 0,0,280,37);
    this.simonrun = new mse.FrameAnimation(this.simon, [0,1,2,3,4,5], 0, 7);
    this.simonstand = new mse.FrameAnimation(this.simon, [6], 0, 1000);
    // Spark frequence
    this.spark = 0;
    
    // Vitural pad
    if(MseConfig.iOS) {
        mse.src.addSource('vPadBase', './UI/button/padbase.png', 'img', true);
        mse.src.addSource('vPadHandler', './UI/button/padhandler.png', 'img', true);
        this.padBase = new mse.Image(null, {pos:[46, this.height-103],size:[48,48],globalAlpha:0.6}, 'vPadBase');
        this.padHandler = new mse.Image(null, {pos:[30, this.height-119],size:[80,80],globalAlpha:0.6}, 'vPadHandler');
        this.touchZone = [30, this.height-119, 80, 80];
    }
    
    this.init = function() {
        this.npc[3].v = 3;
        
        this.simondir = 0;
        this.simonrun.stop();
        this.simonstand.start();
        this.onmove = false;
        this.lazylose = false;
        this.circleR = 0;
        this.detectR = 50;
        // Init Parc draw parameters
        this.sx = this.sy = this.sw = this.sh = this.dx = this.dy = this.dw = this.dh = 0;
        
        // Position of parc
        this.sp = new mse.Point2(225,725);
        this.pos = new mse.Point2(this.width/2-this.sp.x,this.height/2-this.sp.y);
        this.disx = this.disy = 0;
    	
    	// Key event listener
    	this.getEvtProxy().addListener('keydown', this.movecb, true, this);
    	this.getEvtProxy().addListener('keyup', this.moveovercb, true, this);
    	if(MseConfig.iOS){
    	    this.getEvtProxy().addListener('gestureStart', this.touchStartcb, true, this);
    	    this.getEvtProxy().addListener('gestureUpdate', this.touchMovecb, true, this);
    	    this.getEvtProxy().addListener('gestureEnd', this.moveovercb, true, this);
    	}
    };
    this.mobileLazyInit = function() {
        // Position of parc
        this.sp = new mse.Point2(225,725);
        this.pos = new mse.Point2(this.width/2-this.sp.x,this.height/2-this.sp.y);
        this.disx = this.disy = 0;
    };
    
    this.draw = function(ctx) {
        ctx.save();
		var parc = mse.src.getSrc('parc');
		var scale = parc.width/1920;
		// Background
		ctx.drawImage(parc, this.sx*scale, this.sy*scale, this.sw*scale, this.sh*scale, this.dx, this.dy, this.dw, this.dh);
		// Simon
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		ctx.rotate(this.simondir*Math.PI/180);
		if(this.onmove) {
		    // Draw circle of detection around simon
		    ctx.globalAlpha = (this.detectR - this.circleR) / 50;
		    ctx.fillStyle = "rgba(255,255,255,0.6)";
		    ctx.strokeStyle = "#fff";
		    ctx.beginPath();
		    ctx.arc(0, 0, this.circleR, 0, Math.PI*2, true); 
		    ctx.closePath();
		    ctx.fill();
		    ctx.stroke();
		}
		ctx.translate(-20,-18);
		this.simon.draw(ctx);
		ctx.restore();
		// NPCs
		for(var i = 0; i < 4; i++) {
		    this.npc[i].draw(ctx, this.pos.x, this.pos.y);
		}
		// Plan
		ctx.globalAlpha = 0.7;
		ctx.drawImage(mse.src.getSrc('parc'), 5,5,192,128);
		// Simon on plan
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'rgb(0,200,0)';
		ctx.fillRect(4+this.sp.x/10, 4+this.sp.y/10, 2,2);
		// Destination
		ctx.fillStyle = 'rgba(250,230,200,0.8)';
		if(this.spark == 10) {
		    this.spark = 0;
		    ctx.beginPath();
		    ctx.arc(174,34, 3, 0,Math.PI*2, true);
		    ctx.fill();
		}
		else this.spark++;
		ctx.restore();
		if(MseConfig.iOS) {
		    this.padBase.draw(ctx);
		    this.padHandler.draw(ctx);
		    ctx.globalAlpha = 1;
		}
	};
	
	this.logic = function(delta) {
	    if(this.lazylose) {
	        this.losecount--;
	        if(this.losecount == 0) this.lose();
	        return;
	    }
		// Parc visible part
		if(this.pos.x > 0) {
		    this.sx = 0;
		    this.sw = this.width - this.pos.x;
		    this.dx = this.pos.x;
		}
		else {
		    this.sx = -this.pos.x;
		    if(this.pos.x + 1920 < this.width) this.sw = 1920 + this.pos.x;
		    else this.sw = this.width;
		    this.dx = 0;
		}
		if(this.pos.y > 0) {
		    this.sy = 0;
		    this.sh = this.height - this.pos.y;
		    this.dy = this.pos.y;
		}
		else {
		    this.sy = -this.pos.y;
		    if(this.pos.y + 1280 < this.height) this.sh = 1280 + this.pos.y;
		    else this.sh = this.height;
		    this.dy = 0;
		}
		this.dw = this.sw;
		this.dh = this.sh;
		
		// Simon
		this.pos.x += this.disx;
		this.pos.y += this.disy;
		// Ignore the movement if collision
		if(this.colliDetect()) {this.pos.x -= this.disx; this.pos.y -= this.disy;}
		if(this.onmove) {
		    if(this.circleR < this.detectR) this.circleR += 2;
		    else this.circleR = 0;
		}
		
		this.sp.x = this.width/2 - this.pos.x;
		this.sp.y = this.height/2 - this.pos.y;
		
		// Win check
		if(Math.abs(this.sp.x - 1690) <= 60 && Math.abs(this.sp.y - 290) <= 10) {
		    this.getEvtProxy().removeListener('keydown', this.movecb);
		    this.getEvtProxy().removeListener('keyup', this.moveoverc);
		    if(MseConfig.iOS){
		        this.getEvtProxy().removeListener('gestureStart', this.touchStartcb);
		        this.getEvtProxy().removeListener('gestureUpdate', this.touchMovecb);
		        this.getEvtProxy().removeListener('gestureEnd', this.moveovercb);
		    }
		    this.state = "WIN";
		    this.end();
		}
		// NPCs
		for(var i = 0; i < 4; i++) {
		    var n = this.npc[i];
		    n.logic(delta);
		    
		    // Detect if simon is found
		    var dis = Math.round(distance2Pts(this.sp.x,this.sp.y,n.pos.x,n.pos.y));
		    var angle = angleFor2Point(n.pos,this.sp);
		    var adis = Math.abs(angle-n.direction);
		    if(adis > 180) adis = 360-adis;
		    if(dis < 50 || (dis <= 170 && adis <= n.visiona)) {
		    // Simon is found!!!
		        n.direction = angle;
		        // Remove Key event listener
		        this.getEvtProxy().removeListener('keydown', this.movecb);
		        this.getEvtProxy().removeListener('keyup', this.moveovercb);
		        if(MseConfig.iOS){
		            this.getEvtProxy().removeListener('gestureStart', this.touchStartcb);
		            this.getEvtProxy().removeListener('gestureUpdate', this.touchMovecb);
		            this.getEvtProxy().removeListener('gestureEnd', this.moveovercb);
		        }
		        this.lazylose = true;
		        this.moveover();
		        this.losecount = 40;
		    }
		}
	};
	
	this.colliDetect = function() {
	    var x = this.width/2 - this.pos.x;
	    var y = this.height/2 - this.pos.y;
	    for(var i = 0; i < freerect.vertical.length; i++) {
	        var xRelat = xRelatRect(x, freerect.vertical[i]);
	        if(xRelat == -1) break;
	        // In free rect, no collision
	        else if(xRelat == 0 && yRelatRect(y, freerect.vertical[i]) == 0) return false;
        }
        for(var i = 0; i < freerect.horizontal.length; i++) {
            var yRelat = yRelatRect(y, freerect.horizontal[i]);
            // In none of the free rect, collision
            if(yRelat == -1) return true;
            // In free rect, no collision
            else if(yRelat == 0 && xRelatRect(x, freerect.horizontal[i]) == 0) return false;
        }
        return true;
	};
	
	this.move = function(e) {
	    var valid = false;
	    switch(e.keyCode) {
	    case __KEY_LEFT:
	        this.disx = 4; this.disy = 0;
	        this.simondir = 180;
	        valid = true;
	    	break;
	    case __KEY_RIGHT:
	        this.disx = -4; this.disy = 0;
	        this.simondir = 0;
	        valid = true;
	    	break;
	    case __KEY_UP:
	        this.disy = 4; this.disx = 0;
	        this.simondir = -90;
	        valid = true;
	    	break;
	    case __KEY_DOWN:
	        this.disy = -4; this.disx = 0;
	        this.simondir = 90;
	        valid = true;
	    	break;
	    }
	    if(valid && !this.onmove) {
	        this.onmove = true;
	        this.circleR = 0;
	        this.simonrun.start();
	        this.simonstand.stop();
	    }
	};
	this.touchStart = function(e) {
	    if(inrect(e.offsetX, e.offsetY, this.touchZone))
	        this.touchValid = true;
	    this.disx = 0; this.disy = 0;
	    this.onmove = false;
	};
	this.touchMove = function(e) {
	    if(this.touchValid) {
	        var ox = this.touchZone[0]+40, oy = this.touchZone[1]+40;
	        var a = mseAngleForLine(ox, oy, e.offsetX, e.offsetY);
	        var dis = distance2Pts(ox, oy, e.offsetX, e.offsetY);
	        if(dis < 40) this.padHandler.setPos(e.offsetX-40, e.offsetY-40);
	        else this.padHandler.setPos(ox+40/dis*(e.offsetX-ox)-40, oy+40/dis*(e.offsetY-oy)-40);
	        
	        var valid = true;
	        if((a >= 0 && a <= 15) || (a <= 0 && a >= -15)){
	            //Left
	            this.disx = -4; this.disy = 0;
	            this.simondir = 0;
	        }
	        else if(a >= 75 && a <= 105) {
	            // Down
	            this.disy = -4; this.disx = 0;
	            this.simondir = 90;
	        }
	        else if(a >= 165 || a <= -165) {
	            // RIGHT
	            this.disx = 4; this.disy = 0;
	            this.simondir = 180;
	        }
	        else if(a <= -75 && a >= -105) {
	            // Up
	            this.disy = 4; this.disx = 0;
	            this.simondir = -90;
	        }
	        else valid = false;
	        if(valid && !this.onmove) {
	            this.onmove = true;
	            this.simonrun.start();
	            this.simonstand.stop();
	        }
	    }
	};
	this.moveover = function(e) {
	    this.disx = 0; this.disy = 0;
	    this.onmove = false;
	    this.simonrun.stop();
	    this.simonstand.start();
	    
	    this.touchValid = false;
	    if(this.padHandler) this.padHandler.setPos(this.touchZone[0], this.touchZone[1]);
	};
	// Init key listeners
	this.movecb = new mse.Callback(this.move, this);
	this.moveovercb = new mse.Callback(this.moveover, this);
	this.touchStartcb = new mse.Callback(this.touchStart, this);
	this.touchMovecb = new mse.Callback(this.touchMove, this);
};
extend(FindSimon, mse.Game);