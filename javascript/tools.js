/*!
 * MseInterface library
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
           Florent Baldino
           Arthur Brongniart
 * Copyright, Encre Nomade
 */


var tag = {
	drawstarted: false
};
var prevState = {};
var curr = {
    objId: 0
};


// Transforme css coordinary to number
function cssCoordToNumber(c){
	return parseFloat(c.substring(0,c.indexOf('px')));
}

// Check if a string represent a color
function isColor(c) {
	return getColorHex( c ) != false;
}

// know how to interpret the follownig representation :
//	-   "#FC3"
//	-   "#F3C431"
//	-   "rgb( 34 , 123 , 255 )"
//	-   "rgba( 34 , 123 , 255 , 0.56 )"
// whatever is given in entry, return the color under the "#F3C431" representation
// return false if non of the representation match
function getColorHex( c ){
	var r , v , b;
	function hexaToDec( x ){
		var ix = parseInt( x );
		if( !isNaN( ix ) )
			return ix;
		switch( x.toLowerCase() ){
				case "a" : return 10;
				case "b" : return 11;
				case "c" : return 12;
				case "d" : return 13;
				case "e" : return 14;
				case "f" : return 15;
		}
	}
	function decToHex( x ){
		if( x < 10 )
			return ""+x;
		switch( x ){
				case 10 : return "a";
				case 11 : return "b";
				case 12 : return "c";
				case 13 : return "d";
				case 14 : return "e";
				case 15 : return "f";
		}
	}
	if( c.match( /^#[0-9abcdefABCDEF]{3}$/ ) ){			// #C34     ~=  #CC3344
		r = hexaToDec( c.charAt(1) ) * 17;
		v = hexaToDec( c.charAt(2) ) * 17;
		b = hexaToDec( c.charAt(3) ) * 17;
	} else
	if( c.match( /#[0-9abcdefABCDEF]{6}/ ) ){			//#23A4F3
		r = hexaToDec( c.charAt(1) ) * 16 + hexaToDec( c.charAt(2) );
		v = hexaToDec( c.charAt(3) ) * 16 + hexaToDec( c.charAt(4) );
		b = hexaToDec( c.charAt(5) ) * 16 + hexaToDec( c.charAt(6) );
	} else
	if( c.match( /^rgba?\( *[0-9]+ *, *[0-9]+ *, *[0-9]+ *(, *[0-9.]* *)?\)$/ ) ){			//rgb( 234 , 45 , 65 )    ||  rgba( 234 , 34 , 56 , 1.4 )
		r = parseInt( (( /^rgba?\( *([0-9]+) *, *[0-9]+ *, *[0-9]+/ ).exec( c ) || [ "a" , "a"] )[ 1 ] );
		v = parseInt( (( /^rgba?\( *[0-9]+ *, *([0-9]+) *, *[0-9]+/ ).exec( c ) || [ "a" , "a"] )[ 1 ] );
		b = parseInt( (( /^rgba?\( *[0-9]+ *, *[0-9]+ *, *([0-9]+)/ ).exec( c ) || [ "a" , "a"] )[ 1 ] );
	}else
		return false;
	
	if(    typeof( r ) != "number" || isNaN( r ) || 0 > r || r > 255 
		|| typeof( v ) != "number" || isNaN( v ) || 0 > v || v > 255 
		|| typeof( b ) != "number" || isNaN( b ) || 0 > b || b > 255 )
		return false;
	
	var d = ( 256 * ( r * 256 + v ) + b );
	
	var hex = "#"+decToHex( Math.floor( r/16 ) )+decToHex( r%16 )  +  decToHex( Math.floor( v/16 ) )+decToHex( v%16 )  +  decToHex( Math.floor( b/16 ) )+decToHex( b%16 );
	
	return hex;
}

// Check if it's a ratio in the range given
function isRatio(r, range) {
	if(!isNaN(r) && r >= 0 && r <= range) return true;
	else return false;
}

// Swtich caps lock status
function capslockCheck(e) {
	e = e || window.event;
	var kc = e.keyCode?e.keyCode:e.which;
	var caps = (kc == 16) ? true:false;
	var sk = (e.shiftKey ? (caps?false:true) : (caps?true:false));
	if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
		curr.caps = true;
	else curr.caps = false;
}

function utf8_encode (argString) {
    if (argString === null || typeof argString === "undefined") {
        return "";
    }
 
    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;
 
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
 
        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }
 
    if (end > start) {
        utftext += string.slice(start, stringl);
    }
 
    return utftext;
}
function base64_encode (data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];
 
    if (!data) {
        return data;
    }
 
    data = this.utf8_encode(data + '');
 
    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
 
        bits = o1 << 16 | o2 << 8 | o3;
 
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
 
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
 
    enc = tmp_arr.join('');
    
    var r = data.length % 3;
    
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

function objToClass(obj, classn) {
    var o = new classn();
    for(var key in obj) {
        if(obj[key] !== null && obj[key] !== undefined) o[key] = obj[key];
    } 
    return o;
}

var Callback = function(func, caller) {
    if(typeof func != 'function') return null; 
	this.func = func;
	this.caller = (typeof caller != 'object') ? window : caller;
	if(arguments.length > 2) {
		this.args = new Array();
		for(var i = 2; i < arguments.length; i++)
			this.args.push(arguments[i]);
	}
	
	this.link = function(cb) {
		if(!this.linked) this.linked = new Array();
		this.linked.push(cb);
	};
	
	this.invoke = function() {
		var arr = null;
		if(this.args) arr = (arguments.length>0 ? this.args.concat(Array.prototype.slice.call(arguments)) : this.args);
		else if(!this.args && arguments.length>0) var arr = arguments;
		this.func.apply(caller, arr);
		
		if(this.linked) {
			for(var i in this.linked) this.linked[i].invoke();
		}
	};
}

// Configration include resolution
var Config = (function() {
	function ConfigSingleton(args) {
		var args = args || {};
		// Scene width and height
		this.sheight = 480;
		// Actual width and height in book
		this.height = args.height || this.sheight;
		// Ratio
		this.ratio = this.sheight/this.height;
		if(this.ratio == 1 && !args.width) this.swidth = this.width = 640;
		else {
		    this.width = (args.width || (640/this.ratio));
		    this.swidth = this.ratio * this.width;
		}
		$('#editor').width(this.swidth).height(this.sheight);
		$('#rulerX').prop('width', this.swidth+17).prop('height', 15);
		$('#rulerY').prop('width', 15).prop('height',this.sheight+17);
		
		this.sceneX = function(x) {
			return Math.round(this.ratio * x);
		};
		this.sceneY = function(y) {
			return Math.round(this.ratio * y);
		};
		this.realX = function(x) {
			return Math.round(x / this.ratio);
		};
		this.realY = function(y) {
			return Math.round(y / this.ratio);
		};
		
		// Wiki Card size
		this.wikiWidth = this.sceneX(250);
		this.wikiHeight = this.sceneY(320);
		
		// Z-index list
		this.zid = {
		    'CreatTool' : 7,
		    'EditableTool' : 8,
		    'SceneInChoosing' : 106,
		    'EditorInChoosing' : 0,
		    'PagebarInChoosing' : 9,
		    'Scene' : 1
		};
		
		this.withdrawal = 45;
	}
	
	var instance;
	
	var _static = {
		init : function(args) {
			if(instance === undefined) instance = new ConfigSingleton(args);
		},
		getInstance : function() {
			return instance;
		}
	};
	return _static;
})();

var TextUtil = function() {
	var canvas = $('<canvas></canvas>');
	canvas.css({'position':'fixed','left':'-100px','right':'-100px','width':'0px','height':'0px'});
	$('body').append(canvas);
	var ctx = canvas.get(0).getContext('2d');
	
	var textEditPrepa = function(obj){
	    obj.parent().moveable(false).resizable(false);
	}
	var textEditFinish = function(content, obj) {
	    obj.parent().moveable().resizable();
	}
	
	return {
		config : function(font) {
			ctx.font = font;
		},
		measure : function(text) {
			return ctx.measureText(text).width;
		},
		checkNextline : function( text, maxM, width){
			// Next line is the whole text remaining
			if(maxM >= text.length) return text.length;
			// Forward check
			var prevId;
			var nextId = maxM;
			do {
				prevId = nextId;
				// Find next space
				var index = text.substr(prevId).search(/[\s\n\r\-\/\\\:]/);
				index = (index == -1) ? -1 : prevId+index;
				// No space after
				if(index == -1) {
					if(ctx.measureText(text).width <= width)
						prevId = text.length;
					break;
				}
				// Text length
				var l = ctx.measureText(text.substr(0, index));
				nextId = index+1;
			} while(l.width < width);
			// Forward check success
			if(prevId != maxM) {
				return prevId;
			}
			// Backward check when forward check failed
			else {// Find last space
				var lastsp = text.lastIndexOf(' ', maxM);
				if(lastsp == -1) return maxM;
				else return (lastsp+1);
			}
		},
		editPrepaCb : new Callback(textEditPrepa, window),
		editFinishCb : new Callback(textEditFinish, window)
	};
}();


var _nameValidationRegExp = /^[A-z\_][\w\d\_\-]*$/;
var nameValidation = function(name) {
    return _nameValidationRegExp.test(name);
}




// Drop zone
var DropZone = function(dropHandler, style, id){
    this.dropHandler = dropHandler;
    this.jqObj = $('<div class="drop_zone"/>');
    if(style) this.jqObj.css(style);
    if(id) this.jqObj.prop('id', id);
    this.jqObj.data('typeChecker', this.typeChecker);
    // Interaction with drop zone
    this.jqObj.bind('dragover', this.dragOverElemZone)
              .bind('dragleave', this.dragLeaveElemZone)
              .bind('drop', this.dropHandler);
    this.jqObj.mouseup(this.dragLeaveElemZone);
};
DropZone.prototype = {
    constructor: DropZone,
    dragOverElemZone: function(e) {
        e = e.originalEvent;
    	e.preventDefault();
    	e.dataTransfer.dropEffect = 'copy';
    	$(this).css('border-style', 'solid');
    	return false;
    },
    dragLeaveElemZone: function(e) {
        if($(this).hasClass('drop_zone')) $(this).css('border-style', 'dotted');
        else $(this).css('border-style', 'none');
    },
    appendTo: function(parent){this.jqObj.appendTo(parent);}
};



// Sources manager
// Drag the images from ressources
function dragFromSrcs(e) {
    e = e.originalEvent;
	e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
	e.dataTransfer.setData('Text', $(this).data('srcId')); // required otherwise doesn't work
};
var SourceManager = function() {
    this.currId = 0;
};
SourceManager.prototype = {
	constructor: SourceManager,
	sources: {},
	expos: {},
	acceptType: new Array('image', 'audio', 'game', 'anime', 'wiki', 'code' , 'speaker' ),
	rewritable: new Array('anime', 'wiki', 'code', 'speaker'),
	extCheck: /^data:\s*(\w+)\/(\w+)[;,]/,
	pathCheck: /^(\.\/)?([\w\_\s]+\/)*([\w\_\s\.]+)$/,
	uploadResp: /^([\w\_\s]+)\&\&([\w\_\s\.\/]+)/,
	
	// replace all the dependency from the oldObjId to the new one 
	// unsused
	replaceDependency : function( oldObjId , newObjId ){
		for( var i in this.sources ){
			if( sources[ i ].target == oldObjId )
				sources[ i ].target = newObjId;
			if( sources[ i ].supp == oldObjId )
				sources[ i ].supp = newObjId;
			if( srcType == "obj" && sources[ i ].src == oldObjId )
				sources[ i ].src = newObjId;
		}
	},
	sourceType: function(id) {
	    if(this.sources[id]) {
    		return this.sources[id].type;
		}
		else return "none";
	},
	dataExtension: function(str) {
	    if(typeof str != "string") return null;
	    var res = str.match(this.extCheck);
	    if(res != null && (res[1] == "image" || res[1] == "audio" || res[1] == "game")) 
	        return res[2];
	    else return null;
	},
	isExist: function(id) {
	    return ($.inArray(id, Object.keys(this.sources)) != -1);
	},
	addSource: function(type, data, id) {
		if($.inArray(type, this.acceptType) == -1) return false;
		// Data verification
		switch(type) {
		case 'image':
		case 'audio':
		case 'game':
		case 'code':
		    if(!(typeof data == "string")) return false;
		    break;
		case 'wiki':
		    if(!(data instanceof Wiki)) return false;
		    break;
		case 'anime':
		    if(!(data instanceof Animation)) return false;
		    break;
		case 'speaker':
		    if(!(data instanceof Speaker)) return false;
		    break;
		}
		
		if(!id) {
		    id = 'src'+this.currId;
		    this.currId++;
		}
		else if(this.sources[id] != null && $.inArray(type, this.rewritable) == -1) {
		    alert("Le nom de source existe déjà...");
		    return false;
		}
		
		// Source structure
		var src = {'type':type, 'data':null};
		// Generate expo
		var expo = $('<div class="icon_src" draggable="true"></div>');
		expo.bind('dragstart', dragFromSrcs);
		
		switch(type) {
		case 'image':
			// Add image source
			src.data = data;
			this.sources[id] = src;
			var img = $('<img name="'+ id +'"></img>');
			// Securely get the image width and height in Webkit
			var imageSrc = new Image();
			imageSrc.addEventListener('load', function(){
			    if(src) {
			        src.width = imageSrc.width;
			        src.height = imageSrc.height;
			    }
			}, false);
			imageSrc.src = data;
			img[0].src = imageSrc.src;
			
			expo.append(img);
			expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
			                 'delete':['./images/UI/del.png',this.prepareDelSource]});
			break;
		case 'audio':
		    // Add audio source
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<img class="srcicon_back" src="./images/UI/audio.png">');
		    expo.append('<p>Son: '+id+'</p>');
		    expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
		                     'delete':['./images/UI/del.png',this.prepareDelSource]});
		    break;
		case 'game':
		    // Add game source
		    if(!srcMgr.pathCheck.test(data)) {
		        var encoded = base64_encode(data);
		        src.data = "data:game/js;base64,"+encoded;
		    }
		    else src.data = data;
		    this.sources[id] = src;
		    expo.append('<img class="srcicon_back" src="./images/UI/HTML5game.png">');
		    expo.append('<p>Jeu: '+id+'</p>');
		    expo.circleMenu({'delete':['./images/UI/del.png',this.prepareDelSource]});
		    break;
		case 'wiki':
		    // Already exist
		    if(this.sources[id]) {
		        delete this.sources[id];
		        src.data = data;
		        this.sources[id] = src;
		        return id;
		    }
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<p>WIKI: '+id+'</p>');
		    expo.click(function(){
		        srcMgr.editWiki($(this).data('srcId'));
		    });
		    expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
		                     'delete':['./images/UI/del.png',this.prepareDelSource]});
		    break;
		case 'anime':
		    if(this.sources[id]) {
		        delete this.sources[id];
		        src.data = data;
		        this.sources[id] = src;
		        return id;
		    }
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<p>Anime: '+id+'</p>');
		    expo.circleMenu({'addscript':['./images/UI/addscript.jpg',addScriptDialog],
		                     'rename':['./images/UI/rename.jpg',this.renameDialog],
		                     'delete':['./images/UI/del.png',this.prepareDelSource]});
		    expo.click(function(){
		        srcMgr.getSource($(this).data('srcId')).showAnimeOnEditor();
		    });
		    break;
		case 'speaker':
		    if(this.sources[id]) {
		        delete this.sources[id];
		        src.data = data;
		        this.sources[id] = src;
		        this.expos[id].children('p').text('Speaker: '+data.name);
		        return id;
		    }
		    src.data = data;
		    this.sources[id] = src;
            data.srcId = id;
			expo.append('<img class="srcicon_back" src="' + data.getMoodUrl("neutre") +'" name="'+id+'">');
		    expo.append('<p>Speaker: '+data.name+'</p>');
		    expo.circleMenu({'delete': ['./images/UI/del.png', function(src){ CommandMgr.executeCmd(new RemoveSpeakerCmd(src)); }],
                             'config':['./images/UI/config.png', speakerMgr.modifySpeakerDialog],
		                     'addDialog':['./images/UI/dialog.png', speakerMgr.addDialogPopup]});
		    // expo.click(function(){
		        // srcMgr.getSource($(this).data('srcId')).showSpeakerOnEditor();
		    // });
		    break;
		case 'code':
		    if(this.sources[id]) {
		        delete this.sources[id];
		        src.data = data;
		        this.sources[id] = src;
		        return id;
		    }
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<img class="srcicon_back" src="./images/UI/addscript.jpg">');
		    expo.append('<p>Code: '+id+'</p>');
		    expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
		                     'delete':['./images/UI/del.png',this.prepareDelSource]});
		    expo.click(function(){
		        var name = $(this).data('srcId');
		        scriptTool.editScript(name, srcMgr.getSource(name));
		    });
		    break;
		}
		
		$('#Ressources_panel').prepend(expo);
		// Set expo
		expo.data('srcId', id);
		this.expos[id] = expo;
		this.uploaded = 0;
		return id;
	},
	getSource: function(id) {
	    if(this.sources[id])
    		return this.sources[id].data;
    	else return null;
	},
	getImgSrcIDs: function(){
	    var res = [];
	    for(var id in this.sources) {
	        if(this.sources[id].type == "image") res.push(id);
	    }
	    return res;
	},
	generateChildDomElem: function(id, parent) {
	    if(!this.sources[id]) return null;
		var type = this.sources[id].type;
		switch(type) {
		case 'image':
			var img = $('<img name="'+id+'">');
			img.prop({'src':this.sources[id].data});
			img.removeProp('draggable');

			var container = $('<div class="illu">');
			container.append(img);
			container.deletable(null, true);

			// Resize
			var w = img.prop('width'), h = img.prop('height'), cw = parent.width()*0.9, ch = parent.height();
			var ratio = cw/w;
			if(ratio < 1) {w = w*ratio; h = h*ratio;};
			container.css({'width':parent.width()+'px', 'height':h+40+'px'});
			img.css({'position':'absolute', 'left':parent.width()*0.05+'px', 'top':config.sceneY(20)+'px', 'width':w+'px', 'height':h+'px'});

			// Choose Resize Move
			//container.configurable({text:true,stroke:true});
			container.attr( "id" , "obj"+(curr.objId++) );
			return container;
		case 'game':
			var game = $('<div class="game" name="'+id+'">');
			game.deletable();

			// Resize
			var w = parent.width()*0.8, h = w*0.6/0.8;
			game.css({'width':w+'px', 'height':h+'px'});
		    game.append('<h3>Game: '+id+'</h3>');
			game.attr( "id" , "obj"+(curr.objId++) );
		    return game;
		default: 
		    return null;
		}
	},
	getExpoClone: function(id) {
	    if(!this.expos[id]) return null;
		var expo = this.expos[id].clone(true);
		expo.deletable();
		return expo;
	},
	delSource: function(id) {
	    var src = srcMgr.sources[id];
	    if(!src) return;
	    var t = src.type;
	    // Delete all dependency to this source
	    // Script dependency
	    if(t != "wiki" && t != "speaker") {
	        scriptMgr.delRelatedScripts(id);
	    }
	    // Text link dependency
	    if(t == "wiki" || t == "audio") {
	        $('span[link="'+id+'"]').each(function(){
	            $(this).replaceWith($(this).text());
	        });
	    }
	    // Other dependency for image src: DOMElement, animation, wiki image content
	    if(t == "image") {
	        // DOMElement
	        $('.scene img[name="'+id+'"]:not(.illu_speaker)').each(function(){
	            $(this).parent().detach();
	        });
	        // Animation & Wiki
	        for(var srcid in srcMgr.sources) {
	            var type = srcMgr.sources[srcid].type;
	            if(type == "wiki" || type == "anime" || type == "speaker" ) {
	                srcMgr.sources[srcid].data.removeDependency(id);
	            }
	        }
	    }
	    // Other dependency for game src: DOMElement
	    else if(t == "game") {
	        $('div[name="'+id+'"]').each(function(){
	            $(this).detach();
	        });
	    }
	    
	    srcMgr.expos[id].remove();
	    delete srcMgr.sources[id];
	    delete srcMgr.expos[id];
	    srcMgr.uploaded = 0;
	},
	prepareDelSource: function(expo) {
	    if(!expo) return;
	    var id = expo.data('srcId');
	    
	    var src = srcMgr.sources[id];
	    if(src) {
	        var list = [];
	        var t = src.type;
	        // Retrieve all dependency to this source
	        // Script dependency
	        if(t != "wiki") {
	            list = list.concat(scriptMgr.getRelatedScriptsDesc(id));
	        }
	        // Text link dependency
	        if(t == "wiki" || t == "audio") {
	            $('span[link="'+id+'"]').each(function(){
	                list.push("Lien de "+(t=="audio"?"son":t)+" pour le texte: "+$(this).text());
	            });
	        }
	        // Other dependency for image src: DOMElement, animation, wiki image content
	        if(t == "image") {
	            // DOMElement
	            $('.scene img[name="'+id+'"]:not(.illu_speaker)').each(function(){
	                list.push("Image utilisant cette ressource dans l'étape: "+$(this).parents('.layer').prop('id'));
	            });
	            // Animation & Wiki & Speaker
	            for(var srcid in srcMgr.sources) {
	                var type = srcMgr.sources[srcid].type;
	                if(type == "wiki" || type == "anime" || type == "speaker") {
	                    if(srcMgr.sources[srcid].data.getDependency(id)) 
	                        list.push("Le "+type+": "+srcid);
	                }
	            }
	        }
	        // Other dependency for game src: DOMElement
	        else if(t == "game") {
	            $('div[name="'+id+'"]').each(function(){
	                list.push("Le jeu dans l'étape: "+$(this).parents('.layer').prop('id'));
	            });
	        }
			// dependency for speaker balise
			if( t == "speaker" ){
				if( src.data.getAssociateSpeak().length > 0 ){
					dialog.showPopup('Supprimer source', 300, 160+list.length*40 );
					dialog.main.html('<h2>Il est impossible de supprimer un Speaker tant que des balises de dialogue lui font référence</h2>');
					return;
				}
			}
	        
			dialog.showPopup('Supprimer source', 300, 160+list.length*40, 'Confirmer');
	        dialog.main.html('<h2>Les elements suivants seraient supprimés aussi ( ou modifié ), cliquer sur le croix pour annuler</h2>');
	        for(var i = 0; i < list.length; ++i) {
	            dialog.main.append('<p>'+(i+1)+'. '+list[i]+'</p>');
	        }
	        dialog.confirm.click(function() {
	            CommandMgr.executeCmd(new DelSrcCmd(id));
	            dialog.close();
	        });
	        
	        if(list.length == 0) dialog.confirm.click();
	    }
	},
	updateSource: function(id, newName) {
	    this.expos[newName] = this.expos[id];
	    this.sources[newName] = this.sources[id];
	    this.expos[newName].data('srcId', newName);
	    
	    var src = this.sources[id];
	    if(src) {
	        var t = src.type;
	        // Update all dependency to this source
	        // Script dependency
	        if(t != "wiki") {
	            scriptMgr.updateRelatedScripts(id, newName);
	        }
	        // Text link dependency
	        if(t == "wiki" || t == "audio") {
	            $('span[link="'+id+'"]').each(function(){
	                $(this).attr('link', newName);
	            });
	        }
	        // Other dependency for image src: DOMElement, animation, wiki image content
	        if(t == "image") {
	            // DOMElement
	            $('img[name="'+id+'"]').each(function(){
	                $(this).attr('name', newName);
	            });
	            // Animation & Wiki
	            for(var srcid in this.sources) {
	                var type = this.sources[srcid].type;
	                if(type == "wiki" || type == "anime") {
	                    this.sources[srcid].data.updateSource(id, newName);
	                }
	            }
	        }
	        // Other dependency for game src: DOMElement
	        else if(t == "game") {
	            $('div[name="'+id+'"]').each(function(){
	                $(this).attr('name', newName);
	            });
	        }
	        
			delete this.sources[id];
		}
		delete this.expos[id];
		this.uploaded = 0;
	},
    rename: function(id, newName) {
        if(!this.sources[id] || this.sources[newName]) {
            alert("Echec à changer de nom pour la source");
            return id;
        }
        this.updateSource(id, newName);
        var t = this.sources[newName].type;
        // Update expo
        if(t == 'image') this.expos[newName].children('img').attr('name',newName);
        else {
            // Update data
            if(t == "wiki" || t == "anime" || t == "speaker" ) {
                this.sources[newName].data.name = newName;
            }
            // Update expo resume text
            var chaine = srcMgr.expos[newName].children("p").html().split(/: /);
            chaine = chaine[0]+ ": "+ this.expos[newName].data("srcId");
            this.expos[newName].children('p').replaceWith("<p>"+chaine+"</p>");
        }
        return newName;
    },
	renameDialog: function(src) {
	    var id = src.data('srcId');
	    dialog.showPopup('Renomer source', 300, 150, 'Confirmer');
	    dialog.main.html('<p><label>Nouveau nom: </label><input id="rename" type="text"></p>');
	    dialog.confirm.click(function() {
	        var name = $('#rename').val();
	        // Validation
	        if(!name || !nameValidation(name)) {
	            dialog.showAlert('Nom choisi invalid');
	            return false;
	        }
	        else if(srcMgr.sources[name]) {
	            dialog.showAlert('Nom choisi existe déjà');
	            return false;
	        }
	    	CommandMgr.executeCmd(new RenameSrcCmd(id, name));
	    	dialog.close();
	    });
	},
	editWiki: function(id) {
	    if(!this.sources[id] || !(this.sources[id].data instanceof Wiki)) return;
	    this.sources[id].data.showWikiOnEditor();
	},
	uploadSrc: function(url, pjName, lang) {
	    this.uploaded = 0;
	    for(var key in this.sources) {
	        var data = null;
	        var type = this.sources[key].type;
	        // Check if data is original content or the relative path
	        var ext = this.dataExtension(this.sources[key].data);
	        // relative path
	        if((type == "image" || type == "game" || type == "audio") && (!ext || ext == "")) {
	            ++this.uploaded;
	            this.updateSrcs(pjName, lang);
	            continue;
	        }
	        // Original content, upload it
	        switch(type) {
	        case "image": case "audio": case "game":
	            data = "pjName="+pjName+"&lang="+lang+"&type="+type+"&name="+key+"&data="+this.sources[key].data;
	            break;
	        case "wiki": case "anime": case "code": case "speaker":
	            ++this.uploaded;
	            this.updateSrcs(pjName, lang);
	            continue;
	        }
	        
	        if(data)
    	        $.ajax({
                    async: false,
	                type: "POST",
	                'url': url,
	                processData: false,
	                'data': data,
	                success: function(msg){
	                    var resp = msg.match(srcMgr.uploadResp);
	                    if(msg == "SUCCESS"){
	                        ++srcMgr.uploaded;
	                        srcMgr.updateSrcs(pjName, lang);
	                    }
	                    else if(resp && resp[1] && srcMgr.pathCheck.test(resp[2])) {
	                        srcMgr.sources[resp[1]].data = resp[2];
	                        ++srcMgr.uploaded;
	                        srcMgr.updateSrcs(pjName, lang);
	                    }
	                    else alert("Source upload errors: "+msg);
	                }
	            });
	    }
	},
	updateSrcs: function(pjName, lang){
	    var count = Object.keys(this.sources).length;
	    if(this.uploaded < count) return;
        $.ajax({
            async: false,
            type: "POST",
            url: "update_srcs.php",
            data: {"pjName":pjName,"lang":lang,"srcs":JSON.stringify(this.sources)},
            success: function(msg){
                if(msg && msg != "") alert(msg);
            }
        });
	}
};



