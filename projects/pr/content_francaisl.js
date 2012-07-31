

var cc = cc = cc || {};
mse.src.addSource('cocos', 'pr/cocos2d/cocosInit.js', 'script', true);

var FindSimon = function() {
    mse.Game.call(this);
    
    this.state = "INIT";
    
	var scene;
	var cocoObject;
	
	
	
	this.graphiqueInit = function(){
	
		scene = cc.Scene.create();
	
		cocoObject = cc.Layer.create();
	
		scene.addChild( cocoObject );
		
		
		var helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        helloLabel.setColor( new cc.Color3B(155,50,0) );
        // position the label on the center of the screen
        helloLabel.setPosition(cc.ccp(100 , 100));
        // add the label as a child to this layer
        scene.addChild( helloLabel, 5);
		
		console.log( "out" );
	}
	
	this.scene = function () {
	    // 'scene' is an autorelease object
	    var scene = cc.Scene.create();
		scene.init();
		
		
	    // 'layer' is an autorelease object
	    var layer = cc.Layer.create();
		layer.init();
		
		
		
	    scene.addChild(layer);
		
		
		var helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        helloLabel.setColor( new cc.Color3B(155,50,0) );
        // position the label on the center of the screen
        helloLabel.setPosition(cc.ccp(100 , 100));
        // add the label as a child to this layer
        layer.addChild( helloLabel, 5);
		
		console.log( "in");
		
	    return scene;
	}
	
	// cocos interface
	/*
	this.scene = function(){
		return scene;
	}
	*/

	// mse interface
	this.ctor = function () {
        this._super();
		console.log( "const" );
    }
	this.init = function() {
		
		console.log( "init" );
		
		this.graphiqueInit();
	
	}
	this.logic = function( d ){
		cc.Scheduler.sharedScheduler().tick(d);
	}



}
extend( FindSimon , mse.Game );



/*
var d = new demoCocos();
var tick = function(){
	d.logic(0.5);
	console.log( "tick");
}
*/



