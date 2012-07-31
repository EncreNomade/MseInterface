describe("Create textArea ", function() {
	beforeEach( function(){
		var e = { 
			target : textTool.editor.get(0)
		}
		textTool.createTextArea( e );
	});
	afterEach( function(){
		textTool.editor.children().remove();
	});
	it("click event binded", function() {
		spyOn( textTool , "createTextArea" );
        textTool.editor.click();
		
		 expect( textTool.createTextArea  ).toHaveBeenCalled();
    });
    it("textArea added", function() {
		expect( !textTool.editing  ).toBe( false );
        expect(textTool.editing.children('textarea').length  ).toBe( 1 );
    });
	it("two textArea added", function() {
		var e = { 
			target : textTool.editor.get(0)
		}
		
		textTool.editing.children('textarea').val("one");
		
		textTool.createTextArea( e );
		
		expect( !textTool.editing  ).toBe( false );
        expect(textTool.editor.children().length  ).toBe( 2 );
    });
	it("editing field follow the focus ( on creation )", function() {
		var e = { 
			target : textTool.editor.get(0)
		}
		
		textTool.editing.children('textarea').text("one");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("two");
		textTool.createTextArea( e );
		
		expect( !textTool.editing  ).toBe( false );
        expect( textTool.editor.children().length  ).toBe( 3 );
        expect( textTool.editing.children('textarea').val()  ).toBe( "" );
    });
	it("editing field follow the focus ( on click )", function() {
		var e = { 
			target : textTool.editor.get(0)
		}
		
		textTool.editing.children('textarea').text("one");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("two");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("three");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("four");
		
		var called = $( textTool.editor.children().get( 1 ) );
		
		called.click();
		
		expect( !textTool.editing  ).toBe( false );
        expect( textTool.editing.children('textarea').val()  ).toBe( called.children('textarea').val() );
    });
});

describe("configChanged", function() {
	beforeEach( function(){
		var e = { 
			target : textTool.editor.get(0)
		}
		textTool.editing.children('textarea').text("one");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("two");
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("three");
		textTool.createTextArea( e );
	});
	afterEach( function(){
		textTool.editor.children().remove();
	});
	it("changes validity", function() {
		
		
		var tc = "#452311";
		var tf = "Arial";
		var ts = 13;
		var tss = "bold";
		var ta = "right";
		
		$('#text_color').val( tc );
		$('#text_font' ).val( tf );
		$('#text_size' ).val( ts );
		$('#text_style').val( tss );
		$('#text_align').val( ta );
		
		textTool.configChanged();
		
		expect( textTool.editing.children('textarea').css('text-align')  ).toBe( ta );
		expect( textTool.editing.children('textarea').css('font-size')  ).toBe( config.sceneY(ts)+'px' );
		expect( textTool.editing.children('textarea').css('font-weight')  ).toBe( tss );
		expect( textTool.editing.children('textarea').css('font-family')  ).toBe( tf );

    });
});
describe("finishEdit", function() {
	beforeEach( function(){
		var e = { 
			target : textTool.editor.get(0)
		}
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("one");
		
	});
	afterEach( function(){
		textTool.editor.children().remove();
	});
	it("append", function() {
		var e = { 
			target : textTool.editor.get(0)
		}
		
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("two");
		
		textTool.createTextArea( e );
		textTool.editing.children('textarea').text("three");
		
		var tar = $("<div/>");
		
		var elems = textTool.editor.children();
		
		textTool.finishEdit( elems , tar );
		
		expect( tar.children().length  ).toBe( 3 );

    });
	it("correct css", function() {
		
		var tc = "#452311";
		var tf = "Arial";
		var ts = 13;
		var tss = "bold";
		var ta = "right";
		
		$('#text_color').val( tc );
		$('#text_font' ).val( tf );
		$('#text_size' ).val( ts );
		$('#text_style').val( tss );
		$('#text_align').val( ta );
		
		textTool.configChanged();
		
		var tar = $("<div/>");
		
		var elems = textTool.editor.children();
		
		textTool.finishEdit( elems , tar );
		
		
		expect( tar.children().css('text-align')  ).toBe( ta );
		expect( tar.children().css('font-size')  ).toBe( config.sceneY(ts)+'px' );
		expect( tar.children().css('font-weight')  ).toBe( tss );
		expect( tar.children().css('font-family')  ).toBe( tf );
    });
});