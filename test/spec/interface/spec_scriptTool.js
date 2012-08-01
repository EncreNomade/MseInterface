describe("ObjChooser", function() {
    var chooser = null, step, objnoid, objwithid;
    
    beforeEach(function() {
        if(!chooser) {
            chooser = new ObjChooser('testchooser');
            CommandMgr.executeCmd(new AddPageCmd("test"));
            step = $('#test').children('.layer:first');
            objnoid = $("<div></div>");
            objwithid = $("<div id='testchooser'></div>");
            step.append(objnoid).append(objwithid);
            objnoid.selectable();
            objwithid.selectable();
        }
    });
    
    it(" - will be initialized with a jQuery object", function() {
        expect(chooser.jqObj.prop('id')).toEqual('testchooser');
        expect(chooser.jqObj.data('chooser')).toBe(chooser);
    });
    
    it(" - clicked will trigger start choose function", function() {
        spyOn(chooser, 'startChoose').andCallThrough();
        spyOn(chooser, 'choosed').andCallThrough();
        
        chooser.jqObj.click();
        expect(chooser.startChoose).toHaveBeenCalled();
        
        // Current chooser set
        expect(curr.chooser).toBe(chooser);
        // Mask been showed
        expect($('body #objChooserMask').length).toEqual(1);
        // Z-index
        expect( parseInt($('#center_panel').css('z-index')) ).toBeGreaterThan( parseInt($('#popup_dialog').css('z-index')) );
        expect( parseInt($('#right').css('z-index')) ).toBeGreaterThan( parseInt($('#editor').css('z-index')) );
        expect( parseInt($('#center_panel').css('z-index')) ).toBeGreaterThan( parseInt($('#popup_dialog').css('z-index')) );
        expect( parseInt($('#right').css('z-index')) ).toBeGreaterThan( parseInt($('#editor').css('z-index')) );
        expect( parseInt($('#pageBar').css('z-index')) ).toBeGreaterThan( parseInt($('.central_tools').css('z-index')) );
        // Choosed trigger
        objwithid.click();
        expect(chooser.choosed).toHaveBeenCalled();
    });
    
    it(" - choose a object with id will add this id into object", function() {
        spyOn(chooser, 'choosed').andCallThrough();
        
        chooser.jqObj.click();
        objwithid.click();
        
        expect(chooser.choosed).toHaveBeenCalled();
        expect(curr.chooser).toBeNull();
        expect(chooser.val()).toEqual(objwithid.prop('id'));
        // Z-index
        expect( parseInt($('#center_panel').css('z-index')) ).toEqual(config.zid.Scene);
        expect( parseInt($('#right').css('z-index')) ).toEqual(config.zid.Scene);
        expect( parseInt($('#pageBar').css('z-index')) ).toBeLessThan( parseInt($('.central_tools').css('z-index')) );
        expect( parseInt($('#center_panel').css('z-index')) ).toBeLessThan( parseInt($('#popup_dialog').css('z-index')) );
        expect( parseInt($('#right').css('z-index')) ).toBeLessThan( parseInt($('#editor').css('z-index')) );
        expect( parseInt($('#center_panel').css('z-index')) ).toBeLessThan( parseInt($('#popup_dialog').css('z-index')) );
        expect( parseInt($('#right').css('z-index')) ).toBeLessThan( parseInt($('#editor').css('z-index')) );
        // Mask been showed
        expect($('body #objChooserMask').length).toEqual(0);
    });
    
    it(" - choose an object without id will add automatically a reference id to it", function(){
        spyOn(chooser, 'choosed').andCallThrough();
        expect(objnoid.prop('id')).toEqual("");
        
        chooser.jqObj.click();
        objnoid.click();
        
        expect(chooser.choosed).toHaveBeenCalled();
        expect(objnoid.prop('id')).not.toEqual("");
        expect(chooser.val()).toEqual(objnoid.prop('id'));
    });
    
    it(" - a callback can be called when an object is selected", function() {
        var a = 0;
        window.testfn = function() {
            a++;
        };
        chooser.callback = new Callback(window.testfn, window);
        spyOn(chooser, 'choosed').andCallThrough();
        spyOn(chooser.callback, 'invoke').andCallThrough();
        
        chooser.jqObj.click();
        objnoid.click();
        
        expect(chooser.choosed).toHaveBeenCalled();
        expect(chooser.callback.invoke).toHaveBeenCalledWith(objnoid.prop('id'));
        expect(a).toEqual(1);
    });
});




describe("Script tool", function() {
    beforeEach(function() {
        scriptTool.active();
        scriptTool.textArea.val("Thank you Mario! But our Princess is in another castle!");
        
        spyOn(CommandMgr, 'executeCmd').andCallThrough();
        spyOn(window, 'nameValidation').andCallThrough();
        spyOn(dialog, 'showPopup').andCallThrough();
        spyOn(window, 'alert');
    });
    afterEach(function() {
        scriptTool.close();
    });
    
    it(" - won't save script with a name invalid", function() {
        scriptTool.scriptName.val('invalid name');
    
        scriptTool.saveScript();
        
        expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
        expect(dialog.showPopup).not.toHaveBeenCalled();
        expect(nameValidation).toHaveBeenCalledWith('invalid name');
    });
    
    it(" - won't save script with a blank script", function() {
        scriptTool.scriptName.val('testscript');
        scriptTool.textArea.val("");
    
        scriptTool.saveScript();
        
        expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
        expect(dialog.showPopup).not.toHaveBeenCalled();
    });
    
    it(" - will save script with a name valide to source manager", function() {
        scriptTool.scriptName.val('testscript');
    
        scriptTool.saveScript();
        
        expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(AddSrcCmd));
        expect(dialog.showPopup).not.toHaveBeenCalled();
    });
    
    it(" - will propose if an existing script source has the same name", function() {
        if(!srcMgr.isExist('testscript')) {
            scriptTool.scriptName.val('testscript');
            scriptTool.saveScript();
        }
        expect(srcMgr.isExist('testscript')).toBeTruthy();
        scriptTool.scriptName.val('testscript');
    
        scriptTool.saveScript();
        
        expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
        expect(dialog.showPopup).toHaveBeenCalled();
        
        $('#popup_dialog #eraseName').attr('checked', true);
        dialog.confirm.click();
        expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(ModSrcCmd));
    });
    
    it(" - can be initialized with the content of an existing script in source manager by click on his expo", function() {
        if(!srcMgr.isExist('testscript')) {
            scriptTool.scriptName.val('testscript');
            scriptTool.saveScript();
        }
        scriptTool.close();
        
        spyOn(scriptTool, 'editScript').andCallThrough();
        spyOn(scriptTool, 'active').andCallThrough();
        
        var src = srcMgr.getSource('testscript');
        srcMgr.expos['testscript'].click();
        expect(scriptTool.active).toHaveBeenCalled();
        expect(scriptTool.editScript).toHaveBeenCalledWith('testscript', src);
        expect(scriptTool.textArea.val()).toEqual(src);
        expect(scriptTool.scriptName.val()).toEqual('testscript');
    });
});