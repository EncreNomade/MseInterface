var Balle = function(sprite, x, y, deltax, deltay, enemy) {
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