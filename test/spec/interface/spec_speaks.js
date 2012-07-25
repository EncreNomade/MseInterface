
describe(" Class Speaker | ", function() {

	beforeEach(function() {
		// found all the speaker
		var sources = srcMgr.sources;
		speaker = [];
		for( var i = 0 ; i < sources.length; i ++ )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
	});
	
});

describe("ModifySpeakMoodCmd | ", function() {
	
	// going to run test on the article IN THE LAYER NAMED CONTENT
	
	var savePJ;
	var parent;
	var article;
	var src_img;
	beforeEach(function() {
	
		article = $("div.layer#content");
		savePj = article.clone();
		parent = article.parent();
		CommandMgr.reset();
		
		
		var sources = srcMgr.sources;
		// found a src image
		for( var i in sources )
			if( sources[ i ].type == "image" ){
				src_img = i;
				break;
			}
		// found all the speaker
		speaker = [];
		for( var i in sources )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
				
		// verification sur le neutre
		for( var k = 0 ; k < speaker.length ; k ++ )
			if( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) == -1 )
				speaker[ k ].portrait.neutre = null;
		
	});
	afterEach(function() {
		article.remove();
		parent.append( savePj );
		CommandMgr.reset();
	});
	
	  it("modifyMood execute on one speak", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < 1 ; k ++ ){
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe( srcMgr.getSource( src_img ) );
			expect( speak.attr( "data-mood" ) ).toBe("banane"+arr[ k ].id);
		}
		/*
		var sources = srcMgr.sources;
		var who = speak.attr( "data-mood" );
		var dataSpeak = null;
		for( var i = 0 ; i < sources.length; i ++ )
			if( sources[ i ].type == "speaker" && sources[ i ].data.name == who ){
				dataSpeak = sources[ i ].data;
				break;
			}
		
		//pick a mood
		var newMood = Object.keys( dataSpeak.portrait )[ Math.floor( Object.keys( dataSpeak.portrait ).length * 0.5 ) ];
		*/
	  });
	  it("modifyMood execute undo on one speak", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < 1 ; k ++ ){ 			// attention a ne pas caper la limite de commande ( qui est inexistante )
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe(arr[ k ].s);
			expect( speak.attr( "data-mood" ) ).toBe(arr[ k ].m);
		}
	  });
	  it("modifyMood execute undo redo on one speak", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < 1 ; k ++ ){ 			// attention a ne pas caper la limite de commande ( qui est inexistante )
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
			
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe( srcMgr.getSource( src_img ) );
			expect( speak.attr( "data-mood" ) ).toBe("banane"+arr[ k ].id);
		}
	  });
	  it("modifyMood execute on all speaks ", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < Math.min( speaks.length , 30 ) ; k ++ ){ 			// attention a ne pas caper la limite de commande ( qui est inexistante )
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe( srcMgr.getSource( src_img ) );
			expect( speak.attr( "data-mood" ) ).toBe("banane"+arr[ k ].id);
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  it("modifyMood execute undo on all speaks ", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < Math.min( speaks.length , 30 ) ; k ++ ){ 			// attention a ne pas caper la limite de commande ( qui est inexistante )
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe(arr[ k ].s);
			expect( speak.attr( "data-mood" ) ).toBe(arr[ k ].m);
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  it("modifyMood execute undo redo on all speaks ", function() {
		
		var speaks = $( article ).find( "div.speaker" );
		
		
		var arr = [];
		
		for( var k = 0 ; k < Math.min( speaks.length , 30 ) ; k ++ ){ 			// attention a ne pas caper la limite de commande ( qui est inexistante )
			var speak = $( speaks[ k ] );
			var oldM = speak.attr( "data-mood" );
			var id = speak.attr( "id" );
			var oldS = speak.children("img").attr( "src" );
			var cmd = new ModifySpeakMoodCmd( speak , "banane"+id , srcMgr.getSource( src_img ) );
			arr.push( { id : id ,
						m : oldM ,
						s : oldS ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
			
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			var speak = $( "#"+arr[ k ].id );
			
			expect( speak.children("img").attr( "src" ) ).toBe( srcMgr.getSource( src_img ) );
			expect( speak.attr( "data-mood" ) ).toBe("banane"+arr[ k ].id);
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });


} );

describe("AddMoodCmd | ", function() {
	
	// going to run test on the article IN THE LAYER NAMED CONTENT
	
	var savePJ;
	var parent;
	var article;
	var speaker;
	beforeEach(function() {
	
		article = $("div.layer#content");
		savePj = article.clone();
		parent = article.parent();
		CommandMgr.reset();
		
		
		// found all the speaker
		var sources = srcMgr.sources;
		speaker = [];
		for( var i in sources )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
				
		// verification sur le neutre
		for( var k = 0 ; k < speaker.length ; k ++ )
			if( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) == -1 )
				speaker[ k ].portrait.neutre = null;
	});
	afterEach(function() {
		article.remove();
		parent.append( savePj );
		CommandMgr.reset();
	});
	it("modifyMood execute on one speak", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 1 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( true );
			expect( speaker[ k ].portrait[ arr[ k ].m ] ).toBe( arr[ k ].s );
		}
	  });
	  it("modifyMood execute undo on one speak", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 1 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ )
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( false );
		
	  });
	  it("modifyMood execute undo redo on one speak", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 1 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd();
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( true );
			expect( speaker[ k ].portrait[ arr[ k ].m ] ).toBe( arr[ k ].s );
		}
	  });
	  it("modifyMood execute on all speaks", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( true );
			expect( speaker[ k ].portrait[ arr[ k ].m ] ).toBe( arr[ k ].s );
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
		}
	  });
	  it("modifyMood execute undo on all speaks", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		
		for( var k = 0 ; k < arr.length ; k ++ )
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( false );
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  it("modifyMood execute undo redo on all speaks", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane"+k , "pomme"+k );
			arr.push( { i : k ,
						speaker : speaker[ k ],
						m : "banane"+k ,
						s : "pomme"+k ,
						cmd : cmd
						});
		}
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd();
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd();
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( speaker[ k ].hasMood( arr[ k ].m ) ).toBe( true );
			expect( speaker[ k ].portrait[ arr[ k ].m ] ).toBe( arr[ k ].s );
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
		}
	  });
 } );


