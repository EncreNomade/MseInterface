/*
 *	some add to the cocos library
 *	works fine on cocos 0.5 alpha
 *
 *
 */
 
 





 /* 
 * this function is present in the orginal alpha 0.5,
 * but somes features that we needed were implemented
 * mostly, the support of the polygone and rect type in a tmx file, and the support of the object group layer as a visible layer
 * all the modification concer the objectGroup, see after // PARSE objectgroup
 * see below 
 */
 /** Initalises parsing of an XML file, either a tmx (Map) file or tsx (Tileset) file
     * @param {String} xmlFilename
     * @return {Element}
     */
cc.TMXMapInfo.prototype.parseXMLFile:function (xmlFilename) {
        var mapXML = cc.SAXParser.shareParser().tmxParse(xmlFilename);

        // PARSE <map>
        var map = mapXML.documentElement;

        var version = map.getAttribute('version');
        var orientationStr = map.getAttribute('orientation');

        if (map.nodeName == "map") {
            if (version != "1.0" && version !== null) {
                cc.Log("cocos2d: TMXFormat: Unsupported TMX version:" + version);
            }

            if (orientationStr == "orthogonal")
                this.setOrientation(cc.TMXOrientationOrtho);
            else if (orientationStr == "isometric")
                this.setOrientation(cc.TMXOrientationIso);
            else if (orientationStr == "hexagonal")
                this.setOrientation(cc.TMXOrientationHex);
            else if (orientationStr !== null)
                cc.Log("cocos2d: TMXFomat: Unsupported orientation:" + this.getOrientation());

            var s = new cc.Size();
            s.width = parseFloat(map.getAttribute('width'));
            s.height = parseFloat(map.getAttribute('height'));
            this.setMapSize(s);

            s = new cc.Size();
            s.width = parseFloat(map.getAttribute('tilewidth'));
            s.height = parseFloat(map.getAttribute('tileheight'));
            this.setTileSize(s)

            // The parent element is now "map"
            this.setParentElement(cc.TMXPropertyMap);
        }

        // PARSE <tileset>
        var tilesets = map.getElementsByTagName('tileset');
        if (map.nodeName !== "map") {
            tilesets = []
            tilesets.push(map);
        }
        for (var i = 0, len = tilesets.length; i < len; i++) {
            var t = tilesets[i];
            // If this is an external tileset then start parsing that
            var externalTilesetFilename = t.getAttribute('source');
            var imgpath = xmlFilename.substring(0, xmlFilename.lastIndexOf("/") + 1);
            if (externalTilesetFilename) {
                this.parseXMLFile(imgpath + externalTilesetFilename);
            }
            else {
                var tileset = new cc.TMXTilesetInfo();
                tileset.name = t.getAttribute('name') || "";
                tileset.firstGid = parseInt(t.getAttribute('firstgid')) || 1;
                tileset.spacing = parseInt(t.getAttribute('spacing')) || 0;
                tileset.margin = parseInt(t.getAttribute('margin')) || 0;

                tileset._tileSize = new cc.Size( parseFloat(t.getAttribute('tilewidth')) , parseFloat(t.getAttribute('tileheight')));

                var image = t.getElementsByTagName('image')[0];
                var imgSource = image.getAttribute('source');
                if (imgSource) {
                    imgSource = imgpath + imgSource;
                }
                tileset.sourceImage = imgSource;
                this.setTilesets(tileset);
            }
        }

        // PARSE  <tile>
        var tiles = map.getElementsByTagName('tile');
        if (tiles) {
            for (var i = 0, len = tiles.length; i < len; i++) {
                var info = this.getTilesets()[0];
                var t = tiles[i];
                this.setParentGID(info.firstGid + parseInt(t.getAttribute('id')));
                this.setTileProperties(this.getParentGID());
                this.setParentElement(cc.TMXPropertyTile);
            }
        }

        // PARSE  <layer>
        var layers = map.getElementsByTagName('layer');
        if (layers) {
            for (var i = 0, len = layers.length; i < len; i++) {
                var l = layers[i];
                var data = l.getElementsByTagName('data')[0];

                var layer = new cc.TMXLayerInfo();
                layer.name = l.getAttribute('name');

                var s = new cc.Size;
                s.width = parseFloat(l.getAttribute('width'));
                s.height = parseFloat(l.getAttribute('height'));
                layer._layerSize = s;

                var visible = l.getAttribute('visible')
                layer.visible = !(visible == "0");

                var opacity = l.getAttribute('opacity') || 1;

                if (opacity) {
                    layer._opacity = parseInt(255 * parseFloat(opacity));
                }
                else {
                    layer._opacity = 255;
                }

                var x = parseFloat(l.getAttribute('x')) || 0;
                var y = parseFloat(l.getAttribute('y')) || 0;
                layer.offset = cc.ccp(x, y);

                var nodeValue = ''
                for (var j = 0; j < data.childNodes.length; j++) {
                    nodeValue += data.childNodes[j].nodeValue
                }

                // Unpack the tilemap data
                var compression = data.getAttribute('compression');
                cc.Assert(compression == null || compression == "gzip" || compression == "zlib", "TMX: unsupported compression method");
                switch (compression) {
                    case 'gzip':
                        layer._tiles = cc.unzipBase64AsArray(nodeValue, 4);
                        break;
                    case 'zlib':
                        //Not Implemented
                        break;
                    // Uncompressed
                    case null:
                    case '':
                        layer._tiles = cc.Codec.Base64.decodeAsArray(nodeValue, 4);
                        break;
                    default:
                        cc.Assert(this.getLayerAttribs() != cc.TMXLayerAttribNone, "TMX tile map: Only base64 and/or gzip/zlib maps are supported");
                }
                this.setLayers(layer);
                // The parent element is now "layer"
                this.setParentElement(cc.TMXPropertyLayer);
            }
        }

        // PARSE <objectgroup>
        var objectgroups = map.getElementsByTagName('objectgroup');
        if (objectgroups) {
            for (var i = 0; i < objectgroups.length; i++) {
                var g = objectgroups[i];
                var objectGroup = new cc.TMXObjectGroup();
                objectGroup.setGroupName(g.getAttribute('name'));
                var positionOffset = new cc.Point();
                positionOffset.x = parseFloat(g.getAttribute('x')) * this.getTileSize().width || 0;
                positionOffset.y = parseFloat(g.getAttribute('y')) * this.getTileSize().height || 0;
                objectGroup.setPositionOffset(positionOffset);

                var objects = g.querySelectorAll('object')
                if (objects) {
                    for (var j = 0; j < objects.length; j++) {
                        var o = objects[j]
                        // The value for "type" was blank or not a valid class name
                        // Create an instance of TMXObjectInfo to store the object and its properties
                        var dict = new Object();

                        // Set the name of the object to the value for "name"
                        dict["name"] = o.getAttribute('name') || "";

                        // Assign all the attributes as key/name pairs in the properties dictionary
                        dict["type"] = o.getAttribute('type') || "";

                        dict["x"] = parseInt(o.getAttribute('x') || 0) + objectGroup.getPositionOffset().x;

                        var y = parseInt(o.getAttribute('y') || 0) + objectGroup.getPositionOffset().y;
                        // Correct y position. (Tiled uses Flipped, cocos2d uses Standard)
                        y = parseInt(this.getMapSize().height * this.getTileSize().height) - y - parseInt(o.getAttribute('height'));
                        dict["y"] = y;

                        dict["width"] = parseInt(o.getAttribute('width'));

                        dict["height"] = parseInt(o.getAttribute('height'));

					
						// --  detect type that havent attribute type
						if( !dict["type"] && o.getAttribute('gid') )
							dict["type"] = "tile";

						if( !dict["type"] && !o.getAttribute('gid') && o.getAttribute('width') && o.getAttribute('height') )
							dict["type"] = "rect";

						if( !dict["type"] && o.querySelectorAll('polyline').length > 0 )
							dict["type"] = "polyline";

						if( !dict["type"] && o.querySelectorAll('polygon').length > 0 )
							dict["type"] = "polygon";
						
						// --- derive from original
						switch( dict["type"] ){
							// treat the type polyline as a polygone
							case "polygone": case "polygon": case "polyline" : 
								var corners = [];
								if( dict["type"] == "polygon" )
									var polygon = o.querySelectorAll( "polygon" );
								else
									var polygon = o.querySelectorAll( "polyline" );

								var points = polygon[0].getAttribute( 'points' )+" ";		// easier to parse with a blank space at the end

								var regExpCouple = /(-?[0-9]+,-?[0-9]+) /g;
								var regExpX = /^(-?[0-9]+),-?[0-9]+$/;
								var regExpY = /^-?[0-9]+,(-?[0-9]+)$/;

								var y = parseInt(o.getAttribute('y') || 0) + objectGroup.getPositionOffset().y;

								var res;
								while( res = regExpCouple.exec( points ) )
									corners.push( new cc.Point( 
												dict["x"] + parseInt(  regExpX.exec( res[1] )[1] , 10 ) ,
												this.getMapSize().height * this.getTileSize().height - y - parseInt(  regExpY.exec( res[1] )[1] , 10 ) // flipped
												) );

								// check the polygon closure
								if( dict["type"] == "polyline" ){
									var last = corners[ corners.length-1 ];
									var first = corners[ 0 ];
									if( Math.abs( last.x - first.x ) + Math.abs( last.y - first.y ) < 5 )
										// the polygone contains the last point twice
										corners.splice( corners.length-1 , 1 );
								}
								dict["polygon"]  = corners ;

								var box = cc.Polygon.getBoundaryBox( dict["polygon"] );

								// tiles editor let the origin point ( 0 , 0 ) be an arbitory point ( the first point placed, but it can be translated ) 
								// there is the correct boundary box

								dict["x"] 		= cc.Rect.CCRectGetMinX( box );
								dict["width"] 	= cc.Rect.CCRectGetMaxX( box ) - cc.Rect.CCRectGetMinX( box );
								dict["y"] 		= cc.Rect.CCRectGetMinY( box );
								dict["height"] 	= cc.Rect.CCRectGetMaxX( box ) - cc.Rect.CCRectGetMinY( box );

							break;	
							case  "tile" :
								dict["gid"] = parseInt( o.getAttribute('gid') );

								// need to get the with / height of the tile,  its contains by the tileset
								var i;
								for( i = 0 ; i < this._tileSets.length && i < this._tileSets[ i ].firstGid ; i ++ );
								i --;
								dict["width"] = this._tileSets[ i ]._tileSize.width;
								dict["height"] = this._tileSets[ i ]._tileSize.height;

								// recalcul y, now that we have a nice height
								var y = parseInt(o.getAttribute('y') || 0) + objectGroup.getPositionOffset().y;
		                        // Correct y position. (Tiled uses Flipped, cocos2d uses Standard)
		                        y = this.getMapSize().height * this.getTileSize().height - y;
		                        dict["y"] = y;



							break;
						}

                        // Add the object to the objectGroup
                        objectGroup.setObjects(dict);
                        // The parent element is now "object"
                        this.setParentElement(cc.TMXPropertyObject);
                    }
                }

                this.setObjectGroups(objectGroup);
                // The parent element is now "objectgroup"
                this.setParentElement(cc.TMXPropertyObjectGroup);
            }
        }

        // PARSE <map><property>
        var properties = mapXML.querySelectorAll('map > properties > property')
        if (properties) {
            for (i = 0; i < properties.length; i++) {
                var property = properties[i]

                if (this.getParentElement() == cc.TMXPropertyNone) {
                    cc.Log("TMX tile map: Parent element is unsupported. Cannot add property named " + property.getAttribute('name') + " with value " + property.getAttribute('value'));
                }
                else if (this.getParentElement() == cc.TMXPropertyMap) {
                    // The parent element is the map
                    var value = new String(property.getAttribute('value'));
                    var key = property.getAttribute('name');
                    this.getProperties()[key] = value;
                }
                else if (this.getParentElement() == cc.TMXPropertyLayer) {
                    // The parent element is the last layer
                    var layer = this.getLayers()[0];
                    var value = new String(property.getAttribute('value'));
                    var key = property.getAttribute('name');
                    // Add the property to the layer
                    layer.getProperties()[key] = value;
                }
                else if (this.getParentElement() == cc.TMXPropertyObjectGroup) {
                    // The parent element is the last object group
                    var objectGroup = this.getObjectGroups()[0];
                    var value = new String(property.getAttribute('value'));
                    var key = property.getAttribute('name');
                    objectGroup.getProperties()[key] = value;
                }
                else if (this.getParentElement() == cc.TMXPropertyObject) {
                    // The parent element is the last object
                    var objectGroup = this.getObjectGroups()[0];
                    var dict = objectGroup.getObjects()[0];

                    var propertyName = property.getAttribute('name');
                    var propertyValue = new String(property.getAttribute('value'));
                    dict[propertyName] = propertyValue;
                }
                else if (this.getParentElement() == cc.TMXPropertyTile) {
                    var dict;
                    dict = this.getTileProperties()[this.getParentGID()];

                    var propertyName = property.getAttribute('name');
                    var propertyValue = new String(property.getAttribute('name'));

                    dict[propertyName] = propertyValue;
                }
            }
        }

        return map;
    },
 
 
