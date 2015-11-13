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
                logger.error('resolveObjectPath ERROR! Path lookup failed (' + path + ')');
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

    return o;
})();