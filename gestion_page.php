<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

header("content-type:text/html; charset=utf8");

include 'project.php';
ini_set("display_errors","1");
error_reporting(E_ALL);

session_start();
if( !isset($_SESSION['currPj']) ) header("Location: index.php");

?>

<!DOCTYPE html>
<html>
<head>
  <title>Gestion des pages</title>

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
<script src="./javascript/support/tools.js"></script>

<link rel="stylesheet" type="text/css" href="./stylesheets/interface.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/gestion_page.css" />

</head>
<body>

<div style="width:100%;top:50%;left:0px;position:absolute;overflow:visible;margin:0px;padding:0px">
	<div id="pagesbanner">
		<div id="new_page">
			<h5>Nouvelle Page</h5>
		</div>
	</div>
	<input id="confirm" type="button" value="Poursuivre"></input>
</div>

<h5 id="debug">Debug: </h5>

<script type="text/javascript">
	
	$('#debug').hide();
	
	<?php
	    $pj = $_SESSION['currPj'];
	    print("var pjName = '".$pj->getName()."';");
	?>
	
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
	    var pjsave = {};
	    pjsave.pageSeri = {};
		$('.page').each(function() {
		    var pname = $(this).children('h5').html();
			pjsave.pageSeri[pname] = {};
		});
		
		// Local storage
		localStorage.setItem(pjName, JSON.stringify(pjsave));
		window.location = "./main_page.php";
	});

</script>

</body>
</html>