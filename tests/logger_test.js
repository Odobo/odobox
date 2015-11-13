/**
 * Created by petermares on 12/11/2015.
 */
var logger = require('../logger')('logger-test');

logger.setLogLevel('debug');

logger.info(logger.id);
logger.warn('WARNING!');
logger.debug('DEBUG!');
logger.trace('TRACE!');


