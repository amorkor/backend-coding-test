'use strict';

const express = require('express');
const app = express(); // eslint-disable-line no-unused-vars
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(); // eslint-disable-line no-unused-vars

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const logger = require('./src/util/logger');

const buildSchemas = require('./src/schemas');

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.listen(port, (err) => {
        if (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });
        }

        logger.info(`App started and listening on port ${port}`);
    });
});
