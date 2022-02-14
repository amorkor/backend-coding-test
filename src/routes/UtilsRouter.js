const UtilRouter = require('express').Router({ mergeParams: true });

UtilRouter.get('/', (req, res) => res.send('Healthy'));

module.exports = UtilRouter;
