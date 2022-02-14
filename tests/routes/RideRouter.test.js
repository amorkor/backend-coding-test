'use strict';

const { assert } = require('chai');
const request = require('supertest');
const buildSchemas = require('../../src/database/schemas');

const {
    ride,
    rideResponse,
    validationError,
    notFoundError,
} = require('../data');

module.exports = (app, database) => {
    describe('API', () => {
        before(async () => {
            await buildSchemas(database);
        });

        after(async () => {
            await database.run('DROP TABLE IF EXISTS Rides');
        });

        describe('GET /health', () => {
            it('should return health', (done) => {
                request(app)
                    .get('/health')
                    .expect('Content-Type', /text/)
                    .expect(200, done);
            });
        });

        describe('POST /rides', () => {
            it('should return 200 OK & new ride', (done) => {
                request(app)
                    .post('/rides')
                    .set('Content-Type', 'application/json')
                    .send(ride)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.rideID,
                            rideResponse.rideID,
                            'recieved correct ride'
                        );

                        done();
                    });
            });

            it('should return 422 & validation error object', (done) => {
                request(app)
                    .post('/rides')
                    .set('Content-Type', 'application/json')
                    .send({
                        ...ride,
                        rider_name: '',
                    })
                    .expect('Content-Type', /json/)
                    .expect(422)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.statusCode,
                            validationError.statusCode,
                            'recieved validation error',
                        );
                        assert.typeOf(
                            res.body.details,
                            'object',
                            'recieved details',
                        );

                        done();
                    });
            });
        });

        describe('GET /rides/{id}', async () => {
            it('should return 200 OK & correct ride', (done) => {
                request(app)
                    .get('/rides/1')
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.rideID,
                            rideResponse.rideID,
                            'recieved correct ride',
                        );

                        done();
                    });
            });

            it('should return 404 & not found error object', (done) => {
                request(app)
                    .get('/rides/-1')
                    .expect('content-type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.statusCode,
                            notFoundError.statusCode,
                            'recieved not found error',
                        );

                        done();
                    });
            });
        });

        describe('GET /rides', async () => {
            before(async () => {
                await Promise.all([
                    request(app)
                        .post('/rides')
                        .set('Content-Type', 'application/json')
                        .send(ride)
                        .expect(200),
                    request(app)
                        .post('/rides')
                        .set('Content-Type', 'application/json')
                        .send(ride)
                        .expect(200),
                    request(app)
                        .post('/rides')
                        .set('Content-Type', 'application/json')
                        .send(ride)
                        .expect(200),
                ]);
            });

            afterEach(async () => {
                await database.run('DELETE FROM Rides');
            });

            it('should return 200 OK & page with rides', (done) => {
                request(app)
                    .get('/rides?limit=1')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.property(
                            res.body,
                            'pagedRows',
                            'object has rides',
                        );
                        assert.equal(
                            res.body.pagedRows.length,
                            1,
                            'object has correct amount of rides',
                        );

                        done();
                    });
            });


            it('should return 404 & not found error object', (done) => {
                request(app)
                    .get('/rides')
                    .expect('content-type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.statuscode,
                            notFoundError.statuscode,
                            'recieved not found error',
                        );

                        done();
                    });
            });
        });
    });
};
