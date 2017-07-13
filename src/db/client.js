import { Pool } from 'pg';
let config = {
  max: '20',
  idleTimeoutMillis: 3000
};
/* istanbul ignore else */
/* istanbul ignore next */
console.info(config);
if (process.env.CIRCLECI) {
  config.database = 'circle_test';
} else if (process.env.TEST) {
  config.database = 'spark';
} else if (process.env.NODE_ENV === 'production' || process.env.REMOTE_DB) {
  config.user = process.env.PG_USER;
  config.password = process.env.PG_PASSWORD;
  config.host = process.env.PG_HOST;
  config.port = process.env.PG_PORT;
  config.database = process.env.PG_DATABASE;
  config.ssl = true;
} else {
  config.database = 'spark';
}

console.info(config);
const client = new Pool(config);

export default client;
