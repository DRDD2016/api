import uuid from 'uuid/v1';

/**
 * Generate a random file name with pre name of sparkuser
 * @param {string} filename
 * @returns {string} - random string name e.g sparkuser14898989797979.jpg
 */

export default function generateFileName (filename) {
  // extract extension from the filename using regex
  const extRegEx = /(?:\.([^.]+))?$/;
  const ext = extRegEx.exec(filename)[1]; // this will give us two parts: filename and extension, we target extension
  // const date = new Date().getTime();
  return `${uuid()}.${ext}`;
}
