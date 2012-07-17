var GameSimonComa = function() {
    mse.Game.call(this);
    
    this.setDirectShow(true);
    this.firstShow = false;
    
    this.offx = mse.coor(mse.joinCoor(-30)); this.offy = mse.coor(mse.joinCoor(0));
    this.width = mse.coor(mse.joinCoor(400)); this.height = mse.coor(mse.joinCoor(560));
    this.darkox = mse.coor(mse.joinCoor(167)); this.darkoy = mse.coor(mse.joinCoor(320));
    this.darkw = mse.coor(mse.joinCoor(50)); this.darkh = mse.coor(mse.joinCoor(43));
    this.darkoffx = mse.coor(mse.joinCoor(174));
    this.maskx = mse.coor(mse.joinCoor(226)); this.masky = mse.coor(mse.joinCoor(343));
    
    this.zone = [mse.coor(mse.joinCoor(226)), mse.coor(mse.joinCoor(340)), 
                 mse.coor(mse.joinCoor(51)), mse.coor(mse.joinCoor(50))];
    this.touching = false;
    this.moveon = false;
    this.startAngle = -30;
    this.ratio = 0;
    
    this.back = new mse.Image(this, {pos:[0,20],size:[this.width,this.height-40]}, "simoncoma");
    this.dark = new mse.Image(null, {pos:[0,0],size:[this.darkw,this.darkh]}, "darkhead");
    this.mask = new mse.Image(this, {pos:[this.maskx,this.masky],size:[mse.coor(mse.joinCoor(51)),mse.coor(mse.joinCoor(44))],globalAlpha:0}, "sangmask");
    
    this.move = function(e) {
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
        if(x >= this.zone[0] && x <= this.zone[0]+this.zone[2] && 
           y >= this.zone[1] && y <= this.zone[1]+this.zone[3]) {
            this.moveon = true;
        }
        else this.moveon = false;
    };
    this.touchStart = function(e) {
        var x = e.offsetX - this.getX();
        var y = e.offsetY - this.getY();
        if(x >= this.zone[0] && x <= this.zone[0]+this.zone[2] && 
           y >= this.zone[1] && y <= this.zone[1]+this.zone[3]) {
            this.touching = true;
        }
    };
    this.touchMove = function(e) {
        var y = e.offsetY - this.getY() - this.zone[1];
        var x = e.offsetX - this.getX() - this.zone[0];
        if( this.touching && x >= 0 && x <= this.zone[2] && y >= 0 && y <= this.zone[3] ) {
            this.ratio = y / this.zone[3];
            if(this.mask.globalAlpha < 1) this.mask.globalAlpha += 0.0025;
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
        
        this.addListener('gestureStart', cbStart, true);
    	this.addListener('gestureUpdate', cbMove, true);
    	this.addListener('gestureEnd', cbEnd, true);
    	this.addListener('move', cbMoveon, true);
    };
    this.end = function() {
        this.removeListener('gestureStart', cbStart);
        this.removeListener('gestureUpdate', cbMove);
        this.removeListener('gestureEnd', cbEnd);
        this.removeListener('move', cbMoveon);
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
    	    ctx.translate(this.getX()+this.darkox, this.getY()+this.darkoy);
    	}
    	else if(this.moveon && !this.touching) {
    	    ctx.translate(this.getX()+this.darkoffx, this.getY()+this.darkoy);
    	}
    	else {
    	    ctx.translate(this.getX()+this.darkoffx+this.darkw/2, this.getY()+this.darkoy+this.darkh/2);
    	    var angle = (this.startAngle + 45*this.ratio) * Math.PI / 180;
    	    ctx.rotate(angle);
    	    ctx.translate(-this.darkw/2, -this.darkh/2);
    	}
    	this.dark.draw(ctx);
    	ctx.restore();
    };
};
extend(GameSimonComa, mse.Game);
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":352.5,"cid4":47.5,"cid5":342.5,"cid6":46.25,"cid7":35,"cid8":197.5,"cid9":38.75,"cid10":425,"cid11":122.5,"cid12":30,"cid13":20,"cid14":190,"cid15":40,"cid16":578.75,"cid17":533.75,"cid18":160,"cid19":27.5,"cid20":601.25,"cid21":543.75,"cid22":13.75,"cid23":400,"cid24":200,"cid25":362.5,"cid26":88.75,"cid27":221.25,"cid28":108.75,"cid29":32.5,"cid30":177.5,"cid31":61.25,"cid32":320,"cid33":247.5,"cid34":357.5,"cid35":121.25,"cid36":227.5,"cid37":421.25,"cid38":17.5,"cid39":340,"cid40":590,"cid41":230,"cid42":10,"cid43":22.5,"cid44":37.5,"cid45":306,"cid46":397.8,"cid47":17,"cid48":306,"cid49":428.4,"cid50":521.25,"cid51":33,"cid52":221,"cid53":109,"cid54":363,"cid55":89,"cid56":248,"cid57":178,"cid58":61,"cid59":18,"cid60":228,"cid61":421,"cid62":358,"cid63":121,"cid64":343,"cid65":46,"cid66":353,"cid67":48,"cid68":123,"cid69":198,"cid70":39,"cid71":273,"cid72":184,"cid73":255,"cid74":301,"cid75":-74,"cid76":-250,"cid77":980,"cid78":1100,"cid79":284,"cid80":159,"cid81":300,"cid82":550,"cid83":428,"cid84":350,"cid85":68,"cid86":60,"cid87":280,"cid88":206,"cid89":129,"cid90":-11,"cid91":211,"cid92":431,"cid93":201,"cid94":-281,"cid95":244,"cid96":309,"cid97":208}');
initMseConfig();
mse.init();
var pages={};
var layers={};
var objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	mse.configs.srcPath='./Voodoo_Ch2/';
	window.root = new mse.Root('Voodoo_Ch2',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src2','images/src2.jpeg','img',true);
	mse.src.addSource('src3','images/src3.jpeg','img',true);
	mse.src.addSource('src4','images/src4.png','img',true);
	mse.src.addSource('src7','images/src7.png','img',true);
	mse.src.addSource('src9','images/src9.png','img',true);
	mse.src.addSource('src10','audios/src10','aud',false);
	mse.src.addSource('src11','audios/src11','aud',false);
	mse.src.addSource('src12','audios/src12','aud',false);
	mse.src.addSource('src13','images/src13.jpeg','img',true);
	mse.src.addSource('src14','images/src14.png','img',true);
	mse.src.addSource('src15','images/src15.png','img',true);
	mse.src.addSource('src16','images/src16.png','img',true);
	mse.src.addSource('src17','images/src17.jpeg','img',true);
	mse.src.addSource('src18','images/src18.jpeg','img',true);
	mse.src.addSource('simoncoma','images/simoncoma.jpeg','img',true);
	mse.src.addSource('darkhead','images/darkhead.png','img',true);
	games.GameSimonComa = new GameSimonComa();
	mse.src.addSource('sangmask','images/sangmask.jpeg','img',true);
	pages.Couverture=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.couver=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1=new mse.Image(layers.couver,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src2'); layers.couver.addObject(objs.obj1);
	pages.Couverture.addLayer('couver',layers.couver);
	layers.title=new mse.Layer(pages.Couverture,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj6=new mse.Text(layers.title,{"size":[mse.coor('cid3'),mse.coor('cid4')],"pos":[mse.coor('cid5'),mse.coor('cid6')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid7')+"px Verdana","textAlign":"left","textBaseline":"top"},'Voodoo Connection',true); layers.title.addObject(objs.obj6);
	objs.obj7=new mse.Text(layers.title,{"size":[mse.coor('cid8'),mse.coor('cid9')],"pos":[mse.coor('cid10'),mse.coor('cid11')],"fillStyle":"rgb(81, 61, 29)","globalAlpha":1,"font":"normal "+mse.coor('cid12')+"px Verdana","textAlign":"left","textBaseline":"top"},'Chris Debien',true); layers.title.addObject(objs.obj7);
	pages.Couverture.addLayer('title',layers.title);
	pages.Aide=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.aideback=new mse.Layer(pages.Aide,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj4=new mse.Image(layers.aideback,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Times"},'src3'); layers.aideback.addObject(objs.obj4);
	pages.Aide.addLayer('aideback',layers.aideback);
	layers.button=new mse.Layer(pages.Aide,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj8=new mse.Image(layers.button,{"size":[mse.coor('cid14'),mse.coor('cid15')],"pos":[mse.coor('cid16'),mse.coor('cid17')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid13')+"px Times","textAlign":"left"},'src4'); layers.button.addObject(objs.obj8);
	objs.obj10=new mse.Text(layers.button,{"size":[mse.coor('cid18'),mse.coor('cid19')],"pos":[mse.coor('cid20'),mse.coor('cid21')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid22')+"px Verdana","textAlign":"left","textBaseline":"top"},'Commencer l\'histoire',true); layers.button.addObject(objs.obj10);
	pages.Aide.addLayer('button',layers.button);
	pages.Chapitre=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.chaback=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj593=new mse.Image(layers.chaback,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src17'); layers.chaback.addObject(objs.obj593);
	pages.Chapitre.addLayer('chaback',layers.chaback);
	layers.text=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj11=new mse.Mask(layers.text,{"size":[mse.coor('cid23'),mse.coor('cid1')],"pos":[mse.coor('cid24'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid13')+"px Times","textAlign":"left"}); layers.text.addObject(objs.obj11);
	pages.Chapitre.addLayer('text',layers.text);
	layers.mask=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj12=new mse.Text(layers.mask,{"size":[mse.coor('cid25'),mse.coor('cid26')],"pos":[mse.coor('cid27'),mse.coor('cid28')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid29')+"px Verdana","textAlign":"center","textBaseline":"top"},'MURUZÉ TROUSSIFÉE RASSIMAIS',true); layers.mask.addObject(objs.obj12);
	objs.obj13=new mse.Text(layers.mask,{"size":[mse.coor('cid30'),mse.coor('cid31')],"pos":[mse.coor('cid32'),mse.coor('cid33')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid29')+"px Verdana","textAlign":"left","textBaseline":"top"},'Chapitre II',true); layers.mask.addObject(objs.obj13);
	objs.obj585=new mse.Text(layers.mask,{"size":[mse.coor('cid34'),mse.coor('cid35')],"pos":[mse.coor('cid36'),mse.coor('cid37')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid38')+"px Verdana","textAlign":"left","textBaseline":"top"},'Simon a du s’échapper de son foyer sous la menace d’une bande qui se fait appeler la Meute. Il s’est enfui à travers les rues de Paris pour se retrouver pris au piège dans le Parc Montsouris… ',true); layers.mask.addObject(objs.obj585);
	pages.Chapitre.addLayer('mask',layers.mask);
	pages.Content=new mse.BaseContainer(null,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj594=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src17'); layers.Contentdefault.addObject(objs.obj594);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid39'),mse.coor('cid40')],"pos":[mse.coor('cid41'),mse.coor('cid42')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid43')+"px Verdana","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid12')},null);
	objs.obj300=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Durant quelques instants, ',true); layers.content.addObject(objs.obj300);
	objs.obj301=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon resta suspendu dans ',true); layers.content.addObject(objs.obj301);
	objs.obj302=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'les airs. Une sensation ',true); layers.content.addObject(objs.obj302);
	objs.obj303=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'unique, enivrante. Comme ',true); layers.content.addObject(objs.obj303);
	objs.obj304=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'s’il volait.',true); layers.content.addObject(objs.obj304);
	objs.obj305=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Il est malade ce type !',true); layers.content.addObject(objs.obj305);
	objs.obj306=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Et soudain, la chute. ',true); layers.content.addObject(objs.obj306);
	objs.obj307=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Interminable. ',true); layers.content.addObject(objs.obj307);
	objs.obj308=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il se mit à paniquer. Devant ',true); layers.content.addObject(objs.obj308);
	objs.obj309=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'lui, il n’y avait qu’un trou ',true); layers.content.addObject(objs.obj309);
	objs.obj310=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'noir, béant, une porte de ',true); layers.content.addObject(objs.obj310);
	objs.obj311=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'ténèbres ouverte sur les ',true); layers.content.addObject(objs.obj311);
	objs.obj312=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Enfers.',true); layers.content.addObject(objs.obj312);
	objs.obj313=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Après tout ce n’était ',true); layers.content.addObject(objs.obj313);
	objs.obj314=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'peut-être pas une bonne ',true); layers.content.addObject(objs.obj314);
	objs.obj315=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'idée.',true); layers.content.addObject(objs.obj315);
	objs.obj316=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - On fait le tour et on le ',true); layers.content.addObject(objs.obj316);
	objs.obj317=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'récupère en bas.',true); layers.content.addObject(objs.obj317);
	objs.obj318=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Ce fut la dernière chose qu’il ',true); layers.content.addObject(objs.obj318);
	objs.obj319=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'entendit avant d’atterrir ',true); layers.content.addObject(objs.obj319);
	objs.obj320=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avec violence dans un épais ',true); layers.content.addObject(objs.obj320);
	objs.obj321=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'taillis. Le choc lui arracha un ',true); layers.content.addObject(objs.obj321);
	objs.obj322=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'cri. ',true); layers.content.addObject(objs.obj322);
	objs.obj323=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Tout son corps lui faisait ',true); layers.content.addObject(objs.obj323);
	objs.obj324=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'mal, ses bras zébrés ',true); layers.content.addObject(objs.obj324);
	objs.obj325=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'d’écorchures, le souffle ',true); layers.content.addObject(objs.obj325);
	objs.obj326=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'définitivement coupé. ',true); layers.content.addObject(objs.obj326);
	objs.obj327=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il n’était pas tombé sur le ',true); layers.content.addObject(objs.obj327);
	objs.obj328=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sol. Il était suspendu juste ',true); layers.content.addObject(objs.obj328);
	objs.obj329=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'au-dessus de la voie ferrée, ',true); layers.content.addObject(objs.obj329);
	objs.obj330=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sauvé par un buisson ',true); layers.content.addObject(objs.obj330);
	objs.obj331=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'providentiel qui poussait ',true); layers.content.addObject(objs.obj331);
	objs.obj332=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dans le vide. ',true); layers.content.addObject(objs.obj332);
	objs.obj333=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Waouh, songea-t-il en ',true); layers.content.addObject(objs.obj333);
	objs.obj334=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'essayant de se dégager, je ',true); layers.content.addObject(objs.obj334);
	objs.obj335=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’ai échappé belle…',true); layers.content.addObject(objs.obj335);
	objs.obj336=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Mais, alors qu’il pensait s’en ',true); layers.content.addObject(objs.obj336);
	objs.obj337=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'être sorti, les racines du ',true); layers.content.addObject(objs.obj337);
	objs.obj338=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'taillis cédèrent d’un seul ',true); layers.content.addObject(objs.obj338);
	objs.obj339=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'coup, propulsant Simon ',true); layers.content.addObject(objs.obj339);
	objs.obj340=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'deux mètres plus bas. ',true); layers.content.addObject(objs.obj340);
	objs.obj341=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Ne pas atterrir sur mon sac, ',true); layers.content.addObject(objs.obj341);
	objs.obj342=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'surtout ne pas atterrir sur ',true); layers.content.addObject(objs.obj342);
	objs.obj343=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'mon sac, fut sa seule pensée ',true); layers.content.addObject(objs.obj343);
	objs.obj344=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avant de rejoindre le ballast. ',true); layers.content.addObject(objs.obj344);
	objs.obj345=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Les angles aigus des pierres ',true); layers.content.addObject(objs.obj345);
	objs.obj346=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'pénétrèrent dans ses côtes ',true); layers.content.addObject(objs.obj346);
	objs.obj347=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'et sa tête heurta le métal de ',true); layers.content.addObject(objs.obj347);
	objs.obj348=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'la voie abandonnée. ',true); layers.content.addObject(objs.obj348);
	objs.obj349=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il était allongé sur une ',true); layers.content.addObject(objs.obj349);
	objs.obj350=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'traverse, son regard bleu ',true); layers.content.addObject(objs.obj350);
	objs.obj351=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'inondé par la lueur de la ',true); layers.content.addObject(objs.obj351);
	objs.obj352=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'pleine lune. Il n’avait plus ',true); layers.content.addObject(objs.obj352);
	objs.obj353=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'envie de bouger, absorbé ',true); layers.content.addObject(objs.obj353);
	objs.obj354=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'par les dessins mystérieux ',true); layers.content.addObject(objs.obj354);
	objs.obj355=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'que traçaient les étoiles ',true); layers.content.addObject(objs.obj355);
	objs.obj356=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dans le ciel.',true); layers.content.addObject(objs.obj356);
	objs.obj357=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Une étrange sensation - ',true); layers.content.addObject(objs.obj357);
	objs.obj358=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'humide et râpeuse à la fois - ',true); layers.content.addObject(objs.obj358);
	objs.obj359=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'le tira de sa rêverie. C’était ',true); layers.content.addObject(objs.obj359);
	objs.obj360=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'la minuscule langue de Dark. ',true); layers.content.addObject(objs.obj360);
	objs.obj610=new GameSimonComa(); layers.content.addGame(objs.obj610);
	objs.obj361=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Dark ! Tu n’as rien ! ',true); layers.content.addObject(objs.obj361);
	objs.obj362=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'s’exclama Simon en se ',true); layers.content.addObject(objs.obj362);
	objs.obj363=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'redressant.',true); layers.content.addObject(objs.obj363);
	objs.obj364=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Aussitôt le rat se lova dans ',true); layers.content.addObject(objs.obj364);
	objs.obj365=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'son cou, rassuré à son tour ',true); layers.content.addObject(objs.obj365);
	objs.obj366=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'par l’état de santé de son ',true); layers.content.addObject(objs.obj366);
	objs.obj367=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'maître.  ',true); layers.content.addObject(objs.obj367);
	objs.obj368=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Il est là. Vivant !',true); layers.content.addObject(objs.obj368);
	objs.obj369=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La Fouine ! ',true); layers.content.addObject(objs.obj369);
	objs.obj370=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La Meute n’avait pas mis ',true); layers.content.addObject(objs.obj370);
	objs.obj371=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'bien longtemps pour le ',true); layers.content.addObject(objs.obj371);
	objs.obj372=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'retrouver. La traque allait ',true); layers.content.addObject(objs.obj372);
	objs.obj373=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'recommencer. Mais ',true); layers.content.addObject(objs.obj373);
	objs.obj374=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’adolescent était fourbu, ',true); layers.content.addObject(objs.obj374);
	objs.obj375=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'perclus de douleurs et il se ',true); layers.content.addObject(objs.obj375);
	objs.obj376=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'voyait mal fuir encore une ',true); layers.content.addObject(objs.obj376);
	objs.obj377=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'fois. ',true); layers.content.addObject(objs.obj377);
	objs.obj378=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il se releva, fouillant  ',true); layers.content.addObject(objs.obj378);
	objs.obj379=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’obscurité alentour. ',true); layers.content.addObject(objs.obj379);
	objs.obj380=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'A droite, le danger...',true); layers.content.addObject(objs.obj380);
	objs.obj381=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'A gauche, l’œil béant d’un ',true); layers.content.addObject(objs.obj381);
	objs.obj382=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'tunnel ferroviaire qui ',true); layers.content.addObject(objs.obj382);
	objs.obj383=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'plongeait sous le Parc.',true); layers.content.addObject(objs.obj383);
	objs.obj384=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il n’y avait pas à hésiter.',true); layers.content.addObject(objs.obj384);
	objs.obj385=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il ramassa sa besace et se ',true); layers.content.addObject(objs.obj385);
	objs.obj386=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'remit en route. Il avait faim, ',true); layers.content.addObject(objs.obj386);
	objs.obj387=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'il avait froid et sa cheville le ',true); layers.content.addObject(objs.obj387);
	objs.obj388=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'faisait affreusement souffrir. ',true); layers.content.addObject(objs.obj388);
	objs.obj389=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il extirpa la lampe de son ',true); layers.content.addObject(objs.obj389);
	objs.obj390=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sac et caressa la fourrure de ',true); layers.content.addObject(objs.obj390);
	objs.obj391=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Dark.',true); layers.content.addObject(objs.obj391);
	objs.obj392=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Eh bien, mon vieux, je ',true); layers.content.addObject(objs.obj392);
	objs.obj393=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'crois que nous sommes en ',true); layers.content.addObject(objs.obj393);
	objs.obj394=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'bien mauvaise posture. ',true); layers.content.addObject(objs.obj394);
	objs.obj395=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Désolé de t’avoir entraîné ',true); layers.content.addObject(objs.obj395);
	objs.obj396=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'là-dedans. ',true); layers.content.addObject(objs.obj396);
	objs.obj397=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Le rongeur l’écoutait d’un air ',true); layers.content.addObject(objs.obj397);
	objs.obj398=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'attentif, dressé sur ses ',true); layers.content.addObject(objs.obj398);
	objs.obj399=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'pattes postérieures, le nez ',true); layers.content.addObject(objs.obj399);
	objs.obj400=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'tendu. ',true); layers.content.addObject(objs.obj400);
	objs.obj401=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Voilà que je me mets à ',true); layers.content.addObject(objs.obj401);
	objs.obj402=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'parler à mon rat comme s’il ',true); layers.content.addObject(objs.obj402);
	objs.obj403=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'comprenait quelque chose !',true); layers.content.addObject(objs.obj403);
	objs.obj404=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Dans la pénombre, l’entrée ',true); layers.content.addObject(objs.obj404);
	objs.obj405=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'du tunnel ressemblait au ',true); layers.content.addObject(objs.obj405);
	objs.obj406=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'porche d’un temple ',true); layers.content.addObject(objs.obj406);
	objs.obj407=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'mystérieux. ',true); layers.content.addObject(objs.obj407);
	objs.obj408=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Indiana Jones. ',true); layers.content.addObject(objs.obj408);
	objs.obj409=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Sauf que l’adolescent ne ',true); layers.content.addObject(objs.obj409);
	objs.obj410=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'possédait ni chapeau, ni ',true); layers.content.addObject(objs.obj410);
	objs.obj411=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'fouet. ',true); layers.content.addObject(objs.obj411);
	objs.obj412=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Simon … Simon … ',true); layers.content.addObject(objs.obj412);
	objs.obj413=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Reviens…',true); layers.content.addObject(objs.obj413);
	objs.obj414=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La voix de Kevin s’élevait ',true); layers.content.addObject(objs.obj414);
	objs.obj415=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dans la nuit. Mielleuse, ',true); layers.content.addObject(objs.obj415);
	objs.obj416=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sournoise. ',true); layers.content.addObject(objs.obj416);
	objs.obj417=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Simon, tu as gagné. Si tu ',true); layers.content.addObject(objs.obj417);
	objs.obj418=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'t’ rends maintenant, j’te ',true); layers.content.addObject(objs.obj418);
	objs.obj419=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'promets qu’on t’fera pas trop ',true); layers.content.addObject(objs.obj419);
	objs.obj420=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'souffrir, ajouta-t-il en raclant ',true); layers.content.addObject(objs.obj420);
	objs.obj421=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'la lame de son couteau ',true);
	objs.obj421.addLink(new mse.Link('la lame de son couteau',122,'audio',mse.src.getSrc('src10'))); layers.content.addObject(objs.obj421);
	objs.obj422=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'contre les pierres d’un ',true); layers.content.addObject(objs.obj422);
	objs.obj423=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'muret.',true); layers.content.addObject(objs.obj423);
	objs.obj424=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Un bruit affreux, qui fit ',true); layers.content.addObject(objs.obj424);
	objs.obj425=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dresser les poils de ',true); layers.content.addObject(objs.obj425);
	objs.obj426=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’adolescent. ',true); layers.content.addObject(objs.obj426);
	objs.obj427=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Hors de question de tomber ',true); layers.content.addObject(objs.obj427);
	objs.obj428=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'entre leurs mains! Il ',true); layers.content.addObject(objs.obj428);
	objs.obj429=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'s’avança dans les ténèbres ',true); layers.content.addObject(objs.obj429);
	objs.obj430=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'du tunnel, guidé par le ',true); layers.content.addObject(objs.obj430);
	objs.obj431=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'minuscule halo de sa lampe ',true); layers.content.addObject(objs.obj431);
	objs.obj432=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'torche. ',true); layers.content.addObject(objs.obj432);
	objs.obj433=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La voûte minérale ',true); layers.content.addObject(objs.obj433);
	objs.obj434=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'répercutait le bruit de ses ',true); layers.content.addObject(objs.obj434);
	objs.obj435=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'pas. ',true); layers.content.addObject(objs.obj435);
	objs.obj436=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon balaya les murs et… ',true); layers.content.addObject(objs.obj436);
	objs.obj437=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'hurla !',true); layers.content.addObject(objs.obj437);
	objs.obj438=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Là, dans la lueur blafarde, ',true); layers.content.addObject(objs.obj438);
	objs.obj439=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'était apparu un visage. ',true); layers.content.addObject(objs.obj439);
	objs.obj440=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Démesuré. Grimaçant.',true); layers.content.addObject(objs.obj440);
	objs.obj441=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Une fresque.',true); layers.content.addObject(objs.obj441);
	objs.obj442=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Quel idiot ! songea-t’il.',true); layers.content.addObject(objs.obj442);
	objs.obj443=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'L’œuvre représentait une ',true); layers.content.addObject(objs.obj443);
	objs.obj444=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'créature démoniaque qui ',true); layers.content.addObject(objs.obj444);
	objs.obj445=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'semblait vouloir dévorer ',true); layers.content.addObject(objs.obj445);
	objs.obj446=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’intrus. Une sorte ',true); layers.content.addObject(objs.obj446);
	objs.obj447=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'d’avertissement.',true); layers.content.addObject(objs.obj447);
	objs.obj603=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]}); layers.content.addObject(objs.obj603);
	objs.obj605=new mse.Image(layers.content,{"size":[mse.coor('cid45'),mse.coor('cid46')],"pos":[mse.coor('cid47'),mse.coor('cid13')]},'src9');
	objs.obj605.activateZoom(); layers.content.addObject(objs.obj605);
	objs.obj604=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]}); layers.content.addObject(objs.obj604);
	objs.obj448=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Impressionné, Simon ',true); layers.content.addObject(objs.obj448);
	objs.obj449=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'trébucha et s’étala de tout ',true); layers.content.addObject(objs.obj449);
	objs.obj450=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'son long. ',true); layers.content.addObject(objs.obj450);
	objs.obj451=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Et merde !',true); layers.content.addObject(objs.obj451);
	objs.obj452=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Une chute sans gravité. Sauf ',true); layers.content.addObject(objs.obj452);
	objs.obj453=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'que Dark, sans doute agacé ',true); layers.content.addObject(objs.obj453);
	objs.obj454=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'d’être de nouveau balloté, ',true); layers.content.addObject(objs.obj454);
	objs.obj455=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avait disparu !',true); layers.content.addObject(objs.obj455);
	objs.obj456=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Dark ! Dark !',true); layers.content.addObject(objs.obj456);
	objs.obj457=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'L’adolescent avait presque ',true); layers.content.addObject(objs.obj457);
	objs.obj458=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'crié. ',true); layers.content.addObject(objs.obj458);
	objs.obj459=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Les conséquences ne se ',true); layers.content.addObject(objs.obj459);
	objs.obj460=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'firent pas attendre. ',true); layers.content.addObject(objs.obj460);
	objs.obj461=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Venez les gars, il est là ! ',true); layers.content.addObject(objs.obj461);
	objs.obj462=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Tout prêt !',true); layers.content.addObject(objs.obj462);
	objs.obj463=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon entendit un bruit de ',true); layers.content.addObject(objs.obj463);
	objs.obj464=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'cavalcade dans sa direction. ',true); layers.content.addObject(objs.obj464);
	objs.obj465=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il balaya la surface du ',true); layers.content.addObject(objs.obj465);
	objs.obj466=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'tunnel. Mais il n’y avait rien ',true); layers.content.addObject(objs.obj466);
	objs.obj467=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'qui ressembla à une ',true); layers.content.addObject(objs.obj467);
	objs.obj468=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'cachette. Pas la moindre ',true); layers.content.addObject(objs.obj468);
	objs.obj469=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'anfractuosité, pas le moindre ',true); layers.content.addObject(objs.obj469);
	objs.obj470=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'bloc où se dissimuler. ',true); layers.content.addObject(objs.obj470);
	objs.obj471=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Juste la queue de Dark qui ',true); layers.content.addObject(objs.obj471);
	objs.obj472=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'disparaissait dans le mur, ',true); layers.content.addObject(objs.obj472);
	objs.obj473=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'quelques mètres devant lui. ',true); layers.content.addObject(objs.obj473);
	objs.obj474=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon se précipita.',true); layers.content.addObject(objs.obj474);
	objs.obj475=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Derrière lui, les prédateurs ',true); layers.content.addObject(objs.obj475);
	objs.obj476=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'se regroupaient.',true); layers.content.addObject(objs.obj476);
	objs.obj477=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - On se met en ligne et on ',true); layers.content.addObject(objs.obj477);
	objs.obj478=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avance. Il n’a aucune ',true); layers.content.addObject(objs.obj478);
	objs.obj479=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'chance de nous échapper.',true); layers.content.addObject(objs.obj479);
	objs.obj480=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Une sueur froide inondait le ',true); layers.content.addObject(objs.obj480);
	objs.obj481=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dos de l’adolescent. La peur.',true); layers.content.addObject(objs.obj481);
	objs.obj482=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Dark ?',true); layers.content.addObject(objs.obj482);
	objs.obj483=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Un couinement, juste devant ',true);
	objs.obj483.addLink(new mse.Link('Un couinement',187,'audio',mse.src.getSrc('src11'))); layers.content.addObject(objs.obj483);
	objs.obj484=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'lui. ',true); layers.content.addObject(objs.obj484);
	objs.obj485=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon s’approcha et ',true); layers.content.addObject(objs.obj485);
	objs.obj486=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'découvrit un trou, de la taille ',true); layers.content.addObject(objs.obj486);
	objs.obj487=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'de son poing, qui semblait ',true); layers.content.addObject(objs.obj487);
	objs.obj488=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avoir été creusé à hauteur ',true); layers.content.addObject(objs.obj488);
	objs.obj489=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'d’homme. Le rat l’attendait ',true); layers.content.addObject(objs.obj489);
	objs.obj490=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'là, comme pour l’inviter à le ',true); layers.content.addObject(objs.obj490);
	objs.obj491=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'suivre.',true); layers.content.addObject(objs.obj491);
	objs.obj492=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Et comment veux-tu que ',true); layers.content.addObject(objs.obj492);
	objs.obj493=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'je rentre là-dedans ? ',true); layers.content.addObject(objs.obj493);
	objs.obj494=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La Meute se rapprochait ',true); layers.content.addObject(objs.obj494);
	objs.obj495=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'encore. Ll’adolescent ',true); layers.content.addObject(objs.obj495);
	objs.obj496=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'plongea ses mains dans ',true); layers.content.addObject(objs.obj496);
	objs.obj497=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’orifice et s’aperçut que les ',true); layers.content.addObject(objs.obj497);
	objs.obj498=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'parois étaient friables. Sans ',true); layers.content.addObject(objs.obj498);
	objs.obj499=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'doute une chatière que l’on ',true); layers.content.addObject(objs.obj499);
	objs.obj500=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avait dissimulée à la hâte. ',true); layers.content.addObject(objs.obj500);
	objs.obj501=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'En quelques gestes, il ',true); layers.content.addObject(objs.obj501);
	objs.obj502=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'dégagea un espace suffisant ',true); layers.content.addObject(objs.obj502);
	objs.obj503=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'pour qu’il puisse s’y ',true); layers.content.addObject(objs.obj503);
	objs.obj504=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'engager. ',true); layers.content.addObject(objs.obj504);
	objs.obj505=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Dark, tu es un génie, ',true); layers.content.addObject(objs.obj505);
	objs.obj506=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'murmura Simon en ',true); layers.content.addObject(objs.obj506);
	objs.obj507=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'songeant à cette vieille ',true); layers.content.addObject(objs.obj507);
	objs.obj508=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'comptine que lui chantait sa ',true); layers.content.addObject(objs.obj508);
	objs.obj509=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'mère, jadis : « Muruzé, ',true); layers.content.addObject(objs.obj509);
	objs.obj510=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Troussifée, Rassimais ». ',true); layers.content.addObject(objs.obj510);
	objs.obj511=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Des mots magiques, qu’il ',true); layers.content.addObject(objs.obj511);
	objs.obj512=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avait mis des années à ',true); layers.content.addObject(objs.obj512);
	objs.obj513=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'comprendre : « Mur usé, ',true); layers.content.addObject(objs.obj513);
	objs.obj514=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'trou s’y fait, rat s’y met… ».',true); layers.content.addObject(objs.obj514);
	objs.obj515=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il sourit un instant puis ',true); layers.content.addObject(objs.obj515);
	objs.obj516=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'plongea le faisceau de sa ',true); layers.content.addObject(objs.obj516);
	objs.obj517=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'lampe dans le minuscule ',true); layers.content.addObject(objs.obj517);
	objs.obj518=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'passage. Impossible d’en ',true); layers.content.addObject(objs.obj518);
	objs.obj519=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'apercevoir le bout. ',true); layers.content.addObject(objs.obj519);
	objs.obj520=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Impossible de savoir où il ',true); layers.content.addObject(objs.obj520);
	objs.obj521=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'allait. ',true); layers.content.addObject(objs.obj521);
	objs.obj522=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Des bruits de pas sur le ',true); layers.content.addObject(objs.obj522);
	objs.obj523=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'gravier, juste derrière lui. ',true); layers.content.addObject(objs.obj523);
	objs.obj524=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Pas le choix !',true); layers.content.addObject(objs.obj524);
	objs.obj525=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il se faufila entre les étroites ',true); layers.content.addObject(objs.obj525);
	objs.obj526=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'parois, les bras en avant, ',true); layers.content.addObject(objs.obj526);
	objs.obj527=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'poussant son sac. Il n’avait ',true); layers.content.addObject(objs.obj527);
	objs.obj528=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'même pas la place de ',true); layers.content.addObject(objs.obj528);
	objs.obj529=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'ramper, contraint d’onduler ',true); layers.content.addObject(objs.obj529);
	objs.obj530=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'à la manière d’un serpent. ',true); layers.content.addObject(objs.obj530);
	objs.obj531=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'La poussière l’aveuglait, de ',true); layers.content.addObject(objs.obj531);
	objs.obj532=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'la boue s’engouffrait dans sa ',true); layers.content.addObject(objs.obj532);
	objs.obj533=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'bouche et il commençait à ',true); layers.content.addObject(objs.obj533);
	objs.obj534=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'suffoquer.',true); layers.content.addObject(objs.obj534);
	objs.obj535=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Le salaud, il essaye encore ',true); layers.content.addObject(objs.obj535);
	objs.obj536=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'de nous échapper !',true); layers.content.addObject(objs.obj536);
	objs.obj537=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Repéré !',true); layers.content.addObject(objs.obj537);
	objs.obj538=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'L’adolescent tenta ',true); layers.content.addObject(objs.obj538);
	objs.obj539=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'d’accélérer le mouvement. ',true); layers.content.addObject(objs.obj539);
	objs.obj540=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Mais plus il avançait, plus il ',true); layers.content.addObject(objs.obj540);
	objs.obj541=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'avait l’impression que le ',true); layers.content.addObject(objs.obj541);
	objs.obj542=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'boyau allait l’avaler, qu’il ',true); layers.content.addObject(objs.obj542);
	objs.obj543=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'allait mourir là. Il aurait ',true); layers.content.addObject(objs.obj543);
	objs.obj544=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'voulu hurler mais sa cage ',true); layers.content.addObject(objs.obj544);
	objs.obj545=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'thoracique était trop ',true); layers.content.addObject(objs.obj545);
	objs.obj546=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'oppressée.',true); layers.content.addObject(objs.obj546);
	objs.obj547=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Vas-y ! Suis-le ! hurlait ',true); layers.content.addObject(objs.obj547);
	objs.obj548=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Kevin.',true); layers.content.addObject(objs.obj548);
	objs.obj549=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Mais…',true); layers.content.addObject(objs.obj549);
	objs.obj550=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Discute pas la Fouine, ',true); layers.content.addObject(objs.obj550);
	objs.obj551=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'vas-y !',true); layers.content.addObject(objs.obj551);
	objs.obj552=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Simon tremblait, la sueur ',true); layers.content.addObject(objs.obj552);
	objs.obj553=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'collait à son front tandis que ',true); layers.content.addObject(objs.obj553);
	objs.obj554=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'l’autre se faufilait déjà à sa ',true); layers.content.addObject(objs.obj554);
	objs.obj555=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'poursuite. Il était mince, ',true); layers.content.addObject(objs.obj555);
	objs.obj556=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'agile et surtout il avait ',true); layers.content.addObject(objs.obj556);
	objs.obj557=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'encore plus peur de Kevin ',true); layers.content.addObject(objs.obj557);
	objs.obj558=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'que lui. ',true); layers.content.addObject(objs.obj558);
	objs.obj559=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Cette fois, Simon était bel et ',true); layers.content.addObject(objs.obj559);
	objs.obj560=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'bien foutu.',true); layers.content.addObject(objs.obj560);
	objs.obj561=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Soudain, un éclair blanc le fit ',true); layers.content.addObject(objs.obj561);
	objs.obj562=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sursauter. Une silhouette ',true); layers.content.addObject(objs.obj562);
	objs.obj563=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'spectrale venait de passer ',true); layers.content.addObject(objs.obj563);
	objs.obj564=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')],"fillStyle":"rgb(255, 255, 255)","font":" "+mse.coor('cid43')+"px Verdana"},'entre son corps et la paroi.',true); layers.content.addObject(objs.obj564);
	objs.obj606=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]}); layers.content.addObject(objs.obj606);
	objs.obj608=new mse.Image(layers.content,{"size":[mse.coor('cid45'),mse.coor('cid46')],"pos":[mse.coor('cid47'),mse.coor('cid13')]},'src13');
	objs.obj608.activateZoom(); layers.content.addObject(objs.obj608);
	objs.obj607=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]}); layers.content.addObject(objs.obj607);
	objs.obj565=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Dans les secondes qui ',true); layers.content.addObject(objs.obj565);
	objs.obj566=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'suivirent, un hurlement ',true);
	objs.obj566.addLink(new mse.Link('hurlement',273,'audio',mse.src.getSrc('src12'))); layers.content.addObject(objs.obj566);
	objs.obj567=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'ébranla le tunnel. ',true); layers.content.addObject(objs.obj567);
	objs.obj568=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Mais l’adolescent n’eut pas le ',true); layers.content.addObject(objs.obj568);
	objs.obj569=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'temps de s’y intéresser car il ',true); layers.content.addObject(objs.obj569);
	objs.obj570=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'venait, enfin, de déboucher ',true); layers.content.addObject(objs.obj570);
	objs.obj571=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'sur un espace plus grand. ',true); layers.content.addObject(objs.obj571);
	objs.obj572=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Il s’assit un instant pour ',true); layers.content.addObject(objs.obj572);
	objs.obj573=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'reprendre son souffle tandis ',true); layers.content.addObject(objs.obj573);
	objs.obj574=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'que Dark lissait ses ',true); layers.content.addObject(objs.obj574);
	objs.obj575=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'moustaches à ses côtés. ',true); layers.content.addObject(objs.obj575);
	objs.obj595=new mse.Image(layers.content,{"size":[mse.coor('cid48'),mse.coor('cid49')],"pos":[mse.coor('cid47'),mse.coor('cid13')]},'src14');
	objs.obj595.activateZoom(); layers.content.addObject(objs.obj595);
	objs.obj576=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Quelques gouttes de sang ',true); layers.content.addObject(objs.obj576);
	objs.obj577=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'poissaient son museau. ',true); layers.content.addObject(objs.obj577);
	objs.obj578=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Le visage de Simon s’éclaira ',true); layers.content.addObject(objs.obj578);
	objs.obj579=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},': l’éclair blanc, le hurlement.',true); layers.content.addObject(objs.obj579);
	objs.obj580=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' - Sacré Dark ! Sans toi, je ',true); layers.content.addObject(objs.obj580);
	objs.obj581=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'n’avais aucune chance… ',true); layers.content.addObject(objs.obj581);
	objs.obj582=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'Maintenant, la question est ',true); layers.content.addObject(objs.obj582);
	objs.obj583=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'de savoir où nous avons ',true); layers.content.addObject(objs.obj583);
	objs.obj584=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},'atterri !',true); layers.content.addObject(objs.obj584);
	objs.obj600=new mse.UIObject(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]}); layers.content.addObject(objs.obj600);
	objs.obj602=new mse.Text(layers.content,{"size":[mse.coor('cid39'),mse.coor('cid44')],"pos":[mse.coor('cid2'),mse.coor('cid50')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid29')+"px Verdana","textAlign":"center"},'À SUIVRE...',true); layers.content.addObject(objs.obj602);
	objs.obj609=new mse.Text(layers.content,{"size":[mse.coor('cid10'),mse.coor('cid44')]},' ',true); layers.content.addObject(objs.obj609);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.maskshow=new mse.Animation(89,1,false);
	animes.maskshow.block=true;
	animes.maskshow.addObj('obj11',objs.obj11);
	animes.maskshow.addAnimation('obj11',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.800000011921,0.800000011921]')});
	animes.titleshow=new mse.Animation(89,1,false);
	animes.titleshow.block=true;
	animes.titleshow.addObj('obj12',objs.obj12);
	animes.titleshow.addAnimation('obj12',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chashow=new mse.Animation(89,1,false);
	animes.chashow.block=true;
	animes.chashow.addObj('obj13',objs.obj13);
	animes.chashow.addAnimation('obj13',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.resumshow=new mse.Animation(89,1,false);
	animes.resumshow.block=true;
	animes.resumshow.addObj('obj585',objs.obj585);
	animes.resumshow.addAnimation('obj585',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.couvershow=new mse.Animation(14,1,false);
	animes.couvershow.block=true;
	animes.couvershow.addObj('obj1',objs.obj1);
	animes.couvershow.addAnimation('obj1',{'frame':JSON.parse('[0,13,14]'),'opacity':JSON.parse('[0,1,1]')});
	animes.voodooshow=new mse.Animation(14,1,false);
	animes.voodooshow.block=true;
	animes.voodooshow.addObj('obj6',objs.obj6);
	animes.voodooshow.addAnimation('obj6',{'frame':JSON.parse('[0,13,14]'),'opacity':JSON.parse('[0,1,1]')});
	animes.chrishow=new mse.Animation(14,1,false);
	animes.chrishow.block=true;
	animes.chrishow.addObj('obj7',objs.obj7);
	animes.chrishow.addAnimation('obj7',{'frame':JSON.parse('[0,13,14]'),'opacity':JSON.parse('[0,1,1]')});
	animes.hurla=new mse.Animation(22,1,true);
	animes.hurla.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid71'),mse.coor('cid72')],'size':[mse.coor('cid73'),mse.coor('cid74')]},'src16');
	animes.hurla.addObj('src16',temp.obj);
	animes.hurla.addAnimation('src16',{'frame':JSON.parse('[0,3,8,21,22]'),'pos':[[mse.coor('cid71'),mse.coor('cid72')],[mse.coor('cid75'),mse.coor('cid76')],[mse.coor('cid75'),mse.coor('cid76')],[mse.coor('cid79'),mse.coor('cid80')],[mse.coor('cid79'),mse.coor('cid80')]],'size':[[mse.coor('cid73'),mse.coor('cid74')],[mse.coor('cid77'),mse.coor('cid78')],[mse.coor('cid77'),mse.coor('cid78')],[mse.coor('cid41'),mse.coor('cid81')],[mse.coor('cid41'),mse.coor('cid81')]],'opacity':JSON.parse('[0.800000011921,1,1,0,0]')});
	animes.simonchute2=new mse.Animation(73,1,true);
	animes.simonchute2.block=true;
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid24'),mse.coor('cid2')],'size':[mse.coor('cid23'),mse.coor('cid1')]},'src7',300,450, 0,0,1200,900);
	animes.simonchute2.addObj('src7',temp.obj);
	animes.simonchute2.addAnimation('src7',{'frame':JSON.parse('[0,13,17,21,25,29,33,37,41,47,72,73]'),'spriteSeq':JSON.parse('[0,0,1,2,3,4,5,6,7,7,7,7]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,1,1,0,0]'),'pos':[[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid2')],[mse.coor('cid24'),mse.coor('cid82')],[mse.coor('cid24'),mse.coor('cid82')]]});
	animes.ratflash=new mse.Animation(39,1,true);
	animes.ratflash.block=true;
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid83'),mse.coor('cid84')],'size':[mse.coor('cid85'),mse.coor('cid86')]},'src15');
	animes.ratflash.addObj('src15',temp.obj);
	animes.ratflash.addAnimation('src15',{'frame':JSON.parse('[0,25,35,36,37,38,39]'),'opacity':JSON.parse('[0,0,1,1,1,1,1]'),'pos':[[mse.coor('cid83'),mse.coor('cid84')],[mse.coor('cid83'),mse.coor('cid84')],[mse.coor('cid83'),mse.coor('cid84')],[mse.coor('cid87'),mse.coor('cid79')],[mse.coor('cid90'),mse.coor('cid91')],[mse.coor('cid94'),mse.coor('cid95')],[mse.coor('cid94'),mse.coor('cid95')]],'size':[[mse.coor('cid85'),mse.coor('cid86')],[mse.coor('cid85'),mse.coor('cid86')],[mse.coor('cid85'),mse.coor('cid86')],[mse.coor('cid88'),mse.coor('cid89')],[mse.coor('cid92'),mse.coor('cid93')],[mse.coor('cid96'),mse.coor('cid97')],[mse.coor('cid96'),mse.coor('cid97')]]});
	var action={};
	var reaction={};
	action.maskshow=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.maskshow=function(){ 
		animes.maskshow.start(); 
	};
	action.maskshow.register(reaction.maskshow);
	action.titleshow=action.maskshow;
	reaction.titleshow=function(){ 
		animes.titleshow.start(); 
	};
	action.titleshow.register(reaction.titleshow);
	action.chashow=action.maskshow;
	reaction.chashow=function(){ 
		animes.chashow.start(); 
	};
	action.chashow.register(reaction.chashow);
	action.resumshow=action.maskshow;
	reaction.resumshow=function(){ 
		animes.resumshow.start(); 
	};
	action.resumshow.register(reaction.resumshow);
	action.couvshow=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.couvshow=function(){ 
		animes.couvershow.start(); 
	};
	action.couvshow.register(reaction.couvshow);
	action.voodooshow=action.couvshow;
	reaction.voodooshow=function(){ 
		animes.voodooshow.start(); 
	};
	action.voodooshow.register(reaction.voodooshow);
	action.chrishow=action.couvshow;
	reaction.chrishow=function(){ 
		animes.chrishow.start(); 
	};
	action.chrishow.register(reaction.chrishow);
	action.transAide=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transAide=function(){ 
		root.transition(pages.Aide); 
	};
	action.addTransAide=new mse.Script([{src:animes.chrishow,type:'end'}]);
	reaction.addTransAide=function(){ 
		action.transAide.register(reaction.transAide); 
	};
	action.addTransAide.register(reaction.addTransAide);
	action.transchap=new mse.Script([{src:objs.obj8,type:'click'}]);
	reaction.transchap=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transchap.register(reaction.transchap);
	action.transContent=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransContent=new mse.Script([{src:animes.resumshow,type:'end'}]);
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.animesimonchute=new mse.Script([{src:objs.obj341,type:'show'}]);
	reaction.animesimonchute=function(){ 
		animes.simonchute2.start(); 
	};
	action.animesimonchute.register(reaction.animesimonchute);
	action.transback=new mse.Script([{src:objs.obj429,type:'firstShow'}]);
	reaction.transback=function(){ 
		temp.width=objs.obj594.getWidth();temp.height=objs.obj594.getHeight();temp.boundingbox=imgBoundingInBox('src18',temp.width,temp.height);temp.obj=new mse.Image(objs.obj594.parent,temp.boundingbox,'src18');mse.transition(objs.obj594,temp.obj,25); 
	};
	action.transback.register(reaction.transback);
	action.starthurla=new mse.Script([{src:objs.obj438,type:'show'}]);
	reaction.starthurla=function(){ 
		animes.hurla.start(); 
	};
	action.starthurla.register(reaction.starthurla);
	action.startratflash=new mse.Script([{src:objs.obj608,type:'show'}]);
	reaction.startratflash=function(){ 
		animes.ratflash.start(); 
	};
	action.startratflash.register(reaction.startratflash);
	action.addTextEffect=action.couvshow;
	reaction.addTextEffect=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.content.objList.length; i++){
	var objCible = layers.content.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffect.register(reaction.addTextEffect);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);