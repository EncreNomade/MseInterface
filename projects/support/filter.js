(function(mse, w){

var Filter = function() {
  this.init();
}
var p = Filter.prototype;
	
	p.init = function() {}
	
	p.getBounds = function() {
		return new Rectangle(0,0,0,0);
	}

	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {}
	p.applyToObj = function(obj) {
	    if(obj instanceof mse.Image) {
	        // Create canvas cache
	        var canvas = w.document.createElement("canvas");
	        var ctx = canvas.getContext("2d");
	        canvas.width = obj.width;
	        canvas.style.width = tilew;
	        canvas.height = tileh;
	        canvas.style.height = tileh;
	        ctx.drawImage(mse.src.getSrc(srcname), c*tilew, r*tileh, tilew, tileh, 0, 0, tilew, tileh);
	    }
	    else if(obj instanceof mse.Sprite) {
	    }
	}
	

var ColorFilter = function(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
  this.initialize(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
}
var p = ColorFilter.prototype = new Filter();

// public properties:
	/**
	 * Red channel multiplier.
	 * @property redMultiplier
	 * @type Number
	 **/
	p.redMultiplier = 1;
	
	/** 
	 * Green channel multiplier.
	 * @property greenMultiplier
	 * @type Number
	 **/
	p.greenMultiplier = 1;
	
	/**
	 * Blue channel multiplier.
	 * @property blueMultiplier
	 * @type Number
	 **/
	p.blueMultiplier = 1;
	
	/**
	 * Alpha channel multiplier.
	 * @property redMultiplier
	 * @type Number
	 **/
	p.alphaMultiplier = 1;
	
	/**
	 * Red channel offset (added to value).
	 * @property redOffset
	 * @type Number
	 **/
	p.redOffset = 0;
	
	/**
	 * Green channel offset (added to value).
	 * @property greenOffset
	 * @type Number
	 **/
	p.greenOffset = 0;
	
	/**
	 * Blue channel offset (added to value).
	 * @property blueOffset
	 * @type Number
	 **/
	p.blueOffset = 0;
	
	/**
	 * Alpha channel offset (added to value).
	 * @property alphaOffset
	 * @type Number
	 **/
	p.alphaOffset = 0;

// constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 **/
	p.initialize = function(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
		this.redMultiplier = redMultiplier != null ? redMultiplier : 1;
		this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;
		this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;
		this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;
		this.redOffset = redOffset || 0;
		this.greenOffset = greenOffset || 0;
		this.blueOffset = blueOffset || 0;
		this.alphaOffset = alphaOffset || 0;
	}

// public methods:
	/**
	 * Applies the filter to the specified context.
	 * @method applyFilter
	 * @param ctx The 2D context to use as the source.
	 * @param x The x position to use for the source rect.
	 * @param y The y position to use for the source rect.
	 * @param width The width to use for the source rect.
	 * @param height The height to use for the source rect.
	 * @param targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @param targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
	 * @param targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
	 **/
	p.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
		targetCtx = targetCtx || ctx;
		if (targetX == null) { targetX = x; }
		if (targetY == null) { targetY = y; }
		try {
			var imageData = ctx.getImageData(x, y, width, height);
		} catch(e) {
			//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
			return false;
		}
		var data = imageData.data;
		var l = data.length;
		for (var i=0; i<l; i+=4) {
			data[i] = data[i]*this.redMultiplier+this.redOffset;
			data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
			data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
			data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
		}
		imageData.data = data;
		targetCtx.putImageData(imageData, targetX, targetY);
		return true;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	p.toString = function() {
		return "[ColorFilter]";
	}


	/**
	 * Returns a clone of this ColorFilter instance.
	 * @method clone
	 @return {ColorFilter} A clone of the current ColorFilter instance.
	 **/
	p.clone = function() {
		return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
	}

})(mse, window);