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
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && array_key_exists('pj', $_POST)) {
    $pjname = $_POST['pj'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjname, $_SESSION) && array_key_exists('srcs', $_POST) ) {
        // Read the input from stdin
        $srcs = stripslashes($_POST['srcs']);
        $pj = $_SESSION[$pjname];
        $pj->resetSrcs( get_object_vars(json_decode($srcs)) );
    }
}

?>