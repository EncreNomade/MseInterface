mse.src.addSource('persos', 'src/Labyrinthe/Animsimon2.png', 'img', true);
mse.src.addSource('npc', 'src/Parc/personnages.png', 'img', true);
mse.src.addSource('ghost', 'src/Labyrinthe/ghost.png', 'img', true);
mse.src.addSource('trans', 'trans1.png', 'img', true);

var GameTest = function() {
	mse.Game.call(this);
	mdj.setGame(this);

	this.map = new mdj.Map(0,0,"./Map1.tmx");
	var scene = new mdj.Scene(this.map);
	var objLayer = new mdj.ObjLayer();
	
	/*********************  Declaration du NPC 	******************/
	this.npcView = new mdj.Sprite('ghost', [17, 36, 0, 0, 68, 144]);
	this.npc = new mdj.Npc(610, 655, 17,36, [[610,655],[720,655],[720,560],[850,560]],2,false,this.npcView);
	
	this.animRight = new mdj.AnimationSprite(this.npcView, [8, 9, 10, 11],4);
	this.npcView.addAnim("rightNpc", this.animRight);
	this.animLeft = new mdj.AnimationSprite(this.npcView, [4, 5, 6, 7],4);
	this.npcView.addAnim("leftNpc", this.animLeft);
	this.animDown = new mdj.AnimationSprite(this.npcView, [0, 1, 2, 3],4);
	this.npcView.addAnim("downNpc", this.animDown);
	this.animUp = new mdj.AnimationSprite(this.npcView, [12, 13, 14, 15],4);
	this.npcView.addAnim("upNpc", this.animUp);
	
	/********************* Declaration du Hero *******************/
	this.simonView = new mdj.Sprite('persos', [17, 36, 0, 0, 68, 144]);
	this.simon = new mdj.Hero(this.width/2, this.height/2, 17,36, this.simonView);

	this.animDown = new mdj.AnimationSprite(this.simonView, [0, 1, 2, 3],4);
	this.simonView.addAnim("down", this.animDown);
	this.animStopDown = new mdj.AnimationSprite(this.simonView, [0]);
	this.simonView.addAnim("stopDown", this.animStopDown);
	
	this.animUp = new mdj.AnimationSprite(this.simonView, [4, 5, 6, 7],4);
	this.simonView.addAnim("up", this.animUp);
	this.animStopUp = new mdj.AnimationSprite(this.simonView, [4]);
	this.simonView.addAnim("stopUp", this.animStopUp);
	
	this.animRight = new mdj.AnimationSprite(this.simonView, [8, 9, 10, 11],4);
	this.simonView.addAnim("right", this.animRight);
	this.animStopRight = new mdj.AnimationSprite(this.simonView, [8]);
	this.simonView.addAnim("stopRight", this.animStopRight);
	
	this.animLeft = new mdj.AnimationSprite(this.simonView, [12, 13, 14, 15],4);
	this.simonView.addAnim("left", this.animLeft);
	this.animStopLeft = new mdj.AnimationSprite(this.simonView, [12]);
	this.simonView.addAnim("stopLeft", this.animStopLeft);
	
	/********************* la lampe torche ********************/
	this.transView = new mdj.ImgStatic('trans',Math.PI/2);
	this.transView.addMoveWithTarget(this.simon);
	this.trans = new mdj.Item(109,51,260,260,this.transView);
	
	/******************* Assemblage ***************/
	objLayer.addObj(this.npc);
	objLayer.addObj(this.trans);
	objLayer.addObj(this.simon);	
	this.map.addLayer(objLayer, 5);
	
	scene.setCamera(480,360,this.simon,this.offx,this.offy);
	scene.setCollision(this.simon);
	
	this.init = function() {
		this.disx = this.disy = this.compteur= 0;
		this.valid= false;
		this.simon.init(this.width/2,this.height/2);
		this.trans.init(109,51);
		scene.setPosition(0,0);
	}
	this.draw = function(ctx) {
		this.compteur++;
		ctx.save();
		ctx.translate(this.offx, this.offy);
		scene.draw(ctx);
		ctx.fillStyle ="black";
		ctx.beginPath();ctx.rect(0,0,475,356);ctx.arc(237.5,175.5,123,0, Math.PI*2,true);ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText("Temps : "+Math.round(this.compteur*0.1/4)+"s",10 ,10);
		ctx.restore();
	}
	this.logic = function() {
		this.simonView.logic();
        this.npcView.logic();
        this.npc.play();
        this.npc.interagir(this.simon);
	}
};extend(GameTest, mse.Game);