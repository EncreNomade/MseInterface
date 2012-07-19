describe("Transform a simple object to a class object", function() {
    it("Object 1 should be transformed to Animation", function() {
        
        var jsonstr = '{"name":"fouine","repeat":"1","statiq":true,"frames":[{"interval":0.025,"objs":{"obj567":{"dx":0,"dy":0,"dw":800,"dh":600,"opacity":1,"color":"rgb(255, 255, 255)"},"src0":{"dx":250,"dy":100,"dw":300,"dh":409,"opacity":1,"w":500,"h":682,"sx":0,"sy":0,"sw":500,"sh":682}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.3,"objs":{"obj567":{"dx":0,"dy":0,"dw":800,"dh":600,"opacity":0,"color":"rgb(255, 255, 255)"},"src0":{"dx":250,"dy":100,"dw":300,"dh":409,"opacity":0,"w":500,"h":682,"sx":0,"sy":0,"sw":500,"sh":682}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.25,"objs":{"obj567":{"dx":0,"dy":0,"dw":800,"dh":600,"opacity":1,"color":"rgb(255, 255, 255)"},"src0":{"dx":250,"dy":100,"dw":300,"dh":409,"opacity":1,"w":500,"h":682,"sx":0,"sy":0,"sw":500,"sh":682}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.25,"objs":{"obj567":{"dx":0,"dy":0,"dw":800,"dh":600,"opacity":1,"color":"rgb(255, 255, 255)"},"src0":{"dx":250,"dy":100,"dw":300,"dh":409,"opacity":1,"w":500,"h":682,"sx":0,"sy":0,"sw":500,"sh":682}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.025,"objs":{"obj567":{"dx":0,"dy":0,"dw":800,"dh":600,"opacity":0,"color":"rgb(255, 255, 255)"},"src0":{"dx":0,"dy":-200,"dw":800,"dh":1090,"opacity":0,"w":500,"h":682,"sx":0,"sy":0,"sw":500,"sh":682}},"trans":{"pos":2,"size":2,"opac":2,"font":2}}],"objs":{"obj567":{"type":"rect"},"src0":{"type":"image"}},"block":true}';
        
        var obj = JSON.parse(jsonstr);
        var res = objToClass(obj, Animation);
        
        expect(res).toEqual(jasmine.any(Animation));
        for(var key in obj) {
            expect(res[key]).toEqual(obj[key]);
        }
    });
    
    it("Object 2 should be transformed to Animation", function() {
        var jsonstr = '{"name":"simcour","repeat":"1","statiq":true,"frames":[{"interval":0.5,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":0,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":1,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":1,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":0,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":0,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":1,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":1,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":0,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":0,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":1,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":1,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":298,"dy":344,"dw":301,"dh":255,"opacity":0,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":0,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":1,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":1,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":0,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}}],"objs":{"src6":{"type":"spriteRecut"}},"block":true}';
        
        var obj = JSON.parse(jsonstr);
        var res = objToClass(obj, Animation);
        
        expect(res).toEqual(jasmine.any(Animation));
        for(var key in obj) {
            expect(res[key]).toEqual(obj[key]);
        }
    });
    
    it("Object 3 should be transformed to Wiki", function() {
        var jsonstr = '{"font":"Verdana","fsize":"14","fcolor":"#000","name":"pCeinture","cards":[{"type":"text","sections":[{"title":"La Petite Ceinture","type":"text","content":"La Petite Ceinture est une ancienne ligne de chemin de fer longue de 32 km qui faisait le tour de Paris.\\nElle fut terminée en 1869 et destinée au trafic de marchandises et de voyageurs. Concurrencée par le métro, elle est définitivement fermée au trafic des voyageurs en 1985. Le trafic de marchandise est totalement arrêté au début des années 1990."},{"title":"Lien Wikipédia","type":"link","content":"http://fr.wikipedia.org/wiki/Ligne_de_Petite_Ceinture"}]},{"type":"text","sections":[{"title":"Biodiversité","type":"text","content":"Elle est considérée comme une réserve de biodiversité. On peut y observer de nombreuses variétés d’arbres, de plantes et la plus grande colonie de chauve-souris de l’espèce pipistrelle d’Ile de France. \\nLa ville de Paris y aménage des parcours pédagogiques, proposant ainsi un nouveau type de promenade nature à Paris."},{"title":"Lien Mairie de Paris","type":"link","content":"http://www.paris.fr/loisirs/se-promener-a-paris/balades-au-vert/decouvrir-les-richesses-de-la-petite-ceinture/rub_9660_stand_53584_port_23803"}]},{"type":"img","image":"src26","legend":"Vue des voies de la Petite Ceinture dans le 13e arrondissement"},{"type":"img","image":"src27","legend":"La Petite Ceinture traverse le Parc Montsouris"},{"type":"img","image":"src28","legend":"La gare de Charonne, aujourd\'hui café La Flèche d\'Or"}]}';
        
        var obj = JSON.parse(jsonstr);
        var res = objToClass(obj, Wiki);
        
        expect(res).toEqual(jasmine.any(Wiki));
        for(var key in obj) {
            expect(res[key]).toEqual(obj[key]);
        }
    });
    
    it("Object 4 should be transformed to Speaker", function() {
        var jsonstr = '{"name":"simon","portrait":{"neutre":null},"color":"#467291","srcId":"src31"}';
        
        var obj = JSON.parse(jsonstr);
        var res = objToClass(obj, Speaker);
        
        expect(res).toEqual(jasmine.any(Speaker));
        for(var key in obj) {
            expect(res[key]).toEqual(obj[key]);
        }
    });
});



