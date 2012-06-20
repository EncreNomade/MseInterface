var pages = {};
var managers = {};
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
	window.shapeTool = initShapeTool();
	window.textTool = initTextTool();
	window.wikiTool = initWikiTool();
	window.animeTool = initAnimeTool();
	window.scriptTool = initScriptTool();
	
	// Mouse event handler for the resize behavior
	$('body').supportResize();
	$('body').supportMove(); 
	
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
            var linkType = false, target = false;
	        switch(type) {
	        case "audio":
	            var link = $('#audiolinkInput').attr('link');
	            if(link && srcMgr.isExist(link)) {
                        linkType = 'audiolink';
	            }
	            break;
	        case "wiki":
	            var link = $('#wikilinkInput').attr('link');
	            if(link && srcMgr.isExist(link)) {
                        linkType = 'wikilink';
	            }
	            break;
	        case "fb":
	            var link = $('#fblinkInput').val();
	            if(link && link.toLowerCase().match(/[\w\W]*www\.facebook\.com\/[\w\W]*/)) {
                        linkType = 'wikilink';
	            }
	            break;
	        }
            if(linkType) CommandMgr.executeCmd(new ModifyLinkCmd(linkType, link));
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
	        if(linkedStr) 
                CommandMgr.executeCmd(new AddTextLinkCmd(nodeHtml, selStr, linkedStr));
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
            CommandMgr.executeCmd(new AddSrcCmd('image', link));
            dialog.close();
        }
        else if(link.search(audpattern) != -1) {
            CommandMgr.executeCmd(new AddSrcCmd('audio', link));
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
		if(!name || !nameValidation(name) || pages[name]) {
		    dialog.showAlert('Nom choisi invalid ou nom existe déjà');
		    return;
		}
		var page = CommandMgr.executeCmd(new AddPageCmd(name));
		// Add default step
		var mgr = page.data('StepManager');
		mgr.addStep(name+'default', null, true);
		dialog.close();
	});
};

// edite speack dialog
function editeSpeakDialog( speak ){
			//  search the asoociate speaker
			var speaker = speak.attr( "data-who" );
			for( var i in srcMgr.sources )
				if( srcMgr.sourceType( i ) == "speaker" && srcMgr.getSource( i ).name == speaker )
					break;
			var spkObj = srcMgr.getSource( i );
			
			// setUp the list of moods
			var map = spkObj.portrait;
			var comboBox = $( '<div style="width:100px;height:180px;overflow-y:auto;">' );
			for( var i in map ){
				var option = $( '<div style="background:none;"><img src="' +  spkObj.getMoodUrl( i ) + '" width:"30" height="30" style="width:30px; height:30px;"/>'+i+'</div>' );
				option.click( function( e ){
					var mood = $( e.currentTarget ).text();
					speak.attr( "data-mood" , mood );
					speak.children( 'img' ).attr( "src" , spkObj.getMoodUrl( mood ) );
					
					updateHightlight( mood );
				});
				comboBox.append( option );
			}
			updateHightlight( speak.attr( "data-mood") );
			
			function updateHightlight( mood ){
				var c = comboBox.find( "div" );
				for( var i =0 ; i < c.length ; i ++  ){
					var option = $( c[ i ] );
					if( option.text() == mood )
						option.css( "background" , "blue" );
					else
						option.css( "background" , "none" );
				}
			}
			
			dialog.showPopup('éditer interlocuteur', 340, 250 , "ok");
			dialog.main.append( comboBox  );
			
			
			var initialMood = speak.attr("data-mood" );
			dialog.confirm.click(function() {
				var actualMood = speak.attr("data-mood" );
				if( initialMood != actualMood )
					CommandMgr.executeCmd( new ModifySpeakMoodCmd( speak , initialMood  , actualMood , spkObj.getMoodUrl( initialMood ) , spkObj.getMoodUrl( actualMood )  ) );
				
				dialog.close();
			});
			dialog.annuler.click(function() {
				var actualMood = speak.attr("data-mood" );
				if( initialMood != actualMood ){
					speak.attr( "data-mood" , initialMood );
					speak.children( 'img' ).attr( "src" , spkObj.getMoodUrl( initialMood ) );
				}
			});
		}
		

