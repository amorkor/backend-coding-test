'use strict';

const request = require('supertest');
const { assert } = require('chai');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');
const testData = require('./data');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('Testing /ride endpoint', () => {
        describe('Creating ride', () => {
            const { ride, validationError } = testData;

            it('should create new ride', (done) => {
                request(app)
                    .post('/rides')
                    .set('Content-Type', 'application/json')
                    .send(ride)
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });
            describe('Try to insert invalid data', () => {
                it('should not pass empty rider name', (done) => {
                    request(app)
                        .post('/rides')
                        .set('Content-Type', 'application/json')
                        .send({
                            ...ride,
                            rider_name: '',
                        })
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object',
                            );
                            assert.equal(
                                res.body.errorCode,
                                validationError.errorCode,
                                'recieved validation error',
                            );

                            done();
                        });
                });

                it('should not pass start latitude > 90', (done) => {
                    request(app)
                        .post('/rides')
                        .set('content-type', 'application/json')
                        .send({
                            ...ride,
                            start_lat: 100,
                        })
                        .expect('content-type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object',
                            );
                            assert.equal(
                                res.body.errorcode,
                                validationError.errorcode,
                                'recieved validation error',
                            );

                            done();
                        });
                });

                it('should not pass end longitude > 190', (done) => {
                    request(app)
                        .post('/rides')
                        .set('content-type', 'application/json')
                        .send({
                            ...ride,
                            end_long: 190,
                        })
                        .expect('content-type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object',
                            );
                            assert.equal(
                                res.body.errorcode,
                                validationError.errorcode,
                                'recieved validation error',
                            );

                            done();
                        });
                });

                it('should not pass empty driver name', (done) => {
                    request(app)
                        .post('/rides')
                        .set('content-type', 'application/json')
                        .send({
                            ...ride,
                            driver_name: '',
                        })
                        .expect('content-type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object',
                            );
                            assert.equal(
                                res.body.errorcode,
                                validationError.errorcode,
                                'recieved validation error',
                            );

                            done();
                        });
                });

                it('should not pass empty driver vehicle', (done) => {
                    request(app)
                        .post('/rides')
                        .set('content-type', 'application/json')
                        .send({
                            ...ride,
                            driver_vehicle: '',
                        })
                        .expect('content-type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object',
                            );
                            assert.equal(
                                res.body.errorcode,
                                validationError.errorcode,
                                'recieved validation error',
                            );

                            done();
                        });
                });
            });
        });

        describe('Fetching rides', () => {
            const { rideResponse, validationError } = testData;

            it('should return the same created ride', (done) => {
                request(app)
                    .get(`/rides/${rideResponse.rideID}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.equal(
                            res.body[0].rideID,
                            rideResponse.rideID,
                            'recieved correct ride',
                        );

                        done();
                    });
            });

            it('should return array of all rides', (done) => {
                request(app)
                    .get('/rides')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'array',
                            'recieved array of rides',
                        );

                        done();
                    });
            });

            it('should return not found message', (done) => {
                request(app)
                    .get('/rides/5')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                        assert.typeOf(
                            res.body,
                            'object',
                            'recieved object',
                        );
                        assert.equal(
                            res.body.errorcode,
                            validationError.errorcode,
                            'recieved validation error',
                        );

                        done();
                    });
            });
        });

    });
});
