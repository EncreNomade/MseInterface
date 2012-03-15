var pages = {};
var managers = {};
var tag = {
	drawstarted: false
};
var prevState = {};
var curr = {
    objId: 0
};
var dialog, srcMgr;
// Parameters' list with disable configuration, defaultly all false
var paramdisablelist = {
	pos:false,
	size:false,
	text:false,
	opac:false,
	back:false,
	fill:false,
	stroke:false
};

function init() {
	dialog = new Popup();
	srcMgr = new SourceManager();
	
	$('#menu_mask').hide();
	$('.central_tools').hide();
	$('#editor').hide();
	$('#timeline').hide();
	$('#shapeTools').hideable(function() {
		$('#menu_mask').hide();
		// Unbind event handler
		$('#editor').unbind();
		$('body').unbind('mouseup', cancelDraw);
		$('body').unbind('mousemove', drawing);

		$('#shapeTools').hide();
		$('#editor').hide();
		// Copy all in current step
		var elems = $('#editor').children('div');
		var res = elems.deletable(false).clone();
		res.each(function() {
			//srcMgr.addSource('obj', $(this));
			$(this).attr('id', 'obj'+(curr.objId++));
			$(this).selectable(null).deletable().configurable().hoverButton('./images/UI/addscript.jpg', addScriptForObj).appendTo(curr.step);
		});
		elems.remove();
	});
	// Tool chooser in shape tools
	var tools = $('#shapeTools').find('img:lt(4)');
	tools.click(function() {
		tools.removeClass('active');
		$(this).addClass('active');
	});
	$('#textTools').hideable(function() {
		$('#menu_mask').hide();
		// Unbind event handler
		$('#editor').unbind();
		// Hide editor
		$('#textTools').hide();
		$('#editor').hide();
		
		// Generate Text Elem
		var elems = $('#editor').children('div');
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
			var fontsize = area.css('font-size');
			for(var i = 0; i < arr.length; i++) {
				res.append('<p style="margin:0px;padding:0px;">'+arr[i]+'</p>');
			}
			// Append all in current step
			res.selectable(null).moveable().resizable().deletable().configurable().hoverButton('./images/UI/addscript.jpg', addScriptForObj).appendTo(curr.step);
			//srcMgr.addSource('text', res);
		});
		elems.remove();
	});
	$('#wikiTools').hideable(function() {
	    $('#menu_mask').hide();
	    // Unbind event handler
	    $('#editor').unbind();
	    $('#wikiTools').hide();
	    $('#editor').css('overflow','hidden').hide();
	    $('#editor').children('div').remove();
		//saveWiki();
	});
	// Font configue in Wiki tools
	$('#wiki_color').change(function(){
	    $('#editor').find('h5, h3, h4').css('color', this.value);
	});
	$('#wiki_font').change(function(){
	    $('#editor').find('h5, h3, h4').css('font-family', this.value);
	});
	$('#wiki_size').change(function(){
	    $('#editor').find('h5, h3, h4').css('font-size', config.sceneY(this.value)+'px');
	});
	$('#animeTools').hideable(function() {
	    $('#menu_mask').hide();
	    // Unbind event handler
	    $('#editor').unbind();
	    $('#animeTools').hide();
	    $('#editor').hide();
	    $('#editor').children('div').remove();
	    $('#timeline').hide();
	    $('#addFrame').prevAll().remove();
	    $('#editor').css('background', '#ffffff');
	    $('#animeName').val("");
	    $('#animeRepeat').val(1);
	});
	// Set transition type
    $('.motion').live('click', transSetup);
	$('#addFrame').click(addFrame);
	$('#createAnime').click(function(){
	    var name = $("#animeName").val();
	    var repeat = $("#animeRepeat").val();
	    var anime = new Animation(name, repeat, true);
	    anime.createAnimation($('#timeline').children('div'));
	    srcMgr.addSource('anime', anime, $('#animeName').val());
	});
	
	
	// Config change real time listener
	$('#text_color').get(0).onchange = configChanged;
	$('#text_font').get(0).onchange = configChanged;
	$('#text_size').get(0).onchange = configChanged;
	$('#text_style').get(0).onchange = configChanged;
	$('#text_align').get(0).onchange = configChanged;
	// Mouse event handler for the resize behavior
	$('body').supportResize(); 
	
	$('#bottom_panel .add').click(function(){
	    var bottom = $('#bottom_panel');
	    // Close
	    if(bottom.css('top') == "-180px") {
		    bottom.animate({'top':'-20px'}, 500, 'swing');
		    $(this).text('⋀');
		}
		// Open
		else {
		    bottom.animate({'top':'-180px'}, 500, 'swing');
		    $(this).text('⋁');
		}
	});
	
	// Init x and y rulers
	drawRulers();
	
	// Hide link setter
	$('#linkSetter').hide();
	// Link setter interaction
	$('.article').live('mouseup', textSelected);
	$('.scene').live('mousedown', hideLinkSetter);
	$('.wikilink, .fblink, .audiolink').live('mouseup', modifyLink);
	$('#linkType').change(function() {
	    var type = $(this).val();
	    $('#audiolinkInput, #wikilinkInput, #fblinkInput').remove();
	    var input = null;
	    switch(type) {
	    case "audio":
	        input = (new DropZone(dropToAudioElemZone, {'width':'80%','height':'80px'}, "audiolinkInput")).jqObj;
	        break;
	    case "wiki":
	        input = (new DropZone(dropToWikiElemZone, {'width':'80%','height':'80px'}, "wikilinkInput")).jqObj;
	        break;
	    case "fb":
	        input = $('<input id="fblinkInput" type="text" size="20"></input>');break;
	    }
	    if(input) $(this).after(input);
	}).change();
	// Add link
	$('#addLinkBn').click(function() {
	    if(!curr.selectNode) return;
	    
	    var type = $('#linkType').val();
	    if(!type) return;
	    
	    // Modify a exist link
	    if(curr.selectNode.get(0).nodeName.toLowerCase() == "span") {
	        switch(type) {
	        case "audio":
	            var link = $('#audiolinkInput').attr('link');
	            if(link && srcMgr.isExist(link)) {
	                curr.selectNode.attr('class', 'audiolink');
	                curr.selectNode.attr('link', link);
	            }
	            break;
	        case "wiki":
	            var link = $('#wikilinkInput').attr('link');
	            if(link && srcMgr.isExist(link)) {
	                curr.selectNode.attr('class', 'wikilink');
	                curr.selectNode.attr('link', link);
	            }
	            break;
	        case "fb":
	            var link = $('#fblinkInput').val();
	            if(link && link.toLowerCase().match(/[\w\W]*www\.facebook\.com\/[\w\W]*/)) {
	                curr.selectNode.attr('class', 'fblink');
	                curr.selectNode.attr('link', link);
	            }
	            break;
	        }
	    }
	    // Add a link
	    else {
	        var nodeHtml = curr.selectNode.html();
	        var selStr = nodeHtml.substring(curr.selectRange.startOffset, curr.selectRange.endOffset);
	        var linkedStr = null;
	        switch(type) {
	        case "audio":
	            var link = $('#audiolinkInput').attr('link');
	            if(link && srcMgr.isExist(link))
	                linkedStr = '<span class="audiolink" link="'+link+'">'+selStr+'</span>';break;
	        case "wiki":
	            var link = $('#wikilinkInput').attr('link');
	            if(link && srcMgr.isExist(link))
	                linkedStr = '<span class="wikilink" link="'+link+'">'+selStr+'</span>';break;
	        case "fb":
	            var link = $('#fblinkInput').val();
	            if(link && link.toLowerCase().match(/[\w\W]*www\.facebook\.com\/[\w\W]*/)) 
	                linkedStr = '<span class="fblink" link="'+link+'">'+selStr+'</span>';break;
	        }
	        if(linkedStr) curr.selectNode.html(nodeHtml.replace(selStr, linkedStr));
	    }
	    hideLinkSetter();
	});
}


