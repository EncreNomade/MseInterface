var gui = {};

gui.openComment = function(){
    $('#comment').addClass('show');
}
gui.closeComment = function() {
    $('#comment').removeClass('show');
}

// Initialisation
$(window).load(function() {
    $('#comment_btn').click(gui.openComment);
    $('#comment_close_btn').click(gui.closeComment);
});