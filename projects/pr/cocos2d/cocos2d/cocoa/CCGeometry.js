/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * @class
 * @param {Number} _x
 * @param {Number} _y
 * Constructor
 */
cc.Point = function (_x, _y) {
    this.x = _x || 0;
    this.y = _y || 0;
};

/**
 * @function
 * @param {cc.Point} point1
 * @param {cc.Point} point2
 * @return {Boolean}
 * Constructor
 */
cc.Point.CCPointEqualToPoint = function (point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y));
};

/**
 * @class
 * @param {Number} _width
 * @param {Number} _height
 * Constructor
 */
cc.Size = function (_width, _height) {
    this.width = _width || 0;
    this.height = _height || 0;
};

/**
 * @function
 * @param {cc.Size} size1
 * @param {cc.Size} size2
 * @return {Boolean}
 * Constructor
 */
cc.Size.CCSizeEqualToSize = function (size1, size2) {
    return ((size1.width == size2.width) && (size1.height == size2.height));

};

/**
 * @class
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} width1
 * @param {Number} height1
 * Constructor
 */
cc.Rect = function (x1, y1, width1, height1) {
    switch (arguments.length) {
        case 0:
            this.origin = new cc.Point(0, 0);
            this.size = new cc.Size(0, 0);
            break;
        case 1:
            var oldRect = x1;
            if (!oldRect) {
                this.origin = new cc.Point(0, 0);
                this.size = new cc.Size(0, 0);
            } else {
                if (oldRect instanceof cc.Rect) {
                    this.origin = new cc.Point(oldRect.origin.x, oldRect.origin.y);
                    this.size = new cc.Size(oldRect.size.width, oldRect.size.height);
                } else {
                    throw "unknown argument type";
                }
            }
            break;
        case 2:
            this.origin = x1 ? new cc.Point(x1.x, x1.y) : new cc.Point(0, 0);
            this.size = y1 ? new cc.Size(y1.width, y1.height) : new cc.Size(0, 0);
            break;
        case 4:
            this.origin = new cc.Point(x1 || 0, y1 || 0);
            this.size = new cc.Size(width1 || 0, height1 || 0);
            break;
        default:
            throw "unknown argument type";
            break;
    }
};

/**
 * @function
 * @param {cc.Rect} rect1
 * @param {cc.Rect} rect2
 * @return {Boolean}
 * Constructor
 */
cc.Rect.CCRectEqualToRect = function (rect1, rect2) {
    return ((cc.Point.CCPointEqualToPoint(rect1.origin, rect2.origin)) &&
        (cc.Size.CCSizeEqualToSize(rect1.size, rect2.size)));
};

/**
 * return the rightmost x-value of 'rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMaxX = function (rect) {
    return (rect.origin.x + rect.size.width);
};

/**
 * return the midpoint x-value of 'rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMidX = function (rect) {
    return ((rect.origin.x + rect.size.width) / 2.0);
};
/**
 * return the leftmost x-value of 'rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMinX = function (rect) {
    return rect.origin.x;
};

/**
 * Return the topmost y-value of `rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMaxY = function (rect) {
    return(rect.origin.y + rect.size.height);
};

/**
 * Return the midpoint y-value of `rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMidY = function (rect) {
    return rect.origin.y + rect.size.height / 2.0;
};

/**
 * Return the bottommost y-value of `rect'
 * @function
 * @param {cc.Rect} rect
 * @return {Number}
 * Constructor
 */
cc.Rect.CCRectGetMinY = function (rect) {
    return rect.origin.y;
};

/**
 * @function
 * @param {cc.Rect} rect
 * @param {cc.Point} point
 * @return {Boolean}
 * Constructor
 */
cc.Rect.CCRectContainsPoint = function (rect, point) {
    var ret = false;
    if (point.x >= cc.Rect.CCRectGetMinX(rect) && point.x <= cc.Rect.CCRectGetMaxX(rect)
        && point.y >= cc.Rect.CCRectGetMinY(rect) && point.y <= cc.Rect.CCRectGetMaxY(rect)) {
        ret = true;
    }
    return ret;
};

/**
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {Boolean}
 * Constructor
 */
