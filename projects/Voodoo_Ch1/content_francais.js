var RatGame = function() {
	mse.Game.call(this);
	
	var oxid = mse.joinCoor(220);
	var oyid = mse.joinCoor(0);
	var wid = mse.joinCoor(360);
	var hid = mse.joinCoor(600);
	
	this.canvasox = mse.coor(oxid); this.canvasoy = mse.coor(oyid);
	this.width = mse.coor(wid); this.height = mse.coor(hid);
	
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
			ctx.font = "20px Verdana";
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
		// Init NPCs
	    this.npc = new Array();
	    for(var i = 0; i < 4; i++) {
	        this.npc[i] = new NPC(mechants[i], courses[i], dirs[i]);
	    }
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
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":20,"cid4":305,"cid5":46.25,"cid6":342.5,"cid7":35,"cid8":197.5,"cid9":38.75,"cid10":425,"cid11":122.5,"cid12":30,"cid13":190,"cid14":40,"cid15":578.75,"cid16":533.75,"cid17":160,"cid18":27.5,"cid19":601.25,"cid20":543.75,"cid21":13.75,"cid22":400,"cid23":200,"cid24":41.25,"cid25":235,"cid26":108.75,"cid27":32.5,"cid28":177.5,"cid29":61.25,"cid30":320,"cid31":247.5,"cid32":340,"cid33":590,"cid34":230,"cid35":10,"cid36":22.5,"cid37":295,"cid38":250,"cid39":100,"cid40":300,"cid41":409,"cid42":-200,"cid43":1090,"cid44":33,"cid45":109,"cid46":343,"cid47":41,"cid48":248,"cid49":178,"cid50":61,"cid51":344,"cid52":120,"cid53":255,"cid54":263,"cid55":296,"cid56":301,"cid57":298,"cid58":396,"cid59":201,"cid60":-42,"cid61":135,"cid62":1000,"cid63":164,"cid64":106,"cid65":189,"cid66":114,"cid67":221,"cid68":238,"cid69":23,"cid70":329,"cid71":80,"cid72":375}');
initMseConfig();
mse.init();
var pages={};
var layers={};
var objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	mse.configs.srcPath='./Voodoo_Ch1/';
	window.root = new mse.Root('Voodoo_Ch1',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src0','images/src0.png','img',true);
	mse.src.addSource('src1','images/src1.jpeg','img',true);
	mse.src.addSource('src2','images/src2.jpeg','img',true);
	mse.src.addSource('src3','images/src3.jpeg','img',true);
	mse.src.addSource('src4','images/src4.jpeg','img',true);
	mse.src.addSource('src5','audios/src5.ogg','aud',false);
	mse.src.addSource('src6','images/src6.png','img',true);
	mse.src.addSource('src7','images/src7.png','img',true);
	mse.src.addSource('src8','images/src8.png','img',true);
	mse.src.addSource('src9','images/src9.jpeg','img',true);
	games.RatGame = new RatGame();
	mse.src.addSource('src10','images/src10.jpeg','img',true);
	mse.src.addSource('src13','images/src13.jpeg','img',true);
	mse.src.addSource('src17','audios/src17','aud',false);
	mse.src.addSource('src18','audios/src18','aud',false);
	mse.src.addSource('src19','audios/src19','aud',false);
	mse.src.addSource('src20','audios/src20','aud',false);
	mse.src.addSource('src21','audios/src21','aud',false);
	games.FindSimon = new FindSimon();
	wikis.frondaison=new mse.WikiLayer();
	wikis.frondaison.addTextCard();
	wikis.frondaison.textCard.addSection('Frondaison', 'Nom, féminin : \n - Les feuilles et les branches d’un arbre\n - Epoque où les feuilles commencent à pousser');
	wikis.frondaison.textCard.addSection('Synonymes', 'Feuillage, \nRamure, \nBranchage');
	mse.src.addSource('src22','images/src22.jpeg','img',true);
	wikis.hallali=new mse.WikiLayer();
	wikis.hallali.addImage('src22', 'L\\\'hallali du cerf, peint par Courbet en 1867');
	wikis.hallali.addTextCard();
	wikis.hallali.textCard.addSection('Nom masculin', ' - Sonnerie de chasse à courre qui annonce la prise imminente de l’animal, d’où l’expression : Sonner l’hallali : annoncer la défaite de quelqu’un.\n - Moment où l’animal est pris\n - Par extension : débâcle, défaite');
	wikis.hallali.addTextCard();
	wikis.hallali.textCard.addSection('L’hallali', 'Interjection : \nCri du chasseur qui attrape du gibier lors d’une chasse à courre.');
	mse.src.addSource('src23','images/src23.jpeg','img',true);
	mse.src.addSource('src25','images/src25.jpeg','img',true);
	wikis.Noctambule=new mse.WikiLayer();
	wikis.Noctambule.addTextCard();
	wikis.Noctambule.textCard.addSection('Nyctalope', 'A ne pas confondre avec nyctalope : un adjectif qui désigne celui qui a la faculté de voir dans la pénombre, comme les chats');
	wikis.Noctambule.textCard.addSection('A moins d’inventer', ' - Nyctambule : qui recherche les fétards égarés la nuit\n - Noctalope : qui travaille la nuit sans avoir besoin de lumière');
	wikis.Noctambule.addTextCard();
	wikis.Noctambule.textCard.addSection('Noctambule', 'Nom masculin ou féminin : \n - personne ou animal qui a l’habitude de se promener la nuit.\n - personne qui aime faire la fête la nuit.\n - Par extension : personne qui est en activité la nuit');
	mse.src.addSource('src26','images/src26.jpeg','img',true);
	mse.src.addSource('src27','images/src27.jpeg','img',true);
	mse.src.addSource('src28','images/src28.jpeg','img',true);
	wikis.pCeinture=new mse.WikiLayer();
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('La Petite Ceinture', 'La Petite Ceinture est une ancienne ligne de chemin de fer longue de 32 km qui faisait le tour de Paris.\nElle fut terminée en 1869 et destinée au trafic de marchandises et de voyageurs. Concurrencée par le métro, elle est définitivement fermée au trafic des voyageurs en 1985. Le trafic de marchandise est totalement arrêté au début des années 1990.');
	wikis.pCeinture.textCard.addLink('Lien Wikipédia', 'http:\/\/fr.wikipedia.org\/wiki\/Ligne_de_Petite_Ceinture');
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('Biodiversité', 'Elle est considérée comme une réserve de biodiversité. On peut y observer de nombreuses variétés d’arbres, de plantes et la plus grande colonie de chauve-souris de l’espèce pipistrelle d’Ile de France. \nLa ville de Paris y aménage des parcours pédagogiques, proposant ainsi un nouveau type de promenade nature à Paris.');
	wikis.pCeinture.textCard.addLink('Lien Mairie de Paris', 'http:\/\/www.paris.fr\/loisirs\/se-promener-a-paris\/balades-au-vert\/decouvrir-les-richesses-de-la-petite-ceinture\/rub_9660_stand_53584_port_23803');
	wikis.pCeinture.addImage('src26', 'Vue des voies de la Petite Ceinture dans le 13e arrondissement');
	wikis.pCeinture.addImage('src27', 'La Petite Ceinture traverse le Parc Montsouris');
	wikis.pCeinture.addImage('src28', 'La gare de Charonne, aujourd\\\'hui café La Flèche d\\\'Or');
	wikis.albinos=new mse.WikiLayer();
	wikis.albinos.addImage('src25', 'Salif Keïta');
	wikis.albinos.addImage('src23', 'Rat albinos');
	wikis.albinos.addTextCard();
	wikis.albinos.textCard.addSection('Les célèbres', 'Il existe des albinos célèbres parmi lesquels Salif Keïta, chanteur et musicien malien. Il a obtenu une Victoire de la musique en 2010 pour son album « La Différence »');
	wikis.albinos.textCard.addLink('Lien site officiel  Salif Keïta', 'http:\/\/salif-keita.artiste.universalmusic.fr\/');
	wikis.albinos.addTextCard();
	wikis.albinos.textCard.addSection('Les albinos', 'Les albinos ont une vision déficiente et sont sujets à des cancers de la peau s\'ils ne sont pas protégés du soleil. C’est une maladie héréditaire (qui se transmet de génération en génération). Il y a environ 1 cas pour 20.000 naissances dans le monde.');
	wikis.albinos.addTextCard();
	wikis.albinos.textCard.addSection('Albinos', 'Adjectif invariable :\nQui est affecté d\'albinisme.');
	wikis.albinos.textCard.addSection('Albinisme', 'nom masculin : \nmaladie génétique qui se caractérise par une absence du pigment destiné à colorer la peau, les poils, les cheveux ainsi que par des yeux rouges. Elle affecte les humains ou les animaux.');
	wikis.albinos.textCard.addLink('Lien Wikipédia', 'http:\/\/fr.wikipedia.org\/wiki\/Albinisme ');
	mse.src.addSource('grillageimg','images/src16.png','img',true);
	wikis.Cyclope=new mse.WikiLayer();
	wikis.Cyclope.addImage('src9', 'Cyclope, super-héros des X-Men');
	wikis.Cyclope.addImage('src8', 'Polyphème, fils de Poséïdon');
	wikis.Cyclope.addTextCard();
	wikis.Cyclope.textCard.addSection('Un Cyclope chez les X-Men', 'Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence. Il devient un des leaders des X-Men.');
	wikis.Cyclope.textCard.addLink('Lien', 'http:\/\/fr.wikipedia.org\/wiki\/Cyclope_%28comics%29');
	wikis.Cyclope.addTextCard();
	wikis.Cyclope.textCard.addSection('Cyclope', 'Nom, masculin : Les cyclopes sont des créatures fantastiques de la mythologie grecque. Ce sont des géants qui ne possèdent qu’un seul œil au milieu du front. Ils étaient soit forgerons, bâtisseurs ou pasteurs.');
	wikis.Cyclope.textCard.addLink('Lien', 'http:\/\/fr.wikipedia.org\/wiki\/Cyclope');
	pages.Couverture=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj5=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid3')+"px Times","textAlign":"left"},'src3'); layers.back.addObject(objs.obj5);
	pages.Couverture.addLayer('back',layers.back);
	layers.Couverturedefault=new mse.Layer(pages.Couverture,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj2=new mse.Text(layers.Couverturedefault,{"size":[mse.coor('cid4'),mse.coor('cid5')],"pos":[mse.coor('cid6'),mse.coor('cid5')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid7')+"px Verdanda","textAlign":"left","textBaseline":"top"},'Voodoo Connection',true); layers.Couverturedefault.addObject(objs.obj2);
	objs.obj3=new mse.Text(layers.Couverturedefault,{"size":[mse.coor('cid8'),mse.coor('cid9')],"pos":[mse.coor('cid10'),mse.coor('cid11')],"fillStyle":"rgb(81, 61, 29)","globalAlpha":1,"font":"normal "+mse.coor('cid12')+"px Verdanda","textAlign":"left","textBaseline":"top"},'Chris Debien',true); layers.Couverturedefault.addObject(objs.obj3);
	pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);
	pages.Aide=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Aidedefault=new mse.Layer(pages.Aide,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj6=new mse.Image(layers.Aidedefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid3')+"px Times","textAlign":"left"},'src4'); layers.Aidedefault.addObject(objs.obj6);
	pages.Aide.addLayer('Aidedefault',layers.Aidedefault);
	layers.button=new mse.Layer(pages.Aide,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj566=new mse.Image(layers.button,{"size":[mse.coor('cid13'),mse.coor('cid14')],"pos":[mse.coor('cid15'),mse.coor('cid16')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid3')+"px Times"},'src7'); layers.button.addObject(objs.obj566);
	pages.Aide.addLayer('button',layers.button);
	layers.text=new mse.Layer(pages.Aide,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj9=new mse.Text(layers.text,{"size":[mse.coor('cid17'),mse.coor('cid18')],"pos":[mse.coor('cid19'),mse.coor('cid20')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid21')+"px Verdana","textAlign":"left","textBaseline":"top"},'Commencer l\'histoire',true); layers.text.addObject(objs.obj9);
	pages.Aide.addLayer('text',layers.text);
	pages.Chapitre=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj11=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src2'); layers.Chapitredefault.addObject(objs.obj11);
	objs.obj12=new mse.Mask(layers.Chapitredefault,{"size":[mse.coor('cid22'),mse.coor('cid1')],"pos":[mse.coor('cid23'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.80,"font":"normal "+mse.coor('cid3')+"px Times"}); layers.Chapitredefault.addObject(objs.obj12);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.Text=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj13=new mse.Text(layers.Text,{"size":[mse.coor('cid6'),mse.coor('cid24')],"pos":[mse.coor('cid25'),mse.coor('cid26')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid27')+"px Verdana","textAlign":"left","textBaseline":"top"},'CHASSE A L\'HOMME',true); layers.Text.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.Text,{"size":[mse.coor('cid28'),mse.coor('cid29')],"pos":[mse.coor('cid30'),mse.coor('cid31')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid27')+"px Verdana","textAlign":"left","textBaseline":"top"},'Chapitre I',true); layers.Text.addObject(objs.obj14);
	pages.Chapitre.addLayer('Text',layers.Text);
	pages.Content=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj15=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src2'); layers.Contentdefault.addObject(objs.obj15);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.mask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj16=new mse.Mask(layers.mask,{"size":[mse.coor('cid22'),mse.coor('cid1')],"pos":[mse.coor('cid23'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.80,"font":"normal "+mse.coor('cid3')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj16);
	pages.Content.addLayer('mask',layers.mask);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid32'),mse.coor('cid33')],"pos":[mse.coor('cid34'),mse.coor('cid35')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid36')+"px Verdana","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid12')},null);
	objs.obj2295=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2295);
	objs.obj2296=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2296);
	objs.obj2297=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2297);
	objs.obj2298=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2298);
	objs.obj2299=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils étaient là. ',true); layers.content.addObject(objs.obj2299);
	objs.obj2300=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'À moins de cent mètres ',true); layers.content.addObject(objs.obj2300);
	objs.obj2301=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'derrière Simon. Bien décidés ',true); layers.content.addObject(objs.obj2301);
	objs.obj2302=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'à lui faire payer l’affront ',true); layers.content.addObject(objs.obj2302);
	objs.obj2303=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’ils avaient subi.',true); layers.content.addObject(objs.obj2303);
	objs.obj2304=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La Meute. ',true); layers.content.addObject(objs.obj2304);
	objs.obj2305=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Quatre adolescents qui ',true); layers.content.addObject(objs.obj2305);
	objs.obj2306=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisaient régner leur loi au ',true); layers.content.addObject(objs.obj2306);
	objs.obj2307=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sein du foyer.',true); layers.content.addObject(objs.obj2307);
	objs.obj2308=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Recroquevillé dans la ',true); layers.content.addObject(objs.obj2308);
	objs.obj2309=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pénombre d’un porche, ',true); layers.content.addObject(objs.obj2309);
	objs.obj2310=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'L’adolescent contemplait le ',true); layers.content.addObject(objs.obj2310);
	objs.obj2311=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballet des lampes torches qui ',true); layers.content.addObject(objs.obj2311);
	objs.obj2312=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déchiraient la nuit. Des ',true); layers.content.addObject(objs.obj2312);
	objs.obj2313=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'yeux, scrutant le moindre ',true); layers.content.addObject(objs.obj2313);
	objs.obj2314=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'recoin, repoussant les ',true); layers.content.addObject(objs.obj2314);
	objs.obj2315=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres de leurs lueurs ',true); layers.content.addObject(objs.obj2315);
	objs.obj2316=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'cyclopes. ',true);
	objs.obj2316.addLink(new mse.Link('cyclopes',21,'wiki',wikis.Cyclope)); layers.content.addObject(objs.obj2316);
	objs.obj2317=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt, ils seraient sur lui. ',true); layers.content.addObject(objs.obj2317);
	objs.obj2318=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon frissonna en songeant ',true); layers.content.addObject(objs.obj2318);
	objs.obj2319=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'à ce qui allait lui arriver. Il ',true); layers.content.addObject(objs.obj2319);
	objs.obj2320=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'savait que Kevin, leur chef, ',true); layers.content.addObject(objs.obj2320);
	objs.obj2321=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sans pitié…  ',true); layers.content.addObject(objs.obj2321);
	objs.obj2322=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il fallait qu’il leur ',true); layers.content.addObject(objs.obj2322);
	objs.obj2323=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'échappe.Absolument. Et tant ',true); layers.content.addObject(objs.obj2323);
	objs.obj2324=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pis s’il ne pouvait jamais ',true); layers.content.addObject(objs.obj2324);
	objs.obj2325=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'retourner au foyer.',true); layers.content.addObject(objs.obj2325);
	objs.obj2326=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les pas se rapprochaient, de ',true); layers.content.addObject(objs.obj2326);
	objs.obj2327=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus en plus. Il pouvait ',true); layers.content.addObject(objs.obj2327);
	objs.obj2328=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'entendre leurs voix à ',true); layers.content.addObject(objs.obj2328);
	objs.obj2329=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'présent.',true); layers.content.addObject(objs.obj2329);
	objs.obj2330=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2330);
	objs.obj2331=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Trouvez-moi ce sale petit ',true);
	objs.obj2330.addObject(objs.obj2331);
	objs.obj2332=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'rat ! Il va comprendre ',true);
	objs.obj2330.addObject(objs.obj2332);
	objs.obj2337=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’on ne peut pas se ',true);
	objs.obj2330.addObject(objs.obj2337);
	objs.obj2338=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'moquer de nous comme ça !',true);
	objs.obj2330.addObject(objs.obj2338);
	objs.obj2339=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj2339);
	objs.obj2340=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Ouaip, on va lui faire sa ',true);
	objs.obj2339.addObject(objs.obj2340);
	objs.obj2341=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'fête !',true);
	objs.obj2339.addObject(objs.obj2341);
	objs.obj2342=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ca, c’était « La Fouine ».',true); layers.content.addObject(objs.obj2342);
	objs.obj2343=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dix sept ans, un ',true); layers.content.addObject(objs.obj2343);
	objs.obj2344=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mètrequatre-vingt, ',true); layers.content.addObject(objs.obj2344);
	objs.obj2345=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'soixante-quinze kilos de ',true); layers.content.addObject(objs.obj2345);
	objs.obj2346=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'violence pure. Une véritable ',true); layers.content.addObject(objs.obj2346);
	objs.obj2347=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bombe ambulante qui ne ',true); layers.content.addObject(objs.obj2347);
	objs.obj2348=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'demandait qu’à exploser. ',true); layers.content.addObject(objs.obj2348);
	objs.obj2349=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon se pencha un instant ',true); layers.content.addObject(objs.obj2349);
	objs.obj2350=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'hors de son abri pour ',true); layers.content.addObject(objs.obj2350);
	objs.obj2351=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'évaluer ses chances de leur ',true); layers.content.addObject(objs.obj2351);
	objs.obj2352=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'échapper. ',true); layers.content.addObject(objs.obj2352);
	objs.obj2353=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Proche du zéro absolu s’il ne ',true); layers.content.addObject(objs.obj2353);
	objs.obj2354=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bougeait pas de sa cachette. ',true); layers.content.addObject(objs.obj2354);
	objs.obj2355=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un peu plus s’il tentait une ',true); layers.content.addObject(objs.obj2355);
	objs.obj2356=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sortie. À condition de tomber ',true); layers.content.addObject(objs.obj2356);
	objs.obj2357=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur quelqu’un, un adulte qui ',true); layers.content.addObject(objs.obj2357);
	objs.obj2358=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'saurait éloigner ses ',true); layers.content.addObject(objs.obj2358);
	objs.obj2359=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants. ',true); layers.content.addObject(objs.obj2359);
	objs.obj2360=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj2360);
	objs.obj2361=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Tu es prêt ? chuchota-t-il ',true);
	objs.obj2360.addObject(objs.obj2361);
	objs.obj2362=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'à Dark.',true);
	objs.obj2360.addObject(objs.obj2362);
	objs.obj2363=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dark. Vador. Son rat albinos. ',true);
	objs.obj2363.addLink(new mse.Link('albinos',56,'wiki',wikis.albinos)); layers.content.addObject(objs.obj2363);
	objs.obj2364=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Son plus fidèle compagnon ',true); layers.content.addObject(objs.obj2364);
	objs.obj2365=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'depuis un an. ',true); layers.content.addObject(objs.obj2365);
	objs.obj2366=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le seul en vérité. ',true); layers.content.addObject(objs.obj2366);
	objs.obj2367=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon repoussa l’élan de ',true); layers.content.addObject(objs.obj2367);
	objs.obj2368=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mélancolie qui menaçait de ',true); layers.content.addObject(objs.obj2368);
	objs.obj2369=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le submerger et enfouit Dark ',true); layers.content.addObject(objs.obj2369);
	objs.obj2370=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au fond de son sac.',true); layers.content.addObject(objs.obj2370);
	objs.obj2371=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2371);
	objs.obj2372=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il passa les lanières autour ',true); layers.content.addObject(objs.obj2372);
	objs.obj2373=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de ses épaules et s’élança.',true); layers.content.addObject(objs.obj2373);
	objs.obj2374=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas de réaction.',true); layers.content.addObject(objs.obj2374);
	objs.obj2375=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il s’était mis à courir comme ',true); layers.content.addObject(objs.obj2375);
	objs.obj2376=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'si sa vie en dépendait. ',true); layers.content.addObject(objs.obj2376);
	objs.obj2377=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Si la Meute lui ',true); layers.content.addObject(objs.obj2377);
	objs.obj2378=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tombaitdessus, il était bon ',true); layers.content.addObject(objs.obj2378);
	objs.obj2379=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pour un passage à tabac ',true); layers.content.addObject(objs.obj2379);
	objs.obj2380=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans les règles de l’art. Voilà ',true); layers.content.addObject(objs.obj2380);
	objs.obj2381=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ce qui se passe lorsque l’on ',true); layers.content.addObject(objs.obj2381);
	objs.obj2382=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'refuse de soumettre aux ',true); layers.content.addObject(objs.obj2382);
	objs.obj2383=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus forts.Simon évitait de ',true); layers.content.addObject(objs.obj2383);
	objs.obj2384=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'regarder dans leur direction, ',true); layers.content.addObject(objs.obj2384);
	objs.obj2385=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'les yeux rivés sur les ',true); layers.content.addObject(objs.obj2385);
	objs.obj2386=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'frondaisons du Parc ',true);
	objs.obj2386.addLink(new mse.Link('frondaisons',79,'wiki',wikis.frondaison)); layers.content.addObject(objs.obj2386);
	objs.obj2387=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Montsouris. Des arbres, de ',true); layers.content.addObject(objs.obj2387);
	objs.obj2388=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la pénombre et des milliards ',true); layers.content.addObject(objs.obj2388);
	objs.obj2389=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de recoins où il pourrait se ',true); layers.content.addObject(objs.obj2389);
	objs.obj2390=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dissimuler en attendant ',true); layers.content.addObject(objs.obj2390);
	objs.obj2391=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’aube. ',true); layers.content.addObject(objs.obj2391);
	objs.obj2392=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’il atteignait le jardin, il ',true); layers.content.addObject(objs.obj2392);
	objs.obj2393=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sauvé.',true); layers.content.addObject(objs.obj2393);
	objs.obj2394=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, dans sa précipitation, il ',true); layers.content.addObject(objs.obj2394);
	objs.obj2395=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'butta contre le trottoir. Le ',true); layers.content.addObject(objs.obj2395);
	objs.obj2396=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'béton lui arracha une ',true); layers.content.addObject(objs.obj2396);
	objs.obj2397=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plainte. Un cri minuscule.',true); layers.content.addObject(objs.obj2397);
	objs.obj2398=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2398);
	objs.obj2399=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2399);
	objs.obj2400=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il est là !',true);
	objs.obj2399.addObject(objs.obj2400);
	objs.obj2402=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2402);
	objs.obj2403=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas assez minuscule, ',true); layers.content.addObject(objs.obj2403);
	objs.obj2404=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visiblement.',true); layers.content.addObject(objs.obj2404);
	objs.obj2405=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon détala tandis que les ',true); layers.content.addObject(objs.obj2405);
	objs.obj2406=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisceaux accrochaient sa ',true); layers.content.addObject(objs.obj2406);
	objs.obj2407=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'silhouette. ',true); layers.content.addObject(objs.obj2407);
	objs.obj2408=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2408);
	objs.obj2409=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2409);
	objs.obj2410=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2410);
	objs.obj2411=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj2411);
	objs.obj2412=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2412);
	objs.obj2413=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Choppez-le ! Faut qu’il ',true);
	objs.obj2412.addObject(objs.obj2413);
	objs.obj2414=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'comprenne !',true);
	objs.obj2412.addObject(objs.obj2414);
	objs.obj2415=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Que je comprenne quoi ? ',true); layers.content.addObject(objs.obj2415);
	objs.obj2416=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Qu’il faut se laisser faire ? ',true); layers.content.addObject(objs.obj2416);
	objs.obj2417=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas question !',true); layers.content.addObject(objs.obj2417);
	objs.obj2418=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il accéléra. ',true);
	objs.obj2418.addLink(new mse.Link('accéléra',107,'audio',mse.src.getSrc('src17'))); layers.content.addObject(objs.obj2418);
	objs.obj2419=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il essayait d’oublier que ses ',true); layers.content.addObject(objs.obj2419);
	objs.obj2420=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poumons le brûlaient, qu’il ',true); layers.content.addObject(objs.obj2420);
	objs.obj2421=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'était épuisé par cette ',true); layers.content.addObject(objs.obj2421);
	objs.obj2422=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuite qui durait depuis ',true); layers.content.addObject(objs.obj2422);
	objs.obj2423=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'des heures, et surtout que la ',true); layers.content.addObject(objs.obj2423);
	objs.obj2424=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peur menaçait de le ',true); layers.content.addObject(objs.obj2424);
	objs.obj2425=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'paralyser à tout instant. Il ',true); layers.content.addObject(objs.obj2425);
	objs.obj2426=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'traversa le boulevard, ',true); layers.content.addObject(objs.obj2426);
	objs.obj2427=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déclenchant le klaxon ',true);
	objs.obj2427.addLink(new mse.Link('klaxon',116,'audio',mse.src.getSrc('src18'))); layers.content.addObject(objs.obj2427);
	objs.obj2428=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'furieux d’un noctambule ',true);
	objs.obj2428.addLink(new mse.Link('noctambule',117,'wiki',wikis.Noctambule)); layers.content.addObject(objs.obj2428);
	objs.obj2429=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'égaré. Puis il s’engouffra à ',true); layers.content.addObject(objs.obj2429);
	objs.obj2430=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’abri des arbres. Son sac ',true); layers.content.addObject(objs.obj2430);
	objs.obj2431=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballotait sur ses épaules et il ',true); layers.content.addObject(objs.obj2431);
	objs.obj2432=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pensa au pauvre Dark. ',true); layers.content.addObject(objs.obj2432);
	objs.obj2433=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sans réfléchir, il pénétra ',true); layers.content.addObject(objs.obj2433);
	objs.obj2434=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans une petite allée. Il ',true); layers.content.addObject(objs.obj2434);
	objs.obj2435=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dépassa les angles du ',true); layers.content.addObject(objs.obj2435);
	objs.obj2436=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pavillon météo qui s’élevait ',true); layers.content.addObject(objs.obj2436);
	objs.obj2437=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans la pénombre, puis il ',true); layers.content.addObject(objs.obj2437);
	objs.obj2438=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ralentit sa course. ',true); layers.content.addObject(objs.obj2438);
	objs.obj2439=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas un bruit.',true); layers.content.addObject(objs.obj2439);
	objs.obj2440=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Rien d’autre que le vent ',true); layers.content.addObject(objs.obj2440);
	objs.obj2441=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans les feuilles. ',true); layers.content.addObject(objs.obj2441);
	objs.obj2442=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Où étaient-ils passés ?',true); layers.content.addObject(objs.obj2442);
	objs.obj2443=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon s’arrêta, s’accroupit ',true); layers.content.addObject(objs.obj2443);
	objs.obj2444=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'derrière un banc scarifié de ',true); layers.content.addObject(objs.obj2444);
	objs.obj2445=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'graffitis. ',true); layers.content.addObject(objs.obj2445);
	objs.obj2446=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Là ! Sur sa gauche. ',true); layers.content.addObject(objs.obj2446);
	objs.obj2447=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2447);
	objs.obj2448=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2448);
	objs.obj2449=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2449);
	objs.obj2450=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj2450);
	objs.obj2451=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2451);
	objs.obj2452=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2452);
	objs.obj2453=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj2453);
	objs.obj2454=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il avait reconnu la démarche ',true); layers.content.addObject(objs.obj2454);
	objs.obj2455=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chaloupée de la Fouine, les ',true); layers.content.addObject(objs.obj2455);
	objs.obj2456=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pas lourds de l’Ours – seize ',true);
	objs.obj2456.addLink(new mse.Link('pas',145,'audio',mse.src.getSrc('src19'))); layers.content.addObject(objs.obj2456);
	objs.obj2626=new mse.Image(layers.content,{"size":[mse.coor('cid2'),mse.coor('cid2')],"pos":[mse.coor('cid2'),mse.coor('cid3')]},'src13');
	objs.obj2626.activateZoom(); layers.content.addObject(objs.obj2626);
	objs.obj2457=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ans, un QI inversement ',true); layers.content.addObject(objs.obj2457);
	objs.obj2458=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'proportionnel à sa force - à ',true); layers.content.addObject(objs.obj2458);
	objs.obj2459=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ses côtés. Les deux autres ',true); layers.content.addObject(objs.obj2459);
	objs.obj2460=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'suivaient la ligne de ',true); layers.content.addObject(objs.obj2460);
	objs.obj2461=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tramway qui longeait le parc, ',true); layers.content.addObject(objs.obj2461);
	objs.obj2462=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur sa droite.',true); layers.content.addObject(objs.obj2462);
	objs.obj2463=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le groupe s’était séparé en ',true); layers.content.addObject(objs.obj2463);
	objs.obj2464=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'deux et tentait de ',true); layers.content.addObject(objs.obj2464);
	objs.obj2465=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’encercler.',true); layers.content.addObject(objs.obj2465);
	objs.obj2466=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon réfléchit à toute ',true); layers.content.addObject(objs.obj2466);
	objs.obj2467=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'allure. ',true); layers.content.addObject(objs.obj2467);
	objs.obj2468=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le RER ! ',true);
	objs.obj2468.addLink(new mse.Link('RER',158,'audio',mse.src.getSrc('src20'))); layers.content.addObject(objs.obj2468);
	objs.obj2469=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La station ne devait être ',true); layers.content.addObject(objs.obj2469);
	objs.obj2470=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’à quelques dizaines de ',true); layers.content.addObject(objs.obj2470);
	objs.obj2471=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mètres devant lui et, même ',true); layers.content.addObject(objs.obj2471);
	objs.obj2472=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'en ces heures tardives, il y ',true); layers.content.addObject(objs.obj2472);
	objs.obj2473=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'aurait sans doute un peu de ',true); layers.content.addObject(objs.obj2473);
	objs.obj2474=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'monde. ',true); layers.content.addObject(objs.obj2474);
	objs.obj2475=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il reprit sa progression, ',true); layers.content.addObject(objs.obj2475);
	objs.obj2476=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lentement, veillant à rester ',true); layers.content.addObject(objs.obj2476);
	objs.obj2477=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'invisible. ',true); layers.content.addObject(objs.obj2477);
	objs.obj2478=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Plus que cinquante mètres.Il ',true); layers.content.addObject(objs.obj2478);
	objs.obj2479=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'entendait déjà le crissement ',true); layers.content.addObject(objs.obj2479);
	objs.obj2480=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'des rames sur les rails.',true); layers.content.addObject(objs.obj2480);
	objs.obj2481=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2481);
	objs.obj2482=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' Quarante.',true); layers.content.addObject(objs.obj2482);
	objs.obj2483=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2483);
	objs.obj2484=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2484);
	objs.obj2485=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Là sur le pont ! Il essaye ',true);
	objs.obj2484.addObject(objs.obj2485);
	objs.obj2486=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de rejoindre la gare !',true);
	objs.obj2484.addObject(objs.obj2486);
	objs.obj2487=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj2487);
	objs.obj2488=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Merde ! lâcha Simon en ',true);
	objs.obj2487.addObject(objs.obj2488);
	objs.obj2489=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'reprenant sa course.',true);
	objs.obj2487.addObject(objs.obj2489);
	objs.obj2490=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2490);
	objs.obj2491=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' Trente.',true); layers.content.addObject(objs.obj2491);
	objs.obj2492=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2492);
	objs.obj2493=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' Mais la meute, galvanisée ',true); layers.content.addObject(objs.obj2493);
	objs.obj2494=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'par la proximité de sa proie, ',true); layers.content.addObject(objs.obj2494);
	objs.obj2495=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'se rapprochait rapidement. ',true); layers.content.addObject(objs.obj2495);
	objs.obj2496=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils avaient de la lumière, ils ',true); layers.content.addObject(objs.obj2496);
	objs.obj2497=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'évitaient les obstacles. ',true); layers.content.addObject(objs.obj2497);
	objs.obj2498=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Surtout ils étaient plus âgés, ',true); layers.content.addObject(objs.obj2498);
	objs.obj2499=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus forts alors que lui était ',true); layers.content.addObject(objs.obj2499);
	objs.obj2500=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'éreinté, les jambes ',true); layers.content.addObject(objs.obj2500);
	objs.obj2501=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'écorchées par les ronces, au ',true); layers.content.addObject(objs.obj2501);
	objs.obj2502=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bord de l’asphyxie.',true); layers.content.addObject(objs.obj2502);
	objs.obj2503=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les deux groupes gagnaient ',true); layers.content.addObject(objs.obj2503);
	objs.obj2504=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'insensiblement du terrain. ',true); layers.content.addObject(objs.obj2504);
	objs.obj2505=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt ils se rejoindraient et ',true); layers.content.addObject(objs.obj2505);
	objs.obj2506=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ce serait l’hallali.Simon ',true);
	objs.obj2506.addLink(new mse.Link('l’hallali',192,'wiki',wikis.hallali)); layers.content.addObject(objs.obj2506);
	objs.obj2507=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'obliqua brutalement vers le ',true); layers.content.addObject(objs.obj2507);
	objs.obj2508=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'nord pour essayer de ',true); layers.content.addObject(objs.obj2508);
	objs.obj2509=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rejoindre un bouquet ',true); layers.content.addObject(objs.obj2509);
	objs.obj2510=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'d’arbres denses. Avec un ',true); layers.content.addObject(objs.obj2510);
	objs.obj2511=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peu de chance, il pourrait les ',true); layers.content.addObject(objs.obj2511);
	objs.obj2512=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'semer. Au pire, il grimperait ',true); layers.content.addObject(objs.obj2512);
	objs.obj2513=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur l’un des troncs ',true); layers.content.addObject(objs.obj2513);
	objs.obj2514=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'centenaires. ',true); layers.content.addObject(objs.obj2514);
	objs.obj2515=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se précipita dans le ',true); layers.content.addObject(objs.obj2515);
	objs.obj2516=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bosquet. Les branches ',true); layers.content.addObject(objs.obj2516);
	objs.obj2517=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'basses fouettèrent son ',true); layers.content.addObject(objs.obj2517);
	objs.obj2518=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visage, lui arrachant des ',true); layers.content.addObject(objs.obj2518);
	objs.obj2519=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'larmes. ',true); layers.content.addObject(objs.obj2519);
	objs.obj2520=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était presqu’à l’abri : ',true); layers.content.addObject(objs.obj2520);
	objs.obj2521=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité était totale. ',true); layers.content.addObject(objs.obj2521);
	objs.obj2522=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il ignorait vers quoi il ',true); layers.content.addObject(objs.obj2522);
	objs.obj2523=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'courrait mais il s’en fichait. Il ',true); layers.content.addObject(objs.obj2523);
	objs.obj2524=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'accéléra encore et…',true); layers.content.addObject(objs.obj2524);
	objs.obj2525=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’effondra brutalement, le ',true); layers.content.addObject(objs.obj2525);
	objs.obj2526=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'souffle coupé, une violente ',true); layers.content.addObject(objs.obj2526);
	objs.obj2527=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'douleur barrant sa poitrine. ',true); layers.content.addObject(objs.obj2527);
	objs.obj2528=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il venait de heurter quelque ',true); layers.content.addObject(objs.obj2528);
	objs.obj2529=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chose de plein fouet. ',true); layers.content.addObject(objs.obj2529);
	objs.obj2530=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Abasourdi, Simon fouilla ',true); layers.content.addObject(objs.obj2530);
	objs.obj2531=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité. Il entendait ses ',true); layers.content.addObject(objs.obj2531);
	objs.obj2532=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants battre les talus ',true); layers.content.addObject(objs.obj2532);
	objs.obj2533=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et les fourrés. ',true); layers.content.addObject(objs.obj2533);
	objs.obj2534=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il tâtonna un instant dans ',true); layers.content.addObject(objs.obj2534);
	objs.obj2535=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'son sac. ',true); layers.content.addObject(objs.obj2535);
	objs.obj2536=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sa torche.',true); layers.content.addObject(objs.obj2536);
	objs.obj2537=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un faible halo de lumière.',true); layers.content.addObject(objs.obj2537);
	objs.obj2538=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un grillage. ',true); layers.content.addObject(objs.obj2538);
	objs.obj2539=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2539);
	objs.obj2540=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' Piégé !',true); layers.content.addObject(objs.obj2540);
	objs.obj2541=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2541);
	objs.obj2542=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' Il se redressa en grimaçant, ',true); layers.content.addObject(objs.obj2542);
	objs.obj2543=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'s’approcha.  ',true); layers.content.addObject(objs.obj2543);
	objs.obj2544=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Une dizaine de mètres en ',true); layers.content.addObject(objs.obj2544);
	objs.obj2545=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'contrebas, le faisceau de sa ',true); layers.content.addObject(objs.obj2545);
	objs.obj2546=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lampe illumina les reliefs ',true); layers.content.addObject(objs.obj2546);
	objs.obj2547=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mangés de rouille d’une ',true); layers.content.addObject(objs.obj2547);
	objs.obj2548=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ligne de chemin de fer ',true); layers.content.addObject(objs.obj2548);
	objs.obj2549=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'abandonnée.',true); layers.content.addObject(objs.obj2549);
	objs.obj2550=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La Petite Ceinture. ',true);
	objs.obj2550.addLink(new mse.Link('La Petite Ceinture',236,'wiki',wikis.pCeinture)); layers.content.addObject(objs.obj2550);
	objs.obj2551=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un éclat de voix derrière lui ',true); layers.content.addObject(objs.obj2551);
	objs.obj2552=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le fit sursauter.',true); layers.content.addObject(objs.obj2552);
	objs.obj2553=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'ours', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj2553);
	objs.obj2554=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'On le tient !',true);
	objs.obj2553.addObject(objs.obj2554);
	objs.obj2556=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon fixa le puits de ',true); layers.content.addObject(objs.obj2556);
	objs.obj2557=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres qui s’étendait ',true); layers.content.addObject(objs.obj2557);
	objs.obj2558=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au-delà du grillage.',true); layers.content.addObject(objs.obj2558);
	objs.obj2559=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj2559);
	objs.obj2560=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Alors, t’es enfin prêt à ',true);
	objs.obj2559.addObject(objs.obj2560);
	objs.obj2561=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'recevoir ta leçon ?',true);
	objs.obj2559.addObject(objs.obj2561);
	objs.obj2562=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Kevin s’approcha dans la ',true); layers.content.addObject(objs.obj2562);
	objs.obj2563=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'clarté de la lune. Il tendit le ',true); layers.content.addObject(objs.obj2563);
	objs.obj2564=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bras. Un bruit de ressort. ',true); layers.content.addObject(objs.obj2564);
	objs.obj2565=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Une lame apparut au bout ',true); layers.content.addObject(objs.obj2565);
	objs.obj2566=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de sa main. L’adolescent ',true); layers.content.addObject(objs.obj2566);
	objs.obj2567=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sentait le sang battre contre ',true); layers.content.addObject(objs.obj2567);
	objs.obj2568=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ses tempes, l’adrénaline ',true); layers.content.addObject(objs.obj2568);
	objs.obj2569=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'inonder son corps. Il voulait ',true); layers.content.addObject(objs.obj2569);
	objs.obj2570=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'gagner du temps pour ',true); layers.content.addObject(objs.obj2570);
	objs.obj2571=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'récupérer. Pour tenter ',true); layers.content.addObject(objs.obj2571);
	objs.obj2572=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'quelque chose. Il se ',true); layers.content.addObject(objs.obj2572);
	objs.obj2573=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'retourna face à ses ',true); layers.content.addObject(objs.obj2573);
	objs.obj2574=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'adversaires.',true); layers.content.addObject(objs.obj2574);
	objs.obj2575=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj2575);
	objs.obj2576=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Je n’ai fait que défendre ',true);
	objs.obj2575.addObject(objs.obj2576);
	objs.obj2577=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Rachel. Vous n’aviez pas ',true);
	objs.obj2575.addObject(objs.obj2577);
	objs.obj2581=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le droit de vous en prendre à ',true);
	objs.obj2575.addObject(objs.obj2581);
	objs.obj2582=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'elle.',true);
	objs.obj2575.addObject(objs.obj2582);
	objs.obj2583=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2583);
	objs.obj2584=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'T’avais qu’à pas te mêler ',true);
	objs.obj2583.addObject(objs.obj2584);
	objs.obj2585=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de nos affaires.',true);
	objs.obj2583.addObject(objs.obj2585);
	objs.obj2586=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj2586);
	objs.obj2587=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Quatre contre un, vous ',true);
	objs.obj2586.addObject(objs.obj2587);
	objs.obj2588=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'n’êtes que des lâches !',true);
	objs.obj2586.addObject(objs.obj2588);
	objs.obj2589=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon avait lancé ça tout en ',true); layers.content.addObject(objs.obj2589);
	objs.obj2590=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'jetant un bref coup d’œil ',true); layers.content.addObject(objs.obj2590);
	objs.obj2591=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'autour de lui. Il avait aperçu ',true); layers.content.addObject(objs.obj2591);
	objs.obj2592=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la grosse pierre au pied du ',true); layers.content.addObject(objs.obj2592);
	objs.obj2593=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage. Un bon ',true); layers.content.addObject(objs.obj2593);
	objs.obj2594=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tremplin…Kevin fulminait. ',true); layers.content.addObject(objs.obj2594);
	objs.obj2595=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2595);
	objs.obj2596=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Amenez-le moi !',true);
	objs.obj2595.addObject(objs.obj2596);
	objs.obj2598=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les trois autres s’élancèrent. ',true); layers.content.addObject(objs.obj2598);
	objs.obj2599=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, juste avant que leurs ',true); layers.content.addObject(objs.obj2599);
	objs.obj2600=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mains ne se referment sur ',true); layers.content.addObject(objs.obj2600);
	objs.obj2601=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lui, il s’était jeté sur le côté. ',true); layers.content.addObject(objs.obj2601);
	objs.obj2602=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'D’une roulade il avait atteint ',true); layers.content.addObject(objs.obj2602);
	objs.obj2603=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la pierre. Il se redressa d’un ',true); layers.content.addObject(objs.obj2603);
	objs.obj2604=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bond, prit appui sur le rocher ',true); layers.content.addObject(objs.obj2604);
	objs.obj2605=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et entreprit l’escalade du ',true); layers.content.addObject(objs.obj2605);
	objs.obj2606=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage.',true); layers.content.addObject(objs.obj2606);
	objs.obj2607=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj2607);
	objs.obj2608=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il va s’échapper ! Faites ',true);
	objs.obj2607.addObject(objs.obj2608);
	objs.obj2609=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'quelque chose !',true);
	objs.obj2607.addObject(objs.obj2609);
	objs.obj2610=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj2610);
	objs.obj2611=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Mais… Il ne peut pas ',true);
	objs.obj2610.addObject(objs.obj2611);
	objs.obj2612=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'aller loin, il n’y a rien ',true);
	objs.obj2610.addObject(objs.obj2612);
	objs.obj2615=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'après.',true);
	objs.obj2610.addObject(objs.obj2615);
	objs.obj2616=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'C’était vrai.Il n’y avait plus ',true); layers.content.addObject(objs.obj2616);
	objs.obj2617=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rien. Rien d’autre qu’un ',true); layers.content.addObject(objs.obj2617);
	objs.obj2618=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'énorme trou de ténèbres. ',true);
	objs.obj2618.addLink(new mse.Link(' trou',280,'audio',mse.src.getSrc('src19'))); layers.content.addObject(objs.obj2618);
	objs.obj2627=new FindSimon(); layers.content.addGame(objs.obj2627);
	objs.obj2619=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était trop tard pour ',true);
	objs.obj2619.addLink(new mse.Link(' il',282,'audio',mse.src.getSrc('src17'))); layers.content.addObject(objs.obj2619);
	objs.obj2620=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'reculer. Simon s’élança dans ',true); layers.content.addObject(objs.obj2620);
	objs.obj2621=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le vide.',true); layers.content.addObject(objs.obj2621);
	objs.obj2622=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2622);
	objs.obj2623=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'À SUIVRE...',true); layers.content.addObject(objs.obj2623);
	objs.obj2624=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2624);
	objs.obj2625=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj2625);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.fouine=new mse.Animation(22,1,true);
	animes.fouine.block=true;
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')],'fillStyle':'rgb(255, 255, 255)'});
	animes.fouine.addObj('obj567',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid38'),mse.coor('cid39')],'size':[mse.coor('cid40'),mse.coor('cid41')]},'src0');
	animes.fouine.addObj('src0',temp.obj);
	animes.fouine.addAnimation('obj567',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]')});
	animes.fouine.addAnimation('src0',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]'),'pos':[[mse.coor('cid38'),mse.coor('cid39')],[mse.coor('cid38'),mse.coor('cid39')],[mse.coor('cid38'),mse.coor('cid39')],[mse.coor('cid38'),mse.coor('cid39')],[mse.coor('cid2'),mse.coor('cid42')],[mse.coor('cid2'),mse.coor('cid42')]],'size':[[mse.coor('cid40'),mse.coor('cid41')],[mse.coor('cid40'),mse.coor('cid41')],[mse.coor('cid40'),mse.coor('cid41')],[mse.coor('cid40'),mse.coor('cid41')],[mse.coor('cid0'),mse.coor('cid43')],[mse.coor('cid0'),mse.coor('cid43')]]});
	animes.backshow=new mse.Animation(89,1,false);
	animes.backshow.block=true;
	animes.backshow.addObj('obj12',objs.obj12);
	animes.backshow.addAnimation('obj12',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.800000011921,0.800000011921]')});
	animes.titleshow=new mse.Animation(101,1,false);
	animes.titleshow.block=true;
	animes.titleshow.addObj('obj13',objs.obj13);
	animes.titleshow.addAnimation('obj13',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chashow=new mse.Animation(101,1,false);
	animes.chashow.block=true;
	animes.chashow.addObj('obj14',objs.obj14);
	animes.chashow.addAnimation('obj14',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.simcour=new mse.Animation(58,1,true);
	animes.simcour.block=true;
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid23'),mse.coor('cid51')],'size':[mse.coor('cid52'),mse.coor('cid53')]},'src6',[[186,0,119,254]]);
	animes.simcour.addObj('src6',temp.obj);
	temp.obj.appendFrame([362,0,260,254]);
	temp.obj.appendFrame([0,0,299,254]);
	temp.obj.appendFrame([302,0,199,254]);
	animes.simcour.addAnimation('src6',{'frame':JSON.parse('[0,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58]'),'opacity':JSON.parse('[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0]'),'spriteSeq':JSON.parse('[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,3]'),'size':[[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid52'),mse.coor('cid53')],[mse.coor('cid54'),mse.coor('cid53')],[mse.coor('cid54'),mse.coor('cid53')],[mse.coor('cid54'),mse.coor('cid53')],[mse.coor('cid54'),mse.coor('cid53')],[mse.coor('cid56'),mse.coor('cid53')],[mse.coor('cid56'),mse.coor('cid53')],[mse.coor('cid56'),mse.coor('cid53')],[mse.coor('cid56'),mse.coor('cid53')],[mse.coor('cid59'),mse.coor('cid53')],[mse.coor('cid59'),mse.coor('cid53')],[mse.coor('cid59'),mse.coor('cid53')],[mse.coor('cid59'),mse.coor('cid53')],[mse.coor('cid59'),mse.coor('cid53')]],'pos':[[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid23'),mse.coor('cid51')],[mse.coor('cid55'),mse.coor('cid51'),1],[mse.coor('cid55'),mse.coor('cid51'),1],[mse.coor('cid55'),mse.coor('cid51'),1],[mse.coor('cid57'),mse.coor('cid51')],[mse.coor('cid58'),mse.coor('cid51')],[mse.coor('cid58'),mse.coor('cid51')],[mse.coor('cid58'),mse.coor('cid51')],[mse.coor('cid58'),mse.coor('cid51')],[mse.coor('cid58'),mse.coor('cid51')]]});
	animes.piege=new mse.Animation(51,1,true);
	animes.piege.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')]},'grillageimg');
	animes.piege.addObj('grillageimg',temp.obj);
	temp.obj=new mse.Text(null,{'pos':[mse.coor('cid60'),mse.coor('cid61')],'size':[mse.coor('cid62'),mse.coor('cid40')],'fillStyle':'rgb(255, 255, 255)','textBaseline':'top','font':'normal '+mse.coor('cid34')+'px Verdana','textAlign':'left'},'Piégé!!!',true);
	animes.piege.addObj('obj587',temp.obj);
	animes.piege.addAnimation('grillageimg',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'opacity':JSON.parse('[0,1,1,1,1,0,0]')});
	animes.piege.addAnimation('obj587',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'fontSize':[mse.coor('cid34'),mse.coor('cid34'),mse.coor('cid63'),mse.coor('cid66'),mse.coor('cid66'),mse.coor('cid66'),mse.coor('cid66')],'pos':[[mse.coor('cid60'),mse.coor('cid61')],[mse.coor('cid60'),mse.coor('cid61')],[mse.coor('cid64'),mse.coor('cid65')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid67'),mse.coor('cid68')]],'opacity':JSON.parse('[0,0,0.699999988079,1,1,0,0]')});
	animes.qurantAnim=new mse.Animation(15,1,false);
	animes.qurantAnim.block=true;
	animes.qurantAnim.addObj('obj2482',objs.obj2482);
	animes.qurantAnim.addAnimation('obj2482',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid69'),mse.coor('cid71'),mse.coor('cid69'),mse.coor('cid69')]});
	animes.trentAnim=new mse.Animation(15,1,false);
	animes.trentAnim.block=true;
	animes.trentAnim.addObj('obj2491',objs.obj2491);
	animes.trentAnim.addAnimation('obj2491',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid69'),mse.coor('cid71'),mse.coor('cid69'),mse.coor('cid69')]});
	var action={};
	var reaction={};
	action.transAide=new mse.Script([{src:objs.obj5,type:'click'}]);
	reaction.transAide=function(){ 
		root.transition(pages.Aide); 
	};
	action.transAide.register(reaction.transAide);
	action.transCha=new mse.Script([{src:objs.obj566,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.backshowsc=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.backshowsc=function(){ 
		animes.backshow.start(); 
	};
	action.backshowsc.register(reaction.backshowsc);
	action.titleshowsc=action.backshowsc;
	reaction.titleshowsc=function(){ 
		animes.titleshow.start(); 
	};
	action.titleshowsc.register(reaction.titleshowsc);
	action.chashowsc=action.backshowsc;
	reaction.chashowsc=function(){ 
		animes.chashow.start(); 
	};
	action.chashowsc.register(reaction.chashowsc);
	action.transCont=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transCont=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransContSc=new mse.Script([{src:animes.backshow,type:'end'}]);
	reaction.addTransContSc=function(){ 
		action.transCont.register(reaction.transCont); 
	};
	action.addTransContSc.register(reaction.addTransContSc);
	action.couvcursor=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.couvcursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.couvcursor.register(reaction.couvcursor);
	action.aidecursor=new mse.Script([{src:pages.Aide,type:'show'}]);
	reaction.aidecursor=function(){ 
		mse.setCursor('default'); 
	};
	action.aidecursor.register(reaction.aidecursor);
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
	action.chahidecursor=action.backshowsc;
	reaction.chahidecursor=function(){ 
		mse.setCursor('default'); 
	};
	action.chahidecursor.register(reaction.chahidecursor);
	action.addTextEffet=action.couvcursor;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.content.objList.length; i++){
	var objCible = layers.content.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.addCouteauAnime=action.couvcursor;
	reaction.addCouteauAnime=function(){ 
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

action.showCouteau=new mse.Script([{src:objs.obj252,type:'show'}]);
reaction.showCouteau=function(){ animes.couteau.start(); };
action.showCouteau.register(reaction.showCouteau); 
	};
	action.addCouteauAnime.register(reaction.addCouteauAnime);
	action.startBack2Show=new mse.Script([{src:objs.obj2429,type:'firstShow'}]);
	reaction.startBack2Show=function(){ 
		temp.width=objs.obj15.getWidth();temp.height=objs.obj15.getHeight();temp.boundingbox=imgBoundingInBox('src1',temp.width,temp.height);temp.obj=new mse.Image(objs.obj15.parent,temp.boundingbox,'src1');mse.transition(objs.obj15,temp.obj,25); 
	};
	action.startBack2Show.register(reaction.startBack2Show);
	action.showRat=new mse.Script([{src:objs.obj2372,type:'firstShow'}]);
	reaction.showRat=function(){ 
		games.RatGame.start(); 
	};
	action.showRat.register(reaction.showRat);
	action.simonCour=new mse.Script([{src:objs.obj2374,type:'show'}]);
	reaction.simonCour=function(){ 
		animes.simcour.start(); 
	};
	action.simonCour.register(reaction.simonCour);
	action.startPiege=new mse.Script([{src:objs.obj2540,type:'firstShow'}]);
	reaction.startPiege=function(){ 
		animes.piege.start(); 
	};
	action.startPiege.register(reaction.startPiege);
	action.piegesonplay=action.startPiege;
	reaction.piegesonplay=function(){ 
		mse.src.getSrc('src21').play(); 
	};
	action.piegesonplay.register(reaction.piegesonplay);
	action.showFouine=new mse.Script([{src:objs.obj2342,type:'show'}]);
	reaction.showFouine=function(){ 
		animes.fouine.start(); 
	};
	action.showFouine.register(reaction.showFouine);
	action.start40Anim=new mse.Script([{src:objs.obj2482,type:'firstShow'}]);
	reaction.start40Anim=function(){ 
		animes.qurantAnim.start(); 
	};
	action.start40Anim.register(reaction.start40Anim);
	action.start30Anim=new mse.Script([{src:objs.obj2491,type:'firstShow'}]);
	reaction.start30Anim=function(){ 
		animes.trentAnim.start(); 
	};
	action.start30Anim.register(reaction.start30Anim);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);