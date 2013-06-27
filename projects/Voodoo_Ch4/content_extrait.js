
mse.coords = JSON.parse('{"cid0":800,"cid1":600,"cid2":0,"cid3":400,"cid4":200,"cid5":20,"cid6":448.75,"cid7":108.75,"cid8":175,"cid9":106.25,"cid10":32.5,"cid11":396.25,"cid12":56.25,"cid13":203.75,"cid14":246.25,"cid15":340,"cid16":590,"cid17":230,"cid18":10,"cid19":22.5,"cid20":36.25,"cid21":425,"cid22":295,"cid23":532.5,"cid24":33,"cid25":174,"cid26":108,"cid27":449,"cid28":109,"cid29":18,"cid30":223,"cid31":399,"cid32":358,"cid33":181,"cid34":204,"cid35":246,"cid36":396,"cid37":56}');
initMseConfig();
window.pages={};
window.layers={};
window.objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	if(config.publishMode == 'debug') mse.configs.srcPath='./Voodoo_Ch4/';
	window.root = mse.root;
	var temp = {};
	mse.src.addSource('darkback','images/darkback.jpeg','img',true);
	animes.titleanime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.titleanime.block=true;
	animes.resumeanime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.resumeanime.block=true;
	wikis.Borborygme=new mse.WikiLayer();
	wikis.Borborygme.addTextCard();
	wikis.Borborygme.textCard.addSection('Borborygme', 'Nom masculin :\nBruit provoqué par la digestion dans l’estomac et les intestins. Par extension : parole indistincte, bruit bizarre');
	mse.src.addSource('src25','images/src25.jpeg','img',true);
	mse.src.addSource('src26','images/src26.jpeg','img',true);
	animes.maskanime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.maskanime.block=true;
	animes.chaanime=new mse.Animation(89,1,false,null,{'size':[mse.coor('cid0'),mse.coor('cid1')]});
	animes.chaanime.block=true;
	mse.src.addSource('src27','images/src27.png','img',true);
	mse.src.addSource('src28','images/src28.jpeg','img',true);
	mse.src.addSource('src29','images/src29.jpeg','img',true);
	mse.src.addSource('src30','images/src30.png','img',true);
	mse.src.addSource('intro','audios/intro','aud',false);
	mse.src.addSource('bruitsac1','audios/bruitsac1','aud',false);
	mse.src.addSource('bruitsac2','audios/bruitsac2','aud',false);
	mse.src.addSource('gargouilli','audios/gargouilli','aud',false);
	pages.Couverture=new mse.BaseContainer(root,'Couverture',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Couverturedefault=new mse.Layer(pages.Couverture,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj307=new mse.Image(layers.Couverturedefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src26'); layers.Couverturedefault.addObject(objs.obj307);
	pages.Couverture.addLayer('Couverturedefault',layers.Couverturedefault);
	pages.Title=new mse.BaseContainer(null,'Title',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.Titledefault=new mse.Layer(pages.Title,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj308=new mse.Image(layers.Titledefault,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')]},'src25'); layers.Titledefault.addObject(objs.obj308);
	pages.Title.addLayer('Titledefault',layers.Titledefault);
	layers.titlemask=new mse.Layer(pages.Title,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj310=new mse.Mask(layers.titlemask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.6,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.titlemask.addObject(objs.obj310);
	pages.Title.addLayer('titlemask',layers.titlemask);
	layers.text=new mse.Layer(pages.Title,3,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj9=new mse.Text(layers.text,{"size":[mse.coor('cid6'),mse.coor('cid7')],"pos":[mse.coor('cid8'),mse.coor('cid9')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'BEN MERDE, ALORS !',true); layers.text.addObject(objs.obj9);
	objs.obj311=new mse.Text(layers.text,{"size":[mse.coor('cid11'),mse.coor('cid12')],"pos":[mse.coor('cid13'),mse.coor('cid14')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid10')+"px Gudea","textAlign":"center","textBaseline":"top"},'Episode IV',true); layers.text.addObject(objs.obj311);
	pages.Title.addLayer('text',layers.text);
	pages.Content=new mse.BaseContainer(null,'Content',{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.background=new mse.Layer(pages.Content,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj306=new mse.Image(layers.background,{"size":[mse.coor('cid0'),mse.coor('cid1')],"pos":[mse.coor('cid2'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":1,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"},'src25'); layers.background.addObject(objs.obj306);
	pages.Content.addLayer('background',layers.background);
	layers.mask=new mse.Layer(pages.Content,2,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	objs.obj12=new mse.Mask(layers.mask,{"size":[mse.coor('cid3'),mse.coor('cid1')],"pos":[mse.coor('cid4'),mse.coor('cid2')],"fillStyle":"rgb(0, 0, 0)","globalAlpha":0.60,"font":"normal "+mse.coor('cid5')+"px Times","textAlign":"left"}); layers.mask.addObject(objs.obj12);
	pages.Content.addLayer('mask',layers.mask);
	layers.content=new mse.ArticleLayer(pages.Content,3,{"size":[mse.coor('cid15'),mse.coor('cid16')],"pos":[mse.coor('cid17'),mse.coor('cid18')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid20')},null);
	objs.obj352=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le borborygme s’amplifia, ',true);
	objs.obj352.addLink(new mse.Link('Le',0,'audio',mse.src.getSrc('gargouilli')));
	objs.obj352.addLink(new mse.Link('borborygme',0,'wiki',wikis.Borborygme)); layers.content.addObject(objs.obj352);
	objs.obj353=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'ricochant sur les parois. C’était ',true); layers.content.addObject(objs.obj353);
	objs.obj354=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'raté pour la discrétion !',true); layers.content.addObject(objs.obj354);
	objs.obj355=new mse.Speaker( layers.content,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src28' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj355);
	objs.obj356=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Y a quelqu’un ? ',true);
	objs.obj355.addObject(objs.obj356);
	objs.obj357=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Simon sursauta. La même voix ',true); layers.content.addObject(objs.obj357);
	objs.obj358=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'que tout à l’heure. ',true); layers.content.addObject(objs.obj358);
	objs.obj359=new mse.Speaker( layers.content,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src28' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj359);
	objs.obj360=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Ventre-dieu ! Si quelqu’un ',true);
	objs.obj359.addObject(objs.obj360);
	objs.obj361=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'m’entend, venez m’aider !',true);
	objs.obj359.addObject(objs.obj361);
	objs.obj362=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'À présent, l’adolescent percevait ',true); layers.content.addObject(objs.obj362);
	objs.obj363=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'du bruit. Quelques mètres devant ',true);
	objs.obj363.addLink(new mse.Link('bruit',8,'audio',mse.src.getSrc('bruitsac1'))); layers.content.addObject(objs.obj363);
	objs.obj364=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'lui, probablement. Quelqu’un qui ',true); layers.content.addObject(objs.obj364);
	objs.obj365=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'s’agitait, comme s’il était pris au ',true); layers.content.addObject(objs.obj365);
	objs.obj366=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'piège. Comme s’il était enfermé ',true); layers.content.addObject(objs.obj366);
	objs.obj367=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'dans…',true); layers.content.addObject(objs.obj367);
	objs.obj368=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le sac ! Le grand sac noir aux ',true); layers.content.addObject(objs.obj368);
	objs.obj369=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'pieds de Papa Legba !',true); layers.content.addObject(objs.obj369);
	objs.obj370=new mse.Speaker( layers.content,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src28' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj370);
	objs.obj371=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Je sais que vous êtes là, je ',true);
	objs.obj370.addObject(objs.obj371);
	objs.obj372=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'vous entends respirer. Alors ',true);
	objs.obj370.addObject(objs.obj372);
	objs.obj375=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'décidez-vous ou je me fâche pour ',true);
	objs.obj370.addObject(objs.obj375);
	objs.obj376=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'de bon !',true);
	objs.obj370.addObject(objs.obj376);
	objs.obj377=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'D’instinct Simon bloqua sa ',true); layers.content.addObject(objs.obj377);
	objs.obj378=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'respiration. ',true); layers.content.addObject(objs.obj378);
	objs.obj379=new mse.Text(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]},'Le sac remua de plus belle.',true);
	objs.obj379.addLink(new mse.Link('Le sac ',18,'audio',mse.src.getSrc('bruitsac2'))); layers.content.addObject(objs.obj379);
	objs.obj380=new mse.Speaker( layers.content,{"size":[mse.coor('cid15'),mse.coor('cid2')]}, 'unknown', 'src28' , mse.coor(mse.joinCoor(45)) , '#f99200' ); layers.content.addObject(objs.obj380);
	objs.obj381=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'Alors c’est pour aujourd’hui ',true);
	objs.obj380.addObject(objs.obj381);
	objs.obj382=new mse.Text(layers.content,{"size":[mse.coor('cid22'),mse.coor('cid20')]},'ou pour demain ?',true);
	objs.obj380.addObject(objs.obj382);
	objs.obj602=new mse.UIObject(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.content.addObject(objs.obj602);
	objs.obj603=new mse.Text(layers.content,{"size":[mse.coor('cid15'),mse.coor('cid20')],"pos":[mse.coor('cid2'),mse.coor('cid23')],"fillStyle":"rgb(255, 255, 255)","globalAlpha":1,"font":"normal "+mse.coor('cid19')+"px Gudea","textAlign":"center"},'Fin de l\'extrait...',true); layers.content.addObject(objs.obj603);
	objs.obj604=new mse.UIObject(layers.content,{"size":[mse.coor('cid21'),mse.coor('cid20')]}); layers.content.addObject(objs.obj604);
	layers.content.setDefile(1300);
	temp.layerDefile=layers.content;
	pages.Content.addLayer('content',layers.content);
	animes.titleanime.addObj('obj9',objs.obj9);
	animes.titleanime.addAnimation('obj9',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.resumeanime.addObj('obj11',objs.obj11);
	animes.resumeanime.addAnimation('obj11',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	animes.maskanime.addObj('obj310',objs.obj310);
	animes.maskanime.addAnimation('obj310',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,0.60000002384186,0.60000002384186]')});
	animes.chaanime.addObj('obj311',objs.obj311);
	animes.chaanime.addAnimation('obj311',{'frame':JSON.parse('[0,75,88,89]'),'opacity':JSON.parse('[0,0,1,1]')});
	var action={};
	var reaction={};
	action.couvcursor=new mse.Script([{src:pages.Couverture,type:'show'}]);
	reaction.couvcursor=function(){ 
		mse.setCursor('pointer'); 
	};
	action.couvcursor.register(reaction.couvcursor);
	action.addTextEffet=action.couvcursor;
	reaction.addTextEffet=function(){ 
		function textEffect(effet,obj) {
	obj.startEffect(effet);
}
for(var i = 0; i < layers.content.objList.length; i++){
	var objCible = layers.content.getObject(i);
	if(objCible instanceof mse.Text){
	    objCible.addListener('firstShow', new mse.Callback(textEffect, null, {"typewriter":{}}, objCible));
	}
} 
	};
	action.addTextEffet.register(reaction.addTextEffet);
	action.transTitle=new mse.Script([{src:pages.Couverture,type:'click'}]);
	reaction.transTitle=function(){ 
		root.transition(pages.Title); 
	};
	action.transTitle.register(reaction.transTitle);
	action.curDefTitle=new mse.Script([{src:pages.Title,type:'show'}]);
	reaction.curDefTitle=function(){ 
		mse.setCursor('default'); 
	};
	action.curDefTitle.register(reaction.curDefTitle);
	action.transContent=new mse.Script([{src:pages.Title,type:'click'}]);
	reaction.transContent=function(){ 
		root.transition(pages.Content); 
	};
	action.startMaskAnime=action.curDefTitle;
	reaction.startMaskAnime=function(){ 
		animes.maskanime.start(); 
	};
	action.startMaskAnime.register(reaction.startMaskAnime);
	action.startChaAnime=action.curDefTitle;
	reaction.startChaAnime=function(){ 
		animes.chaanime.start(); 
	};
	action.startChaAnime.register(reaction.startChaAnime);
	action.startResumeAnime=action.curDefTitle;
	reaction.startResumeAnime=function(){ 
		animes.resumeanime.start(); 
	};
	action.startResumeAnime.register(reaction.startResumeAnime);
	action.startTitleAnime=action.curDefTitle;
	reaction.startTitleAnime=function(){ 
		animes.titleanime.start(); 
	};
	action.startTitleAnime.register(reaction.startTitleAnime);
	action.addTransContent=new mse.Script([{src:animes.maskanime,type:'end'}]);
	reaction.addTransContent=function(){ 
		action.transContent.register(reaction.transContent); 
	};
	action.addTransContent.register(reaction.addTransContent);
	action.curPtTitle=action.addTransContent;
	reaction.curPtTitle=function(){ 
		mse.setCursor('pointer'); 
	};
	action.curPtTitle.register(reaction.curPtTitle);
	action.curContent=new mse.Script([{src:pages.Content,type:'show'}]);
	reaction.curContent=function(){ 
		mse.setCursor('default'); 
	};
	action.curContent.register(reaction.curContent);
	action.stopIntroson=action.curContent;
	reaction.stopIntroson=function(){ 
		mse.src.getSrc('intro').pause(); 
	};
	action.stopIntroson.register(reaction.stopIntroson);
	action.startIntroSon=action.transTitle;
	reaction.startIntroSon=function(){ 
		mse.src.getSrc('intro').play(); 
	};
	action.startIntroSon.register(reaction.startIntroSon);
	mse.currTimeline.start();};

mse.autoFitToWindow(function() {
    mse.init(null, 'Voodoo_Ch4',mse.coor('cid0'),mse.coor('cid1'),'portrait');
    $(document).ready(createbook);
});