// Draw Rulers==========================================

function drawRulers() {
    var scales = [1,5,10];
    var ctxRulerX = $('#rulerX').get(0).getContext('2d');
    var ctxRulerY = $('#rulerY').get(0).getContext('2d');
    ctxRulerX.lineWidth = ctxRulerY.lineWidth = 1;
    ctxRulerX.strokeStyle = ctxRulerY.strokeStyle = "#000";
    ctxRulerX.lineCap = ctxRulerY.lineCap = "round";
    ctxRulerX.fillStyle = ctxRulerY.fillStyle = "#000";
    ctxRulerX.font = ctxRulerY.font = "8px Arial Narrow";
    ctxRulerX.textBaseline = ctxRulerY.textBaseline = "top";
    var width = $('#rulerX').width();
    var height = $('#rulerY').height();

    // Find the smallest division in ruler
    var scale = 0;
    for(var i = 0; i < scales.length; i++) {
        if(scales[i] * config.ratio > 4) {
            scale = scales[i];
            break;
        }
    }
    // Unit volume
    var unit = scale*config.ratio;
    
    var twidth, x, y;
    ctxRulerX.beginPath();
    ctxRulerX.moveTo(0,0.5);
    ctxRulerX.lineTo(width,0.5);
    for(x = 14.5, i = 0; x <= width; x += unit, i++) {
        if(i%5 == 0) {
            y = 9;
            twidth = ctxRulerX.measureText(i*scale).width;
            ctxRulerX.fillText(i*scale, x-twidth/2, 1, 15);
        }
        else y = 11;
        ctxRulerX.moveTo(x, 15);
        ctxRulerX.lineTo(x, y);
    }
    ctxRulerX.stroke();
    
    ctxRulerY.beginPath();
    ctxRulerY.moveTo(0,0);
    ctxRulerY.lineTo(0,height);
    for(y = 15.5, i = 0; y <= height; y += unit, i++) {
        if(i%5 == 0) {
            x = 9;
            ctxRulerY.fillText(i*scale, 1, y, 15);
        }
        else x = 11;
        ctxRulerY.moveTo(x, y);
        ctxRulerY.lineTo(15, y);
    }
    ctxRulerY.stroke();
}


// Dialog===============================================

// Add source files dialog
function addFileDialog() {
	dialog.showPopup('Ajout de fichiers', 400, 330, 'Télécharger', 'Annuler');
	dialog.main.html('<h2> - Image et son:</h2><p><label>Lien internet:</label><input id="addLink" type="text"></p><p><label>Fichiers locaux:</label><input id="addFile" type="file" multiple="multiple"></p>');
	dialog.main.append('<h2> - Jeu</h2><p><label>Nom de classe:</label><input id="gamename" type="text"/></p><p><label>Code source:</label><input id="addjs" type="file" accept="text/javascript"/></p>');
	// Upload file
	dialog.confirm.click(uploadfile);
}
function uploadfile() {
    // Image or sound link
    var link = $('#addLink').val().toLowerCase();
    if(link && link != '') {
        if(link.indexOf('http') < 0) link = "http://" + link;
        var imgpattern = /(\.png|\.jpeg|\.jpg|\.gif|\.bmp)$/;
        var audpattern = /(\.mp3|\.ogg|\.wav)$/;
        if(link.search(imgpattern) != -1) {
            srcMgr.addSource('image', link);
            dialog.close();
        }
        else if(link.search(audpattern) != -1) {
            srcMgr.addSource('audio', link);
            dialog.close();
        }
        else {
            alert("Échec à télécharger, type inconnu");
        }
    }
    // Image or sound files
	var files = document.getElementById("addFile").files;
	if(files) {
	    var fails = 0;
	    for(var i = 0; i < files.length; i++) {
	        var file = files[i];
	        var name = ('name' in file) ? file.name : file.fileName;
	        var size = ('size' in file) ? file.size : file.fileSize;
	        var type = ('type' in file) ? file.type : (('mediaType' in file) ? file.mediaType : "unknown");
	        var srcreader = new FileReader();
	        // Check file size
	        if(!file || file.size >= 1100000) {
	    		fails++;
	        }
	        // Check file type 
	        else if(type.indexOf('image') >= 0) {
	            srcreader.readAsDataURL(file);
	            srcreader.onload = addImgSrc;
	        }
	        else if(type.indexOf('audio') >= 0) {
	            srcreader.readAsDataURL(file);
	            srcreader.onload = addAudioSrc;
	        }
	    }
	    if(fails > 0) alert("Échec à télécharger " + fails + " fichiers d'image ou de son, type inconnu ou fichier trop grand( >1Mb )");
	}
	// Game file
	curr.gamename = $('#gamename').val();
	// Game name exist
	if(curr.gamename && curr.gamename != "") {
	    var gamefile = document.getElementById("addjs").files;
	    // File exist
	    if(gamefile && gamefile.length == 1) {
	        var file = gamefile[0];
	        var size = ('size' in file) ? file.size : file.fileSize;
	        // Check file size
	        if(file.size >= 550000) {
	        	alert("Échec à télécharger le fichier javascript de jeu, fichier trop grand( >500Kb )");
	        }
	        else {
	            var jsreader = new FileReader();
	            jsreader.readAsText(file);
	            jsreader.onload = addJsSrc;
	        }
	    }
	}
	dialog.close();
}

// Add page dialog
function createPageDialog() {
	dialog.showPopup('Ajouter une page', 400, 200, 'Ajouter');
	dialog.main.html('<p><label>Name: </label><input id="addPage" type="text"></p>');
	dialog.confirm.click(function() {
		var name = $('#addPage').val();
		var page = addPage(name);
		// Add default step
		var mgr = page.data('StepManager');
		mgr.addStep(name+'default', null, true);
		dialog.close();
	});
};

