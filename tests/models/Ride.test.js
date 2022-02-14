const { assert } = require('chai');
const { rideValidated, rideResponse } = require('../data.js');
const buildSchemas = require('../../src/database/schemas');

module.exports = (rideModel, database) => {
    describe('RideModel', () => {
        before(async () => {
            await buildSchemas(database);
        });

        after(async () => {
            await database.run('DROP TABLE IF EXISTS Rides');
        });

        describe('#create', () => {
            it('should create new ride', async () => {
                const ride = await rideModel.create(rideValidated);
                assert.isOk(ride, 'returns instance');
                assert.equal(
                    ride.rideID,
                    rideResponse.rideID,
                    'correctly inserts instance',
                );
            });
        });

        describe('#get', () => {
            it('should return correct ride', async () => {
                const ride = await rideModel.get(rideResponse.rideID);
                assert.isOk(ride, 'returns instance');
                assert.equal(
                    ride.rideID,
                    rideResponse.rideID,
                    'returns correct instance',
                );
            });
        });

        describe('Operations on mulitple instances', () => {
            before(async () => {
                await Promise.all([
                    rideModel.create(rideValidated),
                    rideModel.create(rideValidated),
                ]);
            });

            describe('#getPage', () => {
                it('Should return page with rides', async () => {
                    const limit = 2;
                    const offset = 0;
                    const rides = await rideModel.getPage(limit, offset);

                    assert.typeOf(rides, 'array', 'recieved array');
                    assert.equal(rides.length, 2, 'array is with correct amount of instances');
                    assert.property(rides[0], 'rideID', 'recieved array of rides');
                });

                it('Should return empty result', async () => {
                    const limit = 2;
                    const offset = 4;
                    const rides = await rideModel.getPage(limit, offset);

                    assert.typeOf(rides, 'array', 'recieved array');
                    assert.equal(rides.length, 0, 'array is empty');
                });
            });

            describe('#countAll', () => {
                it('Should return correct count of rides', async () => {
                    const ridesTotal = await rideModel.countAll();

                    assert.typeOf(ridesTotal, 'number', 'recieved number');
                    assert.equal(ridesTotal, 3, 'recieved correct count');
                });
            });
        });
    });
};
