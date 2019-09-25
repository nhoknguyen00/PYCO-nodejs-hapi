const healthCheckRoute = require('./healthcheck.route');
const collectionNameRoute = require('./collectionname.route');
const financeRoute = require('./finance.route')

const routes = [
  ...healthCheckRoute,
  ...collectionNameRoute,
  ...financeRoute
];

module.exports = routes;
