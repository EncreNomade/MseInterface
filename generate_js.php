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
    private $jstr;
    
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
        // Initiale root
        $this->jstr = "var root = new mse.Root(\'".$project->getName()."\',".$project->getWidth().",".$project->getHeight().",\'".$project->getOrientation()."\');";
        $this->autoid = 0;
        $startPageSet = false;
        
        // Add all ressources to xml structure
        $srcs = $project->getAllSrcs();
        $types = array_keys($srcs);
        foreach( $types as $type ) {
            switch($type) {
            case "image": case "audio":
                if($type == "image") {$type = "img";$preload = "true";}
                else {$type = "aud";$preload = "false";}
                $names = array_keys($srcs[$type]);
                foreach( $names as $name )
                    $this->jstr .= "mse.src.addSource(\'".$name."\',\'".$srcs[$type][$name]."\',\'".$type."\',".$preload.");";
            break;
            case "game":break;
            case "anime":
            break;
            }
        }
        // Add all wikis to xml structure
        $wikis = $project->getWikis();
        $this->jstr .= "var wikis={};";
        foreach($wikis as $wiki) {
            $images = $wiki->getImages();
            $sections = $wiki->getSections();
            $this->jstr .= "wikis.".$wiki->getId()."=new mse.WikiLayer();";
            foreach($sections as $section) {
                if($section['type'] == 'text')
                    $this->jstr .= "wikis.".$wiki->getId().".addExplication(\'".$section['title']."\',\'".$section['content']."\');";
                else if($section['type'] == 'link')
                    $this->jstr .= "wikis.".$wiki->getId().".addLink(\'".$section['title']."\',\'".$section['content']."\');";
            }
            foreach($images as $image) {
                $legend = (array_key_exists('legend', $image) ? $image['legend'] : "");
                $this->jstr .= "wikis.".$wiki->getId().".addImage(\'".$image['src']."\',\'".$legend."\');";
            }
        }
        
        // Pages
        $this->jstr .= "var pages = {};";
        $this->jstr .= "var temp = {};";
    }
 
    function addPage($pagenode) {
        if(!$this->startPageSet) {$this->startPageSet = true;$parent = "root";}
        else $parent = "null";
        // Init page
        $page = "pages.".$pagenode['id'];
        $this->jstr .= $page."=new mse.BaseContainer(".$parent.",{size:[".$this->pj->getWidth().",".$this->pj->getHeight()."]});";
        
        // Layers
        $layernodes = $pagenode->div;
        foreach( $layernodes as $layernode ) {
            $this->addLayer($layernode, $page);
        }
    }
    
    function addLayer($layernode, $page) {
        // Traitement of info
        $id = $layernode['id'];
        $type = $layernode['type'];
        $depth = self::getDepthFromStyle($style);
        $layer ＝ "temp.".$id;
        
        if($type == 'Layer') {
            $style = $layernode['style'];
            // Param
            $params = $this->formatParams($style, $this->pj);
            if(array_key_exists('size', $params))
                $params['size'] = array($this->pj->getWidth(), $this->pj->getHeight());
            $this->jstr .= $layer."=new mse.Layer($page,$depth,JSON.parse(".json_encode($params)."));";
            // Obj
            $objs = $layernode->children();
            foreach( $objs as $objnode ) {
                $this->addObject($objnode, $layer);
            }
        }

        // Supplement
        if($type == 'ArticleLayer') {
            $layernode = $layernode->div[0];
            $style = $layernode['style'];
            // Param
            $params = $this->formatParams($style, $this->pj);
            if(array_key_exists('size', $params))
                $params['size'] = array($this->pj->getWidth(), $this->pj->getHeight());
            $this->jstr .= $layer."=new mse.ArticleLayer($page,$depth,JSON.parse(".json_encode($params)."),null);";
            $this->jstr .= $layer.".setDefile(1300);";
            
            $width = (string)self::getWidthFromStyle($this->pj, $style);
            if(is_null($width)) $width = $this->pj->getWidth();
            $lineHeight = (string)$param->lineHeight[0];
            // Objs
            $objs = $layernode->div;
            foreach( $objs as $objnode ) {
                $this->addArticleObject($objnode, $layer, $width, $lineHeight);
            }
        }
        
        $this->jstr .= $page.".addLayer(\'".$id."\',".$layer.");";
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
        $obj = "temp.obj";
        // Init attributes
        //$id = "autoid".$this->autoid;
        //$this->autoid++;
        $params = json_encode($this->formatParams($objnode['style'], $this->pj));
        
        switch($type) {
        case "img":
            // Src name can be found in image name attribute
            $this->jstr .= "$obj=new mse.Image($layer,JSON.parse($params),\'".$objnode->img[0]['name']."\');";
            break;
        case "mask":
            $this->jstr .= "$obj=new mse.Mask($layer,JSON.parse($params));";
            break;
        case "txt":
            // Text content
            $this->jstr .= "$obj=new mse.Text($layer,JSON.parse($params),\'".$objnode->p[0]."\',true);";
            break;
        default:
            $this->jstr .= "$obj=new mse.UIObject($layer,JSON.parse($params));";break;
        }
        
        $this->jstr .= "$layer.addObject($obj);";
    }
    function addArticleObject($objnode, $layer, $width, $lineHeight) {
        $class = $objnode['class'];
        if($class == "del_container") return;
        // Init Obj
        $obj = "temp.obj";
        // Init common attributes
        //$id = "autoid".$this->autoid;
        //$this->autoid++;
        // Analyse the type of object
        $type = "unknown";
        if($class == 'illu') {
            $type = "img";
            $params = json_encode($this->formatParams($objnode->img[0]['style'], $this->pj));
            $this->jstr .= "$obj=new mse.Image($layer,JSON.parse($params),\'".$objnode->img[0]['name']."\');";
        }
        else if($class == 'game') {
            $type = "game";
            $classname = $objnode['name'];
            $this->jstr .= "$obj=new $classname();";
        }
        else if(count($objnode->children()) == 0) {
            // Rectangle obj
            $type = "obj";
            $params = json_encode($this->formatParams($objnode['style'], $this->pj));
            $this->jstr .= "$obj=new mse.UIObject($layer,JSON.parse($params));";
        }
        else if(count($objnode->p) > 0) {
            // Text obj
            $type = "txt";
            $params = json_encode(array('size' => $width.",".$lineHeight));
            
            // Detect link
            $p = $objnode->p;
            if(count($p->span) > 0){
                preg_match(self::$patterns['linkCutter'], $p[0]->asXML(), $content);
                $content = $content[1].$content[2].$content[3];
                $this->jstr .= "$obj=new mse.Text($layer,JSON.parse($params),\'$content\',true);";
                foreach($p->span as $link)
                    $this->addLink($link, $obj);
            }
            else {
                $content = $p;
                $this->jstr .= "$obj=new mse.Text($layer,JSON.parse($params),\'$content\',true);";
            }
        }
        
        if($type == "game") $this->jstr .= "$layer.addGame($obj);";
        else $this->jstr .= "$layer.addObject($obj);";
    }
    function addLink($linknode, $obj) {
        $src = $linknode;
        $index = count($layer->obj)-1;
        switch($linknode['class']) {
        case "audiolink":
            $type = 'audio';break;
        case "wikilink":
            $type = 'wiki';break;
        case "fblink":
            $type = 'fb';break;
        }
        if($linknode['link']) $link = $linknode['link'];
        else $link = "null";
        $this->jstr .= "$obj.addLink(new mse.Link($src,$index,$type,$link));";
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
    
    function formatParams($style, $pj){
        if(is_null($style) || is_null($pj)) return;
        $param = array();
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
            $param['size'] = array($pj->realCoor($width[2]), $pj->realCoor($height[2]));
        if( array_key_exists(2, $left) && array_key_exists(2, $top) )
            $param['pos'] = array($pj->realCoor($left[2]), $pj->realCoor($top[2]));
        if( array_key_exists(1, $color) )
            $param['fillStyle'] = $color[1];
        else if( array_key_exists(1, $bgColor) )
            $param['fillStyle'] = $bgcolor[1];
        if( array_key_exists(1, $alpha) )
            $param['globalAlpha'] = $alpha[1];
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
        if( $fontSetted ) $param['font'] = $fweight[1]." ".$fsize[1]." ".$ffamily[1];
        if( array_key_exists(1, $font) )
            $param['font'] = $font[1];
        if( array_key_exists(1, $textAlign) )
            $param['textAlign'] = $textAlign[1];
        if( array_key_exists(1, $lineHeight) )
            $param['lineHeight'] = $pj->realCoor($lineHeight[1]);
            
        return $param;
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