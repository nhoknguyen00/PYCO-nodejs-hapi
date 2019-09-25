const path = require('path');
const dotenv = require('dotenv');
const pkg = require('./../../package.json');

const envRootPath = path.resolve(process.cwd(), '.env');
const config = {};

config.path = `${envRootPath}`;

dotenv.config(config);

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  basePath: process.env.BASE_PATH,
  mongoUri: process.env.MONGO_URI,
  financeServiceUrl: process.env.FINANCE_SERVICE_URL,
  financeServiceToken: process.env.FINANCE_SERVICE_TOKEN,
  pkg,
};
