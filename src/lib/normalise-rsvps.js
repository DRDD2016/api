/**
 * normaliseRsvps adds missing properties to an rsvp object
 * @returns {object} - object with all expected keys
 *                     @param {array} going
 *                     @param {array} maybe
 *                     @param {array} not_going
 *                     @param {array} not_responded
 * @param {object} rsvps - rsvp object
 */

export default function normaliseRsvps (rsvps) {

  const keys = ['going', 'maybe', 'not_going', 'not_responded'];

  return keys.reduce((newRsvps, key) => {
    if (rsvps.hasOwnProperty(key)) {
      newRsvps[key] = rsvps[key];
    } else {
      newRsvps[key] = [];
    }
    return newRsvps;
  }, {});
}
