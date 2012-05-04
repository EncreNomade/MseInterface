<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

header("content-type:text/html; charset=utf8");
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists('pj', $_GET)) {

    $content = file_get_contents("./".$_GET['pj']."/content.js");

}

?>

<!DOCTYPE html> 
<html lang="en">
<head>

<meta name="robots" content="noindex"/>
<meta name="viewport" content="minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>

<title>Encre Nomade Feuilletons</title>

<script type="text/javascript">
addEventListener("load", function(){
	setTimeout(function(){window.scrollTo(0, 1);}, 0);
	$('body').css({'margin':'0px','padding':'0px'});
}, false);
</script>

<link rel="stylesheet" href="./support/main.css" type="text/css">
<link rel="stylesheet" href="./support/flarevideo/flarevideo.css" type="text/css">
<link rel="stylesheet" href="./support/flarevideo/flarevideo.default.css" type="text/css">
<script src="./support/jquery-latest.js"></script>
<script src="./support/BrowserDetect.js"></script>
<script src="./support/flarevideo/jquery.ui.slider.js" type="text/javascript"></script>
<script src="./support/flarevideo/flarevideo.js" type="text/javascript"></script> 
<script src="./support/Tools.js"></script>
<script src="./support/Interaction.js"></script>
<script src="./mse.js"></script>
<script src="./effet_mini.js"></script>
<script src="./mdj.js"></script>

</head>

<body>

<script type="text/javascript">
<?php 
if(isset($content)) print($content);
?>
</script>

</body>
</html>