const testData = {
    ride: {
        start_lat: 70,
        start_long: 100,
        end_lat: -80,
        end_long: -20,
        rider_name: 'Neo',
        driver_name: 'Morpheus',
        driver_vehicle: 'Nebuchadnezzar',
    },

    rideValidated: {
        startLat: 70,
        startLong: 100,
        endLat: -80,
        endLong: -20,
        riderName: 'Neo',
        driverName: 'Morpheus',
        driverVehicle: 'Nebuchadnezzar',
    },

    rideResponse: {
        rideID: 1,
        start_lat: 70,
        start_long: 100,
        end_lat: -80,
        end_long: -20,
        rider_name: 'Neo',
        driver_name: 'Morpheus',
        driver_vehicle: 'Nebuchadnezzar',
    },

    validationError: {
        statusCode: 'VALIDATION_ERR',
        message: 'Rider name must be a non empty string',
    },

    notFoundError: {
        statusCode: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not found rides',
    },
};

module.exports = testData;
