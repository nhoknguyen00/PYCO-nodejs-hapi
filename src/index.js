'use strict';

import Hapi from '@hapi/hapi';
import routes from './routes'
import plugins from './plugins'
import config from './config'
import { connect } from './mongodb'
import moment from 'moment';
import debug from './utils/debug.utils'

const NAMESPACE = `APP-${moment.utc().toISOString()}`

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host
  });
  server.route(routes);
  await server.register(plugins);
  await server.start();
  debug.log(NAMESPACE, 'INFO: Server running on %s', server.info.uri);
  connect();
};

process.on('unhandledRejection', (err) => {
  debug.err(err.message);
  process.exit(1);
});

init();
