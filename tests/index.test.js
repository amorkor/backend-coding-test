const rideModelTest = require('./models/Ride.test');
const rideRouterTest = require('./routes/RideRouter.test');
const rideServiceTest = require('./service/RideService.test');

const startApp = require('../src/app');

(async () => {
    const { app, database } = await startApp();

    rideModelTest(database);
    rideServiceTest(database);
    rideRouterTest(app, database);

    run();
})();
