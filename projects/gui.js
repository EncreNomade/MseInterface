/*!
 * GUI of Book Reader
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
           Florent Baldino
 * Copyright, Encre Nomade
 *
 * Date of creation: 23/06/2012
 */

var msgCenter =(function(){    
    // private
    var normal = {},
        static = {},
        max = 5;
        
    normal.box =  $('<div id="msgCenter"><ul></ul></div>');
    normal.list = normal.box.children('ul');
    static.box = $('<div id="msgCenterStatic"><h1></h1><ul></ul></div>');
    static.list = static.box.children('ul');
    static.visible = false;
            
    function fadeIn(jQmsg){jQmsg.addClass('fadeIn');} // it show the message
    function fadeOut(jQmsg){jQmsg.removeClass('fadeIn');} // it hide
    function removeMsg(jQmsg){
        jQmsg.remove();
        if(normal.list.children('li').length == 0) // last message, remove the container
            normal.box.detach();
    }
    
    function hideTimeOut(jQmsg,time){
            time = isNaN(time) ? 0 : Math.abs(time);
            var fId = setTimeout(function(){ fadeOut(jQmsg); },time);
            var rId = setTimeout(function(){ removeMsg(jQmsg) ; jQmsg = null; },time+1000);
            
            return [fId, rId];
    }
    function show(jQmsg){setTimeout(function(){ fadeIn(jQmsg); jQmsg = null; }, 1);}
    
    // make staticBox moveable
    var drag = {target: static.box, x: 0, y: 0, moving: false};        
    // start move
    static.box.children('h1').mousedown(function(e){
        if (!drag.moving) {
            drag.x = e.pageX;
            drag.y = e.pageY;
            drag.moving = true;
            drag.target.addClass('moving');
            $(document).bind('mousemove', moving);
        }        
        e.preventDefault();
    });
    // moving
    var moving = function(e){
        if(drag.moving){
            var dx = e.pageX - drag.x,
                dy = e.pageY - drag.y,
                cur_offset = {
                    left: drag.target.offset().left,
                    bottom: parseInt(drag.target.css('bottom'))
                };
        
        drag.target.css({
            left: (cur_offset.left + dx),
            bottom: (cur_offset.bottom - dy)
        });

            drag.x = e.pageX;
            drag.y = e.pageY;
        }
    };
    // finish move
    $(document).mouseup(function() {
        if(drag.moving){
            drag.moving = false;        
            drag.target.removeClass('moving');
            $(document).unbind('mousemove', moving);
        }
    });
    
    // public       
    var public = new function MessageCenter(){};
    
    public.send = function(mes, time){
        if(normal.list.children('li').length == 0) // if no message the msgCenter is not in DOM
            normal.box.prependTo('#root');
            
        var message = $('<li></li>');
        message.append(mes);
        normal.list.prepend(message);
        
        show(message);
        
        if(time === 0 || time === 'fixed') return message; // the message will stay in the list
        
        time = isNaN(time) ? 3000 : time;
        this.closeMessage(message, time);
        
        return message;
    };
    
    public.getList = function(){ return normal.list; };
    
    public.getMax = function(){ return max; };
    
    public.closeMessage = function(jQMsg, time){        
        if(jQMsg.parents('#msgCenterStatic').length === 1) {
            // remove a static Message
            jQMsg.remove();
            return;
        }
        // its a normal message
        time = isNaN(time) ? 0 : time; // if no time, close immediately else wait the time
        var ids = hideTimeOut(jQMsg, time);
        
        jQMsg.hover(
            function(){clearTimeout(ids[0]); clearTimeout(ids[1]);}, // hover stop the removing time out
            function(){ids = hideTimeOut(jQMsg)}  // quit hover --> restart removing time out
        );
        
        normal.list.children('li').each(function(i){
            if(i >= max)
                hideTimeOut($(this));
        });
    };
    
    public.getStaticBox = function(){ return static.box; };
    
    public.showStaticBox = function(titre, params){
        static.list.html(' ');
        
        if(!titre || titre == '')
            titre = 'Notifications';
            
        static.box.children('h1').html(titre);
        static.box.prependTo('#root');
        
        var elemDOM = static.box.get(0);
        elemDOM.style.removeProperty('left');
        elemDOM.style.removeProperty('bottom');
        elemDOM.style.removeProperty('width');
        
        if(typeof params == 'object'){
            if(!isNaN(params.width)) static.box.css('width', params.width);
            if(!isNaN(params.bottom)) static.box.css('bottom', params.bottom);
            if(!isNaN(params.left)) static.box.css('left', params.left);
            if(!isNaN(params.right)) static.box.css('right', params.right);
        }
        
        static.visible = true;
    };
    
    public.closeStaticBox = function(){
        static.list.html(' ');
        static.box.detach();
        
        static.visible = false;
    };
    
    public.sendToStatic = function(msg){
        if(!static.visible)
            this.showStaticBox();
        var message = $('<li></li>');
        message.append(msg);
        static.list.prepend(message);
        
        return message;
    };
    
    return public;
})();


