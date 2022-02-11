const RideService = require('../service/RideService');
const logger = require('../util/logger');
const router = require('express').Router();

const RideRouter = (database) => {
    const rideService = RideService(database, logger);

    router.post('/', async (req, res) => {
        const ride = {
            startLat: Number(req.body.start_lat),
            startLong: Number(req.body.start_long),
            endLat: Number(req.body.end_lat),
            endLong: Number(req.body.end_long),
            riderName: req.body.rider_name,
            driverName: req.body.driver_name,
            driverVehicle: req.body.driver_vehicle,
        };

        try {
            const newRide = await rideService.create(ride);

            res.status(200).send(newRide);
        } catch (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });

            if (err.code === 'VALIDATION_ERR') {
                return res
                    .status(422)
                    .json({
                        statusCode: err.code,
                        message: 'Invalid data recieved. Check details',
                        details: err.details,
                    });
            }

            return res
                .status(500)
                .json({
                    statusCode: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
        }
    });

    router.get('/', async (req, res) => {
        const { limit, page } = req.query;

        try {
            const pagedRides = await rideService
                .getPage(Number(limit), Number(page));

            res.status(200).send(pagedRides);
        } catch (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });

            if (err.code === 'RIDES_NOT_FOUND_ERROR') {
                return res
                    .status(404)
                    .json({
                        statusCode: err.code,
                        message: 'Could not find any rides',
                    });
            }

            return res
                .status(500)
                .json({
                    statusCode: 'SERVER_ERROR',
                    message: 'Unknown error',
                });
        }
    });

    return router;
};

module.exports = RideRouter;
