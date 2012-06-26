var gui = {};

gui.openComment = function(){
    gui.center.append(gui.comment);
    gui.comment.addClass('show');
}
gui.closeComment = function() {
    gui.comment.removeClass('show');
    gui.comment.detach();
}

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
                
            var message = $('<li>'+mes+'</li>');
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
        },
    }
})();
// Initialisation
$(window).load(function() {
    gui.center = $('#center');
    gui.comment = $('#comment');
    $('#comment_btn').click(gui.openComment);
    $('#comment_close_btn').click(gui.closeComment).click();
});