// Mini MVC architecture implemented with Observer pattern
var mmvc = (function(){
    // Observe function for model object
    var observe = function(variable, callback) {
        // Add observer callback into the listeners list indexed with variable name
        this._mmvclisteners[variable].push(callback);
    };
    
    // Notify function for model object, this function is called automatically by variable setter function
    var notify = function(variable, value) {
        // Invoke all listeners' callback
        var ls = this._mmvclisteners[variable];
        for(var i = 0; i < ls.length; ++i)
            ls[i].invoke(value);
    };
    
    var addObservableVars = function(vars) {
        // vars must be an Array of variables' name
        if(!(vars instanceof Array)) return;
        
        for(var i = 0; i < vars.length; ++i) {
            var variable = vars[i];
            // Setter function existe already, ignore this variable, in all case, notify function can be called manully after a modification of variable
            if(this['set'+variable]) {
                console.error("Fail to define the setter function of "+variable);
                continue;
            }
            
            // Initialization of listeners array
            if(!this._mmvclisteners[variable]) this._mmvclisteners[variable] = [];
            // Basic setter function is constructed with 'set' + variable name
            eval("this.set"+variable+" = function(value) {this."+variable+" = value; this.notify('"+variable+"', value);}");
        }
    };
    
    return {
        // This function can make a javascript Object a mmvc model, in which some variable predefined can be observed by any Callback object( which can simulate an internal function invokation environment of an object )
        makeModel: function(model, vars) {
            // Model must be an Object
            if(!(model instanceof Object)) 
                return;
                
            // Check existance of notify and observe function in model
            if(model.notify || model.observe || model.addObservableVars) {
                console.error("Model has his own observe, notify and/or addObservableVars method");
                return;
            }
            
            // Init listeners' list, observe and notify function for model
            model._mmvclisteners = {};
            model.observe = observe;
            model.notify = notify;
            model.addObservableVars = addObservableVars;
            
            // Config setter function for variables
            model.addObservableVars(vars);
        }
    };
}());


var gui = {};

// Slider class
gui.Slider = function(w, level, parent, val) {
    // DOM structure
    this.jqObj = $("<div class='slider'></div>");
    this.line = $("<div class='line'></div>");
    this.btn = $("<div class='ctrlbtn'></div>");
    this.back = $("<img class='background' src='./UI/slider/slider_back.png'/>");
    this.jqObj.append(this.back).append(this.line).append(this.btn);
    
    if(!isNaN(w)) this.jqObj.css('width', w);
    
    // Attributes
    this.width = this.jqObj.width() - this.btn.width();;
    this.level = isNaN(level) ? 100 : level;
    this.step = this.width / (this.level-1);
    this.value = 0;
    this.ondrag = false;
    
    // Add to dom
    this.appendTo(parent);
    
    // Callbacks
    this.dragStartHandlerCB = new Callback(this.dragStartHandler, this);
    this.draggingHandlerCB = new Callback(this.draggingHandler, this);
    this.moveBtnCB = new Callback(this.moveBtn, this);
    
    // MMVC for value and observed by ui
    mmvc.makeModel(this, ['value']);
    this.observe('value', this.moveBtnCB);
    if(isNaN(val)) val = 0;
    this.setvalue(val);
    
    this.btn.mseInteraction().mseInteraction('addListener', 'gestureSingle', this.dragStartHandlerCB, true);
    this.back.mseInteraction().mseInteraction('addListener', 'gestureSingle', this.draggingHandlerCB, true);
};
gui.Slider.prototype = {
    constructor: gui.Slider,
    appendTo: function(parent) {
        if( this.jqObj && (parent instanceof jQuery) ) {
            parent.append(this.jqObj);
            // Vertical align
            this.jqObj.css({'top': (parent.height() - this.jqObj.height())/2});
            return this.jqObj;
        }
        else return null;
    },
    
    moveBtn: function(l) {
        var off = l*this.step-9;
        if(off < 0) off = 0;
        this.btn.css('left', off);
        this.line.css('width', off);
    },
    dragStartHandler: function(e) {
        if(e.type == "gestureStart") this.startDrag(e);
        else if(e.type == "gestureUpdate") this.dragging(e);
        else if(e.type == "gestureEnd") this.endDrag(e);
    },
    draggingHandler: function(e) {
        if(e.type == "gestureUpdate") this.dragging(e);
        else if(e.type == "gestureEnd") this.endDrag(e);
    },
    startDrag: function(e) {
        this.ondrag = true;
    },
    dragging: function(e) {
        if(this.ondrag) {
            var offset = e.windowX - this.back.offset().left;
            if(offset > this.width) offset = this.width;
            else if(offset < 0) offset = 0;
            var l = Math.ceil( offset / this.step );
            this.setvalue(l);
        }
    },
    endDrag: function(e) {
        this.ondrag = false;
    }
};





