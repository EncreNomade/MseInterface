<?php
/*!
 * MseInterface API: User deconnection
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright, Encre Nomade
 *
 * Date de creation: Fevrier 2012
 */

include_once 'dbconn.php';
session_start();

if( $_SERVER['REQUEST_METHOD'] === 'GET' ) {
    deconnect();
}

?>