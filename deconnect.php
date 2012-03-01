<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Fevrier 2012
 */

include 'dbconn.php';
session_start();

if( $_SERVER['REQUEST_METHOD'] === 'GET' ) {
    deconnect();
}

?>