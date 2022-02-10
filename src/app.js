'use strict';

const express = require('express');
const app = express();
const redoc = require('redoc-express');
const logger = require('./util/logger');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            logger.error({
                message: 'Validation error:' +
                    'start latitude and longitude must be between' +
                    '-90 - 90 and -180 to 180 degrees respectively',
                details: {
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    riderName,
                    driverName,
                    driverVehicle,
                },
            });

            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            logger.error({
                message: 'Validation error:' +
                    'end latitude and longitude must be between' +
                    '-90 - 90 and -180 to 180 degrees respectively',
                details: {
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    riderName,
                    driverName,
                    driverVehicle,
                },
            });

            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            logger.error({
                message: 'Validation error: rider name must be a non empty string',
                details: {
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    riderName,
                    driverName,
                    driverVehicle,
                },
            });

            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            logger.error({
                message: 'Validation error: rider name must be a non empty string',
                details: {
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    riderName,
                    driverName,
                    driverVehicle,
                },
            });

            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            logger.error({
                message: 'Validation error: rider name must be a non empty string',
                details: {
                    startLatitude,
                    startLongitude,
                    endLatitude,
                    endLongitude,
                    riderName,
                    driverName,
                    driverVehicle,
                },
            });

            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string',
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
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

            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
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

                res.send(rows);
            });
        });
    });

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
