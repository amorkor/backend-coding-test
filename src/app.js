'use strict';

const express = require('express');
const app = express();
const redoc = require('redoc-express');
const logger = require('./util/logger');

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.get('/rides', (req, res) => {
        const queryAndPackResponse = (limit, offset, ridesTotal) => {
            db.all(
                'SELECT * FROM Rides LIMIT ? OFFSET ?',
                [ limit, offset ],
                function (err, rides) {
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

                    const pagesTotal = limit < 1 ? 1 : Math.ceil(ridesTotal / limit);
                    const currentPage = limit < 1 ? 1 : Math.floor((offset / limit) + 1);

                    return res.send({
                        pagesTotal,
                        currentPage,
                        pagedRows: rides,
                    });

                });
        };

        const queryAndSendPage = () => {
            return db.all(
                'SELECT COUNT(*) AS total FROM Rides',
                (err, [ rowsCount ]) => {
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
                    const ridesTotal = rowsCount.total;

                    if (ridesTotal === 0) {
                        logger.error({
                            message: 'Could not found any rides',
                        });

                        return res.send({
                            error_code: 'RIDES_NOT_FOUND_ERROR',
                            message: 'Could not find any rides',
                        });
                    }

                    const { limit, page } = req.query;

                    if (isNaN(limit) || limit < 1) {
                        return queryAndPackResponse(-1, 0, ridesTotal);
                    }

                    if (isNaN(page) || page < 1) {
                        return queryAndPackResponse(Number(limit), 0, ridesTotal);
                    }

                    /*
                     * Hold offset value in acceptable range
                     * If equal to or exceed upper bound (total amount of rides),
                     * a value which corresponds to the last page is assigned
                     */
                    const offset = limit * (page - 1) >= ridesTotal ?
                        limit * (Math.ceil(ridesTotal / limit) - 1) :
                        limit * (page - 1);

                    return queryAndPackResponse(Number(limit), offset, ridesTotal);
                }
            );
        };

        return queryAndSendPage();
    });

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
