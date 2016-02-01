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

var bus = vertx.eventBus();

module.exports = (function() {
    var o = {};

    o.registerBusAddresses = function(prefix, addressArray, restConfig) {
        addressArray.forEach(function(e) {
            // register the address on the event bus
            e.consumer = bus.consumer(prefix + '.' + e.address);
            e.consumer.handler(e.handler);

            // setup a completion handler for the registration result
            // throw up if the registration was not successful
            e.consumer.completionHandler(function(res, err) {
                if ( err ) {
                    throw (e.address + ' registration failed across the cluster: ' + err);
                } else {
                    if ( null != restConfig && restConfig.enabled && e.rest && e.rest.enabled ) {
                        _registerRESTEndpoint(restConfig.resource, e.rest, e.consumer.address());
                    }
                }
            });
        });
    };

    /**
     * Register a single REST endpoint with the RestAPI endpoint
     * @param resource
     * @param endpoint
     * @param address
     * @private
     */
    function _registerRESTEndpoint(resource, endpoint, address) {
        if ( endpoint && typeof endpoint == 'object') {
            bus.publish('restapi.register', {
                "resource": resource,
                endpoint: endpoint.path,
                method: endpoint.method.toUpperCase(),
                expects: endpoint.expects,
                produces: endpoint.produces,
                address: address
            })
        } else {
            throw "REST ENDPOINT REGISTRATION FAILED: Invalid parameter passed to register a REST endpoint!";
        }
    }


    return o;
})();