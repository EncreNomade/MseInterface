// Class extend utilitie function
function extend(Child, Parent) {
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
};

var Stack = function(capacity) {
    var arr = [];
    if(!isNaN(capacity) && capacity > 0) this.capacity = capacity;
    else this.capacity = 20;
    
    this.push = function(obj) {
        while(arr.length >= this.capacity)
            arr.shift();
        arr.push(obj);
    };
    this.pop = function() {
        return arr.pop();
    };
};

var Command = function() {
    this.state = "WAITING";
};
Command.prototype = {
    constructor: Command,
    execute: function() {
        // var args = Array.prototype.slice.call(arguments);
        // this.dofn.apply(caller, args);
        this.state = "SUCCESS";
    },
    undo: function() {
        this.state = "CANCEL";
    }
};


/* Page Commands
 *
 * 1. Add Page Command
 * 2. Delete Page Command
 *
 */

var AddPageCmd = function(name) {
    if(!name || !nameValidation(name)) {
        this.state = "INVALID";
        return;
    }
    this.name = name;
    this.state = "WAITING";
};
extend(AddPageCmd, Command);
$.extend(AddPageCmd.prototype, {
    execute: function() {
        if(pages[this.name]) {
            this.state = "FAILEXE";
            return false;
        }
        var page = addPage(this.name);
        // Add default step
        var mgr = page.data('StepManager');
        mgr.addStep(this.name+'default', null, true);
        this.state = "SUCCESS";
        return page;
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        if(!pages[this.name]) {
            this.state = "FAILUNDO";
            return false;
        }
        delPage(this.name);
        
        this.state = "CANCEL";
        return true;
    }
});

var DelPageCmd = function(name) {
    if(!name || !nameValidation(name)) {
        this.state = "INVALID";
        return;
    }
    this.name = name;
    this.state = "WAITING";
};
extend(DelPageCmd, Command);
$.extend(DelPageCmd.prototype, {
    execute: function() {
        if(!pages[this.name]) {
            this.state = "FAILEXE";
            return false;
        }
        
        var serializer = new XMLSerializer();
        // Replace img src with relative Path on server
        var imgids = srcMgr.getImgSrcIDs();
        for(var i in imgids) {
            pages[this.name].find("img[name='"+imgids[i]+"']").attr('src', srcMgr.getSource(imgids[i]));
        }
        // Save structure of page
        var struct = {};
        var steps = managers[this.name].steps;
        for(var i in steps) {
            var step = steps[i].clone();
            step.find('.del_container, .ctrl_pt').remove();
            struct[step.prop('id')] = serializer.serializeToString(step.get(0));
        }
        this.deletedPage = struct;
        
        delPage(this.name);
        this.state = "SUCCESS";        
        return true;
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        var page = addPage(this.name);
        scriptMgr.countScripts(page.attr('id'), "page");
        for(var sname in this.deletedPage) {
            var step = $(this.deletedPage[sname]);
            page.data('StepManager').addStepWithContent(sname, step);
        }
        this.state = "CANCEL";
    }
});

/* Scripts Commands
 *
 * 1. Add Script Command
 * 2. Del Script Command
 *
 */
var AddScriptCmd = function(name, src, srcType, action, target, reaction, immediate, supp){
    this.name = name;
    this.src = src;
    this.srcType = srcType;
    this.action = action;
    this.target = target;
    this.reaction = reaction;
    this.immediate = immediate;
    this.supp = supp;
    
    this.state = "WAITING";
};
extend(AddScriptCmd, Command);
$.extend(AddScriptCmd.prototype, {
    execute: function(){
        scriptMgr.addScript(this.name,this.src,this.srcType,this.action,this.target,this.reaction,this.immediate,this.supp);
        this.state = "SUCCESS";
    },
    undo: function(){
        if(typeof scriptMgr.scripts[this.name] == 'undefined'){
            this.state = "FAILUNDO";
            return;
        }
        scriptMgr.delScript(this.name);
        this.state = "CANCEL";
    }
});

var DelScriptCmd = function(name){
    this.name = name;
    this.src        = scriptMgr.scripts[name].src;
    this.srcType    = scriptMgr.scripts[name].srcType;
    this.action     = scriptMgr.scripts[name].action;
    this.target     = scriptMgr.scripts[name].target;
    this.reaction   = scriptMgr.scripts[name].reaction;
    this.immediate  = scriptMgr.scripts[name].immediate;
    this.supp       = scriptMgr.scripts[name].supp;
    this.state = 'WAITING';
};
extend(DelScriptCmd, Command);
$.extend(DelScriptCmd.prototype, {
    execute: function(){
        if(typeof scriptMgr.scripts[this.name] == 'undefined'){
            this.state = "FAILEXE";
            return;
        }
        scriptMgr.delScript(this.name);
        this.state = "SUCCESS";
    },
    undo: function(){
        scriptMgr.addScript(this.name,this.src,this.srcType,this.action,this.target,this.reaction,this.immediate,this.supp);
        this.state = "CANCEL";
    }
});


/* Step Commands
 *
 * 1. Add Step Command
 * 2. Delete Step Command
 * 3. Up Action Command
 * 4. Down Action Command
 *
 */
 
var AddStepCmd = function(mgr, name, params) {
    if(!name || !nameValidation(name) || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.name = name;
    this.manager = mgr;
    this.params = params ? params : {};
    this.state = "WAITING";
};
extend(AddStepCmd, Command);
$.extend(AddStepCmd.prototype, {
    execute: function() {
        if($('.layer[id="'+this.name+'"]').length > 0) {
            this.state = "FAILEXE";
            return false;
        }
        this.step = this.manager.addStep(this.name, this.params, true);
        this.state = "SUCCESS";
        return this.step;
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        this.manager.removeStep(this.step.data('stepN'));
        this.state = "CANCEL";
    }
});

var AddArticleCmd = function(mgr, name, params, content) {
    if(!name || !nameValidation(name) || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.name = name;
    this.manager = mgr;
    this.content = content;
    this.params = params ? params : {};
    this.state = "WAITING";
};
extend(AddArticleCmd, Command);
$.extend(AddArticleCmd.prototype, {
    execute: function() {
        if($('.layer[id="'+this.name+'"]').length > 0) {
            this.state = "FAILEXE";
            return false;
        }
        addArticle(this.manager, this.name, this.params, this.content);
        this.state = "SUCCESS";
        return this.step;
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        this.manager.removeStep($('#'+this.name).data('stepN'));
        this.state = "CANCEL";
    }
});

var DelStepCmd = function(mgr, stepN) {
    if(!stepN || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.stepN = stepN;
    this.step = mgr.getStep(stepN).clone();
    this.step.find('.del_container, .ctrl_pt').remove();
    this.name = this.step.prop('id');
    this.manager = mgr;
    this.state = "WAITING";
};
extend(DelStepCmd, Command);
$.extend(DelStepCmd.prototype, {
    execute: function() {
        var serializer = new XMLSerializer();
        // Replace img src with relative Path on server
        var imgids = srcMgr.getImgSrcIDs();
        for(var i in imgids) {
            this.step.find("img[name='"+imgids[i]+"']").attr('src', srcMgr.getSource(imgids[i]));
        }
        
        this.manager.removeStep(this.stepN);
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        this.manager.addStepWithContent(this.name, this.step);
        this.state = "CANCEL";
    }    
});

var StepUpCmd = function(stepN) {
};
extend(StepUpCmd, Command);
$.extend(StepUpCmd.prototype, {
    execute: function() {
    },
    undo: function() {
    }
});
