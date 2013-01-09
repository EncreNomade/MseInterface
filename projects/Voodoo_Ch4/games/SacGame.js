var SacGame = function() {
    mse.Game.call(this);
    
    this.setDirectShow(true);
    this.firstShow = false;
    this.audioplaying = false;
    this.audioplaytime = 0;
    
    this.offx = mse.coor(mse.joinCoor(-30)); this.offy = mse.coor(mse.joinCoor(0));
    this.width = mse.coor(mse.joinCoor(400)); this.height = mse.coor(mse.joinCoor(200));
    
    mse.src.addSource('sacsprite', 'games/sac_sprite.jpg', 'img', true);
    this.sac = new mse.Sprite(this, {pos:[0,0],size:[this.width,this.height]}, "sacsprite", 600,300, 0,0,1800,2400);
    this.anime = new mse.FrameAnimation(this.sac, [15,16,17,18,19,20,21,22,23,23,23], 1, 4);
    
    this.touching = false;
    
    this.touchStart = function(e) {
        this.touching = true;
    };
    this.touchMove = function(e) {
        if(!this.touching || this.state != "START") return;
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
        
        if (!this.audioplaying) {
            this.audioplaying = true;
            this.audioplaytime = 0;
            var i = randomInt(2)+1;
            mse.src.getSrc('zip'+i).play();
        }
        
        // Valid action
        if (x > 0.1*this.width && Math.abs(y - 0.5*this.height) < 0.4*this.height) {
            var ratio = Math.ceil(15 * (x - 0.1*this.width) / (0.9*this.width));
            this.sac.setFrame(ratio);
            if(ratio == 15) {
                this.state = "ANIME";
                this.anime.start();
                mse.src.getSrc('peur').play();
            }
        }
    };
    this.touchEnd = function(e) {
        this.touching = false;
    };
    
    var cbStart = new mse.Callback(this.touchStart, this);
    var cbMove = new mse.Callback(this.touchMove, this);
    var cbEnd = new mse.Callback(this.touchEnd, this);
    
    this.state = "INIT";
    
    this.init = function() {
        layers.content.interrupt();
        
        this.getEvtProxy().addListener('gestureStart', cbStart);
    	this.getEvtProxy().addListener('gestureUpdate', cbMove);
    	this.getEvtProxy().addListener('gestureEnd', cbEnd);
    	
    	mse.setCursor('pointer');
    	this.state = "START";
    };
    this.end = function() {
        this.getEvtProxy().removeListener('gestureStart', cbStart);
        this.getEvtProxy().removeListener('gestureUpdate', cbMove);
        this.getEvtProxy().removeListener('gestureEnd', cbEnd);
        mse.root.evtDistributor.setDominate(null);
        
        mse.setCursor('default');
        layers.content.play();
    };
    
    this.draw = function(ctx) {
        if(!this.firstShow) {
        	this.firstShow = true;
        	this.evtDeleg.eventNotif('firstShow');
        	this.evtDeleg.eventNotif('start');
        }
        
        if(this.audioplaying) {
            this.audioplaytime++;
            if(this.audioplaytime > 40)
                this.audioplaying = false;
        }
        
        this.sac.draw(ctx);
    };
    
    this.anime.evtDeleg.addListener('end', new mse.Callback(this.end, this));
};
extend(SacGame, mse.Game);