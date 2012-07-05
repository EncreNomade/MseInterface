// Class extend utilitie function
function extend(Child, Parent) {
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
};

// Clone a obj
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    else if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    else if (obj instanceof Object) {
        var copy = new obj.constructor();;
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    else return copy;
}

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
    this.clear = function() {
        arr.splice(0, arr.length);
    };
    this.count = function() {
        return arr.count;
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
    },
	redo : function(){
		if( this.state != "CANCEL")
			return;
			
		this.state = "WAITING";
		this.execute();
	},
	toString : function(){
		return "Abstract command";
	}
};

var CommandMgr = (function(capacity) {
    var undoStack = new Stack(capacity);
    var reverseStack = new Stack(capacity);
    var reversable = false, undoable = false;
    return {
        executeCmd: function(command) {
			
			
			
            var result = command.execute();
            // Fail to execute command
            if(command.state != "SUCCESS") return false;
            
            // Clean reverse stack
            reverseStack.clear();
            if(reversable) {
                reversable = false;
            }
            // Push to undo stack
            undoStack.push(command);
            if(!undoable) {
                undoable = true;
            }
            
            return result;
        },
        undoCmd: function() {
            
			var command = undoStack.pop();
			
            if(undoStack.count() == 0 && undoable) {
                undoable = false;
            }
            // No command
            if(!command) return false;
            command.undo();
            // Fail to execute command
            if(command.state != "CANCEL") return false;
            
            reverseStack.push(command);
            if(!reversable) {
                reversable = true;
            }
            
            // display a notification
            var txt = $('<p>Annulation de : '+command.toString()+'. </p>');
            if($('#msgCenter ul li').length == 0) {
                var link = $('<a href="#">Refaire</a>');
                link.click({cmdMgr: this}, function(e){
                    e.data.cmdMgr.reverseCmd();
                    $(this).remove();
                });
                link.appendTo(txt);
            }
            msgCenter.send(txt);
            
            return true;
        },
        reverseCmd: function() {
            
			
			
			var command = reverseStack.pop();
			
            if(reverseStack.count() == 0 && reversable) {
                reversable = false;
            }
            // No command
            if(!command) return false;
            var result = command.redo();
            // Fail to execute
            if(command.state != "SUCCESS") return false;
            
            undoStack.push(command);
            if(!undoable) {
                undoable = true;
            }
            
            return result;
        }
    }
})(30);
(function(document, CommandMgr){
    var isCtrl = false;
    $(document).keyup(function (e) {
    	if(e.which == 17) isCtrl=false;
    }).keydown(function (e) {
    	if(e.which == 17) isCtrl=true;
    	if(e.which == 90 && isCtrl == true) {
    	    var focusing = $(document.activeElement).prop('tagName');
    	    if(focusing == "INPUT" || focusing == "TEXTAREA") {
    	        return;
    	    }
    		//run code for CTRL+z
    		CommandMgr.undoCmd();
    	}
		if(e.which == 89 && isCtrl == true) {
    	    var focusing = $(document.activeElement).prop('tagName');
    	    if(focusing == "INPUT" || focusing == "TEXTAREA") {
    	        return;
    	    }
    		//run code for CTRL+y
    		CommandMgr.reverseCmd();
    	}
    });
})(document, CommandMgr);


var CommandMulti = function( ){

	if( arguments.length < 1 )
		return;

	if( arguments.length == 1 && arguments[ 0 ] instanceof Array )
		this.cmds = arguments[ 0 ];
	else
		this.cmds = arguments;
		
	for( var i = 0 ; i < this.cmds.length ; i ++ ){
		if( !( this.cmds[ i ] instanceof Command ) )
			return
	}
	
	this.state = "WAITING"
}
extend(CommandMulti, Command);
$.extend(CommandMulti.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        
		this.state = "SUCCESS";
		
		// execute from 0 to n
		for( var i = 0 ; i < this.cmds.length ; i ++ ){
			this.cmds[ i ].execute();
			if( this.cmds[ i ].state != "SUCCESS")
				this.state = this.cmds[ i ].state;
		}
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
		
		this.state = "CANCEL";
        // execute from n to 0
		for( var i = this.cmds.length-1 ; i >= 0 ; i -- ){
			this.cmds[ i ].undo();
			if( this.cmds[ i ].state != "CANCEL")
				this.state = this.cmds[ i ].state;
		}
        return true;
    },
	redo: function() {
        if(this.state != "CANCEL" ) return;
		
		this.state = "SUCCESS";
		
		// execute from 0 to n
		for( var i = 0 ; i < this.cmds.length ; i ++ ){
			this.cmds[ i ].redo();
			if( this.cmds[ i ].state != "SUCCESS")
				this.state = this.cmds[ i ].state;
		}
    },
	toString : function(){
		var rep = "Commande multiple : ";
		for( var i = 0 ; i < this.cmds.length ; i ++ )
			rep += this.cmds[ i ]+" , ";
		return rep;
	}
});

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
        if(this.state != "WAITING") return;
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
    },
	toString : function(){
		return "ajout de la page "+this.name;
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
        if(this.state != "WAITING") return;
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
        this.deletedMgr = managers[this.name];
        
        delPage(this.name);
        this.state = "SUCCESS";        
        return true;
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        var page = addPage(this.name);
        page.data('StepManager').remove();
        this.deletedMgr.reinitForPage(page);
        scriptMgr.countScripts(page.attr('id'), "page");
        for(var sname in this.deletedPage) {
            var step = $(this.deletedPage[sname]);
            page.data('StepManager').addStepWithContent(sname, step);
        }
        this.state = "CANCEL";
    },
	toString : function(){
		return "suppression de la page "+this.name;
	}
});