cc.Rect.CCRectIntersectsRect = function (rectA, rectB) {
    return !(cc.Rect.CCRectGetMaxX(rectA) < cc.Rect.CCRectGetMinX(rectB) ||
        cc.Rect.CCRectGetMaxX(rectB) < cc.Rect.CCRectGetMinX(rectA) ||
        cc.Rect.CCRectGetMaxY(rectA) < cc.Rect.CCRectGetMinY(rectB) ||
        cc.Rect.CCRectGetMaxY(rectB) < cc.Rect.CCRectGetMinY(rectA));
};

/**
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {Boolean}
 * Constructor
 */
cc.Rect.CCRectOverlapsRect = function (rectA, rectB) {
    if (rectA.origin.x + rectA.size.width < rectB.origin.x) {
        return false;
    }
    if (rectB.origin.x + rectB.size.width < rectA.origin.x) {
        return false;
    }
    if (rectA.origin.y + rectA.size.height < rectB.origin.y) {
        return false;
    }
    if (rectB.origin.y + rectB.size.height < rectA.origin.y) {
        return false;
    }
    return true;
};

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @function
 * @param {cc.Rect}　rectA
 * @param {cc.Rect}　rectB
 * @return {cc.Rect}
 * Constructor
 */
cc.Rect.CCRectUnion = function (rectA, rectB) {
    var rect = new cc.Rect(0, 0, 0, 0);
    rect.origin.x = Math.min(rectA.origin.x, rectB.origin.x);
    rect.origin.y = Math.min(rectA.origin.y, rectB.origin.y);
    rect.size.width = Math.max(rectA.origin.x + rectA.size.width, rectB.origin.x + rectB.size.width) - rect.origin.x;
    rect.size.height = Math.max(rectA.origin.y + rectA.size.height, rectB.origin.y + rectB.size.height) - rect.origin.y;
    return rect
};

/**
 * Returns the overlapping portion of 2 rectangles
 * @function
 * @param {cc.Rect} rectA
 * @param {cc.Rect} rectB
 * @return {cc.Rect}
 * Constructor
 */
cc.Rect.CCRectIntersection = function (rectA, rectB) {
    var intersection = new cc.Rect(
        Math.max(cc.Rect.CCRectGetMinX(rectA), cc.Rect.CCRectGetMinX(rectB)),
        Math.max(cc.Rect.CCRectGetMinY(rectA), cc.Rect.CCRectGetMinY(rectB)),
        0, 0);

    intersection.size.width = Math.min(cc.Rect.CCRectGetMaxX(rectA), cc.Rect.CCRectGetMaxX(rectB)) - cc.Rect.CCRectGetMinX(intersection);
    intersection.size.height = Math.min(cc.Rect.CCRectGetMaxY(rectA), cc.Rect.CCRectGetMaxY(rectB)) - cc.Rect.CCRectGetMinY(intersection);
    return intersection
};

/**
 * @function
 * @param {Number} x
 * @param {Number} y
 * @return {cc.Point}
 * Constructor
 */
cc.PointMake = function (x, y) {
    return new cc.Point(x, y);
};

/**
 * @function
 * @param {Number} width
 * @param {Number} height
 * @return {cc.Size}
 * Constructor
 */
cc.SizeMake = function (width, height) {
    return new cc.Size(width, height);
};

/**
 * @function
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @return {cc.Rect}
 * Constructor
 */
cc.RectMake = function (x, y, width, height) {
    return new cc.Rect(x, y, width, height);
};

/**
 * The "left bottom" point -- equivalent to cc.PointMake(0, 0).
 * @function
 * @return {cc.Point}
 * Constructor
 */
cc.PointZero = function () {
    return new cc.Point(0, 0)
};

/**
 * The "zero" size -- equivalent to cc.SizeMake(0, 0).
 * @function
 * @return {cc.Size}
 * Constructor
 */
cc.SizeZero = function () {
    return new cc.Size(0, 0)
};

/**
 * The "zero" rectangle -- equivalent to cc.RectMake(0, 0, 0, 0).
 * @function
 * @return {cc.Rect}
 * Constructor
 */
cc.RectZero = function () {
    return new cc.Rect(0, 0, 0, 0)
};




