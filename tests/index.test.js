const rideModelTest = require('./models/Ride.test');
const rideRouterTest = require('./routes/RideRouter.test');
const rideServiceTest = require('./service/RideService.test');
const documentRouterTest = require('./routes/DocumentRouter.test');

const { connect } = require('../src/database');
const initModels= require('../src/models');
const initServices = require('../src/service');
const startApp = require('../src/app');

(async () => {
    const database = await connect(':memory:');
    const app = await startApp();

    const { rideModel } = await initModels();
    const { rideService } = await initServices();

    rideModelTest(rideModel, database);
    rideServiceTest(rideService, database);
    rideRouterTest(app, database);
    documentRouterTest(app);

    run();
})();
