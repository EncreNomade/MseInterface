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
extend(WindowGame, mse.Game);