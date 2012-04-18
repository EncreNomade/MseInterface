<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Fevrier 2012
 */
 
include 'project.php';
include 'generate_js.php';
include 'dbconn.php';
session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && array_key_exists('pj', $_POST)) {
    $pjname = $_POST['pj'];
    // If project doesn't exist in session, abondon
    if( array_key_exists($pjname, $_SESSION) 
     && array_key_exists('struct', $_POST) 
     && array_key_exists('objCurrId', $_POST) 
     && array_key_exists('srcCurrId', $_POST) ) {
        ConnectDB();
        // Read the input from stdin
        if(get_magic_quotes_gpc()) {
            $structStr = stripslashes($_POST['struct']);
        }
        else {
            $structStr = $_POST['struct'];
        }
        $struct = get_object_vars(json_decode($structStr));
        $objId = intval($_POST['objCurrId']);
        $srcId = intval($_POST['srcCurrId']);
        if(!is_null($struct) && $struct != false) {
            $pj = $_SESSION[$pjname];
            $pj->setStruct($struct);
            $pj->setCurrObjId($objId);
            $pj->setCurrSrcId($srcId);
            $modif = $pj->saveToDB();
            
            $generator = new ProjectGenerator($pj);
            $generator->putAllinContentJS();
            
            echo $modif;
        }
    }
    else {
        echo "Fail: POST data incomplete";
    }
}

?>