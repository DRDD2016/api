/**
 * Extract file extension
 * @param {string} filename - filename
 * @returns {string} - file extension
 */

export default function extractFileExtension (filename) {
  const extRegEx = /(?:\.([^.]+))?$/;
  return extRegEx.exec(filename)[1];
}
