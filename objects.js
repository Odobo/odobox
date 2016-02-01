/*

 The MIT License (MIT)
 Copyright (c) 2016 Odobo Limited

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in the
 Software without restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so, subject to the
 following conditions:

 The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.

 */
module.exports = (function() {
    var o = {};

    o.getChildObject = function(obj, path, sep) {
        var sep = sep || '.';
        var path = path.split(sep);

        path.every(function (p) {
            if (obj[p]) {
                obj = obj[p];
            } else {
                logger.warn('resolveObjectPath ERROR! Path lookup failed (' + path + ')');
                obj = null;
            }
            return obj;
        });
        return obj;
    };

    o.ensureObject = function(obj, prop) {
        if ( !obj[prop] ) {
            obj[prop] = {}
        }
        return obj;
    };

    o.validateObjectHasProperties = function(obj, propArray) {
        if ( Array.isArray(propArray) ) {
            return propArray.every(function(p) {
                return obj.hasOwnProperty(p);
            });
        }
        return false;
    };

    o.ensureArray = function(o) {
        return (Array.isArray(o) ? o : [o]);
    };


    o.isInArray = function (value, array) {
        return array.indexOf(value) > -1;
    };

    o.removeValueFromArray = function (value, array) {
        var index = array.indexOf(value);
        if(index > -1){
            array.splice(index, 1);
        }
    }

    return o;
})();