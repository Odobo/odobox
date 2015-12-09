/**
 * Created by petermares on 13/11/2015.
 */

function LoggerX(id) {
    var _this = this;
    var MAP_KEY = 'LoggerX';
    var _methods = [
        "warn",
        "info",
        "trace",
        "debug"
    ];
    var _id = id;

    // establish a local map initially and then, if in clustered config, try and get the cluster wide map
    var _settingsMap = vertx.sharedData().getLocalMap(MAP_KEY);

    // the vertx logger object
    var jLogger = Java.type("io.vertx.core.logging.LoggerFactory").getLogger(id);

    this.id = function() {
        return _id;
    };

    this.getSupportedMethods = function() {
        return [].concat(_methods);
    };

    this.setLogLevel = function(type) {
        var setting = true;
        if ( _methods.indexOf(type) != -1 ) {
            _methods.forEach(function(m) {
                _settingsMap.put(m, setting);
                if ( m == type ) setting ^= true;
            });
        } else {
            jLogger.warn('No log type: ' + type);
        }
    };

    this.getLogLevel = function() {
        for ( var i = _methods.length-1; i >= 0; i-- ) {
            if ( this.settingsMap.get(_methods[i]) == true ) {
                return _methods[i];
            }
        }
        return 'undefined';
    };

    if ( jLogger ) {
        _methods.forEach(function(m) {
            // create the initial set of log settings (all false)
            if ( _settingsMap.get(m) == undefined ) {
                _settingsMap.put(m, false);
            }
            // create the logging methods from the methods array
            _this[m] = function() {
                var method = _settingsMap.get(m) ? 'info' : null;
                if ( method ) {
                    if ( typeof arguments[0] == 'object' ) {
                        jLogger[method]('[' + _id + '] ' + JSON.stringify(arguments[0]));
                    } else {
                        jLogger[method]('[' + _id + '] ' + arguments[0]);
                    }
                }
            }
        });
    }

    this.setLogLevel('info');

    return this;
}


module.exports = LoggerX;