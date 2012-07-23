describe("",function(){
    var data = JSON.parse(localdata);
    
    it("init", function(){
        retrieveLocalInfo(data);
    });

    describe("ValidScript function ",function(){
        var src, type;
        beforeEach(function() {
            waits(1000);
            runs(function(){
                spyOn(window, 'alert').andCallFake(function(msg){console.log('fake alert : '+msg);});
                spyOn(scriptMgr, 'addScript');            
                src = $('#obj1687'); // need a valid obj
                type = 'obj';
                addScriptDialog(src, type);
            });
        });
        
        it("don't valid if no name in #script_name", function(){
            $('#script_name').val('');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).not.toHaveBeenCalled();
        });
        
        it("don't valid if non valid name given", function(){
            $('#script_name').val('8 unitFalseName');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).not.toHaveBeenCalled();
        });
        
        it("don't valid if no action given", function(){
            $('#script_name').val('firstTest');
            $('#script_action').append('<option value="">unit test action</option>')
            $('#script_action').val('');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).not.toHaveBeenCalled();
        });
        
        it("don't valid if no reaction given", function(){
            $('#script_name').val('secondTest');
            $('#script_reaction').append('<option value="">unit test reaction</option>')
            $('#script_reaction').val('');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).not.toHaveBeenCalled();
        });
        
        it("don't valid if the tar type is != to 'effetname' && target is 'null'", function(){
            $('#script_name').val('thirdTest');
            $('#script_tar').append('<option value="">unit test reaction</option>')
            $('#script_tar').val('');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).not.toHaveBeenCalled();
        });
        
        it("accept if a good name is passed and other parameters let to default", function(){
            $('#script_name').val('fourTest');
            dialog.confirm.click();
            
            expect(scriptMgr.addScript).toHaveBeenCalled();
        });
    });

    describe("addScriptObj",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts');
            spyOn(scriptMgr, 'delScript').andCallThrough();
        });
        
        it("refuse absence of name", function(){
            scriptMgr.addScriptObj();
            
            expect(scriptMgr.countScripts).not.toHaveBeenCalled();
        });
        
        it("refuse a non valid script", function(){
            scriptMgr.addScriptObj(" wrongNameTest");
            
            expect(scriptMgr.countScripts).not.toHaveBeenCalled();
        });
        
        it("refuse if the script passed is not an instance of script", function(){
            scriptMgr.addScriptObj("name", 'string');
            scriptMgr.addScriptObj("name", [1,2,3]);
            scriptMgr.addScriptObj("name", window);
            scriptMgr.addScriptObj("name", {object: 1, sample:2});
            
            expect(scriptMgr.countScripts).not.toHaveBeenCalled();
        });
        
        it("delete a script with the same name given", function(){
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
            scriptMgr.addScriptObj("unitTestScript", new Script('src2', 'srcType2', 'action2', 'target2', 'reaction2', 'immediate2', 'supp2'));
            
            expect(scriptMgr.delScript).toHaveBeenCalled();
            
            scriptMgr.delScript("unitTestScript");
        });
        
        it("add the script in expo", function(){
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
            
            expect(typeof scriptMgr.expos["unitTestScript"]).not.toBe("undefined");
            
            scriptMgr.delScript("unitTestScript");
        });
        
        it("add the script in this.scripts", function(){
            var unitScript = new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp');
            scriptMgr.addScriptObj("unitTestScript", unitScript);
            
            expect(scriptMgr.scripts['unitTestScript']).toBe(unitScript);
            
            scriptMgr.delScript("unitTestScript");
        });
        
        it("call this.countScripts", function(){
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
            
            expect(scriptMgr.countScripts).toHaveBeenCalled();
            
            scriptMgr.delScript("unitTestScript");
        });
    });

    describe("delScript",function(){
        var name;
        beforeEach(function() {
            name = "unitTestScript";                         // need valid obj
            scriptMgr.addScriptObj("unitTestScript", new Script('obj1652', 'obj', 'click', 'Couverture', 'pageTrans', true, null));
            spyOn(scriptMgr, 'countScripts');
        });
        
        it("remove the expo HTML element in DOM", function(){
            scriptMgr.delScript(name);
            var expos = $('#Scripts_panel').children('#'+name);
            expect(expos.length).toBe(0);
        });
        
        it("delete this.expo[scriptName]", function(){
            scriptMgr.delScript(name);
            expect(typeof scriptMgr.expos[name]).toBe("undefined");
        });
        
        it("delete this.scripts[name]",function(){
            scriptMgr.delScript(name);
            expect(typeof scriptMgr.scripts[name]).toBe("undefined");
        });
        
        it("call countScripts", function(){
            scriptMgr.delScript(name);
            expect(scriptMgr.countScripts).toHaveBeenCalled();
        });
    });

    describe("getRelatedScripts",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts').andCallFake(function(){
                // console.log('fake countScripts');
            });
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
        });
        afterEach(function(){
            scriptMgr.delScript("unitTestScript");
        });
        
        it("return a list with 1 elem if their only one related script", function(){
            scriptMgr.addScriptObj("unitTestScript", new Script('improbableSrc', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
            var list = scriptMgr.getRelatedScripts('improbableSrc');
            expect(list.length).toBe(1);
        });
        
        it("return a list contain the script related", function(){
            var list = scriptMgr.getRelatedScripts('src');
            expect(list[0].id).toBe('unitTestScript');
        });
        
        it("works if related to src", function(){
            var list = scriptMgr.getRelatedScripts('src');
            expect(list.length).toBeGreaterThan(0);
        });
         
        it("works if related to target", function(){
            var list = scriptMgr.getRelatedScripts('target');        
            expect(list.length).toBeGreaterThan(0);
        });
        
        it("works if related to supp", function(){
            var list = scriptMgr.getRelatedScripts('supp');
            expect(list.length).toBeGreaterThan(0);
        });
        
    });

    describe("getRelatedScriptsDesc",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts').andCallFake(function(){
                // console.log('fake countScripts');
            });        
            spyOn(scriptMgr, 'getRelatedScripts').andCallThrough();
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
        });
        afterEach(function(){
            scriptMgr.delScript("unitTestScript");
        });
        
        it("make a call to 'getRelatedScripts'"),function(){
            expect(scriptMgr.getRelatedScripts).toHaveBeenCalled();
        };
        
        it("return an Array", function(){
            var list = scriptMgr.getRelatedScriptsDesc();
            expect(list instanceof Array).toBe(true);
        });
        
        it("return an empty array if not finded", function(){
            var list = scriptMgr.getRelatedScriptsDesc('improbableObj');
            expect(list.length).toBe(0);
        });
        
        it("return an array containing string elements", function(){
            var list = scriptMgr.getRelatedScriptsDesc('src');
            expect(typeof list[0]).toBe('string');
        });
        
        it("return the good description for the searched obj", function(){
            var list = scriptMgr.getRelatedScriptsDesc('src');
            expect(list[0]).toBe('Le script: unitTestScript');
        });
        
    });

    describe("delRelatedScripts",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts').andCallFake(function(){
                // console.log('fake countScripts');
            });
            spyOn(scriptMgr, 'getRelatedScripts').andCallThrough();
            scriptMgr.addScriptObj("unitTestScript", new Script('srcTest', 'srcType', 'action', 'targetTest', 'reaction', 'immediate', 'suppTest'));
        });    
        
        it("make a call to 'getRelatedScripts'"),function(){
            expect(scriptMgr.getRelatedScripts).toHaveBeenCalled();
        };
        
        it("don't delete a non related script", function(){
            scriptMgr.delRelatedScripts('improbableSrcName');
            expect(typeof scriptMgr.scripts['unitTestScript']).not.toBe('undefined');
        });
        
        it("delete a related script",function(){
            scriptMgr.delRelatedScripts('targetTest');
            expect(typeof scriptMgr.scripts['unitTestScript']).toBe('undefined');
        });
    });

    describe("updateRelatedScripts",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts').andCallFake(function(){
                // console.log('fake countScripts');
            });
            scriptMgr.addScriptObj("unitTestScript", new Script('srcTest', 'srcType', 'action', 'targetTest', 'reaction', 'immediate', 'suppTest'));

        });
        
        it("don't update script wich is not related to the obj", function(){
            scriptMgr.updateRelatedScripts('improbableSrcName', 'newSrc');
            expect(scriptMgr.scripts['unitTestScript'].src).not.toBe('newSrc');
        });
        
        it("update the src", function(){
            scriptMgr.updateRelatedScripts('srcTest', 'newSrc');
            expect(scriptMgr.scripts['unitTestScript'].src).toBe('newSrc');
        });
        
        
        it("update the target", function(){
            scriptMgr.updateRelatedScripts('targetTest', 'newTarget');
            expect(scriptMgr.scripts['unitTestScript'].target).toBe('newTarget');
        });
        
        
        it("update the supp", function(){
            scriptMgr.updateRelatedScripts('suppTest', 'newSupp');
            expect(scriptMgr.scripts['unitTestScript'].supp).toBe('newSupp');
        });
    });

    describe("getSameSrcScripts",function(){
        beforeEach(function() {
            spyOn(scriptMgr, 'countScripts').andCallFake(function(){
                // console.log('fake countScripts');
            });
            scriptMgr.addScriptObj("unitTestScript", new Script('src', 'srcType', 'action', 'target', 'reaction', 'immediate', 'supp'));
        });
        afterEach(function(){
            scriptMgr.delScript("unitTestScript");
        });
        
        it("return an Array", function(){
            var list = scriptMgr.getSameSrcScripts('srcId');
            expect(list instanceof Array).toBe(true);
        });
        
        it("return a list contain the script related", function(){
            var list = scriptMgr.getSameSrcScripts('src');
            expect(list[0].id).toBe('unitTestScript');
        });
         
        it("don't works if related to target", function(){
            var list = scriptMgr.getSameSrcScripts('target');        
            expect(list.length).not.toBeGreaterThan(0);
        });    
    });

    describe("countScripts",function() {
        beforeEach(function() {
            spyOn(scriptMgr, 'getSameSrcScripts').andReturn([]);
            spyOn(scriptMgr, 'updateObjScCount');
            spyOn(scriptMgr, 'updateCircleMenuScCount');
        });
        
        it("makes a call to getSameSrcScripts", function() {
            scriptMgr.countScripts('fakeObj', 'type');
            expect(scriptMgr.getSameSrcScripts).toHaveBeenCalled();
        });
        it("makes a call to updateObjScCount if srcType = 'obj'", function() {
            scriptMgr.countScripts('fakeObj', 'obj');
            expect(scriptMgr.updateObjScCount).toHaveBeenCalled();        
        });
        it("makes a call to updateCircleMenuScCount if srcType != 'obj'", function() {
            scriptMgr.countScripts('fakeObj', 'anime');
            expect(scriptMgr.updateCircleMenuScCount).toHaveBeenCalled();        
        });
        
    });

    describe("updateObjScCount",function(){
        var objId, srcType;
        beforeEach(function() {
            spyOn(window, 'addScriptForObj');
            objId = 'obj1717';
            srcType = 'obj';
            var script = new Script(objId, srcType, 'click', 'Couverture', 'pageTrans', true, null)
            scriptMgr.scripts['testScript'] = script;
        });
            
        it("increment the counter of 1", function(){
            var list = scriptMgr.getSameSrcScripts(objId);        
            var $obj = $('#'+objId);
            var $scriptCounter = $obj.find('.scriptCounter');        
            var nb1 = ($scriptCounter.length == 0) ? 0 : parseInt($scriptCounter.text());
            
            scriptMgr.updateObjScCount(objId, list);
            $scriptCounter = $obj.find('.scriptCounter'); 
            var nb2 =  parseInt($scriptCounter.text());
            
            expect(nb2).toBe(nb1 + 1);
        });
        
        it("don't increment a non-related icon", function(){
            var list = scriptMgr.getSameSrcScripts(objId);        
            var $obj = $('#obj55');
            var $scriptCounter = $obj.find('.scriptCounter');        
            var nb1 = ($scriptCounter.length == 0) ? 0 : parseInt($scriptCounter.text());
            
            scriptMgr.updateObjScCount(objId, list);
            $scriptCounter = $obj.find('.scriptCounter'); 
            var nb2 =  ($scriptCounter.length == 0) ? 0 : parseInt($scriptCounter.text());
            
            expect(nb2).toBe(nb1);
        });
        
        it("bind the counter icon to addScriptForObj on click", function(){        
            var list = scriptMgr.getSameSrcScripts(objId);   
            scriptMgr.updateObjScCount(objId, list);        
            var $obj = $('#'+objId);
            var $scriptCounter = $obj.find('.scriptCounter');   
            $scriptCounter.click();
            
            expect(addScriptForObj).toHaveBeenCalled();        
        });
    });

    describe("updateCircleMenuScCount",function(){
        beforeEach(function() {        
            spyOn(window, 'addScriptDialog');
                      
        });
        it("increment the counter of 1 with srcType = 'page'", function(){
            waits(1000);
            runs(function(){
                var objId = 'Chapitre';         
                var srcType = 'page';
                var $obj = $('#pageBar li:contains("'+objId+'")');
                
                // get the script number
                $obj.dblclick();
                var $scriptCounter = $('#circleMenu .scriptCounter');
                var nb1 = ($scriptCounter.length == 0) ? 0 : parseInt($scriptCounter.text());
                
                // adding a new script
                scriptMgr.scripts['testScript'] = new Script(objId, srcType, 'click', 'Couverture', 'pageTrans', true, null);  ;    
                var list = scriptMgr.getSameSrcScripts(objId);     
                
                // call the function
                scriptMgr.updateCircleMenuScCount(objId, srcType, list);
                
                // get the new script number
                $obj.dblclick();
                $scriptCounter = $('#circleMenu .scriptCounter');
                var nb2 =  parseInt($scriptCounter.text());
                
                // the new number must be 1 more than before
                expect(nb2).toBe(nb1 + 1);            
            });   
        });

        it("increment the counter of 1 with srcType = 'anime'", function(){
            var objId = 'chashow';         
            var srcType = 'anime';
            var $obj = srcMgr.expos[objId];
            
            // get the script number
            $obj.dblclick();
            var $scriptCounter = $('#circleMenu .scriptCounter');
            var nb1 = ($scriptCounter.length == 0) ? 0 : parseInt($scriptCounter.text());
            
            // adding a new script
            scriptMgr.scripts['testScriptAnime'] = new Script(objId, srcType, 'click', 'Couverture', 'pageTrans', true, null);  ;    
            var list = scriptMgr.getSameSrcScripts(objId);     
            
            // call the function
            scriptMgr.updateCircleMenuScCount(objId, srcType, list);
            
            // get the new script number
            $obj.dblclick();
            $scriptCounter = $('#circleMenu .scriptCounter');
            var nb2 =  parseInt($scriptCounter.text());
            
            // the new number must be 1 more than before
            expect(nb2).toBe(nb1 + 1);        
        });
        
        it("bind the counter icon to addScriptForObj on click", function(){
            var objId = 'Chapitre';         
            var srcType = 'page';
            var $obj = $('#pageBar li:contains("'+objId+'")');
            $obj.dblclick();
            var $scriptCounter = $('#circleMenu .scriptCounter');
            
            $scriptCounter.click();
            
            expect(addScriptDialog).toHaveBeenCalled();        
        });
    });

    describe('tarDynamic',function(){
        var $reaction, src, type;
        beforeEach(function() {                 
            $reaction = $('#script_reaction');        
            spyOn(window, 'tarDynamic').andCallThrough();
            spyOn(scriptMgr, 'cursorSelectList').andCallThrough();
            spyOn(scriptMgr, 'scriptSelectList').andCallThrough();
            src = $('#obj1687');
            type = 'obj';
            addScriptDialog(src, type);
        });  
        
        afterEach(function(){ 
            dialog.close(); 
        });
        
        it("is called when change the #script_reaction select list",function(){ 
            $('#script_reaction').change();
            expect(window.tarDynamic.calls.length).toEqual(2); // 2 because it called one time in addScriptDialog()
        });
        it("work when change reaction to objTrans", function(){
            $('#script_reaction').val('objTrans');
            $('#script_reaction').change();
        
            var chooser = dialog.main.find('.objChooser');
            var dz = dialog.main.find('.drop_zone');
            
            // the obj chooser & dropzone has been added to dialog
            expect(chooser.length).toBe(1);
            expect(dz.length).toBe(1);
            expect(dz.data('type')).toBe('image');
        });
        
        it("work with playAnime, loadGame, play/stop voice, script", function(){
            var type = ['playAnime', 'loadGame', 'playVoice', 'stopVoice', 'script'];
            var dz = null, elem = null;
            for (var i = 0; i < type.length; i++) {
                elem = type[i]
                $('#script_reaction').val(elem);
                $('#script_reaction').change();
                dz = dialog.main.find('.drop_zone');
            
                expect(dz.length).toBe(1);
                expect(dz.data('type')).toBe(scriptMgr.reactionTarget(elem));
            }
        });
        
        it("work when change reaction to changeCursor", function(){
            $('#script_reaction').val('changeCursor');
            $('#script_reaction').change();
            
            var select = dialog.main.find('select#script_tar');
            
            expect(select.length).toBe(1);        
            expect(scriptMgr.cursorSelectList).toHaveBeenCalled();        
        });
        
        it("add a drop_zone if choose for cursor 'autre'", function(){
            $('#script_reaction').val('changeCursor');
            $('#script_reaction').change();
            $('#script_tar').val('autre');
            $('#script_tar').change();
            
            var dz = dialog.main.find('.drop_zone');
            
            expect(dz.length).toBe(1);   
            expect(dz.siblings('label').text()).toBe('Cursor personalisé');
            expect($('#bottom').css('z-index')).toBe('110');   
        });
        
        it("work when change to addScript", function(){
            $('#script_reaction').val('addScript');
            $('#script_reaction').change();
            
            expect(scriptMgr.scriptSelectList).toHaveBeenCalled();
        });
        
        it("work when change to pageTrans", function(){
            $('#script_reaction').val('addScript');
            $('#script_reaction').change(); // pageTrans is default so change it to be sure
            
            $('#script_reaction').val('pageTrans');
            $('#script_reaction').change();
            
            var $scene = $('.scene');
            var i = Math.floor(Math.random()*$scene.length);
            var id = $scene.eq(i).prop('id');
            
            var elem = $('select#script_tar option[value="'+id+'"]');
            expect(elem.length).toBe(1);
        });
        
        it("work with existing script on pageTrans", function(){
            var src = $('#pageBar').children(':contains(Chapitre)');
            var list = ["backshowsc","titleshowsc","chashowsc","transCont","chahidecursor"];
            var type = "page";
            modifyScriptDialog(list, "transCont", src, type);
            
            expect($('#script_tar').val()).toBe('Content');
        });
        
        it("work with existing script on objTrans", function(){
            var src = $('#obj1769');
            var list = ["startBack2Show"];
            var type = "obj";        
            modifyScriptDialog(list, "startBack2Show", src, type);        
            
            var transitImg = dialog.main.find('.drop_zone').children('.icon_src').data('srcId');
            var target = $('#script_tar.objChooser h5').text();
            expect(target).toBe('obj15');
            expect(transitImg).toBe('src1');
        });
        
        it("work with existing script on playAnime, loadGame, play/stop voice, script", function(){
            var src = $('#pageBar').children(':contains(Chapitre)');
            var list = ["backshowsc","titleshowsc","chashowsc","transCont","chahidecursor"];
            var type = "page";
            modifyScriptDialog(list, "backshowsc", src, type);
            
            expect($('#script_tar.drop_zone').children().data('srcId')).toBe('backshow');
        });
        
        it("work with existing script on changeCursor", function(){
            var src = $('#pageBar').children(':contains(Aide)');
            var list = ["aidecursor"];
            var type = "page";
            modifyScriptDialog(list, "aidecursor", src, type);
            expect($('#script_reaction').val()).toBe('changeCursor');
            expect($('#script_tar').val()).toBe('default');        
        });

    });

    describe("reactionTarget",function(){
        it("return 'obj' when passed 'objTrans'", function(){
            expect(scriptMgr.reactionTarget('objTrans')).toBe('obj');
        });
        
        it("return 'code' when passed 'script'", function(){
            expect(scriptMgr.reactionTarget('script')).toBe('code');            
        });
        
        it("return 'cursor' when passed 'changeCursor'", function(){
            expect(scriptMgr.reactionTarget('changeCursor')).toBe('cursor');            
        });
        
        it("return 'undefined' when passed not existing name", function(){
            expect(typeof scriptMgr.reactionTarget('fakeName')).toBe('undefined');            
        });
    });

    describe("actionSelectList", function(){
        it("return an empty string if the type given don't exist",function(){
            var result = scriptMgr.actionSelectList('id','improbableType');
            expect(result).toBe('');
        });        
        
        it("return a correct DOM element",function(){
            var result = scriptMgr.actionSelectList('id','obj');
            result = $(result);
            expect(result.length).toBe(1);
        });        
        
        it("return a select list with the ID given",function(){
            var result = scriptMgr.actionSelectList('idTest','obj');
            result = $(result);
            expect(result.prop('id')).toBe('idTest');
            expect(result.get(0).nodeName.toLowerCase()).toBe('select');
        });
        
        it("return a select list with the default option selected",function(){
            var result = scriptMgr.actionSelectList('idTest','page', 'show');
            result = $(result);
            expect(result.val()).toBe('show');
        });
    });

    describe("reactionList", function(){        
        it("return a correct DOM element",function(){
            var result = scriptMgr.reactionList('id');
            result = $(result);
            expect(result.length).toBe(1);
        });        
        
        it("return a select list with the ID given",function(){
            var result = scriptMgr.reactionList('idTest');
            result = $(result);
            expect(result.prop('id')).toBe('idTest');
            expect(result.get(0).nodeName.toLowerCase()).toBe('select');
        });
        
        it("return a select list with the default option selected",function(){
            var result = scriptMgr.reactionList('idTest','objTrans');
            result = $(result);
            expect(result.val()).toBe('objTrans');
        });    
    });

    describe("scriptSelectList", function(){
         it("return a correct DOM element",function(){
            var result = scriptMgr.scriptSelectList('id');
            result = $(result);
            expect(result.length).toBe(1);
        });        
        
        it("return a select list with the ID given",function(){
            var result = scriptMgr.scriptSelectList('idTest');
            result = $(result);
            expect(result.prop('id')).toBe('idTest');
            expect(result.get(0).nodeName.toLowerCase()).toBe('select');
        });
        
        it("return a select list with the default option selected",function(){
            var result = scriptMgr.scriptSelectList('idTest','showFouine');
            result = $(result);
            expect(result.val()).toBe('showFouine');
        }); 
    });

    describe("cursorSelectList", function(){
         it("return a correct DOM element",function(){
            var result = scriptMgr.cursorSelectList('id');
            result = $(result);
            expect(result.length).toBe(1);
        });        
        
        it("return a select list with the ID given",function(){
            var result = scriptMgr.cursorSelectList('idTest');
            result = $(result);
            expect(result.prop('id')).toBe('idTest');
            expect(result.get(0).nodeName.toLowerCase()).toBe('select');
        });
        
        it("return a select list with the default option selected",function(){
            var result = scriptMgr.cursorSelectList('idTest','crosshair');
            result = $(result);
            expect(result.val()).toBe('crosshair');
        }); 
    });

    describe("upload scripts function", function(){
        beforeEach(function(){
            spyOn($, 'ajax').andCallThrough();
            spyOn(window, 'alert').andCallFake(function(msg){
                console.log('fake alert : ' + msg);
            });
        });
        it("make an ajax request",function(){
            runs(function(){
                scriptMgr.upload('../upload_src.php', 'unitTest', 'unitTest');
            });
            waits(1000)
            
            runs(function(){
                expect($.ajax).toHaveBeenCalled();
            });
        });
        
        it("don't makes alert on success", function(){     
            runs(function(){
                scriptMgr.upload('../upload_src.php', 'unitTest', 'unitTest');
            });
            
            waits(1500)
            
            runs(function(){
                expect(window.alert).not.toHaveBeenCalled();
            });
        });
        
        it("alert on called with not existing URL", function(){
            runs(function(){
                scriptMgr.upload('../upload_srrc.php', 'fakePjName', 'fakeLang');
            });
            
            waits(1500)
            
            runs(function(){
                expect(window.alert).toHaveBeenCalled();
            });
        });
    });

});



