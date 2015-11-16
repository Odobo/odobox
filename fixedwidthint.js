/**
 * Created by petermares on 16/11/2015.
 */

module.exports = function(x, width) {
    if (x >= Math.pow(2, width - 1)) {
        return x - Math.pow(2, width)
    } else {
        return x;
    }
}