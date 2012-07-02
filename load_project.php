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
        if( checkPjExist($pjName, $lang) ) {
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
    else if(isset( $_POST['user']) && isset( $_POST['project'])){ // new translation AJAX request from interface.js
        $owner = $_POST['user'];
        $name = $_POST['project'];
        
        ConnectDB();
        $rep = mysql_query("SELECT language FROM Projects WHERE owner = '$owner' AND name = '$name' ORDER BY language");
        if (!$rep) {
           echo "FAIL";
        }
        else {
            $i = 0;
            while ($row = mysql_fetch_assoc($rep)){
                $lang = $row['language'];
                if ($i == 0)
                    echo $row['language'];
                else
                    echo ' '.$row['language'];
                $i++;
            }
        }
    }
}

?>