var stepExist = function(name) {
    var layers = $('div.layer[id="'+name+'"]');
    if(layers.length > 0) return true;
    else return false;
};
// Step manager
var StepManager = function(page) {
	// Init
	this.page = page;
	this.manager = $('<div class="expos"></div>');
	this.steps = {};
	this.stepexpos = {};
	this.currStepN = 1;
	
	managers[page.prop('id')] = this;
	page.data('StepManager', this);
	// Append to right panel
	$('#right_panel').append(this.manager);
	this.active();
};
StepManager.prototype = {
	constructor: StepManager,
	remove: function() {
	    this.page.removeData("StepManager");
	    this.manager.remove();
	    this.steps = null;
	    this.stepexpos = null;
	    delete managers[this.page.prop('id')];
	},
	reinitForPage: function(page){
        return this.constructor(page);
    },
	deleteFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		var stepN = $(this).parents('.layer_expo').data('stepN');
		CommandMgr.executeCmd(new DelStepCmd(curr.page.data('StepManager'), stepN));
	},
	upFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		var stepN = $(this).parents('.layer_expo').data('stepN');
		CommandMgr.executeCmd(new StepUpCmd(curr.page.data('StepManager'), stepN));
	},
	downFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		var stepN = $(this).parents('.layer_expo').data('stepN');
		CommandMgr.executeCmd(new StepDownCmd(curr.page.data('StepManager'), stepN));
	},
	
	active: function() {
		// Place expo manager in the front
		for(var m in managers) {
			managers[m].manager.css('z-index','1');
		}
		this.manager.css('z-index','2');
		// Update current step
		var stepN = this.manager.children('.expo_active').data('stepN');
		if(stepN) curr.step = this.steps[stepN];
		else {
			this.activeStep(this.currStepN-1);
		}
	},
	
	activeStep: function(stepN) {
		// Not in this page
		if(stepN >= this.currStepN) return;
		// No step in this page
		if(this.currStepN == 1) return;
		// Unvaild stepN
		if(stepN < 1) stepN = 1;
		// Current active step clicked
		if(this.manager.children('.expo_active') == this.stepexpos[stepN]) return;
		
		curr.step = this.steps[stepN];
		// Mask all step upon current step
		for(var i = stepN+1; i < this.currStepN; i++) {
			this.steps[i].hide();
		}
		// Show all layer under current
		for(var i = 1; i <= stepN; i++) {
			this.steps[i].show();
		}

		this.manager.children('.layer_expo').removeClass('expo_active');
		this.stepexpos[stepN].addClass('expo_active');
	},
	
	getStep: function(stepN) {
		return this.steps[stepN];
	},
	getStepExpo: function(stepN) {
		return this.stepexpos[stepN];
	},
	renameStep: function(expo, name) {
	    var stepN = expo.data('stepN');
	    if(!name || !nameValidation(name) || stepExist(name)) {
	        var oldname = this.steps[stepN].prop('id');
	        expo.find('span').text(oldname)
	                         .animate({'color': '#fb4e4e'}, 500)
	                         .animate({'color': '#000'}, 500);
	        return false;
	    }
	    CommandMgr.executeCmd(new RenameStepCmd(this, stepN, name));
	},
    createExpo: function(stepN, name){
        // Add a Step expo
		var expo = $('<div class="layer_expo"><h1>Étape '+stepN+'</h1><h5>Name: <span>'+name+'</span></h5></div>');
		expo.data('name', name);
		expo.data('stepN', stepN);
		expo.find('span').editable(new Callback(this.renameStep, this, expo));
		// Step chooser function
		expo.click(function(e) {
			e.preventDefault();e.stopPropagation();
			curr.page.data('StepManager').activeStep($(this).data('stepN'));
		});
		// Del step button and Up down button
		expo.deletable(this.deleteFunc).hoverButton('./images/UI/up.png', this.upFunc).hoverButton('./images/UI/down.png', this.downFunc);
		// DnD listenerts to step expo
		expo.bind('dragover', dragOverExpo).bind('dragleave', dragLeaveExpo).bind('drop', dropToExpo);
		
        return expo;
    },
	
	addStepWithContent: function(name, step) {
	    if(!name || !nameValidation(name) || stepExist(name)) return false;
        step.prop('id', name); // change the step name
	    var stepN = parseInt(step.css('z-index'));
	    
	    // Insert stepin the right place
	    for(var i = this.currStepN-1; i >= stepN; --i){
	        this.steps[i].css('z-index', i+1);
	        this.stepexpos[i].children('h1').replaceWith('<h1>Étape '+(i+1)+'</h1>');
	        // Change stepN in data
	        this.steps[i].data('stepN', i+1);
	        this.stepexpos[i].data('stepN', i+1);
	        // Replace the step
	        this.steps[i+1] = this.steps[i];
	        this.stepexpos[i+1] = this.stepexpos[i];
	    }
	    this.currStepN++;
	    this.steps[stepN] = step;
	    step.data('stepN', stepN);
	    
	    // Add step to page
	    if(this.steps[stepN-1]) this.steps[stepN-1].after(step);
	    else if(this.steps[stepN+1]) this.steps[stepN+1].before(step);
	    else this.page.append(step);
	    
	    // Add a Step expo
        var expo = this.createExpo(stepN, name);
	    this.stepexpos[stepN] = expo;
	    if(this.stepexpos[stepN-1]) this.stepexpos[stepN-1].before(expo);
	    else if(this.stepexpos[stepN+1]) this.stepexpos[stepN+1].after(expo);
	    else this.manager.append(expo);
	    
	    // Step content processing
	    step.children().each(function(){
	        var obj = $(this);
	        // Article
	        if(obj.hasClass('article')) {
                ArticleFormater.setConfigurable(obj.children());
	        }
	        // Other obj
	        else {
	            obj.deletable().configurable().resizable().moveable()
	               .hoverButton('./images/tools/anime.png', animeTool.animateObj)
	               .hoverButton('./images/UI/addscript.jpg', addScriptForObj)
	               .canGoDown();
	            // Editable for text object   
                if(obj.children('p').length > 0)
                    obj.children('p').editable(TextUtil.editFinishCb, TextUtil.editPrepaCb, true);
	            scriptMgr.countScripts(obj.attr('id'),'obj', $(this));
	        }
	    });
	    
	    this.activeStep(stepN);
	    
	    return step;
	},
	addStep: function(name, params, active) {
	    if(!name || !nameValidation(name) || stepExist(name)) return false;
		// Create step
		var step = $('<div id="'+name+'" class="layer"></div>');
		step.css({'z-index':this.currStepN});
		if(!params || !params.type) step.attr('type','Layer');
		else step.attr('type',params.type);
		step.data('stepN', this.currStepN);
		step.attr('defile', (params&&params.defile)?true:false);
		this.page.append(step);
		// Indexing the Step
		this.steps[this.currStepN] = step;
		
		// Add a Step expo
        var expo = this.createExpo(this.currStepN, name);
		// Append expo to manager
		this.manager.prepend(expo);
		this.stepexpos[this.currStepN] = expo;
		
		this.currStepN++;
		if(active || this.manager.children('.expo_active').length==0) {
			this.activeStep(this.currStepN-1);
		}
		
		return step;
	},
	
	stepUp: function(stepN) {
		if(stepN == this.currStepN-1) return;
		// Switch the steps: change z-index
		this.steps[stepN].css('z-index', stepN+1);
		this.steps[stepN+1].css('z-index', stepN);
		// Switch the expos: switch the order of expos, change the title of expos
		this.stepexpos[stepN].children('h1').replaceWith('<h1>Étape '+(stepN+1)+'</h1>');
		this.stepexpos[stepN+1].children('h1').replaceWith('<h1>Étape '+stepN+'</h1>');
		// Insert
		this.stepexpos[stepN].insertBefore(this.stepexpos[stepN+1]);
		// Change stepN in data
		this.steps[stepN].data('stepN', stepN+1);
		this.steps[stepN+1].data('stepN', stepN);
		this.stepexpos[stepN].data('stepN', stepN+1);
		this.stepexpos[stepN+1].data('stepN', stepN);
		// Switch in two arrays
		var temp = this.steps[stepN];
		this.steps[stepN] = this.steps[stepN+1];
		this.steps[stepN+1] = temp;
		temp = this.stepexpos[stepN];
		this.stepexpos[stepN] = this.stepexpos[stepN+1];
		this.stepexpos[stepN+1] = temp;
		// Reactive current activate step
		this.activeStep(this.manager.children('.expo_active').data('stepN'));
	},
	stepDown: function(stepN) {
		if(stepN == 1) return;
		// Switch the steps: change z-index
		this.steps[stepN].css('z-index', stepN-1);
		this.steps[stepN-1].css('z-index', stepN);
		// Switch the expos: switch the order of expos, change the title of expos
		this.stepexpos[stepN].children('h1').replaceWith('<h1>Étape '+(stepN-1)+'</h1>');
		this.stepexpos[stepN-1].children('h1').replaceWith('<h1>Étape '+stepN+'</h1>');
		// Insert
		this.stepexpos[stepN].insertAfter(this.stepexpos[stepN-1]);
		// Change stepN in data
		this.steps[stepN].data('stepN', stepN-1);
		this.steps[stepN-1].data('stepN', stepN);
		this.stepexpos[stepN].data('stepN', stepN-1);
		this.stepexpos[stepN-1].data('stepN', stepN);
		// Switch in two arrays
		var temp = this.steps[stepN];
		this.steps[stepN] = this.steps[stepN-1];
		this.steps[stepN-1] = temp;
		temp = this.stepexpos[stepN];
		this.stepexpos[stepN] = this.stepexpos[stepN-1];
		this.stepexpos[stepN-1] = temp;
		// Reactive current activate step
		this.activeStep(this.manager.children('.expo_active').data('stepN'));
	},
	
	removeStep: function(stepN) {
		if(this.currStepN <= 2) return false; // Only one step left
		var step = this.steps[stepN];
		// Current Layer removed
		if(step == curr.step) {
			if(stepN == this.currStepN-1) var target = stepN-1;
			else var target = stepN+1;
			this.activeStep( target );
		}
		// Remove Step and Stepexpo
		step.remove();
		this.stepexpos[stepN].remove();
		// Reindexing the upper steps and stepexpos
		for(var i = stepN; i < this.currStepN-1; i++) {
			this.steps[i] = this.steps[i+1];
			// Update z-index
			this.steps[i].css('z-index', i);
            this.steps[i].data('stepN', i);
			// Update step expo
			this.stepexpos[i] = this.stepexpos[i+1];
			this.stepexpos[i].data('stepN', i);
			this.stepexpos[i].children('h1').replaceWith('<h1>Étape '+i+'</h1>');
		}
		delete this.steps[this.currStepN-1];
		delete this.stepexpos[this.currStepN-1];
		this.currStepN--;
	}
};




// Wiki system
var Wiki = function(name, cardsDom, font, fontsize, color) {
    if(font) this.font = font;
    if(fontsize) this.fsize = fontsize;
    if(color) this.fcolor = color;
    
    if(!name || !cardsDom) return;
    this.name = name;
    this.cards = [];
    cardsDom.find('input, .del_container, .sepline').remove();
    cardsDom.find('img').prop('src', '');
    // Analyze the cards
    for(var i = 0; i < cardsDom.length; i++) {
        var card = {};
        var cardDom = $(cardsDom.get(i));
        if(cardDom.children('h5').length > 0) card.type = "img";
        else card.type = "text";
        switch(card.type){
        case "img":
            card.image = cardDom.children('img').attr('name');
            card.legend = cardDom.children('h5').text();
            break;
        case "text":
            card.sections = [];
            // Sections titles
            var titles = cardDom.children('h3');
            for(var j = 0; j < titles.length; j++){
                var title = $(titles.get(j));
                var section = {};
                section.title = title.text();
                // Link section
                if(title.next()[0].tagName == 'IMG') {
                    section.type = 'link';
                    section.content = title.next().attr('value');
                }
                // Text section
                else {
                    section.type = 'text';
                    section.content = (title.next()[0].tagName=='DIV') ? title.next().text() : "";
                }
                card.sections.push(section);
            }
            break;
        }
        this.cards.push(card);
    }
};
Wiki.prototype = {
    constructor: Wiki,
    showWikiOnEditor: function(){
        wikiTool.active();
        $('#wiki_name').val(this.name);
        if(this.font) $('#wiki_font').val(this.font);
        if(this.fsize) $('#wiki_size').val(this.fsize);
        if(this.fcolor) $('#wiki_color').val(this.fcolor);
        for(var i = this.cards.length-1; i >= 0; --i){
            var card = this.cards[i];
            if(!card) continue;
            if(card.type == "img"){
                var jqCard = wikiTool.addWikiCard("image");
                // Change image
                var img = $('<img name="'+card.image+'" src="'+srcMgr.getSource(card.image)+'" style="top:20px;">');
                img.bind('dragover', DropZone.prototype.dragOverElemZone)
                   .bind('dragleave', DropZone.prototype.dragLeaveElemZone)
                   .bind('drop', wikiTool.dropImgToWikiCard);
                img.mouseup(DropZone.prototype.dragLeaveElemZone);
                jqCard.children(".drop_zone").replaceWith(img);
                // Change legend
                var newlegend = $('<h5>'+card.legend+'</h5>');
                newlegend.css({'top':(config.wikiHeight-45)+'px'});
                jqCard.children("textarea").replaceWith(newlegend);
                newlegend.editable();
            }
            else if(this.cards[i].type == "text"){
                var jqCard = wikiTool.addWikiCard("description");
                for(var j in card.sections){
                    wikiTool.addSectionWiki(jqCard.children("input"), card.sections[j].title, card.sections[j].type, card.sections[j].content);
                }
            }
        }
    },
    getDependency: function(id) {
		if( !id )
			return false;
        for(var i = 0; i < this.cards.length; ++i) {
            var card = this.cards[i];
            if(card.type == 'img' && card.image == id)
                return true;
        }
        return false;
    },
    removeDependency: function(id) {
        for(var i = 0; i < this.cards.length; ++i) {
            var card = this.cards[i];
            if(card.type == 'img' && card.image == id)
                this.cards.splice(i, 1);
        }
    },
    updateSource: function(id, newName) {
        for(var i = 0; i < this.cards.length; ++i) {
            var card = this.cards[i];
            if(card.type == 'img' && card.image == id)
                card.image = newName;
        }
    }
};