cc.Polygon = {};

/**
 * return the smallest box which contains the polygon
 * @function
 * @param { cc.Polygon } _polygon
 * @return {cc.Rect}
 * Constructor
 */
cc.Polygon.getBoundaryBox = function( polygon ){
	if( polygon.length <= 0 )
		return;
	
	var top    = polygon[0].y;
	var bottom = polygon[0].y;
	var left   = polygon[0].x;
	var right  = polygon[0].x;
	
	for( var i = 1 ; i < polygon.length ; i ++ ){
		if( top < polygon[ i ].y )
			top = polygon[ i ].y;
		else 
		if( bottom > polygon[ i ].y )
			bottom = polygon[ i ].y;
			
		if( left > polygon[ i ].x )
			left = polygon[ i ].x;
		else 
		if( right < polygon[ i ].x )
			right = polygon[ i ].x;
	}
	
	return new cc.Rect( left , bottom , right - left , top - bottom );
}


/**
 * return true if the circle define by it center ( c  ) and it radius ( r ) collapse the polygon
 * using a sat-based method
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Polygon }  polygon
 * @return { boolean }  
 * Constructor
 */
cc.Polygon.collisionCircleToPolygon = function( c , r , polygon ){

	// in order to win a few precious second, several adjustement have been done that dont make the code so easy to read,
	// the object are used the less possible, ( for exemple an object point ( x , y ) is replace by the two number ox , oy
	// store the value of length for the loop on the array does speed up noticablely the execution
	// the use of Math.pow for a rise to square is a millisecond pit, compare to a simple a * a
	
	
	// order of the vertex, ( counterclockwise or clockwise )
	// because the polygone is not restricted to an order ( it can be wether one or the other )
	var ref = ( polygon[ 1 ].x - polygon[ 0 ].x ) * ( polygon[ 2 ].y - polygon[ 1 ].y ) + ( polygon[ 0 ].y - polygon[ 1 ].y ) * ( polygon[ 2 ].x - polygon[ 1 ].x ) >= 0; 
	
	var square_r = r *r;
	var len = polygon.length;
	
	//
	// first, discard the circle if it is too far from the edge ( and in the wrong side of side of this edge )
	// lets use the loop to determine the closest vertex, usefull for the second part
	
	var ax = polygon[ len-1 ].x , ay = polygon[ len-1 ].y ,
		cx = c.x , cy = c.y ,
		cbx , cby ,
		bx , by , 
		abx, aby,
		min_dist = Infinity ,
		det  ,  closest_p , square_CB ;
		
	for( var i = 0 ; i < len ; i ++ ){
		bx = polygon[ i ].x;
		by = polygon[ i ].y
		
		cbx = bx - cx;
		cby = by - cy;
		
		abx = bx - ax;
		aby = by - ay;
		
		det = abx  *  cby - aby  *  cbx ;
		
		// check if too far from the edge
		if( det >= 0 == ref ){
			// the center is outside the edge a b
			// if the distance from the line a b to the center is up to it radius, the collision can not be
			if( square_r < det * det / ( abx*abx + aby*aby ) ) // prevent the use of squareRoot ( rise to square the two hands )
				return false;
		}
		
		// check for the closest vertex to the center
		square_CB = cbx*cbx + cby*cby;
		if( min_dist > square_CB ){
			//check if the point b is in the circle
			if( square_CB < square_r ) // notice that this test will be run later, its a test for an early exit, skipping the the edge in the loop 
				return true;
			min_dist = square_CB;
			closest_p = i;
		}
		ax = bx;
		ay = by;
	}
	
	// 
	// the center is include in a domain that have the shape of the polygon with a expansion of the value of the radius
	// the only domain remaining where the circle does not collapse is in the corner of this expanded shape, 
	// lets check if the center of the circle is in the last domain, delimited by the two line that form the closest vertex ( the line formed by the vertex and the previous one, and the vertex and the next one )
	
	var prev = polygon[ ( closest_p -1 + len ) % len ];
	var next = polygon[ ( closest_p +1 ) % len ];
	
	var CloseCx = c.x - polygon[ closest_p ].x ,
		CloseCy = c.y - polygon[ closest_p ].y ;
	
	if( 	( prev.x - polygon[ closest_p ].x ) * CloseCx + ( prev.y - polygon[ closest_p ].y ) * CloseCy < 0		
		 &&	( next.x - polygon[ closest_p ].x ) * CloseCx + ( next.y - polygon[ closest_p ].y ) * CloseCy < 0		// in the domain
		 &&  CloseCx * CloseCx + CloseCy * CloseCy > square_r  )
			return false;
			
	return true;
}

