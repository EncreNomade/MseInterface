var idTemp;
var mseVars = {};

function solvEsc(str) {
    var tmp = str;
    tmp = tmp.replace(/\\/g, "\\\\");
    tmp = tmp.replace(/\//g, "\\\/");
    tmp = tmp.replace(/\\t/g, "\\t");
    tmp = tmp.replace(/\\n/g, "\\n");
    tmp = tmp.replace(/\\r/g, "\\r");
    tmp = tmp.replace(/"/g, "\\\"");
    tmp = tmp.replace(/'/g, "\\\'");
    return tmp;
};

function getVar(name) {
	switch(name) {
	case "window": return window;
	case "document": return document;
	case "mse": return mse;
	case "root": return mse.root;
	case "temp": return idTemp;
	default: return mseVars[name];
	}
}

function getVarStr(name) {
	if(!name) return null;
	switch(name) {
	case "temp": return "idTemp";
	case "window": case "document": case "mse": case "null":
		return name;
	default: return "mseVars."+name;
	}
}

function paramStr(p) {
	var val = p.childNodes[0].nodeValue;
	if(!val) return '';
	switch(p.nodeName) {
	case 'size': case 'pos': case 'insideRec':
		return p.nodeName+':[' + val + ']';
	case 'font': case 'textBaseline': case 'textAlign': case 'fillStyle': case 'globalAlpha': case 'lineHeight':
		return p.nodeName+':"'+ val +'"';
	default: mseLog('Parameter Error', 'Definition of '+ p.nodeName +' not found!');
		return '';
	}
}
function paramFuncStr(p) {
	var val = p.childNodes[0].nodeValue;
	if(!val) return '';
	switch(p.nodeName) {
	case 'string' : return '"' + val + '"';
	case 'obj' : return getVarStr(val);
	default: return val;
	}
}

function formatObjParams(elem) {
	var str = '{';
	var s;
	// Parameters
	var params = elem.getElementsByTagName('param')[0];
	if(!params) return '{}';
	else params = params.childNodes;
	for(var i = 0; i < params.length; i++) {
		if(params[i].nodeName=='#text') continue;
		s = paramStr(params[i]);
		if(s != '') str += s + ',';
	}
	// Delete the last useless ','
	if(params.length > 0) str = str.substr(0, str.length-1);
	// Add the finish syntex
	str += "}";
	
	return str;
}

function formatFuncParams(elem) {
	var str = "";
	var s;
	// Parameters
	var params = elem.getElementsByTagName('param')[0];
	if(!params) return str;
	else params = params.childNodes;
	for(var i = 0; i < params.length; i++) {
		if(params[i].nodeName=='#text') continue;
		s = paramFuncStr(params[i]);
		if(s != '') str += s + ',';
	}
	// Delete the last useless ','
	if(params.length > 0) str = str.substr(0, str.length-1);
	return str;
}

function createObj(elem) {
	var id = elem.getAttribute('id');
	var parent = getVarStr(elem.getAttribute('parent'));
	if(!parent) parent = getVarStr(elem.parentNode.getAttribute('id'));
	var paramStr = formatObjParams(elem);
	var type = elem.getAttribute('type');
	
	var creator = getVarStr(id) + " = new mse.";
	switch(type) {
	case 'img':
		var src = elem.getAttribute('src');
		creator += "Image("+parent+","+paramStr+",'"+src+"')";
		break;
	case 'txt':
		var content = elem.getAttribute('content');
		var styled = elem.getAttribute('styled');
		creator += "Text("+parent+","+paramStr+",'"+content+"',"+styled+")";
		break;
	case 'mask':
		creator += "Mask("+parent+","+paramStr+")";break;
	case 'game':
		var className = elem.getAttribute('class');
		var depth = elem.getAttribute('depth');
		var interru = getVarStr(elem.getAttribute('interru'));
		creator += className+"("+parent+","+depth+","+paramStr+","+interru+")";
		break;
	case 'sprite':
		var src = "'"+elem.getAttribute('src')+"'";
		var fw = elem.getAttribute('fw'), fh = elem.getAttribute('fh');
		var sx = elem.getAttribute('sx'), sy = elem.getAttribute('sy'), sw = elem.getAttribute('sw'), sh = elem.getAttribute('sh');
		var frames = elem.getElementsByTagName('frames')[0].childNodes[0].nodeValue;
		creator += "Sprite("+parent+","+paramStr+","+src+","+ fw+","+fh +","+ sx+","+sy+","+sw+","+sh +","+frames+")";
		break;
	default:
		creator += "UIObject("+parent+","+paramStr+")";
	}
	eval(creator);
	var res = getVar(id);
	
	return res;
}

function setLinks(article, links) {
	for(var i = 0; i < links.length; i++){
		var type = links[i].getAttribute('type');
		var src = links[i].getAttribute('src');
		var index = parseInt(links[i].getAttribute('index'));
		var link = links[i].getAttribute('link');
		if(link) {
			switch(type){
			case 'fb': break;
			case 'wiki': link = getVar(link);break;
			case 'audio': link = mse.src.getSrc(link);break;
			default: link = null;
			}
		}
		var lobj = new mse.Link(src, index, type, link);
		var parent = article.getObject(index);
		if(parent instanceof mse.Text) {
		    parent.addLink(lobj);
		}
	}
}

function createLayer(layer) {
	var id = layer.getAttribute('id');
	var parent = getVarStr(layer.getAttribute('parent'));
	if(!parent) parent = getVarStr(layer.parentNode.getAttribute('id'));
	var zid = layer.getAttribute('depth');
	var paramStr = formatObjParams(layer);
	var type = layer.getAttribute('type');
	
	var evalStr = getVarStr(id) +" = new mse.";
	switch(type) {
	case "Layer": 
		eval(evalStr +"Layer("+ parent +","+ zid +","+ paramStr +")");
		break;
	case "PageWiki":
		var tmp = [];
		var title = "'"+ layer.getAttribute('title') +"'";
		var galeries = layer.getElementsByTagName('galery');
		for(var i = 0; i < galeries.length; i++)
			tmp[i] = galeries[i].getAttribute('src');
		var content = "'"+layer.getElementsByTagName('content')[0].childNodes[0].nodeValue+"'";
		if(!content) content = "null";
		eval(evalStr +"PageWiki("+ parent +","+ zid +","+ paramStr +","+ title +",tmp,"+ content +")");
		break;
	case "ArticleLayer":
	    var content = layer.getElementsByTagName('content');
		if(content.length > 0) content = "'"+content[0].childNodes[0].nodeValue+"'";
		else content = "null";
		var defile = layer.getAttribute('defile');
		eval(evalStr +"ArticleLayer("+ parent +","+ zid +","+ paramStr +","+ content +")");
		break;
	case "Menu":
		var iwid = layer.getAttribute('iwidth');
		var ihei = layer.getAttribute('iheight');
		eval(evalStr +"Menu("+ parent +","+ paramStr +","+ iwid +","+ ihei +")");
		var m = getVar(id); m.hide();
		
		var items = layer.getElementsByTagName('item');
		for(var i = 0; i < items.length; i++) {
			var itype = items[i].getAttribute('type');
			var itxt = items[i].getAttribute('txt');
			var iimg = items[i].getAttribute('img');
			var ilink = items[i].getAttribute('link');
			m.addItem(itxt, iimg, itype, (ilink==null ? null : getVar(ilink)));
			var sitems = items[i].getElementsByTagName('subItem');
			for(var j = 0; j < sitems.length; j++) {
				var stype = sitems[j].getAttribute('type');
				var stxt = sitems[j].getAttribute('txt');
				var simg = sitems[j].getAttribute('img');
				var slink = sitems[j].getAttribute('link');
				m.addSubItem(i, stxt, simg, stype, (slink==null ? null : getVar(slink)));
			}
		}
		break;
	default: return null;
	}
	
	var l = getVar(id);
	
	var elems = layer.getElementsByTagName('obj');
	for(var i = 0; i < elems.length; i++) {
		var obj = createObj(elems[i]);
		if(obj) {
			var index = parseInt(elems[i].getAttribute('phIndex'));
			// Add to end of list
			if( isNaN(index) ) l.addObject(obj);
			// Insert obj to index, if index negatif, don't add it
			else if(index >= 0) l.insertObject(obj, l.phraseIndexs[index]);
		}
	}
	
	if(type == "ArticleLayer") {
	    if(defile) l.setDefile(defile);
	    // Link system
	    var links = layer.getElementsByTagName('link');
	    if(links.length > 0) setLinks(l, links);
	}
	return l;
}

function createAnime(a) {
	// Obj prerequired
	var objs = a.getElementsByTagName('obj');
	for(var i = 0; i < objs.length; i++) {
		var o = createObj(objs[i]);
	}
	
	var id = a.getAttribute('id');
	var type = a.getAttribute('type'); // keyframe or frame
	var immi = (a.getAttribute('immi')=="true" ? true : false); // run immidiate or not
	var tar = getVarStr(a.getAttribute('tar'));
	var rep = a.getAttribute('repeat');
	if(!id || !tar) return;
	if(!rep) rep = "1";
	
	switch(type) {
	case "keyframe":
		var trans = a.getAttribute('trans');
		var mapStr = "{";
		// Frame map
		var map = a.childNodes;
		for(var i = 0; i < map.length; i++) {
			if(map[i].nodeName=='#text' || map[i].nodeName=='obj') continue;
			mapStr += map[i].nodeName +":"+ map[i].childNodes[0].nodeValue +",";
		}
		// Delete last ','
		mapStr = mapStr.substr(0, mapStr.length-1);
		mapStr += "}";
		eval(getVarStr(id) +"=new mse.KeyFrameAnimation("+ tar +","+ mapStr +","+ rep +")");
		// No transition between frames, default yes
		if(trans == "false") getVar(id).setNoTransition();
		break;
	case "frame":
		var inter = a.getAttribute('interval');
		var frame = a.getElementsByTagName('frame')[0].childNodes[0].nodeValue;
		eval(getVarStr(id) +"=new mse.FrameAnimation("+ tar +","+ frame +","+ rep +","+ inter +")");
		break;
	}
	
	if(immi) mse.root.animations.push(getVar(id));
}

function createPage(page) {
	var id = page.getAttribute('id');
	var parent = getVarStr(page.getAttribute('parent'));
	if(!parent) parent = getVarStr(page.parentNode.getAttribute('id'));
	var paramStr = formatObjParams(page);
	
	// Run the creator code
	eval(getVarStr(id) + "=new mse." + page.getAttribute('type') +"("+ parent +","+ paramStr +")");
	var p = mseVars[id];

	var layers = page.getElementsByTagName('layer');
	for(var i = 0; i < layers.length; i++) {
		var l = createLayer(layers[i]);
		p.addLayer('layer'+i, l);
	}
	
	var animes = page.getElementsByTagName('anime');
	for(i = 0; i < animes.length; i++) {
		createAnime(animes[i]);
	}
	
	return p;
}

function createSrc(src) {
    var type = src.getAttribute('type');
    switch(type) {
    case 'image': case 'audio':
	    mse.src.addSource(src.getAttribute('name'), 
					      "." + src.getAttribute('path'), 
					      type, 
					      (src.getAttribute('preload')=="true"?true:false));
		break;
	}
}

function createWiki(wiki) {
    var secs = wiki.getElementsByTagName('wkSection');
    var imgs = wiki.getElementsByTagName('wkImage');
    var id = wiki.getAttribute('id');
    
    eval(getVarStr(id) + "=new mse.WikiLayer();");
    for(var i = 0; i < secs.length; i++){
        var type = secs[i].getAttribute('type');
        var title = secs[i].getAttribute('title');
        var content = secs[i].childNodes[0].nodeValue;
        switch(type){
        case 'text': var str = getVarStr(id)+".addExplication('"+solvEsc(title)+"', '"+solvEsc(content)+"')";break;
        case 'link': var str = getVarStr(id)+".addLink('"+solvEsc(title)+"', '"+solvEsc(content)+"')";break;
        }
        if(str) eval(str);
    }
    for(var i = 0; i < imgs.length; i++) {
        var src = imgs[i].getAttribute('src');
        var legend = imgs[i].childNodes[0].nodeValue;
        eval(getVarStr(id)+".addImage('"+src+"', '"+legend+"')");
    }
}

function handle_struct(data) {
    var xmlstruct = (new DOMParser()).parseFromString(data, 'text/xml');
	var elemroot = xmlstruct.getElementsByTagName('root')[0];
	eval(getVarStr(elemroot.getAttribute('id')) + " = new mse.Root(elemroot.getAttribute('name'), elemroot.getAttribute('width'), elemroot.getAttribute('height'), elemroot.getAttribute('orient'))");
	
	// Ressources
	var srcs = elemroot.getElementsByTagName('src');
	for(var i = 0; i < srcs.length; i++) {
		createSrc(srcs[i]);
	}
	
	// Wikis
	var wikis = elemroot.getElementsByTagName('wiki');
	for(var i = 0; i < wikis.length; i++) {
	    createWiki(wikis[i]);
	}
	
	// Pages
	var pages = elemroot.getElementsByTagName('page');
	for(var i = 0; i < pages.length; i++) {
		var page = pages[i];
		createPage(page);
	}
	
	// Scripts
	//var url = "/book_reader/get_scripts/<%= @chap %>";
	//$.get(url);
	
	// Launch the loop
	mse.currTimeline.start();
}