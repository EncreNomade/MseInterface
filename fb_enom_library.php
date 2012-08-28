<?php
/*!
 * Facebook Connection
 * Encre Nomade
 *
 * Author: Florent Baldino
 * Copyright, Encre Nomade
 *
 * Date of creation: Aout 2012
 * 
 * function :
 *     - fbConnection() --> A user is trying to loggin with FB, 
 *              function check if the user is in DB & add him if not.
 *     - saveImgFromData($img) --> save $img img is the img64 str from html
 *              the function save it as a uniq .png file in fb_images/ folder
 *     - postComment($pid, $text, $image, $position = 0)
 *              save the comment in database
 *     - getComment($id) --> $id == an facebook comment ID
 *              return FALSE if the comment doesn't exist anymore in FB
 *              return a JSON object if the comment exist
 *
 */

include_once 'core.php';
require_once 'fb_api/facebook.php';


$configFb = array();
$configFb['appId'] = '141570392646490';
$configFb['secret'] = '152a5d45dd79ce82924f1c9a792caf96';
$configFb['fileUpload'] = true; // optional


function fbConnection($mail, $fbUserName, $birthday, $sex, $id){
    ConnectDB();
    $query = "SELECT uid FROM user WHERE email='$mail' ";
    $reponse = mysql_query($query);
    $sex = ($sex == 'male') ? 'm' : 'f';
    if(!$reponse) {
        echo 'MYSQL error : ' . mysql_error();
        return FALSE;
    }
    else if($user = mysql_fetch_array($reponse)){ // connected to facebook and ever in db
        $fbUserName = $user['uid'];
    }
    else{ // connected to FB & mail doesn't exist in db               
        $now = time();
        
        $query = "INSERT INTO user(uid,password,sex,birthday,email,signup,lastlogin, facebookid) 
                    VALUES('$fbUserName','fb','$sex','$birthday','$mail','$now','$now', '$id');";
        $reponse = mysql_query($query);
        if(!$reponse) {
            echo 'MYSQL error : ' . mysql_error();
            return FALSE;
        }
    }
    
    $_SESSION['uid'] = $fbUserName;
    return $fbUserName;
}

function saveImgFromData($img){
	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
    $imgName = $_SESSION['uid'].'-'.uniqid() . '.png';
	$file = 'fb_images/'.$imgName;
    
	file_put_contents($file, $data);
    
    return $imgName;
}

function postComment($pid, $text, $image, $position = "", $date) {
    ConnectDB();
    $user = $_SESSION['uid'];
    $pjName = $_SESSION['chapInfo']['name'];
    $query = "INSERT INTO comments(user, fbpostid, position, content, image, pjname, date)
                VALUES('$user', '$pid', '$position', '$text', '$image', '$pjName', '$date');";

    $reponse = mysql_query($query);

    if(!$reponse) return FALSE;
    else return TRUE;
}

function commentToArray($postId, $content, $image, $position, $date){
    if($content == 'empty') $content = "-1";
    if($image == 'empty') $image = "-1";
    $date = date('d/m/Y \à H:i:s', $date);
    
    $res = array( 'fbpostid' => $postId,
                  'position' => json_decode($position),
                  'content'  => $content,
                  'image'    => $image,
                  'date'     => $date );    
    return $res;
}

function getInternalCommentsFor($pjname) {
    ConnectDB();
    $uid = $_SESSION['uid'];
    $query = "SELECT fbpostid, position, content, image, date
              FROM comments 
              WHERE pjname='$pjname' AND user='$uid'";
    $rep = mysql_query($query);
    if(!$rep)
        return FALSE;
        
    $comments = array();
    while($comment = mysql_fetch_array($rep)){
        if($comment['content'] == 'empty') $comment['content'] = false;
        if($comment['image'] == 'empty') $comment['image'] = false;
        $comment['date'] = date('d/m/Y \à H:i:s', $comment['date']);
        
        array_push($comments, array( 'fbpostid' => $comment['fbpostid'], 
                                     'position' => json_decode($comment['position']),
                                     'content'  => $comment['content'],
                                     'image'    => $comment['image'],
                                     'date'     => $comment['date'] ));
    }
    return json_encode($comments);
}

function getCommentFor($pjName){
    ConnectDB();
    $query = "SELECT uid, facebookid 
              FROM user 
              WHERE facebookid != '0'";
    $rep = mysql_query($query);
    $users = Array(); // contains users['name'] = fbID
    if($rep){
        while($user = mysql_fetch_array($rep))
            $users[$user['uid']] = $user['facebookid'];        
    }
    $uid = $_SESSION['uid'];
    $query = "SELECT fbpostid, content, image, date, user
              FROM comments 
              WHERE pjname='$pjName' AND user != '$uid'
              ORDER BY date DESC
              LIMIT 15";
    $rep = mysql_query($query);
    if(!$rep)
        return FALSE;
        
    $comments = Array();
    $html = '';
    while($comment = mysql_fetch_array($rep)){
        $comments[] = Array( 'text'  => $comment['content'],
                             'image' => $comment['image'],
                             'id'    => $comment['fbpostid'],
                             'date'  => $comment['date'], 
                             'user'  => $comment['user'] );
    
        $id = $comment['fbpostid'];
        
        $id = $comment['id'];
        $userName = $comment['user'];
        $text = $comment['content'] == 'empty' ? false : $comment['content'];
        $image = $comment['image'] == 'empty' ? false : $comment['image'];
        $date = date('d/m/Y \à H:i:s', $comment['date']);
        

        $html .= '<div class="one_comment">';
        $html .=    '<div class="comment_header">';
        $html .=        '<img class="comment_avatar" src="https://graph.facebook.com/'. $users[$userName].'/picture" alt="'. $userName .'"/>';                              
        $html .=        '<div class="comment_author">'.$userName.'<span> a dit :</span></div>';
        $html .=        '<div class="comment_date">Le '.$date.'</div>';
        $html .=    '</div>';
        $html .=    '<div class="comment_body">';
        if($text)
            $html .=    '<div class="comment_text">'.$text.'</div>';
        if($image){
            $html .=    '<div class="comment_image">';
            $html .=        '<img src="'.$image.'" />';
            $html .=    '</div>';
        }
        $html .=    '</div>';                     
        $html .= '</div>';
    }
    
    if(isset($comments[0]))
        return Array('array'=>$comments, 'stringHtml'=>$html);
    else 
        return FALSE;
}

?>

