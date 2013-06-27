
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":262,"cid3":346,"cid4":0,"cid5":400,"cid6":200,"cid7":20,"cid8":427.5,"cid9":91.25,"cid10":186.25,"cid11":105,"cid12":32.5,"cid13":221.25,"cid14":61.25,"cid15":290,"cid16":247.5,"cid17":340,"cid18":590,"cid19":230,"cid20":10,"cid21":22.5,"cid22":36.25,"cid23":425,"cid24":295,"cid25":262.5,"cid26":346.25,"cid27":496.25,"cid28":33,"cid29":221,"cid30":109,"cid31":363,"cid32":89,"cid33":320,"cid34":248,"cid35":178,"cid36":61,"cid37":18,"cid38":228,"cid39":421,"cid40":358,"cid41":121,"cid42":269,"cid43":253,"cid44":263,"cid45":273,"cid46":255,"cid47":256,"cid48":3}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch2/';
	window.root = mse.root;
	var temp = {};
	animes.maskshow=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.maskshow.block=true;
	animes.titleshow=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.titleshow.block=true;
	animes.chashow=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.chashow.block=true;
	animes.resumshow=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.resumshow.block=true;
	mse.src.addSource('src15','images/src15.png','img',true);
	mse.src.addSource('src17','images/src17.jpeg','img',true);
	mse.src.addSource('src25','images/src25.jpeg','img',true);
	mse.src.addSource('src26','images/src26.png','img',true);
	mse.src.addSource('src27','images/src27.png','img',true);
	mse.src.addSource('src28','images/src28.png','img',true);
	mse.src.addSource('src29','images/src29.png','img',true);
	mse.src.addSource('src30','images/src30.png','img',true);
	mse.src.addSource('src31','images/src31.jpeg','img',true);
	mse.src.addSource('src32','images/src32.jpeg','img',true);
	mse.src.addSource('src33','images/src33.jpeg','img',true);
	wikis.Ballast=new mse.WikiLayer();
	wikis.Ballast.addImage('src25', 'Photo de R/DV/RS');
	wikis.Ballast.addTextCard();
	wikis.Ballast.textCard.addSection('Ballast', 'Nom masculin :\nLit de gravier qui supporte une voie de chemin de fer. Réservoir qui permet de modifier l’équilibre d’un bateau. Réservoir rempli d’air ou d’eau qui permet à un sous-marin de plonger (eau) ou de faire surface (air). Composant électrique utilisé pour réduire le courant dans un circuit électrique.');
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('chutepluscris','audios/chutepluscris','aud',false);
	mse.src.addSource('sonchuteanime','audios/sonchuteanime','aud',false);
	animes.simchute=new mse.Animation(139,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.simchute.block=true;
	animes.simchute2=new mse.Animation(139,1,true,null,{'size':[mse.coor('cid2'),mse.coor('cid3')]});
	animes.simchute2.block=true;
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.couver=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	pages.Couverture.addLayer('couver',layers.couver);
	layers.title=new mse.Layer(pages.Couverture,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj936=new mse.Image(layers.title,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid4')]},'src33'); layers.title.addObject(objs.obj936);
	pages.Couverture.addLayer('title',layers.title);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.chaback=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj593=new mse.Image(layers.chaback,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid4')]},'src17'); layers.chaback.addObject(objs.obj593);
	pages.Chapitre.addLayer('chaback',layers.chaback);
	layers.text=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj11=new mse.Mask(layers.text,{"size":[mse.coor('cid5'),mse.coor('cid1')],"pos":[mse.coor('cid6'),mse.coor('cid4')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.60,"font":"normal "+mse.coor('cid7')+"px Times","textAlign":"left"}); layers.text.addObject(objs.obj11);
	pages.Chapitre.addLayer('text',layers.text);
	layers.mask=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj12=new mse.Text(layers.mask,{"size":[mse.coor('cid8'),mse.coor('cid9')],"pos":[mse.coor('cid10'),mse.coor('cid11')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid12')+"px Gudea","textAlign":"center","textBaseline":"top"},'MURUZÉ TROUSSIFÉE RASSIMAIS',true); layers.mask.addObject(objs.obj12);
	objs.obj13=new mse.Text(layers.mask,{"size":[mse.coor('cid13'),mse.coor('cid14')],"pos":[mse.coor('cid15'),mse.coor('cid16')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid12')+"px Gudea","textAlign":"center","textBaseline":"top"},'Episode II',true); layers.mask.addObject(objs.obj13);
	pages.Chapitre.addLayer('mask',layers.mask);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj594=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid4')]},'src17'); layers.Contentdefault.addObject(objs.obj594);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.mask2=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj635=new mse.Mask(layers.mask2,{"size":[mse.coor('cid5'),mse.coor('cid1')],"pos":[mse.coor('cid6'),mse.coor('cid4')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.65,"font":"normal "+mse.coor('cid7')+"px Times","textAlign":"left"}); layers.mask2.addObject(objs.obj635);
	pages.Content.addLayer('mask2',layers.mask2);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid17'),mse.coor('cid18')],"pos":[mse.coor('cid19'),mse.coor('cid20')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid21')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid22')},null);
	objs.obj636=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Durant quelques instants, Simon ',true); layers.content.addObject(objs.obj636);
	objs.obj637=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'resta suspendu dans les airs. Une ',true); layers.content.addObject(objs.obj637);
	objs.obj638=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'sensation unique, enivrante. ',true); layers.content.addObject(objs.obj638);
	objs.obj639=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Comme s’il volait.',true); layers.content.addObject(objs.obj639);
	objs.obj640=new mse.Speaker( layers.content,{"size":[mse.coor('cid17'),mse.coor('cid4')]}, 'unknown', 'src31' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj640);
	objs.obj641=new mse.Text(layers.content,{"size":[mse.coor('cid24'),mse.coor('cid22')]},'Il est malade ce type !',true);
	objs.obj640.addObject(objs.obj641);
	objs.obj642=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Et soudain, la chute. Interminable. ',true); layers.content.addObject(objs.obj642);
	objs.obj643=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Il se mit à paniquer. Devant lui, il ',true); layers.content.addObject(objs.obj643);
	objs.obj644=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'n’y avait qu’un trou noir, béant, ',true); layers.content.addObject(objs.obj644);
	objs.obj645=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'une porte de ténèbres ouverte sur ',true); layers.content.addObject(objs.obj645);
	objs.obj646=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'les Enfers.',true); layers.content.addObject(objs.obj646);
	objs.obj647=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Après tout ce n’était peut-être pas ',true); layers.content.addObject(objs.obj647);
	objs.obj648=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'une bonne idée.',true); layers.content.addObject(objs.obj648);
	objs.obj649=new mse.Speaker( layers.content,{"size":[mse.coor('cid17'),mse.coor('cid4')]}, 'unknown', 'src31' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj649);
	objs.obj650=new mse.Text(layers.content,{"size":[mse.coor('cid24'),mse.coor('cid22')]},'On fait le tour et on le ',true);
	objs.obj649.addObject(objs.obj650);
	objs.obj651=new mse.Text(layers.content,{"size":[mse.coor('cid24'),mse.coor('cid22')]},'récupère en bas.',true);
	objs.obj649.addObject(objs.obj651);
	objs.obj652=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Ce fut la dernière chose qu’il ',true); layers.content.addObject(objs.obj652);
	objs.obj653=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'entendit avant d’atterrir avec ',true); layers.content.addObject(objs.obj653);
	objs.obj654=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'violence dans un épais taillis. Le ',true); layers.content.addObject(objs.obj654);
	objs.obj655=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'choc lui arracha un cri. ',true);
	objs.obj655.addLink(new mse.Link('choc',16,'audio',mse.src.getSrc('chutepluscris'))); layers.content.addObject(objs.obj655);
	objs.obj656=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Tout son corps lui faisait mal, ses ',true); layers.content.addObject(objs.obj656);
	objs.obj657=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'bras zébrés d’écorchures, le ',true); layers.content.addObject(objs.obj657);
	objs.obj658=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'souffle définitivement coupé. ',true); layers.content.addObject(objs.obj658);
	objs.obj659=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Il n’était pas tombé sur le sol. Il ',true); layers.content.addObject(objs.obj659);
	objs.obj660=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'était suspendu juste au-dessus de ',true); layers.content.addObject(objs.obj660);
	objs.obj661=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'la voie ferrée, sauvé par un ',true); layers.content.addObject(objs.obj661);
	objs.obj662=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'buisson providentiel qui poussait ',true); layers.content.addObject(objs.obj662);
	objs.obj663=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'dans le vide. ',true); layers.content.addObject(objs.obj663);
	objs.obj664=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Waouh, songea-t-il en essayant de ',true); layers.content.addObject(objs.obj664);
	objs.obj665=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'se dégager, je l’ai échappé belle…',true); layers.content.addObject(objs.obj665);
	objs.obj666=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Mais, alors qu’il pensait s’en être ',true); layers.content.addObject(objs.obj666);
	objs.obj667=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'sorti, les racines du taillis cédèrent ',true); layers.content.addObject(objs.obj667);
	objs.obj668=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'d’un seul coup, propulsant Simon ',true); layers.content.addObject(objs.obj668);
	objs.obj669=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'deux mètres plus bas. ',true); layers.content.addObject(objs.obj669);
	objs.obj945=new mse.UIObject(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]}); layers.content.addObject(objs.obj945);
	objs.obj948=animes.simchute2; objs.obj948.setX(38.75); layers.content.addAnimation(objs.obj948);
	objs.obj946=new mse.UIObject(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]}); layers.content.addObject(objs.obj946);
	objs.obj670=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Ne pas atterrir sur mon sac, ',true); layers.content.addObject(objs.obj670);
	objs.obj671=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'surtout ne pas atterrir sur mon ',true); layers.content.addObject(objs.obj671);
	objs.obj672=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'sac, fut sa seule pensée avant de ',true); layers.content.addObject(objs.obj672);
	objs.obj673=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'rejoindre le ballast. ',true);
	objs.obj673.addLink(new mse.Link('ballast',37,'wiki',wikis.Ballast)); layers.content.addObject(objs.obj673);
	objs.obj674=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'Les angles aigus des pierres ',true); layers.content.addObject(objs.obj674);
	objs.obj675=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'pénétrèrent dans ses côtes et sa ',true); layers.content.addObject(objs.obj675);
	objs.obj676=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'tête heurta le métal de la voie ',true); layers.content.addObject(objs.obj676);
	objs.obj677=new mse.Text(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]},'abandonnée. ',true); layers.content.addObject(objs.obj677);
	objs.obj949=new mse.UIObject(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]}); layers.content.addObject(objs.obj949);
	objs.obj950=new mse.Text(layers.content,{"size":[mse.coor('cid17'),mse.coor('cid22')],"pos":[mse.coor('cid4'),mse.coor('cid27')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid21')+"px Gudea","textAlign":"center"},'Fin de l\'extrait...',true); layers.content.addObject(objs.obj950);
	objs.obj951=new mse.UIObject(layers.content,{"size":[mse.coor('cid23'),mse.coor('cid22')]}); layers.content.addObject(objs.obj951);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.maskshow.addObj('obj11',objs.obj11);
	animes.maskshow.addAnimation('obj11',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.800000011921,0.800000011921]')});
	animes.titleshow.addObj('obj12',objs.obj12);
	animes.titleshow.addAnimation('obj12',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chashow.addObj('obj13',objs.obj13);
	animes.chashow.addAnimation('obj13',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.resumshow.addObj('obj585',objs.obj585);
	animes.resumshow.addAnimation('obj585',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid42'),mse.coor('cid43')],'size':[mse.coor('cid44'),mse.coor('cid3')],'fillStyle':'rgb(255, 255, 255)'});
	animes.simchute.addObj('obj935',temp.obj);
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid45'),mse.coor('cid46')],'size':[mse.coor('cid47'),mse.coor('cid17')]},'src32',256,340, 0,0,1792,1700);
	animes.simchute.addObj('src32',temp.obj);
	animes.simchute.addAnimation('obj935',{'frame':JSON.parse('[0,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,139]')});
	animes.simchute.addAnimation('src32',{'frame':JSON.parse('[0,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,139]'),'spriteSeq':JSON.parse('[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,34]')});
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid4'),mse.coor('cid4')],'size':[mse.coor('cid44'),mse.coor('cid3')],'fillStyle':'rgb(255, 255, 255)'});
	animes.simchute2.addObj('obj935',temp.obj);
	temp.obj=new mse.Sprite(null,{'pos':[mse.coor('cid48'),mse.coor('cid48')],'size':[mse.coor('cid47'),mse.coor('cid17')]},'src32',256,340, 0,0,1792,1700);
	animes.simchute2.addObj('src32',temp.obj);
	animes.simchute2.addAnimation('obj935',{'frame':JSON.parse('[0,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,139]')});
	animes.simchute2.addAnimation('src32',{'frame':JSON.parse('[0,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,139]'),'spriteSeq':JSON.parse('[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,34]')});
	var action={};
	var reaction={};
	action.startSonIntro=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.startSonIntro=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startSonIntro.register(reaction.startSonIntro);
	action.transCha=action.startSonIntro;
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
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
	action.cursorChaDf=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.cursorChaDf=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorChaDf.register(reaction.cursorChaDf);
	action.startChaShow=action.cursorChaDf;
	reaction.startChaShow=function(){ 
		animes.chashow.start(); 
	};
	action.startChaShow.register(reaction.startChaShow);
	action.startResumeShow=action.cursorChaDf;
	reaction.startResumeShow=function(){ 
		animes.resumshow.start(); 
	};
	action.startResumeShow.register(reaction.startResumeShow);
	action.startTitleShow=action.cursorChaDf;
	reaction.startTitleShow=function(){ 
		animes.titleshow.start(); 
	};
	action.startTitleShow.register(reaction.startTitleShow);
	action.startMaskShow=action.cursorChaDf;
	reaction.startMaskShow=function(){ 
		animes.maskshow.start(); 
	};
	action.startMaskShow.register(reaction.startMaskShow);
	action.transContent=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.addTransContent=new mse.Script([{src:animes.maskshow,type:'end'}]);
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.cursorChaPt=action.addTransContent;
	reaction.cursorChaPt=function(){ 
		mse.setCursor('pointer'); 
	};
	action.cursorChaPt.register(reaction.cursorChaPt);
	action.cursorContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.cursorContent=function(){ 
		mse.setCursor('default'); 
	};
	action.cursorContent.register(reaction.cursorContent);
	action.startAnimeSon=new mse.Script([{src:animes.simchute,type:'start'}]);
	reaction.startAnimeSon=function(){ 
		mse.src.getSrc('sonchuteanime').play(); 
	};
	action.startAnimeSon.register(reaction.startAnimeSon);
	action.startSimChute=new mse.Script([{src:objs.obj670,type:'show'}]);
	reaction.startSimChute=function(){ 
		animes.simchute.start(); 
	};
	mse.currTimeline.start();};


mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch2',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});