/**
 * Created by petermares on 22/10/2015.
 */

module.exports = (function() {
    var o = {};

    o.eventBus = require('./eventbus');
    o.http = require('./http');
    o.Strings = require('./strings');
    o.guid = require('./guid');

    return o;
})();