const { assert } = require('chai');
const buildSchemas = require('../../src/database/schemas');
const {
    rideValidated,
    rideResponse,
    validationError,
} = require('../data.js');

module.exports = (rideService, database) => {
    describe('RideService', () => {
        before(async () => {
            await buildSchemas(database);
        });

        after(async () => {
            await database.run('DROP TABLE IF EXISTS Rides');
        });

        describe('#validate', () => {
            it('should pass correct ride', async () => {
                const err = await rideService.validate(rideValidated);
                assert.isNotOk(err, 'returns null');
            });

            it('should not pass empty rider name', async () => {
                const err = await rideService.validate({
                    ...rideValidated,
                    riderName: '',
                });
                assert.isOk(err, 'returns error');
                assert.equal(
                    err.code,
                    validationError.statusCode,
                    'recieved validation error',
                );
            });

            it('should not pass start latitude > 90', async () => {
                const err = await rideService.validate({
                    ...rideValidated,
                    startLat: 100,
                });
                assert.isOk(err, 'returns error');
                assert.equal(
                    err.code,
                    validationError.statusCode,
                    'recieved validation error',
                );
            });

            it('should not pass end longitude > 190', async () => {
                const err = await rideService.validate({
                    ...rideValidated,
                    endLong: 190,
                });
                assert.isOk(err, 'returns error');
                assert.equal(
                    err.code,
                    validationError.statusCode,
                    'recieved validation error',
                );
            });

            it('should not pass empty driver name', async () => {
                const err = await rideService.validate({
                    ...rideValidated,
                    driverName: '',
                });
                assert.isOk(err, 'returns error');
                assert.equal(
                    err.code,
                    validationError.statusCode,
                    'recieved validation error',
                );
            });

            it('should not pass empty driver vehicle', async () => {
                const err = await rideService.validate({
                    ...rideValidated,
                    driverVehicle: '',
                });
                assert.isOk(err, 'returns error');
                assert.equal(
                    err.code,
                    validationError.statusCode,
                    'recieved validation error',
                );
            });
        });

        describe('#create', () => {
            it('should create new ride', async () => {
                const newRide = await rideService.create(rideValidated);
                assert.isOk(newRide, 'returns instance');
                assert.equal(
                    newRide.rideID,
                    rideResponse.rideID,
                    'correctly inserts instance',
                );
            });
        });

        describe('#get', () => {
            it('should return correct ride', async () => {
                const ride = await rideService.get(rideResponse.rideID);
                assert.isOk(ride, 'returns instance');
                assert.equal(
                    ride.rideID,
                    rideResponse.rideID,
                    'returns correct instance',
                );
            });
        });

        describe('#getPage', () => {
            before(async () => {
                await Promise.all([
                    rideService.create(rideValidated),
                    rideService.create(rideValidated),
                ]);
            });

            it('Should return page with rides', async () => {
                const limit = 2;
                const page = 1;
                const response = await rideService.getPage(limit, page);

                assert.typeOf(response, 'object', 'recieved object');
                assert.typeOf(response.pagedRows, 'array', 'object has pages');
                assert.equal(response.pagesTotal, 2, 'object has correct amount of pages');
                assert.property(response.pagedRows[0], 'rideID', 'page contains rides');
                assert.equal(response.pagedRows.length, 2, 'page has correct amount of instances');
            });

            describe('Invalid parameters', () => {
                it('limit = undef, page = undef -> page with all rides', async () => {
                    const response = await rideService.getPage();

                    assert.typeOf(response, 'object', 'recieved object');
                    assert.typeOf(response.pagedRows, 'array', 'object has pages');
                    assert.equal(response.pagesTotal, 1, 'object has correct amount of pages');
                    assert.property(response.pagedRows[0], 'rideID', 'page contains rides');
                    assert.equal(response.pagedRows.length, 3, 'page has correct amount of instances');
                });

                it('limit > totalPages, page = undef -> page with all response', async () => {
                    const limit = 10;
                    const response = await rideService.getPage(limit);

                    assert.typeOf(response, 'object', 'recieved object');
                    assert.typeOf(response.pagedRows, 'array', 'object has pages');
                    assert.equal(response.pagesTotal, 1, 'object has correct amount of pages');
                    assert.property(response.pagedRows[0], 'rideID', 'page contains rides');
                    assert.equal(response.pagedRows.length, 3, 'page has correct amount of instances');
                });

                it('page > totalPages -> last page', async () => {
                    const limit = 1;
                    const page = 5;
                    const response = await rideService.getPage(limit, page);

                    assert.typeOf(response, 'object', 'recieved object');
                    assert.typeOf(response.pagedRows, 'array', 'object has pages');
                    assert.equal(response.pagesTotal, 3, 'object has correct amount of pages');
                    assert.property(response.pagedRows[0], 'rideID', 'page contains rides');
                    assert.equal(response.pagedRows.length, 1, 'page has correct amount of instances');
                    assert.equal(response.currentPage, 3, 'recieved correct page');
                });
            });
        });
    });
};

