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
    }
});