/* Scripts Commands
 *
 * 1. Add Script Command
 * 2. Del Script Command
 * 3. Modify Script Command
 */
var AddScriptCmd = function(name, src, srcType, action, target, reaction, immediate, supp){
    if( typeof name != 'string' &&
        typeof src != 'string' &&
        typeof srcType != 'string' &&
        typeof action != 'string' &&
        typeof target != 'string' &&
        typeof reaction != 'string' &&
        typeof immediate != 'boolean' &&
        (typeof supp != 'string' || typeof supp != 'undefined')) 
    {
        this.state = 'INVALID';
        return;
    }
    
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
        if(this.state == 'INVALID') 
            return;
        
        scriptMgr.addScript(this.name,this.src,this.srcType,this.action,this.target,this.reaction,this.immediate,this.supp);
        this.state = "SUCCESS";
    },
    undo: function(){
        if(this.state != "SUCCESS") 
            return;
        if(typeof scriptMgr.scripts[this.name] == 'undefined'){
            this.state = "FAILUNDO";
            return;
        }
        scriptMgr.delScript(this.name);
        this.state = "CANCEL";
    },
	toString : function(){
		return "ajout du script "+this.name;
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
        if(this.state != "SUCCESS") return;
        
        scriptMgr.addScript(this.name,this.src,this.srcType,this.action,this.target,this.reaction,this.immediate,this.supp);
        this.state = "CANCEL";
    },
	toString : function(){
		return "suppression du script "+this.name;
	}
});

var ModifyScriptCmd = function(name, src, srcType, action, target, reaction, immediate, supp){
    if( typeof name != 'string' &&
        typeof src != 'string' &&
        typeof srcType != 'string' &&
        typeof action != 'string' &&
        typeof target != 'string' &&
        typeof reaction != 'string' &&
        typeof immediate != 'boolean' &&
        (typeof supp != 'string' || typeof supp != 'undefined')
        || typeof scriptMgr.scripts[name] == 'undefined') 
    {
        this.state = 'INVALID';
        return;
    }
    
    this.name = name;
    this.src = src;
    this.srcType = srcType;
    this.action = action;
    this.target = target;
    this.reaction = reaction;
    this.immediate = immediate;
    this.supp = supp;
    
    this.oldSrc        = scriptMgr.scripts[name].src;
    this.oldSrcType    = scriptMgr.scripts[name].srcType;
    this.oldAction     = scriptMgr.scripts[name].action;
    this.oldTarget     = scriptMgr.scripts[name].target;
    this.oldReaction   = scriptMgr.scripts[name].reaction;
    this.oldImmediate  = scriptMgr.scripts[name].immediate;
    this.oldSupp       = scriptMgr.scripts[name].supp;
    
    this.state = 'WAITING';
};
extend(ModifyScriptCmd, Command);
$.extend(ModifyScriptCmd.prototype, {
    execute: function(){
        if(this.state == 'INVALID') return;
        
        scriptMgr.addScript(this.name,this.src,this.srcType,this.action,this.target,this.reaction,this.immediate,this.supp);
        this.state = "SUCCESS";
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
        scriptMgr.addScript(this.name,this.oldSrc,this.oldSrcType,this.oldAction,this.oldTarget,this.oldReaction,this.oldImmediate,this.oldSupp);
        this.state = "CANCEL";
    },
	toString : function(){
		return "modification du script "+this.name;
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
        if(this.state != "WAITING") return;
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
    },
	toString : function(){
		return "ajout de l'étape "+this.name;
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
        if(this.state != "WAITING") return;
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
    },
	toString : function(){
		return "ajout de l'étape-article "+this.name;
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
        if(this.state != "WAITING") return;
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
    },
	toString : function(){
		return "suppression de l'étape "+this.name;
	}	
});

