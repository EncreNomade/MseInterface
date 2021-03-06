<?php
/*!
 * MseInterface: Page management before book edition
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date de creation: Octobre 2011
 */

header("content-type:text/html; charset=utf8");

include 'project.php';
ini_set("display_errors","1");
error_reporting(E_ALL);

session_start();
// User login check
if( !isset($_SESSION['uid']) )
    header("Location: index.php", true);
// Request check
else if( $_SERVER['REQUEST_METHOD'] === 'GET' && 
         array_key_exists("pjName", $_GET) && 
         array_key_exists("lang", $_GET) ) 
{
    // Pj existance in session check
    $pjid = $_GET["pjName"]."_".$_GET["lang"];
    if(array_key_exists($pjid, $_SESSION)){
        $pj = $_SESSION[$pjid];
        // Page editable only if structure of project has never been initialized
        if(!$pj->isStructEmpty()) 
            header("Location: main_page.php?pjName=".$pj->getName()."&lang=".$pj->getLanguage(), true);
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
  <title>Gestion des pages</title>

<script src="./javascript/support/jquery-latest.js"></script>
<script src="./javascript/tools.js"></script>
<script src="./javascript/interface.js"></script>

<link rel="stylesheet" type="text/css" href="./stylesheets/menu.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/interface.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/gestion_page.css" />

</head>
<body>

<nav class="menu">
	<li class="id">Connexion</li>
</nav>

<div style="width:100%;top:50%;left:0px;position:absolute;overflow:visible;margin:0px;padding:0px">
	<div id="pagesbanner">
		<div id="new_page">
			<h5>Nouvelle Page</h5>
		</div>
	</div>
	<input id="confirm" type="button" value="Poursuivre"></input>
</div>

<script type="text/javascript">
	
	var uid = null;
	<?php
	    print("var pjName = '".$pj->getName()."';");
	    print("var pjLanguage = '".$pj->getLanguage()."';");
	    
	    if(isset($_SESSION["uid"]) && $_SESSION["uid"] != "") {
	        echo "uid = '".$_SESSION["uid"]."';";
	    }
	?>
	if(uid && uid != "") {
	    $(".menu li.id").text(uid);
	}
	
var initPageButton = function(elem) {
	elem.deletable().hoverButton('./images/UI/left.png', leftFunc).hoverButton('./images/UI/right.png', rightFunc);
}
	
var leftFunc = function() {
	// Clone the target page and remove the origin
	var curr = $(this).parents('.page');
	var left = curr.prev('.page');
	if(left.length == 0) return;
	var tar = curr.clone(true);
	curr.remove();
	
	// Remove all hover buttons and readd
	tar.children('.del_container').remove();
	initPageButton(tar);
	
	// Insert target before the left page
	tar.insertBefore(left);
};
var rightFunc = function() {
	// Clone the target page and remove the origin
	var curr = $(this).parents('.page');
	var right = curr.next('.page');
	if(right.length == 0) return;
	var tar = curr.clone(true);
	curr.remove();
	
	// Remove all hover buttons and readd
	tar.children('.del_container').remove();
	initPageButton(tar);
		
	// Insert target after the right page
	tar.insertAfter(right);
};

    if(localStorage) var pjsavestr = localStorage.getItem(pjName);
    if(pjsavestr) {
        var pjsave = JSON.parse(pjsavestr);
        if(pjsave.pageSeri && !jQuery.isEmptyObject(pjsave.pageSeri)) {
            /*
            for(var pname in pjsave.pageSeri) {
                var newpage = $('<div class="page"><h5>'+pname+'</h5></div>');
                $('#new_page').before(newpage);
                newpage.children('h5').editable();
            }*/
            window.location = "./main_page.php?pjName="+pjName+"&lang="+pjLanguage;
        }
        else pjsave.pageSeri = {};
    }
    else {
        var pjsave = {};
        pjsave.pageSeri = {};
        pjsave.objCurrId = 0;
        pjsave.srcCurrId = 0;
        pjsave.lastModif = new Date().getTime();;
    }
	
	// Del page button and Up down button
	$('.page').each(function(){
		initPageButton($(this));
	});
	
	// New page button function
	$('#new_page').click(function() {
		var newpage = $('<div class="page"><h5>PageSansNom</h5></div>');
		$(this).before(newpage);
		newpage.children('h5').editable();
		initPageButton(newpage);
	});
	
	$('#confirm').click(function() {
		$('.page').each(function() {
		    var pname = $(this).children('h5').html();
			if(!pjsave.pageSeri[pname]) pjsave.pageSeri[pname] = {};
		});
		
		// Local storage
		localStorage.setItem(pjName+" "+pjLanguage, JSON.stringify(pjsave));
		window.location = "./main_page.php?pjName="+pjName+"&lang="+pjLanguage;
	});

</script>

</body>
</html>