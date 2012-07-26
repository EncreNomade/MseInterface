
describe("article formater | ", function() {
	
	it(" explanations :\n check the bijectivity of the function formate and reverse\n fisrt, generate pseudo-random article ( for a given seed, the articles generate will be the same )\n then formate the articles, check the coherence between the DOM article and the string formated\n once its done, control the reverse function, use the string formate to re-genererate the DOM article. Test the coherence between the original and the rebuilt DOM article ( cohenrece between the rebuilt DOM article and the formated string is not tested )", function() { } );
	
	var contents = ["\na\n \n  \n\n \n \n\n   \n",
					"\na\n \n[david] a  \n\n \n \n [end]\n  \n \n\n",
					"oawipsum \n\n[mike]  lorem f. t, \n[dialogue] h\nhdqln\n",
					"Vivamus tristique, nulla ut dignissim vehicula, massa nisi bibendum diam, non hendrerit enim turpis sed mauris. Nullam pharetra gravida viverra. Donec ultricies, nisi vel sollicitudin gravida, nibh justo posuere erat, vel sagittis nisi ligula ac justo. Praesent consequat odio et eros mollis volutpat. Vivamus risus nibh, interdum non tristique a, congue id arcu. Aliquam euismod consectetur nisl, nec sollicitudin dolor volutpat in. Etiam convallis nisl sed elit aliquet id rutrum purus tincidunt. Praesent fringilla imperdiet commodo. Suspendisse hendrerit purus sed odio interdum venenatis. Fusce vulputate commodo orci, ac sollicitudin eros adipiscing et. Nunc est diam, volutpat auctor luctus vel, auctor ut nulla. Suspendisse a rutrum turpis. Vivamus velit turpis, vehicula vel fringilla eu, fringilla id augue. Cras scelerisque sem a ante venenatis posuere. Nunc quis quam id velit lacinia hendrerit. Nullam eget eleifend justo. Morbi congue interdum erat, nec tincidunt velit volutpat at. Duis adipiscing hendrerit risus quis varius. Proin eu consectetur nisi. Aenean nulla erat, sollicitudin non ornare eu, pharetra sed neque. In hac habitasse platea dictumst. Curabitur varius varius nibh quis laoreet. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur elit justo, pretium et porttitor ut, dictum non odio. Sed nec orci metus. Nunc nec orci est. Nullam fermentum, arcu at sollicitudin tempor, lacus nibh sollicitudin dolor, quis semper enim felis ac augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer justo urna, tincidunt sit amet molestie sit amet, euismod placerat neque. In tempor urna et orci pretium vitae volutpat quam imperdiet. Quisque pretium interdum molestie. Etiam congue nibh magna. Praesent congue metus et ante lobortis accumsan. Duis tempor ipsum eget felis fermentum at adipiscing sapien sollicitudin. In consectetur, nunc eu venenatis pellentesque, velit enim mattis nibh, eget egestas arcu lacus a quam.\n",
					"Ils étaient là. \nÀ moins de cent mètres derrière Simon. Bien décidés à lui faire payer l’affront qu’ils avaient subi. \nLa Meute. \nQuatre adolescents qui faisaient régner leur loi au sein du foyer.\nRecroquevillé dans la pénombre d’un porche, Simon contemplait le ballet des lampes torches qui déchiraient la nuit. Des yeux, scrutant le moindre recoin, repoussant les ténèbres de leurs lueurs cyclopes. \nBientôt, ils seraient sur lui. \nSimon frissonna en songeant à ce qui allait lui arriver. Il savait que Kevin, leur chef, serait sans pitié…  \nIl fallait qu’il leur échappe.\nAbsolument. Et tant pis s’il ne pouvait jamais retourner au foyer.\nLes pas se rapprochaient, de plus en plus. Il pouvait entendre leurs voix à présent.\nTrouvez-moi ce sale petit rat ! Il va comprendre qu’on ne peut pas se moquer de nous comme ça !\nOuaip, on va lui faire sa fête !\nCa, c’était « La Fouine ». \nDix sept ans, un mètre quatre-vingt, soixante-quinze kilos de violence pure. Une véritable bombe ambulante qui ne demandait qu’à exploser. \nSimon se pencha un instant hors de son abri pour évaluer ses chances de leur échapper. \nProches du zéro absolu s’il ne bougeait pas de sa cachette. Un peu plus s’il tentait une sortie. À condition de tomber sur quelqu’un, un adulte qui saurait éloigner ses poursuivants. \nTu es prêt ? chuchota-t-il à Dark.\nDark. Vador. Son rat albinos. Son plus fidèle compagnon depuis un an. \nLe seul en vérité. \nSimon repoussa l’élan de mélancolie qui menaçait de le submerger et enfouit Dark au fond de son sac. Il passa les lanières autour de ses épaules et s’élança. \nPas de réaction.\nIl s’était mis à courir comme si sa vie en dépendait. \nSi la « Meute » lui tombait dessus, il était bon pour un passage à tabac dans les règles de l’art. Voilà ce qui se passe lorsque l’on refuse de soumettre aux plus forts.\nSimon évitait de regarder dans leur direction, les yeux rivés sur les frondaisons du parc Montsouris. Des arbres, de la pénombre et des milliards de recoins où il pourrait se dissimuler en attendant l’aube. \nS’il atteignait le jardin, il serait sauvé.\nMais, dans sa précipitation, il buta contre le trottoir. Le béton lui arracha une plainte. Un cri minuscule.\nIl est là !\n",
					
					];
	var fonts = [ "Arial12px"];
	var widths = [ 400 ];
	var alphabet = [ 'a' , 'lorem ' , 'ipsum ' , 'sit ' , 'amet ' , 'b', 'c' , 'd' ,'e', 'f', 'g', 'h' , 'i' ,'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' ,'w' , 'l' , ' ' , 'a' , 'lorem ' , 'ipsum ' , 'sit ' , 'amet ' , 'b', 'c' , 'd' ,'e', 'f', 'g', 'h' , 'i' ,'j' , 'k' , 'l' , 'm' , 'n' , 'o' , 'p' , 'q' , 'r' , 's' , 't' , 'u' , 'v' ,'w' , 'l' , ' ' , '\n' , '. ' , ' ' , ' ', ', ' ,"\n[rob] I" ];
	
	var enable = { 	wikilink : true,
					game : true,
					illu : true,
					script : true,
					anime : true,
				};
	
	var _seed = 123456789512565678;
	var _offset = _seed
	Math.prandom = function(){
		
		var s = _seed + _offset;
		var square = s *s;
		
		_seed = Math.floor( square / 10000 ) % 100000000;
		
		return ( _seed / 100000000 );
	}
	
	generateAleatoireContent = function(){
		var len = Math.floor( Math.prandom() * 200  + 700);
		var r ="";
		var knext = Math.random();
		for( var k = 0 ; k < len ; k ++ ){
			var c = alphabet[ Math.floor( Math.prandom() * alphabet.length ) ];
			if( c.indexOf( "[" ) != -1 && Math.prandom() > 0.3 )
				continue;
			r += c;
		}
		return r;
	}
	
	function pseudoFormate( e , breakline ){
					var lines = e.children();
					var s = "";
					if( breakline == null )
						breakline = true;
					for( var l = 0 ; l < lines.length ; l ++ ){
						var line = $( lines[ l ] );
						if( lines[ l ].tagName.toLowerCase() == "paragraphtag" ){
							s += "\n";
							breakline = true;
						}else
						if( !line.hasClass( "textLine" ) ){
							if( line.hasClass( "speaker" ) ){
								s += "[dialogue]"+pseudoFormate( line , breakline );
								breakline = true;
							}else
								continue;
						}else
						if( line.children("p").text().trim() == "" ){ // blank line
							if( breakline ){
								s += "\n";
							}else{
								s += "\n\n";
								breakline = true;
							}
						}else{
							s += line.children("p").text();
							breakline = false;
						}
					}
					return s;
				}
	function getTextBeforeMe( el , container ){
			if( el == container )
				return ""
			var e = el;
			var s = "";
			while( ( e = e.previousSibling ) != null )
				if( e instanceof Text )
					s = e.data + s;
				else
					s = e.innerText + s ;
			return getTextBeforeMe( el.parentNode  , container )+s;
		}
	
	
	function getPrevText( e ){
		var prev = e.prev();
		if( prev.length <= 0 )
			return null;
		else
		if( prev.hasClass("textLine")  )
			if( prev.children("p").text().trim().length > 0 )
				return prev.children("p").text();
			else
				return "\n";
		else
		if( prev[0].tagName.toLowerCase() == "paragraphtag" )
			return "\n";
		return null;
	}
	function getNextText( e ){
		var next = e.next();
		if( next.length <= 0 )
			return null;
		else
		if( next.hasClass("textLine")  )
			if( next.children("p").text().trim().length > 0 )
				return next.children("p").text();
			else
				return "\n";
		else
		if( next[0].tagName.toLowerCase() == "paragraphtag" )
			return "\n";
		return null;
	}
	
	function toStringContent( k ){
		return $( stack[ k ].res )[ 0 ].innerHTML;
	}
	
	for( var i = 0 ; i< 2 ; i ++ )
		contents.push( generateAleatoireContent() );
	
	var stack;
	
	var savePj = null;
	var saveSrc = null , saveScript = null;
	var parent;
	var article;
	
	var uid = 0;
	
	var dirtyArticle = false;
	var cleanArticle = function(){
		dirtyArticle = true;
	}
	beforeEach(function() {
		article = $("div.layer#content");
		if( !savePj ){
			savePj = article.clone();
			parent = article.parent();
		}
	});
	afterEach(function() {
		if( dirtyArticle ){
			dirtyArticle = false;
			article.remove();
			parent.append( savePj );
			savePj = null;
		}
	});
	
	describe("formate | ", function() {
			/*
			 * genere des articles en se basant sur la suite pseudo aléatoire prandom() 
			 * les lines sont générées par generateSpeak, 
			 * on ajoute ensuite des meta données
			 * des span .wikilink sur les ligne en suivant différents pattern ( dernier caractère, premier caractère ... ) pseudo aléatoirement choisis
			 * des animes avec pour référence une ligne de l'article sont insérés dans le sourceManager
			 * des scripts également
			 * des illustrations et games sont insérés entre les lignes /!\ MAIS PAS DANS LES SPEAK car c'est interdit
			 * /!\ encadrer un espace d'un span ( wikilink ou audiolink ) est interdit et produira une erreur ( le navigateur considérera le span comme vide )
			 * 
			 * le DOM article est formaté, le tableau meta obtenu et le formatage sont retenus pour analyses futures, 
			 * pour chaque élément meta ajouté, on a pris soin de consigner son contexte, c'est à dire les mots qui l'entoure, on pourra ainsi déterminer si le formatage est correct
			 *
			 * on ajoute "manuellement" des cas pathologique dans le stack
			 */
			it("initialisation ( with seed "+ _offset +" ) ..", function() {
			// found a src image
			var sources = srcMgr.sources;
			var src_img = null;
			var src_img_url = null;
			for( var i in sources )
				if( sources[ i ].type == "image" ){
					src_img = i;
					break;
				}
			src_img_url = srcMgr.getSource(src_img);
			stack = [];
			
			// save the sources
			saveSrc = srcMgr.sources;
			srcMgr.sources = {}
			saveScript = scriptMgr.scripts;
			scriptMgr.scripts = {}
			
			
			// add a image
			srcMgr.sources.image = { data : src_img_url };
			
			for( var k = 0 ; k < contents.length ; k ++ ){
				for( var i = 0 ; i < fonts.length ; i ++ ){
					for( var j = 0 ; j < widths.length ; j ++ ){
						
						var res = generateSpeaks( contents[ k ] , fonts[ i ] , widths[ j ] , 18 , false );
						var div = $("<div class=\"article\"/>").append( $(res) );
						
						// random insertion of metaData
						var meta = [];
						
						// random insertion
						var textLines = div.find( ".textLine" );
						if( enable.wikilink )
						for( var l = 0 ; l < textLines.length ; l ++ ){
							var p = $(textLines[l]).children( "p" );
							var objId = $(textLines[ l ] ).attr( "id");
							var text = p.text();
							if( text.length < 3 )
								continue;
								var name = "pruneauWiki"+(uid++);
								switch( Math.floor( Math.prandom() * 100 ) % 10 ){
									// insertion of link ( wiki link )
									case 0 :
										if(  text.substring( text.length-2 ).match( /^ *$/ ) )
											break;
										p.get(0).innerHTML = text.substring( 0 , text.length-2 )+'<span class="wikilink" link="'+name+'" >'+text.substring(  text.length-2 )+"</span>";
										meta.push({ key : text.substring(  text.length-2 ) , 
													av : text.substring( 0 , text.length-2 ) , 
													ap :"" ,
													objId : objId ,
													name : name
													});
									break;
									case 1 :
										if( text.substring(  0 , 1 ).match( /^ *$/ )  )
											break;
										p.get(0).innerHTML = '<span class="wikilink" link="'+name+'" >'+text.substring(  0 , 1 )+"</span>"+text.substring( 1 );
										meta.push({ key : text.substring(  0 , 1 ) , 
													av : "" , 
													ap : text.substring( 1 ) , 
													objId : objId , 
													name : name
													});
									break;
									case 2 :
										if( text.substring(  0 , 1 ).match( /^ *$/ )  )
											break;
										p.get(0).innerHTML = '<span class="wikilink" link="'+name+'a" ><span class="wikilink" link="'+name+'b" >'+text.substring(  0 , 1 )+"</span></span>"+text.substring( 1 );
										meta.push({ key : text.substring(  0 , 1 ) ,
													av : "" ,
													ap : text.substring( 1 ) ,
													objId : objId ,
													name : name+"a"
													});
										meta.push({ key : text.substring(  0 , 1 ) ,
													av : "" ,
													ap : text.substring( 1 ) ,
													objId : objId ,
													name : name+"b"
													});
									break;
									case 3 :
										if(  text.substring( text.length-2 ).match( /^ *$/ ) )
											break;
										p.get(0).innerHTML = text.substring( 0 , text.length-2 )+'<span class="wikilink" link="'+name+'a" ><span class="wikilink" link="'+name+'b" >'+text.substring(  text.length-2 )+"</span></span>";
										meta.push({ key : text.substring(  text.length-2 ) ,
													av : text.substring( 0 , text.length-2 ) ,
													ap : "" ,
													objId : objId ,
													name : name+"a"
													});
										meta.push({ key : text.substring(  text.length-2 ) ,
													av : text.substring( 0 , text.length-2 ) ,
													ap : "" ,
													objId : objId ,
													name : name+"b"
													});
									break;
									case 4 :
										if(  text.substring(  1 , 2  ).match( /^ *$/ )  )
											break;
										p.get(0).innerHTML = text.substring( 0 , 1 )+'<span class="wikilink" link="'+name+'" >'+text.substring(  1 , 2 )+"</span>"+text.substring(  2 );
										meta.push({ key : text.substring( 1,2 ) ,
													av : text.substring( 0 , 1 ) ,
													ap : text.substring(  2 ) ,
													objId : objId ,
													name : name
													});
									break;
									case 5 :
										p.get(0).innerHTML = text.substring( 0 , 1 )+'<span class="wikilink" link="'+name+'" ></span>'+text.substring( 1 );
										meta.push({ key : "" ,
													av : text.substring( 0 , 1 ) ,
													ap : text.substring( 1 ) ,
													objId : objId,
													name : name
													});
									break;
									case 6 :
										if( text.substring(  0 , 1 ).match( /^ *$/ ) || text.substring(  1 , 2 ).match( /^ *$/ )  )
											break;
										p.get(0).innerHTML = '<span class="wikilink" link="'+name+'a" ><span class="wikilink" link="'+name+'b" >'+text.substring( 0 , 1 )+'</span></span><span class="wikilink" link="'+name+'c" >'+text.substring( 1,2 )+'</span>'+text.substring( 2 );
										meta.push({ key : text.substring( 0 , 1 ) ,
													av : "" ,
													ap : text.substring( 1 ) ,
													objId : objId,
													name : name+"a"
													});
										meta.push({ key : text.substring( 0 , 1 ) ,
													av : "" ,
													ap : text.substring( 1 ) ,
													objId : objId,
													name : name+"b"
													});
										meta.push({ key : text.substring( 1 , 2 ) ,
													av : text.substring( 0 , 1 ) ,
													ap : text.substring( 2 ) ,
													objId : objId,
													name : name+"c"
													});
									break;
									default :
								}
						}
						
						
						// random insertion anime
						if( enable.anime ){
						var anime = [];
						for( var l = 0 ; l < 10 ; l ++ ){
							var name = "menthe"+(uid++);
							srcMgr.sources[ name ] = { type : "anime" , data : { name : name , objs : {} , frames : [] , content_i : k }  };
							anime.push( name );
						}
						for( var l = 0 ; l < textLines.length ; l ++ ){
							var line = $( textLines[l] );
								switch( Math.floor( Math.prandom() * 100 ) % 5 ){
									case 0 :
										if( line.hasClass( "textLine" ) ){
											if( line.children("p").text().trim() == "" )
												continue;
											
											var content =  line.children("p").text();
											var name = anime[ Math.floor( Math.prandom() * anime.length ) ];
											
											srcMgr.sources[ name ].data.objs[  line.attr( "id" ) ] = { 
													content :content
												};
											
											var prev , next;
											
											meta.push({ key : "" , 
														av : getPrevText( line ), 
														ap : getNextText( line ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
										}
									break;
									case 1 :			// this case is forbidden , an animation cannot be linked to other thing than a line
										if( line.children("p").text().trim() == "" )
												continue;
											
											var content =  line.children("p").text().substring( 0 , 1 );
											var name = anime[ Math.floor( Math.prandom() * anime.length ) ];
											
											srcMgr.sources[ name ].data.objs[  line.attr( "id" ) ] = { 
													content :content
												};
											
											var prev , next;
											
											meta.push({ key : "" , 
														av : getPrevText( line ), 
														ap : line.children("p").text().substring( 1 ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
									break;
									default :
								}
						}
						}
						
						// insertion script
						if( enable.script )
						for( var l = 0 ; l < textLines.length ; l ++ ){
							var line = $( textLines[l] );
							var name = "fraiseScript"+(uid++);
								switch( Math.floor( Math.prandom() * 100 ) % 8 ){
									case 0 :
										if( line.hasClass( "textLine" ) ){
											if( line.children("p").text().trim() == "" )
												continue;
											scriptMgr.scripts[ name ] = {
												srcType : "obj",
												src : line.attr( "id" ) ,
												src_double : line.attr( "id" ) ,
												supp : "none",
												supp_double : "none",
												target : "none",
												target_double : "none",
												content_i : k
											};
											meta.push({ key : line.children("p").text() , 
														av : getPrevText( line ), 
														ap : getNextText( line ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
										}
									break;
									case 1 :
										if( line.hasClass( "textLine" ) ){
											if( line.children("p").text().trim() == "" )
												continue;
											
											scriptMgr.scripts[ name ] = {
												srcType : "obj",
												src : line.attr( "id" ) ,
												src_double : line.attr( "id" ) ,
												supp : line.attr( "id" ),
												supp_double : line.attr( "id" ),
												target : line.attr( "id" ),
												target_double : line.attr( "id" ),
												content_i : k
											};
											meta.push({ key : line.children("p").text() , 
														av : getPrevText( line ), 
														ap : getNextText( line ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
										}
									break;
									case 2 :
										if( line.hasClass( "textLine" ) ){
											if( line.children("p").text().trim() == "" )
												continue;
											scriptMgr.scripts[ name ] = {
												srcType : "obj",
												src : "none" ,
												src_double : "none" ,
												supp : line.attr( "id" ),
												supp_double : line.attr( "id" ),
												target : "none",
												target_double : "none",
												content_i : k
											};
											meta.push({ key : line.children("p").text() , 
														av : getPrevText( line ), 
														ap : getNextText( line ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
										}
									break;
									case 3 :
										if( line.hasClass( "textLine" ) ){
											if( line.children("p").text().trim() == "" )
												continue;
											scriptMgr.scripts[ name ] = {
												srcType : "obj",
												src : "none" ,
												src_double : "none" ,
												supp : "none",
												supp_double : "none",
												target : line.attr( "id" ),
												target_double : line.attr( "id" ),
												content_i : k
											};
											meta.push({ key : line.children("p").text() , 
														av : getPrevText( line ), 
														ap : getNextText( line ), 
														name : name,
														objId : line.attr( "id" ) ,
														});
										}
									break;
									default :
								}
						}
						
						
						// random insertion of illus or games
						if( enable.game || enable.illu )
						for( var l = 0 ; l < div.children().length ; l ++ ){
						
							if( Math.prandom() < 0.8 )
								continue;
							
							var A = $( div.children()[l] );
							
							var item ;
							var name = "poireItem"+(uid++);
							
							
							if( !enable.game || ( Math.prandom() < 0.5 && enable.illu ) )
								item = $( '<div class=\"illu\" id=\"obj'+(curr.objId++)+'\" ><img name=\"'+name+'\" src=\"'+src_img_url+'\"/></div>');
							else
								item = $( '<div class=\"game\" id=\"obj'+(curr.objId++)+'\"  name=\"'+name+'\" >');
							A.after( item );
							
							meta.push({ key : null , 
								av : getPrevText( item ), 
								ap : getNextText( item ), 
								name : name,
								bjId : item.attr( "id" ) ,
							});
							
							if( Math.prandom() < 0.2 )
								l --;
						}
						
						
						stack.push( {
							content_i : k,
							font : fonts[ i ],
							width : widths[ j ],
							lineheight : 18 ,
							res : div.children(),
							meta : meta 
						} );
						
					}
				}
			}
			
			/*
			stack = [ ];
			stack.push( {
				
				res : $('<div id="obj1952" class="textLine" style="height: 14px; "><div class="del_container" style="position: relative; top: 0%; display: none; "><img src="./images/UI/del.png" ,="" style="top:2px;"><img src="./images/UI/insertbelow.png" ,="" style="top:19px;"><img src="./images/UI/config.png" ,="" style="top:36px;"><img src="./images/tools/anime.png" ,="" style="top:53px;"><img src="./images/UI/addscript.jpg" ,="" style="top:70px;"></div></div><div id="obj1953" class="textLine" style="height: 14px; "><p>a</p><div class="del_container" style="position: relative; top: -100%; display: none; "><img src="./images/UI/del.png" ,="" style="top:2px;"><img src="./images/UI/insertbelow.png" ,="" style="top:19px;"><img src="./images/UI/config.png" ,="" style="top:36px;"><img src="./images/tools/anime.png" ,="" style="top:53px;"><img src="./images/UI/addscript.jpg" ,="" style="top:70px;"></div></div><paragraphtag></paragraphtag><div class="game" id="obj1954" name="poireItem12"></div>'),
				content_i : null,
				font : fonts[ 0 ],
				width : widths[ 0 ],
				lineheight : 18 ,
			*/
			
			
			for( var k = 0 ; k < stack.length ; k ++ ){
				
				var div = $('<div class="article"/>').append( $( stack[ k ].res ) );
				
				// calcul
				var pmeta = ArticleFormater.parseMetaText( div );
				var formatage = ArticleFormater.formate( div , pmeta );
				
				// melange meta
				var pas = 3;
				for( var jump = 10 ; jump >= 1 ; jump -= 2 )
					for( var ii = 0 ; ii < meta.length ; ii += pas ){
								
						// swap 
						var a = ii;
						var b = ( ii + jump ) % meta.length ;
						var tmp = meta[ a ];
						meta[ a ] = meta[ b ];
						meta[ b ] = tmp;
					}
						
				stack[ k ].pmeta = pmeta;
				stack[ k ].formatage = formatage;
			}
		});	 
			/*
			 * vérifie que le formatage des balise speak est correct 
			 * generateSpeak lance des exception en cas de non respect de la syntaxe, on la récupère
			*/
			it("check the validity of speak tag", function() {
			for( var k = 0 ; k < stack.length ; k ++ ){
				
				var chaine = stack[ k ].formatage;
				
				try {
					generateSpeaks( chaine.replace( /<[^>]*>/g , "" ) );
				}catch( e ){
					if( e.indexOf( "invalide syntax" ) != -1 )
						expect( e ).toBe(null);
				}
			}
		  });
			/*
			  * extrait le texte du dom article, délicat, il faut respecter la charte pour les paragraphtag, ligne vide ... voir les test sur les generateLines
			  * extrait le texte du formatage,  supprime les balises < .. > 
			  * les dialogue sont reformatés pour les deux chaines
			  * 
			  * texte l'égalité des deux chaines
			  */
			it("check coherence between DOM article text and string formated text ( without and with \\n )", function() {
				
				for( var k = 0 ; k < stack.length ; k ++ ){
					
					var upper = $("<div/>").append( stack[ k ].res );
					
					var rawForm = stack[ k ].formatage.replace(  /<([^>]*)>/g , "" ).replace( /(\[end\])/g , "" ).replace( /\[( *[a-z0-9]* *( *: *[a-z0-9]* *)?)\]/gi , "[dialogue]" );
					var rawArticle = pseudoFormate( upper );
					
					
					var a = rawForm.replace( /\n/g , "");
					var b = rawArticle.replace( /\n/g , "");
					
					expect( a == b ).toBe(true);
					
					var a = rawForm;
					var b = rawArticle;
					
					expect( a == b ).toBe(true);
				}
			});
			/*
			  * test la validation xml, pour chaque balise non autofermante, il faut une balise fermante,
			  * il est interdit de faire se chevaucher les balise ( du style  <a> <b> </a> </b> )
			  */
			it("check meta imbrication ( xml format respected , meaning each tag had a closure , no crossed allowed )", function() {
				for( var k = 0 ; k < stack.length ; k ++ ){
					
					var chaine = stack[ k ].formatage;
					
					var pile=[];
					
					var g = 0;
					while( (g = chaine.indexOf( "<" , g ) )!= -1 ){
						
						g++;
						
						var end = chaine.indexOf( ">" , g );
						
						expect( end == -1 ).toBe( false ); 
						
						if( chaine.charAt( end - 1 ) == "/" )	// autofermante
							continue;
						
						
						var id = parseFloat( ( new RegExp(  "^/? *([0-9]*)" ).exec( chaine.substring( g , end ) ) || [null , -1] )[1] );
						
						expect( id == -1 ).toBe( false ); 
						
						if( chaine.charAt( g ) == "/" ){ 		// fermante
							expect( pile.length ).not.toBe( 0 ); 
							var last = pile.shift();
							expect( last ).toBe( id ); 
							if( last != id ){
								console.log( "expected closure of balise "+last+", get "+id ); 
								console.log(  chaine );
							}
							
						} else 
							pile.unshift( id );					// ouvrante
							
					}
				}
			});
			/*
			  * fait le lien entre les info que l'on a sauvegarder lors de l'insertion ( le contexte, la phrase précédente et la suivante ) et le meta du parseMeta
			  * utilise le champ link.id de meta de parseMeta, on c'est débrouiller pour fournir des noms uniques aux éléments insérés dans le DOM article,
			  * néanmoins,  il existe des élément possédant un id commun,  les scripts notament. dans ce cas on retient toute les possibilités
			  * on se contente ici de faire le lien, et de veiller à ce que chaque meta possède une correspondance
			  */
			it("check meta coherence, use the link field to match the tag, ( unicity is not garanted, but error can be found however)", function() {
			
				// correspondance entre meta et pmeta 
				for( var k = 0 ; k < stack.length ; k ++ ){
					for( var i = 0 ; i < stack[k].meta.length ; i ++ ){
						var concordance = [];
						for( var j = 0 ; j < stack[k].pmeta.length ; j ++ ){
							if( stack[k].pmeta[j].link.id == stack[k].meta[i].name ){
								
								concordance.push( j );
								//if( stack[k].pmeta[j].link.type == "wiki" || stack[k].pmeta[j].link.type == "audio" )
								
								
							}
						}
						
						expect( concordance.length ).not.toBe( 0 ); 
						
						if( concordance.length == 0 ){
							console.log( " on ne trouve pas de meta, correspondant à l'entrée que l'on a faite ");
							console.log( contents[ stack[k].content_i ] );
							console.log( stack[k].meta[i].name );
							
						}
						stack[k].meta[ i ].conc = concordance;
					}
				}
			});
			/*
			  * on vérifie que les éléments meta sont non seulement contenu dans le meta du parseMeta ( test précédent ) mais aussi dans le formatage, sous forme de tag
			  */
			it("check the presence of meta in the formated article" , function(){
				for( k = 0 ; k < stack.length ; k ++ ){
					chaine = stack[ k ].formatage;
					for( i = 0 ; i < stack[k].pmeta.length ; i ++ ){
						regExp = new RegExp( "< *" + i + "[^0-9][^>]*>" );
						expect( chaine.search( regExp ) ).not.toBe( -1 );
						if( chaine.search( regExp ) == -1 )
							console.log( "can't find "+i+" in the "+k+"e content " );
					}
				}
			});
			/*
			  * on utilise le contexte de chaque élément meta pour déterminer si il est bien insérer,
			  * on retrouve la balise grâce à sont numero, on regarde les caractères avant et après et on les compare avec le contexte retenu
			  * pratiquement, on ne test la correspondance qu'avec le premier caractère, ( ainsi que la totalité du texte intérieur à la balise si il y a lieu ) c'est suffisant, en effet la production de quelques faux positif non systématique n'est pas critique dans le cadre de test
			  */			
			it("check meta context validity - tag based", function() {
				var chaine , regExp, meta, cut ,
				i , k  , j  , c,
				sa , sb , ea , eb,
				b = { key : null , a : 0 , b : 0 },
				success;
				for( k = 0 ; k < stack.length ; k ++ ){
					chaine = stack[ k ].formatage;
					for( i = 0 ; i < stack[k].meta.length ; i ++ ){
						
						meta = stack[k].meta[ i ];
						
						for( j = 0 ; j < meta.conc.length ; j ++ ){
							c = meta.conc[ j ];
							
							// extraction info sur la balise
							
							regExp = new RegExp( "< *" + c + "[^0-9][^>]*>" );
							
							sa = chaine.search( regExp );
							expect( sa ).not.toBe( -1 );
							
							sb = chaine.indexOf( ">" , sa );
							expect( sb ).not.toBe( -1 );
							
							
							if( chaine.charAt( sb -1 ) == "/" ){			// auto fermante
								
								b.autoF = true;
								b.key = null;
								b.a = sa;
								b.b = sb+1;
								
							} else {
								
								regExp = new RegExp( "</ *" + c + "[^0-9][^>]*>" );
								ea = chaine.search( regExp );
								expect( sa ).not.toBe( -1 );
								eb = chaine.indexOf( ">" , ea );
								expect( eb ).not.toBe( -1 );
								
								b.autoF = false;
								b.key = chaine.substring( sb+1 , ea ).replace(  /<([^>]*)>/g , "" );
								b.a = sa;
								b.b = eb+1;
							}
							
							// check
							success = true;
							if( meta.key && meta.key.length > 0 )
								if( b.key == null || b.key != meta.key )
									success = false;
							
							if( meta.av && meta.av.length > 0 ){
								cut = chaine.substr( Math.max( 0 , b.a - 60 ) , b.a - Math.max( 0 , b.a - 60 )   ).replace(  /(^[^<>]*>|<([^<>]*)>|<[^<>]*$|\[[^\[\]]*\]|^[^\[\]]*\]|\[[^\[\]]*$)/g , "" );;
								if( cut.length != 0 && cut.charAt( cut.length-1 ) != meta.av.charAt( meta.av.length-1 ) )
									success = false;
							}
							
							if( meta.ap && meta.ap.length > 0 ){
								cut = chaine.substr( b.b , Math.min( 60 , chaine.length-1 - b.b )  ).replace(  /(^[^<>]*>|<([^<>]*)>|<[^<>]*$|\[[^\[\]]*\]|^[^\[\]]*\]|\[[^\[\]]*$)/g , "" );
								if( cut.length != 0 && cut.charAt( 0 ) != meta.ap.charAt( 0 ) ){
									success = false;
								}
							}
							
							// si cette balise passe toutes les conditions, on break
							if( success )
								break;
								
							// sinon il est toujours possible que les suivantes ( celle qui concordent ) passe les checks
						}
						
						
						expect( j >= meta.conc.length ).toBe( false );
						
						
					}
				}
			});
			
		});
		
	describe("reverse | ", function() {
		/*
		  * re-génére un DOM article à partir du formatage
		  */	
		it("initialisation ..", function() {
			
			// generateChildDomElem ne fonctionne pas si la source n'est pas valide, on la substitue
			spyOn( srcMgr , "generateChildDomElem" ).andCallFake(function( id , parent ) {
		      return $('<div class ="fakeImgOrGame" name="'+id+'" /> ') ;
		    });
			
			for( k = 0 ; k < stack.length ; k ++ ){
				chaine = stack[ k ].formatage;
				
				var div = $("<div class=\"article\"/>").append( $(stack[ k ].res) );
				var parent = $("<div/>")
				// parent , chaine , article , meta , font , width , lineHeight
				var reversed = ArticleFormater.reverse( parent ,
														stack[ k ].formatage , 
														div , stack[ k ].pmeta , 
														stack[ k ].font , 
														stack[ k ].width , 
														stack[ k ].lineheight );
				
				stack[ k ].reversed = reversed;
			}
			
			
		});
		/*
		  * extrait le texte du formatage,  supprime les balises < .. > 
		  * extrait le texte du dom article rebuilt , toujours délicat ... voir les test sur les generateLines
		  * les dialogue sont reformatés pour les deux chaines
		  * 
		  * texte l'égalité des deux chaines
		  */
		it("check coherence between the DOM articles rebuilt text and the formated string text ( without and with \\n )", function() {
			for( k = 0 ; k < stack.length ; k ++ ){
			
				var article = pseudoFormate( stack[ k ].reversed );
				var format =  stack[ k ].formatage.replace(  /<([^<>]*)>/g , "" ).replace( /(\[end\])/g , "" ).replace( /\[( *[a-z0-9]* *( *: *[a-z0-9]* *)?)\]/gi , "[dialogue]" );
				
				var a = article.replace( /\n/g , "");
				var b = format.replace( /\n/g , "");
				
				expect( a == b ).toBe( true ); 
				
				
				a = article;
				b = format;
				
				expect( a == b ).toBe( true ); 
			}
		});
		/*
		 * extrait les éléments textLine et paragraphtag des deux articles,
		 * ils sont normalement dans le même ordre, 
		 * chaque élément de l'un doit correspondre à l'élément de même index de l'autre
		  */
		it("check coherence between the two DOM articles ( original and rebuilt ) text elements ", function() {
			for( k = 0 ; k < stack.length ; k ++ ){
				var origin = $("<div>").append( stack[ k ].res ).find( ".textLine, paragraphtag" );
				var rebuild = stack[ k ].reversed.find( ".textLine, paragraphtag" );
				
				expect( rebuild.length == origin.length ).toBe( true ); 
				
				for( var i = 0 ; i < origin.length ; i ++ ){
					var ol = $( origin[ i ] );
					var rl = $( rebuild[ i ] );
					
					expect( ol[0].tagName ).toBe( rl[0].tagName );
					
					if( ol.hasClass( "textLine" ) )
						expect( ol.children("p").text() ).toBe( rl.children("p").text() );
					
				}
			}
		});
		/*
		 * extrait les éléments meta des deux articles
		 * cette fois il ne sont pas forcement dans le même ordre ( <span A > <span B > inside < /span B> </ span A > equivalent à BAAB )
		 * on récupère tout les élément de rebuilt qui peuvent correspondre à un élément de original ( même classe , même attribut clef ) et pour tout ceux là, on test la cogérence avec le contexte ( phrase précédente, phrase suivante ). Si aucun ne valide, il y a une erreur
		  */
		it("check coherence between the two DOM articles ( original and rebuilt ) meta elements - use context", function() {
			for( k = 0 ; k < stack.length ; k ++ ){
				var origin = $("<div>").append( stack[ k ].res ).find( ".textLine, paragraphtag, span, div.illu, div.game, div.speaker" );
				var rebuild = stack[ k ].reversed.find( ".textLine, paragraphtag, span, div.illu, div.game, div.speaker , div.fakeImgOrGame" );
				
				expect( rebuild.length == origin.length ).toBe( true ); 
				
				for( var j = 0 ; j < origin.length ; j ++ ){
					var ol = $( origin[ j ] );
						
					if( ol.hasClass( "speaker" ) || ol.hasClass( "illu" ) || ol.hasClass( "game" ) ){
						
						var match=null;
						if( ol.hasClass( "speaker" ) ){
							expect( ol.attr( "data-mood" ) ).not.toBeNull();
							expect( ol.attr( "data-who" ) ).not.toBeNull();
							match = rebuild.filter( "div.speaker[data-mood="+ol.attr( "data-mood" )+"][data-who="+ol.attr( "data-who" )+"]" );
						} else
						if( ol.hasClass( "illu" ) ){
							var name = ol.children("img").attr( "name" )
							expect( name ).not.toBeNull();
							match = rebuild.filter( "div.illu[name="+name+"],div.fakeImgOrGame[name="+name+"]" );
						} else 
						{
							expect( ol.attr( "name" ) ).not.toBeNull();
							match = rebuild.filter( "div.game[name="+ol.attr( "name" )+"],div.fakeImgOrGame[name="+ol.attr( "name" )+"]" );
						}
						
						var success = false;
						for( var i = 0 ; i < match.length ; i ++ )
							if( ol.prevAll( ".textLine" ).children("p").text() == $(match[i]).prevAll( ".textLine" ).children("p").text() &&
								ol.nextAll( ".textLine" ).children("p").text() == $(match[i]).nextAll( ".textLine" ).children("p").text())
								success = true;
								
						expect( success ).toBe( true );
						continue;
					} 
					else
					if( ol.hasClass( "wikilink" ) || ol.hasClass( "audiolink" ) ){
						expect( ol.attr( "link" ) ).not.toBeNull();
						var match = null;
						if( ol.hasClass( "wikilink" ) )
							match = rebuild.filter( "span.wikilink[link="+ol.attr( "link" )+"]" );
						else
							match = rebuild.filter( "span.audiolink[link="+ol.attr( "link" )+"]" );
						
						var otextb = getTextBeforeMe( ol[0] , ol.parents( "p" )[0] );
						
						var success = false;
						for( var i = 0 ; i < match.length ; i ++ )
							if( otextb == getTextBeforeMe( match[ i ] , $( match[ i ] ).parents( "p" )[0] ) &&
								ol.text() == $( match[ i ] ).text() )
								success = true;
						
						expect( success ).toBe( true );
						continue;
					}
				}
			}
		});
		/*
		 * extrait les éléments meta des deux articles
		 * bien qu'on ai vu que pour certain élément l'ordre n'est pas important, pour certain si, 
		 * c'est le cas des jeux et illu
		 * on vérifie qu'ils soient dans le bon ordre lorsqu'ils sont consécutif ( c'est à dire qu'ils on le même contexte )
		 */
		it(" check meta order ( successive game or illu )", function() {
			for( k = 0 ; k < stack.length ; k ++ ){
				var origin = $("<div>").append( stack[ k ].res ).find( "div.illu, div.game" );
				var rebuild = stack[ k ].reversed.find( "div.illu, div.game, div.fakeImgOrGame" );
				
				expect( rebuild.length == origin.length ).toBe( true ); 
				
				for( var j = 0 ; j < origin.length ; j ++ ){
					var ol = $( origin[ j ] );
					var rl = $( rebuild[ j ] );
					
					var oname;
					if( ol.hasClass( "illu" ) )
						oname = ol.children( "img" ).attr( "name" );
					else
						oname = ol.attr( "name" );
						
					var rname;
					if( rl.hasClass( "illu" ) )
						rname = rl.children( "img" ).attr( "name" );
					else
						rname = rl.attr( "name" );
					
					expect( rname ).toBe( oname )
				}
			}
		});
		/* 
		 * vérifie la mise à jour des script et animations
		 * on remarquera que pour les script, pour chaque champ, on a défini un champ associé qui contient la valeur de base et ne sera pas modifié par le reverse, on peut comparer les deux
		*/
		it(" check source update", function() {
			for( var i in srcMgr.sources ){
					if( srcMgr.sources[ i ].type == "anime" ){
						
						var anim = srcMgr.sources[ i ].data;
						
						for( var j in anim.objs ){
							var obj = j;
							var DomObj = stack[ anim.content_i ].reversed.find( "#"+obj );
							expect( DomObj.length ).toBe( 1 );
							expect( DomObj.text() ).toBe( anim.objs[ j ].content );
						}
					}
					
				}
			for( var i in scriptMgr.scripts ){
				var script = scriptMgr.scripts[ i ];
				if( script.src != "none" ){
					expect( script.src ).not.toBe( script.src_double );
					
					var DomObjR = $( stack[ script.content_i ].reversed ).find( "#"+script.src );
					var DomObjO = $("<div>").append( $( stack[ script.content_i ].res ) ).find( "#"+script.src_double );
					expect( DomObjR.length ).toBe( 1 );
					expect( DomObjO.length ).toBe( 1 );
					
					expect( DomObjR.text() ).toBe( DomObjO.text() );
				}
				if( script.supp != "none" ){
					expect( script.supp ).not.toBe( script.supp_double );
					
					var DomObjR = $( stack[ script.content_i ].reversed ).find( "#"+script.supp );
					var DomObjO = $("<div>").append( $( stack[ script.content_i ].res ) ).find( "#"+script.supp_double );
					expect( DomObjR.length ).toBe( 1 );
					expect( DomObjO.length ).toBe( 1 );
					
					expect( DomObjR.text() ).toBe( DomObjO.text() );
				}
				if( script.target != "none" ){
					expect( script.target ).not.toBe( script.target_double );
					
					var DomObjR = $( stack[ script.content_i ].reversed ).find( "#"+script.target );
					var DomObjO = $("<div>").append( $( stack[ script.content_i ].res ) ).find( "#"+script.target_double );
					expect( DomObjR.length ).toBe( 1 );
					expect( DomObjO.length ).toBe( 1 );
					
					expect( DomObjR.text() ).toBe( DomObjO.text() );
				}
			}
		});
		
		/* 
		 * resotre source et script manager 
		*/
		it(" .. finish ( restore the originals source and script Managers )", function() {
			// restore the src manager
			srcMgr.sources = saveSrc;
			scriptMgr.scripts = saveScript;
		});
	});
	
	
 } );

 
 
 
 