gui.fb = {};
gui.fb.user = null; // initiated in gui.fb.connect or init
gui.fb.init = function(){
    FB.getLoginStatus(function(response){ // test login
      if (response.status === 'connected') {
        var uid = response.authResponse.userID;
        FB.api('/me',function(u){gui.fb.user = u;}); // just set gui.fb.user with user obj
        var accessToken = response.authResponse.accessToken;
        try {
            var image = gui.comment.children('.header').children('#photo');
            image.prop('src', 'https://graph.facebook.com/' + uid + '/picture');
        } catch (e) {
        
        }
      } 
      else if (response.status === 'not_authorized') {//the user is logged in to Facebook, but has not authenticated your app
        gui.fb.user.id = false;
      } 
      else { // the user isn't logged in to Facebook.
        gui.fb.user.id = false;
      }
    });
};
gui.fb.connect = function(callback){
    gui.fb.callback = callback;
    FB.login(function(response) {
        if (response.status == 'connected') {
            FB.api('/me', function(user) {
                var image = gui.comment.children('.header').children('#photo');
                image.prop('src', 'https://graph.facebook.com/' + user.id + '/picture');
                gui.fb.user = user;

                if(typeof gui.fb.callback == 'function')
                    gui.fb.callback.call(window);
                gui.fb.callback = false;
            });
        } 
        else if (response.status === 'not_authorized'){
            gui.fb.callback = false;
        }
        else { // fail
            gui.fb.callback = false;
        }
    }, {scope:'publish_stream,read_stream,email,user_birthday,user_photos,photo_upload'});
}
gui.fb.like = function(){
    FB.getLoginStatus(function(response){
        if (response.status === 'connected') { // do only if connected
            FB.api('/me/og.likes', 'post', { object:location.href }, function(res) {
                if (!res || res.error) {
                    if(res.error.code == 3501) { // already like it !
                        msgCenter.send('Vous aimez deja cette page');
                        return;
                    }
                    // console.error(res);
                    if(confirm("Une erreur s'est produite lors de l'envoie. Réessayer ?"))
                        gui.fb.connect(gui.fb.like);
                } 
                else {
                    var msg = $('<p>Vous avez aimez cette page sur Facebook. </p>');
                    if(gui.fb.user)
                        msg.append('<a href="'+gui.fb.user.link+'">Voir.</a>');
                    msgCenter.send(msg);
                }
            });
        }
        else if(confirm("Il faut être connecté à Facebook pour poster un like. Vous connecter ?")){
            // not connected and
            gui.fb.connect(gui.fb.like);
        }
    });
}
gui.fb.post = function(imgData, msg){
    function postSuccess(data){
        try { // success
            var comment = JSON.parse(data);
            
            var posted = comment.posted;
            // The attachAComment function return the position of tag attached
            var tagpos = gui.attachAComment(posted);

            var off = mse.root.jqObj.offset();
            $('#loader').hide();
            var $loaderImg = $('img.#newComment');
            $loaderImg.addClass('run');        
            $loaderImg.css({ // choose final position
                top: off.top + tagpos.y,
                left: off.left + tagpos.x
            });
            
            var msg = $('<p>Votre message a bien été posté sur Facebook. </p>');
            if(gui.fb.user)
                msg.append('<a href="'+gui.fb.user.link+'" target="_blank">Voir.</a>');
            msgCenter.send(msg);
        } catch(e) {
            errorPost(data, e);
        }
    }
    function errorPost(data){
        // console.log('ERROR WHILE POSTING COMMENT : ');
        // console.log(arguments);
        $('#loader').hide();
        msgCenter.send('Une erreur est survenue. Lors de l\'envoie on la recupération du commentaire.');
    }
    
    var position = JSON.stringify(mse.root.getProgress());
    if(imgData){
        $.post('../fb_ajax_connexion.php', {imgData64: imgData}, function(data){
            var imageUrl = null;
            
            try { imageUrl = JSON.parse(data).imgUrl; }
            catch(e) { return errorPost(data); }
            
            var postData = {'url': imageUrl};
            if(msg) postData['message'] = msg;
            FB.api('me/photos', 'POST', postData, function(res){ // post the img to fb
                if(!res.id) return errorPost(res);
                FB.api(res.id, function(fbImgObj){ // get the img url
                    if(!fbImgObj.source) return errorPost(fbImgObj);
                    msg = fbImgObj.name === undefined ? '' : fbImgObj.name;
                    var postData = {'type':'post', 'imgUrl': fbImgObj.source, 'message': msg, 'fbID':fbImgObj.id, 'position': position};
                    $.post('../fb_ajax_connexion.php', postData, postSuccess);
                });
            });
        });
    }
    else if(msg){
        FB.api('/me/feed', 'POST', {'message': msg}, function(obj){
            if(!obj.id) return errorPost(obj);
            var postData = {'type':'post', 'imgUrl': 'empty', 'message': msg, 'fbID':obj.id, 'position': position};
            $.post('../fb_ajax_connexion.php', postData, postSuccess);
        });
    }
};
gui.fb.postOpenGraph = function(imgData, msg) {
    $.ajax({
        async:  true,
        type: 'POST', 
        url: '../fb_ajax_connexion.php', 
        data: {'imgData64': imgData, 'text': msg, 'type': 'openGraph'}, 
        success: function(data, textStatus, jqXHR) {
            if (!data || data == ''){
                console.error('error while sending ajax request for facebook post comment.');
                return;
            }
            var info = JSON.parse(data);
            var imgUrl = info.imgPath != 'empty' ? info.imgPath : false;
            var txtMessage = info.txtMessage != 'empty' ? info.txtMessage : false;
            var chapter = parseInt(info.chapter);
            
            var ogUrl = 'http://testfb.encrenomade.com/chapiters/index.php?bid=ch'+chapter;
            if (imgUrl) ogUrl += '&image='+imgUrl;
            if (txtMessage) ogUrl += '&message='+txtMessage;
            
            // post open graph object
            FB.api(
                '/me/encrenomade:comment',
                'post',
                { chapter: ogUrl },
                function(response) {
                    if (!response || response.error) {
                        alert('Error occured');
                    } 
                    else {
                        alert('Publish in Voddoo Connection ! ID = ' + response.id);
                    }
                }
            );
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Une erreur s'est produite lors de la requete
        }
    });
};