// Add step dialog
function createStepDialog() {
	dialog.showPopup('Ajouter un nouveau étape', 340, 200);
	// Name and Z-index
	var nz = $('<p><label>Nom:</label><input id="stepName" size="10" type="text"></p>');
	dialog.main.append(nz);
	// Differente type of Step
	dialog.main.append('<div style="position:relative;left:60px;top:15px"><div id="normalStep" class="big_button">Normal</div><div id="article" class="big_button">Article</div></div>');
	
	$('#normalStep, #article, #wiki').click(function() {
		var params = {};
		var name = $('#stepName').val();
		
		if(!name || name == "") {
			$('#stepName').parent().css('color','RED');
			return;
		}
		else $('#stepName').parent().css('color','BLACK');
		
		if(this == $('#normalStep').get(0)) {
		    if(curr.page) curr.page.data('StepManager').addStep(name, params, true);
			dialog.close();
		}
		else if(this == $('#article').get(0)) {
			articleStepDialog(name, params);
		}
	});
};
// Add Article Step Dialog
function articleStepDialog(name, params) {
	dialog.showPopup('Configurer étape d\'article: '+name, 400, 520, 'Ajouter');
	dialog.main.append('<h2> - Parameters</h2>');
	dialog.main.append('<p><label>Défile auto:</label><input id="defile" type="checkbox"></p>');
	dialog.main.append('<p><label>Location:</label><input id="articlex" size="10" placeholder="x" type="text"><span>px</span><input id="articley" size="10" placeholder="y" type="text"><span>px</span></p>');
	dialog.main.append('<p><label>Ligne de texte:</label><input id="linew" size="10" placeholder="Largeur" type="text"><span>px</span><input id="lineh" size="10" placeholder="hauteur" type="text"><span>px</span></p>');
	dialog.main.append('<p><label>Police:</label><input id="articleFont" size="10" placeholder="famille" type="text"><input id="articleFsize" style="width: 28px;" type="number"><span>px</span><select id="articleFontw"><option value="normal">normal</option><option value="bold">bold</option></select></p>');
	dialog.main.append('<p><label>Couleur:</label><input id="articleColor" size="10" type="color"></p>');
	dialog.main.append('<p><label>Alignement:</label><select id="articleAlign"><option value="left">left</option><option value="center">center</option><option value="right">right</option></select></p>');
	
	dialog.main.append('<h2> - Contenu de l\'article</h2>');
	dialog.main.append('<p><textarea id="articleContent" rows="10" cols="49" placeholder="Coller ou deplacer le contenu ici"></textarea></p>');
	
	dialog.confirm.click(function() {
		params.defile = $('#defile').get(0).checked;
		var x = parseInt($('#articlex').val()), y = parseInt($('#articley').val());
		var lw = parseInt($('#linew').val()), lh = parseInt($('#lineh').val());
		var font = $('#articleFont').val();
		var fsize = $('#articleFsize').val();
		var weight = $('#articleFontw').val();
		var color = $('#articleColor').val();
		var align = $('#articleAlign').val();
		var content = $('#articleContent').val();
		if(!content || content == "") {
			$('#articleContent').parent().prev().css('color','RED');
			return;
		}
		
		if(isNaN(x) || isNaN(y)) {
			$('#articlex').parent().css('color','RED');
			return;
		}
		else {
			params.x = x; params.y = y;
			$('#articlex').parent().css('color','BLACK');
		}
		if(isNaN(lw) || isNaN(lh)) {
			$('#linew').parent().css('color','RED');
			return;
		}
		else {
			params.lw = lw; params.lh = lh;
			$('#linew').parent().css('color','BLACK');
		}
		if(font != "") params.font = font;
		if(!isNaN(fsize)) params.fsize = fsize;
		params.fweight = weight;
		if(isColor(color)) params.color = color;
		params.align = align;
		
		addArticle(name, params, content);
		dialog.close();
	});
}


// Parameter dialog
function showParameter(obj, conf) {
	if(!obj || obj.length == 0) return;
	// Get parameters exited
	var x = obj.position().left, y = obj.position().top;
	var width = obj.width(), height = obj.height();
	var font = obj.css('font-family'), fsize = cssCoordToNumber(obj.css('font-size')), fstyle = obj.css('font-weight');
	var align = obj.css('text-align');
	var opac = obj.css('opacity')*100;
	var back = obj.css('background-color'), color = obj.css('color'), stroke = obj.css('border-top-color');
	var disables = paramdisablelist;
	if(conf) disables = $.extend(paramdisablelist, conf);
	// Coordinate system transform
	x = config.realX(x); y = config.realY(y);
	width = config.realX(width); height = config.realY(height);
	fsize = config.realY(fsize);
	
	dialog.showPopup('Modifier les paramètres', 400, 520, 'Confirmer');
	dialog.main.append('<h2> - Position et dimension</h2>');
	dialog.main.append('<p><label>Position:</label><input id="pm_x" size="10" value="'+x+'" placeholder="x" type="text"><span>px</span><input id="pm_y" size="10" value="'+y+'" placeholder="y" type="text"><span>px</span></p>');
	dialog.main.append('<p><label>Taille</label><input id="pm_width" size="10" value="'+width+'" placeholder="Largeur" type="text"><span>px</span><input id="pm_height" size="10" value="'+height+'" placeholder="hauteur" type="text"><span>px</span></p>');
	dialog.main.append('<h2> - Texte</h2>');
	dialog.main.append('<p><label>Police:</label><input id="pm_font" size="10" value="'+font+'" placeholder="famille" type="text"><input id="pm_fsize" style="width: 28px;" value="'+fsize+'" type="number"><span>px</span><select id="pm_fstyle" value="'+fstyle+'"><option value="normal">normal</option><option value="bold">bold</option></select></p>');
	dialog.main.append('<p><label>Alignement:</label><select id="pm_align"><option value="left">left</option><option value="center">center</option><option value="right">right</option></select></p>');
	dialog.main.append('<h2> - Couleur</h2>');
	dialog.main.append('<p><label>Opacity:</label><input id="pm_opac" style="width: 28px;" value="'+opac+'" type="number"></p>');
	dialog.main.append('<p><label>Fond:</label><input id="pm_back" size="10" value="'+back+'" type="color"></p>');
	dialog.main.append('<p><label>Color:</label><input id="pm_color" size="10" value="'+color+'" type="color"></p>');
	dialog.main.append('<p><label>Trace:</label><input id="pm_stroke" size="10" value="'+stroke+'" type="color"></p>');
	//dialog.main.append('<h2> - Les autres</h2>');
	
	// Disables
	if(disables.pos) $('#pm_x, #pm_y').attr('disabled', 'true');
	if(disables.size) $('#pm_width, #pm_height').attr('disabled', 'true');
	if(disables.text) $('#pm_font, #pm_fsize, #pm_fstyle, #pm_align').attr('disabled', 'true');
	if(disables.opac) $('#pm_opac').attr('disabled', 'true');
	if(disables.back) $('#pm_back').attr('disabled', 'true');
	if(disables.color) $('#pm_color').attr('disabled', 'true');
	if(disables.stroke) $('#pm_stroke').attr('disabled', 'true');
	$('#pm_align').val(align);
	
	dialog.confirm.click(function(){
		var res = {};
		res.left = config.sceneX($('#pm_x').val())+'px';
		res.top = config.sceneY($('#pm_y').val())+'px';
		res.width = config.sceneX($('#pm_width').val())+'px';
		res.height = config.sceneY($('#pm_height').val())+'px';
		res['font-family'] = $('#pm_font').val();
		res['font-size'] = config.sceneY($('#pm_fsize').val())+'px';
		res['font-weight'] = $('#pm_fstyle').val();
		res['text-align'] = $('#pm_align').val();
		res.opacity = $('#pm_opac').val()/100;
		res['background-color'] = $('#pm_back').val();
		res.color = $('#pm_color').val();
		res['border-color'] = $('#pm_stroke').val();
		obj.css(res);
		dialog.close();
	});
}


