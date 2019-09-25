'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const plugins = require('./plugins')
const config = require('./config');
const { connect } = require('./mongodb');

const init = async () => {
    const server = Hapi.server({
        port: config.port,
        host: config.host
    });
    server.route(routes);
    await server.register(plugins);
    await server.start();
    console.info('INFO: Server running on %s', server.info.uri);
    connect();
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