// Add step dialog
function createStepDialog() {
	dialog.showPopup('Ajouter un nouveau étape', 340, 200);
	// Name and Z-index
	var nz = $('<p><label>Nom:</label><input id="stepName" size="10" type="text"></p>');
	dialog.main.append(nz);
	// Differente type of Step
	dialog.main.append('<div style="position:relative;left:60px;top:15px"><div id="normalStep" class="big_button">Normal</div><div id="article" class="big_button">Article</div></div>');
	
	$('#normalStep, #article').click(function() {
		var params = {};
		var name = $('#stepName').val();
		
		if(!name || !nameValidation(name) || stepExist(name)) {
			dialog.showAlert('Nom choisi invalid ou nom existe déjà');
			return;
		}
		
		if(this == $('#normalStep').get(0)) {
		    if(curr.page)
		        CommandMgr.executeCmd(new AddStepCmd(curr.page.data('StepManager'), name, params));
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
			$('#articleContent').animate({backgroundColor: "#fb4e4e"}, 800)
			                    .animate({backgroundColor: "#fff"}, 800);
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
		
		CommandMgr.executeCmd(new AddArticleCmd(curr.page.data('StepManager'), name, params, content));
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
                CommandMgr.executeCmd(new ConfigObjCmd(obj, res));
		dialog.close();
	});
}


// Insert obj in Article dialog
function insertElemDialog(e) {
	dialog.showPopup('Inserer les éléments dans l\'article', 400, 300, 'Inserer', $(this).parent().parent());
	// show ressource panel
	$('#bottom').css('z-index','110');
	dialog.annuler.click(closeBottom);
	// Insert Zone
	var insert = $('<div class="insert_cont"></div>');
	// Drop zone
	var dzone = (new DropZone(dropToInsertZone, {'left':'0px','width':'240px','height':'140px','position':'absolute'})).jqObj;
	var tzone = $('<textarea class="insert_text"/>');
	insert.append(dzone).append(tzone);
	var typebn = $('<img class="insert_type_bn" src="./images/UI/text.jpg">');
	dialog.main.append(insert);
	dialog.main.append(typebn);
	typebn.click(function(){
	    var left = dzone.position().left;
	    if(left == 0) {
	        this.src = "./images/UI/srcs.jpg";
	        dzone.animate({'left':'-280px'}, 500, 'swing');
	        tzone.animate({'left':'0px'}, 500, 'swing');
	    }
	    else if(left == -280) {
	        this.src = "./images/UI/text.jpg";
	        dzone.animate({'left':'0px'}, 500, 'swing');
	        tzone.animate({'left':'280px'}, 500, 'swing');
	    }
	});
	
	dialog.confirm.click(function() {
	    closeBottom();
	    var last = dialog.caller;
		var prepared = dzone.children();
		for(var i = prepared.length-1; i >= 0; i--) {
			var id = $(prepared.get(i)).data('srcId');
			var elem = srcMgr.generateChildDomElem(id, dialog.caller.parent());
			elem.attr('id', 'obj'+(curr.objId++));
			elem.deletable(null, true)
			    .selectable(selectP)
			    .staticButton('./images/UI/insertbelow.png', insertElemDialog)
			    .staticButton('./images/UI/config.png', staticConfig)
			    .staticButton('./images/tools/anime.png', animeTool.animateObj)
			    .staticButton('./images/UI/addscript.jpg', addScriptForObj)
			    .children('.del_container').hide();
			elem.insertAfter(last);
			last = elem;
		}
		var text = tzone.val();
		if(text && text != "") {
		    var font = dialog.caller.css('font-weight');
		    font += " "+dialog.caller.css('font-size');
		    font += " "+dialog.caller.css('font-family');
		    last.after(generateSpeaks(text, font, dialog.caller.width(), dialog.caller.height()));
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
    dialog.confirm.click({sourceId: srcid, sourceType: srcType},validScript);
    
    
    if (src.data('scriptsList') && src.data('scriptsList').length > 0){
        var modifyScriptsButton = dialog.addButton($('<input type="button" value="Modifier les scripts existants"></input>'));
        modifyScriptsButton.click(function(){ modifyScriptDialog(src.data('scriptsList')); });
    }
};
// Modify a script related to an obj
function modifyScriptDialog(scriptsList, defaultScript) {
    if (typeof(defaultScript) === 'undefined') defaultScript = scriptsList[0];
    dialog.showPopup('Modifier les scripts',400, 410,'Modifier');
    
    var select = '<p><label>Choix du script:</label><select id="script_name">';
    for(var i = 0; i<scriptsList.length; i++) {
         select += '<option value="'+scriptsList[i]+'"';
         if (scriptsList[i] == defaultScript) select += ' selected ';
         select += '>'+scriptsList[i]+'</option>';
    }
       
    select += '</select></p>';
    dialog.main.append(select);
    $('#script_name').parent().css('font-weight', 'bold');
    $('#script_name').change({script: scriptsList},function(e){
        modifyScriptDialog(e.data.script, $(this).val());
    });
    
    var choosedScript = $('#script_name').val();
    var checkbox = '<p><label>Ajout automatique:</label><input id="ajout_auto" type="checkbox" style="margin-top:12px;"';
    if(scriptMgr.scripts[choosedScript].immediate) checkbox += ' checked ';
    checkbox += '</p>';
    dialog.main.append(checkbox);
    
    
    var relatedAction = scriptMgr.scripts[choosedScript].action;
    var relatedReaction = scriptMgr.scripts[choosedScript].reaction;
    var srcid = scriptMgr.scripts[$('#script_name').val()].src;
    var srcType = scriptMgr.scripts[$('#script_name').val()].srcType;
    dialog.main.append('<p><label>Action:</label>'+scriptMgr.actionSelectList('script_action', srcType, relatedAction)+'</p>');
    dialog.main.append('<p><label>Réaction:</label>'+scriptMgr.reactionList('script_reaction', relatedReaction)+'</p>');
    dialog.main.append('<p><label>Cible de réaction:</label></p>');
    $('#script_reaction').change(tarDynamic).blur(tarDynamic).change();
    
    var delScriptButton = dialog.addButton($('<input type="button" value="Supprimer" />'));
    delScriptButton.click(function(){
        var scriptName = $('#script_name').val();
        var srcType = scriptMgr.scripts[$('#script_name').val()].srcType;        
        if ($('#script_name').children().length > 1){
            $('#script_name').children().remove('[value="'+scriptName+'"]');
            scriptMgr.delScript(scriptName);
        }
        else { // When delete the last script --> return on addScriptDialog
            var src;
            switch(srcType) {
                case "obj": src = $('#' + scriptMgr.scripts[$('#script_name').val()].src);
                    break;
                case "page" : src =  $('#pageBar .active');
                    break;
                case "anime": src = srcMgr.expos[scriptMgr.scripts[$('#script_name').val()].src];
                    break;
            }
            CommandMgr.executeCmd(new DelScriptCmd(scriptName));
            addScriptDialog(src, srcType);            
        }
    });
    var addScriptButton = dialog.addButton($('<input type="button" value="Nouveau script"></input>'));
    addScriptButton.click(function(){
        dialog.close(); 
        var srcType = scriptMgr.scripts[$('#script_name').val()].srcType;
        var src;
        switch(srcType) {
            case "obj": src = $('#' + scriptMgr.scripts[$('#script_name').val()].src);
                break;
            case "page" : src =  $('#pageBar .active');
                break;
            case "anime": src = srcMgr.expos[scriptMgr.scripts[$('#script_name').val()].src];
                break;
        }
        addScriptDialog(src, srcType);
    });
    
    
    dialog.confirm.click({sourceId: srcid, sourceType: srcType},validScript)
}

function validScript(e){
    var srcid = e.data.sourceId;
    var srcType = e.data.sourceType;
    var ajoutAuto = $('#ajout_auto').get(0).checked;
    var name = $('#script_name').val();
    var action = $('#script_action').val();
    var reaction = $('#script_reaction').val();
    if(!name || !nameValidation(name) || action == "" || reaction == ""){
        alert('Information invalid');
        return;
    }

    var tarType = scriptMgr.reactionTarget(reaction);
    var tar = null, supp = null;
    switch(tarType) {
    case "page": case "script": 
        tar = $('#script_tar').val();break;
    case "obj": 
        if($('#script_supp').children().length==0) {alert('Information incomplete');return;}
        tar = $('#script_tar').data('chooser').val();
        supp = $('#script_supp').attr('target');
        break;
    case "cursor":
        tar = $('#script_tar').val();
        if(tar == "autre") supp = $('#script_supp').attr('target');
        break;
    case "anime": case "image": case "game": case "audio": case "code":
        tar = $('#script_tar').attr('target');
        break;
    case "effetname": default:break;
    }
    if(tarType != 'effetname' && (!tar || tar == "")) {
        alert('Information incomplete');return;
    }
    
    if (scriptMgr.scripts[name]) {
        if(!confirm('Vous allez remplacer le script "'+name+'".')) return;
        CommandMgr.executeCmd(new ModifyScriptCmd(name, srcid, srcType, action, tar, reaction, ajoutAuto, supp));
    }
    else CommandMgr.executeCmd(new AddScriptCmd(name, srcid, srcType, action, tar, reaction, ajoutAuto, supp));
    closeBottom();
    dialog.close();
}
    
var closeBottom = function() {
	$('#bottom').css('z-index','6');
};
function tarDynamic(e) {
    if ($('#script_name').is('select')) var choosedScript = $('#script_name').val();
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
            select += '<option value="'+$(this).prop('id')+'"';
            if(typeof(choosedScript) !== 'undefined' && scriptMgr.scripts[choosedScript].target == $(this).prop('id'))
                select += ' selected '; // prise en compte de la selection précédente
            select += '>'+$(this).prop('id')+'</option>';
        });
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
        if (typeof(choosedScript) !== 'undefined' && scriptMgr.scripts[choosedScript].reaction == "objTrans") {
            var choosedTarget = scriptMgr.scripts[choosedScript].target;
            $('#script_tar').children('h5').text(choosedTarget);
            dz.html(srcMgr.getExpo(scriptMgr.scripts[choosedScript].supp));
        }
        
        // show ressource panel
        $('#bottom').css('z-index','110');
        break;
    case "cursor":
        var choosedCursor = false;
        if (typeof(choosedScript) !== 'undefined') choosedCursor = scriptMgr.scripts[choosedScript].target;
        cible.append(scriptMgr.cursorSelectList('script_tar', choosedCursor));
        $('#script_tar').change(function(){
            if($(this).val() == "autre") {
                // show ressource panel
                $('#bottom').css('z-index','110');
                var supp = $('<p><label>Cursor personalisé</label></p>');
                var dz = (new DropZone(dropToTargetZone, {'margin':'0px','padding':'0px','width':'60px','height':'60px'}, "script_supp")).jqObj;
                dz.data('type', "image");
                $('.popup_body p:eq(4)').after(supp.append(dz));
                if (typeof(choosedScript) !== 'undefined') dz.html(srcMgr.getExpo(scriptMgr.scripts[choosedScript].supp));
            }
            else {
                closeBottom();
                $('.popup_body p:eq(4)').nextAll().remove();
            }
        });
        if (choosedCursor == 'autre') $('#script_tar').change() //trigger for display the choosed cursor if it's "autre"
        break;
    case "anime":
    case "image":
    case "game":
    case "audio":
    case "code":
        // show ressource panel
        $('#bottom').css('z-index','110');
        var dz = (new DropZone(dropToTargetZone, {'margin':'0px','padding':'0px','width':'60px','height':'60px'}, "script_tar")).jqObj;
        dz.data('type', type);
        cible.append(dz);
        if (typeof(choosedScript) !== 'undefined')
            dz.html(srcMgr.getExpo(scriptMgr.scripts[choosedScript].target));
        break;
    case "script":
        cible.append(scriptMgr.scriptSelectList('script_tar', choosedScript));
        break;
    case "effetname": default:break;
    }
};
// Drop event for all type of target
function dropToTargetZone(e) {
    e = e.originalEvent;
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
	CommandMgr.executeCmd(new AddSrcCmd('image', evt.target.result));
};
function addAudioSrc(evt) {
    CommandMgr.executeCmd(new AddSrcCmd('audio', evt.target.result));
};
function addJsSrc(evt) {
    // No game class name, can't add a game
    if(!curr.gamename) return;
    var content = evt.target.result;
    var name = curr.gamename;
    var exp = "/"+name+"\\s*=\\s*function/";
    if(content.search(eval(exp)) >= 0) {
        CommandMgr.executeCmd(new AddSrcCmd('game', content, name));
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

    defineZ(step, container);

    // Listener to manipulate
    // Choose Resize Move
    container.resizable().moveable().configurable({text:true,stroke:true}).hoverButton('./images/UI/addscript.jpg', addScriptForObj);
    container.canGoDown();

//    step.append(container);
    CommandMgr.executeCmd(new CreateElemCmd(step, container));
}

function addPage(name) {
	var page = $('<div id="'+name+'" class="scene"></div>');
	page.width(config.swidth).height(config.sheight);
	$('#center_panel').append(page);
	pages[name] = page;
	
	// Add step manager
	page.addStepManager();
	// DnD listenerts to add Elements
	page.bind('dragover', dragOverScene).bind('drop', dropToScene);

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
	return page;
};
function delPage(name) {
    // Delete in labelbar
    $('#pageBar li').each(function() {
        if($(this).text() == name) {
            $(this).remove();
            return;
        }
    });
    // Delete step manager in dom
    pages[name].data("StepManager").remove();
    // Delete in dom
    pages[name].remove();
    // Delete in pages
    delete pages[name];
    // Active another page
    $('#pageBar li:first-child').click();
};
function delCurrentPage() {
    // Check number of the pages
    if($('.scene').length <= 1 || curr.page == null) {
        alert("Échec, il rest qu'une page ou pas de page activé.");
        return;
    }
    
    var name = curr.page.prop('id');
    CommandMgr.executeCmd(new DelPageCmd(name));
};

function staticConfig(e){e.preventDefault();e.stopPropagation();showParameter($(this).parent().parent());}

// parse the raw texte,  match the speaker balise
//use generateLines for creating object containing one text line, 
function generateSpeaks(content, font, width, lineHeight){
	
	var res = $("<div/>");
	var rest = content;
	var balise ;
	while( balise || ( balise=getNextBalise(rest) ) ){
		
		// delete the \n just before the balise ( or before with space between )
		var j = 1;
		for( ; rest.charAt( balise.start - j ) == " " ; j ++ );
		if( rest.charAt( balise.start - j ) == "\n" )
			balise.start -= j;
			
		//everything before the balise is normal text
		var normalText = rest.substring( 0 , balise.start );
		rest = rest.substring( balise.close );
		
		// check the next balise 
		var nbalise = getNextBalise( rest );
		var dialogueText;
		
		// if the next balise is a closing one
		if( nbalise && nbalise.endBalise ){
			// the speaked text end at the start of the closing balise
			dialogueText = rest.substring( 0 , nbalise.start );
			rest = rest.substring( nbalise.close );
			nbalise = null;
		} else {
			// if its not, the spearker text end at the next \n
			var alinea = rest.indexOf( "\n" );
			if( alinea == -1 )
				alinea = rest.length;
			// if another speaking balise ( which is not a closing one ) is before the \n
			if( nbalise && nbalise.start <  alinea ){
				// the speaker text end at the start of the other balise ( instead of the next \n )
				alinea = nbalise.start - 1;
				dialogueText = rest.substring( 0 , nbalise.start );
			} else
				dialogueText = rest.substring( 0 , alinea );
			rest = rest.substring( alinea+1 );
			// update the next balise we have checked, we dont have to recalculate it for the next loop
			if( nbalise ){
				nbalise.start -= alinea+1;
				nbalise.close -= alinea+1;
			}
		}
		
		// automaticly add the linked ressource speaker
		var alreadyExist = false;
		var id_ressource;
		for( var i in srcMgr.sources )
			if( srcMgr.sourceType( i ) == "speaker" && srcMgr.getSource( i ).name == balise.id ){
				alreadyExist = true;
				id_ressource = i;
				break;
			}
		if( !alreadyExist )
			id_ressource = srcMgr.addSource( "speaker" , new Speaker( balise.id ) );
		// and the mood
		var mood = balise.param ? balise.param : "neutre";
		var data = srcMgr.getSource( id_ressource );
		if( !data.hasMood( mood ) )
				data.addMood( mood );
		
		// append the textLine object
		if( normalText.length > 0 )
			res.append( generateLines(  normalText , font, width, lineHeight) );	
		if( dialogueText.length > 0 ){
			var id = "obj"+(curr.objId++);
			var lines = generateSpeakLines( dialogueText, font, width, lineHeight , id );
			res.append( $('<div id="'+ id +'" class="speaker" data-who="'+balise.id+'" data-mood="'+mood+'" />').append( lines ) );	
		}
		
		
		
		
		// for the next loop, we dont want to calculate it twice
		if( nbalise ) 
			balise = nbalise;
		else
			balise = null;
	}
	if( rest.length > 0 )
		res.append( generateLines( rest , font, width, lineHeight) );
	return res.children();
	
	// setUp the speak formate with img associate
	function generateSpeakLines( content, font, width, lineHeight, id ){
		
		var decalage = 50;
		var nline = 3;
		
		
		var first = generateLines( content , font, width - decalage , lineHeight );
		first.css("left" , decalage+"px" );
		first.css("width" , (width - decalage)+"px" );
		first.css("position" , "relative" );
		var rest = "";
		first.children().slice( nline ).each( function( n , i ){ rest += $(i).text(); } );
		first = first.slice( 0 , nline );
		var last = generateLines( rest , font, width , lineHeight );
		var res = $("<div>");
		var img;
		var d = first.length * lineHeight;
		img = $( '<img src="'+ srcMgr.getSource( id_ressource ).getMoodUrl( balise.param ) +'" width="'+d+'" height="'+d+'" style="width:'+d+'px;height:'+d+'px;display:inline-block;" />' );
		img.css( "position" , "absolute" );
		img.css( "left" , ( ( decalage - d ) / 2 )+"px" );
		
		res.append( img );
		res.append( first );
		res.append( last  );
		
		
		
		img.click( function(e){
			editeSpeakDialog( $( e.currentTarget ).parent() );
		});
		
		return res.children();
	}
	function getNextBalise( rest ){
		// match [ <string> : <string> ]
		var regEx = /\[( *[a-z0-9]* *( *: *[a-z0-9]* *)?)\]/i;
		var regExEnd = /^(end|fin|\/.*)$/;
		var next = 0;
		var id , param;
		if( ( next = rest.search( regEx )  ) != -1 ){
			var close = rest.indexOf( "]" , next );
			var separator = next+1;
			for( ; separator < close && rest.charAt( separator ) != ":" ; separator ++ );
			id = rest.substring( next+1 , separator ).replace( / */g , "" ).toLowerCase();
			if( separator != close )
			param = rest.substring( separator+1 , close ).replace( / */g , "" ).toLowerCase();
			return { start : next  , close: close+1 , id:id, param:param , endBalise: regExEnd.test( id ) };
		}
		return null;
	}
}
function generateLines(content, font, width, lineHeight){
    var res = '';
    // Content processing
	TextUtil.config(font);
	var maxM = Math.floor( width/TextUtil.measure('A') );	

	var arr = content.split('\n');
	var sep = 0;
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].length == 0) { // Separator paragraph
			res += '<div id="obj'+(curr.objId++)+'" class="textLine"/>';
			sep++;continue;
		}

		for(var j = 0; j < arr[i].length;) {
			// Find the index of next line
			var next = TextUtil.checkNextline(arr[i].substr(j), maxM, width);
			res += '<div id="obj'+(curr.objId++)+'" class="textLine"><p>'+arr[i].substr(j, next)+'</p></div>';
			j += next;
		}
	}
	res = $(res);
	res.each(function() {
		$(this).height(lineHeight);
		$(this).deletable(null, true)
		       .selectable(selectP)
		       .staticButton('./images/UI/insertbelow.png', insertElemDialog)
		       .staticButton('./images/UI/config.png', staticConfig)
		       .staticButton('./images/tools/anime.png', animeTool.animateObj)
		       .staticButton('./images/UI/addscript.jpg', addScriptForObj);
		$(this).children('.del_container').css({
			'position': 'relative',
			'top': ($(this).children('p').length == 0) ? '0%' : '-100%',
			'display':'none'});
	});
	return res;
}
function addArticle(manager, name, params, content) {
    if(!params) params = {};
    params.type = 'ArticleLayer';
	var step = manager.addStep(name, params, true);
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
	
	article.append(generateSpeaks(content, font, params.lw, params.lh));
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

function defineZ(step, obj) {
	var maxZ = 0;
	for(var i=0; i<step.children().length; i++) {
		if (parseInt($(step.children()[i]).css('z-index')) > maxZ) 
			maxZ =  parseInt($(step.children()[i]).css('z-index'));
	}
	obj.css('z-index', maxZ+1);
}



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
    e = e.originalEvent;
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	return false;
};
function dragOverExpo(e) {
    e = e.originalEvent;
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
    e = e.originalEvent;
	e.stopPropagation();
	var id = e.dataTransfer.getData('Text');
	var type = srcMgr.sourceType(id);
	if(!id || type != "image") return;
	var data = srcMgr.getSource(id);
	if(data == null) return;
	addImageElem(id, data, curr.page, curr.step);
};
function dropToExpo(e) {
    e = e.originalEvent;
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
    e = e.originalEvent;
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
    e = e.originalEvent;
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
    e = e.originalEvent;
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
    // Clear server ressources
    //$.get('clearSrcs.php', {'pj':pjName}, function(msg){if(msg != "") alert(msg);});
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
			step.find('.selected').removeClass('selected');
            struct[key][step.prop('id')] = serializer.serializeToString(step.get(0));
        }
    }
    var structStr = JSON.stringify(struct);
    
	// Upload structure to server
	$.post("save_project.php", {"pj":pjName, "struct":structStr, "objCurrId":curr.objId, "srcCurrId":srcMgr.currId}, function(msg){
	       var modif = parseInt(msg);
	       if(!isNaN(modif)) curr.lastModif = modif;
	       else if(msg != ""){
				console.log( msg );
				alert(msg);
			}
	       
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
