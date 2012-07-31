describe("", function(){
    var data = JSON.parse(localdata);  
    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: function(expected) {
                return this.actual instanceof expected;
            },
            toExist: function() { // test the jQuery existance
                return this.actual.length > 0;
            }
        });
    });    
    it("StepManager suite init", function(){
        retrieveLocalInfo(data);
    });
    
    describe("stepExist function", function(){
        it("return true if the name passed exist", function(){
            expect(stepExist('content')).toBe(true);
        });
        it("return false if the name is not an existing step", function(){
            expect(stepExist('improbableStep')).toBe(false);
        });
    });
    
    describe("constructor", function(){
        var page, stepMgr;
        beforeEach(function(){
            spyOn(StepManager.prototype, 'active');
            page = $('<div id="unitPage" class="scene" style="width: 640px; height: 480px; "></div>');                
            stepMgr = new StepManager(page);
        });
        afterEach(function(){
            stepMgr.remove();
        });
        
        it("init the members var ", function(){            
            expect(stepMgr.page).toBe(page)
            expect(stepMgr.manager).toExist();
            expect(typeof stepMgr.steps).toBe('object');
            expect(typeof stepMgr.stepexpos).toBe('object');
            expect(stepMgr.currStepN).toBe(1);
        });
        
        it("add the manager in global 'managers'", function(){
            expect(managers['unitPage']).toBe(stepMgr);
        });
        
        it("add the manager the jQuery data of the page passed", function(){
            expect(page.data('StepManager')).toBe(stepMgr);
        });
        
        it("call this.active() method", function(){
            expect(stepMgr.active).toHaveBeenCalled();
        });
    });
    
    describe("remove function", function(){        
        var page, stepMgr;
        beforeEach(function(){
            spyOn(StepManager.prototype, 'active');
            page = $('<div id="unitPage" class="scene" style="width: 640px; height: 480px; "></div>');                
            stepMgr = new StepManager(page);
            stepMgr.remove();
        });
        
        it("delete the jQuery data", function(){
            expect(stepMgr.page.data('StepManager')).toBe(undefined);
        });
        
        it("delete the manager in DOM", function(){
            expect(stepMgr.page.parents()).not.toExist();
        });
        
        it("set this.steps && this.stepexpos to 'null'", function(){
            expect(stepMgr.steps).toBe(null);
            expect(stepMgr.stepexpos).toBe(null);
        });
        
        it("delete the manager in global 'managers'", function(){
            expect(managers['unitPage']).toBe(undefined);
        });
    });
    
    describe("reinitForPage function", function(){
        var page, stepMgr;
        beforeEach(function(){            
            page = $('<div id="unitPage" class="scene" style="width: 640px; height: 480px; "></div>');    
            stepMgr = new StepManager(page);
            
            spyOn(StepManager.prototype, 'constructor');    
        });
        
        it("make a call to the constructor", function(){
            stepMgr.reinitForPage(page);
            expect(stepMgr.constructor).toHaveBeenCalled();
        });
    });
    
    describe("deleteFunc", function(){
        var mgr;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
        });
        
        it("execute the command DelStepCmd", function(){
            spyOn(CommandMgr, 'executeCmd');
            var delIcon = mgr.stepexpos[1].find('img[src*="del.png"]');
            delIcon.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(DelStepCmd));
        });
        
        it("delete the step expo in DOM", function(){
            var expo = $('#right .expos').filter(function(){ if($(this).css('z-index')=='2') return true; }), // get the showed expos
                delIcon = mgr.stepexpos[1].find('img[src*="del.png"]'),
                n1, n2;
                
            n1 = expo.children().length;
            delIcon.click();
            n2 = expo.children().length;
            
            expect(n2).toBe(n1 - 1);
        });
    });
    
    describe("upFunc", function(){
        var mgr;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            spyOn(CommandMgr, 'executeCmd');
        });
        
        it("execute the command StepUpCmd", function(){
            var delIcon = mgr.stepexpos[1].find('img[src*="up.png"]');
            delIcon.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(StepUpCmd));
        });
    });
    
    describe("downFunc", function(){
        var mgr;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            spyOn(CommandMgr, 'executeCmd');
        });
        
        it("execute the command StepUpCmd", function(){
            var delIcon = mgr.stepexpos[1].find('img[src*="down.png"]');
            delIcon.click();
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(StepDownCmd));
        });
    });
    
    describe("stepUp function", function(){
        var mgr, n;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            n = 1;
        });
        
        it("change the z-index of .scene concerned element", function(){
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n+1];
            
            var step1n1 = step1.css('z-index');
            var step2n1 = step2.css('z-index');
            mgr.stepUp(n);            
            var step1n2 = step1.css('z-index');
            var step2n2 = step2.css('z-index');
            
            expect(step1n2).toBe(step2n1);
            expect(step2n2).toBe(step1n1);
        });
        
        it("inverse the element in the DOM (in right panel)", function(){
            var panel = $('#right .expos').filter(function(){ if($(this).css('z-index')=='2') return true; });
            var steps = panel.children();
            
            var step1before = steps.last(); 
            var step2before = steps.eq(steps.length - 2);
            
            mgr.stepUp(step1before.data('stepN'));

            steps = panel.children();
            var step1after = steps.last(); 
            var step2after = steps.eq(steps.length - 2);
            
            expect(step1before.get(0)).toBe(step2after.get(0));
            expect(step2before.get(0)).toBe(step1after.get(0));
        });
        
        it("change all the jquery data 'stepN'", function(){
            var expo1 = mgr.stepexpos[n];
            var expo2 = mgr.stepexpos[n+1];
            
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n+1];
            
            mgr.stepUp(n);
            
            expect(expo1.data('stepN')).toBe(n+1);            
            expect(expo2.data('stepN')).toBe(n);
            
            expect(step1.data('stepN')).toBe(n+1);            
            expect(step2.data('stepN')).toBe(n);
        });
                
        it("inverse the index in this.stepexpos && this.steps", function(){
            var expo1 = mgr.stepexpos[n];
            var expo2 = mgr.stepexpos[n+1];
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n+1];
            
            mgr.stepUp(n);
            
            expect(expo1).toBe(mgr.stepexpos[n+1]);
            expect(expo2).toBe(mgr.stepexpos[n]);
            
            expect(step1).toBe(mgr.steps[n+1]);
            expect(step2).toBe(mgr.steps[n]);
        });
        
        it("make a call to activeStep function", function(){
            spyOn(mgr,'activeStep').andCallThrough();
            
            mgr.stepUp(n);
            
            expect(mgr.activeStep).toHaveBeenCalled();
        });
    });
    
    describe("stepDown function", function(){
        var mgr, n;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            n = 2;
        });
        
        it("change the z-index of .scene concerned element", function(){
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n-1];
            
            var step1n1 = step1.css('z-index');
            var step2n1 = step2.css('z-index');
            mgr.stepDown(n);            
            var step1n2 = step1.css('z-index');
            var step2n2 = step2.css('z-index');
            
            expect(step1n2).toBe(step2n1);
            expect(step2n2).toBe(step1n1);
        });
        
        it("inverse the element in the DOM (in right panel)", function(){
            var panel = $('#right .expos').filter(function(){ if($(this).css('z-index')=='2') return true; });
            var steps = panel.children();
            
            var step1before = steps.filter(function(){
                if($(this).data('stepN') == n) return true; // the n jQuery obj
            });
            var step2before = steps.filter(function(){
                if($(this).data('stepN') == n - 1) return true; // the n - 1 obj
            });
            
            mgr.stepDown(step1before.data('stepN'));

            steps = panel.children();
            var step1after = steps.filter(function(){
                if($(this).data('stepN') == n) return true;
            });
            var step2after = steps.filter(function(){
                if($(this).data('stepN') == n - 1) return true;
            });
            
            expect(step1before.get(0)).toBe(step2after.get(0));
            expect(step2before.get(0)).toBe(step1after.get(0));
        });
        
        it("change all the jquery data 'stepN'", function(){
            var expo1 = mgr.stepexpos[n];
            var expo2 = mgr.stepexpos[n-1];
            
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n-1];
            
            mgr.stepDown(n);
            
            expect(expo1.data('stepN')).toBe(n-1);            
            expect(expo2.data('stepN')).toBe(n);
            
            expect(step1.data('stepN')).toBe(n-1);            
            expect(step2.data('stepN')).toBe(n);
        });
                
        it("inverse the index in this.stepexpos && this.steps", function(){
            var expo1 = mgr.stepexpos[n];
            var expo2 = mgr.stepexpos[n-1];
            var step1 = mgr.steps[n];
            var step2 = mgr.steps[n-1];
            
            mgr.stepDown(n);
            
            expect(expo1).toBe(mgr.stepexpos[n-1]);
            expect(expo2).toBe(mgr.stepexpos[n]);
            
            expect(step1).toBe(mgr.steps[n-1]);
            expect(step2).toBe(mgr.steps[n]);
        });
        
        it("make a call to activeStep function", function(){
            spyOn(mgr,'activeStep').andCallThrough();
            
            mgr.stepDown(n);
            
            expect(mgr.activeStep).toHaveBeenCalled();
        });        
    });
    
    describe("removeStep function", function(){
        var mgr, n, step;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            step = mgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
        });
        
        it("call activeStep if the step given is active", function(){
            
            var step2 = mgr.addStep('unitTestStep2', null, true);
            
            spyOn(mgr, 'activeStep').andCallThrough(); // spy here because activeStep is could be called in addStep
            
            mgr.removeStep(n); // its not curr.step
            mgr.removeStep(step2.data('stepN')); // its curr.step
            
            expect(mgr.activeStep.calls.length).toBe(1); // called 1 time on 2 removeStep call
        });
        
        it("return and do nothing if it's the last step",function(){
            mgr.removeStep(n); // just prevent because this mgr is not used here
            
            // create a new stepMgr to have an empty one
            var page = $('<div id="unitPage" class="scene" style="width: 640px; height: 480px; "></div>');                
            var stepMgr = new StepManager(page);
            
            step = stepMgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
            
            var currN1 = stepMgr.currStepN;            
            var res = stepMgr.removeStep(n);            
            var currN2 = stepMgr.currStepN;
            
            expect(currN1).toBe(currN2); // no decrement of currStepN
            expect(res).toBe(false);
            
            stepMgr.remove();
        });
        
        it("remove the step and the expo in DOM",function(){
            var stepExpo = mgr.stepexpos[n];
            expect(step.parents()).toExist();            
            expect(stepExpo.parents()).toExist();  
            
            mgr.removeStep(n);
            
            expect(step.parents()).not.toExist();  
            expect(stepExpo.parents()).not.toExist();  
        });
        
        it("re index",function(){
            mgr.stepDown(n--);
            var step1 = mgr.steps[n+1];
            var expo1 = mgr.stepexpos[n+1];
            
            mgr.removeStep(n);
            
            expect(step1).toBe(mgr.steps[n]);
            expect(expo1).toBe(mgr.stepexpos[n]);
            expect(expo1.data('stepN')).toBe(n);
            expect(parseInt(step1.css('z-index'))).toBe(n);            
        });
        
        it("delete this.steps[n] && this.stepexpos[n]",function(){
            mgr.removeStep(n);
            
            expect(mgr.steps[n]).not.toBeDefined();
            expect(mgr.stepexpos[n]).not.toBeDefined();
        });
        
        it("decrement currStepN", function(){
            var n1 = mgr.currStepN;
            mgr.removeStep(n);            
            expect(mgr.currStepN).toBe(n1-1);
        });
        
    });
    
    describe("active function", function(){
        var mgr1, mgr2;
        beforeEach(function(){
            var names =  Object.keys(managers);
            var rdm1 = Math.floor(Math.random()* names.length);
            var rdm2 = rdm1 == 0 ? 1 : rdm1 - 1;
            
            mgr1 = managers.Chapitre;
            mgr2 = managers.Content;
        });
        
        it("change z-index of the manager (in right panel)", function(){
            mgr1.active();
            expect(parseInt(mgr1.manager.css('z-index'))).toBe(2);
            expect(parseInt(mgr2.manager.css('z-index'))).toBe(1);
            
            mgr2.active();
            expect(parseInt(mgr1.manager.css('z-index'))).toBe(1);
            expect(parseInt(mgr2.manager.css('z-index'))).toBe(2);
        });
        
        it("change curr.step", function(){
            mgr1.active();
            var currBefore = curr.step;
            mgr2.active();
            
            expect(curr.step).not.toBe(currBefore);            
        });
        
        it("call activeStep no data('stepN') finded, no call if not", function(){
            var expo = mgr1.manager.children('.expo_active');
            var stepN = expo.data('stepN');
            expo.removeData('stepN');
            mgr2.active();
            
            spyOn(mgr1, 'activeStep');
            mgr1.active();
            
            expect(mgr1.activeStep).toHaveBeenCalled();
            
            expo.data('stepN', stepN);
            mgr1.active();
            
            expect(mgr1.activeStep.callCount).toBe(1);
        });
    });
    
    describe("activeStep function",function(){
        var mgr, n, step;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            step = mgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
        });
        
        afterEach(function(){
            mgr.removeStep(n);
        });
    
        it("curr.step don't change if no valid stepN given", function(){
            var originCurrStep = curr.step;
            var tempN = mgr.currStepN;
            mgr.currStepN = 1;
            
            mgr.activeStep(tempN);
            expect(curr.step).toBe(originCurrStep);
            
            mgr.activeStep(mgr.currStepN);
            expect(curr.step).toBe(originCurrStep);
            
            mgr.activeStep(123);
            expect(curr.step).toBe(originCurrStep);
            
            mgr.currStepN = tempN;
        });
        
        it("curr.step don't change if the step is ever active",function(){
            mgr.activeStep(mgr.currStepN - 1);
            var originCurrStep = curr.step;
            mgr.activeStep(mgr.currStepN - 1);
            expect(curr.step).toBe(originCurrStep);
        });
        
        it("change curr.step", function(){
            mgr.activeStep(n);
            var originCurrStep = curr.step;
            
            mgr.activeStep(n-1);
            expect(curr.step).not.toBe(originCurrStep);
        });
        
        it('change the displaying of step upon and under the choosed step', function(){
            mgr.activeStep(n-1);
            var display1 = mgr.steps[n].css('display');
            var display2 = mgr.steps[n-2].css('display');
            
            expect(display1).toBe('none');
            expect(display2).toBe('block');            
        });
        
        it("change the active step expo", function(){
            mgr.activeStep(n-1);
            mgr.activeStep(n);
            
            var activeExpo = mgr.manager.children('.layer_expo.expo_active').get(0);
            var nExpo = mgr.stepexpos[n].get(0);
            
            expect(activeExpo).toBe(nExpo);
        });
    });

    describe("getStep function", function(){
        var mgr, n, step;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            step = mgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
        });
        
        afterEach(function(){
            mgr.removeStep(n);
        });
        
        it("return the choosed step", function(){
            expect(mgr.getStep(n)).toBe(step);
        });
        
        it("return undefined if non exist stepN", function(){
            expect(mgr.getStep(1625)).not.toBeDefined();
        });
    });
    
    describe("getStepExpo function", function(){
        var mgr, n, step;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            step = mgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
        });
        
        afterEach(function(){
            mgr.removeStep(n);
        });
        
        it("return the choosed stepExpo", function(){
            expect(mgr.getStepExpo(n)).toBe(mgr.stepexpos[n]);
            expect(mgr.getStepExpo(n).data('name')).toBe('unitTestStep');
        });
        
        it("return undefined if non exist stepN", function(){
            expect(mgr.getStepExpo(1625)).not.toBeDefined();
        });
    });
    
    describe("renameStep function", function(){
        var mgr, n, step;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            step = mgr.addStep('unitTestStep', null, true);
            n = step.data('stepN');
            spyOn(CommandMgr, 'executeCmd').andCallThrough();
        });        
        afterEach(function(){
            mgr.removeStep(n);
        });
        
        it("refuse if no name, invalid name or existing name given", function(){
            var res1 = mgr.renameStep(mgr.getStepExpo(n), '  wrong name');
            var res2 = mgr.renameStep(mgr.getStepExpo(n), '');
            var res3 = mgr.renameStep(mgr.getStepExpo(n), 'unitTestStep');
            
            expect(CommandMgr.executeCmd).not.toHaveBeenCalledWith(jasmine.any(RenameStepCmd));
            
            expect(res1).toBe(false);
            expect(res2).toBe(false);
            expect(res3).toBe(false);
        });
        
        it("execute RenameStepCmd if valid name given", function(){
            mgr.renameStep(mgr.getStepExpo(n), 'newStepName');
            
            expect(CommandMgr.executeCmd).toHaveBeenCalledWith(jasmine.any(RenameStepCmd));
        });
        
        it("have change the name",function(){
            mgr.renameStep(mgr.getStepExpo(n), 'newStepName');
            expect(stepExist('newStepName')).toBe(true);
            expect(mgr.getStepExpo(n).data('name')).toBe('newStepName');
        });
    });
    
    describe("createExpo function", function(){
        var mgr, expo;
        beforeEach(function(){
            mgr = managers['Content'];
            mgr.active();
            
            spyOn(mgr, 'deleteFunc');
            spyOn(mgr, 'upFunc');
            spyOn(mgr, 'downFunc');
            
            expo = mgr.createExpo(mgr.currStepN, 'unitTestExpo');            
        });    
        
        it("return a jQuery element", function(){
            expect(expo).toBeInstanceOf(jQuery);
            expect(expo).toExist();
        });
        
        it("return a DOM element with class 'layer_expo'", function(){
            expect(expo.hasClass('layer_expo')).toBe(true);           
        });
        
        it("return an object with data contain the stepN && name given in parameters", function(){
            expect(expo.data('stepN')).toBe(mgr.currStepN);
            expect(expo.data('name')).toBe('unitTestExpo');            
        });
        
        it("return an object wich is deletable and moveable", function(){
            var del = expo.find('img[src*="del"]'),
                up = expo.find('img[src*="up"]'),
                down = expo.find('img[src*="down"]');
            expect(del).toExist();  
            expect(up).toExist();  
            expect(down).toExist();
            
            del.click(); 
            up.click(); 
            down.click();
            
            expect(mgr.deleteFunc).toHaveBeenCalled();
            expect(mgr.upFunc).toHaveBeenCalled();
            expect(mgr.downFunc).toHaveBeenCalled();
        });
    });
    
    describe("addStepWithContent function", function(){
        var $step, mgr;
        function initMgr(){                
            var page = addPage('unitPage');          
            mgr = page.data('StepManager');
            mgr.active();
        }        
        function finishSpec(){            
            delPage('unitPage');
        }
        beforeEach(function(){  
            $step = $(data.pageSeri.Content.mask);
        });
        
        it("refuse if no name, invalid name or existing name given", function(){               
            var page = addPage('unitPage');          
            var mgr = page.data('StepManager');
            mgr.addStep('unitTestStep');
            mgr.active();
            
            var res1 = mgr.addStepWithContent(' invalid name', null);
            var res2 = mgr.addStepWithContent();
            var res3 = mgr.addStepWithContent('unitTestStep', null);
            
            delPage('unitPage');
            
            expect(res1).toBe(false);
            expect(res2).toBe(false);
            expect(res3).toBe(false);
        });
        
        it("return the expected XML element", function(){
            var steps = $('div.layer');
            // changer de manager
            for(var i = 0; i < steps.length; i++){
                var step = steps.eq(i);                
                var parent = step.parent();
                var mgr = steps.eq(i).parent().data('StepManager');
                var content1 = step.html(); // its the expected string
                mgr.removeStep(step.data('stepN')); // remove from the DOM
                
                var name = step.prop('id');
                step = $( data.pageSeri[parent.prop('id')][step.prop('id')] );
                var res = mgr.addStepWithContent(name, step);
                
                expect(content1).toBe(res.html());
                expect(content1).toBe($('div.layer#'+name).html());
            }
        });
        
        it("insert the step in the good place and move others", function(){
            initMgr();
            
            var step1 = mgr.addStep('unitStep1');
            var step2 = mgr.addStep('unitStep2');
            $step.css('z-index', 1);
            
            var step = mgr.addStepWithContent("unitStep", $step);
            expect(step.css('z-index')).toBe($step.css('z-index'));
            
            expect(step1.data('stepN')).toBeGreaterThan(step.data('stepN'));
            expect(step2.data('stepN')).toBeGreaterThan(step.data('stepN'));
            
            finishSpec();
        });
        
        it("increment currStepN and set the data('stepN') to the step", function(){
            initMgr();
                        
            var stepN = mgr.currStepN;
            var step = mgr.addStepWithContent("unitStep", $step);
            expect(mgr.currStepN).toBe(stepN + 1);
            expect(step.data('stepN')).toBe(parseInt($step.css('z-index')));
            
            finishSpec();
        });
        
        it("add the new step to this.page", function(){
            initMgr();
            
            var step = mgr.addStepWithContent('newStep', $step);
            
            expect(mgr.page.find('#newStep')).toExist();
            
            finishSpec();
        });
        
        it("add the new step in this.steps", function(){            
            initMgr();
            
            var step = mgr.addStepWithContent('newStep', $step);
            
            expect(mgr.steps[step.data('stepN')]).toBe(step);
                        
            finishSpec();
        });
        
        it("call createExpo() and set the new expo", function(){
            initMgr();
            
            spyOn(mgr,'createExpo').andCallThrough();
            
            var step = mgr.addStepWithContent('newStep', $step);
            var n = step.data('stepN');
            
            expect(mgr.createExpo).toHaveBeenCalled();
            expect(mgr.stepexpos[n]).toBeDefined();   
            
            finishSpec();
        });
        
        it("call activeStep()", function(){
            initMgr();
            
            spyOn(mgr, 'activeStep').andCallThrough();
            mgr.addStepWithContent('unitStep', $step);
            expect(mgr.activeStep).toHaveBeenCalled();
            
            finishSpec();
        });
        
    });
    
    describe("addStep function", function(){
        var mgr;
        beforeEach(function(){        
            var page = addPage('unitPage');          
            mgr = page.data('StepManager');
            mgr.active();
        });
        
        afterEach(function(){
            delPage('unitPage');
        });
         
        it("refuse if no name, invalid name or existing name given", function(){
            mgr.addStep('unitTestStep');
            
            var res1 = mgr.addStepWithContent(' invalid name', null);
            var res2 = mgr.addStepWithContent();
            var res3 = mgr.addStepWithContent('unitTestStep', null);
                        
            expect(res1).toBe(false);
            expect(res2).toBe(false);
            expect(res3).toBe(false);
        });
        
        it("return jQuery object with class 'layer'", function(){
            var step = mgr.addStep('newStep');
            
            expect(step).toBeInstanceOf(jQuery);
            expect(step.hasClass('layer')).toBe(true);
            
            mgr.removeStep(step.data('stepN'));
        });
        
        it("set z-index and data('stepN') to this.currStepN", function(){
            var step = mgr.addStep('newStep');
            
            expect(parseInt(step.css('z-index'))).toBe(mgr.currStepN - 1);
            expect(step.data('stepN')).toBe(mgr.currStepN - 1);
            
            mgr.removeStep(step.data('stepN'));
        });
        
        it("should accept custom type and defile", function(){
            var param = {defile: true, type: 'unitType'};
            var step = mgr.addStep('newStep', param);
            
            expect(step.attr('type')).toBe(param.type);
            expect(step.attr('defile')).toBe('true');
            
            mgr.removeStep(step.data('stepN'));
        });
        
        it("add the new step to this.page", function(){
            var step = mgr.addStep('newStep');
            
            expect(mgr.page.find('#newStep')).toExist();  
            
            mgr.removeStep(step.data('stepN'));
        });
        
        it("add the new step in this.steps", function(){
            var step = mgr.addStep('newStep');
            
            expect(mgr.steps[step.data('stepN')]).toBe(step);
            
            mgr.removeStep(step.data('stepN'));            
        });
        
        it("call createExpo() and set the new expo", function(){
            spyOn(mgr,'createExpo').andCallThrough();
            
            var step = mgr.addStep('newStep');
            var n = step.data('stepN');
            
            expect(mgr.createExpo).toHaveBeenCalled();
            expect(mgr.stepexpos[n]).toBeDefined();   
            
            mgr.removeStep(step.data('stepN'));                  
        });
        
        it("accept a parameter to choose if the new step is active", function(){
            spyOn(mgr,'activeStep').andCallThrough();
            
            var step = mgr.addStep('newStep'); // its the first so there's no activeStep ==> it call activeStep
            var n = step.data('stepN');            
            expect(mgr.activeStep.callCount).toBe(1);            
            mgr.removeStep(n);  
            
            var step2 = mgr.addStep('newStep2', null, true);
            var n2 = step2.data('stepN');            
            expect(mgr.activeStep.callCount).toBe(2);   // 3rd parameter is true so it active the new step
            
            var step3 = mgr.addStep('newStep3', null, false); // 3rd params is false || null || undefined --> no new call to activeStep
            var n3 = step3.data('stepN');            
            expect(mgr.activeStep.callCount).toBe(2);      

            mgr.removeStep(n3);              
            mgr.removeStep(n2);            
            mgr.removeStep(n);            
        });        
    });
    
});









