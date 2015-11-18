/**
 * Created by petermares on 22/10/2015.
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
            bus.send('restapi.register', {
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