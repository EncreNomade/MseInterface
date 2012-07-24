describe("", function(){
    var data = JSON.parse(localdata);
    
    it("init", function(){
        retrieveLocalInfo(data);
    });
    
    describe("addPage function", function(){
        var name;
        beforeEach(function(){
            name = 'unitTestPage';
            spyOn(window, 'dropToScene');
            spyOn(window, 'dragOverScene');
            spyOn($.fn, 'addStepManager').andCallThrough();
        });
        afterEach(function(){
            delPage(name);
        });
        
        it("return a div with class 'scene'",function(){
            var page = addPage(name);
            
            expect(typeof page).not.toBe("undefined");
            expect(page.get(0).tagName.toLowerCase()).toBe('div');
            expect(page.hasClass('scene')).toBe(true);
        });
        
        it("add one element in #center_panel",function(){
            var nb1 = $('#center_panel').children().length;
            addPage(name);
            var nb2 = $('#center_panel').children().length;
            
            expect(nb2).toBe(nb1 + 1);
        });
        
        it("make a call to jQuery plugin addStepManager", function(){
            addPage(name);
            expect($.fn.addStepManager).toHaveBeenCalled();
        });
        
        it("bind dropToScene && dragOverScene function",function(){
            var page = addPage(name);
            page.trigger('drop');
            page.trigger('dragover');
            expect(dropToScene).toHaveBeenCalled();
            expect(dragOverScene).toHaveBeenCalled();
        });
        it("add a new page label in tab bar", function(){
            addPage(name);            
            expect($('#newPage').prev().html()).toBe(name);
        });
        
        it("has binded the circleMenu on pageLabel double click",function(){
            addPage(name);
            var label = $('#newPage').prev();
            label.dblclick(); // open circleMenu
            
            expect($('#circleMenu').length).toBe(1);
            
            $('body').click(); // close circleMenu
        });
        
        it("set the new page to active state", function(){
            var page = addPage(name);
            var label = $('#newPage').prev();
            
            expect(label.hasClass('active')).toBe(true); // new page is active
            expect(label.prevAll().hasClass('active')).toBe(false); // other is non active
            
            expect(curr.page).toBe(page);
            expect(parseInt(page.css('z-index'))).toBe(2); // new page has z-index = 2
            expect(parseInt(page.siblings('.scene').css('z-index'))).toBe(1); // other has 1
        });    
        
        it("change the global curr.page to the new one",function(){
            var oldCurr = curr.page,
                page = addPage(name),
                newCurr = curr.page;
            
            expect(oldCurr).not.toBe(newCurr);
            expect(newCurr).toBe(page);
        });        
          
        it("add the new page in the global object 'pages'",function(){
            var page = addPage(name);            
            expect(pages[name]).toBe(page);
        });
    });
    
    describe("delPage function", function(){
        var page, name, stepMgr;
        beforeEach(function(){
            name = 'unitTestPage';
            page = addPage(name);
            stepMgr = page.data('StepManager');
            spyOn(stepMgr, 'remove').andCallThrough();
        });
        
        it("delete the concerned page label in #pageBar", function(){
            var nb1 = $('#pageBar li').length;            
            delPage(name);
            var nb2 = $('#pageBar li').length;    
            
            var isPresent = false;
            $('#pageBar li').each(function(){
                if($(this).text() == name) {
                    isPresent = true;
                    return;
                }
            });
            
            expect(nb2).toBe(nb1 - 1);
            expect(isPresent).toBe(false);
        });
        
        it("call remove on the page StepManager", function(){
            delPage(name);
            expect(stepMgr.remove).toHaveBeenCalled();
        });
        
        it("delete the page in DOM", function(){
            expect($('.scene#'+name).length).toBe(1);
            delPage(name);            
            expect($('.scene#'+name).length).toBe(0);
        });
        
        it("delete the page in global 'pages'",function(){
            delPage(name);
            expect(typeof pages[name]).toBe('undefined');
        });
        
        it("active another page", function(){
            delPage(name);
            var add = $('#pageBar li.add');
            
            var newPage = $('#pageBar li:first-child');
            if(add.prev().length == 0)
                expect(true).toBe(true);                
            else 
                expect(add.prevAll().hasClass('active')).toBe(true);
        });
    });
    
    describe("delCurrentPage", function(){  
        var name;
        beforeEach(function(){
            name = 'unitTestPage';
            spyOn(window, 'DelPageCmd');      
            spyOn(CommandMgr, 'executeCmd');
            spyOn(window, 'alert').andCallFake(function(msg){ console.log('fake alert : '+msg); });
            addPage(name);
        });
        afterEach(function(){
            delPage(name);
        });
        
        it("make execute DelPageCmd",function(){
            delCurrentPage();
            expect(DelPageCmd).toHaveBeenCalled();
            expect(CommandMgr.executeCmd).toHaveBeenCalled();
        });
        
        it("refuse if curr.page is null",function(){
            var temp = curr.page;
            curr.page = null;
            delCurrentPage();
            
            expect(DelPageCmd).not.toHaveBeenCalled();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
            
            curr.page = temp;
        });
        
        it("refuse if there is only one or no page",function(){
            var save = $('.scene');
            var parent = save.parent();            
            save.detach();
            
            // no page            
            delCurrentPage();
            expect(DelPageCmd).not.toHaveBeenCalled();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
            
            // one page            
            delCurrentPage();
            parent.append(save.last());
            expect(DelPageCmd).not.toHaveBeenCalled();
            expect(CommandMgr.executeCmd).not.toHaveBeenCalled();
            
            $('.scene').detach(); // reset scene to 0 element
            save.appendTo(parent); // restore scene with all pages
        });
    });
});