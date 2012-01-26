var fn_cursor_pointer = function() {mse.setCursor('pointer');}
var fn_cursor_default = function() {mse.setCursor('default');}

var cds_title_show = [
	{
		src			:getVar('title'),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_title_show = function() {
	mse.fadein(getVar('txtTitle'), 30, new mse.Callback(mse.setCursor, window, 'pointer'));
	mse.fadein(getVar('txtAuteur'), 30);
};

var cds_chap_trans = [
	{
		src			:getVar('title'),
		type		:"click",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_chap_trans = function() {
	mse.root.transition(getVar('chapitre'));
};
var cds_content_trans = [
	{
		src			:getVar('chapitre'),
		type		:"click",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_content_trans = function() {
	mse.root.transition(getVar('articlePage'));
};

var cds_chap_show = [
	{
		src			:getVar('chapitre'),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_chap_show = function() {
	mse.setCursor('default');
	getVar('showChaAnime').resetAnimation();
	mse.root.animations.push(getVar('showChaAnime'));
};

var cds_chap_showend = [
	{
		src			:getVar('showChaAnime'),
		type		:"end",
		initial	:"",
		expect	:"once"
	}
];
var sc_chap_showend = function() {
	mse.setCursor('pointer');
	mse.Script.register(cds_content_trans, sc_content_trans);
};

var cds_arti_show = [
	{
		src			:getVar('articlePage'),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];
var cds_wiki_show = [
	{
		src			:getVar('wkCycPage'),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];

var cds_changeBack = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[34]+2),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var sc_changeBack = function() {
	getVar('background').insertObject(getVar('bg2'), 0);
	mse.transition(getVar('bg1'), getVar('bg2'), 25, new mse.Callback(getVar('background').delObject, getVar('background'), getVar('bg1')));
}


mse.Script.register(cds_title_show, sc_title_show);
mse.Script.register(cds_chap_trans, sc_chap_trans);
mse.Script.register(cds_chap_show, sc_chap_show);
mse.Script.register(cds_chap_showend, sc_chap_showend);
mse.Script.register(cds_arti_show, fn_cursor_default);
mse.Script.register(cds_wiki_show, fn_cursor_pointer);
mse.Script.register(cds_changeBack, sc_changeBack);


var cds_ratgame = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[20]-1),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var sc_ratgame = function() {
	getVar('ratGame').start();
}
mse.Script.register(cds_ratgame, sc_ratgame);


var cds_fouine_show = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[12]),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var sc_fouine_show = function() {
	getVar('illu').addObject(getVar('f_mask'));
	getVar('illu').addObject(getVar('fouine'));
	getVar('article').interrupt();
	mse.root.animations.push(getVar('showFouineMask'));
	mse.root.animations.push(getVar('showFouine'));
};
var cds_fouine_showend = [
	{
		src			:getVar('showFouine'),
		type		:"end",
		initial	:"",
		expect	:"once"
	}
];
var delAnimeBloque = function() {
	getVar('illu').delAll();
	getVar('article').play();
}

var cds_simCours = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[20]),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var cds_simCours_end = [
	{
		src			:getVar('opacAnim'),
		type		:"end",
		initial	:"",
		expect	:"once"
	}
];
var sc_simCours = function() {
	getVar('illu').addObject(getVar('simCours'));
	getVar('courAnim').start();
	getVar('opacAnim').start();
	getVar('moveAnim').start();
}

function animeText(obj, e) {
	obj.font = obj.parent.font;
	obj.styled = true;
	var anime = new mse.KeyFrameAnimation(obj, {
			frame	: [0, 12, 22],
			opacity	: [0.5, 1, 1],	
			fontSize: [22, 90, 22]
		}, 1);
	anime.start();
};
var cds_qurante = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[48]),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_qurante = new mse.Callback(animeText, window, getVar('article').getObject(getVar('article').phraseIndexs[48]));
var cds_treinte = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[51]),
		type		:"show",
		initial	:"",
		expect	:"everytime"
	}
];
var sc_treinte = new mse.Callback(animeText, window, getVar('article').getObject(getVar('article').phraseIndexs[51]));

var cds_grillage = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[61]),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var sc_grillage = function() {
	// Pause article
	getVar('article').interrupt();
	getVar('illu').addObject(getVar('grillage'));
	getVar('illu').addObject(getVar('piege'));
	getVar('grillAnime').start();
	getVar('piegeAnime').start();
	mse.src.getSrc('audPiege').play();
}
var cds_grillend = [
	{
		src			:getVar('grillAnime'),
		type		:"end",
		initial	:"",
		expect	:"once"
	}
];
var sc_grillend = function() {
	getVar('grillage').parent = getVar('background');
	getVar('background').insertObject(getVar('grillage'), 1);
}

var cds_couteau = [
	{
		src			:getVar('article').getObject(getVar('article').phraseIndexs[70]-1),
		type		:"show",
		initial	:"",
		expect	:"once"
	}
];
var sc_couteau = function() {
		var mx = (800-51)/2, my = (600-350)/2+140;
		var manche = new mse.Sprite(null, {}, 'cran', 51,210, 0,0,51,210);
		var lame = new mse.Sprite(null, {pos:[-12,-127]}, 'cran', 25,196, 51,0,25,139);
		var couteau = new mse.UIObject(getVar('illu'), {});
		couteau.count = 0; couteau.angle = -180;
		couteau.logic = function(delta){
			if(this.count == 10) mse.src.getSrc('audCran').play();
			if(this.count >= 10 && this.count <= 14)
				this.angle = -180 + (this.count-10) * 180/4;
			this.count++;
		};
		couteau.draw = function(ctx){
			ctx.save();
			// Origin of rotation: point on the top of manche
			ctx.translate(mx+24,my+16);
			// Rotation of the lame
			ctx.rotate(this.angle * Math.PI / 180);
			lame.draw(ctx);
			// Draw Manche
			ctx.rotate(-this.angle * Math.PI / 180);
			ctx.translate(-24,-16);
			manche.draw(ctx);
			ctx.restore();
		};
		// Pause article
		getVar('article').interrupt();
		getVar('illu').addObject(couteau);
		var animeLame = new mse.KeyFrameAnimation(lame, {
				frame	: [0, 6, 30, 36],
				opacity	: [0, 1, 1,  0]
			}, 1);
		var animeManche = new mse.KeyFrameAnimation(manche, {
				frame	: [0, 6, 30, 36],
				opacity	: [0, 1, 1,  0]
			}, 1);
		animeManche.evtDeleg.addListener('end', new mse.Callback(delAnimeBloque, window));
		animeLame.start();
		animeManche.start();
	};


mse.Script.register(cds_fouine_show, sc_fouine_show);
mse.Script.register(cds_fouine_showend, delAnimeBloque);
mse.Script.register(cds_simCours, sc_simCours);
mse.Script.register(cds_simCours_end, delAnimeBloque);
mse.Script.register(cds_qurante, sc_qurante);
mse.Script.register(cds_treinte, sc_treinte);
mse.Script.register(cds_grillage, sc_grillage);
mse.Script.register(cds_grillend, delAnimeBloque);
mse.Script.register(cds_grillend, sc_grillend);
mse.Script.register(cds_couteau, sc_couteau);