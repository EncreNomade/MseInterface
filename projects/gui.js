var msgCenter =(function(){
    // private
    var messageList = false;
    var max = 5;
    
    function fadeIn(jQmsg){jQmsg.addClass('fadeIn');}
    function fadeOut(jQmsg){jQmsg.removeClass('fadeIn');}
    function removeMsg(jQmsg){jQmsg.remove();}
    
    function hideTimeOut(jQmsg,time){
            time = isNaN(time) ? 0 : Math.abs(time);
            var fId = setTimeout(function(){ fadeOut(jQmsg); },time);
            var rId = setTimeout(function(){ removeMsg(jQmsg) ; jQmsg = null; },time+1000);
            
            return [fId, rId];
    }
    function show(jQmsg){setTimeout(function(){ fadeIn(jQmsg); jQmsg = null; }, 1);}

    
    //public
    return {
        send: function(mes, time){
            if(!messageList) // initiate
                messageList = $('#msgCenter ul');
                
            var message = $('<li></li>');
            message.append(mes);
            messageList.prepend(message);
            
            time = isNaN(time) ? 3000 : time;
            show(message);
            var ids = hideTimeOut(message, time);
            
            message.hover(
                function(){clearTimeout(ids[0]); clearTimeout(ids[1]);},
                function(){ids = hideTimeOut(message)}
            );
            
            messageList.children('li').each(function(i){
                if(i >= max) 
                    hideTimeOut($(this));
            });
        },
        getList: function(){
            if(!messageList) 
                messageList = $('#msgCenter ul');
            return messageList;
        }
    }
})();


var gui = {};

gui.openComment = function(){
    // gui.center.append(gui.comment);
    gui.comment.addClass('show');
}
gui.closeComment = function() {
    gui.comment.removeClass('show');
    // gui.comment.detach();
}

gui.editImage = function(imgData, w, h) {
    // Calcul size
    if(w/h > 5/3) {
        var width = w, height = Math.round(w*3/4);
    }
    else if(w/h < 1) {
        var width = Math.round(h*4/3), height = h;
    }
    else {
        var width = Math.round(w/0.8), height = Math.round(width*3/4);
    }
    
    // Show scriber
    gui.center.append(gui.scriber);
    gui.scriber.show();
    gui.scriber.css({
        'left': -width/2,
        'top': -height/2,
        'width': width,
        'height': height
    });
    var canvas = gui.scriber.children('canvas').get(0);
    
    // Resize canvas
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width;
    canvas.style.height = height;
    
    var ctx = canvas.getContext('2d');
    ctx.putImageData(imgData, 0, 0);
}

// Initialisation
$(window).load(function() {
    gui.center = $('#center');
    gui.comment = $('#comment');
    gui.capture = $('#comment .header #camera');
    
    // Scriber interaction
    $('#scriber .close').click(function(){
        $('#scriber').detach();
        mse.root.startCapture(new Callback(gui.editImage, window));
    });
    $('#scriber .confirm').click(function() {
        $('#scriber').detach();
        // Retrieve the cavnvas image data
        var canvas = gui.scriber.children('canvas').get(0);
        var img = canvas.toDataURL();
        
        gui.openComment();
        $('#comment .header #upload').prop('src', img).show(500);
    });
    // Remove scriber temporarly
    gui.scriber = $('#scriber').detach();
    
    $('#comment_btn').click(gui.openComment);
    $('#comment .close').click(gui.closeComment);
    gui.capture.click(function() {
        gui.closeComment();
        mse.root.startCapture(new Callback(gui.editImage, window));
    });
});