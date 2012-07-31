
var name = "watermelon";

var img_url=null;
var img_src=null;

describe(" ", function() {
	it("init ..  ", function() {
		img_url = './images/tools/anime.png'
		img_src = 'src9'
		
		
		img_url = "data:image/png;base64,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";
		
		srcMgr.addSource( "image" , img_url, img_src );
	});
});

describe("instanciation ", function() {
    it("new", function() {
	
		
		var repeat = true;
		var block = true;
		var statiq = true;
		
        var a =new Animation( name, repeat, block, statiq);
		
		expect( a.name ).toBe(  name );
		expect( a.repeat ).toBe(  repeat );
		expect( a.block ).toBe(  block );
		expect( a.statiq ).toBe(  statiq );
		
    });
});
describe("dependency ", function() {
    
	var a = null;
	
	beforeEach( function(){
		
		a = new Animation( name , true , false , false );
		
		a.objs[ "kiwi" ] = { type:"fruit" };
		a.objs[ "mandarine" ] = { type:"fruit" };
		
	});
	it("get", function() {
        
		expect( a.getDependency( "kiwi" ) ).toBe( true );
		expect( a.getDependency( "mandarine") ).toBe( true );
		expect( a.getDependency( "litchi" ) ).toBe( false );
		
    });
	it("remove", function() {
        
		a.removeDependency( "kiwi" );
		
		expect( a.getDependency( "kiwi" ) ).toBe( false );
		expect( a.getDependency( "mandarine") ).toBe( true );
		expect( a.getDependency( "litchi" ) ).toBe( false );
		
    });
	it("update", function() {
        
		a.updateSource( "kiwi" , "litchi" );
		
		expect( a.getDependency( "kiwi" ) ).toBe( false );
		expect( a.getDependency( "mandarine") ).toBe( true );
		expect( a.getDependency( "litchi" ) ).toBe( true );
		
    });
});
describe("createAnimation ", function() {
    
	var a = null;
	
	// sur la scene, pour avoir les vrai on fait config.real-
	var x , y , w , h;
	
	
	beforeEach( function(){
		
		x = 30;
		y = 50;
		w = 100;
		h = 70;
		
		a = new Animation( name , true , false , true );
		
	});
	describe("with image", function() {
		beforeEach( function(){
			
			w = 60;
			h = 60;
			
			var testPanel = $( '<div id="testPanel"/>' );
			$("body").append( testPanel );
			
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			var frame = $( '<div class="frame"><div style="position: absolute; top: '+y+'px; left: '+x+'px; width: '+w+'px; height: '+h+'px; border: 0px solid rgb(77, 77, 77); z-index: 1; "><img name="'+img_src+'" src="'+img_url+'"  style="width: 100%; height: 100%; "><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "><img src="./images/UI/config.png" style="display: none; "><img src="./images/UI/recut.png" style="display: none; "><img src="./images/UI/spritecut.png" style="display: none; "><img src="./images/UI/down.png" style="display: none; "></ul></div></div>')
			
			expoframe.data( "frame" , frame );
			
			testPanel.append( expoframe );
			
			var expos = testPanel.children();
			
			testPanel.append( frame );
			
			a.createAnimation( expos );
		});
		afterEach( function(){
			$( 'div#testPanel' ).remove();
		});
		it("object added", function() {
	        
			expect( Object.keys( a.objs ).indexOf( img_src ) ).not.toBe( -1 );
			
	    });
		it("object common param ", function() {
	        
			expect( a.frames[0].objs[ img_src ].dx ).toBe( config.realX( x ) );
			expect( a.frames[0].objs[ img_src ].dy ).toBe( config.realY( y ) );
			expect( a.frames[0].objs[ img_src ].dw ).toBe( config.realX( w ) );
			expect( a.frames[0].objs[ img_src ].dh ).toBe( config.realY( h ) );
		});
		it("object param ", function() {
	        
			expect( a.frames[0].objs[ img_src ].sx ).toBe( 0 );
			expect( a.frames[0].objs[ img_src ].sy ).toBe( 0 );
			expect( a.frames[0].objs[ img_src ].sw ).toBe( w );
			expect( a.frames[0].objs[ img_src ].sh ).toBe( h );
			
			expect( a.frames[0].objs[ img_src ].w ).toBe( 60 );
			expect( a.frames[0].objs[ img_src ].h ).toBe( 60 );
			
			expect( a.objs[ img_src ].type  ).toBe( "image" );
			
	    });
	} );
	describe("with image resized ( spriteRecut ) ", function() {
		
		beforeEach( function(){
			
			var testPanel = $( '<div id="testPanel"/>' );
			$("body").append( testPanel );
			
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			var frame = $( '<div class="frame"><div style="position: absolute; top: '+y+'px; left: '+x+'px; width: '+w+'px; height: '+h+'px; border: 0px solid rgb(77, 77, 77); z-index: 1; "><img name="'+img_src+'" src="'+img_url+'"  style="width: 200%; height: 200%; position: relative; left: -50%; top: -50%; "><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "><img src="./images/UI/config.png" style="display: none; "><img src="./images/UI/recut.png" style="display: none; "><img src="./images/UI/spritecut.png" style="display: none; "><img src="./images/UI/down.png" style="display: none; "></ul></div></div>')
			
			expoframe.data( "frame" , frame );
			
			testPanel.append( expoframe );
			
			var expos = testPanel.children();
			
			testPanel.append( frame );
			
			a.createAnimation( expos );
		});
		afterEach( function(){
			$( 'div#testPanel' ).remove();
		});
		it("object added", function() {
	        
			expect( Object.keys( a.objs ).indexOf( img_src ) ).not.toBe( -1 );
			
	    });
		it("object common param ", function() {
	        
			expect( a.frames[0].objs[ img_src ].dx ).toBe( config.realX( x ) );
			expect( a.frames[0].objs[ img_src ].dy ).toBe( config.realY( y ) );
			expect( a.frames[0].objs[ img_src ].dw ).toBe( config.realX( w ) );
			expect( a.frames[0].objs[ img_src ].dh ).toBe( config.realY( h ) );
		});
		it("object param ", function() {
	        
			expect( a.frames[0].objs[ img_src ].sx ).toBe( 15 );
			expect( a.frames[0].objs[ img_src ].sy ).toBe( 15 );
			expect( a.frames[0].objs[ img_src ].sw ).toBe( 30 );
			expect( a.frames[0].objs[ img_src ].sh ).toBe( 30 );
			expect( a.frames[0].objs[ img_src ].w ).toBe( 60 );
			expect( a.frames[0].objs[ img_src ].h ).toBe( 60 );
			
			expect( a.objs[ img_src ].type  ).toBe( "spriteRecut" );
			
	    });
	} );
	describe("with sprite", function() {
		beforeEach( function(){
			
			var testPanel = $( '<div id="testPanel"/>' );
			$("body").append( testPanel );
			
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			
			var frame = $( '<div class="frame"><div style="position: absolute; top: '+y+'px; left: '+x+'px; width: '+w+'px; height: '+h+'px; border: 0px solid rgb(77, 77, 77); z-index: 1; overflow: hidden; " ><img name="'+img_src+'" src="'+img_url+'"  style="width: 200%; height: 200%; position: relative; left: 0%; top: -100%; "><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "><img src="./images/UI/config.png" style="display: none; "><img src="./images/UI/spritecut.png" style="display: none; "><img src="./images/UI/down.png" style="display: none; "></ul></div></div>')

			expoframe.data( "frame" , frame );
			
			expoframe.data( "frame" ).find( "img" ).data( "fr" , 2 );
			expoframe.data( "frame" ).find( "img" ).data( "frw" , 30 );
			expoframe.data( "frame" ).find( "img" ).data( "frh" , 30 );
			expoframe.data( "frame" ).find( "img" ).data( "col" , 2 );
			expoframe.data( "frame" ).find( "img" ).data( "row" , 2 );
			
			
			testPanel.append( expoframe );
			
			var expos = testPanel.children();
			
			testPanel.append( frame );
			
			a.createAnimation( expos );
		});
		afterEach( function(){
			$( 'div#testPanel' ).remove();
		});
		it("object added", function() {
	        
			expect( Object.keys( a.objs ).indexOf( img_src ) ).not.toBe( -1 );
			
	    });
		it("object common param ", function() {
	        
			expect( a.frames[0].objs[ img_src ].dx ).toBe( config.realX( x ) );
			expect( a.frames[0].objs[ img_src ].dy ).toBe( config.realY( y ) );
			expect( a.frames[0].objs[ img_src ].dw ).toBe( config.realX( w ) );
			expect( a.frames[0].objs[ img_src ].dh ).toBe( config.realY( h ) );
		});
		it("object param ", function() {
	        
			expect( a.objs[ img_src ].type  ).toBe( "sprite" );
			
			expect( a.objs[ img_src ].frw  ).toBe( 30 );
			expect( a.objs[ img_src ].frh  ).toBe( 30 );
			expect( a.objs[ img_src ].col  ).toBe( 2 );
			expect( a.objs[ img_src ].row  ).toBe( 2 );
	    });
	} );
	describe("with rect", function() {
		beforeEach( function(){
			
			var testPanel = $( '<div id="testPanel"/>' );
			$("body").append( testPanel );
			
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			
			var frame = $( '<div class="frame"><div id="objrectx" class="rect" style="position: absolute; top: '+y+'px; left: '+x+'px; width: '+w+'px; height: '+h+'px; background-color: rgb(0, 0, 0); opacity: 1; border-color: rgb(0, 0, 0); border-width: 0px; z-index: 1; background-position: initial initial; background-repeat: initial initial;  " ><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "><img src="./images/UI/config.png" style="display: none; "><img src="./images/UI/spritecut.png" style="display: none; "><img src="./images/UI/down.png" style="display: none; "></ul></div></div>')
			
			expoframe.data( "frame" , frame );
			
			testPanel.append( expoframe );
			
			var expos = testPanel.children();
			
			testPanel.append( frame );
			
			a.createAnimation( expos );
		});
		afterEach( function(){
			$( 'div#testPanel' ).remove();
		});
		it("object added", function() {
	        
			expect( Object.keys( a.objs ).indexOf( "objrectx" ) ).not.toBe( -1 );
			
	    });
		it("object common param ", function() {
	        
			expect( a.frames[0].objs[ "objrectx" ].dx ).toBe( config.realX( x ) );
			expect( a.frames[0].objs[ "objrectx" ].dy ).toBe( config.realY( y ) );
			expect( a.frames[0].objs[ "objrectx" ].dw ).toBe( config.realX( w ) );
			expect( a.frames[0].objs[ "objrectx" ].dh ).toBe( config.realY( h ) );
		});
		it("object param ", function() {
	        
			expect( a.objs[ "objrectx" ].type  ).toBe( "rect" );
			
			
	    });
	} );
	describe("with text", function() {
		beforeEach( function(){
			
			var testPanel = $( '<div id="testPanel"/>' );
			$("body").append( testPanel );
			
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			var frame = $( '<div class="frame"><div id="objrectx" style="position: absolute; top: '+y+'px; left: '+x+'px; width: '+w+'px; height: '+h+'px; font-size: 13px; font-family: monospace; font-weight: normal; text-align: left; color: rgb(0, 0, 0); z-index: 1;  " ><p>helloW</p><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "><img src="./images/UI/config.png" style="display: none; "><img src="./images/UI/spritecut.png" style="display: none; "><img src="./images/UI/down.png" style="display: none; "></ul></div></div>')
			
			expoframe.data( "frame" , frame );
			
			testPanel.append( expoframe );
			
			var expos = testPanel.children();
			
			testPanel.append( frame );
			
			a.createAnimation( expos );
		});
		afterEach( function(){
			$( 'div#testPanel' ).remove();
		});
		it("object added", function() {
	        
			expect( Object.keys( a.objs ).indexOf( "objrectx" ) ).not.toBe( -1 );
			
	    });
		it("object common param ", function() {
	        
			expect( a.frames[0].objs[ "objrectx" ].dx ).toBe( config.realX( x ) );
			expect( a.frames[0].objs[ "objrectx" ].dy ).toBe( config.realY( y ) );
			expect( a.frames[0].objs[ "objrectx" ].dw ).toBe( config.realX( w ) );
			expect( a.frames[0].objs[ "objrectx" ].dh ).toBe( config.realY( h ) );
		});
		it("object param ", function() {
	        
			expect( a.objs[ "objrectx" ].type  ).toBe( "text" );
			expect( a.objs[ "objrectx" ].content  ).toBe( "helloW" );
			
			expect( a.frames[0].objs[ "objrectx" ].font  ).toBe( "monospace" );
			expect( a.frames[0].objs[ "objrectx" ].fonts  ).toBe( parseInt( config.realY( 13 ) ) );
			expect( a.frames[0].objs[ "objrectx" ].fontw  ).toBe( "normal" );
			
	    });
	} );
	describe("transition ", function() {
		it( "interval" , function(){
			var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			var frame = $( '<div class="frame"></div>' );
			
			expoframe.data( "frame" , frame );
			
			var expos = $("<div/>").append(expoframe).children();
			
			a.createAnimation( expos );
			
			expect( a.frames[0].interval  ).toBe( 0.5 );

		} );
		it("default ( undefined )", function() {
	        var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			var frame = $( '<div class="frame"></div>' );
			
			expoframe.data( "frame" , frame );
			
			var expos = $("<div/>").append(expoframe).children();
			
			a.createAnimation( expos );
			
			expect( !a.frames[0].trans.pos  ).toBe( true );
			expect( !a.frames[0].trans.size ).toBe( true );
			expect( !a.frames[0].trans.opac ).toBe( true );
			expect( !a.frames[0].trans.font ).toBe( true );
			
	    });
		it("homogene ( 2 ) ", function() {
	        var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			expoframe.find( "div.motion" ).data( "pos"  , 2 );
			expoframe.find( "div.motion" ).data( "size" , 2 );
			expoframe.find( "div.motion" ).data( "font" , 2 );
			expoframe.find( "div.motion" ).data( "opac" , 2 );
			
			var frame = $( '<div class="frame"></div>' );
			
			expoframe.data( "frame" , frame );
			
			var expos = $("<div/>").append(expoframe).children();
			
			a.createAnimation( expos );
			
			expect( a.frames[0].trans.pos  ).toBe( 2 );
			expect( a.frames[0].trans.size ).toBe( 2 );
			expect( a.frames[0].trans.opac ).toBe( 2 );
			expect( a.frames[0].trans.font ).toBe( 2 );
	    });
		it("none ( 1 ) ", function() {
	        var expoframe = $( '<div class="frameexpo"><h4>Frame</h4><h5>durée: <span>0.5</span>s</h5><div class="motion"></div><ul class="del_container"><img src="./images/UI/del.png" style="display: none; "></ul></div>' );
			
			expoframe.find( "div.motion" ).data( "pos"  , 1 );
			expoframe.find( "div.motion" ).data( "size" , 1 );
			expoframe.find( "div.motion" ).data( "font" , 1 );
			expoframe.find( "div.motion" ).data( "opac" , 1 );
			
			var frame = $( '<div class="frame"></div>' );
			
			expoframe.data( "frame" , frame );
			
			var expos = $("<div/>").append(expoframe).children();
			
			a.createAnimation( expos );
			
			expect( a.frames[0].trans.pos  ).toBe( 1 );
			expect( a.frames[0].trans.size ).toBe( 1 );
			expect( a.frames[0].trans.opac ).toBe( 1 );
			expect( a.frames[0].trans.font ).toBe( 1 );
	    });
	} );
});
describe("showAnimeOnEditor ", function() {
    
	var a = null;
	
	// sur la scene, pour avoir les vrai on fait config.real-
	var x , y , w , h;
	
	
	beforeEach( function(){
		
		x = 30;
		y = 50;
		w = 100;
		h = 70;
		
		a = new Animation( name , true , false , true );
		
	});
	describe("with image", function() {
		beforeEach( function(){
			
			w = 175;
			h = 175;
			
			a.objs[ img_src ] = { type : "image" };
			
			a.frames = [ { objs : {} , trans : {} } ];
			
			a.frames[0].objs[ img_src ] = {
				dx : config.realX( x ),
				dy : config.realY( y ),
				dw : config.realX( w ),
				dh : config.realY( h ),
				sx : 0,
				sy : 0,
				opacity : 1,
				sw : w,
				sh : h
			}
			
			a.showAnimeOnEditor();
		});
		afterEach( function(){
			animeTool.close();
		});
		it(" validity", function() {
			var container = $('#editor').find('div#'+img_src);
			
			expect( container.children( "img" ).length ).not.toBe( 0 );
			expect( container.children( "img" ).attr("name") ).toBe( img_src );
			expect( container.children( "img" ).attr("src") ).toBe( img_url );
			expect( container.children( "img" ).width() ).toBe( container.width() );
			expect( container.children( "img" ).height()).toBe( container.height() );	
	    });
		it(" validity common", function() {
			var container = $('#editor').find('div#'+img_src);
			
			expect( container.position().left ).toBe( x );
			expect( container.position().top ).toBe( y );
			expect( container.width()  ).toBe( w );
			expect( container.height() ).toBe( h );
	    });
	} );
	describe("with image resized ( spriteRecut )", function() {
		beforeEach( function(){
			
			a.objs[ img_src ] = { type : "spriteRecut" };
			
			a.frames = [ { objs : {} , trans : {} } ];
			
			a.frames[0].objs[ img_src ] = {
				dx : config.realX( x ),
				dy : config.realY( y ),
				dw : config.realX( w ),
				dh : config.realY( h ),
				w : 60,
				h : 60,
				sx : 15,
				sy : 15,
				opacity : 1,
				sw : 30,
				sh : 30
			}
			
			a.showAnimeOnEditor();
		});
		afterEach( function(){
			animeTool.close();
		});
		it(" validity", function() {
	        
			var container = $('#editor').find('div#'+img_src);
			
			expect( container.children( "img" ).length ).not.toBe( 0 );
			expect( container.children( "img" ).attr("name") ).toBe( img_src );
			expect( container.children( "img" ).attr("src") ).toBe( img_url );
			expect( 	container.children( "img" ).css( "width" ) == "200%"
					||  container.children( "img" ).width() == 2 * container.width()
						).toBe( true );
			expect( 	container.children( "img" ).css( "height" ) == "200%"
					||  container.children( "img" ).height() == 2 * container.height()
						).toBe( true );
			expect( container.children( "img" ).css("position") ).toBe( "relative" );
			expect( container.children( "img" ).css("top") ).toBe( "-25%" );
			expect( container.children( "img" ).css("left") ).toBe( "-25%" );
			
	    });
		it(" validity common", function() {
			var container = $('#editor').find('div#'+img_src);
			
			expect( container.position().left ).toBe( x );
			expect( container.position().top ).toBe( y );
			expect( container.width()  ).toBe( w );
			expect( container.height() ).toBe( h );
	    });
		
	});
	describe("with sprite ", function() {
		beforeEach( function(){
			
			a.objs[ img_src ] = { type : "sprite" , row : 2 , col : 2 , frw : 30 , frh : 30 };
			
			a.frames = [ { objs : { } , trans : {} } ];
			
			a.frames[0].objs[ img_src ] = {
				dx : config.realX( x ),
				dy : config.realY( y ),
				dw : config.realX( w ),
				dh : config.realY( h ),
				w : 60,
				h : 60,
				sx : 15,
				sy : 15,
				opacity : 1,
				sw : 30,
				sh : 30,
				fr : 2
			}
			
			a.showAnimeOnEditor();
		});
		afterEach( function(){
			animeTool.close();
		});
		it(" validity", function() {
	        
			var container = $('#editor').find('div#'+img_src);
			
			var frw = a.objs[ img_src ].frw,
				frh = a.objs[ img_src ].frh,
				row = a.objs[ img_src ].row,
				col = a.objs[ img_src ].col;
				fr = a.frames[0].objs[ img_src ].fr;
			
			var offx = frw * (fr%col);
            var offy = frh * Math.floor(fr/col);
			
			
			expect( container.children( "img" ).length ).not.toBe( 0 );
			expect( container.children( "img" ).attr("name") ).toBe( img_src );
			expect( container.children( "img" ).attr("src") ).toBe( img_url );
			expect( 	container.children( "img" ).css( "width" ) == (100*col)+"%"
					||  container.children( "img" ).width() == (col * container.width())
						).toBe( true );
			expect( 	container.children( "img" ).css( "height" ) == (100*row)+"%"
					||  container.children( "img" ).height() == (row * container.height())
						).toBe( true );
			expect( container.children( "img" ).css("position") ).toBe( "relative" );
			expect( container.children( "img" ).css("top") ).toBe( (-100*offy/frh)+"%" );
			expect( container.children( "img" ).css("left") ).toBe((-100*offx/frw)+"%" );
			
	    });
		it(" validity common", function() {
			var container = $('#editor').find('div#'+img_src);
			
			expect( container.position().left ).toBe( x );
			expect( container.position().top ).toBe( y );
			expect( container.width()  ).toBe( w );
			expect( container.height() ).toBe( h );
	    });
		
	});
	describe("with rect ", function() {
		
		var id = "objIdx";
		
		beforeEach( function(){
			
			a.objs[ id ] = { type : "rect"  };
			
			a.frames = [ { objs : { } , trans : {} } ];
			
			a.frames[0].objs[ id ] = {
				dx : config.realX( x ),
				dy : config.realY( y ),
				dw : config.realX( w ),
				dh : config.realY( h ),
				opacity : 1
			}
			
			a.showAnimeOnEditor();
		});
		afterEach( function(){
			animeTool.close();
		});
		it(" validity ", function() {
			var container = $('#editor').find('div#'+id);
			
			expect( container.hasClass("rect") ).toBe( true );
			
	    });
		it(" validity common", function() {
			var container = $('#editor').find('div#'+id);
			
			expect( container.position().left ).toBe( x );
			expect( container.position().top ).toBe( y );
			expect( container.width()  ).toBe( w );
			expect( container.height() ).toBe( h );
	    });
		
	});
	describe("with text ", function() {
		
		var id = "objIdx";
		
		beforeEach( function(){
			
			a.objs[ id ] = { type : "text" , content : "gelloW" , align : "auto"  };
			
			a.frames = [ { objs : { } , trans : {} } ];
			
			a.frames[0].objs[ id ] = {
				dx : config.realX( x ),
				dy : config.realY( y ),
				dw : config.realX( w ),
				dh : config.realY( h ),
				opacity : 1
			}
			
			a.showAnimeOnEditor();
		});
		afterEach( function(){
			animeTool.close();
		});
		it(" validity ", function() {
			var container = $('#editor').find('div#'+id);
			
			expect( container.children("p").length ).toBe( 1 );
			expect( container.children("p").text() ).toBe( "gelloW" );
	    });
		it(" validity common", function() {
			var container = $('#editor').find('div#'+id);
			
			expect( container.position().left ).toBe( x );
			expect( container.position().top ).toBe( y );
			expect( container.width()  ).toBe( w );
			expect( container.height() ).toBe( h );
	    });
		
	});
});
describe("addFrame ", function() {
	var a = null;
	
	// sur la scene, pour avoir les vrai on fait config.real-
	var x , y , w , h;
	
	var id1 = "objIdx";
	var id2 = "objIdxx";
	
	beforeEach( function(){
		
		x = 30;
		y = 50;
		w = 100;
		h = 70;
		
		a = new Animation( name , true , false , true );
		
		a.objs[ img_src ] = { type : "image" };
		a.objs[ id1 ] = { type : "text" , content : "helloW" , align: "auto" };
		a.objs[ id2 ] = { type : "rect" };
			
		a.frames = [ { objs : {} , trans : {} } ];
		
		a.frames[0].objs[ id1 ] = {
			dx : 3,
			dy : 58,
			dw : 13,
			dh : 98,
			opacity : 1
		}
		a.frames[0].objs[ id1 ] = {
			dx : 32,
			dy : 12,
			dw : 85,
			dh : 12,
			opacity : 1
		}
		a.frames[0].objs[ img_src ] = {
			dx : 41,
			dy : 4,
			dw : 20,
			dh : 10,
			sx : 0,
			sy : 0,
			opacity : 1,
			sw : 13,
			sh : 45,
			opacity : 1
		}
		
		a.showAnimeOnEditor();
			
		animeTool.addFrame( 0.5 );
		
	});
	afterEach( function(){
		animeTool.close();
	});
	it(" frame added", function() {
		expect(  $('#editor').find('div.frame').length ).toBe( 2 );
	});
	it(" content added from prev frame", function() {
		var prev = $( $('#editor').find('div.frame').get(0) );
		var curr = $( $('#editor').find('div.frame').get(1) );
		
		var pcont = prev.children();
		
		for( var i = 0 ; i < pcont.length ; i ++ ){
			var elem = $( pcont[ i ] );
			var id = elem.attr( "id" );
			if( id ){
				expect( curr.children("#"+id).length > 0 ).toBe( true );
				expect( curr.children("#"+id).hasClass( "rect" ) == elem.hasClass( "rect" ) ).toBe( true );
				
				expect( curr.children("#"+id).position().top ).toBe( elem.position().top );
				expect( curr.children("#"+id).position().left ).toBe( elem.position().left );
				expect( curr.children("#"+id).width() ).toBe( elem.width() );
				expect( curr.children("#"+id).height() ).toBe( elem.height() );
				
				continue;
			}else
			if( elem.children("img").length > 0 ){
				var name = elem.children("img").attr("name");
				expect( curr.children("img[name="+name+"]").length > 0 ).toBe( true );
				
				expect( curr.children("img[name="+name+"]").parent().position().top ).toBe( elem.position().top );
				expect( curr.children("img[name="+name+"]").parent().position().left ).toBe( elem.position().left );
				expect( curr.children("img[name="+name+"]").parent().width() ).toBe( elem.width() );
				expect( curr.children("img[name="+name+"]").parent().height() ).toBe( elem.height() );
				
				continue;
			} else
				expect( false  ).toBe( true );
		}
	});
});
describe("delFrame ", function() {
	var a = null;
	
	// sur la scene, pour avoir les vrai on fait config.real-
	var x , y , w , h;
	
	var id1 = "objIdx";
	var id2 = "objIdxx";
	
	beforeEach( function(){
		
		x = 30;
		y = 50;
		w = 100;
		h = 70;
		
		a = new Animation( name , true , false , true );
		
		a.frames = [ { objs : {} , trans : {} } ];
		
		a.showAnimeOnEditor();
			
		animeTool.addFrame( 0.5 );
		animeTool.addFrame( 0.5 );
		
		
		$( $('#timeline').find('div.frameexpo').get(0) ).children(".del_container").children("img").click();
		
		
	});
	afterEach( function(){
		animeTool.close();
	});
	it(" frame del", function() {
		expect(  $('#editor').find('div.frame').length ).toBe( 2 );
	});
});
describe("showFrame ", function() {
	var a = null;
	beforeEach( function(){
		
		a = new Animation( name , true , false , true );
		
		a.frames = [ { objs : {} , trans : {} } ];
		
		a.showAnimeOnEditor();
			
		animeTool.addFrame( 0.5 );
		animeTool.addFrame( 0.5 );
		animeTool.addFrame( 0.5 );
		
		var frame = $( $('#editor').find('div.frame').get( 1 ) );
		
		animeTool.showFrame( frame );
		
	});
	afterEach( function(){
		animeTool.close();
	});
	it(" frame actived", function() {
		
		var s = $('#editor').find('div.frame'); 
		for ( var i = 0 ; i < s.length ; i ++ )
			if( i == 1 ){
				expect(  $( $('#editor').find('div.frame').get( i ) ).css("z-index") ).toBe( "2" );
				expect(  $( $('#editor').find('div.frame').get( i ) ).hasClass("active") ).toBe( true );
			} else {
				expect(  $( $('#editor').find('div.frame').get( i ) ).css("z-index") ).toBe( "1" );
				expect(  $( $('#editor').find('div.frame').get( i ) ).hasClass("active") ).toBe( false );
			}
	});
});
describe("transSetup ", function() {
	var a = null;
	beforeEach( function(){
		
		a = new Animation( name , true , false , true );
		
		a.frames = [ { objs : {} , trans : {} } ];
		
	});
	afterEach( function(){
		animeTool.close();
	});
	describe("instanciation default ", function() {
		beforeEach( function(){
		
			a.showAnimeOnEditor();
		
			var motion = $('#timeline').find('div.frameexpo').children( ".motion" );
			
			animeTool.transSetup.call( motion , { preventDefault : function(){} , stopPropagation: function(){} , target : motion  } );
		});
		afterEach( function(){
			dialog.close()
		});
		it("field validity", function() {
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "2" );
			});
		});
		it(" check after save", function() {
		
			a.frames[0].trans = { };
			
			dialog.confirm.click();
			
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "2" );
			});
		});
	});
	describe("instanciation homogène ", function() {
		beforeEach( function(){
		
			a.frames[0].trans = { pos:2 , size:2,font:2,opac:2 };
			
			a.showAnimeOnEditor();
		
			var motion = $('#timeline').find('div.frameexpo').children( ".motion" );
			
			animeTool.transSetup.call( motion , { preventDefault : function(){} , stopPropagation: function(){} , target : motion  } );
		});
		afterEach( function(){
			dialog.close()
		});
		it(" field validity", function() {
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "2" );
			});
		});
		it(" check after save", function() {
		
			a.frames[0].trans = { };
			
			dialog.confirm.click();
			
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "2" );
			});
		});
	});
	describe("instanciation none ", function() {
		beforeEach( function(){
			
			a.frames[0].trans = { pos:1 , size:1,font:1,opac:1 };
			
			a.showAnimeOnEditor();
			
			var motion = $('#timeline').find('div.frameexpo').children( ".motion" );
			
			animeTool.transSetup.call( motion , { preventDefault : function(){} , stopPropagation: function(){} , target : motion  } );
		
		});
		afterEach( function(){
			dialog.close()
		});
		it(" field validity", function() {
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "1" );
			});
		});
		it(" check after save", function() {
		
			a.frames[0].trans = { };
			
			dialog.confirm.click();
			
			$("#popup_dialog").find("select").each(function(){
				expect( $(this).val() ).toBe( "1" );
			});
		});
	});
});
	


