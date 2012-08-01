

mse.src.addSource('cocos', 'cocos.js', 'script', true);

var cc = cc = cc || {};

var demoCocos = function(){

	mse.Game.call(this, {fillback:true});

cc.AppDelegate = cc.Application.extend({
    ctor:function () {
        this._super();
    },
    initInstance:function () {
        return true;
    },
    applicationDidFinishLaunching:function () {
        var pDirector = cc.Director.sharedDirector();

        pDirector.setDisplayFPS(true);
        pDirector.setAnimationInterval(1.0 / 60);
       		
        var pScene = rootLayer.scene();

        pDirector.runWithScene(pScene);
		
		// pause the director, so the cc timeline is disable
		pDirector.pause()
		
        return true;
    },
	

    applicationDidEnterBackground:function () {
        cc.Director.sharedDirector().pause();
    },
    applicationWillEnterForeground:function () {
        cc.Director.sharedDirector().resume();
    }
});

var rootLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
	
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.sharedDirector().getWinSize();

        
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        this.helloLabel.setColor( new cc.Color3B(255,0,0) );
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.ccp(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        

		var sublayer = cc.Layer.create();
		
		this.addChild( sublayer );
		
        var move = cc.MoveBy.create(3, cc.PointMake(300, 0));
        var move_ease_inout3 = cc.EaseInOut.create(move.copy(), 2.0);
        var move_ease_inout_back3 = move_ease_inout3.reverse();
        var seq3 = cc.Sequence.create(move_ease_inout3, move_ease_inout_back3);
        this.helloLabel.runAction(cc.RepeatForever.create(seq3));
        sublayer.addChild(this.helloLabel, 1);
		
		
		var fire = cc.ParticleFire.create();
        fire.setTexture(cc.TextureCache.sharedTextureCache().addImage("Resources/cocos64.png"));
        fire.setPosition(cc.PointMake(80, size.height / 2 - 50));

        var copy_seq3 = seq3.copy();

        fire.runAction(cc.RepeatForever.create(copy_seq3));
        sublayer.addChild(fire, 2);
		
		
		
		
		this.schedule(this.delay, 1.0);
		
        return true;
		
		
    },
	delay : function(dlt ){
		console.log( dlt );
	}

});

rootLayer.scene = function () {
    // 'scene' is an autorelease object
    var scene = cc.Scene.create();

    // 'layer' is an autorelease object
    var layer = this.node();
    scene.addChild(layer);
    return scene;
};
// implement the "static node()" method manually
rootLayer.node = function () {
    var ret = new rootLayer();

    // Init the helloworld display layer.
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

rootLayer.update = function( dt ){
	
	console.log( "update" );
	
}
rootLayer.draw = function( dt ){
	
	console.log( "draw" );
	
}



}


extend( demoCocos , mse.Game );

demoCocos.prototype.init = function(){
		cc.setup("gameCanvas");

            //we are ready to run the game
            cc.Loader.shareLoader().onloading = function () {
                cc.LoaderScene.shareLoaderScene().draw();
            };
            cc.Loader.shareLoader().onload = function () {
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            };
            //preload ressources
            cc.Loader.shareLoader().preload([
                //{type:"image", src:"Resources/HelloWorld.png"},
            ]);
		
}



demoCocos.prototype.logic = function( delta ){
	cc.Scheduler.sharedScheduler().tick(delta);
	console.log( "tick");
}

/*
var d = new demoCocos();
var tick = function(){
	d.logic(0.5);
	console.log( "tick");
}
*/


