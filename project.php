<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

ini_set("display_errors","1");
error_reporting(E_ALL);

class MseProject {
    private $name;
    private $bookName;
    private $width;
    private $height;
    private $orientation;
    private $sources;
    private $scripts;
    private $ratio;
    private $struct;

    function MseProject($pjName, $bkName, $width = 800, $height = 600, $orient = 'portrait') {
        $this->name = $pjName;
        $this->bookName = (is_null($bkName) || $bkName=="") ? $pjName : $bkName;
        $this->width = $width ? $width : 800;
        $this->height = $height ? $height : 600;
        $this->ratio = 480/$this->height;
        $this->orientation = $orient;
        $this->sources = array();
        $this->scripts = array();
        // Make directories in project folder
        if( !file_exists('projects/'.$this->name.'/images') ) mkdir('projects/'.$this->name.'/images');
        if( !file_exists('projects/'.$this->name.'/audios') ) mkdir('projects/'.$this->name.'/audios');
        if( !file_exists('projects/'.$this->name.'/games') ) mkdir('projects/'.$this->name.'/games');
    }
    
    function getName() { return $this->name; }
    function getBookName() { return $this->bookName; }
    function getWidth() { return $this->width; }
    function getHeight() { return $this->height; }
    function getOrientation() { return $this->orientation; }
    
    function realCoor($coor) {
        return $coor / $this->ratio;
    }
    
    function setStruct($structStr){
        $this->struct = $structStr;
    }
    function getStruct(){
        return $this->struct;
    }
    function addSrc($name, $type, $src) {
        if(!array_key_exists($type, $this->sources))
            $this->sources[$type] = array();
        $this->sources[$type][$name] = $src;
    }
    function getSrc($name, $type) {
        if(array_key_exists($type, $this->sources) && array_key_exists($name, $this->sources[$type]))
            return $this->sources[$type][$name];
        else return null;
    }
    function getAllSrcs() {
        return $this->sources;
    }
    function resetSrcs() {
        array_splice($this->sources, 0, count($this->sources));
    }
    
    function addScript($name, $script){
        $this->scripts[$name] = $script;
    }
    function getScript($name){
        if(array_key_exists($name, $this->scripts))
            return $this->scripts[$name];
        else return null;
    }
    function getAllScripts() {
        return $this->scripts;
    }
    
    function getSrcSavePath($type) {
        switch($type) {
        case "image" : return './projects/'.$this->name.'/images/';break;
        case "audio" : return './projects/'.$this->name.'/audios/';break;
        case "game" : return './projects/'.$this->name.'/games/';break;
        }
    }
    function getRelatSrcPath($type) {
        switch($type) {
        case "image" : return './'.$this->name.'/images/';break;
        case "audio" : return './'.$this->name.'/audios/';break;
        case "game" : return './'.$this->name.'/games/';break;
        }
    }
    
    function getRelatStructPath() {
        return './projects/'.$this->name.'/struct.xml';
    }
    function getRelatJSPath(){
        return './projects/'.$this->name.'/content.js';
    }
    
    function saveToDB() {
        if(!isset($_SESSION['uid'])) return;
        else $owner = $_SESSION['uid'];
        $id = $owner."_".$this->name;
        $modif = time();
        
        $resp = mysql_query("SELECT * FROM Projects WHERE id='$id' LIMIT 1");
        $exist = mysql_fetch_array($resp);
        
        if($exist) {
            $query = sprintf("UPDATE Projects SET name='%s', width='%s', height='%s', struct='%s', sources='%s', scripts='%s', lastModif='%s' WHERE id='%s'", 
                mysql_real_escape_string($this->name), 
                mysql_real_escape_string($this->width), 
                mysql_real_escape_string($this->height), 
                mysql_real_escape_string($this->struct), 
                mysql_real_escape_string(json_encode($this->sources)), 
                mysql_real_escape_string(json_encode($this->scripts)), 
                mysql_real_escape_string($modif), 
                mysql_real_escape_string($id));
            $resp = mysql_query($query);
            if(!$resp) {
                die("Fail to update the project record: ".mysql_error());
                return FALSE;
            }
        }
        else {
            $query = sprintf("INSERT INTO Projects(id,owner,creation,folder,name,width,height,orientation,struct,sources,scripts,lastModif) Value('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')",
                mysql_real_escape_string($id), 
                mysql_real_escape_string($owner), 
                mysql_real_escape_string($modif),
                mysql_real_escape_string($this->bookName),
                mysql_real_escape_string($this->name),
                mysql_real_escape_string($this->width),
                mysql_real_escape_string($this->height),
                mysql_real_escape_string($this->orientation),
                mysql_real_escape_string($this->struct),
                mysql_real_escape_string(json_encode($this->sources)),
                mysql_real_escape_string(json_encode($this->scripts)), 
                mysql_real_escape_string($modif));
            $resp = mysql_query($query);
            if(!$resp) {
                die("Fail to add the project record to database: ".mysql_error());
                return FALSE;
            }
        }
        return TRUE;
    }
    
    public static function getRelatProjectPath($pjName) {
        return './projects/'.$pjName;
    }
    public static function relatJSPathFor($pjName){
        return '/content.js';
    }

    public static function getExistProject($pjName) {
        if( !file_exists(MseProject::getRelatProjectPath($pjName)) ) return null;
        
        $owner = $_SESSION['uid'];
        $resp = mysql_query("SELECT * FROM Projects WHERE name='$pjName' AND owner='$owner' LIMIT 1");
        $pj = mysql_fetch_array($resp);
        
        $bkName = $pj['folder'];
        $width = $pj['width'];
        $height = $pj['height'];
        $orient = $pj['orientation'];
        
        $pj = new MseProject($pjName, $bkName, $width, $height);
        return $pj;
    }
}

?>