// Insert obj in Article dialog
function insertElemDialog(e) {
	dialog.showPopup('Inserer les éléments dans l\'article', 400, 300, 'Inserer', $(this).parent().parent());
	// show ressource panel
	$('#bottom').css('z-index','110');
	dialog.annuler.click(closeBottom);
	// Drop zone
	var dzone = (new DropZone(dropToInsertZone, {'top':'25px','width':'250px','height':'150px'})).jqObj;
	dialog.main.append(dzone);
	
	dialog.confirm.click(function() {
	    closeBottom();
		var prepared = dzone.children();
		for(var i = prepared.length-1; i >= 0; i--) {
			var id = $(prepared.get(i)).data('srcId');
			var elem = srcMgr.generateChildDomElem(id, dialog.caller.parent());
			elem.attr('id', 'obj'+(curr.objId++));
			elem.selectable(selectP)
			    .staticButton('./images/UI/insertbelow.png', insertElemDialog)
			    .staticButton('./images/UI/addscript.jpg', addScriptForObj);
			elem.insertAfter(dialog.caller);
		}
		dialog.close();
	});
};


// Set link popup dialog
function showLinkSetter(e) {
    $('#linkSetter .drop_zone').html("");
    $('#fblinkInput').attr('value', '');
    $('#linkSetter').css({top:e.pageY+5+'px',left:e.pageX-15+'px'}).show('slow');
};
function hideLinkSetter(e) {
    $('#linkSetter').hide('slow');
    curr.selectNode = null;
    curr.selectRange = null;
};

// Wiki add section dialog
function addSectionDialog(e) {
    dialog.showPopup('Nouvelle section de la carte Wiki', 400, 230, 'Ajouter');
    dialog.main.append('<p><label>Titre:</label><input id="section_title" type="text" size="10"></p>');
    dialog.main.append('<p><label>Type:</label><select id="section_type"><option value="text">texte</option><option value="link">lien</option></select></p>');
    dialog.main.append('<p><label>Contenu:</label><textarea row="5" cols="22" id="section_content" style="margin-left:10px;"></textarea></p>');
    
    dialog.confirm.click(function(){
        if( addSectionWiki($(e.target), $('#section_title').val(), $('#section_type').val(), $('#section_content').val()) )
            dialog.close();
    });
};

// Animation transition setup dialog
function transSetup(e){
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
};

// Add script
function addScriptForObj(e){
    e.preventDefault();
    e.stopPropagation();
    var obj = $(this).parent().parent();
    addScriptDialog(obj, "obj");
};
function addScriptDialog(src, srcType){
    var name = "";
    var tagName = src[0].tagName;
    var srcid = "";
    if(srcType != "obj") {
        // Page label event
        if(tagName == "LI") {srcid = name = src.text(); srcType = "page";}
        // Layer expo event
        else if(src.hasClass('layer_expo')) {
            name = src.children('h1').text(); 
            srcType = "layer"; 
            srcid = src.find('span').text();
        }
        // Anime obj event
        else if(src.hasClass('icon_src')) {
            srcid = src.data('srcId');
            name = src.children('p').text(); 
            srcType = "anime";
        }
    }
    else {
        name = "Object";
        srcid = src.prop('id');
    }
    if(!srcType || !srcid || srcid == "") return;
    
    dialog.showPopup('Ajouter un script pour '+name, 400, 390, 'Confirmer', src);
    dialog.main.append('<p><label>Ajout automatique:</label><input id="ajout_auto" type="checkbox" style="margin-top:12px;" checked></p>');
    dialog.main.append('<p><label>Name:</label><input id="script_name" type="text" size="20"></p>');
    dialog.main.append('<p><label>Action:</label>'+scriptMgr.actionSelectList('script_action', srcType)+'</p>');
    dialog.main.append('<p><label>Réaction:</label>'+scriptMgr.reactionList('script_reaction')+'</p>');
    dialog.main.append('<p><label>Cible de réaction:</label></p>');
    $('#script_reaction').change(tarDynamic).blur(tarDynamic).change();
    dialog.annuler.click(closeBottom);
    dialog.confirm.click(function(){
        var ajoutAuto = $('#ajout_auto').get(0).checked;
        var name = $('#script_name').val();
        var action = $('#script_action').val();
        var reaction = $('#script_reaction').val();
        if(name == "" || action == "" || reaction == ""){
            alert('Information incomplete');
            return;
        }
        
        var tarType = scriptMgr.reactionTarget(reaction);
        var tar = null, supp = null;
        switch(tarType) {
        case "page": case "script": tar = $('#script_tar').val();break;
        case "obj": 
            if($('#script_supp').children().length==0) {alert('Information incomplete');return;}
            tar = $('#script_tar').data('chooser').val();
            supp = $('#script_supp').attr('target');
            break;
        case "anime": case "image": case "game": case "audio":
            tar = $('#script_tar').attr('target');break;
        case "code": case "effetname": default:break;
        }
        if(tarType != 'code' && tarType != 'effetname' && (!tar || tar == "")) {
            alert('Information incomplete');return;
        }
        scriptMgr.addScript(name, srcid, srcType, action, tar, reaction, ajoutAuto, supp);
        closeBottom();
        dialog.close();
    });
};
var closeBottom = function() {
	$('#bottom').css('z-index','6');
};
function tarDynamic(e){
    closeBottom();
    var react = $(this).val();
    var cible = $('.popup_body p:eq(4)');
    cible.children('label').nextAll().remove();
    cible.nextAll().remove();
    var type = scriptMgr.reactionTarget(react);
    switch(type) {
    case "page":
        var select = '<select id="script_tar">';
        $('.scene').each(function(){
            select += '<option value="'+$(this).prop('id')+'">'+$(this).prop('id')+'</option>';});
        select += '</select>';
        cible.append(select);
        break;
    case "obj":
        var objChooser = new ObjChooser("script_tar");
        objChooser.appendTo(cible);
        var dz = (new DropZone(dropToTargetZone, {'margin':'0px','padding':'0px','width':'60px','height':'60px'}, "script_supp")).jqObj;
        dz.data('type', 'image');
        var supp = $('<p><label>Image après la transition:</label></p>');
        supp.append(dz);
        cible.after(supp);
        // show ressource panel
        $('#bottom').css('z-index','110');
        break;
    case "anime":
    case "image":
    case "game":
    case "audio":
        // show ressource panel
        $('#bottom').css('z-index','110');
        var dz = (new DropZone(dropToTargetZone, {'margin':'0px','padding':'0px','width':'60px','height':'60px'}, "script_tar")).jqObj;
        dz.data('type', type);
        cible.append(dz);
        break;
    case "script":
        cible.append(scriptMgr.scriptSelectList('script_tar'));
        break;
    case "code": case "effetname": default:break;
    }
};
// Drop event for all type of target
function dropToTargetZone(e) {
	e.stopPropagation();
	$(this).css('border-style', 'dotted');
	
	var id = e.dataTransfer.getData('Text');
	var type = srcMgr.sourceType(id);
	if(!id || type != $(this).data('type')) return;
	// Place in the elem zone
	$(this).html(srcMgr.getExpo(id));
	$(this).attr('target', id);
};




