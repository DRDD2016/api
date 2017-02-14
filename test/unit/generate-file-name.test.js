import test from 'blue-tape';
import generateFileName from '../../src/lib/generate-file-name';

test('`generateFileName` works', (t) => {
  t.plan(1);

  const filename = 'MyPhoto.jpg';
  const result = generateFileName(filename);
  const preName = 'sparkuser';
  t.ok(result.includes(preName), 'generates random file name with pre name of sparkuser');
});
