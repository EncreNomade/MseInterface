<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Octobre 2011
 */

ini_set("display_errors","1");
error_reporting(E_ALL);

class MseWiki {
    private $id;
    private $sections;
    private $images;
    private $font;
    private $fsize;
    private $fcolor;
    private static $autoid = 0;
    
    private static $patterns = array(
        "color" => "/[\s;]color:\s*([\s\w\(\)\,\.]+);/",
        "fsize" => "/font\-size:\s*([\.\-\d]+px)/",
        "ffamily" => "/font\-family:\s*(\w+);/"
    );

    function MseWiki($wikixml, $pj) {
        self::$autoid++;
        $this->id = 'wiki'.self::$autoid;
        $this->font = 'Verdana';
        $this->fsize = '12px';
        $this->fcolor = '#000';
        $this->images = array();
        $this->sections = array();
        // No content
        if(is_null($wikixml)) return null;
        $this->id = (string)$wikixml['id'];
        
        $font_setted = false;
        $cards = $wikixml->div;
        foreach($cards as $card) {
            if(count($card->h5) > 0) {
                // Image Card
                if(count($card->img) == 0) continue;
                $img = (string)$card->img[0]['name'];
                $legend = (string)$card->h5[0];
                $this->addImage($img, $legend);
                
                if(!$font_setted) {
                    $res = self::getFontFromStyle($legend['style']);
                    if($res != "") $this->font = $res;
                    $res = self::getFontSizeFromStyle($legend['style']);
                    if($res != "") $this->fsize = $pj->realCoor($res);
                    $res = self::getFontColorFromStyle($legend['style']);
                    if($res != "") $this->fcolor = $res;
                    $font_setted = true;
                }
            }
            else {
                if(!$font_setted) {
                    $res = self::getFontFromStyle($card->h3[0]['style']);
                    if($res != "") $this->font = $res;
                    $res = self::getFontSizeFromStyle($card->h3[0]['style']);
                    if($res != "") $this->fsize = $pj->realCoor($res);
                    $res = self::getFontColorFromStyle($card->h3[0]['style']);
                    if($res != "") $this->fcolor = $res;
                    $font_setted = true;
                }
                
                // Description Card
                $children = $card->children();
                for($i = 0, $length = count($children); $i < $length; ++$i){
                    // Find the title for section
                    if($children[$i]->getName() != 'h3') continue;
                    $title = (string)$children[$i++];
                    // Text section
                    if($children[$i]->getName() == 'h4') {
                        $content = (string)$children[$i];
                        $type = 'text';
                    }
                    // Link section
                    else if($children[$i]->getName() == 'img') {
                        $content = (string)$children[$i]['value'];
                        $type = 'link';
                    }
                    else continue;
                    $this->addSection($title, $type, $content);
                }
            }
        }
    }
    
    function addSection($title, $type, $content){
        if(is_null($title) || is_null($type) || is_null($content)) return;
        array_push($this->sections, array('title'=>$title, 'type'=>$type, 'content'=>$content));
    }
    function addImage($image, $legend){
        if(is_null($image)) return;
        array_push($this->images, array('src'=>$image, 'legend'=>$legend));
    }
    function getId(){
        return $this->id;
    }
    function getSections() {
        return $this->sections;
    }
    function getImages() {
        return $this->images;
    }
    
    public static function getFontFromStyle($style) {
        preg_match(self::$patterns['ffamily'], $style, $res);
        if( array_key_exists(1, $res) ) return $res[1];
        else return "";
    }
    public static function getFontColorFromStyle($style) {
        preg_match(self::$patterns['color'], $style, $res);
        if( array_key_exists(1, $res) ) return $res[1];
        else return "";
    }
    public static function getFontSizeFromStyle($style) {
        preg_match(self::$patterns['fsize'], $style, $res);
        if( array_key_exists(1, $res) ) return $res[1];
        else return "";
    }
}


class MseProject {
    private $name;
    private $bookName;
    private $width;
    private $height;
    private $orientation;
    private $sources;
    private $wikis;
    private $ratio;

    function MseProject($pjName, $bkName, $width = 800, $height = 600, $orient = 'portrait') {
        $this->name = $pjName;
        $this->bookName = (is_null($bkName) || $bkName=="") ? $pjName : $bkName;
        $this->width = $width ? $width : 800;
        $this->height = $height ? $height : 600;
        $this->ratio = 480/$this->height;
        $this->orientation = $orient;
        $this->sources = array();
        $this->wikis = array();
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
    function getWikis() {
        return $this->wikis;
    }
    function resetSrcs() {
        array_splice($this->sources, 0, count($this->sources));
        array_splice($this->wikis, 0, count($this->wikis));
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
    
    function addWiki($wiki) {
        if(!is_null($wiki)) array_push($this->wikis, $wiki);
    }
    function saveWikisFromXML($xml) {
        $this->wikis = array();
        $wikis = $xml->wiki;
        foreach($wikis as $wiki) {
            $elem = new MseWiki($wiki, $this);
            if(!is_null($elem)) array_push($this->wikis, $elem);
        }
    }
    
    public static function getRelatProjectPath($pjName) {
        return './projects/'.$pjName;
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