/*
 * a object build on the base of a cc.TMXLayer that can render a tile on a objectgroup, a tile hat is not aligned on a grid
 */
cc.TMXObjectLayer = cc.Node.extend( {
	ctor:function () {
        this._super();
        this._children = [];
        this._descendants = [];
        this._isUseCache = true;
    },
	_vertexZForPos:function (pos) {
        var ret = 0;
        var maxVal = 0;
        if (this._useAutomaticVertexZ)
            ret = -(this._layerSize.height - pos.y);
        else {
            ret = this._vertexZvalue;
        }
        return ret;
    },
    initWithTilesetInfo:function ( tilesetInfos, objectGroupInfo, mapInfo) {
        

		this._objects = objectGroupInfo.getObjects();
		this._tileSets = tilesetInfos;
		this._name = objectGroupInfo.getGroupName();

		this.atlases = {};
		var atlas = null;
        var texture = null;
        if (tilesetInfos)
			for( var i = 0 ; i < tilesetInfos.length ; i ++ ){

				texture = cc.TextureCache.sharedTextureCache().addImage(tilesetInfos[i].sourceImage.toString());

				atlas = cc.SpriteBatchNode.createWithTexture( texture, this._objects.length );

				this.atlases[ tilesetInfos[ i ].name ] = atlas;

				this.addChild( atlas , i );

				// set the property for the tileset
				tilesetInfos[ i ].imageSize = new cc.Size(texture.width, texture.height);

			}




		// associate the right tileset for each object
		for( var i = 0 ; i < this._objects.length ; i ++ ){

			o = this._objects[ i ];

			if( o.type != "tile" )
				continue;

			for( var j = 0 ; j < this._tileSets.length && o.gid < this._tileSets[ j ].firstGid ; j ++ );

			o.tileSetIndex = j;
		}

        return true;
    
	},

/**
     * Creates the tiles
     */
    setupTiles:function () {

		var o = null;
		var atlas , pos , rect , associateTileSet;
		for( var i = 0 ; i < this._objects.length ; i ++ ){

			o = this._objects[ i ];

			if( o.type != "tile" )
				continue;

			associateTileSet = this._tileSets[ o.tileSetIndex ];


			// rect in the tileSet
			rect = associateTileSet.rectForGID( o.gid );

			pos = cc.RectMake( o.x , o.y , o.width , o.height );

	        var z = i;

			atlas = this.atlases[ associateTileSet.name ];

			this._setNodeDirtyForCache();
			atlas._setNodeDirtyForCache();


	        this._reusedTile = new cc.Sprite();
	        this._reusedTile.setParent( atlas );
	        this._reusedTile.initWithBatchNode( atlas , rect);

	        this._reusedTile.setPosition( pos.origin );
	        this._reusedTile.setVertexZ( 0 );
	        this._reusedTile.setAnchorPoint( cc.PointZero() );
	        //this._reusedTile.setOpacity(this._opacity);
	        this._reusedTile.setTag(z);

	        atlas.addQuadFromSprite( this._reusedTile, z );

	        // append should be after addQuadFromSprite since it modifies the quantity values
	        //atlas._atlasIndexArray = cc.ArrayAppendObjectToIndex( atlas._atlasIndexArray, z, indexForZ );
		}

    },
	getName : function(){
		return this._name;
	},
	_getBoundaryBox : function(){

		var top    = 0 , bottom = Infinity , left = Infinity ,  right = 0;
		for( var i = 0 ; i < this._objects.length ; i ++ ){

			o = this._objects[ i ];

			if( o.type != "tile" )
				continue;

			if( o.x < left )
				left = o.x;
			else
			if( o.x < right )
				right = o.x;

			if( o.y < bottom )
				bottom = o.y;
			else
			if( o.y > top )
				top = o.y;

		}
		return new cc.Rect( bottom , left , right - left , top - bottom );
	},
	getContentSize : function(){
		if( !this._boundaryBox )
			this._boundaryBox = this._getBoundaryBox();
		return this._boundaryBox;
	}

} );

