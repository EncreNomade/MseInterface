// Ghost
var Ghost = function(ox, oy, target, layer) {
    this.model = new mdj.BoxModel(ox, oy, 17, 36);
    this.model.target = target;
    this.model.count = 50;
    this.model.opacity = 0;
    this.model.dir = randomInt(4);
    this.model.state = "BIRTH";
    this.model.logic = function() {
        if(this.state == "DEAD" || this.state == "WIN" || this.target.game.state != "PLAYING") return;
        if(this.state == 'BIRTH') {
            if(this.opacity < 1) {
                this.opacity += 0.05;
            }
            else this.state = "LOOK";
            return;
        }
        else if(this.state == "DIEING") {
            if(this.opacity > 0.1) {
                this.opacity -= 0.1;
            }
            else this.state = "DEAD";
            return;
        }
        var dis = distance2Pts(this.ox+8, this.oy+18, this.target.ox+8, this.target.oy+18);
        // Catch check
        if(dis < 20) {
            this.state = "WIN";
            this.target.game.state = "LOSE";
            this.target.game.count = 50;
            this.target.game.input.disable();
            this.target.game.showMsg("Tu as été rattrapé par un fantôme !");
        }
        // Dead check
        var angle = mseAngleForLine(this.target.ox+8, this.target.oy+18, this.ox+8, this.oy+18);
        if(dis < 120) {
            if( (this.target.orient == "LEFT" && (angle > 150 || angle < -150)) ||
                (this.target.orient == "RIGHT" && (angle > -30 && angle < 30)) ||
                (this.target.orient == "DOWN" && (angle > 60 && angle < 120)) ||
                (this.target.orient == "UP" && (angle > -120 && angle < -60)) )
                this.state = "DIEING";
        }
        // Other logic
        if(this.state == "LOOK") {
            if(dis <= 180)
                this.state = "CHASING";
            else {
                if(this.count == 0) {
                    this.dir = randomInt(4);
                    this.count = randomInt(50) + 40;
                }
                else --this.count;
                
                switch(this.dir) {
                case 0: this.move(0, -2);break;
                case 1: this.move(2, 0);break;
                case 2: this.move(0, 2);break;
                case 3: this.move(-2, 0);break;
                }
                if(this.ox < 50 || this.oy < 50 || this.ox > 1830 || this.oy > 1300)
                    this.count = 0;
            }
        }
        else if(this.state == "CHASING") {
            var disy = this.target.oy - this.oy, disx = this.target.ox - this.ox;
            var absdisy = Math.abs(disy), absdisx = Math.abs(disx);
            if(absdisy > 10) this.move(0, 6 * disy/absdisy);
            else if(absdisx > 10) this.move(6 * disx/absdisx, 0);
        }
    };
    this.view = new mdj.Sprite(this.model, 'ghost', {w:17,h:36,sx:0,sy:0,sw:68,sh:144});
    this.view.addAnime("down", new mdj.AnimationSprite(this.view, [0,1,2,3,0], 0, 4));
    this.view.addAnime("left", new mdj.AnimationSprite(this.view, [4,5,6,7,4], 0, 4));
    this.view.addAnime("right", new mdj.AnimationSprite(this.view, [8,9,10,11,8], 0, 4));
    this.view.addAnime("up", new mdj.AnimationSprite(this.view, [12,13,14,15,12], 0, 4));
    this.model.proxy.addListener('movement', new mse.Callback(function(e){
        if(e.dx > 0) var dir = 'right';
        else if(e.dx < 0) var dir = 'left';
        else if(e.dy > 0) var dir = 'down';
        else if(e.dy < 0) var dir = 'up';
        if(this.prevDir != dir) {
            this.playAnime(dir);
        }
        this.prevDir = dir;
    }, this.view));
    
    layer.addObj(this.view);
    
    this.reinit = function(ox, oy) {
        this.model.count = 20;
        this.model.opacity = 0;
        this.model.state = "BIRTH";
        this.model.setPos(ox, oy);
    };
};

