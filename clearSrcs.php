<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Mars 2012
 */
 
 include 'project.php';
 session_start();
 
 ini_set("display_errors","1");
 error_reporting(E_ALL);
 
 // AJAX POST check
 if( $_SERVER['REQUEST_METHOD'] === 'GET' && 
     !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
     strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && 
     array_key_exists('pjName', $_GET) &&
     array_key_exists('lang', $_GET)) {
     $pjid = $_GET['pjName']."_".$_GET['lang'];
     // If project doesn't exist in session, abondon
     if( array_key_exists($pjid, $_SESSION) ) {
         $pj = $_SESSION[$pjid];
         $pj->resetSrcs(null);
         $pj->resetScripts(null);
     }
     else {
         echo "Fail: SESSION data incomplete";
     }
 }
 
 ?>