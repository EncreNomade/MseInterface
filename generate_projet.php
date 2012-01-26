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

class ProjectGenerator {
    private $pj;
    private $root;
    private $autoid;
    private $startPageSet;
    
    private static $patterns = array(
        "depth" => "/z\-index:\s*(?P<depth>[\.\-\d]+)/",
        "width" => "/(^width|[\s;]width):\s*([\.\-\d]+)px/",
        "height" => "/(^height|[\s;]height):\s*([\.\-\d]+)px/",
        "top" => "/(^top|[\s;]top):\s*([\.\-\d]+)px/",
        "left" => "/(^left|[\s;]left):\s*([\.\-\d]+)px/",
        "color" => "/[\s;]color:\s*([\s\w\(\)\,\.]+);/",
        "bgColor" => "/background\-color:\s*([\s\w\(\)\,\.]+);/",
        "globalAlpha" => "/opacity:\s*([\d\.]{1,4})/",
        "fsize" => "/font\-size:\s*([\.\-\d]+)px/",
        "ffamily" => "/font\-family:\s*(\w+);/",
        "fweight" => "/font\-weight:\s*(\w+);/",
        "font" => "/font:\s*([\.\-\s\w]+);/",
        "textAlign" => "/text\-align:\s*(\w+);/",
        "lineHeight" => "/line\-height:\s*([\.\-\d]+)px/",
        "linkCutter" => "/<p>([\W\w]*)<span[\W\w]*>([\W\w]*)<\/span>([\W\w]*)<\/p>/"
    );

    function ProjectGenerator($project) {
        $this->pj = $project;
        $this->root = new SimpleXMLElement('<root></root>');
        $this->root->addAttribute('name', $project->getName());
        $this->root->addAttribute('book', $project->getBookName());
        $this->root->addAttribute('width', $project->getWidth());
        $this->root->addAttribute('height', $project->getHeight());
        $this->root->addAttribute('orient', $project->getOrientation());
        $this->root->addAttribute('id', 'root');
        $this->autoid = 0;
        $startPageSet = false;
        
        // Add all ressources to xml structure
        $srcs = $project->getAllSrcs();
        $types = array_keys($srcs);
        foreach( $types as $type ) {
            if($type == 'anime') continue;
            $names = array_keys($srcs[$type]);
            foreach( $names as $name ) {
                $srcnode = $this->root->addChild('src');
                $srcnode->addAttribute('name', $name);
                $srcnode->addAttribute('type', $type);
                $srcnode->addAttribute('path', $srcs[$type][$name]);
                $srcnode->addAttribute('preload', 'true');
            }
        }
        // Add all wikis to xml structure
        $wikis = $project->getWikis();
        foreach($wikis as $wiki) {
            $images = $wiki->getImages();
            $sections = $wiki->getSections();
            $wikinode = $this->root->addChild('wiki');
            $wikinode->addAttribute('id', $wiki->getId());
            foreach($sections as $section) {
                $sectionnode = $wikinode->addChild('wkSection', $section['content']);
                $sectionnode->addAttribute('title', $section['title']);
                $sectionnode->addAttribute('type', $section['type']);
            }
            foreach($images as $image) {
                $imgnode = $wikinode->addChild( 'wkImage', (array_key_exists('legend', $image) ? $image['legend'] : "") );
                $imgnode->addAttribute('src', $image['src']);
            }
        }
    }
 
    function addPage($pagenode) {
        // Init page
        $page = $this->root->addChild('page');
        // Init attributes
        $page->addAttribute('id', $pagenode['id']);
        $page->addAttribute('type', 'BaseContainer');
        if(!$this->startPageSet) $this->startPageSet = true;
        else $page->addAttribute('parent', 'null');
        // Param
        $param = $page->addChild('param');
        //self::appendParamsFromStyle($param, $pagenode['style'], $this->pj);
        $param->addChild("size", $this->pj->getWidth().",".$this->pj->getHeight());
        
        // Layers
        $layernodes = $pagenode->div;
        foreach( $layernodes as $layernode ) {
            $this->addLayer($layernode, $page);
        }
    }
    
