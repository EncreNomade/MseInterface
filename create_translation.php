<?php
/*!
 * MseInterface API: Create new translation copy
 * Encre Nomade
 *
 * Author: Florent Baldino, EncreNomade
 * Copyright, Encre Nomade
 *
 * Date de creation: Juin 2012
 */
 
include 'project.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if( $_SERVER['REQUEST_METHOD'] === 'POST' && 
    !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && 
    array_key_exists('pjName', $_POST) &&
    array_key_exists('lang', $_POST) &&
    array_key_exists('newLang', $_POST)) 
{   
    $pjName = $_POST['pjName'];
    $pjid = $pjName."_".$_POST['lang'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjid, $_SESSION) ) {
        ConnectDB();
        $currPj = $_SESSION[$pjid];
        $newlang = $_POST['newLang'];
        $translatedPj = $currPj->createTranslation($newlang);
        if( is_null($translatedPj) )
            echo 'Fail during create the new project';
        else $_SESSION[$pjName."_".$newlang] = $translatedPj;
    }
    else {
        echo "Fail: Project doesn't exist in session";
    }
}
else {
    echo "Fail: POST data incomplete";
}

?>