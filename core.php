<?php

$errcode = array(
// LOGIN
    'IdNotFound' => 1001,
    'InvalidPwd' => 1002,
// SIGNUP
    'IdExisted' => 1011,
    'InvalidId' => 1012,
    'InvalidBday' => 1013,
    'InvalidMail' => 1014,
    'InvalidSex' => 1015,
    'MailNotAllow' => 1016,
// PASSWORD
    'ShortPwd' => 1021,
// HISTORY
    'HistNotFound' => 1031,
    'NoSession' => 1032,
    
    'Unknown' => 9999
);

$pattern = array(
    'sex' => '/^f|m$/',
    'date' => '/^(\d{2})\/(\d{2})\/(\d{4})$/',
    'date2' => '/^(\d{4})\-(\d{2})\-(\d{2})$/',
    'mail' => '/^[\w\.\_\-]+@[\w\.\_\-]+$/'
);

function ConnectDB(){
    require('server_config.php');
	if(!mysql_connect($dbConfig['server'],$dbConfig['login'],$dbConfig['mdp'])){
		die("Impossible de se connecter à MySQL:".mysql_error());
		return(FALSE);
	}
	if(!mysql_select_db($dbConfig['db'])){
		die("Impossible de sélectionner la base de données:".mysql_error());
		return(FALSE);
	}
	return(TRUE);
}



//------------------------------------------------------------------------------------------------
function updateOnlineStatus($leavetime){
	ConnectDB();
	$nowtime = time();
	if(isset($_SESSION ['Status']) && 2 == $_SESSION ['Status']){
		if (isset($_SESSION ['userID'])){
			$userID = $_SESSION ['userID'];
			$checkUserExist=mysql_query("SELECT COUNT(*) AS num FROM connection WHERE `userID`='$userID' LIMIT 1;");
			$row=mysql_fetch_array($checkUserExist);
			if(0 == $row['num']){
				$addNewConn=mysql_query("INSERT INTO `connection`(`userID`,`lastactivity`) Value('$userID','$nowtime');");
				if(!$addNewConn)die("Error Mark Point 8:".mysql_error());

				$updateLastlogin=mysql_query("UPDATE `user` SET `lastlogin`='$nowtime' WHERE `userID`='$userID';");
				if(!$updateLastlogin)die("Error Mark Point 9:".mysql_error());
				
				insertHistory($userID, $nowtime);
			}
			else{
				$updateLastactivity=mysql_query("UPDATE `connection` SET `lastactivity`='$nowtime' WHERE `userID`='$userID';");
				if(!$updateLastactivity)die("Error Mark Point 3:".mysql_error());
			}
		}
	}
	
	updateHistory();
	
	$result=mysql_query("SELECT * FROM `connection`;");
	while ($dataconn=mysql_fetch_assoc($result)){
		if($nowtime - $dataconn['lastactivity'] > $leavetime){
			$check_query=mysql_query("SELECT * FROM user WHERE `userID`='".$dataconn['userID']."' LIMIT 1;");
			if($datauser=mysql_fetch_array($check_query)){
				$thisConnDuration = $dataconn['lastactivity'] - $datauser['lastlogin'];
				$newDuration = $datauser['duration'] + $thisConnDuration;
				$reponse=mysql_query("UPDATE `user` SET `duration`='$newDuration' WHERE `userID`='".$dataconn['userID']."';");
				if(!$reponse)die("Error Mark Point 4:".mysql_error());
			}
			$reponse=mysql_query("DELETE FROM `connection` WHERE `userID`='".$dataconn['userID']."';");
			if(!$reponse)die("Error Mark Point 5:".mysql_error());
			
		}
	}	
}


//------------------------------------------------------------------------------------------------