gui.openComment = function(){
    //if(!gui.center.hasClass('show')) gui.center.addClass('show');
    gui.comment.addClass('show');
    
    if(gui.fb.user && gui.userImage.prop('src') == location.href){
        gui.userImage.prop('src', 'https://graph.facebook.com/' + gui.fb.user.id + '/picture');
    }
}
gui.closeComment = function() {
    gui.comment.removeClass('show');
}

gui.editImage = function(imgData, w, h) {
    // After capture box
    var $result = $('#capture_result');    
    $result.css({'left': -w/2,
                 'top': -h/2,
                 'width': w,
                 'height': h
    });
    $result.show();
    
    var canvas = $result.find('canvas').get(0);    
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').putImageData(imgData, 0, 0);
}



gui.attachAComment = function(commentinfo) {
    var target = commentinfo.position;
    if(!target || target == "" || target == 0) return {x: 0, y: 0};
    
    switch(target.type) {
    case "page":
        var name = target.name;
        if(pages[name])  return pages[name].addComment(commentinfo);
        break;
    case "obj":
        var id = target.id;
        if(objs[id]) return objs[id].addComment(commentinfo);
        break;
    }
};
// Internal comments traitement
gui.attachComments = function(comments) {
    if(!mse.Comment) return;
    for(var i in comments) {
        var commentinfo = comments[i];
        
        gui.attachAComment(commentinfo);
    }
};