describe("DelMoodCmd | ", function() {
	
	// going to run test on the article IN THE LAYER NAMED CONTENT
	
	var savePJ;
	var parent;
	var article;
	var speaker;
	var pre;
	beforeEach(function() {
	
		article = $("div.layer#content");
		savePj = article.clone();
		parent = article.parent();
		CommandMgr.reset();
		
		
		// found all the speaker
		var sources = srcMgr.sources;
		speaker = [];
		for( var i in sources )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
		
		// found a src image
		for( var i in sources )
			if( sources[ i ].type == "image" ){
				src_img = i;
				break;
			}
		
		var other_src_img;
		for( var i in sources )
			if( sources[ i ].type == "image" )
				other_src_img = i;
		
		// verification sur le neutre
		for( var k = 0 ; k < speaker.length ; k ++ )
			if( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) == -1 )
				speaker[ k ].portrait.neutre = null;
				
		// ajout d'humeur
		pre = [];
		for( var k = 0 ; k < speaker.length ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane" , other_src_img );
			pre.push( cmd );
			// pose de l'humeur sur certains speaks
			var speaks = speaker[ k ].getAssociateSpeak( );
			for( var i = 0 ; i < speaks.length ; i += 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ i ] , "banane" , srcMgr.getSource( other_src_img ) );
				pre.push( cmd );
			}
			if( speaks.length > 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ 1 ] , "neutre" , speaker[ k ].getMoodUrl("neutre") );
				pre.push( cmd );
			}
		}
		for( var k = 0 ; k < pre.length ; k ++ )
			CommandMgr.executeCmd( pre[k] );
	});
	afterEach(function() {
	
		while( CommandMgr.undoCmd() );
		
		article.remove();
		parent.append( savePj );
		CommandMgr.reset();
	});
	it("delMood execute on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new DelMoodCmd( speaker[ k ] , mood );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			if( arr[ k ].mood == "neutre" )
				continue;
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( false );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( "neutre" );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].speaker.getMoodUrl( "neutre" ) );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  
	it("delMood execute undo on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new DelMoodCmd( speaker[ k ] , mood );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			if( arr[ k ].mood == "neutre" )
				continue;
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( true );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( arr[ k ].dep[ j ].mood );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].dep[ j ].src );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].speaker.getMoodUrl( arr[ k ].dep[ j ].mood ) );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  
	it("delMood execute undo reverse on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new DelMoodCmd( speaker[ k ] , mood );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			if( arr[ k ].mood == "neutre" )
				continue;
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( false );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( "neutre" );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].speaker.getMoodUrl( "neutre" ) );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
 } );

 

