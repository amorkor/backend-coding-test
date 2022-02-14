const request = require('supertest');

module.exports = (app) => {
    return describe('DOCS', () => {
        describe('GET /docs', () => {
            it('should return rendered html', (done) => {
                request(app)
                    .get('/docs')
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .expect(200, done);
            });
        });

        describe('GET /docs/swagger.yaml', () => {
            it('should return swagger.yaml file', (done) => {
                request(app)
                    .get('/docs/swagger.yaml')
                    .expect('Content-Type', 'text/yaml; charset=UTF-8')
                    .expect(200, done);
            });

            it('should return rides.yaml file', (done) => {
                request(app)
                    .get('/docs/rides.yaml')
                    .expect('Content-Type', 'text/yaml; charset=UTF-8')
                    .expect(200, done);
            });

            it('should return api.yaml file', (done) => {
                request(app)
                    .get('/docs/rides/api.yaml')
                    .expect('Content-Type', 'text/yaml; charset=UTF-8')
                    .expect(200, done);
            });

            it('should return schema.yaml file', (done) => {
                request(app)
                    .get('/docs/rides/schema.yaml')
                    .expect('Content-Type', 'text/yaml; charset=UTF-8')
                    .expect(200, done);
            });

            it('should return utils.yaml file', (done) => {
                request(app)
                    .get('/docs/utils.yaml')
                    .expect('Content-Type', 'text/yaml; charset=UTF-8')
                    .expect(200, done);
            });
        });
    });
};
