<?php
/*!
 * Book Reader index page
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date of creation: Octobre 2011
 */

header("content-type:text/html; charset=utf8");
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

include_once '../core.php';
include_once '../fb_enom_library.php';

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'GET' && array_key_exists('pj', $_GET) && isset($_GET['language'])) {

    ConnectDB();
    $chapName = $_GET['pj'];
    $lang = $_GET['language'];
    
    $intercomments = getInternalCommentsFor($chapName);
    if($intercomments == "") $intercomments = "[]";
    
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
<script src="./scriber.js"></script>
<script src="./events.js"></script>
<script src="./mse.js"></script>
<script src="./effet_mini.js"></script>
<script src="./mdj.js"></script>

</head>

<body>

<div id="root">
    <div id="msgCenter"><ul></ul></div>
    <div id="loader"></div>
    <img id="newComment" src="./UI/tag_single.png" />
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
                <img id="upload" src="" />
                <img id="sns" src="./UI/sns_f.png" />
                <a id="share">Partager</a>
            </div>
            <div class="body">
                <textarea id="comment_content" rows="5" cols="30" placeholder="Écrire votre commentaire ici..."></textarea>
            </div>
        </div>
        <div id="scriber">
            <div class="toolbox">
                <div class="anchor"></div>
                <ul>
                    <li><img id="sb_img" src="./UI/config_img.gif"/></li>
                    <li class="active"><img id="sb_pencil" src="./UI/pencil_nocolor.png"/>
                        <ul id="sb_colorset" class="sb_subtool">
                            <li class="active"><img id="sb_black" src="./UI/color/black.png"></li>
                            <li><img id="sb_red" src="./UI/color/red.png"></li>
                            <li><img id="sb_orange" src="./UI/color/orange.png"></li>
                            <li><img id="sb_yellow" src="./UI/color/yellow.png"></li>
                            <li><img id="sb_green" src="./UI/color/green.png"></li>
                            <li><img id="sb_blue" src="./UI/color/blue.png"></li>
                            <li><img id="sb_purple" src="./UI/color/purple.png"></li>
                        </ul>
                    </li>
                    <li><img id="sb_eraser" src="./UI/eraser.png"/></li>
                    <li><canvas id="sb_size" width="32" height="32"></canvas>
                        <canvas id="sb_sizeset" class="sb_subtool" width="32" height="200"></canvas>
                        <div id="sb_sizebloc"></div>
                    </li>
                    <li><img id="sb_confirm" src="./UI/ok.png"/></li>
                </ul>
            </div>
            <div class="canvas_container">
                <div class="inner_container">
                    <canvas id="sb_imgcanvas"></canvas>
                    <canvas id="sb_drawcanvas"></canvas>
                </div>
                <div id="circle_center">
                    <div class="circle"></div>
                    <div class="moveicon editicon"></div>
                    <div class="dragicon editicon"></div>
                    <div class="deleteicon editicon"></div>
                </div>
                <img class="close" src="./UI/button/close.png"/>
                <img class="resize" src="./UI/button/resize.png" draggable="false">
            </div>
        </div>
        <div id="capture_result">
            <canvas id="sb_canvas"></canvas>
            <div id="util">
                <img id="confirm" src="./UI/confirm.png"/>
                <img id="edit" src="./UI/edit.png">
                <img id="recapture" src="./UI/recapture.png">
                <img id="close" src="./UI/cancel.png">
            </div>
        </div>
        <div id="comment_shower"></div>
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

print( "var comments = JSON.parse('".$intercomments."');\n" );

if(isset($content)) print($content);

?>

if(comments instanceof Array) gui.attachComments(comments);

</script>

</body>
</html>