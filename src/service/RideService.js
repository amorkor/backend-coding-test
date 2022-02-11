const RideModel = require('../models/Ride');

const RideService = (database, logger) => {
    const rideModel = RideModel(database, logger);

    return {
        async create(ride) {
            try {
                const validationErr = this.validate(ride);

                if (validationErr) {
                    throw validationErr;
                }

                const newRide = await rideModel.create(ride);

                return newRide;
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        async get(id) {
            try {
                const [ ride ] = await rideModel.get(id);

                return ride;
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        async getPage(limit, page) {
            const packResponse = async (
                limit,
                offset,
                ridesTotal
            ) => {
                const pagedRows = await rideModel.getPage(limit, offset);
                const pagesTotal = limit < 1 ? 1 : Math.ceil(ridesTotal / limit);
                const currentPage = limit < 1 ? 1 : Math.floor((offset / limit) + 1);

                return {
                    pagesTotal,
                    currentPage,
                    pagedRows,
                };
            };

            try {
                const ridesTotal = await rideModel.countAll();

                if (ridesTotal === 0) {
                    throw {
                        code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides',
                    };
                }

                if (isNaN(limit) || limit < 1) {
                    return packResponse(-1, 0, ridesTotal);
                }

                if (isNaN(page) || page < 1) {
                    return packResponse(limit, 0, ridesTotal);
                }

                /*
                 * Hold offset value in acceptable range
                 * If equal to or exceed upper bound (total amount of rides),
                 * a value which corresponds to the last page is assigned
                 */
                const offset = limit * (page - 1) >= ridesTotal ?
                    limit * (Math.ceil(ridesTotal / limit) - 1) :
                    limit * (page - 1);

                return packResponse(limit, offset, ridesTotal);
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        validate(ride) {
            const details = {};

            if (
                ride.startLat === undefined
                || ride.startLong === undefined
                || ride.startLat < -90
                || ride.startLat > 90
                || ride.startLong < -180
                || ride.startLong > 180
            ) {
                details.startL= [];
                details.startL.push(
                    'start latitude and longitude must be between ' +
                    '-90 - 90 and -180 to 180 degrees respectively'
                );
            }

            if (
                ride.endLat === undefined
                || ride.endLong === undefined
                || ride.endLat < -90
                || ride.endLat > 90
                || ride.endLong < -180
                || ride.endLong > 180
            ) {
                details.endL= [];
                details.endL.push(
                    'end latitude and longitude must be between ' +
                    '-90 - 90 and -180 to 180 degrees respectively'
                );
            }

            if (
                typeof ride.riderName !== 'string'
                || ride.riderName.length < 1
            ) {
                details.riderName = [];
                details.riderName.push(
                    'rider name must be a non empty string'
                );
            }

            if (
                typeof ride.driverName !== 'string'
                || ride.driverName.length < 1
            ) {
                details.driverName = [];
                details.driverName.push(
                    'driver name must be a non empty string'
                );
            }

            if (
                typeof ride.driverVehicle !== 'string'
                || ride.driverVehicle.length < 1
            ) {
                details.driverVehicle = [];
                details.driverVehicle.push(
                    'driver vehicle must be a non empty string'
                );
            }

            if (Object.values(details).length > 0) {
                return {
                    code: 'VALIDATION_ERR',
                    message: 'Invalid ride data',
                    details,
                };
            }
        },
    };
};

module.exports = RideService;