describe("Deep clone test", function() {
    it("Clone of simple type data: number, boolean, string, null, undefined", function() {
        expect(clone(0)).toEqual(0);
        expect(clone(15)).toEqual(15);
        expect(clone(true)).toBe(true);
        expect(clone(false)).toBe(false);
        expect(clone("panda")).toBe("panda");
        expect(clone("")).toBe("");
        expect(clone(null)).toBe(null);
        expect(clone(undefined)).toBe(undefined);
    });
    
    it("Clone of Date type object", function() {
        var date = new Date();
        expect(clone(date)).toEqual(date);
        expect(clone(date)).not.toBe(date);
    });
    
    it("Clone of Array object", function() {
        var array = new Array();
        for(var i = 0; i < 20; ++i) 
            array.push(new Date());
        
        var res = clone(array);
        expect(res).toEqual(jasmine.any(Array));
        expect(res).toEqual(array);
        expect(res).not.toBe(array);
    });
    
    it("Deep clone of object complicated like a Animation object", function() {
        var jsonstr = '{"name":"simcour","repeat":"1","statiq":true,"frames":[{"interval":0.5,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":0,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":1,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":1,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":120,"dh":255,"opacity":0,"w":638,"h":256,"sx":186,"sy":0,"sw":119,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":0,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":1,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":1,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":200,"dy":344,"dw":263,"dh":255,"opacity":0,"w":638,"h":256,"sx":362,"sy":0,"sw":260,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":0,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":1,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":296,"dy":344,"dw":301,"dh":255,"opacity":1,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":298,"dy":344,"dw":301,"dh":255,"opacity":0,"w":638,"h":256,"sx":0,"sy":0,"sw":299,"sh":254}},"trans":{"pos":1,"size":1,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":0,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":1,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.12,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":1,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}},{"interval":0.1,"objs":{"src6":{"dx":396,"dy":344,"dw":201,"dh":255,"opacity":0,"w":638,"h":256,"sx":302,"sy":0,"sw":199,"sh":254}},"trans":{"pos":2,"size":2,"opac":2,"font":2}}],"objs":{"src6":{"type":"spriteRecut"}},"block":true}';
        
        var obj = JSON.parse(jsonstr);
        var anime = objToClass(obj, Animation);
        
        var res = clone(anime);
        expect(res).toEqual(jasmine.any(Animation));
        expect(res).toEqual(anime);
        expect(res.frames).toEqual(anime.frames);
        expect(res.frames).not.toBe(anime.frames);
        expect(res.frames[0]).toEqual(anime.frames[0]);
        expect(res.frames[0]).not.toBe(anime.frames[0]);
    });
});



describe("Initialisation of a Callback object", function() {
    var a = 0;
    var caller = {};
    var fn = function() {
        a++;
    };
    
    it("Normal construction of Callback", function() {
        var callback = new Callback(fn, caller);
        expect(callback).toEqual(jasmine.any(Callback));
    });
    
    it("Fail construction of Callback", function() {
        callback = new Callback(a, caller);
        expect(callback).toEqual({});
    });
    
    it("Construction of Callback with incorrect caller and some arguments", function() {
        callback = new Callback(fn, a, 1, true);
        expect(callback).toEqual(jasmine.any(Callback));
        expect(callback.caller).toBe(window);
        expect(callback.args.length).toEqual(2);
    });
});


describe("Invocation of a Callback object", function() {
    var a = {n:0};
    var caller = {};
    caller.fn = function(b, c) {
        a.n++;
        if(b) a.n = a.n + b;
        if(c) a.n = a.n * c;
    };
    caller.fn2 = function() {
        a.n += 10;
    };
    caller.fn3 = function() {
        a.n += 100;
    };
    
    beforeEach(function() {
        a.n = 0;
        spyOn(caller, 'fn').andCallThrough();
        spyOn(caller, 'fn2').andCallThrough();
        spyOn(caller, 'fn3').andCallThrough();
    });
    
    it("Normal invocation", function() {
        callback = new Callback(caller.fn, caller);
        callback.invoke();
        expect(caller.fn).toHaveBeenCalled();
        expect(a.n).toEqual(1);
    });
    
    it("Invocation with arguments", function() {
        callback = new Callback(caller.fn, caller, 1, true);
        callback.invoke();
        expect(caller.fn).toHaveBeenCalledWith(1, true);
        expect(a.n).toEqual(2);
    });
    
    it("Invocation with arguments and additional arguments", function() {
        callback = new Callback(caller.fn, caller, 1);
        callback.invoke(3);
        expect(caller.fn).toHaveBeenCalledWith(1, 3);
        expect(a.n).toEqual(6);
    });
    
    it("Invocation with arguments and linked callbacks", function() {
        callback = new Callback(caller.fn, caller, 1);
        callback.link(new Callback(caller.fn2, caller));
        callback.link(new Callback(caller.fn3, caller));
        callback.invoke(3);
        expect(caller.fn).toHaveBeenCalledWith(1, 3);
        expect(caller.fn2).toHaveBeenCalled();
        expect(caller.fn3).toHaveBeenCalled();
        expect(a.n).toEqual(116);
    });
});