var RenameStepCmd = function(mgr, stepN, newName) {
    if(!stepN || !mgr.steps[stepN] || !nameValidation(newName) || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.stepN = stepN;
    this.manager = mgr;
    this.newName = newName;
	this.oldName = this.manager.steps[this.stepN].prop('id');
    this.state = "WAITING";
};
extend(RenameStepCmd, Command);
$.extend(RenameStepCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return false;
        if(stepExist(this.newName) || !this.manager.steps[this.stepN]) {
            this.state = "FAILEXE";
            return false;
        }
        this.manager.stepexpos[this.stepN].data('name', this.newName);
        this.manager.stepexpos[this.stepN].find('span').text(this.newName);
        this.manager.steps[this.stepN].prop('id', this.newName);
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return false;
        if(stepExist(this.oldName) || !this.manager.steps[this.stepN]) {
            this.state = "FAILUNDO";
            return false;
        }
        this.manager.stepexpos[this.stepN].data('name', this.oldName);
        this.manager.stepexpos[this.stepN].find('span').text(this.oldName);
        this.manager.steps[this.stepN].prop('id', this.oldName);
        this.state = "CANCEL";
    },
	toString : function(){
		return "renommage de l'étape "+this.oldName+" en "+this.newName;
	}
});

var StepUpCmd = function(mgr, stepN) {
    if(!stepN || !mgr.steps[stepN] || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.manager = mgr;
    this.stepN = stepN;
	this.name = this.manager.steps[this.stepN].prop('id');
    this.state = "WAITING";
};
extend(StepUpCmd, Command);
$.extend(StepUpCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        this.manager.stepUp(this.stepN);
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        this.manager.stepUp(this.stepN);
        this.state = "CANCEL";
    },
	toString : function(){
		return "passage de l'étape "+this.name+" au plan supérieur";
	}
});
var StepDownCmd = function(mgr, stepN) {
    if(!stepN || !mgr.steps[stepN] || !(mgr instanceof StepManager)) {
        this.state = "INVALID";
        return;
    }
    this.manager = mgr;
    this.stepN = stepN;
	this.name = this.manager.steps[this.stepN].prop('id');
    this.state = "WAITING";
};
extend(StepDownCmd, Command);
$.extend(StepDownCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        this.manager.stepDown(this.stepN);
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        this.manager.stepDown(this.stepN);
        this.state = "CANCEL";
    },
	toString : function(){
		return "passage de l'étape "+this.name+" au plan inférieur";
	}
});

/*
 * Editable Tools Command
 * 1.  AddToScene
 * 
 */
var AddToSceneCmd = function(tool, elems, tar){
    if(!tool instanceof EditableTool){
        this.state = 'INVALID';
        return;
    }
    this.tool = tool;
    this.elems = elems;
    this.tar = tar;
    
    this.state = 'WAITING';
};
extend(AddToSceneCmd, Command);
$.extend(AddToSceneCmd.prototype, {
    execute: function(){
	
		
		if(this.state != 'WAITING') return;
        this.objId = parseInt(curr.objId);
        this.tool.finishEdit( this.elems , this.tar);
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        for (var i = 0; i < this.elems.length; i++){
            var id = this.objId+i;
			$('#obj'+id).remove();
        }
        this.state = 'CANCEL';
    },
	redo : function(){
		if(this.state != 'CANCEL') return;
		
		
		this.objId = parseInt(curr.objId);
        this.tool.finishEdit( this.elems , this.tar);
		
		
		
		this.state = 'SUCCESS';
	},
	toString : function(){
		var rep = "ajout de "+this.elems.length+" objets à la scène";
		return rep;
	}
});

/* Central Panel Commands
 * 1. Configuration obj
 * 2. Delete obj
 * 3. Move obj
 * 4. Resize obj
 * 5. GoDown obj
 * 6. Add elts in scene;
 */
var ConfigObjCmd = function(target, newRes){
    this.target = target;
    this.newRes = newRes;
    this.oldRes = {
       'left': target.css('left'),
       'top': target.css('top'),
       'width': target.css('width'),
       'height': target.css('height'),
       'font-family': target.css('font-family'),
       'font-size': target.css('font-size'),
       'font-weight': target.css('font-weight'),
       'text-align': target.css('text-align'),
       'opacity': target.css('opacity'),
       'background-color': target.css('background-color'),
       'color': target.css('color'),
       'border-color': target.css('border-color')
    };
    
    this.state = 'WAITING';
};
extend(ConfigObjCmd, Command);
$.extend(ConfigObjCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING') return;
        this.target.css(this.newRes);
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        this.target.css(this.oldRes);
        this.state = 'CANCEL';
    },
	toString : function(){
		return "modification de l'objet "+this.target.attr("id");
	}
});

