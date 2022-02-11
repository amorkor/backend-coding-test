'use strict';

const express = require('express');
const app = express();
const redoc = require('redoc-express');
const logger = require('./util/logger');

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.get('/rides/:id', (req, res) => {
        db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
            if (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
            }

            if (rows.length === 0) {
                logger.error({
                    message: 'Could not found any rides',
                });

                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides',
                });
            }

            res.send(rows);
        });
    });

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

    return app;
};
