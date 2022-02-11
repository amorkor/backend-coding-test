'use strict';

const express = require('express');
const app = express(); // eslint-disable-line no-unused-vars
const port = 8010;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(); // eslint-disable-line no-unused-vars

const { connect } = require('./src/database');
const logger = require('./src/util/logger');

const buildSchemas = require('./src/database/schemas');

(async () => {
    const db = await connect(':memory:');
    const dbWithCallback = db.getDatabaseInstance();

    await buildSchemas(db);

    const app = require('./src/app')(dbWithCallback);

    app.listen(port, (err) => {
        if (err) {
            logger.error({
                message: err.message,
                code: err.code,
            });
        }

        logger.info(`App started and listening on port ${port}`);
    });

})();