function insertHistory($userID){
    include "browser_detection.php";
    $browser = getBrowser();
	$userBrowser = $browser["name"].($browser["mobile"]?" Mobile":"")." ".browser_detection('browser_number');
	$userOS = getOS()." ".browser_detection('os_number');
	$time = time();
	$page = " - ".$_SERVER['REQUEST_URI'];
	$reponse = mysql_query("INSERT INTO history(uid, logintime, browser, os, seq) Value('$userID','$time','$userBrowser','$userOS','$page');");
	if(!$reponse){
		die("Error in insert history: ".mysql_error());
	}
	
	$data = mysql_query("SELECT * FROM history WHERE uid='$userID' AND logintime='$time' LIMIT 1");
	if($result = mysql_fetch_array($data)){
		$_SESSION['history'] = $result['hid'];
		$_SESSION['loginTime'] = $result['logintime'];
	}
	else die("Error in fetch history infomation: ".mysql_error());
}

//------------------------------------------------------------------------------------------------

function checkBrowser() {
    include "browser_detection.php";
    $_SESSION['browser'] = getBrowser();
    $_SESSION['browserver'] = browser_detection('browser_math_number');
    $_SESSION['os'] = getOS();
    $_SESSION['osver'] = browser_detection('os_number');
    
    $browser = strtolower($_SESSION['browser']['name']);
    $mobile = $_SESSION['browser']['mobile'];
    $version = $_SESSION['browserver'];
    $os = strtolower($_SESSION['os']);
    $osver = floatval($_SESSION['osver']);
    if($browser == "safari" || $browser == "chrome" || $os == "android" || ($browser == "internet explorer" && $version >= 9) || ($browser == "firefox" && $version >= 1.9)) {
        return true;
    }
    else if($browser == "firefox" && $version < 1.9) {
        // MAJ
        header("Location: browserNotif.php?maj=ff", false);
    }
    else if($browser == "internet explorer" && ($os == "windows 7" || $os == "windows 8")) {
        // MAJ
        header("Location: browserNotif.php?maj=ie", false);
    }
    else {
        // CHANGE BROWSER
        header("Location: browserNotif.php", false);
    }
}

//------------------------------------------------------------------------------------------------

function getChapiterInfo($bid, $lang) {
    $chapiters = array(
        'ch1'  => array('name'=>"Voodoo_Ch1", 'index'=>0),
        'ch2'  => array('name'=>"Voodoo_Ch2", 'index'=>1),
        'ch3'  => array('name'=>"Voodoo_Ch3", 'index'=>2),
        'ch4'  => array('name'=>"Voodoo_Ch4", 'index'=>3),
        'ch5'  => array('name'=>"Voodoo_Ch5", 'index'=>4),
        'ch6'  => array('name'=>"Voodoo_Ch6", 'index'=>5),
        'ch7'  => array('name'=>"Voodoo_Ch7", 'index'=>6),
        'ch8'  => array('name'=>"Voodoo_Ch8", 'index'=>7),
        'ch9'  => array('name'=>"Voodoo_Ch9", 'index'=>8),
        'ch10' => array('name'=>"Voodoo_Ch10", 'index'=>9),
        'ch11' => array('name'=>"Voodoo_Ch11", 'index'=>10),
        'ch12' => array('name'=>"Voodoo_Ch12", 'index'=>11),
        'ch13' => array('name'=>"Voodoo_Ch13", 'index'=>12)
    );
    
    $query = "SELECT ";
    if(array_key_exists($bid, $chapiters)) {
        ConnectDB();
        $chapName = $chapiters[$bid]['name'];
        $query = "SELECT *
                  FROM Projects 
                  WHERE name='$chapName'
                    AND language='$lang'
                  LIMIT 1";
        $rep = mysql_query($query);
        
        if(!$rep) return null;
        
        $project = mysql_fetch_array($rep);
        $chapiters[$bid]['path'] = $project['folder'];
        $chapiters[$bid]['lang'] = $lang;
        return $chapiters[$bid];    
    }
    
    
    else return null;
}

?>