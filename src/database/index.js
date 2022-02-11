const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

module.exports = {
    async connect(filename) {
        return open({
            filename,
            driver: sqlite3.Database,
        });
    },
};