var DeleteObjCmd = function(target){
    this.target = target;
    if(target.parents('.article').length > 0 && target.next().length == 1){ // if its an article obj its linkeds to his next obj
        this.type = 'articleObj';
        this.tarLink = target.next();
    }
    else { // its an obj with no article parent or the last article obj --> could be treat with .append()
        this.type = 'normalObj';
        this.tarLink = target.parent();
    }
    this.relatedScripts = [];
    for(var elem in scriptMgr.scripts) {
        if(scriptMgr.scripts[elem].src == target.attr('id') || scriptMgr.scripts[elem].target == target.attr('id') || scriptMgr.scripts[elem].supp == target.attr('id')){
            var info = {
                name       : elem,
                src        : scriptMgr.scripts[elem].src,
                srcType    : scriptMgr.scripts[elem].srcType,
                action     : scriptMgr.scripts[elem].action,
                target     : scriptMgr.scripts[elem].target,
                reaction   : scriptMgr.scripts[elem].reaction,
                immediate  : scriptMgr.scripts[elem].immediate,
                supp       : scriptMgr.scripts[elem].supp           
            };
            this.relatedScripts.push(info);
        }
    }
    
    this.state = 'WAITING';
};
extend(DeleteObjCmd, Command);
$.extend(DeleteObjCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING') return;
        
        scriptMgr.delRelatedScripts(this.target.attr('id'));
        this.target.detach();
        
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
        for(var i in this.relatedScripts){
            var name      = this.relatedScripts[i].name,
                src       = this.relatedScripts[i].src,
                srcType   = this.relatedScripts[i].srcType,
                action    = this.relatedScripts[i].action,
                target    = this.relatedScripts[i].target,
                reaction  = this.relatedScripts[i].reaction,
                immediate = this.relatedScripts[i].immediate,
                supp      = this.relatedScripts[i].supp;
            scriptMgr.addScript(name,src,srcType,action,target,reaction,immediate,supp);
        }
        if(this.type == 'normalObj')
            this.tarLink.append(this.target);
        else
            this.tarLink.before(this.target);
        
        this.state = 'CANCEL';
    },
	toString : function(){
		return "suppression de l'objet "+this.target.attr("id")+ ( this.relatedScripts.length > 0 ? " et de ces "+this.relatedScripts.length+" scripts associés" : "" );
	}
});

var MoveObjCmd = function(elems){
    if( !elems instanceof Array )
		elems = [ elems ];
	this.objs = elems;
	this.pos = [];
	for( var i = 0 ; i < this.objs.length ; i ++ ){
		var obj = $( this.objs[ i ] );
		this.pos[ i ] = { s : {x:obj.position().left , y:obj.position().top}  };
	}
    this.state = 'WAITING';
};
extend(MoveObjCmd, Command);
$.extend(MoveObjCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
        
		if( this.pos.length > 0 && this.pos[ 0 ].d )
			for( var i = 0 ; i < this.objs.length ; i ++ ){
				var obj = $( this.objs[ i ] );
				obj.css('left', this.pos[ i ].d.x+'px');
				obj.css('top',  this.pos[ i ].d.y+'px');
			}
		
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		
		for( var i = 0 ; i < this.objs.length ; i ++ ){
			var obj = $( this.objs[ i ] );
			this.pos[ i ].d = {x:obj.position().left , y:obj.position().top}  ;
		}
		
		for( var i = 0 ; i < this.objs.length ; i ++ ){
			var obj = $( this.objs[ i ] );
			obj.css('left', this.pos[ i ].s.x+'px');
			obj.css('top',  this.pos[ i ].s.y+'px');
		}
		
        this.state = 'CANCEL';
    },
	toString : function(){
		return "déplacement "+( this.objs.length > 1 ? "du groupe d'objets" : "de l'objet "+$( this.objs[ 0 ] ).attr( "id" ) );
	}
	
});



