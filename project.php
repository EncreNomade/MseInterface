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
    private $ratio;

    function MseProject($pjName, $bkName, $width = 800, $height = 600, $orient = 'portrait') {
        $this->name = $pjName;
        $this->bookName = (is_null($bkName) || $bkName=="") ? $pjName : $bkName;
        $this->width = $width ? $width : 800;
        $this->height = $height ? $height : 600;
        $this->ratio = 480/$this->height;
        $this->orientation = $orient;
        $this->sources = array();
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
    
    function addSrc($name, $type, $src) {
        if(!array_key_exists($type, $this->sources))
            $this->sources[$type] = array();
        $this->sources[$type][$name] = $src;
    }
    function getSrc($name, $type) {
        if(array_key_exists($type, $this->sources) && array_key_exists($name, $this->sources[$type]))
            return $this->sources[$type][$name];
    }
    function getAllSrcs() {
        return $this->sources;
    }
    function resetSrcs() {
        array_splice($this->sources, 0, count($this->sources));
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
    
    public static function getRelatProjectPath($pjName) {
        return './projects/'.$pjName;
    }
    public static function relatJSPathFor($pjName){
        return '/content.js';
    }

    public static function getExistProject($pjName) {
        if( !file_exists(MseProject::getRelatProjectPath($pjName)) ) return null;
        // Load structure
        $structPath = './projects/'.$pjName.'/struct.xml';
        $struct = simplexml_load_file($structPath, "SimpleXMLElement", LIBXML_PARSEHUGE);
        if(is_null($struct)) return null;
        
        $bkName = (string)$struct['book'];
        $width = (string)$struct['width'];
        $height = (string)$struct['height'];
        $orient = (string)$struct['orient'];
        
        $pj = new MseProject($pjName, $bkName, $width, $height, $orient);
        return $pj;
    }
}

?>