// Source management====================================

function addImgSrc(evt) {
	srcMgr.addSource('image', evt.target.result);
};
function addAudioSrc(evt) {
    srcMgr.addSource('audio', evt.target.result);
};
function addJsSrc(evt) {
    // No game class name, can't add a game
    if(!curr.gamename) return;
    var content = evt.target.result;
    var name = curr.gamename;
    var exp = "/"+name+"\\s*=\\s*function/";
    if(content.search(eval(exp)) >= 0) {
        srcMgr.addSource('game', content, name);
    }
    else alert("Échec d'ajouter le jeu car il n'est pas trouvé dans le fichier.");
};

function addImageElem(id, data, page, step) {
	var img = $('<img name="'+ id +'">');
	img.attr('src', data);
	img.css({'width':'100%','height':'100%'});
	
	var src = srcMgr.getSource(id);
    if(src.width && src.height) var w = src.width, h = src.height;
    else var w = img.prop('width'), h = img.prop('height');
    var cw = page.width(), ch = page.height();
    if(!w || !h) return;
    
    var container = $('<div id="obj'+(curr.objId++)+'">');
	container.append(img);
	container.deletable();
	
	// Resize
	var ratiox = cw/w;
	var ratioy = ch/h;
	var ratio = (ratiox > ratioy ? ratioy : ratiox);
	if(ratio < 1) {w = w*ratio; h = h*ratio;};
	container.css({'position':'absolute', 'top':'0px', 'left':'0px'});
	container.css({'width':w+'px', 'height':h+'px', 'border-style':'solid', 'border-color':'#4d4d4d', 'border-width':'0px'});
	
	// Listener to manipulate
	// Choose Resize Move
	container.resizable().moveable().configurable({text:true,stroke:true}).hoverButton('./images/UI/addscript.jpg', addScriptForObj);

	step.append(container);
}

function addPage(name) {
	var page = $('<div id="'+name+'" class="scene"></div>');
	page.width(config.swidth).height(config.sheight);
	$('#center_panel').append(page);
	pages[name] = page;
	
	// Add step manager
	page.addStepManager();
	// DnD listenerts to add Elements
	page.get(0).addEventListener('dragover', dragOverScene, false);
	page.get(0).addEventListener('drop', dropToScene, false);
	
	var pageLabel = $('<li>'+name+'</li>');
	pageLabel.click(activeBarLabel).circleMenu({
	        'test':['./images/UI/recut.png',null],
	        'test1':['./images/UI/left.png',null],
	        'addScript':['./images/UI/addscript.jpg',addScriptDialog]});
	$('#newPage').before(pageLabel);
	// Set active the label
	var parent = $(this).parents().find('.tabBar');
	$('#newPage').prevAll().removeClass('active');
	pageLabel.addClass('active');
	for(var i in pages) pages[i].css('z-index','1');
	page.css('z-index','2');
	curr.page = page;
	
	var mgr = page.data('StepManager');
	// Active page
	mgr.active();
	return page;
};
function delCurrentPage() {
    // Check number of the pages
    if($('.scene').length <= 1 || curr.page == null) {
        alert("Échec, il rest qu'une page ou pas de page activé.");
        return;
    }
    
    var name = curr.page.prop('id');
    // Delete in labelbar
    $('#pageBar .active').remove();
    // Delete step manager in dom
    curr.page.data('StepManager').manager.remove();
    // Delete in dom
    curr.page.remove();
    // Delete in pages
    delete pages[name];
    delete managers[name];
    // Active another page
    $('#pageBar li:first-child').click();
};

function addArticle(name, params, content) {
    if(!curr.page) return;
    if(!params) params = {};
    params.type = 'ArticleLayer';
	var step = curr.page.data('StepManager').addStep(name, params, true);
	var article = $('<div class="article" defile="'+(params.defile?params.defile:"false")+'"></div>');
	var lh = config.sceneY(params.lh);
	article.css({'left':config.sceneX(params.x)+'px', 'top':config.sceneY(params.y)+'px', 
				 'width':config.sceneX(params.lw)+'px', 'height':config.sheight-config.sceneY(params.y)+'px',
				 'line-height':lh+'px'});
	var font = "";
	if(params.fweight) {
		font += params.fweight + ' ';
		article.css('font-weight', params.fweight);
	}
	if(!isNaN(params.fsize)) {
		font += params.fsize+'px ';
		article.css('font-size', config.sceneY(params.fsize)+'px');
	}
	if(params.font) {
		font += params.font;
		article.css('font-family', params.font);
	}
	if(params.color) article.css('color', params.color);
	if(params.align) article.css('text-align', params.align);
	
	// Content processing
	TextUtil.config(font);
	var maxM = Math.floor( params.lw/TextUtil.measure('A') );	

	var arr = content.split('\n');
	var sep = 0;
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].length == 0) { // Separator paragraph
			article.append('<div id="obj'+(curr.objId++)+'"/>');
			sep++;continue;
		}

		for(var j = 0; j < arr[i].length;) {
			// Find the index of next line
			var next = TextUtil.checkNextline(arr[i].substr(j), maxM, params.lw);
			article.append('<div id="obj'+(curr.objId++)+'"><p>'+arr[i].substr(j, next)+'</p></div>');
			j += next;
		}
	}
	// Content <p> params and functions: InsertAfter
	article.children('div').each(function() {
		$(this).css({'height':lh+'px'});
		$(this).selectable(selectP)
		       .staticButton('./images/UI/insertbelow.png', insertElemDialog)
		       .staticButton('./images/UI/addscript.jpg', addScriptForObj);
		$(this).children('.del_container').css({
			'position': 'relative',
			'top': ($(this).children('p').length == 0) ? '0%' : '-100%',
			'display':'none'});
	});
	
	// Listener to manipulate
	article.deletable().configurable();
	
	step.append(article);
}