describe("ModifyMoodSrcCmd | ", function() {
	
	// going to run test on the article IN THE LAYER NAMED CONTENT
	
	var savePJ;
	var parent;
	var article;
	var speaker;
	var scr_img;
	var pre;
	beforeEach(function() {
	
		article = $("div.layer#content");
		savePj = article.clone();
		parent = article.parent();
		CommandMgr.reset();
		
		
		// found all the speaker
		var sources = srcMgr.sources;
		speaker = [];
		for( var i in sources )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
				
		// found a src image
		for( var i in sources )
			if( sources[ i ].type == "image" ){
				src_img = i;
				break;
			}
		
		var other_src_img;
		for( var i in sources )
			if( sources[ i ].type == "image" )
				other_src_img = i;
		
		// verification sur le neutre
		for( var k = 0 ; k < speaker.length ; k ++ )
			if( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) == -1 )
				speaker[ k ].portrait.neutre = null;
		
		// ajout d'humeur
		pre = [];
		for( var k = 0 ; k < speaker.length ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane" , other_src_img );
			pre.push( cmd );
			// pose de l'humeur sur certains speaks
			var speaks = speaker[ k ].getAssociateSpeak( );
			for( var i = 0 ; i < speaks.length ; i += 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ i ] , "banane" , srcMgr.getSource( other_src_img ) );
				pre.push( cmd );
			}
			if( speaks.length > 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ 1 ] , "neutre" , speaker[ k ].getMoodUrl("neutre") );
				pre.push( cmd );
			}
		}
		for( var k = 0 ; k < pre.length ; k ++ )
			CommandMgr.executeCmd( pre[k] );
		
	});
	afterEach(function() {
		
		while( CommandMgr.undoCmd() );
		
		article.remove();
		parent.append( savePj );
		CommandMgr.reset();
	});
	it("ModifyMoodSrc execute on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new ModifyMoodSrcCmd( speaker[ k ] , mood , src_img );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep 
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( true );
			expect( arr[ k ].speaker.portrait[ arr[ k ].mood ] ).toBe(  src_img  );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( arr[ k ].dep[ j ].mood );
				expect( speak.children("img").attr( "src"  ) ).toBe( srcMgr.getSource( src_img ) );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  
	  it("ModifyMoodSrc execute undo redo on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new ModifyMoodSrcCmd( speaker[ k ] , mood , src_img );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep 
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd(  );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd(  );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( true );
			expect( arr[ k ].speaker.portrait[ arr[ k ].mood ] ).toBe(  src_img  );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( arr[ k ].dep[ j ].mood );
				expect( speak.children("img").attr( "src"  ) ).toBe( srcMgr.getSource( src_img ) );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  
	  
	   it("ModifyMoodSrc execute undo on all speakers on all mood", function() {
		
		var arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			
			var keys = Object.keys( speaker[ k ].portrait );
			
			for( var i = 0 ; i < keys.length ; i ++ ){
					var mood = keys[ i ];
					var cmd = new ModifyMoodSrcCmd( speaker[ k ] , mood , src_img );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( mood );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { mood : $( sp[ j ] ).attr( "data-mood"  ),
										src : $( sp[ j ] ).children("img").attr( "src"  ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						mood : mood ,
						cmd : cmd ,
						dep : dep ,
						oldsrc : speaker[ k ].portrait[ mood ]
						} );
			}
		}
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd(  );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.hasMood( arr[ k ].mood ) ).toBe( true );
			expect( arr[ k ].speaker.portrait[ arr[ k ].mood ] ).toBe(  arr[ k ].oldsrc  );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-mood"  ) ).toBe( arr[ k ].dep[ j ].mood );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].speaker.getMoodUrl(arr[ k ].mood ) );
				expect( speak.children("img").attr( "src"  ) ).toBe( arr[ k ].dep[ j ].src );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
 } );

 
