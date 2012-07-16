<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Fevrier 2012
 */

include 'project.php';
include_once 'dbconn.php';
session_start();

if( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
    // Load a project
    if( array_key_exists("pjName", $_POST) && array_key_exists('lang', $_POST)) {
        $pjName = $_POST["pjName"];
        $lang = $_POST['lang'];
        if( checkPjExist($pjName, $lang) ) {
            $pj = MseProject::getExistProject($pjName, $lang);
            if($pj) {
                $_SESSION[$pjName."_".$lang] = $pj;
                echo "SUCCESS";
            }
            else {
                echo "Fail to generate exist project.";
            }
        }
        else echo "Projet n'existe pas";
    }
    // new translation AJAX request from interface.js, languages already exist will be return back
    else if( array_key_exists('pjName', $_POST) && !array_key_exists('lang', $_POST) ){ 
        $name = $_POST['pjName'];
        
        $languages = MseProject::getPjLanguages($name);
        
        if( is_array($languages) ) {
            $str = "";
            for ($i = 0, $size = sizeof($languages); $i < $size; ++$i){
                if ($i == 0)
                    $str .= $languages[$i];
                else
                    $str .= ' '.$languages[$i];
            }
            echo $str;
        }
        else echo "FAIL";
    }
}

?>