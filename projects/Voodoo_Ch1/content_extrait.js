
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":201.25,"cid5":20,"cid6":407.5,"cid7":45,"cid8":197.5,"cid9":108.75,"cid10":32.5,"cid11":218.75,"cid12":293.75,"cid13":246.25,"cid14":200,"cid15":360,"cid16":590,"cid17":220,"cid18":10,"cid19":22.5,"cid20":36.25,"cid21":450,"cid22":315,"cid23":517.5,"cid24":33,"cid25":235,"cid26":109,"cid27":343,"cid28":41,"cid29":320,"cid30":248,"cid31":178,"cid32":61,"cid33":230,"cid34":-42,"cid35":135,"cid36":1000,"cid37":300,"cid38":164,"cid39":106,"cid40":189,"cid41":114,"cid42":221,"cid43":238}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch1/';
	window.root = mse.root;
	var temp = {};
	animes.fouine=new mse.Animation(22,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.fouine.block=true;
	animes.titleshow=new mse.Animation(101,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.titleshow.block=true;
	animes.chashow=new mse.Animation(101,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.chashow.block=true;
	mse.src.addSource('grillageimg','images/src16.png','img',true);
	animes.piege=new mse.Animation(51,1,true,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.piege.block=true;
	mse.src.addSource('src32','images/src32.jpeg','img',true);
	mse.src.addSource('src33','images/src33.jpeg','img',true);
	mse.src.addSource('src34','images/src34.png','img',true);
	mse.src.addSource('src35','images/src35.png','img',true);
	mse.src.addSource('src36','images/src36.png','img',true);
	mse.src.addSource('src37','images/src37.png','img',true);
	mse.src.addSource('src41','images/src41.jpeg','img',true);
	mse.src.addSource('src44','images/src44.jpeg','img',true);
	mse.src.addSource('src45','images/src45.jpeg','img',true);
	animes.maskAnime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.maskAnime.block=true;
	mse.src.addSource('src46','images/src46.jpeg','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('piegeson','audios/piegeson','aud',false);
	animes.addGrilleBack=new mse.Animation(2,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.addGrilleBack.block=true;
	mse.src.addSource('onletien','audios/onletien','aud',false);
	mse.src.addSource('heart','audios/heart','aud',false);
	wikis.pCeinture=new mse.WikiLayer();
	wikis.pCeinture.addImage('src32', 'Vue depuis la place Wagram. Photographie de marsupilami92 ');
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('Biodiversité', 'Elle est considérée comme une réserve de biodiversité. On peut y observer de nombreuses variétés d’arbres, de plantes et la plus grande colonie de chauve-souris de l’espèce pipistrelle d’Ile de France. \nLa ville de Paris y aménage des parcours pédagogiques, proposant ainsi un nouveau type de promenade nature à Paris.');
	wikis.pCeinture.textCard.addLink('Lien Mairie de Paris', 'http:\/\/www.paris.fr\/loisirs\/se-promener-a-paris\/balades-au-vert\/decouvrir-les-richesses-de-la-petite-ceinture\/rub_9660_stand_53584_port_23803');
	wikis.pCeinture.addImage('src33', 'La Petite Ceinture traverse le Parc Montsouris. Photo de Thomas Claveirole ');
	wikis.pCeinture.addTextCard();
	wikis.pCeinture.textCard.addSection('La Petite Ceinture', 'C’est une ancienne ligne de chemin de fer longue de 32 km qui faisait le tour de Paris.');
	wikis.pCeinture.textCard.addLink('Lien Wikipédia', 'http:\/\/fr.wikipedia.org\/wiki\/Ligne_de_Petite_Ceinture');
	mse.src.addSource('src66','images/src66.png','img',true);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.back=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj707=new mse.Image(layers.back,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src44'); layers.back.addObject(objs.obj707);
	pages.Couverture.addLayer('back',layers.back);
	pages.Chapitre=new mse.BaseContainer(null,'Chapitre',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Chapitredefault=new mse.Layer(pages.Chapitre,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj709=new mse.Image(layers.Chapitredefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src45'); layers.Chapitredefault.addObject(objs.obj709);
	pages.Chapitre.addLayer('Chapitredefault',layers.Chapitredefault);
	layers.mask=new mse.Layer(pages.Chapitre,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj710=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.8,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj710);
	pages.Chapitre.addLayer('mask',layers.mask);
	layers.Text=new mse.Layer(pages.Chapitre,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj13=new mse.Text(layers.Text,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"bold "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'CHASSE A L\'HOMME',true); layers.Text.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.Text,{"size":[mse.coor('cid11'),mse.coor('cid7')],"pos":[mse.coor('cid12'),mse.coor('cid13')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"bold "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Episode I',true); layers.Text.addObject(objs.obj14);
	pages.Chapitre.addLayer('Text',layers.Text);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Contentdefault=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj992=new mse.Image(layers.Contentdefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src46'); layers.Contentdefault.addObject(objs.obj992);
	pages.Content.addLayer('Contentdefault',layers.Contentdefault);
	layers.grillage=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj957=new mse.Image(layers.grillage,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'grillageimg'); layers.grillage.addObject(objs.obj957);
	pages.Content.addLayer('grillage',layers.grillage);
	layers.contmask=new mse.Layer(pages.Content,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj711=new mse.Mask(layers.contmask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid14'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.8,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.contmask.addObject(objs.obj711);
	pages.Content.addLayer('contmask',layers.contmask);
	layers.text=new mse.ArticleLayer(pages.Content,4,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid20')},null);
	objs.obj869=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un grillage.',true); layers.text.addObject(objs.obj869);
	objs.obj955=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj955);
	objs.obj870=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Piégé !',true); layers.text.addObject(objs.obj870);
	objs.obj956=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj956);
	objs.obj871=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il se redressa en grimaçant, ',true); layers.text.addObject(objs.obj871);
	objs.obj872=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’approcha.',true); layers.text.addObject(objs.obj872);
	objs.obj873=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Une dizaine de mètres en contrebas, le ',true); layers.text.addObject(objs.obj873);
	objs.obj874=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'faisceau de sa lampe illumina les ',true); layers.text.addObject(objs.obj874);
	objs.obj875=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'reliefs mangés de rouille d’une ligne ',true); layers.text.addObject(objs.obj875);
	objs.obj876=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de chemin de fer abandonnée.',true); layers.text.addObject(objs.obj876);
	objs.obj877=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'La Petite Ceinture.',true);
	objs.obj877.addLink(new mse.Link('La Petite Ceinture',10,'wiki',wikis.pCeinture)); layers.text.addObject(objs.obj877);
	objs.obj878=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Un éclat de voix derrière lui le fit ',true); layers.text.addObject(objs.obj878);
	objs.obj879=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'sursauter.',true); layers.text.addObject(objs.obj879);
	objs.src42=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src41' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src42);
	objs.obj962=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'On le tient !',true);
	objs.src42.addObject(objs.obj962);
	objs.obj881=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon fixa le puits de ténèbres qui ',true); layers.text.addObject(objs.obj881);
	objs.obj882=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’étendait au-delà du grillage.',true); layers.text.addObject(objs.obj882);
	objs.src40=new mse.Speaker( layers.text,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'kevin', 'src35' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.text.addObject(objs.src40);
	objs.obj963=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Alors, t’es enfin prêt à recevoir ',true);
	objs.src40.addObject(objs.obj963);
	objs.obj964=new mse.Text(layers.text,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'ta leçon ?',true);
	objs.src40.addObject(objs.obj964);
	objs.obj885=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Kevin s’approcha dans la clarté de la ',true); layers.text.addObject(objs.obj885);
	objs.obj886=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'lune. Il tendit le bras. Un bruit de ',true); layers.text.addObject(objs.obj886);
	objs.obj887=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'ressort. Une lame apparut au bout de ',true); layers.text.addObject(objs.obj887);
	objs.obj888=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'sa main.',true); layers.text.addObject(objs.obj888);
	objs.obj889=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'L’adolescent sentait le sang battre ',true);
	objs.obj889.addLink(new mse.Link('battre',21,'audio',mse.src.getSrc('heart'))); layers.text.addObject(objs.obj889);
	objs.obj890=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'contre ses tempes, l’adrénaline ',true); layers.text.addObject(objs.obj890);
	objs.obj891=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'inonder son corps. Il voulait gagner ',true); layers.text.addObject(objs.obj891);
	objs.obj892=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'du temps pour récupérer. Pour tenter ',true); layers.text.addObject(objs.obj892);
	objs.obj893=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'quelque chose.',true); layers.text.addObject(objs.obj893);
	objs.obj894=new mse.Text(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Il se retourna face à ses adversaires.',true); layers.text.addObject(objs.obj894);
	objs.obj959=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj959);
	objs.obj960=new mse.Text(layers.text,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid23')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"center"},'Fin de l\'extrait',true); layers.text.addObject(objs.obj960);
	objs.obj961=new mse.UIObject(layers.text,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.text.addObject(objs.obj961);
	layers.text.setDefile(1300);
	temp.layerDefile=layers.text;
	pages.Content.addLayer('text',layers.text);
	temp.obj=new mse.Mask(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')],'fillStyle':'rgb(255, 255, 255)'});
	animes.fouine.addObj('obj567',temp.obj);
	animes.fouine.addAnimation('obj567',{'frame':JSON.parse('[0,1,9,15,21,22]'),'opacity':JSON.parse('[1,0,1,1,0,0]')});
	animes.titleshow.addObj('obj13',objs.obj13);
	animes.titleshow.addAnimation('obj13',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.chashow.addObj('obj14',objs.obj14);
	animes.chashow.addAnimation('obj14',{'frame':JSON.parse('[0,75,88,101]'),'opacity':JSON.parse('[0,0,1,1]')});
	temp.obj=new mse.Image(null,{'pos':[mse.coor('cid2'),mse.coor('cid2')],'size':[mse.coor('cid0'),mse.coor('cid1')]},'grillageimg');
	animes.piege.addObj('grillageimg',temp.obj);
	temp.obj=new mse.Text(null,{'pos':[mse.coor('cid34'),mse.coor('cid35')],'size':[mse.coor('cid36'),mse.coor('cid37')],'fillStyle':'rgb(255, 255, 255)','textBaseline':'top','font':'normal '+mse.coor('cid33')+'px Verdana','textAlign':'left'},'Piégé!!!',true);
	animes.piege.addObj('obj587',temp.obj);
	animes.piege.addAnimation('grillageimg',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'opacity':JSON.parse('[0,1,1,1,1,0,0]')});
	animes.piege.addAnimation('obj587',{'frame':JSON.parse('[0,6,22,25,44,50,51]'),'fontSize':[mse.coor('cid33'),mse.coor('cid33'),mse.coor('cid38'),mse.coor('cid41'),mse.coor('cid41'),mse.coor('cid41'),mse.coor('cid41')],'pos':[[mse.coor('cid34'),mse.coor('cid35')],[mse.coor('cid34'),mse.coor('cid35')],[mse.coor('cid39'),mse.coor('cid40')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')],[mse.coor('cid42'),mse.coor('cid43')]],'opacity':JSON.parse('[0,0,0.699999988079,1,1,0,0]')});
	animes.maskAnime.addObj('obj710',objs.obj710);
	animes.maskAnime.addAnimation('obj710',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.80000001192093,0.80000001192093]')});
	animes.addGrilleBack.addObj('obj957',objs.obj957);
	animes.addGrilleBack.addAnimation('obj957',{'frame':JSON.parse('[0,1,2]'),'opacity':JSON.parse('[0,1,1]')});
	var action={};
	var reaction={};
	action.titleshowsc=new mse.Script([{src:pages.Chapitre,type:'show'}]);
	reaction.titleshowsc=function(){ 
		animes.titleshow.start(); 
	};
	action.titleshowsc.register(reaction.titleshowsc);
	action.chashowsc=action.titleshowsc;
	reaction.chashowsc=function(){ 
		animes.chashow.start(); 
	};
	action.chashowsc.register(reaction.chashowsc);
	action.transCont=new mse.Script([{src:pages.Chapitre,type:'click'}]);
	reaction.transCont=function(){ 
		root.transition(pages.Content); 
	};
	action.couvcursor=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.couvcursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.couvcursor.register(reaction.couvcursor);
	action.chacursor=new mse.Script([{src:animes.chashow,type:'end'}]);
	reaction.chacursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.chacursor.register(reaction.chacursor);
	action.contcursor=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.contcursor=function(){ 
		mse.setCursor('default'); 
	};
	action.contcursor.register(reaction.contcursor);
	action.chahidecursor=action.titleshowsc;
	reaction.chahidecursor=function(){ 
		mse.setCursor('default'); 
	};
	action.chahidecursor.register(reaction.chahidecursor);
	action.addTextEffet=action.couvcursor;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.text.objList.length; i++){
	var objCible = layers.text.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.evtDeleg.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.transCha=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transCha=function(){ 
		root.transition(pages.Chapitre); 
	};
	action.transCha.register(reaction.transCha);
	action.maskShow=action.titleshowsc;
	reaction.maskShow=function(){ 
		animes.maskAnime.start(); 
	};
	action.maskShow.register(reaction.maskShow);
	action.addTransContSc=new mse.Script([{src:animes.titleshow,type:'end'}]);
	reaction.addTransContSc=function(){ 
		action.transCont.register(reaction.transCont); 
	};
	action.addTransContSc.register(reaction.addTransContSc);
	action.startPiege=new mse.Script([{src:objs.obj870,type:'firstShow'}]);
	reaction.startPiege=function(){ 
		animes.piege.start(); 
	};
	action.startPiege.register(reaction.startPiege);
	action.startPiegeSon=action.startPiege;
	reaction.startPiegeSon=function(){ 
		mse.src.getSrc('piegeson').play(); 
	};
	action.startPiegeSon.register(reaction.startPiegeSon);
	action.addGrilleBackSc=new mse.Script([{src:animes.piege,type:'end'}]);
	reaction.addGrilleBackSc=function(){ 
		animes.addGrilleBack.start(); 
	};
	action.addGrilleBackSc.register(reaction.addGrilleBackSc);
	action.addCouteauAnimeSc=action.contcursor;
	reaction.addCouteauAnimeSc=function(){ 
		// Couteau
mse.src.addSource('cran', 'images/cran.png', 'img', false);
mse.src.addSource('audCran', 'audios/cran', 'aud', false);

var mx = (mse.coor('cid0')-51)/2, my = (mse.coor('cid1')-350)/2+140;
var manche = new mse.Sprite(null, {}, 'cran', 51,210, 0,0,51,210);
var lame = new mse.Sprite(null, {pos:[-12,-127]}, 'cran', 25,196, 51,0,25,139);
var couteau = new mse.UIObject(null, {});
couteau.count = 0; couteau.angle = -180;
couteau.draw = function(ctx){
    if(this.count == 10) mse.src.getSrc('audCran').play();
    if(this.count >= 10 && this.count <= 14)
    	this.angle = -180 + (this.count-10) * 180/4;
    this.count++;
    
	ctx.save();
	ctx.globalAlpha = this.globalAlpha;
	// Origin of rotation: point on the top of manche
	ctx.translate(mx+24,my+16);
	// Rotation of the lame
	ctx.rotate(this.angle * Math.PI / 180);
	lame.draw(ctx);
	// Draw Manche
	ctx.rotate(-this.angle * Math.PI / 180);
	ctx.translate(-24,-16);
	manche.draw(ctx);
	ctx.restore();
};

animes.couteau=new mse.Animation(36,1,true);
animes.couteau.block=true;
animes.couteau.addObj('couteau',couteau);
animes.couteau.addAnimation('couteau', {
		frame	: [0, 6, 30, 36],
		opacity	: [0, 1, 1,  0]
	});

action.showCouteau=new mse.Script([{src:objs.obj888,type:'firstShow'}]);
reaction.showCouteau=function(){ animes.couteau.start(); };
action.showCouteau.register(reaction.showCouteau) 
	};
	action.addCouteauAnimeSc.register(reaction.addCouteauAnimeSc);
	action.playIntroMusic=action.couvcursor;
	reaction.playIntroMusic=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.playIntroMusic.register(reaction.playIntroMusic);
	action.playOnletien_clic=new mse.Script([{src:objs.obj962,type:'click'}]);
	reaction.playOnletien_clic=function(){ 
		mse.src.getSrc('onletien').play(); 
	};
	action.playOnletien_clic.register(reaction.playOnletien_clic);
	action.playOnletien_show=new mse.Script([{src:objs.obj962,type:'firstShow'}]);
	reaction.playOnletien_show=function(){ 
		mse.src.getSrc('onletien').play(); 
	};
	action.playOnletien_show.register(reaction.playOnletien_show);
	mse.currTimeline.start();};


mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch1',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});