/**
 * assume there is a collision between the polygon and the circle 
 * return the normal at the edge where the collision happen,
 * if its happen on a vertex, return the direction to the vertex
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Polygon }  polygon
 * @return { cc.Point }  
 * Constructor
 */
 // need to be tested
cc.Polygon.collisionReactionCircleToPolygon = function( c , r , polygon ){
	
	var ref = ( polygon[ 1 ].x - polygon[ 0 ].x ) * ( polygon[ 2 ].y - polygon[ 1 ].y ) + ( polygon[ 0 ].y - polygon[ 1 ].y ) * ( polygon[ 2 ].x - polygon[ 1 ].x ) >= 0; 
	
	var square_r = r *r;
	var len = polygon.length;
	
	//
	// first, discard the circle if it is too far from the edge ( and in the wrong side of side of this edge )
	// lets use the loop to determine the closest vertex, usefull for the second part
	
	var ax = polygon[ len-1 ].x , ay = polygon[ len-1 ].y ,
		cx = c.x , cy = c.y ,
		cbx , cby ,
		bx , by , 
		abx, aby,
		min_dist = Infinity ,
		det  ,  closest_p , square_CB ,
		n;
		
	for( var i = 0 ; i < len ; i ++ ){
		bx = polygon[ i ].x;
		by = polygon[ i ].y
		
		cbx = bx - cx;
		cby = by - cy;
		
		abx = bx - ax;
		aby = by - ay;
		
		det = abx  *  cby - aby  *  cbx ;
		
		// check if too far from the edge
		if( det >= 0 == ref ){
				
			// the centre is in the band delimited by the edge and the dilated edge
			
			// check if the center is outside the bordered band, delimited by the corner
			
			if( abx * cbx + aby * cby < 0 ){
				// out of the band, by the b corner
				n = Math.square( cbx*cbx + cby * cby );
				return cc.PointMake( -cbx/n , -cby/n );
			}
			
			// use the var cb, but its ac
			cbx = cx - ax;
			cby = cy - ay;
			
			if( abx * cbx + aby * cby < 0 ){
				// out of the band, by the b corner
				n = Math.square( cbx*cbx + cby * cby );
				return cc.PointMake( cbx/n , cby/n );
			}
			
			// c is actually in the delimited band
			n = Math.square( abx * abx + aby * aby );
			if( ref )
				return cc.PointMake( aby/n , -abx/n );
			else
				return cc.PointMake( -aby/n , abx/n );
		}
		
		ax = bx;
		ay = by;
	}
	
	// the center is in the polygon
	return cc.PointMake( 1, 0);
}

/**
 * split a polygone in two,
 * i and j are wether integer or float
 * if integer, its the corner where the split happen
 * if float, its the point where the split happen, its lineary placed on the edge, ( 1.5 is the midlle of the second edge )
 * return an array of two polygon , the first is the one that contains the firsts vertex ( its contains 0 , 1 .. until the break )
 * @function
 * @param { Array cc.Point }  polygon
 * @param { Number }  i
 * @param { Number }  j
 * @return {  Array of Array cc.Point}   
 */
