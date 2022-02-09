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
            const { ride } = testData;

            it('should create new ride', (done) => {
                request(app)
                    .post('/rides')
                    .set('Content-Type', 'application/json')
                    .send(ride)
                    .expect('Content-Type', /json/)
                    .expect(200, done);
            });
        });

        describe('Fetching rides', () => {
            const { rideResponse } = testData;

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
        });

    });
});