function modifyZ() {
	var mod = $('<span><input type="number" value="'+$(this).html()+'" size="2"></input><input type="button" value="ok"></input></span>');
	$(this).replaceWith(mod);
	mod.find('input[type="button"]').click(function(){
		var expo = $(this).parents('.layer_expo');
		var zid = expo.find('input[type="number"]').val();
		// Modify layer's index
		var layer = expo.find('span:first').html();
		var page = curr.page.prop('id');
		layers[page][layer].css('z-index', zid);
		// Replace span with modified zid
		var res = $('<span>'+zid+'</span>');
		res.click(modifyZ);
		$(this).parent().replaceWith(res);
		// Resort expos
		var manager = managers[page].manager;
		var newExpo = expo.clone();
		expo.remove();
		addExpo(manager, newExpo);
	});
}

// Interaction with widget==============================

// Shape editor
function showShapeEditor() {
	// Trigger close event if center panel is showing up
	if($('#center_panel').css('display') == 'block')
		$('.central_tools:visible').find('.del_container img:first').click();
	$('.central_tools').hide();
	$('#menu_mask').show();
	$('#shapeTools').show();
	$('#editor').show();
	$('#editor').mousedown(startDraw).mouseup(cancelDraw).mousemove(drawing);
	$('body').mouseup(cancelDraw).mousemove(drawing);
}
// Text editor
function showTextEditor() {
	// Trigger close event if center panel is showing up
	if($('#center_panel').css('display') == 'block')
		$('.central_tools:visible').find('.del_container img:first').click();
	$('.central_tools').hide();
	$('#menu_mask').show();
	$('#textTools').show();
	$('#editor').show();
	$('#editor').click(textEditorClicked);
}
// Wiki editor
function addWikiCard(type) {
    var w = config.wikiWidth;
    var h = config.wikiHeight;
    var card = $('<div class="wiki_card"></div>');
    card.css({'width':w+'px', 'height':h+'px'});
    switch(type) {
    case 'generator':
        $('#editor').append(card);
        card.append('<img id="wiki_addDesc" src="./images/tools/wiki_addDescription.png" style="top:'+(1/7*h)+'px;height:'+(1/7*h)+'px;">');
        card.append('<img id="wiki_addImg" src="./images/tools/wiki_addImg.png" style="top:'+(3/8*h)+'px;height:'+(1/7*h)+'px;">');
        card.append('<input id="wiki_name" type="text" placeholder="Nom de wiki" style="top:'+(5/8*h)+'px;height:20px;">');
        card.append('<input id="save_wiki" type="button" value="Sauvegarder" style="top:'+(7/9*h)+'px;height:30px;">');
        $('#wiki_addDesc').click(function(){addWikiCard('description');});
        $('#wiki_addImg').click(function(){addWikiCard('image');});
        $('#save_wiki').click(saveWiki);
    break;
    case 'image':
        card.insertBefore('.wiki_card:last');
        card.deletable();
        var img = (new DropZone(dropImgToWikiCard, {'top':'20px','height':(h-90)+'px'}, "wikiImgInput")).jqObj;
        card.append(img);
        var legend = $('<input type="text" placeholder="legend" style="top:'+(h-45)+'px;height:20px;font-style:italic;">');
        legend.blur(function(){
            var value = $(this).val();
            var newlegend = $('<h5>'+value+'</h5>');
            newlegend.css({'top':(h-45)+'px'});
            $(this).replaceWith(newlegend);
            newlegend.editable();
        });
        card.append(legend);
    break;
    case 'description':
        card.insertBefore('.wiki_card:last');
        card.deletable();
        addSect = $('<input type="button" value="Nouvelle section" style="margin-top:10px;height:30px;">');
        card.append(addSect);
        addSect.click(addSectionDialog);
    break;
    }
    return card;
};
function showWikiEditor() {
    // Trigger close event if center panel is showing up
    if($('#center_panel').css('display') == 'block')
    	$('.central_tools:visible').find('.del_container img:first').click();
    $('#menu_mask').show();
    $('#wikiTools').show();
    $('#editor').css('overflow','auto').show();
    addWikiCard('generator');
};
function addSectionWiki(button, title, type, content) {
    if(!title) {
       alert('Information incomplete.'); 
       return false;
    }
    var font = $('#wiki_font').val();
    var fsize = config.sceneX($('#wiki_size').val());
    var fcolor = $('#wiki_color').val();
    var temp = '<h3>'+title+'</h3>';
    temp += '<div class="sepline"></div>';
    if(type == 'text') {
        if(!content) {
            alert('Information incomplete.');
            return false;
        }
        temp += '<h4>'+content+'</h4>';
    }
    else if(type == 'link') {
        if( content.match(/^\w+:\/(\/[\-\_\w\?\&\.]+)+/) ) {
            temp += '<img src="./images/UI/wikibutton.png" style="width:'+(config.wikiWidth*0.5)+'px;height:'+$('#wiki_size').val()+'px;left:20%;position:relative;" value="'+content+'">';
        }
        else {
            alert('Votre lien url n\'est pas correct.');
            return false;
        }
    }
    button.before(temp);
    button.prevAll().css({'font-family':font, 'font-size':fsize, 'color':fcolor});
    return true;
};
function saveWiki() {
    var name = $('#wiki_name').val();
    if(!name) {
        alert('Échec à sauvegarder, indiquez le nom de wiki s\'il vous plaît');
        return false;
    }
    // Trigger blur event to make legend valid
    $('#editor').find('input').blur();
    // Copy all in current step to src
    var cards = $('#editor').children('div:last-child').prevAll();
    if(cards.length == 0) return false;
    // Other parameters
    var font = $('#wiki_font').val();
    var fsize = $('#wiki_size').val();
    var fcolor = $('#wiki_color').val();
    var wiki = new Wiki(name, cards.clone(), font, fsize, fcolor);
    srcMgr.addSource('wiki', wiki, name);
    return true;
};

// WikiEditor Interaction
function dropImgToWikiCard(e) {
    e.stopPropagation();
    if($(this).hasClass('drop_zone')) $(this).css('border-style', 'dotted');
    else $(this).css('border-style', 'none');
    
    var id = e.dataTransfer.getData('Text');
    var data = srcMgr.getSource(id);
    var type = srcMgr.sourceType(id);
    // Verification
    if(!data || type != "image") return;
    
    var img = $('<img name="'+id+'" src="'+data+'" style="top:20px;">');
    img.get(0).addEventListener('dragover', DropZone.prototype.dragOverElemZone, false);
    img.get(0).addEventListener('dragleave', DropZone.prototype.dragLeaveElemZone, false);
    img.get(0).addEventListener('drop', dropImgToWikiCard, false);
    img.mouseup(DropZone.prototype.dragLeaveElemZone);
    // Append to elem zone
    $(this).replaceWith(img);
};


