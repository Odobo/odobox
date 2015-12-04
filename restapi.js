/**
 * Created by carribus on 03/12/15.
 */

var Router = require('vertx-web-js/router'),
    BodyHandler = require("vertx-web-js/body_handler"),
    bus = vertx.eventBus(),
    server = vertx.createHttpServer(),
    router = Router.router(vertx)
var logger = Java.type("io.vertx.core.logging.LoggerFactory").getLogger('OdoboX:RestAPI');

module.exports = function() {
    var o = {};
    var BUS_ADDRESSES = [
        {
            address: "restapi.register",
            handler: _registerRESTEndpoint
        },
        {
            address: "restapi.unregister",
            handler: _unregisterRESTEndpoint
        },
        {
            address: "restapi.status",
            handler: _restStatus
        }
    ];

    var paths = {
        endpoints: {}
    };

    var status = 'stopped';

    /**
     * Registers the RestAPI eventbus addresses and starts listening on the configured interfaces and ports
     *
     * Expected Config Structure:
     *
     * {
     *  host: String,
     *  port: Number
     * }
     *
     * @param config
     */
    o.start = function(config, cb) {
        if ( 'stopped' == status ) {
            // enable body handling on all routes
            router.route().handler(BodyHandler.create().handle);

            server.requestHandler(router.accept).listen(config.port, config.host, function(res, err) {
                if ( !err ) {
                    logger.info('REST API available on: ' + config.host + ':' + config.port)

                    // register the event bus addresses
                    BUS_ADDRESSES.forEach(function (e) {
                        logger.info('[RESTAPI] Registering address: ' + e.address);
                        e.consumer = bus.consumer(e.address);
                        e.consumer
                            .handler(e.handler)
                            .completionHandler(function (res, err) {
                                if (err) {
                                    logger.info('[RESTAPI] ' + e.address + ' registration failed across the cluster!');
                                }
                            });
                    });

                    // register the utility endpoint(s)
                    _registerUtilityEndpoints();

                    status = 'started';
                    cb(true);
                    //startFuture.complete();
                } else {
                    //startFuture.fail();
                    cb(false);
                }
            });
        }
    };

    /**
     * Stops listening on the interfaces/ports
     * @param cb
     */
    o.stop = function(cb) {
        // TODO: Write the cleanup logic here
        if ( 'started' == status ) {
            status = 'stopped';
            cb(true);
        } else {
            cb(false);
        }
    };

    /**
     *
     * @param message
     * @private
     */
    function _registerRESTEndpoint(message) {
        var body = message.body();

        if ( _validateMessage(body) ) {
            logger.info('[RESTAPI] Registering [' + body.method + ']' + '/' + body.resource + '/' + body.endpoint);
            var route = router.route(body.method, '/' + body.resource + '/' + body.endpoint);

            if ( body.method != 'GET' && body.expects ) {
                route.consumes(body.expects);
            }
            if ( body.produces ) {
                route.produces(body.produces);
            }

            route
                .handler(function(routingContext) {
                    var response = routingContext.response();
                    var request = routingContext.request();
                    var bodyData;
                    var headers = request.headers().names();

                    if ( body.expects ) {
                        bodyData = body.expects == 'application/json'
                            ? routingContext.getBodyAsJson()
                            : routingContext.getBody()
                    }

                    response.setChunked(true);
                    if ( body.produces ) {
                        response.putHeader('content-type', routingContext.getAcceptableContentType());
                    }

                    logger.info('[RESTAPI] Handling call on [' + body.method + '] /' + body.resource + '/' + body.endpoint);

                    var headerObj = {
                        'X-Received-Via': 'RestAPI'
                    };
                    headers.forEach(function(h) {
                        headerObj[h] = request.headers().get(h);
                    });

                    switch ( body.method.toLowerCase() ) {
                        case    'get':
                            bodyData = _parseQueryStringToObject(request.query());
                            break;

                        default:
                            break;
                    }

                    bus.send(body.address, bodyData ? bodyData : {}, {
                        "headers": headerObj
                    }, function(reply, err) {
                        logger.info('[RESTAPI] Reply received: ' + JSON.stringify(reply.body()));
                        response.write(JSON.stringify(reply.body()));
                        response.end();
                    });
                });

            paths.endpoints["/" + body.resource + "/" + body.endpoint] = {
                method: body.method
            };
        }
    }

    /**
     *
     * @param message
     * @private
     */
    function _unregisterRESTEndpoint(message) {
        // TOOD: Complete this
        logger.info('[RESTAPI] _unregisterRESTEndpoint: ' + JSON.stringify(message));
    }

    /**
     *
     * @param message
     * @private
     */
    function _restStatus(message) {
        var result = [];

        for ( var p in paths.endpoints ) {
            result.push({
                path: p,
                method: paths.endpoints[p].method
            });
        }

        message.reply({
            endpoints: result
        });
    }

    /**
     *
     * @param m
     * @returns {string|*|string}
     * @private
     */
    function _validateMessage(m) {
        return (m.resource && m.endpoint);
    }

    /**
     *
     * @private
     */
    function _registerUtilityEndpoints() {
        bus.send('restapi.register', {
            resource: 'restapi',
            endpoint: 'status',
            method: 'GET',
            address: 'restapi.status'
        });
    }

    /**
     *
     * @param str
     * @returns {{}}
     * @private
     */
    function _parseQueryStringToObject(str) {
        var a1 = str.split('&');
        var res = {};
        a1.forEach(function(e) {
            var c = e.split('=');
            res[c[0]] = c[1];
        });

        return res;
    }

    return o;
};