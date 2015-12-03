/**
 * Created by petermares on 28/10/2015.
 */

var bus = vertx.eventBus();
var StringsX = require('./strings')

module.exports = (function() {
    var o = {};
    var _client = vertx.createHttpClient();

    /**
     * Abstraction for making http(s) requests
     *
     * Format of options parameter:
     *
     * {
     *  method: String, // POST/GET/DELETE/UPDATE etc
     *  host: String,
     *  port: Number,   // Optional: defaults to 80
     *  path: String,   // URI
     *  body: Object    // Optional
     * }
     *
     * @param opts
     * @param callback
     */
    o.request = function(opts, callback) {
        opts.method = opts.method || 'POST';
        console.log('[OdoboX.http.request] ' + opts.host + ':' + opts.port);
        console.log('[OdoboX.http.request] ' + opts.method + '\t' + opts.path);

        var request = _client.request(opts.method, opts.port ? opts.port : 80, opts.host, opts.path, function (resp) {
            resp.exceptionHandler(function(e) {
                console.log('!! OdoboX.http.request Socket Exception: ' + e);
            });

            resp.bodyHandler(function (buffer) {
                var result = {
                    code: resp.statusCode(),
                    msg: resp.statusMessage()
                };

                var body = buffer.toString('UTF-8');

                if (opts.includeResponseHeaders) {
                    result.headers = {}
                    resp.headers().forEach(function (key, value) {
                        result.headers[key] = value;
                    });
                }

                callback(result, body);
            })
        });

        if (opts.headers) {
            for (h in opts.headers) {
                request.putHeader(h, opts.headers[h]);
            }
        }

        // TODO: Should we put an accepts header here??
        if (opts.body) {
            if (!opts.headers['Content-Type']) {
                if ( typeof opts.body == 'object' ) {
                    request.putHeader('Content-Type', 'application/json');
                } else {
                    request.putHeader('Content-Type', 'text/plain');
                }
            }
            if ( typeof opts.body == 'object' ) {
                opts.body = JSON.stringify(opts.body);
            }
            request
                .putHeader('Content-Length', StringsX.lengthInUtf8Bytes(opts.body))
                .write(new vertx.Buffer(opts.body))
        }

        request.end();

    };

    return o;
})();