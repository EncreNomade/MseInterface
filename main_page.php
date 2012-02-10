<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

header("content-type:text/html; charset=utf8");
include 'project.php';

session_start();

if( $_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists("pjName", $_GET) ) {
    $pj = MseProject::getExistProject($_GET["pjName"]);
    if(isset($pj)) {
        $_SESSION['currPj'] = $pj;
    }
    else {
        $_SESSION['currPj'] = null;
        echo '<script type="text/javascript">alert("Projet n\'existe pas encore, vous pouvez le créez.");</script>';
    }
}
if( !isset($_SESSION['currPj']) ) header("Location: index.php");

?>

<!DOCTYPE html>
<html>
<head>
  <title>Interface d'édition</title>

  <script type="text/javascript">
  // Debug
  var debugMsgAppend = window.debugMsgAppend = function(message) {
	$("#debug").append(message);
	$("#debug").fadeIn("1000");
  };

  var debugMsgRefresh = window.debugMsgRefresh = function(message) {
	$("#debug").text("Debug: " + message);
	$("#debug").fadeIn("1000");
  };

  window.onerror = function(msg, url, line){
	if(onerror.num++ < onerror.max) {
		alert("Error: " + msg + "\n" + url + ":" + line);
		return true;
	}
  }
  onerror.max = 3;
  onerror.num = 0;
  </script>

<script src="./javascript/support/jquery-latest.js"></script>
<script src="./javascript/interface.js"></script>
<script src="./javascript/support/tools.js"></script>

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
	<div id="menu_mask"></div>
</nav>
<ul id="tools">
	<li id="texticon"><img src="./images/tools/pen.png"></img></li>
	<li id="recticon"><img src="./images/tools/rule.png"></img></li>
	<li id="wikiicon"><img src="./images/tools/wiki.png"></img></li>
	<li id="animeicon"><img src="./images/tools/anime.png"></img></li>
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
		<li><h5>Poids</h5><input id="shape_weight" size="2" type="number"></li>
		<li><h5>Radius</h5><input id="shape_radius" size="2" type="number"></li>
		<li><h5>Opaque</h5><input id="shape_opac" size="3" type="number"></li>
		<li><h5>Rempli</h5><input id="shape_fill" size="5" type="color"></li>
		<li><h5>Trait</h5><input id="shape_stroke" size="5" type="color"></li>
	</ul>
	<ul id="textTools" class="central_tools">
		<li><h5>Paramètres:</h5></li>
		<li><h5>Color</h5><input id="text_color" size="5" value="#000" type="color"></li>
		<li><h5>Police</h5><input id="text_font" size="5" type="text"></li>
		<li><h5>Taille</h5><input id="text_size" size="3" value="16" type="number"><span>px</span></li>
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
		<li><h5>Police</h5><input id="wiki_font" size="5" type="text"></li>
		<li><h5>Taille</h5><input id="wiki_size" size="3" value="16" type="number"><span>px</span></li>
	</ul>
	<ul id="animeTools" class="central_tools">
		<li><h5>Paramètres: </h5></li>
		<li><h5>Boucle:</h5><input id="animeRepeat" size="2" type="number" value="1"></li>
		<li><h5>Nom:</h5><input id="animeName" size="5" type="text"></li>
		<li><input type="button" id="createAnime" value="Créer"></input></li>
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

<h5 id="debug">Debug: </h5>


<script type="text/javascript">
	
	$('#debug').hide();
	
	$('#center_panel.tabBar li').click(activeBarLabel);
	
	$('#newPage, #createPage').click(createPageDialog);
	$('#removePage').click(delCurrentPage);
	$('#newCalque').click(createStepDialog);
	
	$('#texticon').click(showTextEditor);
	$('#recticon').click(showShapeEditor);
	$('#wikiicon').click(showWikiEditor);
	$('#animeicon').click(showAnimeEditor);
	
	$('#srcAdd').click(addFileDialog);
	
	$('#saveProjet').click(saveProject);
	
	<?php
	    $pj = $_SESSION['currPj'];
	    print("var pjName = '".$pj->getName()."';");
	    print("var imgPath = '".$pj->getSrcSavePath("image")."';");
	    print("var audPath = '".$pj->getRelatSrcPath("audio")."';");
	    print("var gamePath = '".$pj->getRelatSrcPath("game")."';");
	    print("Config.init({width:".$pj->getWidth().", height:".$pj->getHeight()."});");
	?>
	$('#showProjet').click(function(){
	    window.open('./projects/index.php?id='+pjName, '_newtab');
	});
	$('#newProjet').click(function(){
	    window.open('./index.php', '_newtab');
	});
	
	var config = Config.getInstance();
	init();
	
	// Retrieve the information of pages in local storage
	if(localStorage) {
	    var pjsavestr = localStorage.getItem(pjName);
	    var pjsave = JSON.parse(pjsavestr);
	    // Pages/Layers/Objects
	    var pageseri = pjsave.pageSeri;
	    for(var pname in pageseri) {
	        var page = addPage(pname);
	        var steps = 0;
	        for(var sname in pageseri[pname]) {
	            steps++;
	            var step = $(pageseri[pname][sname]);
	            page.data('StepManager').addStepWithContent(sname, step);
	            step.children().each(function(){
	                var self = $(this);
	                // Article
	                if(self.hasClass('article')) {
	                    self.deletable().configurable();
	                    self.children('div').each(function(){
	                        if($(this).hasClass('illu')) $(this).deletable(null, true);
	                        $(this).selectable(selectP)
	                               .staticButton('./images/UI/insertbelow.png', insertElemDialog)
	                               .staticButton('./images/UI/addscript.jpg', addScriptForObj);
	                        $(this).children('.del_container').css({
	                        	'position': 'relative',
	                        	'top': ($(this).children('p').length == 0) ? '0%' : '-100%',
	                        	'display':'none'});
	                    });
	                }
	                // Other obj
	                else self.selectable(null).deletable().configurable().resizable().moveable();
	            });
	        }
	        if(steps == 0) page.data('StepManager').addStep(pname+'default', null, true);
	    }
	    // Ressources
	    var src = pjsave.sources;
	    for(var key in src) {
	        var type = srcMgr.sourceType(key);
	        if(type == "text" || type == "obj") continue;
	        srcMgr.addSource(srcMgr.sourceType(key), src[key], key);
	    }
	    var wiki = pjsave.wikis;
	    for(var key in wiki) {
	        srcMgr.addSource('wiki', $(wiki[key]), key);
	    }
	    if(!isNaN(pjsave.srcCurrId)) srcMgr.currId = pjsave.srcCurrId;
	}
</script>

</body>
</html>