<?php
/*
 * Author: LING Huabin @Pandamicro
 * Mail: lphuabin@gmail.com
 * Site: pandamicro.co.cc
 * Janvier 2012
 */

class ProjectGenerator {
    private $pj;
    private $root;
    private $autoid;
    private $startPageSet;
    private $jstr;
    private $coords;
    private $pjWidth;
    private $pjHeight;
    private $scriptExt;
    
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
        "textBaseline" => "/vertical\-align:\s*(\w+);/",
        "lineHeight" => "/line\-height:\s*([\.\-\d]+)px/",
        "linkCutter" => "/<p>([\W\w]*)<span[\W\w]*>([\W\w]*)<\/span>([\W\w]*)<\/p>/"
    );

    function ProjectGenerator($project) {
        $this->pj = $project;
        $this->coords = array();
        $this->scriptExt = array();
    }
    
    function putAllinContentJS() {
        $path = $this->pj->getRelatJSPath();
        $js = $this->generateJS();
        // System mse
        $content = file_get_contents("projects/mse.js");
        //file_put_contents($path, file_get_contents("projects/mse.js"));
        // External js (game)
        foreach($this->scriptExt as $extjs) {
            if(file_exists($extjs))
                $content .= file_get_contents($extjs);
                //file_put_contents($path, file_get_contents($extjs), FILE_APPEND);
        }
        // Project content
        $content .= $js;
        //file_put_contents($path, $js, FILE_APPEND);
        
        // Communicate with Google Closure Compiler
        $ch = curl_init('http://closure-compiler.appspot.com/compile');
         
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS&js_code=' . urlencode($content));
        //$output = curl_exec($ch);
        curl_close($ch);
        
        file_put_contents($path, $content);
    }
    
    function encodedCoord($number){
        if(is_numeric($number)) {
            $key = array_search($number, $this->coords);
            // Not exist
            if($key === FALSE){
                $key = "cid".count($this->coords);
                $this->coords[$key] = $number;
            }
            return "mse.coor('$key')";
        }
        return '0';
    }
    
    function generateJS(){
        if(is_null($this->pj) || is_null($this->pj->getStruct())) return "alert('JS Generation failed')";
        $this->pjWidth = intval($this->pj->getWidth());
        $this->pjHeight = intval($this->pj->getHeight());
        $this->jstr = "";
        // Initiale Mse system
        $this->jstr .= "initMseConfig();";
        $this->jstr .= "mse.init();";
        $this->jstr .= "function createbook(){";
        // Initiale root
        $this->jstr .= "var root = new mse.Root('".$this->pj->getName()."',".$this->encodedCoord($this->pjWidth).",".$this->encodedCoord($this->pjHeight).",'".$this->pj->getOrientation()."');";
        $this->autoid = 0;
        $startPageSet = false;
        $this->jstr .= "var temp = {};";
        
        // Add all ressources to xml structure
        $this->jstr .= "var animes={};";
        $this->jstr .= "var games={};";
        $this->jstr .= "var wikis={};";
        $srcs = $this->pj->getAllSrcs();
        $animesrcs = array();
        foreach( $srcs as $name=>$srcData ) {
            $type = $srcData->type;
            $src = $srcData->data;
            switch($type){
            case "image": case "audio":
                if($type == "image") {
                    $t = "img";
                    $preload = "true";
                    // Change path with relative in folder of project
                    $src = preg_replace("/\S+(\/images\/)/", '.$1', $src, 1);
                }
                else {
                    $t = "aud";
                    $preload = "false";
                    // Change path with relative in folder of project
                    $src = preg_replace("/\S+(\/audios\/)/", '.$1', $src, 1);
                }
                $this->jstr .= "mse.src.addSource('$name','$src','$t',$preload);";
                break;
                
            case "game":
                $this->jstr .= "games.$name = new $name();";
                array_push($this->scriptExt, $src);
                break;
                
            case "anime":
                $animesrcs[$name] = $src;
                break;
                
            case "wiki":
                $this->jstr .= "wikis.$name=new mse.WikiLayer();";
                foreach( $src->cards as $card ){
                    if( $card->type == "text" ) {
                        $this->jstr .= "wikis.$name.addTextCard();";
                        foreach($card->sections as $section) {
                            if($section->type == "link")
                                $this->jstr .= "wikis.$name.textCard.addLink('".$section->title."', '".$section->content."');";
                            else if($section->type == "text")
                                $this->jstr .= "wikis.$name.textCard.addSection('".$section->title."', '".$section->content."');";
                        }
                    }
                    else if( $card->type == "img" ){
                        $this->jstr .= "wikis.$name.addImage('".$card->image."', '".$card->legend."');";
                    }
                }
                break;
            }
        }
        
        // Pages, Layers, Objects
        $this->jstr .= "var pages = {};";
        $this->jstr .= "var layers = {};";
        $this->jstr .= "var objs = {};";
        
        // Generate pages
        $pages = $this->pj->getStruct();
        foreach( $pages as $id => $page ) {
            $this->addPage($id, $page);
        }
        
        foreach( $animesrcs as $name => $src ) {
            $repeat = $src->repeat;
            $static = $src->statiq;
            $block = $src->block;
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
            $this->jstr .= "animes.$name=new mse.Animation($duration,$repeat,".($static===false?"false":"true").");";
            if($block) $this->jstr .= "animes.$name.block=true;";
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
                    $dx = $params->dx; $dy = $params->dy;
                    $dw = $params->dw; $dh = $params->dh;
                    $opacity = $params->opacity;
                    $t = $animeObjs[$key]->type;
                    
                    if($t == "spriteRecut" || $t == "sprite"){
                        $w = $params->w; $h = $params->h;
                        $sx = $params->sx; $sy = $params->sy;
                        $sw = $params->sw; $sh = $params->sh;
                    }
                    else if($t == "text") {
                        $fonts = $params->fonts;
                        $fontw = $params->fontw;
                        $font = $params->font;
                        $fontsvar = $this->encodedCoord($fonts);
                    }
                    
                    $dxvar = $this->encodedCoord($dx);
                    $dyvar = $this->encodedCoord($dy);
                    $dwvar = $this->encodedCoord($dw);
                    $dhvar = $this->encodedCoord($dh);
                    //echo "Coord: $dx, $dy, $dw, $dh";
                    
                    // First initialization of objet, add to objlist array
                    if(!array_key_exists($key, $objlist)){
                        if($static) {
                            switch($t) {
                            case "image":
                                $this->jstr .= "temp.obj=new mse.Image(null,{'pos':[$dxvar,$dyvar],'size':[$dwvar,$dhvar]},'$key');";
                                break;
                            case "spriteRecut":
                                $this->jstr .= "temp.obj=new mse.Sprite(null,{'pos':[$dxvar,$dyvar],'size':[$dwvar,$dhvar]},'$key',[[$sx,$sy,$sw,$sh]]);";
                                $spriteFrCount = 0;
                                break;
                            case "rect":
                                $this->jstr .= "temp.obj=new mse.Mask(null,{'pos':[$dxvar,$dyvar],'size':[$dwvar,$dhvar],'fillStyle':'$params->color'});";
                                break;
                            case "text":
                                $content = $animeObjs[$key]->content;
                                $align = $animeObjs[$key]->align;
                                $this->jstr .= "temp.obj=new mse.Text(null,{'pos':[$dxvar,$dyvar],'size':[$dwvar,$dhvar],'fillStyle':'$params->color','textBaseline':'top','font':'$fontw '+$fontsvar+'px $font','textAlign':'$align'},'$content',true);";
                                break;
                            }
                            $this->jstr .= "animes.$name.addObj('$key',temp.obj);";
                        }
                        else {
                            $this->jstr .= "animes.$name.addObj('$key',objs.$key);";
                        }
                        $objlist[$key] = array("params"=>array(),"animes"=>array());
                    }
                    else {
                        // Previous parameters
                        $prevdx = $objlist[$key]["params"]['dx']; $prevdy = $objlist[$key]["params"]['dy'];
                        $prevdw = $objlist[$key]["params"]['dw']; $prevdh = $objlist[$key]["params"]['dh'];
                        $prevopac = $objlist[$key]["params"]['opacity'];
                        // Analyse of animations
                        $animes = $objlist[$key]["animes"];
                        
                        if($t == 'spriteRecut' || $t == 'sprite') {
                            $prevsx = $objlist[$key]["params"]['sx']; $prevsy = $objlist[$key]["params"]['sy'];
                            $prevsw = $objlist[$key]["params"]['sw']; $prevsh = $objlist[$key]["params"]['sh'];
                            
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
                        // Font
                        if($t == 'text') {
                            $prevfonts = $objlist[$key]["params"]['fonts'];
                            $prevfsvar = $this->encodedCoord($prevfonts);
                            if($prevfonts != $fonts) {
                                if(!array_key_exists('fontSize', $animes)) $animes['fontSize']=array();
                                $fontval = $tranfont==2 ? $prevfsvar : array($prevfsvar,$tranfont);
                                for($i = count($animes['fontSize']); $i < $f; ++$i)
                                    array_push($animes['fontSize'], $fontval);
                            }
                        }
                        // Pos
                        if($dx != $prevdx || $dy != $prevdy){
                            if(!array_key_exists('pos', $animes)) $animes['pos']=array();
                            $pos = $tranpos==2 ? array($this->encodedCoord($prevdx),$this->encodedCoord($prevdy))
                                               : array($this->encodedCoord($prevdx),$this->encodedCoord($prevdy),$tranpos);
                            for($i = count($animes['pos']); $i < $f; ++$i)
                                array_push($animes['pos'], $pos);
                        }
                        // Size
                        if($dw != $prevdw || $dh != $prevdh){
                            if(!array_key_exists('size', $animes)) $animes['size']=array();
                            $size = $transize==2 ? array($this->encodedCoord($prevdw),$this->encodedCoord($prevdh))
                                                 : array($this->encodedCoord($prevdw),$this->encodedCoord($prevdh),$transize);
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
                        $objlist[$key]["animes"] = $animes;
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
                                $pos = array($this->encodedCoord($dx),$this->encodedCoord($dy));
                                for($i = count($seq); $i <= $nbFr; ++$i)
                                    array_push($seq, $pos);
                            break;
                            case 'size':
                                $size = array($this->encodedCoord($dw),$this->encodedCoord($dh));
                                for($i = count($seq); $i <= $nbFr; ++$i)
                                    array_push($seq, $size);
                            break;
                            case 'opacity':
                                for($i = count($seq); $i <= $nbFr; ++$i)
                                    array_push($seq, $opacity);
                            break;
                            case 'fontSize':
                                for($i = count($seq); $i <= $nbFr; ++$i)
                                    array_push($seq, $fontsvar);
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
                foreach($animes as $p=>$seq) {
                    // Manuel transform in pos and size, because they use coord variable which can't be correctly parsed
                    if($p=="pos" || $p=="size") {
                        $this->jstr .= ",'$p':[";
                        for($fr = 0; $fr < count($seq); ++$fr){
                            if($fr != 0) $this->jstr .= ",";
                            $this->jstr .= "[".$seq[$fr][0].",".$seq[$fr][1];
                            if(array_key_exists(2, $seq[$fr])) $this->jstr .= ",".$seq[$fr][2];
                            $this->jstr .= "]";
                        }
                        $this->jstr .= "]";
                    }
                    else if($p=="fontSize") {
                        $this->jstr .= ",'$p':[";
                        for($fr = 0; $fr < count($seq); ++$fr){
                            if($fr != 0) $this->jstr .= ",";
                            if(is_array($seq[$fr])) {
                                $this->jstr .= "[".$seq[$fr][0].",".$seq[$fr][1]."]";
                            }
                            else $this->jstr .= $seq[$fr];
                        }
                        $this->jstr .= "]";
                    }
                    // JSON structure
                    else $this->jstr .= ",'$p':JSON.parse('".json_encode($seq)."')";
                }
                $this->jstr .= "});";
            }
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
        $this->jstr .= "mse.currTimeline.start();};";
        // Lazy init the book
        //$this->jstr .= "mse.autoFitToWindow(createbook);";
        $this->jstr .= "createbook();";
        
        // Join the coords array in the beginning
        $this->jstr = "mse.coords = JSON.parse('".json_encode($this->coords)."');".$this->jstr;
        
        return $this->jstr;
    }
 
    function addPage($id, $pagenode) {
        if(!$this->startPageSet) {$this->startPageSet = true;$parent = "root";}
        else $parent = "null";
        // Init page
        $page = "pages.$id";
        $this->jstr .= $page."=new mse.BaseContainer($parent,{size:[".$this->encodedCoord($this->pjWidth).",".$this->encodedCoord($this->pjHeight)."]});";
        
        // Layers
        foreach( $pagenode as $layer ) {
            $layer = stripslashes($layer);
            $layer = preg_replace("/<\/img>/", "", $layer);
            $layer = preg_replace("/(<img[^>]*)(>)/", "$1/>", $layer);
            $layer = preg_replace("/[^\$]nbsp;/", ' ', $layer);
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
        
        if($type == 'ArticleLayer') {
            $layernode = $layernode->div[0];
            $style = $layernode['style'];
            $style .= "vertical-align: top;";
        }
        // Param
        $style .= "opacity: 1; vertical-align: top;";
        $params = $this->formatParams($style);
        if(!array_key_exists('size', $params[0])) {
            $params[1] = substr($params[1], 0, -1);
            $params[1] .= ',"size":['.$this->encodedCoord($this->pjWidth).','.$this->encodedCoord($this->pjHeight).']}';
        }
        
        if($type == 'Layer') {
            $this->jstr .= "$layer=new mse.Layer($page,$depth,".$params[1].");";
            // Obj
            $objs = $layernode->children();
            foreach( $objs as $objnode ) {
                $this->addObject($objnode, $layer);
            }
        }
        else if($type == 'ArticleLayer') {
            $this->jstr .= "$layer=new mse.ArticleLayer($page,$depth,".$params[1].",null);";
            
            if(array_key_exists('size', $params[0])) $width = $params[0]['size'][0];
            else $width = $this->pjWidth;
            $lineHeight = $params[0]['lineHeight'];
            // Objs
            $objs = $layernode->div;
            $index = 0;
            foreach( $objs as $objnode ) {
                $this->addArticleObject($objnode, $layer, $this->encodedCoord($width), $this->encodedCoord($lineHeight), $index);
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
            $objnode['style'] .= "vertical-align: top;";
        }
        // Init Obj
        $obj = "objs.".$id;
        // Init attributes
        $params = $this->formatParams($objnode['style']);
        
        switch($type) {
        case "img":
            // Src name can be found in image name attribute
            $this->jstr .= "$obj=new mse.Image($layer,".$params[1].",'".$objnode->img[0]['name']."');";
            break;
        case "mask":
            $this->jstr .= "$obj=new mse.Mask($layer,".$params[1].");";
            break;
        case "txt":
            // Text content
            $this->jstr .= "$obj=new mse.Text($layer,".$params[1].",'".addslashes($objnode->p[0])."',true);";
            break;
        default:
            $this->jstr .= "$obj=new mse.UIObject($layer,".$params[1].");";break;
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
            $params = $this->formatParams($objnode->img[0]['style']);
            $this->jstr .= "$obj=new mse.Image($layer,".$params[1].",'".$objnode->img[0]['name']."');";
        }
        else if($class == 'game') {
            $type = "game";
            $classname = $objnode['name'];
            $this->jstr .= "$obj=new $classname();";
        }
        else if(count($objnode->children()) == 0) {
            // Rectangle obj
            $type = "obj";
            $params = $this->formatParams($objnode['style']);
            $this->jstr .= "$obj=new mse.UIObject($layer,".$params[1].");";
        }
        else if(count($objnode->p) > 0) {
            // Text obj
            $type = "txt";
            $params = "{size:[$width,$lineHeight]}";
            
            // Detect link
            $p = $objnode->p;
            if(count($p->span) > 0){
                preg_match(self::$patterns['linkCutter'], $p[0]->asXML(), $content);
                $content = $content[1].$content[2].$content[3];
                $this->jstr .= "$obj=new mse.Text($layer,$params,'".addslashes($content)."',true);";
                foreach($p->span as $link)
                    $this->addLink($link, $obj, $index);
            }
            else {
                $content = $p;
                $this->jstr .= "$obj=new mse.Text($layer,$params,'$content',true);";
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
    
    private function formatParams($style){
        if(is_null($style)) return;
        $pj = $this->pj;
        $param = array();
        $paramStr = "{";
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
        preg_match(self::$patterns['textBaseline'], $style, $textBaseline);
        preg_match(self::$patterns['lineHeight'], $style, $lineHeight);
        if( array_key_exists(2, $width) && array_key_exists(2, $height) ) {
            $param['size'] = array($pj->realCoor($width[2]), $pj->realCoor($height[2]));
            $paramStr .= '"size":['.$this->encodedCoord($param['size'][0]).','.$this->encodedCoord($param['size'][1]).'],';
        }
        if( array_key_exists(2, $left) && array_key_exists(2, $top) ) {
            $param['pos'] = array($pj->realCoor($left[2]), $pj->realCoor($top[2]));
            $paramStr .= '"pos":['.$this->encodedCoord($param['pos'][0]).','.$this->encodedCoord($param['pos'][1]).'],';
        }
        if( array_key_exists(1, $color) ) {
            $param['fillStyle'] = $color[1];
            $paramStr .= '"fillStyle":"'.$param['fillStyle'].'",';
        }
        else if( array_key_exists(1, $bgColor) ) {
            $param['fillStyle'] = $bgColor[1];
            $paramStr .= '"fillStyle":"'.$param['fillStyle'].'",';
        }
        if( array_key_exists(1, $alpha) ) {
            $param['globalAlpha'] = $alpha[1];
            $paramStr .= '"globalAlpha":'.$param['globalAlpha'].',';
        }
        $fontSetted = false;
        if( array_key_exists(1, $fsize) ) {
            $fsize[1] = $pj->realCoor($fsize[1]);
            $fontSetted = true;
        }
        else $fsize[1] = "";
        if( array_key_exists(1, $ffamily) ) $fontSetted = true;
        else $ffamily[1] = "";
        if( array_key_exists(1, $fweight) ) $fontSetted = true;
        else $fweight[1] = "";
        if( $fontSetted ) {
            if(array_key_exists(1, $fsize)) {
                $paramStr .= '"font":"'.$fweight[1].' "+'.$this->encodedCoord($fsize[1]).'+"px '.$ffamily[1].'",';
                $fsize[1] = $fsize[1]."px";
            }
            else $paramStr .= '"font":"'.$fweight[1].' '.$ffamily[1].'",';
            $param['font'] = $fweight[1].' '.$fsize[1].' '.$ffamily[1];
        }
        if( array_key_exists(1, $font) ) {
            $param['font'] = $font[1];
            $paramStr .= '"font":"'.$param['font'].'",';
        }
        if( array_key_exists(1, $textAlign) ) {
            $param['textAlign'] = $textAlign[1];
            $paramStr .= '"textAlign":"'.$param['textAlign'].'",';
        }
        if( array_key_exists(1, $textBaseline) ) {
            $param['textBaseline'] = $textBaseline[1];
            $paramStr .= '"textBaseline":"'.$param['textBaseline'].'",';
        }
        if( array_key_exists(1, $lineHeight) ) {
            $param['lineHeight'] = $pj->realCoor($lineHeight[1]);
            $paramStr .= '"lineHeight":'.$this->encodedCoord($param['lineHeight']).',';
        }
        if(count($param) > 0)
            // Trim last , in paramStr
            $paramStr = substr($paramStr, 0, -1);
        $paramStr .= "}";
            
        return array($param, $paramStr);
    }
}

?>