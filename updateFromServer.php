<?php
/*!
 * MseInterface API: Retrieve information of a project from server
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date de creation: Fevrier 2012
 */
 
include 'project.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if( $_SERVER['REQUEST_METHOD'] === 'GET' && 
    !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && 
    array_key_exists("pjName", $_GET) && 
    array_key_exists("lang", $_GET) ) {
    $pjid = $_GET['pjName']."_".$_GET['lang'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjid, $_SESSION) ) {
        $pj = $_SESSION[$pjid];
        echo $pj->getJSONProject();
    }
}

?>