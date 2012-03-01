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
    $identite = mysql_query("SELECT * FROM User WHERE id='$uid' AND mdp='$mdp' LIMIT 1;");
    if($identite) {
        $_SESSION['uid'] = $uid;
        return true;
    }
    else return false;
}

function checkPjExist($pj) {
    if(!isset($_SESSION['uid'])) return false;
    $pid = $_SESSION['uid']."_".$pj;
    $resp = mysql_query("SELECT COUNT(*) AS n FROM Projects WHERE id='$pid' LIMIT 1;");
    $count = mysql_fetch_array($resp);
    if(!$count || $count['n'] == 0) return false;
    else return true;
}

function checkPjStruct($pj){
    if(!isset($_SESSION['uid'])) return false;
    $pid = $_SESSION['uid']."_".$pj;
    $resp = mysql_query("SELECT struct FROM Projects WHERE id='$pid' LIMIT 1;");
    $struct = mysql_fetch_array($resp);
    if($struct) return $struct['struct'];
    else return false;
}

function deconnect(){
    unset($_SESSION['uid']);
}

?>