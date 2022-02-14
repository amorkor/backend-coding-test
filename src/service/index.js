const initModels = require('../models');
const logger = require('../util/logger');

const RideService = require('./RideService');

module.exports = async (database) => {
    const { rideModel } = await initModels(database);

    const rideService = RideService(rideModel, logger);

    return {
        rideService,
    };
};

