describe("Editable tool initialization", function() {
    var tool = null;
    var panel = $("<div id='testeditor' class='central_tools'></div");
    
    afterEach(function() {
        tool = null;
        panel.removeData('relatTool');
    });
    
    it(" - should verify existance of Tools Panel", function() {
        spyOn(console, 'error');
        
        tool = new EditableTool(null);
        expect(console.error).toHaveBeenCalled();
        
        tool = new EditableTool([]);
        expect(console.error.calls.length).toEqual(2);
        
        tool = new EditableTool($("<div></div"));
        expect(console.error.calls.length).toEqual(3);
    });
    
    it(" - with a valid tools panel should initilize correctly a EditableTool", function() {
        EditableTool.prototype.allTools.replace("#testeditor", "");
        
        var toolspanel = panel;
        tool = new EditableTool(toolspanel);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(parseInt(toolspanel.css('z-index'))).toEqual(config.zid.EditableTool);
        expect(toolspanel.data('relatTool')).toBe(tool);
        expect(tool.editor).toEqual(jasmine.any(jQuery));
        expect(tool.editor.data('relatTool')).toEqual(tool);
        expect(tool.allTools.indexOf('#testeditor')).not.toEqual(-1);
        
        tool.close();
    });
    
    it(" - with active button will link the activation of editable tool to this button", function() {
        var activeBtn = $('#texticon');
        tool = new EditableTool(panel, activeBtn);
        
        spyOn(tool, 'active');
        expect(tool.activeBn).toBe(activeBtn);
        expect(tool.activeBn.data('relatTool')).toBe(tool);
        
        tool.activeBn.click();
        expect(tool.active).toHaveBeenCalled();
        activeBtn.unbind();
        tool.close();
    });
    
    it(" - with add a del_container and make the tools panel hideable", function() {
        var toolspanel = panel;
        toolspanel.children('.del_container').remove();
        spyOn(toolspanel, 'hideable').andCallThrough();
        
        tool = new EditableTool(toolspanel, null);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(toolspanel.children('.del_container').length).toEqual(1);
        expect(toolspanel.hideable).toHaveBeenCalled();
        
        tool.active();
        spyOn(tool, 'close').andCallThrough();
        toolspanel.find('.del_container img:first').click();
        expect(tool.close).toHaveBeenCalled();
        tool.close();
    });
});




describe("Activation of a editable tool", function() {
    var tool = null;
    var panel = $("<div id='testeditor' class='central_tools'></div");
    
    afterEach(function() {
        tool = null;
        panel.removeData('relatTool');
    });
    
    it(" - will add editor panel to the relative parent of edit environment", function() {
        var activeBtn = $('#texticon');
        tool = new EditableTool(panel, activeBtn);
        
        spyOn(tool, 'active').andCallThrough();
        activeBtn.click();
        expect(tool.active).toHaveBeenCalled();
        expect(tool.editor.hasClass('direct_editor')).toBeTruthy();
        expect(tool.editor.parent().get(0)).toEqual(curr.page.get(0));
        tool.close();
        
        animeTool.active();
        tool.active();
        expect(tool.editor.parent().get(0)).toEqual(animeTool.editor.get(0));
        tool.close();
        animeTool.close();
    });
    
    it(" - will close the tool currently showing and show all panel of edition for this tool", function() {
        shapeTool.active();
        
        spyOn(shapeTool, 'close').andCallThrough();
        textTool.active();
        expect(shapeTool.close).toHaveBeenCalled();
        expect(shapeTool.toolsPanel.css('display')).toEqual('none');
        expect(textTool.toolsPanel.css('display')).not.toEqual('none');
        textTool.close();
    });
    
    it(" - will call init function of tool", function() {
        tool = new EditableTool(panel, $('#texticon'));
        
        spyOn(tool, 'init');
        tool.active();
        expect(tool.init).toHaveBeenCalled();
        tool.close();
    });
});



describe("Close a editable tool editor", function() {
    var tool = null;
    beforeEach(function() {
        var panel = $("<div id='testeditor' class='central_tools'></div");
        tool = new EditableTool(panel, $('#texticon'));
    });
    afterEach(function() {
        $('#testeditor').remove();
    });
    
    it(" - will execute a AddToSceneCmd", function() {
        spyOn(CommandMgr, 'executeCmd');
        tool.close();
        expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(AddToSceneCmd));
    });
    
    it(" - will clear editor content and data, delete the editor, tools panel", function() {
        tool.active();
        
        spyOn(tool.editor, 'detach').andCallThrough();
        spyOn(tool.toolsPanel, 'hide').andCallThrough();
        
        tool.close();
        
        expect(tool.editor.detach).toHaveBeenCalled();
        expect(tool.toolsPanel.hide).toHaveBeenCalled();
        expect(tool.editor.children().length).toEqual(0);
    });
});



describe("Get editor parent and get target", function() {
    var pagelis = null, tool;
    
    beforeEach(function() {
        if(!pagelis) {
            // Init tool
            var panel = $("<div id='testeditor' class='central_tools'></div");
            tool = new EditableTool(panel, $('#texticon'));
            
            for(var i = 0; i < 5; ++i) {
                // Create page
                var page = CommandMgr.executeCmd(new AddPageCmd("newpage"+i));
                // Create layer
                var mgr = page.data('StepManager');
                for(var j = 0; j < 3; ++j)
                    CommandMgr.executeCmd(new AddStepCmd(mgr, "page"+i+"step"+j));
            }
            pagelis = $('#newpage').prevAll();
        }
    });
    
    it(" - Editor parent will be the current page or the animation editor", function() {
        pagelis.each(function() {
            $(this).click();
            var name = $(this).text();
            var page = $('#'+name);
            expect(tool.getEditorParent().get(0)).toEqual(page.get(0));
            tool.active();
            expect(tool.editor.parent().get(0)).toEqual(page.get(0));
            tool.close();
        });
        
        animeTool.active();
        expect(tool.getEditorParent().get(0)).toEqual(animeTool.editor.get(0));
        tool.active();
        expect(tool.editor.parent().get(0)).toEqual(animeTool.editor.get(0));
        tool.close();
        animeTool.close();
    });
    
    it(" - Target will be the current step or the frame on top for animation editor", function() {
        pagelis.each(function() {
            $(this).click();
            var name = $(this).text();
            var page = $('#'+name);
            var mgr = page.data('StepManager');
            mgr.manager.children('.layer_expo').each(function() {
                // Change step
                $(this).click();
                var stepn = $(this).data('stepN');
                var step = mgr.getStep(stepn);
                
                tool.active();
                expect(tool.getTarget().get(0)).toEqual(step.get(0));
                tool.close();
            });
        });
    });
});