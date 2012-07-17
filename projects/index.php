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
if($_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists('pj', $_GET) && isset($_GET['language'])) {

    $content = file_get_contents("./".$_GET['pj']."/content_".$_GET['language'].".js");

}

?>

<!DOCTYPE html> 
<html lang="en">
<head>

<meta charset="UTF-8" />
<meta name="robots" content="noindex"/>
<meta name="viewport" content="minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=no"/>
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
<script src="./support/jquery-latest.js"></script>
<script src="./support/BrowserDetect.js"></script>
<script src="./support/Tools.js"></script>
<script src="./support/Interaction.js"></script>
<script src="./gui.js"></script>
<script src="./events.js"></script>
<script src="./mse.js"></script>
<script src="./effet_mini.js"></script>
<script src="./mdj.js"></script>

</head>

<body>

<div id="root">
    <div id="msgCenter"><ul></ul></div>
    <div id="menu">
        <ul>
            <li><div style="width: 32px;height: 30px;background: transparent url('./UI/facebook-like-icon.png') no-repeat left top;"></div></li>
            <li><img id="comment_btn" src="./UI/comment.png"></li>
        </ul>
        <img class="feuille" src="./UI/feuille.png">
    </div>
    <div id="center">
        <div id="comment">
            <img class="close" src="./UI/button/close.png"/>
            <div class="header">
                <img id="photo" src="" />
                <img id="camera" src="./UI/camera.png" />
                <img id="upload" src=""/>
                <img id="sns" src="./UI/sns_f.png">
                <a id="share">Partager</a>
            </div>
            <div class="body">
                <textarea id="comment_content" rows="5" cols="30" placeholder="Écrire votre commentaire ici..."></textarea>
            </div>
        </div>
        <div id="scriber">
            <canvas></canvas>
            <img class="close" src="./UI/button/close.png"/>
            <div class="confirm"></div>
        </div>
    </div>
    <canvas class="bookroot">Votre navigateur ne supporte pas HTML5</canvas>
    <div class="video"></div>
    <div id="imgShower"><div>
            <img id="theImage" src=""/>
            <img id="closeBn"  src="UI/button/close.png"/>
    </div></div>
    <canvas id="gameCanvas" class='game' width=50 height=50></canvas>
</div>

<script type="text/javascript">
<?php 
if(isset($content)) print($content);
?>
</script>

</body>
</html>