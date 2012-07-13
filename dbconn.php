<?php

function ConnectDB(){
    require('server_config.php');
    require 'MseDataBase.class.php';
    
	return MseDataBase::getInstance();
}

function userLogin($uid, $mdp){
    //$mdp = md5($mdp);
    $db = ConnectDB();
    $query = $db->prepare("SELECT COUNT(*) AS n FROM EditorUsers WHERE id='?' AND mdp='?' LIMIT 1;");
    $rep = $query->execute(array($uid, $mdp));
    $count = $rep->fetch();
    if(isset($count) && $count['n'] != 0) {
        $_SESSION['uid'] = $uid;
        return true;
    }
    else return false;
}

function checkPjExist($pj, $lang='francais') {
    if(!isset($_SESSION['uid'])) return false;
    $owner = $_SESSION['uid'];
    $db = ConnectDB();
    $query = $db->prepare("SELECT COUNT(*) AS n FROM Projects WHERE owner='?' AND name='?' AND language='?' LIMIT 1;");
    $rep = $query->execute(array($owner, $pj, $lang));
    $count = $rep->fetch();
    if(is_null($count) || $count['n'] == 0) return false;
    else return true;
}

function checkPjStruct($pj, $lang='francais'){
    if(!isset($_SESSION['uid'])) return false;
    $owner = $_SESSION['uid'];
    $db = ConnectDB();
    $query = $db->prepare("SELECT struct FROM Projects WHERE owner='?' AND name='?' AND language='?' LIMIT 1;");
    $rep = $query->execute(array($owner, $pj, $lang));
    $struct = $rep->fetch();
    if($struct) return $struct['struct'];
    else return false;
}

function deconnect(){
    unset($_SESSION['uid']);
}

?>