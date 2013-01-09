var GameSimonComa = function() {
    mse.Game.call(this);
    
    this.setDirectShow(true);
    this.firstShow = false;
    
    this.offx = mse.coor(mse.joinCoor(-30)); this.offy = mse.coor(mse.joinCoor(0));
    this.width = mse.coor(mse.joinCoor(400)); this.height = mse.coor(mse.joinCoor(560));
    
    this.zone = {
        'dark' : {
            'x' : 0.423*this.width,
            'y' : 0.58*this.height,
            'w' : 0.127*this.width,
            'h' : 0.084*this.height
        },
        'darkact' : {
            'x' : 0.445*this.width,
            'y' : 0.58*this.height,
            'w' : 0.127*this.width,
            'h' : 0.084*this.height
        },
        'mask' : {
            'x' : 0.566*this.width,
            'y' : 0.619*this.height,
            'w' : 0.127*this.width,
            'h' : 0.084*this.height
        },
        'actif' : {
            'x' : 0.556*this.width,
            'y' : 0.608*this.height,
            'w' : 0.156*this.width,
            'h' : 0.135*this.height
        }
    }
    
    this.touching = false;
    this.moveon = false;
    this.startAngle = -30;
    this.ratio = 0;
    
    mse.src.addSource('sangmaskalpha', 'games/sangmask.png', 'img', true);
    this.back = new mse.Image(this, {pos:[0,20],size:[this.width,this.height-40]}, "simoncoma");
    this.dark = new mse.Image(null, {pos:[0,0],size:[this.zone.dark.w,this.zone.dark.h]}, "darkhead");
    this.mask = new mse.Image(this, {pos:[this.zone.mask.x,this.zone.mask.y],size:[this.zone.mask.w, this.zone.mask.h],globalAlpha:0}, "sangmaskalpha");
    
    this.move = function(e) {
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
        if(x >= this.zone.actif.x && x <= this.zone.actif.x+this.zone.actif.w && 
           y >= this.zone.actif.y && y <= this.zone.actif.y+this.zone.actif.h) {
            this.moveon = true;
        }
        else this.moveon = false;
    };
    this.touchStart = function(e) {
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
        if(x >= this.zone.actif.x && x <= this.zone.actif.x+this.zone.actif.w && 
           y >= this.zone.actif.y && y <= this.zone.actif.y+this.zone.actif.h) {
            this.touching = true;
        }
    };
    this.touchMove = function(e) {
        var y = e.offsetY - this.getY() - this.zone.actif.y;
        var x = e.offsetX - this.getX() - this.zone.actif.x;
        if( this.touching && x >= 0 && x <= this.zone.actif.w && y >= 0 && y <= this.zone.actif.h ) {
            this.ratio = y / this.zone.actif.h;
            if(this.mask.globalAlpha < 1) this.mask.globalAlpha += 0.004;
        }
    };
    this.touchEnd = function(e) {
        this.touching = false;
        if(this.mask.globalAlpha >= 1) this.end();
    };
    
    var cbStart = new mse.Callback(this.touchStart, this);
    var cbMove = new mse.Callback(this.touchMove, this);
    var cbEnd = new mse.Callback(this.touchEnd, this);
    var cbMoveon = new mse.Callback(this.move, this);
    
    this.init = function() {
        this.parent.interrupt();
        
        this.getEvtProxy().addListener('gestureStart', cbStart);
    	this.getEvtProxy().addListener('gestureUpdate', cbMove);
    	this.getEvtProxy().addListener('gestureEnd', cbEnd);
    	this.getEvtProxy().addListener('move', cbMoveon);
    };
    this.end = function() {
        this.getEvtProxy().removeListener('gestureStart', cbStart);
        this.getEvtProxy().removeListener('gestureUpdate', cbMove);
        this.getEvtProxy().removeListener('gestureEnd', cbEnd);
        this.getEvtProxy().removeListener('move', cbMoveon);
        mse.root.evtDistributor.setDominate(null);
        
        this.parent.play();
    };
    
    this.draw = function(ctx) {
        if(!this.firstShow) {
        	this.firstShow = true;
        	this.evtDeleg.eventNotif('firstShow');
        	this.evtDeleg.eventNotif('start');
        }
        ctx.save();
    	this.back.draw(ctx);
    	// Mask to show the effet
    	this.mask.draw(ctx);
    	// Dark head
    	ctx.globalAlpha = 1;
    	if(!this.touching && !this.moveon) {
    	    ctx.translate(this.getX()+this.zone.dark.x, this.getY()+this.zone.dark.y);
    	}
    	else if(this.moveon && !this.touching) {
    	    ctx.translate(this.getX()+this.zone.darkact.x, this.getY()+this.zone.darkact.y);
    	}
    	else {
    	    ctx.translate(this.getX()+this.zone.darkact.x+this.zone.darkact.w/2, this.getY()+this.zone.darkact.y+this.zone.darkact.h/2);
    	    var angle = (this.startAngle + 45*this.ratio) * Math.PI / 180;
    	    ctx.rotate(angle);
    	    ctx.translate(-this.zone.darkact.w/2, -this.zone.darkact.h/2);
    	}
    	this.dark.draw(ctx);
    	ctx.restore();
    };
};
extend(GameSimonComa, mse.Game);