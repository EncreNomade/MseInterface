<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

header("content-type:text/html; charset=utf8");
session_start();

if($_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists('id', $_GET)) {
    $pjid = $_GET['id'];
    if($pjid == 'current') {
        $pj = $_SESSION['currPj'];
        $pjid = $pj->getName();
    }
}

?>

<!DOCTYPE html> 
<html lang="en">
<head>

<meta name="robots" content="noindex"/>
<meta name="viewport" content="minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>

<title>Livre généré</title>

<script type="text/javascript">
addEventListener("load", function(){
	setTimeout(function(){window.scrollTo(0, 1);}, 0);
}, false);

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

<link rel="stylesheet" href="./support/flarevideo/flarevideo.css" type="text/css">
<link rel="stylesheet" href="./support/flarevideo/flarevideo.default.css" type="text/css">
<script src="./support/jquery-latest.js"></script>
<script src="./support/BrowserDetect.js"></script>
<script src="./support/flarevideo/jquery.ui.slider.js" type="text/javascript"></script>
<script src="./support/flarevideo/flarevideo.js" type="text/javascript"></script> 
<script src="./support/Interaction.js"></script>
<script src="./support/Tools.js"></script>
<script src="./mse.js"></script>
<script src="./support/generator.js"></script>

</head>

<body>

<h5 id="debug" style="color:rgb(255,160,50)">Debug: </h5>

<script type="text/javascript">

    <?php print("var pid = '".$pjid."';\n");?>

	$("#debug").hide();
	initMseConfig();
	mse.init();
	
	$('body').css({'margin':'0px','padding':'0px'});
	
	$.post("./get_struct.php", {'id':pid}, handle_struct);
	
</script>

</body>
</html>