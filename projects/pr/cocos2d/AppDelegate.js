var cc = cc = cc || {};

cc.AppDelegate = cc.Application.extend({
    ctor:function () {
        this._super();
    },
    initInstance:function () {
        return true;
    },
    applicationDidFinishLaunching:function () {
        var pDirector = cc.Director.sharedDirector();

        pDirector.setDisplayFPS(false);
        pDirector.setAnimationInterval(1.0 / 60);
		
		
		var game = new FindSimon();
		
		game.init();
		
        var pScene = game.scene();
		
		
		pDirector.pause();
		
        pDirector.runWithScene(pScene);
        return true;
    },

    applicationDidEnterBackground:function () {
        cc.Director.sharedDirector().pause();
    },
    applicationWillEnterForeground:function () {
        cc.Director.sharedDirector().resume();
    }
});