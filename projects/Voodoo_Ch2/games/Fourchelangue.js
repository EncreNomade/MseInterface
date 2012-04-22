var Fourchelangue = function() {
    mse.Game.call(this, {fillback:true, pos:[(mse.root.width-600)/2, (mse.root.height-480)/2], size:[600,480]});
    
    var base = [
        {fr:6,x:234,y:369,head:0,color:"#d4bf11"},
        {fr:2,x:115,y:388,head:2,color:"#8a8dbf"},
        {fr:4,x:353,y:388,head:6,color:"#368723"},
        {fr:0,x:33,y:420,head:2,color:"#ce1717"},
        {fr:3,x:435,y:420,head:6,color:"#d06f0f"}
    ];
    var ratPos = {
        head: {x:35,y:-92},
        body: {x:29,y:-70},
        bull: {x:66,y:-118}
    };
    var size = {
        base: {w:133,h:33},
        rat: {w:74,h:82},
        rathead: {w:62,h:43},
        question: {w:400,lh:25}
    };
    var fourchelangues = [
        [// Easy mode
            ["Si ton tonton tond ton tonton, ton tonton tondu sera. Mange ton thon tonton et tond ton tonton !", "ton", "tonton", "tond"],
            ["Si ta tata tasse ta tata, ta tata tassée sera. Ta tata tâta ta tata.", "ta", "tata", "tâta"],
            ["Si six scies scient six cyprès, alors six cent six scies scieront six cent six cyprès.", "six", "scies", "cyprès"]
        ],
        [// Normal mode
            ["On s’tait caché pour charcuter mon steak haché auprès duquel on s’tait caché.", "s’tait", "caché", "steak", "haché"],
            ["Un comte comptant ses comptes, content de son comté, raconte un conte, d'un comte comptant des comptes mécontents, en contant un conte contant un comte mécontent se contentant d'un compte en mangeant son comté.", "comte", "comptes", "conte", "comptant"],
            ["Cinq saints sains de corps et d'esprit et ceints de leur cordon, portaient sur leur sein le seing de leur Saint-Père.", "saints", "sains", "ceints", "sein"]
        ],
        [// Hard mode
            ["Didon dîna, dit-on, du dos dodu d'un dodu dindon. Du dos dodu du dodu dindon dont Didon dîna, dit-on, il ne reste rien.", "didon", "du", "dos", "dodu", "dindon"],
            ["Ah !, pourquoi, Pépita, sans répit m'épies-tu ? Dans les bois, Pépita, pourquoi te tapis-tu ? Tu m'épies sans pitié ! C'est piteux de m'épier ! De m'épier, Pépita, saurais-tu te passer ?", "pépita", "répit", "épies", "tu", "épier"],
            ["Tas de riz, tas de rats.\nTas de riz tenta tas de rats.\nTas de rats tenté tâta tas de riz.\nTu as un tas tentant tâté par un tas tenté.", "tas", "riz", "rats", "tenté", "tâté"]
        ]
    ];
    
    mse.src.addSource('gamebtns', 'games/boutons.png', 'img', true);
    mse.src.addSource('gamerats', 'games/rats.png', 'img', true);
    mse.src.addSource('gamedecor', 'games/Decors.jpg', 'img', true);
    mse.src.addSource('gamesign', 'games/signs.png', 'img', true);
    
    var ratHead = new mse.Sprite(null, {}, 'gamerats', size.rathead.w, size.rathead.h, 0,0,248,86);
    var ratBody = new mse.Sprite(null, {}, 'gamerats', size.rat.w, size.rat.h, 0,86,148,82);
    var baseImg = new mse.Sprite(null, {}, 'gamebtns', size.base.w, size.base.h, 0,0,133,231);
    var back = new mse.Image(null, {pos:[0,0],size:[this.width,this.height]}, 'gamedecor');
    var right = new mse.Sprite(null, {pos:[162,140],size:[275,200]}, 'gamesign', 278,200, 0,0,278,200);
    var wrong = new mse.Sprite(null, {pos:[162,140],size:[275,200]}, 'gamesign', 272,200, 278,0,272,200);
    var replaybn = new mse.Button(null, {pos:[247,380],size:[105,35],font:'12px Arial',fillStyle:'#FFF'}, 'Je réessaie', 'aideBar');
    var levelupbn = new mse.Button(null, {pos:[247,380],size:[105,35],font:'12px Arial',fillStyle:'#FFF'}, '', 'aideBar');
    var passbn = new mse.Button(null, {pos:[450,380],size:[105,35],font:'12px Arial',fillStyle:'#FFF'}, 'Je ne joue plus', 'wikiBar');
    
    this.mode = 0;
    this.successed = -1;
    
    var RatBase = function(id, wordid, currfcl) {
        this.id = id;
        this.wordid = wordid;
        this.base = base[id];
        this.currfcl = currfcl;
        this.ratfr = randomInt(2);
        this.cri = false;
        this.again = false;
        
        this.draw = function(ctx){
            ctx.save();
            ctx.translate(this.base.x, this.base.y);
            baseImg.drawFrame(this.base.fr, ctx, 0, 0);
            ratBody.drawFrame(this.ratfr, ctx, ratPos.body.x, ratPos.body.y);
            if(this.cri) {
                // Head up
                ratHead.drawFrame(this.base.head+1, ctx, ratPos.head.x, ratPos.head.y);
                var r = 65;
                var font = "blod 22px Arial";
            }
            else {
                // Head down
                ratHead.drawFrame(this.base.head, ctx, ratPos.head.x, ratPos.head.y);
                var r = 48;
                var font = "16px Arial";
            }
                
            // Bull
            ctx.save();
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 10;
            ctx.translate(ratPos.bull.x, ratPos.bull.y);
            ctx.scale(1,0.3);
            ctx.beginPath(); 
            ctx.arc(0,0,r,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
            
            // Text
            ctx.translate(ratPos.bull.x, ratPos.bull.y);
            ctx.fillStyle = this.base.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = font;
            ctx.fillText(this.currfcl[this.wordid], 0, 0);
            
            ctx.restore();
        }
        this.logic = function() {
            if(this.again) {
                if(this.count == 0) this.shout();
                else this.count--;
            }
            if(this.cri) {
                if(this.count == 0) this.cri = false;
                else this.count--;
            }
        }
        this.inObj = function(x, y) {
            x -= this.base.x;
            y -= this.base.y;
            if(x >= ratPos.body.x && x <= ratPos.body.x+size.rat.w && y >= ratPos.head.y && y <= size.base.h)
                return true;
            else return false;
        }
        this.shout = function(time) {
            if(this.cri) {
                this.cri = false;
                this.again = true;
                this.count = 1;
            }
            else {
                this.again = false;
                this.cri = true;
                this.count = isNaN(time) ? 10 : time;
            }
        }
    };
    
    this.msg = {
        "INIT": "Clique pour jouer.",
        "WIN": "Bravo!!! Tu as gagné ",
        "LOSE": "Perdu..."
    };
    this.state = "INIT";
    
    this.init = function(levelup) {
        // 0: easy, 1: normal, 2: hard
        if(levelup === true) {
            if(this.mode < 2)
                this.mode++;
            else this.mode = 0;
        }
        this.currfcl = fourchelangues[this.mode][randomInt(3)];
        
        this.colormap = {};
        this.bases = [];
        switch (this.mode) {
        case 0:
            var ids = [1,2,3];
            for(var i = 0; i < 3; ++i) {
                var id = randomInt(ids.length);
                var wordid = ids[id];
                this.bases.push(new RatBase(i, wordid, this.currfcl));
                ids.splice(id, 1);
                // Construction of color map for key words
                this.colormap[this.currfcl[wordid]] = base[i].color;
            }
        break;
        case 1:
            var ids = [1,2,3,4];
            for(var i = 1; i < 5; ++i) {
                var id = randomInt(ids.length);
                var wordid = ids[id];
                this.bases.push(new RatBase(i, wordid, this.currfcl));
                ids.splice(id, 1);
                // Construction of color map for key words
                this.colormap[this.currfcl[wordid]] = base[i].color;
            }
        break;
        case 2:
            var ids = [1,2,3,4,5];
            for(var i = 0; i < 5; ++i) {
                var id = randomInt(ids.length);
                var wordid = ids[id];
                this.bases.push(new RatBase(i, wordid, this.currfcl));
                ids.splice(id, 1);
                // Construction of color map for key words
                this.colormap[this.currfcl[wordid]] = base[i].color;
            }
        break;
        }
        
        this.lines = this.presetColoredText(mse.root.ctx, "20px Arial", this.currfcl[0], this.colormap, size.question.w, size.question.lh);
        this.currTime = 0;
        this.currGuess = {line:0,index:0};
        this.keycount = 0;
        this.state = "INIT";
        mse.setCursor("pointer");
        mse.root.evtDistributor.addListener('click', this.clickcb, true, this);
    };
    this.mobileLazyInit = function() {
    };
    
    this.checkFail = function() {
        this.state = "FAIL";
    };
    this.checkSuccess = function() {
        this.state = "SUCCESS";
        if(this.mode > this.successed) this.successed = this.mode;
        // Restart from the niveau 1
        if(this.mode+1 >= 3)
            levelupbn.txt = "Recommence";
        // Continue to challange the next niveau
        else levelupbn.txt = "Niveau " + (this.mode+2);
    };
    // Check guess
    this.check = function() {
        for(var i in this.lines) {
            for(var j in this.lines[i].keywords) {
                var keyword = this.lines[i].keywords[j];
                if(keyword.guess != keyword.word.toLowerCase()) {
                    this.checkFail();
                    return;
                }
            }
        }
        this.checkSuccess();
    };
    this.clicked = function(e) {
        var x = e.offsetX - this.offx;
        var y = e.offsetY - this.offy;
        if(this.state == "INIT") {
            mse.setCursor("default");
            this.state = "START";
        }
        // Restart button clicked
        else if(this.state == "FAIL" && replaybn.inObj(x, y)) {
            this.init();
        }
        else if(this.state == "SUCCESS" && levelupbn.inObj(x, y)) {
            // Levelup button clicked
            this.init(true);
        }
        // Finish game
        else if((this.state == "FAIL" || this.state == "SUCCESS") && passbn.inObj(x, y)) {
            mse.root.evtDistributor.removeListener('click', this.clickcb);
            if(this.successed >= 0) {
                this.state = "WIN";
                this.msg.WIN += "le niveau " + (this.successed+1);
            }
            else this.state = "LOSE";
            this.end();
        }
        else if(this.state == "PLAYING") {
            for(var i in this.bases) {
                // Rat clicked
                if(this.bases[i].inObj(x, y)) {
                    this.bases[i].shout();
                    this.keycount++;
                    
                    // Line finished
                    if(this.currGuess.index >= this.lines[this.currGuess.line].keywords.length) {
                        this.currGuess.line++;
                        this.currGuess.index = 0;
                    }
                    var currKeyword = this.lines[this.currGuess.line].keywords[this.currGuess.index];
                    // Register guessed word
                    if(currKeyword) currKeyword.guess = this.currfcl[this.bases[i].wordid];
                    // Finishing guess
                    if(this.keycount >= this.keynb) this.check();
                    else this.currGuess.index++;
                    return;
                }
            }
        }
    };
    
    function sortKeyword(a, b) {
        if(a.offset < b.offset)
        	return -1;
        else if(a.offset > b.offset)
        	return 1;
        else return 0;
    }
    this.presetColoredText = function(ctx, font, text, colormap, width, lineHeight) {
        var lines = wrapTextWithWrapIndice(text, ctx, width, font);
        
        var prevFont = ctx.font;
        ctx.font = font;
        var keywords = [];
        for(var i in lines) {
            // Offset map
            var offsets = [];
            for(var word in colormap) {
                // Reg exp for this word
                var exp = new RegExp("((^"+word+"[\\'\\s\\,\\.])|([\\'\\s\\,\\.]"+word+"[\\'\\s\\,\\.])|([\\'\\s\\,\\.]"+word+"$))", "gi");
                while (exp.test(lines[i])===true) {
                    var index = exp.lastIndex-word.length-1;
                    var offset = ctx.measureText(lines[i].substr(0, index)).width;
                    var str = lines[i].substr(index, word.length);
                    var length = ctx.measureText(str).width;
                    offsets.push({'word': str, 'offset':offset, 'length':length, 'guess':""});
                }
            }
            offsets.sort(sortKeyword);
            keywords.push(offsets);
        }
        ctx.font = prevFont;
        var res = [];
        this.keynb = 0;
        for(var i in lines) {
            this.keynb += keywords[i].length;
            res.push({text:lines[i], keywords:keywords[i]});
        }
        return res;
    };
    this.drawColoredText = function(ctx) {
        ctx.textAlign = "left";
        ctx.font = "20px Arial";
        var y = 100, x = 100;
        for(var i in this.lines) {
            ctx.fillStyle = "#fff";
            ctx.fillText(this.lines[i].text, x, y);
            for(var j in this.lines[i].keywords) {
                var keyword = this.lines[i].keywords[j];
                if(this.state != "START") {
                    ctx.fillStyle = "#fff";
                    ctx.shadowBlur = 8;
                    ctx.fillRect(x+keyword.offset, y, keyword.length, 20);
                    ctx.shadowBlur = 0;
                    if(keyword.guess != "") {
                        ctx.fillStyle = this.colormap[keyword.guess];
                        ctx.fillText(keyword.guess, x+keyword.offset, y);
                    }
                }
                else {
                    ctx.fillStyle = this.colormap[keyword.word.toLowerCase()];
                    ctx.fillText(keyword.word, x+keyword.offset, y);
                }
            }
            y += size.question.lh;
        }
    };
    
    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.offx, this.offy);
        back.draw(ctx);
        for(var i in this.bases) {
            this.bases[i].draw(ctx);
        }
        // Draw fourchelangue
        if(this.state != "INIT") this.drawColoredText(ctx);
        // Draw Time
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.shadowBlur = 5;
        var timestr = Math.floor(this.currTime/600) +""+ Math.floor((this.currTime%600)/60) +":"+ Math.floor((this.currTime%60)/10) +""+ Math.floor(this.currTime%10);
        ctx.fillText(timestr, 530, 30);
        // Draw level
        ctx.fillText("Niveau "+(this.mode+1), 40, 30);
        
        // Draw help text
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowBlur = 10;
        ctx.translate(300,200);
        if(this.state == "INIT") {
            ctx.fillText("Mémorise vite la phrase qui va suivre", 0,-80);
            ctx.fillText("puis fais la répéter par les rats !", 0,-40);
            ctx.fillText("Clique pour commencer...", 0,0);
        }
        else if(this.currTime > 6.5 && this.currTime < 7.5)
            ctx.fillText("3", 0,0);
        else if(this.currTime > 7.5 && this.currTime < 8.5)
            ctx.fillText("2", 0,0);
        else if(this.currTime > 8.5 && this.currTime < 9.5)
            ctx.fillText("1", 0,0);
        ctx.shadowBlur = 0;
        ctx.translate(-300,-200);
        
        if(this.state == "FAIL") {
            wrong.draw(ctx);
            replaybn.draw(ctx);
            passbn.draw(ctx);
        }
        else if(this.state == "SUCCESS") {
            right.draw(ctx);
            levelupbn.draw(ctx);
            passbn.draw(ctx);
        }
        
        ctx.restore();
    };
    this.logic = function(delta) {
        if(this.state == "START" && this.currTime > 10) {
            this.state = "PLAYING";
            this.keycount = 0;
        }
    
        for(var i in this.bases) {
            this.bases[i].logic();
        }
        if(this.state != "INIT") this.currTime += delta/1000;
    };
    
    this.clickcb = new mse.Callback(this.clicked, this);
};
extend(Fourchelangue, mse.Game);