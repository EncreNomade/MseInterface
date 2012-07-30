describe("Source type identifier function", function() {
    it(" - should give back the type of a source", function() {
        for(var i in srcMgr.sources) {
            var src = srcMgr.sources[i];
            var type = srcMgr.sourceType(i);
            expect(type).toEqual(src.type);
            expect($.inArray(type, srcMgr.acceptType)).not.toEqual(-1);
        }
    });

    it(" - This function will return 'none' if id request is not in the srcMgr", function() {
        expect(srcMgr.sourceType('definitlynotasource')).toEqual("none");
        expect(srcMgr.sourceType('you got be kidding me')).toEqual("none");
        expect(srcMgr.sourceType(null)).toEqual("none");
        expect(srcMgr.sourceType()).toEqual("none");
        expect(srcMgr.sourceType(0)).toEqual("none");
    });
});



describe("Image/Audio/Game data extension check", function(){
    var example = [
        {ext:'png',data:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="},
        {ext:'jpeg',data:"data:image/jpeg;base64,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="},
        {ext:'png',data:"data:image/png,iVBORw0KGgoAAAANSUhEUgAAAJAAAACNCAYAAABYDvP9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAuvcHJWV3ic7VvbeeO6EebKEGezEJCjCb0H2NChFypBr..."},
        {ext:'gif',data:"data:image/gif;base64,R0lGODlhUAAPAKIAAAsLav///88PD9WqsYmApmZmZtZfYmdakyH5BAQUAP8ALAAAAABQAA8AAAPbWLrc/jDKSVe4OOvNu/9gqARDSRBHegyGMahqO4R0bQcjIQ8E4BMCQc930JluyGRmdAAcdiigMLVrApTYWy5FKM1IQe+Mp+L4rphz+qIOBAUYeCY4p2tGrJZeH9y79mZsawFoaIRxF3JyiYxuHiMGb5KTkpFvZj4ZbYeCiXaOiKBwnxh4fnt9e3ktgZyHhrChinONs3cFAShFF2JhvCZlG5uchYNun5eedRxMAF15XEFRXgZWWdciuM8GCmdSQ84lLQfY5R14wDB5Lyon4ubwS7jx9NcV9/j5+g4JADs="},
        {ext:'mp3',data:"data:audio/mp3;base64,//qwRG2jAAAAAAAAAAAAAAAA..."},
        {ext:'ogg',data:"data:audio/ogg;base64,T2dnUwACAAAAAAAAAACA948rAAAAADALpfQB..."},
        {ext:'wav',data:"data:audio/wav;base64,T2dnUwACAAAAAAAAAACA948rAAAAADALpfQB..."},
        {ext:'jpeg',data:"data:image/jpeg;base64,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="},
        {ext:'js',data:"data:game/js;base64,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="},
        {ext:'js',data:"data:game/js,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="},
        {ext:null,data:'data:text/html;charset=utf-8,%3C%21DOCTYPE%20html%3E%0D%0A%3Chtml%20lang%3D%22en%22%3E%0D%0A%3Chead%3E%3Ctitle%3EEmbedded%20Window%3C%2Ftitle%3E%3C%2Fhead%3E%0D%0A%3Cbody%3E%3Ch1%3E42%3C%2Fh1%3E%3C%2Fbody%3E%0A%3C%2Fhtml%3E%0A%0D%0A'},
        {ext:null,data:"data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D"},
        {ext:null,data:"data:,Hello%2C%20World!"},
        {ext:null,data:"not a data uri string"},
        {ext:null,data:"image/png;"},
        {ext:null,data:"image/png,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="},
        {ext:null,data:"error uri data:image/jpeg;base64,iVBORw0KGgo...HwAAAABJRU5ErkJggg=="}
    ];

    it(" - will not accept when the parameter is not a string", function() {
        expect(srcMgr.dataExtension({})).toBeNull();
        expect(srcMgr.dataExtension([])).toBeNull();
        expect(srcMgr.dataExtension(example[0])).toBeNull();
        expect(srcMgr.dataExtension(0)).toBeNull();
        expect(srcMgr.dataExtension(null)).toBeNull();
        expect(srcMgr.dataExtension()).toBeNull();
    });
    
    it(" - will analyse the correct extension in data string and it accept only image/audio/game data mime type", function() {
        for(var i in example) {
            expect(srcMgr.dataExtension(example[i].data)).toEqual(example[i].ext);
        }
    });
});



describe("Check source existance function", function() {
    it(" - Return true if id in the srcMgr", function() {
        for(var i in srcMgr.sources) {
            expect(srcMgr.isExist(i)).toBeTruthy();
        }
    });
    it(" - Return false if id not found in srcMgr", function() {
        expect(srcMgr.isExist('definitlynotasource')).toBeFalsy();
        expect(srcMgr.isExist('you got be kidding me')).toBeFalsy();
        expect(srcMgr.isExist(null)).toBeFalsy();
        expect(srcMgr.isExist(0)).toBeFalsy();
        expect(srcMgr.isExist()).toBeFalsy();
    });
});



describe("Add source function", function() {
    it(" - should accept not accept unknown type", function() {
        expect(srcMgr.addSource('definitlynotasource')).toBeFalsy();
        expect(srcMgr.addSource('you got be kidding me')).toBeFalsy();
        expect(srcMgr.addSource(null)).toBeFalsy();
        expect(srcMgr.addSource('img')).toBeFalsy();
        expect(srcMgr.addSource()).toBeFalsy();
    });

    it(" - verify data before creation", function() {
        expect(srcMgr.addSource("image", {})).toBeFalsy();
        expect(srcMgr.addSource("audio", [])).toBeFalsy();
        expect(srcMgr.addSource("game", 0)).toBeFalsy();
        expect(srcMgr.addSource("code", null)).toBeFalsy();
        expect(srcMgr.addSource("wiki", {})).toBeFalsy();
        expect(srcMgr.addSource("anime", new Array())).toBeFalsy();
        expect(srcMgr.addSource("speaker", new Wiki('name', $('<div></div>')))).toBeFalsy();
    });
    
    it(" - will give an id autogenerated or use the id which don't conflict with existing source", function() {
        var origin = parseInt(srcMgr.currId);
        
        spyOn(window, 'alert');
        
        // Id given
        var id = srcMgr.addSource('image', './images/bigimage1.jpg', 'image1');
        expect(parseInt(srcMgr.currId)).toEqual(origin);
        expect(id).toEqual('image1');
        srcMgr.delSource('image1');
        // Id auto generate
        id = srcMgr.addSource('image', './images/bigimage1.jpg');
        expect(parseInt(srcMgr.currId)).toEqual(origin+1);
        // Id invalide
        CommandMgr.executeCmd(new RenameSrcCmd(id, 'image1'));
        expect(alert).not.toHaveBeenCalled();
        id = srcMgr.addSource('image', './images/bigimage1.jpg', 'image1');
        expect(id).toBeFalsy();
        expect(alert).toHaveBeenCalled();
    });
    
    it(" - can add image source", function(){
        spyOn($.fn, 'circleMenu').andCallThrough();
        spyOn(Image.prototype, 'addEventListener').andCallThrough();
    
        var path = 'images/bigimage2.jpg';
        var id = srcMgr.addSource('image', path, 'image2');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('image');
        expect(src.data).toEqual(path);
        // Image size register
        expect(Image.prototype.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function), false);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('img').prop('src').indexOf(path)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
    });
    
    it(" - can add audio source", function() {
        spyOn($.fn, 'circleMenu').andCallThrough();
        
        var path = 'support/cran';
        var id = srcMgr.addSource('audio', path, 'audcran');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('audio');
        expect(src.data).toEqual(path);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf(id)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
    });
    
    it(" - can add game source", function() {
        spyOn($.fn, 'circleMenu').andCallThrough();
        
        var path = 'spec/demo.js';
        var id = srcMgr.addSource('game', path, 'game1');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('game');
        expect(src.data).toEqual(path);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf(id)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
        
        spyOn(window, 'base64_encode').andCallFake(function() {
            return "eltsac rehtona ni si ssecnirP ruo tuB !oiraM uoy knahT";
        });
        var data = 'Thank you Mario! But our Princess is in another castle!';
        id = srcMgr.addSource('game', data, 'game2');
        src = srcMgr.sources[id];
        
        // Source type and data set
        expect(src.type).toEqual('game');
        expect(src.data).toEqual("data:game/js;base64,eltsac rehtona ni si ssecnirP ruo tuB !oiraM uoy knahT");
    });
    
    it(" - can add wiki source", function() {
        spyOn($.fn, 'circleMenu').andCallThrough();
        spyOn($.fn, 'click').andCallThrough();
        
        var wiki = new Wiki("wiki1", $('<div></div>'), 'Arial', 20, '#f00');
        var id = srcMgr.addSource('wiki', wiki, 'wiki1');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('wiki');
        expect(src.data).toBe(wiki);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf(id)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        expect($.fn.click).toHaveBeenCalled();
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
        
        // Update wiki
        wiki = new Wiki("wiki2", $('<div></div>'), 'Helvetica', 26, '#00f');
        id = srcMgr.addSource('wiki', wiki, 'wiki1');
        src = srcMgr.sources[id];
        
        expect(src.type).toEqual('wiki');
        expect(src.data).toBe(wiki);
        expect(srcMgr.expos[id]).toBe(expo);
    });
    
    it(" - can add animation source", function(){
        spyOn($.fn, 'circleMenu').andCallThrough();
        spyOn($.fn, 'click').andCallThrough();
        
        var anime = new Animation("anime1", 1, true, false);
        var id = srcMgr.addSource('anime', anime, 'anime1');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('anime');
        expect(src.data).toBe(anime);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf(id)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        expect($.fn.click).toHaveBeenCalled();
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
        
        // Update Animation
        anime = new Animation("anime2", 0, false, false);
        id = srcMgr.addSource('anime', anime, 'anime1');
        src = srcMgr.sources[id];
        
        expect(src.type).toEqual('anime');
        expect(src.data).toBe(anime);
        expect(srcMgr.expos[id]).toBe(expo);
    });
    
    it(" - can add speaker source", function() {
        spyOn($.fn, 'circleMenu').andCallThrough();
        
        var speaker = new Speaker("Mario");
        var id = srcMgr.addSource('speaker', speaker, 'speaker1');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('speaker');
        expect(src.data).toBe(speaker);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf('Mario')).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
        
        // Update speaker
        speaker = new Speaker("Bitch");
        id = srcMgr.addSource('speaker', speaker, 'speaker1');
        src = srcMgr.sources[id];
        
        expect(src.type).toEqual('speaker');
        expect(src.data).toBe(speaker);
        expect(srcMgr.expos[id]).toBe(expo);
        expect(expo.children('p').text().indexOf('Bitch')).not.toEqual(-1);
    });
    
    it(" - can add code source process test", function() {
        spyOn($.fn, 'circleMenu').andCallThrough();
        spyOn($.fn, 'click').andCallThrough();
        
        var code = "Thank you Mario! But our Princess is in another castle!";
        var id = srcMgr.addSource('code', code, 'code1');
        var src = srcMgr.sources[id];
        var expo = srcMgr.expos[id];
        
        // Source type and data set
        expect(src.type).toEqual('code');
        expect(src.data).toEqual(code);
        // Expo creation
        expect(expo).toEqual(jasmine.any(jQuery));
        expect(expo.children('p').text().indexOf(id)).not.toEqual(-1);
        expect(expo.data('srcId')).toEqual(id);
        expect(expo.parent().get(0)).toEqual($('#Ressources_panel').get(0));
        expect($.fn.click).toHaveBeenCalled();
        // Circle menu for expo
        expect($.fn.circleMenu).toHaveBeenCalled();
        
        // Update Code
        code = "Thank you Mario! But our Princess isn't in this castle!";
        id = srcMgr.addSource('code', code, 'code1');
        src = srcMgr.sources[id];
        
        expect(src.type).toEqual('code');
        expect(src.data).toEqual(code);
        expect(srcMgr.expos[id]).toBe(expo);
    });
});




