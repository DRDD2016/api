import test from 'blue-tape';
import generateFileName from '../../src/lib/generate-file-name';

test('`generateFileName` works', (t) => {
  t.plan(1);

  const filename = 'MyPhoto.jpg';
  const result = generateFileName(filename);
  t.equal(result.length, 40, 'generates random file name');
});
