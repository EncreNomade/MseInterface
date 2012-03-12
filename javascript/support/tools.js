// Transforme css coordinary to number
function cssCoordToNumber(c){
	return parseFloat(c.substring(0,c.indexOf('px')));
}

// Check if a string represent a color
function isColor(c) {
	return true;
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
        if(obj[key] && obj[key] != "undefined") o[key] = obj[key];
    } 
    return o;
}

var Callback = function(func, caller) {
    if(!func) return null; 
	this.func = func;
	this.caller = caller;
	if(arguments.length > 2) {
		this.args = new Array();
		for(var i = 2; i < arguments.length; i++)
			this.args.push(arguments[i]);
	}
	
	this.link = function(cb) {
		if(!this.linked) this.linked = new Array();
		this.linked.push(cb);
	};
	
	this.invoke = function(paramSup) {
		var arr = null;
		if(this.args) arr = (paramSup ? this.args.concat(paramSup) : this.args);
		else if(!this.args && paramSup) var arr = [paramSup];
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
		$('#rulerX').attr('width', this.swidth+17).attr('height', 15);
		$('#rulerY').attr('width', 15).attr('height',this.sheight+17);
		
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
		this.wikiWidth = this.sceneX(220);
		this.wikiHeight = this.sceneY(300);
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
})()

