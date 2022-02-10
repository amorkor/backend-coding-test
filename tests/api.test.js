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

    describe('Testing /rides endpoint', () => {
        describe('Creating ride', () => {
            const { ride, rideResponse, validationError } = testData;

            after((done) => {
                db.run('DELETE FROM Rides');
                done();
            });

            it('should create new ride', (done) => {
                request(app)
                    .post('/rides')
                    .set('Content-Type', 'application/json')
                    .send(ride)
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });

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
            const { ride, validationError } = testData;

            before((done) => {
                Promise.all([
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
                ]).then(() => done());
            });

            after((done) => {
                db.run('DELETE FROM Rides');
                done();
            });

            describe('GET /rides', () => {
                it('without queries should return page with all rides', (done) => {
                    request(app)
                        .get('/rides')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object with rides',
                            );
                            assert.property(
                                res.body,
                                'pagedRows',
                                'recieved object has fetched rides',
                            );
                            assert.equal(
                                res.body.pagedRows.length,
                                3,
                                'recieved object has all rides',
                            );

                            done();
                        });
                });

                it('with invalid limit should return page with all rides', (done) => {
                    request(app)
                        .get('/rides?limit=dummy')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object with rides',
                            );
                            assert.property(
                                res.body,
                                'pagedRows',
                                'recieved object has fetched rides',
                            );
                            assert.equal(
                                res.body.pagedRows.length,
                                3,
                                'recieved object has all rides',
                            );

                            done();
                        });
                });

                it('with page < 1 should return first page', (done) => {
                    request(app)
                        .get('/rides?limit=1&page=-1')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object with rides',
                            );
                            assert.property(
                                res.body,
                                'pagedRows',
                                'recieved object has fetched rides',
                            );
                            assert.equal(
                                res.body.pagedRows.length,
                                1,
                                'one ride per page',
                            );
                            assert.equal(
                                res.body.currentPage,
                                1,
                                'recieved first page',
                            );

                            done();
                        });
                });

                it('with page > total pages should last page', (done) => {
                    request(app)
                        .get('/rides?limit=1&page=10000000')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                            assert.typeOf(
                                res.body,
                                'object',
                                'recieved object with rides',
                            );
                            assert.property(
                                res.body,
                                'pagedRows',
                                'recieved object has fetched rides',
                            );
                            assert.equal(
                                res.body.pagedRows.length,
                                1,
                                'one ride per page',
                            );
                            assert.equal(
                                res.body.currentPage,
                                3,
                                'recieved last page',
                            );

                            done();
                        });
                });
            });


            it('should return not found message', (done) => {
                request(app)
                    .get('/rides/-1')
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
