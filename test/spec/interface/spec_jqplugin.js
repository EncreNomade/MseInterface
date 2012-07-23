describe("Static button test", function() {
    var div1;
    var a = 0;
    var fn = function(e) {
        a++;
        if(e && e.data) {
            a += e.data.supp;
        }
    }
    
    beforeEach(function() {
        a = 0;
        div1 = $('#div1');
    });
    afterEach(function() {
        div1.children('.del_container').remove();
    });
    
    it("Add a first static button should create a .del_container element to object", function() {
        expect(div1.children('ul.del_container').length).toEqual(0);
        
        div1.staticButton('images/UI/del.png', fn);
        
        expect(div1.children('ul.del_container').length).toEqual(1);
        expect(div1.children('.del_container').children('img[src="images/UI/del.png"]').length).toEqual(1);
    });
    
    it("A static button should invoke the callback when it's clicked", function() {
        div1.staticButton('images/UI/del.png', fn);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(1);
    });
    
    it("We can remove a button with the source address", function() {
        div1.staticButton('images/UI/del.png', fn);
        div1.staticButton('images/UI/del.png', false);
        
        expect(div1.children('.del_container').children('img[src="images/UI/del.png"]').length).toEqual(0);
    });
    
    it("It should be possible to pass data( only object ) to callback", function() {
        div1.staticButton('images/UI/del.png', fn, {supp: 2});
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(3);
        
        div1.staticButton('images/UI/del.png', false);
        div1.staticButton('images/UI/del.png', fn, [2]);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(4);
        
        div1.staticButton('images/UI/del.png', false);
        div1.staticButton('images/UI/del.png', fn, 3);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(5);
    });
    
    it("It should be possible to prepend a button before all existed buttons", function() {
        div1.staticButton('images/UI/config.png', fn);
        div1.staticButton('images/UI/audio.png', fn);
        div1.staticButton('images/UI/del.png', fn, {supp: 3}, true);
        
        var icons = div1.children('.del_container').children();
        expect(icons.get(0).src.indexOf('images/UI/del.png')).not.toEqual(-1);
        expect(icons.get(1).src.indexOf('images/UI/config.png')).not.toEqual(-1);
        expect(icons.get(2).src.indexOf('images/UI/audio.png')).not.toEqual(-1);
    });
});


describe("Hover button test", function() {
    var div1;
    var a = 0;
    var fn = function(e) {
        a++;
        if(e && e.data) {
            a += e.data.supp;
        }
    }
    
    beforeEach(function() {
        a = 0;
        div1 = $('#div1');
    });
    afterEach(function() {
        div1.children('.del_container').remove();
    });
    
    it("Add a first hover button should create a .del_container element to object", function() {
        expect(div1.children('ul.del_container').length).toEqual(0);
        
        div1.hoverButton('images/UI/del.png', fn);
        
        expect(div1.children('ul.del_container').length).toEqual(1);
        expect(div1.children('.del_container').children('img[src="images/UI/del.png"]').length).toEqual(1);
    });
    
    it("Hover buttons should be showed only when user hover on parent object", function() {
        div1.hoverButton('images/UI/del.png', fn);
        div1.hoverButton('images/UI/config.png', fn);
        div1.hoverButton('images/UI/audio.png', fn);
        
        var container = div1.children('ul.del_container');
        expect(container.children('img:visible').length).toEqual(0);
        
        div1.mouseover();
        expect(container.children('img:visible').length).toEqual(3);
    });
    
    it("A hover button should invoke the callback when it's clicked", function() {
        div1.hoverButton('images/UI/del.png', fn);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(1);
    });
    
    it("We can remove a button with the source address", function() {
        div1.hoverButton('images/UI/del.png', fn);
        div1.hoverButton('images/UI/del.png', false);
        
        expect(div1.children('.del_container').children('img[src="images/UI/del.png"]').length).toEqual(0);
    });
    
    it("It should be possible to pass data( only object ) to callback", function() {
        div1.hoverButton('images/UI/del.png', fn, {supp: 2});
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(3);
        
        div1.hoverButton('images/UI/del.png', false);
        div1.hoverButton('images/UI/del.png', fn, [2]);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(4);
        
        div1.hoverButton('images/UI/del.png', false);
        div1.hoverButton('images/UI/del.png', fn, 3);
        div1.children('.del_container').children('img[src="images/UI/del.png"]').click();
        
        expect(a).toEqual(5);
    });
    
    it("It should be possible to prepend a button before all existed buttons", function() {
        div1.hoverButton('images/UI/config.png', fn);
        div1.hoverButton('images/UI/audio.png', fn);
        div1.hoverButton('images/UI/del.png', fn, {supp: 3}, true);
        
        var icons = div1.children('.del_container').children();
        expect(icons.get(0).src.indexOf('images/UI/del.png')).not.toEqual(-1);
        expect(icons.get(1).src.indexOf('images/UI/config.png')).not.toEqual(-1);
        expect(icons.get(2).src.indexOf('images/UI/audio.png')).not.toEqual(-1);
    });
});


