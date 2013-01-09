var WindowGame = function() {
    mse.Game.call(this);
    
    this.setDirectShow(true);
    this.firstShow = false;
    
    this.offx = mse.coor(mse.joinCoor(-10)); this.offy = mse.coor(mse.joinCoor(0));
    this.width = mse.coor(mse.joinCoor(360)); this.height = mse.coor(mse.joinCoor(356));
    this.radius = mse.coor(mse.joinCoor(131));
    
    mse.src.addSource('window', 'games/window.png', 'img', true);
    mse.src.addSource('finish', 'games/godown.png', 'img', true);
    
    this.window = new mse.Image(this, {size:[this.width, this.height]}, 'window');
    this.toit = new mse.Image(this, {size:[mse.coor(mse.joinCoor(800)), mse.coor(mse.joinCoor(600))]}, 'toit');
    this.toit.setPos(-this.toit.width/2, -this.toit.height/2);
    this.finish = new mse.Image(this, {pos:[mse.coor(mse.joinCoor(312)),mse.coor(mse.joinCoor(308))], size:[mse.coor(mse.joinCoor(48)),mse.coor(mse.joinCoor(48))]}, 'finish');
    
    var margin = mse.coor(mse.joinCoor(35));
    this.xmin = 2*margin+this.radius*2-this.toit.width;
    this.ymin = 2*margin+this.radius*2-this.toit.height;
    this.xmax = margin;
    this.ymax = margin;
    this.xcenter = (this.xmax+this.xmin)/2;
    this.ycenter = (this.ymax+this.ymin)/2;
    
    this.init = function() {
        this.parent.interrupt();
        
    	this.getEvtProxy().addListener('move', cbMove, true);
    	this.getEvtProxy().addListener('click', cbClick, true);
    };
    
    this.click = function(e) {
        this.getEvtProxy().removeListener('click', cbClick);
        mse.root.evtDistributor.setDominate(null);
        this.parent.play();
    };
    var cbClick = new mse.Callback(this.click, this);
    this.move = function(e) {
        var rx = e.offsetX - this.getX() - this.width/2;
        var ry = e.offsetY - this.getY() - this.height/2;
        var offx = this.xcenter-rx, offy = this.ycenter-ry;
        if(offx > this.xmax) offx = this.xmax;
        else if(offx < this.xmin) offx = this.xmin;
        if(offy > this.ymax) offy = this.ymax;
        else if(offy < this.ymin) offy = this.ymin;
        
        this.toit.setPos(offx, offy);
    };
    var cbMove = new mse.Callback(this.move, this);
    
    this.draw = function(ctx) {
        if(!this.firstShow) {
        	this.firstShow = true;
        	this.evtDeleg.eventNotif('firstShow');
        	this.evtDeleg.eventNotif('start');
        }
        ctx.save();
    	
    	ctx.beginPath();
    	ctx.arc(this.getX()+this.width/2,this.getY()+this.height/2, this.radius, 0, Math.PI*2);
    	ctx.clip();
    	
    	this.toit.draw(ctx);
    	ctx.restore();
    	
    	this.window.draw(ctx);
    	this.finish.draw(ctx);
    };
};
extend(WindowGame, mse.Game);var Balle = function(sprite, x, y, deltax, deltay, enemy) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.deltax = deltax;
    this.deltay = deltay;
    this.enemy = enemy ? true : false;
    this.state = "ENABLED";
};
Balle.prototype = {
    constructor: Balle,
    logic: function() {
        if(this.state == "ENABLED") {
            this.x += this.deltax;
            this.y += this.deltay;
            if(this.y < 200 || this.x < 0 || this.x > 600 || this.y > 440)
                this.state = "DISABLED";
        }
    },
    draw: function(ctx) {
        this.sprite.draw(ctx, this.x, this.y);
    }
};

var Vache = function(x, y, w, h, deltax, game) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.deltax = deltax;
    if(this.x <= 0) this.flip = true;
    else this.flip = false;
    this.game = game;
    this.count = 10;
    this.life = 6;
    
    this.sprite = new mse.Sprite(null, {size:[w,h]}, 'vache', 130,112, 0,0,780,224);
    this.effect = new mse.EIColorFilter(this.sprite, {rMulti:0, alpha:0.5, duration:16});
    this.walkAnime = new mse.FrameAnimation(this.sprite, [0,1,2,3,4,5], 0, 5);
    this.standAnime = new mse.FrameAnimation(this.sprite, [6,7,8,9], 1, 3);
    this.shootAnime = new mse.FrameAnimation(this.sprite, [9,10], 5, 3);
    this.standAnime.evtDeleg.addListener('end', new Callback(this.startShoot, this));
    this.shootAnime.evtDeleg.addListener('end', new Callback(this.startWalk, this));
    
    this.walkAnime.start();
    this.state = "WALKING";
};
Vache.prototype = {
    constructor: Vache,
    checkShooted: function(x,y) {
        var shooted = false;
        if(this.state == "WALKING" || this.state == "STANDING") {
            if(x > this.x && x < this.x+this.w*0.87 && y > this.y+this.h*0.45 && y < this.y+this.h) {
                this.sprite.startEffect(this.effect);
                this.life--;
                shooted = true;
            }
        }
        else if(this.state == "SHOOTING") {
            if(x > this.x+0.4*this.w && x < this.x+this.w*0.7 && y > this.y && y < this.y+this.h*0.8) {
                this.sprite.startEffect(this.effect);
                this.life--;
                shooted = true;
            }
        }
        else return shooted;
        if(this.life <= 0) {
            this.walkAnime.stop();
            this.shootAnime.stop();
            this.state = "DIEING";
            this.count = 10;
        }
        return shooted;
    },
    startShoot: function() {
        this.state = "SHOOTING";
        this.shootAnime.start();
    },
    startWalk: function() {
        this.state = "WALKING";
        this.walkAnime.start();
    },
    logic: function() {
        if(this.state == "WALKING") {
            this.x += this.deltax;
            if(this.x < -130 || this.x > 600)
                this.state = "DISABLED";
            
            var rand = randomInt(180);
            if(rand == 7){
                this.state = "STANDING";
                this.standAnime.start();
                this.walkAnime.stop();
            }
        }
        if(this.state == "SHOOTING") {
            if(this.count == 0) {
                var y = this.y+0.7*this.h-2.5;
                if(this.flip) var x = this.x+0.42*this.w-2.5;
                else var x = this.x+0.58*this.w-2.5;
                this.game.ballePool.initInstance(this.game.balVach, x, y, 0, 2, true);
                this.game.ballePool.initInstance(this.game.balVach, x, y, -0.8, 2, true);
                this.game.ballePool.initInstance(this.game.balVach, x, y, 0.8, 2, true);
                this.count = 10;
            }
            else this.count--;
        }
        if(this.state == "DIEING") {
            if(this.count == 0) {
                this.game.vachePool.release(this);
                this.game.dropSteaks(this.x + this.w/2, this.y + this.h/2);
            }
            this.effect.init({alpha:0.5+0.05*(10-this.count), duration:25});
            this.count--;
        }
        this.sprite.logic();
    },
    draw: function(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if(this.flip) {
            ctx.scale(-1,1);
            this.sprite.draw(ctx, -this.sprite.width, 0);
        }
        else this.sprite.draw(ctx, 0, 0);
        ctx.restore();
    }
};

var Steak = function(x, y, w, h, angle) {
    this.sp = new mse.Sprite(null, {size:[w,h]}, 'gameobjs', 16,6, 0,0,16,6);
    this.vx = 6 * Math.cos(angle);
    this.vy = 6 * Math.sin(angle);
    this.angle = angle;
    this.x = x;
    this.y = y;
    this.state = "DROPPING";
    this.count = 100;
};
Steak.prototype = {
    constructor: Steak,
    logic: function() {
        if(this.state == "DROPPING") {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 9.8*0.08;
            if(this.y >= 410) {
                this.y = 410;
                this.state = "DROPPED";
            }
        }
        else if(this.state == "DROPPED") {
            if(this.count > 0) this.count--;
            else this.state = "DISAPPEAR";
        }
    },
    draw: function(ctx) {
        this.sp.draw(ctx, this.x, this.y);
    }
};