mse.coords = JSON.parse('{"cid0":500,"cid1":400,"cid2":390,"cid3":50,"cid4":10,"cid5":21.666666666667,"cid6":23.333333333333,"cid7":333.33333333333,"cid8":385.83333333333,"cid9":0,"cid10":340.83333333333,"cid11":125,"cid12":163.33333333333,"cid13":20,"cid14":355}');
initMseConfig();
mse.init();
var pages={};
var layers={};
var objs={};
var animes={};
var games={};
var wikis={};
function createbook(){
	mse.configs.srcPath='./pr/';
	window.root = new mse.Root('pr',mse.coor('cid0'),mse.coor('cid1'),'portrait');
	var temp = {};
	mse.src.addSource('src0','images/src0.png','img',true);
	mse.src.addSource('src1','audios/src1','aud',false);
	mse.src.addSource('src2','audios/src2','aud',false);
	mse.src.addSource('src3','audios/src3','aud',false);
	mse.src.addSource('src4','audios/src4','aud',false);
	games.FindSimon = new FindSimon();
	pages.aa=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.aadefault=new mse.Layer(pages.aa,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	pages.aa.addLayer('aadefault',layers.aadefault);
	layers.aree=new mse.ArticleLayer(pages.aa,2,{"size":[mse.coor('cid1'),mse.coor('cid2')],"pos":[mse.coor('cid3'),mse.coor('cid4')],"globalAlpha":1,"font":"normal "+mse.coor('cid5')+"px Arial","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid6')},null);
	objs.obj0=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Vestibulum quis eros id nisi auctor ',true); layers.aree.addObject(objs.obj0);
	objs.obj3=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'eget elit auctor imperdiet. Vestibulum ',true);
	objs.obj3.addLink(new mse.Link('imperdiet',1,'audio',mse.src.getSrc('src2'))); layers.aree.addObject(objs.obj3);
	objs.obj69=new FindSimon(); layers.aree.addGame(objs.obj69);
	objs.obj7=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Morbi id arcu sit amet est interdum ',true); layers.aree.addObject(objs.obj7);
	objs.obj61=new mse.Speaker( layers.aree,{"size":[mse.coor('cid8'),mse.coor('cid9')]}, 'eric', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.aree.addObject(objs.obj61);
	objs.obj62=new mse.Text(layers.aree,{"size":[mse.coor('cid10'),mse.coor('cid6')]},' augue suscipit euismod commodo, ',true);
	objs.obj61.addObject(objs.obj62);
	objs.obj63=new mse.Text(layers.aree,{"size":[mse.coor('cid10'),mse.coor('cid6')]},'augue felis tincidunt nulla, eget ',true);
	objs.obj61.addObject(objs.obj63);
	objs.obj67=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'volutpat turpis ante sit amet leo. ',true);
	objs.obj61.addObject(objs.obj67);
	objs.obj68=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Maecenas sollicitudin laoreet ipsum,a',true);
	objs.obj61.addObject(objs.obj68);
	objs.obj8=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'dapibus ut in elit. In sodales, tortor ',true); layers.aree.addObject(objs.obj8);
	objs.obj9=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'scelerisque varius volutpat, dolor enim ',true);
	objs.obj9.addLink(new mse.Link('volutpat',6,'audio',mse.src.getSrc('src4'))); layers.aree.addObject(objs.obj9);
	objs.obj10=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'commodo nunc, non pretium lorem tortor ',true); layers.aree.addObject(objs.obj10);
	objs.obj11=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'sit amet sem. Cum sociis natoque ',true); layers.aree.addObject(objs.obj11);
	objs.obj12=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'penatibus et magnis dis parturient ',true); layers.aree.addObject(objs.obj12);
	objs.obj13=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'montes, nascetur ridiculus mus. ',true); layers.aree.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Pellentesque venenatis neque at dui ',true); layers.aree.addObject(objs.obj14);
	objs.obj15=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'elementum nec pulvinar purus ultricies. ',true); layers.aree.addObject(objs.obj15);
	objs.obj16=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Vestibulum rutrum feugiat elit, in vulputate ',true); layers.aree.addObject(objs.obj16);
	objs.obj49=new mse.Image(layers.aree,{"size":[mse.coor('cid11'),mse.coor('cid12')],"pos":[mse.coor('cid13'),mse.coor('cid13')]},'src0');
	objs.obj49.activateZoom(); layers.aree.addObject(objs.obj49);
	objs.obj17=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'purus auctor eget. Praesent non ante ',true); layers.aree.addObject(objs.obj17);
	objs.obj18=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'libero. Nam neque purus, luctus at ',true); layers.aree.addObject(objs.obj18);
	objs.obj19=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'euismod et, pellentesque non lacus. Nulla ',true); layers.aree.addObject(objs.obj19);
	objs.obj20=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'et ipsum a turpis cursus malesuada. ',true); layers.aree.addObject(objs.obj20);
	objs.obj21=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Etiam blandit sollicitudin iaculis. ',true); layers.aree.addObject(objs.obj21);
	objs.obj22=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Vestibulum sem metus, bibendum nec ',true); layers.aree.addObject(objs.obj22);
	objs.obj23=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'malesuada nec, egestas quis ante.',true); layers.aree.addObject(objs.obj23);
	objs.obj24=new mse.UIObject(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]}); layers.aree.addObject(objs.obj24);
	objs.obj25=new mse.UIObject(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]}); layers.aree.addObject(objs.obj25);
	objs.obj26=new mse.Speaker( layers.aree,{"size":[mse.coor('cid1'),mse.coor('cid9')]}, 'etiam', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.aree.addObject(objs.obj26);
	objs.obj27=new mse.Text(layers.aree,{"size":[mse.coor('cid14'),mse.coor('cid6')]},' eget nibh sem. Vivamus vel feugiat ',true);
	objs.obj26.addObject(objs.obj27);
	objs.obj28=new mse.Text(layers.aree,{"size":[mse.coor('cid14'),mse.coor('cid6')]},'nunc. In hac habitasse platea ',true);
	objs.obj26.addObject(objs.obj28);
	objs.obj32=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'dictumst. Donec massa velit, adipiscing ',true);
	objs.obj26.addObject(objs.obj32);
	objs.obj33=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'ut viverra eu, dapibus quis ante. Aliquam ',true);
	objs.obj26.addObject(objs.obj33);
	objs.obj34=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'mollis tincidunt feugiat. ',true);
	objs.obj26.addObject(objs.obj34);
	objs.obj35=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Nam congue bibendum risus, quis ',true); layers.aree.addObject(objs.obj35);
	objs.obj36=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'hendrerit purus feugiat rhoncus. Donec ',true); layers.aree.addObject(objs.obj36);
	objs.obj37=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'mauris enim, lacinia sit amet hendrerit ut, ',true); layers.aree.addObject(objs.obj37);
	objs.obj38=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'rhoncus non elit. Nullam feugiat hendrerit ',true); layers.aree.addObject(objs.obj38);
	objs.obj39=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'turpis, vel imperdiet odio porta sed. ',true); layers.aree.addObject(objs.obj39);
	objs.obj40=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Curabitur eros leo, varius ut tristique ',true); layers.aree.addObject(objs.obj40);
	objs.obj41=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'interdum, dignissim mollis quam. Sed ',true); layers.aree.addObject(objs.obj41);
	objs.obj42=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'tempus purus vel neque vulputate auctor. ',true); layers.aree.addObject(objs.obj42);
	objs.obj43=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Sed vel tellus enim, condimentum ',true); layers.aree.addObject(objs.obj43);
	objs.obj44=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'commodo nibh. Nulla leo felis, sodales ut ',true); layers.aree.addObject(objs.obj44);
	objs.obj45=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'tempor sit amet, ullamcorper nec purus. ',true); layers.aree.addObject(objs.obj45);
	objs.obj46=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Duis sollicitudin nibh vel mauris lacinia a ',true); layers.aree.addObject(objs.obj46);
	objs.obj47=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'semper augue mollis.',true); layers.aree.addObject(objs.obj47);
	layers.aree.setDefile(1300);
	temp.layerDefile=layers.aree;
	pages.aa.addLayer('aree',layers.aree);
	var action={};
	var reaction={};
	mse.currTimeline.start();};
mse.autoFitToWindow(createbook);