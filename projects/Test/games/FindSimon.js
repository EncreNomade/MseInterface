// Game : Find Simon
function angleFor2Point(p1, p2) {
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
    mse.Game.call(this);
    this.msg = {
        "INIT": "Clique pour aider Simon à échapper à la Meute.",//Utilise les flèches de direction pour diriger Simon dans le parc.
        "WIN": "Bravo!!! Simon est sauvé."
    };
    this.state = "INIT";
    
    mse.src.addSource('parc', 'Parc/Parc.jpg', 'img', true);
    mse.src.addSource('perso_parc', 'Parc/personnages.png', 'img', true);
    mse.src.addSource('notice_parc', 'Parc/points-persos.png', 'img', true);
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
    
    this.init = function() {
        this.npc[3].v = 3;
        
        this.simondir = 0;
        this.simonrun.stop();
        this.simonstand.start();
        this.onmove = false;
        // Init Parc draw parameters
        this.sx = this.sy = this.sw = this.sh = this.dx = this.dy = this.dw = this.dh = 0;
        
        // Position of parc
        this.sp = new mse.Point2(225,725);
        this.pos = new mse.Point2(this.width/2-this.sp.x,this.height/2-this.sp.y);
        this.disx = this.disy = 0;
    	
    	// Key event listener
    	mse.root.evtDistributor.addListener('keydown', this.movecb, true, this);
    	mse.root.evtDistributor.addListener('keyup', this.moveovercb, true, this);
    	if(MseConfig.mobile){
    	    mse.root.evtDistributor.addListener('gestureUpdate', this.touchMovecb, true, this);
    	    mse.root.evtDistributor.addListener('gestureEnd', this.moveovercb, true, this);
    	}
    };
    
    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.offx, this.offy);
		// Clip masque for NPCs
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(this.width-5,0);
		ctx.lineTo(this.width-5,this.height-5);
		ctx.lineTo(0,this.height-5);
		ctx.closePath();
		ctx.clip();
		// Background
		ctx.drawImage(mse.src.getSrc('parc'), this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
		// Simon
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		ctx.rotate(this.simondir*Math.PI/180);
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
		// Ignore thé movement if collision
		if(this.colliDetect()) {this.pos.x -= this.disx; this.pos.y -= this.disy;}
		
		this.sp.x = this.width/2 - this.pos.x;
		this.sp.y = this.height/2 - this.pos.y;
		
		// Win check
		if(Math.abs(this.sp.x - 1690) <= 60 && Math.abs(this.sp.y - 290) <= 10) {
		    mse.root.evtDistributor.removeListener('keydown', this.movecb);
		    mse.root.evtDistributor.removeListener('keyup', this.moveoverc);
		    if(MseConfig.mobile){
		        mse.root.evtDistributor.removeListener('gestureUpdate', this.touchMovecb);
		        mse.root.evtDistributor.removeListener('gestureEnd', this.moveovercb);
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
		    if(dis <= 170 && adis <= n.visiona) {
		    // Simon is found!!!
		        // Remove Key event listener
		        mse.root.evtDistributor.removeListener('keydown', this.movecb);
		        mse.root.evtDistributor.removeListener('keyup', this.moveovercb);
		        if(MseConfig.mobile){
		            mse.root.evtDistributor.removeListener('gestureUpdate', this.touchMovecb);
		            mse.root.evtDistributor.removeListener('gestureEnd', this.moveovercb);
		        }
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
	        this.simonrun.start();
	        this.simonstand.stop();
	    }
	};
	this.touchMove = function(e) {
	    var valid = true;
	    var start = {x:e.listX[0],y:e.listY[0]};
	    var end = {x:e.offsetX,y:e.offsetY};
	    var a = angleFor2Point(start, end);
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
	        // Left
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
	};
	this.moveover = function(e) {
	    this.disx = 0; this.disy = 0;
	    this.onmove = false;
	    this.simonrun.stop();
	    this.simonstand.start();
	};
	// Init key listeners
	this.movecb = new mse.Callback(this.move, this);
	this.moveovercb = new mse.Callback(this.moveover, this);
	this.touchMovecb = new mse.Callback(this.touchMove, this);
};
extend(FindSimon, mse.Game);





var RatGame = function() {
	mse.Game.call(this);
	
	this.offx = 220; this.offy = 0;
	this.width = 360; this.height = 600;
	
	mse.src.addSource('ratImg', 'rat.png', 'img');
	var ratSit = new mse.Sprite(this,{pos:[30,this.height-80]}, 'ratImg', 80,50, 0,0,400,100);
	var ratHead = new mse.Sprite(this,{pos:[20,this.height-96]}, 'ratImg', 39,34, 400,0,39,34);
	var ratHang = new mse.Sprite(this, {pos:[45,this.height-80]}, 'ratImg', 40,113, 0,101,400,113);
	mse.src.addSource('sacImg', 'sac.png', 'img');
	var sac = new mse.Image(this, {pos:[this.width-160,20], insideRec:[60,40,60,60]}, 'sacImg');
	var pochet = new mse.Sprite(this, {pos:[this.width-100,175]}, 'sacImg', 60,40, 60,155,60,40);
	
	var seq = [0,1,2,3,4,5,6,7,8,9];
	var sitAnim = new mse.FrameAnimation(ratSit, seq, 0, 2);
	var hangAnim = new mse.FrameAnimation(ratHang, seq, 0, 2);
	
	this.dragStart = function(e) {
		var x = e.offsetX - this.offx;
		var y = e.offsetY - this.offy;
		if(x>30 && x<110 && y>this.height-80 && y<this.height-30) {
			this.sit = false;
			ratHang.offx = x-20; ratHang.offy = y-14;
			
			sitAnim.stop();
			hangAnim.start();
		}
	};
	this.dragMove = function(e) {
		var x = e.offsetX - this.offx-20;
		var y = e.offsetY - this.offy-14;
		ratHang.offx = x; ratHang.offy = y;
	};
	this.dragEnd = function(e) {
		var x = e.offsetX - this.offx;
		var y = e.offsetY - this.offy;
		if(this.sit) return;
		if(sac.inObj(e.offsetX, e.offsetY)) {
			var drop = new mse.KeyFrameAnimation(ratHang, {
					frame	: [0, 25, 35],
					pos		: [[x, y], [sac.offx+70,sac.offy+125], [sac.offx+70,sac.offy+125]]
				}, 1);
			drop.evtDeleg.addListener('end', new mse.Callback(this.end, this));
			drop.start();
			this.droped = true;
			mse.root.evtDistributor.removeListener('gestureStart', cbStart);
			mse.root.evtDistributor.removeListener('gestureUpdate', cbMove);
			mse.root.evtDistributor.removeListener('gestureEnd', cbEnd);
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
		mse.root.evtDistributor.addListener('gestureStart', cbStart, true, this);
		mse.root.evtDistributor.addListener('gestureUpdate', cbMove, true, this);
		mse.root.evtDistributor.addListener('gestureEnd', cbEnd, true, this);
		
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
extend(RatGame, mse.Game);