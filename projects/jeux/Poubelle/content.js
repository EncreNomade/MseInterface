var Poubelle = function(){
    mse.Game.call(this, {fillback:true});
    
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné.",
        "LOSE": "Perdu..."
    };
    this.state = "INIT";
};
extend(Poubelle, mse.Game);
$.extend(Poubelle.prototype, {
    init: function() {
        this.state = "INIT";
    },
    mobileLazyInit: function() {
    },
    logic: function() {
        
    },
    draw: function(ctx) {
        ctx.save();
        ctx.translate(this.offx, this.offy);
		  
		  var fond = mse.src.getSrc('fond');
		  var scale = fond.width/600;
		  ctx.drawImage(fond, this.offx, this.offy);
        
        ctx.restore();
    }
});
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":200,"cid3":590,"cid4":10,"cid5":12.5,"cid6":20,"cid7":250,"cid8":25}');initMseConfig();mse.init();var pages={};var layers={};var objs={};var animes={};var games={};var wikis={};function createbook(){mse.configs.srcPath='./Poubelle/';window.root = new mse.Root('Poubelle',mse.coor('cid0'),mse.coor('cid1'),'portrait');var temp = {};games.Poubelle = new Poubelle();pages.Jeu=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});layers.Jeudefault=new mse.Layer(pages.Jeu,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});pages.Jeu.addLayer('Jeudefault',layers.Jeudefault);layers.Poubelle=new mse.ArticleLayer(pages.Jeu,2,{"size":[mse.coor('cid2'),mse.coor('cid3')],"pos":[mse.coor('cid4'),mse.coor('cid4')],"globalAlpha":1,"font":"normal "+mse.coor('cid5')+"px ","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid6')},null);objs.obj0=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj0);objs.obj1=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj1);objs.obj2=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj2);objs.obj3=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')],"fillStyle":"rgb(255, 186, 132)"});layers.Poubelle.addObject(objs.obj3);objs.obj17=new Poubelle();layers.Poubelle.addGame(objs.obj17);objs.obj4=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj4);objs.obj5=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj5);objs.obj6=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj6);objs.obj7=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj7);objs.obj8=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj8);objs.obj9=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj9);objs.obj10=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj10);objs.obj11=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj11);objs.obj12=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj12);objs.obj13=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj13);objs.obj14=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj14);objs.obj15=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj15);objs.obj16=new mse.UIObject(layers.Poubelle,{"size":[mse.coor('cid7'),mse.coor('cid8')]});layers.Poubelle.addObject(objs.obj16);pages.Jeu.addLayer('Poubelle',layers.Poubelle);var action={};var reaction={};mse.currTimeline.start();};mse.autoFitToWindow(createbook);