cc.Polygon.split = function( polygon , i , j ){

	var one = [];
	var two = [];
	
	if( i > polygon.length -1 || j > polygon.length -1  )
		return [ polygon , [] ];
	
	
	if( i > j ){
		var tmp = j ;
		j = i;
		i = tmp;
	}
	
	var k;
	
	// build the firsts corners of one
	for( k = 0 ; k <= Math.floor(i) ; k ++ )
		one.push( polygon[ k ] );
	
	// if i is an integer
	if( i == Math.floor(i) )
		// one and two have polygon[ k ] in common
		two.push( polygon[ (k - 1 + polygon.length) % polygon.length ] );
	else{
		// one and two have e in common, where e is somewhere between i and j
		var alpha = i-k+1;
		var beta = 1 - alpha;
		var e = {
			x : polygon[ (k - 1 + polygon.length) % polygon.length ].x * alpha + polygon[ k ].x * beta,
			y : polygon[ (k - 1 + polygon.length) % polygon.length ].y * alpha + polygon[ k ].y * beta
		}
		one.push( e );
		two.push( e );
	}
	
	// build the corners of two
	for(  ; k <=  Math.floor( j ) ; k ++ )
		two.push( polygon[ k ] );
	
	// if j is an integer
	if( j == Math.floor(j) )
		// one and two have polygon[ k ] in common
		one.push( polygon[ (k - 1 + polygon.length) % polygon.length ] );
	else{
		// one and two have e in common, where e is somewhere between i and j
		var alpha = j-k+1;
		var beta = 1 - alpha;
		var e = {
			x : polygon[ (k - 1 + polygon.length) % polygon.length ].x * alpha + polygon[ k ].x * beta,
			y : polygon[ (k - 1 + polygon.length) % polygon.length ].y * alpha + polygon[ k ].y * beta
		}
		one.push( e );
		two.push( e );
	}
	
	// build the corners of one
	for(  ; k < polygon.length ; k ++ )
		one.push( polygon[ k ] );
	
		
	return [ one , two ];
}

/**
 * return true if the circle define by it center ( c  ) and it radius ( r ) collapse the rectangle
 * using a sat method on the x and y axes
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Rect }  rect
 * @return { boolean }  
 * Constructor
 */
cc.Polygon.collisionReactionCircleRect = function( c , r , rect ){
	
return ( 	rect.origin.x - r < c.x && c.x < rect.origin.x + rect.size.width + r 
		&&  rect.origin.y- r < c.y && c.y < rect.origin.y + rect.size.height + r ); 
	
	
}


/**
 * return true if the circle define by it center ( c  ) and it radius ( r ) collapse the rectangle
 * using a sat method on the x and y axes
 * @function
 * @param { cc.Point }  c 
 * @param { number }  r 
 * @param { cc.Rect }  rect
 * @return { boolean }  
 * Constructor
 */
cc.Polygon.collisionCircleRect = function( c , r , rect ){
	
	var 
	inx = ( rect.origin.x  < c.x && c.x < rect.origin.x + rect.size.width ) ,
	iny = ( rect.origin.y  < c.y && c.y < rect.origin.y + rect.size.height ) ;
	
	if( inx && iny ){
		var t = cc.PointMake( c.x - ( rect.origin.x + rect.size.width /2 ) , c.y - ( rect.origin.y + rect.size.height /2 ) );
		var n = Math.sqrt( t.x * t.x + t.y * t.y );
	}
	
	
}


/**
 * return the rectangle as a array of point
 * @function
 * @param { cc.Rect }  rect
 * @return { Array of cc.Point }  
 * Constructor
 */
cc.Polygon.RectToPoly = function( rect ){
	return [ 	cc.PointMake( rect.origin.x , rect.origin.y ) ,
				cc.PointMake( rect.origin.x + rect.size.width , rect.origin.y ),
				cc.PointMake( rect.origin.x + rect.size.width , rect.origin.y + rect.size.height ),
				cc.PointMake( rect.origin.x , rect.origin.y + rect.size.height ) ];
}


