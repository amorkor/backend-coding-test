'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

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

    describe('POST /rides', () => {
        it('should return JSON object', (done) => {
            const ride = {
                startLatitude: 70,
                startLongitude: 100,
                endLatitude: -80,
                endLongitude: -20,
                riderName: 'Neo',
                driverName: 'Morpheus',
                driverVehicle: 'Nebuchadnezzar',
            };

            request(app)
                .post('/rides')
                .set('Content-Type', 'application/json')
                .send(ride)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /rides', () => {
        it('should return JSON object', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /rides/{id}', () => {
        const rideId = 1;

        it('should return JSON object', (done) => {
            request(app)
                .get(`/rides/${rideId}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});
