'use strict';

const express = require('express');
const app = express();
const RideRouter = require('./routes/RideRouter');

const redoc = require('redoc-express');

const { connect } = require('./database');
const buildSchemas = require('./database/schemas');
const logger = require('./util/logger');

const PORT = 8010;

const startApp = async () => {
    const database = await connect(':memory:');
    const rideRouter = RideRouter(database, logger);

    await buildSchemas(database);

    app.use(express.json());

    app.use('/rides', rideRouter);
    app.get('/health', (req, res) => res.send('Healthy'));
    app.get(
        '/docs',
        redoc({
            title: 'API Docs',
            specUrl: '/docs/swagger.yaml',
        })
    );
    app.get('/docs/swagger.yaml', (req, res) => {
        res.sendFile('swagger.yaml', { root: '.' });
    });

    app.listen(PORT, (err) => {
        if (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });
        }

        logger.info(`App started and listening on port ${PORT}`);
    });
};

module.exports = startApp;