describe("Get source function", function() {
    it(" - return data if source id found in srcMgr, otherwise null is return", function() {
        for(var i in srcMgr.sources) {
            var src = srcMgr.sources[i];
            var data = srcMgr.getSource(i);
            expect(data).toBe(src.data);
        }
        
        expect(srcMgr.getSource({})).toBeNull();
        expect(srcMgr.getSource([])).toBeNull();
        expect(srcMgr.getSource(0)).toBeNull();
        expect(srcMgr.getSource(null)).toBeNull();
        expect(srcMgr.getSource("Mario")).toBeNull();
    });
});



describe("Get ids of all image sources function", function() {
    it(" - give back all images ids", function() {
        var ids = srcMgr.getImgSrcIDs();
        
        for(var i in srcMgr.sources) {
            var type = srcMgr.sources[i].type;
            if(type == "image") {
                expect($.inArray(i, ids)).not.toEqual(-1);
            }
            else expect($.inArray(i, ids)).toEqual(-1);
        }
    });
});



describe("Generate dom element for article object function", function() {
    var layer;
    beforeEach(function(){
        layer = $('.layer:first');
    });

    it(" - accept only image and game source", function() {
        for(var i in srcMgr.sources) {
            var type = srcMgr.sources[i].type;
            if(type == "image" || type == "game") {
                expect(srcMgr.generateChildDomElem(i, layer)).toEqual(jasmine.any(jQuery));
            }
            else expect(srcMgr.generateChildDomElem(i, layer)).toBeNull();
        }
    });
    
    it(" - generate image source as an article children dom element", function() {
        spyOn($.fn, 'deletable').andCallThrough();
        
        var count = 0;
        
        for(var i in srcMgr.sources) {
            var type = srcMgr.sources[i].type;
            if(type == "image") {
                var elem = srcMgr.generateChildDomElem(i, layer);
                count++;
            
                expect(elem.hasClass('illu')).toBeTruthy();
                expect($.fn.deletable.calls.length).toEqual(count);
                expect(elem.children('img').length).toEqual(1);
                expect(elem.children('img').prop('name')).toEqual(i);
                
                elem.remove();
            }
        }
    });
    
    it(" - generate game source as an article children dom element", function() {
        spyOn($.fn, 'deletable').andCallThrough();
        
        var count = 0;
        
        for(var i in srcMgr.sources) {
            var type = srcMgr.sources[i].type;
            if(type == "game") {
                var elem = srcMgr.generateChildDomElem(i, layer);
                count++;
            
                expect(elem.hasClass('game')).toBeTruthy();
                expect($.fn.deletable.calls.length).toEqual(count);
                expect(elem.children('h3:contains("'+i+'")').length).toEqual(1);
                
                elem.remove();
            }
        }
    });
});




