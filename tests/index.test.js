const rideModelTest = require('./models/Ride.test');
const rideRouterTest = require('./routes/RideRouter.test');

const startApp = require('../src/app');

(async () => {
    const { app, database } = await startApp();

    rideModelTest(database);
    rideRouterTest(app, database);

    run();
})();
