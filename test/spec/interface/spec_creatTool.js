describe("Creat tool initialization", function() {
    var tool = null;
    
    afterEach(function() {
        tool = null;
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
        var toolspanel = $('#wikiTools');
        tool = new CreatTool(toolspanel);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(parseInt(toolspanel.css('z-index'))).toEqual(config.zid.CreatTool);
        expect(toolspanel.data('creatTool')).toBe(tool);
        expect(tool.editor.get(0)).toEqual($('#editor').get(0));
        expect(tool.menuMask.get(0)).toEqual($('#menu_mask').get(0));
    });
    
    it(" - with active button will link the activation of creat tool to this button", function() {
        var activeBtn = $('#texticon');
        tool = new CreatTool($('#animeTools'), activeBtn);
        
        spyOn(tool, 'active');
        expect(tool.activeBn).toBe(activeBtn);
        expect(tool.activeBn.data('creatTool')).toBe(tool);
        
        tool.activeBn.click();
        expect(tool.active).toHaveBeenCalled();
    });
    
    it(" - with unhideable parameter will decide to add a del_container or not to ToolsPanel", function() {
        var toolspanel = $('#translateTool');
        toolspanel.children('.del_container').remove();
        spyOn(toolspanel, 'hideable').andCallThrough();
        
        tool = new CreatTool(toolspanel, null, true);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(toolspanel.children('.del_container').length).toEqual(0);
        expect(toolspanel.hideable).not.toHaveBeenCalled();
        
        tool = new CreatTool(toolspanel, null);
        
        expect(tool.toolsPanel).toBe(toolspanel);
        expect(toolspanel.children('.del_container').length).toEqual(1);
        expect(toolspanel.hideable).toHaveBeenCalled();
        
        tool.active();
        spyOn(tool, 'close').andCallThrough();
        toolspanel.find('.del_container img:first').click();
        expect(tool.close).toHaveBeenCalled();
    });
});