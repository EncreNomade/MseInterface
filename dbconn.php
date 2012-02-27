<?php

function ConnectDB(){
	$link=mysql_connect("localhost","root","root");
	if(!$link){
		die("Impossible de se connecter à MySQL:".mysql_error());
		return(FALSE);
	}
	$ok = mysql_select_db("projects");
	if(!$ok){
		die("Impossible de sélectionner la base de données:".mysql_error());
		return(FALSE);
	}
	return(TRUE);
}

function userLogin($uid, $mdp){
    //$mdp = md5($mdp);
    $identify = mysql_query("SELECT * FROM User WHERE id='$uid' AND mdp='$mdp' LIMIT 1;");
    $resp = mysql_fetch_array($identify);
    if($resp) {
        $_SESSION['uid'] = $uid;
        return true;
    }
    else return false;
}

function deconnect(){
    unset($_SESSION['uid']);
}

?>