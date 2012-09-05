
//Game Esquive


var Esquive = function(){
    mse.Game.call(this, {fillback:true});
    this.width = mse.coor(mse.joinCoor(600)); 
    this.height = mse.coor(mse.joinCoor(440));    
    
    //mse.src.addSource('fond', 'games/Digicode.jpg', 'img', true);
    
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    this.state = "INIT";
	 
	this.init = function() {
        this.state = "INIT";
        mse.root.evtDistributor.addListener('click', this.clickcb, true, this);


        
        // this.state = 'HELP';
    }
	 
    this.logic = function() {
       
    }
    this.draw = function(ctx) {
		ctx.save();
		ctx.translate(this.offx, this.offy);
        
		
        ctx.restore();
    }
     

    
    this.click= function (e) {
        var x = e.offsetX - this.offx;
        var y = e.offsetY - this.offy;

        
	}
    this.clickcb = new mse.Callback(this.click, this);
    
    
};
extend(Esquive, mse.Game);