describe("Get expo function", function() {
    it(" - return a clone of expo jQuery element if source id found in srcMgr, otherwise null is return", function() {
        for(var i in srcMgr.sources) {
            var expo = srcMgr.expos[i];
            var copy = srcMgr.getExpoClone(i);
            expo.children('.del_container').remove();
            copy.children('.del_container').remove();
            expect(copy).not.toBe(expo);
            // Clone test
            expect(copy.prevObject).toEqual(expo);
            
            copy.remove();
        }
        
        expect(srcMgr.getExpoClone({})).toBeNull();
        expect(srcMgr.getExpoClone([])).toBeNull();
        expect(srcMgr.getExpoClone(0)).toBeNull();
        expect(srcMgr.getExpoClone(null)).toBeNull();
        expect(srcMgr.getExpoClone("Mario")).toBeNull();
    });
});




describe("Delete source function", function(){
    it(" - must remove all dependancies and the source itself", function() {
        var expo, src;
        for(var id in srcMgr.sources) {
            if(srcMgr.sources[id].type == "speaker") continue;
            expo = srcMgr.expos[id];
            expect(expo.parent().length).toEqual(1);
            
            CommandMgr.executeCmd(new DelSrcCmd(id));
            
            // Verify source existance
            expect(srcMgr.getSource(id)).toBeNull();
            expect(srcMgr.getExpoClone(id)).toBeNull();
            expect(expo.parent().length).toEqual(0);
            
            // Verify dependancies
            //  - Scripts
            expect(scriptMgr.getRelatedScriptids(id).length).toEqual(0);
            // - Textlinks
            expect($('span[link="'+id+'"]').length).toEqual(0);
            // - Dom elements
            expect($('[name="'+id+'"]').length).toEqual(0);
            // - Animation, wiki, speaker
            for(var j in srcMgr.sources) {
                src = srcMgr.sources[j];
                if(src.type == "anime" || src.type == "wiki" || src.type == "speaker") {
                    expect(src.data.getDependency(id)).toBeFalsy();
                }
            }
            
            // Reverse commande
            CommandMgr.undoCmd();
        }
    });
});