var ResizeObjCmd = function(elem, curr){
    this.obj = elem;
    this.curr = curr;
    
    this.initialCtrlPt = {
        rt: curr.rt.css('top'),
        lb: curr.lb.css('left'),
        rb:{left: curr.rb.css('left'), top: curr.rb.css('top')}
    };
    
    this.sx = this.obj.css('left');
    this.sy = this.obj.css('top');
    this.sw = this.obj.css('width');
    this.sh = this.obj.css('height');
    
    this.state = 'WAITING';
};
extend(ResizeObjCmd, Command);
$.extend(ResizeObjCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
		if( this.dx ){
			this.obj.css('left', this.dx);
	        this.obj.css('top', this.dy);
	        this.obj.css('width', this.dw);
	        this.obj.css('height', this.dh);
	        
			if( $( this.curr.choosed ).attr("id") == this.obj.attr( "id" ) ){
		        this.curr.rt.css('top', this.undoCtrlPt.rt);
		        this.curr.lb.css('left', this.undoCtrlPt.lb);
		        this.curr.rb.css({'left': this.undoCtrlPt.rb.left,'top': this.undoCtrlPt.rb.top});
			}
		}
		
		
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		
		this.dx = this.obj.css('left');
	    this.dy = this.obj.css('top');
	    this.dw = this.obj.css('width');
	    this.dh = this.obj.css('height');
		
		this.undoCtrlPt = {
	        rt: this.curr.rt.css('top'),
	        lb: this.curr.lb.css('left'),
	        rb:{left: this.curr.rb.css('left'), top: this.curr.rb.css('top')}
	    };
		
		
        this.obj.css('left', this.sx);
        this.obj.css('top', this.sy);
        this.obj.css('width', this.sw);
        this.obj.css('height', this.sh);
        
		if( $( this.curr.choosed ).attr("id") == this.obj.attr( "id" ) ){
			this.curr.rt.css('top', this.initialCtrlPt.rt);
			this.curr.lb.css('left', this.initialCtrlPt.lb);
			this.curr.rb.css({'left': this.initialCtrlPt.rb.left,'top': this.initialCtrlPt.rb.top});
        }
        this.state = 'CANCEL';
    },
	toString : function(){
		return "redimensionement de l'objet "+$( this.obj ).attr( "id" );
	}
	
});

var GoDownCmd = function(upperElem, lowerElem){
    this.upper = upperElem;
    this.lower = lowerElem;
    this.state = 'WAITING';
};
extend(GoDownCmd, Command);
$.extend(GoDownCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
        
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
        var tempZ = this.lower.css('z-index');
        this.lower.css('z-index', this.upper.css('z-index'));
        this.upper.css('z-index', tempZ);
        
        this.state = 'CANCEL';
    },
	redo : function(){
		if(this.state != 'CANCEL'  ) return;
        
		var tempZ = this.lower.css('z-index');
        this.lower.css('z-index', this.upper.css('z-index'));
        this.upper.css('z-index', tempZ);
		
        this.state = 'SUCCESS';
	},
	toString : function(){
		return "swap la position de "+this.upper.attr( "id" )+" avec celle de "+this.lower.attr( "id" );
	}
});

var CreateElemCmd = function(step, container){
    this.step = step;
    this.container = container;
    
    this.state = 'WAITING';
};
extend(CreateElemCmd, Command);
$.extend(CreateElemCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
        
        this.step.append(this.container);
        
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
        this.container.detach();
        
        this.state = 'CANCEL';
    },
	toString : function(){
		return "ajout de l'objet "+this.container.attr( "id" );
	}
});


/* Speak Related Comands
 *
 * note that the add of speak is automaticly done by adding raw text with balise, 
 * deleting a speak is not possible though
 * 1. Modify the mood
 *
 */
var ModifySpeakMoodCmd = function(  speak , newMood , newSrc , oldMood , oldSrc){
	this.speak = speak;
	this.newMood = newMood;
	this.newSrc = newSrc;
	if( oldMood )
		this.oldMood = oldMood;
	else
		this.oldMood = $( this.speak ).attr( "data-mood" );
	if( oldSrc )
		this.oldSrc = oldSrc;
	else
		this.oldSrc = $( this.speak ).children("img").attr( "src" );
	this.state = 'WAITING';
}
extend( ModifySpeakMoodCmd , Command );
$.extend( ModifySpeakMoodCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING') return;
		
		$( this.speak ).attr( "data-mood" , this.newMood );
		$( this.speak ).children("img").attr( "src" , this.newSrc );
		
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		$( this.speak ).attr( "data-mood" , this.oldMood );
		$( this.speak ).children("img").attr( "src" , this.oldSrc );
		
        this.state = 'CANCEL';
    },
	toString : function(){
		return "modification de l'humeur ";
	}
});
 
 

/* Speaker Related Comands
 *
 * note that the add of speaker is automaticly done by adding raw text with balise, 
 * deleting a speaker is not possible though
 * 1. Add a mood
 * 2. Rename a mood  // unused, instead of rename an item, it is delete and another with the same src is added
 * 3. Delete a mood
 * 4. Modify the srouce image of a mood
 * 5. Modify the color
 *
 */
