describe("draw rectangle ", function() {
	var x = 50;
	var y = 70;
	var h = 20;
	var w = 24;
	beforeEach( function(){
		
		x = 50;
		y = 70;
		h = 20;
		w = 24;
		
		shapeTool.active();
		
		var e = { 
			clientX : x + shapeTool.editor.offset().left,
			clientY : y + shapeTool.editor.offset().top
			
		}
		shapeTool.startDraw( e );
		
		var e = { 
			clientX : x + w + shapeTool.editor.offset().left,
			clientY : y + h + shapeTool.editor.offset().top 
		}
		shapeTool.drawing( e );
		shapeTool.cancelDraw( e );
	});
	afterEach( function(){
		shapeTool.close();
	});
	it("appear on editor", function() {
		expect( shapeTool.editor.children(".rect").length ).toBe( 1 );
    });
	it("with correct css ( position )", function() {
		expect( shapeTool.editor.children(".rect").position().left ).toBe( x );
		expect( shapeTool.editor.children(".rect").position().top ).toBe( y );
		expect( shapeTool.editor.children(".rect").width() ).toBe( w );
		expect( shapeTool.editor.children(".rect").height() ).toBe( h );
    });
});
describe("finishEdit", function() {
	var x = 50;
	var y = 70;
	var h = 20;
	var w = 24;
	beforeEach( function(){
		
		x = 50;
		y = 70;
		h = 20;
		w = 24;
		
		shapeTool.active();
		
		var e = { 
			clientX : x + shapeTool.editor.offset().left,
			clientY : y + shapeTool.editor.offset().top
			
		}
		shapeTool.startDraw( e );
		
		var e = { 
			clientX : x + w + shapeTool.editor.offset().left,
			clientY : y + h + shapeTool.editor.offset().top 
		}
		shapeTool.drawing( e );
		shapeTool.cancelDraw( e );
	});
	afterEach( function(){
		shapeTool.close();
	});
	it("append", function() {
		
		var tar = $("<div/>");
		
		
		var e = { 
			clientX : x + shapeTool.editor.offset().left,
			clientY : y + shapeTool.editor.offset().top
			
		}
		shapeTool.startDraw( e );
		var e = { 
			clientX : x + w + shapeTool.editor.offset().left,
			clientY : y + h + shapeTool.editor.offset().top 
		}
		shapeTool.drawing( e );
		shapeTool.cancelDraw( e );
		
		
		var elems = shapeTool.editor.children();
		
		shapeTool.finishEdit( elems , tar );
		
		expect( tar.children().length  ).toBe( 2 );

    });
	it("correct css", function() {
		
		var tar = $("<div/>");
		
		var elems = shapeTool.editor.children();
		
		shapeTool.finishEdit( elems , tar );
		
		$("body").append( tar );
		
		expect( tar.children(".rect").position().left ).toBe( x );
		expect( tar.children(".rect").position().top ).toBe( y );
		expect( tar.children(".rect").width() ).toBe( w );
		expect( tar.children(".rect").height() ).toBe( h );
		
		tar.remove();
    });
});
