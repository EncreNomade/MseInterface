
// Game Poursuite

// Zombie class
var Zombi = function(game){    
    var x = Math.floor(Math.random() * (600 - 200 + 1) + 600);
    mse.Sprite.call(this, null, {pos:[x, 230], size:[115,164]}, // pos y = 440 pour apparition.
        'zombi', 
        115, 164, 
        0, 0, 
        1265, 328 );
    this.anime = {
        marche: new mse.FrameAnimation(this,[0,1,2,3,4,5,6,7,8,9,10],0,0),
        attend: new mse.FrameAnimation(this,[13,14,15,16,17],0,6),
        baisseBras: new mse.FrameAnimation(this,[11,12,13],1,4),
        leveBras: new mse.FrameAnimation(this,[13,12,11],1,3)
    };
    // this.globalAlpha = 0;
    this.anime.attend.start();
    this.effect = mse.initImageEffect({ "colorfilter": {rMulti: 0, bMulti: 0, gMulti: 0, duration: 40, alpha: 1} }, this);
    this.startEffect(this.effect);
    this.selected = false;
    this.game = game;
    this.boutons = game.boutons.sprite;
    this.time = 0;
    this.maxTime = 1200;  // life time
    this.state = 'ALIVE';
    this.playAnime = {
        avance: false,
        sacrifice: false,
        creer: false        
    };
    this.speed = 1 + 2*Math.random();
    this.dieingTime = 0;
};
extend(Zombi, mse.Sprite);
$.extend(Zombi.prototype, {
    logic: function(delta){        
        mse.Sprite.prototype.logic.call(this, delta);
        for(var i in this.playAnime)
            if(this.playAnime[i]) this.playAnime[i]++;
        if(this.selected && this.game.zombisList.length > 1){
            this.tempsTour -= 0.6;
            if(this.tempsTour < 0) 
                this.game.changeZombi('random');
        }
        if(this.state == 'ALIVE') {
            if (this.effect.count  < 40) {
                this.effect.config.alpha -= 1/40;
            }
            this.time++;
            if(this.time >= this.maxTime) {
                this.state = 'DIEING';
                this.effect.config.alpha = 0;
                this.effect.config.bMulti = 1;
                this.effect.config.gMulti = 1;
                this.effect.config.rMulti = 0;
                this.startEffect(this.effect);
            }
            if(!this.anime.baisseBras.active && !this.anime.attend.active && !this.anime.marche.active) 
                this.anime.attend.start();
            if(this.playAnime.avance){
                if(!this.anime.leveBras.active && !this.anime.marche.active) this.anime.marche.start();
                this.offx += this.speed;
                if(this.playAnime.avance > 300 ) {
                    this.playAnime.avance = false;
                    this.anime.marche.stop();
                    this.anime.baisseBras.start();
                }
            }
            if(this.getX()>2170) this.win();
        }
        else if(this.state == 'DIEING' && this.dieingTime < 40) {
            this.dieingTime++;
            // this.offy += this.dieingTime*1.2; // zombi tombe quand meur
            this.effect.config.alpha += 1/40
            // this.globalAlpha -= 1/41;
        }
        else this.die();
    },
    draw: function(ctx){
        mse.Sprite.prototype.draw.call(this, ctx);
        if(this.selected){
            // dessine la fleche
            ctx.save();
            
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'black';
            var x = this.getX()+this.width/2.5;
            var y = this.getY()-40;
            ctx.beginPath();
            // Rouge
            var x1 = x;
            var y1 = y;
            var x2 = x+15;
            var y2 = y+20;
            var i = 1-this.tempsTour/100;
            ctx.moveTo(x1+(x2-x1)*i, y1+(y2-y1)*i); // haut gauche
            x1 = x+30;
            ctx.lineTo(x1+(x2-x1)*i, y1+(y2-y1)*i); // haut droit
            ctx.lineTo(x+15, y+20); // bas milieu
            x1 = x;
            ctx.lineTo(x1+(x2-x1)*i, y1+(y2-y1)*i); // haut gauche
            ctx.fill();
            // contour noir
            ctx.moveTo(x, y);
            ctx.lineTo(x+30, y);
            ctx.lineTo(x+15, y+20);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            
            ctx.restore();
        }      
        // dessine la vie
        ctx.fillStyle = 'green';
        var w = 1 - this.time/this.maxTime;
        w *= this.width/1.35;
        ctx.fillRect(this.getX()+12, this.getY()-9, w, 8);
        this.roundRect(ctx, this.getX()+10, this.getY()-10, this.width/1.3,10, 3);
    },
    roundRect: function(ctx, x, y, w, h, radius){
        var r = x + w;
        var b = y + h;
        ctx.beginPath();
        ctx.lineWidth="1";
        ctx.moveTo(x+radius, y);
        ctx.lineTo(r-radius, y);
        ctx.quadraticCurveTo(r, y, r, y+radius);
        ctx.lineTo(r, y+h-radius);
        ctx.quadraticCurveTo(r, b, r-radius, b);
        ctx.lineTo(x+radius, b);
        ctx.quadraticCurveTo(x, b, x, b-radius);
        ctx.lineTo(x, y+radius);
        ctx.quadraticCurveTo(x, y, x+radius, y);
        ctx.stroke();
    },
    avance: function(){
        this.playAnime.avance = 1;
        this.combinaison = this.game.combinaison;
        if(!this.anime.marche.active){
            this.anime.attend.stop();
            this.anime.leveBras.start();
        }
    },
    sacrifice: function(zombisList){
        this.state = 'DIEING';
        // anime sacrifice
        this.effect.config.alpha = 0;
        this.effect.config.bMulti = 1;
        this.effect.config.gMulti = 1;
        this.effect.config.rMulti = 0;
        this.startEffect(this.effect);
        this.playAnime.sacrifice = 1;
        this.game.sacrifice.img.setX(this.getX()-this.width/1.3+70);
        this.game.sacrifice.anime.resetAnimation();
        this.game.sacrifice.anime.start();
        
        // detection zombis proche
        var list = this.game.zombisList;
        var touchedZombis = [];
        for(var i in list){
            var ecart = this.getX()-list[i].getX();
            if(Math.abs(ecart) < 70 && this != list[i]) touchedZombis.push(list[i]);
        }
        for(var i in touchedZombis) 
            touchedZombis[i].affect().avance();
            
    },
    affect: function() {
        this.speed *= 1.5;
        this.effect.config.alpha = 0.5;
        this.effect.config.bMulti = 1;
        this.effect.config.gMulti = 0;
        this.effect.config.rMulti = 1;
        this.startEffect(this.effect);
        return this;
    },
    die: function(){
        // TODO : Ameliorer methode
        this.state = 'INACTIVE';
        if(this.game.zombisList.length > 1 && this.selected)
            this.game.changeZombi('random');
        
        this.game.zombisPool.release(this);
        
        if(this.game.zombisList.length == 0)
            delete this.game.currZombi;
    },
    fail: function(){
        // une mauvaise combinaison
        if (this.game.zombisList.length > 1) 
            this.tempsTour = (this.tempsTour > 40) ? 40 : -1;
    },
    win: function(){
        // La ligne d'arrivé à été dépasser
        this.die();
        this.game.winZombis++;
    }
});