cc.Polygon.splitInConvexesEars = function( polygon  ){
	
	// we will use the det for determinate if the point is in or out a side,
	// we dont know if a positif mean out or inside, ( because the is no restriction on the order of the corner )
	// we will perform a check, on all the corner and determine which is the most common 
	
	// +1 for each positive det , -1 for each neg
	var sum_order = 0;
	
	var each_order = new Array( polygon.length );
	
	var a = polygon[ polygon.length -2 ] , b = polygon[ polygon.length -1 ] , c;
	
	for( var k = 0 ; k < polygon.length ; k ++ ){
		
		// a then b then c
		
		c = polygon[ k ];
		
		// check if c is on the right side of the edge a b
		
		var det = ( a.x - b.x ) * ( c.y - b.y ) + ( b.y - a.y ) * ( c.x - b.x );
		
		if( det >= 0 ){
			each_order[ ( k-1+polygon.length)%polygon.length ] = true;
			sum_order ++;
		} else {
			each_order[ ( k-1+polygon.length)%polygon.length ] = false;
			sum_order --;
		}
		a = b;
		b = c;
	}
	
	// it is convexe
	if( Math.abs( sum_order ) == polygon.length )
		return [ polygon ];
	
	
	// lets assume the majority of vertex will not be notch
	// so if sum_order is positive we got a majority of positive det, so assume that a non not vertex has a positive vertex ( respectively negative )
	var order = sum_order >= 0 ;
	
	
	var notchs = [];
	var notch = null;
	var A , B , Av1 , Av2;
	for( var i = 0 ; i < each_order.length ; i ++ ){
		if( each_order[ i ] == order )
			continue;
		
		notch = {
			i : i ,
			link : [ (i+1)%polygon.length ]
			};
			
		A = polygon[ i ];
		Av2 = { x : A.x - polygon[ (i+1)%polygon.length ].x ,
				y : A.y - polygon[ (i+1)%polygon.length ].y  }; // prev neightbour vect
		Av1 = { x : polygon[ (i-1+polygon.length)%polygon.length ].x - A.x ,
				y : polygon[ (i-1+polygon.length)%polygon.length ].y - A.y }; // next neightbour vect
		
		
		// check the linkability with all the vertex
		var j;
		for( var aj = 2 ; aj < polygon.length - 1 ; aj ++ ){
			
			j = (i+aj)%polygon.length
			
			B = polygon[ j ];
			
			// check the direction of AB ( need to be inside the polygon, at least localy )
			if( ( B.x - A.x ) * Av1.y + ( A.y - B.y ) * Av1.x > 0 == order 			// right side of first neightbour
			 && ( B.x - A.x ) * Av2.y + ( A.y - B.y ) * Av2.x > 0 == order )		// right side of second neightbour
				continue;
			
			// check the exit on the segment A B
			var accept = true;
			for( var k = 1 ; k < polygon.length - 1 ; k ++ ){
				if( ( j + k + 1 ) % polygon.length == i  ){ // dont check the intersection with a segment that pass by A ( meaning the segment xA and Ax ) 
					k ++; 	// skip the segment Ax
					continue;
				}
				if( false != cc.Polygon.intersectionSegmentSegment( A , B , polygon[ ( j + k ) % polygon.length ] ,  polygon[ ( j + k + 1 ) % polygon.length ] ) ){
					accept = false;
					break;
				}
			}
			if( accept )
				notch.link.push( j );
		}
		
		notch.link.push( ( i-1+polygon.length)%polygon.length );
	
		notchs.push( notch );
	}
	
	// estimation of the largest sub poly
	for( var i = 0 ; i < notchs.length ; i ++ ){
		
		var er = [ notchs[ i ].i  ];
		for( var k = notchs[ i ].link.length-1 ; k >= 0 ; k -- ){
			var l = notchs[ i ].link[ k ];
			if( l != ( er[ 0 ] -1 + polygon.length ) % polygon.length || each_order[ l ] != order )
				break;	
			var e = polygon[ l ];
			if( er.length > 2 ){
			
				// if we add e to the stack, does it stiff form a convex polygon
				// check for the convexity of the new coner
				var a  = polygon[ er[ 0 ] ],								// corner next
					b  = polygon[ er[ 1 ] ];
				var det = ( a.x - b.x ) * ( e.y - b.y ) + ( b.y - a.y ) * ( e.x - b.x );
				if( det > 0 != order )
					break;
					
				var a  =  polygon[ er[ ( er.length-2 + er.length )% er.length ] ],		// corner prev
					b  =  polygon[ er[ ( er.length-1 + er.length )% er.length ] ];
				var det = ( e.x - a.x ) * ( b.y - a.y ) + ( a.y - e.y ) * ( b.x - a.x );
				if( det > 0 != order )
					break;
					
				var a  =  polygon[ er[ ( er.length-1 + er.length )% er.length ] ],		// corner new 
					b  =  polygon[ er[ 0 ] ];
				var det = ( a.x - e.x ) * ( b.y - e.y ) + ( e.y - a.y ) * ( b.x - e.x );
				if( det > 0 != order )
					break;
			}
			er.unshift( l );
		}
		
		var ea = [ notchs[ i ].i  ];
		for( var k = 0 ; k < notchs[ i ].link.length ; k ++ ){
			var l = notchs[ i ].link[ k ];
			if( l != ( ea[ ea.length - 1 ] +1 ) % polygon.length || each_order[ l ] != order ) // point have to be consecutive, l have to be next ,
				break;	
			var e = polygon[ l ];
			if( ea.length > 2 ){
			
				// if we add e to the stack, does it stiff form a convex polygon
				// check for the convexity of the new coner
				var a  =  polygon[ ea[ ( ea.length-2 + ea.length )% ea.length ] ],		// corner prev
					b  =  polygon[ ea[ ( ea.length-1 + ea.length )% ea.length ] ];
				var det = ( a.x - b.x ) * ( e.y - b.y ) + ( b.y - a.y ) * ( e.x - b.x );
				if( det > 0 != order )
					break;
					
				var a  =  polygon[ ea[ 0% ea.length ] ],										// corner next
					b  =  polygon[ ea[ 1% ea.length ] ];
				var det = ( e.x - a.x ) * ( b.y - a.y ) + ( a.y - e.y ) * ( b.x - a.x );
				if( det > 0 != order )
					break;
					
				var a  =  polygon[ ea[ ( ea.length-1 + ea.length )% ea.length ] ],		// corner new 
					b  =  polygon[ ea[ 0% ea.length ] ];
				var det = ( a.x - e.x ) * ( b.y - e.y ) + ( e.y - a.y ) * ( b.x - e.x );
				if( det > 0 != order )
					break;
			}
			ea.push( l );
		}
		
		if( er.length > ea.length )
			ea = er;
		
		if( ea.length > 2 ){
			// form the dual polygon
			var dual = [];
			var next = ea[ ea.length-1 ];
			while( next != ea[ 0 ] ){
				dual.push( polygon[ next ] );
				next = ( next + 1 ) % polygon.length;
			}
			dual.push( polygon[ next ] );
			
			var stack = [];
			for( var k = 0 ; k < ea.length ; k ++ )
				stack.push( polygon[ ea[ k ] ] );
			return [ stack ].concat( cc.Polygon.splitInConvexesEars( dual ) );
			
			//return [ stack ];
		}
	}
	
	return null;
}

