


var demoTiles = cc.Scene.extend({
	surcouche : null ,
	initTmx : function(){
		
		var map = cc.TMXTiledMap.create("Resources/tiles.tmx");
		//var map = cc.TMXTiledMap.create("D:/Programmes/Util/wamp/www/cocos/demo cocos/tilesM\Resources/orthogonal-test2.tmx");
		
		
		
		
		this.surcouche = cc.Layer.create();
		
		
		this.surcouche.ccTouchesBegan = function (touch, event) {
			console.log("me");
	        return true;
	    }
		this.surcouche.ccTouchesMoved = function (touch, event) {
			console.log("me");
	        return true;
	    }
		this.surcouche.ccTouchesEnded = function (touch, event) {
			console.log("me");
	        return true;
	    }
		this.surcouche.touchDelegateRetain = function () {};
		this.surcouche.touchDelegateRelease = function () {};
		
		
		this.surcouche.registerWithTouchDispatcher = function ( e ){
			console.log("thing");
		}
		
		this.surcouche.setIsTouchEnabled(true);
		
		this.surcouche.addChild( map );
		
		
		this.surcouche.ccTouchMoved();
		
		
		var move = cc.MoveBy.create(3, cc.PointMake(100, 0));
        var move_ease_inout3 = cc.EaseInOut.create(move.copy(), 2.0);
        var move_ease_inout_back3 = move_ease_inout3.reverse();
        var seq3 = cc.Sequence.create(move_ease_inout3, move_ease_inout_back3);
        this.surcouche.runAction(cc.RepeatForever.create(seq3));
		
		this.addChild( this.surcouche , -1 );
		
	},
	ctor:function () {
		this._super();
		// on charge le fichier tiles
		console.log( " construct ");
		
		this.init();
		
		this.initTmx();
		
		
		
	},
	
	init : function(){
		this._super();
		
		var r = new ReactLayer();
		
		this.addChild( r  , 3 );
		
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
		
		
		this.sprite = cc.Sprite.create("Resources/tiles1.jpg");
        
        sublayer.addChild(this.sprite, 1);
		
		console.log( " init ");
	}
});


var ReactLayer = cc.Layer.extend({
    ctor:function () {
        this.setIsTouchEnabled(true);
        
        var layer = cc.LayerColor.create(cc.ccc4(255, 255, 0, 100));
		layer.setContentSizeInPixels( new cc.Size( 100 , 100 ) );
        this.addChild(layer, -1);
    },

    ccTouchesEnded:function (touches, event) {
        if (touches.length <= 0)
            return;

        var touch = touches[0];
		
		var location = touch.locationInView(touch.view());
		
		console.log( location );
    }
});