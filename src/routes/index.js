// import * as healthCheckRoute from './healthcheck.route'
// import * as collectionNameRoute from './collectionname.route'
// import * as financeRoute from './finance.route'
import userRoute from './user.route'
import todoRoute from './todo.route'

const routes = [
  // ...healthCheckRoute,
  // ...collectionNameRoute,
  // ...financeRoute,
  ...userRoute,
  ...todoRoute
];

export default routes;
