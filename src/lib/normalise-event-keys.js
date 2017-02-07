/**
 * Removes preceding underscores from object's keys
 * @returns {object} - object with preceding underscores removed
 * @param {object} event - event object
 */

export default function normaliseEventKeys (event) {

  return Object.keys(event).reduce((obj, key) => {
    obj[key.replace(/^_/, '')] = event[key];
    return obj;
  }, {});
}
