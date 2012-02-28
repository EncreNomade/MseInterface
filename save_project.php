<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */
 
include 'project.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);


// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && isset($_SESSION['currPj'])) {
    ConnectDB();
    // Read the input from stdin
    $xmlstr = file_get_contents('php://input');
    
    // Initialisation of project
    $pj = $_SESSION['currPj'];
    $pj->setStruct($xmlstr);
    $pj->saveToDB();
}

?>