// intersection A1A2 et B1B2
// doesnt accept segment null
cc.Polygon.intersectionSegmentSegment = function( A1 , A2 , B1 , B2 ){
	var 
	VAx = A2.x - A1.x,
	VAy = A2.y - A1.y,
	VBx = B2.x - B1.x,
	VBy = B2.y - B1.y,
	PAx = A1.x,
	PAy = A1.y,
	PBx = B1.x,
	PBy = B1.y;
	
	if( VBy * VAx - VBx * VAy == 0 )		// colineaire
		return false;
	
	if( VBy == 0 ){				
		var ta = ( PBy - PAy )/VAy;			// VAy != 0 sinon VA VB colineaires
		if( ta < 0 || 1 < ta)
			return false;
		var tb = ((PAx-PBx)+VAx*ta)/VBx;	// VBx != 0 sinon B1 == B2
		if( tb < 0 || 1 < tb)
			return false;
		return { ta:ta , tb:tb };
	}
	if( VAx == 0 ){
		var tb = ( PAx - PBx )/VBx;	
		if( tb < 0 || 1 < tb)
			return false;
		var ta = ((PBy-PAy)+VBy*tb)/VAy;
		if( ta < 0 || 1 < ta)
			return false;
		return { ta:ta , tb:tb };
	}
	var ta = (  (( PBx - PAx )  + VBx/VBy*(PAy-PBy) )/VAx )/( 1 - VBx * VAy / VAx / VBy );
	if( ta < 0 || 1 < ta)
		return false;
	var tb = ((PAy-PBy)+VAy*ta)/VBy;
	if( tb < 0 || 1 < tb)
		return false;
	return { ta:ta , tb:tb };
	
}