var AddMoodCmd = function(  speaker , key , image_id ){
	this.speaker = speaker;
	this.key = key;
	this.image_id = image_id;
	this.speaks;
	
	this.state = 'WAITING';
}
extend( AddMoodCmd , Command );
$.extend( AddMoodCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING') return;
		this.speaker.addMood( this.key , this.image_id );
		if( this.speaks )
			for( var i = 0 ; i < this.speaks.length ; i ++ ){
				$( this.speaks[ i ] ).attr( "data-mood" , this.key );
				$( this.speaks[ i ] ).children("img").attr( "src" , this.speaker.getMoodUrl( this.key ) );
			}
		
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		this.speaks = this.speaker.getAssociateSpeak( this.key );
		
		for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).attr( "data-mood" , "neutre" );
			$( this.speaks[ i ] ).children("img").attr( "src" , this.speaker.getMoodUrl( "neutre" ) );
		}
		delete this.speaker.portrait[ this.key ];
		
        this.state = 'CANCEL';
    },
	toString : function(){
		return "ajout de l'humeur "+this.key+" sur l'interlocuteur "+this.speaker.name;
	}
});
var DelMoodCmd = function( speaker , mood ){
	this.speaker = speaker;
	this.mood = mood;
	this.speaks ;
	this.state = 'WAITING';
	this.imgsrc;
}
extend( DelMoodCmd , Command );
$.extend( DelMoodCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
        
		this.speaks = this.speaker.getAssociateSpeak( this.mood );
		
        for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).attr( "data-mood" , "neutre" );
			$( this.speaks[ i ] ).children("img").attr( "src" , this.speaker.getMoodUrl( "neutre" ) );
        }
		
		this.imgsrc = this.speaker.portrait[ this.mood ];
		
		delete this.speaker.portrait[ this.mood ];
		
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		this.speaker.portrait[ this.mood ] = this.imgsrc;
        for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).attr( "data-mood" , this.mood );
			$( this.speaks[ i ] ).children("img").attr( "src" , this.speaker.getMoodUrl(  this.mood  ) );
        }
        
        this.state = 'CANCEL';
    },
	toString : function(){
		return "suppression de l'humeur "+this.mood+" sur l'interlocuteur "+this.speaker.name;
	}
});
 var ModifyMoodSrcCmd = function(  speaker  , mood,  newSrc ){
	this.speaker = speaker;
	this.oldSrc;
	this.newSrc = newSrc;
	this.mood = mood;
	
	this.state = 'WAITING';
}
extend( ModifyMoodSrcCmd , Command );
$.extend( ModifyMoodSrcCmd.prototype, {
    execute: function(){
        if(this.state != 'WAITING' ) return;
        
		this.oldSrc = this.speaker.portrait[ this.mood ];
		this.speaker.portrait[ this.mood ] = this.newSrc;
        
		this.speaks = this.speaker.getAssociateSpeak( this.mood );
		var src = this.speaker.getMoodUrl(this.mood);     
		for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).children("img").attr( "src" , src);
            if(this.newSrc) 
                $( this.speaks[ i ] ).children("img").attr( "name" , this.newSrc);
            else 
				$( this.speaks[ i ] ).children("img").attr( "name" , "none");
		}
        
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
		this.speaker.portrait[ this.mood ] = this.oldSrc;
		
        this.speaks = this.speaker.getAssociateSpeak( this.mood );	
        var src = this.speaker.getMoodUrl(this.mood);     
		for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).children("img").attr( "src" , src);
            if(this.oldSrc) 
                $( this.speaks[ i ] ).children("img").attr( "name" , this.oldSrc);
            else $( this.speaks[ i ] ).children("img").attr( "name" , "none");
		}
        
        this.state = 'CANCEL';
    },
	toString : function(){
		return "modification de l'humeur "+this.mood+" sur l'interlocuteur "+this.speaker.name;
	}
});
 var ModifyColorSpeakCmd = function(  speaker  , newColor  ){
	this.speaker = speaker;
	this.newColor = newColor;
	this.oldColor = this.speaker.color;
	
	this.state = 'WAITING';
}
extend( ModifyColorSpeakCmd , Command );
$.extend( ModifyColorSpeakCmd.prototype, {
    execute: function(){
		if(this.state != 'WAITING' ) return;
        
		this.speaker.color = this.newColor;
		this.speaks = this.speaker.getAssociateSpeak( );
		for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).attr( "data-color" , this.speaker.color );
			$( this.speaks[ i ] ).css( "background-color", this.speaker.color );
        }
        this.state = 'SUCCESS';
    },
    undo: function(){
        if(this.state != 'SUCCESS') return;
        
        this.speaker.color = this.oldColor;
		for( var i = 0 ; i < this.speaks.length ; i ++ ){
			$( this.speaks[ i ] ).attr( "data-color" , this.speaker.color );
			$( this.speaks[ i ] ).css( "background-color", this.speaker.color );
        }
        this.state = 'CANCEL';
    },
	toString : function(){
		return "modification de la couleur sur l'interlocuteur "+this.speaker.name;
	}
});
/* Ressources Management Commands
 *
 * 1. Add Source Command
 * 2. Modify Source Command: Modify the data of one source
 * 3. Rename Source Command: Update the name of one source
 * 4. Delete Source Command
 *
 */
 
