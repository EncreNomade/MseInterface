<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Fevrier 2012
 */
 
include 'project.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && array_key_exists('pj', $_POST)) {

    $pjname = $_POST['pj'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjname, $_SESSION) && array_key_exists('localStorage', $_POST) ) {
        ConnectDB();
        $localStr = stripslashes($_POST['localStorage']);
        $local = get_object_vars(json_decode($localStr, true));
        if(!is_null($local)) {
            $pj = $_SESSION[$pjname];
            $pj->setCurrObjId($local['objCurrId']);
            $pj->setCurrSrcId($local['srcCurrId']);
            $pj->setStruct($local['pageSeri']);
            if(array_key_exists('sources', $local)) 
                $pj->resetSrcs($local['sources']);
            if(array_key_exists('scripts', $local)) 
                $pj->resetScripts($local['scripts']);
            $lastModif = $pj->saveToDB();
            echo $lastModif;
        }
    }
}

?>