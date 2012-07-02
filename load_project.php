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

if( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    if( array_key_exists("pjName", $_POST) && isset( $_POST['language'])) {
        $pjName = $_POST["pjName"];
        $lang = $_POST['language'];
        ConnectDB();
        if( checkPjExist($pjName) ) {
            $pj = MseProject::getExistProject($pjName, $lang);
            if($pj) {
                $_SESSION[$pjName] = $pj;
                echo "SUCCESS";
            }
            else {
                echo "Fail to generate exist project.";
            }
        }
        else echo "Projet n'existe pas";
    }
    
}

?>