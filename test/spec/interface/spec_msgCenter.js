describe("Getting the message list",function(){
    var list;
    beforeEach(function(){
        list = msgCenter.getList();
    });

    it("return only one element",function(){
        expect(list.length).toBe(1);
    });
    
    it("has #msgCenter as parent",function(){        
        expect(list.parent().prop('id')).toBe('msgCenter');
    });
    
});

describe("Sending messages",function(){
    var time;
    beforeEach(function(){
        time = 3000;
    });
    
    it("One message sent", function() {
        msgCenter.send('unit test', time);
        var isSent = msgCenter.getList().children().length == 1 ? true : false;
        expect(isSent).toBe(true);
    });
    
    it("The message is removed", function(){
        waits(time+1001); // in msgCenter the message is removed at time + 1000 so...
        runs(function(){
            var isRemoved = msgCenter.getList().children().length == 0 ? true : false;
            expect(isRemoved).toBe(true);
        });
    });
    
    it("10 messages sent, only "+msgCenter.getMax()+" viewable",function(){
        for(var i = 0; i < 10; i++)
            msgCenter.send('unit test '+i, time);
            
        waits(time-1000);
        
        runs(function (){
            var nb = msgCenter.getList().children().length;
            expect(nb).toBeLessThan(msgCenter.getMax()+1);
        });
    });
    
});