describe("Prepare delete source function", function(){
    it(" - will get informations for all dependancies", function() {
        spyOn(CommandMgr, 'executeCmd');
        
        var count = 0;
        var expos = $('#Ressources_panel .icon_src').not('#srcAdd');
        for(var i = 0; i < expos.length; ++i) {
            var expo = $(expos.get(i));
            var id = expo.data('srcId');
            var src = srcMgr.sources[id];
            var relations = [];
            // Source existance
            expect(src).toEqual(jasmine.any(Object));
            
            srcMgr.prepareDelSource(expo);
            
            // Popup not shown, no related dependancies
            if($('#popup_dialog').css('display') == "none") {
                count++;
                expect(CommandMgr.executeCmd.calls.length).toEqual(count);
            }
            // Popup shown
            else {
                relations = dialog.main.children('p');
                // Speaker notification is different
                if(src.type == "speaker") {
                    dialog.close();
                    continue;
                }
                
                expect(relations.length).toBeGreaterThan(0);
                    
                // Script descs
                var scs = scriptMgr.getRelatedScriptsDesc(id);
                for(var j = 0; j < scs.length; ++j) {
                    expect(relations.filter(':contains("'+scs[j]+'")').length).toEqual(1);
                }
                // Text links
                $('span[link="'+id+'"]').each(function(){
                    expect(relations.filter(':contains("'+$(this).text()+'")').length).toEqual(1);
                });
                // Dom element
                $('.layer').find('[name="'+id+'"]').each(function() {
                    expect(relations.filter(':contains("'+$(this).parents('.layer').prop('id')+'")').length).toEqual(1);
                });
                // Animation / Wiki / Speaker
                for(var srcid in srcMgr.sources) {
                    var type = srcMgr.sources[srcid].type;
                    if(type == "wiki" || type == "anime" || type == "speaker") {
                        if(srcMgr.sources[srcid].data.getDependency(id)) 
                            expect(relations.filter(':contains("'+srcid+'")').length).toEqual(1);
                    }
                }
            }
            
            dialog.close();
        }
    });
});