cc.TMXObjectLayer.create = function (tilesetInfo, objectGroupInfo, mapInfo) {
    var ret = new cc.TMXObjectLayer();
    if (ret.initWithTilesetInfo(tilesetInfo, objectGroupInfo, mapInfo)) {
        return ret;
    }
    return null;
};
 
/*
 * modified the behavior of the TMXTileMap so it can instanciate a TMXObjectLayer
 */
 cc.TMXTiledMap.prototype._parseObjectGroup = function (objectGroupInfo, mapInfo) {
        var tilesets = this._tilesetForObjectGroup(objectGroupInfo, mapInfo);
        var layer = cc.TMXObjectLayer.create(tilesets, objectGroupInfo, mapInfo);
        layer.setupTiles();

        return layer;
    }
 cc.TMXTiledMap.prototype._tilesetForObjectGroup = function (objectGroupInfo, mapInfo) {
        var tilesets = mapInfo.getTilesets();
        var objects = objectGroupInfo.getObjects();

		var tileset , o ;

        if (tilesets && objects) {
            var list = [];
            for (var i = tilesets.length - 1; i >= 0; i--) {
                tileset = tilesets[i];
                if (tileset) {
                    for (var j = 0; j < objects.length ; j++) {
                        o = objects[ j ];
						if( o.type != "tile" )
							continue;
                        if ( o.gid !== 0 && o.gid >= tileset.firstGid ){
                            list.push( tileset );
							j = objects.length;
						}
                    }
                }
            }
			return list;
        }

        // If all the tiles are 0, return empty tileset
        cc.Log("cocos2d: Warning: TMX Layer " + layerInfo.name + " has no tiles");
        return null;
    }