// Animation system
var Animation = function(name, repeat, block, statiq) {
    //this.anime = {};
    this.name = name;
    this.repeat = repeat;
    this.statiq = statiq;
    this.frames = [];
    this.objs = {};
    this.block = block ? true : false;
};
Animation.prototype = {
    constructor: Animation,
    removeDependency: function(id) {
        if(this.objs[id]) {
            for(var i = 0; i < this.frames.length; ++i) {
                var frame = this.frames[i];
                delete frame.objs[id];
            }
            delete this.objs[id];
        }
    },
    getDependency: function(id) {
        if(this.objs[id]) 
            return true;
        else return false;
    },
    updateSource: function(id, newName) {
        if(this.objs[id]) {
            for(var i = 0; i < this.frames.length; ++i) {
                var frame = this.frames[i];
                frame.objs[newName] = frame.objs[id];
                delete frame.objs[id];
            }
            this.objs[newName] = this.objs[id];
            delete this.objs[id];
        }
    },
    createAnimation: function(frames) {
        var statiq = this.statiq;
        var objs = {};
        // Analyze
        for(var i = 0; i < frames.length; i++){
            var frame = {};
            var framexpo = $(frames.get(i));
            frame.interval = parseFloat(framexpo.find('span').text());
            // Valid interval
            if(isNaN(frame.interval) || frame.interval > 20 || frame.interval <= 0) 
                frame.interval = 0.5;
            frame.objs = {};
            var content = framexpo.data('frame').children();
            content.each(function(){
                var params = {};
                var container = $(this);
                // Type
                if(container.hasClass('rect')) var type = 'rect';
                else if(container.children('img').length == 1) {
                    var img = container.children('img');
                    if( isNaN(container.children('img').data('fr')) )
                        var type = 'image';
                    else var type = 'sprite';
                }
                else if(container.children('p').length > 0) var type = 'text';
                // Type incorrect
                if(!type) return;
                
                if(!statiq) var name = container.prop('id');
                else if(type == 'image' || type == 'sprite') var name = img.attr('name');
                else var name = container.prop('id');
                // Validity
                if(!name || name == "") return;
                // Add to objects array
                if(!objs[name]) {
                    objs[name] = {};
                    objs[name].type = type;
                    if(type == 'text') {
                        // Text static config
                        objs[name].align = container.css('text-align');
                        if(!objs[name].align || objs[name].align == "") objs[name].align == "left";
                        objs[name].content = container.children('p').text();
                    }
                    else if(type == 'sprite') {
                        objs[name].frw = img.data('frw');
                        objs[name].frh = img.data('frh');
                        objs[name].col = img.data('col');
                        objs[name].row = img.data('row');
                    }
                }
                // Parameters animatable
                params.dx = config.realX(container.position().left); 
                params.dy = config.realY(container.position().top);
                params.dw = config.realX(container.width()); 
                params.dh = config.realY(container.height());
                params.opacity = parseFloat(container.css('opacity'));
                if(type == 'image') {
                    // Recut
                    params.w = img.prop('naturalWidth'); params.h = img.prop('naturalHeight');
                    var ratiox = params.w/img.width(), ratioy = params.h/img.height();
                    params.sx = parseInt(-img.position().left * ratiox); 
                    params.sy = parseInt(-img.position().top * ratioy);
                    params.sw = parseInt(container.width() * ratiox); 
                    params.sh = parseInt(container.height() * ratioy);
                    if(params.sx != 0 || params.sy != 0 || params.sw != params.w || params.sh != params.h)
                        objs[name].type = "spriteRecut";
                }
                else if(type == 'sprite') {
                    params.fr = img.data('fr');
                }
                else if(type == 'rect') {
                    params.color = container.css('background-color');
                }
                else if(type == 'text') {
                    params.color = container.css('color');
                    params.fontw = container.css('font-weight');
                    if(!params.fontw) params.fontw = "";
                    params.font = container.css('font-family');
                    if(!params.font) params.font = "Arial";
                    params.fonts = container.css('font-size');
                    if(!params.fonts) params.fonts = "16";
                    params.fonts = config.realY(parseInt(params.fonts));
                }
                
                frame.objs[name] = params;
            });
            // Transition
            var trans = framexpo.children('div.motion');
            var pos = parseInt(trans.data('pos')), size = parseInt(trans.data('size')), opac = parseInt(trans.data('opac')), font = parseInt(trans.data('font'));
            frame.trans = {};
            if(!isNaN(pos)) frame.trans.pos = pos;
            if(!isNaN(size)) frame.trans.size = size;
            if(!isNaN(opac)) frame.trans.opac = opac;
            if(!isNaN(font)) frame.trans.font = font;
            
            this.frames.push(frame);
        }
        this.objs = objs;
    },
    showAnimeOnEditor: function(){
        var editor = $('#editor');
        if(editor.css('display') != 'none' && $('#animeName').val() == this.name)
            return;
    
        // Reinit
        animeTool.close();
        $('#animeRepeat').val(this.repeat);
        $('#animeName').val(this.name);
        $('#animeBlock').val(this.block);
        for(var i = 0; i < this.frames.length; i++){
            var frame = this.frames[i];
            var frameexpo = animeTool.addFrame(frame.interval, true);
            var framelayer = frameexpo.data('frame');
            // Transition
            var trans = frameexpo.children('div.motion');
            if(!isNaN(frame.trans.pos)) trans.data('pos', frame.trans.pos);
            if(!isNaN(frame.trans.size)) trans.data('size', frame.trans.size);
            if(!isNaN(frame.trans.opac)) trans.data('opac', frame.trans.opac);
            if(!isNaN(frame.trans.font)) trans.data('font', frame.trans.font);
            // Objects
            for(var key in frame.objs){
                var container = $('<div id='+key+'>');
                container.deletable().resizable().moveable().configurable();
                var param = frame.objs[key];
                var type = this.objs[key].type;
                switch(type) {
                case "spriteRecut": case "sprite": case "image":
                    // Resolve the src pb with non statiq animations
                    if(!this.statiq) key = $('#'+key).children('img').attr('name');
                    var elem = $('<img name="'+ key +'" src="'+srcMgr.getSource(key)+'">');
                    switch(type) {
                    case "sprite":
                        elem.data('row',this.objs[key].row).data('col',this.objs[key].col)
                            .data('frw',this.objs[key].frw).data('frh',this.objs[key].frh);
                        animeTool.showSpriteFr(elem, param.fr);
                        container.hoverButton('./images/UI/spritecut.png', animeTool.spriteCut);
                        break;
                    case "spriteRecut":
						// the ratio was relative to the d- ( width on the scene ), i think it must be relative to the natural width and height
                        //elem.css({'position':'relative', 'left':-100*param.sx/param.dw+'%', 'top':-100*param.sy/param.dh+'%', 'width':100*param.w/param.sw+'%', 'height':100*param.h/param.sh+'%'});
                        elem.css({'position':'relative', 'left':-100*param.sx/param.w+'%', 'top':-100*param.sy/param.h+'%', 'width':100*param.w/param.sw+'%', 'height':100*param.h/param.sh+'%'});
                        container.hoverButton('./images/UI/recut.png', animeTool.recutAnimeObj);
                        break;
                    case "image":
                        elem.css({'position':'relative', 'left':'0%', 'top':'0%', 'width':'100%', 'height':'100%'});
                        container.hoverButton('./images/UI/recut.png', animeTool.recutAnimeObj)
                                 .hoverButton('./images/UI/spritecut.png', animeTool.spriteCut);
                        break;
                    }
                break;
                case "text":
                    container.prop('id', key);
                    container.css({
                        'font-weight': param.fontw,
                        'font-size': config.sceneY(param.fonts)+'px',
                        'font-family': param.font,
                        'text-align': this.objs[key].align,
                        'color': param.color,
                        'overflow': 'auto'
                    });
                    var elem = $('<p style="margin:0px;padding:0px;">'+this.objs[key].content+'</p>');
                break;
                case "rect":
                    container.prop('id', key);
                    container.css({'background-color': param.color});
                    container.addClass('rect');
                    var elem = '';
                break;
                default: continue;
                }
                // Parameters in common
                var dx = config.sceneX(param.dx), dy = config.sceneY(param.dy); 
                var dw = config.sceneX(param.dw), dh = config.sceneY(param.dh);
                container.css({'position':'absolute', 'top':dy+'px', 'left':dx+'px', 'width':dw+'px', 'height':dh+'px', 'border-style':'solid', 'border-color':'#4d4d4d', 'border-width':'0px', 'overflow':'hidden', 'opacity':param.opacity});
                
                container.append(elem);
                framelayer.append(container);
            }
        }
        if(this.statiq) animeTool.active();
        else animeTool.active(false);
    }
};


// Speaker system
var Speaker = function( name ) {
    if(name != '' && !name) return; // if name == '' -> its a call by the dialog creation
    this.name = name;
	this.portrait = { neutre : null };
	this.color = "#467291";
};
Speaker.prototype = {
    constructor: Speaker,
    rename: function(newName){
        if (this.name == newName) return;
        
        // change all the div of this speaker
        var divs = $('div[data-who="'+this.name+'"]');
        divs.attr('data-who', newName);
        // change the expo
        $('.icon_src').children('[name="'+this.srcId+'"]')
                      .siblings('p')
                      .html('Speaker: '+newName);
        // other way
        // srcMgr.expos[this.srcId].children('p').html('Speaker: '+newName);
        
        this.name = newName;
    },
	hasMood : function( key ){
		return ($.inArray(key, Object.keys(this.portrait)) != -1);
	},
	addMood : function( key , image_id ){
		if( !image_id )
			image_id= null;
		this.portrait[ key.toLowerCase() ] = image_id;
	},
	renameMood : function( oldName , newName ){
		this.portrait[ newName ] = this.portrait[ oldName ];
		delete this.portrait[ oldName ];
	},
	getMoodUrl : function( key ){
		if( !key || !this.portrait[ key ] )
			return "./images/UI/default_portrait.png";
		return srcMgr.getSource( this.portrait[ key ] );
	},
    clearPortraits: function(){
        this.portrait = { neutre : null };
    },
	getPictSrc : function( key ){	// unused?
		if( !key )
			return this.portrait[ "neutre" ];
		return this.portrait[ key ];
	},
	// eventuellement, retourne null
	getAssociateSpeak : function( mood ){
		if( mood )
			return $( ".speaker[data-who="+ this.name +"][data-mood="+ mood +"]" );
		
		return $( ".speaker[data-who="+ this.name +"]" );
	},
	getIcon : function(){  			// unused?
		if( Object.keys(this.portrait).length < 1 )
			return;
		if( this.hasMood( "neutre" ) )
			return this.portrait[ "neutre" ];
		for( var i in this.portrait )
			if( this.portrait[ i ] )
				return this.portrait[ i ];
		return ;
	},
    getDependency: function(id) {
        for( var i in this.portrait )
            if(this.portrait[i] == id)
                return true;
        return false;
    },
    removeDependency: function(id) {
        for( var i in this.portrait )
            if(this.portrait[i] == id)
                this.portrait[i] = null;
    },
    updateSource: function(id, newName) {
		for( var i in this.portrait )
            if(this.portrait[i] == id)
                this.portrait[i] = newName;
    }
};

var speakerMgr = (function(){
    var Private = {};
    var Public = new function SpeakerManager(){};
    
    Private.changeMoodInDialog = function(e){
        e = e.originalEvent;
        e.stopPropagation();
        var id = e.dataTransfer.getData('Text');
        var type = srcMgr.sourceType(id);
        if(!id || type != $(this).data('type')) return;
        // check if drop a new image
        if($(this).siblings('img').prop('name') == id)
            return;
        
        $(this).siblings('img').prop('src',srcMgr.sources[id].data);
        $(this).siblings('img').prop('name',id);
    };    
    
    Private.validChanges = function(e){
        var spkObj =  e.data.speaker;
        var newName = $('.popup #speaker_name').val();
        if(newName == '')
            return;
        else 
            spkObj.rename(newName);
		var state = {};
		for( var i in spkObj.portrait )
			state[ i ] = true;
		
		var cmds = [];
		
        var moods = $('#mood_selector').children();
        moods.each(function(i){
            if($(this).hasClass('drop_zone'))
                return;
            var srcimg = $(this).children('img').attr('name');
			if( $(this).children('input').length > 0 )
				var moodName = $(this).children('input').val().toLowerCase();
			else
				var moodName = $(this).text().toLowerCase();
            var reelName = $(this).attr("data-related" ).toLowerCase();  // name of the elment when we instanciate it
			
			if( !spkObj.hasMood( moodName ) )
				cmds.push( new AddMoodCmd( spkObj , moodName , srcimg ) );
			else{
				state[ moodName ] = false;
				if( ( !srcimg != !spkObj.getPictSrc( moodName ) ) || spkObj.getPictSrc( moodName ) != srcimg )
					cmds.push( new ModifyMoodSrcCmd( spkObj , moodName , srcimg ) );
			}
        });
        for( var i in state )
			if( state[ i ] )
				cmds.push( new DelMoodCmd( spkObj , i ) );
		
		var newColor = $('#bulle_couleur' ).val();
		if( spkObj.color != newColor && isColor( newColor ) )
			cmds.push( new ModifyColorSpeakCmd( spkObj , newColor ) );

        closeBottom();
        dialog.close();
        
        return cmds;
    };
        
    Private.coreSpeakerDialog = function(speakerObj){
        function dropVisage(e){
            e = e.originalEvent;
            e.stopPropagation();
            $(this).css('border-style', 'dotted');
            
            var id = e.dataTransfer.getData('Text');
            var type = srcMgr.sourceType(id);
            if(!id || type != $(this).data('type')) return;
            
            // check if drop a new image
            var siblings = $(this).siblings();
            var finded = false;
            siblings.each(function(){ if($(this).find('img').prop('name') == id) finded = true; });
            if(finded) return;
            
            // Place in the elem zone
			var name = 'humeur'+$('#mood_selector>div').length;
            var elem = $('<div data-related="'+name+'" ><img  src="'+srcMgr.sources[id].data+'" name="'+id+'"></div>');
            elem.append('<input type="text" value="'+name+'" />');
            elem.deletable(null, true);            
            elem.find('.del_container img').css('right', '10px'); // replace icons
            var obj = $('#mood_selector').data('spkObj');
            var dz = new DropZone(Private.changeMoodInDialog,{'height':'100%','border-width': '2px'});
            dz.jqObj.data('type','image');
            elem.append(dz.jqObj);
            $(this).before(elem);
			dz.jqObj.css( "top" , elem.children("img").position().top+"px" );
			dz.jqObj.css( "width" , elem.children("img").width()+"px" );
			dz.jqObj.css( "height" , elem.children("img").height()+"px" );
			dz.jqObj.css( "z-index" , elem.children("img").css( "z-index" ) +1 );
			dz.jqObj.css( "position" , "absolute" );
        }
        
        // show ressource panel
        $('#bottom').css('z-index','110');
        
        var htmlStr = '';
        htmlStr += '<table>';
        htmlStr +=  '<tr><td>Nom</td>';
        htmlStr +=    '<td>Couleur</td>';
        htmlStr +=    '<td>Style</td> </tr>';
        htmlStr +=  '<tr><td><input type="text" id="speaker_name"/> </td>';
        htmlStr +=    '<td><input type="text" id="bulle_couleur"/> </td>';
        htmlStr +=    '<td><input type="text" id="bulle_style"/> </td> </tr>';
        htmlStr += '</table><br/>';
        
        dialog.main.append(htmlStr);
        $('#speaker_name').val(speakerObj.name);        
        $('#bulle_couleur').val(speakerObj.color);        
        // $('#bulle_style').val(this.style);
        
        var moodSelector = $('<div id="mood_selector"></div>');
        moodSelector.data('spkObj', speakerObj);
        dialog.main.append(moodSelector);
        for (var i in speakerObj.portrait) {
            // restore all moods
			var url = speakerObj.getMoodUrl( i );
            var elem = $('<div data-related="'+i+'"><img src="'+ url +'" ></div>');
			if( speakerObj.portrait[i] )
				elem.children("img").attr( "name" , speakerObj.portrait[i] );                
                
            if(i == 'neutre'){
                elem.append('<p>'+i+'</p>');
                elem.deletable(function(){
                    // mettre img par default
                    var img = $(this).parent().siblings('img');
                    var defaultUrl = "./images/UI/default_portrait.png";
                    if(img.prop('src') != defaultUrl){
                        img.prop('src', defaultUrl);
                        img.removeAttr('name');
                    }
                    var obj = $('#mood_selector').data('spkObj');
                    obj.portrait[i] = null;
                },true);
            }
            else {
                elem.append('<input type="text" value="'+i+'" />');
                elem.deletable(null,true);
            }
            elem.find('.del_container img').css('right', '10px'); // replace icons
            
            var dz = new DropZone(Private.changeMoodInDialog,{'height':'100%','border-width': '2px'});
            dz.jqObj.data('type','image');
            elem.append(dz.jqObj);
            moodSelector.append(elem);
			
			dz.jqObj.css( "top" , elem.children("img").position().top+"px" );
			dz.jqObj.css( "width" , elem.children("img").width()+"px" );
			dz.jqObj.css( "height" , elem.children("img").height()+"px" );
			dz.jqObj.css( "z-index" , elem.children("img").css( "z-index" ) +1 );
			dz.jqObj.css( "position" , "absolute" );
        }
        
        var dz = (new DropZone(dropVisage, {'height':'65px', 'text-align': 'center'}, "add_mood")).jqObj;
        dz.data('type', 'image');
        dz.append('<span style="margin-top: 10px; font-size: 12px;">Ajouter une humeur</span>');
        moodSelector.append(dz);
    };
    

    Public.getSpeaker = function(name){ 
        for(var id in srcMgr.sources){
            var src = srcMgr.sources[id]
            if(src.type == "speaker" && src.data.name == name)
                return src.data;
        }
    };
    Public.getAllSpeakers = function(){
        var speakers = [];
        for(var id in srcMgr.sources){
            var src = srcMgr.sources[id]
            if(src.type == "speaker")
                speakers.push(src.data);
        }
        return speakers; 
    };
    
    Public.modifySpeakerDialog = function(src){
        var speaker = srcMgr.getSource(src.data('srcId'));
        
        dialog.showPopup('Edition speaker',450, 410, 'modifier');
        
        Private.coreSpeakerDialog(speaker);
        
        dialog.confirm.click({'speaker':speaker}, function(e){
            var changesCmds = Private.validChanges(e);
            CommandMgr.executeCmd( new CommandMulti( changesCmds ) );
        });
    };
    
    Public.createSpeakerDialog = function(){
        var speaker = new Speaker('');
        
        dialog.showPopup('Edition speaker',450, 410, 'modifier');        
        
        Private.coreSpeakerDialog(speaker);
        
        dialog.confirm.click({'speaker':speaker}, function(e){  
            var name = $('.popup #speaker_name').val();
            if(name == '' || !nameValidation(name))
                return alert('Il faut entrer un nom valid pour le personnage.');
            var spkObj =  e.data.speaker;
            spkObj.name = name;
            CommandMgr.executeCmd( new CreateSpeakerCmd(spkObj) );
            Private.validChanges(e);
        });
    };
    
    Public.createSpeaker = function(name, speaker) {
        var spkObj = speaker instanceof Speaker ? speaker : new Speaker(name);
        srcMgr.addSource( "speaker" , spkObj, spkObj.name);
        return spkObj;
    };
    
    Public.addDialogPopup = function(src) {
        var id = src.data('srcId');
        var speaker = srcMgr.getSource(id);
        // Dialog
        dialog.showPopup('Ajouter un dialog', 380, 420, 'Confirmer');
        dialog.main.append("<p>Cliquer pour choisir les lignes de dialog</p>");
        // Object chooser
        var chooser = new ObjChooser("dialog_chooser", true);
        var p = $('<p></p>');
        p.css({'height':30});
        chooser.appendTo(p);
        dialog.main.append(p);
        // Dialog lines
        dialog.main.append("<p>Résultat de selection</p>");
        var lines = $("<dl id='dialog_lines'></dl>");
        lines.css({'height':180});
        dialog.main.append(lines);
        // Confirm function
        dialog.confirm.click(function() {
            var dts = $('dl#dialog_lines').children('dt');
            if(dts.length <= 0) {
                // No content
                dialog.close();
                return;
            }
            // Init prev id with first obj
            var offid = 0;
            var offset = $(dts.get(offid));
            var article, width, font, lineHeight;
            var obj, illu, dt, i, j, currid, nextid, prev, originoff, line, length = dts.length;
            var lines, decalage = 50, text;
            for(i = 0; i < length; ++i) {
                currid = parseInt( $(dts.get(i)).attr('index') );
                nextid = (i+1 == length) ? -1 : parseInt( $(dts.get(i+1)).attr('index') );
                
                // If prev and curr is seperated, one dialog is found
                if(currid != nextid-1) {
                    lines = new jQuery();
                    for(j = offid; j <= i; ++j){
                        lines = lines.add( dts.eq(j).data('originalObj') );
                        console.log(lines);
                    }
                    CommandMgr.executeCmd( new AddDialogCmd(lines, id, speaker) );
                    // Public.addDialog(lines, id, speaker);
                    
                    // Update offset infor
                    offid = i+1;
                    if(offid < length) offset = dts.eq(offid);
                }
            }
            dialog.close();
        });
        // Lines choosed event
        chooser.callback = new Callback(function(objs){
            var curr, dt, arr = [];
            
            // Sort for further manipulation
            for(var i = 0; i < objs.length; ++i) {
                curr = $(objs[i]);
                dt = $('<dt></dt>').append( curr.children('p').clone() );
                dt.data('originalObj', curr);
                dt.attr('index', curr.prevAll().length);
                arr.push(dt);
            }
            arr.sort(function(a,b) {
                return parseInt(a.attr('index')) - parseInt(b.attr('index'));
            });
            for(var i = 0; i < arr.length; ++i)
                lines.append(arr[i]);
        }, window);
        chooser.verifyFn = function(obj) {
            obj = $(obj);
            if(!(obj instanceof jQuery) || obj.children('p').text().trim() == "") return false;
            else return true;
        };
    };
    
    Public.addDialog = function($lines, id, speaker) { // $lines : jqObj contains the original obj to convert
        var article, prev, width, font, lineHeight, mood;
        
        article = $lines.parent();
        // Prev obj to the start obj, for insert the dialog after
        prev = $lines.eq(0).prev();
        
        // Parameters for dialog object
        mood = "neutre";
        width = $lines.eq(0).width();
        font = article.css('font-weight');
        font += " "+config.realX( cssCoordToNumber( article.css('font-size') ) )+"px";
        font += " "+article.css('font-family');
        lineHeight = parseInt(article.css('line-height'));
        // Create Dialog object
        obj = $('<div id="'+ id +'" class="speaker" data-who="'+speaker.name+'" data-withdrawal="'+ config.sceneX(config.withdrawal) + '" data-color="'+speaker.color+'" data-mood="'+mood+'"/>');
        obj.css({"width": width, "background-color": speaker.color});
        
        // Content
        text = "";
        $lines.each(function(){
            text += $(this).children('p').text();
        });
        $lines.detach();
        
        // Generate new speaks lines
        obj.append(generateSpeakLines(text, font, config.realX(width), config.realY(lineHeight), id, mood, config.withdrawal));
        
        // Append dialog in the beginning of article parent
        if(prev.length == 0) {
            article.prepend(obj);
        }
        else if(prev.prop('tagName') != "PARAGRAPHTAG") {
            prev.after(obj);
            // Insert a line break if there is not
            prev.after('<paragraphtag></paragraphtag>');
        }
        // Append dialog object after prev
        else prev.after(obj);
        // Remove the paragraphtag after the obj to avoid parse probleme
        if(obj.next().prop('tagName') == "PARAGRAPHTAG")
            obj.next().remove();  
                
        ArticleFormater.setConfigurable(obj);
        return obj;
    };

    Public.editDialogPopup = function($speak){
        //  search the asoociate speaker
        var speaker = $speak.attr( "data-who" );
        for( var i in srcMgr.sources )
            if( srcMgr.sourceType( i ) == "speaker" && srcMgr.getSource( i ).name == speaker )
                break;
        var spkObj = srcMgr.getSource( i );
        
        // setUp the list of moods
        var map = spkObj.portrait;
        var comboBox = $( '<div id="mood_selector">' );
        var defaultOpt = null;
        for( var i in map ){
            var option = $( '<div><img src="' +  spkObj.getMoodUrl( i ) + '"/><p>'+i+'</p></div>' );
            if(i == $speak.attr( "data-mood" ))            
                defaultOpt = option; // select the mood
            option.click( function( e ){
                var mood = $( e.currentTarget ).children('p').text();
                $speak.attr( "data-mood" , mood );
                $speak.children( 'img' ).attr( "src" , spkObj.getMoodUrl( mood ) );
                if(spkObj.portrait[mood]) 
                    $speak.children("img").attr( "name" , spkObj.portrait[mood]);
                else $speak.children("img").attr( "name" , "none");
                
                updateHightlight.call(this);
            });
            comboBox.append( option );
        }
        
        if(defaultOpt)
            updateHightlight.call(defaultOpt); // choose the current mood
        comboBox.children('div').css('border-radius', '5px');
        
        function updateHightlight( mood ){
            var that = $(this);
            that.siblings().css('border', 'solid 2px transparent');
            that.css('border', 'solid 2px #C21C1C');
        }
        
        dialog.showPopup('éditer interlocuteur', 350, 300, 'Modifier');
        dialog.main.append( comboBox  );
        
        
        var initialMood = $speak.attr("data-mood" );
        dialog.confirm.click(function() {
            var actualMood = $speak.attr("data-mood" );
            if( initialMood != actualMood )
                CommandMgr.executeCmd( new ModifySpeakMoodCmd( $speak , actualMood  , spkObj.getMoodUrl( actualMood ) ,  initialMood , spkObj.getMoodUrl( initialMood ) ) );
            
            dialog.close();
        });
        var delButton = dialog.addButton($('<input type="button" value="supprimer"></input>'));
        delButton.click({speakDiv: $speak}, function(e){
            var $speaker = e.data.speakDiv;     
            CommandMgr.executeCmd( new RemoveSpeakCmd($speaker) );    
            dialog.close();
        });
        
        dialog.annuler.click(function() {
            var actualMood = $speak.attr("data-mood" );
            if( initialMood != actualMood ){
                $speak.attr( "data-mood" , initialMood );
                $speak.children( 'img' ).attr( "src" , spkObj.getMoodUrl( initialMood ) );
            }
        });
    }

    Public.removeDialog = function(speakerDiv){
        var article = speakerDiv.parent();
        
        var content = speakerDiv.children('.textLine').children('p').text();        
        var width = article.width();
        var lineHeight = parseInt(article.css('line-height'));
        lineHeight = config.realY(lineHeight);
        var font = article.css('font-weight');
        font += " " + config.realX( cssCoordToNumber( article.css('font-size') ) )+"px";
        font += " " + article.css('font-family');
        
        var $lines = generateLines( content, font,  config.realX(width), config.realY(lineHeight));

		speakerDiv.after($lines);
        speakerDiv.detach();
        ArticleFormater.setConfigurable($lines);
        
        return $lines;
    }
    
    Public.removeSpeaker = function(src){ // call by circle menu
        var id = src.data('srcId');
        var speaker = srcMgr.getSource(id);
        var speakersDiv = speaker.getAssociateSpeak();
        var lines = [], res = null;
        for(var i = 0; i < speakersDiv.length; i++){
            res = Public.removeDialog(speakersDiv.eq(i));
            lines.push(res);            
        }
            
        srcMgr.delSource(id);
        
        return lines;
    }
    
    return Public;
})();

