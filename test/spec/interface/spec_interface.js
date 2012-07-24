describe("Initialisation test", function() {
    it(" - Init interface", function() {
        init();
        
        expect(dialog).toEqual(jasmine.any(Popup));
        expect(srcMgr).toEqual(jasmine.any(SourceManager));
        // Tools
        expect(shapeTool).toEqual(jasmine.any(EditableTool));
        expect(textTool).toEqual(jasmine.any(EditableTool));
        expect(wikiTool).toEqual(jasmine.any(CreatTool));
        expect(animeTool).toEqual(jasmine.any(CreatTool));
        expect(scriptTool).toEqual(jasmine.any(CreatTool));
        expect(translationTool).toEqual(jasmine.any(CreatTool));
        // Interface elem
        expect($('#menu_mask').css('display')).toEqual('none');
        expect($('.central_tools').css('display')).toEqual('none');
        expect($('#editor').css('display')).toEqual('none');
        expect($('#rulerX').length).toEqual(1);
        expect($('#rulerY').length).toEqual(1);
    });
});


describe("Dialogs test", function() {
    afterEach(function() {
        dialog.close();
    });
    
    describe("Add file dialog test", function() {
        it(" - Add file dialog should contain 'addLink', 'addFile', 'gamename', 'addjs'", function() {
            addFileDialog();
            
            expect($('#popup_dialog #addLink').prop('type')).toEqual('text');
            expect($('#popup_dialog #addFile').prop('type')).toEqual('file');
            expect($('#popup_dialog #gamename').prop('type')).toEqual('text');
            expect($('#popup_dialog #addjs').prop('type')).toEqual('file');
        });
    });
    
    
    describe("Create page dialog test", function() {
        it(" - Create page dialog should contain 'addPage'", function() {
            createPageDialog();
            
            var name = $('#popup_dialog #addPage');
            expect(name.prop('type')).toEqual('text');
            name.val("testpage");
            dialog.confirm.click();
        });
    });
    
    describe("Create step dialog test", function() {
        it(" - Create step dialog should contain 'stepName', 'normalStep', 'article'", function() {
            createStepDialog();
            
            expect($('#popup_dialog #stepName').prop('type')).toEqual('text');
            expect($('#popup_dialog #normalStep').hasClass('big_button')).toBeTruthy();
            expect($('#popup_dialog #article').hasClass('big_button')).toBeTruthy();
        });
        it(" - Create step dialog should call 'nameValidation' and 'stepExist' when confirm", function() {
            createStepDialog();
            
            spyOn(window, 'nameValidation').andCallThrough();
            spyOn(window, 'stepExist').andCallThrough();
            spyOn(window, 'articleStepDialog').andCallThrough();
            
            $('#popup_dialog #stepName').val('abc');
            $('#popup_dialog #normalStep').click();
            expect(nameValidation).toHaveBeenCalledWith('abc');
            expect(stepExist).toHaveBeenCalledWith('abc');
            
            // article creation call
            createStepDialog();
            $('#popup_dialog #stepName').val('abcd');
            $('#popup_dialog #article').click();
            expect(nameValidation).toHaveBeenCalledWith('abcd');
            expect(stepExist).toHaveBeenCalledWith('abcd');
            expect(articleStepDialog).toHaveBeenCalled();
        });
    });
    
    describe("Article step creation dialog test", function() {
        it(" - Parameters input tag check and validation of parameters", function() {
            articleStepDialog('abcde', {});
            
            var defile = $('#popup_dialog #defile');
            var articlex = $('#popup_dialog #articlex');
            var articley = $('#popup_dialog #articley');
            var linew = $('#popup_dialog #linew');
            var lineh = $('#popup_dialog #lineh');
            var font = $('#popup_dialog #articleFont');
            var fsize = $('#popup_dialog #articleFsize');
            var fontw = $('#popup_dialog #articleFontw');
            var color = $('#popup_dialog #articleColor');
            var align = $('#popup_dialog #articleAlign');
            var content = $('#popup_dialog #articleContent');
            expect(defile.prop('type')).toEqual('checkbox');
            expect(articlex.prop('type')).toEqual('text');
            expect(articley.prop('type')).toEqual('text');
            expect(linew.prop('type')).toEqual('text');
            expect(lineh.prop('type')).toEqual('text');
            expect(font.prop('type')).toEqual('text');
            expect(fsize.prop('type')).toEqual('number');
            expect(fontw.prop('tagName')).toEqual('SELECT');
            expect(color.prop('type')).toEqual('color');
            expect(align.prop('tagName')).toEqual('SELECT');
            expect(content.prop('tagName')).toEqual('TEXTAREA');
            
            // Set values
            articlex.val(50);
            articley.val(150);
            linew.val(400);
            lineh.val(25);
            font.val('MONACO');
            fontw.val('bold');
            fsize.val(23);
            color.val('#F00');
            align.val('center');
            
            // Validation tests
            spyOn(CommandMgr, 'executeCmd').andCallThrough();
            // No content
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalledWith(jasmine.any(AddArticleCmd));
            // X/Y not a number
            content.val('Thank you Mario! But our Princess is in another castle!');
            articlex.val('not a number');
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalledWith(jasmine.any(AddArticleCmd));
            // Line w/h not a number
            articlex.val(50);
            lineh.val('not a number');
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalledWith(jasmine.any(AddArticleCmd));
            // Success execution
            lineh.val(28);
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(AddArticleCmd));
        });
    });
    
    
    describe("Show parameters dialog test", function(){
        it(" - Show parameters dialog should be etablished with right information of target", function() {
            var article = $('#abcde').children('.article');
            var disables = {
            	pos:true
            };
            
            showParameter(article, disables);
            
            var x = $('#popup_dialog #pm_x'), y = $('#popup_dialog #pm_y');
            var w = $('#popup_dialog #pm_width'), h = $('#popup_dialog #pm_height');
            var font = $('#popup_dialog #pm_font'), fsize = $('#popup_dialog #pm_fsize'), fstyle = $('#popup_dialog #pm_fstyle'), align = $('#popup_dialog #pm_align');
            var opacity = $('#popup_dialog #pm_opac'), back = $('#popup_dialog #pm_back'), color = $('#popup_dialog #pm_color'), stroke = $('#popup_dialog #pm_stroke');
            
            expect(parseFloat(x.val())).toBeCloseTo(50, 0.9);
            expect(parseFloat(y.val())).toBeCloseTo(150, 0.9);
            expect(parseFloat(w.val())).toBeCloseTo(400, 0.9);
            expect(font.val()).toEqual('MONACO');
            expect(parseFloat(fsize.val())).toBeCloseTo(23, 0.9);
            expect(fstyle.val()).toEqual('bold');
            expect(color.val() == '#F00' || color.val() == 'rgb(255, 0, 0)').toBeTruthy();
            expect(align.val()).toEqual('center');
        });
        
        it(" - Show parameters dialog should accept configuration of editable parameters", function() {
            var article = $('#abcde').children('.article');
            var disables = {
            	pos:true
            };
            
            showParameter(article, disables);
            var x = $('#popup_dialog #pm_x'), y = $('#popup_dialog #pm_y');
            expect(x.attr('disabled')).toEqual('disabled');
            expect(y.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.size = true;
            showParameter(article, disables);
            var w = $('#popup_dialog #pm_width'), h = $('#popup_dialog #pm_height');
            expect(w.attr('disabled')).toEqual('disabled');
            expect(h.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.text = true;
            showParameter(article, disables);
            var font = $('#popup_dialog #pm_font'), fsize = $('#popup_dialog #pm_fsize'), fstyle = $('#popup_dialog #pm_fstyle'), align = $('#popup_dialog #pm_align');
            expect(font.attr('disabled')).toEqual('disabled');
            expect(fsize.attr('disabled')).toEqual('disabled');
            expect(fstyle.attr('disabled')).toEqual('disabled');
            expect(align.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.opac = true;
            showParameter(article, disables);
            var opacity = $('#popup_dialog #pm_opac');
            expect(opacity.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.back = true;
            showParameter(article, disables);
            var back = $('#popup_dialog #pm_back');
            expect(back.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.color = true;
            showParameter(article, disables);
            var color = $('#popup_dialog #pm_color');
            expect(color.attr('disabled')).toEqual('disabled');
            dialog.close();
            
            disables.stroke = true;
            showParameter(article, disables);
            var stroke = $('#popup_dialog #pm_stroke');
            expect(stroke.attr('disabled')).toEqual('disabled');
        });
        
        it(" - Show parameters dialog should execute a 'ConfigObjCmd' when confirm clicked", function() {
            spyOn(CommandMgr, 'executeCmd');
            showParameter($('#abcde').children('.article'));
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(ConfigObjCmd));
        });
    });
    
    
    describe("Insert element dialog test", function() {
        it(" - Insert element dialog should contain a dropzone for ressources and a textarea for text, ressource panel should be accessible", function() {
            spyOn(window, 'showBottom').andCallThrough();
        
            insertElemDialog();
        
            expect($('#popup_dialog .insert_text').prop('tagName')).toEqual('TEXTAREA');
            expect($('#popup_dialog .drop_zone').length).toEqual(1);
            expect(showBottom).toHaveBeenCalled();
        });
        
        it(" - Cancel the dialog should call 'closeBottom' function", function() {
            spyOn(window, 'closeBottom').andCallThrough();
            
            insertElemDialog();
            dialog.annuler.click();
            
            expect(closeBottom).toHaveBeenCalled();
        });
    });
    
    
    describe("Add script dialog test", function() {
        it(" - Add script dialog should be opened only in right condition", function() {
            spyOn(dialog, 'showPopup').andCallThrough();
            
            // Add helps
            var pageli = $('#pageBar li:first');
            var page = $('.scene:first');
            var pageid = page.prop('id');
            var div = $('<div></div>');
            var li = $('<li>Notpage</li>');
            page.append(div);
            $('#pageBar').prepend(li);
            
            // Add source exemple
            srcMgr.addSource('image', './images/UI/addscript.jpg', 'imgsrc');
            srcMgr.addSource('anime', {}, 'example');
            
            // It should not open the dialog if target is not a jquery object
            addScriptDialog("a page");
            expect(dialog.showPopup).not.toHaveBeenCalled();
            
            // It should not open the dialog if target is an object and it hasn't an id
            addScriptDialog(div, 'obj');
            expect(dialog.showPopup).not.toHaveBeenCalled();
            
            // It should not open the dialog if the target is a LI object and no page attached to this object
            addScriptDialog(li);
            expect(dialog.showPopup).not.toHaveBeenCalled();
            
            // It should not open the dialog if the target is a source icon but not related to an animation
            addScriptDialog($('img[name="imgsrc"]').parent());
            expect(dialog.showPopup).not.toHaveBeenCalled();
            
            // It should not open the dialog if the target is an object with id but we forget to indicate in the second parameter of function
            addScriptDialog($('.article div:first'));
            expect(dialog.showPopup).not.toHaveBeenCalled();
            
            // It should open the dialog if the target is a page li
            addScriptDialog(pageli);
            expect(dialog.showPopup.mostRecentCall.args[0]).toEqual('Ajouter un script pour '+pageid);
            
            // It should open the dialog if the target is a animation source expo
            addScriptDialog($('.icon_src:contains("example")'));
            expect(dialog.showPopup.mostRecentCall.args[0]).toEqual('Ajouter un script pour '+$('p:contains("example")').text());
            
            // It should open the dialog if the target is an object with id
            addScriptDialog($('.article div:first'), 'obj');
            expect(dialog.showPopup.mostRecentCall.args[0]).toEqual('Ajouter un script pour Object');
        });
        
        it(" - Form content check", function() {
            var animexpo = $('.icon_src:contains("example")');
            addScriptDialog(animexpo);
            
            expect($('#popup_dialog #script_name').prop('type')).toEqual('text');
            expect($('#popup_dialog #ajout_auto').prop('type')).toEqual('checkbox');
            expect($('#popup_dialog #script_action').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog #script_reaction').prop('tagName')).toEqual('SELECT');
        });
        
        it(" - Add script dialog can identify page source and source id", function() {
            spyOn(scriptMgr, 'actionSelectList').andCallThrough();
            spyOn(scriptMgr, 'getRelatedScripts').andCallThrough();
            
            var page = $('.scene:first');
            var pageid = page.prop('id');
            var pageli = $('#pageBar li:contains("'+pageid+'")');
            var animexpo = $('.icon_src:contains("example")');
            var obj = $('.article div:first');
            obj.prop('id', 'obj1');
            
            // For page object
            addScriptDialog(pageli);
            expect(scriptMgr.actionSelectList).toHaveBeenCalledWith('script_action', 'page');
            expect(scriptMgr.getRelatedScripts).toHaveBeenCalledWith(pageid);
            dialog.close();
            
            // For animation object
            addScriptDialog(animexpo);
            expect(scriptMgr.actionSelectList).toHaveBeenCalledWith('script_action', 'anime');
            expect(scriptMgr.getRelatedScripts).toHaveBeenCalledWith('example');
            dialog.close();
            
            // For objects
            addScriptDialog(obj, 'obj');
            expect(scriptMgr.actionSelectList).toHaveBeenCalledWith('script_action', 'obj');
            expect(scriptMgr.getRelatedScripts).toHaveBeenCalledWith('obj1');
        });
        
        it(" - Add script dialog cancel button will call 'closeBottom', confirm button will call 'validScript'", function() {
            spyOn(window, 'closeBottom');
            spyOn(window, 'validScript').andCallThrough();
            spyOn(CommandMgr, 'executeCmd').andCallThrough();
            
            var animexpo = $('.icon_src:contains("example")');
            addScriptDialog(animexpo);
            dialog.annuler.click();
            expect(closeBottom).toHaveBeenCalled();
            
            addScriptDialog(animexpo);
            $('#script_name').val('animescript1');
            dialog.confirm.click();
            expect(validScript).toHaveBeenCalled();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(AddScriptCmd));
        });
        
        it(" - Add script dialog will add a modify script button when one or more script exist for the target object", function() {
        
            var animexpo = $('.icon_src:contains("example")');
            addScriptDialog(animexpo);
            
            expect($('#popup_dialog input[value="Modifier les scripts existants"]').length).toEqual(1);
            
            var obj = $('.article #obj1');;
            addScriptDialog(obj, 'obj');
            
            expect($('#popup_dialog input[value="Modifier les scripts existants"]').length).toEqual(0);
        });
    });
    
    
    describe("Modify script dialog test", function() {
        var page, pageid, pageli, animexpo, obj;
    
        it(" - Initialisation of object and add script", function() {
            spyOn(CommandMgr, 'executeCmd').andCallThrough();
        
            page = $('.scene:first');
            pageid = page.prop('id');
            pageli = $('#pageBar li:contains("'+pageid+'")');
            animexpo = $('.icon_src:contains("example")');
            obj = $('.article #obj1');
            
            addScriptDialog(animexpo);
            $('#script_name').val('animescript2');
            dialog.confirm.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(AddScriptCmd));
            addScriptDialog(animexpo);
            $('#script_name').val('animescript3');
            dialog.confirm.click();
            expect(CommandMgr.executeCmd.calls.length).toEqual(2);
            
            addScriptDialog(pageli);
            $('#script_name').val('pagescript1');
            dialog.confirm.click();
            expect(CommandMgr.executeCmd.calls.length).toEqual(3);
        });
        
        it(" - The dialog won't show up if there is no scripts list given", function() {
            spyOn(dialog, 'showPopup').andCallThrough();
        
            modifyScriptDialog(null);
            expect(dialog.showPopup).not.toHaveBeenCalled();
            modifyScriptDialog([]);
            expect(dialog.showPopup).not.toHaveBeenCalled();
        });
        
        it(" - Form content check", function() {
            spyOn(window, 'modifyScriptDialog').andCallThrough();
        
            // Relat src given (dialog opened from add script dialog)
            addScriptDialog(animexpo);
            var modbtn = $('#popup_dialog input[value="Modifier les scripts existants"]');
            modbtn.click();
            expect(modifyScriptDialog).toHaveBeenCalled();
            
            expect($('#popup_dialog #script_name').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog #ajout_auto').prop('type')).toEqual('checkbox');
            expect($('#popup_dialog #script_action').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog #script_reaction').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog input[value="Supprimer"]').prop('type')).toEqual('button');
            expect($('#popup_dialog input[value="Nouveau script"]').prop('type')).toEqual('button');
            dialog.close();
            
            // Relat src not given (dialog opened by the scripts panel)
            var list = scriptMgr.getRelatedScripts('example');
            modifyScriptDialog(list);
            expect($('#popup_dialog #script_name').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog #ajout_auto').prop('type')).toEqual('checkbox');
            expect($('#popup_dialog #script_action').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog #script_reaction').prop('tagName')).toEqual('SELECT');
            expect($('#popup_dialog input[value="Supprimer"]').prop('type')).toEqual('button');
            expect($('#popup_dialog input[value="Nouveau script"]').length).toEqual(0);
        });
        
        it(" - The dialog should call 'tarDynamic' when reaction changed", function() {
        });
        
        it(" - Delete script button should execute 'DelScriptCmd', the popup target changed to next script or add script dialog when no more script found", function() {
        });
        
        it(" - Add script button should change dialog to 'addScriptDialog'", function() {
        });
        
        it(" - The dialog cancel button will call 'closeBottom', confirm button will call 'validScript'", function() {
            spyOn(window, 'closeBottom');
            spyOn(window, 'validScript').andCallThrough();
            spyOn(CommandMgr, 'executeCmd').andCallThrough();
            
            var animexpo = $('.icon_src:contains("example")');
            addScriptDialog(animexpo);
            dialog.annuler.click();
            expect(closeBottom).toHaveBeenCalled();
            
            addScriptDialog(animexpo);
            var modbtn = $('#popup_dialog input[value="Modifier les scripts existants"]').click();
            dialog.confirm.click();
            expect(validScript).toHaveBeenCalled();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(ModifyScriptCmd));
        });
    });
    
    
    describe("New translation dialog test", function() {
        
    });
});




describe("'ConfigObjCmd' test", function() {
    it(" - ConfigObjCmd can config via css a object", function() {
        var article = $('#abcde').children('.article');
        article.css('height', '500');
        article.css('background-color', 'rgb(255, 255, 255)');
        
        showParameter(article);
        
        var x = $('#popup_dialog #pm_x'), y = $('#popup_dialog #pm_y');
        var w = $('#popup_dialog #pm_width'), h = $('#popup_dialog #pm_height');
        var font = $('#popup_dialog #pm_font'), fsize = $('#popup_dialog #pm_fsize'), fstyle = $('#popup_dialog #pm_fstyle'), align = $('#popup_dialog #pm_align');
        var opacity = $('#popup_dialog #pm_opac'), back = $('#popup_dialog #pm_back'), color = $('#popup_dialog #pm_color'), stroke = $('#popup_dialog #pm_stroke');
        
        // Set new values
        x.val(100); y.val(250);
        w.val(450); h.val(300);
        font.val('Verdana');
        fstyle.val('normal');
        fsize.val(19);
        opacity.val(60);
        color.val('#0F0');
        back.val('#00F');
        stroke.val('#F00');
        align.val('right');
        
        dialog.confirm.click();
        
        expect(parseFloat(article.css('left'))).toBeCloseTo(config.sceneX(100), 0.9);
        expect(parseFloat(article.css('top'))).toBeCloseTo(config.sceneY(250), 0.9);
        expect(parseFloat(article.css('width'))).toBeCloseTo(config.sceneX(450), 0.9);
        expect(parseFloat(article.css('height'))).toBeCloseTo(config.sceneY(300), 0.9);
        expect(article.css('font-family')).toEqual('Verdana');
        expect(parseFloat(article.css('font-size'))).toBeCloseTo(config.sceneY(19), 0.9);
        expect(article.css('font-weight')).toEqual('normal');
        expect(article.css('text-align')).toEqual('right');
        expect(parseFloat(article.css('opacity'))).toBeCloseTo(0.6, 0.1);
        expect(article.css('background-color')).toEqual('rgb(0, 0, 255)');
        expect(article.css('color')).toEqual('rgb(0, 255, 0)');
        expect(article.css('border-top-color') == 'rgb(255, 0, 0)' || article.css('border-color') == 'rgb(255, 0, 0)').toBeTruthy();
    });
    
    it(" - ConfigObjCmd undo should roll back the state of object", function(){
        var article = $('#abcde').children('.article');
        CommandMgr.undoCmd();
        
        expect(parseFloat(article.css('left'))).toBeCloseTo(config.sceneX(50), 0.9);
        expect(parseFloat(article.css('top'))).toBeCloseTo(config.sceneY(150), 0.9);
        expect(parseFloat(article.css('width'))).toBeCloseTo(config.sceneX(400), 0.9);
        expect(parseFloat(article.css('height'))).toBeCloseTo(500, 0.9);
        expect(article.css('font-family')).toEqual('MONACO');
        expect(parseFloat(article.css('font-size'))).toBeCloseTo(config.sceneY(23), 0.9);
        expect(article.css('font-weight')).toEqual('bold');
        expect(article.css('text-align')).toEqual('center');
        expect(parseFloat(article.css('opacity'))).toBeCloseTo(1, 0.1);
        expect(article.css('background-color')).toEqual('rgb(255, 255, 255)');
        expect(article.css('color')).toEqual('rgb(255, 0, 0)');
    });
    
    it(" - Redo after undo will reset again the state of object", function() {
        var article = $('#abcde').children('.article');
        CommandMgr.reverseCmd();
    
        expect(parseFloat(article.css('left'))).toBeCloseTo(config.sceneX(100), 0.9);
        expect(parseFloat(article.css('top'))).toBeCloseTo(config.sceneY(250), 0.9);
        expect(parseFloat(article.css('width'))).toBeCloseTo(config.sceneX(450), 0.9);
        expect(parseFloat(article.css('height'))).toBeCloseTo(config.sceneY(300), 0.9);
        expect(article.css('font-family')).toEqual('Verdana');
        expect(parseFloat(article.css('font-size'))).toBeCloseTo(config.sceneY(19), 0.9);
        expect(article.css('font-weight')).toEqual('normal');
        expect(article.css('text-align')).toEqual('right');
        expect(parseFloat(article.css('opacity'))).toBeCloseTo(0.6, 0.1);
        expect(article.css('background-color')).toEqual('rgb(0, 0, 255)');
        expect(article.css('color')).toEqual('rgb(0, 255, 0)');
        expect(article.css('border-top-color') == 'rgb(255, 0, 0)' || article.css('border-color') == 'rgb(255, 0, 0)').toBeTruthy();
    });
});