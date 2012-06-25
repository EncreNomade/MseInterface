var gui = {};

gui.openComment = function(){
    gui.center.append(gui.comment);
    gui.comment.addClass('show');
}
gui.closeComment = function() {
    gui.comment.removeClass('show');
    gui.comment.detach();
}

// Initialisation
$(window).load(function() {
    gui.center = $('#center');
    gui.comment = $('#comment');
    $('#comment_btn').click(gui.openComment);
    $('#comment_close_btn').click(gui.closeComment).click();
});