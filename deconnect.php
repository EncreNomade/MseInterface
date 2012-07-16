<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Fevrier 2012
 */

include_once 'dbconn.php';
session_start();

if( $_SERVER['REQUEST_METHOD'] === 'GET' ) {
    deconnect();
}

?>