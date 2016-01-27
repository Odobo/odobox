/**
 * Created by petermares on 13/11/2015.
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