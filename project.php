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
    private $language;
    private $folder;
    private $width;
    private $height;
    private $orientation;
    private $sources;
    private $scripts;
    private $ratio;
    private $struct;
    private $creation;
    private $lastModif;
    private $currObjId;
    private $currSrcId;
    private $untranslated;
    private static $typeRegExp = "/(\w+)_((image)|(audio)|(game)|(anime)|(wiki))/";


    function MseProject($pjName, $lang, $folder="", $width = 800, $height = 600, $orient = 'portrait') {
        $numargs = func_num_args();
        // Initialization with only pjName && language
        if($numargs == 2) {
            $pjName = func_get_arg(0);
            $owner = $_SESSION['uid'];
            $resp = mysql_query("SELECT * FROM Projects WHERE name='$pjName' AND owner='$owner' AND language='$lang' LIMIT 1");
            if(!$resp) return FALSE; // No project exist
            
            $pj = mysql_fetch_array($resp);            
            
            $this->name = $pj['name'];
            $this->folder = $pj['folder'];
            $this->width = $pj['width'];
            $this->height = $pj['height'];
            $this->ratio = 480/$this->height;
            $this->orientation = $pj['orientation'];
            $this->creation = $pj['creation'];
            $this->currObjId = $pj['objId'];
            $this->currSrcId = $pj['srcId'];
            $this->lastModif = $pj['lastModif'];
            $this->language = $pj['language'];
            $this->untranslated = $pj['untranslated'];
            
            $struct = json_decode($pj['struct']);
            if($struct) $this->struct = get_object_vars($struct);
            $sources = json_decode($pj['sources']);
            if($sources) $this->sources = get_object_vars($sources);
            $scripts = json_decode($pj['scripts']);
            if($scripts) $this->scripts = get_object_vars($scripts);
            
            return;
        }
    
        $this->name = $pjName;
        $this->language = $lang;
        $this->folder = (is_null($folder) || $folder=="") ? $pjName : $folder;
        $this->width = $width ? $width : 800;
        $this->height = $height ? $height : 600;
        $this->ratio = 480/$this->height;
        $this->orientation = $orient;
        $this->sources = array();
        $this->scripts = array();
        $this->struct = array();
        $this->lastModif = time();
        $this->creation = time();
        $this->currObjId = 0;
        $this->currSrcId = 0;
        // Make directories in project folder
        if( !file_exists('projects/'.$this->name) ) mkdir('projects/'.$this->name);
        if( !file_exists('projects/'.$this->name.'/images') ) mkdir('projects/'.$this->name.'/images');
        if( !file_exists('projects/'.$this->name.'/audios') ) mkdir('projects/'.$this->name.'/audios');
        if( !file_exists('projects/'.$this->name.'/games') ) mkdir('projects/'.$this->name.'/games');
        
        if(checkPjExist($this->name, $this->language)) {echo "Fail to create project. Project already exist";return FALSE;}
        
        if(!isset($_SESSION['uid'])) {echo "Fail to create project. EditorUsers not login";return FALSE;}
        else $owner = $_SESSION['uid'];
        $id = $owner."_".$this->name;
        
        $query = sprintf("INSERT INTO Projects(owner,name,language,creation,folder,width,height,orientation,objId,srcId,lastModif) 
                        Value('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s', '%s')",
            mysql_real_escape_string($owner), 
            mysql_real_escape_string($this->name),
            mysql_real_escape_string($this->language),
            $this->creation,
            mysql_real_escape_string($this->folder),
            $this->width, $this->height, $this->orientation, 
            $this->currObjId, $this->currSrcId, $this->lastModif);
        $resp = mysql_query($query);
        if(!$resp) {
            die("Fail to add the project record to database: ".$this->name.' '.$this->language.mysql_error());
            return FALSE;
        }
    }
    
    function getName() { return $this->name; }
    function getLanguage() { return $this->language; }
    function getFolder() { return $this->folder; }
    function getWidth() { return $this->width; }
    function getHeight() { return $this->height; }
    function getOrientation() { return $this->orientation; }
    function getCreateTS() { return $this->creation; }
    function setCreateTS($creation) { $this->creation = $creation; }
    function getLastModTS() { return $this->lastModif; }
    function setLastModTS($lastMod) { $this->lastModif = $lastMod; }
    function getCurrObjId() { return $this->currObjId; }
    function setCurrObjId($objId) { if(is_int($objId))$this->currObjId = $objId; }
    function getCurrSrcId() { return $this->currSrcId; }
    function setCurrSrcId($srcId) { if(is_int($srcId))$this->currSrcId = $srcId; }
    function getUntranslated() { return $this->untranslated; }
    function setUntranslated($bool) {$this->untranslated = $bool; }
    
    function realCoor($coor) {
        return $coor / $this->ratio;
    }
    function sceneCoor($coor) {
        return $coor * $this->ratio;
    }
    
    function setStruct($struct){
        $this->struct = $struct;
    }
    function getStruct(){
        return $this->struct;
    }
    function isStructEmpty(){
        if(count($this->struct) != 0) return false;
        else return true;
    }
    
    function addSrc($name, $type, $src) {
        $this->sources[$name] = $src;
    }
    function getSrc($name, $type) {
        if(array_key_exists($name, $this->sources))
            return $this->sources[$name];
        else return null;
    }
    function getAllSrcs() {
        return $this->sources;
    }
    function resetSrcs($srcs) {
        if($srcs) $this->sources = $srcs;
        else $this->sources = array();
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
    function resetScripts($scripts){
        if(!is_null($scripts)) $this->scripts = $scripts;
        else $this->scripts = array();
    }
    
    function getSrcSavePath($type) {
        switch($type) {
        case "image" : return './projects/'.$this->folder.'/images/';break;
        case "audio" : return './projects/'.$this->folder.'/audios/';break;
        case "game" : return './projects/'.$this->folder.'/games/';break;
        }
    }
    function getRelatSrcPath($type) {
        switch($type) {
        case "image" : return './'.$this->folder.'/images/';break;
        case "audio" : return './'.$this->folder.'/audios/';break;
        case "game" : return './'.$this->folder.'/games/';break;
        }
    }
    
    function getRelatJSPath(){
        return './projects/'.$this->name.'/content_'.$this->language.'.js';
    }
    function getPackedJSPath(){
        return './projects/'.$this->name.'/content_'.$this->language.'.min.js';
    }
    
    function getJSONProject(){
        $pjsave = array();
        $pjsave['pageSeri'] = $this->struct;
        $pjsave['sources'] = $this->sources;
        $pjsave['scripts'] = $this->scripts;
        $pjsave['objCurrId'] = $this->currObjId;
        $pjsave['srcCurrId'] = $this->currSrcId;
        $pjsave['lastModif'] = $this->lastModif;
        return json_encode($pjsave);
    }
    
    function saveToDB() {
        if(!isset($_SESSION['uid'])) return;
        $owner = $_SESSION['uid'];
        $name = $this->name;
        $lang = $this->language;
        $this->lastModif = time();
        
        $resp = mysql_query("SELECT * FROM Projects WHERE owner='$owner' AND name='$name' AND language='$lang' LIMIT 1");
        $exist = mysql_fetch_array($resp);
        
        if($exist) {
            $query = sprintf("UPDATE Projects SET width='%s', height='%s', struct='%s', sources='%s', scripts='%s', objId='%s', srcId='%s', lastModif='%s', untranslated='%s' WHERE owner='%s' AND name='%s' AND language='%s'", 
                $this->width, $this->height, 
                mysql_real_escape_string(json_encode($this->struct)), 
                mysql_real_escape_string(json_encode($this->sources)), 
                mysql_real_escape_string(json_encode($this->scripts)), 
                $this->currObjId, $this->currSrcId, $this->lastModif, 
                $this->untranslated,
                mysql_real_escape_string($owner),
                mysql_real_escape_string($name),
                mysql_real_escape_string($lang));
            $resp = mysql_query($query);
            if(!$resp) {
                echo "Fail to update the project record: ".mysql_error();
                return FALSE;
            }
        }
        else {
            echo "Fail to add the project record to database";
            return FALSE;
        }
        return $this->lastModif;
    }
    
    function createTranslation($lang = false){
        if(!$lang) return false;
        $newPj = new self($this->name, $lang, $this->folder, $this->width, $this->height, $this->orientation);
        $newPj->setStruct($this->struct);
        $newPj->resetSrcs($this->sources);
        $newPj->resetScripts($this->scripts);
        $newPj->setCurrObjId( intval($this->currObjId) );
        $newPj->setCurrSrcId( intval($this->currSrcId) );
        $newPj->setUntranslated(1);
        $newPj->saveToDB();
        return $newPj;
    }
    
    public static function getRelatProjectPath($pjName) {
        return './projects/'.$pjName;
    }
    public static function relatJSPathFor($pjName){
        return '/content.js';
    }

    public static function getExistProject($pjName, $lang = 'francais') {
        $pj = new MseProject($pjName, $lang);
        return $pj;
    }
}

?>