var Donjon = function(){
    mse.Game.call(this, {fillback:true});
    
    mse.src.addSource('light', 'games/trans.png', 'img', true);
    mse.src.addSource('sprite', 'games/sprite.png', 'img', true);
    mse.src.addSource('batery', 'games/Batterie.png', 'img', true);
    mse.src.addSource('map', 'games/map.jpg', 'img', true);
    mse.src.addSource('ghost', 'games/ghost.png', 'img', true);
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    this.objGid = {
        hole: [513, 1067, 1962, 1990],
        skelton: [611, 1025, 1071, 1073, 1074, 1083, 1131, 1135, 1143, 1192, 1193, 1195, 1204, 1247, 1964, 2023, 2024, 2069]
    };
    
    this.currScene = new mdj.TileMapScene(this, 1920, 1376, 
                                          mse.configs.getSrcPath("games/map.tmx"),
                                          "games/", 
                                          new mse.Callback(function(){
        // Lazy init function
        // Simon model and input
        this.simonM = new mdj.BoxModel(136, 96, 17, 37);
        this.simonM.setCollisionBox(2,20,13,17);
        this.simonM.orient = "DOWN";
        this.simonM.game = this;
        var colliDetector = new mdj.CollisionDetector(this.simonM);
        colliDetector.register('tilelayer', this.currScene.getLayer('colli'), this.simonM.cancelMove);
        // Collision with objs
        colliDetector.register('objs', this.currScene.getLayer('elem'), new mse.Callback(function(e){
            if($.inArray(e.gid, this.objGid.hole) != -1) {
                this.simonV.playAnime('turn');
                this.simonM.setPos(136, 96);
            }
            else if($.inArray(e.gid, this.objGid.skelton) != -1) {
                this.simonM.inputv = 0.5;
                this.simonM.count = 5;
            }
            else if(e.gid == 1013) {
                this.state = "WIN";
                this.count = 50;
                this.input.disable();
                this.simonV.getAnime('turn').rep = 4;
                this.simonV.playAnime('turn');
                this.showMsg("Simon as trouvé la sortie !");
            }
        }, this));
        this.simonM.logic = function(delta) {
            if(this.inputv == 0.5) {
                if(this.count == 0) this.inputv = 4;
                else --this.count;
            }
        };
        // Simon view and animations
        this.simonV = new mdj.Sprite(this.simonM, 'sprite', {w:17,h:37,sx:0,sy:0,sw:68,sh:148});
        this.simonV.addAnime("runDOWN", new mdj.AnimationSprite(this.simonV, [0,1,2,3,0], 0, 4));
        this.simonV.addAnime("runUP", new mdj.AnimationSprite(this.simonV, [4,5,6,7,4], 0, 4));
        this.simonV.addAnime("runRIGHT", new mdj.AnimationSprite(this.simonV, [8,9,10,11,10,9,8], 0, 4));
        this.simonV.addAnime("runLEFT", new mdj.AnimationSprite(this.simonV, [15,14,13,12,13,14,15], 0, 4));
        this.simonV.addAnime("turn", new mdj.AnimationSprite(this.simonV, [15,4,8,0], 8, 2));
        
        var persoLayer = new mdj.ObjLayer("perso", this.currScene, 4, 0, 0);
        persoLayer.addObj(this.simonV);
        
        // Ghost layer
        this.ghosts = [];
        for(var i = 0; i < 10; i++) {
            this.ghosts.push(new Ghost(50 + randomInt(1700), 50 + randomInt(1200), this.simonM, persoLayer));
        }
        
        this.camera = new mdj.Camera(this.width, this.height, this.currScene, this.simonM, 8, 18);
    }, this));
    
    var maskLayer = new mdj.Layer("mask", this.currScene, 3);
    maskLayer.draw = function(ctx){
        var game = this.getScene().game;
        ctx.save();
        ctx.translate(game.camera.ox, game.camera.oy);
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.rect(0,0,game.width,game.height);
        
        ctx.translate(game.width/2, game.height/2);
        switch(game.simonM.orient) {
        case "DOWN": ctx.rotate(0.5*Math.PI);break;
        case "UP": ctx.rotate(-0.5*Math.PI);break;
        case "LEFT": ctx.rotate(Math.PI);break;
        case "RIGHT": break;
        }
        ctx.arc(0, 0, 118.5, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        ctx.drawImage(mse.src.getSrc('light'), -119, -119);
        ctx.restore();
    };
    
    // Help message
    if(MseConfig.iOS) this.help = "Aide Simon à sortir du labyrinthe, fais glliser ton doigt dans la direction souhaitée.";
    else this.help = "Aide Simon à sortir du labyrinthe, à l'aide des flèches.";
    this.info = new mse.Text(null, {pos:[90,0],size:[this.width-180,0],font:"20px Arial",textAlign:"center",textBaseline:"top",fillStyle:"#000",lineHeight:25}, this.help, true);
    this.info.setY((this.height - this.info.height)/2);
    
    // Light
    this.light = new mse.Sprite(null, {pos:[20,20],size:[22,9]}, 'batery', 22,9, 0,0,132,9);
    // Map
    this.map = new mse.Image(null, {pos:[2*this.width/3-20, 20],size:[this.width/3,0.715*this.width/3]}, 'map');
    
    this.state = "INIT";
};
extend(Donjon, mse.Game);
$.extend(Donjon.prototype, {
    init: function() {
        this.currScene.init();
        this.input = new mdj.DirectionalInput(this, this.simonM, this.getEvtProxy());
        this.input.disable();
        this.input.proxy.addListener('dirChange', new mse.Callback(function(e){
            switch(e.dir) {
            case "DOWN": case "UP": case "LEFT": case "RIGHT": 
                this.simonV.playAnime('run'+e.dir);
                this.simonM.orient = e.dir;
                break;
            case "NONE":
                this.simonV.stopAnime();
                switch (e.prev) {
                case "DOWN": this.simonV.setFrame(0);break;
                case "UP": this.simonV.setFrame(4);break;
                case "LEFT": this.simonV.setFrame(15);break;
                case "RIGHT": this.simonV.setFrame(8);break;
                }
            }
        }, this));
        this.simonM.inputv = 6;
        this.simonM.setPos(136, 96);
        // Orientation
        this.simonM.orient = "DOWN";
        
        // Ghosts
        for(var i = 0; i < this.ghosts.length; ++i)
            this.ghosts[i].reinit(50 + randomInt(1700), 50 + randomInt(1200));
        
        // UI objects
        this.showMsg(this.help);
        this.light.setFrame(0);

        this.simonV.playAnime('turn');
        this.state = "INIT";
        this.currTime = 0;
        this.nblight = 3;
    },
    showMsg: function(txt) {
        this.info.setText(txt);
        this.msgVisible = true;
        this.msgCount = 40;
    },
    mobileLazyInit: function() {
    },
    logic: function(delta) {
        if(this.state == "INIT" && this.currTime > 5) {
            this.state = "PLAYING";
            this.msgVisible = false;
            this.input.enable();
            this.currTime == 1;
        }
        if(this.state == "PLAYING") {
            if(this.currTime % 15 < 0.04) {
                if(this.light.curr < 5) this.light.setFrame(this.light.curr+1);
            }
            if(this.currTime % 75 < 0.04) {
                if(this.nblight >= 1) {
                    this.nblight--;
                    this.light.setFrame(0);
                }
                if(this.nblight == 0) {
                    this.state = "LOSE";
                    this.count = 50;
                    this.input.disable();
                    this.showMsg("Il n'y a plus de pile !");
                }
            }
            if(this.msgVisible) {
                if(this.msgCount == 0) this.msgVisible = false;
                else --this.msgCount;
            }
        }
        if(this.state == "WIN" || this.state == "LOSE") {
            if(this.count == 0) {
                this.state == "WIN" ? this.end() : this.lose();
            }
            else this.count--;
        }
        this.currScene.logic(delta);
        for(var i = 0; i < this.ghosts.length; ++i) {
            if(this.ghosts[i].model.state == "DEAD") {
                this.ghosts[i].reinit(50 + randomInt(1700), 50 + randomInt(1200));
            }
        }
        
        this.currTime += 0.04;
    },
    draw: function(ctx) {
        ctx.save();
        
        this.camera.drawScene(ctx);
        
        // Light
        this.light.draw(ctx);
        ctx.fillStyle = "#fff";
        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.font = "10px Arial";
        ctx.fillText(this.nblight, 45, 20);
        // Map
        this.map.draw(ctx);
        // Msg
        if(this.msgVisible) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#fff";
            ctx.globalAlpha = ctx.globalAlpha * 0.3;
            ctx.fillRoundRect(50,this.info.offy-30,this.width-100,this.info.height+60, 10);
            ctx.globalAlpha = 0.7;
            this.info.draw(ctx);
        }
        
        ctx.restore();
    }
});