// Initialisation
$(window).load(function() {
    gui.center = $('#center');
    gui.comment = $('#comment');
    gui.capture = $('#comment .header #camera');
    gui.userImage = $('#comment .header #photo');
    gui.menu = $('#menu');
    $('#capture_result').hide();
    
    gui.scriber.init();
    
    $('#comment_btn').click(gui.openComment);
    $('#comment .close').click(gui.closeComment);
    gui.capture.click(function() {
        gui.closeComment();
        mse.root.startCapture(new Callback(gui.editImage, window));
    });
    
    // After capture options
    // show scriber
    $('#capture_result #edit').click(function(){
        gui.scriber.showWithImg(imgData, w, h);
        $('#capture_result').hide();
    });    
    // retryC
    $('#capture_result #recapture').click(function(e){
        $('#capture_result').hide();
        mse.root.startCapture(new Callback(gui.editImage, window));
    });    
    // cancel
    $('#capture_result #close').click(function(e){
        $('#capture_result').hide();
        gui.openComment();
    });     
    // valid
    $('#capture_result #confirm').click(function(e){
        $('#capture_result').hide();
        var img = canvas.toDataURL();
        gui.openComment();
        $('#comment .header #upload').prop('src', img).show(500);
    });
    
    // Facebook
    // Like
    $('#fb-custom-like').click(gui.fb.like);
    // Post
    $('#share').click(function(){
        var imgData = $(this).siblings('#upload').prop('src');
        imgData = (imgData == location.href) ? false : imgData; // imgData == location.href --> no upload (src is empty)
        var msg = $('#comment_content').val();
        msg = msg != '' ? msg : false;
        if(imgData === 'empty' && msg === 'empty'){
            msgCenter.send('Vous devez envoyer au moins du texte ou une image.')
            return;
        }
        
        //re init the comment form
        gui.comment.children('.header')
                   .children('#upload')
                   .replaceWith('<img id="upload" src />');
        $('#comment_content').val('');
        
        if(gui.fb.user){
            gui.fb.post(imgData, msg);
            $('#loader').show();
            gui.closeComment();
        }
        else if(confirm("Vous n'êtes pas connecté à Facebook. Se connecter ?")){
            gui.fb.connect(function(){$('#share').click();});
        }

    });
    
    var $loaderImg = $('img.#newComment');    
    $loaderImg.css({ // set loaderImg to center
        top: $('#root').height()/2 - $loaderImg.height()/2,
        left: $('#root').width()/2 - $loaderImg.width()/2
    });
    $loaderImg.get(0).addEventListener('webkitAnimationEnd', function(){ // reset loader img
        $loaderImg.removeClass('run');
        $loaderImg.css({
            top: $('#root').height()/2 - $loaderImg.height()/2,
            left: $('#root').width()/2 - $loaderImg.width()/2
        });
    });
    
    
    // Preference panel
    gui.pref = $('#preference');
    gui.audioctrl = new gui.Slider(200, 100, gui.pref.children('p:first'), 50);
    gui.speedctrl = new gui.Slider(200, 16, gui.pref.children('p:eq(1)'), 8);
    gui.audioctrl.jqObj.css('left', 70);
    gui.speedctrl.jqObj.css('left', 70);
    // Observer to speed or audio
    gui.audioctrl.observe('value', new Callback(mse.src.setVolume, mse.src));
    gui.speedctrl.observe('value', new Callback(mse.ArticleLayer.prototype.setInterval, mse.ArticleLayer.prototype));
    // Active prefecrence button
    $('#preference_btn').click(function() {gui.pref.addClass('show');});
    gui.pref.children('.close').click(function() {gui.pref.removeClass('show');});
});