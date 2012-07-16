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
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":20,"cid4":305,"cid5":46.25,"cid6":342.5,"cid7":35,"cid8":197.5,"cid9":38.75,"cid10":425,"cid11":122.5,"cid12":30,"cid13":190,"cid14":40,"cid15":578.75,"cid16":533.75,"cid17":160,"cid18":27.5,"cid19":601.25,"cid20":543.75,"cid21":13.75,"cid22":400,"cid23":200,"cid24":41.25,"cid25":235,"cid26":108.75,"cid27":32.5,"cid28":177.5,"cid29":61.25,"cid30":320,"cid31":247.5,"cid32":340,"cid33":590,"cid34":230,"cid35":10,"cid36":22.5,"cid37":295,"cid38":306,"cid39":417.384,"cid40":17,"cid41":397.8,"cid42":250,"cid43":100,"cid44":300,"cid45":409,"cid46":-200,"cid47":1090,"cid48":33,"cid49":109,"cid50":343,"cid51":41,"cid52":248,"cid53":178,"cid54":61,"cid55":344,"cid56":120,"cid57":255,"cid58":263,"cid59":296,"cid60":301,"cid61":298,"cid62":396,"cid63":201,"cid64":-42,"cid65":135,"cid66":1000,"cid67":164,"cid68":106,"cid69":189,"cid70":114,"cid71":221,"cid72":238,"cid73":23,"cid74":329,"cid75":80,"cid76":375}');
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
	objs.obj1649=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils étaient là. ',true); layers.content.addObject(objs.obj1649);
	objs.obj1650=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'À moins de cent mè',true); layers.content.addObject(objs.obj1650);
	objs.obj1651=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Quatre adolescents qui ',true); layers.content.addObject(objs.obj1651);
	objs.obj1652=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisaient régner leur loi au ',true); layers.content.addObject(objs.obj1652);
	objs.obj1653=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sein du foyer.',true); layers.content.addObject(objs.obj1653);
	objs.obj1654=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Recroquevillé dans la ',true); layers.content.addObject(objs.obj1654);
	objs.obj1655=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pénombre d’un porche, ',true); layers.content.addObject(objs.obj1655);
	objs.obj1656=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'L’adolescent contemplait le ',true); layers.content.addObject(objs.obj1656);
	objs.obj1657=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballet des lampes torches qui ',true); layers.content.addObject(objs.obj1657);
	objs.obj1658=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déchiraient la nuit. Des ',true); layers.content.addObject(objs.obj1658);
	objs.obj1659=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'yeux, scrutant le moindre ',true); layers.content.addObject(objs.obj1659);
	objs.obj1660=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'recoin, repoussant les ',true); layers.content.addObject(objs.obj1660);
	objs.obj1661=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres de leurs lueurs ',true); layers.content.addObject(objs.obj1661);
	objs.obj1662=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'cyclopes. ',true);
	objs.obj1662.addLink(new mse.Link('cyclopes',13,'wiki',wikis.Cyclope)); layers.content.addObject(objs.obj1662);
	objs.obj1663=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt, ils seraient sur lui. ',true); layers.content.addObject(objs.obj1663);
	objs.obj1664=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon frissonna en songeant ',true); layers.content.addObject(objs.obj1664);
	objs.obj1665=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'à ce qui allait lui arriver. Il ',true); layers.content.addObject(objs.obj1665);
	objs.obj1666=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'savait que Kevin, leur chef, ',true); layers.content.addObject(objs.obj1666);
	objs.obj1667=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sans pitié…  ',true); layers.content.addObject(objs.obj1667);
	objs.obj1668=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il fallait qu’il leur ',true); layers.content.addObject(objs.obj1668);
	objs.obj1669=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'échappe.Absolument. Et tant ',true); layers.content.addObject(objs.obj1669);
	objs.obj1670=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pis s’il ne pouvait jamais ',true); layers.content.addObject(objs.obj1670);
	objs.obj1671=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'retourner au foyer.',true); layers.content.addObject(objs.obj1671);
	objs.obj1672=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les pas se rapprochaient, de ',true); layers.content.addObject(objs.obj1672);
	objs.obj1673=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus en plus. Il pouvait ',true); layers.content.addObject(objs.obj1673);
	objs.obj1674=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'entendre leurs voix à ',true); layers.content.addObject(objs.obj1674);
	objs.obj1675=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'présent.',true); layers.content.addObject(objs.obj1675);
	objs.obj1676=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1676);
	objs.obj1677=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Trouvez-moi ce sale petit ',true);
	objs.obj1676.addObject(objs.obj1677);
	objs.obj1678=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'rat ! Il va comprendre ',true);
	objs.obj1676.addObject(objs.obj1678);
	objs.obj1682=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’on ne peut pas se ',true);
	objs.obj1676.addObject(objs.obj1682);
	objs.obj1683=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'moquer de nous comme ça !',true);
	objs.obj1676.addObject(objs.obj1683);
	objs.obj1684=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj1684);
	objs.obj1685=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Ouaip, on va lui faire sa ',true);
	objs.obj1684.addObject(objs.obj1685);
	objs.obj1686=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'fête !',true);
	objs.obj1684.addObject(objs.obj1686);
	objs.obj1687=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ca, c’était « La Fouine ».',true); layers.content.addObject(objs.obj1687);
	objs.obj1688=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dix sept ans, un ',true); layers.content.addObject(objs.obj1688);
	objs.obj1689=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mètrequatre-vingt, ',true); layers.content.addObject(objs.obj1689);
	objs.obj1690=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'soixante-quinze kilos de ',true); layers.content.addObject(objs.obj1690);
	objs.obj1691=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'violence pure. Une véritable ',true); layers.content.addObject(objs.obj1691);
	objs.obj1692=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bombe ambploser. Simon se ',true); layers.content.addObject(objs.obj1692);
	objs.obj1693=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pencha un instant hors de ',true); layers.content.addObject(objs.obj1693);
	objs.obj1694=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'son abri pour évaluer ses ',true); layers.content.addObject(objs.obj1694);
	objs.obj1695=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chances de leur échapper. ',true); layers.content.addObject(objs.obj1695);
	objs.obj1696=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Proche du zéro absolu s’il ne ',true); layers.content.addObject(objs.obj1696);
	objs.obj1697=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bougeait pas de sa cachette. ',true); layers.content.addObject(objs.obj1697);
	objs.obj1698=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un peu plus s’il tentait une ',true); layers.content.addObject(objs.obj1698);
	objs.obj1699=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sortie. À condition de tomber ',true); layers.content.addObject(objs.obj1699);
	objs.obj1700=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur quelqu’un, un adulte qui ',true); layers.content.addObject(objs.obj1700);
	objs.obj1701=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'saurait éloigner ses ',true); layers.content.addObject(objs.obj1701);
	objs.obj1702=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants. ',true); layers.content.addObject(objs.obj1702);
	objs.obj1703=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj1703);
	objs.obj1704=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Tu es prêt ? chuchota-t-il ',true);
	objs.obj1703.addObject(objs.obj1704);
	objs.obj1705=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'à Dark.',true);
	objs.obj1703.addObject(objs.obj1705);
	objs.obj1706=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dark. Vador. Son rat albinos. ',true);
	objs.obj1706.addLink(new mse.Link('albinos',46,'wiki',wikis.albinos)); layers.content.addObject(objs.obj1706);
	objs.obj1707=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Son plus fidèle compagnon ',true); layers.content.addObject(objs.obj1707);
	objs.obj1708=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'depuis un an. ',true); layers.content.addObject(objs.obj1708);
	objs.obj1709=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le seul en vérité. ',true); layers.content.addObject(objs.obj1709);
	objs.obj1710=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon repoussa l’élan de ',true); layers.content.addObject(objs.obj1710);
	objs.obj1711=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mélancolie qui menaçait de ',true); layers.content.addObject(objs.obj1711);
	objs.obj1712=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le submerger et enfouit Dark ',true); layers.content.addObject(objs.obj1712);
	objs.obj1713=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au fond de son sac.',true); layers.content.addObject(objs.obj1713);
	objs.obj1714=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1714);
	objs.obj1715=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il passa les lanières autour ',true); layers.content.addObject(objs.obj1715);
	objs.obj1716=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de ses épaules et s’élança.',true); layers.content.addObject(objs.obj1716);
	objs.obj1717=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas de réaction.',true); layers.content.addObject(objs.obj1717);
	objs.obj1718=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il s’était i sa vie en ',true); layers.content.addObject(objs.obj1718);
	objs.obj1719=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dépendait. ',true); layers.content.addObject(objs.obj1719);
	objs.obj1720=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Si la Meute lui ',true); layers.content.addObject(objs.obj1720);
	objs.obj1721=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tombaitdessus, il était bon ',true); layers.content.addObject(objs.obj1721);
	objs.obj1722=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pour un passage à tabac ',true); layers.content.addObject(objs.obj1722);
	objs.obj1723=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans les règles de l’art. Voilà ',true); layers.content.addObject(objs.obj1723);
	objs.obj1724=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ce qui se passe lorsque l’on ',true); layers.content.addObject(objs.obj1724);
	objs.obj1725=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'refuse de soumettre aux ',true); layers.content.addObject(objs.obj1725);
	objs.obj1726=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus forts.Simon évitait de ',true); layers.content.addObject(objs.obj1726);
	objs.obj1727=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'regarder dans leur direction, ',true); layers.content.addObject(objs.obj1727);
	objs.obj1728=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'les yeux rivés sur les ',true); layers.content.addObject(objs.obj1728);
	objs.obj1729=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'frondaisons du Parc ',true);
	objs.obj1729.addLink(new mse.Link('frondaisons',69,'wiki',wikis.frondaison)); layers.content.addObject(objs.obj1729);
	objs.obj1730=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Montsouris. Des arbres, de ',true); layers.content.addObject(objs.obj1730);
	objs.obj1731=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la pénombre et des milliards ',true); layers.content.addObject(objs.obj1731);
	objs.obj1732=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de recoins où il pourrait se ',true); layers.content.addObject(objs.obj1732);
	objs.obj1733=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dissimuler en attendant ',true); layers.content.addObject(objs.obj1733);
	objs.obj1734=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’aube. ',true); layers.content.addObject(objs.obj1734);
	objs.obj1735=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’il atteignait le jardin, il ',true); layers.content.addObject(objs.obj1735);
	objs.obj1736=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sauvé.',true); layers.content.addObject(objs.obj1736);
	objs.obj1737=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, dans sa précipitation, il ',true); layers.content.addObject(objs.obj1737);
	objs.obj1738=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'butta contre le trottoir. Le ',true); layers.content.addObject(objs.obj1738);
	objs.obj1739=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'béton lui arracha une ',true); layers.content.addObject(objs.obj1739);
	objs.obj1740=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plainte. Un cri minuscule.',true); layers.content.addObject(objs.obj1740);
	objs.obj1741=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1741);
	objs.obj1742=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1742);
	objs.obj1743=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il est là !',true);
	objs.obj1742.addObject(objs.obj1743);
	objs.obj1744=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1744);
	objs.obj1745=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas assez minuscule, ',true); layers.content.addObject(objs.obj1745);
	objs.obj1746=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visiblement.',true); layers.content.addObject(objs.obj1746);
	objs.obj1747=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon détala tandis que les ',true); layers.content.addObject(objs.obj1747);
	objs.obj1748=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisceaux accrochaient sa ',true); layers.content.addObject(objs.obj1748);
	objs.obj1749=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'silhouette. ',true); layers.content.addObject(objs.obj1749);
	objs.obj1750=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1750);
	objs.obj1949=new mse.Image(layers.content,{"size":[mse.coor('cid38'),mse.coor('cid39')],"pos":[mse.coor('cid40'),mse.coor('cid3')]},'src10');
	objs.obj1949.activateZoom(); layers.content.addObject(objs.obj1949);
	objs.obj1751=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1751);
	objs.obj1752=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1752);
	objs.obj1753=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Choppez-le ! Faut qu’il ',true);
	objs.obj1752.addObject(objs.obj1753);
	objs.obj1754=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'comprenne !',true);
	objs.obj1752.addObject(objs.obj1754);
	objs.obj1755=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Que je comprenne quoi ? ',true); layers.content.addObject(objs.obj1755);
	objs.obj1756=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Qu’il faut se laisser faire ? ',true); layers.content.addObject(objs.obj1756);
	objs.obj1757=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas question !',true); layers.content.addObject(objs.obj1757);
	objs.obj1758=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il accéléra. ',true);
	objs.obj1758.addLink(new mse.Link('accéléra',96,'audio',mse.src.getSrc('src17'))); layers.content.addObject(objs.obj1758);
	objs.obj1759=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il essayait d’oublier que ses ',true); layers.content.addObject(objs.obj1759);
	objs.obj1760=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poumons le brûlaient, qu’il ',true); layers.content.addObject(objs.obj1760);
	objs.obj1761=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'était épuisé par cette ',true); layers.content.addObject(objs.obj1761);
	objs.obj1762=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuite qui durait depuis ',true); layers.content.addObject(objs.obj1762);
	objs.obj1763=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'des heures, et surtout que la ',true); layers.content.addObject(objs.obj1763);
	objs.obj1764=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peur menaçait de le ',true); layers.content.addObject(objs.obj1764);
	objs.obj1765=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'paralyser à tout instant. Il ',true); layers.content.addObject(objs.obj1765);
	objs.obj1766=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'traversa le boulevard, ',true); layers.content.addObject(objs.obj1766);
	objs.obj1767=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déclenchant le klaxon ',true);
	objs.obj1767.addLink(new mse.Link('klaxon',105,'audio',mse.src.getSrc('src18'))); layers.content.addObject(objs.obj1767);
	objs.obj1768=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'furieux d’un noctambule ',true);
	objs.obj1768.addLink(new mse.Link('noctambule',106,'wiki',wikis.Noctambule)); layers.content.addObject(objs.obj1768);
	objs.obj1769=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'égaré. Puis il s’engouffra à ',true); layers.content.addObject(objs.obj1769);
	objs.obj1770=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’abri des arbres. Son sac ',true); layers.content.addObject(objs.obj1770);
	objs.obj1771=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballotait sur ses épaules et il ',true); layers.content.addObject(objs.obj1771);
	objs.obj1772=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pensa au pauvre Dark. ',true); layers.content.addObject(objs.obj1772);
	objs.obj1773=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sans réfléchir, il pénétra ',true); layers.content.addObject(objs.obj1773);
	objs.obj1774=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans une petite allée. Il ',true); layers.content.addObject(objs.obj1774);
	objs.obj1775=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dépassa les angles du ',true); layers.content.addObject(objs.obj1775);
	objs.obj1776=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pavillon météo qui s’élevait ',true); layers.content.addObject(objs.obj1776);
	objs.obj1777=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans la pénombre, puis il ',true); layers.content.addObject(objs.obj1777);
	objs.obj1778=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ralentit sa course. ',true); layers.content.addObject(objs.obj1778);
	objs.obj1779=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas un bruit.',true); layers.content.addObject(objs.obj1779);
	objs.obj1780=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Rien d’autre que le vent ',true); layers.content.addObject(objs.obj1780);
	objs.obj1781=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans les feuilles. ',true); layers.content.addObject(objs.obj1781);
	objs.obj1782=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Où étaient-ils passés ?',true); layers.content.addObject(objs.obj1782);
	objs.obj1783=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon s’arrêta, s’accroupit ',true); layers.content.addObject(objs.obj1783);
	objs.obj1784=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'derrière un banc scarifié de ',true); layers.content.addObject(objs.obj1784);
	objs.obj1785=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'graffitis. ',true); layers.content.addObject(objs.obj1785);
	objs.obj1786=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Là ! Sur sa gauche. ',true); layers.content.addObject(objs.obj1786);
	objs.obj1787=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1787);
	objs.obj1950=new mse.Image(layers.content,{"size":[mse.coor('cid38'),mse.coor('cid41')],"pos":[mse.coor('cid40'),mse.coor('cid3')]},'src13');
	objs.obj1950.activateZoom(); layers.content.addObject(objs.obj1950);
	objs.obj1788=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1788);
	objs.obj1789=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il avait reconnu la démarche ',true); layers.content.addObject(objs.obj1789);
	objs.obj1790=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chaloupée de la Fouine, les ',true); layers.content.addObject(objs.obj1790);
	objs.obj1791=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pas lourds de l’Ours – seize ',true);
	objs.obj1791.addLink(new mse.Link('pas',130,'audio',mse.src.getSrc('src19'))); layers.content.addObject(objs.obj1791);
	objs.obj1792=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ans, un QI inversement ',true); layers.content.addObject(objs.obj1792);
	objs.obj1793=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'proportionnel à sa force - à ',true); layers.content.addObject(objs.obj1793);
	objs.obj1794=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ses côtés. Les deux autres ',true); layers.content.addObject(objs.obj1794);
	objs.obj1795=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'suivaient la ligne de ',true); layers.content.addObject(objs.obj1795);
	objs.obj1796=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tramway qui longeait le parc, ',true); layers.content.addObject(objs.obj1796);
	objs.obj1797=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur sa droite.',true); layers.content.addObject(objs.obj1797);
	objs.obj1798=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le groupe s’était séparé en ',true); layers.content.addObject(objs.obj1798);
	objs.obj1799=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'deux et tentait de ',true); layers.content.addObject(objs.obj1799);
	objs.obj1800=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’encercler.',true); layers.content.addObject(objs.obj1800);
	objs.obj1801=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon réfléchit à toute ',true); layers.content.addObject(objs.obj1801);
	objs.obj1802=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'allure. ',true); layers.content.addObject(objs.obj1802);
	objs.obj1803=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le RER ! ',true);
	objs.obj1803.addLink(new mse.Link('RER',142,'audio',mse.src.getSrc('src20'))); layers.content.addObject(objs.obj1803);
	objs.obj1804=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La station ne devait être ',true); layers.content.addObject(objs.obj1804);
	objs.obj1805=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’à quelques dizaines de ',true); layers.content.addObject(objs.obj1805);
	objs.obj1806=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mètres devant lui et, même ',true); layers.content.addObject(objs.obj1806);
	objs.obj1807=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'en ces heures tardives, il y ',true); layers.content.addObject(objs.obj1807);
	objs.obj1808=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'aurait sans doute un peu de ',true); layers.content.addObject(objs.obj1808);
	objs.obj1809=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'monde. ',true); layers.content.addObject(objs.obj1809);
	objs.obj1810=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il reprit sa progression, ',true); layers.content.addObject(objs.obj1810);
	objs.obj1811=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lentement, veillant à rester ',true); layers.content.addObject(objs.obj1811);
	objs.obj1812=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'invisible. ',true); layers.content.addObject(objs.obj1812);
	objs.obj1813=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Plus que cinquante mètres.Il ',true); layers.content.addObject(objs.obj1813);
	objs.obj1814=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'entendait déjà le crissement ',true); layers.content.addObject(objs.obj1814);
	objs.obj1815=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'des rames sur les rails.',true); layers.content.addObject(objs.obj1815);
	objs.obj1816=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1816);
	objs.obj1817=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Quarante.',true); layers.content.addObject(objs.obj1817);
	objs.obj1818=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1818);
	objs.obj1819=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1819);
	objs.obj1820=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Là sur le pont ! Il essaye ',true);
	objs.obj1819.addObject(objs.obj1820);
	objs.obj1821=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de rejoindre la gare !',true);
	objs.obj1819.addObject(objs.obj1821);
	objs.obj1822=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj1822);
	objs.obj1823=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Merde ! lâcha Simon en ',true);
	objs.obj1822.addObject(objs.obj1823);
	objs.obj1824=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'reprenant sa course.',true);
	objs.obj1822.addObject(objs.obj1824);
	objs.obj1825=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1825);
	objs.obj1826=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Trente.',true); layers.content.addObject(objs.obj1826);
	objs.obj1827=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1827);
	objs.obj1828=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais la meute, galvanisée ',true); layers.content.addObject(objs.obj1828);
	objs.obj1829=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'par la proximité de sa proie, ',true); layers.content.addObject(objs.obj1829);
	objs.obj1830=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'se rapprochait rapidement. ',true); layers.content.addObject(objs.obj1830);
	objs.obj1831=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils avaient de la lumière, ils ',true); layers.content.addObject(objs.obj1831);
	objs.obj1832=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'évitaient les obstacles. ',true); layers.content.addObject(objs.obj1832);
	objs.obj1833=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Surtout ils étaient plus âgés, ',true); layers.content.addObject(objs.obj1833);
	objs.obj1834=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus forts alors que lui était ',true); layers.content.addObject(objs.obj1834);
	objs.obj1835=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'éreinté, les jambes ',true); layers.content.addObject(objs.obj1835);
	objs.obj1836=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'écorchées par les ronces, au ',true); layers.content.addObject(objs.obj1836);
	objs.obj1837=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bord de l’asphyxie.',true); layers.content.addObject(objs.obj1837);
	objs.obj1838=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les deux groupes gagnaient ',true); layers.content.addObject(objs.obj1838);
	objs.obj1839=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'insensiblement du terrain. ',true); layers.content.addObject(objs.obj1839);
	objs.obj1840=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt ils se rejoindraient et ',true); layers.content.addObject(objs.obj1840);
	objs.obj1841=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ce serait l’hallali.Simon ',true);
	objs.obj1841.addLink(new mse.Link('l’hallali',176,'wiki',wikis.hallali)); layers.content.addObject(objs.obj1841);
	objs.obj1842=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'obliqua brutalement vers le ',true); layers.content.addObject(objs.obj1842);
	objs.obj1843=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'nord pour essayer de ',true); layers.content.addObject(objs.obj1843);
	objs.obj1844=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rejoindre un bouquet ',true); layers.content.addObject(objs.obj1844);
	objs.obj1845=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'d’arbres denses. Avec un ',true); layers.content.addObject(objs.obj1845);
	objs.obj1846=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peu de chance, il pourrait les ',true); layers.content.addObject(objs.obj1846);
	objs.obj1847=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'semer. Au pire, il grimperait ',true); layers.content.addObject(objs.obj1847);
	objs.obj1848=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur l’un des troncs ',true); layers.content.addObject(objs.obj1848);
	objs.obj1849=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'centenaires. ',true); layers.content.addObject(objs.obj1849);
	objs.obj1850=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se précipita dans le ',true); layers.content.addObject(objs.obj1850);
	objs.obj1851=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bosquet. Les branches ',true); layers.content.addObject(objs.obj1851);
	objs.obj1852=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'basses fouettèrent son ',true); layers.content.addObject(objs.obj1852);
	objs.obj1853=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visage, lui arrachant des ',true); layers.content.addObject(objs.obj1853);
	objs.obj1854=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'larmes. ',true); layers.content.addObject(objs.obj1854);
	objs.obj1855=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était presqu’à l’abri : ',true); layers.content.addObject(objs.obj1855);
	objs.obj1856=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité était totale. ',true); layers.content.addObject(objs.obj1856);
	objs.obj1857=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il ignorait vers quoi il ',true); layers.content.addObject(objs.obj1857);
	objs.obj1858=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'courrait mais il s’en fichait. Il ',true); layers.content.addObject(objs.obj1858);
	objs.obj1859=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'accéléra encore et…',true); layers.content.addObject(objs.obj1859);
	objs.obj1860=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’effondra brutalement, le ',true); layers.content.addObject(objs.obj1860);
	objs.obj1861=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'souffle coupé, une violente ',true); layers.content.addObject(objs.obj1861);
	objs.obj1862=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'douleur barrant sa poitrine. ',true); layers.content.addObject(objs.obj1862);
	objs.obj1863=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il venait de heurter quelque ',true); layers.content.addObject(objs.obj1863);
	objs.obj1864=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chose de plein fouet. ',true); layers.content.addObject(objs.obj1864);
	objs.obj1865=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Abasourdi, Simon fouilla ',true); layers.content.addObject(objs.obj1865);
	objs.obj1866=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité. Il entendait ses ',true); layers.content.addObject(objs.obj1866);
	objs.obj1867=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants battre les talus ',true); layers.content.addObject(objs.obj1867);
	objs.obj1868=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et les fourrés. ',true); layers.content.addObject(objs.obj1868);
	objs.obj1869=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il tâtonna un instant dans ',true); layers.content.addObject(objs.obj1869);
	objs.obj1870=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'son sac. ',true); layers.content.addObject(objs.obj1870);
	objs.obj1871=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sa torche.',true); layers.content.addObject(objs.obj1871);
	objs.obj1872=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un faible halo de lumière.',true); layers.content.addObject(objs.obj1872);
	objs.obj1873=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un grillage. ',true); layers.content.addObject(objs.obj1873);
	objs.obj1874=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1874);
	objs.obj1875=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Piégé !',true); layers.content.addObject(objs.obj1875);
	objs.obj1876=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1876);
	objs.obj1877=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se redressa en grimaçant,  ',true); layers.content.addObject(objs.obj1877);
	objs.obj1878=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de fer abandonnée.',true); layers.content.addObject(objs.obj1878);
	objs.obj1879=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La Petite Ceinture. ',true);
	objs.obj1879.addLink(new mse.Link('La Petite Ceinture',214,'wiki',wikis.pCeinture)); layers.content.addObject(objs.obj1879);
	objs.obj1880=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un éclat de voix derrière lui ',true); layers.content.addObject(objs.obj1880);
	objs.obj1881=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le fit sursauter.',true); layers.content.addObject(objs.obj1881);
	objs.obj1882=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'ours', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj1882);
	objs.obj1883=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'On le tient !',true);
	objs.obj1882.addObject(objs.obj1883);
	objs.obj1884=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon fixa le puits de ',true); layers.content.addObject(objs.obj1884);
	objs.obj1885=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres qui s’étendait ',true); layers.content.addObject(objs.obj1885);
	objs.obj1886=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au-delà du grillage.',true); layers.content.addObject(objs.obj1886);
	objs.obj1887=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj1887);
	objs.obj1888=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Alors, t’es enfin prêt à ',true);
	objs.obj1887.addObject(objs.obj1888);
	objs.obj1889=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'recevoir ta leçon ?',true);
	objs.obj1887.addObject(objs.obj1889);
	objs.obj1890=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Kevin s’approcha dans la ',true); layers.content.addObject(objs.obj1890);
	objs.obj1891=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'clarté de la lune. Il tendit le ',true); layers.content.addObject(objs.obj1891);
	objs.obj1892=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bras. Un bruit de ressort. ',true); layers.content.addObject(objs.obj1892);
	objs.obj1893=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Une lame apparut au bout ',true); layers.content.addObject(objs.obj1893);
	objs.obj1894=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de sa main. L’adolescent ',true); layers.content.addObject(objs.obj1894);
	objs.obj1895=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sentait le sang battre contre ',true); layers.content.addObject(objs.obj1895);
	objs.obj1896=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ses tempes, l’adrénaline ',true); layers.content.addObject(objs.obj1896);
	objs.obj1897=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'inonder son corps. Il voulait ',true); layers.content.addObject(objs.obj1897);
	objs.obj1898=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'gagner du temps pour ',true); layers.content.addObject(objs.obj1898);
	objs.obj1899=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'récupérer. Pour tenter ',true); layers.content.addObject(objs.obj1899);
	objs.obj1900=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'quelque chose. Il se ',true); layers.content.addObject(objs.obj1900);
	objs.obj1901=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'retourna face à ses ',true); layers.content.addObject(objs.obj1901);
	objs.obj1902=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'adversaires.',true); layers.content.addObject(objs.obj1902);
	objs.obj1903=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj1903);
	objs.obj1904=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Je n’ai fait que défendre ',true);
	objs.obj1903.addObject(objs.obj1904);
	objs.obj1905=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Rachel. Vous n’aviez pas ',true);
	objs.obj1903.addObject(objs.obj1905);
	objs.obj1908=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le droit de vous en prendre à ',true);
	objs.obj1903.addObject(objs.obj1908);
	objs.obj1909=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'elle.',true);
	objs.obj1903.addObject(objs.obj1909);
	objs.obj1910=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1910);
	objs.obj1911=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'T’avais qu’à pas te mêler ',true);
	objs.obj1910.addObject(objs.obj1911);
	objs.obj1912=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de nos affaires.',true);
	objs.obj1910.addObject(objs.obj1912);
	objs.obj1913=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj1913);
	objs.obj1914=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Quatre contre un, vous ',true);
	objs.obj1913.addObject(objs.obj1914);
	objs.obj1915=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'n’êtes que des lâches !',true);
	objs.obj1913.addObject(objs.obj1915);
	objs.obj1916=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon avait lancé ça tout en ',true); layers.content.addObject(objs.obj1916);
	objs.obj1917=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'jetant un bref coup d’œil ',true); layers.content.addObject(objs.obj1917);
	objs.obj1918=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'autour de lui. Il avait aperçu ',true); layers.content.addObject(objs.obj1918);
	objs.obj1919=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la grosse pierre au pied du ',true); layers.content.addObject(objs.obj1919);
	objs.obj1920=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage. Un bon ',true); layers.content.addObject(objs.obj1920);
	objs.obj1921=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tremplin…Kevin fulminait. ',true); layers.content.addObject(objs.obj1921);
	objs.obj1922=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1922);
	objs.obj1923=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Amenez-le moi !',true);
	objs.obj1922.addObject(objs.obj1923);
	objs.obj1924=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les trois autres s’élancèrent. ',true); layers.content.addObject(objs.obj1924);
	objs.obj1925=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, juste avant que leurs ',true); layers.content.addObject(objs.obj1925);
	objs.obj1926=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mains ne se referment sur ',true); layers.content.addObject(objs.obj1926);
	objs.obj1927=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lui, il s’était jeté sur le côté. ',true); layers.content.addObject(objs.obj1927);
	objs.obj1928=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'D’une roulade il avait atteint ',true); layers.content.addObject(objs.obj1928);
	objs.obj1929=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la pierre. Il se redressa d’un ',true); layers.content.addObject(objs.obj1929);
	objs.obj1930=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bond, prit appui sur le rocher ',true); layers.content.addObject(objs.obj1930);
	objs.obj1931=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et entreprit l’escalade du ',true); layers.content.addObject(objs.obj1931);
	objs.obj1932=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage.',true); layers.content.addObject(objs.obj1932);
	objs.obj1933=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj1933);
	objs.obj1934=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il va s’échapper ! Faites ',true);
	objs.obj1933.addObject(objs.obj1934);
	objs.obj1935=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'quelque chose !',true);
	objs.obj1933.addObject(objs.obj1935);
	objs.obj1936=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj1936);
	objs.obj1937=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Mais… Il ne peut pas ',true);
	objs.obj1936.addObject(objs.obj1937);
	objs.obj1938=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'aller loin, il n’y a rien ',true);
	objs.obj1936.addObject(objs.obj1938);
	objs.obj1940=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'après.',true);
	objs.obj1936.addObject(objs.obj1940);
	objs.obj1951=new FindSimon(); layers.content.addGame(objs.obj1951);
	objs.obj1941=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'C’était vrai.Il n’y avait plus ',true); layers.content.addObject(objs.obj1941);
	objs.obj1942=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rien. Rien d’autre qu’un ',true); layers.content.addObject(objs.obj1942);
	objs.obj1943=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'énorme trou de ténèbres. ',true); layers.content.addObject(objs.obj1943);
	objs.obj1944=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était trop tard pour ',true); layers.content.addObject(objs.obj1944);
	objs.obj1945=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'reculer. Simon s’élança dans ',true); layers.content.addObject(objs.obj1945);
	objs.obj1946=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le vide.',true); layers.content.addObject(objs.obj1946);
	objs.obj1947=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1947);
	objs.obj1948=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'À SUIVRE...',true); layers.content.addObject(objs.obj1948);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.fouine=new mse.Animation(22,1,true);
	animes.fouine.block=true;
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')],'fillStyle':'rgb(255, 255, 255)'});
	animes.fouine.addObj('obj567',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid42'),mse.coor('cid43')],'size':[mse.coor('cid44'),mse.coor('cid45')]},'src0');
	animes.fouine.addObj('src0',temp.obj);
	animes.fouine.addAnimation('obj567',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]')});
	animes.fouine.addAnimation('src0',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]'),'pos':[[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid2'),mse.coor('cid46')],[mse.coor('cid2'),mse.coor('cid46')]],'size':[[mse.coor('cid44'),mse.coor('cid45')],[mse.coor('cid44'),mse.coor('cid45')],[mse.coor('cid44'),mse.coor('cid45')],[mse.coor('cid44'),mse.coor('cid45')],[mse.coor('cid0'),mse.coor('cid47')],[mse.coor('cid0'),mse.coor('cid47')]]});
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
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid23'),mse.coor('cid55')],'size':[mse.coor('cid56'),mse.coor('cid57')]},'src6',[[186,0,119,254]]);
	animes.simcour.addObj('src6',temp.obj);
	temp.obj.appendFrame([362,0,260,254]);
	temp.obj.appendFrame([0,0,299,254]);
	temp.obj.appendFrame([302,0,199,254]);
	animes.simcour.addAnimation('src6',{'frame':JSON.parse('[0,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58]'),'opacity':JSON.parse('[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0]'),'spriteSeq':JSON.parse('[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,3]'),'size':[[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid56'),mse.coor('cid57')],[mse.coor('cid58'),mse.coor('cid57')],[mse.coor('cid58'),mse.coor('cid57')],[mse.coor('cid58'),mse.coor('cid57')],[mse.coor('cid58'),mse.coor('cid57')],[mse.coor('cid60'),mse.coor('cid57')],[mse.coor('cid60'),mse.coor('cid57')],[mse.coor('cid60'),mse.coor('cid57')],[mse.coor('cid60'),mse.coor('cid57')],[mse.coor('cid63'),mse.coor('cid57')],[mse.coor('cid63'),mse.coor('cid57')],[mse.coor('cid63'),mse.coor('cid57')],[mse.coor('cid63'),mse.coor('cid57')],[mse.coor('cid63'),mse.coor('cid57')]],'pos':[[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid23'),mse.coor('cid55')],[mse.coor('cid59'),mse.coor('cid55'),1],[mse.coor('cid59'),mse.coor('cid55'),1],[mse.coor('cid59'),mse.coor('cid55'),1],[mse.coor('cid61'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')],[mse.coor('cid62'),mse.coor('cid55')]]});
	animes.piege=new mse.Animation(51,1,true);
	animes.piege.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')]},'grillageimg');
	animes.piege.addObj('grillageimg',temp.obj);
	temp.obj=new mse.Text(null,{'pos':[mse.coor('cid64'),mse.coor('cid65')],'size':[mse.coor('cid66'),mse.coor('cid44')],'fillStyle':'rgb(255, 255, 255)','textBaseline':'top','font':'normal '+mse.coor('cid34')+'px Verdana','textAlign':'left'},'Piégé!!!',true);
	animes.piege.addObj('obj587',temp.obj);
	animes.piege.addAnimation('grillageimg',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'opacity':JSON.parse('[0,1,1,1,1,0,0]')});
	animes.piege.addAnimation('obj587',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'fontSize':[mse.coor('cid34'),mse.coor('cid34'),mse.coor('cid67'),mse.coor('cid70'),mse.coor('cid70'),mse.coor('cid70'),mse.coor('cid70')],'pos':[[mse.coor('cid64'),mse.coor('cid65')],[mse.coor('cid64'),mse.coor('cid65')],[mse.coor('cid68'),mse.coor('cid69')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')]],'opacity':JSON.parse('[0,0,0.699999988079,1,1,0,0]')});
	animes.qurantAnim=new mse.Animation(15,1,false);
	animes.qurantAnim.block=true;
	animes.qurantAnim.addObj('obj1817',objs.obj1817);
	animes.qurantAnim.addAnimation('obj1817',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid73'),mse.coor('cid75'),mse.coor('cid73'),mse.coor('cid73')]});
	animes.trentAnim=new mse.Animation(15,1,false);
	animes.trentAnim.block=true;
	animes.trentAnim.addObj('obj1826',objs.obj1826);
	animes.trentAnim.addAnimation('obj1826',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid73'),mse.coor('cid75'),mse.coor('cid73'),mse.coor('cid73')]});
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
	action.startBack2Show=new mse.Script([{src:objs.obj1769,type:'firstShow'}]);
	reaction.startBack2Show=function(){ 
		temp.width=objs.obj15.getWidth();temp.height=objs.obj15.getHeight();temp.boundingbox=imgBoundingInBox('src1',temp.width,temp.height);temp.obj=new mse.Image(objs.obj15.parent,temp.boundingbox,'src1');mse.transition(objs.obj15,temp.obj,25); 
	};
	action.startBack2Show.register(reaction.startBack2Show);
	action.showRat=new mse.Script([{src:objs.obj1715,type:'firstShow'}]);
	reaction.showRat=function(){ 
		games.RatGame.start(); 
	};
	action.showRat.register(reaction.showRat);
	action.simonCour=new mse.Script([{src:objs.obj1717,type:'show'}]);
	reaction.simonCour=function(){ 
		animes.simcour.start(); 
	};
	action.simonCour.register(reaction.simonCour);
	action.startPiege=new mse.Script([{src:objs.obj1875,type:'firstShow'}]);
	reaction.startPiege=function(){ 
		animes.piege.start(); 
	};
	action.startPiege.register(reaction.startPiege);
	action.piegesonplay=action.startPiege;
	reaction.piegesonplay=function(){ 
		mse.src.getSrc('src21').play(); 
	};
	action.piegesonplay.register(reaction.piegesonplay);
	action.showFouine=new mse.Script([{src:objs.obj1687,type:'show'}]);
	reaction.showFouine=function(){ 
		animes.fouine.start(); 
	};
	action.showFouine.register(reaction.showFouine);
	action.start40Anim=new mse.Script([{src:objs.obj1817,type:'firstShow'}]);
	reaction.start40Anim=function(){ 
		animes.qurantAnim.start(); 
	};
	action.start40Anim.register(reaction.start40Anim);
	action.start30Anim=new mse.Script([{src:objs.obj1826,type:'firstShow'}]);
	reaction.start30Anim=function(){ 
		animes.trentAnim.start(); 
	};
	action.start30Anim.register(reaction.start30Anim);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);