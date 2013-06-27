
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":448.75,"cid7":108.75,"cid8":173.75,"cid9":107.5,"cid10":32.5,"cid11":396.25,"cid12":56.25,"cid13":201.25,"cid14":246.25,"cid15":340,"cid16":590,"cid17":230,"cid18":10,"cid19":22.5,"cid20":36.25,"cid21":425,"cid22":295,"cid23":306,"cid24":513.72,"cid25":17,"cid26":517.5,"cid27":33,"cid28":174,"cid29":108,"cid30":449,"cid31":109,"cid32":201,"cid33":246,"cid34":396,"cid35":56,"cid36":18,"cid37":223,"cid38":399,"cid39":358,"cid40":181}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch6/';
	window.root = mse.root;
	var temp = {};
	mse.src.addSource('sonporte','audios/sonporte','aud',false);
	animes.showmask=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showmask.block=true;
	animes.showtitle=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showtitle.block=true;
	animes.showcha=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showcha.block=true;
	animes.showresume=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.showresume.block=true;
	mse.src.addSource('src16','images/src16.png','img',true);
	mse.src.addSource('src17','images/src17.jpeg','img',true);
	mse.src.addSource('src18','images/src18.jpeg','img',true);
	mse.src.addSource('src36','images/src36.jpeg','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj860=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src17'); layers.back.addObject(objs.obj860);
	pages.Couverture.addLayer('back',layers.back);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1423=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src36'); layers.Chapitredefault.addObject(objs.obj1423);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.mask=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj3=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times"}); layers.mask.addObject(objs.obj3);
	pages.Chapitre.addLayer('mask',layers.mask);
	layers.chatext=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj243=new mse.Text(layers.chatext,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Home sweet home',true); layers.chatext.addObject(objs.obj243);
	objs.obj244=new mse.Text(layers.chatext,{"size":[mse.coor('cid11'),mse.coor('cid12')],"pos":[mse.coor('cid13'),mse.coor('cid14')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Épisode VI',true); layers.chatext.addObject(objs.obj244);
	pages.Chapitre.addLayer('chatext',layers.chatext);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back0=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj1456=new mse.Image(layers.back0,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src36'); layers.back0.addObject(objs.obj1456);
	pages.Content.addLayer('back0',layers.back0);
	layers.contentmask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj4=new mse.Mask(layers.contentmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times"}); layers.contentmask.addObject(objs.obj4);
	pages.Content.addLayer('contentmask',layers.contentmask);
	layers.conttext=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid20')},null);
	objs.obj1069=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Quelques secondes plus tard, une ',true); layers.conttext.addObject(objs.obj1069);
	objs.obj1070=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'déflagration retentit dans le ',true); layers.conttext.addObject(objs.obj1070);
	objs.obj1071=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'couloir, aussitôt suivie d’un ',true); layers.conttext.addObject(objs.obj1071);
	objs.obj1072=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'craquement sinistre.',true);
	objs.obj1072.addLink(new mse.Link('craquement',3,'audio',mse.src.getSrc('sonporte'))); layers.conttext.addObject(objs.obj1072);
	objs.obj1073=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'La porte d’entrée venait ',true); layers.conttext.addObject(objs.obj1073);
	objs.obj1074=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'d’exploser.',true); layers.conttext.addObject(objs.obj1074);
	objs.obj1075=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Dans un hurlement, une ',true); layers.conttext.addObject(objs.obj1075);
	objs.obj1076=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'silhouette surgit au milieu de la ',true); layers.conttext.addObject(objs.obj1076);
	objs.obj1077=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pièce.',true); layers.conttext.addObject(objs.obj1077);
	objs.arthur=new mse.Speaker( layers.conttext,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'arthur', 'src16' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.conttext.addObject(objs.arthur);
	objs.obj1447=new mse.Text(layers.conttext,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Les mains en l’air ! hurla ',true);
	objs.arthur.addObject(objs.obj1447);
	objs.obj1448=new mse.Text(layers.conttext,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'l’apparition.',true);
	objs.arthur.addObject(objs.obj1448);
	objs.obj1081=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.conttext.addObject(objs.obj1081);
	objs.obj1400=new mse.Image(layers.conttext,{"size":[mse.coor('cid23'),mse.coor('cid24')],"pos":[mse.coor('cid25'),mse.coor('cid5')]},'src18');
	objs.obj1400.activateZoom(); layers.conttext.addObject(objs.obj1400);
	objs.obj1082=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.conttext.addObject(objs.obj1082);
	objs.obj1083=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Vêtu d’un treillis militaire, le ',true); layers.conttext.addObject(objs.obj1083);
	objs.obj1084=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'visage dissimulé par un ',true); layers.conttext.addObject(objs.obj1084);
	objs.obj1085=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'maquillage commando, l’individu ',true); layers.conttext.addObject(objs.obj1085);
	objs.obj1086=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'les menaçait d’une antique ',true); layers.conttext.addObject(objs.obj1086);
	objs.obj1087=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'kalachnikov. Une lueur de folie ',true); layers.conttext.addObject(objs.obj1087);
	objs.obj1088=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'meurtrière consumait son regard ',true); layers.conttext.addObject(objs.obj1088);
	objs.obj1089=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'translucide. Au moindre geste, il ',true); layers.conttext.addObject(objs.obj1089);
	objs.obj1090=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'n’hésiterait sans doute pas à ',true); layers.conttext.addObject(objs.obj1090);
	objs.obj1091=new mse.Text(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'tirer…',true); layers.conttext.addObject(objs.obj1091);
	objs.obj1453=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.conttext.addObject(objs.obj1453);
	objs.obj1454=new mse.Text(layers.conttext,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid26')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"center"},'Fin de l\'extrait...',true); layers.conttext.addObject(objs.obj1454);
	objs.obj1455=new mse.UIObject(layers.conttext,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.conttext.addObject(objs.obj1455);
	layers.conttext.setDefile(1300);
	temp.layerDefile=layers.conttext;
	pages.Content.addLayer('conttext',layers.conttext);
	animes.showmask.addObj('obj3',objs.obj3);
	animes.showmask.addAnimation('obj3',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.showtitle.addObj('obj243',objs.obj243);
	animes.showtitle.addAnimation('obj243',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showcha.addObj('obj244',objs.obj244);
	animes.showcha.addAnimation('obj244',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.showresume.addObj('obj245',objs.obj245);
	animes.showresume.addAnimation('obj245',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	var action={};
	var reaction={};
	action.transCha=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.startshowtitle=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.startshowtitle=function(){ 
		animes.showtitle.start(); 
	};
	action.startshowtitle.register(reaction.startshowtitle);
	action.showmask=action.startshowtitle;
	reaction.showmask=function(){ 
		animes.showmask.start(); 
	};
	action.showmask.register(reaction.showmask);
	action.showcha=action.startshowtitle;
	reaction.showcha=function(){ 
		animes.showcha.start(); 
	};
	action.showcha.register(reaction.showcha);
	action.startshowresume=action.startshowtitle;
	reaction.startshowresume=function(){ 
		animes.showresume.start(); 
	};
	action.startshowresume.register(reaction.startshowresume);
	action.cursorCha=action.startshowtitle;
	reaction.cursorCha=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorCha.register(reaction.cursorCha);
	action.cursorChaPt=new mse.Script([{src:animes.showmask,type:'end'}]);
	reaction.cursorChaPt=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorChaPt.register(reaction.cursorChaPt);
	action.transContent=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransContent=action.cursorChaPt;
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.cursorCouv=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.cursorCouv=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorCouv.register(reaction.cursorCouv);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.addTextEffet=action.cursorCouv;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.conttext.objList.length; i++){
	var objCible = layers.conttext.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.startIntroBeginning=action.transCha;
	reaction.startIntroBeginning=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startIntroBeginning.register(reaction.startIntroBeginning);
	mse.currTimeline.start();};

mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch6',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});