describe("Disable and enable buttons test", function(){
    var div1;
    var a = 0;
    var fn = function() {
        a++;
    }
    
    beforeEach(function() {
        a = 0;
        div1 = $('#div1');
    });
    afterEach(function() {
        div1.children('.del_container').remove();
    });
    
    it("Disable buttons should detach all buttons from object", function() {
        // For hover buttons
        div1.hoverButton('images/UI/del.png', fn);
        div1.hoverButton('images/UI/config.png', fn);
        div1.hoverButton('images/UI/audio.png', fn);
        
        div1.disableBtns();
        expect(div1.children('.del_container').length).toEqual(0);
        
        // For static buttons
        div1.staticButton('images/UI/del.png', fn);
        div1.staticButton('images/UI/config.png', fn);
        div1.staticButton('images/UI/audio.png', fn);
        
        div1.disableBtns();
        expect(div1.children('.del_container').length).toEqual(0);
    });
    
    it("Disabled buttons can be retached to object", function() {
        // First disable
        div1.hoverButton('images/UI/audio.png', fn);
        div1.disableBtns();
    
        // Second disable
        div1.staticButton('images/UI/del.png', fn);
        div1.staticButton('images/UI/config.png', fn);
        div1.staticButton('images/UI/audio.png', fn);
        div1.disableBtns();
        
        expect(div1.children('.del_container').length).toEqual(0);
        // Last disable should be recovered
        div1.enableBtns();
        expect(div1.children('.del_container').length).toEqual(1);
        expect(div1.children('.del_container').children().length).toEqual(3);
    });
    
    it("Reenabled buttons should response to events correctly", function() {
        div1.staticButton('images/UI/del.png', fn);
        div1.staticButton('images/UI/config.png', fn);
        div1.staticButton('images/UI/audio.png', fn);
        
        var del = div1.children('.del_container').children('img:first');
        div1.disableBtns();
        
        expect(a).toEqual(0);
        div1.enableBtns();
        del.click();
        expect(a).toEqual(1);
    });
});


describe("Deletable, hideable, configurable test", function() {
    beforeEach(function() {
        a = 0;
        div1 = $('#div1');
    });
    afterEach(function() {
        div1.children('.del_container').remove();
    });
    
    it("Deletable button should delete the object", function() {
        div1.deletable();
        var del = div1.children('.del_container').children('img:first');
        del.click();
        
        expect($('#div1').length).toEqual(0);
        
        $('body').append('<div id="div1"></div>');
    });
    
    it("Hideable button should hide the object", function() {
        div1.hideable();
        var hide = div1.children('.del_container').children('img:first');
        hide.click();
        
        expect(div1.css('display')).toEqual('none');
        
        div1.show();
    });
    
    it("Configurable button should invoke showParameter function", function() {
        spyOn(window, 'showParameter');
    
        div1.configurable();
        var conf = div1.children('.del_container').children('img:first');
        conf.click();
        
        expect(showParameter).toHaveBeenCalled();
    });
});


