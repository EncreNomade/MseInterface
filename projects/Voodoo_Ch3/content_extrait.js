
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":452.5,"cid7":56.25,"cid8":173.75,"cid9":107.5,"cid10":32.5,"cid11":396.25,"cid12":203.75,"cid13":246.25,"cid14":340,"cid15":590,"cid16":230,"cid17":10,"cid18":22.5,"cid19":36.25,"cid20":425,"cid21":306,"cid22":260.11566018424,"cid23":17,"cid24":496.25,"cid25":33,"cid26":174,"cid27":108,"cid28":449,"cid29":109,"cid30":201,"cid31":246,"cid32":396,"cid33":56,"cid34":18,"cid35":223,"cid36":399,"cid37":358,"cid38":181}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch3/';
	window.root = mse.root;
	var temp = {};
	mse.src.addSource('src3','images/src3.jpeg','img',true);
	mse.src.addSource('src4','images/src4.jpeg','img',true);
	mse.src.addSource('src5','images/src5.jpeg','img',true);
	animes.mask=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.mask.block=true;
	animes.title=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.title.block=true;
	animes.cha=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.cha.block=true;
	animes.resume=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.resume.block=true;
	mse.src.addSource('src15','images/src15.png','img',true);
	mse.src.addSource('src16','images/src16.jpeg','img',true);
	mse.src.addSource('src17','images/src17.jpeg','img',true);
	mse.src.addSource('src19','images/src19.jpeg','img',true);
	animes.showBack3Anime=new mse.Animation(16,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showBack3Anime.block=true;
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('voixetpoule','audios/voixetpoule','aud',false);
	mse.src.addSource('psalmodie','audios/psalmodie','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj447=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src19'); layers.back.addObject(objs.obj447);
	pages.Couverture.addLayer('back',layers.back);
	pages.Titre=new mse.BaseContainer(null,'Titre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Titredefault=new mse.Layer(pages.Titre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj459=new mse.Image(layers.Titredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src4'); layers.Titredefault.addObject(objs.obj459);
	pages.Titre.addLayer('Titredefault',layers.Titredefault);
	layers.mask=new mse.Layer(pages.Titre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj226=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj226);
	pages.Titre.addLayer('mask',layers.mask);
	layers.Text=new mse.Layer(pages.Titre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj227=new mse.Text(layers.Text,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'LE VENTRE DE PARIS',true); layers.Text.addObject(objs.obj227);
	objs.obj228=new mse.Text(layers.Text,{"size":[mse.coor('cid11'),mse.coor('cid7')],"pos":[mse.coor('cid12'),mse.coor('cid13')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Episode III',true); layers.Text.addObject(objs.obj228);
	pages.Titre.addLayer('Text',layers.Text);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj458=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src4'); layers.Contentdefault.addObject(objs.obj458);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.Contmask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj2=new mse.Mask(layers.Contmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.Contmask.addObject(objs.obj2);
	pages.Content.addLayer('Contmask',layers.Contmask);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid14'),mse.coor('cid15')],"pos":[mse.coor('cid16'),mse.coor('cid17')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid18')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid19')},null);
	objs.obj346=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'Des voix. Plusieurs, graves, ',true);
	objs.obj346.addLink(new mse.Link('voix',0,'audio',mse.src.getSrc('voixetpoule'))); layers.content.addObject(objs.obj346);
	objs.obj347=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'inquiétantes. ',true); layers.content.addObject(objs.obj347);
	objs.obj348=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'Une langue inconnue et des… des ',true); layers.content.addObject(objs.obj348);
	objs.obj349=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'poules ?',true); layers.content.addObject(objs.obj349);
	objs.obj350=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'Simon se réveilla en sursaut. Un ',true); layers.content.addObject(objs.obj350);
	objs.obj351=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'cauchemar ? Mais non, il ne rêvait ',true); layers.content.addObject(objs.obj351);
	objs.obj352=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'pas. ',true); layers.content.addObject(objs.obj352);
	objs.obj353=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'À moins de vingt mètres de lui, ',true); layers.content.addObject(objs.obj353);
	objs.obj354=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'légèrement sur sa gauche, un ',true); layers.content.addObject(objs.obj354);
	objs.obj355=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'homme affublé d’un haut de ',true); layers.content.addObject(objs.obj355);
	objs.obj356=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'forme psalmodiait. À ses pieds, ',true);
	objs.obj356.addLink(new mse.Link('psalmodiait',10,'audio',mse.src.getSrc('psalmodie'))); layers.content.addObject(objs.obj356);
	objs.obj357=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'une poule noire tentait vainement ',true); layers.content.addObject(objs.obj357);
	objs.obj358=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'de s’échapper en tirant sur la ',true); layers.content.addObject(objs.obj358);
	objs.obj359=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'corde qui la retenait. ',true); layers.content.addObject(objs.obj359);
	objs.obj360=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'Un peu plus loin, deux femmes, la ',true); layers.content.addObject(objs.obj360);
	objs.obj361=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'poitrine dénudée enluminée de ',true); layers.content.addObject(objs.obj361);
	objs.obj362=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'motifs blancs, dansaient en ',true); layers.content.addObject(objs.obj362);
	objs.obj363=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'poussant des cris.',true); layers.content.addObject(objs.obj363);
	objs.obj440=new mse.UIObject(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]}); layers.content.addObject(objs.obj440);
	objs.obj445=new mse.Image(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid22')],"pos":[mse.coor('cid23'),mse.coor('cid5')]},'src17');
	objs.obj445.activateZoom(); layers.content.addObject(objs.obj445);
	objs.obj441=new mse.UIObject(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]}); layers.content.addObject(objs.obj441);
	objs.obj364=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'L’adolescent n’en croyait pas ses ',true); layers.content.addObject(objs.obj364);
	objs.obj365=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'yeux. Il se recroquevilla dans ',true); layers.content.addObject(objs.obj365);
	objs.obj366=new mse.Text(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]},'l’ombre d’un pilier. ',true); layers.content.addObject(objs.obj366);
	objs.obj433=new mse.UIObject(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]}); layers.content.addObject(objs.obj433);
	objs.obj434=new mse.Text(layers.content,{"size":[mse.coor('cid14'),mse.coor('cid19')],"pos":[mse.coor('cid2'),mse.coor('cid24')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid18')+"px Gudea","textAlign":"center"},'Fin de l\'extrait...',true); layers.content.addObject(objs.obj434);
	objs.obj457=new mse.UIObject(layers.content,{"size":[mse.coor('cid20'),mse.coor('cid19')]}); layers.content.addObject(objs.obj457);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.mask.addObj('obj226',objs.obj226);
	animes.mask.addAnimation('obj226',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.title.addObj('obj227',objs.obj227);
	animes.title.addAnimation('obj227',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.cha.addObj('obj228',objs.obj228);
	animes.cha.addAnimation('obj228',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.resume.addObj('obj229',objs.obj229);
	animes.resume.addAnimation('obj229',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showBack3Anime.addObj('obj450',objs.obj450);
	animes.showBack3Anime.addAnimation('obj450',{'frame':JSON.parse('[0,15,16]'),'opacity':JSON.parse('[0,1,1]')});
	var action={};
	var reaction={};
	action.transCouv=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCouv=function(){ 
		root.transition(pages.Titre); 
	};
	action.transCouv.register(reaction.transCouv);
	action.transTitre=new mse.Script([{src:pages.Titre,type:'click'}]);
	reaction.transTitre=function(){ 
		root.transition(pages.Content); 
	};
	action.cursorCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.cursorCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorCouv.register(reaction.cursorCouv);
	action.addTextEffet=action.cursorCouv;
	reaction.addTextEffet=function(){ 
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
	action.addTextEffet.register(reaction.addTextEffet);
	action.showTitle=new mse.Script([{src:pages.Titre,type:'show'}]);
	reaction.showTitle=function(){ 
		animes.title.start(); 
	};
	action.showTitle.register(reaction.showTitle);
	action.showResume=action.showTitle;
	reaction.showResume=function(){ 
		animes.resume.start(); 
	};
	action.showResume.register(reaction.showResume);
	action.showEpisode=action.showTitle;
	reaction.showEpisode=function(){ 
		animes.cha.start(); 
	};
	action.showEpisode.register(reaction.showEpisode);
	action.showMask=action.showTitle;
	reaction.showMask=function(){ 
		animes.mask.start(); 
	};
	action.showMask.register(reaction.showMask);
	action.addTransTitle=new mse.Script([{src:animes.title,type:'end'}]);
	reaction.addTransTitle=function(){ 
		action.transTitre.register(reaction.transTitre); 
	};
	action.addTransTitle.register(reaction.addTransTitle);
	action.cursorDfTitle=action.showTitle;
	reaction.cursorDfTitle=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorDfTitle.register(reaction.cursorDfTitle);
	action.cursorPtTitle=action.addTransTitle;
	reaction.cursorPtTitle=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorPtTitle.register(reaction.cursorPtTitle);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.playIntro=action.transCouv;
	reaction.playIntro=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.playIntro.register(reaction.playIntro);
	action.stopSonIntro=action.cursorContent;
	reaction.stopSonIntro=function(){ 
		mse.src.getSrc('intro').pause(); 
	};
	action.stopSonIntro.register(reaction.stopSonIntro);
	mse.currTimeline.start();};

mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch3',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});