// Animation editor=====================================
function showAnimeEditor() {
    // Trigger close event if center panel is showing up
    if($('#center_panel').css('display') == 'block')
    	$('.central_tools:visible').find('.del_container img:first').click();
    $('#menu_mask').show();
    $('#animeTools').show();
    $('#editor').css('background', 'transparent');
    $('#editor').show();
    $('#timeline').show();
    
    // Interaction with drop zone
    var editor = $('#editor').get(0);
    editor.addEventListener('dragover', dragOverScene, false);
    editor.addEventListener('drop', dropToAnimeEditor, false);
    
    // Create new frame
    if($('#timeline .frameexpo').length == 0) $('#addFrame').click();
};
function showFrame(frame) {
    $('#editor').children().css('z-index', 1).removeClass('active');
    frame.css('z-index', 2).addClass('active');
};
function delFrame(e) {
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
};
function addFrame(interval, empty) {
    if(isNaN(interval) || interval <= 0) var interval = 0.5;
    var frameexpo = $('<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>'+interval+'</span>s</h5><div class="motion"/></div>');
    frameexpo.find('span').editable();
    // Set default transition
    frameexpo.children('div.motion').data('pos','2').data('size','2').data('opac','2').data('font','2');
    // Insert
    var expos = $('#addFrame').prevAll();
    if(expos.length == 0) $('#addFrame').before(frameexpo);
    else
        expos.each(function(){
            if($(this).hasClass('active')) $(this).after(frameexpo);
        });
    // Append frame in editor
    var frame = $('<div class="frame"></div>');
    $('#editor').append(frame);
    frameexpo.data('frame', frame);
    // Copy content in previous frame to the new frame
    var prev = frameexpo.prev();
    if(empty!==true && prev.length == 1) {
        var content = prev.data('frame').children().clone(true);
        content.find('.del_container').remove();
        content.find('canvas').parent().remove();
        content.each(function(){
            $(this).deletable().configurable({text:true,stroke:true}).hoverButton('./images/UI/recut.png', recutAnimeObj);
        });
        frame.append(content);
    }
    // Active function
    frameexpo.click(function(){
        $('#addFrame').prevAll().removeClass('active');
        $(this).addClass('active');
        showFrame($(this).data('frame'));
    }).click();
    // Deletable
    frameexpo.deletable(delFrame);
    return frameexpo;
};
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
};
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
};
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
};
function endRecut(e){
    if(tag.cutstarted) {
    	e.preventDefault();
    	e.stopPropagation();
    	tag.cutstarted = false;
    	curr.cutCtrlPt = prevState.cutX = prevState.cutY = null;
    }
};
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
    container.deletable().resizable().moveable().configurable({text:true,stroke:true});
    container.hoverButton('./images/UI/recut.png', recutAnimeObj);
};
function recutAnimeObj(e) {
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
};
function addAnimeObj(e, id, data) {
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
	container.resizable().moveable().configurable({text:true,stroke:true});
	// Recut the image
	container.hoverButton('./images/UI/recut.png', recutAnimeObj);

	$('#editor').children().each(function(){
	    if($(this).css('z-index') == '2')
	        $(this).append(container);
	});
};
function dropToAnimeEditor(e) {
    e.stopPropagation();
    var id = e.dataTransfer.getData('Text');
    var type = srcMgr.sourceType(id);
    if(!id || type != "image") return;
    var data = srcMgr.getSource(id);
    if(data == null) return;
    
    addAnimeObj(e, id, data);
};


// Active one label in the tab bar
function activeBarLabel() {
	if($(this).hasClass('add')) return;
	var name = $(this).html();
	var pagebar = $('#pageBar');
	pagebar.children('.active').removeClass('active');
	$(this).addClass('active');
	pagebar.children().each(function() {
		if(!$(this).hasClass('add'))
			pages[$(this).html()].css('z-index','1');
	});
	pages[name].css('z-index','2');
	curr.page = pages[name];
	
	// Active current step manager
	curr.page.data('StepManager').active();
	
	// Editable name
	//$(this).editable();
};

// Drag over
function dragOverScene(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	return false;
};
function dragOverExpo(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	$(this).css('border', '1px #4d4d4d solid');
	return false;
};
// Drag leave
function dragLeaveExpo(e) {
	$(this).css('border', 'none');
};
// Function drop to add Elem
function dropToScene(e) {
	e.stopPropagation();
	var id = e.dataTransfer.getData('Text');
	var type = srcMgr.sourceType(id);
	if(!id || type != "image") return;
	var data = srcMgr.getSource(id);
	if(data == null) return;
	addImageElem(id, data, curr.page, curr.step);
};
function dropToExpo(e) {
	e.stopPropagation();
	$(this).css('border', 'none');
	var id = e.dataTransfer.getData('Text');
	var type = srcMgr.sourceType(id);
	if(!id || type != "image") return;
	var data = srcMgr.getSource(id);
	if(data == null) return;
	
	// Find step
	var step = curr.page.data('StepManager').getStep($(this).data('stepN'));
	addImageElem(id, data, curr.page, step);
};

// Article interaction
// Select <p> elem
function selectP(e) {
	e.preventDefault();
	var elem = $(this);
	if(curr.choosed && curr.choosed != elem) {
		curr.choosed.css({'z-index':'0','background':'none'});
		curr.choosed.children('.del_container').css('display','none');
	}
	else if(curr.choosed == elem) return;
	
	elem.css({'z-index':'1','background':'#FFBA84'});
	elem.children('.del_container').css('display','block');
	curr.choosed = elem;
};
// Insert elems after <p>
function insertElemAfter(e) {
	insertElemDialog();
};

// Drop zone interaction
function dropToInsertZone(e) {
	e.stopPropagation();
	$(this).css('border-style', 'dotted');
	
	var id = e.dataTransfer.getData('Text');
	var data = srcMgr.getSource(id);
	var type = srcMgr.sourceType(id);
	// Verification
	if(!data || (type != "image" && type != "game")) return;
	// Append to elem zone
	$(this).append(srcMgr.getExpo(id));
};

// Select words to set link
function textSelected(e) {
    var sel = getSelection();
    var evt = e || window.event;
    // No selection
    if(sel.isCollapsed) return;
    // Select a link existed
    if(sel.focusNode.parentNode.nodeName.toLowerCase() == "span") {
        modifyLink(evt);
        return;
    }
    // Select multiple lines
    if(sel.anchorNode != sel.focusNode) return;
    
    curr.selectNode = $(sel.anchorNode.parentNode);
    curr.selectRange = sel.getRangeAt(0);
    // Popup
    showLinkSetter(evt);
};
// Modify a exist link
function modifyLink(e) {
    var evt = e || window.event;
    
    var tar = $(evt.target);
    var type = tar.attr('class');
    var link = tar.attr('link');
    if(!type || !link) return;
    switch(tar.attr('class')) {
    case "audiolink": 
        $('#linkType').attr('value', 'audio');
        $('#linkType').change();
        $('#audiolinkInput').attr('link', link).html('<img src="./images/UI/audio.png"></img>');
        break;
    case "wikilink": 
        $('#linkType').attr('value', 'wiki');
        $('#linkType').change();
        break;
    case "fblink": 
        $('#linkType').attr('value', 'fb');
        $('#linkType').change();
        $('#fblinkInput').attr('value', link);
        break;
    default: return;
    }
    curr.selectNode = tar;
    // Popup
    showLinkSetter(evt);
};
// Audio drop zone interaction
function dropToAudioElemZone(e) {
	e.stopPropagation();
	$(this).css('border-style', 'dotted');
	
	var id = e.dataTransfer.getData('Text');
	var type = srcMgr.sourceType(id);
	// Verification
	if(!id || (type != "audio")) return;
	// Place in the elem zone
	$(this).append(srcMgr.getExpo(id));
	$(this).attr('link', id);
};
// Wiki resource drop zone interaction
function dropToWikiElemZone(e) {
    e.stopPropagation();
    $(this).css('border-style', 'dotted');
    
    var id = e.dataTransfer.getData('Text');
    var type = srcMgr.sourceType(id);
    // Verification
    if(!id || (type != "wiki")) return;
    // Place in the elem zone
    $(this).append(srcMgr.getExpo(id));
    $(this).attr('link', id);
};




