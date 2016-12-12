import { Pool } from 'pg';

let config = {
  max: '20',
  idleTimeoutMillis: 3000
};
console.log('----------------', process.env);
/* istanbul ignore else */
/* istanbul ignore next */
if (process.env.CIRCLECI) {
  config.database = 'circle_test';
} else if (process.env.TEST) {
  config.database = 'spark';
} else {
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.host = process.env.PGHOST;
  config.port = process.env.PGPORT;
  config.database = process.env.PGDATABASE;
  config.ssl = true;
}

const pool = new Pool(config);

export default pool;
