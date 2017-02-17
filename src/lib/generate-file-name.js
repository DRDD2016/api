import uuid from 'uuid/v1';

/**
 * Generate a random file name
 * @param {string} filename
 * @returns {string} - random string name
 */

export default function generateFileName (filename) {
  // extract extension
  const extRegEx = /(?:\.([^.]+))?$/;
  const ext = extRegEx.exec(filename)[1]; // this will give us two parts: filename and extension, we target extension
  return `${uuid()}.${ext}`;
}
