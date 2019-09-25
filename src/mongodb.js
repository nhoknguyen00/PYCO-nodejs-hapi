const mongoose = require('mongoose');

const config = require('./config');

const connect = () => {
  mongoose.Promise = global.Promise;

  mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    poolSize: 10
  }, err => {
    if (err) {
      console.error('ERROR: An error happened whilst connecting to mongodb', {
        err
      });
    } else {
      console.info('INFO: Connect to mongodb successfully.');
    }
  });
};

const disconnect = done => {
  mongoose.disconnect(done);
};

module.exports = {
  connect,
  disconnect
};
