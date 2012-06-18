/*!
 * Encre Nomade Events Dispatch Library
 * Encre Nomade
 *
 * Author: LING Huabin - lphuabin@gmail.com
 * Copyright 2012, Encre Nomade
 *
 * Date creation: 08/06/2012
 */


window.mse = {};

(function( window ) {
var mse = window.mse;

// Event System

mse.EventListener = function(evtName, callback, prevent, target) {
	this.evtName = evtName;
	this.callback = callback;
	this.target = (target ? target : callback.caller);
	this.preventBubbling = prevent ? prevent : false;
	
	this.inObj = function(x, y) {
//??? Attention: x, y undefined means not in object???
		if(x && y) {
			if(!this.target.inObj) return true;
			else if(this.target.inObj(x,y))
				return true;
			else return false;
		}
		else return true;
	};
	
	this.notify = function(evt) {
		this.callback.invoke(evt);
	};
};


// Event dispatcher for every container
mse.EventDispatcher = function(container) {
    this.observers = [];
    this.relations = {};
    this.parent = container;
}
extend(mse.EventDispatcher, GestureAnalyser);
delete mse.EventDispatcher.prototype.analyseAdd;
delete mse.EventDispatcher.prototype.analyseUpdate;
delete mse.EventDispatcher.prototype.analyseRemove;
$.extend(mse.EventDispatcher, {
    // Blob management
    addBlob: function(e) {
        for(var i in e.touches) {
            
        }
    },
    updateBlob: function(e) {
        for(var i in e.touches) {
        }
    },
    removeBlob: function(e) {
        for(var i in e.touches) {
        }
    }
});


// Event delegate
mse.EventDelegateSystem = function() {
	this.listeners = {};
	this.domObj = null;
};
mse.EventDelegateSystem.prototype = {
    constructor: mse.EventDelegateSystem,
    nonLocationEvts: ['keydown', 'keypress', 'keyup'],
    
    // Sort function for sort the obj in z-index order
    zSort: function(la, lb) {
		var a = la.target;
		var b = lb.target;
//!!! Attention if a or b null
		if(!a || !a.getZindex) return -1;
		else if(!b || !b.getZindex) return 1;
		
		else if(a.getZindex() < b.getZindex()) 
			return 1;
		else if(a.getZindex() > b.getZindex())
			return -1;
		else return 0;
	},
    
    setDominate: function(dom) {
		this.domObj = dom;
	},

	// Managerment of listeners
	addListener: function(evtName, callback, prevent, target) {
	    if(typeof evtName != "string" || !callback) return;
		// Listener array not until exist
		if( !this.listeners[evtName] ) this.listeners[evtName] = new Array();
		var exist = false;
		var listener = new mse.EventListener(evtName,callback,prevent,target);
		var arr = this.listeners[evtName];
		for(var i in arr) {
			if(arr[i].callback==callback && (!target || arr[i].target==target)) {
				exist = true;
				// Replace in listener list
				arr.splice(i, 1, listener);
			}
		}
		// Push to the listener list
		if(!exist) this.listeners[evtName].push(listener);
	
		this.listeners[evtName].sort(this.zSort);
	},
	removeListeners: function(evtName) {
		delete this.listeners[evtName];
	},
	removeListener: function(evtName, callback) {
		var arr = this.listeners[evtName];
		if(arr) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].callback == callback){
					// Delete listener
					arr.splice(i,1); break;
				}
			}
		}
	},
	eventNotif: function(evtName, evt) {
	    var success = false;
		switch(evtName) {
		case 'move':
			var ls = this.listeners['enter'];
			if(ls) {
				for(var i in ls) {
					if( ls[i].target.inObj(evt.offsetX, evt.offsetY) 
						&& !ls[i].target.inObj(evt.prev[0], evt.prev[1]) ) {
						ls[i].notify(evt);
						success = true;
						break;
					}
				}
			}
		break;
		}
        
		var arr = this.listeners[evtName];
		if(!arr) return success;
		
		// Non location based events (keyboard events)
		if($.inArray(evtName, this.nonLocationEvts) != -1) {
		    for(var val in arr) {
		    	var prevent = arr[val].preventBubbling;
		    	arr[val].notify(evt);
		    	success = true;
		    	if(prevent) break;
		    }
		}
		else {
			for(var val in arr) {
				if( (!this.domObj || this.domObj==arr[val].target || this.domObj==arr[val].target.parent) 
					&& (!evt || arr[val].inObj(evt.offsetX, evt.offsetY)) ) {
					var prevent = arr[val].preventBubbling;
					arr[val].notify(evt);
					success = true;
				}
				if(prevent) break;
			}
		}
		return success;
	}
};

// Event distributor
mse.EventDistributor = function(src, jqObj, deleg) {
	this.distributor = function(e) {
	    // Correction coordinates with root viewport
	    if(mse.root.viewport && e && !e.corrected && !isNaN(e.offsetX)) {
	        e.offsetX += mse.root.viewport.x;
	        e.offsetY += mse.root.viewport.y;
	        e.corrected = true;
	    }
		this.rootEvt.eventNotif(e.type, e);
		if(this.delegate) this.delegate.eventNotif(e.type, e);
	};
	this.setDelegate = function(deleg) {
		this.delegate = deleg;
	};

	this.src = src;
	jqObj.mseInteraction(this);
	jqObj.mseInteraction('setDelegate', new Callback(this.distributor, this));
	
	this.rootEvt = new mse.EventDelegateSystem();
	
	if(deleg) this.setDelegate(deleg);
	
	this.setDominate = function(dom) {
		this.rootEvt.setDominate(dom);
		if(this.delegate) this.delegate.setDominate(dom);
	}
	this.addListener = function(evtName, callback, pr, target) {
		this.rootEvt.addListener(evtName,callback,pr,target);
	};
	this.removeListeners = function(evtName) {
		this.rootEvt.removeListeners(evtName);
	};
	this.removeListener = function(evtName, callback) {
		this.rootEvt.removeListener(evtName, callback);
	};
};
})(window);