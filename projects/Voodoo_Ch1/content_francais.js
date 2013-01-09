var RatGame = function() {
	mse.Game.call(this);
	
	var oxid = mse.joinCoor(220);
	var oyid = mse.joinCoor(0);
	var wid = mse.joinCoor(360);
	var hid = mse.joinCoor(596);
	
	this.canvasox = mse.coor(oxid); this.canvasoy = mse.coor(oyid);
	this.width = mse.coor(wid); this.height = mse.coor(hid);
	
	mse.src.addSource('ratAud', 'audios/rat', 'aud');
	
	mse.src.addSource('ratImg', 'games/rat.png', 'img');
	var ratSit = new mse.Sprite(this,{pos:[30,this.height-80]}, 'ratImg', 80,50, 0,0,400,100);
	var ratHead = new mse.Sprite(this,{pos:[20,this.height-96]}, 'ratImg', 39,34, 400,0,39,34);
	var ratHang = new mse.Sprite(this, {pos:[45,this.height-80]}, 'ratImg', 40,113, 0,101,400,113);
	mse.src.addSource('sacImg', 'games/sac.png', 'img');
	var sac = new mse.Image(this, {pos:[this.width-160,20], insideRec:[60,40,60,60]}, 'sacImg');
	var pochet = new mse.Sprite(this, {pos:[this.width-100,175]}, 'sacImg', 60,40, 60,155,60,40);
	
	var seq = [0,1,2,3,4,5,6,7,8,9];
	var sitAnim = new mse.FrameAnimation(ratSit, seq, 0, 2);
	var hangAnim = new mse.FrameAnimation(ratHang, seq, 0, 2);
	
	this.dragStart = function(e) {
		if(ratSit.inObj(e.offsetX, e.offsetY)){
			this.sit = false;
			ratHang.offx = e.offsetX-20;
			ratHang.offy = e.offsetY-14;
			
			sitAnim.stop();
			hangAnim.start();
			mse.src.getSrc('ratAud').play();
		}
	};
	this.dragMove = function(e) {
		ratHang.offx = e.offsetX - 20;
		ratHang.offy = e.offsetY - 14;
	};
	this.dragEnd = function(e) {
		var x = e.offsetX;
		var y = e.offsetY;
		if(this.sit) return;
		if(sac.inObj(e.offsetX, e.offsetY)) {
			var drop = new mse.KeyFrameAnimation(ratHang, {
					frame	: [0, 25, 35],
					pos		: [[x-20, y-14], [sac.offx+70,sac.offy+125], [sac.offx+70,sac.offy+125]]
				}, 1);
			drop.evtDeleg.addListener('end', new mse.Callback(this.end, this));
			drop.start();
			this.droped = true;
			this.getEvtProxy().removeListener('gestureStart', cbStart);
			this.getEvtProxy().removeListener('gestureUpdate', cbMove);
			this.getEvtProxy().removeListener('gestureEnd', cbEnd);
		}
		else {
			this.sit = true;
			hangAnim.stop();
			sitAnim.start();
		}
	};
	
	var cbStart = new mse.Callback(this.dragStart, this);
	var cbMove = new mse.Callback(this.dragMove, this);
	var cbEnd = new mse.Callback(this.dragEnd, this);
	
	this.init = function() {
		this.getEvtProxy().addListener('gestureStart', cbStart, true);
		this.getEvtProxy().addListener('gestureUpdate', cbMove, true);
		this.getEvtProxy().addListener('gestureEnd', cbEnd, true);
		
		this.sit = true;
		this.droped = false;
		sitAnim.start();
	};
	
	this.logic = function(delta) {
		if(this.droped) {
			var d = pochet.offy - ratHang.offy - 114;
			ratHang.fh = d < 0 ? 114+d : 114;
			ratHang.height = ratHang.fh;
		}
	};
    
	this.draw = function(ctx) {
		sac.draw(ctx);
		if(this.sit) {
			ratSit.draw(ctx);
			ratHead.draw(ctx);
			// Draw text
			ctx.save();
			// Draw bull
			ctx.fillStyle = "#FFF";
			ctx.translate(ratHead.getX()+ratHead.getWidth()*1.2, ratHead.getY()-24);
			ctx.beginPath();
			ctx.moveTo(-10,30);
			ctx.lineTo(0,30-15);
			ctx.lineTo(10,30);
			ctx.lineTo(-10,30);
			ctx.fill();
			ctx.fillRoundRect(0, 0, 240, 30, 10);
			ctx.fillStyle = "#000";
			ctx.font = "20px Gudea";
			ctx.textBaseline = 'top';
			ctx.fillText("Aide Simon, vite!", 10, 4);
			ctx.restore();
		}
		else ratHang.draw(ctx);
		if(this.droped) pochet.draw(ctx);
	};
};
extend(RatGame, mse.Game);function angleFor2Point(p1, p2) {
	var angle = 0;
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	angle = Math.atan2(dy, dx);
	return Math.round(180 * angle/(Math.PI));
};

function distance2Pts(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
};

function inrect(x, y, rect) {
    if(x >= rect[0] && x <= rect[0]+rect[2] && y >= rect[1] && y <= rect[1]+rect[3]) return true;
    else return false;
};
function xRelatRect(x, rect) {
    if(x < rect[0]) return -1;
    else if(x >= rect[0] && x <= rect[0]+rect[2]) return 0;
    else return 1;
};
function yRelatRect(y, rect) {
    if(y < rect[1]) return -1;
    else if(y >= rect[1] && y <= rect[1]+rect[3]) return 0;
    else return 1;
};

var NPC = function(sprite, course, dir) {
    if(course.length < 2) {mseLog('Array Error', 'Array \'course\' demande minimum 2 elements');}
    if(course.length != dir.length) {mseLog('Array Error', 'Array \'course\' have to be the same size of array \'dir\'');}
    this.sprite = sprite;
    this.animes = new Array();
    // Animations
    this.animes['run'] = new mse.FrameAnimation(sprite, [0,1,2,3,4,5], 0, 5);
    this.animes['stand'] = new mse.FrameAnimation(sprite, [6], 0, 1000);
    // Velocity
    this.v = 6;
    // Vision
    this.visiond = 180;
    this.visiona = 40;
    // Start and end angle of view
    this.startAngle = this.visiona*Math.PI/180;
    this.endAngle = -this.startAngle;
    this.startP = crePoint2(Math.cos(this.startAngle)*this.visiond, Math.sin(this.startAngle)*this.visiond);
    // Course predefined
    this.course = course;
    // Direction of view
    this.dir = dir;
    // Position
    this.pos = new mse.Point2(course[0].x, course[0].y);
    this.currStep = 0;
    this.nextStep = 1;
    // Orientation
    this.direction = angleFor2Point(this.course[0], this.course[1]);
    if(dir[this.currStep].length != 0) {
        this.currDir = 0;
        this.tarDir = this.dir[this.currStep][this.currDir];
        this.state = 1;
        this.animes['run'].stop();
        this.animes['stand'].start();
    }
    else {
        this.tarDir = this.direction;
        this.state = 0;
        this.animes['run'].start();
        this.animes['stand'].stop();
    }
    
    this.logic = function(delta) {
        switch(this.state) {
        case 0:// Run
            // Direction not right
            //if(this.direction != this.tarDir) {
              //  this.state = 1;
              //  return;
            //}
            
            var dx = this.course[this.nextStep].x - this.pos.x;
            var dy = this.course[this.nextStep].y - this.pos.y;
            if(dx == 0) {
                // Movement vertical
                if(dy < -this.v) {this.pos.y -= this.v;return;}
                else if(dy > this.v) {this.pos.y += this.v;return;}
            }
            else {
                // Movement horizontal
                if(dx < -this.v) {this.pos.x -= this.v;return;}
                else if(dx > this.v) {this.pos.x += this.v;return;}
            }
            // Movement over
            this.pos = new mse.Point2(this.course[this.nextStep].x, this.course[this.nextStep].y);
            if(this.currStep < this.nextStep) {
                this.currStep = this.nextStep;
                this.nextStep = (this.nextStep == this.course.length-1) ? this.nextStep-1 : this.nextStep+1;
            }
            else {
                this.currStep = this.nextStep;
                this.nextStep = (this.nextStep == 0) ? 1 : this.nextStep-1;
            }
            // Change to turn state
            this.state = 1;
            this.animes['run'].stop();
            this.animes['stand'].start();
            if(this.dir[this.currStep].length != 0) this.tarDir = this.dir[this.currStep][this.currDir];
            else {
                this.currDir = -1;
                this.tarDir = angleFor2Point(this.course[this.currStep], this.course[this.nextStep]);
            }
        break;
        case 1:// Turn
            var dis = this.tarDir - this.direction;
            // Turning
            if(dis < -2) this.direction -= 2;
            else if(dis > 2) this.direction += 2;
            else {
            // Turn over
                this.direction = this.tarDir;
                // CurrDir is marked, start to run
                if(this.currDir == -1) {
                    this.state = 0;
                    this.currDir = 0;
                    this.animes['run'].start();
                    this.animes['stand'].stop();
                    return;
                }
                // Found next turn target
                if(this.currDir < this.dir[this.currStep].length-1) {
                    this.currDir++;
                    this.tarDir = this.dir[this.currStep][this.currDir];
                }
                // No more turn target, turn to the run direction
                else {
                    this.tarDir = angleFor2Point(this.course[this.currStep], this.course[this.nextStep]);
                    // Mark the currDir to ignore the verification
                    this.currDir = -1;
                }
            }
        break;
        case 2:// Notice
        break;
        case 3:// Stand
        break;
        }
    };
    this.draw = function(ctx, x, y) {
        ctx.save();
        // To center point
        ctx.translate(x + this.pos.x,  y + this.pos.y);
        ctx.rotate(this.direction*Math.PI/180);
        // Draw view
        ctx.fillStyle = 'rgba(200,0,0,0.5)';
        ctx.beginPath();
        ctx.lineTo(this.startP.x, this.startP.y);
        ctx.arc(0,0, this.visiond, this.startAngle,this.endAngle, true);
        ctx.lineTo(0, 0);
        ctx.fill();
        // Draw sprite
        ctx.translate(-20,-18);
        this.sprite.draw(ctx);
        ctx.restore();
    };
};