/* 
 * this function is present in the orginal alpha 0.5,
 * but somes features that we needed were implemented
 * in this case, we check for a tile layer named collision, the tile that he contains will be added to the collision area
 * and a TMXObjectLayer will be instanciate if needed
 * see below 
 */
cc.TMXTiledMap.prototype.initWithTMXFile = function (tmxFile) {
        cc.Assert(tmxFile != null && tmxFile.length > 0, "TMXTiledMap: tmx file should not be nil");

        this.setContentSize(cc.SizeZero());

        var mapInfo = cc.TMXMapInfo.create(tmxFile);

        if (!mapInfo) {
            return false;
        }
        cc.Assert(mapInfo.getTilesets().length != 0, "TMXTiledMap: Map not found. Please check the filename.");

        this._mapSize = mapInfo.getMapSize();
        this._tileSize = mapInfo.getTileSize();
        this._mapOrientation = mapInfo.getOrientation();
        this.setObjectGroups(mapInfo.getObjectGroups());
        this.setProperties(mapInfo.getProperties());
        this._tileProperties = mapInfo.getTileProperties();

        var idx = 0;

        var layers = mapInfo.getLayers();
        if (layers) {
            this._TMXLayers = new Object();

            var layerInfo = null;
            for (var i = 0, len = layers.length; i < len; i++) {
                layerInfo = layers[i];

				// --- derive from original
				// at this point, we check if a layer name start by collision, if so, the tile will be added has a collapse zone
				// therefor, it need to be a object layer named collision
				// check for a layer named collision, pass it has a element of groupObject,  
				// sadly, cocos2d dont parse the property on a layer, match the name instead
				if( layerInfo.name.indexOf( "collision" ) == 0 ){
					var collisionGroupObject =  this.objectGroupNamed( "collision" );

					collisionGroupObject._objects.push( {
						name : layerInfo.name.length > 10 ? layerInfo.name.substring( 10 ) : "",
						type : "tilesGrid",
						tiles : layerInfo._tiles,
						mapSize : mapInfo.getMapSize(),
						tileSize : mapInfo.getTileSize()
					} );
				}
				// --

                if (layerInfo && layerInfo.visible) {
                    var child = this._parseLayer(layerInfo, mapInfo);
                    this.addChild(child, idx, idx);
                    //todo add layer
                    // record the cc.TMXLayer object by it's name
                    var layerName = child.getLayerName();
                    this._TMXLayers[layerName] = child;

                    // update content size with the max size
                    var childSize = child.getContentSize();
                    var currentSize = this.getContentSize();
                    currentSize.width = Math.max(currentSize.width, childSize.width);
                    currentSize.height = Math.max(currentSize.height, childSize.height);
                    this.setContentSize(currentSize);

                    idx++;
                }
            }
        }



		// instanciation des objectGroup layer
		//initWithTilesetInfo:function ( tilesetInfos, objectGroupInfo, mapInfo)
		var objectGroups = mapInfo.getObjectGroups();
		if( objectGroups ){
			var object = null;
			for( var i = 0 ; i < objectGroups.length ; i ++ ){
				object = objectGroups[ i ];
				var child = this._parseObjectGroup( object , mapInfo);
                    this.addChild(child, idx, idx);
                    //todo add layer
                    // record the cc.TMXLayer object by it's name
                    var layerName = child.getName();
                    this._TMXLayers[layerName] = child;

                    // update content size with the max size
                    var childSize = child.getContentSize();
                    var currentSize = this.getContentSize();
                    currentSize.width = Math.max(currentSize.width, childSize.width);
                    currentSize.height = Math.max(currentSize.height, childSize.height);
                    this.setContentSize(currentSize);

                    idx++;


			}
		}

        return true;
    }
 