    function addLayer($layernode, $page) {
        // Init Layer
        $layer = $page->addChild('layer');
        // Init attributes
        $layer->addAttribute('id', $layernode['id']);
        // Type
        $type = $layernode['type'];
        $layer->addAttribute('type', $type);
        // Z-index
        $style = $layernode['style'];
        $layer->addAttribute('depth', self::getDepthFromStyle($style));
        // Param
        $param = $layer->addChild('param');
        
        if($type == 'Layer') {
            self::appendParamsFromStyle($param, $style, $this->pj);
            if(is_null($param->size))
                $param->addChild("size", $this->pj->getWidth().",".$this->pj->getHeight());
                
            // Obj
            $objs = $layernode->children();
            foreach( $objs as $objnode ) {
                $this->addObject($objnode, $layer);
            }
        }
        
        // Supplement
        if($type == 'ArticleLayer') {
            $layernode = $layernode->div[0];
            $layer->addAttribute('defile', "1300");
            $style = $layernode['style'];
            self::appendParamsFromStyle($param, $style, $this->pj);
            if(is_null($param->size))
                $param->addChild("size", $this->pj->getWidth().",".$this->pj->getHeight());
            
            $width = (string)self::getWidthFromStyle($this->pj, $style);
            if(is_null($width)) $width = $this->pj->getWidth();
            $lineHeight = (string)$param->lineHeight[0];
            // Objs
            $objs = $layernode->div;
            foreach( $objs as $objnode ) {
                $this->addArticleObject($objnode, $layer, $width, $lineHeight);
            }
        }
    }
    
    function addObject($objnode, $layer) {
        // Analyse the type of object
        $type = "unknown";
        if(count($objnode->img) > 0) {
            // Image Obj
            $type = "img";
        }
        else if(count($objnode->children()) == 0) {
            // Rectangle obj
            $type = "mask";
        }
        else if(count($objnode->p) > 0) {
            // Text obj
            $type = "txt";
        }
        // Init Obj
        $obj = $layer->addChild('obj');
        // Init attributes
        $id = "autoid".$this->autoid;
        $this->autoid++;
        $obj->addAttribute('id', $id);
        $obj->addAttribute('type', $type);
        
        switch($type) {
        case "img":
            // Src name can be found in image name attribute
            $obj->addAttribute('src', $objnode->img[0]['name']);
            break;
        case "mask":
            break;
        case "txt":
            // Text content
            $obj->addAttribute('content', $objnode->p[0]);
            $obj->addAttribute('styled', 'true');
            break;
        default:
        }
        
        // Parameters
        $param = $obj->addChild('param');
        self::appendParamsFromStyle($param, $objnode['style'], $this->pj);
    }
    function addArticleObject($objnode, $layer, $width, $lineHeight) {
        $class = $objnode['class'];
        if($class == "del_container") return;
        // Init Obj
        $obj = $layer->addChild('obj');
        // Init common attributes
        $id = "autoid".$this->autoid;
        $this->autoid++;
        $obj->addAttribute('id', $id);
        $styled = true;
        // Analyse the type of object
        $type = "unknown";
        if($class == 'illu') {
            // Image Obj
            $type = "img";
            // Src name can be found in image name attribute
            $obj->addAttribute('src', $objnode->img[0]['name']);
        }
        else if($class == 'game') {
            $type = "game";
            // Class name
            $obj->addAttribute('class', $objnode['name']);
            $styled = false;
        }
        else if(count($objnode->children()) == 0) {
            // Rectangle obj
            $type = "obj";
        }
        else if(count($objnode->p) > 0) {
            // Text obj
            $type = "txt";
            // Detect link
            $p = $objnode->p;
            if(count($p->span) > 0){
                foreach($p->span as $link)
                    $this->addLink($link, $layer);
                preg_match(self::$patterns['linkCutter'], $p[0]->asXML(), $content);
                $content = $content[1].$content[2].$content[3];
            }
            else $content = $p;
            // Text content
            $obj->addAttribute('content', $content);
            $styled = true;
            $obj->addAttribute('styled', 'true');
        }
        $obj->addAttribute('type', $type);
        
        if($styled) {
            // Parameters
            $param = $obj->addChild('param');
            
            if($type == "txt")
                $param->addChild('size', $width.",".$lineHeight);
            // Image param
            else if($type == "img")
                self::appendParamsFromStyle($param, $objnode->img[0]['style'], $this->pj);
            else self::appendParamsFromStyle($param, $objnode['style'], $this->pj);
        }
    }
    function addLink($linknode, $layer) {
        $link = $layer->addChild('link');
        $link->addAttribute('src', $linknode);
        $index = count($layer->obj)-1;
        $link->addAttribute('index', $index);
        switch($linknode['class']) {
        case "audiolink":
            $link->addAttribute('type', 'audio');
            break;
        case "wikilink":
            $link->addAttribute('type', 'wiki');
            break;
        case "fblink":
            $link->addAttribute('type', 'fb');
            break;
        }
        if($linknode['link']) $link->addAttribute('link', $linknode['link']);
    }
    
