
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":448.75,"cid7":108.75,"cid8":173.75,"cid9":107.5,"cid10":32.5,"cid11":396.25,"cid12":56.25,"cid13":201.25,"cid14":246.25,"cid15":340,"cid16":590,"cid17":230,"cid18":10,"cid19":22.5,"cid20":36.25,"cid21":425,"cid22":496.25,"cid23":18,"cid24":223,"cid25":399,"cid26":358,"cid27":181,"cid28":33,"cid29":174,"cid30":108,"cid31":449,"cid32":109,"cid33":201,"cid34":246,"cid35":396,"cid36":56,"cid37":234,"cid38":365}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch5/';
	window.root = mse.root;
	var temp = {};
	animes.resumeAnime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.resumeAnime.block=true;
	animes.maskAnime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.maskAnime.block=true;
	animes.titleAnime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.titleAnime.block=true;
	animes.chaAnime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.chaAnime.block=true;
	mse.src.addSource('src6','images/src6.png','img',true);
	mse.src.addSource('soncoup','audios/soncoup','aud',false);
	mse.src.addSource('src11','images/src11.jpeg','img',true);
	animes.hitAngeli=new mse.Animation(95,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.hitAngeli.block=true;
	mse.src.addSource('src16','images/src16.jpeg','img',true);
	mse.src.addSource('src19','images/src19.jpeg','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('concert','audios/concert','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Couverturedefault=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj315=new mse.Image(layers.Couverturedefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src16'); layers.Couverturedefault.addObject(objs.obj315);
	pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);
	pages.Title=new mse.BaseContainer(null,'Title',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Titledefault=new mse.Layer(pages.Title,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj593=new mse.Image(layers.Titledefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src19'); layers.Titledefault.addObject(objs.obj593);
	pages.Title.addLayer('Titledefault',layers.Titledefault);
	layers.titlemask=new mse.Layer(pages.Title,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj4=new mse.Mask(layers.titlemask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.titlemask.addObject(objs.obj4);
	pages.Title.addLayer('titlemask',layers.titlemask);
	layers.titletxt=new mse.Layer(pages.Title,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj5=new mse.Text(layers.titletxt,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},' LES ENFANTS DE L’APOCALYPSE',true); layers.titletxt.addObject(objs.obj5);
	objs.obj6=new mse.Text(layers.titletxt,{"size":[mse.coor('cid11'),mse.coor('cid12')],"pos":[mse.coor('cid13'),mse.coor('cid14')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Chapitre V',true); layers.titletxt.addObject(objs.obj6);
	pages.Title.addLayer('titletxt',layers.titletxt);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj278=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"},'src11'); layers.Contentdefault.addObject(objs.obj278);
	objs.obj595=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src11'); layers.Contentdefault.addObject(objs.obj595);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.contentmask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj274=new mse.Mask(layers.contentmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.60,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.contentmask.addObject(objs.obj274);
	pages.Content.addLayer('contentmask',layers.contentmask);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid20')},null);
	objs.obj534=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Angéli était désespéré. Personne ',true); layers.content.addObject(objs.obj534);
	objs.obj535=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'ne semblait vouloir l’écouter.',true); layers.content.addObject(objs.obj535);
	objs.obj536=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Tout aurait pu bien se finir si le ',true); layers.content.addObject(objs.obj536);
	objs.obj537=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'chanteur, piqué au vif, ne s’était ',true); layers.content.addObject(objs.obj537);
	objs.obj538=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pas attaqué au policier. Vexé ',true); layers.content.addObject(objs.obj538);
	objs.obj539=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'qu’un inconnu lui ait volé la ',true); layers.content.addObject(objs.obj539);
	objs.obj540=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'vedette, il asséna un formidable ',true); layers.content.addObject(objs.obj540);
	objs.obj541=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'coup de poing à l’inspecteur. Ce ',true); layers.content.addObject(objs.obj541);
	objs.obj542=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'dernier n’eut pas le temps ',true); layers.content.addObject(objs.obj542);
	objs.obj543=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'d’esquiver l’assaut.  Et, dans un ',true); layers.content.addObject(objs.obj543);
	objs.obj544=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'formidable craquement, sa ',true); layers.content.addObject(objs.obj544);
	objs.obj545=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'mâchoire se décrocha, tandis que ',true); layers.content.addObject(objs.obj545);
	objs.obj546=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'son œil gauche sortait de son ',true); layers.content.addObject(objs.obj546);
	objs.obj547=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'orbite.',true); layers.content.addObject(objs.obj547);
	objs.obj548=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un vent se stupeur souffla ',true); layers.content.addObject(objs.obj548);
	objs.obj549=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'instantanément dans la salle. Les ',true); layers.content.addObject(objs.obj549);
	objs.obj550=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'spectateurs commencèrent à ',true); layers.content.addObject(objs.obj550);
	objs.obj551=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’enfuir en hurlant.',true); layers.content.addObject(objs.obj551);
	objs.obj596=new mse.UIObject(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.content.addObject(objs.obj596);
	objs.obj597=new mse.Text(layers.content,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid22')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"center"},'Fin de l\'extrait...',true); layers.content.addObject(objs.obj597);
	objs.obj598=new mse.UIObject(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.content.addObject(objs.obj598);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.resumeAnime.addObj('obj7',objs.obj7);
	animes.resumeAnime.addAnimation('obj7',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.maskAnime.addObj('obj4',objs.obj4);
	animes.maskAnime.addAnimation('obj4',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.titleAnime.addObj('obj5',objs.obj5);
	animes.titleAnime.addAnimation('obj5',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chaAnime.addObj('obj6',objs.obj6);
	animes.chaAnime.addAnimation('obj6',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid4'),mse.coor('cid37')],'size':[mse.coor('cid3'),mse.coor('cid38')]},'src6',436,400, 0,0,2180,800);
	animes.hitAngeli.addObj('src6',temp.obj);
	animes.hitAngeli.addAnimation('src6',{'frame':JSON.parse('[0,13,38,40,42,44,46,48,50,52,54,56,81,94,95]'),'spriteSeq':JSON.parse('[0,0,0,1,2,3,4,5,6,7,8,9,9,9,9]'),'opacity':JSON.parse('[0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]')});
	var action={};
	var reaction={};
	action.transTitle=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transTitle=function(){ 
		root.transition(pages.Title); 
	};
	action.transTitle.register(reaction.transTitle);
	action.startMaskAn=new mse.Script([{src:pages.Title,type:'show'}]);
	reaction.startMaskAn=function(){ 
		animes.maskAnime.start(); 
	};
	action.startMaskAn.register(reaction.startMaskAn);
	action.startResumeAn=action.startMaskAn;
	reaction.startResumeAn=function(){ 
		animes.resumeAnime.start(); 
	};
	action.startResumeAn.register(reaction.startResumeAn);
	action.startChaAnime=action.startMaskAn;
	reaction.startChaAnime=function(){ 
		animes.chaAnime.start(); 
	};
	action.startChaAnime.register(reaction.startChaAnime);
	action.startTitleAn=action.startMaskAn;
	reaction.startTitleAn=function(){ 
		animes.titleAnime.start(); 
	};
	action.startTitleAn.register(reaction.startTitleAn);
	action.transContent=new mse.Script([{src:pages.Title,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransSc=new mse.Script([{src:animes.maskAnime,type:'end'}]);
	reaction.addTransSc=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransSc.register(reaction.addTransSc);
	action.cursorCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.cursorCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorCouv.register(reaction.cursorCouv);
	action.cursorTitle=action.startMaskAn;
	reaction.cursorTitle=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorTitle.register(reaction.cursorTitle);
	action.cursorTitlePt=action.addTransSc;
	reaction.cursorTitlePt=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorTitlePt.register(reaction.cursorTitlePt);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.startsoundcoup=new mse.Script([{src:animes.hitAngeli,type:'start'}]);
	reaction.startsoundcoup=function(){ 
		mse.src.getSrc('soncoup').play(); 
	};
	action.startsoundcoup.register(reaction.startsoundcoup);
	action.startHitAngeli=new mse.Script([{src:objs.obj548,type:'show'}]);
	reaction.startHitAngeli=function(){ 
		animes.hitAngeli.start(); 
	};
	action.startHitAngeli.register(reaction.startHitAngeli);
	action.addTextEffect=action.cursorCouv;
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
	action.startBeginIntro=action.transTitle;
	reaction.startBeginIntro=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startBeginIntro.register(reaction.startBeginIntro);
	action.addSpotEffet=action.cursorContent;
	reaction.addSpotEffet=function(){ 
		objs.obj278.count = 0;
objs.obj278.filterConfig = function() {
    var principal = false;
    var multi = [];
    for(var i = 0; i < 3; ++i) {
        if(principal)
            multi[i] = 255;
        else {
            multi[i] = randomInt(50)+200;
            if(multi[i] < 225) principal = true;
        }
    }
    return {rMulti:multi[0]/255,gMulti:multi[1]/255,bMulti:multi[2]/255,alpha:0.4};
}
objs.obj278.spotEffet = new mse.EIColorFilter(objs.obj278, objs.obj278.filterConfig());
objs.obj278.logic = function(delta) {
    mse.Image.prototype.logic.call(this, delta);
    if(this.count < 40) this.count++;
    else {
        this.spotEffet.init(this.filterConfig());
        this.count = 0;
    }
}
objs.obj278.startEffect(objs.obj278.spotEffet) 
	};
	action.addSpotEffet.register(reaction.addSpotEffet);
	mse.currTimeline.start();};

mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch5',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});