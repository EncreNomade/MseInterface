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
        "Simon imagine qu'Arthur essayer de tuer des vaches, Va-t-il réussir à récuperer 20 steaks?\n \nUtilise les flèches pour diriger Arthur et la barre d'espace pour tirer.\n \n \nAttention! Les vaches du coin sont agressives!", true);
    
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
    
    this.logic = function() {
        if(this.state == "INIT")
            return;
        if(this.state == "WIN" || this.state == "LOSE") {
            if(this.count > 0) {
                this.count--;
            }
            else {
                if(this.state == "LOSE") this.lose();
                else this.end();
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
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":358.75,"cid4":46.25,"cid5":342.5,"cid6":35,"cid7":226.25,"cid8":38.75,"cid9":425,"cid10":122.5,"cid11":30,"cid12":860,"cid13":20,"cid14":400,"cid15":200,"cid16":448.75,"cid17":108.75,"cid18":173.75,"cid19":107.5,"cid20":32.5,"cid21":396.25,"cid22":56.25,"cid23":246.25,"cid24":357.5,"cid25":181.25,"cid26":222.5,"cid27":422.5,"cid28":17.5,"cid29":850,"cid30":-50,"cid31":340,"cid32":590,"cid33":230,"cid34":10,"cid35":22.5,"cid36":37.5,"cid37":306,"cid38":397.8,"cid39":17,"cid40":91.25,"cid41":491.25,"cid42":33,"cid43":174,"cid44":108,"cid45":449,"cid46":109,"cid47":246,"cid48":396,"cid49":56,"cid50":18,"cid51":223,"cid52":423,"cid53":358,"cid54":181,"cid55":170,"cid56":460}');
initMseConfig();
mse.init();
window.pages={};
var layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	mse.configs.srcPath='./Voodoo_Ch7/';
	window.root = new mse.Root('Voodoo_Ch7',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src0','images/src0.jpeg','img',true);
	mse.src.addSource('src1','images/src1.jpeg','img',true);
	mse.src.addSource('src2','images/src2.jpeg','img',true);
	games.VacheGame = new VacheGame();
	mse.src.addSource('src3','images/src3.jpeg','img',true);
	mse.src.addSource('src4','images/src4.jpeg','img',true);
	mse.src.addSource('src5','images/src5.jpeg','img',true);
	mse.src.addSource('src6','images/src6.png','img',true);
	mse.src.addSource('sonsirene','audios/sonsirene','aud',false);
	mse.src.addSource('soncoupfeu1','audios/soncoupfeu1','aud',false);
	mse.src.addSource('soncoupfeu2','audios/soncoupfeu2','aud',false);
	mse.src.addSource('sonchute','audios/sonchute','aud',false);
	mse.src.addSource('sontire','audios/sontire','aud',false);
	mse.src.addSource('sonDetonation','audios/sonDetonation','aud',false);
	wikis.Prestance=new mse.WikiLayer();
	wikis.Prestance.addTextCard();
	wikis.Prestance.textCard.addSection('Prestance', 'Nom féminin : \nAllure, comportement imposant d’une personne : avoir de la prestance.\n');
	wikis.Banzai=new mse.WikiLayer();
	wikis.Banzai.addTextCard();
	wikis.Banzai.textCard.addSection('Banzai', 'Exclamation japonaise.\nOn l’utilise lors des mariages, des événements heureux pour souhaiter « longue vie » aux mariés…\nDurant la 2ème guerre mondiale, « Banzai » était le cri des pilotes kamikazes japonais avant qu’ils s’écrasent sur leur cible.\n');
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Couverturedefault=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj0=new mse.Image(layers.Couverturedefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src0'); layers.Couverturedefault.addObject(objs.obj0);
	objs.obj3=new mse.Text(layers.Couverturedefault,{"size":[mse.coor('cid3'),mse.coor('cid4')],"pos":[mse.coor('cid5'),mse.coor('cid4')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid6')+"px Verdana","textAlign":"left","textBaseline":"top"},'Voodoo Connection',true); layers.Couverturedefault.addObject(objs.obj3);
	objs.obj4=new mse.Text(layers.Couverturedefault,{"size":[mse.coor('cid7'),mse.coor('cid8')],"pos":[mse.coor('cid9'),mse.coor('cid10')],"fillStyle":"rgb(81, 61, 29)","globalAlpha":1,"font":"normal "+mse.coor('cid11')+"px Verdana","textAlign":"left","textBaseline":"top"},'Chris Debien',true); layers.Couverturedefault.addObject(objs.obj4);
	pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid12'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Times"},'src1'); layers.Chapitredefault.addObject(objs.obj1);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.Chamask=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj5=new mse.Mask(layers.Chamask,{"size":[mse.coor('cid14'),mse.coor('cid1')],"pos":[mse.coor('cid15'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.50,"font":"normal "+mse.coor('cid13')+"px Times"}); layers.Chamask.addObject(objs.obj5);
	pages.Chapitre.addLayer('Chamask',layers.Chamask);
	layers.chaText=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj6=new mse.Text(layers.chaText,{"size":[mse.coor('cid16'),mse.coor('cid17')],"pos":[mse.coor('cid18'),mse.coor('cid19')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid20')+"px Verdana","textAlign":"center","textBaseline":"top"},'BANZAÏ',true); layers.chaText.addObject(objs.obj6);
	objs.obj7=new mse.Text(layers.chaText,{"size":[mse.coor('cid21'),mse.coor('cid22')],"pos":[mse.coor('cid15'),mse.coor('cid23')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid20')+"px Verdana","textAlign":"center","textBaseline":"top"},'Chapitre VII',true); layers.chaText.addObject(objs.obj7);
	objs.obj8=new mse.Text(layers.chaText,{"size":[mse.coor('cid24'),mse.coor('cid25')],"pos":[mse.coor('cid26'),mse.coor('cid27')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid28')+"px Verdana","textAlign":"left","textBaseline":"top"},'Alors qu’ils pensaient goûter à quelques instants d’un repos bien mérité dans l’antre de l’inspecteur Angéli, nos deux compagnons sont interrompus par l’irruption d’un inconnu visiblement animé d’intentions belliqueuses…',true); layers.chaText.addObject(objs.obj8);
	pages.Chapitre.addLayer('chaText',layers.chaText);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj2=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid12'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Times"},'src1'); layers.Contentdefault.addObject(objs.obj2);
	objs.obj307=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid29'),mse.coor('cid1')],"pos":[mse.coor('cid30'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid13')+"px Times","textAlign":"left"},'src2'); layers.Contentdefault.addObject(objs.obj307);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.mask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj308=new mse.Mask(layers.mask,{"size":[mse.coor('cid14'),mse.coor('cid1')],"pos":[mse.coor('cid15'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.5,"font":"normal "+mse.coor('cid13')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj308);
	pages.Content.addLayer('mask',layers.mask);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid31'),mse.coor('cid32')],"pos":[mse.coor('cid33'),mse.coor('cid34')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid35')+"px Verdana","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid11')},null);
	objs.obj283=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj283);
	objs.obj284=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Les mains en l’air, j’ai dit !',true); layers.content.addObject(objs.obj284);
	objs.obj285=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Simon, terrifié, ne pouvait',true); layers.content.addObject(objs.obj285);
	objs.obj12=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'décoller son regard du fusil ',true); layers.content.addObject(objs.obj12);
	objs.obj13=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'mitrailleur que l’homme ',true); layers.content.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'exhibait à quelques ',true); layers.content.addObject(objs.obj14);
	objs.obj15=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'centimètres de leur visage. ',true); layers.content.addObject(objs.obj15);
	objs.obj16=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'De longues bandes de ',true); layers.content.addObject(objs.obj16);
	objs.obj17=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'cartouches encombraient ',true); layers.content.addObject(objs.obj17);
	objs.obj18=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ses épaules tatouées, tandis ',true); layers.content.addObject(objs.obj18);
	objs.obj19=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'qu’un revolver balançait ',true); layers.content.addObject(objs.obj19);
	objs.obj20=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'contre sa hanche. On aurait ',true); layers.content.addObject(objs.obj20);
	objs.obj21=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dit un Marines tout droit ',true); layers.content.addObject(objs.obj21);
	objs.obj22=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'sorti d’un film américain. ',true); layers.content.addObject(objs.obj22);
	objs.obj23=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Mais Angéli, loin de ',true); layers.content.addObject(objs.obj23);
	objs.obj24=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’inquiéter, partit dans un ',true); layers.content.addObject(objs.obj24);
	objs.obj25=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rire tonitruant tout en ',true); layers.content.addObject(objs.obj25);
	objs.obj26=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'maintenant prudemment sa ',true); layers.content.addObject(objs.obj26);
	objs.obj27=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'mâchoire inférieure. ',true); layers.content.addObject(objs.obj27);
	objs.obj28=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Arthur, Ventre-Dieu ! ',true); layers.content.addObject(objs.obj28);
	objs.obj29=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Calme-toi, ce n’est que moi.',true); layers.content.addObject(objs.obj29);
	objs.obj30=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'L’homme fixait le policier ',true); layers.content.addObject(objs.obj30);
	objs.obj31=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'d’un air ébahi, exactement ',true); layers.content.addObject(objs.obj31);
	objs.obj32=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'comme s’il avait vu un ',true); layers.content.addObject(objs.obj32);
	objs.obj33=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'revenant. Et, à vrai dire, ',true); layers.content.addObject(objs.obj33);
	objs.obj34=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'c’était précisément ce qu’il ',true); layers.content.addObject(objs.obj34);
	objs.obj35=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'était en train de faire.',true); layers.content.addObject(objs.obj35);
	objs.obj36=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Mais tu es…',true); layers.content.addObject(objs.obj36);
	objs.obj37=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - … mort ? Oui je sais. Tout ',true); layers.content.addObject(objs.obj37);
	objs.obj38=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'le monde n’arrête pas de me ',true); layers.content.addObject(objs.obj38);
	objs.obj39=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'le répéter. Crois-moi, je ',true); layers.content.addObject(objs.obj39);
	objs.obj40=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'commence à être ',true); layers.content.addObject(objs.obj40);
	objs.obj41=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'furieusement au courant. ',true); layers.content.addObject(objs.obj41);
	objs.obj42=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Tu bouges… Tu parles… ',true); layers.content.addObject(objs.obj42);
	objs.obj43=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'C’est impossible !',true); layers.content.addObject(objs.obj43);
	objs.obj44=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Il y a quelques jours je ',true); layers.content.addObject(objs.obj44);
	objs.obj45=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'t’aurais dit la même chose.',true); layers.content.addObject(objs.obj45);
	objs.obj46=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Au fil de la conversation, ',true); layers.content.addObject(objs.obj46);
	objs.obj47=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’homme se décomposait. ',true); layers.content.addObject(objs.obj47);
	objs.obj48=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - C’est… C’est moi qui t’ai ',true); layers.content.addObject(objs.obj48);
	objs.obj49=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'trouvé. Tu étais dans ce ',true); layers.content.addObject(objs.obj49);
	objs.obj50=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'fauteuil, mort. Tu avais une ',true); layers.content.addObject(objs.obj50);
	objs.obj51=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rose entre les mains.',true); layers.content.addObject(objs.obj51);
	objs.obj290=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj290);
	objs.obj292=new mse.Image(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid38')],"pos":[mse.coor('cid39'),mse.coor('cid13')]},'src3');
	objs.obj292.activateZoom(); layers.content.addObject(objs.obj292);
	objs.obj291=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj291);
	objs.obj52=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Une rose !? s’étrangla-t-il. ',true); layers.content.addObject(objs.obj52);
	objs.obj53=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Tu en es sûr ?',true); layers.content.addObject(objs.obj53);
	objs.obj54=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Cela faisait plusieurs ',true); layers.content.addObject(objs.obj54);
	objs.obj55=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'semaines maintenant qu’un ',true); layers.content.addObject(objs.obj55);
	objs.obj56=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'mystérieux tueur ',true); layers.content.addObject(objs.obj56);
	objs.obj57=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ensanglantait les rues de la ',true); layers.content.addObject(objs.obj57);
	objs.obj58=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ville, un assassin ',true); layers.content.addObject(objs.obj58);
	objs.obj59=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'insaisissable qui signait ses ',true); layers.content.addObject(objs.obj59);
	objs.obj60=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'crimes d’une rose rouge. ',true); layers.content.addObject(objs.obj60);
	objs.obj61=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Oui… Oui…',true); layers.content.addObject(objs.obj61);
	objs.obj62=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'À présent, l’homme ',true); layers.content.addObject(objs.obj62);
	objs.obj63=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ressemblait à une ',true); layers.content.addObject(objs.obj63);
	objs.obj64=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'marionnette dont on aurait ',true); layers.content.addObject(objs.obj64);
	objs.obj65=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'coupé les fils et il menaçait ',true); layers.content.addObject(objs.obj65);
	objs.obj66=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'de s’effondrer d’un instant à ',true); layers.content.addObject(objs.obj66);
	objs.obj67=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’autre.',true); layers.content.addObject(objs.obj67);
	objs.obj68=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Simon, apporte une chaise ',true); layers.content.addObject(objs.obj68);
	objs.obj69=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'pour mon voisin et ',true); layers.content.addObject(objs.obj69);
	objs.obj70=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'néanmoins ami. Je crois qu’il ',true); layers.content.addObject(objs.obj70);
	objs.obj71=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'va tourner de l’œil. ',true); layers.content.addObject(objs.obj71);
	objs.obj72=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'L’adolescent se précipita et ',true); layers.content.addObject(objs.obj72);
	objs.obj73=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'arriva juste à temps pour ',true); layers.content.addObject(objs.obj73);
	objs.obj74=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'éviter que les fesses ',true); layers.content.addObject(objs.obj74);
	objs.obj75=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'d’Arthur ne s’écrasent sur le ',true); layers.content.addObject(objs.obj75);
	objs.obj76=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'plancher.',true); layers.content.addObject(objs.obj76);
	objs.obj77=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Simon, je te présente le ',true); layers.content.addObject(objs.obj77);
	objs.obj78=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'senior Arthuro del Oliveira, ',true); layers.content.addObject(objs.obj78);
	objs.obj79=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ancien sergent-chef dans les ',true); layers.content.addObject(objs.obj79);
	objs.obj80=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'commandos marine lors de ',true); layers.content.addObject(objs.obj80);
	objs.obj81=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'la guerre du Golfe, déclara ',true); layers.content.addObject(objs.obj81);
	objs.obj82=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Angéli dans un clin d’œil. ',true); layers.content.addObject(objs.obj82);
	objs.obj83=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Comme tu le vois, il n’en est ',true); layers.content.addObject(objs.obj83);
	objs.obj84=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'jamais vraiment revenu… ',true); layers.content.addObject(objs.obj84);
	objs.obj85=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Arthur, je te présente mon ',true); layers.content.addObject(objs.obj85);
	objs.obj86=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ami Simon. ',true); layers.content.addObject(objs.obj86);
	objs.obj293=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj293);
	objs.obj295=new mse.Image(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid38')],"pos":[mse.coor('cid39'),mse.coor('cid13')]},'src4');
	objs.obj295.activateZoom(); layers.content.addObject(objs.obj295);
	objs.obj294=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj294);
	objs.obj87=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - C’est une catastrophe ! ',true); layers.content.addObject(objs.obj87);
	objs.obj88=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'lâcha le voisin.',true); layers.content.addObject(objs.obj88);
	objs.obj89=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Ce n’est pas très gentil ',true); layers.content.addObject(objs.obj89);
	objs.obj90=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'pour lui.',true); layers.content.addObject(objs.obj90);
	objs.obj91=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - C’est pas ça.',true); layers.content.addObject(objs.obj91);
	objs.obj92=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Soudain, un concert de ',true);
	objs.obj92.addLink(new mse.Link('concert',89,'audio',mse.src.getSrc('sonsirene'))); layers.content.addObject(objs.obj92);
	objs.obj93=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'sirènes et de crissements de ',true); layers.content.addObject(objs.obj93);
	objs.obj94=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'pneus s’éleva de la rue. ',true); layers.content.addObject(objs.obj94);
	objs.obj95=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Qu’est-ce qui se passe ',true); layers.content.addObject(objs.obj95);
	objs.obj96=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'encore ?',true); layers.content.addObject(objs.obj96);
	objs.obj97=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Arthur se redressa.',true); layers.content.addObject(objs.obj97);
	objs.obj98=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - C’est de ma faute. Lorsque ',true); layers.content.addObject(objs.obj98);
	objs.obj99=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'j’ai entendu du bruit chez ',true); layers.content.addObject(objs.obj99);
	objs.obj100=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'toi, j’ai prévenu tes ',true); layers.content.addObject(objs.obj100);
	objs.obj101=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'collègues et je me suis ',true); layers.content.addObject(objs.obj101);
	objs.obj102=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'équipé pour intervenir.',true); layers.content.addObject(objs.obj102);
	objs.obj103=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Ca, on a bien vu… Qu’est ',true); layers.content.addObject(objs.obj103);
	objs.obj104=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ce qu’on va faire, ',true); layers.content.addObject(objs.obj104);
	objs.obj105=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'maintenant ? Vu l’état de la ',true); layers.content.addObject(objs.obj105);
	objs.obj106=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'porte, ça m’étonnerait que la ',true); layers.content.addObject(objs.obj106);
	objs.obj107=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'patrouille rentre au ',true); layers.content.addObject(objs.obj107);
	objs.obj108=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'commissariat sans une ',true); layers.content.addObject(objs.obj108);
	objs.obj109=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'explication. S’ils me trouvent ',true); layers.content.addObject(objs.obj109);
	objs.obj110=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ici, ils vont tous nous mettre ',true); layers.content.addObject(objs.obj110);
	objs.obj111=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'sous les verrous en ',true); layers.content.addObject(objs.obj111);
	objs.obj112=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'attendant de comprendre. Et ',true); layers.content.addObject(objs.obj112);
	objs.obj113=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'je risque de finir sous le ',true); layers.content.addObject(objs.obj113);
	objs.obj114=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'bistouri d’un médecin-légiste ',true); layers.content.addObject(objs.obj114);
	objs.obj115=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'au nom de la science.',true); layers.content.addObject(objs.obj115);
	objs.obj116=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Je suis désolé…',true); layers.content.addObject(objs.obj116);
	objs.obj117=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - T’inquiètes Arthur, on va ',true); layers.content.addObject(objs.obj117);
	objs.obj118=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’en sortir. Allez Simon, jette ',true); layers.content.addObject(objs.obj118);
	objs.obj119=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'tout ce qui te paraît utile ',true); layers.content.addObject(objs.obj119);
	objs.obj120=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dans ce grand sac là-bas et ',true); layers.content.addObject(objs.obj120);
	objs.obj121=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'on y va. ',true); layers.content.addObject(objs.obj121);
	objs.obj122=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Je vais vous aider ! ',true); layers.content.addObject(objs.obj122);
	objs.obj123=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'déclara alors Del Oliveira.',true); layers.content.addObject(objs.obj123);
	objs.obj124=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Le soi-disant sous-officier ',true); layers.content.addObject(objs.obj124);
	objs.obj125=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'avait retrouvé toute sa ',true); layers.content.addObject(objs.obj125);
	objs.obj126=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'prestance. La lueur ',true);
	objs.obj126.addLink(new mse.Link('prestance',123,'wiki',wikis.Prestance)); layers.content.addObject(objs.obj126);
	objs.obj127=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'combative qui animait son ',true); layers.content.addObject(objs.obj127);
	objs.obj128=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'regard lorsqu’il avait surgi ',true); layers.content.addObject(objs.obj128);
	objs.obj129=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dans la pièce s’était ',true); layers.content.addObject(objs.obj129);
	objs.obj130=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rallumée.  ',true); layers.content.addObject(objs.obj130);
	objs.obj131=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Allez-y, je vous couvre. ',true); layers.content.addObject(objs.obj131);
	objs.obj132=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Tu es sûr ?',true); layers.content.addObject(objs.obj132);
	objs.obj133=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Je vais les retenir le plus ',true); layers.content.addObject(objs.obj133);
	objs.obj134=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'longtemps possible. ',true); layers.content.addObject(objs.obj134);
	objs.obj135=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - N’en fais pas trop quand ',true); layers.content.addObject(objs.obj135);
	objs.obj136=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'même…',true); layers.content.addObject(objs.obj136);
	objs.obj137=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Banzaï ! conclut-il dans un ',true);
	objs.obj137.addLink(new mse.Link('Banzaï',134,'wiki',wikis.Banzai)); layers.content.addObject(objs.obj137);
	objs.obj138=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'claquement de talons et un ',true); layers.content.addObject(objs.obj138);
	objs.obj139=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'salut militaire impeccables.',true); layers.content.addObject(objs.obj139);
	objs.obj140=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Puis il se glissa hors de ',true); layers.content.addObject(objs.obj140);
	objs.obj141=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’appartement en rampant. ',true); layers.content.addObject(objs.obj141);
	objs.obj142=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Silencieux, il se positionna ',true); layers.content.addObject(objs.obj142);
	objs.obj143=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dans le couloir, prêt à ',true); layers.content.addObject(objs.obj143);
	objs.obj144=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'empêcher quiconque de ',true); layers.content.addObject(objs.obj144);
	objs.obj145=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’engager dans les escaliers.',true); layers.content.addObject(objs.obj145);
	objs.obj146=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'L’adolescent le regarda faire ',true); layers.content.addObject(objs.obj146);
	objs.obj147=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'avec inquiétude.',true); layers.content.addObject(objs.obj147);
	objs.obj148=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Il ne va pas…',true); layers.content.addObject(objs.obj148);
	objs.obj149=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Ne t’inquiète pas. Arthur ',true); layers.content.addObject(objs.obj149);
	objs.obj150=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'n’a jamais mis les pieds hors ',true); layers.content.addObject(objs.obj150);
	objs.obj151=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'de son appartement. Il se ',true); layers.content.addObject(objs.obj151);
	objs.obj152=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rêve héros de guerre mais il ',true); layers.content.addObject(objs.obj152);
	objs.obj153=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'raterait une vache dans un ',true); layers.content.addObject(objs.obj153);
	objs.obj154=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'couloir. Les collègues ne ',true); layers.content.addObject(objs.obj154);
	objs.obj155=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'risquent rien. ',true); layers.content.addObject(objs.obj155);
	objs.obj296=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj296);
	objs.obj298=new VacheGame(); layers.content.addGame(objs.obj298);
	objs.obj297=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj297);
	objs.obj156=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Mais lui ?',true); layers.content.addObject(objs.obj156);
	objs.obj157=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Il va se rendre dès les ',true); layers.content.addObject(objs.obj157);
	objs.obj158=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'premiers coups de feu : il est ',true); layers.content.addObject(objs.obj158);
	objs.obj159=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'trouillard comme ce n’est ',true); layers.content.addObject(objs.obj159);
	objs.obj160=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'pas permis ! Allez ',true); layers.content.addObject(objs.obj160);
	objs.obj161=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dépêche-toi, on n’aura pas ',true); layers.content.addObject(objs.obj161);
	objs.obj162=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'beaucoup d’avance !',true); layers.content.addObject(objs.obj162);
	objs.obj163=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Simon suivit l’inspecteur et ',true); layers.content.addObject(objs.obj163);
	objs.obj164=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ils s’engouffrèrent dans la ',true); layers.content.addObject(objs.obj164);
	objs.obj165=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'minuscule salle de bain qui ',true); layers.content.addObject(objs.obj165);
	objs.obj166=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'occupait le fond de ',true); layers.content.addObject(objs.obj166);
	objs.obj167=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’appartement. Le policier ',true); layers.content.addObject(objs.obj167);
	objs.obj168=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ouvrit la fenêtre et mit ses ',true); layers.content.addObject(objs.obj168);
	objs.obj169=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'mains en coupe pour faire la ',true); layers.content.addObject(objs.obj169);
	objs.obj170=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'courte échelle. ',true); layers.content.addObject(objs.obj170);
	objs.obj171=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Vas-y !',true); layers.content.addObject(objs.obj171);
	objs.obj172=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'L’adolescent enfila son sac à ',true); layers.content.addObject(objs.obj172);
	objs.obj173=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dos et s’engagea sur le toit ',true); layers.content.addObject(objs.obj173);
	objs.obj174=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'qui formait à cet endroit une ',true); layers.content.addObject(objs.obj174);
	objs.obj175=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'petite terrasse en pente ',true); layers.content.addObject(objs.obj175);
	objs.obj176=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'douce. L’inspecteur le ',true); layers.content.addObject(objs.obj176);
	objs.obj177=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rejoignit aussitôt et ils ',true); layers.content.addObject(objs.obj177);
	objs.obj178=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'commencèrent à progresser ',true); layers.content.addObject(objs.obj178);
	objs.obj179=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'prudemment sur le zinc de la ',true); layers.content.addObject(objs.obj179);
	objs.obj180=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'toiture. ',true); layers.content.addObject(objs.obj180);
	objs.obj181=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'En contrebas, ils aperçurent ',true); layers.content.addObject(objs.obj181);
	objs.obj182=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'les véhicules de police en ',true); layers.content.addObject(objs.obj182);
	objs.obj183=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'train de se garer, les ',true); layers.content.addObject(objs.obj183);
	objs.obj184=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'uniformes bleus envahir ',true); layers.content.addObject(objs.obj184);
	objs.obj185=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’immeuble. ',true); layers.content.addObject(objs.obj185);
	objs.obj186=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Bientôt, les premiers coups ',true);
	objs.obj186.addLink(new mse.Link('les premiers coups',186,'audio',mse.src.getSrc('soncoupfeu1'))); layers.content.addObject(objs.obj186);
	objs.obj187=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'de feu retentirent. Le ',true);
	objs.obj187.addLink(new mse.Link('de feu',187,'audio',mse.src.getSrc('soncoupfeu2'))); layers.content.addObject(objs.obj187);
	objs.obj188=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'sergent-chef Del Oliveira ',true); layers.content.addObject(objs.obj188);
	objs.obj189=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'défendait sa position !',true); layers.content.addObject(objs.obj189);
	objs.obj190=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Sautant de terrasse en ',true); layers.content.addObject(objs.obj190);
	objs.obj191=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'terrasse, ils atteignirent ',true); layers.content.addObject(objs.obj191);
	objs.obj192=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rapidement un surplomb qui ',true); layers.content.addObject(objs.obj192);
	objs.obj193=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dominait une cour ',true); layers.content.addObject(objs.obj193);
	objs.obj194=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'encombrée de poubelles ',true); layers.content.addObject(objs.obj194);
	objs.obj195=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'remplies à ras bord.',true); layers.content.addObject(objs.obj195);
	objs.obj196=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - On va descendre ici. ',true); layers.content.addObject(objs.obj196);
	objs.obj197=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Se pinçant le nez, ils se ',true); layers.content.addObject(objs.obj197);
	objs.obj198=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'laissèrent tomber dans les ',true); layers.content.addObject(objs.obj198);
	objs.obj199=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ordures.',true); layers.content.addObject(objs.obj199);
	objs.obj309=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' ',true); layers.content.addObject(objs.obj309);
	objs.obj200=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Votre parfum risque de ne ',true); layers.content.addObject(objs.obj200);
	objs.obj201=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'pas résister à un tel ',true); layers.content.addObject(objs.obj201);
	objs.obj202=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'traitement, railla Simon.',true); layers.content.addObject(objs.obj202);
	objs.obj203=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - On verra ça plus tard, ',true); layers.content.addObject(objs.obj203);
	objs.obj204=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'répondit Angéli en ',true); layers.content.addObject(objs.obj204);
	objs.obj205=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’extirpant avec difficulté du ',true); layers.content.addObject(objs.obj205);
	objs.obj206=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'container où il avait atterrit. ',true); layers.content.addObject(objs.obj206);
	objs.obj207=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Plus vite on se sera éloigné ',true); layers.content.addObject(objs.obj207);
	objs.obj208=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'de ce quartier, mieux ca ',true); layers.content.addObject(objs.obj208);
	objs.obj209=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'vaudra pour nous. ',true); layers.content.addObject(objs.obj209);
	objs.obj210=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Mais, au moment où ',true); layers.content.addObject(objs.obj210);
	objs.obj211=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'l’adolescent parvenait enfin ',true); layers.content.addObject(objs.obj211);
	objs.obj212=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'à sortir de sa poubelle, un ',true); layers.content.addObject(objs.obj212);
	objs.obj213=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'ordre les figea sur place. ',true); layers.content.addObject(objs.obj213);
	objs.obj288=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' ',true); layers.content.addObject(objs.obj288);
	objs.obj214=new mse.Text(layers.content,{"size":[mse.coor('cid31'),mse.coor('cid36')],"pos":[mse.coor('cid2'),mse.coor('cid40')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid11')+"px Verdana","textAlign":"center"},' - Police, ne bougez plus !',true); layers.content.addObject(objs.obj214);
	objs.obj289=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' ',true); layers.content.addObject(objs.obj289);
	objs.obj215=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Sur le petit toit d’où ils ',true); layers.content.addObject(objs.obj215);
	objs.obj216=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'étaient descendus, un jeune ',true); layers.content.addObject(objs.obj216);
	objs.obj217=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'brigadier les braquait de son ',true); layers.content.addObject(objs.obj217);
	objs.obj218=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'arme de service. Arthur ',true); layers.content.addObject(objs.obj218);
	objs.obj219=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'n’avait pas résisté bien ',true); layers.content.addObject(objs.obj219);
	objs.obj220=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'longtemps ! ',true); layers.content.addObject(objs.obj220);
	objs.obj221=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Ils étaient pris. ',true); layers.content.addObject(objs.obj221);
	objs.obj222=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Cependant, l’inspecteur ',true); layers.content.addObject(objs.obj222);
	objs.obj223=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'semblait faire comme s’il ',true); layers.content.addObject(objs.obj223);
	objs.obj224=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'n’avait rien entendu et il ',true); layers.content.addObject(objs.obj224);
	objs.obj225=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'commença à contourner la ',true); layers.content.addObject(objs.obj225);
	objs.obj226=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'poubelle où s’était réfugié ',true); layers.content.addObject(objs.obj226);
	objs.obj227=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Simon.',true); layers.content.addObject(objs.obj227);
	objs.obj228=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Enfonce-toi le plus ',true); layers.content.addObject(objs.obj228);
	objs.obj229=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'possible dans les ordures, ',true); layers.content.addObject(objs.obj229);
	objs.obj230=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'murmura-t-il à l’adolescent. ',true); layers.content.addObject(objs.obj230);
	objs.obj231=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Poursuivant sa course, il vint ',true); layers.content.addObject(objs.obj231);
	objs.obj232=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'se placer derrière le ',true); layers.content.addObject(objs.obj232);
	objs.obj233=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'container, face à la ruelle qui ',true); layers.content.addObject(objs.obj233);
	objs.obj234=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’ouvrait sur la cour. ',true); layers.content.addObject(objs.obj234);
	objs.obj235=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Je vous ai dit de ne pas ',true); layers.content.addObject(objs.obj235);
	objs.obj236=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'bouger ! ',true); layers.content.addObject(objs.obj236);
	objs.obj237=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Angéli tournait le dos au ',true); layers.content.addObject(objs.obj237);
	objs.obj238=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'policier. D’un mouvement ',true); layers.content.addObject(objs.obj238);
	objs.obj239=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'sec du pied, il libéra le ',true); layers.content.addObject(objs.obj239);
	objs.obj240=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'système qui bloquait les ',true); layers.content.addObject(objs.obj240);
	objs.obj241=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'roulettes de la poubelle. Puis ',true); layers.content.addObject(objs.obj241);
	objs.obj242=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'il s’arc-bouta et poussa. ',true); layers.content.addObject(objs.obj242);
	objs.obj243=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Dernière sommation !',true); layers.content.addObject(objs.obj243);
	objs.obj244=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'La poubelle se mit à ',true); layers.content.addObject(objs.obj244);
	objs.obj245=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'avancer. Lentement tout ',true); layers.content.addObject(objs.obj245);
	objs.obj246=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'d’abord. ',true); layers.content.addObject(objs.obj246);
	objs.obj247=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Le policier tira une fois. ',true);
	objs.obj247.addLink(new mse.Link('tira une fois',250,'audio',mse.src.getSrc('sontire'))); layers.content.addObject(objs.obj247);
	objs.obj248=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Juste à côté de son collègue. ',true); layers.content.addObject(objs.obj248);
	objs.obj249=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'C’est bien, il respecte la ',true); layers.content.addObject(objs.obj249);
	objs.obj250=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'procédure, pensa Angéli tout ',true); layers.content.addObject(objs.obj250);
	objs.obj251=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'en poursuivant son effort. ',true); layers.content.addObject(objs.obj251);
	objs.obj252=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'S’il parvenait à atteindre la ',true); layers.content.addObject(objs.obj252);
	objs.obj253=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'rue, c’était gagné. Cette ',true); layers.content.addObject(objs.obj253);
	objs.obj254=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'dernière descendait ',true); layers.content.addObject(objs.obj254);
	objs.obj255=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'directement au bas de ',true); layers.content.addObject(objs.obj255);
	objs.obj256=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Montmartre, juste à côté ',true); layers.content.addObject(objs.obj256);
	objs.obj257=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'d’une station de métro. ',true); layers.content.addObject(objs.obj257);
	objs.obj258=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Une seconde détonation. La ',true);
	objs.obj258.addLink(new mse.Link('seconde',261,'audio',mse.src.getSrc('sonDetonation'))); layers.content.addObject(objs.obj258);
	objs.obj259=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'balle s’enfonça dans les ',true); layers.content.addObject(objs.obj259);
	objs.obj260=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'chairs mortes de l’inspecteur ',true); layers.content.addObject(objs.obj260);
	objs.obj261=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'et s’arrêta sur l’os. Il sourit : ',true); layers.content.addObject(objs.obj261);
	objs.obj262=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'après tout, être mort ',true); layers.content.addObject(objs.obj262);
	objs.obj263=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'comportait quelques ',true); layers.content.addObject(objs.obj263);
	objs.obj264=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'avantages.',true); layers.content.addObject(objs.obj264);
	objs.obj265=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Mon costume ! gronda-t-il ',true); layers.content.addObject(objs.obj265);
	objs.obj266=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'avant de propulser la ',true); layers.content.addObject(objs.obj266);
	objs.obj267=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'poubelle hors de la cour. ',true); layers.content.addObject(objs.obj267);
	objs.obj268=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Il sauta à l’arrière comme s’il ',true); layers.content.addObject(objs.obj268);
	objs.obj269=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'s’agissait d’un wagonnet de ',true); layers.content.addObject(objs.obj269);
	objs.obj270=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'mine, tandis que le brigadier ',true);
	objs.obj270.addLink(new mse.Link('brigadier',273,'audio',mse.src.getSrc('soncoupfeu1'))); layers.content.addObject(objs.obj270);
	objs.obj271=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'vidait son chargeur sur lui. ',true); layers.content.addObject(objs.obj271);
	objs.obj299=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj299);
	objs.obj302=new mse.Image(layers.content,{"size":[mse.coor('cid37'),mse.coor('cid38')],"pos":[mse.coor('cid39'),mse.coor('cid13')]},'src5');
	objs.obj302.activateZoom(); layers.content.addObject(objs.obj302);
	objs.obj300=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj300);
	objs.obj272=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Mais c’était trop tard, le ',true); layers.content.addObject(objs.obj272);
	objs.obj273=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'container était lancé et il ',true); layers.content.addObject(objs.obj273);
	objs.obj274=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'prenait de la vitesse.',true); layers.content.addObject(objs.obj274);
	objs.obj275=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Angéli se fendit d’un bras ',true); layers.content.addObject(objs.obj275);
	objs.obj276=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'d’honneur avant de regarder ',true); layers.content.addObject(objs.obj276);
	objs.obj277=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'la route. Il pâlit en réalisant ',true); layers.content.addObject(objs.obj277);
	objs.obj278=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'que la pente était bien plus ',true); layers.content.addObject(objs.obj278);
	objs.obj279=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'raide que ce qu’il pensait.',true); layers.content.addObject(objs.obj279);
	objs.obj305=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' ',true); layers.content.addObject(objs.obj305);
	objs.obj280=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - On est sauvé ? demanda ',true); layers.content.addObject(objs.obj280);
	objs.obj281=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},'Simon.',true); layers.content.addObject(objs.obj281);
	objs.obj282=new mse.Text(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]},' - Euh…Presque !',true); layers.content.addObject(objs.obj282);
	objs.obj286=new mse.UIObject(layers.content,{"size":[mse.coor('cid9'),mse.coor('cid36')]}); layers.content.addObject(objs.obj286);
	objs.obj287=new mse.Text(layers.content,{"size":[mse.coor('cid31'),mse.coor('cid36')],"pos":[mse.coor('cid2'),mse.coor('cid41')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid11')+"px Verdana","textAlign":"center"},'À SUIVRE...',true); layers.content.addObject(objs.obj287);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.showMask=new mse.Animation(89,1,false);
	animes.showMask.block=true;
	animes.showMask.addObj('obj5',objs.obj5);
	animes.showMask.addAnimation('obj5',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.5,0.5]')});
	animes.showTitle=new mse.Animation(89,1,false);
	animes.showTitle.block=true;
	animes.showTitle.addObj('obj6',objs.obj6);
	animes.showTitle.addAnimation('obj6',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showCha=new mse.Animation(89,1,false);
	animes.showCha.block=true;
	animes.showCha.addObj('obj7',objs.obj7);
	animes.showCha.addAnimation('obj7',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showResume=new mse.Animation(89,1,false);
	animes.showResume.block=true;
	animes.showResume.addObj('obj8',objs.obj8);
	animes.showResume.addAnimation('obj8',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chuteAnime=new mse.Animation(127,1,true);
	animes.chuteAnime.block=true;
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid55'),mse.coor('cid2')],'size':[mse.coor('cid56'),mse.coor('cid1')]},'src6',500,650, 0,0,2500,650);
	animes.chuteAnime.addObj('src6',temp.obj);
	animes.chuteAnime.addAnimation('src6',{'frame':JSON.parse('[0,13,51,54,57,60,63,101,114,127]'),'spriteSeq':JSON.parse('[0,0,0,1,2,3,4,4,4,4]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,0,0]')});
	animes.chBackAnime=new mse.Animation(21,1,false);
	animes.chBackAnime.block=true;
	animes.chBackAnime.addObj('obj307',objs.obj307);
	animes.chBackAnime.addAnimation('obj307',{'frame':JSON.parse('[0,20,21]'),'opacity':JSON.parse('[0,1,1]')});
	var action={};
	var reaction={};
	action.curCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.curCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.curCouv.register(reaction.curCouv);
	action.transCha=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.transContent=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.startShowResume=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.startShowResume=function(){ 
		animes.showResume.start(); 
	};
	action.startShowResume.register(reaction.startShowResume);
	action.startShowCha=action.startShowResume;
	reaction.startShowCha=function(){ 
		animes.showCha.start(); 
	};
	action.startShowCha.register(reaction.startShowCha);
	action.startShowTitle=action.startShowResume;
	reaction.startShowTitle=function(){ 
		animes.showTitle.start(); 
	};
	action.startShowTitle.register(reaction.startShowTitle);
	action.startShowMask=action.startShowResume;
	reaction.startShowMask=function(){ 
		animes.showMask.start(); 
	};
	action.startShowMask.register(reaction.startShowMask);
	action.addTransContent=new mse.Script([{src:animes.showMask,type:'end'}]);
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.curptCha=action.addTransContent;
	reaction.curptCha=function(){ 
		mse.setCursor('pointer'); 
	};
	action.curptCha.register(reaction.curptCha);
	action.curCha=action.startShowResume;
	reaction.curCha=function(){ 
		mse.setCursor('default'); 
	};
	action.curCha.register(reaction.curCha);
	action.curContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.curContent=function(){ 
		mse.setCursor('default'); 
	};
	action.curContent.register(reaction.curContent);
	action.addTextEffet=action.curCouv;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.content.objList.length; i++){
	var objCible = layers.content.getObject(i);
	if(objCible instanceof mse.Text && objCible != objs.obj214){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.chBack=new mse.Script([{src:objs.obj305,type:'firstShow'}]);
	reaction.chBack=function(){ 
		animes.chBackAnime.start(); 
	};
	action.chBack.register(reaction.chBack);
	action.startChuteAnime=new mse.Script([{src:objs.obj200,type:'show'}]);
	reaction.startChuteAnime=function(){ 
		animes.chuteAnime.start(); 
	};
	action.startChuteAnime.register(reaction.startChuteAnime);
	action.startSonChute=new mse.Script([{src:animes.chuteAnime,type:'start'}]);
	reaction.startSonChute=function(){ 
		mse.src.getSrc('sonchute').play(); 
	};
	action.startSonChute.register(reaction.startSonChute);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);