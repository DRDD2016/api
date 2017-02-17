/**
 * Extractfile extension
 * @param {string} filename
 * @returns {string} - extension
 */

export default function extractFileExtension (filename) {
  const extRegEx = /(?:\.([^.]+))?$/;
  return extRegEx.exec(filename)[1];
}