var TextUtil = function() {
	var canvas = $('<canvas></canvas>');
	canvas.css({'position':'fixed','left':'-100px','right':'-100px','width':'0px','height':'0px'});
	$('body').append(canvas);
	var ctx = canvas.get(0).getContext('2d');
	
	return {
		config : function(font) {
			ctx.font = font;
		},
		measure : function(text) {
			return ctx.measureText(text).width;
		},
		checkNextline : function(text, maxM, width) {
			// Next line is the whole text remaining
			if(maxM >= text.length) return text.length;
			// Forward check
			var prevId;
			var nextId = maxM;
			do {
				prevId = nextId;
				// Find next space
				var index = text.indexOf(' ', prevId);
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
			else // Find last space
				var lastsp = text.lastIndexOf(' ', maxM);
				if(lastsp == -1) return maxM;
				else return (lastsp+1);
		}
	};
}();




// Drop zone
var DropZone = function(dropHandler, style, id){
    this.dropHandler = dropHandler;
    this.jqObj = $('<div class="drop_zone"/>');
    if(style) this.jqObj.css(style);
    if(id) this.jqObj.attr('id', id);
    this.jqObj.data('typeChecker', this.typeChecker);
    // Interaction with drop zone
    this.jqObj.get(0).addEventListener('dragover', this.dragOverElemZone, false);
    this.jqObj.get(0).addEventListener('dragleave', this.dragLeaveElemZone, false);
    this.jqObj.get(0).addEventListener('drop', this.dropHandler, false);
    this.jqObj.mouseup(this.dragLeaveElemZone);
};
DropZone.prototype = {
    constructor: DropZone,
    dragOverElemZone: function(e) {
    	e.preventDefault();
    	e.dataTransfer.dropEffect = 'copy';
    	$(this).css('border-style', 'solid');
    	return false;
    },
    dragLeaveElemZone: function(e) {
    	$(this).css('border-style', 'dotted');
    },
    appendTo: function(parent){this.jqObj.appendTo(parent);}
};



// Sources manager
// Drag the images from ressources
function dragFromSrcs(e) {
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
	acceptType: new Array('image', 'audio', 'game', 'anime', 'wiki'),
	extCheck: /data:\s*(\w+)\/(\w+);/,
	pathCheck: /^(\.\/)?(\w+\/)*(\w+)\.(\w+)/,
	
	sourceType: function(id) {
	    if(this.sources[id]) {
    		return this.sources[id].type;
		}
		else return "none";
	},
	dataExtension: function(id) {
	    if(!this.sources[id] || typeof this.sources[id].data != "string") return null;
	    var res = this.sources[id].data.match(this.extCheck);
	    if(res != null && (res[1] == "image" || res[1] == "audio" || res[1] == "game")) 
	        return res[2];
	    else return null;
	},
	isExist: function(id) {
	    return ($.inArray(id, Object.keys(this.sources)) != -1);
	},
	addSource: function(type, data, id) {
		if($.inArray(type, this.acceptType) == -1) return;
		if(!id) {
		    id = 'src'+this.currId;
		    this.currId++;
		}
		else if(this.sources[id] != null && type != "wiki" && type != "anime") {
		    alert("Le nom de source exist déjà...");
		    return;
		}
		// Source structure
		var src = {'type':type, 'data':null};
		// Generate expo
		var expo = $('<div class="icon_src" draggable="true"></div>');
		expo.get(0).addEventListener('dragstart', dragFromSrcs, false);
		/*expo.deletable(function(e) {
			e.preventDefault();e.stopPropagation();
			var container = $(this).parents('.icon_src');
			srcMgr.delSource(container.data('srcId'));
			container.remove();
		});*/
		
		switch(type) {
		case 'image':
			// Add image source
			src.data = data;
			this.sources[id] = src;
			var img = $('<img name="'+ id +'"></img>');
			img.attr({src: data});
			expo.append(img);
			expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
			                 'delete':['./images/UI/del.png',this.deleteSrc]});
			break;
		case 'audio':
		    // Add audio source
		    src.data = data;
		    this.sources[id] = src;
		    expo.css('background', 'url("./images/UI/audio.png") center center no-repeat');
		    expo.circleMenu({'rename':['./images/UI/rename.jpg',this.renameDialog],
		                     'delete':['./images/UI/del.png',this.deleteSrc]});
		    break;
		case 'game':
		    // Add game source
		    if(!srcMgr.pathCheck.test(data)) {
		        var encoded = base64_encode(data);
		        src.data = "data:game/js;base64,"+encoded;
		    }
		    else src.data = data;
		    this.sources[id] = src;
		    expo.css('background', 'url("./images/UI/HTML5game.png") center center no-repeat');
		    expo.circleMenu({'delete':['./images/UI/del.png',this.deleteSrc]});
		    break;
		/*case 'text': 
			var height = data.children('p').length * data.css('line-height') + 50;
		case 'obj':
			var height = data.height();
			// Add source
			this.sources[id] = data.clone();
			this.sources[id].removeClass('rect');
			this.sources[id].children('.del_container, .ctrl_pt').remove();
			this.sources[id].resizable(false).moveable(false).deletable();
			this.sources[id].css({'position':'relative','left':'auto','top':'auto','width':'100%', 'height':height+'px', 'padding-top':'25px', 'padding-bottom':'25px', 'margin-left':'auto', 'margin-right':'auto'});
			if(type != 'obj')
				this.sources[id].children('.del_container').css({
					'position': 'relative',
					'top': 2-height+'px'});
			// Expo
			var content = data.clone();
			// Remove all interaction
			content.children('.del_container, .ctrl_pt').remove();
			content.resizable(false).moveable(false);
			// Resize
			if(type!='text') {
				var ratiox = 0.9*40 / content.width();
				var ratioy = 0.9*40 / content.height();
				var ratio = (ratiox < ratioy ? ratiox : ratioy);
				var w = ratio * content.width(), h = ratio * content.height();
			}
			else var w = 36, h = 36;
			content.css({'top':(38-h)/2+'px','left':(38-w)/2+'px','width':w+'px','height':h+'px', 'font-size':'8px'});
			expo.append(content);
			break;*/
		case 'wiki':
		    // Already exist
		    if(this.sources[id]) {
		        src.data = data;
		        this.sources[id] = src;
		        return;
		    }
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<p>WIKI: '+id+'</p>');
		    expo.children().css('font','bold 8px Times');
		    expo.click(function(){
		        srcMgr.editWiki($(this).data('srcId'));
		    });
		    expo.circleMenu({'delete':['./images/UI/del.png',this.deleteSrc]});
		    break;
		case 'anime':
		    if(this.sources[id]) {
		        src.data = data;
		        this.sources[id] = src;
		        return;
		    }
		    src.data = data;
		    this.sources[id] = src;
		    expo.append('<p>Anime: '+id+'</p>');
		    expo.circleMenu({'addscript':['./images/UI/addscript.jpg',addScriptDialog]});
		    expo.click(function(){
		        srcMgr.getSource($(this).data('srcId')).showAnimeOnEditor();
		    });
		    expo.children().css('font','bold 8px Times');
		    expo.circleMenu({'delete':['./images/UI/del.png',this.deleteSrc]});
		    break;
		}
		
		$('#Ressources').prepend(expo);
		// Set expo
		expo.data('srcId', id);
		this.expos[id] = expo;
		this.uploaded = 0;
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
	    if(!this.sources[id]) return;
		var type = this.sources[id].type;
		switch(type) {
		case 'image':
			var img = $('<img name="'+id+'">');
			img.attr({'src':this.sources[id].data});
			img.removeAttr('draggable');

			var container = $('<div class="illu">');
			container.append(img);
			container.deletable(null, true);

			// Resize
			var w = img.attr('width'), h = img.attr('height'), cw = parent.width()*0.9, ch = parent.height();
			var ratio = cw/w;
			if(ratio < 1) {w = w*ratio; h = h*ratio;};
			container.css({'width':parent.width()+'px', 'height':h+40+'px'});
			img.css({'position':'absolute', 'left':parent.width()*0.05+'px', 'top':config.sceneY(20)+'px', 'width':w+'px', 'height':h+'px'});

			// Choose Resize Move
			//container.configurable({text:true,stroke:true});

			return container;
		/*case 'text': case 'obj':
			var res = this.sources[id].clone(true);
			res.children('.del_container, .ctrl_pt').remove();
			res.deletable();
			if(type != 'obj')
				res.children('.del_container').css({
					'position': 'relative',
					'top': 2-res.height()+'px'});
			return res;*/
		case 'game':
			var game = $('<div class="game" name="'+id+'">');
			game.deletable();

			// Resize
			var w = parent.width()*0.8, h = w*0.6/0.8;
			game.css({'width':w+'px', 'height':h+'px'});
		    game.append('<h3>Game: '+id+'</h3>');
		    return game;
		default: 
		}
	},
	getExpo: function(id) {
		var expo = this.expos[id].clone(true);
		expo.deletable();
		return expo;
	},
	delSource: function(id) {
	    if(this.sources[id])
    		delete this.sources[id];
		delete this.expos[id];
		this.uploaded = 0;
	},
	deleteSrc: function(src) {
	    if(!src) return;
	    var id = src.data('srcId');
	    srcMgr.delSource(id);
	    src.remove();
	},
    rename: function(id, newName) {
        if(!this.sources[id] || this.sources[newName]) {
            alert("Echec à changer de nom pour la source");
            return;
        }
        this.expos[newName] = this.expos[id];
        this.sources[newName] = this.sources[id];
        this.expos[newName].data('srcId', newName);
        this.delSource(id);
    },
	renameDialog: function(src) {
	    var id = src.data('srcId');
	    dialog.showPopup('Renomer source', 300, 150, 'Confirmer');
	    dialog.main.html('<p><label>Nouveau nom: </label><input id="rename" type="text"></p>');
	    dialog.confirm.click(function() {
	    	srcMgr.rename(id, $('#rename').val());
	    	dialog.close();
	    });
	},
	editWiki: function(id) {
	    if(!this.sources[id] || !(this.sources[id].data instanceof Wiki)) return;
	    this.sources[id].data.showWikiOnEditor();
	},
	uploadSrc: function(url, pjName) {
	    this.uploaded = 0;
	    for(var key in this.sources) {
	        var data = null;
	        var type = this.sources[key].type;
	        // Check if data is original content or the relative path
	        var ext = this.dataExtension(key);
	        // relative path
	        if((type == "image" || type == "game" || type == "audio") && (!ext || ext == "")) {
	            ++this.uploaded;
	            this.updateSrcs(pjName);
	            continue;
	        }
	        // Original content, upload it
	        switch(type) {
	        case "image": case "audio": case "game":
	            data = "pj="+pjName+"&type="+type+"&name="+key+"&data="+this.sources[key].data;
	            break;
	        case "wiki": case "animes":
	            ++this.uploaded;
	            this.updateSrcs(pjName);
	            continue;
	        }
	        
	        if(data)
    	        $.ajax({
	                type: "POST",
	                'url': url,
	                processData: false,
	                'data': data,
	                success: function(msg){
	                    if(msg == "SUCCESS"){
	                        ++srcMgr.uploaded;
	                        srcMgr.updateSrcs(pjName);
	                    }
	                    else if(srcMgr.pathCheck.test(msg)) {
	                        srcMgr.sources[key].data = msg;
	                        ++srcMgr.uploaded;
	                        srcMgr.updateSrcs(pjName);
	                    }
	                    else alert("Source upload errors: "+msg);
	                }
	            });
	    }
	},
	updateSrcs: function(pjName){
	    var count = Object.keys(this.sources).length;
	    if(this.uploaded < count) return;
	    $.post("update_srcs.php", {"pj":pjName,"srcs":JSON.stringify(this.sources)}, function(msg){
	            if(msg && msg != "") alert(msg);
	        });
	}
};



