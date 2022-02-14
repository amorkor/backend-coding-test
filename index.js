'use strict';
const logger = require('./src/util/logger');
const startApp = require('./src/app');

try {
    (async () => {
        startApp();
    })();
} catch (err) {
    logger.error(err);
}
