<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

header("content-type:text/html; charset=utf8");
include 'project.php';
include 'dbconn.php';

session_start();
if( !isset($_SESSION['uid']) )
    header("Location: index.php", true);
else if( $_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists("pjName", $_GET) ) {
    // Pj existance in session check
    $pjName = $_GET["pjName"];
    if(array_key_exists($pjName, $_SESSION)){
        $pj = $_SESSION[$pjName];
    }
    else {
        header("Location: index.php", true);
    }
}
else header("Location: index.php", true);

?>

<!DOCTYPE html>
<html>
<head>
  <title>Interface d'édition</title>

<script src="./javascript/support/jquery-latest.js"></script>
<script src="./javascript/tools.js"></script>
<script src="./javascript/interface.js"></script>

<link rel="stylesheet" type="text/css" href="./stylesheets/menu.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/interface.css" />

</head>
<body>

<nav class="menu">
	<li><a href="#">Projet</a>
		<ul>
			<li><a id="newProjet">Nouveau projet</a></li>
			<li><a id="saveProjet">Sauvegarder projet</a></li>
			<li><a id="showProjet">Visualiser le livre (sauvegardez d'abord)</a></li>
		</ul>
	</li>
	<li><a href="#">Page</a>
		<ul>
			<li><a id="createPage">Nouvelle page</a></li>
			<li><a id="removePage">Supprimer la page activée</a></li>
			<li><a id="gestionPage">Modifier les relations</a></li>
		</ul>
	</li>
	<li><a href="#">Étape</a>
		<ul>
			<li><a id="newCalque">Nouvelle étape</a></li>
		</ul>
	</li>
	<li class="id">Connexion</li>
	<div id="menu_mask"></div>
</nav>
<ul id="tools">
	<li id="texticon"><img src="./images/tools/pen.png"></img></li>
	<li id="recticon"><img src="./images/tools/rule.png"></img></li>
	<li id="wikiicon"><img src="./images/tools/wiki.png"></img></li>
	<li id="animeicon"><img src="./images/tools/anime.png"></img></li>
	<li id="scripticon"><img src="./images/UI/addscript.jpg"></img></li>
</ul>

<div id="center_panel">
	<ul id="pageBar" class="tabBar">
		<li id="newPage" class="add">+</li>
	</ul>
	<ul id="shapeTools" class="central_tools">
		<li><img class="active" src="./images/tools/rect.png"></li>
		<li><img src="./images/tools/rrect.png"></li>
		<li><img src="./images/tools/elips.png"></li>
		<li><img src="./images/tools/line.png"></li>
		<li><img src="./images/tools/sep.png"></li>
		<li><h5>Paramètres:</h5></li>
		<li><h5>Poids</h5><input id="shape_weight" style="width: 22px;" value="0" type="number"></li>
		<li><h5>Radius</h5><input id="shape_radius" style="width: 22px;" value="0" type="number"></li>
		<li><h5>Opaque</h5><input id="shape_opac" style="width: 32px;" value="100" min="0" max="100" step="1" type="number"></li>
		<li><h5>Rempli</h5><input id="shape_fill" size="5" value="#000" type="color"></li>
		<li><h5>Trait</h5><input id="shape_stroke" size="5" type="color"></li>
	</ul>
	<ul id="textTools" class="central_tools">
		<li><h5>Paramètres:</h5></li>
		<li><h5>Color</h5><input id="text_color" size="5" value="#000" type="color"></li>
		<li><h5>Police</h5><input id="text_font" size="5" type="text"></li>
		<li><h5>Taille</h5><input id="text_size" style="width: 28px;" value="16" type="number"><span>px</span></li>
		<li><h5>Style</h5><select id="text_style">
			<option value="normal">normal</option>
			<option value="bold">gras</option>
			<option value="italic">italique</option></select>
		</li>
		<li><h5>Align</h5><select id="text_align">
			<option value="left">left</option>
			<option value="center">center</option>
			<option value="right">right</option></select>
		</li>
	</ul>
	<ul id="wikiTools" class="central_tools">
		<li><h5>Paramètres:</h5></li>
		<li><h5>Color</h5><input id="wiki_color" size="5" value="#000" type="color"></li>
		<li><h5>Police</h5><input id="wiki_font" size="5" type="text" value="Arial"></li>
		<li><h5>Taille</h5><input id="wiki_size" style="width: 28px;" value="14" type="number"><span>px</span></li>
	</ul>
	<ul id="animeTools" class="central_tools">
		<li><h5>Paramètres: </h5></li>
		<li><h5>Bloquant:</h5><input id="animeBlock" type="checkbox" checked="true"></li>
		<li><h5>Boucle:</h5><input id="animeRepeat" style="width: 28px;" type="number" value="1"></li>
		<li><h5>Nom:</h5><input id="animeName" size="5" type="text"></li>
		<li><input type="button" id="createAnime" value="Sauvegarder"></input></li>
	</ul>
	<ul id="scriptTool" class="central_tools">
	    <li><h5>Extraire objet: </h5></li>
	    <li><h5>Nom:</h5><input id="code_name" size="5" type="text"></li>
	    <li><input id="code_save" type="button" value="Sauvegarder" /></li>
	</ul>
	<canvas id="rulerX" class="ruler"></canvas>
	<canvas id="rulerY" class="ruler"></canvas>
	
	<div id="editor"></div>
</div>

<div id="timeline">
    <img id="addFrame" src="./images/UI/addframe.png">
</div>

<div id="right">
<div id="right_panel">
</div>
</div>

<div id="bottom">
<div id="bottom_panel">
	<ul class="tabBar">
		<li class="active">Ressources</li>
		<li class="add">⋁</li>
	</ul>

	<div id="Ressources" class="source">
		<img id="srcAdd" class="icon_src" src="./images/UI/plus.png"></img>
	</div>
</div>
</div>

<div id="linkSetter">
    <div id="linkSetterAnchor"></div>
    <h5>Type de lien:</h5>
    <select id="linkType">
        <option value="audio">Audio</option>
        <option value="wiki">Wiki</option>
        <option value="fb">Facebook</option>
    </select>
    <input id="addLinkBn" type="button" value="Ajouter ce lien" style="position:absolute;left:60px;top:120px;"/>
</div>


<script type="text/javascript">
	
	$('#center_panel.tabBar li').click(activeBarLabel);
	
	$('#newPage, #createPage').click(createPageDialog);
	$('#removePage').click(delCurrentPage);
	$('#newCalque').click(createStepDialog);
	
	$('#srcAdd').click(addFileDialog);
	$('#saveProjet').click(saveProject);
	
	<?php
	    print("var pjName = '".$pj->getName()."';");
	    print("var imgPath = '".$pj->getSrcSavePath("image")."';");
	    print("var audPath = '".$pj->getRelatSrcPath("audio")."';");
	    print("var gamePath = '".$pj->getRelatSrcPath("game")."';");
	    print("var lastModServer = ".$pj->getLastModTS().";");
	    print("Config.init({width:".$pj->getWidth().", height:".$pj->getHeight()."});");
    
        if(isset($_SESSION["uid"]) && $_SESSION["uid"] != "") {
            echo "uid = '".$_SESSION["uid"]."';";
        }
    ?>
    if(uid && uid != "") {
        $(".menu li.id").text(uid);
    }
	
	$('#showProjet').click(function(){
	    window.open('./projects/index.php?pj='+pjName);
	});
	$('#newProjet').click(function(){
	    window.open('./index.php');
	});
	
	var config = Config.getInstance();
	init();
	
function retrieveLocalInfo(pjsave) {
    // Pages/Layers/Objects
    var obj = null;
    var maxid = 0, id = 0;
    var pageseri = pjsave.pageSeri;
    for(var pname in pageseri) {
        var page = addPage(pname);
        var steps = 0;
        for(var sname in pageseri[pname]) {
            steps++;
            var step = $(pageseri[pname][sname]);
            page.data('StepManager').addStepWithContent(sname, step);
            step.children().each(function(){
                obj = $(this);
                // Article
                if(obj.hasClass('article')) {
                    obj.deletable().configurable();
                    obj.children('div').each(function(){
                        if($(this).hasClass('illu')) $(this)
                        $(this).deletable(null, true)
                               .selectable(selectP)
                               .staticButton('./images/UI/insertbelow.png', insertElemDialog)
                               .staticButton('./images/UI/config.png', staticConfig)
                               .staticButton('./images/tools/anime.png', animeTool.animateObj)
                               .staticButton('./images/UI/addscript.jpg', addScriptForObj)
                               .css({'z-index':'0','background':'none'});
                        $(this).children('.del_container').css({
                        	'position': 'relative',
                        	'top': ($(this).children('p').length == 0) ? '0%' : '-100%',
                        	'display':'none'});
                    });
                    id = parseInt(obj.prop('id').substring(3));
                    if(id > maxid) maxid = id;
                }
                // Other obj
                else {
                    obj.selectable(null).deletable().configurable().resizable().moveable().canGoDown()
                       .hoverButton('./images/tools/anime.png', animeTool.animateObj)
                       .hoverButton('./images/UI/addscript.jpg', addScriptForObj);
                    id = parseInt(obj.prop('id').substring(3));
                    if(id > maxid) maxid = id;
                }
            });
        }
        if(steps == 0) page.data('StepManager').addStep(pname+'default', null, true);
    }
    // Ressources
    var src = pjsave.sources;
    for(var key in src) {
        var type = src[key].type;
        var data = src[key].data;
        if(type == "text" || type == "obj") continue;
        else if(type == "anime") 
            data = objToClass(data, Animation);
        else if(type == "wiki") 
            data = objToClass(data, Wiki);
        srcMgr.addSource(type, data, key);
    }
    if(!isNaN(pjsave.srcCurrId)) srcMgr.currId = pjsave.srcCurrId;
    if(!isNaN(pjsave.objCurrId)) curr.objId = pjsave.objCurrId;
    else if(!isNaN(maxid)) curr.objId = maxid+1;
    if(isNaN(pjsave.lastModif)) curr.lastModif = lastModServer;
    else curr.lastModif = pjsave.lastModif;
    // Scripts
    if(pjsave.scripts && !(pjsave.scripts instanceof Array) && Object.keys(pjsave.scripts).length != 0)
        scriptMgr.scripts = pjsave.scripts;
}
	
	// Compare server and local last modification info for Synchronization
	var norecord = false;
	var lastModLocal = -1;
	var pjsavestr = localStorage.getItem(pjName);
	if(!pjsavestr) norecord = true;
	else {
	    var pjsave = JSON.parse(pjsavestr);
	    if(!pjsave) norecord = true;
	    else {
	        if(pjsave.lastModif) lastModLocal = pjsave.lastModif;
	    }
	}
	
	// Update local with server storage
	if(norecord || (lastModLocal < lastModServer && lastModLocal != -1)) {
	    $.get("updateFromServer.php", {'pj':pjName}, function(msg){
	        //alert(msg);
	        var pjsave = JSON.parse(msg);
	        if(pjsave) {
	            //saveToLocalStorage(pjName, msg);
	            retrieveLocalInfo(pjsave);
	        }
	    });
	}
	// Update server with local storage
	else if(lastModLocal > lastModServer || lastModLocal == -1) {
	    $.post("updateWithLocal.php", {"pj":pjName, "localStorage":pjsavestr}, function(msg){
                var modif = parseInt(msg);
                if(!isNaN(modif)) pjsave.lastModif = modif;
                else if(msg != "") alert(msg);
                
                // Retrieve the information of pages in local storage
                if(pjsave) retrieveLocalInfo(pjsave);
            });
	}
	else {
	    // Retrieve the information of pages in local storage
	    if(pjsave) retrieveLocalInfo(pjsave);
	}
</script>

</body>
</html>