/////////
/*
  * Somes tool for polygone
  *
  */
cc.Polygon = {};

/**
 * return the smallest box which contains the polygon
 * @function
 * @param { cc.Polygon }  polygon
 * @return {cc.Rect}
 * Constructor
 */
cc.Polygon.getBoundaryBox = function( polygon ){
	if( polygon.length <= 0 )
		return;

	var top    = polygon[0].y;
	var bottom = polygon[0].y;
	var left   = polygon[0].x;
	var right  = polygon[0].x;

	for( var i = 1 ; i < polygon.length ; i ++ ){
		if( top < polygon[ i ].y )
			top = polygon[ i ].y;
		else 
		if( bottom > polygon[ i ].y )
			bottom = polygon[ i ].y;

		if( left > polygon[ i ].x )
			left = polygon[ i ].x;
		else 
		if( right < polygon[ i ].x )
			right = polygon[ i ].x;
	}

	return new cc.Rect( left , bottom , right - left , top - bottom );
}


/**
 * return true if the circle define by it center ( c  ) and it radius ( r ) collapse the polygon
 * using a sat-based method
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Polygon }  polygon
 * @return { boolean }  
 * Constructor
 */
cc.Polygon.collisionCircleToPolygon = function( c , r , polygon ){

	// in order to win a few precious second, several adjustement have been done that dont make the code so easy to read,
	// the object are used the less possible, ( for exemple an object point ( x , y ) is replace by the two number ox , oy
	// store the value of length for the loop on the array does speed up noticablely the execution
	// the use of Math.pow for a rise to square is a millisecond pit, compare to a simple a * a


	// order of the vertex, ( counterclockwise or clockwise )
	// because the polygone is not restricted to an order ( it can be wether one or the other )
	var ref = ( polygon[ 1 ].x - polygon[ 0 ].x ) * ( polygon[ 2 ].y - polygon[ 1 ].y ) + ( polygon[ 0 ].y - polygon[ 1 ].y ) * ( polygon[ 2 ].x - polygon[ 1 ].x ) >= 0; 

	var square_r = r *r;
	var len = polygon.length;

	//
	// first, discard the circle if it is too far from the edge ( and in the wrong side of side of this edge )
	// lets use the loop to determine the closest vertex, usefull for the second part

	var ax = polygon[ len-1 ].x , ay = polygon[ len-1 ].y ,
		cx = c.x , cy = c.y ,
		cbx , cby ,
		bx , by , 
		abx, aby,
		min_dist = Infinity ,
		det  ,  closest_p , square_CB ;

	for( var i = 0 ; i < len ; i ++ ){
		bx = polygon[ i ].x;
		by = polygon[ i ].y

		cbx = bx - cx;
		cby = by - cy;

		abx = bx - ax;
		aby = by - ay;

		det = abx  *  cby - aby  *  cbx ;

		// check if too far from the edge
		if( det >= 0 == ref ){
			// the center is outside the edge a b
			// if the distance from the line a b to the center is up to it radius, the collision can not be
			if( square_r < det * det / ( abx*abx + aby*aby ) ) // prevent the use of squareRoot ( rise to square the two hands )
				return false;
		}

		// check for the closest vertex to the center
		square_CB = cbx*cbx + cby*cby;
		if( min_dist > square_CB ){
			//check if the point b is in the circle
			if( square_CB < square_r ) // notice that this test will be run later, its a test for an early exit, skipping the the edge in the loop 
				return true;
			min_dist = square_CB;
			closest_p = i;
		}
		ax = bx;
		ay = by;
	}

	// 
	// the center is include in a domain that have the shape of the polygon with a expansion of the value of the radius
	// the only domain remaining where the circle does not collapse is in the corner of this expanded shape, 
	// lets check if the center of the circle is in the last domain, delimited by the two line that form the closest vertex ( the line formed by the vertex and the previous one, and the vertex and the next one )

	var prev = polygon[ ( closest_p -1 + len ) % len ];
	var next = polygon[ ( closest_p +1 ) % len ];

	var CloseCx = c.x - polygon[ closest_p ].x ,
		CloseCy = c.y - polygon[ closest_p ].y ;

	if( 	( prev.x - polygon[ closest_p ].x ) * CloseCx + ( prev.y - polygon[ closest_p ].y ) * CloseCy < 0		
		 &&	( next.x - polygon[ closest_p ].x ) * CloseCx + ( next.y - polygon[ closest_p ].y ) * CloseCy < 0		// in the domain
		 &&  CloseCx * CloseCx + CloseCy * CloseCy > square_r  )
			return false;

	return true;
}


/**
 * assume there is a collision between the polygon and the circle 
 * return the normal at the edge where the collision happen,
 * if its happen on a vertex, return the direction to the vertex
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Polygon }  polygon
 * @return { cc.Point }  
 * Constructor
 */
 // need to be tested
 // probably false in this current state
