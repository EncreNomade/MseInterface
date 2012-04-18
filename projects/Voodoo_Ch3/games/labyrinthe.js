var Labyrinthe = function(){
    mse.Game.call(this, {fillback:true});
    
    //mse.src.addSource('tileset', 'games/Tileset.png', 'img', true);
    //mse.src.addSource('light', 'games/trans.png', 'img', true);
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    this.state = "INIT";
};
extend(Labyrinthe, mse.Game);
$.extend(Labyrinthe.prototype, {
    init: function() {
        this.state = "INIT";
    },
    mobileLazyInit: function() {
    },
    logic: function() {
        
    },
    draw: function() {
        ctx.save();
        ctx.translate(this.offx, this.offy);
        
        ctx.restore();
    }
});