// Script system
var Script = function(src, srcType, action, target, reaction, immediate, supp){
    this.src = src;
    this.srcType = srcType;
    this.action = action;
    this.reaction = reaction;
    this.target = target;
    this.immediate = immediate;
    if(supp) this.supp = supp;
};
Script.prototype = {
    relatedWith: function(id) {
        return (this.src == id || this.target == id || this.supp == id);
    },
    constructor: Script
};

var scriptMgr = (function() {
    return {
        action: {
            obj: ["click", "doubleClick", "firstShow", "show", "disappear"],
            key: ["key"],
            anime: ["start", "end"],
            page: ["click", "doubleClick", "firstShow", "show", "drawover"],
            layer: ["firstShow", "show"]
        },
        reaction: {
            pageTrans: "page",
            objTrans: "obj",
            playAnime: "anime",
            changeCursor: "cursor",
            playVoice: "audio",
            stopVoice: "audio",
            addScript: "script",
            script: "code",
            effet: "effetname",
            playDefi: "",
            pauseDefi: "",
            loadGame: "game"
        },
        optionText: {
            click: "Clique", doubleClick: "Double clique", firstShow: "Première apparition", show: "Apparition",
            key: "Tape sur clavier", start: "Animation commence", end: "Animation termine", 
            drawover: "Affichage d'un frame termine", disappear: "Disparition",
            pageTrans: "Transition entre deux pages", objTrans: "Transition entre deux images",
            playAnime: "Démarrer l'animation", changeCursor: "Changer le cursor de souris",
            playVoice: "Lecture d'un son", stopVoice: "Arrêter un son",
            addScript: "Ajout d'un script", script: "Ajout d'une suite de codes",
            effet: "Démarrer un effet", playDefi: "Démarrer la lecture", pauseDefi: "Pauser la lecture",
            loadGame: "Démarrer un jeu"
        },
        cursors: ['default','pointer','crosshair','text','wait','help','move','autre'],
        scripts: {},
        expos: {},
        reactionTarget: function(type) {return this.reaction[type];},
        actionSelectList: function(id, type, choosedElem){
            var actfortype = this.action[type];
            if(!actfortype) return "";
            var select = '<select id="'+id+'">';
            for(var i in actfortype) {
                select += "<option value='"+actfortype[i]+"' ";
                if(choosedElem == actfortype[i]) select += 'selected';
                select += ">"+this.optionText[actfortype[i]]+"</option>";
            }
            select += '</select>';
            return select;
        },
        reactionList: function(id, choosedElem){
            var select = '<select id="'+id+'">';
            for(var i in this.reaction) {
                select += "<option value='"+i+"'";
                if(choosedElem == i) select += ' selected ';
                select += ">"+this.optionText[i]+"</option>";
            }
            select += '</select>';
            return select;
        },
        scriptSelectList: function(id, choosedElem){
            var choosedScript = null;
            if(typeof choosedElem == 'undefined')
                choosedElem = null;
            var select = '<select id="'+id+'">';
            for(var i in this.scripts) {
                select += "<option value='"+i+"'";
                if (choosedElem == i) select += " selected ";
                select += ">"+i+"</option>";
            }
            select += '</select>';
            return select;
        },
        cursorSelectList: function(id, choosedCursor){
            var select = '<select id="'+id+'">';
            for(var i in this.cursors){
                select += "<option value='"+this.cursors[i]+"'";
                if (choosedCursor == this.cursors[i]) select += ' selected ';
                select += ">"+this.cursors[i]+"</option>";
            }
            select += '</select>';
            return select;
        },
        addScript: function(name, src, srcType, action, target, reaction, immediate, supp){
            if(!name || !nameValidation(name))
                return;
            this.addScriptObj(name, new Script(src, srcType, action, target, reaction, immediate, supp));
        },
        addScriptObj: function(name, script) {
            if(!name || !nameValidation(name) || !(script instanceof Script))
                return;
                
            // If we are overwriting an existing script which is related to another src
            // we have to update the scripts number of this old src.
            if(this.scripts[name])
                this.delScript(name);
            // Creation script
            this.scripts[name] = script;
            // New script expo
            this.expos[name] = $('<div class="icon_src" id="'+name+'"><p>'+name+'</p></div>');
            $('#Scripts_panel').prepend(this.expos[name]);
            this.expos[name].click(function() { modifyScriptDialog([name]); });
            this.countScripts(script.src, script.srcType);
        },
        addScripts: function(scripts) {
            if(!(scripts instanceof Array) && Object.keys(scripts).length != 0)
                for(var i in scripts) {
                    this.addScriptObj(i, scripts[i]);
                }
        },
        delScript: function(name) {
            // Delete expo
            this.expos[name].remove();
            delete this.expos[name];
            // Delete Script
            var relatedObj = this.scripts[name].src;
            var relatedType = this.scripts[name].srcType;
            delete this.scripts[name];
            this.countScripts(relatedObj, relatedType);
        },
        getRelatedScriptids: function(objId) {
            var list = [];
            for(var elemid in this.scripts) {
                var elem = this.scripts[elemid];
                if(elem.relatedWith(objId))
                    list.push(elemid);
            }
            return list;
        },
        getRelatedScripts: function(objId) {
            var list = {};
            for(var elemid in this.scripts) {
                var elem = this.scripts[elemid];
                if(elem.relatedWith(objId))
                    list[elemid] = elem;
            }
            return list;
        },
        delRelatedScripts: function(objId){
            var relScripts = this.getRelatedScriptids(objId);
            for(var i = 0; i < relScripts.length ; i++)
                this.delScript(relScripts[i]);
        },
        getSameSrcScripts: function(objId){
            var list = [];
            for(var elem in this.scripts) {
                if(this.scripts[elem].src == objId){ // each related scripts
                    list.push(elem);
                }
            }
            return list;
        },
        getRelatedScriptsDesc: function(objId) {
            var list = [];
            for(var elemid in this.scripts) {
                var elem = this.scripts[elemid];
                if(elem.relatedWith(objId))
                    list.push("Le script: "+elemid);
            }
            return list;
        },
        updateRelatedScripts: function(objId, newId){
            for(var elem in this.scripts) {
                if(this.scripts[elem].src == objId)
                    this.scripts[elem].src = newId;
                else if(this.scripts[elem].target == objId)
                    this.scripts[elem].target = newId;
                else if(this.scripts[elem].supp == objId)
                    this.scripts[elem].supp = newId;
            }
        },
        saveLocal: function(){
            return this.scripts;
        },
        countScripts: function(objId, srcType, jQCaller) {
            var listScript = this.getSameSrcScripts(objId);           
            // display a little icon with the number of related script
            if (srcType == "obj")
                this.updateObjScCount(objId, listScript, jQCaller);
            else // circleMenu
                this.updateCircleMenuScCount(objId, srcType, listScript, jQCaller);
            
            if(listScript.length > 0) return listScript;
        },
        updateObjScCount: function(objId, listScript, jQCaller){
            var $obj = jQCaller ? jQCaller : $('#'+objId);
            var $scriptCounter = $obj.find('.scriptCounter');
            if ($scriptCounter.length > 0)  // remove the existing icon
                $scriptCounter.remove();
            $obj.data('scriptsList', listScript);
            
            var $nbscripts = listScript.length;
            if ($nbscripts > 0) {
                var $scriptIcon = $obj.find('.del_container img[src="./images/UI/addscript.jpg"]');
                var $delContainer = $obj.children('.del_container');
                var hidingHoverIc = $scriptIcon.css('display') == 'none';
                if (hidingHoverIc) $scriptCounter.hide();
                
                $delContainer.append('<div class="scriptCounter">'+ $nbscripts +'</div>');
                $scriptCounter = $delContainer.children('.scriptCounter');
                $scriptCounter.click(addScriptForObj);
                
                if($obj.parents('.article').length > 0){
                    var top = 60 + 5;
                    $scriptCounter.css({
                        'top': top,
                        'width': 'auto',
                        'left': '5px',
                        'line-height': 'initial'});
                }
                else {
                    //positionning the notification icons
                    $delContainer.children().show();
                    $scriptCounter.css('top', parseInt($scriptIcon.position().top)+5);
                    if(hidingHoverIc) $delContainer.children().hide();
                    
                    $scriptCounter.css('left', '5px');
                    $obj.hover(function(){$scriptCounter.show();},
                               function(){$scriptCounter.hide();});
                }
            }
        
        },
        updateCircleMenuScCount: function(objId, srcType, listScript, jQCaller){
            var source = false;
            var $circleMenu = $('#circleMenu');
            var $scriptCounter = $('#circleMenu .scriptCounter');
            if (srcType == "page") 
                source = $('#pageBar li:contains("'+objId+'")');
            else if (srcType == "anime") 
                source = srcMgr.expos[objId];
            
            if (listScript.length > 0 && source) {
                source.data('scriptsList', listScript);
                source.dblclick(function(e){
                    var $circleMenu = $('#circleMenu');
                    var nbScripts = $(this).data('scriptsList').length;
                    var countIcon = $('#circleMenu .scriptCounter')
                    if (countIcon.length > 0) countIcon.remove();
                    
                    countIcon = $('<div class="scriptCounter">'+nbScripts+'</div>');
                    if(nbScripts > 0){
                        var count = 0;
                        $circleMenu.children().each(function(i){
                            if ($(this).attr('src')=="./images/UI/addscript.jpg") count = i;
                        });
                        var x = e.clientX, y = e.clientY;
                        var rx = x, ry = (y<115) ? y : y-25, r = 90;
                        var alpha = (y<115) ? (Math.PI/180)*90/5 : -(Math.PI/180)*90/5;

                        countIcon.css({'left':0,'top':0,'opacity':0});
                        $circleMenu.append(countIcon);
                        var iconx = r*Math.cos(alpha*count) + 15, icony = r*Math.sin(alpha*count) + 15;
                        countIcon.animate({'left':"+="+iconx+"px",'top':"+="+icony+"px",'opacity':1}, 'normal', 'swing');
                        countIcon.click({src: $(this)},function(e){addScriptDialog(e.data.src);});
                    }
                });
            }
        },
        upload: function(url, pjName, lang){
            var data = {
                'pjName': pjName,
                'lang': lang,
                'data': JSON.stringify(this.scripts)
            };
            
            $.ajax({
                type: "POST",
                'url': url,
                'data': data,
                success: function(msg) {
                    if(msg && msg != "") alert("script upload errors: "+msg);
                },
                error: function(data) {
                    alert('ajax error on script upload, code : ' + data.status+', message : '+ data.statusText);
                }
            });
        }
    };
})();





// Editable tools
var EditableTool = function(jqToolsPanel, activeButton){
    // Verify tools panel
    if(!jqToolsPanel || !jqToolsPanel.hasClass || !jqToolsPanel.hasClass('central_tools') || jqToolsPanel.data('relatTool') != undefined) {
        console.error("Fail to initialize a editable tool, tools panel isn't valid");
        return;
    }
    this.toolsPanel = jqToolsPanel;
    this.toolsPanel.css('z-index', config.zid.EditableTool);
    this.toolsPanel.data('relatTool', this);
    
    if(activeButton && activeButton.click) {
        this.activeBn = activeButton;
        this.activeBn.data('relatTool', this);
        // Active process
        this.activeBn.click(function() {
            var tool = $(this).data('relatTool');
            if(tool instanceof EditableTool) {
                tool.active();
            }
        });
    }
    // Verify the existance of del container
    if(jqToolsPanel.find('.del_container img').length == 0) {
        jqToolsPanel.hideable(function() {
            var tool = $(this).parents('.central_tools').data('relatTool');
            tool.close();
        });
    }
    
    // Init editor
    this.editor = $('<div class="direct_editor">');
    this.editor.data('relatTool', this);
    
    // Register this tool
    var id = this.toolsPanel.prop('id');
    if(!this.constructor.prototype.allTools) this.constructor.prototype.allTools = '#'+id;
    else if(this.constructor.prototype.allTools.indexOf(id) == -1)
        this.constructor.prototype.allTools += ', #'+id;
};
EditableTool.prototype = {
    constructor: EditableTool,
    allTools: '',
    init: function() {},
    active: function() {
        // Trigger close event if center panel is showing up
        var allTools = $(this.allTools);
        allTools.filter(':visible').find('.del_container img:first').click();
        allTools.hide();
        this.toolsPanel.show();
        this.getEditorParent().append(this.editor);
        
        this.init();
    },
    getEditorParent: function() {
        if($('#animeTools').css('display') == 'block') {
            return $('#editor');
        }
        else return curr.page;
    },
    getTarget: function() {
        if($('#animeTools').css('display') == 'block') {
            var tar;
            $('#editor').children().each(function(){
                if($(this).css('z-index') == '2')
                    tar = $(this);
            });
            return tar;
        }
        else return curr.step;
    },
    finishEdit: function(elems, tar) {},
    close: function() {
        CommandMgr.executeCmd(new AddToSceneCmd(this, this.editor.children(), this.getTarget()));

        this.editor.children().remove();
        this.editor.detach();
        this.toolsPanel.hide();
    }
};

