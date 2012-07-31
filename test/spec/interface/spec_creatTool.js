describe("Creat tool initialization", function() {
    var tool = null;
    var panel = $("<div id='testeditor' class='central_tools'></div");
    
    afterEach(function() {
        tool = null;
        panel.removeData('relatTool');
    });
    
    it(" - should verify existance of Tools Panel", function() {
        spyOn(console, 'error');
        
        tool = new CreatTool(null);
        expect(console.error).toHaveBeenCalled();
        
        tool = new CreatTool([]);
        expect(console.error.calls.length).toEqual(2);
        
        tool = new CreatTool($("<div></div"));
        expect(console.error.calls.length).toEqual(3);
    });
    
    it(" - with a valid tools panel should initilize correctly a CreatTool", function() {
        var toolspanel = panel;
        tool = new CreatTool(toolspanel);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(parseInt(toolspanel.css('z-index'))).toEqual(config.zid.CreatTool);
        expect(toolspanel.data('relatTool')).toBe(tool);
        expect(tool.editor.get(0)).toEqual($('#editor').get(0));
        expect(tool.menuMask.get(0)).toEqual($('#menu_mask').get(0));
        
        tool.close();
    });
    
    it(" - with active button will link the activation of creat tool to this button", function() {
        var activeBtn = $('#texticon');
        tool = new CreatTool(panel, activeBtn);
        
        spyOn(tool, 'active');
        expect(tool.activeBn).toBe(activeBtn);
        expect(tool.activeBn.data('relatTool')).toBe(tool);
        
        tool.activeBn.click();
        expect(tool.active).toHaveBeenCalled();
        activeBtn.unbind();
        tool.close();
    });
    
    it(" - with unhideable parameter will decide to add a del_container or not to ToolsPanel", function() {
        var toolspanel = panel;
        toolspanel.children('.del_container').remove();
        spyOn(toolspanel, 'hideable').andCallThrough();
        
        tool = new CreatTool(toolspanel, null, true);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(toolspanel.children('.del_container').length).toEqual(0);
        expect(toolspanel.hideable).not.toHaveBeenCalled();
        
        panel.removeData('relatTool');
        tool = new CreatTool(toolspanel, null);
        
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




describe("Activation of a creat tool", function() {
    var tool = null;
    var panel = $("<div id='testeditor' class='central_tools'></div");
    
    afterEach(function() {
        tool = null;
        panel.removeData('relatTool');
    });
    
    it(" - will register the current creat tool in data", function() {
        var activeBtn = $('#texticon');
        tool = new CreatTool(panel, activeBtn);
        
        spyOn(tool, 'active').andCallThrough();
        activeBtn.click();
        expect(tool.active).toHaveBeenCalled();
        expect(tool.editor.data('relatTool')).toBe(tool);
        tool.close();
    });
    
    it(" - will close the tool currently showing and show all panel of edition for this tool", function() {
        wikiTool.active();
        expect($('.central_tools').filter(':visible').length).toEqual(1);
        
        spyOn(wikiTool, 'close').andCallThrough();
        animeTool.active();
        expect(wikiTool.close).toHaveBeenCalled();
        expect(wikiTool.toolsPanel.css('display')).toEqual('none');
        expect(animeTool.toolsPanel.css('display')).not.toEqual('none');
    });
    
    it(" - will call init function of tool", function() {
        tool = new CreatTool(panel, $('#texticon'));
        
        spyOn(tool, 'init');
        tool.active();
        expect(tool.init).toHaveBeenCalled();
        tool.close();
    });
});



describe("Close a creat tool editor", function() {
    var tool = null;
    beforeEach(function() {
        var panel = $("<div id='testeditor' class='central_tools'></div");
        tool = new CreatTool(panel, $('#texticon'));
    });
    
    it(" - will call finish edit function for further manipulation of content", function() {
        spyOn(tool, 'finishEdit').andCallThrough();
        tool.close();
        expect(tool.finishEdit).toHaveBeenCalledWith(jasmine.any(jQuery));
    });
    
    it(" - will clear editor content and data, hide the editor, tools panel, and mask", function() {
        tool.active();
        
        spyOn(tool.editor, 'hide').andCallThrough();
        spyOn(tool.editor, 'unbind').andCallThrough();
        spyOn(tool.menuMask, 'hide').andCallThrough();
        spyOn(tool.toolsPanel, 'hide').andCallThrough();
        
        tool.close();
        
        expect(tool.editor.unbind).toHaveBeenCalled();
        expect(tool.editor.hide).toHaveBeenCalled();
        expect(tool.toolsPanel.hide).toHaveBeenCalled();
        expect(tool.menuMask.hide).toHaveBeenCalled();
        expect(tool.editor.children().length).toEqual(0);
        expect(tool.editor.data('relatTool')).toBeUndefined();
    });
});