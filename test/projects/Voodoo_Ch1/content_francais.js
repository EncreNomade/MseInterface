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
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":20,"cid4":305,"cid5":46.25,"cid6":342.5,"cid7":35,"cid8":197.5,"cid9":38.75,"cid10":425,"cid11":122.5,"cid12":30,"cid13":190,"cid14":40,"cid15":578.75,"cid16":533.75,"cid17":160,"cid18":27.5,"cid19":601.25,"cid20":543.75,"cid21":13.75,"cid22":400,"cid23":200,"cid24":41.25,"cid25":235,"cid26":108.75,"cid27":32.5,"cid28":177.5,"cid29":61.25,"cid30":320,"cid31":247.5,"cid32":340,"cid33":590,"cid34":230,"cid35":10,"cid36":22.5,"cid37":295,"cid38":306,"cid39":417.384,"cid40":17,"cid41":397.8,"cid42":483.75,"cid43":250,"cid44":100,"cid45":300,"cid46":409,"cid47":-200,"cid48":1090,"cid49":33,"cid50":109,"cid51":343,"cid52":41,"cid53":248,"cid54":178,"cid55":61,"cid56":344,"cid57":120,"cid58":255,"cid59":263,"cid60":296,"cid61":301,"cid62":298,"cid63":396,"cid64":201,"cid65":-42,"cid66":135,"cid67":1000,"cid68":164,"cid69":106,"cid70":189,"cid71":114,"cid72":221,"cid73":238,"cid74":23,"cid75":329,"cid76":80,"cid77":375}');
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
	objs.obj17=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj17);
	objs.obj18=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils étaient là. ',true); layers.content.addObject(objs.obj18);
	objs.obj19=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'À moins de cent mètres ',true); layers.content.addObject(objs.obj19);
	objs.obj20=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'derrière Simon. Bien décidés ',true); layers.content.addObject(objs.obj20);
	objs.obj21=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid36')+"px Verdana"},'à lui faire payer l’affront ',true); layers.content.addObject(objs.obj21);
	objs.obj22=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’ils avaient subi.',true); layers.content.addObject(objs.obj22);
	objs.obj23=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid36')+"px Verdana"},'La Meute. ',true); layers.content.addObject(objs.obj23);
	objs.obj24=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Quatre adolescents qui ',true); layers.content.addObject(objs.obj24);
	objs.obj25=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisaient régner leur loi au ',true); layers.content.addObject(objs.obj25);
	objs.obj26=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sein du foyer.',true); layers.content.addObject(objs.obj26);
	objs.obj27=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Recroquevillé dans la ',true); layers.content.addObject(objs.obj27);
	objs.obj28=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pénombre d’un porche, ',true); layers.content.addObject(objs.obj28);
	objs.obj29=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'L’adolescent contemplait le ',true); layers.content.addObject(objs.obj29);
	objs.obj30=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballet des lampes torches qui ',true); layers.content.addObject(objs.obj30);
	objs.obj31=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déchiraient la nuit. Des ',true); layers.content.addObject(objs.obj31);
	objs.obj32=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'yeux, scrutant le moindre ',true); layers.content.addObject(objs.obj32);
	objs.obj33=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'recoin, repoussant les ',true); layers.content.addObject(objs.obj33);
	objs.obj34=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres de leurs lueurs ',true); layers.content.addObject(objs.obj34);
	objs.obj35=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'cyclopes. ',true);
	objs.obj35.addLink(new mse.Link('cyclopes',18,'wiki',wikis.Cyclope)); layers.content.addObject(objs.obj35);
	objs.obj36=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt, ils seraient sur lui. ',true); layers.content.addObject(objs.obj36);
	objs.obj37=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon frissonna en songeant ',true); layers.content.addObject(objs.obj37);
	objs.obj38=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'à ce qui allait lui arriver. Il ',true); layers.content.addObject(objs.obj38);
	objs.obj39=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'savait que Kevin, leur chef, ',true); layers.content.addObject(objs.obj39);
	objs.obj40=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sans pitié…  ',true); layers.content.addObject(objs.obj40);
	objs.obj41=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il fallait qu’il leur échappe.',true); layers.content.addObject(objs.obj41);
	objs.obj42=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Absolument. Et tant pis s’il ',true); layers.content.addObject(objs.obj42);
	objs.obj43=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ne pouvait jamais retourner ',true); layers.content.addObject(objs.obj43);
	objs.obj44=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au foyer.',true); layers.content.addObject(objs.obj44);
	objs.obj45=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les pas se rapprochaient, de ',true); layers.content.addObject(objs.obj45);
	objs.obj46=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus en plus. Il pouvait ',true); layers.content.addObject(objs.obj46);
	objs.obj47=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'entendre leurs voix à ',true); layers.content.addObject(objs.obj47);
	objs.obj48=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'présent.',true); layers.content.addObject(objs.obj48);
	objs.obj601=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj601);
	objs.obj602=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Trouvez-moi ce sale petit ',true);
	objs.obj601.addObject(objs.obj602);
	objs.obj603=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'rat ! Il va comprendre ',true);
	objs.obj601.addObject(objs.obj603);
	objs.obj607=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’on ne peut pas se ',true);
	objs.obj601.addObject(objs.obj607);
	objs.obj608=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'moquer de nous comme ça !',true);
	objs.obj601.addObject(objs.obj608);
	objs.obj612=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj612);
	objs.obj613=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Ouaip, on va lui faire sa ',true);
	objs.obj612.addObject(objs.obj613);
	objs.obj614=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'fête !',true);
	objs.obj612.addObject(objs.obj614);
	objs.obj617=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ca, c’était « La Fouine ».',true); layers.content.addObject(objs.obj617);
	objs.obj616=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dix sept ans, un mètre',true); layers.content.addObject(objs.obj616);
	objs.obj57=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'quatre-vingt, ',true); layers.content.addObject(objs.obj57);
	objs.obj58=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'soixante-quinze kilos de ',true); layers.content.addObject(objs.obj58);
	objs.obj59=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'violence pure. Une véritable ',true); layers.content.addObject(objs.obj59);
	objs.obj60=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bombe ambulante qui ne ',true); layers.content.addObject(objs.obj60);
	objs.obj61=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'demandait qu’à exploser. ',true); layers.content.addObject(objs.obj61);
	objs.obj62=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon se pencha un instant ',true); layers.content.addObject(objs.obj62);
	objs.obj63=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'hors de son abri pour ',true); layers.content.addObject(objs.obj63);
	objs.obj64=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'évaluer ses chances de leur ',true); layers.content.addObject(objs.obj64);
	objs.obj65=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'échapper. ',true); layers.content.addObject(objs.obj65);
	objs.obj66=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Proche du zéro absolu s’il ne ',true); layers.content.addObject(objs.obj66);
	objs.obj67=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bougeait pas de sa cachette. ',true); layers.content.addObject(objs.obj67);
	objs.obj68=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un peu plus s’il tentait une ',true); layers.content.addObject(objs.obj68);
	objs.obj69=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sortie. À condition de tomber ',true); layers.content.addObject(objs.obj69);
	objs.obj70=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur quelqu’un, un adulte qui ',true); layers.content.addObject(objs.obj70);
	objs.obj71=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'saurait éloigner ses ',true); layers.content.addObject(objs.obj71);
	objs.obj72=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants. ',true); layers.content.addObject(objs.obj72);
	objs.obj618=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj618);
	objs.obj619=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Tu es prêt ? chuchota-t-il ',true);
	objs.obj618.addObject(objs.obj619);
	objs.obj620=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'à Dark.',true);
	objs.obj618.addObject(objs.obj620);
	objs.obj75=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Dark. Vador. Son rat albinos. ',true);
	objs.obj75.addLink(new mse.Link('albinos',53,'wiki',wikis.albinos)); layers.content.addObject(objs.obj75);
	objs.obj76=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Son plus fidèle compagnon ',true); layers.content.addObject(objs.obj76);
	objs.obj77=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'depuis un an. ',true); layers.content.addObject(objs.obj77);
	objs.obj78=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le seul en vérité. ',true); layers.content.addObject(objs.obj78);
	objs.obj79=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon repoussa l’élan de ',true); layers.content.addObject(objs.obj79);
	objs.obj80=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mélancolie qui menaçait de ',true); layers.content.addObject(objs.obj80);
	objs.obj81=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le submerger et enfouit Dark ',true); layers.content.addObject(objs.obj81);
	objs.obj1327=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au fond de son sac.',true); layers.content.addObject(objs.obj1327);
	objs.obj1324=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj1324);
	objs.obj1325=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il passa les lanières autour ',true); layers.content.addObject(objs.obj1325);
	objs.obj1326=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de ses épaules et s’élança.',true); layers.content.addObject(objs.obj1326);
	objs.obj85=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas de réaction.',true); layers.content.addObject(objs.obj85);
	objs.obj86=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il s’était mis à courir comme ',true); layers.content.addObject(objs.obj86);
	objs.obj87=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'si sa vie en dépendait. ',true); layers.content.addObject(objs.obj87);
	objs.obj585=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Si la Meute lui tombait',true); layers.content.addObject(objs.obj585);
	objs.obj89=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dessus, il était bon pour un ',true); layers.content.addObject(objs.obj89);
	objs.obj90=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'passage à tabac dans les ',true); layers.content.addObject(objs.obj90);
	objs.obj91=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'règles de l’art. Voilà ce qui ',true); layers.content.addObject(objs.obj91);
	objs.obj92=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'se passe lorsque l’on refuse ',true); layers.content.addObject(objs.obj92);
	objs.obj93=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de soumettre aux plus forts.',true); layers.content.addObject(objs.obj93);
	objs.obj94=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon évitait de regarder ',true); layers.content.addObject(objs.obj94);
	objs.obj95=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans leur direction, les yeux ',true); layers.content.addObject(objs.obj95);
	objs.obj96=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rivés sur les frondaisons du ',true);
	objs.obj96.addLink(new mse.Link('frondaisons',75,'wiki',wikis.frondaison)); layers.content.addObject(objs.obj96);
	objs.obj97=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Parc Montsouris. Des arbres, ',true); layers.content.addObject(objs.obj97);
	objs.obj98=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de la pénombre et des ',true); layers.content.addObject(objs.obj98);
	objs.obj99=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'milliards de recoins où il ',true); layers.content.addObject(objs.obj99);
	objs.obj100=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pourrait se dissimuler en ',true); layers.content.addObject(objs.obj100);
	objs.obj101=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'attendant l’aube. ',true); layers.content.addObject(objs.obj101);
	objs.obj102=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’il atteignait le jardin, il ',true); layers.content.addObject(objs.obj102);
	objs.obj103=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'serait sauvé.',true); layers.content.addObject(objs.obj103);
	objs.obj104=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, dans sa précipitation, il ',true); layers.content.addObject(objs.obj104);
	objs.obj105=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'butta contre le trottoir. Le ',true); layers.content.addObject(objs.obj105);
	objs.obj106=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'béton lui arracha une ',true); layers.content.addObject(objs.obj106);
	objs.obj107=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plainte. Un cri minuscule.',true); layers.content.addObject(objs.obj107);
	objs.obj108=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj108);
	objs.obj621=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj621);
	objs.obj622=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il est là !',true);
	objs.obj621.addObject(objs.obj622);
	objs.obj110=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj110);
	objs.obj111=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas assez minuscule, ',true); layers.content.addObject(objs.obj111);
	objs.obj112=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visiblement.',true); layers.content.addObject(objs.obj112);
	objs.obj113=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon détala tandis que les ',true); layers.content.addObject(objs.obj113);
	objs.obj114=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'faisceaux accrochaient sa ',true); layers.content.addObject(objs.obj114);
	objs.obj115=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'silhouette. ',true); layers.content.addObject(objs.obj115);
	objs.obj573=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj573);
	objs.obj595=new mse.Image(layers.content,{"size":[mse.coor('cid38'),mse.coor('cid39')],"pos":[mse.coor('cid40'),mse.coor('cid3')]},'src10');
	objs.obj595.activateZoom(); layers.content.addObject(objs.obj595);
	objs.obj594=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj594);
	objs.obj623=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj623);
	objs.obj624=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Choppez-le ! Faut qu’il ',true);
	objs.obj623.addObject(objs.obj624);
	objs.obj625=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'comprenne !',true);
	objs.obj623.addObject(objs.obj625);
	objs.obj118=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Que je comprenne quoi ? ',true); layers.content.addObject(objs.obj118);
	objs.obj119=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Qu’il faut se laisser faire ? ',true); layers.content.addObject(objs.obj119);
	objs.obj120=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas question !',true); layers.content.addObject(objs.obj120);
	objs.obj121=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il accéléra. ',true);
	objs.obj121.addLink(new mse.Link('accéléra',102,'audio',mse.src.getSrc('src17'))); layers.content.addObject(objs.obj121);
	objs.obj122=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il essayait d’oublier que ses ',true); layers.content.addObject(objs.obj122);
	objs.obj123=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poumons le brûlaient, qu’il ',true); layers.content.addObject(objs.obj123);
	objs.obj124=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'était épuisé par cette ',true); layers.content.addObject(objs.obj124);
	objs.obj125=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuite qui durait depuis ',true); layers.content.addObject(objs.obj125);
	objs.obj126=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'des heures, et surtout que la ',true); layers.content.addObject(objs.obj126);
	objs.obj127=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peur menaçait de le ',true); layers.content.addObject(objs.obj127);
	objs.obj128=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'paralyser à tout instant. ',true); layers.content.addObject(objs.obj128);
	objs.obj129=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il traversa le boulevard, ',true); layers.content.addObject(objs.obj129);
	objs.obj130=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'déclenchant le klaxon ',true);
	objs.obj130.addLink(new mse.Link('klaxon',111,'audio',mse.src.getSrc('src18'))); layers.content.addObject(objs.obj130);
	objs.obj131=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'furieux d’un noctambule ',true);
	objs.obj131.addLink(new mse.Link('noctambule',112,'wiki',wikis.Noctambule)); layers.content.addObject(objs.obj131);
	objs.obj132=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'égaré. Puis il s’engouffra à ',true); layers.content.addObject(objs.obj132);
	objs.obj133=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’abri des arbres. Son sac ',true); layers.content.addObject(objs.obj133);
	objs.obj134=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ballotait sur ses épaules et il ',true); layers.content.addObject(objs.obj134);
	objs.obj135=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pensa au pauvre Dark. ',true); layers.content.addObject(objs.obj135);
	objs.obj136=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sans réfléchir, il pénétra ',true); layers.content.addObject(objs.obj136);
	objs.obj137=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans une petite allée. Il ',true); layers.content.addObject(objs.obj137);
	objs.obj138=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dépassa les angles du ',true); layers.content.addObject(objs.obj138);
	objs.obj139=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pavillon météo qui s’élevait ',true); layers.content.addObject(objs.obj139);
	objs.obj140=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans la pénombre, puis il ',true); layers.content.addObject(objs.obj140);
	objs.obj141=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ralentit sa course. ',true); layers.content.addObject(objs.obj141);
	objs.obj142=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Pas un bruit.',true); layers.content.addObject(objs.obj142);
	objs.obj143=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Rien d’autre que le vent ',true); layers.content.addObject(objs.obj143);
	objs.obj144=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'dans les feuilles. ',true); layers.content.addObject(objs.obj144);
	objs.obj145=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Où étaient-ils passés ?',true); layers.content.addObject(objs.obj145);
	objs.obj146=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon s’arrêta, s’accroupit ',true); layers.content.addObject(objs.obj146);
	objs.obj147=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'derrière un banc scarifié de ',true); layers.content.addObject(objs.obj147);
	objs.obj148=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'graffitis. ',true); layers.content.addObject(objs.obj148);
	objs.obj149=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Là ! Sur sa gauche. ',true); layers.content.addObject(objs.obj149);
	objs.obj574=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj574);
	objs.obj597=new mse.Image(layers.content,{"size":[mse.coor('cid38'),mse.coor('cid41')],"pos":[mse.coor('cid40'),mse.coor('cid3')]},'src13');
	objs.obj597.activateZoom(); layers.content.addObject(objs.obj597);
	objs.obj596=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj596);
	objs.obj150=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il avait reconnu la démarche ',true); layers.content.addObject(objs.obj150);
	objs.obj151=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chaloupée de la Fouine, les ',true); layers.content.addObject(objs.obj151);
	objs.obj152=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'pas lourds de l’Ours – seize ',true);
	objs.obj152.addLink(new mse.Link('pas',136,'audio',mse.src.getSrc('src19'))); layers.content.addObject(objs.obj152);
	objs.obj153=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ans, un QI inversement ',true); layers.content.addObject(objs.obj153);
	objs.obj154=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'proportionnel à sa force - à ',true); layers.content.addObject(objs.obj154);
	objs.obj155=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ses côtés. Les deux autres ',true); layers.content.addObject(objs.obj155);
	objs.obj156=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'suivaient la ligne de ',true); layers.content.addObject(objs.obj156);
	objs.obj157=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tramway qui longeait le parc, ',true); layers.content.addObject(objs.obj157);
	objs.obj158=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur sa droite.',true); layers.content.addObject(objs.obj158);
	objs.obj159=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le groupe s’était séparé en ',true); layers.content.addObject(objs.obj159);
	objs.obj160=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'deux et tentait de ',true); layers.content.addObject(objs.obj160);
	objs.obj161=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’encercler.',true); layers.content.addObject(objs.obj161);
	objs.obj162=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon réfléchit à toute ',true); layers.content.addObject(objs.obj162);
	objs.obj163=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'allure. ',true); layers.content.addObject(objs.obj163);
	objs.obj164=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Le RER ! ',true);
	objs.obj164.addLink(new mse.Link('RER',148,'audio',mse.src.getSrc('src20'))); layers.content.addObject(objs.obj164);
	objs.obj165=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La station ne devait être ',true); layers.content.addObject(objs.obj165);
	objs.obj166=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'qu’à quelques dizaines de ',true); layers.content.addObject(objs.obj166);
	objs.obj167=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mètres devant lui et, même ',true); layers.content.addObject(objs.obj167);
	objs.obj168=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'en ces heures tardives, il y ',true); layers.content.addObject(objs.obj168);
	objs.obj169=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'aurait sans doute un peu de ',true); layers.content.addObject(objs.obj169);
	objs.obj170=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'monde. ',true); layers.content.addObject(objs.obj170);
	objs.obj171=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il reprit sa progression, ',true); layers.content.addObject(objs.obj171);
	objs.obj172=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lentement, veillant à rester ',true); layers.content.addObject(objs.obj172);
	objs.obj173=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'invisible. ',true); layers.content.addObject(objs.obj173);
	objs.obj174=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Plus que cinquante mètres.',true); layers.content.addObject(objs.obj174);
	objs.obj175=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il entendait déjà le ',true); layers.content.addObject(objs.obj175);
	objs.obj176=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'crissement des rames sur les ',true); layers.content.addObject(objs.obj176);
	objs.obj177=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rails.',true); layers.content.addObject(objs.obj177);
	objs.obj590=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj590);
	objs.obj178=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid36')+"px Verdana"},'Quarante.',true); layers.content.addObject(objs.obj178);
	objs.obj591=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj591);
	objs.obj626=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj626);
	objs.obj627=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Là sur le pont ! Il essaye ',true);
	objs.obj626.addObject(objs.obj627);
	objs.obj628=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de rejoindre la gare !',true);
	objs.obj626.addObject(objs.obj628);
	objs.obj629=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj629);
	objs.obj630=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Merde ! lâcha Simon en ',true);
	objs.obj629.addObject(objs.obj630);
	objs.obj631=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'reprenant sa course.',true);
	objs.obj629.addObject(objs.obj631);
	objs.obj592=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj592);
	objs.obj183=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid36')+"px Verdana"},'Trente.',true); layers.content.addObject(objs.obj183);
	objs.obj593=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj593);
	objs.obj184=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais la meute, galvanisée ',true); layers.content.addObject(objs.obj184);
	objs.obj185=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'par la proximité de sa proie, ',true); layers.content.addObject(objs.obj185);
	objs.obj186=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'se rapprochait rapidement. ',true); layers.content.addObject(objs.obj186);
	objs.obj187=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Ils avaient de la lumière, ils ',true); layers.content.addObject(objs.obj187);
	objs.obj188=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'évitaient les obstacles. ',true); layers.content.addObject(objs.obj188);
	objs.obj189=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Surtout ils étaient plus âgés, ',true); layers.content.addObject(objs.obj189);
	objs.obj190=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'plus forts alors que lui était ',true); layers.content.addObject(objs.obj190);
	objs.obj191=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'éreinté, les jambes ',true); layers.content.addObject(objs.obj191);
	objs.obj192=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'écorchées par les ronces, au ',true); layers.content.addObject(objs.obj192);
	objs.obj193=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bord de l’asphyxie.',true); layers.content.addObject(objs.obj193);
	objs.obj194=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les deux groupes gagnaient ',true); layers.content.addObject(objs.obj194);
	objs.obj195=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'insensiblement du terrain. ',true); layers.content.addObject(objs.obj195);
	objs.obj196=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Bientôt ils se rejoindraient et ',true); layers.content.addObject(objs.obj196);
	objs.obj197=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ce serait l’hallali.',true);
	objs.obj197.addLink(new mse.Link('l’hallali',183,'wiki',wikis.hallali)); layers.content.addObject(objs.obj197);
	objs.obj198=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon obliqua brutalement ',true); layers.content.addObject(objs.obj198);
	objs.obj199=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'vers le nord pour essayer de ',true); layers.content.addObject(objs.obj199);
	objs.obj200=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'rejoindre un bouquet ',true); layers.content.addObject(objs.obj200);
	objs.obj201=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'d’arbres denses. Avec un ',true); layers.content.addObject(objs.obj201);
	objs.obj202=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'peu de chance, il pourrait les ',true); layers.content.addObject(objs.obj202);
	objs.obj203=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'semer. Au pire, il grimperait ',true); layers.content.addObject(objs.obj203);
	objs.obj204=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'sur l’un des troncs ',true); layers.content.addObject(objs.obj204);
	objs.obj205=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'centenaires. ',true); layers.content.addObject(objs.obj205);
	objs.obj206=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se précipita dans le ',true); layers.content.addObject(objs.obj206);
	objs.obj207=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bosquet. Les branches ',true); layers.content.addObject(objs.obj207);
	objs.obj208=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'basses fouettèrent son ',true); layers.content.addObject(objs.obj208);
	objs.obj209=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'visage, lui arrachant des ',true); layers.content.addObject(objs.obj209);
	objs.obj210=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'larmes. ',true); layers.content.addObject(objs.obj210);
	objs.obj211=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était presqu’à l’abri : ',true); layers.content.addObject(objs.obj211);
	objs.obj212=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité était totale. ',true); layers.content.addObject(objs.obj212);
	objs.obj213=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il ignorait vers quoi il ',true); layers.content.addObject(objs.obj213);
	objs.obj214=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'courrait mais il s’en fichait. ',true); layers.content.addObject(objs.obj214);
	objs.obj215=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il accéléra encore et…',true); layers.content.addObject(objs.obj215);
	objs.obj216=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'S’effondra brutalement, le ',true); layers.content.addObject(objs.obj216);
	objs.obj217=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'souffle coupé, une violente ',true); layers.content.addObject(objs.obj217);
	objs.obj218=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'douleur barrant sa poitrine. ',true); layers.content.addObject(objs.obj218);
	objs.obj219=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il venait de heurter quelque ',true); layers.content.addObject(objs.obj219);
	objs.obj220=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'chose de plein fouet. ',true); layers.content.addObject(objs.obj220);
	objs.obj221=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Abasourdi, Simon fouilla ',true); layers.content.addObject(objs.obj221);
	objs.obj222=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’obscurité. Il entendait ses ',true); layers.content.addObject(objs.obj222);
	objs.obj223=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'poursuivants battre les talus ',true); layers.content.addObject(objs.obj223);
	objs.obj224=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et les fourrés. ',true); layers.content.addObject(objs.obj224);
	objs.obj225=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il tâtonna un instant dans ',true); layers.content.addObject(objs.obj225);
	objs.obj226=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'son sac. ',true); layers.content.addObject(objs.obj226);
	objs.obj227=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Sa torche.',true); layers.content.addObject(objs.obj227);
	objs.obj228=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un faible halo de lumière.',true); layers.content.addObject(objs.obj228);
	objs.obj229=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un grillage. ',true); layers.content.addObject(objs.obj229);
	objs.obj589=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj589);
	objs.obj230=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Piégé !',true); layers.content.addObject(objs.obj230);
	objs.obj588=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},' ',true); layers.content.addObject(objs.obj588);
	objs.obj231=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se redressa en grimaçant, ',true); layers.content.addObject(objs.obj231);
	objs.obj232=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'s’approcha.  ',true); layers.content.addObject(objs.obj232);
	objs.obj233=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Une dizaine de mètres en ',true); layers.content.addObject(objs.obj233);
	objs.obj234=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'contrebas, le faisceau de sa ',true); layers.content.addObject(objs.obj234);
	objs.obj235=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lampe illumina les reliefs ',true); layers.content.addObject(objs.obj235);
	objs.obj236=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mangés de rouille d’une ',true); layers.content.addObject(objs.obj236);
	objs.obj237=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ligne de chemin de fer ',true); layers.content.addObject(objs.obj237);
	objs.obj238=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'abandonnée.',true); layers.content.addObject(objs.obj238);
	objs.obj239=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'La Petite Ceinture. ',true);
	objs.obj239.addLink(new mse.Link('La Petite Ceinture',227,'wiki',wikis.pCeinture)); layers.content.addObject(objs.obj239);
	objs.obj240=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Un éclat de voix derrière lui ',true); layers.content.addObject(objs.obj240);
	objs.obj241=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le fit sursauter.',true); layers.content.addObject(objs.obj241);
	objs.obj632=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'ours', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj632);
	objs.obj633=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'On le tient !',true);
	objs.obj632.addObject(objs.obj633);
	objs.obj243=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon fixa le puits de ',true); layers.content.addObject(objs.obj243);
	objs.obj244=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'ténèbres qui s’étendait ',true); layers.content.addObject(objs.obj244);
	objs.obj245=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'au-delà du grillage.',true); layers.content.addObject(objs.obj245);
	objs.obj634=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj634);
	objs.obj635=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Alors, t’es enfin prêt à ',true);
	objs.obj634.addObject(objs.obj635);
	objs.obj636=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'recevoir ta leçon ?',true);
	objs.obj634.addObject(objs.obj636);
	objs.obj248=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Kevin s’approcha dans la ',true); layers.content.addObject(objs.obj248);
	objs.obj249=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'clarté de la lune. Il tendit le ',true); layers.content.addObject(objs.obj249);
	objs.obj250=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bras. Un bruit de ressort. ',true); layers.content.addObject(objs.obj250);
	objs.obj251=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Une lame apparut au bout ',true); layers.content.addObject(objs.obj251);
	objs.obj252=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de sa main. ',true); layers.content.addObject(objs.obj252);
	objs.obj253=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'L’adolescent sentait le sang ',true); layers.content.addObject(objs.obj253);
	objs.obj254=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'battre contre ses tempes, ',true); layers.content.addObject(objs.obj254);
	objs.obj255=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'l’adrénaline inonder son ',true); layers.content.addObject(objs.obj255);
	objs.obj256=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'corps. Il voulait gagner du ',true); layers.content.addObject(objs.obj256);
	objs.obj257=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'temps pour récupérer. Pour ',true); layers.content.addObject(objs.obj257);
	objs.obj258=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'tenter quelque chose. ',true); layers.content.addObject(objs.obj258);
	objs.obj259=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il se retourna face à ses ',true); layers.content.addObject(objs.obj259);
	objs.obj260=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'adversaires.',true); layers.content.addObject(objs.obj260);
	objs.obj637=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj637);
	objs.obj638=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Je n’ai fait que défendre ',true);
	objs.obj637.addObject(objs.obj638);
	objs.obj639=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Rachel. Vous n’aviez pas ',true);
	objs.obj637.addObject(objs.obj639);
	objs.obj642=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'le droit de vous en prendre à ',true);
	objs.obj637.addObject(objs.obj642);
	objs.obj643=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'elle.',true);
	objs.obj637.addObject(objs.obj643);
	objs.obj644=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj644);
	objs.obj645=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'T’avais qu’à pas te mêler ',true);
	objs.obj644.addObject(objs.obj645);
	objs.obj646=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'de nos affaires.',true);
	objs.obj644.addObject(objs.obj646);
	objs.obj647=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'simon', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.content.addObject(objs.obj647);
	objs.obj648=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Quatre contre un, vous ',true);
	objs.obj647.addObject(objs.obj648);
	objs.obj649=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'n’êtes que des lâches !',true);
	objs.obj647.addObject(objs.obj649);
	objs.obj269=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon avait lancé ça tout en ',true); layers.content.addObject(objs.obj269);
	objs.obj270=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'jetant un bref coup d’œil ',true); layers.content.addObject(objs.obj270);
	objs.obj271=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'autour de lui. Il avait aperçu ',true); layers.content.addObject(objs.obj271);
	objs.obj272=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la grosse pierre au pied du ',true); layers.content.addObject(objs.obj272);
	objs.obj273=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage. Un bon tremplin…',true); layers.content.addObject(objs.obj273);
	objs.obj274=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Kevin fulminait. ',true); layers.content.addObject(objs.obj274);
	objs.obj654=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj654);
	objs.obj655=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Amenez-le moi !',true);
	objs.obj654.addObject(objs.obj655);
	objs.obj276=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Les trois autres s’élancèrent. ',true); layers.content.addObject(objs.obj276);
	objs.obj277=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais, juste avant que leurs ',true); layers.content.addObject(objs.obj277);
	objs.obj278=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'mains ne se referment sur ',true); layers.content.addObject(objs.obj278);
	objs.obj279=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'lui, il s’était jeté sur le côté. ',true); layers.content.addObject(objs.obj279);
	objs.obj280=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'D’une roulade il avait atteint ',true); layers.content.addObject(objs.obj280);
	objs.obj281=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'la pierre. Il se redressa d’un ',true); layers.content.addObject(objs.obj281);
	objs.obj282=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'bond, prit appui sur le rocher ',true); layers.content.addObject(objs.obj282);
	objs.obj283=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'et entreprit l’escalade du ',true); layers.content.addObject(objs.obj283);
	objs.obj284=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'grillage.',true); layers.content.addObject(objs.obj284);
	objs.obj656=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'kevin', null , mse.coor(mse.joinCoor(45)) , '#937291' ); layers.content.addObject(objs.obj656);
	objs.obj657=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Il va s’échapper ! Faites ',true);
	objs.obj656.addObject(objs.obj657);
	objs.obj658=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'quelque chose !',true);
	objs.obj656.addObject(objs.obj658);
	objs.obj659=new mse.Speaker( layers.content,{"size":[mse.coor('cid32'),mse.coor('cid2')]}, 'fouine', null , mse.coor(mse.joinCoor(45)) , '#f00' ); layers.content.addObject(objs.obj659);
	objs.obj660=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'Mais… Il ne peut pas ',true);
	objs.obj659.addObject(objs.obj660);
	objs.obj661=new mse.Text(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid12')]},'aller loin, il n’y a rien ',true);
	objs.obj659.addObject(objs.obj661);
	objs.obj663=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'après.',true);
	objs.obj659.addObject(objs.obj663);
	objs.obj572=new FindSimon(); layers.content.addGame(objs.obj572);
	objs.obj289=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'C’était vrai.',true); layers.content.addObject(objs.obj289);
	objs.obj290=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Il n’y avait plus rien. Rien ',true); layers.content.addObject(objs.obj290);
	objs.obj291=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'d’autre qu’un énorme trou ',true); layers.content.addObject(objs.obj291);
	objs.obj292=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'de ténèbres. ',true); layers.content.addObject(objs.obj292);
	objs.obj293=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Mais il était trop tard pour ',true); layers.content.addObject(objs.obj293);
	objs.obj294=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'reculer. ',true); layers.content.addObject(objs.obj294);
	objs.obj295=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]},'Simon s’élança dans le vide.',true); layers.content.addObject(objs.obj295);
	objs.obj575=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid12')]}); layers.content.addObject(objs.obj575);
	objs.obj576=new mse.Text(layers.content,{"size":[mse.coor('cid32'),mse.coor('cid12')],"pos":[mse.coor('cid2'),mse.coor('cid42')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid27')+"px Verdana","textAlign":"center"},'À SUIVRE...',true); layers.content.addObject(objs.obj576);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.fouine=new mse.Animation(22,1,true);
	animes.fouine.block=true;
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')],'fillStyle':'rgb(255, 255, 255)'});
	animes.fouine.addObj('obj567',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid43'),mse.coor('cid44')],'size':[mse.coor('cid45'),mse.coor('cid46')]},'src0');
	animes.fouine.addObj('src0',temp.obj);
	animes.fouine.addAnimation('obj567',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]')});
	animes.fouine.addAnimation('src0',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]'),'pos':[[mse.coor('cid43'),mse.coor('cid44')],[mse.coor('cid43'),mse.coor('cid44')],[mse.coor('cid43'),mse.coor('cid44')],[mse.coor('cid43'),mse.coor('cid44')],[mse.coor('cid2'),mse.coor('cid47')],[mse.coor('cid2'),mse.coor('cid47')]],'size':[[mse.coor('cid45'),mse.coor('cid46')],[mse.coor('cid45'),mse.coor('cid46')],[mse.coor('cid45'),mse.coor('cid46')],[mse.coor('cid45'),mse.coor('cid46')],[mse.coor('cid0'),mse.coor('cid48')],[mse.coor('cid0'),mse.coor('cid48')]]});
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
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid23'),mse.coor('cid56')],'size':[mse.coor('cid57'),mse.coor('cid58')]},'src6',[[186,0,119,254]]);
	animes.simcour.addObj('src6',temp.obj);
	temp.obj.appendFrame([362,0,260,254]);
	temp.obj.appendFrame([0,0,299,254]);
	temp.obj.appendFrame([302,0,199,254]);
	animes.simcour.addAnimation('src6',{'frame':JSON.parse('[0,13,16,19,22,25,28,31,34,37,40,43,46,49,52,55,58]'),'opacity':JSON.parse('[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0]'),'spriteSeq':JSON.parse('[0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,3]'),'size':[[mse.coor('cid57'),mse.coor('cid58')],[mse.coor('cid57'),mse.coor('cid58')],[mse.coor('cid57'),mse.coor('cid58')],[mse.coor('cid57'),mse.coor('cid58')],[mse.coor('cid59'),mse.coor('cid58')],[mse.coor('cid59'),mse.coor('cid58')],[mse.coor('cid59'),mse.coor('cid58')],[mse.coor('cid59'),mse.coor('cid58')],[mse.coor('cid61'),mse.coor('cid58')],[mse.coor('cid61'),mse.coor('cid58')],[mse.coor('cid61'),mse.coor('cid58')],[mse.coor('cid61'),mse.coor('cid58')],[mse.coor('cid64'),mse.coor('cid58')],[mse.coor('cid64'),mse.coor('cid58')],[mse.coor('cid64'),mse.coor('cid58')],[mse.coor('cid64'),mse.coor('cid58')],[mse.coor('cid64'),mse.coor('cid58')]],'pos':[[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid23'),mse.coor('cid56')],[mse.coor('cid60'),mse.coor('cid56'),1],[mse.coor('cid60'),mse.coor('cid56'),1],[mse.coor('cid60'),mse.coor('cid56'),1],[mse.coor('cid62'),mse.coor('cid56')],[mse.coor('cid63'),mse.coor('cid56')],[mse.coor('cid63'),mse.coor('cid56')],[mse.coor('cid63'),mse.coor('cid56')],[mse.coor('cid63'),mse.coor('cid56')],[mse.coor('cid63'),mse.coor('cid56')]]});
	animes.piege=new mse.Animation(51,1,true);
	animes.piege.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')]},'grillageimg');
	animes.piege.addObj('grillageimg',temp.obj);
	temp.obj=new mse.Text(null,{'pos':[mse.coor('cid65'),mse.coor('cid66')],'size':[mse.coor('cid67'),mse.coor('cid45')],'fillStyle':'rgb(255, 255, 255)','textBaseline':'top','font':'normal '+mse.coor('cid34')+'px Verdana','textAlign':'left'},'Piégé!!!',true);
	animes.piege.addObj('obj587',temp.obj);
	animes.piege.addAnimation('grillageimg',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'opacity':JSON.parse('[0,1,1,1,1,0,0]')});
	animes.piege.addAnimation('obj587',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'fontSize':[mse.coor('cid34'),mse.coor('cid34'),mse.coor('cid68'),mse.coor('cid71'),mse.coor('cid71'),mse.coor('cid71'),mse.coor('cid71')],'pos':[[mse.coor('cid65'),mse.coor('cid66')],[mse.coor('cid65'),mse.coor('cid66')],[mse.coor('cid69'),mse.coor('cid70')],[mse.coor('cid72'),mse.coor('cid73')],[mse.coor('cid72'),mse.coor('cid73')],[mse.coor('cid72'),mse.coor('cid73')],[mse.coor('cid72'),mse.coor('cid73')]],'opacity':JSON.parse('[0,0,0.699999988079,1,1,0,0]')});
	animes.qurantAnim=new mse.Animation(15,1,false);
	animes.qurantAnim.block=true;
	animes.qurantAnim.addObj('obj178',objs.obj178);
	animes.qurantAnim.addAnimation('obj178',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid74'),mse.coor('cid76'),mse.coor('cid74'),mse.coor('cid74')]});
	animes.trentAnim=new mse.Animation(15,1,false);
	animes.trentAnim.block=true;
	animes.trentAnim.addObj('obj183',objs.obj183);
	animes.trentAnim.addAnimation('obj183',{'frame':JSON.parse('[0,8,14,15]'),'fontSize':[mse.coor('cid74'),mse.coor('cid76'),mse.coor('cid74'),mse.coor('cid74')]});
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
	action.startBack2Show=new mse.Script([{src:objs.obj132,type:'firstShow'}]);
	reaction.startBack2Show=function(){ 
		temp.width=objs.obj15.getWidth();temp.height=objs.obj15.getHeight();temp.boundingbox=imgBoundingInBox('src1',temp.width,temp.height);temp.obj=new mse.Image(objs.obj15.parent,temp.boundingbox,'src1');mse.transition(objs.obj15,temp.obj,25); 
	};
	action.startBack2Show.register(reaction.startBack2Show);
	action.showRat=new mse.Script([{src:objs.obj1325,type:'firstShow'}]);
	reaction.showRat=function(){ 
		games.RatGame.start(); 
	};
	action.showRat.register(reaction.showRat);
	action.simonCour=new mse.Script([{src:objs.obj85,type:'show'}]);
	reaction.simonCour=function(){ 
		animes.simcour.start(); 
	};
	action.simonCour.register(reaction.simonCour);
	action.startPiege=new mse.Script([{src:objs.obj230,type:'firstShow'}]);
	reaction.startPiege=function(){ 
		animes.piege.start(); 
	};
	action.startPiege.register(reaction.startPiege);
	action.piegesonplay=action.startPiege;
	reaction.piegesonplay=function(){ 
		mse.src.getSrc('src21').play(); 
	};
	action.piegesonplay.register(reaction.piegesonplay);
	action.showFouine=new mse.Script([{src:objs.obj617,type:'show'}]);
	reaction.showFouine=function(){ 
		animes.fouine.start(); 
	};
	action.showFouine.register(reaction.showFouine);
	action.start40Anim=new mse.Script([{src:objs.obj178,type:'firstShow'}]);
	reaction.start40Anim=function(){ 
		animes.qurantAnim.start(); 
	};
	action.start40Anim.register(reaction.start40Anim);
	action.start30Anim=new mse.Script([{src:objs.obj183,type:'firstShow'}]);
	reaction.start30Anim=function(){ 
		animes.trentAnim.start(); 
	};
	action.start30Anim.register(reaction.start30Anim);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);