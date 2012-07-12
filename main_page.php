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
else if( $_SERVER['REQUEST_METHOD'] === 'GET' && 
         array_key_exists("pjName", $_GET)  && 
         array_key_exists("lang", $_GET)) {
    // Pj existance in session check
    $pjName = $_GET["pjName"];
    $langue = $_GET["lang"];
    $pjid = $pjName."_".$langue;
    if(array_key_exists($pjid, $_SESSION)){
        $pj = $_SESSION[$pjid];
        // Wrong session data
        if($pj->getLanguage() != $langue){
            ConnectDB();
            $pj = MseProject::getExistProject($pjName, $langue);
            $_SESSION[$pjid] = $pj;
// TODO: If retrieve project fail
        }
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
<script src="./javascript/support/jquery.color.js"></script>
<script src="./javascript/tools.js"></script>
<script src="./javascript/interface.js"></script>
<script src="./javascript/command.js"></script>

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
    <li><a href="#">Outils</a>
		<ul>
			<li><a id="newTranslation">Nouvelle traduction</a></li>
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
	<ul id="translateTool" class="central_tools">
	    <li style="float: right;"><input id="gene_trans" type="button" value="Générer" /></li>
	    <li style="float: left; margin: 2px 5px;"><img src="./images/tools/previous.png"></li>
	    <li style="float: left; margin: 2px 5px;"><img src="./images/tools/next.png"></li>
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
		<li>Scripts</li>
		<li class="add">⋁</li>
	</ul>

	<div id="Ressources_panel" class="source">
		<img id="srcAdd" class="icon_src" src="./images/UI/plus.png"></img>
	</div>
	<div id="Scripts_panel" class="source">
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
	
    $('#newTranslation').click(newTranslationDialog);
    
	$('#srcAdd').click(addFileDialog);
	$('#saveProjet').click(saveProject);
	
	<?php
	    print("var pjName = '".$pj->getName()."';");
        print("var pjLanguage = '".$pj->getLanguage()."';");
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
	    window.open('./projects/index.php?pj='+pjName+'&language='+pjLanguage);
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
        scriptMgr.countScripts(page.attr('id'),"page");
        var steps = 0;
        for(var sname in pageseri[pname]) {
            steps++;
            var step = $(pageseri[pname][sname]);
            page.data('StepManager').addStepWithContent(sname, step);
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
		else if(type == "speaker"){
            data = objToClass(data, Speaker);
		}
        else if(type == "wiki") 
            data = objToClass(data, Wiki);
        srcMgr.addSource(type, data, key);
    }
    if(!isNaN(pjsave.srcCurrId)) srcMgr.currId = pjsave.srcCurrId;
    if(!isNaN(pjsave.objCurrId)) curr.objId = pjsave.objCurrId;
    //else if(!isNaN(maxid)) curr.objId = maxid+1;
    
    // Scripts
    if(pjsave.scripts) {
        scriptMgr.addScripts( pjsave.scripts );
    }
    
    if(isNaN(pjsave.lastModif)) curr.lastModif = lastModServer;
    else curr.lastModif = pjsave.lastModif;
    
    <?php 
        if($pj->getUntranslated()) {
            print("window.translationTool.active();");
        }
    ?>
    
}
	
	// Compare server and local last modification info for Synchronization
	var norecord = false;
	var lastModLocal = -1;
	var pjsavestr = localStorage.getItem(pjName+" "+pjLanguage);
	if(!pjsavestr) norecord = true;
	else {
	    var pjsave = JSON.parse(pjsavestr);
	    if(!pjsave) norecord = true;
	    else {
	        if(pjsave.lastModif) lastModLocal = pjsave.lastModif;
	    }
	}
	
	// Update local with server storage
	if(norecord || (lastModLocal < lastModServer)) {
	    $.get("updateFromServer.php", {'pjName':pjName, 'lang':pjLanguage}, function(msg){
	        //alert(msg);
	        var pjsave = JSON.parse(msg);
	        if(pjsave) {
	            //saveToLocalStorage(pjName, msg);
	            retrieveLocalInfo(pjsave);
	        }
	    });
	}
	// Update server with local storage
	else if(lastModLocal > lastModServer) {
	    $.post("updateWithLocal.php", {"pjName":pjName, 'lang':pjLanguage, "localStorage":pjsavestr}, function(msg){
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