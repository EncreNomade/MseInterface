<?php
/*!
 * MseInterface API: Update all sources of a project
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date de creation: Mars 2012
 */

include 'project.php';

session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if( $_SERVER['REQUEST_METHOD'] === 'POST' && 
    !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && 
    array_key_exists('pjName', $_POST) &&
    array_key_exists('lang', $_POST) ) 
{
    $pjid = $_POST['pjName']."_".$_POST['lang'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjid, $_SESSION) && array_key_exists('srcs', $_POST) ) {
        // Read the input from stdin
        if(get_magic_quotes_gpc()) {
            $srcs = stripslashes($_POST['srcs']);
        }
        else {
            $srcs = $_POST['srcs'];
        }
        $pj = $_SESSION[$pjid];
        $res = get_object_vars(json_decode($srcs));
        if(!is_null($res) && $res !== false) $pj->resetSrcs( $res );
    }
}

?>