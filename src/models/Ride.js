const Ride = (database, logger) => {
    return {
        async create(ride) {
            const insertFields = Object
                .keys(ride)
                .reduce((query, field) => query + ', ' + field);
            const placeholders = Object
                .keys(ride)
                .reduce((query, field, i) => {
                    return i === 0 ?
                        query :
                        query + ', ' + '?';
                }, '?');
            const insertValues = Object.values(ride);
            const query = `INSERT INTO Rides(${insertFields}) VALUES (${placeholders})`;

            try {
                const result = await database.run(query, insertValues);
                const newRide = await this.get(result.lastID);

                return newRide;
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        async get(id) {
            const query = 'SELECT * FROM Rides WHERE rideID = ?';

            try {
                const ride = await database.all(query, id);

                return ride[0];
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        async getPage(limit, offset) {
            const query = 'SELECT * FROM Rides LIMIT ? OFFSET ?';

            try {
                const pagedRows = await database.all(query, [ limit, offset ]);

                return pagedRows;
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },

        async countAll() {
            const query = 'SELECT COUNT(*) AS total FROM Rides';

            try {
                const [ rowsCount ]  = await database.all(query);
                const ridesTotal = rowsCount.total;

                return ridesTotal;
            } catch (err) {
                logger.error({
                    message: err.message,
                    code: err.code,
                });

                throw err;
            }
        },
    };
};

module.exports = Ride;
