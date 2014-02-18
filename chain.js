/**
 * @param {Object?} settings
 * @returns {Chain}
 * @constructor
 */
function Chain(settings){
    if (!(this instanceof Chain)) {
        return new Chain(settings);
    }

    this.data = null;

    if (settings) {
        settings.data && (this.data = settings.data);
    }

    this._cbs = [];

    this._finish = null;

    this._index = -1;
    this._timer = null;

    return this;
}

Chain.prototype.then = function(fn){
    this._cbs.push(fn);

    return this;
};

Chain.prototype.finish = function(fn) {
    this._finish = fn;
    return this;
};

Chain.prototype._error = function(){
    console.log('STOP _error()');
};

Chain.prototype.run = function(){
    this._run();
    return this;
};

Chain.prototype._timeout = function(){
    console.log('TIMEOUT');
};

Chain.prototype._run = function(){
    var fn;

    this._index++;

    fn = this._cbs[this._index];

    clearTimeout(this._timer);

    this._timer = setTimeout(this._timeout.bind(this), 2000);

    if (typeof fn == 'function') {
        try {
            fn.call(this, this._run.bind(this), this._error.bind(this), this.data);
        } catch (e) {
            console.log('CATCH', e);
            clearTimeout(this._timer);
        }
    }
    else if (fn instanceof Chain) {
        var self = this;

        fn.finish(function(r) {
            self._run();
        }).run();
    }
    else {
        clearTimeout(this._timer);
        if (typeof this._finish === 'function') {
            this._finish();
        }
    }
};

/*********************/
/*
var app1 = {
    a1 : function(r){
        console.log('a1');
        setTimeout(r, 300);
    },
    b1 : function(r){
        console.log('b1');
        setTimeout(r, 300);
    },
    a2 : function(r){
        console.log('a2');
        setTimeout(r, 300);
    },
    b2 : function(r){
        console.log('b2');
        setTimeout(r, 300);
    }
};

var c1 = Chain()
    .then(app1.a1)
    .then(app1.b1);

var c2 = Chain()
    .then(c1)
    .then(app1.a2)
    .then(app1.b2);

c2.run();*/