var AddSrcCmd = function(type, data, id) {
    if(!type || !data) {
        this.state = "INVALID";
        return;
    }
    this.type = type;
    this.data = data;
    this.id = id;
    this.state = "WAITING";
};
extend(AddSrcCmd, Command);
$.extend(AddSrcCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        var id = srcMgr.addSource(this.type, this.data, this.id);
        if(!id) {
            this.state = "FAILEXE";
            return;
        }
        else this.id = id;
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        srcMgr.delSource(this.id);
        
        this.state = "CANCEL";
    },
	toString : function(){
		return "ajout de la ressource "+this.id+" de type "+this.type;
	}
});
var ModSrcCmd = function(type, data, id) {
    if(!type || !data) {
        this.state = "INVALID";
        return;
    }
    this.type = type;
    this.data = data;
    this.id = id;
    this.state = "WAITING";
};
extend(ModSrcCmd, Command);
$.extend(ModSrcCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        if(srcMgr.sources[this.id]) {
            this.oldtype = srcMgr.sources[this.id].type;
            this.olddata = srcMgr.sources[this.id].data;
        }
        var id = srcMgr.addSource(this.type, this.data, this.id);
        if(!id) {
            this.state = "FAILEXE";
            return;
        }
        else this.id = id;
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        srcMgr.addSource(this.oldtype, this.olddata, this.id);
        
        this.state = "CANCEL";
    },
	toString : function(){
		return "modification de la ressource "+this.id+" de type "+this.type;
	}
});

var RenameSrcCmd = function(oldname, newname) {
    if(!typeof oldname == "string" || !typeof newname == "string") {
        this.state = "INVALID";
        return;
    }
    this.oldname = oldname;
    this.newname = newname;
    this.state = "WAITING";
}
extend(RenameSrcCmd, Command);
$.extend(RenameSrcCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        if(!srcMgr.sources[this.oldname] || srcMgr.sources[this.newname]) {
            this.state = "FAILEXE";
            return;
        }
        srcMgr.rename(this.oldname, this.newname);
        this.state = "SUCCESS";
    },
    undo: function() {
        if(!srcMgr.sources[this.newname] || srcMgr.sources[this.oldname]) {
            this.state = "FAILUNDO";
            return;
        }
        srcMgr.rename(this.newname, this.oldname);
        this.state = "CANCEL";
    },
	toString : function(){
		return "renommage de la ressource "+ this.oldname +" en "+this.newname;
	}
});

