var Stack = function(capacity) {
    var arr = [];
    if(!isNaN(capacity) && capacity > 0) this.capacity = capacity;
    else this.capacity = 20;
    
    this.push = function(obj) {
        while(arr.length >= this.capacity)
            arr.shift();
        arr.push(obj);
    };
    this.pop = function() {
        return arr.pop();
    };
};

var Command = function() {
};
Command.prototype = {
    constructor: Command,
    execute: function() {
        // var args = Array.prototype.slice.call(arguments);
        // this.dofn.apply(caller, args);
    },
    undo: function() {
    }
};