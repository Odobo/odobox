/**
 * Created by petermares on 28/10/2015.
 */

module.exports = (function() {
    var o = {};

    /**
     * Utility function to calculate the number of bytes in a UTF-8 encoded string
     * @param str
     * @returns {*}
     */
    o.lengthInUtf8Bytes = function(str) {
        var len = 0;
        if (str && str.length) {
            // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
            var m = encodeURIComponent(str).match(/%[89ABab]/g);
            len = str.length + (m ? m.length : 0);
        }
        return len;
    };

    return o;
})();