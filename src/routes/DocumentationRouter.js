const express = require('express');
const redoc = require('redoc-express');
const logger = require('../util/logger');

const DocumentationRouter = express.Router({ mergeParams: true });

DocumentationRouter.get('/swagger.yaml', (req, res) => {
    try {
        res.sendFile('swagger.yaml', { root: '.' });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            statusCode: 500,
            statusMessage: 'InternalServiceError',
            message: 'Something went wrong',
        });
    }
});

DocumentationRouter.get('/rides.yaml', (req, res) => {
    try {
        res.sendFile('api.yaml', { root: './docs/rides' });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            statusCode: 500,
            statusMessage: 'InternalServiceError',
            message: 'Something went wrong',
        });
    }
});

DocumentationRouter.get('/rides/api.yaml', (req, res) => {
    try {
        res.sendFile('api.yaml', { root: './docs/rides' });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            statusCode: 500,
            statusMessage: 'InternalServiceError',
            message: 'Something went wrong',
        });
    }
});

DocumentationRouter.get('/rides/schema.yaml', (req, res) => {
    try {
        res.sendFile('schema.yaml', { root: './docs/rides' });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            statusCode: 500,
            statusMessage: 'InternalServiceError',
            message: 'Something went wrong',
        });
    }
});

DocumentationRouter.get('/utils.yaml', (req, res) => {
    try {
        res.sendFile('utils.yaml', { root: './docs' });
    } catch (error) {
        logger.error(error);

        res.status(500).json({
            statusCode: 500,
            statusMessage: 'InternalServiceError',
            message: 'Something went wrong',
        });
    }
});

DocumentationRouter.get(
    '/',
    redoc({
        title: 'API Docs',
        specUrl: '/docs/swagger.yaml',
    }),
);

module.exports = DocumentationRouter;
