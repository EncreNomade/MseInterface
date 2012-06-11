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

var nonLocationEvts = ['keydown', 'keypress', 'keyup'],
var locationEvts = ['move', 'longPress', 'click', 'doubleClick', 'scroll',
                    'gestureSingle', 'gestureStart', 'gestureUpdate', 'gestureEnd', 
                    'gestureMulti', 'multiGestAdd', 'multiGestUpdate', 'multiGestRemove',
                    'swipeleft', 'swiperight', 'swipe']

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


/* Event distributor
 *
 * This is the distributor owned by mse.root, normally there is only one instance in one book.
 * It's using for sending the events to the current page of root.
 * It has also one event delegate of his own for the events of mse.root object like 'showover'.
 *
 */
mse.EventDistributor = function(src, jqObj, deleg) {
	this.src = src;
	this.dominate = null;
	jqObj.mseInteraction(this);
	jqObj.mseInteraction('setDelegate', new Callback(this.distributor, this));
	
	this.rootEvt = new mse.EventDelegateSystem();
	
	if(deleg) this.setDelegate(deleg);
};
mse.EventDistributor.prototype = {
    constructor: mse.EventDistributor,
    distributor: function(e) {
        // Correction coordinates with root viewport
        if(mse.root.viewport && e && !e.corrected && !isNaN(e.offsetX)) {
            e.offsetX += mse.root.viewport.x;
            e.offsetY += mse.root.viewport.y;
            e.corrected = true;
        }
    	if(!this.dominate) this.rootEvt.eventNotif(e.type, e);
    	if(this.delegate) this.delegate.eventNotif(e.type, e);
    },
    setDelegate: function(deleg) {
    	this.delegate = deleg;
    },
    
    setDominate: function(dominate) {
        if(dominate != this.src) this.dominate = dominate;
    	if(this.delegate) this.delegate.setDominate(dominate);
    },
    addListener: function(evtName, callback, pr, target) {
    	this.rootEvt.addListener(evtName,callback,pr,target);
    },
    removeListeners: function(evtName) {
    	this.rootEvt.removeListeners(evtName);
    },
    removeListener: function(evtName, callback) {
    	this.rootEvt.removeListener(evtName, callback);
    },
};


/* Event dispatcher for every container
 *
 * This class can analyse the structure of one container, and it can dispatch the events to the right objects.
 * For doing this, it maintain a list of event names and the objects which observe the event.
 * The objects will be organised in descendent of their z-depth to simulate the bubbling of location based events.
 * Specially, for better supporting multitouch, it will conserve a list of bindings between the touches and the objects. One touch can only be attached to one object.
 *
 */
mse.EventDispatcher = function(container) {
    this.observers = {};
    this.parent = container;
    this.domObj = null;
};
mse.EventDispatcher.prototype = {
    constructor: mse.EventDispatcher,
    observe: function(type, obj) {
        if(typeof type != "string" || !obj || !obj.evtDeleg) return;
    	// Listener array not until exist
    	if( !this.observers[type] ) this.observers[type] = new Array();
    	var arr = this.observers[type];
    	// Register observer
    	if($.inArray(obj, arr) == -1) arr.push(obj);
    	
    	// Reorganize the order in observer list
    	//this.listeners[evtName].sort(this.zSort);
    },
    setDominate: function(dom) {
    	this.domObj = dom;
    },
    dispatch: function(type, e) {
        var success = false;
        
        var arr = this.observers[type];
        if(!arr) return success;
        
        for(var val in arr) {
        	if( (!this.domObj || this.domObj==arr[val] || this.domObj==arr[val].parent) ) {
        		var prevent = arr[val].eventNotify(type, e);
        		success = true;
        		if(prevent) break;
        	}
        }
        return success;
    }
};



// Event delegate
mse.EventDelegateSystem = function() {
	this.listeners = {};
	this.domObj = null;
};
mse.EventDelegateSystem.prototype = {
    constructor: mse.EventDelegateSystem,
    
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
		
		// Non location based events (keyboard events or custom events)
		if($.inArray(evtName, locationEvts) == -1) {
		    for(var val in arr) {
		    	var prevent = arr[val].preventBubbling;
		    	arr[val].notify(evt);
		    	success = true;
		    	if(prevent) break;
		    }
		}
		// Mouse and touch events
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


})(window);