import { Pool } from 'pg';
let config = {
  max: '20',
  idleTimeoutMillis: 3000
};
/* istanbul ignore else */
/* istanbul ignore next */
if (process.env.CIRCLECI) {
  config.database = 'circle_test';
} else if (process.env.LOCAL && !process.env.TEST) {
  config.user = process.env.PG_USER;
  config.password = process.env.PG_PASSWORD;
  config.host = process.env.PG_HOST;
  config.port = process.env.PG_PORT;
  config.database = process.env.PG_DATABASE;
  config.ssl = true;
} else if (process.env.TEST) {
  config.database = 'spark';
} else {
  config.user = process.env.PG_USER;
  config.password = process.env.PG_PASSWORD;
  config.host = process.env.PG_HOST;
  config.port = process.env.PG_PORT;
  config.database = process.env.PG_DATABASE;
  config.ssl = true;
}
console.log(config);
const client = new Pool(config);

export default client;
