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
if($_SERVER['REQUEST_METHOD'] === 'GET' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && array_key_exists("pj", $_GET)) {
    $pjname = $_GET['pj'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjname, $_SESSION) ) {
        $pj = $_SESSION[$pjname];
        echo $pj->getJSONProject();
    }
}

?>