cc.Polygon.collisionReactionCircleToPolygon = function( c , r , polygon ){

	var ref = ( polygon[ 1 ].x - polygon[ 0 ].x ) * ( polygon[ 2 ].y - polygon[ 1 ].y ) + ( polygon[ 0 ].y - polygon[ 1 ].y ) * ( polygon[ 2 ].x - polygon[ 1 ].x ) >= 0; 

	var square_r = r *r;
	var len = polygon.length;

	//
	// first, discard the circle if it is too far from the edge ( and in the wrong side of side of this edge )
	// lets use the loop to determine the closest vertex, usefull for the second part

	var ax = polygon[ len-1 ].x , ay = polygon[ len-1 ].y ,
		cx = c.x , cy = c.y ,
		cbx , cby ,
		bx , by , 
		abx, aby,
		min_dist = Infinity ,
		det  ,  closest_p , square_CB ,
		n;

	for( var i = 0 ; i < len ; i ++ ){
		bx = polygon[ i ].x;
		by = polygon[ i ].y

		cbx = bx - cx;
		cby = by - cy;

		abx = bx - ax;
		aby = by - ay;

		det = abx  *  cby - aby  *  cbx ;

		// check if too far from the edge
		if( det >= 0 == ref ){

			// the centre is in the band delimited by the edge and the dilated edge

			// check if the center is outside the bordered band, delimited by the corner

			if( abx * cbx + aby * cby < 0 ){
				// out of the band, by the b corner
				n = Math.square( cbx*cbx + cby * cby );
				return cc.PointMake( -cbx/n , -cby/n );
			}

			// use the var cb, but its ac
			cbx = cx - ax;
			cby = cy - ay;

			if( abx * cbx + aby * cby < 0 ){
				// out of the band, by the b corner
				n = Math.square( cbx*cbx + cby * cby );
				return cc.PointMake( cbx/n , cby/n );
			}

			// c is actually in the delimited band
			n = Math.square( abx * abx + aby * aby );
			if( ref )
				return cc.PointMake( aby/n , -abx/n );
			else
				return cc.PointMake( -aby/n , abx/n );
		}

		ax = bx;
		ay = by;
	}

	// the center is in the polygon
	return cc.PointMake( 1, 0);
}



/**
 * split a polygone in two,
 * i and j are wether integer or float
 * if integer, its the corner where the split happen
 * if float, its the point where the split happen, its lineary placed on the edge, ( 1.5 is the midlle of the second edge )
 * return an array of two polygon , the first is the one that contains the firsts vertex ( its contains 0 , 1 .. until the break )
 * @function
 * @param { Array cc.Point }  polygon
 * @param { Number }  i
 * @param { Number }  j
 * @return {  Array of Array cc.Point}   
 */
cc.Polygon.split = function( polygon , i , j ){

	var one = [];
	var two = [];

	if( i > polygon.length -1 || j > polygon.length -1  )
		return [ polygon , [] ];


	if( i > j ){
		var tmp = j ;
		j = i;
		i = tmp;
	}

	var k;

	// build the firsts corners of one
	for( k = 0 ; k <= Math.floor(i) ; k ++ )
		one.push( polygon[ k ] );

	// if i is an integer
	if( i == Math.floor(i) )
		// one and two have polygon[ k ] in common
		two.push( polygon[ (k - 1 + polygon.length) % polygon.length ] );
	else{
		// one and two have e in common, where e is somewhere between i and j
		var alpha = i-k+1;
		var beta = 1 - alpha;
		var e = {
			x : polygon[ (k - 1 + polygon.length) % polygon.length ].x * alpha + polygon[ k ].x * beta,
			y : polygon[ (k - 1 + polygon.length) % polygon.length ].y * alpha + polygon[ k ].y * beta
		}
		one.push( e );
		two.push( e );
	}

	// build the corners of two
	for(  ; k <=  Math.floor( j ) ; k ++ )
		two.push( polygon[ k ] );

	// if j is an integer
	if( j == Math.floor(j) )
		// one and two have polygon[ k ] in common
		one.push( polygon[ (k - 1 + polygon.length) % polygon.length ] );
	else{
		// one and two have e in common, where e is somewhere between i and j
		var alpha = j-k+1;
		var beta = 1 - alpha;
		var e = {
			x : polygon[ (k - 1 + polygon.length) % polygon.length ].x * alpha + polygon[ k ].x * beta,
			y : polygon[ (k - 1 + polygon.length) % polygon.length ].y * alpha + polygon[ k ].y * beta
		}
		one.push( e );
		two.push( e );
	}

	// build the corners of one
	for(  ; k < polygon.length ; k ++ )
		one.push( polygon[ k ] );


	return [ one , two ];
}

/**
 * return true if the circle define by it center ( c  ) and it radius ( r ) collapse the rectangle
 * using a sat method on the x and y axes
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Rect }  rect
 * @return { boolean }  
 * Constructor
 */
cc.Polygon.collisionCircleRect = function( c , r , rect ){

return ( 	rect.origin.x - r < c.x && c.x < rect.origin.x + rect.size.width + r 
		&&  rect.origin.y- r < c.y && c.y < rect.origin.y + rect.size.height + r ); 


}


/**
 * return the rectangle as a array of point
 * @function
 * @param { cc.Rect }  rect
 * @return { Array of cc.Point }  
 * Constructor
 */
