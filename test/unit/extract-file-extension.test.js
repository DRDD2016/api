import test from 'blue-tape';
import extractFileExtension from '../../src/lib/extract-file-extension';

test('`extractFileExtension` works', (t) => {
  t.plan(1);

  const filename = 'MyPhoto.jpg';
  const result = extractFileExtension(filename);
  const expected = 'jpg';
  t.equal(result, expected ,'extracts correct file extension');
});
