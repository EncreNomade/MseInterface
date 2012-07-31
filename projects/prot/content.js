
mse.coords = JSON.parse('{"cid0":500,"cid1":400,"cid2":18,"cid3":50,"cid4":210,"cid5":20,"cid6":40}');
initMseConfig();
mse.init();
var pages={};
var layers={};
var objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	mse.configs.srcPath='./prot/';
	window.root = new mse.Root('prot',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src0','audios/src0','aud',false);
	mse.src.addSource('src1','audios/src1','aud',false);
	mse.src.addSource('src2','audios/src2','aud',false);
	wikis.wik=new mse.WikiLayer();
	wikis.wik.addTextCard();
	wikis.wik.textCard.addSection('de', 'Donec tincidunt pulvinar quam eget sollicitudin. In fringilla sollicitudin placerat. Nulla facilisi. Maecenas felis massa, pellentesque ut bibendum ac, consequat sodales erat. Sed cursus adipiscing leo, quis eleifend lorem euismod eget. Etiam rutrum, dolor et scelerisque imperdiet, lacus enim sed pulvinar. In ac ante quam, et ');
	mse.src.addSource('src3','images/src3.png','img',true);
	pages.dfgdfg=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.dfgdfgdefault=new mse.Layer(pages.dfgdfg,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	pages.dfgdfg.addLayer('dfgdfgdefault',layers.dfgdfgdefault);
	animes.hh=new mse.Animation(26,1,false);
	animes.hh.block=true;
	animes.hh.addObj('obj110',objs.obj110);
	animes.hh.addAnimation('obj110',{'frame':JSON.parse('[0,13,26]'),'fontSize':[mse.coor('cid2'),mse.coor('cid6'),mse.coor('cid6')]});
	var action={};
	var reaction={};
	action.hhh=new mse.Script([{src:objs.obj110,type:'show'}]);
	reaction.hhh=function(){ 
		animes.hh.start(); 
	};
	action.hhh.register(reaction.hhh);
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);