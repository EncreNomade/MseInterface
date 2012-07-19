describe("Show the #popup_dialog elem",function(){
    var pop, jqObj;
    beforeEach(function() {
        pop = new Popup();
        jqObj = $('#popup_dialog');
        pop.show();
    });
    
    it("is visible for jQuery ", function(){
        expect(jqObj.is(':visible')).toBe(true);
    });
    
    it('is "display: block" in css', function(){
        expect(jqObj.css('display')).toBe('block');
    });
    
    it('has z-index greater than 80', function(){
        var z = jqObj.css('z-index');
        expect(parseInt(z)).toBeGreaterThan(80);
    });
});

describe("Hide the #popup_dialog elem",function(){
    var pop, jqObj;
    beforeEach(function() {
        pop = new Popup();
        jqObj = $('#popup_dialog');
        pop.hide();
    });
    
    it("is not visible for jQuery",function(){
        expect(jqObj.is(':visible')).toBe(false);
    });
    
    it('is "display: none" in css',function(){
        expect(jqObj.css('display')).toBe('none');
    });
});

describe("Close the popup",function(){
    var pop;
    beforeEach(function() {
        pop = new Popup();
        spyOn(pop,'hide');
        pop.show();
        pop.close();
    });
    
    it("The hide function is called", function(){
        expect(pop.hide).toHaveBeenCalled();
    });
    
    it("'caller' property is reset to null", function(){
        expect(pop.caller).toBe(null);
    });    
});

describe("addButton to popup",function(){
    var pop;
    beforeEach(function() {
        pop = new Popup();
    });
    
    it("After adding there are one child more to buttons list", function(){
        pop.showPopup('Unit Test PopUp', 400, 330, 'confirm');
        var before = pop.buttons.children().length;
        pop.addButton('<input id="unit" type="button" value="unit test" />');
        var after = pop.buttons.children().length;
        pop.close();
        
        expect(after).toBe(before+1);
    });
    
    it("After adding, the button is effectivly present in buttons list", function(){
        pop.showPopup('Unit Test PopUp', 400, 330, 'confirm');
        pop.addButton('<input id="unit" type="button" value="unit test" />');
        expect(pop.buttons.children('#unit').length).toBe(1);
    });
});

describe("showAlert in popup",function(){
    var pop;
    beforeEach(function() {
        pop = new Popup();
    });
    
    it("After call, there are one more alert.h2 elem in main",function(){
        pop.showPopup('Unit Test PopUp', 400, 330, 'confirm');
        var before = pop.main.children('h2.alert').length;
        pop.showAlert('unit test alert');
        var after = pop.main.children('h2.alert').length;
        
        expect(after).toBe(before+1);
    });
    
    it("after 2 call, there are only one alert",function(){
        pop.showPopup('Unit Test PopUp', 400, 330, 'confirm');
        pop.showAlert('unit test alert');
        pop.showAlert('unit test alert 2');
        
        expect(pop.main.children('h2.alert').length).toBe(1);
    });
    
    it("after 2 call, the alert text is exatly the second message",function(){
        pop.showPopup('Unit Test PopUp', 400, 330, 'confirm');
        pop.showAlert('first message');
        pop.showAlert('second message');
        
        expect(pop.main.children('h2.alert').text()).toBe('second message');
        pop.close();
    });
});

describe("showPopup function",function(){
    var pop;
    beforeEach(function(){
        pop = new Popup();
        spyOn(pop, 'show');
        spyOn(pop, 'addButton');
    });
    afterEach(function(){
        pop.close();
    });

    it("refuse a call with no paramaters",function(){
        pop.showPopup();
        expect(pop.show).not.toHaveBeenCalled();
    });

    it("refuse a call with not valid paramaters ('test', 'test', 'test')",function(){
        pop.showPopup('test', 'test', 'test');
        expect(pop.show).not.toHaveBeenCalled();
    });

    it("accept a call with valid paramaters ('test', 200, 200)",function(){
        pop.showPopup('test', 200, 200);
        expect(pop.show).toHaveBeenCalled();
    });

    it("really display the message passed",function(){
        pop.showPopup('test', 200, 200);
        var res = pop.titre.children('span').html();
        expect(res).toBe('test');
    });

    it("really have the width and height passed",function(){
        pop.showPopup('test', 200, 200);
        var bool =  false;
        if(pop.dialog.css('width') == pop.dialog.css('height') && pop.dialog.css('width') == '200px') 
            bool = true;
        expect(bool).toBe(true);
    });

    it("called the addButton if a confirm message is passed",function(){
        pop.showPopup('test', 200, 200, 'confirm');
        expect(pop.addButton).toHaveBeenCalled();
    });
    it("have the passed confirm message as value of the button",function(){
        pop.showPopup('test', 200, 200, 'confirm');
        expect(pop.confirm.val()).toBe('confirm');
    });
    it("set the caller if one is passed", function(){
        pop.showPopup('test', 200, 200, 'confirm', 'callerTest');
        expect(pop.caller).toBe('callerTest');
    });
});






















    
   