describe("ModifyColorSpeaks | ", function() {
	
	// going to run test on the article IN THE LAYER NAMED CONTENT
	
	var savePJ;
	var parent;
	var article;
	var speaker;
	var scr_img;
	var pre;
	var arr;
	beforeEach(function() {
	
		article = $("div.layer#content");
		savePj = article.clone();
		parent = article.parent();
		CommandMgr.reset();
		
		
		// found all the speaker
		var sources = srcMgr.sources;
		speaker = [];
		for( var i in sources )
			if( sources[ i ].type == "speaker" )
				speaker.push( dataSpeak = sources[ i ].data );
				
		// found a src image
		for( var i in sources )
			if( sources[ i ].type == "image" ){
				src_img = i;
				break;
			}
		
		var other_src_img;
		for( var i in sources )
			if( sources[ i ].type == "image" )
				other_src_img = i;
		
		// verification sur le neutre
		for( var k = 0 ; k < speaker.length ; k ++ )
			if( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) == -1 )
				speaker[ k ].portrait.neutre = null;
		
		// ajout d'humeur
		pre = [];
		for( var k = 0 ; k < speaker.length ; k ++ ){
			var cmd = new AddMoodCmd( speaker[ k ] , "banane" , other_src_img );
			pre.push( cmd );
			// pose de l'humeur sur certains speaks
			var speaks = speaker[ k ].getAssociateSpeak( );
			for( var i = 0 ; i < speaks.length ; i += 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ i ] , "banane" , srcMgr.getSource( other_src_img ) );
				pre.push( cmd );
			}
			if( speaks.length > 2 ){
				var cmd = new ModifySpeakMoodCmd( speaks[ 1 ] , "neutre" , speaker[ k ].getMoodUrl("neutre") );
				pre.push( cmd );
			}
		}
		for( var k = 0 ; k < pre.length ; k ++ )
			CommandMgr.executeCmd( pre[k] );
		
		// constitution du tableau de cmd a tester
		arr = [];
		for( var k = 0 ; k < Math.min( speaker.length , 40 ) ; k ++ ){
			

					var new_color = "#48239"+Math.floor( Math.random()*9 );
					var cmd = new ModifyColorSpeakCmd( speaker[ k ] , new_color );
					
					var dep = [];
					
					var sp = speaker[ k ].getAssociateSpeak( );
		
				    for( var j = 0 ; j < sp.length ; j ++ )
							dep.push( { dataColor : $( sp[ j ] ).attr( "data-color"  ),
										backgroundColor : $( sp[ j ] ).css( "background-color" ), 
										id : $( sp[ j ] ).attr( "id"  ) });
				    
					
					arr.push( {
						speaker : speaker[ k ],
						exColor : speaker[ k ].color,
						newColor : new_color,
						cmd : cmd ,
						dep : dep 
						} );
		}
	});
	afterEach(function() {
		
		while( CommandMgr.undoCmd() );
		
		article.remove();
		parent.append( savePj );
		CommandMgr.reset();
	});
	it("ModifyColorSpeaks execute on all speaker", function() {
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.color ).toBe(   arr[ k ].newColor  );
			
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-color"  )     ).toBe( arr[ k ].newColor );
				
				if( speak.css( "background-color" ).indexOf("rgb(") == 0 ) // parfois, le backgoud-color est sous la forme rgb( x , y ,z ) , nativement js n'est pas capable de le comparer avec une couleur #xxxxxx, on passe
					continue;
				expect( speak.css( "background-color" ) ).toBe( arr[ k ].newColor );
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	it("ModifyColorSpeaks execute undo on all speaker", function() {
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd( arr[k].cmd );
		
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.color ).toBe(   arr[ k ].exColor  );
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-color"  )     ).toBe( arr[ k ].exColor );
				if( speak.css( "background-color" ).indexOf("rgb(") == 0 ) // parfois, le backgoud-color est sous la forme rgb( x , y ,z ) , nativement js n'est pas capable de le comparer avec une couleur #xxxxxx, on passe
					continue;
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });
	  it("ModifyColorSpeaks execute undo redo on all speaker", function() {
		
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.executeCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.undoCmd( arr[k].cmd );
		for( var k = 0 ; k < arr.length ; k ++ )
			CommandMgr.reverseCmd( arr[k].cmd );
			
		for( var k = 0 ; k < arr.length ; k ++ ){
			expect( arr[ k ].speaker.color ).toBe(   arr[ k ].newColor  );
			
			for( var j = 0 ; j < arr[ k ].dep.length ; j ++ ){
				var speak = $("#"+arr[ k ].dep[ j ].id );
				expect( speak.attr( "data-color"  )     ).toBe( arr[ k ].newColor );
				if( speak.css( "background-color" ).indexOf("rgb(") == 0 ) // parfois, le backgoud-color est sous la forme rgb( x , y ,z ) , nativement js n'est pas capable de le comparer avec une couleur #xxxxxx, on passe
					continue;
			}
		}
		for( var k = 0 ; k < speaker.length ; k ++ )
			expect( Object.keys( speaker[ k ].portrait ).indexOf( "neutre" ) ).not.toBe( -1 );
	  });	
		
 } );

 
 
 
 