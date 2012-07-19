describe("Retrieve local saved information test", function() {
    var data = JSON.parse(localdata);
    
    it(" - Pages should be created and added to dom", function() {
        retrieveLocalInfo(data);
        
        // Check number of page in pages and dom
        expect($('.scene').length).toEqual(Object.keys(data.pageSeri).length);
        expect(Object.keys(pages).length).toEqual(Object.keys(data.pageSeri).length);
        // Pages in object 'pages' should be the same as these in DOM
        expect(pages.Couverture.get(0)).toEqual($('#Couverture.scene').get(0));
        expect(pages.Aide.get(0)).toEqual($('#Aide.scene').get(0));
        expect(pages.Chapitre.get(0)).toEqual($('#Chapitre.scene').get(0));
        expect(pages.Content.get(0)).toEqual($('#Content.scene').get(0));
        // Layer should be the same in each page
        for(var i in data.pageSeri) {
            var layers = $('#'+i+'.scene').children('.layer');
            var names = [];
            for(var j = 0; j < layers.length; j++) {
                names.push(layers.get(j).id);
            }
            expect(names).toEqual(Object.keys(data.pageSeri[i]));
        }
    });
    
    it(" - All ressources should be created with success", function() {
        expect(Object.keys(srcMgr.sources)).toEqual(Object.keys(data.sources));
        for(var i in data.sources) {
            var srcdata = data.sources[i].data;
            for(var j in srcdata) {
                expect(srcMgr.sources[i].data[j]).toEqual(srcdata[j]);
            }
        }
    });
    
    it(" - Scripts should be created and other data should be updated", function() {
        // Scripts
        expect(Object.keys(scriptMgr.scripts)).toEqual(Object.keys(data.scripts));
        for(var i in data.scripts) {
            var scriptdata = data.scripts[i];
            for(var j in scriptdata) {
                expect(scriptMgr.scripts[i][j]).toEqual(scriptdata[j]);
            }
        }
    
        // Other data
        expect(srcMgr.currId).toEqual(data.srcCurrId);
        expect(curr.objId).toEqual(data.objCurrId);
        expect(curr.lastModif).toEqual(data.lastModif);
    });
});



describe("Name validation test", function() {
    it(" - Name with space should not be accepted", function() {
        expect(nameValidation('a b')).toBeFalsy();
        expect(nameValidation(' ab')).toBeFalsy();
        expect(nameValidation('ab ')).toBeFalsy();
    });
    
    it(" - Name with french caracters should not be accepted", function() {
        expect(nameValidation('aéb')).toBeFalsy();
        expect(nameValidation('éab')).toBeFalsy();
        expect(nameValidation('abé')).toBeFalsy();
    });
    
    it(" - Name with special caracters should not be accepted", function() {
        expect(nameValidation('a%b')).toBeFalsy();
        expect(nameValidation('\'ab')).toBeFalsy();
        expect(nameValidation('ab)')).toBeFalsy();
    });
    
    it(" - Name started with number or '-' should not be accepted", function() {
        expect(nameValidation('1ab')).toBeFalsy();
        expect(nameValidation('-ab')).toBeFalsy();
    });
    
    it(" - Name started with caracters and include number or '_' or '-' should be accepted", function() {
        expect(nameValidation('a1b-')).toBeTruthy();
        expect(nameValidation('a_b')).toBeTruthy();
    });
});



describe("Save project to local storage test", function() {
    var savename = "savetest";
    
    beforeEach(function() {
        saveToLocalStorage(savename, localdata);
    });
    
    it(" - Check html5 local storage", function() {
        expect(localStorage).not.toEqual(null);
    });
    
    it(" - Project should now exist in local storage and the name of project should be in localStorage.projects", function() {
        expect(localStorage.getItem(savename)).toEqual(localdata);
        var projects = JSON.parse(localStorage.projects);
        expect($.inArray(savename, projects)).not.toEqual(-1);
    });
    
    it(" - Project copies should be equal or less than 5 in local storage", function() {
        var projects = JSON.parse(localStorage.projects);
        expect(projects.length).toBeLessThan(6);
        for(var i in projects) {
            expect(localStorage.getItem(projects[i])).not.toBeNull();
        }
    });
});



