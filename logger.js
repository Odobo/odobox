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
            if ( _settingsMap.get(_methods[i]) == true ) {
                return _methods[i];
            }
        }
        return 'undefined';
    };

    this.error = function() {
        if ( typeof arguments[0] == 'object' ) {
            jLogger.error('[' + _id + '] ERROR: ' + JSON.stringify(arguments[0]));
        } else {
            jLogger.error('[' + _id + '] ERROR: ' + arguments[0]);
        }
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