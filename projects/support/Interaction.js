// Plugin jQuery of Interaction for MSEdition
// Ref: http://docs.jquery.com/Plugins/Authoring

(function( $ ){

var _pressTimer;
var dblClickTimeOut = 400;
var pressTime = 1000;
var clickTime = 200;
var swipeLSeuil = 40;
var swipeWSeuil = 30;

var _currentEvt;
var _listeners;
var _src;

var _clicked = false;
var _clickDown = false;

var _prevLoc = [0,0];

var _data = {};

var eventsWeb = {

	click			: 'click',
	doubleClick		: 'dblclick',
	longPress		: 'mousedown mousemove mouseup',
	move			: 'mousemove',
	swipe			: 'mousedown mousemove mouseup',
	gestureSingle	: 'mousedown mousemove mouseup',
	keydown			: 'keydown',
	keypress		: 'keypress',
	keyup			: 'keyup',
	scroll			: 'mousewheel DOMMouseScroll'
};

var eventsMobile = {

	click			: 'click',
	doubleClick		: 'click',
	longPress		: 'taphold',
	move			: 'touchmove',
	swipe			: 'touchstart touchmove touchend',
	swipeleft		: 'swipeleft',
	swiperight		: 'swiperight',
	gestureSingle	: 'touchstart touchmove touchend'
};

var methods = {

	init : function( src ) {
		if( !$.data($(this), 'mselisteners') ) {
			var lis = {};
			$.data( $(this).get(0), 'mselisteners', lis );
			if(src)
				$.data($(this).get(0), 'mseSrc', src);
		}
	},
    
    destroy : function() {
		return this.each(function(){
			// Cancel dominate
			if($.fn.mseInteraction.prototype.dominateElem == $(this).get(0))
				$.fn.mseInteraction.prototype.dominateElem = null;
			// Unbind listeners
			$(this).unbind('.mseInteraction');
			$.removeData( $(this).get(0), 'mselisteners' );
			if(MseConfig.mobile) {
				$(this).get(0).removeEventListener('touchstart', analyse, false);
				$(this).get(0).removeEventListener('touchend', analyse, false);
				$(this).get(0).removeEventListener('touchmove', analyse, false);
			}
		});
	},
	
	setDominate : function() {
		$.fn.mseInteraction.prototype.dominateElem = $(this).get(0);
	},
	cancelDominate : function() {
		if($.fn.mseInteraction.prototype.dominateElem == $(this).get(0))
			$.fn.mseInteraction.prototype.dominateElem = null;
	},
	
	addListener : function(type, func, tag, data) {
		if( typeof(type) != 'string' && isNaN(type) )
			return false;
			
		if(data)
			_data = data;
		
		// Events corresponds
		var evts;
		if(MseConfig.mobile) evts = eventsMobile;
		else evts = eventsWeb;
		
		if( evts[type] != null ) {
			var listeners = $.data( $(this).get(0), 'mselisteners' );
			
			// If not existe, define listeners
			if( !listeners ) {
				var lis = {};
				listeners = $.data( $(this).get(0), 'mselisteners', lis );
			}
			listeners[type] = func;
			
			// Bind event to delegate function 'analyse'
			// No need for spercial bind
			if( !MseConfig.mobile || (MseConfig.mobile && type !== 'move' && type !== 'swipe' && type !== 'gestureSingle') ) 
				$(this).bind(evts[type]+'.mseInteraction', analyse);
			else {
			// Special bind for iOS touch event which is not supported by jQuery
				var arr = evts[type].split(' ');
				for( var i=0; i < arr.length; i++ ) {
					$(this).get(0).addEventListener(arr[i], analyse, false);
					//$(this).bind(arr[i], analyse);
				}
			}
		}
	},
	
	setDelegate : function(func, data) {
		if(data)
			_data = data;
		// Events corresponds
		var evts;
		if(MseConfig.mobile) evts = eventsMobile;
		else evts = eventsWeb;
		
		var listeners = $.data( $(this).get(0), 'mselisteners' );
		
		// If not existe, fail to set delegate
		if( !listeners ) return;
		for(var type in evts)
			listeners[type] = func;
		// Bind all events
		if(MseConfig.mobile) {
			$(this).bind('click dblclick taphold swipeleft swiperight.mseInteraction', analyse);
			$(this).get(0).addEventListener('touchstart', analyse, false);
			$(this).get(0).addEventListener('touchmove', analyse, false);
			$(this).get(0).addEventListener('touchend', analyse, false);
		}
		else {
			$(this).bind('click dblclick mousedown mousemove mouseup mousewheel DOMMouseScroll.mseInteraction', analyse);
			
			$(document).mseInteraction($.data( $(this).get(0), 'mseSrc' ));
			$(document).bind('keydown keypress keyup.mseInteraction', analyse);
			listeners = $.data( $(document).get(0), 'mselisteners' );
			listeners['keydown'] = func;
			listeners['keyup'] = func;
			listeners['keypress'] = func;
		}
	}

};


$.fn.mseInteraction = function( method ) {

	if ( methods[method] ) {
		return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.mseInteraction' );
    }
	
};
$.fn.mseInteraction.prototype.dominateElem = null;


function dblTimeOut() {
	_clicked = false;
}

// All interaction needed is listened by this function, it will analyse all the event occured and propose the real event which is happenning
function analyse(e) {
	if( !( $.fn.mseInteraction.prototype.dominateElem == null
		|| $.fn.mseInteraction.prototype.dominateElem == $(this).get(0) ) ) {
		return;
	}
	
	// Get listener list
	_listeners = $.data( $(this).get(0), 'mselisteners' );
	_src = $.data( $(this).get(0), 'mseSrc' );
	_src = (!_src) ? $(this) : _src;
	if(!_listeners) return;
	
	var evt = e || window.event;
	evt.preventDefault();
	var event = new MseGestEvt(evt);
	
	switch( event.type ) {
	
	case 'click' :
		if( typeof(_listeners['click']) == 'function' )
			_listeners['click'].call( _src, event );
		if( typeof(_listeners['doubleClick']) == 'function' ) {
			// Detect the double click on mobile
			if(MseConfig.mobile) {
				// Already clicked
				if( _clicked ) {
					event.type = 'doubleClick';
					_listeners['doubleClick'].call( _src, event );
					_clicked = false;
				}
				else {
					_clicked = true;
					_target = event.target;
					setTimeout( // Time out, redefine clicked as false
						dblTimeOut, 
						dblClickTimeOut );
				}
			}
		}
		break;
	
	case 'dblclick' : 
		if( typeof(_listeners['doubleClick']) == 'function' )
			event.type = 'doubleClick';
			_listeners['doubleClick'].call( _src, event );
		break;
	
// Mouse Events	
	case 'mousedown' : 
		gestureStart(e);
		break;
		
	case 'mousemove' :
		// Gesture Analyser add new point
		if(_currentEvt != null)
			gestureUpdate(e);

		if( typeof(_listeners['move']) == 'function' ) {
			event.type = 'move';
			event.prev = _prevLoc;
			_listeners['move'].call( _src, event );
			_prevLoc = [event.offsetX, event.offsetY];
		}
		break;
		
	case 'mouseup' :
		// Gesture Analyser add new point
		if(_currentEvt != null)
			gestureEnd(e);
		break;
		
	case 'mousewheel' :
		if( typeof(_listeners['scroll']) == 'function' )
			_listeners['scroll'].call( _src, event );
		break;
		
	
// Touch Events for iOS
	case 'taphold' :
		if( typeof(_listeners['longPress']) == 'function' ){
			event.type = 'longPress';
			_listeners['longPress'].call( _src, event );
		}
		break;
		
	case 'touchstart' :
		gestureStart(e);
		break;
	
	case 'touchmove' :
		if(_currentEvt != null)
			gestureUpdate(e);
	
		if( e.touches.length === 1 && typeof(_listeners['move']) == 'function' ) {
			event.type = 'move';
			event.prev = _prevLoc;
			_listeners['move'].call( _src, event );
			_prevLoc = [event.offsetX, event.offsetY];
		}
		break;
	
	case 'touchend' : 
		if( e.touches.length === 0 && _currentEvt != null )
			gestureEnd(e);
		break;
		

// Swipe Event propose by jQuery Mobile
	case 'swipeleft' :
	case 'swiperight' :
		if( typeof(_listeners[event.type]) == 'function' )
			_listeners[event.type].call( _src, event );
		break;
		
		
// Key Events Handling Generate a common result for all navigators
// Capable to handle normal key events and alt/shift pressed event(not implemented for ctrl)
// In Firefox, key 'enter' doesn't function in keypress events
	case 'keydown' :
	case 'keyup' :
	case 'keypress' :
		if( typeof(_listeners[event.type]) == 'function' )
			_listeners[event.type].call( _src, event );
		break;
		
	}
}

function pressTimeout() {
	if(_currentEvt) {
		_currentEvt.type = 'longPress';
		_listeners['longPress'].call( _src, _currentEvt );
	}
}
function clickTimeout() {_clickDown=false;}

function gestureStart(e) {
	// Gesture Analyser add start point
	_currentEvt = new MseGestEvt(e, true);
	_addPoint(e);
	
	if( typeof(_listeners['longPress']) == 'function' )
		_pressTimer = setTimeout( pressTimeout, pressTime );
	if( MseConfig.mobile && typeof(_listeners['click']) == 'function' ) {
		_clickDown = true;
		setTimeout( clickTimeout, clickTime );
	}
	if( typeof(_listeners['gestureSingle']) == 'function' ) {
		_currentEvt.type = 'gestureStart';
		_listeners['gestureSingle'].call( _src, _currentEvt );
	}
}

function gestureUpdate(e) {
	_addPoint(e);
	
	if( typeof(_listeners['longPress']) == 'function' )
		clearTimeout(_pressTimer);
	if( typeof(_listeners['gestureSingle']) == 'function' ) {
		_currentEvt.type = 'gestureUpdate';
		_listeners['gestureSingle'].call( _src, _currentEvt );
	}
}

function gestureEnd(e) {
	_currentEvt.offsetX = _currentEvt.listX[_currentEvt.listX.length-1];
	_currentEvt.offsetY = _currentEvt.listY[_currentEvt.listY.length-1];
	// Click
	if(_clickDown) {
		_currentEvt.type = 'click';
		_listeners['click'].call( _src, _currentEvt );
		_clickDown = false;
	}
	// Long Press
	if( typeof(_listeners['longPress']) == 'function' )
		clearTimeout(_pressTimer);
		
	// Swipe left right
	if( typeof(_listeners['swipe']) == 'function' ) {
		if(!MseConfig.mobile) {
			// Init
			var maxY = _currentEvt.listY[0];
			var minY = _currentEvt.listY[0];
			var length = _currentEvt.listX.length;
			var validLeft = true, validRight = true;
			
			for(var i = 1; i < length; i++) {
				// Max and Min
				if(_currentEvt.listY[i] > maxY)
					maxY = _currentEvt.listY[i];
				if(_currentEvt.listY[i] < minY)
					minY = _currentEvt.listY[i];
				
				// Direction left
				if(validRight && _currentEvt.listX[i] < _currentEvt.listX[i-1]) {
					validRight = false;
					if(!validLeft) break;
				}
				// Direction right
				if(validLeft && _currentEvt.listX[i] > _currentEvt.listX[i-1]) {
					validLeft = false;
					if(!validRight) break;
				}
			}
			
			_currentEvt.distance = Math.abs(_currentEvt.listX[length-1] - _currentEvt.listX[0]);
			
			if(maxY-minY < swipeWSeuil && _currentEvt.distance > swipeLSeuil) {
				if(validLeft) { // Swipe Left
					_currentEvt.type = 'swipeleft';
					_listeners['swipe'].call( _src, _currentEvt );
				}
				else if(validRight) { // Swipe Left
					_currentEvt.type = 'swiperight';
					_listeners['swipe'].call( _src, _currentEvt );
				}
			}
		}
		// Swipe up down
		var maxX = _currentEvt.listX[0];
		var minX = _currentEvt.listX[0];
		var length = _currentEvt.listX.length;
		var validUp = true, validDown = true;
		for(var i = 1; i < length; i++) {
			if(_currentEvt.listX[i] > maxX)
				maxX = _currentEvt.listX[i];
			if(_currentEvt.listX[i] < minX)
				minX = _currentEvt.listX[i];
			// Direction Up
			if(validUp && _currentEvt.listY[i] > _currentEvt.listY[i-1]) {
				validUp = false;
				if(!validDown) break;
			}
			// Direction right
			if(validDown && _currentEvt.listY[i] < _currentEvt.listY[i-1]) {
				validDown = false;
				if(!validUp) break;
			}
		}
		_currentEvt.distance = Math.abs(_currentEvt.listY[length-1] - _currentEvt.listY[0]);
		
		if(maxX-minX < swipeWSeuil && _currentEvt.distance > swipeLSeuil) {
			if(validUp) {
				_currentEvt.type = 'swipeup';
				_listeners['swipe'].call( _src, _currentEvt );
			}
			else if(validDown) {
				_currentEvt.type = 'swipedown';
				_listeners['swipe'].call( _src, _currentEvt );
			}
		}
	}
	
	// Gesture Single
	if( typeof(_listeners['gestureSingle']) == 'function' ) {
		_currentEvt.type = 'gestureEnd';
		_listeners['gestureSingle'].call( _src, _currentEvt );
	}
	
	
	_currentEvt = null;
}

function _addPoint(e) {
	if( e.type.indexOf('mouse') >= 0 ) {
		// Web interacton with mouse or Android touch( TODO: correction )
		if(MseConfig.browser === 'Firefox') {
			var offX = e.pageX - $(e.target).offset().left;
			var offY = e.pageY - $(e.target).offset().top;
		}else {
			var offX = e.offsetX;
			var offY = e.offsetY;
		}
		_currentEvt.listX.push(offX);
		_currentEvt.listY.push(offY);
	}
	else {
		// iOS interaction with touch
		var touch = e.targetTouches[0]; // Get the information for finger #1
		_currentEvt.listX.push(touch.pageX - $(e.target).position().left);
		_currentEvt.listY.push(touch.pageY - $(e.target).position().top);
	}
	_currentEvt.offsetX = _currentEvt.listX[_currentEvt.listX.length-1];
	_currentEvt.offsetY = _currentEvt.listY[_currentEvt.listY.length-1];
}



function MseGestEvt( e, forAnalyse ) {
	this.target = e.target;
	
	// Event for analyser to analyse the gestures
	if(forAnalyse) this.type = 'temporary';
	else this.type = e.type;
		
	this.windowX = e.clientX;
	this.windowY = e.clientY;
	if(e.type === 'touchmove') {
		var evt = e.targetTouches[0]; // Get the information for finger #1
		this.offsetX = evt.pageX - $(e.target).offset().left;
		this.offsetY = evt.pageY - $(e.target).offset().top;
	} else if(MseConfig.browser === 'Firefox') {
		this.offsetX = e.pageX - $(e.target).offset().left;
		this.offsetY = e.pageY - $(e.target).offset().top;
	} else {
		this.offsetX = e.offsetX;
		this.offsetY = e.offsetY;
	}
	
	if(forAnalyse) {
		this.listX = new Array();
		this.listY = new Array();
	}
	
	if(e.type === 'keydown' || e.type === 'keyup') {
		this.keyCode = e.keyCode;
		this.charCode = e.keyCode;
		this.altKey = e.altKey;
		this.ctrlKey = false;
		this.shiftKey = e.shiftKey;
	}
	if(e.type === 'keypress') {
		this.altKey = e.altKey==null ? false : e.altKey;
		this.ctrlKey = false;
		this.shiftKey = e.shiftKey==null ? false : e.shiftKey;
		
		if(MseConfig.browser === 'Firefox') {
			// key 'enter' doesn't function
			this.keyCode = e.charCode;
			this.charCode = e.charCode;
		}
		else {
			this.keyCode = e.keyCode;
			this.charCode = e.keyCode;
		}
	}
	if(e.type === 'DOMMouseScroll') {// Firefox
		// The measurement units of the detail and wheelDelta properties are different.
		this.rolled = -40 * e.detail;
		this.type = 'mousewheel';
	}
	else if(e.type === 'mousewheel') this.rolled = e.wheelDelta;
	
	// Optional data
	if(_data)
		this.data = _data;
}


})( jQuery );