var initTextTool = function() {
    var tool = new EditableTool($('#textTools'), $('#texticon'));
    
    function textConfChanged(e) {tool.configChanged(e);};
    // Config change real time listener
    $('#text_color').change(textConfChanged);
    $('#text_font').change(textConfChanged);
    $('#text_size').change(textConfChanged);
    $('#text_style').change(textConfChanged);
    $('#text_align').change(textConfChanged);
    
    $.extend(tool, {
        finishEdit: function(elems, tar) {
            elems.each(function() {
            	var area = $(this).children('textarea');
            	var arr = area.val().split('\n');
            	if(arr.length == 1 && arr[0] == "") return;
            	var res = $('<div id="obj'+(curr.objId++)+'"></div>');
            	res.css({
            		'position':'absolute', 'left':$(this).css('left'), 'top':$(this).css('top'),
            		'font-size':area.css('font-size'), 'font-family':area.css('font-family'), 'font-weight':area.css('font-weight'),
            		'line-height':fontsize*1.1+'px', 'text-align':area.css('text-align'), 'color':area.css('color')
            	});
					
					defineZ(curr.step, res);
					
            	var fontsize = area.css('font-size');
            	for(var i = 0; i < arr.length; i++) {
            		res.append('<p style="margin:0px;padding:0px;">'+arr[i]+'</p>');
            	}
					
            	// Append all in current step
            	res.children('p').editable(TextUtil.editFinishCb, TextUtil.editPrepaCb, true);
            	res.moveable().resizable().deletable().configurable().hoverButton('./images/UI/addscript.jpg', addScriptForObj).appendTo(tar);
                res.canGoDown();
            });
        },
        createTextArea: function(e) {
            if(this.editor.get(0) != e.target){
				if( $( e.target ).parent().hasClass("text" ) )		// click on the textArea
					this.changeEditing( $( $( e.target ).parent() ) );
				if( $( e.target ).hasClass("text" ) )				// click on the div element
					this.changeEditing( $( e.target ) );
				return;
			}
            if(this.editing) {
            	if(this.editing.children('textarea').val() == "") this.editing.remove();
            }
            
            this.editing = $('<div class="text"><textarea row="2" cols="16" autofocus="true"></textarea></div>');
            this.editing.css({
            	left:e.clientX-this.editor.offset().left+'px', 
            	top:e.clientY-this.editor.offset().top+'px'
            });
            // Param
            this.configChanged();
            this.editor.append(this.editing);
            this.editing.moveable().selectable(function(){
            	$(this).children('textarea').focus();
            }).deletable();
        },
		changeEditing:function( target ){
			// update the config panel
			
			var testArea = target.children( "textArea" );
			var tcolor = getColorHex( testArea.css( "color" ) );
			var font  = testArea.css( "font-family" );
			var style = testArea.css( "font-weight"  );
			if( !style || style == "" ) style = "normal";
			var size  = config.realY( cssCoordToNumber( testArea.css( "font-size" ) ) );
			var align = testArea.css( "text-align"  );
			
			
			$('#text_color').prop( "value" , tcolor );
			$('#text_font').prop( "value" , font );
			$('#text_size').prop( "value" , size );
			$('#text_style').prop( "value" , style );
			$('#text_align').prop( "value" , align );
			
			this.editing = target;
		},
        configChanged: function(e){
            if(!this.editing) return;
            // Param
            var tcolor = $('#text_color').val();
            if(!isColor(tcolor)) tcolor = 'none';
            var font = $('#text_font').val();
            var size = $('#text_size').val();
            size = config.sceneY(isNaN(size) ? 16 : size);
            var style = $('#text_style').val();
            if(style == "normal") style = "";
            var align = $('#text_align').val();
            
            this.editing.children('textarea').css({
            	'text-align':align, 
            	'font':style+' '+size+'px '+font, 
            	'color':tcolor
            });
        }
    });
    
    tool.editor.click(function(e){tool.createTextArea(e);});
    return tool;
};