// Step manager
var StepManager = function(page) {
	// Init
	this.page = page;
	this.manager = $('<div class="expos"></div>');
	this.steps = {};
	this.stepexpos = {};
	this.currStepN = 1;
	
	managers[page.attr('id')] = this;
	// Append to right panel
	$('#right_panel').append(this.manager);
};
StepManager.prototype = {
	constructor: StepManager,
	deleteFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		curr.page.data('StepManager').removeStep($(this).parents('.layer_expo').data('stepN'));
	},
	upFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		curr.page.data('StepManager').stepUp($(this).parents('.layer_expo').data('stepN'));
	},
	downFunc: function(e) {
		e.preventDefault();e.stopPropagation();
		curr.page.data('StepManager').stepDown($(this).parents('.layer_expo').data('stepN'));
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
	renameStep: function(stepN, name) {
	    this.stepexpos[stepN].data('name', name);
	    this.steps[stepN].attr('id', name);
	},
	
	addStepWithContent: function(name, step) {
	    this.page.append(step);
	    var stepN = parseInt(step.css('z-index'));
	    this.steps[stepN] = step;
	    if(stepN >= this.currStepN) this.currStepN = stepN+1;
	    
	    // Add a Step expo
	    var expo = $('<div class="layer_expo"><h1>Étape '+stepN+'</h1><h5>Name: <span>'+name+'</span></h5></div>');
	    expo.find('span').editable(new Callback(this.renameStep, this, stepN));
	    expo.data('name', name);
	    expo.data('stepN', stepN);
	    // Step chooser function
	    expo.click(function(e) {
	    	e.preventDefault();e.stopPropagation();
	    	curr.page.data('StepManager').activeStep($(this).data('stepN'));
	    });
	    // Del step button and Up down button
	    expo.deletable(this.deleteFunc).hoverButton('./images/UI/up.png', this.upFunc).hoverButton('./images/UI/down.png', this.downFunc).circleMenu({'addscript':['./images/UI/addscript.jpg',addScriptDialog]});
	    // Append expo to manager
	    this.manager.prepend(expo);
	    this.stepexpos[stepN] = expo;
	    // DnD listenerts to step expo
	    expo.get(0).addEventListener('dragover', dragOverExpo, false);
	    expo.get(0).addEventListener('dragleave', dragLeaveExpo, false);
	    expo.get(0).addEventListener('drop', dropToExpo, false);
	    
	    this.activeStep(stepN);
	    
	    return step;
	},
	addStep: function(name, params, active) {
		// Create step
		var step = $('<div id="'+name+'" class="layer"></div>');
		step.css({'z-index':this.currStepN});
		if(!params || !params.type) step.attr('type','Layer');
		else step.attr('type',params.type);
		step.attr('defile', (params&&params.defile)?true:false);
		this.page.append(step);
		// Indexing the Step
		this.steps[this.currStepN] = step;
		
		// Add a Step expo
		var expo = $('<div class="layer_expo"><h1>Étape '+this.currStepN+'</h1><h5>Name: <span>'+name+'</span></h5></div>');
		expo.find('span').editable(new Callback(this.renameStep, this, this.currStepN));
		expo.data('name', name);
		expo.data('stepN', this.currStepN);
		// Step chooser function
		expo.click(function(e) {
			e.preventDefault();e.stopPropagation();
			curr.page.data('StepManager').activeStep($(this).data('stepN'));
		});
		// Del step button and Up down button
		expo.deletable(this.deleteFunc).hoverButton('./images/UI/up.png', this.upFunc).hoverButton('./images/UI/down.png', this.downFunc).circleMenu();
		// Append expo to manager
		this.manager.prepend(expo);
		this.stepexpos[this.currStepN] = expo;
		// DnD listenerts to step expo
		expo.get(0).addEventListener('dragover', dragOverExpo, false);
		expo.get(0).addEventListener('dragleave', dragLeaveExpo, false);
		expo.get(0).addEventListener('drop', dropToExpo, false);
		
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
		var temp = this.stepexpos[stepN];
		// Remove all hover buttons and clone the expo
		this.stepexpos[stepN] = this.stepexpos[stepN].clone(true);
		this.stepexpos[stepN].children('.del_container').remove();
		// Add hover buttons to expo's clone: Del step button and Up down button
		this.stepexpos[stepN].deletable(this.deleteFunc).hoverButton('./images/UI/up.png', this.upFunc).hoverButton('./images/UI/down.png', this.downFunc);
		// Insert
		this.stepexpos[stepN].insertBefore(this.stepexpos[stepN+1]);
		// Change stepN in data
		this.stepexpos[stepN].data('stepN', stepN+1);
		this.stepexpos[stepN+1].data('stepN', stepN);
		temp.remove();
		// Switch in two arrays
		temp = this.steps[stepN];
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
		var temp = this.stepexpos[stepN];
		// Remove all hover buttons and clone the expo
		this.stepexpos[stepN] = this.stepexpos[stepN].clone(true);
		this.stepexpos[stepN].children('.del_container').remove();
		// Add hover buttons to expo's clone: Del step button and Up down button
		this.stepexpos[stepN].deletable(this.deleteFunc).hoverButton('./images/UI/up.png', this.upFunc).hoverButton('./images/UI/down.png', this.downFunc);
		// Insert
		this.stepexpos[stepN].insertAfter(this.stepexpos[stepN-1]);
		// Change stepN in data
		this.stepexpos[stepN].data('stepN', stepN-1);
		this.stepexpos[stepN-1].data('stepN', stepN);
		temp.remove();
		// Switch in two arrays
		temp = this.steps[stepN];
		this.steps[stepN] = this.steps[stepN-1];
		this.steps[stepN-1] = temp;
		temp = this.stepexpos[stepN];
		this.stepexpos[stepN] = this.stepexpos[stepN-1];
		this.stepexpos[stepN-1] = temp;
		// Reactive current activate step
		this.activeStep(this.manager.children('.expo_active').data('stepN'));
	},
	
	removeStep: function(stepN) {
		if(this.currStepN <= 2) return; // Only one step left
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
			this.steps[i].css({'z-index':i});
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
    cardsDom.find('img').attr('src', '');
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
                if(title.next().attr('tagName') == 'IMG') {
                    section.type = 'link';
                    section.content = title.next().attr('value');
                }
                // Text section
                else {
                    section.type = 'text';
                    section.content = (title.next().attr('tagName')=='H4') ? title.next().text() : "";
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
        showWikiEditor();
        $('#wiki_name').val(this.name);
        if(this.font) $('#wiki_font').val(this.font);
        if(this.fsize) $('#wiki_size').val(this.fsize);
        if(this.fcolor) $('#wiki_color').val(this.fcolor);
        for(var i in this.cards){
            var card = this.cards[i];
            if(card.type == "img"){
                var jqCard = addWikiCard("image");
                // Change image
                var img = $('<img name="'+card.image+'" src="'+srcMgr.getSource(card.image)+'" style="top:20px;">');
                img.get(0).addEventListener('dragover', DropZone.prototype.dragOverElemZone, false);
                img.get(0).addEventListener('dragleave', DropZone.prototype.dragLeaveElemZone, false);
                img.get(0).addEventListener('drop', dropImgToWikiCard, false);
                img.mouseup(DropZone.prototype.dragLeaveElemZone);
                jqCard.children(".drop_zone").replaceWith(img);
                // Change legend
                var newlegend = $('<h5>'+card.legend+'</h5>');
                newlegend.css({'top':(config.wikiHeight-45)+'px'});
                jqCard.children("input").replaceWith(newlegend);
                newlegend.editable();
            }
            else if(this.cards[i].type == "text"){
                var jqCard = addWikiCard("description");
                for(var j in card.sections){
                    addSectionWiki(jqCard.children("input"), card.sections[j].title, card.sections[j].type, card.sections[j].content);
                }
            }
        }
    }
};



// Animation system
var Animation = function(name, repeat, statiq) {
    //this.anime = {};
    this.name = name;
    this.repeat = repeat;
    this.statiq = statiq;
    this.frames = [];
    this.objs = {};
};
Animation.prototype = {
    constructor: Animation,
    createAnimation: function(frames) {
        for(var i = 0; i < frames.length; i++){
            var frame = {};
            var framexpo = $(frames.get(i));
            frame.interval = parseFloat(framexpo.find('span').text());
            // Valid interval
            if(isNaN(frame.interval) || frame.interval > 20 || frame.interval <= 0) 
                frame.interval = 0.5;
            frame.objs = {};
            var objs = {};
            var content = framexpo.data('frame').children();
            content.each(function(){
                var params = {};
                var container = $(this);
                var img = container.children('img');
                var name = img.attr('name');
                // Add to objects array
                if(!objs[name]) {
                    objs[name] = {};
                    objs[name].type = "image";
                }
                // Validity
                if(container.children('canvas').length != 0 || !name || name == "") return;
                // Recut
                params.w = img.attr('naturalWidth'); params.h = img.attr('naturalHeight');
                var ratiox = params.w/img.width(), ratioy = params.h/img.height();
                params.sx = -img.position().left * ratiox; params.sy = -img.position().top * ratioy;
                params.dw = container.width(); params.dh = container.height();
                params.sw = params.dw * ratiox; params.sh = params.dh * ratioy;
                if(params.sx != 0 || params.sy != 0 || params.sw != params.w || params.sh != params.h)
                    objs[name].type = "spriteRecut";
                // parameters
                params.dx = container.position().left; params.dy = container.position().top;
                params.opacity = parseFloat(container.css('opacity'));
                
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
            this.objs = objs;
        }
    },
    showAnimeOnEditor: function(){
        var editor = $('#editor');
        editor.html("");
        var timeline = $('#timeline');
        $('#animeRepeat').val(this.repeat);
        $('#animeName').val(this.name);
        for(var i = 0; i < this.frames.length; i++){
            var frame = this.frames[i];
            var frameexpo = addFrame(frame.interval, true);
            var framelayer = frameexpo.data('frame');
            // Transition
            var trans = frameexpo.children('div.motion');
            if(!isNaN(frame.trans.pos)) trans.data('pos', frame.trans.pos);
            if(!isNaN(frame.trans.size)) trans.data('size', frame.trans.size);
            if(!isNaN(frame.trans.opac)) trans.data('opac', frame.trans.opac);
            if(!isNaN(frame.trans.font)) trans.data('font', frame.trans.font);
            // Objects
            for(var key in frame.objs){
                var container = $('<div>');
                var param = frame.objs[key];
                var type = this.objs[key].type;
                if(type == "spriteRecut" || type == "sprite" || type == "image") {
                    var img = $('<img name="'+ key +'" src="'+srcMgr.getSource(key)+'">');
                    switch(type) {
                    case "sprite":
                    case "spriteRecut":
                        img.css({'position':'relative', 'left':-100*param.sx/param.w+'%', 'top':-100*param.sy/param.h+'%', 'width':100*param.w/param.sw+'%', 'height':100*param.h/param.sh+'%'});break;
                    case "image":
                        img.css({'position':'relative', 'left':'0%', 'top':'0%', 'width':'100%', 'height':'100%'});break;
                    }
                    container.css({'position':'absolute', 'top':param.dy+'px', 'left':param.dx+'px', 'width':param.dw+'px', 'height':param.dh+'px', 'border-style':'solid', 'border-color':'#4d4d4d', 'border-width':'0px', 'overflow':'hidden', 'opacity':param.opacity});
                    container.html(img);
                    container.deletable().resizable().moveable().configurable({text:true,stroke:true});
                    container.hoverButton('./images/UI/recut.png', recutAnimeObj);
                }
                else if(type == "text"){
                }
                framelayer.append(container);
            }
        }
        showAnimeEditor();
    }
};




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
    constructor: Script
};

var scriptMgr = function() {
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
            changeCursor: "image",
            playVoice: "audio",
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
            playVoice: "Lecture d'un son", addScript: "Ajout d'un script", script: "Ajout d'une suite de codes",
            effet: "Démarrer un effet", playDefi: "Démarrer la lecture", pauseDefi: "Pauser la lecture",
            loadGame: "Démarrer un jeu"
        },
        scripts: {},
        reactionTarget: function(type) {return this.reaction[type];},
        actionSelectList: function(id, type){
            var actfortype = this.action[type];
            if(!actfortype) return "";
            var select = '<select id="'+id+'">';
            for(var i in actfortype)
                select += "<option value='"+actfortype[i]+"'>"+this.optionText[actfortype[i]]+"</option>";
            select += '</select>';
            return select;
        },
        reactionList: function(id){
            var select = '<select id="'+id+'">';
            for(var i in this.reaction) select += "<option value='"+i+"'>"+this.optionText[i]+"</option>";
            select += '</select>';
            return select;
        },
        scriptSelectList: function(id){
            var select = '<select id="'+id+'">';
            for(var i in this.scripts) select += "<option value='"+i+"'>"+i+"</option>";
            select += '</select>';
            return select;
        },
        addScript: function(name, src, srcType, action, target, reaction, immediate, supp){
            this.scripts[name] = new Script(src, srcType, action, target, reaction, immediate, supp);
        },
        saveLocal: function(){
            return this.scripts;
        },
        upload: function(url, pjName){
            var data = "pj="+pjName+"&type=scripts&data="+JSON.stringify(this.scripts);
            
            $.ajax({
                type: "POST",
                'url': url,
                processData: false,
                'data': data,
                success: function(msg){
                    if(msg && msg != "") alert("script upload errors: "+msg);
                }
            });
        }
    };
}();




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
	confirm: $('<input type="button" style="position:absolute;top:-50px;left:-120px"></input>'),
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
		$('.popup_back').hide();
		$('#popup_dialog').hide();
		this.caller = null;
	},
	
	init: function() {
		this.dialog.append(this.titre);
		this.dialog.append(this.main);
		this.dialog.append(this.buttons);
		this.annuler.append('<img src="./images/UI/close.png"></img>');
		this.titre.append(this.annuler);
		this.titre.append('<span>');
		this.buttons.append(this.confirm);
		$('body').append(this.back).append(this.dialog);
		this.back.hide();
		this.dialog.hide();
		this.annuler.click(this.close);
		this.inited = true;
	},
	
	showPopup: function(msg, width, height, msgConfirm, caller) {
		if(!msg || !width || !height) return;
		this.main.html("");
		this.confirm.unbind('click');
		this.caller = null;
		var x = ($(window).width() - width)/2;
		var y = ($(window).height() - height)/2;
		this.dialog.css({'left':x+'px','top':y+'px','width':width+'px','height':height+'px'});
		
		this.titre.children('span').html(msg);
		if(msgConfirm) {
			this.confirm.attr('value', msgConfirm);
			this.confirm.show();
		}
		else this.confirm.hide();
		if(caller) this.caller = caller;
		
		this.back.show();
		this.dialog.show();
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
var ObjChooser = function(id){
    this.id = id;
    this.jqObj = $('<div id="'+id+'" class="objChooser"><img src="./images/UI/objchooser.jpg"/><h5/></div>');
    this.jqObj.data('chooser', this);
    this.jqObj.click(function(){
        $(this).data('chooser').startChoose();
    });
};
ObjChooser.prototype = {
    constructor: ObjChooser,
    refObjId: 0,
    appendTo: function(parent){
        var h = parent.innerHeight();
        this.jqObj.height(h);
        this.jqObj.children('img').css({'width':h+'px','height':h+'px'});
        this.jqObj.children('h5').css({'line-height':h+'px', 'font-size':h*0.8+'px'});
        this.jqObj.appendTo(parent);
    },
    val: function(){
        return this.jqObj.children('h5').text();
    },
    startChoose: function(){
        curr.chooser = this;
        $('body').append('<div id="objChooserMask"></div>');
        $('#center_panel, #right').css('z-index', 106);
    },
    choosed: function(obj){
        // Set referenced id for analyze in the server
        if(!obj.attr('id') || obj.attr('id') == "") 
            obj.attr('id', "referenced"+(ObjChooser.prototype.refObjId++));
        this.jqObj.children('h5').text(obj.attr('id'));
        $('#center_panel, #right').css('z-index', 1);
        $('#objChooserMask').remove();
    }
};
function objChoosed(e){
    if(!curr.chooser) return;
    e.preventDefault();
    curr.chooser.choosed($(this));
    curr.chooser = null;
}



// JQuery Plugin

(function($) {

var tag = {
	movestarted: false,
	resizestarted: false,
	drawstarted: false,
	noborder: false
};
var prevState = {};
var curr = {};
var editSupportTag = ['SPAN', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];


// Add top right hover icon
var hoverIcon = function(elem, func, img, data) {
	var icons = elem.children('.del_container');
	if(icons.length == 0) {
		icons = $('<div class="del_container"></div>');
		elem.append(icons);
	}
	var top = 5 + icons.children('img').length*17;
	var icon = $('<img src="'+img+'", style="top:'+top+'px;"></img>');
	icons.append(icon);
	icon.hide().bind('click', data, func);
	elem.hover(function(){icon.show();}, function(){icon.hide()});
};
// Icon always show up
var staticIcon = function(elem, func, img, data) {
	var icons = elem.children('.del_container');
	if(icons.length == 0) {
		icons = $('<div class="del_container"></div>');
		elem.append(icons);
	}
	var top = 2 + icons.children('img').length*17;
	var icon = $('<img src="'+img+'", style="top:'+top+'px;"></img>');
	icons.append(icon);
	icon.bind('click', data, func);
};
	
function delParent(e) {e.preventDefault();e.stopPropagation();$(this).parent().parent().remove();}
function hideParent(e) {e.preventDefault();e.stopPropagation();$(this).parent().parent().hide();}
function configParent(e) {e.preventDefault();e.stopPropagation();showParameter($(this).parent().parent(), e.data.list);}

$.fn.deletable = function(f, static) {
	var del = this.find('img[src="./images/UI/del.png"]');
	if(del.length > 0) del.remove();
	if(f === false) return this;
	var func = f || delParent;
	if(static == true) staticIcon(this, func, './images/UI/del.png');
	else hoverIcon(this, func, './images/UI/del.png');
	return this;
};
$.fn.hideable = function(f) {
	var close = this.find('img[src="./images/UI/sclose.png"]');
	if(close.length > 0) close.remove();
	if(f === false) return this;
	var func = f || hideParent;
	this.unbind('click', func);
	staticIcon(this, func, './images/UI/sclose.png');
	return this;
};
$.fn.configurable = function(disables, f) {
	var config = this.find('img[src="./images/UI/config.png"]');
	if(config.length > 0) config.remove();
	if(f === false) return this;
	var func = f || configParent;
	this.unbind('click', func);
	hoverIcon(this, func, './images/UI/config.png', {'list':disables});
	return this;
};
$.fn.hoverButton = function(icon, f) {
	if(!$.isFunction(f)) return this;
	if(f === false) {
		this.find('img[src="'+icon+'"]').remove();
		return this;
	}
	hoverIcon(this, f, icon);
	return this;
}
$.fn.staticButton = function(icon, f) {
	if(!$.isFunction(f)) return this;
	if(f === false) {
		this.find('img[src="'+icon+'"]').remove();
		return this;
	}
	staticIcon(this, f, icon);
	return this;
}


// Move events
function startMove(e) {
	e.preventDefault();
	e.stopPropagation();
	tag.movestarted = true;
	prevState.x = e.clientX;
	prevState.y = e.clientY;
}
function cancelMove(e) {
	if(tag.movestarted) {
		e.preventDefault();
		e.stopPropagation();
		tag.movestarted = false;
	}
}
function moveElem(e) {
	if(!tag.movestarted) return;
	e.preventDefault();
	e.stopPropagation();
	var elem = $(this);
	var dx = e.clientX - prevState.x;
	var dy = e.clientY - prevState.y;
	var x = elem.position().left + dx, y = elem.position().top + dy;
	// Adjustement
	//var w = elem.width(), h = elem.height();
	//var scene = elem.parents('.scene');
	//if(scene.length == 0) scene = $('#editor');
	//var cw = scene.width(), ch = scene.height();
	//if(x < 0) x = 0; if(y < 0) y = 0;
	//if(x+w > cw) x = cw-w; if(y+h > ch) y = ch-h;
	
	elem.css({'top':y+'px', 'left':x+'px'});
	prevState.x = e.clientX;
	prevState.y = e.clientY;
}

$.fn.moveable = function(supp) {
	this.unbind('mousedown', startMove);
	this.unbind('mouseup', cancelMove);
	this.unbind('mouseout', cancelMove);
	this.unbind('mousemove', moveElem);
	if(supp !== false) this.mousedown(startMove).mouseup(cancelMove).mouseout(cancelMove).mousemove(moveElem);
	return this;
}



// Choose event
function chooseElem(e) {
    e.preventDefault();
    var elem = $(this);
    curr.choosed = elem;
}
function unchoose(e) {
    
}
function chooseElemWithBorder(e) {
	e.preventDefault();
	var elem = $(this);
	if(curr.choosed && curr.choosed != elem) {
		if(tag.noborder)
			curr.choosed.css({'z-index':'0','border-top-width':'0px','border-bottom-width':'0px','border-left-width':'0px','border-right-width':'0px'});
		tag.noborder = false;
	}
	else if(curr.choosed == elem) return;
	
	tag.noborder = (elem.css('border-top-width') == '0px');
	if(tag.noborder) {
		elem.css({'z-index':'1','border-top-width':'1px','border-bottom-width':'1px','border-left-width':'1px','border-right-width':'1px'});
	}
	curr.choosed = elem;
}
function chooseElemWithCtrlPts(e) {
	e.preventDefault();
	var elem = $(this);
	if(curr.choosed && curr.choosed != elem) {
		if(tag.noborder)
			curr.choosed.css({'z-index':'0','border-top-width':'0px','border-bottom-width':'0px','border-left-width':'0px','border-right-width':'0px'});
		tag.noborder = false;
		// Remove Control points
		curr.choosed.children('.ctrl_pt').remove();
	}
	else if(curr.choosed == elem) return;
	
	tag.noborder = (elem.css('border-top-width') == '0px');
	if(tag.noborder)
		elem.css({'z-index':'1','border-top-width':'1px','border-bottom-width':'1px','border-left-width':'1px','border-right-width':'1px'});
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
function startResize(e) {
	e.preventDefault();
	e.stopPropagation();
	tag.resizestarted = true;
	prevState.x = e.clientX;
	prevState.y = e.clientY;
	curr.ctrlPt = $(this);
}
function cancelResize(e) {
	if(tag.resizestarted) {
		e.preventDefault();
		e.stopPropagation();
		tag.resizestarted = false;
		curr.ctrlPt = null;
	}
}
function resizeElem(e) {
	if(!tag.resizestarted || !curr.ctrlPt) return;
	e.preventDefault();
	e.stopPropagation();
	var dx = e.clientX - prevState.x;
	var dy = e.clientY - prevState.y;
	var top = curr.ctrlPt.position().top, left = curr.ctrlPt.position().left;
	var elem = curr.ctrlPt.parent();
	var x = elem.position().left, y = elem.position().top;
	var w = elem.width(), h = elem.height();
	
	if(top<0 && left<0) {// Left Top corner
		x += dx; y += dy;
		w -= dx; h -= dy;
	}
	else if(top<0 && left>0) {// Right Top corner
		y += dy;
		w += dx; h -= dy;
	}
	else if(top>0 && left<0) {// Left Bottom corner
		x += dx;
		w -= dx; h += dy;
	}
	else {// Right Bottom corner
		w += dx; h += dy;
	}
	elem.css({'top':y+'px', 'left':x+'px', 'width':w+'px', 'height':h+'px'});
	// Control pts update
	var ctrlw = (w-6.5)+'px', ctrlh = (h-6.5)+'px';
	curr.rt.css('top',ctrlh);
	curr.lb.css('left',ctrlw);
	curr.rb.css({'left':ctrlw, 'top':ctrlh});
	
	prevState.x = e.clientX;
	prevState.y = e.clientY;
}

$.fn.supportResize = function() {
	this.die('mousemove', resizeElem);
	this.die('mouseup', cancelResize);
	this.live('mousemove', resizeElem);
	this.live('mouseup', cancelResize);
	return this;
}
$.fn.resizable = function(supp) {
	this.unbind('click', chooseElemWithCtrlPts);
	this.unbind('click', chooseElem);
	this.unbind('click', chooseElemWithBorder);
	if(supp !== false) this.click(chooseElemWithCtrlPts);
	return this;
}
$.fn.selectable = function(f) {
	if(f === false) {
		this.unbind('click');
		return this;
	}
	if(arguments.length == 1 && !f) 
	    var func = chooseElem;
	else var func = f || chooseElemWithBorder;
	this.click(func);
	this.click(objChoosed);
	return this;
}


// Support step managerment
$.fn.addStepManager = function() {
	if(this.hasClass('scene')) // Check if it's a page
		this.data("StepManager", new StepManager(this));
	return this;
}


// Editable for the text tags
$.fn.editable = function(callback) {
	var tagName = $(this).attr('tagName');
	// Don't support
	if( $.inArray(tagName.toUpperCase(), editSupportTag) == -1 ) return;
	
	var name = $(this).html();
	$(this).click(function() {
		var editfield = $('<input type="text" size="10" value="'+ name +'"></input>');
		var color = $(this).css('color');
		editfield.css({'color':color, 'background':'rgba(255,255,255,0.3)', 'top':$(this).css('top'), 'left':$(this).css('left'), 'position':$(this).css('position'), 'font-family':$(this).css('font-family'), 'font-size':$(this).css('font-size')});
		$(this).replaceWith(editfield);
		editfield.blur(function() {
			var newname = $(this).attr('value');
			var newtext = $('<'+tagName+'>'+newname+'</'+tagName+'>');
			newtext.css({'color':$(this).css('color'), 'top':$(this).css('top'), 'left':$(this).css('left'), 'position':$(this).css('position'), 'font-family':$(this).css('font-family'), 'font-size':$(this).css('font-size')});
			$(this).replaceWith(newtext);
			if(callback) {
			    callback.invoke(newname);
			    newtext.editable(callback);
			}
			else newtext.editable();
		});
	});
	return this;
}


// Circle menu
$.fn.circleMenu = function(buttonmap) {
    var tar = $(this);
    tar.css('cursor', 'url("./images/UI/circlemenuptr.cur"), auto');
    tar.data('circleMenu', buttonmap);
    tar.dblclick(function(e){
        $('#circleMenu').remove();
        var x = e.clientX, y = e.clientY;
        var rx = x, ry = (y<115) ? y : y-25, r = 90;
        var alpha = (y<115) ? (Math.PI/180)*90/5 : -(Math.PI/180)*90/5;
        $('body').append("<div id='circleMenu'></div>");
        var buttonmap = $(this).data('circleMenu');
        var count = 0;
        for(var i in buttonmap){
            var icon = $("<img src='"+buttonmap[i][0]+"'></img>");
            if(buttonmap[i][1]) icon.click(function(){buttonmap[i][1].call(window, tar);});
            icon.css({'left':rx,'top':ry,'opacity':0});
            $('#circleMenu').append(icon);
            // Animation
            var iconx = r*Math.cos(alpha*count), icony = r*Math.sin(alpha*count);
            icon.animate({'left':"+="+iconx+"px",'top':"+="+icony+"px",'opacity':1}, 'normal', 'swing');
            count++;
        }
        
        $('body').click(function(){
            $('#circleMenu').fadeOut("normal", function(){$('#circleMenu').remove();});
        });
    });
}

})(jQuery);