    function getDoc() {
        return $this->root;
    }
    
    public static function getDepthFromStyle($style) {
        if(is_null($style)) return NULL;
        preg_match(self::$patterns['depth'], $style, $res);
        return $res['depth'];
    }
    public static function getWidthFromStyle($pj, $style) {
        if(is_null($style)) return NULL;
        preg_match(self::$patterns['width'], $style, $width);
        if( array_key_exists(2, $width) ) return $pj->realCoor($width[2]);
        else return NULL;
    }
    
    private static function appendParamsFromStyle($param, $style, $pj) {
        if(is_null($style)) return;
        preg_match(self::$patterns['width'], $style, $width);
        preg_match(self::$patterns['height'], $style, $height);
        preg_match(self::$patterns['left'], $style, $left);
        preg_match(self::$patterns['top'], $style, $top);
        preg_match(self::$patterns['color'], $style, $color);
        preg_match(self::$patterns['bgColor'], $style, $bgColor);
        preg_match(self::$patterns['globalAlpha'], $style, $alpha);
        preg_match(self::$patterns['fsize'], $style, $fsize);
        preg_match(self::$patterns['ffamily'], $style, $ffamily);
        preg_match(self::$patterns['fweight'], $style, $fweight);
        preg_match(self::$patterns['font'], $style, $font);
        preg_match(self::$patterns['textAlign'], $style, $textAlign);
        preg_match(self::$patterns['lineHeight'], $style, $lineHeight);
        if( array_key_exists(2, $width) && array_key_exists(2, $height) )
            $param->addChild('size', $pj->realCoor($width[2]).",".$pj->realCoor($height[2]));
        if( array_key_exists(2, $left) && array_key_exists(2, $top) )
            $param->addChild('pos', $pj->realCoor($left[2]).",".$pj->realCoor($top[2]));
        if( array_key_exists(1, $color) )
            $param->addChild('fillStyle', $color[1]);
        else if( array_key_exists(1, $bgColor) )
            $param->addChild('fillStyle', $bgColor[1]);
        if( array_key_exists(1, $alpha) )
            $param->addChild('globalAlpha', $alpha[1]);
        $fontSetted = false;
        if( array_key_exists(1, $fsize) ) {
            $fsize[1] = $pj->realCoor($fsize[1])."px";
            $fontSetted = true;
        }
        else $fsize[1] = "";
        if( array_key_exists(1, $ffamily) ) $fontSetted = true;
        else $ffamily[1] = "";
        if( array_key_exists(1, $fweight) ) $fontSetted = true;
        else $fweight[1] = "";
        if( $fontSetted ) $param->addChild('font', $fweight[1]." ".$fsize[1]." ".$ffamily[1]);
        if( array_key_exists(1, $font) )
            $param->addChild('font', $font[1]);
        if( array_key_exists(1, $textAlign) )
            $param->addChild('textAlign', $textAlign[1]);
        if( array_key_exists(1, $lineHeight) )
            $param->addChild('lineHeight', $pj->realCoor($lineHeight[1]));
    }
}

// AJAX POST check
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && isset($_SESSION['currPj'])) {
    // Read the input from stdin
    $xmlstr = file_get_contents('php://input');
    // Parse to xml doc
    $xml = simplexml_load_string($xmlstr, "SimpleXMLElement", LIBXML_PARSEHUGE);
    
    // Initialisation of project
    $pj = $_SESSION['currPj'];
    $projet = new ProjectGenerator($pj);
    
    //if(!$xml) echo "Parsing error\n";
    //else echo "DOMDoc: ".$xml->asXML();
    // Generate pages
    $pages = $xml->pages->div;
    foreach( $pages as $page ) {
        $projet->addPage($page);
    }
    
    $projet->getDoc()->asXML($pj->getRelatStructPath());
    
    //echo "Result: ".$projet->getDoc()->asXML();
}

?>