cc.Polygon.RectToPoly = function( rect ){
	return [ 	cc.PointMake( rect.origin.x , rect.origin.y ) ,
				cc.PointMake( rect.origin.x + rect.size.width , rect.origin.y ),
				cc.PointMake( rect.origin.x + rect.size.width , rect.origin.y + rect.size.height ),
				cc.PointMake( rect.origin.x , rect.origin.y + rect.size.height ) ];
}

/**
 * return an array of Polygon, each one is convexe and all form a partition of the polygon given in argument
 * @function
 * @param { Array of cc.Point } polygon
 * @return { Array of Array of cc.Point }  
 * Constructor
 */
cc.Polygon.splitInConvexesEars = function( polygon  ){

	// we will use the det for determinate if the point is in or out a side,
	// we dont know if a positif mean out or inside, ( because the is no restriction on the order of the corner )
	// we will perform a check, on all the corner and determine which is the most common 

	// +1 for each positive det , -1 for each neg
	var sum_order = 0;

	var each_order = new Array( polygon.length );

	var a = polygon[ polygon.length -2 ] , b = polygon[ polygon.length -1 ] , c;

	for( var k = 0 ; k < polygon.length ; k ++ ){

		// a then b then c

		c = polygon[ k ];

		// check if c is on the right side of the edge a b

		var det = ( a.x - b.x ) * ( c.y - b.y ) + ( b.y - a.y ) * ( c.x - b.x );

		if( det >= 0 ){
			each_order[ ( k-1+polygon.length)%polygon.length ] = true;
			sum_order ++;
		} else {
			each_order[ ( k-1+polygon.length)%polygon.length ] = false;
			sum_order --;
		}
		a = b;
		b = c;
	}

	// it is convexe
	if( Math.abs( sum_order ) == polygon.length )
		return [ polygon ];


	// lets assume the majority of vertex will not be notch
	// so if sum_order is positive we got a majority of positive det, so assume that a non not vertex has a positive vertex ( respectively negative )
	var order = sum_order >= 0 ;


	var notchs = [];
	var notch = null;
	var A , B , Av1 , Av2;
	for( var i = 0 ; i < each_order.length ; i ++ ){
		if( each_order[ i ] == order )
			continue;

		notch = {
			i : i ,
			link : [ (i+1)%polygon.length ]
			};

		A = polygon[ i ];
		Av2 = { x : A.x - polygon[ (i+1)%polygon.length ].x ,
				y : A.y - polygon[ (i+1)%polygon.length ].y  }; // prev neightbour vect
		Av1 = { x : polygon[ (i-1+polygon.length)%polygon.length ].x - A.x ,
				y : polygon[ (i-1+polygon.length)%polygon.length ].y - A.y }; // next neightbour vect


		// check the linkability with all the vertex
		var j;
		for( var aj = 2 ; aj < polygon.length - 1 ; aj ++ ){

			j = (i+aj)%polygon.length

			B = polygon[ j ];

			// check the direction of AB ( need to be inside the polygon, at least localy )
			if( ( B.x - A.x ) * Av1.y + ( A.y - B.y ) * Av1.x > 0 == order 			// right side of first neightbour
			 && ( B.x - A.x ) * Av2.y + ( A.y - B.y ) * Av2.x > 0 == order )		// right side of second neightbour
				continue;

			// check the exit on the segment A B
			var accept = true;
			for( var k = 1 ; k < polygon.length - 1 ; k ++ ){
				if( ( j + k + 1 ) % polygon.length == i  ){ // dont check the intersection with a segment that pass by A ( meaning the segment xA and Ax ) 
					k ++; 	// skip the segment Ax
					continue;
				}
				if( false != cc.Polygon.intersectionSegmentSegment( A , B , polygon[ ( j + k ) % polygon.length ] ,  polygon[ ( j + k + 1 ) % polygon.length ] ) ){
					accept = false;
					break;
				}
			}
			if( accept )
				notch.link.push( j );
		}

		notch.link.push( ( i-1+polygon.length)%polygon.length );

		notchs.push( notch );
	}

	// estimation of the largest sub poly
	for( var i = 0 ; i < notchs.length ; i ++ ){

		var er = [ notchs[ i ].i  ];
		for( var k = notchs[ i ].link.length-1 ; k >= 0 ; k -- ){
			var l = notchs[ i ].link[ k ];
			if( l != ( er[ 0 ] -1 + polygon.length ) % polygon.length || each_order[ l ] != order )
				break;	
			var e = polygon[ l ];
			if( er.length > 2 ){

				// if we add e to the stack, does it stiff form a convex polygon
				// check for the convexity of the new coner
				var a  = polygon[ er[ 0 ] ],								// corner next
					b  = polygon[ er[ 1 ] ];
				var det = ( a.x - b.x ) * ( e.y - b.y ) + ( b.y - a.y ) * ( e.x - b.x );
				if( det > 0 != order )
					break;

				var a  =  polygon[ er[ ( er.length-2 + er.length )% er.length ] ],		// corner prev
					b  =  polygon[ er[ ( er.length-1 + er.length )% er.length ] ];
				var det = ( e.x - a.x ) * ( b.y - a.y ) + ( a.y - e.y ) * ( b.x - a.x );
				if( det > 0 != order )
					break;

				var a  =  polygon[ er[ ( er.length-1 + er.length )% er.length ] ],		// corner new 
					b  =  polygon[ er[ 0 ] ];
				var det = ( a.x - e.x ) * ( b.y - e.y ) + ( e.y - a.y ) * ( b.x - e.x );
				if( det > 0 != order )
					break;
			}
			er.unshift( l );
		}

		var ea = [ notchs[ i ].i  ];
		for( var k = 0 ; k < notchs[ i ].link.length ; k ++ ){
			var l = notchs[ i ].link[ k ];
			if( l != ( ea[ ea.length - 1 ] +1 ) % polygon.length || each_order[ l ] != order ) // point have to be consecutive, l have to be next ,
				break;	
			var e = polygon[ l ];
			if( ea.length > 2 ){

				// if we add e to the stack, does it stiff form a convex polygon
				// check for the convexity of the new coner
				var a  =  polygon[ ea[ ( ea.length-2 + ea.length )% ea.length ] ],		// corner prev
					b  =  polygon[ ea[ ( ea.length-1 + ea.length )% ea.length ] ];
				var det = ( a.x - b.x ) * ( e.y - b.y ) + ( b.y - a.y ) * ( e.x - b.x );
				if( det > 0 != order )
					break;

				var a  =  polygon[ ea[ 0% ea.length ] ],										// corner next
					b  =  polygon[ ea[ 1% ea.length ] ];
				var det = ( e.x - a.x ) * ( b.y - a.y ) + ( a.y - e.y ) * ( b.x - a.x );
				if( det > 0 != order )
					break;

				var a  =  polygon[ ea[ ( ea.length-1 + ea.length )% ea.length ] ],		// corner new 
					b  =  polygon[ ea[ 0% ea.length ] ];
				var det = ( a.x - e.x ) * ( b.y - e.y ) + ( e.y - a.y ) * ( b.x - e.x );
				if( det > 0 != order )
					break;
			}
			ea.push( l );
		}

		if( er.length > ea.length )
			ea = er;

		if( ea.length > 2 ){
			// form the dual polygon
			var dual = [];
			var next = ea[ ea.length-1 ];
			while( next != ea[ 0 ] ){
				dual.push( polygon[ next ] );
				next = ( next + 1 ) % polygon.length;
			}
			dual.push( polygon[ next ] );

			var stack = [];
			for( var k = 0 ; k < ea.length ; k ++ )
				stack.push( polygon[ ea[ k ] ] );
			return [ stack ].concat( cc.Polygon.splitInConvexesEars( dual ) );

			//return [ stack ];
		}
	}

	return null;
}