describe("Rename and update source function", function() {
    it(" - change the name of source in sources array and expos array, update id in expo data and expo resume text", function() {
        var newid, oldsrc, oldexpo, newsrc, newexpo;
        for(var id in srcMgr.sources) {
            oldsrc = srcMgr.sources[id];
            oldexpo = srcMgr.expos[id];
            
            newid = id;
            // A id doesn't exist in source
            while(srcMgr.sources[newid]) {
                newid = id+id;
            }
            CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
            
            newsrc = srcMgr.sources[newid];
            newexpo = srcMgr.expos[newid];
            
            expect(newsrc).toBe(oldsrc);
            expect(newexpo).toBe(oldexpo);
            expect(newexpo.data('srcId')).toEqual(newid);
            if(newsrc.type != "image") 
                expect(newexpo.children('p:contains("'+newid+'")').length).toEqual(1);
            expect(srcMgr.getSource(id)).toBeNull();
            expect(srcMgr.getExpoClone(id)).toBeNull();
            
            CommandMgr.undoCmd();
        }
    });
    
    it(" - don't accept to change a source inexist, neither when the new id exist already in source", function() {
        spyOn(srcMgr, 'rename');
    
        CommandMgr.executeCmd(new RenameSrcCmd("Mario doesn't exist", "namedontexist"));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd({}, "namedontexist"));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd([], "namedontexist"));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd(0, "namedontexist"));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        var existid = Object.keys(srcMgr.sources)[0];
        CommandMgr.executeCmd(new RenameSrcCmd(existid, "Mario doesn't exist"));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd(existid, {}));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd(existid, []));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        CommandMgr.executeCmd(new RenameSrcCmd(existid, 0));
        expect(srcMgr.rename).not.toHaveBeenCalled();
        
        var existid2 = Object.keys(srcMgr.sources)[1];
        CommandMgr.executeCmd(new RenameSrcCmd(existid, existid2));
        expect(srcMgr.rename).not.toHaveBeenCalled();
    });
    
    it(" - replace expo image name attribute for image source", function() {
        for(var id in srcMgr.sources) {
            if(srcMgr.sources[id].type == "image")
                break;
        }
        
        var newid = "mario";
        // A id doesn't exist in source
        while(srcMgr.sources[newid]) {
            newid = newid+newid;
        }
        CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
        
        expect(srcMgr.expos[newid].children('img').attr('name')).toEqual(newid);
        
        CommandMgr.undoCmd();
    });
    
    it(" - update name attribute in animation/wiki/speaker object", function() {
        for(var id in srcMgr.sources) {
            if(srcMgr.sources[id].type == "wiki")
                break;
        }
        
        var newid = "mario";
        // A id doesn't exist in source
        while(srcMgr.sources[newid]) {
            newid = newid+newid;
        }
        CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
        expect(srcMgr.sources[newid].data.name).toEqual(newid);
        CommandMgr.undoCmd();
        
        for(var id in srcMgr.sources) {
            if(srcMgr.sources[id].type == "anime")
                break;
        }
        
        var newid = "mario";
        // A id doesn't exist in source
        while(srcMgr.sources[newid]) {
            newid = newid+newid;
        }
        CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
        expect(srcMgr.sources[newid].data.name).toEqual(newid);
        CommandMgr.undoCmd();
        
        for(var id in srcMgr.sources) {
            if(srcMgr.sources[id].type == "speaker")
                break;
        }
        
        var newid = "mario";
        // A id doesn't exist in source
        while(srcMgr.sources[newid]) {
            newid = newid+newid;
        }
        CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
        expect(srcMgr.sources[newid].data.name).toEqual(newid);
        CommandMgr.undoCmd();
    });
    
    it(" - update dependencies for source", function() {
        var newid, scripts, textlinks, doms, srcs;
        for(var id in srcMgr.sources) {
            // Original dependancies
            // Scripts
            scripts = scriptMgr.getRelatedScripts(id);
            // Text links
            textlinks = $('span[link="'+id+'"]');
            // Dom element
            doms = $('.layer').find('[name="'+id+'"]');
            // wiki / anime / speaker
            srcs = [];
            for(var i in srcMgr.sources) {
                var type = srcMgr.sources[i].type;
                if(type == "wiki" || type == "anime" || type == "speaker") {
                    if(srcMgr.sources[i].data.getDependency(id)) 
                        srcs.push(srcMgr.sources[i].data);
                }
            }
            
            newid = id;
            // A id doesn't exist in source
            while(srcMgr.sources[newid]) {
                newid = id+id;
            }
            CommandMgr.executeCmd(new RenameSrcCmd(id, newid));
            
            // Dependancies verification
            // Scripts
            for(var j = 0; j < scripts.length; ++j) {
                var script = scripts[j];
                expect(script.relatedWith(newid)).toBeTruthy();
            }
            // Text links
            textlinks.each(function(){
                expect($(this).attr('link')).toEqual(newid);
            });
            // Dom element
            doms.each(function() {
                expect($(this).attr('name')).toEqual(newid);
            });
            // Animation / Wiki / Speaker
            for(var i = 0; i < srcs.length; ++i)
                expect(srcs[i].getDependency(newid)).toBeTruthy();
            
            CommandMgr.undoCmd();
        }
    });
});




describe("Upload sources function", function() {

    it(" - Upload source for each source will either call updateSrcs function or make a ajax call", function() {
        spyOn(srcMgr, 'updateSrcs');
        spyOn($, 'ajax');
        
        srcMgr.uploadSrc('upload_src.php', pjName, pjLanguage);
        
        expect(srcMgr.updateSrcs.calls.length + $.ajax.calls.length).toEqual( Object.keys(srcMgr.sources).length );
    });
    
    it(" - For updating Source, the sources should be encoded", function() {
        spyOn($, 'ajax');
        spyOn(JSON, 'stringify');
        
        srcMgr.uploaded = Object.keys(srcMgr.sources).length;
        srcMgr.updateSrcs(pjName, pjLanguage);
        
        expect($.ajax).toHaveBeenCalled();
        expect(JSON.stringify).toHaveBeenCalledWith(srcMgr.sources);
    });
    
});