var initShapeTool = function() {
    var tool = new EditableTool($('#shapeTools'), $('#recticon'));
    // Tool chooser in shape tools
    var tools = $('#shapeTools').find('img:lt(4)');
    tools.click(function() {
    	tools.removeClass('active');
    	$(this).addClass('active');
    	//tool.shapeType = $(this).prevAll()
    	// Type
    	$('#shapeTools img').each(function(id) {
    		if($(this).hasClass('active')) {
    			tool.shapeType = id;
    			return false;
    		}
    	});
    });
    
    function cbstart(e){tool.startDraw(e);};
    function cbdraw(e){tool.drawing(e);};
    function cbfinish(e){tool.cancelDraw(e);};
    $.extend(tool, {
        init: function() {
            $('body').mouseup(cbfinish).mousemove(cbdraw);
            this.shapeType = 0;
        },
        finishEdit: function(elems, tar) {
            elems.detach();
            elems.each(function() {
            	$(this).attr('id', 'obj'+(curr.objId++));
				
				$(this).children(".del_container").remove();
				$(this).resizable().moveable().deletable().configurable().canGoDown();
				
            	$(this).hoverButton('./images/UI/addscript.jpg', addScriptForObj);
				
				
            });
				defineZ(tar, elems);
            elems.appendTo(tar);
			
            $('body').unbind('mouseup', cbfinish);
            $('body').unbind('mousemove', cbdraw);
        },
        startDraw: function(e) {
            this.drawstarted = true;
            this.originx = e.clientX;
            this.originy = e.clientY;
            // Param
            var weight = $('#shape_weight').val();
            weight = isNaN(weight) ? 1 : weight;
            var radius = $('#shape_radius').val();
            radius = isNaN(radius) ? 0 : radius;
            var opac = $('#shape_opac').val();
            opac = (opac!=''&&isRatio(opac, 100)) ? opac/100 : 1;
            var fcolor = $('#shape_fill').val();
            if(!isColor(fcolor)) fcolor = 'none';
            var scolor = $('#shape_stroke').val();
            if(!isColor(scolor)) scolor = '#000';
            
            switch(this.shapeType) {
            case 0: case 1: // Rectangle
            	this.editing = $('<div class="rect"></div>');
            	this.editing.css({
            		left:e.clientX-this.editor.offset().left+'px', 
            		top:e.clientY-this.editor.offset().top+'px',
            		width:'0px', height:'0px',
            		background:fcolor, opacity:opac, 
            		'border-color':scolor, 'border-width':weight+'px'
            	});
            	this.editor.append(this.editing);
            	// Manip
            	this.editing.resizable().moveable().deletable().configurable().canGoDown();
            	break;
            case 2: // Elipse
            	break;
            case 3: // Line
            	break;
            default:break;
            }
            if(radius != 0 && this.shapeType == 1) {
            	// Round radius to rect
            	radius = radius+'px';
            	this.editing.css({'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius});
            }
        },
        cancelDraw: function(e) {
            if(this.drawstarted) {
            	this.drawstarted = false;
            	if(this.editing && (this.editing.width() == 0 || this.editing.height() == 0))
            		this.editing.remove();
            	this.editing = null;
            }
        },
        drawing: function(e) {
            if(!this.drawstarted || !this.editing) return;
            switch(this.shapeType) {
            case 0: case 1: // Rectangle
            	var dx = e.clientX - this.originx, dy = e.clientY - this.originy;
            	this.editing.css({width:dx+'px',height:dy+'px'});
            	break;
            case 2:
                break;
            case 3: // Line
            	break;
            default:break;
            }
        }
    });
    
    tool.editor.mousedown(cbstart).mouseup(cbfinish).mousemove(cbdraw);
    return tool;
}






// Editable tools
var CreatTool = function(jqToolsPanel, activeButton, unhideable){
// Verify tools panel
    if(!jqToolsPanel || !jqToolsPanel.hasClass || !jqToolsPanel.hasClass('central_tools') || jqToolsPanel.data('relatTool') != undefined) {
        console.error("Fail to initialize a create tool, tools panel isn't valid");
        return;
    }
    this.toolsPanel = jqToolsPanel;
    this.toolsPanel.css('z-index', config.zid.CreatTool);
    this.toolsPanel.data('relatTool', this);
    
    if(activeButton && activeButton.click) {
        this.activeBn = activeButton;
        this.activeBn.data('relatTool', this);
        // Active process
        this.activeBn.click(this.activefn);
    }
    if(unhideable !== true) {
        // Verify the existance of del container
        if(jqToolsPanel.find('.del_container img').length == 0) {
            jqToolsPanel.hideable(function() {
                var tool = $(this).parents('.central_tools').data('relatTool');
                tool.close();
            });
        }
    }
    this.editor = $('#editor');
    this.menuMask = $('#menu_mask');
};
CreatTool.prototype = {
    constructor: EditableTool,
    allTools: '',
    init: function() {},
    activefn: function() {
        var tool = $(this).data('relatTool');
        if(tool instanceof CreatTool) {
            tool.active();
        }
    },
    active: function() {
        // Register
        this.editor.data('relatTool', this);
        // Trigger close event if center panel is showing up
        $('.central_tools').filter(':visible').find('.del_container img:first').click();
        this.toolsPanel.show();
        this.editor.show();
        this.menuMask.show();
        
        this.init(arguments);
    },
    finishEdit: function(elems) {},
    close: function() {
        this.finishEdit(this.editor.children());
        this.editor.removeData('relatTool');
        this.editor.unbind().hide().children().remove();
        this.toolsPanel.hide();
        this.menuMask.hide();
    }
}

var initWikiTool = function() {
    var tool = new CreatTool($('#wikiTools'), $('#wikiicon'));
    // Font configue in Wiki tools
    tool.color = $('#wiki_color').change(function(){
        tool.editor.find('h5, h3, h4, div').css('color', $(this).val());
    });
    tool.font = $('#wiki_font').change(function(){
        tool.editor.find('h5, h3, h4, div').css('font-family', $(this).val());
    });
    tool.fsize = $('#wiki_size').change(function(){
        tool.editor.find('h5, h3, h4, div').css('font-size', config.sceneY($(this).val())+'px');
    });
    
    $.extend(tool, {
        init: function() {
            this.editor.css('overflow','auto');
            this.addWikiCard('generator');
        },
        finishEdit: function(elems) {
            this.editor.css('overflow','hidden');
        },
        dragStart: function(e) {
            if(e.originalEvent) e = e.originalEvent;
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('text/html', $(this).html());
            tool.dragSrc = $(this);
        },
        dragOverZone: function(e) {
            if(e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            return false;
        },
        dragOver: function(e) {
            if(e.originalEvent) e = e.originalEvent;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            
            // Create or move dropzone
            var zone = $(this).siblings('#card_drop');
            if(zone.length == 0) {
                zone = $('<div id="card_drop" class="wiki_card">');
                zone.width(config.wikiWidth)
                    .height(config.wikiHeight)
                    .addClass('card_over');
            }
            else zone.detach();
            $(this).before(zone);
            zone.bind('dragover', tool.dragOverZone).bind('drop', tool.drop);
            
            return false;
        },
        dragEnd: function(e) {
            $('#card_drop').remove();
            tool.dragSrc = null;
        },
        drop: function(e) {
            if(e.originalEvent) e = e.originalEvent;
            e.stopPropagation();
            
            var card = e.dataTransfer.getData('text/html');
            if(!card || !tool.dragSrc) return false;
            $(this).replaceWith(tool.dragSrc.detach());
            tool.dragSrc = null;
            
            return false;
        },
        addWikiCard: function(type) {
            var w = config.wikiWidth;
            var h = config.wikiHeight;
            var card = $('<div class="wiki_card" draggable="true"></div>');
            card.width(config.wikiWidth).height(config.wikiHeight);
            switch(type) {
            case 'generator':
                card.prop('draggable', false);
                card.css('cursor', 'default');
                this.editor.append(card);
                card.append('<img id="wiki_addDesc" src="./images/tools/wiki_addDescription.png" style="top:'+(1/7*h)+'px;height:'+(1/7*h)+'px;">');
                card.append('<img id="wiki_addImg" src="./images/tools/wiki_addImg.png" style="top:'+(3/8*h)+'px;height:'+(1/7*h)+'px;">');
                card.append('<input id="wiki_name" type="text" placeholder="Nom de wiki" style="top:'+(5/8*h)+'px;height:20px;">');
                card.append('<input id="save_wiki" type="button" value="Sauvegarder" style="top:'+(7/9*h)+'px;height:30px;">');
                $('#wiki_addDesc').click(function(){tool.addWikiCard('description');});
                $('#wiki_addImg').click(function(){tool.addWikiCard('image');});
                $('#save_wiki').click({'editor':this.editor},this.saveWiki);
            break;
            case 'image':
                card.insertBefore('.wiki_card:last').deletable();
                var img = (new DropZone(this.dropImgToWikiCard, {'top':'20px','height':(h-90)+'px'}, "wikiImgInput")).jqObj;
                card.append(img);
                var legend = $('<textarea row="1" col="18" style="top:'+(h-45)+'px;height:20px;font-style:italic;">Legend</textarea>');
                legend.blur(function(){
                    var newlegend = $('<h5>'+$(this).val()+'</h5>');
                    newlegend.css({'top':(h-45)+'px'});
                    $(this).replaceWith(newlegend);
                    newlegend.editable();
                });
                card.append(legend);
                card.bind('dragstart', this.dragStart);
                card.bind('dragover', this.dragOver);
                card.bind('dragend', this.dragEnd);
            break;
            case 'description':
                card.insertBefore('.wiki_card:last').deletable();
                addSect = $('<input type="button" value="Nouvelle section" style="margin-top:10px;height:30px;">');
                card.append(addSect);
                addSect.click(this.addSectionDialog);
                card.bind('dragstart', this.dragStart);
                card.bind('dragover', this.dragOver);
                card.bind('dragend', this.dragEnd);
            break;
            }
            return card;
        },
        addSectionWiki: function(button, title, type, content) {
            if(!title) {
               alert('Information incomplete.'); 
               return false;
            }
            var font = this.font.val();
            var fsize = config.sceneY(this.fsize.val());
            var fcolor = this.color.val();
            var h3 = $('<h3>'+title+'</h3>');
            if(type == 'text') {
                if(!content) {
                    alert('Information incomplete.');
                    return false;
                }
                var temp = $('<div class="wikitext">'+content+'</div>');
            }
            else if(type == 'link') {
                if( content.match(/^\w+:\/(\/[\-\_\w\?\&\.]+)+/) ) {
                    var temp = $('<img src="./images/UI/wikibutton.png" style="width:'+(config.wikiWidth*0.5)+'px;height:'+fsize+'px;left:20%;position:relative;" value="'+content+'">');
                }
                else {
                    alert('Votre lien url n\'est pas correct.');
                    return false;
                }
            }
            h3.editable();
            temp.editable(new Callback(function(content, obj) {
                obj.addClass('wikitext');
            }, window));
            button.before(h3).before('<div class="sepline"></div>').before(temp);
            button.prevAll().css({'font-family':font, 'font-size':fsize, 'color':fcolor});
            return true;
        },
        saveWiki: function(e) {
			var name = $('#wiki_name').val();
				var editor = e.data.editor;
            if(!name || !nameValidation(name)) {
                alert('Échec à sauvegarder, nom de wiki invalid');
                return false;
            }
            // Trigger blur event to make legend valid
            editor.find('input').blur();
            // Copy all in current step to src
            var cards = editor.children('div:last-child').prevAll();
            if(cards.length == 0) return false;
            // Other parameters
            var wiki = new Wiki(name, cards.clone(), $('#wiki_font').val(), parseInt( $('#wiki_size').val() ), $('#wiki_color').val());
            var nomExiste = false;
            for (elem in srcMgr.sources) {
                    if (srcMgr.sources[elem].type == 'wiki' && elem == name) nomExiste = true;
            }
            if (nomExiste) {
                dialog.showPopup('Ce nom existe déja', 300, 150, 'Confirmer');
                dialog.main.append('<p><label>Nouveau nom : </label><input id="rename" type="text" value="'+name+'"></p>');
                dialog.main.append('<p><label>Ecraser : </label><input id="eraseName" type="checkbox"></p>');
                dialog.confirm.click(function(){
                    if($('#rename').val() != name || $('#eraseName').get(0).checked) {
                        CommandMgr.executeCmd(new ModSrcCmd('wiki', wiki, $('#rename').val()));
                        dialog.close();
                    }
                });				 
            }
            else CommandMgr.executeCmd(new AddSrcCmd('wiki', wiki, name));
            return true;
        },
        dropImgToWikiCard: function(e) {
            e = e.originalEvent;
            e.stopPropagation();
            if($(this).hasClass('drop_zone')) $(this).css('border-style', 'dotted');
            else $(this).css('border-style', 'none');
            
            var id = e.dataTransfer.getData('Text');
            var data = srcMgr.getSource(id);
            var type = srcMgr.sourceType(id);
            // Verification
            if(!data || type != "image") return;
            
            var img = $('<img name="'+id+'" src="'+data+'" style="top:20px;">');
            img.bind('dragover', DropZone.prototype.dragOverElemZone)
                .bind('dragleave', DropZone.prototype.dragLeaveElemZone)
                .bind('drop', this.dropImgToWikiCard);
            img.mouseup(DropZone.prototype.dragLeaveElemZone);
            // Append to elem zone
            $(this).replaceWith(img);
        },
        addSectionDialog: function(e) {
            dialog.showPopup('Nouvelle section de la carte Wiki', 400, 230, 'Ajouter');
            dialog.main.append('<p><label>Titre:</label><input id="section_title" type="text" size="10"></p>');
            dialog.main.append('<p><label>Type:</label><select id="section_type"><option value="text">texte</option><option value="link">lien</option></select></p>');
            dialog.main.append('<p><label>Contenu:</label><textarea row="5" cols="22" id="section_content" style="margin-left:10px;"></textarea></p>');
            
            dialog.confirm.click(function(){
                if( tool.addSectionWiki($(e.target), $('#section_title').val(), $('#section_type').val(), $('#section_content').val()) )
                    dialog.close();
            });
        }
    });
    
    return tool;
}

var initAnimeTool = function() {
    var tool = new CreatTool($('#animeTools'), $('#animeicon'));
    
    tool.timeline = $('#timeline').hide();
    tool.addFrameBn = $('#addFrame');
    $('#createAnime').click(function(){
        var name = $("#animeName").val();
        var repeat = $("#animeRepeat").val();
        var block = $("#animeBlock").val();
        var statiq = tool.editor.data('static') == 'false' ? false : true;
        // Name validation
        if(!name || !nameValidation(name)) {
            alert('Échec à sauvegarder, nom d\'animation invalid');
            return false;
        }
        
        var anime = new Animation(name, repeat, block, statiq);
        anime.createAnimation(tool.timeline.children('div'));
        // Existance check
		var nomExiste = false;
		for(elem in srcMgr.sources) {
		    if(srcMgr.sources[elem].type == 'anime' && elem == name) 
		        nomExiste = true;
		}
		if(nomExiste) {
			dialog.showPopup('Ce nom existe déja', 300, 150, 'Confirmer');
			dialog.main.append('<p><label>Nouveau nom : </label><input id="rename" type="text" value="'+name+'"></p>');
			dialog.main.append('<p><label>Ecraser : </label><input id="eraseName" type="checkbox"></p>');
			dialog.confirm.click(function(){
                if($('#rename').val() != name || $('#eraseName').get(0).checked) {
                    CommandMgr.executeCmd(new ModSrcCmd('anime', anime, $('#rename').val()));
				    dialog.close();
			    }
			});
		}
        else
            CommandMgr.executeCmd(new AddSrcCmd('anime', anime, name));
    });
    
    var addAnimeObj = function(e, id, data) {
        var img = $('<img name="'+ id +'" src="'+ data +'">');
    	img.css({'width':'100%','height':'100%'});
    	
    	var src = srcMgr.getSource(id);
    	if(src.width && src.height) var w = src.width, h = src.height;
    	else var w = img.prop('width'), h = img.prop('height');
    	var cw = $('#editor').width()/2, ch = $('#editor').height()/2;
    	if(!w || !h) return;
        
    	var container = $('<div>');
    	container.append(img);
    	container.deletable();
    	
    	// Resize
    	var ratiox = cw/w;
    	var ratioy = ch/h;
    	var ratio = (ratiox > ratioy ? ratioy : ratiox);
    	if(ratio < 1) {w = w*ratio; h = h*ratio;};
    	container.css({'position':'absolute', 'top':e.offsetY-h/2+'px', 'left':e.offsetX-w/2+'px'});
    	container.css({'width':w+'px', 'height':h+'px', 'border-style':'solid', 'border-color':'#4d4d4d', 'border-width':'0px'});
    	
    	// Listener to manipulate
    	// Choose Resize Move
    	container.resizable().moveable().configurable();
    	// Recut the image
    	container.hoverButton('./images/UI/recut.png', tool.recutAnimeObj)
    	         .hoverButton('./images/UI/spritecut.png', animeTool.spriteCut)
                 .canGoDown();
    
    	$('#editor').children().each(function(){
    	    if($(this).css('z-index') == '2'){
                defineZ($(this), container);
    	        $(this).append(container);
            }
    	});
    }
    
    function chooseFrame(e){
        var tar = $(this).children('img');
        var frw = tar.data('frw');
        var frh = tar.data('frh');
        var rx = $(this).width() / tar.prop('naturalWidth');
        var ry = $(this).height() / tar.prop('naturalHeight');
        frw = frw * rx; frh = frh * ry;
        var ox = Math.floor(e.offsetX / frw)*frw;
        var oy = Math.floor(e.offsetY / frh)*frh;
        var maskctx = $(this).children('canvas').get(0).getContext('2d');
        maskctx.clearRect(0,0,maskctx.canvas.width,maskctx.canvas.height);
        maskctx.fillStyle = "#FFBA84";
        maskctx.globalAlpha = 0.6;
        maskctx.fillRect(ox, oy, frw, frh);
    }
    
    function redrawAnimeObj(canvas) {
        // Draw image
        var ctx = canvas.get(0).getContext("2d");
        var w = canvas.get(0).width, h = canvas.get(0).height;
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(canvas.data('img'), 0, 0, w, h);
        // Retrieve selection zone points
        var roix = canvas.data('roix');
        var roiy = canvas.data('roiy');
        var roiw = canvas.data('roiw');
        var roih = canvas.data('roih');
        // Draw mask
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0,0,roix,h);
        ctx.fillRect(roix,0,roiw,roiy);
        ctx.fillRect(roix+roiw,0,w-roix-roiw,h);
        ctx.fillRect(roix,roiy+roih,roiw,h-roiy-roih);
        ctx.globalAlpha = 1;
        // Draw control points
        ctx.fillStyle = '#E30';
        ctx.strokeStyle = '#E30';
        ctx.fillRect(roix-2.5,roiy-2.5,5,5);
        ctx.fillRect(roix+roiw-2.5,roiy-2.5,5,5);
        ctx.fillRect(roix+roiw-2.5,roiy+roih-2.5,5,5);
        ctx.fillRect(roix-2.5,roiy+roih-2.5,5,5);
        ctx.strokeRect(roix,roiy,roiw,roih);
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
    }
    function startRecut(e){
        e.preventDefault();
        e.stopPropagation();
        tag.cutstarted = true;
        var x = e.offsetX, y = e.offsetY;
        var roix = $(this).data('roix');
        var roiy = $(this).data('roiy');
        var roiw = $(this).data('roiw');
        var roih = $(this).data('roih');
        var dx = Math.abs(x-roix), dy = Math.abs(y-roiy);
        if(dx < 3 && dy < 3) {
            curr.cutCtrlPt = 0;return true; // Left Top
        }
        dx = Math.abs(x-roix-roiw);
        if(dx < 3 && dy < 3) {
            curr.cutCtrlPt = 1;return true; // Right Top
        }
        dy = Math.abs(y-roiy-roih);
        if(dx < 3 && dy < 3) {
            curr.cutCtrlPt = 2;return true; // Right Bottom
        }
        dx = Math.abs(x-roix);
        if(dx < 3 && dy < 3) {
            curr.cutCtrlPt = 3;return true; // Right Top
        }
        if(x > roix && y > roiy && x < roix+roiw && y < roiy+roih){
            curr.cutCtrlPt = 4; // Move selection zone
            prevState.cutX = x;
            prevState.cutY = y;
            return true;
        }
    }
    function recutting(e){
        if(!tag.cutstarted || isNaN(curr.cutCtrlPt)) return;
        e.preventDefault();
        e.stopPropagation();
        var x = e.offsetX, y = e.offsetY;
        var roix = $(this).data('roix');
        var roiy = $(this).data('roiy');
        var roiw = $(this).data('roiw');
        var roih = $(this).data('roih');
        switch(curr.cutCtrlPt) {
        case 0:
            if(x < roix+roiw && y < roiy+roih) {
                $(this).data('roiw', roix+roiw-x);$(this).data('roih', roiy+roih-y);
                $(this).data('roix', x);$(this).data('roiy', y);
            }
            break;
        case 1:
            if(x > roix && y < roiy+roih) {
                $(this).data('roiw', x-roix);$(this).data('roih', roiy+roih-y);
                $(this).data('roiy', y);
            }
            break;
        case 2:
            if(x > roix && y > roiy) {
                $(this).data('roiw', x-roix);$(this).data('roih', y-roiy);
            }
            break;
        case 3:
            if(x < roix+roiw && y > roiy) {
                $(this).data('roiw', roix+roiw-x);$(this).data('roih', y-roiy);
                $(this).data('roix', x);
            }
            break;
        case 4:
            if(isNaN(prevState.cutX) || isNaN(prevState.cutY)) return;
            $(this).data('roix', roix+x-prevState.cutX);
            $(this).data('roiy', roiy+y-prevState.cutY);
            prevState.cutX = x;
            prevState.cutY = y;
            break;
        default: return;
        }
        redrawAnimeObj($(this));
    }
    function endRecut(e){
        if(tag.cutstarted) {
        	e.preventDefault();
        	e.stopPropagation();
        	tag.cutstarted = false;
        	curr.cutCtrlPt = prevState.cutX = prevState.cutY = null;
        }
    }
    function confirmCut(e) {
        e.preventDefault();e.stopPropagation();
        var container = $(this).parent().parent();
        var tar = container.children('canvas');
        var roix = tar.data('roix');
        var roiy = tar.data('roiy');
        var roiw = tar.data('roiw');
        var roih = tar.data('roih');
        var img = $(tar.data('img'));
        var w = tar.get(0).width, h = tar.get(0).height;
        container.children().remove();
        container.css({'width':roiw+'px', 'height':roih+'px', 'overflow':'hidden'});
        img.css({'position':'relative', 'left':-100*roix/roiw+'%', 'top':-100*roiy/roih+'%', 'width':100*w/roiw+'%', 'height':100*h/roih+'%'});
        container.append(img);
        container.deletable().resizable().moveable().configurable().hoverButton('./images/UI/recut.png', tool.recutAnimeObj);
    }
    
    $.extend(tool, {
        init: function(args){
            this.editor.css('background', 'transparent');
            this.timeline.show();
            
            if(args.length == 0) 
                this.editor.data('static','true').bind('dragover', dragOverScene).bind('drop', this.dropToAnimeEditor);
            else this.editor.data('static','false');
            
            // Create new frame
            if($('#timeline .frameexpo').length == 0) $('#addFrame').click();
            // Append target object
            if(args.length > 0 && args[0] !== false) {
                var tar = args[0].clone();
                // Article text obj special initialisation
                if(args[0].parents('.article').length != 0) {
                    var font = {
                        'font-family':args[0].css('font-family'),
                        'font-size':args[0].css('font-size'),
                        'color':args[0].css('color')
                    };
                    args[0].css(font);
                    tar.css(font);
                    tar.css({
                        'position': 'relative',
                        'top': args[0].offset().top-this.editor.offset().top+'px',
                        'left': args[0].offset().left-this.editor.offset().left+'px',
                        'width': args[0].width()+'px',
                        'height': args[0].height()+'px'
                        });
                    tar.children('p').css({'margin':'0px','padding':'0px'});
                }
                tar.children('.del_container').remove();
                tar.deletable().configurable();
                this.editor.children('.frame').each(function(){
                    if($(this).hasClass('active')) $(this).append(tar);
                });
            }
        },
        animateObj: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var tar = $(this).parent().parent();
            tool.active(tar);
        },
        finishEdit: function(){
            this.addFrameBn.prevAll().remove();
            this.timeline.hide();
            this.editor.removeData('static').css('background', '#ffffff');
            $('#animeName').val("");
            $('#animeRepeat').val(1);
        },
        transSetup: function(e){
            var trans = $(e.target);
            var posv = trans.data('pos'), sizev = trans.data('size'), opacv = trans.data('opac'), fontv = trans.data('font');
            dialog.showPopup('Configuration de la transition', 400, 300, 'Confirmer', trans);
            var options = '<option value="2">Homogène</option><option value="1">Aucune</option>';
            var pos = $('<p><label>Position:</label><select id="trans_pos">'+options+'</select></p>');
            var size = $('<p><label>Taille:</label><select id="trans_size">'+options+'</select></p>');
            var opac = $('<p><label>Opacité:</label><select id="trans_opac">'+options+'</select></p>');
            var font = $('<p><label>Police:</label><select id="trans_font"">'+options+'</select></p>');
            pos.find('option[value="'+(posv?posv:2)+'"]').attr('selected', 'true');
            size.find('option[value="'+(sizev?sizev:2)+'"]').attr('selected', 'true');
            opac.find('option[value="'+(opacv?opacv:2)+'"]').attr('selected', 'true');
            font.find('option[value="'+(fontv?fontv:2)+'"]').attr('selected', 'true');
            dialog.main.append(pos).append(size).append(opac).append(font);
            
            dialog.confirm.click(function(){
                if(!dialog.caller) return;
                var trans = dialog.caller;
                trans.data('pos', $('#trans_pos').val());
                trans.data('size', $('#trans_size').val());
                trans.data('opac', $('#trans_opac').val());
                trans.data('font', $('#trans_font').val());
                dialog.close();
            });
        },
        showFrame: function(frame) {
            this.editor.children('.frame').css('z-index', 1).removeClass('active');
            frame.css('z-index', 2).addClass('active');
        },
        addFrame: function(interval, empty) {
            if(isNaN(interval) || interval <= 0) var interval = 0.5;
            var frameexpo = $('<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>'+interval+'</span>s</h5><div class="motion"/></div>');
            frameexpo.find('span').editable();
            // Set default transition
            frameexpo.children('div.motion').data('pos','2').data('size','2').data('opac','2').data('font','2');
            // Insert
            var expos = tool.addFrameBn.prevAll();
            if(expos.length == 0) tool.addFrameBn.before(frameexpo);
            else
                expos.each(function(){
                    if($(this).hasClass('active')) $(this).after(frameexpo);
                });
            // Append frame in editor
            var frame = $('<div class="frame"></div>');
            tool.editor.append(frame);
            frameexpo.data('frame', frame);
            // Copy content in previous frame to the new frame
            var prev = frameexpo.prev();
            if(empty!==true && prev.length == 1) {
                var content = prev.data('frame').children().clone(true);
                content.find('.del_container').remove();
                content.find('canvas').parent().remove();
                content.each(function(){
                    var img = $(this).children('img');
                    if(img.length == 1) {
                        $(this).deletable().configurable();
                        // Sprite
                        if(!isNaN(img.data('fr')))
                            $(this).hoverButton('./images/UI/spritecut.png', animeTool.spriteCut);
                        // Free cut sprite
                        // BUG jQuery, css width in percentage will be recognized as pixel value
                        else if(img.width() != 100)
                            $(this).hoverButton('./images/UI/recut.png', tool.recutAnimeObj);
                        // Uncut image
                        else $(this).hoverButton('./images/UI/recut.png', tool.recutAnimeObj)
                                    .hoverButton('./images/UI/spritecut.png', animeTool.spriteCut);
                    }
                    else $(this).deletable().configurable();
                });
                frame.append(content);
            }
            // Active function
            frameexpo.click(function(){
                tool.addFrameBn.prevAll().removeClass('active');
                $(this).addClass('active');
                tool.showFrame($(this).data('frame'));
            }).click();
            // Deletable
            frameexpo.deletable(tool.delFrame);
            return frameexpo;
        },
        delFrame: function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Show another frame
            var target = $(this).parent().parent();
            if(target.prev().length > 0) target.prev().click();
            else if(target.next('div').length > 0) target.next('div').click();
            else return;
            // Delete frame
            target.data('frame').remove();
            // Delete frame expo
            target.remove();
        },
        dropToAnimeEditor: function(e){
            e = e.originalEvent;
            e.stopPropagation();
            var id = e.dataTransfer.getData('Text');
            var type = srcMgr.sourceType(id);
            if(!id || type != "image") return;
            var data = srcMgr.getSource(id);
            if(data == null) return;
            
            addAnimeObj(e, id, data);
        },
        recutAnimeObj: function(e){
            e.preventDefault();e.stopPropagation();
            var tar = $(this).parent().parent();
            var img = tar.children('img');
            var name = img.attr('name');
            var w = img.width(), h = img.height();
            var x = img.position().left, y = img.position().top;
            tar.children().remove();
            tar.resizable(false);
            var canvas = $('<canvas name="'+name+'" width='+w+' height='+h+'></canvas>');
            tar.append(canvas);
            // Confirm button
            tar.hoverButton('./images/UI/confirm.png', confirmCut);
            // Conserve image obj in data
            canvas.data('img', img.get(0));
            // Coordinates of selection zone
            if(x && y) var roix = -x, roiy = -y, roiw = tar.width(), roih = tar.height();
            else var roix = Math.floor(w/4), roiy = Math.floor(h/4), roiw = Math.floor(w/2), roih = Math.floor(h/2);
            canvas.data('roix', roix);
            canvas.data('roiy', roiy);
            canvas.data('roiw', roiw);
            canvas.data('roih', roih);
            tar.width(w); tar.height(h);
            // Draw content
            redrawAnimeObj(canvas);
            // Add selection zone listeners
            canvas.mousedown(startRecut);
            canvas.mousemove(recutting);
            canvas.mouseup(endRecut).mouseout(endRecut);
        },
        spriteCut: function(e) {
            e.stopPropagation();
            // Image obj target
            var container = $(this).parent().parent();
            var tar = container.children('img');
            // Already initialized
            if(tar.data('frw')) {
                // Resize 
                var row = tar.data('row');
                var col = tar.data('col');
                if(col > row) {
                    container.width(container.width()*col/row);
                }
                else if(row > col) {
                    container.height(container.height()*row/col);
                }
                // Canvas mask for choosing frames
                var mask = $('<canvas class="frame_mask"></canvas>');
                mask.prop({'width':container.width(),'height':container.height()});
                
                container.disableBtns().append(mask);
                tar.css({'left':'0px', 'top':'0px', 'width':'100%', 'height':'100%'});
                container.mousemove(chooseFrame);
                
                container.click(function(e){
                    var frw = tar.data('frw');
                    var frh = tar.data('frh');
                    var rx = $(this).width() / tar.prop('naturalWidth');
                    var ry = $(this).height() / tar.prop('naturalHeight');
                    frw = frw * rx; frh = frh * ry;
                    var frcol = Math.floor(e.offsetX / frw);
                    var frrow = Math.floor(e.offsetY / frh);
                    var img = $(this).children('img');
                    animeTool.showSpriteFr(img, frrow * img.data('col') + frcol);
                    $(this).enableBtns().unbind('mousemove', chooseFrame).unbind('click');
                    $(this).children('canvas').remove();
                });
            }
            // Not until setted
            else {
                dialog.showPopup('Configuration de sprite', 300, 180, 'Confirmer');
                dialog.main.append('<p><label>Rang: </label><input id="sprite_row" type="number" size="10" min="2"></p>');
                dialog.main.append('<p><label>Colonne: </label><input id="sprite_col" type="number" size="10" min="2"></p>');
                
                dialog.confirm.click(function(){
                    var row = parseInt($('#sprite_row').val());
                    var col = parseInt($('#sprite_col').val());
                    var w = tar.prop('naturalWidth');
                    var h = tar.prop('naturalHeight');
                    var invalid = false;
                    // Row invalid
                    if(isNaN(row) || h/row < 8 || row < 1) {
                        $('#sprite_row').addClass('alert_msg');
                        invalid = true;
                    }
                    else $('#sprite_row').removeClass('alert_msg');
                    // Col invalid
                    if(isNaN(col) || w/col < 8 || col < 1) {
                        $('#sprite_col').addClass('alert_msg');
                        invalid = true;
                    }
                    else $('#sprite_col').removeClass('alert_msg');
                    if(invalid) return;
                    
                    // Apply sprite setting to the same obj in all frames
                    var name = tar.prop('name');
                    var tars = $('#editor').find('img[name="'+name+'"]');
                    
                    tars.data('frw', w/col).data('frh', h/row).data('col', col).data('row', row);
                    tars.parent().hoverButton('./images/UI/recut.png', false);
                    tars.each(function(){ animeTool.showSpriteFr($(this), 0); });
                    dialog.close();
                });
            }
        },
        showSpriteFr: function(img, fr) {
            var container = img.parent();
            var frw = img.data('frw');
            var frh = img.data('frh');
            var col = img.data('col');
            var row = img.data('row');
            var offx = frw * (fr%col);
            var offy = frh * Math.floor(fr/col);
            if(col > row)
                container.css({'overflow': 'hidden','width': container.width()/(col/row)});
            else if(col < row)
                container.css({'overflow': 'hidden','height': container.height()/(row/col)});
            else container.css('overflow', 'hidden');
            
            img.css({'position':'relative', 'left':-100*offx/frw+'%', 'top':-100*offy/frh+'%', 'width':100*col+'%', 'height':100*row+'%'}).data('fr', fr);
        }
    });
    
    // Set transition type
    $('.motion').live('click', tool.transSetup);
    tool.addFrameBn.click(tool.addFrame);
    return tool;
}






var initScriptTool = function() {
    var tool = new CreatTool($('#scriptTool'), $('#scripticon'));
    
    $.extend(tool, {
        textArea: $('<textarea class="script_editor">'),
        scriptName: $('#code_name'),
        init: function(args){
            this.editor.append(this.textArea);
        },
        close: function() {
            this.finishEdit(this.editor.children());
            this.editor.unbind().hide().children().detach();
            this.toolsPanel.hide();
            this.menuMask.hide();
        },
        finishEdit: function(elems){
            this.scriptName.val("");
            this.textArea.val("");
        },
        insertVar: function(obj) {
            var id = obj.id;
            var val = this.textArea.val();
            var startPos = this.textArea.get(0).selectionStart;
            var part1 = val.substring(0, startPos);
            var part2 = val.substring(this.textArea.get(0).selectionEnd, val.length-1);
            this.textArea.val(part1 + id + part2);
            this.textArea.get(0).setSelectionRange(startPos, startPos+id.length);
        },
        saveScript: function() {
            var script = this.textArea.val();
            var name = this.scriptName.val();
            if(!name || !nameValidation(name)) {
                alert('Échec à sauvegarder, nom invalid');
                return false;
            }
            if(script == "") {
                this.textArea.animate({backgroundColor: "#fb4e4e"}, 800)
                             .animate({backgroundColor: "#fff"}, 800);
                return;
            }
            if(srcMgr.isExist(name)) {
                if(srcMgr.sourceType(name) == "code") {
                	dialog.showPopup('Ce nom existe déja', 300, 150, 'Confirmer');
                	dialog.main.append('<p><label>Nouveau nom : </label><input id="rename" type="text" value="'+name+'"></p>');
                	dialog.main.append('<p><label>Ecraser : </label><input id="eraseName" type="checkbox"></p>');
                	dialog.confirm.click(function(){
                	    var newname = $('#rename').val();
                        if(newname == name && $('#eraseName').get(0).checked) {
                            CommandMgr.executeCmd(new ModSrcCmd('code', script, newname));
                		    dialog.close();
                	    }
                	    else if(newname != name && !srcMgr.isExist(name)) {
                	        CommandMgr.executeCmd(new AddSrcCmd('code', script, newname));
                	        dialog.close();
                	    }
                	});
            	}
            }
            else
                CommandMgr.executeCmd(new AddSrcCmd('code', script, name));
        },
        editScript: function(id, content) {
            this.active();
            this.textArea.val(content);
            this.scriptName.val(id);
        }
    });
    
    $('#code_save').click(function(){
        tool.saveScript();
    });
    
    var objChooser = new ObjChooser("code_objchr");
    objChooser.jqObj.css({'width':'19px', 'height':'100%'});
    objChooser.callback = new Callback(tool.insertVar, tool);
    $('#scriptTool').children('li:eq(0)').append(objChooser.jqObj);
    return tool;
}