// Interaction with editor===============================

// Draw Rect
function startDraw(e) { // Mousedown
	tag.drawstarted = true;
	prevState.x = e.clientX;
	prevState.y = e.clientY;
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
	// Type
	$('#shapeTools img').each(function(id) {
		if($(this).hasClass('active')) {
			curr.shapeType = id;
			return false;
		}
	});
	
	switch(curr.shapeType) {
	case 0: case 1: // Rectangle
		curr.editing = $('<div class="rect"></div>');
		curr.editing.css({
			left:e.clientX-$('#editor').offset().left+'px', 
			top:e.clientY-$('#editor').offset().top+'px',
			width:'0px', height:'0px',
			background:fcolor, opacity:opac, 
			'border-color':scolor, 'border-width':weight+'px'
		});
		$('#editor').append(curr.editing);
		// Manip
		curr.editing.resizable().moveable().deletable();
		break;
	case 2: // Elipse
		break;
	case 3: // Line
		break;
	default:break;
	}
	if(radius != 0 && curr.shapeType == 1) {
		// Round radius to rect
		radius = radius+'px';
		curr.editing.css({'border-radius':radius, '-webkit-border-radius':radius, '-moz-border-radius':radius});
	}
}
function cancelDraw(e) { // Mouseup
	if(tag.drawstarted) {
		tag.drawstarted = false;
		if(curr.editing && (curr.editing.width() == 0 || curr.editing.height() == 0))
			curr.editing.remove();
		curr.editing = null;
	}
}
function drawing(e) { // Mousemove
	if(!tag.drawstarted || !curr.editing) return;
	switch(curr.shapeType) {
	case 0: case 1: // Rectangle
		var dx = e.clientX - prevState.x, dy = e.clientY - prevState.y;
		curr.editing.css({width:dx+'px',height:dy+'px'});
		break;
	case 2:break;
	case 3: // Line
		break;
	default:break;
	}
}


// Typing Text
function textEditorClicked(e) {
	if(this != e.target) return;
	if(curr.editing) {
		if(curr.editing.children('textarea').val() == "") curr.editing.remove();
	}
	
	curr.editing = $('<div class="text"><textarea row="2" cols="20" autofocus="true"></textarea></div>');
	curr.editing.css({
		left:e.clientX-$('#editor').offset().left+'px', 
		top:e.clientY-$('#editor').offset().top+'px'
	});
	// Param
	configChanged();
	$('#editor').append(curr.editing);
	curr.editing.moveable().selectable(function(){
		$(this).children('textarea').focus();
	}).deletable();
}
function configChanged(e) {
	if(!curr.editing) return;
	// Param
	var tcolor = $('#text_color').val();
	if(!isColor(tcolor)) tcolor = 'none';
	var font = $('#text_font').val();
	var size = $('#text_size').val();
	size = config.sceneY(isNaN(size) ? 16 : size);
	var style = $('#text_style').val();
	if(style == "normal") style = "";
	var align = $('#text_align').val();
	
	curr.editing.children('textarea').css({
		'text-align':align, 'font':style+' '+size+'px '+font, 
		'color':tcolor
	});
}


// Management of project =====================================

function saveToLocalStorage(name, jsonstr){
    // Save to localStorage
    localStorage.setItem(name, jsonstr);
    
    // Local storage saving management, locally store only 5 projects for example, manager all projects with a json array of their name
    var pjs = localStorage.getItem('projects');
    if(!pjs) pjs = [];
    else pjs = JSON.parse(pjs);
    var pjindex = $.inArray(name, pjs);
    // Exist already locally, slice from array and push it at the end
    if(pjindex >= 0) pjs.splice(pjindex, 1);
    pjs.push(name);
    // Too much projects in local, remove the oldest used project
    while(pjs.length > 5) {
        pjs.reverse();
        var pname = pjs.pop();
        pjs.reverse();
        localStorage.removeItem(pname);
    }
    // Restore locally
    localStorage.setItem('projects', JSON.stringify(pjs));
}

// save project
function saveProject() {
    if(!pjName) return;
    loading.show(5000);
    // Save ressources
    srcMgr.uploadSrc('upload_src.php', pjName);
    scriptMgr.upload('upload_src.php', pjName);

    // Save structure
    var serializer = new XMLSerializer();
    // Replace img src with relative Path on server
    var imgids = srcMgr.getImgSrcIDs();
    for(var i in imgids) {
        $(".scene img[name='"+imgids[i]+"']").attr('src', srcMgr.getSource(imgids[i]));
    }
    // Save Pages
    var struct = {};
    for(var key in pages) {
        struct[key] = {};
        steps = managers[key].steps;
        for(var i in steps) {
            var step = steps[i].clone();
            step.find('.del_container, .ctrl_pt').remove();
            struct[key][step.prop('id')] = serializer.serializeToString(step.get(0));
        }
    }
    var structStr = JSON.stringify(struct);
    
	// Upload structure to server
	$.post("save_project.php", {"pj":pjName, "struct":structStr, "objCurrId":curr.objId, "srcCurrId":srcMgr.currId}, function(msg){
	       var modif = parseInt(msg);
	       if(!isNaN(modif)) curr.lastModif = modif;
	       else if(msg != "") alert(msg);
	       
	       // Save local storage
	       if(!localStorage) return;
	       var pjsave = {};
	       // Save Obj CurrID
	       pjsave.objCurrId = curr.objId;
	       // Save Pages
	       pjsave.pageSeri = struct;
	       // Save sources
	       pjsave.sources = srcMgr.sources;
	       pjsave.srcCurrId = srcMgr.currId;
	       // Save scripts
	       pjsave.scripts = scriptMgr.saveLocal();
	       // Save modify time
	       pjsave.lastModif = curr.lastModif;
	       var pjsavestr = JSON.stringify(pjsave);
	       
	       saveToLocalStorage(pjName, pjsavestr);
	       loading.hide();
	   });
}