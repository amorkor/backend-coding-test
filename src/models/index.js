const { connect } = require('../database');
const RideModel = require('./Ride');
const logger = require('../util/logger');

module.exports = async () => {
    const database = await connect(':memory:');

    const rideModel = RideModel(database, logger);

    return {
        rideModel,
    };
};