describe("Editable function test", function() {
    var div, span, h1, h5, li, p, form, input;
    
    var a = {};
    a.n = 0;
    a.fn = function() {
        a.n++;
    }
    a.cb = new Callback(a.fn, a);
    
    beforeEach(function() {
        // Initialisation
        div = $('#div1').editable();
        span = $('#spanobj').editable();
        h1 = $('#h1obj').editable();
        h5 = $('#h5obj').editable();
        li = $('#liobj').editable();
        p = $('#pobj').editable();
        form = $('form').editable();
        input = $('input').editable();
        
        a.n = 0;
    });

    it("Editable should support only SPAN, H, LI, DIV, P", function() {
        span.click();
        expect($('#test span').length).toEqual(0);
        $('textarea').blur();
        
        h1.click();
        expect($('#test h1').length).toEqual(0);
        $('textarea').blur();
        
        h5.click();
        expect($('#test h5').length).toEqual(0);
        $('textarea').blur();
        
        li.click();
        expect($('#test li').length).toEqual(0);
        $('textarea').blur();
        
        p.click();
        expect($('#test p').length).toEqual(0);
        $('textarea').blur();
        
        form.click();
        expect($('#test form').length).toEqual(1);
        
        input.click();
        expect($('#test input').length).toEqual(1);
    });
    
    it("Editable should replace the object with a textarea and it will be replaced again when finishing edit", function() {
        $('textarea').remove();
        
        span.click();
        expect($('#test span').length).toEqual(0);
        
        var editfield = $('textarea');
        expect(editfield.length).toEqual(1);
        editfield.val('Span modified');
        editfield.blur();
        expect($('#test span').text()).toEqual('Span modified');
        
        li.click();
        expect($('#test li').length).toEqual(0);
        
        var editfield = $('textarea');
        expect(editfield.length).toEqual(1);
        editfield.val('LI modified');
        editfield.blur();
        expect($('#test li').text()).toEqual('LI modified');
    });
    
    it("Editable may have a callback", function() {
        p.editable(a.cb);
        
        p.click();
        var editfield = $('textarea');
        editfield.val('P modified');
        editfield.blur();
        
        expect(a.n).toEqual(1);
    });
    
    it("Editable may have a prepare function", function() {
        p.editable(a.cb, a.cb);
        
        p.click();
        expect(a.n).toEqual(1);
        
        var editfield = $('textarea');
        editfield.val('P modified');
        editfield.blur();
        
        expect(a.n).toEqual(2);
    });
    
    it("Editable can response to double click event", function() {
        h5.editable(a.cb, a.cb, true);
        h5.click();
        expect($('#test h5').length).toEqual(1);
        
        h5.dblclick();
        expect($('#test h5').length).toEqual(0);
        var editfield = $('textarea');
        expect(editfield.length).toEqual(1);
        editfield.val('H5 modified');
        editfield.blur();
        expect($('#test h5').text()).toEqual('H5 modified');
    });
});

describe("canGoDown function test", function(){
    var div1, div2;
    var o = {};
    
    beforeEach(function(){  
        o.customFunc = function(){};
        spyOn(o, 'customFunc');
        if(div1) div1.remove();
        if(div2) div2.remove();
        div1 = $('<div/>').css({
                    position: 'absolute', 
                    width: '70px', 
                    height: '30px', 
                    top: '0px',
                    'z-index': 4,
                    'background-color': 'green'});
        div1.appendTo('body').canGoDown();
        div2 = $('<div/>').css({
                    position: 'absolute', 
                    width: '30px', 
                    height: '70px', 
                    top: '0px',
                    'z-index': 5,
                    'background-color': 'blue'});
        div2.appendTo('body').canGoDown();
    });
    
    it("inverse z-index of 2 div in same layer", function(){
        div2.find('img').click();
        expect(parseInt(div2.css('z-index'))).toBe(4);        
        expect(parseInt(div1.css('z-index'))).toBe(5);
    });
    
    it("accept custom function as first parameter", function(){
        div2.canGoDown(o.customFunc);        
        div2.find('img').click();
        expect(o.customFunc).toHaveBeenCalled();
    });
    
    it("do nothing if 'false' is passed as first parameter", function(){
        div2.canGoDown(false);        
        div2.find('img').click();
        expect( parseInt(div2.css('z-index')) ).toBe(5);        
        expect( parseInt(div1.css('z-index')) ).toBe(4);
    });
    
    
    
    
});