describe("checkNextLine function test", function() {
    var font = "18px Arial";
    var width = 300;
    TextUtil.config(font);
    var maxA = Math.floor( width/TextUtil.measure('A') );
    var canvas = $('<canvas></canvas>');
    canvas.css({'position':'fixed','left':'-100px','right':'-100px','width':'0px','height':'0px'});
    var ctx;
    
    var text = "La Petite Ceinture est une ancienne ligne de chemin de fer longue de 32 km qui faisait le tour de Paris.Elle fut terminée en 1869 et destinée au trafic de marchandises et de voyageurs. Concurrencée par le métro, elle est définitivement fermée au trafic des voyageurs en 1985. Le trafic de marchandise est totalement arrêté au début des années 1990";

    beforeEach(function() {
        $('body').append(canvas);
        ctx = canvas.get(0).getContext('2d');
        ctx.font = font;
    });
    afterEach(function() {
        canvas.detach();
    });
    
    it(" - Function measure should give the width in pixel of text given", function() {
        expect(TextUtil.measure('A')).toEqual(jasmine.any(Number));
    });
    
    it(" - String with 'A' repeated maxA times should be shorter in width than width given", function() {
        var str = "";
        for(var i = 0; i < maxA; ++i) {
            str += "A";
        }
        expect(ctx.measureText(str).width).not.toBeGreaterThan(width);
        
    });
    
    it(" - Normal string( normal or all caracters in upper case ) with length maxA should be shorter in width than width given", function() {
        for(var i = 0; i < text.length-maxA; ++i) {
            var substr = text.substr(i, maxA);
            expect(ctx.measureText(substr).width).toBeLessThan(width);
            expect(ctx.measureText(substr.toUpperCase()).width).toBeLessThan(width);
        }
    });
    
    it(" - Function checkNextLine should give the next line optimal( as long as possible )", function() {
        for(var i = 0; i < text.length;) {
        	// Find the index of next line
        	var next = TextUtil.checkNextline(text.substr(i), maxA, width);
        	var sub = text.substr(i, next);
        	
        	// Sub text should have content
        	expect(sub.length).toBeGreaterThan(0);
        	// Sub text should be shorter than width
        	expect(ctx.measureText(sub.trim()).width).toBeLessThan(width);
        	// Add one more word in sub text will make the text larger than width
        	if(next != text.length) {
        	    var nextspace = text.substr(next).search(/[\s\n\r\-\/\\\:]/);
        	    sub += text.substring(next, nextspace);
        	    expect(ctx.measureText(sub.trim()).width).toBeGreaterThan(width);
        	}
        	
        	i += next;
        }
    });
});




describe("Save project test", function() {

    it(" - Sources, scripts should be uploaded, loading gif should be showed, post data should be correct", function() {
        spyOn(loading, 'show');
        spyOn(srcMgr, 'uploadSrc');
        spyOn(scriptMgr, 'upload');
        spyOn($, 'post');
        spyOn(window, 'saveToLocalStorage');
        
        saveProject();
        
        expect(loading.show).toHaveBeenCalled();
        expect(srcMgr.uploadSrc).toHaveBeenCalled();
        expect(scriptMgr.upload).toHaveBeenCalled();
        expect($.post).toHaveBeenCalled();
        
        var postdata = $.post.mostRecentCall.args[1];
        expect(postdata.pjName).toBe(pjName);
        expect(postdata.lang).toBe(pjLanguage);
        expect(postdata.struct).not.toBeNull();
        expect(postdata.struct.search(/(del_Container)|(ctrl_pt)/)).toEqual(-1);
        expect(postdata.objCurrId).toBe(curr.objId);
        expect(postdata.srcCurrId).toBe(srcMgr.currId);
        expect(postdata.untranslated).toEqual(translationTool.untranslated());
        
        //waitsFor(function() {
            //expect(saveToLocalStorage).toHaveBeenCalled();
        //}, "Save project to localStorage function should be called", 6000);
    });
});