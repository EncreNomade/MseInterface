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

mse.EventListener = function(evtName, callback, prevent) {
	this.evtName = evtName;
	this.callback = callback;
	this.preventBubbling = prevent ? prevent : false;
};
mse.EventListener.prototype = {
    constructor: mse.EventListener,
    notify: function(evt) {
    	this.callback.invoke(evt);
    }
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
	
	this.rootEvt = new mse.EventDelegateSystem(this.src);
	
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
    // Sort function for sort the obj in z-index order
    zSort: function(a, b) {
//!!! Attention if a or b null
		if(!a || !a.getZindex) return -1;
		else if(!b || !b.getZindex) return 1;
		
		else if(a.getZindex() < b.getZindex()) 
			return 1;
		else if(a.getZindex() > b.getZindex())
			return -1;
		else return 0;
	},
    observe: function(type, obj) {
        if(typeof type != "string" || !obj || !obj.evtDeleg) return;
    	// Listener array not until exist
    	if( !this.observers[type] ) this.observers[type] = new Array();
    	var arr = this.observers[type];
    	// Register observer
    	if($.inArray(obj, arr) == -1) arr.push(obj);
    	
    	// Reorganize the order in observers' list
    	this.observers[type].sort(this.zSort);
    },
    stopObserve: function(type, obj) {
        var arr = this.observers[type];
        if(!arr) return;
        var index = $.inArray(obj, arr);
        if(index != -1) arr.splice(index, 1);
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
        	    // Non location based event, notify directly
        	    if($.inArray(type, locationEvts) == -1) 
        		    var prevent = arr[val].evtDeleg.eventNotify(type, e);
        		// Location based event, event check in object
        		else var prevent = arr[val].eventCheck(type, e);
        		success = true;
        		if(prevent) break;
        	}
        }
        return success;
    }
};



/* Event delegate
 *
 * This class belongs to another object as its events management delegate.
 * It will conserve a array of listeners for every event, and it can notify all the listeners when the event happens
 *
 */
mse.EventDelegateSystem = function(obj) {
    this.obj = obj;
	this.listeners = {};
};
mse.EventDelegateSystem.prototype = {
    constructor: mse.EventDelegateSystem,

	// Managerment of listeners
	addListener: function(evtName, callback, prevent) {
	    if(typeof evtName != "string" || !callback) return false;
		// Listener array not until exist
		if( !this.listeners[evtName] ) {
		    this.listeners[evtName] = new Array();
		    this.listeners[evtName].push(listener);
		    // Observe this event in the dispatcher of container
		    if(this.obj && this.obj.getContainer) var container = this.obj.getContainer();
		    if(container) container.dispatcher.observe(evtName, this.obj);
		    return true;
		}
		var exist = false;
		var listener = new mse.EventListener(evtName,callback,prevent);
		var arr = this.listeners[evtName];
		for(var i in arr) {
			if(arr[i].callback == callback) {
				exist = true;
				// Replace in listeners' list
				arr.splice(i, 1, listener);
			}
		}
		// Push to the listener list
		if(!exist) this.listeners[evtName].push(listener);
		return true;
	},
	removeListeners: function(evtName) {
		delete this.listeners[evtName];
		// Stop observe the dispatcher of container
		if(this.obj && this.obj.getContainer) var container = this.obj.getContainer();
		if(container) container.dispatcher.stopObserve(evtName, this.obj);
	},
	removeListener: function(evtName, callback) {
		var arr = this.listeners[evtName];
		if(arr) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].callback == callback){
					// Delete listener
					arr.splice(i,1);
					// No more listener for this event type, remove the array and stop observe the dispatcher
					if(arr.length == 0) {
					    this.removeListeners(evtName);
					}
					break;
				}
			}
		}
	},
	// Notify a event, and return true if the listener will prevent bubbling, if not return false
	eventNotif: function(evtName, evt) {
	    var prevent = false;
        
		var arr = this.listeners[evtName];
		if(!arr) return prevent;
		
		for(var val in arr) {
		    // If one listener want to prevent the bubbling, it will prevent it by transfering the prevent as true in return value, but it can't prevent other listeners for the same event in this delegate
		    arr[val].notify(evt);
		    if(arr[val].preventBubbling) prevent = true;
		}
		return prevent;
	}
};


})(window);