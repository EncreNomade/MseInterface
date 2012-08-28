<?php
/*!
 * Facebook Connection
 * Encre Nomade
 *
 * Author: Florent Baldino
 * Copyright, Encre Nomade
 *
 * Date of creation: Juillet 2012
 * 
 *
 * ajax :
 *    - check for connection request --> $_POST['facebookConnect'] == 'true'
 *         just a call to fbConnection with the POST params
 *    - check for post --> $_POST['type'] == 'normal'
 *         post an image in the FB apps album with the text typed by the user. 
 *         It's appear in the TimeLine;
 *    - check for openGraph --> $_POST['type'] == 'openGraph'
 *         publish in FB activity somthing like : 
 *         user commented chapter i in apps
 *    - check for comment getting --> $_POST['pid'] == fb_comment_id
 *
 *
 */
 
session_start();
require_once 'fb_enom_library.php';
header("Access-Control-Allow-Origin: *"); 

$configFb = array();
$configFb['appId'] = '141570392646490';
$configFb['secret'] = '152a5d45dd79ce82924f1c9a792caf96';
$configFb['fileUpload'] = true; // optional

if($_SERVER['REQUEST_METHOD'] == "POST") {
    if(isset($_POST['facebookConnect'])){ // AJAX REQUEST for connection
        if(isset($_POST['mail']) && isset($_POST['fbName']) && isset($_POST['birthday']) && isset($_POST['sex']) && isset($_POST['id'])){
            $fbName = htmlspecialchars($_POST['fbName']);
            $birthday = htmlspecialchars($_POST['birthday']);
            $sex = htmlspecialchars($_POST['sex']);
            $mail = htmlspecialchars($_POST['mail']);
            $id = htmlspecialchars($_POST['id']);
            
            $user = fbConnection($mail, $fbName, $birthday, $sex, $id);
            if($user)
                echo '{"name":"'.$user.'", "id":"'.$id.'"}';
            else echo 'fbConnection bug';
        }
        else echo 'POST data missing';
    }
    else if(isset($_POST['type'])) {
        $numChap = $_SESSION['chapInfo']['index'] + 1;
        $fbDefault = array();
        $fbDefault['image'] = 'default.png';
        $fbDefault['txt'] = 'Je suis en train de lire le chapitre '.$numChap. ' de Voodoo Connection.';
        
        $message = (isset($_POST['text']) && $_POST['text'] != 'empty')
                                    ? htmlspecialchars($_POST['text'])
                                    : $fbDefault['txt'];
        $imgName = (isset($_POST['imgData64']) && $_POST['imgData64'] != 'empty')
                                    ? saveImgFromData($_POST['imgData64'])
                                    : 'empty';

        if($_POST['type'] == 'openGraph'){
            $jsonStr  = '{"chapter": "'.$numChap.'"';
            $jsonStr .= ',"txtMessage":"'.$message.'"';
            $jsonStr .= ', "imgPath": "'.$imgName.'"';
            $jsonStr .= '}';
            
            echo $jsonStr;
        }
        else if ($_POST['type'] == 'post'){
            if(!isset($_POST['imgUrl'])
               || !isset($_POST['message'])
               || !isset($_POST['fbID'])
               || !isset($_POST['position'])){
                echo 'post data incomplete';
                die;
            }
            $postId = $_POST['fbID'];
            $img = $_POST['imgUrl'];
            $content = $_POST['message'];
            $position = $_POST['position'];
            $date = time();
            if(postComment($postId, $content, $img, $position, $date)) {
                $comments = array();
                $comments['posted'] = commentToArray($postId, $content, $img, $position, $date);
                echo json_encode( $comments );
            }
            else echo 'DATABASE ERROR : ' . mysql_error();
        }
    }
    else if(isset($_POST['imgData64'])){
        $imgName = saveImgFromData($_POST['imgData64']);
        echo '{"imgUrl":"http://testfb.encrenomade.com/fb_images/' . $imgName . '"}';
    }
    
    
    

    
}

?>

