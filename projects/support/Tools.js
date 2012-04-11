function mseAngleForLine(x1, y1, x2, y2) {
	var angle = 0;
	var dx = x2 - x1;
	var dy = y2 - y1;
	angle = Math.atan2(dy, dx);
	return Math.round(180 * angle/(Math.PI));
};

function distance2Pts(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
};

function imgBoundingInBox(img, width, height) {
    if(typeof(img) == 'string') img = mse.src.getSrc(img);
    if(!img || !(img instanceof Image)) return {pos:[0,0],size:[0,0]};
    var rx = width/img.width, ry = height/img.height;
    var r = (rx < ry) ? rx : ry;
    var iw = img.width * r;
    var ih = img.height * r;
    var ix = (width-iw)/2;
    var iy = (height-ih)/2;
    return {pos:[ix,iy],size:[iw,ih]};
};


function mseLog(name, msg) {
	var err = new Error();
	err.name = name;
	err.message = msg;
	throw(err); 
};

CanvasRenderingContext2D.prototype.fillRoundRect = function(x,y,width,height,radius){
	this.beginPath();
	this.moveTo(x,y+radius);
	this.lineTo(x,y+height-radius);
	this.quadraticCurveTo(x,y+height,x+radius,y+height);
	this.lineTo(x+width-radius,y+height);
	this.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
	this.lineTo(x+width,y+radius);
	this.quadraticCurveTo(x+width,y,x+width-radius,y);
	this.lineTo(x+radius,y);
	this.quadraticCurveTo(x,y,x,y+radius);
	this.fill();
};

CanvasRenderingContext2D.prototype.strokeRoundRect = function(x,y,width,height,radius){
	this.beginPath();
	this.moveTo(x,y+radius);
	this.lineTo(x,y+height-radius);
	this.quadraticCurveTo(x,y+height,x+radius,y+height);
	this.lineTo(x+width-radius,y+height);
	this.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
	this.lineTo(x+width,y+radius);
	this.quadraticCurveTo(x+width,y,x+width-radius,y);
	this.lineTo(x+radius,y);
	this.quadraticCurveTo(x,y,x,y+radius);
	this.stroke();
};

CanvasRenderingContext2D.prototype.fillTextWrapped = function(text, x, y, width, lineHeight){
    var lines = wrapText(text, this, width);
    if(!lineHeight) lineHeight = checkFontSize(ctx.font)*1.2;
    for(var i = 0; i < lines.length; i++)
        this.fillText(lines[i], x, y+lineHeight*i);
    return lineHeight * lines.length;
};

// Object.keys not supported solution
if (!Object.keys) {  
  Object.keys = (function () {  
    var hasOwnProperty = Object.prototype.hasOwnProperty,  
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),  
        dontEnums = [  
          'toString',  
          'toLocaleString',  
          'valueOf',  
          'hasOwnProperty',  
          'isPrototypeOf',  
          'propertyIsEnumerable',  
          'constructor'  
        ],  
        dontEnumsLength = dontEnums.length  
  
    return function (obj) {  
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')  
  
      var result = []  
  
      for (var prop in obj) {  
        if (hasOwnProperty.call(obj, prop)) result.push(prop)  
      }  
  
      if (hasDontEnumBug) {  
        for (var i=0; i < dontEnumsLength; i++) {  
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])  
        }  
      }  
      return result  
    }  
  })()  
};

// Random integer generator, result between [0,max[, max exclus
function randomInt(max) {
	return Math.floor(Math.random()*max);
};

// Get the font size from the string of font definition
function checkFontSize(str) {
    var match = /\s*([\d\.]*)px/.exec(str);
    return match[1];
};



function checkNextLine(ctx, text, maxM, width){
	// Next line is the whole text remaining
	if(maxM >= text.length) return text.length;
	// Forward check
	var prevId;
	var nextId = maxM;
	do {
		prevId = nextId;
		// Find next space
		var index = text.substr(prevId).search(/[\s\n\r\-\/\\\:]/);
		index = (index == -1) ? -1 : prevId+index;
		// No space after
		if(index == -1) {
			if(ctx.measureText(text).width <= width)
				prevId = text.length;
			break;
		}
		// Text length
		var l = ctx.measureText(text.substr(0, index));
		nextId = index+1;
	} while(l.width < width);
	// Forward check success
	if(prevId != maxM) {
		return prevId;
	}
	// Backward check when forward check failed
	else {// Find last space
		var lastsp = text.lastIndexOf(' ', maxM);
		if(lastsp == -1) return maxM;
		else return (lastsp+1);
	}
};
function wrapText(text, ctx, width, font) {
    if(width <= 0) return [text];
    var lines = new Array();
    if(font) {
        var temp = ctx.font;
        ctx.font = font;
    }
    var maxA = Math.floor( width/ctx.measureText('A').width );
    
    for(var j = 0; j < text.length;) {
    	// Find the index of next line
    	var next = checkNextLine(ctx, text.substr(j), maxA, width);
    	lines.push(text.substr(j, next));
    	j += next;
    }
    if(font) ctx.font = temp;
    return lines;
};



// Class extend utilitie function
function extend(Child, Parent) {
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
};