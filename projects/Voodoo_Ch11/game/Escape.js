mse.configs.srcPath='./Voodoo_Ch11/';
var cc = cc = cc || {};

mse.src.addSource('cocos', 'game/cocos2d/cocosInit.js', 'script', true);
mse.src.addSource('maxSp',      'game/Resources/sprite max.png', 'image', true);
mse.src.addSource('decor','game/Resources/decorM2.png', 'image', true);
mse.src.addSource('backDecor','game/Resources/Batiments-fondM.png', 'image', true);
mse.src.addSource('stars','game/Resources/starsM.png', 'image', true);

var Escape = function(){
	
	
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
		
	        var pScene = gameLayer.scene();

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
	
	var primerInit = true;
	this.init = function(){
			
			if( primerInit ){
				cc.setup("gameCanvas");
				
				//we are ready to run the game
	            cc.Loader.shareLoader().onloading = function () {
	                //cc.LoaderScene.shareLoaderScene().draw();
	            };
	            cc.Loader.shareLoader().onload = function () {
	                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
	            };
	            //preload ressources
	            cc.Loader.shareLoader().preload([
	            ]);
			} else {
				
				//cc.Scheduler.sharedScheduler().unscheduleAllSelectors()
				
				var pDirector = cc.Director.sharedDirector();
				
				var scene = pDirector.getRunningScene();
				
				scene.release();
				
		        var pScene = gameLayer.scene();
				
		        pDirector.replaceScene(pScene);
				
			}

		primerInit = false;
	}
	this.logic = function( delta ){
		cc.Scheduler.sharedScheduler().tick(delta / 1000 );
	}
	
	this.win = function( delta ){
		console.log( "win ");
	}
	this.lose = function( delta ){
		console.log( "lose ");
	}
	
	var win = this.win,
		lose = this.lose;
	

/**
 * an object that can be used as a cc element ( children of cc.Node )
 * can register to an event like a mse.UIObject
 * as a mse.UIObject, its have a inObj method that return true if the point is in the element
 * basicly , it test the collision with the bounding box
 * /!\  by default a node is not empty, but have a box of 10 x 10 centred in 0 0,  so if your elements are centrer in the middle of the frame, the bounding box will include the 0 0 point
 */
var ReactiveNode = cc.Node.extend({
		evtDeleg : null,
		inObj : function( x , y ){
			
			var contact = cc.PointMake( x , cc.Director.sharedDirector().getWinSize().height - y );
			
			// large collision
			if( !cc.Rect.CCRectContainsPoint( this.boundingBoxToWorld() , contact ) )
				return false;
			
			// thin collision
			return true;
			
		},
		eventCheck     : mse.UIObject.prototype.eventCheck,
		addListener    : mse.UIObject.prototype.addListener,
		removeListener : mse.UIObject.prototype.removeListener,
		getZindex: function() {
			return this.getZOrder();
		},
		getContainer : function(){
			return mse.root.gamewindow;
		},
		ctor : function(){
			this._super();
			this.evtDeleg = new mse.EventDelegateSystem(this);
		}
});



var _seed = 123456789512565678;
var _offset = _seed
Math.prandom = function(){
		
	var s = _seed + _offset;
	var square = s *s;
		
	_seed = Math.floor( square / 10000 ) % 100000000;
		
	return ( _seed / 100000000 );
}

/**
 * make a transition of color, blue to red passing by white
 */
var GyroLight = function(){};
GyroLight.prototype = {
	_t : 0,
	_period : 50,
	_color : "#FF0037",
	tick : function(){
		this._t = (this._t + 1 )%this._period;
		var k = this._t / this._period;
			if( k < 0.25 )
				this._color = "#FF0037";
			else
			if( k < 0.5 )
				if( k < 0.375 ){
					var r = 255,
						v = Math.floor( 2040 *( k - 0.25 )),
						b = 55 + Math.floor( 1600 * ( k - 0.25 ));
					this._color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255 - Math.floor( 1600 * ( k - 0.375 )),
						v = 255 - Math.floor( 2040 * ( k - 0.375 )),
						b = 255;
					this._color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
			else
			if( k < 0.75 )
				this._color = "#3700FF";
			else
				if( k < 0.875 ){
					var r = 55 + Math.floor( 1600 *( k - 0.75 ) ),
						v = Math.floor( 2040 * ( k - 0.75 )),
						b = 255;
					this._color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255,
						v = 255 - Math.floor( 2040 * ( k - 0.875 ) ),
						b = 255 - Math.floor( 1600 * ( k - 0.875 ) );
					this._color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
	},
	getColor : function(){
		return this._color;
	},
	setPeriod : function( x ){
		this._period = x;
	},
	sett : function( t ){
		this._t = t;
	},
}

/**
 * a node that draw a scene according to an atlas and a list of item and their position
 * basically, this node should be used to display a horizontal scrolling WITH NO RUNNING BACKWARD
 * in order to maximise performance, this node use a buffer, 
 * item are drawn just in time on the buffer
 * the size ( width ) of the visible window must be set up before the initialisation, use setWindow
 * the size  ( width ) of the buffer is 800 by default,but it is largered if its needed ( when its to small to contain the window and the largest item )
 * 
 */
var DefilDecor = cc.Node.extend({
	_textureAtlas : null, 			// canvas
	_coordAtlas : null,				// array of rect					formated as x , y , width , height
	_struct : null,					// list of occurence of the atlas item  		formated as  b : bottom , t : top , r: right ,  l : left ,  indexAtlas : the index of the item in coordAtlas , z : z-index
	_buffer : null,					// canvas
	_upperBoundCurrentlyDrawn : 0,
	_xBuffer : 0,					// position of the buffer relative to the band
	_xWindow : 0,					// position of the visible window relative to the band
	_window : 800,					// size of the visible window
	_bufferWidth : 800,				// size of the buffer
	_occasionalBuffer : null,
	_height : 600,
	_cleanBufferWidth : 0,			// width of the buffer that have been erased
	ctor : function(){
		this._super();
	},
	setWindow : function( x ){
		this._window = x;
		
		this.setBufferWidth( this._bufferWidth );
	},
	setHeight : function( x ){
		this._height = x;
		
		if( this._buffer )
			this._buffer.height = x;
			
		if( this._occasionalBuffer )
			this._occasionalBuffer.height = x;
	},
	setBufferWidth : function( x ){
		
		// seek for the largest item
		var m = 0 ;
		if( this._coordAtlas )
		for( var i = 0 ; i< this._coordAtlas.length ; i ++ )
			if( this._coordAtlas[ i ].width > m )
				m = this._coordAtlas[ i ].width;
		
		this._bufferWidth = Math.max( x , this._window + m + 1 );
		
		if( this._buffer )
			this._buffer.width = this._bufferWidth;
			
		if( this._occasionalBuffer )
			this._occasionalBuffer.width = this._bufferWidth;
	},
	init:function () {
		
		this._buffer = document.createElement("canvas");
		this._occasionalBuffer = document.createElement("canvas");
		
		
		this._buffer.width = this._bufferWidth;
		this._buffer.height = this._height;
		
		this._occasionalBuffer.width = this._bufferWidth;
		this._occasionalBuffer.height = this._height;
		
		switch( arguments.length ){
			case 3 :
				this.setStruct( arguments[ 2 ] );
			case 2 :
				this.setAtlas( arguments[ 0 ] , arguments[ 1 ] );
			break;
		}
		
	},
	drawWindow:function( x ){
		
		var ctx = this._buffer.getContext("2d");
		
		this._xWindow = x;
		
		// draw the next items
		//for( ; this._upperBoundCurrentlyDrawn < this._struct.length && this._struct[ this._upperBoundCurrentlyDrawn ].r < this._xWindow  ; this._upperBoundCurrentlyDrawn ++ );
		
		for( ; this._upperBoundCurrentlyDrawn < this._struct.length && this._struct[ this._upperBoundCurrentlyDrawn ].l < this._xWindow + this._window ; this._upperBoundCurrentlyDrawn ++ ){
			var j = this._struct[ this._upperBoundCurrentlyDrawn ].indexAtlas;
			
			if( this._struct[ this._upperBoundCurrentlyDrawn ].l - this._xBuffer + this._coordAtlas[ j ].width > this._bufferWidth ){	// the next item will debord from the band
				// return of th e visible window to the begining of the buffer band
				
				var ctx_tmp = this._occasionalBuffer.getContext( "2d" );
				
				var xO = Math.max( 0 , Math.floor( this._xWindow - this._xBuffer ) );
				var width = this._bufferWidth - xO;
				
				if( xO >= 0 && width > 0 )	
					ctx_tmp.drawImage( 	this._buffer , 
								xO ,
								0 ,
								width,
								this._height,
								0 ,
								0 ,
								width ,
								this._height
							);
							
				ctx.clearRect( 0 , 0 , this._bufferWidth  , this._height );
				
				ctx.drawImage( 	this._occasionalBuffer , 0 , 0 );
				
				ctx_tmp.clearRect( 0 , 0 , this._bufferWidth , this._height );
				
				this._cleanBufferWidth = 0;
				
				this._xBuffer = this._xWindow;
			}
			
			ctx.drawImage( 	this._textureAtlas ,
							this._coordAtlas[ j ].x ,
							this._coordAtlas[ j ].y ,
							this._coordAtlas[ j ].width ,
							this._coordAtlas[ j ].height ,
							this._struct[ this._upperBoundCurrentlyDrawn ].l - this._xBuffer,
							this._struct[ this._upperBoundCurrentlyDrawn ].b ,
							this._coordAtlas[ j ].width ,
							this._coordAtlas[ j ].height  
						);
			
			// redraw all the items that have a zindex sup
			this._redrawUpperItem( this._upperBoundCurrentlyDrawn , ctx ,x  );
		}
		
		// clear the previous items
		/*
		if(  this._xWindow - this._xBuffer - this._cleanBufferWidth > 100 ){
			ctx.clearRect( this._cleanBufferWidth , 0 ,  Math.min( this._xWindow - this._xBuffer - this._cleanBufferWidth ) , this._height );
			this._cleanBufferWidth = this._xWindow - this._xBuffer;
		}*/
		
		
	},
	_redrawUpperItem : function( i , ctx , x ){
		
		for( var k = Math.max( i , this._upperBoundCurrentlyDrawn )  ; k >= 0 && this._struct[ k ].r > x ; k -- ){
			if( k == i )
				continue;
			var a = this._struct[ k ],
				b = this._struct[ i ];
			if( 	a.z > b.z 
				&& 	a.l < b.r && b.l < a.r  
				&&  a.b < b.t && b.b < a.t ){ // collision check
				// k need to be redraw
					j = this._struct[ k ].indexAtlas;
					ctx.drawImage( 	this._textureAtlas ,
						this._coordAtlas[ j ].x ,
						this._coordAtlas[ j ].y ,
						this._coordAtlas[ j ].width ,
						this._coordAtlas[ j ].height ,
						this._struct[ k ].l - this._xBuffer,
						this._struct[ k ].b ,
						this._coordAtlas[ j ].width ,
						this._coordAtlas[ j ].height  
					);
						
					this._redrawUpperItem( k  , ctx , x  )
				}
		}
	},
	draw : function( ctx ){
		
		if( ( debugMode = false ) ){
		// draw guide
		
		ctx.drawImage( 	this._buffer , 
						this._xBuffer , 
						-this._buffer.height );
		
		ctx.beginPath();
	        ctx.rect(this._xWindow, -this._buffer.height , this._window, this._buffer.height );
	        ctx.lineWidth = 2;
	        ctx.strokeStyle = 'blue';
	        ctx.stroke();
			
		ctx.beginPath();
	        ctx.rect(this._xBuffer, -this._buffer.height + 2 , this._bufferWidth , this._buffer.height - 4 );
			ctx.lineWidth = 2;
	        ctx.strokeStyle = 'red';
	        ctx.stroke();
		}
		
		var windowOnBuffer = Math.max( 0 , Math.floor( this._xWindow - this._xBuffer ));
		
		var width = Math.min( this._window , this._bufferWidth - windowOnBuffer );
		
		if( width <= 0 || windowOnBuffer < 0 )
			return;
			
		ctx.drawImage( 	this._buffer , 
						windowOnBuffer , 
						0 ,
						width,
						this._buffer.height , 
						this._xWindow , 
						-this._buffer.height , 
						width, 
						this._buffer.height );
						
	},
	setAtlas:function( img , coordAtlas ){
		
		this._textureAtlas = img;
		
		this._coordAtlas = coordAtlas;
		
		this.setBufferWidth( this._bufferWidth );
	},
	setStruct:function( struct ){
		
		this._struct = struct;
		
	},
	cutEntity : function( maxw ){
		
		var nstruct = [];
		var ncoordAtlas = [];
		
		var table = new Array( this._coordAtlas.length );
		
		// cut the entity in the atlas
		var coordP , coordB;
		for( var i = 0 ; i < this._coordAtlas.length ; i ++ ){
			coordP = { 
				x : this._coordAtlas[ i ].x,
				y : this._coordAtlas[ i ].y,
				width : this._coordAtlas[ i ].width,
				height : this._coordAtlas[ i ].height
			};
			table[ i ] = [];
			while( coordP.width > maxw ){
				coordB = {
					width : maxw,
					x : coordP.x,
					height : coordP.height,
					y : coordP.y
				};
				table[ i ].push( ncoordAtlas.length );
				ncoordAtlas.push( coordB );
				
				coordP.x += maxw;
				coordP.width -= maxw;
			}
			table[ i ].push(  ncoordAtlas.length );
			ncoordAtlas.push( coordP );
		}
		
		// update the struct
		var structP , structB,
			c_l , k;
		for( var i = 0 ; i < this._struct.length ; i ++ ){
			structP = this._struct[ i ];
			c_l = structP.l;
			for( var j = 0 ; j < table[ structP.indexAtlas ].length ; j ++ ){
				k = table[ structP.indexAtlas ][ j ];
				nstruct.push( {
					l : c_l,
					r : ( c_l += ncoordAtlas[ k ].width ),
					t : structP.t,
					b : structP.b,
					z : structP.z,
					indexAtlas : k 
				} );
			}
		}
		nstruct = nstruct.sort( function(a,b){ 
			if( a.l != b.l )
				return a.l-b.l;
			else
				return a.z-b.z;
			} );
			
		this._struct = nstruct;
		this._coordAtlas = ncoordAtlas;
	},
});

/**
* child class, perform a check every x second, calculate the move relative to the second parent, call drawWindow
*
*/
var AutoDefilDecor = DefilDecor.extend({
	_prevX : null,
	ctor : function(){
		this._super();
	},
	init:function(){
	
		DefilDecor.prototype.init.apply( this , arguments );
		
		this.schedule( this.checkForMove , 1/50 );
		
		this._prevX = this.getPositionX();
	},
	checkForMove : function(){
		
		var p = this.getParent();
		var x = this.getPositionX() + p.getPositionX();
		
		this.drawWindow( Math.floor( - x / this.getScaleX() ) );
	}
	
})


var MaxRunner = ReactiveNode.extend({
	_keyDown : { up : false , right : false },
	_animations : { run : null , jumpIn : null, jumpOff : null , jumpOn : null , caught : null },
	_state : null,
	_sp : null,
	_path : null,
	_pitfall : null,				// pas de chevauchement !
	_x : 0,
	_vitesse : 20,
	_cursorPath : 0,
	_cursorPitfall : 0,
	_jump : {  a : 0 , h : 0 , o : 0  , apogeB : 0 , charge : 0 , emitter : null , falling : false},
	_climb : {  remaining : 0 , step : 0 },
	_jumpHeightAfterHurt : 0,
	_bar : null,
	ctor : function(){
		this._super();
	},
	initAnimation : function(){
		
		this._sp = cc.Sprite.createWithTexture( mse.src.getSrc( "maxSp" ) , new cc.Rect(0,0,1,1)  );
		this.addChild( this._sp );
		
		//run
		var frames = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		for( var i = 0 ; i < 10 ; i ++ )
			frames.addFrameWithTexture( img , new cc.Rect( 0 + i * 100 , 0 , 100 , 90 ) );
		this._animations.run = cc.RepeatForever.create( cc.Animate.create( 0.3 , frames , false) );
		
		//jump
		var frames = cc.Animation.create();
		for( var i = 0 ; i < 2 ; i ++ )
			frames.addFrameWithTexture( img , new cc.Rect( 3*80 + i * 80 , 90 , 80 , 90 ) );
		this._animations.jumpIn = cc.Repeat.create( cc.Animate.create( 0.1 , frames , false) , 10 );
		
		var frames = cc.Animation.create();
		for( var i = 0 ; i < 3 ; i ++ )
			frames.addFrameWithTexture( img , new cc.Rect( i * 80 , 90 , 80 , 90 ) );
		this._animations.jumpOn = cc.Sequence.create( cc.Animate.create( 0 , frames , false) , this._animations.jumpIn );
		
		this._animations.jumpOff = this._animations.jumpIn;
		
		//hurt
		var frames = cc.Animation.create();
		for( var i = 0 ; i < 7 ; i ++ )
			frames.addFrameWithTexture( img , new cc.Rect( i * 90 , 180 , 90 , 90 ) );
		this._animations.hurt = cc.Sequence.create( cc.Animate.create( 0.25 , frames , false ) , this._animations.run );
		
		var frames = cc.Animation.create();
		for( var i = 2 ; i < 5 ; i ++ )
			frames.addFrameWithTexture( img , new cc.Rect( i * 90 , 180 , 90 , 90 ) );
		frames.addFrameWithTexture( img , new cc.Rect( 530 , 270 , 100 , 90 ) );
		frames.addFrameWithTexture( img , new cc.Rect( 630 , 270 , 100 , 90 ) );
		frames.addFrameWithTexture( img , new cc.Rect( 730 , 270 , 100 , 90 ) );
		
		this._animations.seriouslyHurt = cc.Sequence.create( cc.Animate.create( 0.2 , frames , false ) );
		
		//climb
		var frames = cc.Animation.create();
		for( var i = 0 ; i < 6 ; i ++ );
			frames.addFrameWithTexture( img , new cc.Rect( 0 * 40 , 270 , 40 , 110 ) );
			frames.addFrameWithTexture( img , new cc.Rect( 2 * 40 , 270 , 40 , 110 ) );
		this._animations.climb = cc.Animate.create( 0.01 , frames , false);
		
		//caught
		var frames1 = cc.Animation.create();
		var frames2 = cc.Animation.create();
		frames1.addFrameWithTexture( img , new cc.Rect( 0 , 380 , 40 , 100 ) );
		for( var i = 0 ; i < 3 ; i ++ )
			frames2.addFrameWithTexture( img , new cc.Rect( i * 40 , 380 , 40 , 100 ) );
		this._animations.caught = cc.Sequence.create( cc.Animate.create( 1 , frames1 , false ) , cc.Animate.create( 0.5 , frames2 , false ) );
		
		// outOfBox
		var frames = cc.Animation.create();
		frames.addFrameWithTexture( img , new cc.Rect( 540 , 180 , 150 , 120 ) );
		this._animations.outOfBox = cc.Animate.create( 0.01 , frames , false );
		
		
		/*
		// run
		var run = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		for( var i = 0 ; i < 4 ; i ++ )
			run.addFrameWithTexture( img , new cc.Rect( 170 + i * 32 , 1 , 32 , 42 ) );
		this._animations.run = cc.RepeatForever.create( cc.Animate.create( 0.1 , run , false) );
		
		//jump
		var jumpIn = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		for( var i = 4 ; i < 6 ; i ++ )
			jumpIn.addFrameWithTexture( img , new cc.Rect( 1 + i * 31 , 188 , 31 , 50 ) );
		this._animations.jumpIn = cc.RepeatForever.create( cc.Animate.create( 0.4 , jumpIn , false) );
		
		var jumpOn = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		for( var i = 0 ; i < 5 ; i ++ )
			jumpOn.addFrameWithTexture( img , new cc.Rect( 1 + i * 31 , 188 , 31 , 50 ) );
		this._animations.jumpOn = cc.Sequence.create( cc.Animate.create( 0.2 , jumpOn , false) , cc.Repeat.create( cc.Animate.create( 0.2 , jumpIn , false) , 5 )   );
		
		var jumpOff = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		for( var i = 5 ; i < 9 ; i ++ )
			jumpOff.addFrameWithTexture( img , new cc.Rect( 1 + i * 31 , 188 , 31 , 50 ) );
		this._animations.jumpOff = cc.Animate.create( 0.1 , jumpOff , false);
		
		var hurt = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		hurt.addFrameWithTexture( img , new cc.Rect( 29 , 138 , 26 , 38 ) );
		this._animations.hurt = cc.Animate.create( 0.1 , hurt , false);
		
		var climb = cc.Animation.create();
		var img = mse.src.getSrc( "maxSp" );
		climb.addFrameWithTexture( img , new cc.Rect( 229 , 137 , 31 , 41 ) );
		this._animations.climb = cc.Animate.create( 0.1 , climb , false);
		
		
		this._animations.outOfBox = cc.Animate.create( 0.1 , climb , false);
		*/
		this._sp.setScale( 1 , 1 );
		this._sp.setAnchorPoint( cc.PointMake( 0.5 , 0 ) );
		this._sp.setPositionY( 20 );
		
		
	},
	setState : function( s , compl ){
		
		if( this._state == "hurt" || this._state == "outOfBox" || this._state == "seriouslyHurt"  )
			this._vitesse = 20;
			
		if( Object.keys( this._animations ).indexOf( s ) != -1 ){
			// this state has an associate animation
			this._sp.stopAllActions();
			this._sp.runAction( this._animations[ s ] );
		}
		
		switch( s ){
			case "run" :
				if( this._keyDown.up ){
					this.setState( "chargeJump");
					return;
				}
			break;
			
			case "hurt" :
					this._vitesse = 0;
					var self = this;
					var anim = cc.Sequence.create( 	cc.DelayTime.create( 0.2 ) ,
											cc.CallFunc.create(this , function(){ 
													if( compl != null ){
														self.setState( "chargeJump" );
														self.setPositionY( self.getPositionY() + compl );
														self.setPositionX( self.getPositionX() - 20 );
														self.jump();
														self.setPositionY( self.getPositionY() - compl*0.5 );
														self.setPositionX( self.getPositionX() + 20 - this._vitesse );
														this._x -= this._vitesse;
													} else {
														self.setState( "run" );
													}
											} , true )
										);
					this._sp.runAction( anim );
			break;
			
			case "chargeJump" :
				this._jump.charge = 0;
				this.schedule( this.chargeJump , 1/20 );
			break;
			
			case "outOfBox" :
					this._vitesse = 10;
					
					
					var self = this;
					var anim = cc.Sequence.create( 	cc.DelayTime.create( 0 ) ,
											cc.EaseExponentialOut.create( cc.MoveBy.create( 0.2 , cc.PointMake( 0 , 27 ) ) ),
											cc.DelayTime.create( 0.2 ) ,
											cc.MoveBy.create( 0.1 , cc.PointMake( 0 , -27 ) ),
											cc.DelayTime.create( 0 ) ,
											cc.CallFunc.create(this , function(){ 
													self.setState( "chargeJump" );
													self.setPositionY( self.getPositionY() + 20 );
													self.jump();
											} , true )
										);
					this._sp.runAction( anim );
			break;
			case "backFromDeath" :
					this._vitesse = 0;
					
					var self = this;
					var anim = cc.Sequence.create( 	cc.DelayTime.create( 0.2 ) ,
											cc.CallFunc.create(this , function(){ 
												self._vitesse = 20;
												self.setState( "run" );
											} , true )
										);
					this.runAction( anim );
			break;
			case "seriouslyHurt" :
					this._vitesse = 20;
					
					
					var self = this;
					var anim = cc.Sequence.create( 	cc.DelayTime.create( 0.2 ) ,
											cc.CallFunc.create(this , function(){ 
													self._vitesse = 0;
											} , true ),
											cc.DelayTime.create( 1 ) ,
											cc.CallFunc.create(this , function(){ 
													self.setState( "chargeJump" );
													self.jump();
											} , true )
										);
					this._sp.runAction( anim );
			break;
			
			case "caught" :
				
				this._vitesse = 0;
				
			break;
		}
		
		if( this._bar )
			this._bar.updateMaxState( s );
		
		this._state = s;
	},
	initPath : function(){
	
		var floor = -60;
		if( true ){
		this._path = [ 	cc.PointMake( -100 , floor),
		
						cc.PointMake( 7000 , floor),
						cc.PointMake( 7001 , 500 ),
						cc.PointMake( 7100 , 518 ),
						cc.PointMake( 7470 , 518 ),
						cc.PointMake( 7570 , 500 ),
						cc.PointMake( 7571 , -400 ),
						cc.PointMake( 7600 , -400 ),
						cc.PointMake( 7601 , 570 ),
						cc.PointMake( 7700 , 610 ),
						cc.PointMake( 8180 , 610 ),
						cc.PointMake( 8270 , 570 ),
						cc.PointMake( 8271 , -400 ),
						cc.PointMake( 8300 , -400 ),
						cc.PointMake( 8301 , 540 ),
						cc.PointMake( 8420 , 580 ),
						cc.PointMake( 9090 , 580 ),
						cc.PointMake( 9200 , 540 ),
						cc.PointMake( 9320 , 570 ),
						cc.PointMake( 9970 , 570 ),
						cc.PointMake( 10090 , 560 ),
						cc.PointMake( 10091 , -400 ),
						cc.PointMake( 10300 , -400 ),
						cc.PointMake( 10301 , 585 ),
						cc.PointMake( 10425 , 610 ),
						cc.PointMake( 10725 , 610 ),
						cc.PointMake( 10860 , 585 ),
						cc.PointMake( 10861 , 550 ),
						cc.PointMake( 10881 , 550 ),
						cc.PointMake( 11000 , 570 ),
						cc.PointMake( 11650 , 570 ),
						cc.PointMake( 11766 , 545 ),
						cc.PointMake( 11767 , -400 ),
						cc.PointMake( 12005 , -400 ),
						cc.PointMake( 12006 , 475 ),
						cc.PointMake( 12120 , 490 ),
						cc.PointMake( 12760 , 490 ),
						cc.PointMake( 12900 , 475 ),
						cc.PointMake( 12901 , floor),
						
						
						cc.PointMake( 19875 , floor),
						cc.PointMake( 19876 , 480 ),
						cc.PointMake( 20000 , 500 ),
						cc.PointMake( 20310 , 500 ),
						cc.PointMake( 20440 , 480 ),
						cc.PointMake( 20450 , 480 ),
						cc.PointMake( 20500 , 520 ),
						cc.PointMake( 21080 , 520 ),
						cc.PointMake( 21125 , 480 ),
						cc.PointMake( 21126 , -400 ),
						cc.PointMake( 21180 , -400 ),
						cc.PointMake( 21181 , 560 ),
						cc.PointMake( 21281 , 590 ),
						cc.PointMake( 21980 , 590 ),
						cc.PointMake( 22080 , 560 ),
						cc.PointMake( 22081 , 520 ),
						cc.PointMake( 22100 , 520 ),
						cc.PointMake( 22200 , 550 ),
						cc.PointMake( 22900 , 550 ),
						cc.PointMake( 23009 , 520 ),
						cc.PointMake( 23010 , -400 ),
						cc.PointMake( 23160 , -400 ),
						cc.PointMake( 23161 , 510 ),
						cc.PointMake( 23210 , 550 ),
						cc.PointMake( 23780 , 550 ),
						cc.PointMake( 23835 , 510 ),
						cc.PointMake( 23836 , -400 ),
						cc.PointMake( 24050 , -400 ),
						cc.PointMake( 24051 , 475 ),
						cc.PointMake( 24151 , 495 ),
						cc.PointMake( 24530 , 495 ),
						cc.PointMake( 24630 , 475 ),
						cc.PointMake( 24640 , 475 ),
						cc.PointMake( 24770 , 500 ),
						cc.PointMake( 25400 , 500 ),
						cc.PointMake( 25530 , 475 ),
						cc.PointMake( 25531 , floor),
					 ];
		this._pitfall = [ 	
			
			{ type : "hurdle" , instant : 3230 , end : 3290 , height : 20 },
			{ type : "hurdle" , instant : 3590 , end : 3660 , height : 20 },
			{ type : "hurdle" , instant : 5700 , end : 5760 , height : 20 },
			{ type : "hurdle" , instant : 6130 , end : 6200 , height : 20 },
			
			{ type : "ladder" , instant : 6970 , end : 7020 , height : 480 },
			
			
			{ type : "hurdle" , instant : 7880 , end : 7935 , height : 50 },
			{ type : "hurdle" , instant : 8505 , end : 8620 , height : 20 },
			{ type : "hurdle" , instant : 8880 , end : 8925 , height : 50 },
			{ type : "hurdle" , instant : 9090 , end : 9120 , height : 40 },
			{ type : "hurdle" , instant : 10930 , end : 11050 , height : 20 },
			{ type : "hurdle" , instant : 11250 , end : 11370 , height : 20 },
			
			{ type : "trashBox" , instant : 13010 , end : 13140 , height : 80},
			{ type : "splashZone" , instant : 13141 , end : 13400 },
			
			
			{ type : "ladder" , instant : 19850 , end : 19890 , height : 480 },
			
			
			{ type : "hurdle" , instant : 21515 , end : 21620 , height : 10 },
			{ type : "hurdle" , instant : 21815 , end : 21920 , height : 10 },
			
			
			
			{ type : "trashBox" , instant : 25640 , end : 25770 , height : 80},
			{ type : "splashZone" , instant : 25771 , end : 26000 },
			
					];
					
		}
		
		var p = this._path,
			pf = this._pitfall;
		var inserRedCar = function( x ){
			p.push( cc.PointMake( x , floor) )
			p.push( cc.PointMake( x+1 , -5 )  )
			p.push( cc.PointMake( x +30 , 10 ))
			p.push( cc.PointMake( x +80, 10 ))
			p.push( cc.PointMake( x +120, -8 ))
			p.push( cc.PointMake( x +170, -20 ))
			p.push( cc.PointMake( x +171, floor))
			
			pf.push( { type : "hurdle" , instant : x - 50 , end : x , height : 20   , jumpHeight : 0} );
		}
		var inserGreenCar = function( x ){
			p.push( cc.PointMake( x , floor) )
			p.push( cc.PointMake( x+1 , -5 )  )
			p.push( cc.PointMake( x +30 , 10 ))
			p.push( cc.PointMake( x +80, 10 ))
			p.push( cc.PointMake( x +120, -8 ))
			p.push( cc.PointMake( x +170, -20 ))
			p.push( cc.PointMake( x +171, floor))
			
			pf.push( { type : "hurdle" , instant : x - 50 , end : x , height : 20   , jumpHeight : 0} );
		}
		var inserVan = function( x ){
			p.push( cc.PointMake( x , floor) )
			p.push( cc.PointMake( x+1 , 46 )  )
			p.push( cc.PointMake( x +170 , 46 ))
			p.push( cc.PointMake( x +191, floor))
			
			pf.push( { type : "hurdle" , instant: x-55 , end : x -40.1, height : 10   , jumpHeight : 20} );
			pf.push( { type : "hurdle" , instant: x-40 , end : x, height : 60   , jumpHeight : 50} );
			
		}
	
		inserRedCar( 730  , -40 );
		inserRedCar( 1530 , -40 );
		inserGreenCar( 2130 , -40 );
		inserGreenCar( 2630 , -40 );
		inserGreenCar( 4630 , -40 );
		inserVan( 4870 , -40 );
		inserRedCar( 5180 , -40 );
		inserRedCar( 13630 , -40 );
		inserRedCar( 14030 , -40 );
		inserRedCar( 14430 , -40 );
		inserRedCar( 15130 , -40 );
		inserRedCar( 16130 , -40 );
		inserRedCar( 16530 , -40 );
		inserRedCar( 18530 , -40 );
		inserRedCar( 18830 , -40 );
		inserRedCar( 19080 , -40 );
		inserVan( 16790 , -40 );
		inserVan( 17090 , -40 );
		inserVan( 17890 , -40 );
		
		this._path = this._path.sort( function(a,b){ 
			return a.x-b.x;
		} );
		this._pitfall = this._pitfall.sort( function(a,b){ 
			return a.instant-b.instant;
		} );
	},
	init : function(){
		// attach event
		this.addListener( 
			"keydown" , 
			new mse.Callback( this.reactionKeydown , this ),
			false
		);
		
		this.addListener( 
			"keyup" , 
			new mse.Callback( this.reactionKeyup , this ),
			false
		);
		this.schedule( this.run , 1/50 );
		
		
		this.initAnimation();
		this.initPath();
		
		
		
		this.setState( "run" );
	},
	run : function( ){
		
		// whatever happens next , update the bar
		if( this._bar )
			this._bar.run( this._x );
		
		// action performed by touch pressing
		if( this._state == "climb" )
			return;
		
		var y , yAir , yfloor;
		
		this._x += this._vitesse;
		
		for( ; this._cursorPath < this._path.length && this._path[ this._cursorPath ].x < this._x ; this._cursorPath ++ ); 
		
		// follow the path
		if( this._cursorPath >= this._path.length )
			// if the cursor is beyond the path, continue straight from the last position ( this will never happend )
			yfloor = this._path[ this._cursorPath -1].y;
		else {
			// interpolation between two points of the path
			var a = this._path[ this._cursorPath -1],
				b = this._path[ this._cursorPath  ];
			yfloor = a.y + ( this._x - a.x ) / ( b.x - a.x ) * ( b.y - a.y );
		}
		
		// if on air, follow the parabolloid, check for landing
		if( this._state == "jumpOn" || this._state == "jumpOff"  ){
			
			// y = h + a *( x - o )²
			var tm = this._x - this._jump.o ;
			
			yAir = this._jump.h - this._jump.a * tm * tm;
			
			// linear if too sharp
			if( Math.abs( yAir - this.getPositionY() ) > 50 )
				if( yAir > this.getPositionY() )
					yAir = this.getPositionY() + 50;
				else
					yAir = this.getPositionY() - 50;
			
			// if he lands
			if( yAir < yfloor ){
				// fall condition, if there is a cliff behind him, and if he comes to line from the horizontal axis ( he was not up the line the previous frame )
				if( this._jump.falling || ( this._cursorPath > 1 &&  this._path[ this._cursorPath -2].y < -60 && yfloor - yAir > 50 && this.getPositionX() < this._path[ this._cursorPath -1].x )  ){
					// he failed, there is no roof behind his feet
					this.setPositionY( yAir );
					this._jump.falling = true;
					if( yAir < - 300 ){
						this.setPositionY( 600 );
						this._x = this.getPositionX();
						this._jump.falling = false;
						this.setState( "backFromDeath" );
					}
					return;
				}
				this.setState( "run" );
				y = yfloor;
			} else
				y = yAir;
				
			// change the state if he is at the apoge
			if( ( this._state == "jumpOn"  ) && this._x > this._jump.apogeB )
				this.setState( "jumpOff" );
		}
		else
		
		// smooth the fall
		if( this.getPositionY() - yfloor  > 30 ){
			
			if( this._state == "hurt" ){
				y = yfloor;
			} else{
				// fall
				var a = 0  ,
				 h = this.getPositionY() ,
				 o = this.getPositionX() ;
				 
				// point of falling
				var fy = this.getPositionY() + 130,
				 fx = this.getPositionX() + 80;
				 
				 a = ( fy - h ) / ( ( fx - o ) * ( fx - o  ) );
				 
				this._jump.a = a;
				this._jump.h = h;
				this._jump.o = o;
				
				this.setState( "jumpOff" );
				
				y = this.getPositionY();
			}
		}
		else
			y = yfloor;
		
		
		// check for pitfall
		for( ; this._cursorPitfall < this._pitfall.length && this._pitfall[ this._cursorPitfall ].end < this._x ; this._cursorPitfall ++ );
		
		if( this._cursorPitfall < this._pitfall.length && this._pitfall[ this._cursorPitfall ].instant < this._x ){
		
			var pitfall = this._pitfall[ this._cursorPitfall ];
				
			switch( pitfall.type ){
				case "hurdle" :
					if( this.getPositionY() - yfloor < pitfall.height ){
						// the obstacle is not passed properly
						
						this.setState( "hurt" , pitfall.jumpHeight );	
						
						this._cursorPitfall ++;
					}
				break;
				case "ladder" :
					this.setState( "climb" );
					
					var h = pitfall.height + yfloor - y;
					
					this._climb.remaining = Math.ceil( h / 20 );
					this._climb.step = h / this._climb.remaining;
					
					this._x = ( this._pitfall[ this._cursorPitfall ].instant + this._pitfall[ this._cursorPitfall ].end )/2;
					
					this._cursorPitfall ++;
				break;
				case "trashBox" :
					if( this.getPositionY() - yfloor < pitfall.height ){
						
						this.setState( "outOfBox" );
						
						this._cursorPitfall ++;
					}
				break;
				case "splashZone" :
					if(  yAir < yfloor && this._jump.h > yfloor + 400 ){
						
						this.setState( "seriouslyHurt" );
						
						this._cursorPitfall ++;
					}
					
				break;
			}
		}
		
		this.setPositionX( this._x );
		this.setPositionY( y );
	},
	reactionKeydown_ : function( e ){
		switch( e.keyCode ){
			case 38 : // up 
				this.setPositionY( this.getPositionY() + 10 );
			break;
			case 40 : // down
				this.setPositionY( this.getPositionY() - 10 );
			break;
			case 39 : // right
				this.setPositionX( this.getPositionX() + 10 );
			break;
			case 37 : // left
				this.setPositionX( this.getPositionX() - 10 );
			break;
			default:
				return;
		}
	},
	chargeJump : function(){
	
		if( this._state != "chargeJump" ){
			this.unschedule( this.chargeJump );
			if( this._jump.emitter && this._jump.emitter.getParent() )
				this._jump.emitter.stopSystem();
			return;
		}
		
		var ncharge = Math.min( this._jump.charge + 0.3 , 1 );
		
		var lvlcharge = Math.floor( ncharge );
		
		// particule
		if( this._jump.charge == 0 || lvlcharge != Math.floor( this._jump.charge ) ){
			switch( lvlcharge ){
				case 0 :
					// initialise if its not
					if( !this._jump.emitter ){
						this._jump.emitter = cc.ParticleMeteor.create();
						
						this._jump.emitter.setPosition( cc.PointMake( 0 , 30 ) );
						this._jump.emitter.setPosVar( cc.PointMake( 10 , 0 ) );
						//this._jump.emitter.setTotalParticles( 100 );
						this._jump.emitter.setEmissionRate( 40 );
						
						this._jump.emitter.setEndSize( 10 );
						this._jump.emitter.setEndSizeVar( 10 );
						
						
						this._jump.emitter.setLife( 0.4 );
						this._jump.emitter.setLifeVar( 0.05 );
						
						this._jump.emitter.setEmitterMode( cc.CCPARTICLE_MODE_GRAVITY );
						this._jump.emitter.setGravity( cc.PointMake( 0 , 0 ) );
						this._jump.emitter.setSpeed( 400 );
						this._jump.emitter.setSpeedVar( 100 );
						this._jump.emitter.setAngle( 160 );
						this._jump.emitter.setAngleVar( 10 );
						
						this._jump.emitter.setIsAutoRemoveOnFinish( true );
						
						this._jump.emitter.setPositionType( cc.CCPARTICLE_TYPE_FREE );
					}
					// attach if its not
					if( !this._jump.emitter.getParent() )
						this.addChild( this._jump.emitter );
					// reset the particule emission
					this._jump.emitter.resetSystem();
					
					this._jump.emitter.setEndSize( 1 );
					this._jump.emitter.setEndSizeVar( 2 );
					this._jump.emitter.setStartSize( 20 );
					this._jump.emitter.setStartSizeVar( 3 );
					this._jump.emitter.setLife( 0.2 );
					this._jump.emitter.setStartColor( new cc.Color4F( 0.2 , 0.2 , 0.2 , 1 ) );
				break;
				case 1 :
					this._jump.emitter.setEndSize( 20 );
					this._jump.emitter.setEndSizeVar( 10 );
					this._jump.emitter.setStartSize( 50 );
					this._jump.emitter.setStartSizeVar( 7 );
					this._jump.emitter.setLife( 0.25 );
					this._jump.emitter.setStartColor( new cc.Color4F( 0.3 , 0.4 , 0.9 , 1 ) );
				break;
			}
			
		}
		
		this._jump.charge = ncharge;
		
	},
	reactionKeydown : function( e ){
		switch( e.keyCode ){
			case 38 : // up 
				if( this._keyDown.up  )
					break;
				this._keyDown.up = true;
				
				if( this._state == "run" )
					this.setState( "chargeJump" );
			break;
			
			case 40 : // down
				
			case 39 : // right
				
			case 37 : // left
			
			break;
			default:
				return;
		}
	},
	reactionKeyup : function( e ){
		switch( e.keyCode ){
			case 38 : // up 
				this._keyDown.up = false;
				if( this._state == "chargeJump" )
					this.jump();
				if( this._state == "climb" )
					this.climb();
					
				// whatever the state is, stop the particule if its running
				if( this._jump.emitter && this._jump.emitter.getParent() )
					this._jump.emitter.stopSystem();
			break;
			case 40 : // down
				
			break;
			case 39 : // right
			
			break;
			case 37 : // left
				
			break;
			default:
				return;
		}
	},
	climb : function(){
		
		if( this._state != "climb" )
			return;
		
		
		this._sp.stopAllActions();
		this._sp.runAction( this._animations.climb );
		
		this.setPositionY( this.getPositionY() + this._climb.step );
		this._climb.remaining --;
		if( this._climb.remaining <= 0 ){
			// top of the ladder
			this._climb.onLadder = false;
			this.setPositionY( this.getPositionY() + 60 );
			this.setState( "run" );
		}
		return;
		
	},
	jump : function(){
		// forbidden in several state
		if( this._state != "chargeJump" )
			return;
		
		var lvlcharge = Math.floor( this._jump.charge );
		
		var jheight = 90 + lvlcharge * 45;
		var jwidth = 150 + lvlcharge * 100;
		
		
		// y = h + a *( x - o )²
		
		var h = this.getPositionY() + jheight;	// y on the top of the jump
		var o = this.getPositionX() + jwidth/2;	// x on the top of the jump
		
		var a = jheight / ( jwidth * jwidth / 4 );
		
		this._jump.a = a;
		this._jump.h = h;
		this._jump.o = o;
		
		this._jump.apogeB = this.getPositionX() + jwidth * 0.6;
		
		this.setState( "jumpOn" );
	},
	draw : function(){
		
		
	},
	getYAt : function( x ){
		for( var i = 0 ; i < this._path.length && this._path[ i ].x < x ; i ++ ); 
		
		// follow the path
		if( i >= this._path.length )
			// if the cursor is beyond the path, continue straight from the last position ( this will never happend )
			return this._path[ this._path.length -1 ].y;
		else {
			// interpolation between two points of the path
			var a = this._path[ i -1],
				b = this._path[ i  ];
			return a.y + ( x - a.x ) / ( b.x - a.x ) * ( b.y - a.y );
		}
	},
	getPathNode : function(){
		
		var node = cc.Node.create();
		
		node._path = this._path;
		node._pitfall = this._pitfall;
		
		node.draw = function( ctx ){
			
			ctx.beginPath();
			ctx.moveTo( this._path[ 0 ].x , -this._path[ 0 ].y );
			for( var i = 1 ; i < this._path.length ; i ++ )
				ctx.lineTo( this._path[ i ].x , -this._path[ i ].y );
			ctx.strokeStyle = "#ff0000";
			ctx.lineWidth = 3;
			ctx.stroke();
			
			for( var i = 0 ; i < this._pitfall.length ; i ++ ){
				var pifall = this._pitfall[ i ];
				
				switch( pifall.type ){
					case "hurdle" :
					
						ctx.beginPath();
				        ctx.rect( pifall.instant , -500 ,  pifall.end - pifall.instant ,  pifall.height);
				        ctx.rect( pifall.instant , 0 ,  pifall.end - pifall.instant ,  pifall.height);
				        ctx.fillStyle = '#8ED6FF';
				        ctx.fill();
					break;
					case "ladder" :
					
						ctx.beginPath();
				        ctx.rect( pifall.instant , - pifall.height ,  pifall.end - pifall.instant +10 ,  pifall.height);
				        ctx.fillStyle = '#6AB3C6';
				        ctx.fill();
					break;
					case "trashBox" :
					
						ctx.beginPath();
				        ctx.rect( pifall.instant , - pifall.height ,  pifall.end - pifall.instant +10 ,  pifall.height);
				        ctx.fillStyle = '#67231A';
				        ctx.fill();
					break;
				}
			}
		};
		
		return node;
	}
});

var DecorLayer = cc.Layer.extend({
	hero : null,
	_sceneHeight : 1200,
	_sceneWidth : 28500,
	_sceneWindowMax : 1300,
	_frameWidth : 800,
	_frameHeight : 400,
	_parallaxLayer : null,
	_animationLayer : null,
	_animations : null,
	_cursorAnimation : 0,
	_ratioSky : 0.1,
	_ratioBack : 0.4,
	_policeman : null,
	lose : function(){
		this.hero.setState( "caught" );
		
		this._parallaxLayer.getChildByTag( "hero" ).addChild( this._policeman );
		
		var x = this.hero.getPositionX() - 70,
			y = 0;
		for( ; Math.abs( this.hero.getPositionY() - ( y = this.hero.getYAt( x ) ) ) > 80 ; x += 10 );
		
		this._policeman.setPositionX( x );
		this._policeman.setScaleY( 1 );
		this._policeman.setPositionY( y +70  );
		
		
		var lightScreen = cc.Node.create();
		lightScreen.gyro = new GyroLight();
		lightScreen.gyro.setPeriod( 70 );
		lightScreen.gyro.sett( 25 );
		lightScreen._t = 0;
		lightScreen.schedule( function(){ 
			this.gyro.tick();
			this._t ++;
		} , 1/50 );
		lightScreen.draw = function( context ){
			
			
			
			var y0  = Math.sin( ( this._t % 50 )/50 * 6.28 ), 
				y1 = Math.sin( ( this._t % 40 )/40 * 6.28 ), 
				y2 = Math.sin( ( this._t % 28 )/28 * 6.28 ), 
				y3 = Math.sin( ( this._t % 19 )/19 * 6.28 );
			
			context.save();
			
			context.fillStyle = this.gyro.getColor();
			
			if( this._t < 20 )
				context.globalAlpha = 0.4;
			else
				context.globalAlpha = Math.max( 0.15 , 0.4 * 20/( this._t*2 - 20 ) );
			
			context.beginPath();
			context.arc( y0 * 100 + 400 , -( y1 * 10 + 300 ), y3  * 50 + 270 , 0 , Math.PI*2 );
			context.closePath();
			context.fill();
			
			context.beginPath();
			context.arc( y2 * 50 + 380 , -( y1 * 50 + 200 ), y0  * 50 + 270 , 0 , Math.PI*2 );
			context.closePath();
			context.fill();
			
			context.beginPath();
			context.arc( y1 * 30 + 250 , -( y2 * 30 + 100 ), y1  * 50 + 280 , 0 , Math.PI*2 );
			context.closePath();
			context.fill();
			
			context.beginPath();
			context.arc( y0 * 60 + 50 , -( y0 * 60 + 50 ), y1  * 40 + 280 , 0 , Math.PI*2 );
			context.closePath();
			context.fill();
			
			context.restore();
			
			
		}
		this.addChild( lightScreen );
		
		
		var light = this._parallaxLayer.getChildByTag( "light" );
		light.stopAllActions();
		light.draw = function(){};
		
		var delay = cc.Sequence.create( 	cc.DelayTime.create( 2 ) ,
											cc.CallFunc.create(this , function(){ 
													lose();
											} , true )
										);
		this.runAction( delay );
	},
	win : function(){
		this.hero.setState( "caught" );
		win();
	},
	initDecor:function(){
		if( true ){
		var hfloor = 1150;
		
		// premier plan
		var decorBand = new AutoDefilDecor();
		var texture = mse.src.getSrc( "decor" );
		var coordAtlasDecor = [ 	{ x : 0 , y : 0 , width : 367 , height : 427 },			//house					0
									{ x : 374 , y : 0 , width : 583  , height : 427 },		//house					1
									{ x : 963 , y : 294 , width : 529 , height : 134 },		//green hurdle				2
									{ x : 1524 , y : 0 , width : 871 , height : 427 },		// long house "chez gilbert"		3
									{ x : 2436 , y : 0 , width : 521 , height : 427 },		// house					4
									{ x : 3015 , y : 0 , width : 393 , height : 427 },		// house					5
									{ x : 3462 , y : 0 , width : 475 , height : 427 },		// building foot				6
									// roofed
									{ x : 0 , y : 430 , width : 475 , height : 880 },		// building 					7
									{ x : 489 , y : 735 , width : 562 , height : 565 },		// house without ladder			8
									{ x : 480 , y : 735 , width : 573 , height : 565 },		// house with ladder			9
									{ x : 1069 , y : 724 , width : 675 , height : 586 },	// house 					10
									{ x : 1746 , y : 754 , width : 905 , height : 555 },	// house					11
									// obstacle sol
									{ x : 2843 , y : 486 , width : 205 , height : 80 },		// green car				12
									{ x : 3049 , y : 494 , width : 205 , height : 72 },		// red car					13
									{ x : 3252 , y : 466 , width : 341 , height : 95 },		// dirt hill with panel			14
									{ x : 3300 , y : 514 , width : 291 , height : 49 },		// dirt hill without panel			15
									{ x : 3594 , y : 453 , width : 238 , height : 110 },	// van					16
									{ x : 3831 , y : 474 , width : 109 , height : 82 },		// trach box				17
									// obstacle roof
									{ x : 2842 , y : 591 , width : 23 , height : 71 },		// 						18
									{ x : 2866 , y : 613 , width : 127 , height : 47 },		// 						19
									{ x : 2994 , y : 574 , width : 50 , height : 90 },		// 						20
									
									// halo
									{ x : 2843 , y : 707 , width : 205 , height : 80 },		// car					21
									{ x : 3049 , y : 716 , width : 205 , height : 72 },		// car					22
									{ x : 3252 , y : 685 , width : 341 , height : 95 },		// dirt paneled				23
									{ x : 3300 , y : 685+48 , width : 291 , height : 49 },	// dirt panelless				24
									{ x : 3594 , y : 678 , width : 238 , height : 110 },	// van					25
									{ x : 3831 , y : 696 , width : 109 , height : 82 },		// trash box					26
									
									
									
									{ x : 2842 , y : 812 , width : 23 , height : 71 },		// 						27
									{ x : 2866 , y : 833 , width : 127 , height : 47 },		// 						28
									{ x : 2994 , y : 793 , width : 50 , height : 90 },		// 						29
									
									{ x : 2759 , y : 771 , width : 11 , height : 541 },		// ladder					30
									
									
						];
		
		// mise a l'echelle
		for( var i = 0 ; i < coordAtlasDecor.length ; i ++ ){
			coordAtlasDecor[ i ].x = coordAtlasDecor[ i ].x/2;
			coordAtlasDecor[ i ].y = coordAtlasDecor[ i ].y/2;
			coordAtlasDecor[ i ].width = coordAtlasDecor[ i ].width/2;
			coordAtlasDecor[ i ].height = coordAtlasDecor[ i ].height/2;
		}

		hfloor -= 400;
		var structHouses = [ 	
			{ indexAtlas : 0 , l : -10 , b : null , r : null , t  : hfloor - 5 , z : 0 } ,
			{ indexAtlas : 1 , l : 400 , b : null , r : null , t  : hfloor , z : 0 } ,
			{ indexAtlas : 2 , l : 952 , b : null , r : null , t  : hfloor - 10, z : -1} ,
			{ indexAtlas : 4 , l : 1450 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 5 , l : 2020 , b : null , r : null , t  : hfloor - 5, z : 0} ,
			{ indexAtlas : 0 , l : 2520 , b : null , r : null , t  : hfloor - 5, z : 0} ,
			{ indexAtlas : 3 , l : 3000 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 2 , l : 3872 , b : null , r : null , t  : hfloor - 10, z : -1} ,
			{ indexAtlas : 1 , l : 4280 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 0 , l : 5000 , b : null , r : null , t  : hfloor - 6, z : 0} ,
			{ indexAtlas : 5 , l : 5400 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 11 , l : 5900 , b : null , r : null , t  : hfloor , z : 0} ,
			// roof
			{ indexAtlas : 9 , l : 7000 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 10 , l : 7600 , b : null , r : null , t  : hfloor -80, z : 0} ,
			{ indexAtlas : 11 , l : 8300 , b : null , r : null , t  : hfloor -70, z : 0} ,
			{ indexAtlas : 11 , l : 9200 , b : null , r : null , t  : hfloor -80, z : 0} ,
			{ indexAtlas : 8  , l : 10300 , b : null , r : null , t  : hfloor -80, z : 0} ,
			{ indexAtlas : 11  , l : 10870 , b : null , r : null , t  : hfloor -70, z : 0} ,
			{ indexAtlas : 11  , l : 12000 , b : null , r : null , t  : hfloor , z : 0} ,
			// floor
			{ indexAtlas : 8  , l : 13920 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 2  , l : 14462 , b : null , r : null , t  : hfloor -10, z : -1} ,
			{ indexAtlas : 11  , l : 14900 , b : null , r : null , t  : hfloor , z : 0} ,
			{ indexAtlas : 5  , l : 15900 , b : null , r : null , t  : hfloor -5 , z : 0} ,
			{ indexAtlas : 4  , l : 16400 , b : null , r : null , t  : hfloor -5 , z : 0} ,
			{ indexAtlas : 3  , l : 17085 , b : null , r : null , t  : hfloor  , z : 0} ,
			{ indexAtlas : 0  , l : 17950 , b : null , r : null , t  : hfloor  , z : 0} ,
			{ indexAtlas : 2  , l : 18300 , b : null , r : null , t  : hfloor -10 , z : -1} ,
			{ indexAtlas : 2  , l : 18825 , b : null , r : null , t  : hfloor -10 , z : -1} ,
			{ indexAtlas : 2  , l : 19350 , b : null , r : null , t  : hfloor -10 , z : -1} ,
			// roof
			{ indexAtlas : 9 , l : 19870 , b : null , r : null , t  : hfloor + 20 , z : 0} ,
			{ indexAtlas : 10 , l : 20450 , b : null , r : null , t  : hfloor  , z : 0} ,
			{ indexAtlas : 11 , l : 21180 , b : null , r : null , t  : hfloor -80 , z : 0} ,
			{ indexAtlas : 11 , l : 22100 , b : null , r : null , t  : hfloor -40 , z : 0} ,
			{ indexAtlas : 10 , l : 23160 , b : null , r : null , t  : hfloor -20 , z : 0} ,
			{ indexAtlas : 8 , l : 24050 , b : null , r : null , t  : hfloor + 30  , z : 0} ,
			{ indexAtlas : 11 , l : 24620 , b : null , r : null , t  : hfloor +10  , z : 0} ,
			
			// floor
			{ indexAtlas : 11  , l : 26200 , b : null , r : null , t  : hfloor  , z : 0} ,
			{ indexAtlas : 0  , l : 27110 , b : null , r : null , t  : hfloor  , z : 0} ,
			{ indexAtlas : 2  , l : 27470 , b : null , r : null , t  : hfloor  , z : -2} ,
			{ indexAtlas : 2  , l : 27999 , b : null , r : null , t  : hfloor  , z : -2} ,
			{ indexAtlas : 2  , l : 28528 , b : null , r : null , t  : hfloor  , z : -2} ,
			{ indexAtlas : 2  , l : 29050 , b : null , r : null , t  : hfloor  , z : -2} ,
						];
						
		
		var structObstacle = [ 	
			{ indexAtlas : 13 , l : 700 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13 , l :1500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l :2100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l :2600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 14 , l :3100 , b : null , r : null , t  : hfloor  +35, z : 2 } ,		//
			{ indexAtlas : 15 , l :3500 , b : null , r : null , t  : hfloor  +35, z : 2 } ,		//
			{ indexAtlas : 12 , l :4600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16 , l :4830 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 13 , l :5150 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 15 , l :5600 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 14 , l :6000 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			// roof
			{ indexAtlas : 18 , l :7900 , b : null , r : null , t  : hfloor - 610 , z : 2 } ,	//
			{ indexAtlas : 18 , l :7930 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 19 , l :8500 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 18 , l :8900 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 18 , l :9100 , b : null , r : null , t  : hfloor - 570 , z : 2 } ,	//
			{ indexAtlas : 19 , l :10930 , b : null , r : null , t  : hfloor - 580 , z : 2 } ,	//
			{ indexAtlas : 19 , l :11250 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			// floor
			{ indexAtlas : 17  , l : 13040 , b : null , r : null , t  : hfloor +5 , z : 2} ,
			{ indexAtlas : 13 , l : 13600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13 , l : 14000 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l : 14400 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13 , l : 15100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			
			{ indexAtlas : 12 , l : 16100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l : 16500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16 , l : 16750 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16 , l : 17050 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16 , l : 17850 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13 , l : 18500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l : 18800 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12 , l : 19050 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			// roof
			{ indexAtlas : 19 , l : 21500 , b : null , r : null , t  : hfloor - 600 , z : 2 } ,	//
			{ indexAtlas : 19 , l : 21800 , b : null , r : null , t  : hfloor - 600 , z : 2 } ,	//
			
			// floor
			{ indexAtlas : 17  , l : 25670 , b : null , r : null , t  : hfloor  , z : 2} ,
			];
			
		// fusion
		var struct = [];
		var i = 0 , j = 0;
		for( ; i + j < structObstacle.length + structHouses.length ; ){
			if( i >= structObstacle.length )
				struct.push( structHouses[ j ++ ] );
			else
			if( j >= structHouses.length )
				struct.push( structObstacle[ i ++ ] );
			else
			if( structHouses[ j ].l < structObstacle[ i ].l )
				struct.push( structHouses[ j ++ ] );
			else
				struct.push( structObstacle[ i ++ ] );
		}
		
		
		// mise a l'echelle
		for( var i = 0 ; i < struct.length ; i ++ ){
			struct[ i ].l = struct[ i ].l/2;
			struct[ i ].t = struct[ i ].t/2;
		}
		
		for( var i = 0 ; i < struct.length ; i ++ ){
			if( struct[ i ].l )
				struct[ i ].r = struct[ i ].l + coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			else
				struct[ i ].l = struct[ i ].r - coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			
			if( struct[ i ].b )
				struct[ i ].t = struct[ i ].b + coordAtlasDecor[ struct[ i ].indexAtlas ].height;
			else
				struct[ i ].b = struct[ i ].t - coordAtlasDecor[ struct[ i ].indexAtlas ].height;
		}
		
		decorBand.setWindow( this._sceneWindowMax /2 );
		decorBand.setHeight( this._sceneHeight /2 - 200 );
		decorBand.init( texture , coordAtlasDecor , struct );
		decorBand.cutEntity( 100 );
		decorBand.setBufferWidth( this._sceneWindowMax * 2 / 2 );
		decorBand.setScale( 2, 2 );
		
		
		
		
		//halo
		var structHalo = [ 	
			{ indexAtlas : 13+9 , l : 700 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13+9 , l :1500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l :2100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l :2600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 14+9 , l :3100 , b : null , r : null , t  : hfloor  +35, z : 2 } ,		//
			{ indexAtlas : 15+9 , l :3500 , b : null , r : null , t  : hfloor  +35, z : 2 } ,		//
			{ indexAtlas : 12+9 , l :4600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16+9 , l :4830 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 13+9 , l :5150 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 15+9 , l :5600 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 14+9 , l :6000 , b : null , r : null , t  : hfloor + 35, z : 2 } ,		//
			{ indexAtlas : 30   , l :7000 , b : null , r : null , t  : hfloor     , z : 2 } ,		// ladder
			
			// roof
			{ indexAtlas : 18+9 , l :7900 , b : null , r : null , t  : hfloor - 610 , z : 2 } ,	//
			{ indexAtlas : 18+9 , l :7930 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 19+9 , l :8500 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 18+9 , l :8900 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			{ indexAtlas : 18+9 , l :9100 , b : null , r : null , t  : hfloor - 570 , z : 2 } ,	//
			{ indexAtlas : 19+9 , l :10930 , b : null , r : null , t  : hfloor - 580 , z : 2 } ,	//
			{ indexAtlas : 19+9 , l :11250 , b : null , r : null , t  : hfloor - 590 , z : 2 } ,	//
			// floor
			{ indexAtlas : 17+9 , l : 13040 , b : null , r : null , t  : hfloor +5 , z : 2} ,
			{ indexAtlas : 13+9 , l : 13600 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13+9 , l : 14000 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l : 14400 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13+9 , l : 15100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			
			{ indexAtlas : 12+9 , l : 16100 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l : 16500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16+9 , l : 16750 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16+9 , l : 17050 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 16+9 , l : 17850 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 13+9 , l : 18500 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l : 18800 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 12+9 , l : 19050 , b : null , r : null , t  : hfloor + 40, z : 2 } ,		//
			{ indexAtlas : 30   , l : 19870 , b : null , r : null , t  : hfloor + 20, z : 2 } ,		// ladder
			// roof
			{ indexAtlas : 19+9 , l : 21500 , b : null , r : null , t  : hfloor - 600 , z : 2 } ,	//
			{ indexAtlas : 19+9 , l : 21800 , b : null , r : null , t  : hfloor - 600 , z : 2 } ,	//
			
			// floor
			{ indexAtlas : 17+9  , l : 25670 , b : null , r : null , t  : hfloor  , z : 2} ,
			];
		struct = structHalo;
		// mise a l'echelle
		for( var i = 0 ; i < struct.length ; i ++ ){
			struct[ i ].l = struct[ i ].l/2;
			struct[ i ].t = struct[ i ].t/2;
		}
		
		for( var i = 0 ; i < struct.length ; i ++ ){
			if( struct[ i ].l )
				struct[ i ].r = struct[ i ].l + coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			else
				struct[ i ].l = struct[ i ].r - coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			
			if( struct[ i ].b )
				struct[ i ].t = struct[ i ].b + coordAtlasDecor[ struct[ i ].indexAtlas ].height;
			else
				struct[ i ].b = struct[ i ].t - coordAtlasDecor[ struct[ i ].indexAtlas ].height;
		}
		haloBand = new AutoDefilDecor();
		haloBand.setWindow( this._sceneWindowMax/2 );
		haloBand.setHeight( this._sceneHeight/2 - 200 );
		haloBand.init( texture , coordAtlasDecor , struct );
		haloBand.cutEntity( 100 );
		haloBand.setBufferWidth( this._sceneWindowMax   );
		haloBand.setScale( 2 , 2 );
		haloBand._timer=0;
		haloBand.schedule( function(){ 
			this._timer = ( this._timer -35 + this._window) % this._window; 
		} , 1/50 );
		haloBand.draw = function( ctx ){
			if( ( debugMode = false ) ){
			// draw guide
			
			ctx.drawImage( 	this._buffer , 
							this._xBuffer , 
							-this._buffer.height );
			
			ctx.beginPath();
		        ctx.rect(this._xWindow, -this._buffer.height , this._window, this._buffer.height );
		        ctx.lineWidth = 10;
		        ctx.strokeStyle = 'blue';
		        ctx.stroke();
				
			ctx.beginPath();
		        ctx.rect(this._xBuffer, -this._buffer.height + 20 , this._bufferWidth , this._buffer.height - 40 );
		        ctx.strokeStyle = 'red';
		        ctx.stroke();
			}
		
			for( var i = 0 ; i < 3 ; i ++ ){
				
				var xOnWindow = ( this._timer + i * this._window / 5 ) % this._window;
				var xOnWindow = 250 + i * 100;
				
				var width = Math.min( 35 , this._buffer.width - this._xWindow - xOnWindow + this._xBuffer  );
				
				if( width <= 0 || this._xWindow + xOnWindow - this._xBuffer < 0 )
					continue;
				
				ctx.drawImage( 	this._buffer , 
						this._xWindow + xOnWindow - this._xBuffer, 
						0 ,
						width,
						this._buffer.height , 
						this._xWindow + xOnWindow, 
						-this._buffer.height , 
						width, 
						this._buffer.height );
			}
		};
		
		
		// trash box on first planel
		var firstPanel = new AutoDefilDecor();
		var struct = [ 	
			{ indexAtlas : 17  , l : 13040 , b : null , r : null , t  : 75 +5 , z : 2} ,
			{ indexAtlas : 17  , l : 25670 , b : null , r : null , t  : 75   , z : 2} ,
		];
		// mise a l'echelle
		for( var i = 0 ; i < struct.length ; i ++ ){
			struct[ i ].l = struct[ i ].l/2;
			struct[ i ].t = struct[ i ].t/2;
		}
		for( var i = 0 ; i < struct.length ; i ++ ){
			if( struct[ i ].l )
				struct[ i ].r = struct[ i ].l + coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			else
				struct[ i ].l = struct[ i ].r - coordAtlasDecor[ struct[ i ].indexAtlas ].width;
			
			if( struct[ i ].b )
				struct[ i ].t = struct[ i ].b + coordAtlasDecor[ struct[ i ].indexAtlas ].height;
			else
				struct[ i ].b = struct[ i ].t - coordAtlasDecor[ struct[ i ].indexAtlas ].height;
		}
		
		firstPanel.setWindow( this._sceneWindowMax /2 );
		firstPanel.setHeight( 52 );
		firstPanel.init( texture , coordAtlasDecor , struct );
		firstPanel.cutEntity( 100 );
		firstPanel.setBufferWidth( this._sceneWindowMax );
		firstPanel.setScale( 2, 2 );
		
		// back ground
		hfloor -= 200;
		backBand = new AutoDefilDecor();
		var texture = mse.src.getSrc( "backDecor" );
		var coordAtlasBack = [ 	{ x : 23 , y : 0 , width : 240 , height : 440 },
							{ x : 256 , y : 0 , width : 600 - 256 , height : 440 },
							{ x : 600 , y : 0 , width : 1475 - 600 , height : 440 },
							{ x : 1500 , y : 0 , width : 2250 - 1500 , height : 440 },
							{ x : 2250 , y : 0 , width : 3010 - 2250 , height : 440 },
							{ x : 3000 , y : 0 , width : 1082 , height : 440 },
							{ x : 0 , y : 0 , width : 600 , height : 440 },
						];
		// mise a l'echelle
		for( var i = 0 ; i < coordAtlasBack.length ; i ++ ){
			coordAtlasBack[ i ].x = coordAtlasBack[ i ].x/4;
			coordAtlasBack[ i ].y = coordAtlasBack[ i ].y/4;
			coordAtlasBack[ i ].width = coordAtlasBack[ i ].width/4;
			coordAtlasBack[ i ].height = coordAtlasBack[ i ].height/4;
		}

		// the struct is randomly generated
		var struct = [];
		var x =0;
		while( x < this._sceneWidth * this._ratioBack / 4 ){
			var shap = Math.floor( Math.prandom() *  coordAtlasBack.length );
			x += Math.prandom() * 20 + 2;
			struct.push( { indexAtlas : shap , l : x , b : null , r : null , t  : 140 , z : 0 } );
			x += coordAtlasBack[ shap ].width;
		}
		for( var i = 0 ; i < struct.length ; i ++ ){
			if( struct[ i ].l )
				struct[ i ].r = struct[ i ].l + coordAtlasBack[ struct[ i ].indexAtlas ].width;
			else
				struct[ i ].l = struct[ i ].r - coordAtlasBack[ struct[ i ].indexAtlas ].width;
			
			if( struct[ i ].b )
				struct[ i ].t = struct[ i ].b + coordAtlasBack[ struct[ i ].indexAtlas ].height;
			else
				struct[ i ].b = struct[ i ].t - coordAtlasBack[ struct[ i ].indexAtlas ].height;
		}
		backBand.setWindow( this._sceneWindowMax /4 );
		backBand.setHeight( 140 );
		backBand.init( texture , coordAtlasBack , struct );
		backBand.cutEntity( 100 );
		backBand.setBufferWidth( this._sceneWindowMax /2  );
		backBand.setScale( 4  , 4  );
		
		hfloor += 600;
		
		// sky
		var sky = new AutoDefilDecor();
		var texture = mse.src.getSrc( "stars" );
		var coordAtlas = [ 	{ x : 0 , y : 0 , width : 10 , height : 14 },
							{ x : 10 , y : 0 , width : 25 , height : 20 },
							{ x : 37 , y : 2 , width : 13 , height : 15 },
						];
		var coordAtlas = [ 	{ x : 0 , y : 0 , width : 3 , height : 3 },
							{ x : 3 , y : 0 , width : 7 , height : 6 },
							{ x : 10 , y : 0 , width : 5 , height : 6 },
						];
		// the struct is randomly generated
		var struct = [];
		var x =0;
		while( x < this._sceneWidth * this._ratioSky / 2 ){
			var shap = Math.floor( Math.prandom() *  ( coordAtlas.length  ) );
			x += Math.prandom() * 0 ;
			struct.push( { indexAtlas : shap , l : x , b : Math.prandom() * 155 , r : null , t  : null } );
			x += coordAtlas[ shap ].width;
		}
		for( var i = 0 ; i < struct.length ; i ++ ){
			struct[ i ].r = struct[ i ].l + coordAtlas[ struct[ i ].indexAtlas ].width;
			struct[ i ].t = struct[ i ].b + coordAtlas[ struct[ i ].indexAtlas ].height;
		}
		sky.setWindow( this._sceneWindowMax / 4 );
		sky.setHeight( 150 );
		sky.setScale( 4 , 4 );
		sky.init( texture , coordAtlas , struct );
		sky.setBufferWidth( this._sceneWindowMax / 2  );
		sky.drawWindow( 0 );
		
		
		//blank layer
		blank = cc.Node.create();
		blank.h = this._sceneHeight;
		blank.w = this._sceneWindowMax;
		blank.draw = function( context ){
			context.beginPath();
			context.rect(-93, -this.h /2 - 40  , this.w , this.h );
	        context.fillStyle = '#34435E';
	        context.fill();
		}
		
		//blank layer
		light = cc.Node.create();
		light.h = this._sceneHeight;
		light.w = this._sceneWindowMax;
		light._timer = 0;
		light.color = '#FF0044';
		light.schedule( function(){ 
			this._timer = ( this._timer  + 1 ) % 100; 
			
			var k = ( this._timer % 50 ) /50;
			if( k < 0.25 )
				this.color = "#FF0037";
			else
			if( k < 0.5 )
				if( k < 0.375 ){
					var r = 255,
						v = Math.floor( 2040 *( k - 0.25 )),
						b = 55 + Math.floor( 1600 * ( k - 0.25 ));
					this.color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255 - Math.floor( 1600 * ( k - 0.375 )),
						v = 255 - Math.floor( 2040 * ( k - 0.375 )),
						b = 255;
					this.color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
			else
			if( k < 0.75 )
				this.color = "#3700FF";
			else
				if( k < 0.875 ){
					var r = 55 + Math.floor( 1600 *( k - 0.75 ) ),
						v = Math.floor( 2040 * ( k - 0.75 )),
						b = 255;
					this.color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255,
						v = 255 - Math.floor( 2040 * ( k - 0.875 ) ),
						b = 255 - Math.floor( 1600 * ( k - 0.875 ) );
					this.color = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
		} , 1/50 );
		light.draw = function( context ){
			
			var x  = Math.sin( this._timer * 0.1256 ) * 100 - 100, 
				y1 = Math.sin( this._timer * 0.3 ) * 200, 
				y2 = Math.sin( this._timer * 0.2 ) * 200, 
				y3 = Math.sin( this._timer * 0.23 ) * 200;
			
			context.save();
			
			context.fillStyle = this.color;
			
			
			context.globalAlpha = 0.2;
			context.beginPath();
			context.moveTo( x-93 , y1-540 );
			context.bezierCurveTo( x*0.5+200 , -450 , x*0.5+300 , -50 , x-93 , 110 );
			context.lineTo( x-93 , y1-540 );
			context.closePath();
			context.fill();
			
			context.globalAlpha = 0.15;
			context.beginPath();
			context.moveTo( x-93 , y2-840 );
			context.bezierCurveTo( x*0.7+260 , -650 , x*0.7+190 , -350 , x-93 , -200 );
			context.lineTo( x-93 , y2-840 );
			context.closePath();
			context.fill();
			
			context.globalAlpha = 0.2;
			context.beginPath();
			context.moveTo( x-93 , y3-440 );
			context.bezierCurveTo( x+260 , -230 , x+300 , 50 , x-93 , 200 );
			context.lineTo( x-93 , y3-440 );
			context.closePath();
			context.fill();
			
			context.restore();
		}
		
		
		
		
		
		//floor layer
		var floor = cc.Node.create();
		
		floor._sceneHeight = this._sceneHeight;
		floor._sceneWindowMax = this._sceneWindowMax;
		floor.draw = function( context ){
			context.beginPath();
			context.rect( -93, 40 - 100 , this._sceneWindowMax , 150 );
	        context.fillStyle = '#444444';
	        context.fill();
			
			context.beginPath();
			context.rect( -93, 15 - 100 , this._sceneWindowMax , 25 );
	        context.fillStyle = '#222222';
	        context.fill();
			
			context.beginPath();
			context.rect( -93, -100 , this._sceneWindowMax , 15 );
	        context.fillStyle = '#151515';
	        context.fill();
		}
		
		
		
		}
       
		this._parallaxLayer = cc.ParallaxNode.create();
		this._parallaxLayer.addChild( blank , 				-2, cc.ccp(0, 0), 		cc.PointMake(  0 , 0 ) );
		this._parallaxLayer.addChild( sky , 				-1, cc.ccp(this._ratioSky  , this._ratioSky), 	cc.PointMake(  0 , 160 ) );
        this._parallaxLayer.addChild( backBand , 			 1, cc.ccp(this._ratioBack , this._ratioBack  ), 	cc.PointMake(  0 , 50 ) );
        this._parallaxLayer.addChild( floor , 			 2, cc.ccp(0, 0.4), 		cc.PointMake(  0 , 0 ) );
		this._parallaxLayer.addChild( haloBand , 			 14, cc.ccp(1, 1), 		cc.PointMake(  0 , -55 ) );
        this._parallaxLayer.addChild( decorBand , 			 3, cc.ccp(1, 1), 		cc.PointMake(  0 , -55 ) );
		
        this._parallaxLayer.addChild( firstPanel , 			 12 , cc.ccp(1, 1), 		cc.PointMake(  0 , -35 ) );
        
        this._parallaxLayer.addChild( light   , 			 15, cc.ccp(0, 0.4), 		cc.PointMake(  0 , 40 ) );
		
		
		light.setTag( "light" );
		decorBand.setTag( "decorBand" );
		
		
		
		this._animationLayer = cc.Node.create();
		this._animationLayer.addChild( this._parallaxLayer );
		this.addChild( this._animationLayer );
		
		var frame = cc.Node.create();
		frame.h = this._frameHeight;
		frame.w = this._frameWidth;
		frame.draw = function( context ){
			
			var bord = 200;
			context.beginPath();
			context.rect( -bord , -bord - this.h , bord , this.h + bord * 2 );
			context.fillStyle = "#010001";
	        context.fill();
			
			context.beginPath();
			context.rect( this.w , -bord - this.h , bord , this.h + bord * 2 );
	        context.fill();
			
			context.beginPath();
			context.rect( 0 , 0 , this.w ,  bord  );
	        context.fill();
			
			context.beginPath();
			context.rect( 0 , -bord - this.h , this.w ,  bord  );
	        context.fill();
			
			context.beginPath();
			context.rect( 0, -this.h , this.w , this.h );
			context.lineWidth = 10;
	        context.stroke();
			
		}
		this.addChild( frame , 30  );
	},
	initAnimationLauncher : function(){
		
		// creation of the animations
		var zoomIn = cc.ScaleTo.create( 0.2 , 1.3 , 1.3 );
		var zoomOut = cc.ScaleTo.create( 0.2 , 1.0 , 1.0 );
		var softZoomIn = cc.EaseSineInOut.create( zoomIn );
		var softZoomOut = cc.EaseSineInOut.create( zoomOut );
		var zoomInOut = cc.Sequence.create(  softZoomIn , cc.DelayTime.create(0.2) ,  softZoomOut );
		
		
		this._animations = [
			// intro
			{ type : "cameraAnimation" , instant : -10 , data : cc.ScaleTo.create( 0 , 1.6 , 1.6 ) },
			{ type : "cameraAnimation" , instant : 30 , data : cc.ScaleTo.create( 1 , 1 , 1 ) },
			
			{ type : "cameraAnimation" , instant : 1840 , data : zoomInOut },
			
			// zoom out when he climb the roof
			{ type : "cameraAnimation" , instant : 6500 , data : cc.ScaleTo.create( 0.8 , 0.94 , 0.94 ) },
			{ type : "cameraAnimation" , instant : 6500 , data : cc.MoveTo.create( 0.8 , cc.PointMake( 0 , -30 ) ) },
			{ type : "cameraAnimation" , instant : 7040 , data : cc.ScaleTo.create( 0.4 , 0.65 , 0.65 ) },
			{ type : "cameraAnimation" , instant : 7040 , data : cc.MoveTo.create( 0.4 , cc.PointMake( 0 , -50 ) ) },
			
			{ type : "changeFollowBorder" , instant : 7340 , data : new cc.Rect( 0 , 200 , this._sceneWidth , this._sceneHeight  ) },
			
			{ type : "cameraAnimation" , instant : 12000 , data : cc.MoveTo.create( 0.4 , cc.PointMake( 0 , 150 ) ) },
			{ type : "cameraAnimation" , instant : 12000 , data : cc.ScaleTo.create( 0.4 , 0.62 , 0.62 ) },
			
			// zoom in when he go back to floor
			{ type : "changeFollowBorder" , instant : 12500 , data : new cc.Rect( 0 , -50 , this._sceneWidth , this._sceneHeight+150  ) },
			{ type : "cameraAnimation" , instant : 12800 , data : cc.ScaleTo.create( 0.6 , 1.25 , 1.25 ) },
			{ type : "cameraAnimation" , instant : 12800 , data : cc.MoveTo.create( 0.4 , cc.PointMake( 0 , 0 ) ) },
			
			{ type : "cameraAnimation" , instant : 13500 , data : cc.ScaleTo.create( 0.8 , 0.9 , 0.9 ) },
			
			// ridicoulously epic bullet time
			{ type : "cameraAnimation" , instant : 17250 , data : cc.MoveTo.create( 0.3 , cc.PointMake( -100 , 0 ) ) },
			{ type : "cameraAnimation" , instant : 17250 , data : cc.ScaleTo.create( 0.3 , 0.8 , 0.8 ) },
			
			{ type : "cameraAnimation" , instant : 17650 , data : cc.ScaleTo.create( 0.2 , 1.5 , 1.5 ) },
			{ type : "cameraAnimation" , instant : 17650 , data : cc.MoveTo.create( 0.2 , cc.PointMake( 0 , -100 ) ) },
			{ type : "cameraAnimation" , instant : 17650 , data : cc.CallFunc.create(this , function(){ 
																	this.hero._vitesse = 5;
																	this.hero._bar._policeV = 5;
																	cc.Scheduler.sharedScheduler().setTimeScale( 0.8 )
																} , true ) },
			
			
			{ type : "cameraAnimation" , instant : 17850 , data : cc.MoveTo.create( 0.4 , cc.PointMake( 0 , 0 ) ) },
			{ type : "cameraAnimation" , instant : 17850 , data : cc.ScaleTo.create( 0.4 , 0.9, 0.9 ) },
			{ type : "cameraAnimation" , instant : 17870 , data : cc.CallFunc.create(this , function(){ 
																	this.hero._vitesse = 20;
																	this.hero._bar._policeV = 19.5;
																	cc.Scheduler.sharedScheduler().setTimeScale( 1 )
																} , true ) },
			
			
			{ type : "cameraAnimation" , instant : 19500 , data : cc.ScaleTo.create( 0.8 , 0.62 , 0.62 ) },
			
			
			{ type : "changeFollowBorder" , instant : 20400 , data : new cc.Rect( 0 , 200 , this._sceneWidth , this._sceneHeight  ) },
			
			// zoom
			
			{ type : "cameraAnimation" , instant : 22800 , data : cc.ScaleTo.create( 0.1 , 0.8 , 0.8 ) },
			{ type : "cameraAnimation" , instant : 23000 , data : cc.ScaleTo.create( 0.15 , 0.62 , 0.62 ) },
			
			// bullet effet
			{ type : "cameraAnimation" , instant : 23750 , data : cc.ScaleTo.create( 0.2 , 1.5 , 1.5 ) },
			{ type : "cameraAnimation" , instant : 23750 , data : cc.MoveTo.create( 0.2 , cc.PointMake( 0 , -100 ) ) },
			{ type : "cameraAnimation" , instant : 23750 , data : cc.CallFunc.create(this , function(){ 
																	this.hero._vitesse = 5;
																	this.hero._bar._policeV = 5;
																	cc.Scheduler.sharedScheduler().setTimeScale( 0.8 )
																} , true ) },
			
			
			
			{ type : "cameraAnimation" , instant : 24040 , data : cc.MoveTo.create( 0.2 , cc.PointMake( 0 , 0 ) ) },
			{ type : "cameraAnimation" , instant : 24040 , data : cc.ScaleTo.create( 0.5 , 0.62 , 0.62 ) },
			{ type : "cameraAnimation" , instant : 24040 , data : cc.CallFunc.create(this , function(){ 
																	this.hero._vitesse = 20;
																	this.hero._bar._policeV = 19.5;
																	cc.Scheduler.sharedScheduler().setTimeScale( 1 )
																} , true ) },
			
			// zoom in when he go back to floor
			{ type : "changeFollowBorder" , instant : 24200 , data : new cc.Rect( 0 , -50 , this._sceneWidth , this._sceneHeight+150  ) },
			
			{ type : "cameraAnimation" , instant : 24400 , data : cc.MoveTo.create( 0.4 , cc.PointMake( 0 , 150 ) ) },
			{ type : "cameraAnimation" , instant : 24400 , data : cc.ScaleTo.create( 0.4 , 0.62 , 0.62 ) },
			
			{ type : "cameraAnimation" , instant : 25531 , data : cc.ScaleTo.create( 0.6 , 1.25 , 1.25 ) },
			{ type : "cameraAnimation" , instant : 25531 , data : cc.MoveTo.create( 0.3 , cc.PointMake( 0 , 0 ) ) },
			
			{ type : "cameraAnimation" , instant : 26000 , data : cc.ScaleTo.create( 0.8 , 0.9 , 0.9 ) },
		];
		
		this.schedule( this.animationLauncher , 1/50 );
	},
	init:function () {
        this._super();
		
		this.initDecor();
		
		this.initAnimationLauncher();
		
		this.setScale( 0.65 , 0.65 );
		//this.setScale( 0.3 , 0.3 );
		this.setPosition( cc.PointMake( -93 , 300 ) );
		this.setPosition( cc.PointMake( -93 , 0 ) );
		
		
		var maxim = new MaxRunner();
		maxim.init();
		this.attachHero( maxim );
		
		
		this._bar = new DistanceBar();
		this._bar.init( 600 , this._sceneWidth );
		this.addChild( this._bar , 35 );
		this._bar.setPosition( cc.PointMake( 60 , -50 ) );
		
		maxim._bar = this._bar;
		
		this._policeman = cc.Sprite.createWithTexture( mse.src.getSrc( "maxSp" ) , new cc.Rect(120,380,60,100)  );
		
		return true;
    },
	animationLauncher : function(){
		
		var x = this.hero.getPositionX();
		var an = null;
		for( ; this._cursorAnimation < this._animations.length && this._animations[ this._cursorAnimation ].instant + 100 < x ; this._cursorAnimation ++ );
		for( ; this._cursorAnimation < this._animations.length && this._animations[ this._cursorAnimation ].instant < x ; this._cursorAnimation ++ ){
			
			an = this._animations[ this._cursorAnimation ];
			
			switch( an.type ){
				case  "cameraAnimation" :
					this._animationLayer.runAction( an.data );
					
				break;
				case  "changeFollowBorder" :
					var followAction = cc.Follow.create( this.hero , an.data );
					followAction.setBoudarySet( true );
					this._parallaxLayer.runAction( followAction );
				break;
			}
		}
		
	},
	attachHero : function( hero ){
		
		var heroLayer = cc.Node.create();
		
		this._parallaxLayer.addChild( heroLayer , 	 10, cc.ccp(1, 1), 		cc.PointMake( 0 , 0 ) );
		
		heroLayer.setTag( "hero");
		
		heroLayer.addChild( hero );
		
		hero.setPositionY( -40 );
		var x = 0;
		hero.setPositionX( x );
		hero._x = x;
		
		
		this._parallaxLayer.setAnchorPoint( cc.PointMake( 1 , 1 ) );
		var followAction = cc.Follow.create( hero , new cc.Rect( 0 , -50 , this._sceneWidth , this._sceneHeight+150  ) );
		followAction.setBoudarySet( true );
		this._parallaxLayer.runAction( followAction );
		
		
		var pathNode = hero.getPathNode();
		pathNode.setPositionY( -40 );
		//this._parallaxLayer.addChild( pathNode  , 	 18 , cc.ccp(1, 1), 	cc.PointMake( 0 , 20 ) );
		
		this.hero = hero;
	},
	
});

var DistanceBar = cc.Node.extend({
	_w : 0,
	_l : 0,
	_max : null,
	_police : null,
	_policeV : 19.5,
	_policeX : 0,
	_offset : 0,
	_animations : { police : null , max : null , maxHurt : null },
	_alert : false,
	_policeFace : null,
	_running : false,
	_runningSince : 0,
	init:function( w , l ){
		
		var retardPolice = 400;
		
		this._policeX = -retardPolice;
		
		this._offset = 400;
		
		this._w = w ;
		this._l = l + this._offset;
		
		this._ratio = this._w/this._l;
		
		this.initAnimation();
	},
	updateMaxState : function( s ){
		0;
		if( s != "run" ){
			this._running = true;
			this._runningSince = null;
		}
		switch( s ){
			case "climb" :
				this._policeV = 0;
				var delay = cc.Sequence.create( 	cc.DelayTime.create( 1.7 ) ,
											cc.CallFunc.create(this , function(){ 
													this._policeV = 19.5;
											} , true )
										);
				this.runAction( delay );
				
			break;
			case "outOfBox" :
				this._policeV =  0;
				var delay = cc.Sequence.create( 	cc.DelayTime.create( 1.3 ) ,
												cc.CallFunc.create(this , function(){ 
														this._policeV = 19.5;
												} , true )
											);
				this.runAction( delay );
			break;
			case "backFromDeath" :
			case "hurt" :
			case "seriouslyHurt" :
				
				var face = this._max.getChildByTag( "face" );
				face.stopAllActions();
				face.runAction( this._animations.maxHurt  );
				
				if( s == "hurt" || s == "backFromDeath" )
					this._policeV = 15;
				else
				if( s == "seriouslyHurt" )
					this._policeV = 10;
					
				var delay = cc.Sequence.create( 	cc.DelayTime.create( s == "seriouslyHurt" ? 1.3 : 0.3 ) ,
												cc.CallFunc.create(this , function(){ 
														this._policeV = 19.5;
												} , true )
											);
											
				this.runAction( delay );
			break;
			
			case "run" :
			case "chargeJump" :
			case "jumpOff":
			case "jumpOn" :
				var face = this._max.getChildByTag( "face" );
				face.stopAllActions();
				face.runAction( this._animations.max  );
				
			break;
		}
	},
	initAnimation : function(){
		
		
		
		
		var frame = cc.Animation.create();
		var img = mse.src.getSrc( "decor" );
		frame.addFrameWithTexture( img , new cc.Rect( 1440 , 462 , 16 , 21 ) );
		this._animations.max = cc.RepeatForever.create( cc.Animate.create( 0.1 , frame , false) );
		
		var frame = cc.Animation.create();
		frame.addFrameWithTexture( img , new cc.Rect( 1461 , 462 , 16 , 21 ) );
		this._animations.maxHurt = cc.RepeatForever.create( cc.Animate.create( 0.1 , frame , false) );
		
		var frame = cc.Animation.create();
		frame.addFrameWithTexture( img , new cc.Rect( 1480 , 462 , 16 , 21 ) );
		this._animations.police = cc.RepeatForever.create( cc.Animate.create( 0.1 , frame , false) );
		
		
		this._max = cc.Node.create();
		
		var face = cc.Sprite.createWithTexture( mse.src.getSrc( "maxSp" ) , new cc.Rect(0,0,1,1)  );
		face.runAction( this._animations.max );
		face.setTag( "face");
		
		var arrowUp = cc.Node.create();
		arrowUp.draw = function( context ){
			context.save();
			
			context.fillStyle = "#6217AA";
			
			context.beginPath();
			context.moveTo( 0 , 0 );
			context.lineTo( 6 , 10 );
			context.lineTo( -6 , 10 );
			context.lineTo( 0 , 0 );
			context.closePath();
			context.fill();
			
			context.restore();
		};
		face.setScale( 1.3 , 1.3 );
		face.setPositionY( face.getPositionY() +10 );
		this._max.addChild( face );
		this._max.addChild( arrowUp );
		this.addChild( this._max );
		this._max.setPositionY( -40 );
		arrowUp.setPositionY( 40 );
		
		
		this._police = cc.Node.create();
		
		var face = cc.Sprite.createWithTexture( mse.src.getSrc( "maxSp" ) , new cc.Rect(0,0,1,1)  );
		face.runAction( this._animations.police );
		
		var light = cc.Node.create();
		light._timer = 0;
		light.color1 = '#FF0044';
		light.schedule( function(){ 
			this._timer = ( this._timer  + 1 ) % 100; 
			
			var k = ( this._timer % 50 ) /50;
			if( k < 0.25 )
				this.color1 = "#FF0037";
			else
			if( k < 0.5 )
				if( k < 0.375 ){
					var r = 255,
						v = Math.floor( 2040 *( k - 0.25 )),
						b = 55 + Math.floor( 1600 * ( k - 0.25 ));
					this.color1 = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255 - Math.floor( 1600 * ( k - 0.375 )),
						v = 255 - Math.floor( 2040 * ( k - 0.375 )),
						b = 255;
					this.color1 = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
			else
			if( k < 0.75 )
				this.color1 = "#3700FF";
			else
				if( k < 0.875 ){
					var r = 55 + Math.floor( 1600 *( k - 0.75 ) ),
						v = Math.floor( 2040 * ( k - 0.75 )),
						b = 255;
					this.color1 = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				} else {
					var r = 255,
						v = 255 - Math.floor( 2040 * ( k - 0.875 ) ),
						b = 255 - Math.floor( 1600 * ( k - 0.875 ) );
					this.color1 = "#"+( ( r << 16 ) + ( v << 8 ) + b ).toString( 16 ).toUpperCase();
				}
				
		} , 1/50 );
		light.draw = function( context ){
			
			var x  = Math.sin( this._timer * 0.1256 ) * 40 + 50, 
				y1 = Math.sin( this._timer * 0.3 ) * 20, 
				y2 = Math.sin( this._timer * 0.2 ) * 10, 
				y3 = Math.sin( this._timer * 0.23 ) * 30;
			
			context.save();
			
			context.fillStyle = this.color1;
			
			
			context.globalAlpha = 0.2;
			context.beginPath();
			context.arc( y1*0.6 , y2*0.3 , ( y1 + 50 )*0.5 ,  0 , Math.PI*2 , true );
			context.closePath();
			context.fill();
			
			context.beginPath();
			context.arc( y3*0.4 , y1*0.3 +4, x * 0.3 +10,  0 , Math.PI*2 , true );
			context.closePath();
			context.fill();
			
			context.beginPath();
			context.arc( y2 , y1*0.3 -4, ( y3 + 50 )*0.3 ,  0 , Math.PI*2 , true );
			context.closePath();
			context.fill();
			
			context.restore();
		}
		
		var arrowDown = cc.Node.create();
		arrowDown.draw = function( context ){
			context.save();
			
			context.fillStyle = "#6217AA";
			
			context.beginPath();
			context.moveTo( 0 , 0 );
			context.lineTo( 6 , -10 );
			context.lineTo( -6 , -10 );
			context.lineTo( 0 , 0 );
			context.closePath();
			context.fill();
			
			context.restore();
		};
		this._police.addChild( light );
		this._police.addChild( arrowDown );
		this._police.addChild( face );
		face.setScale( 1.3 , 1.3 );
		face.setPositionY( face.getPositionY() +15 );
		this.addChild( this._police );
		this._police.setPositionY( 10 );
		arrowDown.setPositionY( -10 );
		
		this._policeFace = face;
	},
	run : function ( x ){
		
		if( this._running && this._runningSince == null )
			this._runningSince = x;
		
		this._policeX = Math.min( x +50 , this._policeX + this._policeV );
		
		this._max.setPositionX( this._ratio *( this._offset + x ) );
		this._police.setPositionX( this._ratio * ( this._offset + this._policeX ) );
		
		if( x - this._policeX < 0 && this._running && x - this._runningSince > 150 ){
			this.getParent().lose();
			this._policeV = 0;
		}
		if( x > this._l ){
			this.getParent().win();
			this._policeV = 0;
		}
		if( !this._alert && x - this._policeX < 80 ){
			var self = this;
			var anim = cc.Sequence.create( 
				cc.Repeat.create( cc.Sequence.create( cc.ScaleTo.create( 0.1 , 2.4 , 2.4  ) , cc.ScaleTo.create( 0.1 , 1.3 , 1.3  ) ) , 2 ) , 
				cc.CallFunc.create(this , function(){ 
					self._alert = false;
				} , true )
				);
			this._policeFace.runAction( anim );
			self._alert = true;
		}
	},
	draw : function(context){
		
		context.beginPath();
		context.rect(0, -2 , this._w , 4 );
	    context.fillStyle = '#34435E';
	    context.fill();
		
	},
	
});




var gameLayer = cc.Layer.extend({
	decor : null,
	init:function () {
        this._super();
		
		this.decor = new DecorLayer();
		this.decor.init();
		
		this.addChild( this.decor );
		
		return true;
    },
	clean : function(){
		this.removeChild( this.decor );
	}
});
gameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = new gameLayer();
	layer.init();
    scene.addChild(layer);
	scene.release = function(){
		layer.clean();
		this.removeChild( layer );
	}
    return scene;
};

/**
 * Object that set up and retains a tree collision detector.
 * knows how to perform a search in the tree to detect a collision with a circle
 * it use method from cc.Polygon, notably the intersection with polygon and circle
 * it can be instanciate from a groupObject ( a tmx layer )
 */
var CollisionDetector = function(){
	this._zone = [];
	this._gridDetector = null,
	/**
	 * generate the tree collision, based on the objects found on the groupObject
	 * groupObject is formated by the tmx parser, see parseXMLFile of cc.TMXMapInfo
	 * @function
	 * @param { Array of cc.Point }  polygon
	 * @param { label }  label
	 * @return null
	 */
	this.initMap = function( groupObject ){
		var objects = groupObject.getObjects();
		var o = null;
		for( var k = 0 ; k < objects.length ; k ++ ){
			o = objects[ k ];
			switch( o.type ){
				case "rect":
					this.addRectZone( cc.RectMake( o.x , o.y , o.width , o.height ) , o.name );
				break;
				case "polygon" : case "polyline" :
					this.addPolygonalZone( o.polygon , o.name );
				break;
				case "tilesGrid" :
					if( !this._gridDetector ){
						this._gridDetector = new gridCollisionDetector();
						this._gridDetector.initInfo( o.mapSize , o.tileSize );
					} else 
					if( 	this._gridDetector._mapSize.width != o.mapSize.width 
						||	this._gridDetector._mapSize.height != o.mapSize.height
						||	this._gridDetector._tileSize.width != o.tileSize.width
						||	this._gridDetector._tileSize.height != o.tileSize.height )
						continue;
					this._gridDetector.appendGrid( o.tiles );
				break;
			}			
		}
	}
	
	/**
	 * add a polygonal element in the tree collision, with the associate label
	 * @function
	 * @param { Array of cc.Point }  polygon
	 * @param { label }  label
	 * @return null
	 */
	this.addPolygonalZone = function( polygon , label ){
		var upperBound = cc.Polygon.getBoundaryBox( polygon );
		
		var convexes = cc.Polygon.splitInConvexesEars( polygon );
		
		var upper = {
				zone: upperBound,
				leaf : false,
				children : [ ],
				label : label
				};
		
		if( convexes.length == 1 )
			upper.children = [ 
					{ zone : convexes[ 0 ],
					  leaf : true,
					  label : label
					} ];
		else 
			for( var k = 0 ; k < convexes.length ; k ++ )
				upper.children.push( {
					zone : cc.Polygon.getBoundaryBox( convexes[ k ] ) ,
					leaf : false,
					label : label,
					children : [ {
						zone : convexes[ k ],
						leaf : true,
						label : label
					} ]
				} );
		
		this._zone.push( upper );
	}
	
	/**
	 * add a rectangle element in the tree collision, with the associate label
	 * @function
	 * @param { cc.Rect }  rect
	 * @param { label }  label
	 * @return null
	 */
	this.addRectZone = function( rect , label ){
		this._zone.push( { 
					  zone : rect,
					  leaf : true,
					  label : label
					} );
	}
	
	/**
	 * check for collisions with the circle ( defined by its center c and its radius r ) and the scene 
	 * return an array of labels that relate to the objects that are collapse,  and the reaction vector to the element
	 * each label appear only once, meaning if the circle collapse with a obect labeled X, the collision with another X object will not be tested
	 * the label is the name entry of the tmx element ( in case of initiation with a tmx groupObject )
	 * use the gridDetector to check collision with a grid of tile
	 * @function
	 * @param { cc.Point }  c 
	 * @param { number }  r 
	 * @return { Array of { lbl : String , v : cc.Point }  
	 */
	this.checkCollision = function( c , r ){
		var child = null;
		var label = [];
		var v = null;
		if( this._gridDetector 									// detector exist
			&& label.indexOf( "" ) == -1						// as detector only have default label ( "" ) , check if a label of this kind havent been found
			&& ( v = this._gridDetector.checkCollision( c , r ) ) )		// check the collision
			label.push( { lbl:"" , v:v } );
		
		for( var k = 0 ; k < this._zone.length ; k ++ ){
			child = this._zone[ k ];
			if( label.indexOf( child.label ) != -1 )
				continue;
			label = this._checkTreeCollision( child , c , r , label );
		}
		return label;
	}
	this._checkTreeCollision = function( tree , c , r , label ){
		if( !label )
			label = [];
		if( 	( tree.zone instanceof cc.Rect 	&& cc.Polygon.collisionCircleRect( c , r ,  tree.zone ) )
			||	( tree.zone instanceof Array   	&& cc.Polygon.collisionCircleToPolygon( c , r ,  tree.zone )  ) ){
			if( tree.leaf ){
				var r;
				if( tree.zone instanceof cc.Rect )
					r = cc.Polygon.collisionCircleToPolygon( c , r ,  tree.zone );
				else
					r = cc.Polygon.collisionReactionCircleToPolygon( c , r ,  tree.zone );
				label.push( {lbl:tree.label , v:r} );
			}else {
				var child = null;
				for( var k = 0 ; k < tree.children.length ; k ++ ){
					child = tree.children[ k ];
					if( label.indexOf( child.label ) != -1 )
						continue;
					label = this._checkTreeCollision( child , c , r , label );
				}
			}
		}
		return label;
	}
	
	/**
	 * return a node that draw the collision region 
	 * @return { cc.Node }  
	 */
	this.getDrawedCollisionPattern = function( ){			// doesnt use buffer
		var zone = this._zone;
		var node = cc.Node.create();
		node.draw = function(){
			cc.renderContext.save();
			cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
			cc.renderContext.lineWidth = "1";
			
			var drawStak = [];
			for( var k = 0 ; k < zone.length ; k ++ )
				drawStak.push( zone[ k ] );
			
			while( drawStak.length > 0 ){
				var n = drawStak.shift();
				
				if( n.zone instanceof cc.Rect ){
						if( !n.leaf ){
							cc.renderContext.lineWidth = "0.5";
							cc.renderContext.strokeStyle = "rgba(9,155,255,0.8)";
						} else {
							cc.renderContext.lineWidth = "2";
							cc.renderContext.strokeStyle = "rgba(155,5,255,1)";
						}
						cc.drawingUtil.drawPoly( cc.Polygon.RectToPoly( n.zone ) , 4 , true);
				}else {
						cc.renderContext.lineWidth = "2";
						cc.renderContext.strokeStyle = "rgba(155,5,255,1)";
						cc.drawingUtil.drawPoly( n.zone , n.zone.length , true);
				}
				if( !n.leaf )
					for( var k = 0 ; k < n.children.length ; k ++ )
						drawStak.push( n.children[ k ] );
			}
			cc.renderContext.restore();
		}
		if( this._gridDetector  )
			node.addChild( this._gridDetector.getDrawedCollisionPattern() );
		return node;
	}

	/**
	 * Object that set up and retains a grid which define which tile can be passed by
	 * is instanciate with a grid, given by the tmx
	 */
	var gridCollisionDetector = function(){
		this._grid=null;
		this._tileSize=null;
		this._mapSize=null;
		this.initInfo=function( mapSize , tileSize ){
			this._tileSize = tileSize;
			this._mapSize = mapSize;
			this._grid = new Array( this._mapSize.width * this._mapSize.height );
		}
		
		
		/**
		 * grid is indexed by y * width + x
		 * @function
		 * @param { Array of Number }  grid
		 * @return null  
		 */
		this.appendGrid=function( grid ){
			for( var k=0 ; k < grid.length ; k ++ )
				if( !this._grid[ k ] )
					this._grid[ k ] = ( grid[ ( this._mapSize.height - 1 - Math.floor(k/this._mapSize.width) ) * this._mapSize.width + ( k % this._mapSize.width )  ] != 0  );
		}
		
		/**
		 * check for collisions with the circle ( defined by its center c and its radius r ) and the grid
		 * assume that the circlle radius is lower than a tile size,
		 * return the recation vecteur when a collision happen, null else
		 * @function
		 * @param { cc.Point }  c 
		 * @param { number }  r 
		 * @return { cc.Point }  
		 */
		this.checkCollision=function( c , r ){
			// determine the grids cover by the area of the circle
			// assume that the radius is lower than a tile, 
			
			var sx = Math.floor( c.x / this._tileSize.width ),
				sy = Math.floor( c.y / this._tileSize.height );
				
			// the center is in a blocking tile
			if( this._grid[ sy * this._mapSize.width + sx ] ){
				// reaction verctor
				var v = cc.PointMake( c.x % this._tileSize.width - 0.5 , c.y % this._tileSize.height - 0.5 );
				var norm = Math.sqrt( v.x * v.x + v.y * v.y );
				v.x /= norm;
				v.y /= norm;
				return v;
			}
			
			var debx = 0, deby = 0;
			if( c.x - r < sx * this._tileSize.width && sx - 1 >= 0 )
				debx = -1;
			else 
			if( c.x + r > (sx+1) * this._tileSize.width && sx +1 < this._mapSize.width )
				debx = 1;
				
			if( c.y - r < sy * this._tileSize.height && sy - 1 >= 0 )
				deby = -1;
			else 
			if( c.y + r > (sy+1) * this._tileSize.height && sy +1 < this._mapSize.height )
				deby = 1;
			
			
			var collx = false;
			if( debx != 0 && this._grid[ sy * this._mapSize.width + (sx+debx) ]  )
				collx = true;
			
			if( deby != 0 && this._grid[ (sy + deby) * this._mapSize.width + sx ] )
				if( collx )
					//return cc.PointMake( 0.707106781 * debx , 0.707106781 * deby );
					return cc.PointMake(  debx ,  deby );
				else
					return cc.PointMake( 0 , deby );
			if( collx )
					return cc.PointMake( debx , 0 );
					
			if( deby != 0 && debx != 0 && this._grid[ (sy + deby) * this._mapSize.width + sx + debx ] )
				//return cc.PointMake( 0.707106781 * debx , 0.707106781 * deby );
				return cc.PointMake(  debx ,  deby );
			
			return false;
		}
		
		/**
		 * return a node that draw the collision region 
		 * @return { cc.Node }  
		 */
		this.getDrawedCollisionPattern=function(){
			var node = cc.Node.create();
			var self = this;
			node.draw = function(){
				cc.renderContext.save();
				for( var x = 0 ; x < self._mapSize.width ; x ++ )
				for( var y = 0 ; y < self._mapSize.height ; y ++ )
					if( self._grid[ y * self._mapSize.width + x ] ){
						cc.renderContext.lineWidth = "2";
						cc.renderContext.strokeStyle = "rgba(255,5,75,1)";
						cc.drawingUtil.drawPoly( [ 	cc.PointMake( x * self._tileSize.width , y * self._tileSize.height ),
													cc.PointMake( (x+1) * self._tileSize.width , y * self._tileSize.height ),
													cc.PointMake( (x+1) * self._tileSize.width , (y+1) * self._tileSize.height ),
													cc.PointMake( x * self._tileSize.width , (y+1) * self._tileSize.height ) ]
													, 4 , true );
					}
				cc.renderContext.restore();
			}
			return node;
		}
	}
}

}
extend( Escape , mse.Game );