var initTranslateTool = function() {
    var tool = new CreatTool($('#translateTool'), null, true);
    
    var appendAllLines = function(container, obj) {
        obj.children().each(function() {
            var line = $(this);
            if( line.hasClass('textLine') ) {
                var temp = $('<p>'+line.children('p').text()+'</p>');
                temp.attr('objId', line.prop('id'));
                container.append( temp );
            }
            else if( line.hasClass( "speaker" ) ) {
            	appendAllLines( container, line );
            }
        });
    };
    
    var getArticleExpo = function(container, article, metas) {
        var lines = appendAllLines(container, article);
        
        if(!metas) metas = ArticleFormater.parseMetaText(article);
        for(var i in metas) {
            var format = metas[i].format;
            var keyword = metas[i].keyword;
            var offset = metas[i].index;
            var objId = metas[i].objId;
            var link = metas[i].link;
            var obj = container.children('p[objId="'+objId+'"]');
            
            // For links
            if(format == "link") {
                var text = obj.text();
                if(text.indexOf(keyword, offset) == offset) {
                    var start = text.substr( 0, offset );
                    var end = text.substring( offset+keyword.length, text.length-1 );
                    obj.html( start + "<span class='"+link.type+"'>"+keyword+"</span>" + end );
                    obj.data('link', link);
                }
            }
            
            // For insertions
            if(format == "inser") {
                var expo = srcMgr.getExpoClone(link.id);
                expo.deletable(false);
                expo.circleMenu(false);
                expo.css({'position':'absolute', 'top':obj.position().top-20, 'right':'0px'});
                obj.after(expo);
            }
        }
    };
    
    var articles = null, article = null, newarticle = null, metas = null;
    var untranslated = false;
    
    $.extend(tool, {
        left: $('<div id="transTool_left"></div>'),
        right: $('<div id="transTool_right"></div>'),
        center: $('<div id="transTool_center"></div>'),
        textInput: $('<textarea id="transTool_text" class="script_editor"></textarea>'),
        inputBtn: $('<div id="transTool_input">Confirmer</div>'),
        generateBtn: $('#gene_trans'),
        newarticle: null,
        
        init: function(){
            articles = $('.article');
            // No article, no need to translate
            if(articles.length <= 0) {
                this.close();
                return;
            }
        
            this.editor.append(this.left).append(this.center).append(this.right);
            
            if(metas && newarticle)
                getArticleExpo(this.right, newarticle, metas);
            else 
                this.right.append(this.textInput).append(this.inputBtn);
                
            // Set untranslated
            untranslated = true;
            
            // Add an article resume to left panel
            article = $( articles.get(0) );
            metas = ArticleFormater.parseMetaText(article);
            getArticleExpo(this.left, article, metas);
        },
        
        showTranslation: function() {
            var content = this.textInput.val();
            if(content.trim() == "") return;
            
            this.right.children().remove();
            
            newarticle = $('<div class="article" defile="'+article.attr('defile')+'"></div>');
            newarticle.css({'left':article.css('left'), 'top':article.css('top'), 
            			    'width':article.width(), 'height':article.height(),
            			    'line-height' : article.css('line-height'), 
            			    'text-align' : article.css('text-align'),
            			    'font-weight' : article.css('font-weight'),
            			    'font-size' : article.css('font-size'),
            			    'font-family' : article.css('font-family'),
            			    'color' : article.css('color')});
            ArticleFormater.reverse( newarticle, content, article, metas);
            getArticleExpo(this.right, newarticle, metas);
        },
        
        generateTranslation: function() {
            this.close();
        },
        
        close: function() {
            if(articles.length <= 0) {
                untranslated = false;
                CreatTool.prototype.close.call(this);
            }
            else if(newarticle && article) {
                article.replaceWith(newarticle);
                untranslated = false;
                CreatTool.prototype.close.call(this);
            }
        },
        
        untranslated: function() {
            return untranslated;
        }
    });
    
    tool.inputBtn.click(function(){tool.showTranslation();});
    tool.generateBtn.click(function(){tool.generateTranslation();});
    
    return tool;
}





// Popup widgt
var Popup = function() {
	if(!this.inited) {
		this.init();
	}
};
Popup.prototype = {
	constructor: Popup,
	id: 'popup_dialog',
	inited: false,
	dialog: $('<div id="popup_dialog" class="popup"></div>'),
	titre: $('<div class="popup_title"></div>'),
	main: $('<div class="popup_body"></div>'),
	buttons: $('<div class="popup_buttons"></div>'),
	annuler: $('<div class="popup_close"></div>'),
	confirm: $('<input type="button"></input>'),
	back: $('<div class="popup_back"></div>'),
	caller: null,
	
	hide: function() {
	    $('.popup_back').hide();
	    $('#popup_dialog').hide();
	},
	show: function() {
	    $('.popup_back').show();
	    $('#popup_dialog').show();
	},
	close: function() {
        var that = $("#popup_dialog").data('popUpObj');
		that.hide();
		that.caller = null;
	},
	addButton: function(btn) {
	    this.buttons.prepend(btn);
		 return $(btn);
	},
	
	init: function() {
		this.dialog.append(this.titre);
		this.dialog.append(this.main);
		this.dialog.append(this.buttons);
		this.annuler.append('<img src="./images/UI/close.png"></img>');
		this.titre.append(this.annuler);
		this.titre.append('<span>');
		$('body').append(this.back).append(this.dialog);
		this.hide();
        this.dialog.data('popUpObj', this);
		this.annuler.click({obj:this},this.close);
		this.inited = true;
	},
	
	showAlert: function(msg) {
	    var alert = this.main.children('h2.alert');
	    if(alert.length > 0) alert.text(msg);
	    else {
	        alert = $('<h2 class="alert">'+msg+'</h2>');
	        this.main.prepend(alert);
	        this.dialog.css('height', this.dialog.height()+40);
	    }
	    alert.animate({color: "#fff"}, 500)
	         .animate({color: "#fb4e4e"}, 500);
	},
	
	showPopup: function(msg, width, height, msgConfirm, caller) {
        if(typeof msg != 'string' 
            || typeof width != 'number' 
            || typeof height != 'number' 
            || isNaN(parseInt(width)) 
            || isNaN(parseInt(height)))
        {
            return;
        }
		this.main.html("");
		this.buttons.children().remove();
		this.caller = null;
		var x = ($(window).width() - width)/2;
		var y = ($(window).height() - height)/2;
		this.dialog.css({'left':x+'px','top':y+'px','width':width+'px','height':height+'px'});
		
		this.titre.children('span').html(msg);
		if(msgConfirm) {
		    this.addButton(this.confirm);
			this.confirm.val(msgConfirm);
			this.confirm.focus();
			// TODO: Add keyboard 'enter' listener
		}
		if(caller) this.caller = caller;
		
		this.show();
	}
};

var loading = function() {
    return {
        circle: $('<div id="loading"><img src="./images/UI/loading.gif"/></div>'),
        back: $('<div class="popup_back" style="z-index:110;"></div>'),
        show: function(duration){
            $('body').append(this.back);
            $('body').append(this.circle);
            if(duration) setTimeout("loading.hide()", duration);
        },
        hide: function(){
            this.back.remove();
            this.circle.remove();
        }
    };
}();




// Object chooser widgt
var ObjChooser = function(id, multi){
    this.id = id;
    this.jqObj = $('<div id="'+id+'" class="objChooser"><img src="./images/UI/objchooser.jpg"/><h5/></div>');
    this.jqObj.data('chooser', this);
    this.jqObj.click(function(){
        $(this).data('chooser').startChoose();
    });
    this.multi = (multi !== true) ? false : true;
    this.objs = [];
    this.callback = null;
    this.verifyFn = null;
};
ObjChooser.prototype = {
    constructor: ObjChooser,
    appendTo: function(parent){
        var h = parent.innerHeight();
        this.jqObj.height(h);
        this.jqObj.children('img').css({'width':h+'px','height':h+'px'});
        this.jqObj.children('h5').css({'line-height':h+'px', 'font-size':h*0.8+'px'});
        this.jqObj.appendTo(parent);
    },
    val: function(){
        if(!this.multi) return this.objs[0];
        else return this.objs;
    },
    startChoose: function(){
        curr.chooser = this;
        $('body').append('<div id="objChooserMask"></div>');
        $('#center_panel, #right').css('z-index', config.zid.SceneInChoosing);
        this.editorZid = $('#editor').css('z-index');
        this.pageBarZid = $('#pageBar').css('z-index');
        $('#editor').css('z-index', config.zid.EditorInChoosing);
        $('#pageBar').css('z-index', config.zid.PagebarInChoosing);
        
        // Active message center notification
        if(this.multi) {
            var msgobj = $("<p>Cliquer <span style='text-decoration: underline; cursor: pointer;'>ici</span> ou appuyer sur return pour confirmer</p>");
            var span = msgobj.children('span');
            msgCenter.showStaticBox(msgobj);
            
            span.bind('click', {'chooser':this}, function(e) {
                msgCenter.closeStaticBox();
                e.data.chooser.finishChoose();
            });
            // Return key listener
// TODO
        }
    },
    getNotif: function(obj) {
        obj = $(obj);
        if(obj.hasClass('textLine')) {
            return $("<p> - "+obj.children('p').text()+"</p>");
        }
    },
    choosed: function(obj){
        // Verification existance of obj
        if($.inArray(obj, this.objs) != -1) return;
        if(typeof this.verifyFn == "function") 
            if(!this.verifyFn(obj)) return;
        
        // Set referenced id for analyze in the server
        if(!obj.id || obj.id == "") 
            obj.id = "referenced"+(curr.objId++);
            
        this.objs.push(obj);
        
        if(!this.multi) this.finishChoose();
        else {
            // Append notification to message center
            msgCenter.sendToStatic( this.getNotif(obj) );
        }
    },
    finishChoose: function() {
        curr.chooser = null;
        // Single Chooser
        if(!this.multi) {
            if(!this.callback) this.jqObj.children('h5').text(this.objs[0].id);
            else if(this.objs[0]) this.callback.invoke(this.objs[0]);
        }
        // Multi Chooser
        else {
            if(this.callback) {
                this.callback.invoke(this.objs);
            }
            else {
                var str = "";
                if(!this.callback) {
                    for(var i = 0; i < 2 && i < this.objs.length; ++i) {
                        if(i != 0) str += ", ";
                        str += this.objs[i].id;
                    }
                    if(this.objs.length > 2) str += "...";
                }
                this.jqObj.children('h5').text(str);
            }
        }
        this.objs.splice(0, this.objs.length);
        
        $('#center_panel, #right').css('z-index', config.zid.Scene);
        $('#editor').css('z-index', this.editorZid);
        $('#pageBar').css('z-index', this.pageBarZid);
        $('#objChooserMask').remove();
    }
};
function objChoosed(e){
    if(!curr.chooser) return;
    e.preventDefault();
    curr.chooser.choosed(this);
}


// magnetisme
var Magnetisme = function(){
	this.visibleItem = [];
	// in pixel,  if the distance is <tolerance> pixel or less ,  the element is glued with the other
	this.tolerance = 3;
	this.guide = {x:{c:-100 },y:{c:-100  } };
}
Magnetisme.prototype = {
	contructor : Magnetisme,
	updateVisibleElement : function( exept ){
		this.visibleItem = this.getVisibleElement( exept );
	},
	getVisibleElement : function( exept ){
		if( !exept.length ) return [];
		var element = [];
		var steps = curr.page.children();
		for( var i = 0 ; i < steps.length ; i ++ ){
			var step = $( steps[ i ] );
			if( step.css('display') != "none" ){
				var objs = step.children();
				for( var j = 0 ; j < objs.length ; j ++ ){
					var obj = $( objs[ j ] );
					var j;
					for( k = 0 ; k < exept.length ; k ++ )
						if( $(exept[ k ]).attr('id') == obj.attr('id') )
							break;		
					if( k >= exept.length )
						element.push( {
							obj : obj,
							x : obj.position().left,
							y : obj.position().top,
							width  : obj.outerWidth() ,
							height : obj.outerHeight() 
						} );
						
				}
			}
		}
		// do not forget to add the scene frame
		var obj = curr.page;
		element.push( {
						obj : obj,
						x : 0,
						y : 0,
						width  :  obj.width()  ,
						height :  obj.height() 
		} );
		
		return element;
	},
	
	// search for an item close enought to <obj> to glue it up
	// typ* define the position of the anchor which will be glued : 0 for the left, 1 for the right , 0.5 for the middle
	// coor is either "x" or "y" 
	// if typT is omited, the search will occur with both left and right and middle to middle
	gluePartiel : function( obj , typO , coor , typT ){
		var vI = this.visibleItem;
		var adjacent = { x : {  d : this.tolerance } , y : {  d : this.tolerance } };
		var coorL =  coor == 'x'  ? 'width' : 'height' ;
		if( typT )
			for( var i=0 ; i < this.visibleItem.length ; i ++ )
				factor( typT , typO , coor , coorL  );
		else
			for( var i=0 ; i < this.visibleItem.length ; i ++ ){
				for( var typT = 0 ; typT <= 1 ; typT += 1 )
					factor( typT , typO , coor , coorL  );	
				factor( 0.5 , 0.5 , coor , coorL  );
			}
		if( !adjacent.x.obj ) adjacent.x = null;
		if( !adjacent.y.obj ) adjacent.y = null;
		return adjacent;
		
		// factorize this code portion
		function factor( typT , typO , coor , coorL  ){
			var d;
			if( ( d = Math.abs( vI[ i ][ coor ] + vI[ i ][ coorL ] * typT - ( obj[ coor ] + obj[ coorL ] * typO  ) ) ) < adjacent[coor].d )
				adjacent[coor] = {
					d     : d,
					c     : vI[ i ][ coor ] + vI[ i ][ coorL ] * typT,
					obj   : vI[ i ],
					typO  : typO,
					typT  : typT,
					coorC : vI[ i ][ coor ] + vI[ i ][ coorL ] * typT - obj[ coorL ] * typO
				};
		}
	},
	
	// search for an item close enought to <obj> to glue it up
	// search with both left , right , top and bottom border of the moving object, and glue it up with both left , right , top and bottom of the inert object 
	// search also from middle to middle on both object
	glue : function( obj ){
		var adjacent = { };
		for( var typO = 0 ; typO <= 1 ; typO += 1 ){ 
			adjacent = reduction( adjacent , this.gluePartiel( obj , typO , "x" )  ); 
			adjacent = reduction( adjacent , this.gluePartiel( obj , typO , "y" )  ); 
		}
		return adjacent;	
		function reduction( adj1 , adj2 ){
			adj1.x = adj1.x && adj2.x && adj1.x.d <  adj2.x.d  || !adj2.x ? adj1.x : adj2.x;
			adj1.y = adj1.y && adj2.y && adj1.y.d <  adj2.y.d  || !adj2.y ? adj1.y : adj2.y;
			return adj1;
		}
	},
	
	
	
	
	
	// graphism ---------------------------------------------------------
	initGuide : function(){
		this.delGuide();
		this.guide.x.svg = $( '<svg width="'+curr.page.width()+'px" height="'+curr.page.height()+'px" style="z-index:'+(curr.page.children().length+1)+';position:absolute;"><rect x="25px" y="25px" width="100" height="50" class="guide" /><line x1="0" x2="0" y1="0" y2="'+curr.page.height()+'" class="guide" /></svg>' );
		curr.page.append( this.guide.x.svg );	
		this.guide.x.svg.hide();
		
		this.guide.y.svg = $( '<svg width="'+curr.page.width()+'px" height="'+curr.page.height()+'px" style="z-index:'+(curr.page.children().length+1)+';position:absolute;"><rect x="25px" y="25px" width="100" height="50" class="guide" /><line y1="0" y2="0" x1="0" x2="'+curr.page.width()+'" class="guide" /></svg>' );
		curr.page.append( this.guide.y.svg );	
		this.guide.y.svg.hide();
	},
	delGuide : function(){
		if( this.guide.x.svg )
			this.guide.x.svg.remove();
		if( this.guide.y.svg )
			this.guide.y.svg.remove();
		
		this.guide.x.c = -100;
		this.guide.y.c = -100;
		this.guide.x.id = null;
		this.guide.y.id = null;
	},
	showGuide : function(  param , axe ){	
		if( !axe ){
			this.showGuide(  param, "x" );
			this.showGuide(  param, "y" );
			return;
		}
		if( param[axe] ){
			if( this.guide[ axe ].c != param[ axe ].c ){
				var line = this.guide[ axe ].svg.children( "line" );
				line.attr( axe+"1" , param[ axe ].c );
				line.attr( axe+"2" , param[ axe ].c );
				this.guide[ axe ].c = param[ axe ].c;
				this.guide[ axe ].svg.show();
			}
			if( this.guide[ axe ].id != ( this.guide[ axe ].id = param[ axe ].obj.obj.prop( "id" ) ) ){
				var rect = this.guide[ axe ].svg.children( "rect" );
				rect.attr( "x" , param[ axe ].obj.x );
				rect.attr( "y" , param[ axe ].obj.y );
				rect.attr( "width"  , param[ axe ].obj.width  );
				rect.attr( "height" , param[ axe ].obj.height );
			}
		}else{
			if( this.guide[ axe ].c > -100 ){
				this.guide[ axe ].svg.hide();
				this.guide[ axe ].c = -100;
				this.guide[ axe ].id = null;
			}	
		}
	},
	
};
var magnetisme = new Magnetisme();				

// JQuery Plugin

