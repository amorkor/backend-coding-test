const { connect } = require('../database');
const RideModel = require('./Ride');
const logger = require('../util/logger');

module.exports = async (database) => {
    const rideModel = RideModel(database, logger);

    return {
        rideModel,
    };
};