__KEY_DOWN	= 40;
__KEY_UP	= 38;
__KEY_LEFT	= 37;
__KEY_RIGHT	= 39;



(function() {
	var _init = false;
	
	MseConfigrationSingleton = function() {
		// Class singleton for all general configration
		this.os = BrowserDetect.OS;
		this.mobile = (this.os == "Mobile/iOS/iPhone");
		this.browser = BrowserDetect.browser; // Chrome/Safari/Firefox/Opera/Explorer
		//this.version = BrowserDetect.version;
		
		this.update = function() {
			if(this.os == "Mobile/iOS/iPhone") {
				this.orientation = window.innerWidth > 320 ? 'landscape' : 'portrait';
				this.pageWidth = window.innerWidth > 320 ? 480 : 320;
				this.pageHeight = window.innerWidth > 320 ? 268 : 416;
			}
			else if(this.mobile) {
				this.pageWidth = window.innerWidth;
				this.pageHeight = window.innerHeight;
			}
			else {
				this.pageWidth = $(window).width();
				this.pageHeight = $(window).height();
			}
		};

		this.update();
		
		$(window).bind('orientationchange', 
						function(e){
							MseConfig.update();
							setTimeout(function(){
								window.scrollTo(0, 1);
							}, 0);
						});
	}
	
	window.initMseConfig = function() {
		if(!_init) {
			window.MseConfig = new MseConfigrationSingleton();
			_init = true;
		}
	};
	
	$(window).resize(function() {
		MseConfig.update();
	});
})();