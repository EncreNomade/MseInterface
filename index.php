<?php
/*!
 * MseInterface: Index page
 * User inscription/connection, Project creation/edition
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date de creation: Octobre 2011
 */

header("content-type:text/html; charset=utf8");

include 'project.php';
include 'dbconn.php';
session_start();

function checkSize($w, $h) {
    if(!isset($w) || !isset($h)) return false;
    if($w < 100 || $h < 100) return false;
    if($w > 2000 || $h > 2000) return false;
    return true;
}

if( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    ConnectDB();
    if( array_key_exists("pjName", $_POST) ) {
        $pjName = $_POST["pjName"];
        if( checkPjExist($pjName) )
            echo '<script type="text/javascript">alert("Projet existe déjà.");</script>';
        else if(!checkSize($_POST['width'], $_POST['height']))
            echo '<script type="text/javascript">alert("Erreur de taille de projet.");</script>';
        else {
            $project = new MseProject($pjName, "francais", "", $_POST['width'], $_POST['height']);
            $pjid = $pjName."_francais";
            $_SESSION[$pjid] = $project;
            
            header("Location: gestion_page.php?pjName=$pjName&lang=".$project->getLanguage(), true);
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
<script src="./javascript/tools.js"></script>
<script src="./javascript/interface.js"></script>

<link rel="stylesheet" type="text/css" href="./stylesheets/menu.css" />
<link rel="stylesheet" type="text/css" href="./stylesheets/interface.css" />

</head>
<body>

<nav class="menu">
	<li class="id">Connexion</li>
</nav>

<script type="text/javascript">
	
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

function showOpenPj(){
  <?php
    ConnectDB();
    if (isset($_SESSION["uid"]) && $_SESSION["uid"] != ""){
        $owner = $_SESSION['uid'];
        $rep = mysql_query("SELECT name, language FROM Projects WHERE owner='$owner' ORDER BY name");
        if (!$rep) {
           echo "var pjList = false; var sqlError=\"".addslashes(mysql_error())."\";\n";
        }
        else {
            echo "var pjList = []; ";
            $prevName = '';
            while ($row = mysql_fetch_assoc($rep)){
                $name = $row['name'];
                $lang = $row['language'];
                if($name != $prevName){
                    echo "pjList.push({name:'$name', langue:['$lang']});\n";
                    $prevName = $name;
                }
                else {
                    echo "pjList[pjList.length-1].langue.push('$lang');\n";
                }
            }
        }
    }
  ?>
    if(!pjList || pjList.length == 0) {
        alert('load existing project fail : '+ sqlError);
        showCreatePj();
        return;
    }
    
    dialog.showPopup('0uvrir un projet existant', 400, 220);
    var pjSelectList = '<select id="chooseProject">';
    for(var i in pjList)
        pjSelectList += '<option value="'+i+'">'+pjList[i].name+'</option>';
    pjSelectList += '</select>';
    
    var langueSelectList = '<select id="chooseLanguage">';
    for(var i in pjList[0].langue)
        langueSelectList += '<option value="'+pjList[0].langue[i]+'">'+pjList[0].langue[i]+'</option>';
    langueSelectList += '</select>';
    
    var html = '<table><tr><td>Projet : </td><td>'+pjSelectList+'</td></tr><tr><td>Langue : </td><td>'+langueSelectList+'</td></tr></table>';
    dialog.main.append(html);
    
    html  = '<div style="position:relative;left:90px;top:10px">';
    html +=     '<div id="createPj" class="big_button">Nouveau</div>';
    html +=     '<div id="ouvrirPj" class="big_button">Ouvrir</div>';
    html += '</div>';
    dialog.main.append(html);
    
    $('#chooseProject').change({list:pjList},function(e){
        var list = e.data.list;
        var index = $(this).val();
        var langList = $('#chooseLanguage');
        langList.children().remove();
        var html = '';
        for(var i in pjList[index].langue){
            html +='<option value="'+list[index].langue[i]+'"';
            if(list[index].langue[i] == 'francais')
                html += 'selected';
            html += '>'+list[index].langue[i]+'</option>';
        }
        langList.append(html);
    });
    
    $('#ouvrirPj').click({list:pjList}, function(e) {
        var list = e.data.list;
        var name = list[$('#chooseProject').val()].name;
        var langue = $('#chooseLanguage').val();
        if(!name || name == "") return;
        
        $.post("load_project.php", {'pjName':name, 'lang':langue}, function(msg){
            if(msg && msg == "SUCCESS")
                window.location = "./main_page.php?pjName="+name+"&lang="+langue;
            else if(msg && msg != "") alert(msg);
        });
    });
    
    $('#createPj').click(function(){ showCreatePj() });
    $(document).unbind('keyup');
    $(document).keyup(function(e){
        if(e.which == 13)
            $('#ouvrirPj').click();
    });
}

function showCreatePj(){
    dialog.showPopup('Créer un nouveau projet', 400, 220);
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
    
    $('#ouvrirPj').click(function(){ showOpenPj() });
    $(document).unbind('keyup');
    $(document).keyup(function(e){
        if(e.which == 13)
            $('#createPj').click();
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
	    $(".menu li.id").text(uid).click(function(){
	        $.get("deconnect.php", function(){
	            $(".menu li.id").text('Connexion').click(showLogin);
	        });
	    });
        showOpenPj();
	}
	
</script>

</body>
</html>