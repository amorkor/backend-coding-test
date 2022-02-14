const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const buildSchemas = require('./schemas');

module.exports = {
    async connect(filename) {
        const database = await open({
            filename,
            driver: sqlite3.Database,
        });
        await buildSchemas(database);

        return database;
    },
};
