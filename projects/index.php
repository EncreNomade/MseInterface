<?php
/*
 *
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 *
 */

header("content-type:text/html; charset=utf8");
session_start();

$content = file_get_contents("./content.js");

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
	$('body').css({'margin':'0px','padding':'0px'});
}, false);
</script>

<link rel="stylesheet" href="../support/flarevideo/flarevideo.css" type="text/css">
<link rel="stylesheet" href="../support/flarevideo/flarevideo.default.css" type="text/css">
<script src="../support/jquery-latest.js"></script>
<script src="../support/BrowserDetect.js"></script>
<script src="../support/flarevideo/jquery.ui.slider.js" type="text/javascript"></script>
<script src="../support/flarevideo/flarevideo.js" type="text/javascript"></script> 
<script src="../support/Interaction.js"></script>
<script src="../support/Tools.js"></script>

</head>

<body>

<script type="text/javascript">
<?php print($content);?>
</script>

</body>
</html>