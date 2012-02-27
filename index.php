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

//if( isset($_SESSION['currPj']) ) header("Location: main_page.php");

function checkSize($w, $h) {
    if(!isset($w) || !isset($h)) return false;
    if($w < 100 || $h < 100) return false;
    if($w > 2000 || $h > 2000) return false;
    return true;
}

$db = ConnectDB();

if( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    if( array_key_exists("pjName", $_POST) ) {
        $_SESSION['currPj'] = null;
        $pjPath = MseProject::getRelatProjectPath($_POST["pjName"]);
        if( file_exists($pjPath) )
            echo '<script type="text/javascript">alert("Projet existe déjà.");</script>';
        else if(!checkSize($_POST['width'], $_POST['height']))
            echo '<script type="text/javascript">alert("Erreur de taille de projet.");</script>';
        else {
            mkdir($pjPath);
            $project = new MseProject($_POST['pjName'], "", $_POST['width'], $_POST['height']);
            $_SESSION['currPj'] = $project;
            header("Location: gestion_page.php");
        }
    }
    else if( array_key_exists("uid", $_POST) ) {
        $uid = $_POST['uid'];
        $mdp = $_POST['mdp'];
        userLogin($uid, $mdp);
    }
}

?>

<!DOCTYPE html>
<html>
<head>

  <title>Project</title>

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
<script src="./javascript/interface.js"></script>

<link rel="stylesheet" type="text/css" href="./stylesheets/menu.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/interface.css" />

</head>
<body>

<nav class="menu">
	<li class="id">Connexion</li>
</nav>

<script type="text/javascript">
	
	$('#debug').hide();
	
	dialog = new Popup();
	
function showLogin(){
    dialog.showPopup('Identifiez-vous', 350, 220);
    // Name and Z-index
    dialog.main.append('<form id="pjForm" action="index.php" method="post"><p><label>Nom:</label><input id="uid" name="uid" size="15" type="text"></p><p><label>Mot de passe:</label><input id="mdp" name="mdp" size="15" type="password"></p></form>');
    // Differente type of Step
    dialog.main.append('<div style="position:relative;left:65px;top:10px"><div id="inscription" class="big_button">Inscription</div><div id="login" class="big_button">Identifiez</div></div>');
    
    $('#login').click(function() {
        var uid = $('#uid').val();
        var mdp = $('#mdp').val();
        var fail = false;
        if(!uid || uid == ""){
            $('#uid').parent().css('color','RED');
            fail = true;
        }
        else $('#uid').parent().css('color','BLACK');
        if(!mdp || mdp == ""){
            $('#mdp').parent().css('color','RED');
            fail = true;
        }
        else $('#mdp').parent().css('color','BLACK');
        if(fail) return;
        
        // Pass verification
        $('#pjForm').submit();
    });
}
	
function showCreatePj(){
    dialog.showPopup('Créer ou ouvrir un nouveau projet', 400, 220);
    // Name and Z-index
    dialog.main.append('<form id="pjForm" action="index.php" method="post"><p><label>Nom:</label><input id="pjName" name="pjName" size="10" type="text"></p><p><label>Taille:</label><input id="width" name="width" size="10" type="text" placeholder="Largeur"><span>px</span><input id="height" name="height" size="10" type="text" placeholder="Hauteur"><span>px</span></p></form>');
    // Differente type of Step
    dialog.main.append('<div style="position:relative;left:90px;top:10px"><div id="ouvrirPj" class="big_button">Ouvrir</div><div id="createPj" class="big_button">Créer</div></div>');
    
    $('#createPj').click(function() {
    	var name = $('#pjName').val();
    	var w = parseInt($('#width').val());
    	var h = parseInt($('#height').val());
    	
    	if(!name || name == "") {
    		$('#pjName').parent().css('color','RED');
    		return;
    	}
    	else {
    		$('#pjName').parent().css('color','BLACK');
    	}
    	
    	if(isNaN(w) || isNaN(h)) {
    		$('#width').parent().css('color','RED');
    		return;
    	}
    	else {
    		$('#width').parent().css('color','BLACK');
    	}
    	
    	// Pass verification
    	$('#pjForm').submit();
    });
    
    $('#ouvrirPj').click(function() {
        var name = $('#pjName').val();
        if(!name || name == "") return;
        
        window.location = "./main_page.php?pjName="+name;
    });
}
	
	var uid = null;
	<?php
	if(isset($_SESSION["uid"]) && $_SESSION["uid"] != "") {
	    echo "uid = '".$_SESSION["uid"]."';";
	}
	?>
	if(!uid || uid == "") {
	    $(".menu li.id").click(showLogin);
	    showLogin();
	}
	else {
	    $(".menu li.id").text(uid);
	    showCreatePj();
	}
	
</script>

</body>
</html>