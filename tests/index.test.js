const rideRouterTest = require('./routes/RideRouter.test');

const startApp = require('../src/app');

(async () => {
    const { app, database } = await startApp();

    rideRouterTest(app, database);

    run();
})();
