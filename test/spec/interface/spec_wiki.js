
describe("Wiki", function() {
	var src_img=null;
	var src_img2=null;
	
	var wik = $( '<div class="wiki_card"  ><h3 >Cyclope</h3><div class="sepline" ></div><div class="wikitext" >Nom</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope"></div><div class="wiki_card"  ><h3 >Un Cyclope chez les X-Men</h3><div class="sepline" ></div><div class="wikitext" >Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence. Il devient un des leaders des X-Men.</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope_%28comics%29"></div><div class="wiki_card"  ><img name="src8" src="./projects/Voodoo_Ch1/images/src8.png" ><h5 >Polyphème, fils de Poséïdon</h5></div><div class="wiki_card"  ><img name="src9" src="./projects/Voodoo_Ch1/images/src9.jpeg" ><h5 >Cyclope, super-héros des X-Men</h5></div>');
        
	
	it("initialisation ..",function(){
		// trouve une image valide
		var sources = srcMgr.sources;
		for( var i in sources )
			if( sources[ i ].type == "image" ){
				src_img = i;
				break;
			}
		for( var i in sources )
			if( sources[ i ].type == "image" )
				src_img2 = i;
	})
	
	describe("instanciation", function() {
	
	
    it(" without cards", function() {
        
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		var cards = $("");
		
        var wiki = new Wiki( name , cards , font , fsize , color );
		
		expect( wiki.font  ).toBe( font );
		expect( wiki.fsize ).toBe( fsize );
		expect( wiki.fcolor ).toBe( color );
		expect( wiki.name  ).toBe( name );
		
		expect( wiki.cards.length ).toBe( 0 );
		
    });
	it(" with cards ( unique sample )", function() {
        
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		
		var cards = $( '<div class="wiki_card"  ><h3 >Cyclope</h3><div class="sepline" ></div><div class="wikitext" >Nom</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope"></div><div class="wiki_card"  ><h3 >Un Cyclope chez les X-Men</h3><div class="sepline" ></div><div class="wikitext" >Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence. Il devient un des leaders des X-Men.</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope_%28comics%29"></div><div class="wiki_card"  ><img name="src8" src="./projects/Voodoo_Ch1/images/src8.png" ><h5 >Polyphème, fils de Poséïdon</h5></div><div class="wiki_card"  ><img name="src9" src="./projects/Voodoo_Ch1/images/src9.jpeg" ><h5 >Cyclope, super-héros des X-Men</h5></div>');
        
		var wiki = new Wiki( name , cards , font , fsize , color );
		
		expect( wiki.font  ).toBe( font  );
		expect( wiki.fsize ).toBe( fsize );
		expect( wiki.fcolor ).toBe( color );
		expect( wiki.name  ).toBe( name  );
		
		
		expect( wiki.cards.length ).toBe( 4 );
		
		var success = false;
		for( var i = 0 ; i < wiki.cards.length ; i ++ )
			if( 	wiki.cards[ i ].type == "img"
				&&  wiki.cards[ i ].image == "src9"
				&&  wiki.cards[ i ].legend == "Cyclope, super-héros des X-Men" )
					success = true;
		expect( success ).toBe( true );
		
		
		success = false;
		for( var i = 0 ; i < wiki.cards.length ; i ++ )
			if( 	wiki.cards[ i ].type == "img"
				&&  wiki.cards[ i ].image == "src8"
				&&  wiki.cards[ i ].legend == "Polyphème, fils de Poséïdon" )
					success = true;
		expect( success ).toBe( true );
		
		success = false;
		for( var i = 0 ; i < wiki.cards.length ; i ++ )
			if( 	wiki.cards[ i ].type == "text" 
				&&  wiki.cards[ i ].sections[0].type == "text"
				&&  wiki.cards[ i ].sections[0].title == "Un Cyclope chez les X-Men" 
				&&  wiki.cards[ i ].sections[0].content == "Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence. Il devient un des leaders des X-Men."
				&&  wiki.cards[ i ].sections[1].type == "link"
				&&  wiki.cards[ i ].sections[1].title == "Lien" 
				&&  wiki.cards[ i ].sections[1].content == "http://fr.wikipedia.org/wiki/Cyclope_%28comics%29" )
					success = true;
		expect( success ).toBe( true );
		
		success = false;
		for( var i = 0 ; i < wiki.cards.length ; i ++ )
			if( 	wiki.cards[ i ].type == "text" 
				&&  wiki.cards[ i ].sections[0].type == "text"
				&&  wiki.cards[ i ].sections[0].title == "Cyclope"
				&&  wiki.cards[ i ].sections[0].content == "Nom"
				&&  wiki.cards[ i ].sections[1].type == "link"
				&&  wiki.cards[ i ].sections[1].title == "Lien" 
				&&  wiki.cards[ i ].sections[1].content == "http://fr.wikipedia.org/wiki/Cyclope" )
					success = true;
		expect( success ).toBe( true );
		
		
		
    });
	
	
	});
	
	describe("dependency ", function() {
		var wiki=null;
		beforeEach(function() {
			var font = "Arial";
			var fsize = 12;
			var color = "green";
			var name = "abricot";
			var cards = $( '<div class="wiki_card"  ><h3 >Cyclope</h3><div class="sepline" ></div><div class="wikitext" >Nom</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope"></div><div class="wiki_card"  ><h3 >Un Cyclope chez les X-Men</h3><div class="sepline" ></div><div class="wikitext" >Cyclope est aussi un super-héros créé par J. Kirby et S. Lee en 1963. C’est un mutant qui génère des rayons extrêmement puissants avec ses yeux mais il évite au maximum d’utiliser la violence. Il devient un des leaders des X-Men.</div><h3 >Lien</h3><div class="sepline" ></div><img src="./images/UI/wikibutton.png"  value="http://fr.wikipedia.org/wiki/Cyclope_%28comics%29"></div><div class="wiki_card"  ><img name="src8" src="./projects/Voodoo_Ch1/images/src8.png" ><h5 >Polyphème, fils de Poséïdon</h5></div><div class="wiki_card"  ><img name="src9" src="./projects/Voodoo_Ch1/images/src9.jpeg" ><h5 >Cyclope, super-héros des X-Men</h5></div>');
        
	        wiki = new Wiki( name , cards , font , fsize , color );
			
			wiki.cards.push( {
				type : "img",
				src : "src8",
				legend : "une image"
			});
			wiki.cards.push( {
				type : "img",
				image : "src8",
				legend : "une deuxieme image"
			});
			wiki.cards.push( {
				type : "img",
				image : "src9",
				legend : "une troisieme image"
			});
		});
		it("get" , function(){
			expect( wiki.getDependency( "src8" ) ).toBe( true );
			expect( wiki.getDependency( "src9" ) ).toBe( true );
			expect( wiki.getDependency( "src10" ) ).toBe( false );
			expect( wiki.getDependency( "cerise" ) ).toBe( false );
		});
		it("remove" , function(){
			wiki.removeDependency( "src8" )
			expect( wiki.getDependency( "src8" ) ).toBe( false );
		});
		it("updateSource" , function(){
			var dep = [];
			for( var i = 0 ; i < wiki.cards.length ; i ++ )
				if(    wiki.cards[ i ].type == "img" 
					&& wiki.cards[ i ].image  == "src8" )
					dep.push( i );
			
			wiki.updateSource("src8" , "cerise" );
			
			for( var i = 0 ; i < dep.length ; i ++ )
				expect( wiki.cards[ dep[ i ] ].image ).toBe( "cerise" );
			
			expect( wiki.getDependency( "src8" ) ).toBe( false );
			expect( wiki.getDependency( "cerise" ) ).toBe( true );
		});
	});
	
	describe("save wiki ", function() {
		var spy=null;
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		var cards = wik;
		
		var res = null;
		var e;
		beforeEach(function() {
			
			var panelEditor = $( '<div id = "editor" />' );
			
			panelEditor.append( cards );
			panelEditor.append( "<div>" );
			
			var div = $('<div data-volatile="true" />');
			
			div.append( '<input id="wiki_name" type="text"  value="'+name+'" /> ' );
			
			
			$("#wiki_font").attr( "value" , font );
			$("#wiki_color").attr( "value" , color );
			$("#wiki_size").attr( "value" , fsize );
			
			
			$("body").append( div );
			
			e = { data : { editor : panelEditor } };
			
			new spyOn( srcMgr , "addSource" );
			
			res = window.wikiTool.saveWiki( e );
			
		});
		afterEach(function() {
			$( "div[data-volatile=true]").remove();
		});
		it( "source added " , function(){
			 expect( srcMgr.addSource ).toHaveBeenCalled();
		});
		it( "proper instanciation" , function(){
			var wiki = srcMgr.addSource.mostRecentCall.args[1];
			
			expect( wiki.font  ).toBe( font  );
			expect( wiki.fsize ).toBe( fsize );
			expect( wiki.name  ).toBe( name  );
			
			expect( wiki.cards.length ).toBe( 4 );
		});
		
	});
   
	describe("addWikiCard ", function() {
		var spy=null;
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		var cards = wik;
		
		var res = null;
		var e;
		var r=null;
		beforeEach(function() {
			saveEd = window.wikiTool.editor.clone();
		});
		afterEach(function() {
			r.remove();
		});
		describe("with type generator ", function() {
			beforeEach(function() {
				r = window.wikiTool.addWikiCard( "generator" );	
			});
			it( "addDesc bn " , function(){
				expect( r.find( "#wiki_addDesc" ).length > 0 ).toBe( true );
			});
			it( "addDesc bn action" , function(){
				spyOn( window.wikiTool , "addWikiCard" ).andCallFake( function(){} );
				var bn =r.find( "#wiki_addDesc" );
				bn.click();
				expect( window.wikiTool.addWikiCard ).toHaveBeenCalledWith( "description" );
			});
			it( "addImg bn " , function(){
				expect( r.find( "#wiki_addImg" ).length > 0 ).toBe( true );
			});
			it( "addImg bn action" , function(){
				spyOn( window.wikiTool , "addWikiCard" ).andCallFake( function(){} );
				var bn =r.find( "#wiki_addImg" );
				bn.click();
				expect( window.wikiTool.addWikiCard ).toHaveBeenCalledWith( "image" );
			});
			it( "saveWiki bn " , function(){
				expect( r.find( "#save_wiki" ).length > 0 ).toBe( true );
			});
			xit( "saveWiki bn action" , function(){
				//spyOn( window.wikiTool , "saveWiki" ).andCallFake( function(){} );
				var bn = r.find( "#save_wiki" );
				
				var save = window.wikiTool.saveWiki;
				window.wikiTool.saveWiki = function(){console.log(this)};
				bn.click();
				
				window.wikiTool.saveWiki = save;
				
				expect( window.wikiTool.saveWiki ).toHaveBeenCalled();
			});
			it( "add on editor" , function(){
				expect( saveEd.children().length+1 ).toBe( window.wikiTool.editor.children().length );
			});
			
		});
		it( "init with a generator card .." , function(){
			window.wikiTool.addWikiCard( "generator" );
		});
		describe("with type image ", function() {
			beforeEach(function() {
				r = window.wikiTool.addWikiCard( "image" );	
			});
			it( "add on editor" , function(){
				expect( saveEd.children().length+1 ).toBe( window.wikiTool.editor.children().length );
			});
			
		});
		describe("with type description ", function() {
			beforeEach(function() {
				r = window.wikiTool.addWikiCard( "description" );	
			});
			it( "nouvelleSection bn " , function(){
				expect( r.find( 'input[value="Nouvelle section"]' ).length > 0 ).toBe( true );
			});
			xit( "nouvelleSection bn action" , function(){
				spyOn( window.wikiTool , "addSectionDialog" ).andCallFake( function(){} );
				var bn = r.find( 'input[value="Nouvelle section"]' );
				bn.click();
				expect( window.wikiTool.addSectionDialog ).toHaveBeenCalled();
			});
			it( "add on editor" , function(){
				expect( saveEd.children().length+1 ).toBe( window.wikiTool.editor.children().length );
			});
			
		});
		
		it( ".. del  a generator card" , function(){
			window.wikiTool.close();
		});
	});
	
	describe("addSectionWiki ", function() {
		var spy=null;
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		var cards = wik;
		
		var res = null;
		var e;
		var r=null;
		var ro=null;
		beforeEach(function() {
			window.wikiTool.addWikiCard( "generator" );	
			r = window.wikiTool.addWikiCard( "description" );
			ro = r.clone();
			
			var bn = r.find( "input:last" );
			
			window.wikiTool.addSectionWiki( bn , "peach" , "link" , "http://rubarbe.com" );
		});
		afterEach(function() {
			window.wikiTool.close();
		});
		it( " section added" , function(){
			expect( ro.children(".sepline").length+1 ).toBe( r.children(".sepline").length );
		});
	});
	
	describe("showWikiOnEditor ", function() {
		var spy=null;
		var font = "Arial";
		var fsize = 12;
		var color = "green";
		var name = "abricot";
		var cards = wik;
		
		var res = null;
		var e;
		var r=null;
		var ro=null;
		var wiki=null;
		beforeEach(function() {
		
			wiki = new Wiki( name , cards , font , fsize , color );
			
			spyOn( window.wikiTool , "active" ).andCallThrough();
			
			wiki.showWikiOnEditor();
		});
		afterEach(function() {
			window.wikiTool.close();
		});
		it( " tool actived" , function(){
			expect( window.wikiTool.active ).toHaveBeenCalled();
		});
		it( " contain a generator" , function(){
			var last = window.wikiTool.editor.children(":last");
			expect( last.find( "#wiki_addDesc" ).length > 0 ).toBe( true );
			expect( last.find( "#wiki_addImg" ).length > 0 ).toBe( true );
		});
		it( " contains all cards" , function(){
			var cardDOM = window.wikiTool.editor.children();
			for( var i = 0 ; i < wiki.cards.length ; i ++ ){
				var card = wiki.cards[ i ];
				var match = false;
				for( var j = 0 ; j < cardDOM.length ; j ++ ){	
					if(    card.type == "img" 
						&& $(cardDOM[ j ]).find('img[name="'+card.image+'"]').length > 0 
						&& $(cardDOM[ j ]).find('h5').text() == card.legend )
						match = true;
					if(    card.type == "text"
						&& $(cardDOM[ j ]).find('.sepline').length == card.sections.length )
						match = true;
				}
				expect( match ).toBe( true );
			}
		});
	});
});