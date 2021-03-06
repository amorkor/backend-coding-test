const RideService = (rideModel, logger) => {
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
                const ride = await rideModel.get(id);

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
            try {
                const ridesTotal = await rideModel.countAll();

                if (ridesTotal === 0) {
                    throw {
                        code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides',
                    };
                }

                limit = (isNaN(limit) || limit < 1 || limit > ridesTotal) ?
                    ridesTotal :
                    limit;
                const pagesTotal = Math.ceil(ridesTotal / limit);
                page = isNaN(page) ? 1 : page;
                page = Math.min(pagesTotal, Math.max(page, 1));
                const offset = limit * (page - 1);

                const pagedRows = await rideModel.getPage(limit, offset);

                return {
                    pagesTotal,
                    currentPage: page,
                    pagedRows,
                };
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

