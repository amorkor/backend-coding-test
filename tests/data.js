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
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
    },
};

module.exports = testData;
