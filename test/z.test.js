import test from 'tape';
import client from '../src/db/client';
import query from '../src/db/query';

test.onFinish(() => {

  query(client, 'DELETE FROM events;', [], (error) => {
    if (!error) {
      process.exit(0);
    }
  });
});
