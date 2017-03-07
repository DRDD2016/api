import client from '../../db/client';
import getUserById from '../auth/get-user-by-id';
/**
 * Builds feed item object
 * @returns {object} feed item object
 * @param {number} subject_user_id - user id of the subject of the feed item. Either event host or an event invitee
 * @param {object} event - event object
 */

export default function buildFeedItem (subject_user_id, event) {

  return getUserById(client, subject_user_id)
  .then((user) => {
    if (user) {

      return {
        timestamp: new Date().toISOString(),
        event_id: event.event_id,
        name: event.name,
        what: event.what,
        where: event.where,
        when: event.when,
        is_poll: event.is_poll,
        host_user_id: event.host_user_id,
        subject_user_id,
        firstname: user.firstname,
        surname: user.surname,
        photo_url: user.photo_url,
        viewed: false,
        edited: event.edited
      };
    } else {
      return new Error('User does not exist');
    }
  })
  .catch(err => err);

}
