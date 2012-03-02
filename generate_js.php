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
    }
    
    function generateJS(){
        if(is_null($this->pj) || is_null($this->pj->getStruct())) return "alert('JS Generation failed')";
        $this->jstr = "";
        // Initiale Mse system
        $this->jstr .= "initMseConfig();";
        $this->jstr .= "mse.init();";
        // Initiale root
        $this->jstr .= "var root = new mse.Root('".$this->pj->getName()."',".$this->pj->getWidth().",".$this->pj->getHeight().",'".$this->pj->getOrientation()."');";
        $this->autoid = 0;
        $startPageSet = false;
        $this->jstr .= "var temp = {};";
        
        // Add all ressources to xml structure
        $this->jstr .= "var animes={};";
        $this->jstr .= "var games={};";
        $this->jstr .= "var wikis={};";
        $srcs = $this->pj->getAllSrcs();
        foreach( $srcs as $name=>$src ) {
            $type = $this->pj->typeForSrc($name);
            switch($type){
            case "image": case "audio":
                if($type == "image") {
                    $t = "img";
                    $preload = "true";
                    // Change path with relative in folder of project
                    $src = preg_replace("/\S+(\/images\/)/", '.$1', $src, 1);
                }
                else {$t = "aud";$preload = "false";}
                $this->jstr .= "mse.src.addSource('$name','".$src."','$t',$preload);";
                break;
                
            case "game":
// ADD source js file to html
                $this->jstr .= "games.$name=new $name();";
                break;
                
            case "anime":
                $repeat = $src->repeat;
                $static = $src->statiq;
                $animeFrs = $src->frames;
                $animeObjs = get_object_vars($src->objs);
                // Calcule total frame duration
                $duration = 0;
                // Frame table
                $frames = array();
                foreach( $animeFrs as $frame ) {
                    // Transform second to frame
                    $interval = round($frame->interval*25);
                    array_push($frames, $duration);
                    $duration += $interval;
                }
                array_push($frames, $duration);
                // Initialisation of animation
                $this->jstr .= "animes.$name=new mse.Animation($duration,$repeat,$static);";
                // Obj list
                $objlist = array();
                $nbFr = count($animeFrs);
                // Array of frames
                for( $f = 0; $f < $nbFr; ++$f ){
                    $frame = $animeFrs[$f];
                    $objs = get_object_vars($frame->objs);
                    $tranpos = $frame->trans->pos;
                    $transize = $frame->trans->size;
                    $tranopac = $frame->trans->opac;
                    $tranfont = $frame->trans->font;
                    // Array of objs
                    foreach( $objs as $key=>$params ) {
                        $w = $params->w; $h = $params->h;
                        $sx = $params->sx; $sy = $params->sy;
                        $sw = $params->sw; $sh = $params->sh;
                        $dx = $params->dx; $dy = $params->dy;
                        $dw = $params->dw; $dh = $params->dh;
                        $opacity = $params->opacity;
                        $t = $animeObjs[$key]->type;
                        
                        // First initialization of objet, add to objlist array
                        if(!array_key_exists($key, $objlist)){
                            switch($t) {
                            case "image":
                                $this->jstr .= "temp.obj=new mse.Image(null,{'pos':[$dx,$dy],'size':[$dw,$dh]},'$key');";
                                $this->jstr .= "animes.$name.addObj('$key',temp.obj);";
                                $objlist[$key] = array("params"=>get_object_vars($params),"animes"=>array()); break;
                            case "spriteRecut":
                                $this->jstr .= "temp.obj=new mse.Sprite(null,{'pos':[$dx,$dy],'size':[$dw,$dh]},'$key',[[$sx,$sy,$sw,$sh]]);";
                                $this->jstr .= "animes.$name.addObj('$key',temp.obj);";
                                $spriteFrCount = 0;
                                $objlist[$key] = array("params"=>get_object_vars($params),"animes"=>array()); break;
                            }
                        }
                        else {
                            // Previous parameters
                            $prevsx = $objlist[$key]["params"]['sx']; $prevsy = $objlist[$key]["params"]['sy'];
                            $prevsw = $objlist[$key]["params"]['sw']; $prevsh = $objlist[$key]["params"]['sh'];
                            $prevdx = $objlist[$key]["params"]['dx']; $prevdy = $objlist[$key]["params"]['dy'];
                            $prevdw = $objlist[$key]["params"]['dw']; $prevdh = $objlist[$key]["params"]['dh'];
                            $prevopac = $objlist[$key]["params"]['opacity'];
                            // Analyse of animations
                            $animes = &$objlist[$key]["animes"];
                            
                            if($t == 'spriteRecut') {
                                if($prevsx!=$sx || $prevsy!=$sy || $prevsw!=$sw || $prevsh!=$sh){
                                    $this->jstr .= "temp.obj.appendFrame([$sx,$sy,$sw,$sh]);";
                                    // spriteSeq
                                    if(!array_key_exists('spriteSeq', $animes)) $animes['spriteSeq']=array();
                                    // Fill the table of animation of spriteSeq before the current frame
                                    for($i = count($animes['spriteSeq']); $i < $f; ++$i)
                                        array_push($animes['spriteSeq'], $spriteFrCount);
                                    $spriteFrCount++;
                                }
                            }
                            // Pos
                            if($dx != $prevdx || $dy != $prevdy){
                                if(!array_key_exists('pos', $animes)) $animes['pos']=array();
                                $pos = $tranpos==2 ? array($prevdx,$prevdy)
                                                   : array($prevdx,$prevdy,$tranpos);
                                for($i = count($animes['pos']); $i < $f; ++$i)
                                    array_push($animes['pos'], $pos);
                            }
                            // Size
                            if($dw != $prevdw || $dh != $prevdh){
                                if(!array_key_exists('size', $animes)) $animes['size']=array();
                                $size = $transize==2 ? array($prevdw,$prevdh)
                                                     : array($prevdw,$prevdh,$transize);
                                for($i = count($animes['size']); $i < $f; ++$i)
                                    array_push($animes['size'], $size);
                            }
                            // Opactiy
                            if($opacity != $prevopac){
                                if(!array_key_exists('opacity', $animes)) $animes['opacity']=array();
                                $opac = $tranopac==2 ? $prevopac : array($prevopac,$tranopac);
                                for($i = count($animes['opacity']); $i < $f; ++$i)
                                    array_push($animes['opacity'], $opac);
                            }
                        }
                        
                        // Last frame, complete animations
                        if($f == $nbFr-1){
                            foreach( $objlist[$key]["animes"] as $p=>$seq ) {
                                switch($p) {
                                case 'spriteSeq':
                                    for($i = count($seq); $i <= $nbFr; ++$i)
                                        array_push($seq, $spriteFrCount);
                                break;
                                case 'pos':
                                    $pos = array($dx,$dy);
                                    for($i = count($seq); $i <= $nbFr; ++$i)
                                        array_push($seq, $pos);
                                break;
                                case 'size':
                                    $size = array($dw,$dh);
                                    for($i = count($seq); $i <= $nbFr; ++$i)
                                        array_push($seq, $size);
                                break;
                                case 'opacity':
                                    for($i = count($seq); $i <= $nbFr; ++$i)
                                        array_push($seq, $opacity);
                                break;
                                }
                                $objlist[$key]["animes"][$p] = $seq;
                            }
                        }
                        // Update previous parameters state
                        $objlist[$key]["params"] = get_object_vars($params);
                    }
                }
                // Generate animation
                foreach($objlist as $key=>$obj) {
                    $this->jstr .= "animes.$name.addAnimation('$key',{'frame':JSON.parse('".json_encode($frames)."')";
                    // All animations for this obj
                    $animes = $obj['animes'];
                    foreach($animes as $p=>$seq)
                        $this->jstr .= ",'$p':JSON.parse('".json_encode($seq)."')";
                    $this->jstr .= "});";
                }
                break;
                
            case "wiki":
                $this->jstr .= "wikis.$name=new mse.WikiLayer();";
                foreach( $src->cards as $card ){
                    if( $card->type == "text" ) {
                        $this->jstr .= "wikis.$name.addTextCard();";
                        foreach($card->sections as $section) {
                            if($section->type == "link")
                                $this->jstr .= "wikis.$name.textCard.addLink('$section->title', '$section->content');";
                            else if($section->type == "text")
                                $this->jstr .= "wikis.$name.textCard.addSection('$section->title', '$section->content');";
                        }
                    }
                    else if( $card->type == "img" ){
                        $this->jstr .= "wikis.$name.addImage('$card->image', '$card->legend');";
                    }
                }
                break;
            }
        }
        
        // Pages
        $this->jstr .= "var pages = {};";
        $this->jstr .= "var layers = {};";
        $this->jstr .= "var objs = {};";
        
        // Generate pages
        $pages = get_object_vars($this->pj->getStruct());
        foreach( $pages as $id => $page ) {
            $this->addPage($id, $page);
        }
        
        $this->jstr .= "var action={};";
        $this->jstr .= "var reaction={};";
        $scripts = $this->pj->getAllScripts();
        if( isset($scripts) ) {
            // Register scripts
            foreach( $scripts as $name => $script ){
                $src = "";
                if(!property_exists($script, 'src') || !property_exists($script, 'target') || !property_exists($script, 'srcType') || !property_exists($script, 'action') || !property_exists($script, 'reaction')) continue;
                switch($script->srcType) {
                case "obj": $src = 'objs.'.$script->src;break;
                case "page": $src = 'pages.'.$script->src;break;
                case "layer": $src = 'layers.'.$script->src;break;
                case "anime": $src = 'animes.'.$script->src;break;
                }
                if($src == "") continue;
                $tar = $script->target;
                $action  = $script->action;
                $reaction = $script->reaction;
                $immediate = property_exists($script, 'immediate') ? $script->immediate : true;
                $supp = property_exists($script, 'supp') ? $script->supp : NULL;
                
                $codeReact = "";
                $error = false;
                switch($reaction) {
                case "pageTrans": 
                    $codeReact = "root.transition(pages.$tar);";break;
                case "objTrans": 
                    if(is_null($supp)) continue;
                    $codeReact = "temp.width=objs.$tar.getWidth();temp.height=objs.$tar.getHeight();";
                    $codeReact .= "temp.boundingbox=imgBoundingInBox('$supp',temp.width,temp.height);";
                    $codeReact .= "temp.obj=new mse.Image(objs.$tar.parent,temp.boundingbox,'$supp');";
                    $codeReact .= "mse.transition(objs.$tar,temp.obj,25);";
                    break;
                case "playAnime": 
                    $codeReact = "animes.$tar.start();";break;
                case "changeCursor": 
                    $codeReact .= "mse.setCursor(mse.src.getSrc('$tar').src);";break;
                case "playVoice": 
                    $codeReact = "mse.src.getSrc('$tar').play();";break;
                case "addScript": 
                    $codeReact = "mse.Script.register(action.$tar,reaction.$tar);";break;
                case "script": 
//!!! Danger of security of not???
                    $codeReact = $tar;break;
                case "effet": break;
                case "playDefi": 
                    $codeReact = "layers.$tar.play();";break;
                case "pauseDefi": 
                    $codeReact = "layers.$tar.interrupt();";break;
                case "loadGame": 
                    $codeReact = "games.$tar.start();";break;
                }
                $this->jstr .= "action.$name=[{src:$src,type:'$action'}];";
                $this->jstr .= "reaction.$name=function(){ $codeReact };";
                if($immediate) $this->jstr .= "mse.Script.register(action.$name,reaction.$name);";
            }
        }
        
        // Start the book
        $this->jstr .= "mse.currTimeline.start();";
        
        return $this->jstr;
    }
 
    function addPage($id, $pagenode) {
        if(!$this->startPageSet) {$this->startPageSet = true;$parent = "root";}
        else $parent = "null";
        // Init page
        $page = "pages.$id";
        $this->jstr .= $page."=new mse.BaseContainer($parent,{size:[".$this->pj->getWidth().",".$this->pj->getHeight()."]});";
        
        // Layers
        foreach( $pagenode as $layer ) {
            $layer = stripslashes($layer);
            $layer = preg_replace("/<\/img>/", "", $layer);
            $layer = preg_replace("/(<img[^>]*)(>)/", "$1/>", $layer);
            $layer = preg_replace("/[^\$]nbsp;/", '$nbsp;', $layer);
            $layernode = simplexml_load_string($layer, "SimpleXMLElement", LIBXML_PARSEHUGE);
            $this->addLayer($layernode, $page);
        }
    }
    
    function addLayer($layernode, $page) {
        // Traitement of info
        $id = $layernode['id'];
        $type = $layernode['type'];
        $style = $layernode['style'];
        $depth = self::getDepthFromStyle($style);
        $layer = "layers.".$id;
        
        if($type == 'Layer') {
            // Param
            $params = self::formatParams($style, $this->pj);
            if(!array_key_exists('size', $params))
                $params['size'] = array($this->pj->getWidth(), $this->pj->getHeight());
            if(!array_key_exists('globalAlpha', $params))
                $params['globalAlpha'] = 1;
            $this->jstr .= "$layer=new mse.Layer($page,$depth,JSON.parse('".json_encode($params)."'));";
            // Obj
            $objs = $layernode->children();
            foreach( $objs as $objnode ) {
                $this->addObject($objnode, $layer);
            }
        }
        else if($type == 'ArticleLayer') {
            $layernode = $layernode->div[0];
            $style = $layernode['style'];
            // Param
            $params = self::formatParams($style, $this->pj);
            if(!array_key_exists('size', $params))
                $params['size'] = array($this->pj->getWidth(), $this->pj->getHeight());
            if(!array_key_exists('globalAlpha', $params))
                $params['globalAlpha'] = 1;
            $params['textBaseline'] = 'top';
            $this->jstr .= "$layer=new mse.ArticleLayer($page,$depth,JSON.parse('".json_encode($params)."'),null);";
            
            $width = self::getWidthFromStyle($this->pj, $style);
            if(is_null($width)) $width = $this->pj->getWidth();
            $lineHeight = $params['lineHeight'];
            // Objs
            $objs = $layernode->div;
            $index = 0;
            foreach( $objs as $objnode ) {
                $this->addArticleObject($objnode, $layer, $width, $lineHeight, $index);
                $index++;
            }
            if($layernode['defile'] == "true") {
                $this->jstr .= "$layer.setDefile(1300);";
                $this->jstr .= "temp.layerDefile=$layer;";
            }
        }
        
        $this->jstr .= "$page.addLayer('$id',$layer);";
    }
    
    function addObject($objnode, $layer) {
        $id = is_null($objnode['id']) ? 'temp' : $objnode['id'];
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
        $obj = "objs.".$id;
        // Init attributes
        //$id = "autoid".$this->autoid;
        //$this->autoid++;
        $params = json_encode(self::formatParams($objnode['style'], $this->pj));
        
        switch($type) {
        case "img":
            // Src name can be found in image name attribute
            $this->jstr .= "$obj=new mse.Image($layer,JSON.parse('$params'),'".$objnode->img[0]['name']."');";
            break;
        case "mask":
            $this->jstr .= "$obj=new mse.Mask($layer,JSON.parse('$params'));";
            break;
        case "txt":
            // Text content
            $this->jstr .= "$obj=new mse.Text($layer,JSON.parse('$params'),'".$objnode->p[0]."',true);";
            break;
        default:
            $this->jstr .= "$obj=new mse.UIObject($layer,JSON.parse('$params'));";break;
        }
        
        $this->jstr .= "$layer.addObject($obj);";
    }
    function addArticleObject($objnode, $layer, $width, $lineHeight, $index) {
        $id = is_null($objnode['id']) ? 'temp' : $objnode['id'];
        $class = $objnode['class'];
        if($class == "del_container") return;
        // Init Obj
        $obj = "objs.".$id;
        // Analyse the type of object
        $type = "unknown";
        if($class == 'illu') {
            $type = "img";
            $params = json_encode(self::formatParams($objnode->img[0]['style'], $this->pj));
            $this->jstr .= "$obj=new mse.Image($layer,JSON.parse('$params'),'".$objnode->img[0]['name']."');";
        }
        else if($class == 'game') {
            $type = "game";
            $classname = $objnode['name'];
            $this->jstr .= "$obj=new $classname();";
        }
        else if(count($objnode->children()) == 0) {
            // Rectangle obj
            $type = "obj";
            $params = json_encode(self::formatParams($objnode['style'], $this->pj));
            $this->jstr .= "$obj=new mse.UIObject($layer,JSON.parse('$params'));";
        }
        else if(count($objnode->p) > 0) {
            // Text obj
            $type = "txt";
            $params = json_encode(array('size' => array($width, $lineHeight)));
            
            // Detect link
            $p = $objnode->p;
            if(count($p->span) > 0){
                preg_match(self::$patterns['linkCutter'], $p[0]->asXML(), $content);
                $content = $content[1].$content[2].$content[3];
                $this->jstr .= "$obj=new mse.Text($layer,JSON.parse('$params'),'$content',true);";
                foreach($p->span as $link)
                    $this->addLink($link, $obj, $index);
            }
            else {
                $content = $p;
                $this->jstr .= "$obj=new mse.Text($layer,JSON.parse('$params'),'$content',true);";
            }
        }
        
        if($type == "game") $this->jstr .= "$layer.addGame($obj);";
        else $this->jstr .= "$layer.addObject($obj);";
    }
    function addLink($linknode, $obj, $index) {
        $src = $linknode;
        $link = "null";
        switch($linknode['class']) {
        case "audiolink":
            $type = 'audio';
            if($linknode['link']) $link = "mse.src.getSrc('".$linknode['link']."')";
            break;
        case "wikilink":
            $type = 'wiki';
            if($linknode['link']) $link = "wikis.".$linknode['link'];
            break;
        case "fblink":
            $type = 'fb';
            if($linknode['link']) $link = "'".$linknode['link']."'";
            break;
        }
        $this->jstr .= "$obj.addLink(new mse.Link('$src',$index,'$type',$link));";
    }
    
    function getDoc() {
        return $this->root;
    }
    
    public static function getDepthFromStyle($style) {
        if(is_null($style)) return 0;
        preg_match(self::$patterns['depth'], $style, $res);
        if(array_key_exists('depth', $res)) return $res['depth'];
        else return 0;
    }
    public static function getWidthFromStyle($pj, $style) {
        if(is_null($style)) return NULL;
        preg_match(self::$patterns['width'], $style, $width);
        if( array_key_exists(2, $width) ) return $pj->realCoor($width[2]);
        else return NULL;
    }
    
    private static function formatParams($style, $pj){
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
if($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' && array_key_exists('pj', $_POST)) {
    // Initialisation of project
    $pjName = $_POST['pj'];
    if(array_key_exists($pjName, $_SESSION)) {
        $pj = $_SESSION[$pjName];
        $generator = new ProjectGenerator($pj);
        $js = $generator->generateJS();
        
        $path = $pj->getRelatJSPath();
        // System mse
        file_put_contents($path, file_get_contents("projects/mse.js"));
        // Project content
        file_put_contents($path, $js, FILE_APPEND);
    }
    else echo "Fail to generate project.";
}

?>