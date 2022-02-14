const initModels = require('../models');
const logger = require('../util/logger');

const RideService = require('./RideService');

module.exports = async () => {
    const { rideModel } = await initModels();

    const rideService = RideService(rideModel, logger);

    return {
        rideService,
    };
};