/** 
 * return either false if there is no intersection with the two segments 
 * the segment are A1A2 and B1B2
 * or { t1 , t2 }  where A1 +  ( A2 - A1 ) * t1 =  B1 +  ( B2 - B1 ) * t2  is the intersection of the two segment   ( yeah, right tA , tB would be better )
 * the function doesnt not react well with null segment ( A1 = A2 )
  * @function
 *  @param { cc.Point } A1
 *  @param { cc.Point } A2
 *  @param { cc.Point } B1
 *  @param { cc.Point } B2
 *  @return { t1 : number , t2 : number }  
 * Constructor
 */
cc.Polygon.intersectionSegmentSegment = function( A1 , A2 , B1 , B2 ){
	var 
	VAx = A2.x - A1.x,
	VAy = A2.y - A1.y,
	VBx = B2.x - B1.x,
	VBy = B2.y - B1.y,
	PAx = A1.x,
	PAy = A1.y,
	PBx = B1.x,
	PBy = B1.y;

	if( VBy * VAx - VBx * VAy == 0 )		// colineaire
		return false;

	if( VBy == 0 ){				
		var ta = ( PBy - PAy )/VAy;			// VAy != 0 sinon VA VB colineaires
		if( ta < 0 || 1 < ta)
			return false;
		var tb = ((PAx-PBx)+VAx*ta)/VBx;	// VBx != 0 sinon B1 == B2
		if( tb < 0 || 1 < tb)
			return false;
		return { ta:ta , tb:tb };
	}
	if( VAx == 0 ){
		var tb = ( PAx - PBx )/VBx;	
		if( tb < 0 || 1 < tb)
			return false;
		var ta = ((PBy-PAy)+VBy*tb)/VAy;
		if( ta < 0 || 1 < ta)
			return false;
		return { ta:ta , tb:tb };
	}
	var ta = (  (( PBx - PAx )  + VBx/VBy*(PAy-PBy) )/VAx )/( 1 - VBx * VAy / VAx / VBy );
	if( ta < 0 || 1 < ta)
		return false;
	var tb = ((PAy-PBy)+VAy*ta)/VBy;
	if( tb < 0 || 1 < tb)
		return false;
	return { ta:ta , tb:tb };

}
	


////////
/*
 * basic collision engine, based on a TMX map info
 *
 */
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
	
	
	
	
/*
 * here a exemple of code using the tmx addition 
 */
/*
		// initiate the tmx related
		var map = cc.TMXTiledMap.create("building.tmx"); 

		// initiate the detector associate
		this.collisionDetector = new CollisionDetector();				
		this.collisionDetector.initMap( map.objectGroupNamed( "collision" ) );
		
		// draw the tileMap ( also draw the object in a objectLayer ) 
		this.addChild( map );
		
		// a node that know how to draw the collision area
		var dnode = this.collisionDetector.getDrawedCollisionPattern();
		this.addChild( dnode ); 
	
		// [ .. ]
		
		
		// if nothing goes wrong the pos will be ghost
		var position = cc.PointMake( 500 , 480 );
		
		var radius = 10;
		
		
		// check for collision
		lbls = this.collisionDetector.checkCollision( point , radius );


		for( var i = 0 ; i < lbls.length ; i ++ )
			switch( lbls[ i ].lbl ){
				case "label of the collision area":
					// [ .. ]
				break;
			}
	
*/
	
	
	
	
	
	
	