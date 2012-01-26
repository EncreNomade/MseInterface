<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

include 'project.php';

session_start();

ini_set("display_errors","1");
error_reporting(E_ALL);

function saveBase64Src($name, $encodedStr, $pj) {
    // Pattern regexp for get type, extension, codage of file
    $pattern = "/data:\s*(?P<type>\w+)\/(?P<ext>\w+);\s*(?P<codage>\w+),/";
    preg_match($pattern, $encodedStr, $res);
    // Data of Base64 coded content
    $pos = strrpos($encodedStr,',');
    if($pos) $res['data'] = substr($encodedStr, $pos+1);
    $type = $res['type'];
    if($type != 'image' && $type != 'audio' && $type != 'game') return;
// TODO: Extension check
    // Add extension to filename
    $filename = $name.'.'.$res['ext'];

    // Decode data
    if($res['codage'] == 'base64') {
        $temp = str_replace(' ','+',$res['data']);
        $content = base64_decode($temp);
    }
    
    if($content) {
        $path = $pj->getSrcSavePath($type).$filename;
        $res = file_put_contents($path, $content);
        return $filename;
    }
    else echo 'failed to upload src...';
    return null;
}

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && isset($_SESSION['currPj'])) {
    // Read the input from stdin
    $type = $_POST['type'];
    $name = $_POST['name'];
    $encodedStr = $_POST['data'];
    $pj = $_SESSION['currPj'];
    //$pj->resetSrcs();
    
    switch($type) {
    case "image":
    case "audio":
    case "game":
        // Direct url link
        if( strripos($encodedStr, "http://") !== false || strripos($encodedStr, "./") !== false ) {
            // Add source to project
            $pj->addSrc($name, $type, $encodedStr);
        }
        // File content coded
        else {
            $filename = saveBase64Src($name, $encodedStr, $pj);
            // Add source to project
            if(!is_null($filename)) $pj->addSrc($name, $type, $pj->getSrcSavePath($type).$filename);
        }
    break;
    case "anime":
        $anime = json_decode($encodedStr);
        if(!is_null($anime)) {
            $pj->addSrc($name, $type, $anime);
            var_dump($anime);
        }
    break;
    case "wiki":
        // Parse to xml doc
        $xml = simplexml_load_string($encodedStr, "SimpleXMLElement", LIBXML_PARSEHUGE);
        $wikis = $xml->wiki;
        foreach($wikis as $wiki) {
            $elem = new MseWiki($wiki, $pj);
            $pj->addWiki($elem);
        }
    break;
    }
}

?>