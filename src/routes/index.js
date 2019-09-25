const healthCheckRoute = require('./healthcheck.route');
const collectionNameRoute = require('./collectionname.route');

const routes = [
  ...healthCheckRoute,
  ...collectionNameRoute
];

module.exports = routes;
