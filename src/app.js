'use strict';

const express = require('express');
const app = express();
const redoc = require('redoc-express');

module.exports = () => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.get(
        '/docs',
        redoc({
            title: 'API Docs',
            specUrl: '/docs/swagger.yaml',
        })
    );

    app.get('/docs/swagger.yaml', (req, res) => {
        res.sendFile('swagger.yaml', { root: '.' });
    });

    return app;
};