(function($) {

var tag = {
	movestarted: false,
	resizestarted: false,
	drawstarted: false,
	noborder: false,
};
// position of the mouse relative to the element manipulated ( resized or translated )
var anchor = {};
var curr = {};
var editSupportTag = ['SPAN', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'P'];
var originalRatio = 1;
var multiSelect = [];
var rectMutliSelect = {};
var isMajDown=false;
var isCtrlDown=false;
$(document).keyup(function (e) {
	if(e.which == 17) isCtrlDown=false;
	if(e.which == 16) { isMajDown=false; };
}).keydown(function (e) {
	if(e.which == 17) isCtrlDown=true;
	if(e.which == 16) { isMajDown=true; magnetisme.showGuide( {}  );  }
});


// Add top right hover icon
var hoverIcon = function(elem, func, img, data, prepend) {
	var icons = elem.children('.del_container');
	if(icons.length == 0) {
		icons = $('<ul class="del_container"></ul>');
		elem.append(icons);
	}
	//var top = 5 + icons.children('img').length*17;
	var icon = $('<img src="'+img+'"></img>');
	if(prepend === true) icons.prepend(icon);
	else icons.append(icon);
	
	if(typeof data != "object" || data instanceof Array) data = null;
	icon.hide().bind('click', data, func);
	elem.hover(function(){ if( !tag.resizestarted && !tag.movestarted )icon.show();}, function(){icon.hide();});
};
// Icon always show up
var staticIcon = function(elem, func, img, data, prepend) {
	var icons = elem.children('.del_container');
	if(icons.length == 0) {
		icons = $('<ul class="del_container"></ul>');
		elem.append(icons);
	}
	//var top = 2 + icons.children('img').length*17;
	var icon = $('<img src="'+img+'"></img>');
	if(prepend === true) icons.prepend(icon);
	else icons.append(icon);
	
	if(typeof data != "object" || data instanceof Array) data = null;
	icon.bind('click', data, func);
};
	
function delParent(e) {
    e.preventDefault();e.stopPropagation();
    var target = $(this).parent().parent();
    var parent = target.parent();
    if(parent.hasClass('speaker') && target.siblings('.textLine').length == 0) // if is last line in a speaker div
        target = target.parent();
    CommandMgr.executeCmd( new DeleteObjCmd(target) );
}
function hideParent(e) {e.preventDefault();e.stopPropagation();$(this).parent().parent().hide();}
function configParent(e) {e.preventDefault();e.stopPropagation();showParameter($(this).parent().parent(), e.data.list);}
function goDown(e) {
	var siblings = $(this).parent().parent().siblings(); // Other objects in the scene
	var currObj = $(this).parent().parent();
	var zDiff;
	var objInf = false;
	for (var i = 0; i<siblings.length; i++) {
		// If the diff is reduced and the siblings is under the current object
		if ((Math.abs(parseInt($(siblings[i]).css('z-index')) - parseInt(currObj.css('z-index'))) < zDiff || isNaN(zDiff))
				&& parseInt($(siblings[i]).css('z-index')) < parseInt(currObj.css('z-index'))) {
			zDiff = Math.abs(parseInt($(siblings[i]).css('z-index')) - parseInt(currObj.css('z-index')));
			objInf = $(siblings[i]);
		}
	}
	if (objInf) {
		var temp = objInf.css('z-index');
		objInf.css('z-index', currObj.css('z-index'));
		currObj.css('z-index', temp);
        CommandMgr.executeCmd( new GoDownCmd(currObj, objInf));
	}
}

$.fn.disableBtns = function() {
    var del = this.children('.del_container');
    if(del.length > 0) {
        this.data('del', del);
        del.detach();
    }
    return this;
}
$.fn.enableBtns = function(){
    if(this.children('.del_container').length > 0) return;
    if(this.data('del')) this.data('del').appendTo(this);
    return this;
}
$.fn.deletable = function(f, statiq) {
	var del = this.children('.del_container').children().filter('img[src="./images/UI/del.png"]');
	if(del.length > 0) del.remove();
	if(f === false) return this;
	var func = f || delParent;
	if(statiq == true) staticIcon(this, func, './images/UI/del.png', null, true);
	else hoverIcon(this, func, './images/UI/del.png', null, true);
	return this;
};
$.fn.hideable = function(f) {
	var close = this.children('.del_container').children().filter('img[src="./images/UI/sclose.png"]');
	if(close.length > 0) close.remove();
	if(f === false) return this;
	var func = f || hideParent;
	this.unbind('click', func);
	staticIcon(this, func, './images/UI/sclose.png', null, true);
	return this;
};
$.fn.configurable = function(disables, f) {
	var config = this.children('.del_container').children().filter('img[src="./images/UI/config.png"]');
	if(config.length > 0) config.remove();
	if(f === false) return this;
	var func = f || configParent;
	this.unbind('click', func);
	hoverIcon(this, func, './images/UI/config.png', {'list':disables});
	return this;
};
$.fn.hoverButton = function(icon, f, data, prepend) {
    if(f === false) {
    	this.find('img[src="'+icon+'"]').remove();
    	return this;
    }
	if(!$.isFunction(f)) return this;
	hoverIcon(this, f, icon, data, prepend);
	return this;
}
$.fn.staticButton = function(icon, f, data, prepend) {
    if(f === false) {
    	this.find('img[src="'+icon+'"]').remove();
    	return this;
    }
	if(!$.isFunction(f)) return this;
	staticIcon(this, f, icon, data, prepend);
	return this;
}
$.fn.canGoDown = function(f, statiq) {
	var down = this.children('.del_container').children().filter('img[src="./images/UI/down.png"]');
	if(down.length > 0) down.remove();
	if(f === false) return this;
	var func = (typeof f == 'function') ? f : goDown;
	if(statiq == true) staticIcon(this, func, './images/UI/down.png');
	else hoverIcon(this, func, './images/UI/down.png');
	return this;
};

// Move event
var moveCmd = {};
var MouseStart = {};
function startMove(e) {
	e.preventDefault();
	e.stopPropagation();
	tag.movestarted = true;
	moveCmd = new MoveObjCmd( multiSelect );
	
	MouseStart = { x:  e.clientX  , y : e.clientY };
	
	var el = $( multiSelect[ 0 ] );
	rectMutliSelect.pos = {x:el.position().left , y:el.position().top };
	rectMutliSelect.w   = {x:0 , y:0 };
	
	// calculate the boundary rect
	for( var i = 0 ; i < multiSelect.length ; i ++ ){
		var el = $( multiSelect[ i ] );
		if( rectMutliSelect.pos.x > el.position().left )
			rectMutliSelect.pos.x = el.position().left;
		if( rectMutliSelect.pos.y > el.position().top )
			rectMutliSelect.pos.y = el.position().top;
		if( rectMutliSelect.w.x < el.position().left + el.outerWidth() )
			rectMutliSelect.w.x = el.position().left + el.outerWidth();
		if( rectMutliSelect.w.y < el.position().top + el.outerHeight() )
			rectMutliSelect.w.y = el.position().top + el.outerHeight();
	}
	rectMutliSelect.w.x -= rectMutliSelect.pos.x;
	rectMutliSelect.w.y -= rectMutliSelect.pos.y;
	
	// relative to the boundary rect
	rectMutliSelect.bigAnchor = { x : e.clientX - rectMutliSelect.pos.x , y : e.clientY - rectMutliSelect.pos.y };
	magnetisme.updateVisibleElement( multiSelect );
	magnetisme.initGuide();
}
function cancelMove(e) {
    if(tag.movestarted) {
		e.preventDefault();
        e.stopPropagation();
		if( MouseStart.x != e.clientX || MouseStart.y != e.clientY ) // check if there was a move
			CommandMgr.executeCmd(moveCmd);
        tag.movestarted = false;
		magnetisme.delGuide();
		// it should be a trigger of mouseenter on the element that have been moved ( for the right option panel to pop )
    }
}
function moveElem(e) {
	if(!tag.movestarted) return;
	e.preventDefault();
	e.stopPropagation();
	
	var x = e.clientX - rectMutliSelect.bigAnchor.x;
	var y = e.clientY - rectMutliSelect.bigAnchor.y;
	
	// Adjustement
	//var w = elem.width(), h = elem.height();
	//var scene = elem.parents('.scene');
	//if(scene.length == 0) scene = $('#editor');
	//var cw = scene.width(), ch = scene.height();
	//if(x < 0) x = 0; if(y < 0) y = 0;
	//if(x+w > cw) x = cw-w; if(y+h > ch) y = ch-h;
	
	var rect = {x:x , y:y , width:rectMutliSelect.w.x , height:rectMutliSelect.w.y };
	
	if( !isMajDown ){
		var adj = magnetisme.glue( rect );
		if( adj.x  )
			x = adj.x.coorC;
		if( adj.y  )
			y = adj.y.coorC;
		magnetisme.showGuide( adj );
	}
	
	var d = { x :  Math.round( x - rectMutliSelect.pos.x )  , y :   Math.round( y - rectMutliSelect.pos.y )  };
	for( var i = 0 ; i < multiSelect.length ; i ++ ){
		var el = $( multiSelect[ i ] );
		el.css({'top':(el.position().top+d.y)+'px', 'left':(el.position().left+d.x)+'px'});
	}
	rectMutliSelect.pos.x = x;
	rectMutliSelect.pos.y = y;
}

$.fn.moveable = function(supp) {
	this.unbind('mousedown', startMove);
	this.unbind('mouseup', cancelMove);
	this.unbind('mousedown' , choose );
	if(supp !== false)
		this.mousedown( choose ).mousedown(startMove).mouseup(cancelMove);
		
	return this;
}



// Choose event
function choose(e) {
	var elem = $(this);
	if( !isCtrlDown  ){
		for( var i = 0 ; i < multiSelect.length ; i ++ )
			$( multiSelect[ i ] ).removeClass( 'selected' );
		multiSelect = [ elem ];
		elem.addClass( 'selected' );
	} else {
		for( var i = 0 ; i < multiSelect.length ; i ++ )
			if( $( multiSelect[ i ] ).attr("id") == elem.attr("id") ){
				$( multiSelect[ i ] ).removeClass( 'selected' );
				multiSelect.splice( i , 1 );
				break;
			}
		if( i == multiSelect.length ){
			multiSelect.push( elem );
			elem.addClass( 'selected' );
		}
	} 
}
// only for resizable element
function chooseElemWithCtrlPts(e) {
	e.preventDefault();
	var elem = $(this);
	if(curr.choosed && curr.choosed != elem)
		curr.choosed.children('.ctrl_pt').remove();
	
	else if(curr.choosed == elem) return;
	
	// Add Control points
	var pts = [];
	var r = 3, width = elem.width(), height = elem.height();
	for(var i = 0; i < 4; i++) {
		pts[i] = $('<div class="ctrl_pt"></div>');
		pts[i].mousedown(startResize);
		elem.append(pts[i]);
	}
	//var x = (-r)+'px', y = (-r)+'px', dx = (width-r+0.5)+'px', dy = (height-r+0.5)+'px';
	var x = '-1px', y = '-1px', dx = (width-2*r-0.5)+'px', dy = (height-2*r-0.5)+'px';
	curr.lt = pts[0].css({'left':x, 'top':y});
	curr.rt = pts[1].css({'left':x, 'top':dy});
	curr.lb = pts[2].css({'left':dx, 'top':y});
	curr.rb = pts[3].css({'left':dx, 'top':dy});
	curr.choosed = elem;
}

// Resize events
var resizeCmd = {};
function startResize(e) {
	e.preventDefault();
	e.stopPropagation();
	tag.resizestarted = true;
	curr.ctrlPt = $(this);
    resizeCmd = new ResizeObjCmd($(this).parent(), curr);
	// trigger the event, as we have modified the resizestart flag
	curr.ctrlPt.parent().mouseout();
	anchor.x = e.clientX - curr.ctrlPt.parent().offset().left ;
	anchor.y = e.clientY - curr.ctrlPt.parent().offset().top ;
	magnetisme.updateVisibleElement( curr.ctrlPt.parent() );
	magnetisme.initGuide();
	originalRatio = curr.ctrlPt.parent().outerWidth() / curr.ctrlPt.parent().outerHeight();
}
function cancelResize(e) {
	if(tag.resizestarted) {
		e.preventDefault();
		e.stopPropagation();
		tag.resizestarted = false;
		curr.ctrlPt = null;
        CommandMgr.executeCmd(resizeCmd);
		magnetisme.delGuide();
	}
}
function resizeElem(e) {
	if(!tag.resizestarted || !curr.ctrlPt) return;
	e.preventDefault();
	e.stopPropagation();
	var top = curr.ctrlPt.position().top, left = curr.ctrlPt.position().left;
	var elem = curr.ctrlPt.parent();
	var pos = { x : elem.position().left, y : elem.position().top };
	var border = { x : cssCoordToNumber( elem.css( 'border-left-width' ) ) , y : cssCoordToNumber( elem.css( 'border-top-width' ) ) };
	var w = { x: elem.width() + border.x*2, y: elem.height()+ border.x*2 };  // ~ outerWidth
	var limit = { x : 20 , y : 20 };
	var sens = { x : left<0 , y:top<0 };
	
	enlarge();
	if( isCtrlDown )
		keepRatio();
	if( !isMajDown )
		useMagnetism( isMajDown );
	minimalSize();
	
	elem.css({'top':pos.y+'px', 'left':pos.x+'px', 'width': ( w.x - border.x*2 ) + 'px', 'height': ( w.y - border.y*2 ) + 'px'});
	// Control pts update
	var ctrlw = (w.x-6.5)+'px', ctrlh = (w.y-6.5)+'px';
	curr.rt.css('top',ctrlh);
	curr.lb.css('left',ctrlw);
	curr.rb.css({'left':ctrlw, 'top':ctrlh});
	
	// simply enlarge the rectangle, following the mouse cursor
	function enlarge(  ){
		var d = { x: e.clientX - elem.offset().left - anchor.x , y : e.clientY - elem.offset().top - anchor.y };
		factor( "x" );
		factor( "y" );
		function factor( coor ){
			if( sens[ coor ] ){
				pos[ coor ] += d[ coor ];
				w[ coor ]   -= d[ coor ];
			}else{
				w[ coor ] += d[ coor ];
				anchor[ coor ] += d[ coor ];
			}
		}
	}
	
	// adjust so the rectangle keep the ratio "originalRatio", if forcage is not omited, the axe defined by forcage is resized, else its the smaller axe
	function keepRatio( forcage ){
		var ratio = { x: originalRatio , y : 1/originalRatio };
		if( forcage )
			factor( forcage == "y" ? "x" : "y" , forcage );
		else
			if( w.x < w.y * ratio.x )
				factor( "x" , "y" );
			else
				factor( "y" , "x" );
		function factor(  coor , compl ){
			var tmp = Math.round( w[ compl ] * ratio[ coor ] );
			if( sens[ coor ] ){
				pos[ coor ]  -= tmp - w[ coor ];
				w[ coor ]    += tmp - w[ coor ];
			} else {
				anchor[ coor ] += tmp - w[ coor ];
				w[ coor ]      += tmp - w[ coor ];
			}
		}
	}
	
	// glue the element to others
	function useMagnetism( lockRatio ){
		factor( "x"  );
		factor( "y"  );
		function factor( coor  ){
			var adj;
			if( sens[ coor ] ){
				adj = magnetisme.gluePartiel( {x:pos.x , y:pos.y , width:w.x, height:w.y } , 0 , coor );
				if( adj[ coor ] ){
					if( adj[ coor ].typO == 0.5 ){
						// middle case
						var l_fix = Math.abs( ( pos[ coor ] + w[ coor ] ) - adj[ coor ].c ) * 2;
						pos[ coor ] = pos[ coor ] + w[ coor ] - l_fix;
						w[ coor ] = l_fix;
					} else {
						w[ coor ] += pos[ coor ] - adj[ coor ].coorC;
						pos[ coor ] = adj[ coor ].coorC;
					}
					// resize the other axe, in case of the ratio is fixed
					if( lockRatio )
						keepRatio( coor );
				}
			}else{
				adj = magnetisme.gluePartiel( {x:pos.x , y:pos.y , width:w.x, height:w.y } , 1 , coor );
				if( adj[ coor ] ){
					if( adj[ coor ].typO == 0.5 ){
						// middle case
						var l_fix = Math.abs(  pos[ coor ]  - adj[ coor ].c ) * 2;
						anchor[ coor ] -= w[ coor ] - l_fix;
						w[ coor ] = l_fix;
					} else {
						w[ coor ] -= pos[ coor ] - adj[ coor ].coorC;
						anchor[ coor ] -= pos[ coor ] - adj[ coor ].coorC;
					}
					// resize the other axe, in case of the ratio is fixed
					if( lockRatio )
						keepRatio( coor );
				}
			}
			magnetisme.showGuide( adj, coor );
		}
	}
	
	// adjust so the rectangle stay larger than limit
	function minimalSize(){
		factor( "x" );
		factor( "y" );
		function factor(  coor  ){
			if( w[ coor ] < limit[ coor ] ){
				var tmp = limit[ coor ];
				if( sens[ coor ] ){
					pos[ coor ]  -= tmp - w[ coor ];
					w[ coor ]    += tmp - w[ coor ];
				} else {
					w[ coor ]      -= tmp - w[ coor ];
					anchor[ coor ] -= tmp - w[ coor ];
				}
			}
		}
	}
}

$.fn.supportResize = function() {
	this.off('mousemove', resizeElem);
	this.off('mouseup', cancelResize);
	this.on('mousemove', resizeElem);
	this.on('mouseup', cancelResize);
	return this;
}
$.fn.supportMove = function(){
	this.on( "mousemove" , ".scene", moveElem );
	this.mouseup(cancelMove);
}
$.fn.resizable = function(supp) {
	//this.unbind('click', chooseElemWithCtrlPts);
	this.unbind('mousedown' , chooseElemWithCtrlPts );
	this.unbind('click' , objChoosed);
	this.unbind('mousedown' , choose );
	if(supp !== false) {
            this.mousedown(chooseElemWithCtrlPts);
            this.click(objChoosed);
			this.mousedown( choose );
        }
	return this;
}
$.fn.selectable = function(f) {
	if(f === false) {
		this.unbind('click');
		this.unbind('mousedown' , choose );
		return this;
	}
	else if( !typeof f == 'function' )
		return this;
	var func = f;
	this.click(func);
	this.click(objChoosed);
	this.mousedown( choose );
	return this;
}


// Support step managerment
$.fn.addStepManager = function() {
	if(this.hasClass('scene')) // Check if it's a page
		new StepManager(this);
	return this;
}


// Editable for the text tags
$.fn.editable = function(callback, prepa, dblclick) {
	var tagName = $(this).prop('tagName');
	// Don't support
	if( $.inArray(tagName.toUpperCase(), editSupportTag) == -1 ) return this;
	
	if(callback === false) {
	    $(this).removeData('editcb editprepa editdbl')
	           .unbind('dblclick.editable')
	           .unbind('click.editable');
	    return this;
	}
	
	var editfn = function(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    var prepa = $(this).data('editprepa');
	    var callback = $(this).data('editcb');
	    var dblclick = $(this).data('editdbl');
	        
	    // Invoke the prepa function
	    if(prepa instanceof Callback) prepa.invoke($(this));
	    
	    var content = $(this).html();
	    // Get id
	    var id = $(this).prop('id');
	    // Get classes
	    var className = this.className;
	    // Get style
	    var style = $(this).attr('style');
	    
	    // Get infos for textarea
	    var color = $(this).css('color');
	    var fsize = parseInt($(this).css('font-size'));
	    var width = $(this).innerWidth();
	    var height = $(this).innerHeight();
		var editfield = $('<textarea row="'+Math.round(height/fsize)+'" col="'+Math.round(width*1.5/fsize)+'">'+content+'</textarea>');
		editfield.css({'width':width, 'height':height, 'color':color, 'background':'rgba(255,255,255,0.3)', 'top':$(this).css('top'), 'left':$(this).css('left'), 'position':$(this).css('position'), 'font-family':$(this).css('font-family'), 'font-size':$(this).css('font-size'), 'text-align':$(this).css('text-align')});
		$(this).replaceWith(editfield);
		
		var finishedit = function(e) {
		    var prepa = editfield.data('editprepa');
		    var callback = editfield.data('editcb');
		    var dblclick = editfield.data('editdbl');
		
			var newcontent = editfield.val();
			var newtext = $('<'+tagName+'>'+newcontent+'</'+tagName+'>');
			newtext.prop('id', id);
			newtext.attr('style', style);
			newtext.get(0).className = className;
			editfield.replaceWith(newtext);
			if(callback instanceof Callback) {
			    callback.invoke(newcontent, newtext);
			}
			newtext.editable(callback, prepa, dblclick);
			$('body').unbind('click', finishedit);
		}
		
		editfield.data({'editcb':callback, 'editprepa':prepa, 'editdbl':dblclick})
		         .bind('blur', finishedit)
		         .click(function(e){e.stopPropagation();});
		$('body').bind('click', finishedit);
	};
	
	$(this).data({'editcb':callback, 'editprepa':prepa, 'editdbl':dblclick})
	       .unbind('dblclick.editable')
           .unbind('click.editable');
	
	if(dblclick === true) $(this).bind('dblclick.editable', editfn);
	else $(this).bind('click.editable', editfn);
	return this;
}


// Circle menu
$.fn.circleMenu = function(buttonmap) {
    var tar = $(this);
    if(buttonmap === false) {
        tar.css('cursor', 'default');
        tar.removeData('circleMenu');
        tar.unbind('dblclick');
        return this;
    }
    
    tar.css('cursor', 'url("./images/UI/circlemenuptr.cur"), auto');
    tar.data('circleMenu', buttonmap);
    tar.dblclick(function(e){
        $('#circleMenu').remove();
        var x = e.clientX, y = e.clientY;
        var rx = x, ry = (y<115) ? y : y-25, r = 90;
        var alpha = (y<115) ? (Math.PI/180)*90/5 : -(Math.PI/180)*90/5;
        var menu = $("<div id='circleMenu'></div>");
        $('body').append(menu);
        menu.css({left:rx, top:ry});
        var buttonmap = $(this).data('circleMenu');
        var count = 0;
        for(var i in buttonmap) {
            var icon = $("<img src='"+buttonmap[i][0]+"'></img>");
            if(buttonmap[i][1]){
                icon.data("func", buttonmap[i][1]);
                icon.click(function(){
                    $(this).data("func").call(window, tar);
                });
            }
            icon.css({'left':0,'top':0,'opacity':0});
            menu.append(icon);
            // Animation
            var iconx = r*Math.cos(alpha*count), icony = r*Math.sin(alpha*count);
            icon.animate({'left':"+="+iconx+"px",'top':"+="+icony+"px",'opacity':1}, 'normal', 'swing');
            count++;
        }
        
        $('body').click(function(){
            var menu = $('#circleMenu');
            if (menu.css('display') != 'none') menu.fadeOut("normal", function(){menu.remove();});
        });
    });
    return this;
}

})(jQuery);