// The game
var Poursuite = function(){
    mse.Game.call(this, {fillback:true});
    
    this.width = 600;
    this.height = 440;
    
    this.winZombis = 0;
    
    // ressources
    mse.src.addSource('fond', 'games/fond.jpg', 'img', true);
    mse.src.addSource('tete', 'games/tete.png', 'img', true);   
    mse.src.addSource('zombi', 'games/zombie.png', 'img', true);    
    mse.src.addSource('help1', 'games/Aide1.png', 'img', true);    
    mse.src.addSource('help2', 'games/Aide2.png', 'img', true);    
    mse.src.addSource('ordres', 'games/ordres.png', 'img', true);
    mse.src.addSource('boutons', 'games/Boutons.png', 'img', true);
    mse.src.addSource('symboles', 'games/symboles.png', 'img', true);
    mse.src.addSource('sacrifice', 'games/sacrifice.png', 'img', true);
    
    this.teteImg = new mse.Image(null, {pos:[0,0]}, 'tete');
    this.help1 = new mse.Image(null,{pos:[0,0]}, 'help1');
    this.help2 = new mse.Image(null,{pos:[0,0]}, 'help2');
    
    this.boutons = {};
    this.boutons.sprite = {
        UP:    new mse.Sprite(null, {pos:[this.width-5-52*2,this.height-5-50*2]}, 'boutons', 49, 49, 0   , 0, 49, 49*3),
        DOWN:  new mse.Sprite(null, {pos:[this.width-5-52*2,this.height-5-50]}, 'boutons', 49, 49, 49  , 0, 49, 49*3),
        LEFT:  new mse.Sprite(null, {pos:[this.width-5-52*3,this.height-5-50]}, 'boutons', 49, 49, 49*2, 0, 49, 49*3),
        RIGHT: new mse.Sprite(null, {pos:[this.width-5-52,this.height-5-50]}, 'boutons', 49, 49, 49*3, 0, 49, 49*3)        
    };
    this.boutons.anime = {
        UP: new mse.FrameAnimation(this.boutons.sprite.UP,[0,1,2,0],1,1),
        DOWN: new mse.FrameAnimation(this.boutons.sprite.DOWN,[0,1,2,0],1,1),
        LEFT: new mse.FrameAnimation(this.boutons.sprite.LEFT,[0,1,2,0],1,1),
        RIGHT: new mse.FrameAnimation(this.boutons.sprite.RIGHT,[0,1,2,0],1,1)
    };
    this.boutons.feedbackAnime = false;
    
    this.symboles = {};
    var shad = {shadowOffsetX:0,shadowOffsetY:0,shadowBlur:5,shadowColor:'#000000'};
    this.symboles.sprite = {
        UP: new mse.Sprite(null, {pos:[this.width/2,this.height/2], shadow: shad}, 'symboles', 50, 46, 0, 0, 50, 46),
        DOWN: new mse.Sprite(null, {pos:[this.width/2,this.height/2], shadow: shad}, 'symboles', 50, 46, 50, 0, 50, 46),
        LEFT: new mse.Sprite(null, {pos:[this.width/2,this.height/2], shadow: shad}, 'symboles', 50, 46, 100, 0, 50, 46),
        RIGHT: new mse.Sprite(null, {pos:[this.width/2,this.height/2], shadow: shad}, 'symboles', 50, 46, 150, 0, 50, 46),
        appear: true
    };
    var mapAnime = {
        frame: [0,10],
        pos: [[300+80,220+40],[290+80, 210+40]],
        size: [[50*0.6,46*0.6],[50*1.2, 46*1.2]],
        opacity:[1, 0]
    }
    this.symboles.anime = {
        UP: new mse.KeyFrameAnimation(this.symboles.sprite.UP,mapAnime,1),
        DOWN: new mse.KeyFrameAnimation(this.symboles.sprite.DOWN,mapAnime,1),
        LEFT: new mse.KeyFrameAnimation(this.symboles.sprite.LEFT,mapAnime,1),
        RIGHT: new mse.KeyFrameAnimation(this.symboles.sprite.RIGHT,mapAnime,1)
    };
    
    this.sacrifice = {};
    this.sacrifice.img = new mse.Image(null, {pos:[0,344]}, 'sacrifice');
    this.sacrifice.anime = new mse.KeyFrameAnimation(this.sacrifice.img, {frame: [0,40,60],opacity: [0,1,0],},1);
    
    this.texteOrdre = {};
    this.texteOrdre.sprite = {
        AVANCE: new mse.Sprite(null, {pos: [100,100]}, 'ordres', 520, 110, 0, 220, 520, 110),
        MEURT: new mse.Sprite(null, {pos: [100,100]}, 'ordres', 520, 110, 0, 0, 520, 110),
        VIE: new mse.Sprite(null, {pos: [100,100]}, 'ordres', 520, 110, 0, 110, 520, 110),
        ERREUR: new mse.Sprite(null, {pos: [100,100]}, 'ordres', 520, 110, 0, 330, 520, 110)
    };
    mapAnime = {
        frame: [0,20,40],
        pos: [[320,400],[320*0.9,400],[320*0.8,400]],
        opacity: [0,1,0], 
        size: [[520*0.1,110*0.1],[520*0.2,110*0.2],[520*0.3,110*0.3]]
    };
    this.texteOrdre.anime = {
        AVANCE: new mse.KeyFrameAnimation(this.texteOrdre.sprite.AVANCE, mapAnime, 1),
        MEURT: new mse.KeyFrameAnimation(this.texteOrdre.sprite.MEURT, mapAnime, 1),
        VIE: new mse.KeyFrameAnimation(this.texteOrdre.sprite.VIE, mapAnime, 1),
        ERREUR: new mse.KeyFrameAnimation(this.texteOrdre.sprite.ERREUR, mapAnime, 1)
    };
    
    // Scene
    this.currScene = new mdj.Scene(this, 2189, 440);
    var fondLayer =  new mdj.ObjLayer("fond", this.currScene, 0);
    var objFond = new mse.Image(null, {pos:[0,0]},'fond');
    fondLayer.addObj(objFond);    
    var effectLayer = new mdj.ObjLayer("effet", this.currScene, 3);
    effectLayer.addObj(this.sacrifice.img);

    this.zombiLayer = new mdj.ObjLayer('zombis', this.currScene, 1);
    this.zombisList = this.zombiLayer.objs;
    this.zombisPool = new ObjectPool(Zombi, 20, this.zombisList);
    
    // booléens pour les keyboards events
    this.up = false;this.down = false, 
    this.left = false;this.right = false;
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    
    this.state = "INIT";
    
    this.init = function() {
        this.state = "INIT";
        this.currTime = 0;
        
        this.getEvtProxy().addListener('keydown', this.keyDowncb); // Keyboard        
        this.getEvtProxy().addListener('keyup', this.keyUpcb); // Keyboard
        this.getEvtProxy().addListener('click', this.clickcb, true, this);
        
        
        this.camera = new mdj.Camera(this.width, this.height, this.currScene, objFond, 700,0);
        
        this.combinaison = [];
        for (var i in this.symboles) this.symboles[i].globalAlpha = 0;
        
        this.state = 'HELP1';
    };
    
    this.mobileLazyInit = function() {
    };
    
    this.draw = function(ctx) {
        ctx.save();   
        if(MseConfig.iPhone) ctx.scale(0.8,0.62);     
        this.camera.drawScene(ctx);
        ctx.restore();
        
        if(this.state == 'HELP1')
            this.help1.draw(ctx,0,0);
        else if (this.state == 'HELP2')
            this.help2.draw(ctx);
        else {
            // 4 boutons à l'écran
            ctx.fillRect(0,400, this.width, 40);
            for(var i in this.boutons.sprite) 
                this.boutons.sprite[i].draw(ctx);
            ctx.save();
            // Apparition de symbole a coté du zombi choisi et du texte
            if(this.boutons.feedbackAnime)
                this.symboles.sprite[this.boutons.last].draw(ctx);

            for(var i in this.texteOrdre.sprite) 
                this.texteOrdre.sprite[i].draw(ctx);
                
            // les tetes de zombis
            for(var i = 0; i<this.winZombis; i++)
                this.teteImg.draw(ctx, 20*(i%10), Math.floor(i/10)*30);
                
            // le temps
            ctx.fillStyle = 'rgb(255,255,255)';
            ctx.globalAlpha = 1;
            var timestr = Math.floor(this.currTime/600) +""+ Math.floor((this.currTime%600)/60) +":"+ Math.floor((this.currTime%60)/10) +""+ Math.floor(this.currTime%10);
            ctx.font = "15px Arial";
            ctx.fillText(timestr, this.width-50, 20);
                
            ctx.restore();
        }
    };
    
    this.logic = function(delta) {
        if(this.state == 'PLAYING'){
            this.currTime += delta/1000;
            this.currScene.logic(delta);
            if(this.boutons.feedbackAnime){
                this.boutons.feedbackAnime++;
                if(this.boutons.feedbackAnime > 15) this.boutons.feedbackAnime = false; // fais disparaitre l'anime a coté du zombie TODO : on peut se passer de feedbackAnime en changeant pas grand chose
            }
            if(this.currTime > 100){
                if (this.winZombis >= 5){
                    this.state = 'WIN';
                    this.end();
                }
                else {
                    this.state = 'LOSE';
                    this.lose();
                }
                this.getEvtProxy().removeListener('click', this.clickcb);
                this.getEvtProxy().removeListener('click', this.keyUpcb);
                this.getEvtProxy().removeListener('click', this.keyDowncb);
                this.zombisPool.clear();
            }
        }
    };
    
    this.keyDowncb = new mse.Callback(function(e){
        switch(e.keyCode) {
        case __KEY_UP:
            this.up = true;
            break;
        case __KEY_DOWN:
            this.down = true;
            break;
        case __KEY_LEFT:
            this.left = true;
            break;
        case __KEY_RIGHT:
            this.right = true;
            break;
        default :return;
        }
    }, this);
  
    this.keyUpcb = new mse.Callback(function(e){
        var index = this.combinaison.length;
        switch(e.keyCode) {
        case __KEY_UP:
            if (this.up){
                this.ajouterDir('UP',index);
                this.boutons.anime.UP.start();
                this.up = false;
            }
            break;
        case __KEY_DOWN:
            if (this.down) {
                this.ajouterDir('DOWN',index);
                this.boutons.anime.DOWN.start();
                this.down = false;
            }
            break;
        case __KEY_LEFT:
            if (this.left) {
                this.ajouterDir('LEFT',index);
                this.boutons.anime.LEFT.start();
                this.left = false;
            }
            break;
        case __KEY_RIGHT:
            if (this.right) {
                this.ajouterDir('RIGHT',index);
                this.boutons.anime.RIGHT.start();
                this.right = false;
            }
            break;
        default :return;
        }
    }, this);
    
    this.clickcb = new mse.Callback(function(e){
        if(MseConfig.iPhone) {
            var x = e.offsetX/0.8;
            var y = e.offsetY/0.62;
        }
        else {
            var x = e.offsetX;
            var y = e.offsetY;
        }
        
        if(this.state == 'HELP1') this.state = 'HELP2';
        else if(this.state == 'HELP2') {
            this.state = 'PLAYING';
            var firstZombi = this.zombisPool.initInstance(this);
            this.setCurrZombi(firstZombi);
        }
        else if (this.state == 'PLAYING') {
            for (var i in this.boutons.sprite){
                if(this.boutons.sprite[i].inObj(x,y)) {
                    this.ajouterDir(i,this.combinaison.length);
                    this.boutons.anime[i].start();
                }
            } 
        }
    }, this);
    
    this.ajouterDir = function(dir, index){
        var combinaisonOK = [
            ['LEFT', 'LEFT'],                // Zombi de gauche
            ['RIGHT', 'RIGHT'],              // Zombi de droite
            ['UP', 'RIGHT', 'DOWN', 'RIGHT'],// Avancer
            ['RIGHT', 'LEFT', 'UP', 'DOWN'], // Sacrifier
            ['LEFT', 'UP', 'UP', 'RIGHT']    // Creer
        ];
        var ok = false;
        for(var i in combinaisonOK){
            if(!ok){
                if(combinaisonOK[i][index] == dir) ok = true; // TODO : refaire controle
                if(ok){
                    for(var j in this.combinaison)
                        if(this.combinaison[j] != combinaisonOK[i][j]) ok = false;
                }
            }
        }
        
        if(ok) {
            // WIN TEST
            this.combinaison.push(dir);
            this.boutons.last = dir;
            this.boutons.feedbackAnime = 1;
            this.symboles.anime[dir].resetAnimation();
            this.symboles.anime[dir].start();
            if(this.combinaison.length == 2 && this.combinaison[0] == this.combinaison[1]){
                // 2 fleches == changer de zombi
                this.changeZombi(this.combinaison[0]);                
                this.combinaison = [];
            }
            else if(this.combinaison.length == 4){
                // une commande entiere accepeté
                // mais laquelle ?
                for(var i = 2; i < 5; i++){
                    var win = true;
                    for(var j in combinaisonOK[i]) 
                        if(this.combinaison[j] != combinaisonOK[i][j]) win = false;
                    if(win){
                        switch(i){
                        case 2:
                            if(this.currZombi instanceof Zombi){
                                this.currZombi.avance();
                                this.texteOrdre.anime.AVANCE.resetAnimation();
                                this.texteOrdre.anime.AVANCE.start();
                            }
                            break;
                        case 3:                            
                            if(this.currZombi instanceof Zombi){
                                this.currZombi.sacrifice();
                                this.texteOrdre.anime.MEURT.resetAnimation();
                                this.texteOrdre.anime.MEURT.start();
                            }
                                
                            break;
                        case 4:
                            var newZombi = this.zombisPool.initInstance(this);
                            this.setCurrZombi(newZombi);
                            this.texteOrdre.anime.VIE.resetAnimation();
                            this.texteOrdre.anime.VIE.start();
                            break;
                        }
                    }
                }                
                this.combinaison = [];
            }
        }
        else {
            if(this.currZombi instanceof Zombi)
                this.currZombi.fail();
            this.combinaison = [];
            this.texteOrdre.anime.ERREUR.resetAnimation();
            this.texteOrdre.anime.ERREUR.start();
        }
    };
    
    this.changeZombi = function(dir){
        if(this.zombisList.length < 2) return;
        
        if(dir == 'random') {
            var newZombi = this.zombisList[Math.floor(Math.random()*this.zombisList.length)];
            var curr = this.zombisList.indexOf(this.currZombi);
            var i = 0
            while(i == curr && this.zombisList[i].state !='ALIVE'){ 
                var i = Math.floor(Math.random()*this.zombisList.length);
            }
            var newZombi = this.zombisList.splice(i,1)[0];
        }            
        else {
            for(var i in this.zombisList){
                if(dir == 'LEFT' && this.currZombi.getX() > this.zombisList[i].getX()){
                    if(typeof(bestIndex) == 'undefined')
                        var bestIndex = i;
                    else if(this.zombisList[bestIndex].getX() < this.zombisList[i].getX()) 
                        var bestIndex = i;
                }
                else if(dir == 'RIGHT' && this.currZombi.getX() < this.zombisList[i].getX()){
                    if(typeof(bestIndex) == 'undefined')
                        var bestIndex = i;
                    else if(this.zombisList[bestIndex].getX() > this.zombisList[i].getX()) 
                        var bestIndex = i;
                }
            }
            var newZombi = this.zombisList.splice(bestIndex,1)[0];
        }
        this.zombisList.push(newZombi);
        this.setCurrZombi(newZombi);
    };
    
    this.setCurrZombi = function(newZombi){
        if(this.currZombi instanceof Zombi)
            this.currZombi.selected = false;
        newZombi.selected = true;
        newZombi.tempsTour = 100;
        this.currZombi = newZombi;
        this.combinaison = [];
        
        this.camera.setTarget(this.currScene, this.currZombi)
    };
};
extend(Poursuite, mse.Game);

