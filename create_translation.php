<?php
/*
 * Author: EncreNomade
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Juin 2012
 */
 
include 'project.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' 
    && array_key_exists('pj', $_POST)) {
    $pjname = $_POST['pj'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjname, $_SESSION) 
     && array_key_exists('newLang', $_POST) ) {
        ConnectDB();
        $currPj = $_SESSION[$pjname];
        $lang = $_POST['newLang'];
        $translatedPj = $currPj->createTranslation($lang);
        if(!$translatedPj)
            echo 'Fail during create the new project';
    }
    else {
        echo "Fail: POST data incomplete";
    }
}

?>