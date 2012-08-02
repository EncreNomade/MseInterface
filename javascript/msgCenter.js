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
            normal.box.prependTo('body');
            
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
        static.box.prependTo('body');
        
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