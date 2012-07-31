


var cc = cc = cc || {};


mse.src.addSource('cocos', 'pr/cocos2d/cocosInit.js', 'script', true);


var demoCocos = function(){
	
	
	mse.Game.call(this, {fillback:true});
	
	this.init = function(){
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
                {type:"tmx", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/demoVillage.tmx"},
                {type:"tmx", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/building.tmx"},
                {type:"tmx", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/demo.tmx"},
                {type:"image", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/tiles1.jpg"},
                {type:"image", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/fixed-ortho-test2.png"},
                {type:"image", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/tileset2nn9.png"},
                {type:"image", src:"http://localhost/MseInterface/projects/pr/cocos2d/Resources/tileset.png"},
            ]);
		
	}
	this.logic = function( delta ){
		cc.Scheduler.sharedScheduler().tick(delta / 1000 );
	}
	
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
	        //pDirector.setAnimationInterval(1.0 / 60);
	       		
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



	
var AutonomeHero = ReactiveNode.extend( {
	radius : 5,
	v : { x : 0 , y : 0 },
	vitMax : 10,
	delta : 10,
	init : function(){
		this.addListener( 
				"keydown" , 
				new mse.Callback( this.reactionKeydown , this ),
				false
				) ;
				
		this.schedule( this.move, 1/60 );
	},
	repos : function(){
		this.v.x = 0;
		this.v.y = 0;
		cc.Scheduler.sharedScheduler().pauseTarget( this );
	},
	move : function( delta ){
		
		
		var r = delta / ( 1/60 ); // vecteur vitesse relative to 60 fps
		
		var nextPos = cc.PointMake( this.getPositionX() + this.v.x * r , this.getPositionY() + this.v.y * r );
		
		this.v.x *= Math.pow( 0.95 , r );
		this.v.y *= Math.pow( 0.95 , r );
		
		if( Math.abs( this.v.x ) < 0.1 && Math.abs( this.v.y ) < 0.1 )
			this.repos();
		
		var label=null;
		var collision = false;
		if( this.detector ){
			var label = this.detector.checkCollision( nextPos , this.radius );
			
			for( var k = 0 ; k < label.length; k ++ ){
				switch( label[ k ] ){
					case "":
						collision = true;
					break;
					case "fire":
						if( !this._emitter ){
							this._emitter = cc.ParticleFire.create();
							this.addChild( this._emitter , 1 );
							this._emitter.setTotalParticles(40);
							this._emitter.setSpeed(150);
							this._emitter.setLife( 1 );
							this._emitter.setEmissionRate( 10 );
							this._emitter.setPosVar( cc.PointMake( 10 , 20 ) );
							this._emitter.setPosition( cc.PointMake( 0 , 0 ) );
							this._emitter.setScale( 0.4 , 0.4 );
							
						}
					break;
					case "water" :
						if( this._emitter ){
							this._emitter.resetSystem();
							this._emitter.stopSystem();
							this.removeChild( this._emitter );
							this._emitter = null;
						}
					break;	
				}
			}
		}
		if( !collision )
			this.setPosition( nextPos );
		else
			this.repos();
	},
	reactionKeydown : function( e ){
		switch( e.keyCode ){
			case 39 : // right 
				this.v.x += ( this.vitMax - this.v.x )/this.delta;
			break;
			case 37 : // left 
				this.v.x -= ( this.vitMax + this.v.x )/this.delta;
			break;
			case 38 : // up 
				this.v.y += ( this.vitMax - this.v.y )/this.delta;
			break;
			case 40 : // down
				this.v.y -= ( this.vitMax + this.v.y )/this.delta;
			break;
			default:
				return;
		}
		
		cc.Scheduler.sharedScheduler().resumeTarget( this );
		
		
		
	},
	draw : function(){
		cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
		cc.renderContext.fillStyle = "rgba(255,255,255,1)";
		cc.renderContext.lineWidth = "6";
		
	    cc.drawingUtil.drawPoint( cc.PointMake( 0 , 0 )  , this.radius  );
		
	}
});


var DecorLayer = cc.Layer.extend({
	collisionDetector : null,
	init:function () {
        this._super();
		
		// initiate the tmx related
		var map = cc.TMXTiledMap.create("http://localhost/MseInterface/projects/pr/cocos2d/Resources/building.tmx"); 
		
		// initiate the detector associate
		this.collisionDetector = new CollisionDetector();				
		this.collisionDetector.initMap( map.objectGroupNamed( "collision" ) );
		
		this.addChild( map );
		
		var dnode = this.collisionDetector.getDrawedCollisionPattern();
		
		this.addChild( dnode );
		
		return true;
    },
	appendHero:function( h ){
		this.addChild( h );
	}
	
});

var AutonomeRunner = ReactiveNode.extend({
	crouch : false,
	chargedJump : 0,
	pos : cc.PointMake( 20 , 200 ),
	vitesseh : 5,
	g : -3,
	coeffFrott : 0.2,
	vitessev : 0,
	collisionDetector : null,
	
	init:function () {
	
        this.setPosition( this.pos );
		
		// attach event
		this.addListener( 
				"keydown" , 
				new mse.Callback( this.reactionKeydown , this ),
				false
				) ;
		this.addListener( 
				"keyup" , 
				new mse.Callback( this.reactionKeyup , this ),
				false
				) ;
				
		// attach each frame event
		this.schedule( this.run , 1/30 );
		
		return true;
    },
	run : function( delta ){
		
		var ghost , r ,
		scal ,
		lbls;
		
		// gravity
		this.vitessev += this.g;
		
		// frottement
		this.vitessev += - this.vitessev * this.coeffFrott;				// note that the vitesse max is g * ( 1 - cF ) / cF
		
		// if nothing goes wrong the pos will be ghost
		ghost = cc.PointMake( this.pos.x + this.vitesseh , this.pos.y + this.vitessev )
		
		// check for collision
		lbls = this.collisionDetector.checkCollision(  ghost , 8 );
		
		
		for( var i = 0 ; i < lbls.length ; i ++ )
			switch( lbls[ i ].lbl ){
				case "":
					r = lbls[ i ].v;
				break;
			}
		
		// if collision with a solid element
		if( r != null ){
			// retire la composante en r de v
			scal = this.vitesseh * r.x + this.vitessev * r.y;
			ghost.x -= Math.abs(r.x) * this.vitesseh;
			ghost.y -= Math.abs(r.y) * this.vitessev;
			
			this.vitessev = (1-Math.abs(r.y)/2) * this.vitessev
		}
		
		this.pos = ghost;
		
		this.setPosition( this.pos );
		
		
		if( this.keyDown.up )
			this.chargedJump ++;
	},
	keyDown : { up : false , down : false },
	reactionKeydown : function( e ){
		switch( e.keyCode ){
			case 38 : // up 
				if( this.keyDown.up )
					break;
				this.chargedJump =0;
				this.keyDown.up = true;
			break;
			case 40 : // down
				this.counch = true;
			break;
			default:
				return;
		}
	},
	reactionKeyup : function( e ){
		switch( e.keyCode ){
			case 38 : // up 
				this.keyDown.up = false;
				this.jump();
			break;
			case 40 : // down
				this.counch = true;
			break;
			default:
				return;
		}
	},
	jump : function(){
		this.vitessev += Math.min( 40 + this.chargedJump*10 , 60 );
	},
	draw : function(){
		cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
		cc.renderContext.fillStyle = "rgba(255,175,235,1)";
		cc.renderContext.lineWidth = "6";
		
	    cc.drawingUtil.drawPoint( cc.PointMake( 0 , 10 ) , 6  );
	    cc.drawingUtil.drawPoint( cc.PointMake( 0 , 0 )  , 8  );
		
	}
});

var rootLayer = cc.Layer.extend({
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

		
        
		
		
		
		this.initTmx();
		
        return true;
    },
	initTmx : function(){
		
		// initiate the tmx object
		var map = cc.TMXTiledMap.create("http://localhost/MseInterface/projects/pr/cocos2d/Resources/demoVillage.tmx"); 
		
		// initiate the detector associate
		this.detector = new CollisionDetector();				
		this.detector.initMap( map.objectGroupNamed( "collision" ) );
		
		// show the collision region
		var dnode = this.detector.getDrawedCollisionPattern();
		//this.addChild( dnode , 10 );
		
		
		
		this.tmxLayer = cc.Layer.create();
		this.tmxLayer.addChild( map , 1);
		this.addChild( this.tmxLayer  , 1 );
		
		var size = cc.Director.sharedDirector().getWinSize();
		
		this.hero = new AutonomeHero();
		this.hero.init();
		this.hero.detector = this.detector;
		this.hero.setPosition( cc.PointMake( size.width/2 , size.height/2 ) );
		this.addChild( this.hero  , 2 );
		
		var s = { w : map.getMapSize().width * map.getTileSize().width , h : map.getMapSize().height * map.getTileSize().height }; // size of the map, in px
		var followAction = cc.Follow.create(this.hero , cc.RectMake(0, 0, s.w, s.h) );   // pseudo - camera, follow the sprite this.hero
		followAction.setBoudarySet( true );
		this.runAction(followAction  );
		
	}
});

// static method 
rootLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = new rootLayer();
	layer.init();
    scene.addChild(layer);
    return scene;
};


var gameLayer = cc.Layer.extend({
	decor : null,
	hero :null,
	vscrolling : 5,
	init:function () {
        this._super();
		
		this.decor = new DecorLayer();
		this.decor.init();
		
		this.addChild( this.decor );
		
		
		this.hero = new AutonomeRunner();
		this.hero.init();
		this.hero.collisionDetector = this.decor.collisionDetector;
		
		this.decor.appendHero( this.hero );
		
		return true;
    }
});
gameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = new gameLayer();
	layer.init();
    scene.addChild(layer);
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
extend( demoCocos , mse.Game );


mse.coords = JSON.parse('{"cid0":500,"cid1":400,"cid2":390,"cid3":50,"cid4":10,"cid5":21.666666666667,"cid6":23.333333333333,"cid7":333.33333333333,"cid8":125,"cid9":163.33333333333,"cid10":20,"cid11":0,"cid12":355}');
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
	games.demoCocos = new demoCocos();
	pages.aa=new mse.BaseContainer(root,{size:[mse.coor('cid0'),mse.coor('cid1')]});
	layers.aadefault=new mse.Layer(pages.aa,1,{"globalAlpha":1,"textBaseline":"top","size":[mse.coor('cid0'),mse.coor('cid1')]});
	pages.aa.addLayer('aadefault',layers.aadefault);
	layers.aree=new mse.ArticleLayer(pages.aa,2,{"size":[mse.coor('cid1'),mse.coor('cid2')],"pos":[mse.coor('cid3'),mse.coor('cid4')],"globalAlpha":1,"font":"normal "+mse.coor('cid5')+"px Arial","textAlign":"left","textBaseline":"top","lineHeight":mse.coor('cid6')},null);
	//objs.obj3=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'eget ',true);
	//objs.obj3.addLink(new mse.Link('imperdiet',3,'audio',mse.src.getSrc('src2'))); layers.aree.addObject(objs.obj3);
	objs.obj60=new demoCocos(); layers.aree.addGame(objs.obj60);
	objs.obj4=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'porta odio sit amet augue viverra a ',true); layers.aree.addObject(objs.obj4);
	objs.obj5=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'ullamcorper lectus accumsan. Ut vitae ',true); layers.aree.addObject(objs.obj5);
	objs.obj6=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'quam auctor orci pharetra vulputate. ',true); layers.aree.addObject(objs.obj6);
	objs.obj7=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Morbi id arcu sit amet est interdum ',true); layers.aree.addObject(objs.obj7);
	objs.obj8=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'dapibus ut in elit. In sodales, tortor ',true); layers.aree.addObject(objs.obj8);
	objs.obj9=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'scelerisque varius volutpat, dolor enim ',true); layers.aree.addObject(objs.obj9);
	objs.obj10=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'commodo nunc, non pretium lorem tortor ',true); layers.aree.addObject(objs.obj10);
	objs.obj11=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'sit amet sem. Cum sociis natoque ',true); layers.aree.addObject(objs.obj11);
	objs.obj12=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'penatibus et magnis dis parturient ',true); layers.aree.addObject(objs.obj12);
	objs.obj13=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'montes, nascetur ridiculus mus. ',true); layers.aree.addObject(objs.obj13);
	objs.obj14=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Pellentesque venenatis neque at dui ',true); layers.aree.addObject(objs.obj14);
	objs.obj15=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'elementum nec pulvinar purus ultricies. ',true); layers.aree.addObject(objs.obj15);
	objs.obj16=new mse.Text(layers.aree,{"size":[mse.coor('cid7'),mse.coor('cid6')]},'Vestibulum rutrum feugiat elit, in vulputate ',true); layers.aree.addObject(objs.obj16);
	objs.obj49=new mse.Image(layers.aree,{"size":[mse.coor('cid8'),mse.coor('cid9')],"pos":[mse.coor('cid10'),mse.coor('cid10')]},'src0');
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
	objs.obj26=new mse.Speaker( layers.aree,{"size":[mse.coor('cid1'),mse.coor('cid11')]}, 'etiam', null , mse.coor(mse.joinCoor(45)) , '#467291' ); layers.aree.addObject(objs.obj26);
	objs.obj27=new mse.Text(layers.aree,{"size":[mse.coor('cid12'),mse.coor('cid6')]},' eget nibh sem. Vivamus vel feugiat ',true);
	objs.obj26.addObject(objs.obj27);
	objs.obj28=new mse.Text(layers.aree,{"size":[mse.coor('cid12'),mse.coor('cid6')]},'nunc. In hac habitasse platea ',true);
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