var VacheGame = function() {
    mse.Game.call(this, {fillback:true, size:[600,440]});
    this.config.title = "Arthur et les vaches";
    
    this.msg = {
        "BEFOREINIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné",
        "LOSE": "Perdu..."
    };
    
    mse.src.addSource('decor', 'games/decors.jpg', 'img', true);
    mse.src.addSource('fence', 'games/fence.png', 'img', true);
    mse.src.addSource('arthuro', 'games/Arthuro.png', 'img', true);
    mse.src.addSource('gameobjs', 'games/Objets.png', 'img', true);
    mse.src.addSource('vache', 'games/vache.png', 'img', true);
    mse.src.addSource('oliviera', 'games/oliviera.jpg', 'img', true);

    this.decor = new mse.Image(null, {size:[600,440]}, 'decor');
    this.fence = new mse.Image(null, {pos:[0,336],size:[600,76]}, 'fence');
    this.heart = new mse.Sprite(null, {}, 'gameobjs', 24,24, 46,0,24,24);
    this.vise = new mse.Sprite(null, {}, 'gameobjs', 20,20, 26,0,20,20);
    this.balArth = new mse.Sprite(null, {}, 'gameobjs', 5,5, 16,0,5,5);
    this.balVach = new mse.Sprite(null, {}, 'gameobjs', 5,5, 21,0,5,5);
    this.fire = new mse.Sprite(null, {}, 'gameobjs', 16,14, 70,0,16,14);
    this.steak = new mse.Sprite(null, {}, 'gameobjs', 16,6, 0,0,16,6);
    
    this.arthuro = new mse.Sprite(null, {pos:[0,300]}, 'arthuro', 120,128, 0,0,840,512);
    this.walkright = new mse.FrameAnimation(this.arthuro, [14,15,16,17,18,19], 0, 3);
    this.walkleft = new mse.FrameAnimation(this.arthuro, [26,25,24,23,22,21], 0, 3);
    this.hurtEffet = new mse.EIColorFilter(this.arthuro, {rMulti:0, alpha:0.5, duration:50});
    this.oliviera = new mse.Image(null, {size:[600,440], globalAlpha:0}, 'oliviera');
    
    if(MseConfig.mobile) {
        mse.src.addSource('fire', 'games/fire.png', 'img', true);
        mse.src.addSource('leftbtn', 'games/left.png', 'img', true);
        mse.src.addSource('rightbtn', 'games/right.png', 'img', true);
        this.firebtn = new mse.Image(null, {pos:[this.width-120, this.height-100],size:[80,80]}, 'fire');
        this.leftbtn = new mse.Image(null, {pos:[30, this.height-100],size:[80,80]}, 'leftbtn');
        this.rightbtn = new mse.Image(null, {pos:[110, this.height-100],size:[80,80]}, 'rightbtn');
    }
    
    this.balles = [];
    this.ballePool = new ObjectPool(Balle, 30, this.balles);
    this.vaches = [];
    this.vachePool = new ObjectPool(Vache, 30, this.vaches);
    var vacheline = [
        {y:186, w:65, h:56},
        {y:215, w:89, h:77},
        {y:230, w:110, h:95}
    ];
    this.steaks = [];
    this.steakPool = new ObjectPool(Steak, 30, this.steaks);
    this.state = "BEFOREINIT";
    
    this.help = new mse.Text(null, {
        pos:[30, 60], 
        size:[540,30],
        fillStyle:"rgb(255,255,255)",
        font:"24px Arial",
        textAlign:"center",
        textBaseline:"top",
        lineHeight:25},
        "Simon imagine qu'Arthur essaye de tuer des vaches, va-t-il réussir à récupérer 20 steaks?\n \nUtilise les flèches pour diriger Arthur et la barre d'espace pour tirer.\n \n \nAttention! Les vaches du coin sont agressives!", true);
    
    this.init = function() {
        this.ballePool.clear();
        this.vachePool.clear();
        this.steakPool.clear();
        this.arthuro.setFrame(3);
        this.arthuro.endEffect();
        this.walking = 0;
        this.walkright.stop();
        this.walkleft.stop();
        this.onfire = false;
        this.firedelay = 0;
        this.heartCount = 3;
        this.steakCount = 0;
        this.currTime = 0;
        
        this.frequence = 100;
        this.nextVache = randomInt(this.frequence)+50;
        
        this.getEvtProxy().addListener('keydown', this.keydownCb);
        this.getEvtProxy().addListener('keyup', this.keyupCb);
        this.getEvtProxy().addListener('click', this.clickCb);
        if(MseConfig.mobile) {
            this.getEvtProxy().addListener('gestureStart', this.touchStartCb);
            this.getEvtProxy().addListener('gestureEnd', this.touchEndCb);
        }
        this.state = "INIT";
    };
    
    this.click = function(e) {
        this.state = "PLAYING";
        this.getEvtProxy().removeListener('click', this.clickCb);
    };
    this.keydown = function(e) {
        switch(e.keyCode) {
        case __KEY_SPACE:
            this.onfire = true;
            break;
        case __KEY_LEFT:
            if(this.walking != -1) {
                if(this.walking == 1) this.walkright.stop();
                this.walking = -1;
                this.walkleft.start();
            }
            break;
        case __KEY_RIGHT:
            if(this.walking != 1) {
                if(this.walking == -1) this.walkleft.stop();
                this.walking = 1;
                this.walkright.start();
            }
            break;
        default : return;
        }
    };
    this.keyup = function(e) {
        if(e.keyCode == __KEY_LEFT) {
            this.walkleft.stop();
            if(this.walking == -1) this.walking = 0;
            this.arthuro.setFrame(3);
        }
        if(e.keyCode == __KEY_RIGHT) {
            this.walkright.stop();
            if(this.walking == 1) this.walking = 0;
            this.arthuro.setFrame(3);
        }
        if(e.keyCode == __KEY_SPACE) {
            this.onfire = false;
        }
    };
    this.touchStart = function(e) {
        if(MseConfig.android || MseConfig.iPhone) {
            var x = e.offsetX/0.8;
            var y = e.offsetY/0.62;
        }
        else {
            var x = e.offsetX;
            var y = e.offsetY;
        }
        if(this.firebtn.inObj(x, y)) {
            this.onfire = true;
        }
        else if(this.leftbtn.inObj(x, y)) {
            if(this.walking != -1) {
                if(this.walking == 1) this.walkright.stop();
                this.walking = -1;
                this.walkleft.start();
            }
        }
        else if(this.rightbtn.inObj(x, y)) {
            if(this.walking != 1) {
                if(this.walking == -1) this.walkleft.stop();
                this.walking = 1;
                this.walkright.start();
            }
        }
    };
    this.touchEnd = function(e) {
        if(MseConfig.android || MseConfig.iPhone) {
            var x = e.offsetX/0.8;
            var y = e.offsetY/0.62;
        }
        else {
            var x = e.offsetX;
            var y = e.offsetY;
        }
        if(this.firebtn.inObj(x, y)) {
            this.onfire = false;
        }
        else if(this.leftbtn.inObj(x, y) || this.rightbtn.inObj(x, y)) {
            this.walkleft.stop();
            this.walkright.stop();
            this.walking = 0;
            this.arthuro.setFrame(3);
        }
        else {
            this.onfire = false;
            this.walkleft.stop();
            this.walkright.stop();
            this.walking = 0;
            this.arthuro.setFrame(3);
        }
    };
    
    this.hurt = function() {
        if(this.arthuro.currentEffect == this.hurtEffet) return;
        if(this.heartCount > 0) this.heartCount--;
        this.arthuro.startEffect(this.hurtEffet);
        if(this.heartCount == 0) {
            this.state = "LOSE";
            this.count = 25;
        }
    };
    this.dropSteaks = function(x, y) {
        var rand = randomInt(20);
        var count = 0;
        if(rand >= 6 && rand < 16) count = 1;
        else if(rand >= 16 && rand < 19) count = 2;
        else if(rand == 19) count = 3;
        for(var i = 0; i < count; ++i) {
            var h = randomInt(6) + 6;
            var w = Math.round(h*2.67);
            var angle = -Math.PI * randomInt(180) / 180;
            this.steakPool.initInstance(x-w/2, y-h/2, w, h, angle);
        }
    };
    
    this.logic = function(delta) {
        if(this.state == "INIT")
            return;
        if(this.state == "WIN" || this.state == "LOSE") {
            if(this.count > 0) {
                this.count--;
            }
            else {
                this.setScore( this.steakCount * 5 + this.heartCount * this.heartCount * 5 + (this.steakCount == 20 && this.currTime < 135 ? (135-this.currTime) * 2 : 0) );
                if(this.state == "LOSE") this.lose();
                else this.win();
            }
            return;
        }
        
        if(this.walking == -1) {
            if(this.arthuro.offx > -25) this.arthuro.offx -= 5;
        }
        else if(this.walking == 1) {
            if(this.arthuro.offx < 500) this.arthuro.offx += 5;
        }
        
        if(this.onfire) {
            if( this.firedelay == 0 ) {
                this.ballePool.initInstance(this.balArth, this.arthuro.offx+60, 322, 0, -3.5);
                this.firedelay = 5;
            }
            else this.firedelay--;
        }
        
        if(this.nextVache == 0) {
            this.nextVache = randomInt(this.frequence)+50;
            var left = randomInt(2);
            var line = randomInt(3);
            this.vachePool.initInstance(left?-130:600, vacheline[line].y, vacheline[line].w, vacheline[line].h, left?2:-2, this);
        }
        else this.nextVache--;
        if(this.frequence > 30) this.frequence -= 0.001;
        
        for(var i in this.vaches)
            this.vaches[i].logic();
        
        for(var i in this.balles) {
            this.balles[i].logic();
            if(this.balles[i].state == "DISABLED") 
                this.ballePool.release(this.balles[i]);
        }
        
        for(var i in this.steaks) {
            this.steaks[i].logic();
            if(this.steaks[i].state == "DISAPPEAR")
                this.steakPool.release(this.steaks[i]);
        }
        
        this.arthuro.logic();
        
        // Collision
        var ax = this.arthuro.offx;
        var ay = this.arthuro.offy;
        for(var i in this.balles) {
            var x = this.balles[i].x;
            var y = this.balles[i].y;
            // Vache balle
            if(this.balles[i].enemy) {
                if(this.heartCount > 0 && x > ax+45 && x < ax+75 && y > ay+10 && y < ay+80) {
                    this.hurt();
                    this.ballePool.release(this.balles[i]);
                }
            }
            // Arthuro balle
            else {
                for(var j in this.vaches) {
                    if(this.vaches[j].checkShooted(x, y)) {
                        this.ballePool.release(this.balles[i]);
                    }
                }
            }
        }
        for(var i in this.steaks) {
            var x = this.steaks[i].x;
            var y = this.steaks[i].y;
            if(x > ax+35 && x < ax+75 && y > ay+10) {
                this.steakPool.release(this.steaks[i]);
                this.steakCount++;
                
                if(this.steakCount == 20) {
                    this.state = "WIN";
                    this.getEvtProxy().removeListener('keydown', this.keydownCb);
                    this.getEvtProxy().removeListener('keyup', this.keyupCb);
                    mse.fadein(this.oliviera, 20);
                    this.count = 120;
                    break;
                }
            }
        }
        this.currTime += delta/1000;
    };
    
    this.draw = function(ctx) {
        ctx.save();
        if(MseConfig.android || MseConfig.iPhone) ctx.scale(0.8,0.62);
        
        if(this.state == "INIT") {
            ctx.fillStyle = "#000";
            ctx.fillRect(0,0,this.width,this.height);
            this.help.draw(ctx);
            ctx.restore();
            return;
        }
    
        // Background
        this.decor.draw(ctx);
        
        // Vaches
        for(var l in vacheline) {
            for(var i in this.vaches) {
                if(this.vaches[i].y == vacheline[l].y)
                    this.vaches[i].draw(ctx);
            }
        }
        
        // Fence
        this.fence.draw(ctx);
        
        // Balle
        for(var i in this.balles)
            this.balles[i].draw(ctx);
            
        // Steak
        for(var i in this.steaks)
            this.steaks[i].draw(ctx);
        
        // Arthur
        if(this.onfire && this.firedelay-2 <= 0)
            this.fire.draw(ctx, this.arthuro.offx+52, 312);
        this.arthuro.draw(ctx);
        
        // Heart
        for(var i = 0; i < this.heartCount; ++i)
            this.heart.draw(ctx, 30+i*30, 30);
        // Steaks
        for(var i = 0; i < this.steakCount; ++i)
            this.steak.draw(ctx, 400+(i%10)*20, 30+Math.floor(i/10)*10);
        
        // Buttons for mobile
        if(MseConfig.mobile) {
            ctx.globalAlpha = 0.6;
            this.leftbtn.draw(ctx);
            this.rightbtn.draw(ctx);
            this.firebtn.draw(ctx);
            ctx.globalAlpha = 1;
        }
        
        // draw time
        var timestr = Math.floor(this.currTime/600) +""+ Math.floor((this.currTime%600)/60) +":"+ Math.floor((this.currTime%60)/10) +""+ Math.floor(this.currTime%10);
        ctx.font = "15px Gudea";
        ctx.fillText(timestr, this.width-50, 60);
        
        if(this.state == "WIN") {
            this.oliviera.draw(ctx);
        }
        ctx.restore();
    };
    
    this.keydownCb = new Callback(this.keydown, this);
    this.keyupCb = new Callback(this.keyup, this);
    this.clickCb = new Callback(this.click, this);
    this.touchStartCb = new Callback(this.touchStart, this);
    this.touchEndCb = new Callback(this.touchEnd, this);
};
extend(VacheGame, mse.Game);
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":320,"cid3":478,"cid4":416,"cid5":0,"cid6":400,"cid7":200,"cid8":20,"cid9":448.75,"cid10":108.75,"cid11":173.75,"cid12":107.5,"cid13":32.5,"cid14":396.25,"cid15":56.25,"cid16":201.25,"cid17":246.25,"cid18":357.5,"cid19":181.25,"cid20":222.5,"cid21":398.75,"cid22":17.5,"cid23":340,"cid24":590,"cid25":230,"cid26":10,"cid27":22.5,"cid28":36.25,"cid29":425,"cid30":295,"cid31":477.5,"cid32":306,"cid33":397.8,"cid34":17,"cid35":306,"cid36":513.72,"cid37":306,"cid38":448.10968494749,"cid39":416.25,"cid40":532.5,"cid41":33,"cid42":174,"cid43":108,"cid44":449,"cid45":109,"cid46":201,"cid47":246,"cid48":396,"cid49":56,"cid50":18,"cid51":223,"cid52":399,"cid53":358,"cid54":181,"cid55":-377,"cid56":275,"cid57":415,"cid58":739,"cid59":58,"cid60":-195,"cid61":485,"cid62":851,"cid63":554,"cid64":-21,"cid65":376,"cid66":714,"cid67":224,"cid68":205,"cid69":315,"cid70":535,"cid71":-129,"cid72":500,"cid73":363,"cid74":683,"cid75":395,"cid76":216,"cid77":133,"cid78":221,"cid79":163,"cid80":148,"cid81":255,"cid82":450,"cid83":240,"cid84":123,"cid85":258,"cid86":36,"cid87":383,"cid88":40,"cid89":218,"cid90":30}');
initMseConfig();
mse.init();
window.pages={};
var layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch6/';
	window.root = new mse.Root('Voodoo_Ch6',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('sonmua','audios/sonmua','aud',false);
	mse.src.addSource('sonporte','audios/sonporte','aud',false);
	mse.src.addSource('src5','images/src5.jpeg','img',true);
	mse.src.addSource('src6','images/src6.png','img',true);
	mse.src.addSource('src7','images/src7.jpeg','img',true);
	mse.src.addSource('src8','images/src8.png','img',true);
	mse.src.addSource('src9','images/src9.png','img',true);
	animes.showmask=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showmask.block=true;
	animes.showtitle=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showtitle.block=true;
	animes.showcha=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showcha.block=true;
	animes.showresume=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showresume.block=true;
	animes.chatanime=new mse.Animation(179,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.chatanime.block=true;
	mse.src.addSource('src10','images/src10.png','img',true);
	animes.angeliRire=new mse.Animation(143,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.angeliRire.block=true;
	mse.src.addSource('src11','images/src11.png','img',true);
	mse.src.addSource('src12','images/src12.jpeg','img',true);
	games.WindowGame = new WindowGame();
	mse.src.addSource('src13','images/src13.png','img',true);
	mse.src.addSource('src14','images/src14.png','img',true);
	mse.src.addSource('src15','images/src15.jpeg','img',true);
	mse.src.addSource('src16','images/src16.png','img',true);
	wikis.Mandibule=new mse.WikiLayer();
	wikis.Mandibule.addTextCard();
	wikis.Mandibule.textCard.addSection('Mandibule', 'Nom féminin : \nChez les hommes : os qui forme la mâchoire inférieure. Par extension : mâchoires.\nChez les oiseaux : les 2 parties du bec\nChez les crustacés et les insectes : chacune des deux pièces dures située devant la bouche et servant à attraper et broyer la nourriture.');
	wikis.Cacochyme=new mse.WikiLayer();
	wikis.Cacochyme.addTextCard();
	wikis.Cacochyme.textCard.addSection('Cacochyme', 'Adjectif et nom masculin : qui est de santé fragile, par exemple : vieillard cacochyme.\nPar extension : vieux');
	wikis.Simenon=new mse.WikiLayer();
	wikis.Simenon.addImage('src12', 'Georges Simenon par Erling Mandelmann');
	wikis.Simenon.addTextCard();
	wikis.Simenon.textCard.addSection('Simenon', 'Georges Simenon : écrivain belge (1903-1989). Il a écrit plus de 150 romans dont les célèbres « Maigret ».Le commissaire Maigret est toujours affublé d’un chapeau et fume la pipe. Le commissaire Maigret a été interprété à la télévision par Jean Richard et par Bruno Cremer. ');
	wikis.Simenon.textCard.addLink('Site Simenon', 'http:\/\/www.toutsimenon.com\/');
	wikis.AChristie=new mse.WikiLayer();
	wikis.AChristie.addImage('src11', 'Agatha Christie');
	wikis.AChristie.addTextCard();
	wikis.AChristie.textCard.addSection('Agatha Christie (1890-1976)', 'Auteur de nombreux romans policiers. Surnommée la «Reine du crime», elle a imaginé deux héros: Hercule Poirot et Miss Marple. Beaucoup de ses romans ont été adaptés au cinéma ou à la télévision dont les plus connus sont : Le Crime de l\'Orient-Express, Dix petits nègres et Mort sur le Nil.');
	wikis.AChristie.textCard.addLink(' Site en français ', 'http:\/\/agatha.christie.free.fr\/');
	mse.src.addSource('src17','images/src17.jpeg','img',true);
	mse.src.addSource('src18','images/src18.jpeg','img',true);
	mse.src.addSource('src19','images/src19.jpeg','img',true);
	mse.src.addSource('src20','images/src20.jpeg','img',true);
	mse.src.addSource('sonsirene','audios/sonsirene','aud',false);
	mse.src.addSource('sontire','audios/sontire','aud',false);
	mse.src.addSource('sonchute','audios/sonchute','aud',false);
	mse.src.addSource('soncoupfeu1','audios/soncoupfeu1','aud',false);
	mse.src.addSource('soncoupfeu2','audios/soncoupfeu2','aud',false);
	mse.src.addSource('sonDetonation','audios/sonDetonation','aud',false);
	wikis.Prestance=new mse.WikiLayer();
	wikis.Prestance.addTextCard();
	wikis.Prestance.textCard.addSection('Prestance', 'Nom féminin : \nAllure, comportement imposant d’une personne : avoir de la prestance.');
	wikis.Banzai=new mse.WikiLayer();
	wikis.Banzai.addTextCard();
	wikis.Banzai.textCard.addSection('Banzaï', 'Exclamation japonaise.\nOn l’utilise lors des mariages, des événements heureux pour souhaiter « longue vie » aux mariés…\nDurant la 2ème guerre mondiale, « Banzai » était le cri des pilotes kamikazes japonais avant qu’ils s’écrasent sur leur cible.');
	mse.src.addSource('src33','images/src33.jpeg','img',true);
	mse.src.addSource('src34','images/src34.jpeg','img',true);
	games.VacheGame = new VacheGame();
	mse.src.addSource('toit','images/toit.jpeg','img',true);
	mse.src.addSource('src36','images/src36.jpeg','img',true);
	mse.src.addSource('src37','images/src37.jpeg','img',true);
	animes.back2anime=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.back2anime.block=true;
	animes.back3anime=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.back3anime.block=true;
	mse.src.addSource('src38','images/src38.png','img',true);
	animes.text3police=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.text3police.block=true;
	animes.text4police=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.text4police.block=true;
	animes.text1police=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.text1police.block=true;
	animes.text2police=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.text2police.block=true;
	animes.angeliRire2=new mse.Animation(178,1,true,null,{'size':[mse.coor('cid2'),mse.coor('cid3')]});
	animes.angeliRire2.block=true;
	animes.chutePoubelle=new mse.Animation(103,1,true,null,{'size':[mse.coor('cid2'),mse.coor('cid4')]});
	animes.chutePoubelle.block=true;
	mse.src.addSource('src39','images/src39.jpeg','img',true);
	animes.back1anime=new mse.Animation(21,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.back1anime.block=true;
	mse.src.addSource('intro','audios/intro','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj860=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')]},'src17'); layers.back.addObject(objs.obj860);
	pages.Couverture.addLayer('back',layers.back);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1423=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')]},'src36'); layers.Chapitredefault.addObject(objs.obj1423);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.mask=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj3=new mse.Mask(layers.mask,{"size":[mse.coor('cid6'),mse.coor('cid1')],"pos":[mse.coor('cid7'),mse.coor('cid5')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid8')+"px Times"}); layers.mask.addObject(objs.obj3);
	pages.Chapitre.addLayer('mask',layers.mask);
	layers.chatext=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj243=new mse.Text(layers.chatext,{"size":[mse.coor('cid9'),mse.coor('cid10')],"pos":[mse.coor('cid11'),mse.coor('cid12')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Gudea","textAlign":"center","textBaseline":"top"},'Home sweet home',true); layers.chatext.addObject(objs.obj243);
	objs.obj244=new mse.Text(layers.chatext,{"size":[mse.coor('cid14'),mse.coor('cid15')],"pos":[mse.coor('cid16'),mse.coor('cid17')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Gudea","textAlign":"center","textBaseline":"top"},'Épisode VI',true); layers.chatext.addObject(objs.obj244);
	objs.obj245=new mse.Text(layers.chatext,{"size":[mse.coor('cid18'),mse.coor('cid19')],"pos":[mse.coor('cid20'),mse.coor('cid21')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid22')+"px Gudea","textAlign":"left","textBaseline":"top"},'En cherchant à sortir des catacombes, Simon et son étrange compagnon découvrent que les souterrains ne sont pas aussi calmes qu’ils en ont l’air. L’occasion rêvée pour l’inspecteur Angéli de faire une première apparition sur scène très remarquée…',true); layers.chatext.addObject(objs.obj245);
	pages.Chapitre.addLayer('chatext',layers.chatext);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back1=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1438=new mse.Image(layers.back1,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')]},'src39'); layers.back1.addObject(objs.obj1438);
	pages.Content.addLayer('back1',layers.back1);
	layers.back0=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1439=new mse.Image(layers.back0,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid8')+"px Times","textAlign":"left"},'src36'); layers.back0.addObject(objs.obj1439);
	pages.Content.addLayer('back0',layers.back0);
	layers.back2=new mse.Layer(pages.Content,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1426=new mse.Image(layers.back2,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid8')+"px Times","textAlign":"left"},'toit'); layers.back2.addObject(objs.obj1426);
	pages.Content.addLayer('back2',layers.back2);
	layers.back3=new mse.Layer(pages.Content,4,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1427=new mse.Image(layers.back3,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid5'),mse.coor('cid5')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid8')+"px Times","textAlign":"left"},'src37'); layers.back3.addObject(objs.obj1427);
	pages.Content.addLayer('back3',layers.back3);
	layers.contentmask=new mse.Layer(pages.Content,5,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj4=new mse.Mask(layers.contentmask,{"size":[mse.coor('cid6'),mse.coor('cid1')],"pos":[mse.coor('cid7'),mse.coor('cid5')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid8')+"px Times"}); layers.contentmask.addObject(objs.obj4);
	pages.Content.addLayer('contentmask',layers.contentmask);
	layers.conttext=new mse.ArticleLayer(pages.Content,6,{"size":[mse.coor('cid23'),mse.coor('cid24')],"pos":[mse.coor('cid25'),mse.coor('cid26')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid27')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid28')},null);
	objs.obj869=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Les galeries succédaient aux ',true); layers.conttext.addObject(objs.obj869);
	objs.obj870=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'galeries, les tunnels aux tunnels. ',true); layers.conttext.addObject(objs.obj870);
	objs.obj871=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’inspecteur avait disparu, ',true); layers.conttext.addObject(objs.obj871);
	objs.obj872=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'subitement, au détour d’un ',true); layers.conttext.addObject(objs.obj872);
	objs.obj873=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'couloir. Simon était seul et il ',true); layers.conttext.addObject(objs.obj873);
	objs.obj874=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'commençait à avoir peur. ',true); layers.conttext.addObject(objs.obj874);
	objs.obj875=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'D’autant que quelque chose le ',true); layers.conttext.addObject(objs.obj875);
	objs.obj876=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'suivait. Il percevait un bruit ',true); layers.conttext.addObject(objs.obj876);
	objs.obj877=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'derrière lui, le raclement de griffes ',true); layers.conttext.addObject(objs.obj877);
	objs.obj878=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'sur le sol.',true); layers.conttext.addObject(objs.obj878);
	objs.obj879=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'De plus en plus près.',true); layers.conttext.addObject(objs.obj879);
	objs.obj880=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Il se tassa dans une anfractuosité. ',true); layers.conttext.addObject(objs.obj880);
	objs.obj881=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Une ombre gigantesque ',true); layers.conttext.addObject(objs.obj881);
	objs.obj882=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’allongea devant lui. Une ',true); layers.conttext.addObject(objs.obj882);
	objs.obj883=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'silhouette menaçante. Un ',true); layers.conttext.addObject(objs.obj883);
	objs.obj884=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'monstre ? Simon se recroquevilla ',true); layers.conttext.addObject(objs.obj884);
	objs.obj885=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'un peu plus. Et soudain…',true); layers.conttext.addObject(objs.obj885);
	objs.obj886=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj886);
	objs.obj887=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj887);
	objs.obj888=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Un chat !  hurla-t-il en se ',true);
	objs.obj887.addObject(objs.obj888);
	objs.obj889=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'réveillant.',true);
	objs.obj887.addObject(objs.obj889);
	objs.obj890=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'La sueur inondait son front et ses ',true); layers.conttext.addObject(objs.obj890);
	objs.obj891=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'mains tremblaient. Un ',true); layers.conttext.addObject(objs.obj891);
	objs.obj892=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'cauchemar. Il avait fait un ',true); layers.conttext.addObject(objs.obj892);
	objs.obj893=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'cauchemar !',true); layers.conttext.addObject(objs.obj893);
	objs.obj894=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'À cet instant, les souvenirs des ',true); layers.conttext.addObject(objs.obj894);
	objs.obj895=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dernières heures l’assaillirent : la ',true); layers.conttext.addObject(objs.obj895);
	objs.obj896=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'fuite du foyer, la traversée du parc ',true); layers.conttext.addObject(objs.obj896);
	objs.obj897=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Montsouris, la découverte des ',true); layers.conttext.addObject(objs.obj897);
	objs.obj898=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'catacombes et… l’inspecteur ',true); layers.conttext.addObject(objs.obj898);
	objs.obj899=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli.',true); layers.conttext.addObject(objs.obj899);
	objs.obj900=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Encore engourdi par le sommeil, ',true); layers.conttext.addObject(objs.obj900);
	objs.obj901=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon regarda autour de lui. Il ',true); layers.conttext.addObject(objs.obj901);
	objs.obj902=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'était assis dans un fauteuil de ',true); layers.conttext.addObject(objs.obj902);
	objs.obj903=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'cuir, au milieu d’un minuscule ',true); layers.conttext.addObject(objs.obj903);
	objs.obj904=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'appartement mansardé. Les murs ',true); layers.conttext.addObject(objs.obj904);
	objs.obj905=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'disparaissaient derrière ',true); layers.conttext.addObject(objs.obj905);
	objs.obj906=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'d’imposantes bibliothèques ',true); layers.conttext.addObject(objs.obj906);
	objs.obj907=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'encombrées de livres.',true); layers.conttext.addObject(objs.obj907);
	objs.obj908=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Il se frotta les yeux. Il se souvenait ',true); layers.conttext.addObject(objs.obj908);
	objs.obj909=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de la sortie des catacombes, de ',true); layers.conttext.addObject(objs.obj909);
	objs.obj910=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’être assis sur un banc en ',true); layers.conttext.addObject(objs.obj910);
	objs.obj911=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'attendant que l’inspecteur trouve ',true); layers.conttext.addObject(objs.obj911);
	objs.obj912=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'une idée pour dormir quelque ',true); layers.conttext.addObject(objs.obj912);
	objs.obj913=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'part. Puis, plus rien. Il avait dû ',true); layers.conttext.addObject(objs.obj913);
	objs.obj914=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’assoupir et le policier l’avait ',true); layers.conttext.addObject(objs.obj914);
	objs.obj915=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'porté jusqu’ici.',true); layers.conttext.addObject(objs.obj915);
	objs.obj916=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Soudain, un miaulement.',true);
	objs.obj916.addLink(new mse.Link('miaulement',45,'audio',mse.src.getSrc('sonmua'))); layers.conttext.addObject(objs.obj916);
	objs.obj917=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Un chat ! Il y avait bien un chat. ',true); layers.conttext.addObject(objs.obj917);
	objs.obj918=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Pas très loin. Dans la pièce à côté. ',true); layers.conttext.addObject(objs.obj918);
	objs.obj919=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Et qui disait chat, disait adieu ',true); layers.conttext.addObject(objs.obj919);
	objs.obj920=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Dark !',true); layers.conttext.addObject(objs.obj920);
	objs.obj921=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon bondit sur ses pieds.',true); layers.conttext.addObject(objs.obj921);
	objs.obj922=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj922);
	objs.obj923=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Dark ! Dark !',true);
	objs.obj922.addObject(objs.obj923);
	objs.obj924=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Il se précipita, ouvrit l’une des ',true); layers.conttext.addObject(objs.obj924);
	objs.obj925=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'portes aménagées entre les ',true); layers.conttext.addObject(objs.obj925);
	objs.obj926=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'rayonnages… et heurta de plein ',true); layers.conttext.addObject(objs.obj926);
	objs.obj927=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'fouet l’inspecteur. Rebondissant ',true); layers.conttext.addObject(objs.obj927);
	objs.obj928=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'sur l’abdomen du policier, ',true); layers.conttext.addObject(objs.obj928);
	objs.obj929=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’adolescent fut projeté en arrière.',true); layers.conttext.addObject(objs.obj929);
	objs.obj930=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj930);
	objs.obj931=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Eh bien, qu’est-ce qui se ',true);
	objs.obj930.addObject(objs.obj931);
	objs.obj932=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'passe ? commença Angéli en ',true);
	objs.obj930.addObject(objs.obj932);
	objs.obj935=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'souriant. On dirait que tu as vu un ',true);
	objs.obj930.addObject(objs.obj935);
	objs.obj936=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'mort-vivant.',true);
	objs.obj930.addObject(objs.obj936);
	objs.obj937=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon n’avait pas le cœur à ',true); layers.conttext.addObject(objs.obj937);
	objs.obj938=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'plaisanter.',true); layers.conttext.addObject(objs.obj938);
	objs.obj939=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj939);
	objs.obj940=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Il y a un chat ici ! Il va dévorer ',true);
	objs.obj939.addObject(objs.obj940);
	objs.obj941=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Dark.',true);
	objs.obj939.addObject(objs.obj941);
	objs.obj942=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj942);
	objs.obj943=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Qui ça ? Riggs ?',true);
	objs.obj942.addObject(objs.obj943);
	objs.obj944=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’homme éclata de rire. Mais il ',true); layers.conttext.addObject(objs.obj944);
	objs.obj945=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’interrompit lorsque sa mâchoire ',true); layers.conttext.addObject(objs.obj945);
	objs.obj946=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'se déboîta. Il resta coincé, la ',true); layers.conttext.addObject(objs.obj946);
	objs.obj947=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'bouche ouverte.',true); layers.conttext.addObject(objs.obj947);
	objs.obj1414=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1414);
	objs.obj1431=animes.angeliRire2; objs.obj1431.setX(10); layers.conttext.addAnimation(objs.obj1431);
	objs.obj1415=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1415);
	objs.obj948=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon pouffa.',true); layers.conttext.addObject(objs.obj948);
	objs.obj949=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj949);
	objs.obj950=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Il est où alors ?',true);
	objs.obj949.addObject(objs.obj950);
	objs.obj951=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj951);
	objs.obj952=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ton fauve ? reprit Angéli ',true);
	objs.obj951.addObject(objs.obj952);
	objs.obj953=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'après avoir réglé son ',true);
	objs.obj951.addObject(objs.obj953);
	objs.obj957=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'problème mandibulaire. Il est en ',true);
	objs.obj957.addLink(new mse.Link('mandibulaire',72,'wiki',wikis.Mandibule));
	objs.obj951.addObject(objs.obj957);
	objs.obj958=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'train d’engloutir la moitié de mes ',true);
	objs.obj951.addObject(objs.obj958);
	objs.obj959=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'provisions.',true);
	objs.obj951.addObject(objs.obj959);
	objs.obj960=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’adolescent se remit sur ses ',true); layers.conttext.addObject(objs.obj960);
	objs.obj961=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'pieds et avança dans la cuisine. ',true); layers.conttext.addObject(objs.obj961);
	objs.obj962=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Là, entre un vieux réfrigérateur et ',true); layers.conttext.addObject(objs.obj962);
	objs.obj963=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'un évier surchargé de vaisselle, un ',true); layers.conttext.addObject(objs.obj963);
	objs.obj964=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'curieux spectacle l’attendait.',true); layers.conttext.addObject(objs.obj964);
	objs.obj965=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Dark, les deux pattes antérieures ',true); layers.conttext.addObject(objs.obj965);
	objs.obj966=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'posées sur le rebord d’une ',true); layers.conttext.addObject(objs.obj966);
	objs.obj967=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'soucoupe, finissait un morceau de ',true); layers.conttext.addObject(objs.obj967);
	objs.obj968=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'mou aussi gros que lui sous l’œil ',true); layers.conttext.addObject(objs.obj968);
	objs.obj969=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'placide d’un énorme chat noir.',true); layers.conttext.addObject(objs.obj969);
	objs.obj970=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj970);
	objs.obj1396=new mse.Image(layers.conttext,{"size":[mse.coor('cid32'),mse.coor('cid33')],"pos":[mse.coor('cid34'),mse.coor('cid8')]},'src5');
	objs.obj1396.activateZoom(); layers.conttext.addObject(objs.obj1396);
	objs.obj971=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj971);
	objs.obj972=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj972);
	objs.obj973=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Tu vois, renchérit le policier, ',true);
	objs.obj972.addObject(objs.obj973);
	objs.obj974=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Riggs ne ferait pas de mal à ',true);
	objs.obj972.addObject(objs.obj974);
	objs.obj976=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'une mouche. ',true);
	objs.obj972.addObject(objs.obj976);
	objs.obj977=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon soupira et se tourna vers ',true); layers.conttext.addObject(objs.obj977);
	objs.obj978=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’inspecteur.',true); layers.conttext.addObject(objs.obj978);
	objs.obj979=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'C’est alors qu’il remarqua que ce ',true); layers.conttext.addObject(objs.obj979);
	objs.obj980=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dernier s’était changé.',true); layers.conttext.addObject(objs.obj980);
	objs.obj981=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli avait troqué son sac ',true); layers.conttext.addObject(objs.obj981);
	objs.obj982=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'plastique contre une chemise ',true); layers.conttext.addObject(objs.obj982);
	objs.obj983=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'blanche agrémentée d’une ',true); layers.conttext.addObject(objs.obj983);
	objs.obj984=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'cravate noire, un élégant costume ',true); layers.conttext.addObject(objs.obj984);
	objs.obj985=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de flanelle grise et une paire de ',true); layers.conttext.addObject(objs.obj985);
	objs.obj986=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'mocassins vernis.',true); layers.conttext.addObject(objs.obj986);
	objs.obj987=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj987);
	objs.obj988=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Qu’est-ce que tu regardes ',true);
	objs.obj987.addObject(objs.obj988);
	objs.obj989=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'comme ça ?',true);
	objs.obj987.addObject(objs.obj989);
	objs.obj990=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj990);
	objs.obj991=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ben vous. Ça me fait tout ',true);
	objs.obj990.addObject(objs.obj991);
	objs.obj992=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'drôle de vous voir habillé en ',true);
	objs.obj990.addObject(objs.obj992);
	objs.obj994=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dimanche d’un seul coup…',true);
	objs.obj990.addObject(objs.obj994);
	objs.obj995=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj995);
	objs.obj996=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'En dimanche ?',true);
	objs.obj995.addObject(objs.obj996);
	objs.obj997=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj997);
	objs.obj998=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ben oui, on dirait que vous ',true);
	objs.obj997.addObject(objs.obj998);
	objs.obj999=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'allez à un mariage comme ça.',true);
	objs.obj997.addObject(objs.obj999);
	objs.obj1000=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’air embarrassé, Angéli baissa les ',true); layers.conttext.addObject(objs.obj1000);
	objs.obj1001=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'yeux pour se regarder.',true); layers.conttext.addObject(objs.obj1001);
	objs.obj1002=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1002);
	objs.obj1003=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Tu… Tu trouves que c’est ',true);
	objs.obj1002.addObject(objs.obj1003);
	objs.obj1004=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'ridicule ?',true);
	objs.obj1002.addObject(objs.obj1004);
	objs.obj1005=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1005);
	objs.obj1006=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Pas du tout. Il faut juste que ',true);
	objs.obj1005.addObject(objs.obj1006);
	objs.obj1007=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'je m’habitue. Je suppose ',true);
	objs.obj1005.addObject(objs.obj1007);
	objs.obj1009=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'qu’on va sortir, non ?',true);
	objs.obj1005.addObject(objs.obj1009);
	objs.obj1010=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1010);
	objs.obj1011=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Oui. On ne peut pas rester ici ',true);
	objs.obj1010.addObject(objs.obj1011);
	objs.obj1012=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'étant donné mon… mon état.',true);
	objs.obj1010.addObject(objs.obj1012);
	objs.obj1013=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1013);
	objs.obj1014=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Et on va où ?',true);
	objs.obj1013.addObject(objs.obj1014);
	objs.obj1015=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’inspecteur posa son regard sur ',true); layers.conttext.addObject(objs.obj1015);
	objs.obj1016=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’un des clichés noir et blanc ',true); layers.conttext.addObject(objs.obj1016);
	objs.obj1017=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'coincés entre deux piles de livres.',true); layers.conttext.addObject(objs.obj1017);
	objs.obj1018=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1018);
	objs.obj1019=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Chez une dame.',true);
	objs.obj1018.addObject(objs.obj1019);
	objs.obj1020=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1020);
	objs.obj1021=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est pour ça que vous avez ',true);
	objs.obj1020.addObject(objs.obj1021);
	objs.obj1022=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'mis autant de parfum ?',true);
	objs.obj1020.addObject(objs.obj1022);
	objs.obj1023=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'S’il avait pu rougir, le policier ',true); layers.conttext.addObject(objs.obj1023);
	objs.obj1024=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'serait devenu cramoisi. Mais cela ',true); layers.conttext.addObject(objs.obj1024);
	objs.obj1025=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'faisait maintenant plusieurs jours ',true); layers.conttext.addObject(objs.obj1025);
	objs.obj1026=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'que son sang ne circulait plus ',true); layers.conttext.addObject(objs.obj1026);
	objs.obj1027=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dans ses veines. Il se contenta de ',true); layers.conttext.addObject(objs.obj1027);
	objs.obj1028=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'grommeler dans son coin.',true); layers.conttext.addObject(objs.obj1028);
	objs.obj1029=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon comprit qu’il avait commis ',true); layers.conttext.addObject(objs.obj1029);
	objs.obj1030=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'une maladresse et tenta de ',true); layers.conttext.addObject(objs.obj1030);
	objs.obj1031=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'relancer la conversation.',true); layers.conttext.addObject(objs.obj1031);
	objs.obj1032=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1032);
	objs.obj1033=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Au fait, inspecteur, on est où?',true);
	objs.obj1032.addObject(objs.obj1033);
	objs.obj1034=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1034);
	objs.obj1035=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Chez moi, répondit-il en se ',true);
	objs.obj1034.addObject(objs.obj1035);
	objs.obj1036=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'dirigeant vers le fond de la ',true);
	objs.obj1034.addObject(objs.obj1036);
	objs.obj1038=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'pièce.',true);
	objs.obj1034.addObject(objs.obj1038);
	objs.obj1039=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'D’un geste sec, il tira le rideau qui ',true); layers.conttext.addObject(objs.obj1039);
	objs.obj1040=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'obstruait une petite lucarne ',true); layers.conttext.addObject(objs.obj1040);
	objs.obj1041=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ronde.',true); layers.conttext.addObject(objs.obj1041);
	objs.obj1042=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1042);
	objs.obj1398=new WindowGame(); layers.conttext.addGame(objs.obj1398);
	objs.obj1043=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1043);
	objs.obj1044=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1044);
	objs.obj1045=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Waouh !',true);
	objs.obj1044.addObject(objs.obj1045);
	objs.obj1046=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Devant l’adolescent, Paris ',true); layers.conttext.addObject(objs.obj1046);
	objs.obj1047=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'déroulait ses terrasses, ses toits et ',true); layers.conttext.addObject(objs.obj1047);
	objs.obj1048=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ses cheminées à l’infini. Un ',true); layers.conttext.addObject(objs.obj1048);
	objs.obj1049=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'spectacle d’une beauté à couper ',true); layers.conttext.addObject(objs.obj1049);
	objs.obj1050=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'le souffle, souligné par la lueur ',true); layers.conttext.addObject(objs.obj1050);
	objs.obj1051=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'d’une lune pleine.',true); layers.conttext.addObject(objs.obj1051);
	objs.obj1052=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1052);
	objs.obj1053=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ouaip.',true);
	objs.obj1052.addObject(objs.obj1053);
	objs.obj1054=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Ils devaient être sur les hauteurs ',true); layers.conttext.addObject(objs.obj1054);
	objs.obj1055=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de Montmartre, dominant la ',true); layers.conttext.addObject(objs.obj1055);
	objs.obj1056=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'capitale. D’ici, ils embrassaient ',true); layers.conttext.addObject(objs.obj1056);
	objs.obj1057=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'toute la ville.',true); layers.conttext.addObject(objs.obj1057);
	objs.obj1058=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli posa sa main sur l’épaule ',true); layers.conttext.addObject(objs.obj1058);
	objs.obj1059=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de l’adolescent. Ce dernier ',true); layers.conttext.addObject(objs.obj1059);
	objs.obj1060=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'frissonna de plaisir. Il y avait ',true); layers.conttext.addObject(objs.obj1060);
	objs.obj1061=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'longtemps qu’il ne s’était pas ',true); layers.conttext.addObject(objs.obj1061);
	objs.obj1062=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'senti aussi bien, aussi serein. Il ',true); layers.conttext.addObject(objs.obj1062);
	objs.obj1063=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'avait oublié tous les tracas du ',true); layers.conttext.addObject(objs.obj1063);
	objs.obj1064=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'foyer, tous les souvenirs ',true); layers.conttext.addObject(objs.obj1064);
	objs.obj1065=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'douloureux qui encombraient sa ',true); layers.conttext.addObject(objs.obj1065);
	objs.obj1066=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tête.',true); layers.conttext.addObject(objs.obj1066);
	objs.obj1067=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Mais l’accalmie fut de courte ',true); layers.conttext.addObject(objs.obj1067);
	objs.obj1068=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'durée.',true); layers.conttext.addObject(objs.obj1068);
	objs.obj1069=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Quelques secondes plus tard, une ',true); layers.conttext.addObject(objs.obj1069);
	objs.obj1070=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'déflagration retentit dans le ',true); layers.conttext.addObject(objs.obj1070);
	objs.obj1071=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'couloir, aussitôt suivie d’un ',true); layers.conttext.addObject(objs.obj1071);
	objs.obj1072=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'craquement sinistre.',true);
	objs.obj1072.addLink(new mse.Link('craquement',155,'audio',mse.src.getSrc('sonporte'))); layers.conttext.addObject(objs.obj1072);
	objs.obj1073=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'La porte d’entrée venait ',true); layers.conttext.addObject(objs.obj1073);
	objs.obj1074=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'d’exploser.',true); layers.conttext.addObject(objs.obj1074);
	objs.obj1075=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Dans un hurlement, une ',true); layers.conttext.addObject(objs.obj1075);
	objs.obj1076=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'silhouette surgit au milieu de la ',true); layers.conttext.addObject(objs.obj1076);
	objs.obj1077=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'pièce.',true); layers.conttext.addObject(objs.obj1077);
	objs.arthur=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.arthur);
	objs.obj1447=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Les mains en l’air ! hurla ',true);
	objs.arthur.addObject(objs.obj1447);
	objs.obj1448=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'l’apparition.',true);
	objs.arthur.addObject(objs.obj1448);
	objs.obj1081=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1081);
	objs.obj1400=new mse.Image(layers.conttext,{"size":[mse.coor('cid35'),mse.coor('cid36')],"pos":[mse.coor('cid34'),mse.coor('cid8')]},'src18');
	objs.obj1400.activateZoom(); layers.conttext.addObject(objs.obj1400);
	objs.obj1082=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1082);
	objs.obj1083=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Vêtu d’un treillis militaire, le ',true); layers.conttext.addObject(objs.obj1083);
	objs.obj1084=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'visage dissimulé par un ',true); layers.conttext.addObject(objs.obj1084);
	objs.obj1085=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'maquillage commando, l’individu ',true); layers.conttext.addObject(objs.obj1085);
	objs.obj1086=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'les menaçait d’une antique ',true); layers.conttext.addObject(objs.obj1086);
	objs.obj1087=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'kalachnikov. Une lueur de folie ',true); layers.conttext.addObject(objs.obj1087);
	objs.obj1088=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'meurtrière consumait son regard ',true); layers.conttext.addObject(objs.obj1088);
	objs.obj1089=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'translucide. Au moindre geste, il ',true); layers.conttext.addObject(objs.obj1089);
	objs.obj1090=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'n’hésiterait sans doute pas à ',true); layers.conttext.addObject(objs.obj1090);
	objs.obj1091=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tirer…',true); layers.conttext.addObject(objs.obj1091);
	objs.obj1092=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1092);
	objs.arthur=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.arthur);
	objs.obj1449=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Les mains en l’air, j’ai dit !',true);
	objs.arthur.addObject(objs.obj1449);
	objs.obj1095=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon, terrifié, ne pouvait décoller ',true); layers.conttext.addObject(objs.obj1095);
	objs.obj1096=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'son regard du fusil mitrailleur que ',true); layers.conttext.addObject(objs.obj1096);
	objs.obj1097=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’homme exhibait. De longues ',true); layers.conttext.addObject(objs.obj1097);
	objs.obj1098=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'bandes de cartouches ',true); layers.conttext.addObject(objs.obj1098);
	objs.obj1099=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'encombraient ses épaules ',true); layers.conttext.addObject(objs.obj1099);
	objs.obj1100=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tatouées. On aurait dit un Marines. ',true); layers.conttext.addObject(objs.obj1100);
	objs.obj1101=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Mais Angéli, loin de s’inquiéter, ',true); layers.conttext.addObject(objs.obj1101);
	objs.obj1102=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'partit dans un rire tonitruant tout ',true); layers.conttext.addObject(objs.obj1102);
	objs.obj1103=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'en maintenant sa mâchoire ',true); layers.conttext.addObject(objs.obj1103);
	objs.obj1104=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'inférieure. ',true); layers.conttext.addObject(objs.obj1104);
	objs.obj1105=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1105);
	objs.obj1106=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Arthur, Ventre-Dieu ! Calme-',true);
	objs.obj1105.addObject(objs.obj1106);
	objs.obj1107=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'toi, ce n’est que moi.',true);
	objs.obj1105.addObject(objs.obj1107);
	objs.obj1108=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’homme fixait le policier d’un air ',true); layers.conttext.addObject(objs.obj1108);
	objs.obj1109=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ébahi.',true); layers.conttext.addObject(objs.obj1109);
	objs.obj1110=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1110);
	objs.obj1111=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Mais tu es…',true);
	objs.obj1110.addObject(objs.obj1111);
	objs.obj1112=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1112);
	objs.obj1113=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'… mort ? Oui je sais. Tout le ',true);
	objs.obj1112.addObject(objs.obj1113);
	objs.obj1114=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'monde n’arrête pas de me le ',true);
	objs.obj1112.addObject(objs.obj1114);
	objs.obj1118=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'répéter. Crois-moi, je commence à ',true);
	objs.obj1112.addObject(objs.obj1118);
	objs.obj1119=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'être furieusement au courant. ',true);
	objs.obj1112.addObject(objs.obj1119);
	objs.obj1120=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1120);
	objs.obj1121=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Tu bouges… Tu parles… ',true);
	objs.obj1120.addObject(objs.obj1121);
	objs.obj1122=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est impossible !',true);
	objs.obj1120.addObject(objs.obj1122);
	objs.obj1123=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1123);
	objs.obj1124=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Il y a quelques jours je ',true);
	objs.obj1123.addObject(objs.obj1124);
	objs.obj1125=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'t’aurais dit la même chose.',true);
	objs.obj1123.addObject(objs.obj1125);
	objs.obj1126=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Au fil de la conversation, l’homme ',true); layers.conttext.addObject(objs.obj1126);
	objs.obj1127=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'se décomposait. ',true); layers.conttext.addObject(objs.obj1127);
	objs.obj1128=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1128);
	objs.obj1129=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est… C’est moi qui t’ai ',true);
	objs.obj1128.addObject(objs.obj1129);
	objs.obj1130=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'trouvé. Tu étais dans ce ',true);
	objs.obj1128.addObject(objs.obj1130);
	objs.obj1133=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'fauteuil, mort. Tu avais une rose ',true);
	objs.obj1128.addObject(objs.obj1133);
	objs.obj1134=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'entre les mains.',true);
	objs.obj1128.addObject(objs.obj1134);
	objs.obj1135=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1135);
	objs.obj1403=new mse.Image(layers.conttext,{"size":[mse.coor('cid32'),mse.coor('cid33')],"pos":[mse.coor('cid34'),mse.coor('cid8')]},'src19');
	objs.obj1403.activateZoom(); layers.conttext.addObject(objs.obj1403);
	objs.obj1401=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1401);
	objs.obj1136=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1136);
	objs.obj1137=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Une rose !? s’étrangla-t-il. Tu ',true);
	objs.obj1136.addObject(objs.obj1137);
	objs.obj1138=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'en es sûr ?',true);
	objs.obj1136.addObject(objs.obj1138);
	objs.obj1139=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Cela faisait plusieurs semaines ',true); layers.conttext.addObject(objs.obj1139);
	objs.obj1140=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'maintenant qu’un mystérieux ',true); layers.conttext.addObject(objs.obj1140);
	objs.obj1141=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tueur ensanglantait les rues de la ',true); layers.conttext.addObject(objs.obj1141);
	objs.obj1142=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ville, un assassin insaisissable qui ',true); layers.conttext.addObject(objs.obj1142);
	objs.obj1143=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'signait ses crimes d’une rose ',true); layers.conttext.addObject(objs.obj1143);
	objs.obj1144=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'rouge. ',true); layers.conttext.addObject(objs.obj1144);
	objs.obj1145=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1145);
	objs.obj1146=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Oui… Oui…',true);
	objs.obj1145.addObject(objs.obj1146);
	objs.obj1147=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'À présent, l’homme ressemblait à ',true); layers.conttext.addObject(objs.obj1147);
	objs.obj1148=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'une marionnette dont on aurait ',true); layers.conttext.addObject(objs.obj1148);
	objs.obj1149=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'coupé les fils et il menaçait de ',true); layers.conttext.addObject(objs.obj1149);
	objs.obj1150=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’effondrer d’un instant à l’autre.',true); layers.conttext.addObject(objs.obj1150);
	objs.obj1151=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1151);
	objs.obj1152=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Simon, apporte une chaise ',true);
	objs.obj1151.addObject(objs.obj1152);
	objs.obj1153=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'pour mon voisin et ',true);
	objs.obj1151.addObject(objs.obj1153);
	objs.obj1156=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'néanmoins ami. Je crois qu’il va ',true);
	objs.obj1151.addObject(objs.obj1156);
	objs.obj1157=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tourner de l’œil.',true);
	objs.obj1151.addObject(objs.obj1157);
	objs.obj1158=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’adolescent se précipita.',true); layers.conttext.addObject(objs.obj1158);
	objs.obj1159=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1159);
	objs.obj1160=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Simon, je te présente le ',true);
	objs.obj1159.addObject(objs.obj1160);
	objs.obj1161=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'senior Arthuro del Oliveira, ',true);
	objs.obj1159.addObject(objs.obj1161);
	objs.obj1168=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ancien sergent-chef dans les ',true);
	objs.obj1159.addObject(objs.obj1168);
	objs.obj1169=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'commandos marine lors de la ',true);
	objs.obj1159.addObject(objs.obj1169);
	objs.obj1170=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'guerre du Golfe, déclara Angéli ',true);
	objs.obj1159.addObject(objs.obj1170);
	objs.obj1171=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dans un clin d’œil. Arthur, je te ',true);
	objs.obj1159.addObject(objs.obj1171);
	objs.obj1172=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'présente mon ami Simon.',true);
	objs.obj1159.addObject(objs.obj1172);
	objs.obj1173=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1173);
	objs.obj1407=new mse.Image(layers.conttext,{"size":[mse.coor('cid37'),mse.coor('cid38')],"pos":[mse.coor('cid34'),mse.coor('cid8')]},'src20');
	objs.obj1407.activateZoom(); layers.conttext.addObject(objs.obj1407);
	objs.obj1174=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1174);
	objs.obj1175=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1175);
	objs.obj1176=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est une catastrophe ! lâcha ',true);
	objs.obj1175.addObject(objs.obj1176);
	objs.obj1177=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'le voisin.',true);
	objs.obj1175.addObject(objs.obj1177);
	objs.obj1178=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1178);
	objs.obj1179=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ce n’est pas très gentil pour ',true);
	objs.obj1178.addObject(objs.obj1179);
	objs.obj1180=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'lui.',true);
	objs.obj1178.addObject(objs.obj1180);
	objs.obj1181=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1181);
	objs.obj1182=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est pas ça.',true);
	objs.obj1181.addObject(objs.obj1182);
	objs.obj1183=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Soudain, un concert de sirènes et ',true);
	objs.obj1183.addLink(new mse.Link('concert',220,'audio',mse.src.getSrc('sonsirene'))); layers.conttext.addObject(objs.obj1183);
	objs.obj1184=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de crissements de pneus s’éleva ',true); layers.conttext.addObject(objs.obj1184);
	objs.obj1185=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'de la rue. ',true); layers.conttext.addObject(objs.obj1185);
	objs.obj1186=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1186);
	objs.obj1187=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Qu’est-ce qui se passe encore ',true);
	objs.obj1186.addObject(objs.obj1187);
	objs.obj1188=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'?',true);
	objs.obj1186.addObject(objs.obj1188);
	objs.obj1189=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Arthur se redressa.',true); layers.conttext.addObject(objs.obj1189);
	objs.obj1190=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1190);
	objs.obj1191=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'C’est de ma faute. Lorsque j’ai ',true);
	objs.obj1190.addObject(objs.obj1191);
	objs.obj1192=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'entendu du bruit chez toi, j’ai ',true);
	objs.obj1190.addObject(objs.obj1192);
	objs.obj1196=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'prévenu tes collègues et je me ',true);
	objs.obj1190.addObject(objs.obj1196);
	objs.obj1197=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'suis équipé pour intervenir.',true);
	objs.obj1190.addObject(objs.obj1197);
	objs.obj1198=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1198);
	objs.obj1199=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ça, on a bien vu… Qu’est ce ',true);
	objs.obj1198.addObject(objs.obj1199);
	objs.obj1200=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'qu’on va faire, maintenant ? ',true);
	objs.obj1198.addObject(objs.obj1200);
	objs.obj1211=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Vu l’état de la porte, ça ',true);
	objs.obj1198.addObject(objs.obj1211);
	objs.obj1212=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'m’étonnerait que la patrouille ',true);
	objs.obj1198.addObject(objs.obj1212);
	objs.obj1213=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'rentre au commissariat sans ',true);
	objs.obj1198.addObject(objs.obj1213);
	objs.obj1214=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'explication. S’ils me trouvent ici, ',true);
	objs.obj1198.addObject(objs.obj1214);
	objs.obj1215=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ils vont tous nous mettre sous les ',true);
	objs.obj1198.addObject(objs.obj1215);
	objs.obj1216=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'verrous et je risque de finir sous le ',true);
	objs.obj1198.addObject(objs.obj1216);
	objs.obj1217=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'bistouri d’un médecin-légiste au ',true);
	objs.obj1198.addObject(objs.obj1217);
	objs.obj1218=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'nom de la science.',true);
	objs.obj1198.addObject(objs.obj1218);
	objs.obj1219=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1219);
	objs.obj1220=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Je suis désolé…',true);
	objs.obj1219.addObject(objs.obj1220);
	objs.obj1221=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1221);
	objs.obj1222=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'T’inquiètes Arthur, on va s’en ',true);
	objs.obj1221.addObject(objs.obj1222);
	objs.obj1223=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'sortir. Allez Simon, jette tout ',true);
	objs.obj1221.addObject(objs.obj1223);
	objs.obj1226=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ce qui te paraît utile dans ce ',true);
	objs.obj1221.addObject(objs.obj1226);
	objs.obj1227=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'grand sac là-bas et on y va.',true);
	objs.obj1221.addObject(objs.obj1227);
	objs.obj1228=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1228);
	objs.obj1229=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Je vais vous aider ! déclara ',true);
	objs.obj1228.addObject(objs.obj1229);
	objs.obj1230=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'alors Del Oliveira.',true);
	objs.obj1228.addObject(objs.obj1230);
	objs.obj1231=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Le prétendu sous-officier avait ',true); layers.conttext.addObject(objs.obj1231);
	objs.obj1232=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'retrouvé toute sa prestance.',true);
	objs.obj1232.addLink(new mse.Link('prestance',231,'wiki',wikis.Prestance)); layers.conttext.addObject(objs.obj1232);
	objs.obj1233=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1233);
	objs.obj1234=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Allez-y, je vous couvre.',true);
	objs.obj1233.addObject(objs.obj1234);
	objs.obj1235=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1235);
	objs.obj1236=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Tu es sûr ?',true);
	objs.obj1235.addObject(objs.obj1236);
	objs.obj1237=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1237);
	objs.obj1238=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Je vais les retenir le plus ',true);
	objs.obj1237.addObject(objs.obj1238);
	objs.obj1239=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'longtemps possible.',true);
	objs.obj1237.addObject(objs.obj1239);
	objs.obj1240=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1240);
	objs.obj1241=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'N’en fais pas trop quand ',true);
	objs.obj1240.addObject(objs.obj1241);
	objs.obj1242=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'même…',true);
	objs.obj1240.addObject(objs.obj1242);
	objs.obj1243=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1243);
	objs.obj1244=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Banzaï ! conclut-il dans un ',true);
	objs.obj1244.addLink(new mse.Link('Banzaï',236,'wiki',wikis.Banzai));
	objs.obj1243.addObject(objs.obj1244);
	objs.obj1245=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'claquement de talons.',true);
	objs.obj1243.addObject(objs.obj1245);
	objs.obj1246=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Puis il se glissa hors de ',true); layers.conttext.addObject(objs.obj1246);
	objs.obj1247=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’appartement en rampant. ',true); layers.conttext.addObject(objs.obj1247);
	objs.obj1248=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Silencieux, il se positionna dans le ',true); layers.conttext.addObject(objs.obj1248);
	objs.obj1249=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'couloir.',true); layers.conttext.addObject(objs.obj1249);
	objs.obj1250=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’adolescent le regarda faire avec ',true); layers.conttext.addObject(objs.obj1250);
	objs.obj1251=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'inquiétude.',true); layers.conttext.addObject(objs.obj1251);
	objs.obj1252=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1252);
	objs.obj1253=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Il ne va pas…',true);
	objs.obj1252.addObject(objs.obj1253);
	objs.obj1254=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1254);
	objs.obj1255=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Ne t’inquiète pas. En fait ',true);
	objs.obj1254.addObject(objs.obj1255);
	objs.obj1256=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Arthur n’a jamais mis les ',true);
	objs.obj1254.addObject(objs.obj1256);
	objs.obj1262=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'pieds hors de son appartement. Il ',true);
	objs.obj1254.addObject(objs.obj1262);
	objs.obj1263=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'se rêve héros de guerre mais il ',true);
	objs.obj1254.addObject(objs.obj1263);
	objs.obj1264=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'raterait une vache dans un ',true);
	objs.obj1254.addObject(objs.obj1264);
	objs.obj1265=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'couloir. Les collègues ne risquent ',true);
	objs.obj1254.addObject(objs.obj1265);
	objs.obj1266=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'rien.',true);
	objs.obj1254.addObject(objs.obj1266);
	objs.obj1267=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1267);
	objs.obj1422=new VacheGame(); layers.conttext.addGame(objs.obj1422);
	objs.obj1268=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1268);
	objs.obj1269=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1269);
	objs.obj1270=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Mais lui ?',true);
	objs.obj1269.addObject(objs.obj1270);
	objs.obj1271=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1271);
	objs.obj1272=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Il va se rendre dès les ',true);
	objs.obj1271.addObject(objs.obj1272);
	objs.obj1273=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'premiers coups de feu : il est ',true);
	objs.obj1271.addObject(objs.obj1273);
	objs.obj1278=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'trouillard comme ce n’est pas ',true);
	objs.obj1271.addObject(objs.obj1278);
	objs.obj1279=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'permis ! Allez dépêche-toi, on ',true);
	objs.obj1271.addObject(objs.obj1279);
	objs.obj1280=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'n’aura pas beaucoup d’avance !',true);
	objs.obj1271.addObject(objs.obj1280);
	objs.obj1281=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Simon suivit l’inspecteur et ils ',true); layers.conttext.addObject(objs.obj1281);
	objs.obj1282=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’engouffrèrent dans la salle de ',true); layers.conttext.addObject(objs.obj1282);
	objs.obj1283=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'bain qui occupait le fond de ',true); layers.conttext.addObject(objs.obj1283);
	objs.obj1284=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’appartement. Le policier ouvrit la ',true); layers.conttext.addObject(objs.obj1284);
	objs.obj1285=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'fenêtre.',true); layers.conttext.addObject(objs.obj1285);
	objs.obj1286=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1286);
	objs.obj1287=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Vas-y !',true);
	objs.obj1286.addObject(objs.obj1287);
	objs.obj1288=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'L’adolescent enfila son sac à dos ',true); layers.conttext.addObject(objs.obj1288);
	objs.obj1289=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'et s’engagea sur le toit. Angéli le ',true); layers.conttext.addObject(objs.obj1289);
	objs.obj1290=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'rejoignit aussitôt et ils ',true); layers.conttext.addObject(objs.obj1290);
	objs.obj1291=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'commencèrent à progresser sur le ',true); layers.conttext.addObject(objs.obj1291);
	objs.obj1292=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'zinc. En contrebas, ils aperçurent ',true); layers.conttext.addObject(objs.obj1292);
	objs.obj1293=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'les véhicules de police en train de ',true); layers.conttext.addObject(objs.obj1293);
	objs.obj1294=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'se garer, les uniformes bleus ',true); layers.conttext.addObject(objs.obj1294);
	objs.obj1295=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'envahir l’immeuble.',true); layers.conttext.addObject(objs.obj1295);
	objs.obj1296=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Bientôt, les premiers coups de feu ',true);
	objs.obj1296.addLink(new mse.Link('coups de feu',264,'audio',mse.src.getSrc('soncoupfeu1'))); layers.conttext.addObject(objs.obj1296);
	objs.obj1297=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'retentirent. Le « sergent-chef » ',true); layers.conttext.addObject(objs.obj1297);
	objs.obj1298=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Del Oliveira défendait sa position !',true); layers.conttext.addObject(objs.obj1298);
	objs.obj1299=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Sautant de terrasse en terrasse, ',true); layers.conttext.addObject(objs.obj1299);
	objs.obj1300=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'ils atteignirent un surplomb qui ',true); layers.conttext.addObject(objs.obj1300);
	objs.obj1301=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'dominait une cour encombrée de ',true); layers.conttext.addObject(objs.obj1301);
	objs.obj1302=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'poubelles.',true); layers.conttext.addObject(objs.obj1302);
	objs.obj1303=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1303);
	objs.obj1304=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'On va descendre ici.',true);
	objs.obj1303.addObject(objs.obj1304);
	objs.obj1305=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Se pinçant le nez, ils se laissèrent ',true); layers.conttext.addObject(objs.obj1305);
	objs.obj1306=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tomber dans les ordures.',true); layers.conttext.addObject(objs.obj1306);
	objs.obj1418=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1418);
	objs.obj1420=animes.chutePoubelle; objs.obj1420.setX(10); layers.conttext.addAnimation(objs.obj1420);
	objs.obj1307=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1307);
	objs.obj1308=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1308);
	objs.obj1309=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Votre parfum risque de ne ',true);
	objs.obj1308.addObject(objs.obj1309);
	objs.obj1310=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'pas résister à un tel ',true);
	objs.obj1308.addObject(objs.obj1310);
	objs.obj1312=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'traitement, railla Simon.',true);
	objs.obj1308.addObject(objs.obj1312);
	objs.obj1313=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1313);
	objs.obj1314=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'On verra ça plus tard, ',true);
	objs.obj1313.addObject(objs.obj1314);
	objs.obj1315=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'répondit Angéli.',true);
	objs.obj1313.addObject(objs.obj1315);
	objs.obj1316=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Mais, au moment où l’adolescent ',true); layers.conttext.addObject(objs.obj1316);
	objs.obj1317=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'parvenait enfin à sortir de sa ',true); layers.conttext.addObject(objs.obj1317);
	objs.obj1318=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'poubelle, un ordre les figea sur ',true); layers.conttext.addObject(objs.obj1318);
	objs.obj1319=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'place.',true); layers.conttext.addObject(objs.obj1319);
	objs.obj1320=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1320);
	objs.obj1321=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'unknown', 'src38' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1321);
	objs.obj1322=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid27')+"px Gudea"},'Police, ne bougez plus !',true);
	objs.obj1321.addObject(objs.obj1322);
	objs.obj1323=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1323);
	objs.obj1324=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Sur le petit toit d’où ils étaient ',true); layers.conttext.addObject(objs.obj1324);
	objs.obj1325=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'descendus, un jeune brigadier les ',true); layers.conttext.addObject(objs.obj1325);
	objs.obj1326=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'braquait de son arme. Arthur ',true); layers.conttext.addObject(objs.obj1326);
	objs.obj1327=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'n’avait pas résisté bien longtemps !',true); layers.conttext.addObject(objs.obj1327);
	objs.obj1329=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Ils étaient pris.',true); layers.conttext.addObject(objs.obj1329);
	objs.obj1330=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Cependant, l’inspecteur semblait ',true); layers.conttext.addObject(objs.obj1330);
	objs.obj1331=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'faire comme s’il n’avait rien ',true); layers.conttext.addObject(objs.obj1331);
	objs.obj1332=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'entendu et il commença à ',true); layers.conttext.addObject(objs.obj1332);
	objs.obj1333=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'contourner la poubelle où s’était ',true); layers.conttext.addObject(objs.obj1333);
	objs.obj1334=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'réfugié Simon.',true); layers.conttext.addObject(objs.obj1334);
	objs.obj1335=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1335);
	objs.obj1336=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Enfonce-toi le plus possible ',true);
	objs.obj1335.addObject(objs.obj1336);
	objs.obj1337=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'dans les ordures, murmura-t-',true);
	objs.obj1335.addObject(objs.obj1337);
	objs.obj1339=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'il à l’adolescent.',true);
	objs.obj1335.addObject(objs.obj1339);
	objs.obj1340=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Poursuivant sa course, il vint se ',true); layers.conttext.addObject(objs.obj1340);
	objs.obj1341=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'placer derrière le container, face à ',true); layers.conttext.addObject(objs.obj1341);
	objs.obj1342=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'la ruelle qui s’ouvrait sur la cour.',true); layers.conttext.addObject(objs.obj1342);
	objs.obj1343=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1343);
	objs.obj1344=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'unknown', 'src38' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1344);
	objs.obj1345=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid27')+"px Gudea"},'Je vous ai dit de ne pas',true);
	objs.obj1344.addObject(objs.obj1345);
	objs.obj1346=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid27')+"px Gudea"},'bouger !',true);
	objs.obj1344.addObject(objs.obj1346);
	objs.obj1347=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1347);
	objs.obj1348=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli tournait le dos au policier. ',true); layers.conttext.addObject(objs.obj1348);
	objs.obj1349=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'D’un mouvement du pied, il libéra ',true); layers.conttext.addObject(objs.obj1349);
	objs.obj1350=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'le système qui bloquait les ',true); layers.conttext.addObject(objs.obj1350);
	objs.obj1351=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'roulettes. Puis il s’arc-bouta et ',true); layers.conttext.addObject(objs.obj1351);
	objs.obj1352=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'poussa.',true); layers.conttext.addObject(objs.obj1352);
	objs.obj1353=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1353);
	objs.obj1354=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'unknown', 'src38' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1354);
	objs.obj1355=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid27')+"px Gudea"},'Dernière sommation !',true);
	objs.obj1354.addObject(objs.obj1355);
	objs.obj1356=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1356);
	objs.obj1357=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'La poubelle se mit à avancer. ',true); layers.conttext.addObject(objs.obj1357);
	objs.obj1358=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Lentement tout d’abord.',true); layers.conttext.addObject(objs.obj1358);
	objs.obj1359=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Le policier tira une fois. Juste à ',true);
	objs.obj1359.addLink(new mse.Link('tira une fois',313,'audio',mse.src.getSrc('sontire'))); layers.conttext.addObject(objs.obj1359);
	objs.obj1360=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'côté de son collègue. C’est bien, il ',true); layers.conttext.addObject(objs.obj1360);
	objs.obj1361=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'respecte la procédure, pensa ',true); layers.conttext.addObject(objs.obj1361);
	objs.obj1362=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli en poursuivant son effort. ',true); layers.conttext.addObject(objs.obj1362);
	objs.obj1363=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'S’il parvenait à atteindre la rue, ',true); layers.conttext.addObject(objs.obj1363);
	objs.obj1364=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'c’était gagné. Cette dernière ',true); layers.conttext.addObject(objs.obj1364);
	objs.obj1365=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'descendait directement à côté ',true); layers.conttext.addObject(objs.obj1365);
	objs.obj1366=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'d’une station de métro.',true); layers.conttext.addObject(objs.obj1366);
	objs.obj1367=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Une seconde détonation. La balle ',true);
	objs.obj1367.addLink(new mse.Link('détonation',321,'audio',mse.src.getSrc('sonDetonation'))); layers.conttext.addObject(objs.obj1367);
	objs.obj1368=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’enfonça dans les chairs de ',true); layers.conttext.addObject(objs.obj1368);
	objs.obj1369=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'l’inspecteur. Il sourit : après tout, ',true); layers.conttext.addObject(objs.obj1369);
	objs.obj1370=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'être mort comportait quelques ',true); layers.conttext.addObject(objs.obj1370);
	objs.obj1371=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'avantages.',true); layers.conttext.addObject(objs.obj1371);
	objs.obj1372=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1372);
	objs.obj1373=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Mon costume ! gronda-t-il ',true);
	objs.obj1372.addObject(objs.obj1373);
	objs.obj1374=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'avant de propulser la ',true);
	objs.obj1372.addObject(objs.obj1374);
	objs.obj1376=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'poubelle.',true);
	objs.obj1372.addObject(objs.obj1376);
	objs.obj1377=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Il sauta à l’arrière comme s’il ',true); layers.conttext.addObject(objs.obj1377);
	objs.obj1378=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'s’agissait d’un wagonnet de mine, ',true); layers.conttext.addObject(objs.obj1378);
	objs.obj1379=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'tandis que le brigadier vidait son ',true);
	objs.obj1379.addLink(new mse.Link('brigadier',329,'audio',mse.src.getSrc('soncoupfeu1'))); layers.conttext.addObject(objs.obj1379);
	objs.obj1380=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'chargeur sur lui. Trop tard… Le ',true); layers.conttext.addObject(objs.obj1380);
	objs.obj1381=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'container prenait de la vitesse.',true); layers.conttext.addObject(objs.obj1381);
	objs.obj1382=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1382);
	objs.obj1413=new mse.Image(layers.conttext,{"size":[mse.coor('cid32'),mse.coor('cid33')],"pos":[mse.coor('cid34'),mse.coor('cid8')]},'src33');
	objs.obj1413.activateZoom(); layers.conttext.addObject(objs.obj1413);
	objs.obj1383=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1383);
	objs.obj1384=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'Angéli se fendit d’un bras ',true); layers.conttext.addObject(objs.obj1384);
	objs.obj1385=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'d’honneur avant de regarder la ',true); layers.conttext.addObject(objs.obj1385);
	objs.obj1386=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'route. Il pâlit en réalisant que la ',true); layers.conttext.addObject(objs.obj1386);
	objs.obj1387=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'pente était bien plus raide que ce ',true); layers.conttext.addObject(objs.obj1387);
	objs.obj1388=new mse.Text(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]},'qu’il pensait.',true); layers.conttext.addObject(objs.obj1388);
	objs.obj1389=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1389);
	objs.obj1390=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'simon', 'src14' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1390);
	objs.obj1391=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'On est sauvé ? demanda ',true);
	objs.obj1390.addObject(objs.obj1391);
	objs.obj1392=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Simon.',true);
	objs.obj1390.addObject(objs.obj1392);
	objs.obj1393=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid5')]}, 'angeli', 'src13' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.obj1393);
	objs.obj1394=new mse.Text(layers.conttext,{"size":[mse.coor('cid30'),mse.coor('cid28')]},'Euh…Presque !',true);
	objs.obj1393.addObject(objs.obj1394);
	objs.obj1432=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid29'),mse.coor('cid28')]}); layers.conttext.addObject(objs.obj1432);
	objs.obj1434=new mse.Text(layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid28')],"pos":[mse.coor('cid5'),mse.coor('cid40')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Gudea","textAlign":"center"},'À SUIVRE...',true); layers.conttext.addObject(objs.obj1434);
	layers.conttext.setDefile(1300);
	temp.layerDefile=layers.conttext;
	pages.Content.addLayer('conttext',layers.conttext);
	animes.showmask.addObj('obj3',objs.obj3);
	animes.showmask.addAnimation('obj3',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.showtitle.addObj('obj243',objs.obj243);
	animes.showtitle.addAnimation('obj243',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showcha.addObj('obj244',objs.obj244);
	animes.showcha.addAnimation('obj244',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showresume.addObj('obj245',objs.obj245);
	animes.showresume.addAnimation('obj245',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid55'),mse.coor('cid56')],'size':[mse.coor('cid57'),mse.coor('cid58')]},'src8');
	animes.chatanime.addObj('src8',temp.obj);
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid71'),mse.coor('cid72')],'size':[mse.coor('cid73'),mse.coor('cid74')]},'src9');
	animes.chatanime.addObj('src9',temp.obj);
	animes.chatanime.addAnimation('src8',{'frame':JSON.parse('[0,13,26,39,52,65,115,165,178,179]'),'pos':[[mse.coor('cid55'),mse.coor('cid56')],[mse.coor('cid59'),mse.coor('cid60')],[mse.coor('cid63'),mse.coor('cid64')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid67'),mse.coor('cid68')],[mse.coor('cid75'),mse.coor('cid76')],[mse.coor('cid75'),mse.coor('cid76')],[mse.coor('cid75'),mse.coor('cid76')],[mse.coor('cid75'),mse.coor('cid76')]],'size':[[mse.coor('cid57'),mse.coor('cid58')],[mse.coor('cid61'),mse.coor('cid62')],[mse.coor('cid65'),mse.coor('cid66')],[mse.coor('cid69'),mse.coor('cid70')],[mse.coor('cid69'),mse.coor('cid70')],[mse.coor('cid69'),mse.coor('cid70')],[mse.coor('cid77'),mse.coor('cid78')],[mse.coor('cid77'),mse.coor('cid78')],[mse.coor('cid77'),mse.coor('cid78')],[mse.coor('cid77'),mse.coor('cid78')]],'opacity':JSON.parse('[1,1,1,1,1,1,1,1,0,0]')});
	animes.chatanime.addAnimation('src9',{'frame':JSON.parse('[0,13,26,39,52,65,115,165,178,179]'),'opacity':JSON.parse('[0,0,0,0,0,1,1,1,0,0]'),'pos':[[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid79'),mse.coor('cid80')],[mse.coor('cid79'),mse.coor('cid80')],[mse.coor('cid79'),mse.coor('cid80')],[mse.coor('cid79'),mse.coor('cid80')]],'size':[[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid81'),mse.coor('cid82')],[mse.coor('cid81'),mse.coor('cid82')],[mse.coor('cid81'),mse.coor('cid82')],[mse.coor('cid81'),mse.coor('cid82')]]});
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid83'),mse.coor('cid84')],'size':[mse.coor('cid2'),mse.coor('cid3')]},'src10',320,478, 0,0,960,956);
	animes.angeliRire.addObj('src10',temp.obj);
	animes.angeliRire.addAnimation('src10',{'frame':JSON.parse('[0,25,29,33,37,62,66,129,142,143]'),'spriteSeq':JSON.parse('[0,0,1,2,3,4,5,5,5,5]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,0,0]')});
	animes.back2anime.addObj('obj1426',objs.obj1426);
	animes.back2anime.addAnimation('obj1426',{'frame':JSON.parse('[0,20,21]'),'opacity':JSON.parse('[0,1,1]')});
	animes.back3anime.addObj('obj1427',objs.obj1427);
	animes.back3anime.addAnimation('obj1427',{'frame':JSON.parse('[0,20,21]'),'opacity':JSON.parse('[0,1,1]')});
	animes.text3police.addObj('obj1346',objs.obj1346);
	animes.text3police.addAnimation('obj1346',{'frame':JSON.parse('[0,20,21]'),'fontSize':[mse.coor('cid50'),mse.coor('cid86'),mse.coor('cid86')]});
	animes.text4police.addObj('obj1355',objs.obj1355);
	animes.text4police.addAnimation('obj1355',{'frame':JSON.parse('[0,20,21]'),'fontSize':[mse.coor('cid50'),mse.coor('cid88'),mse.coor('cid88')]});
	animes.text1police.addObj('obj1322',objs.obj1322);
	animes.text1police.addAnimation('obj1322',{'frame':JSON.parse('[0,20,21]'),'fontSize':[mse.coor('cid50'),mse.coor('cid86'),mse.coor('cid86')]});
	animes.text2police.addObj('obj1345',objs.obj1345);
	animes.text2police.addAnimation('obj1345',{'frame':JSON.parse('[0,20,21]'),'fontSize':[mse.coor('cid50'),mse.coor('cid90'),mse.coor('cid90')]});
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid5'),mse.coor('cid5')],'size':[mse.coor('cid2'),mse.coor('cid3')]},'src10',320,478, 0,0,960,956);
	animes.angeliRire2.addObj('src10',temp.obj);
	animes.angeliRire2.addAnimation('src10',{'frame':JSON.parse('[0,60,64,68,72,97,101,164,177,178]'),'spriteSeq':JSON.parse('[0,0,1,2,3,4,5,5,5,5]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,0,0]')});
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid5'),mse.coor('cid5')],'size':[mse.coor('cid2'),mse.coor('cid4')]},'src34',500,649, 0,0,2500,1298);
	animes.chutePoubelle.addObj('src34',temp.obj);
	animes.chutePoubelle.addAnimation('src34',{'frame':JSON.parse('[0,60,63,66,69,72,75,78,81,84,87,90,103]'),'spriteSeq':JSON.parse('[0,0,1,2,3,4,5,6,7,8,9,9,9]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,1,1,1,1,1]')});
	animes.back1anime.addObj('obj1439',objs.obj1439);
	animes.back1anime.addAnimation('obj1439',{'frame':JSON.parse('[0,20,21]'),'opacity':JSON.parse('[0,1,1]')});
	var action={};
	var reaction={};
	action.transCha=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.startshowtitle=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.startshowtitle=function(){ 
		animes.showtitle.start(); 
	};
	action.startshowtitle.register(reaction.startshowtitle);
	action.showmask=action.startshowtitle;
	reaction.showmask=function(){ 
		animes.showmask.start(); 
	};
	action.showmask.register(reaction.showmask);
	action.showcha=action.startshowtitle;
	reaction.showcha=function(){ 
		animes.showcha.start(); 
	};
	action.showcha.register(reaction.showcha);
	action.startshowresume=action.startshowtitle;
	reaction.startshowresume=function(){ 
		animes.showresume.start(); 
	};
	action.startshowresume.register(reaction.startshowresume);
	action.cursorCha=action.startshowtitle;
	reaction.cursorCha=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorCha.register(reaction.cursorCha);
	action.cursorChaPt=new mse.Script([{src:animes.showmask,type:'end'}]);
	reaction.cursorChaPt=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorChaPt.register(reaction.cursorChaPt);
	action.transContent=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransContent=action.cursorChaPt;
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.cursorCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.cursorCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorCouv.register(reaction.cursorCouv);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.addTextEffet=action.cursorCouv;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.conttext.objList.length; i++){
	var objCible = layers.conttext.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.startText1Police=new mse.Script([{src:objs.obj1322,type:'firstShow'}]);
	reaction.startText1Police=function(){ 
		animes.text1police.start(); 
	};
	action.startText1Police.register(reaction.startText1Police);
	action.startText2police=new mse.Script([{src:objs.obj1345,type:'firstShow'}]);
	reaction.startText2police=function(){ 
		animes.text2police.start(); 
	};
	action.startText2police.register(reaction.startText2police);
	action.startText3police=new mse.Script([{src:objs.obj1346,type:'firstShow'}]);
	reaction.startText3police=function(){ 
		animes.text3police.start(); 
	};
	action.startText3police.register(reaction.startText3police);
	action.startText4police=new mse.Script([{src:objs.obj1355,type:'firstShow'}]);
	reaction.startText4police=function(){ 
		animes.text4police.start(); 
	};
	action.startText4police.register(reaction.startText4police);
	action.startBack3Anime=new mse.Script([{src:objs.obj1380,type:'firstShow'}]);
	reaction.startBack3Anime=function(){ 
		animes.back3anime.start(); 
	};
	action.startBack3Anime.register(reaction.startBack3Anime);
	action.showChaAnime=new mse.Script([{src:objs.obj886,type:'show'}]);
	reaction.showChaAnime=function(){ 
		animes.chatanime.start(); 
	};
	action.showChaAnime.register(reaction.showChaAnime);
	action.startBack1Anime=new mse.Script([{src:objs.obj892,type:'firstShow'}]);
	reaction.startBack1Anime=function(){ 
		animes.back1anime.start(); 
	};
	action.startBack1Anime.register(reaction.startBack1Anime);
	action.startBack2Anime=new mse.Script([{src:objs.obj1449,type:'firstShow'}]);
	reaction.startBack2Anime=function(){ 
		animes.back2anime.start(); 
	};
	action.startBack2Anime.register(reaction.startBack2Anime);
	action.startIntroBeginning=action.transCha;
	reaction.startIntroBeginning=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startIntroBeginning.register(reaction.startIntroBeginning);
	action.startIntroEnd=new mse.Script([{src:objs.obj1434,type:'firstShow'}]);
	reaction.startIntroEnd=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startIntroEnd.register(reaction.startIntroEnd);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);