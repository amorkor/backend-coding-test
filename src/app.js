'use strict';

const express = require('express');
const app = express();

const RideRouter = require('./routes/RideRouter');
const DocumentationRouter = require('./routes/DocumentationRouter');
const UtilsRouter = require('./routes/UtilsRouter');

const initServices = require('./service');
const logger = require('./util/logger');

const PORT = 8010;

const startApp = async () => {
    const { rideService } = await initServices();

    const rideRouter = RideRouter(rideService);

    app.use(express.json());

    app.use('/rides', rideRouter);
    app.use('/health', UtilsRouter);
    app.use('/docs', DocumentationRouter);

    app.listen(PORT, (err) => {
        if (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });
        }

        logger.info(`App started and listening on port ${PORT}`);
    });

    return app;
};

module.exports = startApp;