var FindSimon = function() {
    mse.Game.call(this, {fillback:true});
    this.msg = {
        "INIT": "Clique pour aider Simon\nà échapper à la Meute.\nUtilise les flêches du clavier.",
        "WIN": "Bravo!!! Tu as gagné."
    };
    this.config.title = "Parc Montsouris";
    this.state = "INIT";
    
    mse.src.addSource('aud_findsimon', 'audios/findsimon', 'aud');
    mse.src.getSrc('aud_findsimon').loop = true;
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
        [[],[180],[]],
        [[0],[180],[],[90]]
    ];
    
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
    
    this.begintime = (new Date()).getTime();
    
    this.init = function() {
        mse.src.getSrc('aud_findsimon').play();
    
		// Init NPCs
	    this.npc = new Array();
	    for(var i = 0; i < 4; i++) {
	        this.npc[i] = new NPC(mechants[i], courses[i], dirs[i]);
	    }
        this.npc[3].v = 4.5;
        
        this.simondir = 0;
        this.simonrun.stop();
        this.simonstand.start();
        this.onmove = false;
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
    	
    	this.begintime = (new Date()).getTime();
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
		    mse.src.getSrc('aud_findsimon').pause();
		    
		    this.state = "WIN";
		    this.setScore( 4000 * 1000 / ( (new Date()).getTime() - this.begintime ) );
		    this.win();
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
		        this.moveover();
		        mse.src.getSrc('aud_findsimon').pause();
		        this.state = "LOSE";
		        this.lose();
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
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":201.25,"cid5":20,"cid6":407.5,"cid7":45,"cid8":197.5,"cid9":108.75,"cid10":32.5,"cid11":218.75,"cid12":293.75,"cid13":246.25,"cid14":200,"cid15":360,"cid16":590,"cid17":220,"cid18":10,"cid19":22.5,"cid20":36.25,"cid21":450,"cid22":315,"cid23":324,"cid24":441.72,"cid25":18,"cid26":441.75,"cid27":238.75,"cid28":492.5,"cid29":517.5,"cid30":250,"cid31":100,"cid32":300,"cid33":409,"cid34":-200,"cid35":1090,"cid36":33,"cid37":235,"cid38":109,"cid39":343,"cid40":41,"cid41":320,"cid42":248,"cid43":178,"cid44":61,"cid45":230,"cid46":-42,"cid47":135,"cid48":1000,"cid49":164,"cid50":106,"cid51":189,"cid52":114,"cid53":221,"cid54":238,"cid55":23,"cid56":143,"cid57":36,"cid58":83,"cid59":396,"cid60":116,"cid61":340,"cid62":30,"cid63":90,"cid64":266,"cid65":140,"cid66":210,"cid67":208,"cid68":170,"cid69":260,"cid70":290,"cid71":350,"cid72":380,"cid73":410,"cid74":440}');
initMseConfig();
mse.init();
window.pages={};
var layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch1/';
	window.root = new mse.Root('Voodoo_Ch1',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src0','images/src0.png','img',true);
	mse.src.addSource('src7','images/src7.png','img',true);
	mse.src.addSource('src8','images/src8.png','img',true);
	mse.src.addSource('src9','images/src9.jpeg','img',true);
	games.RatGame = new RatGame();
	games.FindSimon = new FindSimon();
	mse.src.addSource('src22','images/src22.jpeg','img',true);
	mse.src.addSource('grillageimg','images/src16.png','img',true);
	mse.src.addSource('src29','images/src29.jpeg','img',true);
	mse.src.addSource('src30','images/src30.jpeg','img',true);
	mse.src.addSource('src31','images/src31.jpeg','img',true);
	mse.src.addSource('src32','images/src32.jpeg','img',true);
	mse.src.addSource('src33','images/src33.jpeg','img',true);
	mse.src.addSource('src34','images/src34.png','img',true);
	mse.src.addSource('src35','images/src35.png','img',true);
	mse.src.addSource('src36','images/src36.png','img',true);
	mse.src.addSource('src37','images/src37.png','img',true);
	mse.src.addSource('src41','images/src41.jpeg','img',true);
	mse.src.addSource('src44','images/src44.jpeg','img',true);
	mse.src.addSource('src45','images/src45.jpeg','img',true);
	mse.src.addSource('src46','images/src46.jpeg','img',true);
	mse.src.addSource('src47','images/src47.jpeg','img',true);
	mse.src.addSource('src48','images/src48.jpeg','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('villenuit','audios/villenuit','aud',false);
	mse.src.addSource('piegeson','audios/piegeson','aud',false);
	mse.src.addSource('pasAppro','audios/pasAppro','aud',false);
	mse.src.addSource('kevinSpeak','audios/kevinSpeak','aud',false);
	mse.src.addSource('woosh','audios/woosh','aud',false);
	mse.src.addSource('runsound','audios/runsound','aud',false);
	mse.src.addSource('ilestla','audios/ilestla','aud',false);
	mse.src.addSource('accelera','audios/accelera','aud',false);
	mse.src.addSource('klaxon','audios/klaxon','aud',false);
	mse.src.addSource('vent','audios/vent','aud',false);
	mse.src.addSource('paslourd','audios/paslourd','aud',false);
	mse.src.addSource('rer','audios/rer','aud',false);
	mse.src.addSource('restartrun','audios/restartrun','aud',false);
	mse.src.addSource('onletien','audios/onletien','aud',false);
	mse.src.addSource('heart','audios/heart','aud',false);
	wikis.Noctambule=new mse.WikiLayer();
	wikis.Noctambule.addTextCard();
	wikis.Noctambule.textCard.addSection('Nyctalope', 'A ne pas confondre avec nyctalope : un adjectif qui désigne celui qui a la faculté de voir dans la pénombre, comme les chats');
	wikis.Noctambule.textCard.addSection('A moins d’inventer', ' - Nyctambule : qui recherche les fétards égarés la nuit\n - Noctalope : qui travaille la nuit sans avoir besoin de lumière');
	wikis.Noctambule.addTextCard();
	wikis.Noctambule.textCard.addSection('Noctambule', 'Nom masculin ou féminin : \n - personne ou animal qui a l’habitude de se promener la nuit.\n - personne qui aime faire la fête la nuit.\n - Par extension : personne qui est en activité la nuit');
	wikis.frondaison=new mse.WikiLayer();
	wikis.frondaison.addImage('src29', 'Photo réalisée par Panoramas');
	wikis.frondaison.addTextCard();
	wikis.frondaison.textCard.addSection('Frondaison', 'Nom, féminin : \n - Les feuilles et les branches d’un arbre\n - Epoque où les feuilles commencent à pousser');
	wikis.frondaison.textCard.addSection('Synonymes', 'Feuillage, \nRamure, \nBranchage');
	wikis.albinos=new mse.WikiLayer();
	wikis.albinos.addImage('src31', 'Salif Keïta par Jeff Attaway');
	wikis.albinos.addTextCard();
	wikis.albinos.textCard.addSection('Les albinos célèbres', 'Il existe des albinos célèbres parmi lesquels Salif Keïta, chanteur et musicien malien. Il a obtenu une Victoire de la musique en 2010 pour son album « La Différence »');
	wikis.albinos.textCard.addLink('Site officiel  Salif Keïta', 'http:\/\/salif-keita.artiste.universalmusic.fr\/');
	wikis.albinos.addImage('src30', 'Rat albinos. Photographie de Tambako');
	wikis.albinos.addTextCard();
	wikis.albinos.textCard.addSection('Albinos', 'Adjectif invariable :\nQui est affecté d\'albinisme.');
	wikis.albinos.textCard.addSection('Albinisme', 'nom masculin : \nmaladie génétique qui se caractérise par une absence du pigment destiné à colorer la peau, les poils, les cheveux ainsi que par des yeux rouges. Elle affecte les humains ou les animaux.');
	wikis.albinos.textCard.addLink('Wikipédia albinos', 'http:\/\/fr.wikipedia.org\/wiki\/Albinisme ');
	wikis.pCeinture=new mse.WikiLayer();
	wikis.pCeinture.addImage('src32', 'Vue depuis la place Wagram. Photographie de marsupilami92 ');
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('Biodiversité', 'Elle est considérée comme une réserve de biodiversité. On peut y observer de nombreuses variétés d’arbres, de plantes et la plus grande colonie de chauve-souris de l’espèce pipistrelle d’Ile de France. \nLa ville de Paris y aménage des parcours pédagogiques, proposant ainsi un nouveau type de promenade nature à Paris.');
	wikis.pCeinture.textCard.addLink('Lien Mairie de Paris', 'http:\/\/www.paris.fr\/loisirs\/se-promener-a-paris\/balades-au-vert\/decouvrir-les-richesses-de-la-petite-ceinture\/rub_9660_stand_53584_port_23803');
	wikis.pCeinture.addImage('src33', 'La Petite Ceinture traverse le Parc Montsouris. Photo de Thomas Claveirole ');
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('La Petite Ceinture', 'C’est une ancienne ligne de chemin de fer longue de 32 km qui faisait le tour de Paris.');
	wikis.pCeinture.textCard.addLink('Lien Wikipédia', 'http:\/\/fr.wikipedia.org\/wiki\/Ligne_de_Petite_Ceinture');
	wikis.Cyclope=new mse.WikiLayer();
	wikis.Cyclope.addImage('src9', 'Cyclope, super-héros des X-Men');
	wikis.Cyclope.addTextCard();
	wikis.Cyclope.textCard.addSection('Un Cyclope chez les X-Men :', 'Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est  un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence.');
	wikis.Cyclope.textCard.addLink('Wikipédia X-Men', 'http:\/\/fr.wikipedia.org\/wiki\/Cyclope_%28comics%29 ');
	wikis.Cyclope.addImage('src8', 'Polyphème, fils de Poséïdon');
	wikis.Cyclope.addTextCard();
	wikis.Cyclope.textCard.addSection('Les cyclopes', 'Nom, masculin :\nLes cyclopes sont des créatures fantastiques de la mythologie grecque. Ce sont des géants qui ne possèdent qu’un seul œil au milieu du front. Ils étaient soit forgerons, bâtisseurs ou pasteurs.');
	wikis.Cyclope.textCard.addLink('Wikipédia Cyclope', 'http:\/\/fr.wikipedia.org\/wiki\/Cyclope ');
	wikis.hallali=new mse.WikiLayer();
	wikis.hallali.addImage('src22', 'L\\\'hallali du cerf, peint par Courbet en 1867');
	wikis.hallali.addTextCard();
	wikis.hallali.textCard.addSection('Nom masculin', ' - Sonnerie de chasse à courre qui annonce la prise imminente de l’animal, d’où l’expression : Sonner l’hallali : annoncer la défaite de quelqu’un.\n - Moment où l’animal est pris\n - Par extension : débâcle, défaite');
	wikis.hallali.addTextCard();
	wikis.hallali.textCard.addSection('L’hallali', 'Interjection : \nCri du chasseur qui attrape du gibier lors d’une chasse à courre.');
	mse.src.addSource('src65','images/src65.png','img',true);
	mse.src.addSource('src66','images/src66.png','img',true);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj707=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src44'); layers.back.addObject(objs.obj707);
	pages.Couverture.addLayer('back',layers.back);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj709=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src45'); layers.Chapitredefault.addObject(objs.obj709);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.mask=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj710=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.8,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj710);
	pages.Chapitre.addLayer('mask',layers.mask);
	layers.Text=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj13=new mse.Text(layers.Text,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"bold "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'CHASSE A L\'HOMME',true); layers.Text.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.Text,{"size":[mse.coor('cid11'),mse.coor('cid7')],"pos":[mse.coor('cid12'),mse.coor('cid13')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"bold "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Episode I',true); layers.Text.addObject(objs.obj14);
	pages.Chapitre.addLayer('Text',layers.Text);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj708=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src45'); layers.Contentdefault.addObject(objs.obj708);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.grillage=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj957=new mse.Image(layers.grillage,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'grillageimg'); layers.grillage.addObject(objs.obj957);
	pages.Content.addLayer('grillage',layers.grillage);
	layers.contmask=new mse.Layer(pages.Content,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj711=new mse.Mask(layers.contmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid14'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.8,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.contmask.addObject(objs.obj711);
	pages.Content.addLayer('contmask',layers.contmask);
	layers.text=new mse.ArticleLayer(pages.Content,4,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid20')},null);
	objs.obj712=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Ils étaient là.',true); layers.text.addObject(objs.obj712);
	objs.obj713=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'À moins de cent mètres derrière ',true); layers.text.addObject(objs.obj713);
	objs.obj714=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon. Bien décidés à lui faire payer ',true); layers.text.addObject(objs.obj714);
	objs.obj715=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'l’affront qu’ils avaient subi.',true); layers.text.addObject(objs.obj715);
	objs.obj716=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'La Meute.',true); layers.text.addObject(objs.obj716);
	objs.obj717=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Quatre adolescents qui faisaient ',true); layers.text.addObject(objs.obj717);
	objs.obj718=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'régner leur loi au sein du foyer.',true); layers.text.addObject(objs.obj718);
	objs.obj719=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Recroquevillé dans la pénombre d’un ',true); layers.text.addObject(objs.obj719);
	objs.obj720=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'porche, Simon contemplait le ballet ',true); layers.text.addObject(objs.obj720);
	objs.obj721=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'des lampes torches qui déchiraient la ',true); layers.text.addObject(objs.obj721);
	objs.obj722=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'nuit. Des yeux, scrutant le moindre ',true); layers.text.addObject(objs.obj722);
	objs.obj723=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'recoin, repoussant les ténèbres de ',true); layers.text.addObject(objs.obj723);
	objs.obj724=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'leurs lueurs cyclopes.',true);
	objs.obj724.addLink(new mse.Link('cyclopes',12,'wiki',wikis.Cyclope)); layers.text.addObject(objs.obj724);
	objs.obj725=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Bientôt, ils seraient sur lui.',true); layers.text.addObject(objs.obj725);
	objs.obj726=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon frissonna en songeant à ce qui ',true); layers.text.addObject(objs.obj726);
	objs.obj727=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'allait lui arriver. Il savait que Kevin, ',true); layers.text.addObject(objs.obj727);
	objs.obj728=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'leur chef, serait sans pitié…',true); layers.text.addObject(objs.obj728);
	objs.obj729=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il fallait qu’il leur échappe.',true); layers.text.addObject(objs.obj729);
	objs.obj730=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Absolument. Et tant pis s’il ne pouvait ',true); layers.text.addObject(objs.obj730);
	objs.obj731=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'jamais retourner au foyer.',true); layers.text.addObject(objs.obj731);
	objs.obj732=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Les pas se rapprochaient, de plus en ',true);
	objs.obj732.addLink(new mse.Link('Les pas',20,'audio',mse.src.getSrc('pasAppro'))); layers.text.addObject(objs.obj732);
	objs.obj733=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'plus. Il pouvait entendre leurs voix à ',true); layers.text.addObject(objs.obj733);
	objs.obj734=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'présent.',true); layers.text.addObject(objs.obj734);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj924=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Trouvez-moi ce sale petit rat ! ',true);
	objs.src40.addObject(objs.obj924);
	objs.obj925=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Il va comprendre qu’on ne peut ',true);
	objs.src40.addObject(objs.obj925);
	objs.obj928=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pas se moquer de nous comme ça !',true);
	objs.src40.addObject(objs.obj928);
	objs.src39=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'fouine', 'src34' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src39);
	objs.obj929=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Ouaip, on va lui faire sa fête !',true);
	objs.src39.addObject(objs.obj929);
	objs.obj739=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Ça, c’était « La Fouine ».',true); layers.text.addObject(objs.obj739);
	objs.obj740=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Dix sept ans, un mètre quatre-vingt, ',true); layers.text.addObject(objs.obj740);
	objs.obj741=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'soixante-quinze kilos de violence ',true); layers.text.addObject(objs.obj741);
	objs.obj742=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pure. Une véritable bombe ambulante ',true); layers.text.addObject(objs.obj742);
	objs.obj743=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'qui ne demandait qu’à exploser.',true); layers.text.addObject(objs.obj743);
	objs.obj744=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon se pencha un instant hors de ',true); layers.text.addObject(objs.obj744);
	objs.obj745=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'son abri pour évaluer ses chances de ',true); layers.text.addObject(objs.obj745);
	objs.obj746=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'leur échapper.',true); layers.text.addObject(objs.obj746);
	objs.obj747=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Proches du zéro absolu s’il ne ',true); layers.text.addObject(objs.obj747);
	objs.obj748=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'bougeait pas de sa cachette. Un peu ',true); layers.text.addObject(objs.obj748);
	objs.obj749=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'plus s’il tentait une sortie. À condition ',true); layers.text.addObject(objs.obj749);
	objs.obj750=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de tomber sur quelqu’un, un adulte ',true); layers.text.addObject(objs.obj750);
	objs.obj751=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'qui saurait éloigner ses poursuivants.',true); layers.text.addObject(objs.obj751);
	objs.src38=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'simon', 'src66' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src38);
	objs.obj930=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Tu es prêt ? chuchota-t-il à ',true);
	objs.src38.addObject(objs.obj930);
	objs.obj931=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Dark.',true);
	objs.src38.addObject(objs.obj931);
	objs.obj753=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Dark. Vador. Son rat albinos. Son ',true);
	objs.obj753.addLink(new mse.Link('albinos',39,'wiki',wikis.albinos)); layers.text.addObject(objs.obj753);
	objs.obj754=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'plus fidèle compagnon depuis un an.',true); layers.text.addObject(objs.obj754);
	objs.obj755=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le seul en vérité.',true); layers.text.addObject(objs.obj755);
	objs.obj756=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon repoussa l’élan de mélancolie ',true); layers.text.addObject(objs.obj756);
	objs.obj757=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'qui menaçait de le submerger et ',true); layers.text.addObject(objs.obj757);
	objs.obj758=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'enfouit Dark au fond de son sac.',true); layers.text.addObject(objs.obj758);
	objs.obj983=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj983);
	objs.obj759=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il passa les lanières autour de ses ',true); layers.text.addObject(objs.obj759);
	objs.obj760=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'épaules et s’élança.',true); layers.text.addObject(objs.obj760);
	objs.obj761=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Pas de réaction.',true); layers.text.addObject(objs.obj761);
	objs.obj762=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il s’était mis à courir comme si sa vie ',true);
	objs.obj762.addLink(new mse.Link('courir',49,'audio',mse.src.getSrc('runsound'))); layers.text.addObject(objs.obj762);
	objs.obj763=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'en dépendait.',true); layers.text.addObject(objs.obj763);
	objs.obj764=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Si la Meute lui tombait dessus, il était ',true); layers.text.addObject(objs.obj764);
	objs.obj765=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'bon pour un passage à tabac dans les ',true); layers.text.addObject(objs.obj765);
	objs.obj766=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'règles de l’art. Voilà ce qui se passe ',true); layers.text.addObject(objs.obj766);
	objs.obj767=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'lorsque l’on refuse de soumettre aux ',true); layers.text.addObject(objs.obj767);
	objs.obj768=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'plus forts.',true); layers.text.addObject(objs.obj768);
	objs.obj769=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon évitait de regarder dans leur ',true); layers.text.addObject(objs.obj769);
	objs.obj770=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'direction, les yeux rivés sur les ',true); layers.text.addObject(objs.obj770);
	objs.obj771=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'frondaisons du parc Montsouris. Des ',true);
	objs.obj771.addLink(new mse.Link('frondaisons',58,'wiki',wikis.frondaison)); layers.text.addObject(objs.obj771);
	objs.obj772=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'arbres, de la pénombre et des milliards ',true); layers.text.addObject(objs.obj772);
	objs.obj773=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de recoins où il pourrait se dissimuler ',true); layers.text.addObject(objs.obj773);
	objs.obj774=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'en attendant l’aube.',true); layers.text.addObject(objs.obj774);
	objs.obj775=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'S’il atteignait le jardin, il serait sauvé.',true); layers.text.addObject(objs.obj775);
	objs.obj776=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Mais, dans sa précipitation, il buta ',true); layers.text.addObject(objs.obj776);
	objs.obj777=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'contre le trottoir. Le béton lui arracha ',true); layers.text.addObject(objs.obj777);
	objs.obj778=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'une plainte. Un cri minuscule.',true); layers.text.addObject(objs.obj778);
	objs.obj932=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj932);
	objs.src42=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src41' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src42);
	objs.obj934=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Il est là !',true);
	objs.src42.addObject(objs.obj934);
	objs.obj933=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj933);
	objs.obj780=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Pas assez minuscule, visiblement.',true); layers.text.addObject(objs.obj780);
	objs.obj781=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon détala tandis que les faisceaux ',true); layers.text.addObject(objs.obj781);
	objs.obj782=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'accrochaient sa silhouette.',true); layers.text.addObject(objs.obj782);
	objs.obj935=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj935);
	objs.obj940=new mse.Image(layers.text,{"size":[mse.coor('cid23'),mse.coor('cid24')],"pos":[mse.coor('cid25'),mse.coor('cid5')]},'src47');
	objs.obj940.activateZoom(); layers.text.addObject(objs.obj940);
	objs.obj936=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj936);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj937=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Chopez-le ! Faut qu’il ',true);
	objs.src40.addObject(objs.obj937);
	objs.obj938=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'comprenne !',true);
	objs.src40.addObject(objs.obj938);
	objs.obj784=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Que je comprenne quoi ? Qu’il faut se ',true); layers.text.addObject(objs.obj784);
	objs.obj785=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'laisser faire ? Pas question !',true); layers.text.addObject(objs.obj785);
	objs.obj786=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il accéléra.',true);
	objs.obj786.addLink(new mse.Link('accéléra',78,'audio',mse.src.getSrc('accelera'))); layers.text.addObject(objs.obj786);
	objs.obj787=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il essayait d’oublier que ses poumons ',true); layers.text.addObject(objs.obj787);
	objs.obj788=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'le brûlaient, qu’il était épuisé par cette ',true); layers.text.addObject(objs.obj788);
	objs.obj789=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'poursuite qui durait depuis des ',true); layers.text.addObject(objs.obj789);
	objs.obj790=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'heures, et surtout que la peur menaçait ',true); layers.text.addObject(objs.obj790);
	objs.obj791=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de le paralyser à tout instant.',true); layers.text.addObject(objs.obj791);
	objs.obj792=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il traversa le boulevard, déclenchant le ',true); layers.text.addObject(objs.obj792);
	objs.obj793=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'klaxon furieux d’un noctambule ',true);
	objs.obj793.addLink(new mse.Link('klaxon',85,'audio',mse.src.getSrc('klaxon')));
	objs.obj793.addLink(new mse.Link('noctambule',85,'wiki',wikis.Noctambule)); layers.text.addObject(objs.obj793);
	objs.obj794=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'égaré. Puis il s’engouffra à l’abri des ',true); layers.text.addObject(objs.obj794);
	objs.obj795=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'arbres. Son sac ballotait sur ses ',true); layers.text.addObject(objs.obj795);
	objs.obj796=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'épaules et il pensa au pauvre Dark. ',true); layers.text.addObject(objs.obj796);
	objs.obj797=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Sans réfléchir, il pénétra dans une ',true); layers.text.addObject(objs.obj797);
	objs.obj798=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'petite allée. Il dépassa les angles du ',true); layers.text.addObject(objs.obj798);
	objs.obj799=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pavillon météo qui s’élevait dans la ',true); layers.text.addObject(objs.obj799);
	objs.obj800=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pénombre, puis il ralentit sa course.',true); layers.text.addObject(objs.obj800);
	objs.obj801=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Pas un bruit.',true);
	objs.obj801.addLink(new mse.Link('bruit',93,'audio',mse.src.getSrc('vent'))); layers.text.addObject(objs.obj801);
	objs.obj802=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Rien d’autre que le vent dans les ',true); layers.text.addObject(objs.obj802);
	objs.obj803=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'feuilles.',true); layers.text.addObject(objs.obj803);
	objs.obj804=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Où étaient-ils passés ?',true); layers.text.addObject(objs.obj804);
	objs.obj805=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon s’arrêta, s’accroupit derrière un ',true); layers.text.addObject(objs.obj805);
	objs.obj806=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'banc scarifié de graffitis.',true); layers.text.addObject(objs.obj806);
	objs.obj807=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Là ! Sur sa gauche.',true); layers.text.addObject(objs.obj807);
	objs.obj941=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj941);
	objs.obj946=new mse.Image(layers.text,{"size":[mse.coor('cid23'),mse.coor('cid26')],"pos":[mse.coor('cid25'),mse.coor('cid5')]},'src48');
	objs.obj946.activateZoom(); layers.text.addObject(objs.obj946);
	objs.obj942=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj942);
	objs.obj808=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il avait reconnu la démarche ',true);
	objs.obj808.addLink(new mse.Link('démarche',103,'audio',mse.src.getSrc('paslourd'))); layers.text.addObject(objs.obj808);
	objs.obj809=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'chaloupée de la Fouine, les pas lourds ',true); layers.text.addObject(objs.obj809);
	objs.obj810=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de l’Ours - seize ans, un QI ',true); layers.text.addObject(objs.obj810);
	objs.obj811=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'inversement proportionnel à sa force - ',true); layers.text.addObject(objs.obj811);
	objs.obj812=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'à ses côtés. Les deux autres suivaient ',true); layers.text.addObject(objs.obj812);
	objs.obj813=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'la ligne de tramway qui longeait le ',true); layers.text.addObject(objs.obj813);
	objs.obj814=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'parc, sur sa droite.',true); layers.text.addObject(objs.obj814);
	objs.obj815=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le groupe s’était séparé en deux et ',true); layers.text.addObject(objs.obj815);
	objs.obj816=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'tentait de l’encercler.',true); layers.text.addObject(objs.obj816);
	objs.obj817=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon réfléchit à toute allure.',true); layers.text.addObject(objs.obj817);
	objs.obj818=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le RER !',true);
	objs.obj818.addLink(new mse.Link('RER',113,'audio',mse.src.getSrc('rer'))); layers.text.addObject(objs.obj818);
	objs.obj819=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'La station ne devait être qu’à quelques ',true); layers.text.addObject(objs.obj819);
	objs.obj820=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'dizaines de mètres devant lui et, même ',true); layers.text.addObject(objs.obj820);
	objs.obj821=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'en ces heures tardives, il y aurait sans ',true); layers.text.addObject(objs.obj821);
	objs.obj822=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'doute un peu de monde.',true); layers.text.addObject(objs.obj822);
	objs.obj823=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il reprit sa progression, lentement, ',true); layers.text.addObject(objs.obj823);
	objs.obj824=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'veillant à rester invisible.',true); layers.text.addObject(objs.obj824);
	objs.obj825=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Plus que cinquante mètres.',true); layers.text.addObject(objs.obj825);
	objs.obj826=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il entendait déjà le crissement des ',true); layers.text.addObject(objs.obj826);
	objs.obj827=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'rames sur les rails.',true); layers.text.addObject(objs.obj827);
	objs.obj947=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj947);
	objs.obj828=new mse.Text(layers.text,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid27')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left"},'Quarante.',true); layers.text.addObject(objs.obj828);
	objs.obj948=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj948);
	objs.src42=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src41' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src42);
	objs.obj951=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Là sur le pont ! Il essaye de ',true);
	objs.src42.addObject(objs.obj951);
	objs.obj952=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'rejoindre la gare !',true);
	objs.src42.addObject(objs.obj952);
	objs.src38=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'simon', 'src66' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src38);
	objs.obj953=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Merde ! lâcha Simon en ',true);
	objs.src38.addObject(objs.obj953);
	objs.obj954=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'reprenant sa course.',true);
	objs.src38.addObject(objs.obj954);
	objs.obj949=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj949);
	objs.obj833=new mse.Text(layers.text,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left"},'Trente.',true); layers.text.addObject(objs.obj833);
	objs.obj950=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj950);
	objs.obj834=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Mais la Meute, galvanisée par la ',true); layers.text.addObject(objs.obj834);
	objs.obj835=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'proximité de sa proie, se rapprochait ',true); layers.text.addObject(objs.obj835);
	objs.obj836=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'rapidement.',true); layers.text.addObject(objs.obj836);
	objs.obj837=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Ils avaient de la lumière, ils évitaient ',true); layers.text.addObject(objs.obj837);
	objs.obj838=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'les obstacles. Surtout ils étaient plus ',true); layers.text.addObject(objs.obj838);
	objs.obj839=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'âgés, plus forts,  alors que lui était ',true); layers.text.addObject(objs.obj839);
	objs.obj840=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'éreinté, les jambes écorchées par les ',true); layers.text.addObject(objs.obj840);
	objs.obj841=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'ronces, au bord de l’asphyxie.',true); layers.text.addObject(objs.obj841);
	objs.obj842=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Les deux groupes gagnaient ',true); layers.text.addObject(objs.obj842);
	objs.obj843=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'insensiblement du terrain. Bientôt ils ',true); layers.text.addObject(objs.obj843);
	objs.obj844=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'se rejoindraient et ce serait l’hallali.',true);
	objs.obj844.addLink(new mse.Link('l’hallali',141,'wiki',wikis.hallali)); layers.text.addObject(objs.obj844);
	objs.obj845=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon obliqua brutalement vers le ',true); layers.text.addObject(objs.obj845);
	objs.obj846=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'nord pour essayer de rejoindre un ',true); layers.text.addObject(objs.obj846);
	objs.obj847=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'bouquet d’arbres denses. Avec un peu ',true); layers.text.addObject(objs.obj847);
	objs.obj848=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de chance, il pourrait les semer. Au ',true); layers.text.addObject(objs.obj848);
	objs.obj849=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pire, il grimperait sur l’un des troncs ',true); layers.text.addObject(objs.obj849);
	objs.obj850=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'centenaires.',true); layers.text.addObject(objs.obj850);
	objs.obj851=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il se précipita dans le bosquet. Les ',true); layers.text.addObject(objs.obj851);
	objs.obj852=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'branches basses fouettèrent son ',true); layers.text.addObject(objs.obj852);
	objs.obj853=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'visage, lui arrachant des larmes.',true); layers.text.addObject(objs.obj853);
	objs.obj854=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Mais il était presque à l’abri : ',true); layers.text.addObject(objs.obj854);
	objs.obj855=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'l’obscurité était totale.',true); layers.text.addObject(objs.obj855);
	objs.obj856=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il ignorait vers quoi il courait mais il ',true); layers.text.addObject(objs.obj856);
	objs.obj857=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’en fichait.',true); layers.text.addObject(objs.obj857);
	objs.obj858=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il accéléra encore et… s’effondra ',true); layers.text.addObject(objs.obj858);
	objs.obj859=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'brutalement, le souffle coupé, une ',true); layers.text.addObject(objs.obj859);
	objs.obj860=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'violente douleur barrant sa poitrine. Il ',true); layers.text.addObject(objs.obj860);
	objs.obj861=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'venait de heurter quelque chose de ',true); layers.text.addObject(objs.obj861);
	objs.obj862=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'plein fouet.',true); layers.text.addObject(objs.obj862);
	objs.obj863=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Abasourdi, Simon fouilla l’obscurité. ',true); layers.text.addObject(objs.obj863);
	objs.obj864=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il entendait ses poursuivants battre les ',true); layers.text.addObject(objs.obj864);
	objs.obj865=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'talus et les fourrés.',true); layers.text.addObject(objs.obj865);
	objs.obj866=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il tâtonna un instant dans son sac.',true); layers.text.addObject(objs.obj866);
	objs.obj867=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Sa torche.',true); layers.text.addObject(objs.obj867);
	objs.obj868=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un faible halo de lumière.',true); layers.text.addObject(objs.obj868);
	objs.obj869=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un grillage.',true); layers.text.addObject(objs.obj869);
	objs.obj955=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj955);
	objs.obj870=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Piégé !',true); layers.text.addObject(objs.obj870);
	objs.obj956=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj956);
	objs.obj871=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il se redressa en grimaçant, ',true); layers.text.addObject(objs.obj871);
	objs.obj872=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’approcha.',true); layers.text.addObject(objs.obj872);
	objs.obj873=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Une dizaine de mètres en contrebas, le ',true); layers.text.addObject(objs.obj873);
	objs.obj874=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'faisceau de sa lampe illumina les ',true); layers.text.addObject(objs.obj874);
	objs.obj875=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'reliefs mangés de rouille d’une ligne ',true); layers.text.addObject(objs.obj875);
	objs.obj876=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de chemin de fer abandonnée.',true); layers.text.addObject(objs.obj876);
	objs.obj877=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'La Petite Ceinture.',true);
	objs.obj877.addLink(new mse.Link('La Petite Ceinture',176,'wiki',wikis.pCeinture)); layers.text.addObject(objs.obj877);
	objs.obj878=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un éclat de voix derrière lui le fit ',true); layers.text.addObject(objs.obj878);
	objs.obj879=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'sursauter.',true); layers.text.addObject(objs.obj879);
	objs.src42=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src41' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src42);
	objs.obj962=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'On le tient !',true);
	objs.src42.addObject(objs.obj962);
	objs.obj881=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon fixa le puits de ténèbres qui ',true); layers.text.addObject(objs.obj881);
	objs.obj882=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’étendait au-delà du grillage.',true); layers.text.addObject(objs.obj882);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj963=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Alors, t’es enfin prêt à recevoir ',true);
	objs.src40.addObject(objs.obj963);
	objs.obj964=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'ta leçon ?',true);
	objs.src40.addObject(objs.obj964);
	objs.obj885=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Kevin s’approcha dans la clarté de la ',true); layers.text.addObject(objs.obj885);
	objs.obj886=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'lune. Il tendit le bras. Un bruit de ',true); layers.text.addObject(objs.obj886);
	objs.obj887=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'ressort. Une lame apparut au bout de ',true); layers.text.addObject(objs.obj887);
	objs.obj888=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'sa main.',true); layers.text.addObject(objs.obj888);
	objs.obj889=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'L’adolescent sentait le sang battre ',true);
	objs.obj889.addLink(new mse.Link('battre',187,'audio',mse.src.getSrc('heart'))); layers.text.addObject(objs.obj889);
	objs.obj890=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'contre ses tempes, l’adrénaline ',true); layers.text.addObject(objs.obj890);
	objs.obj891=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'inonder son corps. Il voulait gagner ',true); layers.text.addObject(objs.obj891);
	objs.obj892=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'du temps pour récupérer. Pour tenter ',true); layers.text.addObject(objs.obj892);
	objs.obj893=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'quelque chose.',true); layers.text.addObject(objs.obj893);
	objs.obj894=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il se retourna face à ses adversaires.',true); layers.text.addObject(objs.obj894);
	objs.src38=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'simon', 'src66' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src38);
	objs.obj965=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Je n’ai fait que défendre Rachel. ',true);
	objs.src38.addObject(objs.obj965);
	objs.obj966=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Vous n’aviez pas le droit de ',true);
	objs.src38.addObject(objs.obj966);
	objs.obj968=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'vous en prendre à elle.',true);
	objs.src38.addObject(objs.obj968);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj969=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'T’avais qu’à pas te mêler de ',true);
	objs.src40.addObject(objs.obj969);
	objs.obj970=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'nos affaires.',true);
	objs.src40.addObject(objs.obj970);
	objs.src38=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'simon', 'src66' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src38);
	objs.obj971=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Quatre contre un, vous n’êtes ',true);
	objs.src38.addObject(objs.obj971);
	objs.obj972=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'que des lâches !',true);
	objs.src38.addObject(objs.obj972);
	objs.obj902=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon avait lancé ça tout en jetant un ',true); layers.text.addObject(objs.obj902);
	objs.obj903=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'bref coup d’œil autour de lui. Il avait ',true); layers.text.addObject(objs.obj903);
	objs.obj904=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'aperçu la grosse pierre au pied du ',true); layers.text.addObject(objs.obj904);
	objs.obj905=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'grillage. Un bon tremplin…',true); layers.text.addObject(objs.obj905);
	objs.obj906=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Kevin fulminait.',true); layers.text.addObject(objs.obj906);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj973=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Amenez-le-moi !',true);
	objs.src40.addObject(objs.obj973);
	objs.obj908=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Les trois autres s’élancèrent. Mais, ',true); layers.text.addObject(objs.obj908);
	objs.obj909=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'juste avant que leurs mains ne se ',true); layers.text.addObject(objs.obj909);
	objs.obj910=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'referment sur lui, il s’était jeté sur le ',true); layers.text.addObject(objs.obj910);
	objs.obj911=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'côté. D’une roulade il avait atteint la ',true); layers.text.addObject(objs.obj911);
	objs.obj912=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pierre. Il se redressa d’un bond, prit ',true); layers.text.addObject(objs.obj912);
	objs.obj913=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'appui sur le rocher et entreprit ',true); layers.text.addObject(objs.obj913);
	objs.obj914=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'l’escalade du grillage.',true); layers.text.addObject(objs.obj914);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj974=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Il va s’échapper ! Faites ',true);
	objs.src40.addObject(objs.obj974);
	objs.obj975=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'quelque chose !',true);
	objs.src40.addObject(objs.obj975);
	objs.src42=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src41' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src42);
	objs.obj976=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Mais… Il ne peut pas aller loin, ',true);
	objs.src42.addObject(objs.obj976);
	objs.obj977=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'il n’y a rien après.',true);
	objs.src42.addObject(objs.obj977);
	objs.obj978=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj978);
	objs.obj982=new FindSimon(); layers.text.addGame(objs.obj982);
	objs.obj980=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj980);
	objs.obj979=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'C’était vrai.',true); layers.text.addObject(objs.obj979);
	objs.obj920=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il n’y avait plus rien. Rien d’autre ',true); layers.text.addObject(objs.obj920);
	objs.obj921=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'qu’un énorme trou de ténèbres.',true); layers.text.addObject(objs.obj921);
	objs.obj922=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Mais il était trop tard pour reculer.',true); layers.text.addObject(objs.obj922);
	objs.obj923=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon s’élança dans le vide.',true); layers.text.addObject(objs.obj923);
	objs.obj958=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj958);
	objs.obj959=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj959);
	objs.obj960=new mse.Text(layers.text,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid29')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"center"},'À SUIVRE...',true); layers.text.addObject(objs.obj960);
	objs.obj961=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj961);
	layers.text.setDefile(1300);
	temp.layerDefile=layers.text;
	pages.Content.addLayer('text',layers.text);
	animes.fouine=new mse.Animation(22,1,true);
	animes.fouine.block=true;
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')],'fillStyle':'rgb(255, 255, 255)'});
	animes.fouine.addObj('obj567',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid30'),mse.coor('cid31')],'size':[mse.coor('cid32'),mse.coor('cid33')]},'src0');
	animes.fouine.addObj('src0',temp.obj);
	animes.fouine.addAnimation('obj567',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]')});
	animes.fouine.addAnimation('src0',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]'),'pos':[[mse.coor('cid30'),mse.coor('cid31')],[mse.coor('cid30'),mse.coor('cid31')],[mse.coor('cid30'),mse.coor('cid31')],[mse.coor('cid30'),mse.coor('cid31')],[mse.coor('cid2'),mse.coor('cid34')],[mse.coor('cid2'),mse.coor('cid34')]],'size':[[mse.coor('cid32'),mse.coor('cid33')],[mse.coor('cid32'),mse.coor('cid33')],[mse.coor('cid32'),mse.coor('cid33')],[mse.coor('cid32'),mse.coor('cid33')],[mse.coor('cid0'),mse.coor('cid35')],[mse.coor('cid0'),mse.coor('cid35')]]});
	animes.titleshow=new mse.Animation(101,1,false);
	animes.titleshow.block=true;
	animes.titleshow.addObj('obj13',objs.obj13);
	animes.titleshow.addAnimation('obj13',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chashow=new mse.Animation(101,1,false);
	animes.chashow.block=true;
	animes.chashow.addObj('obj14',objs.obj14);
	animes.chashow.addAnimation('obj14',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.piege=new mse.Animation(51,1,true);
	animes.piege.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')]},'grillageimg');
	animes.piege.addObj('grillageimg',temp.obj);
	temp.obj=new mse.Text(null,{'pos':[mse.coor('cid46'),mse.coor('cid47')],'size':[mse.coor('cid48'),mse.coor('cid32')],'fillStyle':'rgb(255, 255, 255)','textBaseline':'top','font':'normal '+mse.coor('cid45')+'px Verdana','textAlign':'left'},'Piégé!!!',true);
	animes.piege.addObj('obj587',temp.obj);
	animes.piege.addAnimation('grillageimg',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'opacity':JSON.parse('[0,1,1,1,1,0,0]')});
	animes.piege.addAnimation('obj587',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'fontSize':[mse.coor('cid45'),mse.coor('cid45'),mse.coor('cid49'),mse.coor('cid52'),mse.coor('cid52'),mse.coor('cid52'),mse.coor('cid52')],'pos':[[mse.coor('cid46'),mse.coor('cid47')],[mse.coor('cid46'),mse.coor('cid47')],[mse.coor('cid50'),mse.coor('cid51')],[mse.coor('cid53'),mse.coor('cid54')],[mse.coor('cid53'),mse.coor('cid54')],[mse.coor('cid53'),mse.coor('cid54')],[mse.coor('cid53'),mse.coor('cid54')]],'opacity':JSON.parse('[0,0,0.699999988079,1,1,0,0]')});
	animes.maskAnime=new mse.Animation(89,1,false);
	animes.maskAnime.block=true;
	animes.maskAnime.addObj('obj710',objs.obj710);
	animes.maskAnime.addAnimation('obj710',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.80000001192093,0.80000001192093]')});
	animes.quarantAnime=new mse.Animation(27,1,false);
	animes.quarantAnime.block=true;
	animes.quarantAnime.addObj('obj828',objs.obj828);
	animes.quarantAnime.addAnimation('obj828',{'frame':JSON.parse('[0,13,26,27]'),'fontSize':[mse.coor('cid55'),mse.coor('cid58'),mse.coor('cid55'),mse.coor('cid55')]});
	animes.trentAnime=new mse.Animation(27,1,false);
	animes.trentAnime.block=true;
	animes.trentAnime.addObj('obj833',objs.obj833);
	animes.trentAnime.addAnimation('obj833',{'frame':JSON.parse('[0,13,26,27]'),'fontSize':[mse.coor('cid55'),mse.coor('cid31'),mse.coor('cid55'),mse.coor('cid55')]});
	animes.addGrilleBack=new mse.Animation(2,1,false);
	animes.addGrilleBack.block=true;
	animes.addGrilleBack.addObj('obj957',objs.obj957);
	animes.addGrilleBack.addAnimation('obj957',{'frame':JSON.parse('[0,1,2]'),'opacity':JSON.parse('[0,1,1]')});
	animes.textAnime=new mse.Animation(15,1,false);
	animes.textAnime.block=true;
	animes.textAnime.addObj('obj178',objs.obj178);
	animes.textAnime.addAnimation('obj178',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid55'),mse.coor('cid63'),mse.coor('cid55'),mse.coor('cid55')]});
	animes.trenteAnime=new mse.Animation(15,1,false);
	animes.trenteAnime.block=true;
	animes.trenteAnime.addObj('obj183',objs.obj183);
	animes.trenteAnime.addAnimation('obj183',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid55'),mse.coor('cid63'),mse.coor('cid55'),mse.coor('cid55')]});
	animes.simcour2=new mse.Animation(45,1,true);
	animes.simcour2.block=true;
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid65'),mse.coor('cid3')],'size':[mse.coor('cid66'),mse.coor('cid67')]},'src65',420,414, 0,0,1260,828);
	animes.simcour2.addObj('src65',temp.obj);
	animes.simcour2.addAnimation('src65',{'frame':JSON.parse('[0,4,8,12,16,20,24,28,32,36,40,44,45]'),'spriteSeq':JSON.parse('[3,4,0,1,2,3,4,0,1,2,3,3,3]'),'pos':[[mse.coor('cid65'),mse.coor('cid3')],[mse.coor('cid68'),mse.coor('cid3')],[mse.coor('cid14'),mse.coor('cid3')],[mse.coor('cid45'),mse.coor('cid3')],[mse.coor('cid69'),mse.coor('cid3')],[mse.coor('cid70'),mse.coor('cid3')],[mse.coor('cid41'),mse.coor('cid3')],[mse.coor('cid71'),mse.coor('cid3')],[mse.coor('cid72'),mse.coor('cid3')],[mse.coor('cid73'),mse.coor('cid3')],[mse.coor('cid74'),mse.coor('cid3')],[mse.coor('cid74'),mse.coor('cid3')],[mse.coor('cid74'),mse.coor('cid3')]],'opacity':JSON.parse('[1,1,1,1,1,1,1,1,1,1,0.5,0,0]')});
	var action={};
	var reaction={};
	action.titleshowsc=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.titleshowsc=function(){ 
		animes.titleshow.start(); 
	};
	action.titleshowsc.register(reaction.titleshowsc);
	action.chashowsc=action.titleshowsc;
	reaction.chashowsc=function(){ 
		animes.chashow.start(); 
	};
	action.chashowsc.register(reaction.chashowsc);
	action.transCont=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transCont=function(){ 
		root.transition(pages.Content); 
	};
	action.couvcursor=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.couvcursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.couvcursor.register(reaction.couvcursor);
	action.chacursor=new mse.Script([{src:animes.chashow,type:'end'}]);
	reaction.chacursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.chacursor.register(reaction.chacursor);
	action.contcursor=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.contcursor=function(){ 
		mse.setCursor('default'); 
	};
	action.contcursor.register(reaction.contcursor);
	action.chahidecursor=action.titleshowsc;
	reaction.chahidecursor=function(){ 
		mse.setCursor('default'); 
	};
	action.chahidecursor.register(reaction.chahidecursor);
	action.addTextEffet=action.couvcursor;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.text.objList.length; i++){
	var objCible = layers.text.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.transCha=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.maskShow=action.titleshowsc;
	reaction.maskShow=function(){ 
		animes.maskAnime.start(); 
	};
	action.maskShow.register(reaction.maskShow);
	action.addTransContSc=new mse.Script([{src:animes.titleshow,type:'end'}]);
	reaction.addTransContSc=function(){ 
		action.transCont.register(reaction.transCont); 
	};
	action.addTransContSc.register(reaction.addTransContSc);
	action.showFouine=new mse.Script([{src:objs.obj739,type:'firstShow'}]);
	reaction.showFouine=function(){ 
		animes.fouine.start(); 
	};
	action.showFouine.register(reaction.showFouine);
	action.changeBack=new mse.Script([{src:objs.obj795,type:'firstShow'}]);
	reaction.changeBack=function(){ 
		temp.width=objs.obj708.getWidth();temp.height=objs.obj708.getHeight();temp.boundingbox=imgBoundingInBox('src46',temp.width,temp.height);temp.obj=new mse.Image(objs.obj708.parent,temp.boundingbox,'src46');mse.transition(objs.obj708,temp.obj,25); 
	};
	action.changeBack.register(reaction.changeBack);
	action.start40Anime=new mse.Script([{src:objs.obj828,type:'firstShow'}]);
	reaction.start40Anime=function(){ 
		animes.quarantAnime.start(); 
	};
	action.start40Anime.register(reaction.start40Anime);
	action.start30Anime=new mse.Script([{src:objs.obj833,type:'firstShow'}]);
	reaction.start30Anime=function(){ 
		animes.trentAnime.start(); 
	};
	action.start30Anime.register(reaction.start30Anime);
	action.startPiege=new mse.Script([{src:objs.obj870,type:'firstShow'}]);
	reaction.startPiege=function(){ 
		animes.piege.start(); 
	};
	action.startPiege.register(reaction.startPiege);
	action.startPiegeSon=action.startPiege;
	reaction.startPiegeSon=function(){ 
		mse.src.getSrc('piegeson').play(); 
	};
	action.startPiegeSon.register(reaction.startPiegeSon);
	action.addGrilleBackSc=new mse.Script([{src:animes.piege,type:'end'}]);
	reaction.addGrilleBackSc=function(){ 
		animes.addGrilleBack.start(); 
	};
	action.addGrilleBackSc.register(reaction.addGrilleBackSc);
	action.addCouteauAnimeSc=action.contcursor;
	reaction.addCouteauAnimeSc=function(){ 
		// Couteau
mse.src.addSource('cran', 'images/cran.png', 'img', false);
mse.src.addSource('audCran', 'audios/cran', 'aud', false);

var mx = (mse.coor('cid0')-51)/2, my = (mse.coor('cid1')-350)/2+140;
var manche = new mse.Sprite(null, {}, 'cran', 51,210, 0,0,51,210);
var lame = new mse.Sprite(null, {pos:[-12,-127]}, 'cran', 25,196, 51,0,25,139);
var couteau = new mse.UIObject(null, {});
couteau.count = 0; couteau.angle = -180;
couteau.draw = function(ctx){
    if(this.count == 10) mse.src.getSrc('audCran').play();
    if(this.count >= 10 && this.count <= 14)
    	this.angle = -180 + (this.count-10) * 180/4;
    this.count++;
    
	ctx.save();
	ctx.globalAlpha = this.globalAlpha;
	// Origin of rotation: point on the top of manche
	ctx.translate(mx+24,my+16);
	// Rotation of the lame
	ctx.rotate(this.angle * Math.PI / 180);
	lame.draw(ctx);
	// Draw Manche
	ctx.rotate(-this.angle * Math.PI / 180);
	ctx.translate(-24,-16);
	manche.draw(ctx);
	ctx.restore();
};

animes.couteau=new mse.Animation(36,1,true);
animes.couteau.block=true;
animes.couteau.addObj('couteau',couteau);
animes.couteau.addAnimation('couteau', {
		frame	: [0, 6, 30, 36],
		opacity	: [0, 1, 1,  0]
	});

action.showCouteau=new mse.Script([{src:objs.obj888,type:'firstShow'}]);
reaction.showCouteau=function(){ animes.couteau.start(); };
action.showCouteau.register(reaction.showCouteau) 
	};
	action.addCouteauAnimeSc.register(reaction.addCouteauAnimeSc);
	action.startRatGame=new mse.Script([{src:objs.obj759,type:'firstShow'}]);
	reaction.startRatGame=function(){ 
		games.RatGame.start(); 
	};
	action.startRatGame.register(reaction.startRatGame);
	action.playIntroMusic=action.couvcursor;
	reaction.playIntroMusic=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.playIntroMusic.register(reaction.playIntroMusic);
	action.playKevinSpeak_click=new mse.Script([{src:objs.obj924,type:'click'}]);
	reaction.playKevinSpeak_click=function(){ 
		mse.src.getSrc('kevinSpeak').play(); 
	};
	action.playKevinSpeak_click.register(reaction.playKevinSpeak_click);
	action.playKevinSpeak_show=new mse.Script([{src:objs.obj924,type:'firstShow'}]);
	reaction.playKevinSpeak_show=function(){ 
		mse.src.getSrc('kevinSpeak').play(); 
	};
	action.playKevinSpeak_show.register(reaction.playKevinSpeak_show);
	action.playWoosh=new mse.Script([{src:animes.fouine,type:'start'}]);
	reaction.playWoosh=function(){ 
		mse.src.getSrc('woosh').play(); 
	};
	action.playWoosh.register(reaction.playWoosh);
	action.playIlestla_clic=new mse.Script([{src:objs.obj934,type:'click'}]);
	reaction.playIlestla_clic=function(){ 
		mse.src.getSrc('ilestla').play(); 
	};
	action.playIlestla_clic.register(reaction.playIlestla_clic);
	action.playIlestla_show=new mse.Script([{src:objs.obj934,type:'firstShow'}]);
	reaction.playIlestla_show=function(){ 
		mse.src.getSrc('ilestla').play(); 
	};
	action.playIlestla_show.register(reaction.playIlestla_show);
	action.playRestartRun_clic=new mse.Script([{src:objs.obj954,type:'click'}]);
	reaction.playRestartRun_clic=function(){ 
		mse.src.getSrc('restartrun').play(); 
	};
	action.playRestartRun_clic.register(reaction.playRestartRun_clic);
	action.playRestartRun_show=new mse.Script([{src:objs.obj954,type:'firstShow'}]);
	reaction.playRestartRun_show=function(){ 
		mse.src.getSrc('restartrun').play(); 
	};
	action.playRestartRun_show.register(reaction.playRestartRun_show);
	action.playOnletien_clic=new mse.Script([{src:objs.obj962,type:'click'}]);
	reaction.playOnletien_clic=function(){ 
		mse.src.getSrc('onletien').play(); 
	};
	action.playOnletien_clic.register(reaction.playOnletien_clic);
	action.playOnletien_show=new mse.Script([{src:objs.obj962,type:'firstShow'}]);
	reaction.playOnletien_show=function(){ 
		mse.src.getSrc('onletien').play(); 
	};
	action.playOnletien_show.register(reaction.playOnletien_show);
	action.playIntroEnd=new mse.Script([{src:objs.obj960,type:'firstShow'}]);
	reaction.playIntroEnd=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.playIntroEnd.register(reaction.playIntroEnd);
	action.startSimCour=new mse.Script([{src:objs.obj764,type:'firstShow'}]);
	reaction.startSimCour=function(){ 
		animes.simcour2.start(); 
	};
	action.startSimCour.register(reaction.startSimCour);
	action.startSonNuit=new mse.Script([{src:objs.obj726,type:'firstShow'}]);
	reaction.startSonNuit=function(){ 
		mse.src.getSrc('villenuit').play(); 
	};
	action.startSonNuit.register(reaction.startSonNuit);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);