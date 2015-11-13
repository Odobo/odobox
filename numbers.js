/**
 * Created by petermares on 13/11/2015.
 */
module.exports = (function() {
    var o = {};

    /**
     * Utility function to calculate the number of bytes in a UTF-8 encoded string
     * @param str
     * @returns {*}
     */
    o.ensureNumber = function(val, parseFunc) {
        if ( typeof parseFunc == 'function' ) {
            parsefunc = parseFunc || parseInt;
        } else {
            parseFunc = parseInt;
        }

        if ( val !== 'undefined' && val !== null ) {
            val = parseFunc(val);
            if ( isNaN(val) ) {
                val = 0;
            }
        } else {
            val = 0;
        }
        return val;
    };

    o.isNumeric = function(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }

    return o;
})();