var DelSrcCmd = function(id) {
    if(!typeof id == "string") {
        this.state = "INVALID";
        return;
    }
    
    var src = srcMgr.sources[id];
    this.id = id;
    this.type = src.type;
    this.data = src.data;
    // All dependencies
    var scripts = [];
    var links = [];
    var doms = [];
    var wikianimes = [];
    var speaks = [];
	
    var t = src.type;
    // Save all dependencies to this source
    // Script dependency
    if(t != "wiki") {
        scripts = scriptMgr.getRelatedScripts(id);
    }
    // Text link dependency
    if(t == "wiki" || t == "audio") {
        $('span[link="'+id+'"]').each(function(){
            links.push({'target':$(this).parent(),
                        'type':(t=="wiki"?"wikilink":"audiolink"),
                        'text':$(this).text()});
        });
    }
    // Other dependency for image src: DOMElement, animation, wiki image content
    if(t == "image") {
        // DOMElement
        $('.scene img[name="'+id+'"]').each(function(){
            var container = $(this).parent();
            if(container.prev().length > 0) {
                var related = container.prev();
                var relation = 'prev';
            }
            else if(container.next().length > 0) {
                var related = container.next();
                var relation = 'next';
            }
            else if(container.siblings().length == 0) {
                var related = container.parent();
                var relation = 'parent';
            }
            doms.push({'obj':container, 'related':related, 'relation':relation});
        });
        // Animation & Wiki
        for(var srcid in srcMgr.sources) {
            var type = srcMgr.sources[srcid].type;
            if( (type == "wiki" || type == "anime") && srcMgr.sources[srcid].data.getDependency(id) ) {
                wikianimes.push({'src':srcid, 'data':clone(srcMgr.sources[srcid].data)});
            }
			if( type == "speaker" && srcMgr.getSource(srcid).getDependency(id) ){
				var mood;
				for( var i in srcMgr.getSource(srcid).portrait )
					if( srcMgr.getSource(srcid).portrait[i] == id ){
						mood = i;
						break;
					}
				speaks.push({'src':srcid, 'speaks': srcMgr.sources[srcid].data.getAssociateSpeak( mood ) , 'mood':mood })
			}
        }
    }
    // Other dependency for game src: DOMElement
    else if(t == "game") {
        $('div[name="'+id+'"]').each(function(){
            var game = $(this);
            if(game.prev().length > 0) {
                var related = game.prev();
                var relation = 'prev';
            }
            else if(game.next().length > 0) {
                var related = game.next();
                var relation = 'next';
            }
            else if(game.siblings().length == 0) {
                var related = game.parent();
                var relation = 'parent';
            }
            doms.push({'obj':game, 'related':related, 'relation':relation});
        });
    }
    if( t == "speaker" )
		return;
    this.scripts = scripts;
    this.links = links;
    this.doms = doms;
    this.wikianimes = wikianimes;
	this.speaks = speaks;
    this.state = "WAITING";
};
extend(DelSrcCmd, Command);
$.extend(DelSrcCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        if(!srcMgr.sources[this.id]) {
            this.state = "FAILEXE";
            return;
        }
        srcMgr.delSource(this.id);
		
		for(var i = 0; i < this.speaks.length; ++i) {
			var obj = this.speaks[i];
			for( var k = 0 ; k < obj.speaks.length ; k ++ ){
				$( obj.speaks[ k ] ).attr( "data-mood" , "neutre" );
				$( obj.speaks[ k ] ).children( "img" ).attr( "name" , srcMgr.getSource(obj.src).portrait[ "neutre" ] );
				$( obj.speaks[ k ] ).children( "img" ).attr( "src" , srcMgr.getSource(obj.src).getMoodUrl( "neutre" ) );
			}
		}
		
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        if(srcMgr.sources[this.id]) {
            this.state = "FAILUNDO";
            return;
        }
        
        srcMgr.addSource(this.type, this.data, this.id);
        // Add all dependencies
        for(var i = 0; i < this.scripts.length; ++i) {
            var script = this.scripts[i];
            if(scriptMgr.scripts[script.id]) continue;
            scriptMgr.scripts[script.id] = script.elem;
            scriptMgr.countScripts(script.elem.src, script.elem.srcType);
        }
        for(var i = 0; i < this.links.length; ++i) {
            var link = this.links[i];
            var linkspan = '<span class="'+link.type+'" link="'+this.id+'">'+link.text+'</span>';
            link.target.html(link.target.html().replace(link.text, linkspan));
        }
        for(var i = 0; i < this.doms.length; ++i) {
            var dom = this.doms[i];
            if(dom.relation == "prev")
                dom.related.after(dom.obj);
            else if(dom.relation == "next")
                dom.related.before(dom.obj);
            else if(dom.relation == "parent")
                dom.related.append(dom.obj);
        }
        for(var i = 0; i < this.wikianimes.length; ++i) {
            var obj = this.wikianimes[i];
            srcMgr.sources[obj.src].data = obj.data;
        }
        for(var i = 0; i < this.speaks.length; ++i) {
			var obj = this.speaks[i];
			srcMgr.getSource(obj.src).portrait[ obj.mood ] = this.id ;
			for( var k = 0 ; k < obj.speaks.length ; k ++ ){
				$( obj.speaks[ k ] ).attr( "data-mood" , obj.mood );
				$( obj.speaks[ k ] ).children( "img" ).attr( "name" , this.id );
				$( obj.speaks[ k ] ).children( "img" ).attr( "src" , srcMgr.sources[this.id].data );
			}
		}
        this.state = "CANCEL"
    },
	toString : function(){
		return "suppression de la ressource "+ this.id +" de type "+this.type;
	}
});
/*
 * Text Link Cmd
 * 1. AddLink
 * 2. ModifyLink
 * 
 */

var AddTextLinkCmd = function(nodeHtml, selStr, linkedStr) {
    this.nodeHtml = nodeHtml;
    this.selStr = selStr;
    this.linkedStr = linkedStr;
    this.selectNode = curr.selectNode;
    
    this.state = "WAITING";
};
extend(AddTextLinkCmd, Command);
$.extend(AddTextLinkCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        
        curr.selectNode.html(this.nodeHtml.replace(this.selStr, this.linkedStr));
        
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        this.selectNode.html(this.nodeHtml.replace(this.linkedStr, this.selStr));

        this.state = "CANCEL";
    },
	toString : function(){
		return "ajout d'une relation";
	}
});

var ModifyLinkCmd = function(linkType, link) {
    this.linkType = linkType;
    this.link = link;
    
    this.oldType = curr.selectNode.attr('class');
    this.oldLink = curr.selectNode.attr('link');
    
    this.node = curr.selectNode;
    this.state = "WAITING";
};
extend(ModifyLinkCmd, Command);
$.extend(ModifyLinkCmd.prototype, {
    execute: function() {
        if(this.state != "WAITING") return;
        
        curr.selectNode.attr('class', this.linkType);
        curr.selectNode.attr('link', this.link);
        
        this.state = "SUCCESS";
    },
    undo: function() {
        if(this.state != "SUCCESS") return;
        
        this.node.attr('class', this.oldType);
        this.node.attr('link', this.oldLink);

        this.state = "CANCEL";
    },
	toString : function(){
		return "modification d'une relation";
	}
});
