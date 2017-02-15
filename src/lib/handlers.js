/* eslint-disable no-unused-vars */
import PubSub from 'pubsub-js';
import fs from 'fs';
import os from 'os';
import formidable from 'formidable';
import path from 'path';
import gm from 'gm';
import knoxClient from './knoxClient';

import { UPDATE_FEED } from '../../socket-router';
import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import getUserById from './auth/get-user-by-id';
import updateUser from './auth/update-user';
import updateUserPhoto from './auth/update-user-photo';
import deleteEvent from './events/delete-event';
import addInvitee from './events/add-invitee';
import getEventByCode from './events/get-event-by-code';
import saveVote from './events/save-vote';
import finaliseEvent from './events/finalise-event';
import getRsvps from './events/get-rsvps';
import getEventInvitees from './events/get-invitees-ids';
import saveFeedItem from './events/save-feed-item';
import editEvent from './events/edit-event';
import buildFeedItem from './events/build-feed-item';
import normaliseEventKeys from './normalise-event-keys';
import client from '../db/client';
import shortid from 'shortid';
import generateFileName from './generate-file-name';

export function postEventHandler (req, res, next) { // eslint-disable-line no-unused-vars
  const event = req.body.event;
  if (!event) {
    return res.status(422).send({ error: 'Missing event data' });
  }
  const data = Object.assign(event, { host_user_id: req.user.user_id });
  const code = shortid.generate();
  data.code = code;
  saveEvent(client, data)
    .then(() => {
      res.json({ code });
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
}

export function getEventHandler (req, res, next) {
  Promise.all([
    getEvent(client, req.params.event_id),
    getRsvps(client, req.params.event_id)
  ])
    .then(([event, rsvps]) => {
      if (event) {
        if (rsvps) {
          event.rsvps = rsvps;
        }
        return res.json(event);
      } else {
        return res.status(422).send({ error: 'Could not get event' });
      }
    })
    .catch(err => next(err));
}

export function deleteEventHandler (req, res, next) {
  deleteEvent(client, req.params.event_id)
    .then((deleted_event_id) => {
      res.json(deleted_event_id);
    })
    .catch(err => next(err));
}

export function postRsvpsHandler (req, res, next) {
  const code = req.body.code;
  if (!code) {
    return res.status(422).send({ error: 'No code submitted' });
  }
  getEventByCode(client, code)
    .then((event) => {
      if (!event) {
        return res.status(422).send({ error: 'No event found' });
      }
      addInvitee(client, req.user.user_id, event.event_id)
        .then(() => {
          return res.status(201).json(normaliseEventKeys(event));
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function patchRsvpsHandler (req, res, next) { // eslint-disable-line
  const rsvp = req.body.rsvp;
  if (!rsvp) {
    return res.status(422).send({ error: 'Missing rsvp data' });
  }
  // saveRsvps(client, req.user.user_id, req.params.event_id)
  //   .then(() => {
  //     return res.status(201).json(normaliseEventKeys(event));
  //   })
  //   .catch(err => next(err));
}

export function postVoteHandler (req, res, next) {
  const user_id = req.user.user_id;
  const vote  = req.body.vote;
  const event_id = req.params.event_id;
  saveVote(client, user_id, event_id, vote)
    .then((success) => {
      if (success) {
        res.status(201).end();
      }
    })
    .catch(err => next(err));
}

export function finaliseEventHandler (req, res, next) {
  const hostEventChoices = req.body.hostEventChoices;
  const event_id = req.params.event_id;
  finaliseEvent(client, event_id, hostEventChoices)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not finalise event' });
      }
    })
    .catch(err => next(err));
}

export function getInviteesHandler (req, res, next) {
  const event_id = req.params.event_id;
  getRsvps(client, event_id)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not get invitees' });
      }
    })
    .catch(err => next(err));
}

export function putEventHandler (req, res, next) {
  const event_id = req.params.event_id;
  const event = req.body.event;
  const host_user_id = req.user.user_id;
  editEvent(client, event_id, event)
    .then((data) => {
      if (data) {
        // create feed item
        buildFeedItem(host_user_id, event)
        .then((feedItem) => {
          getEventInvitees(client, event_id)
          .then((inviteesIds) => {
            saveFeedItem(client, inviteesIds, event_id, feedItem)
            .then(() => {
              // push feed items to clients
              PubSub.publish(UPDATE_FEED, { ids: inviteesIds, feedItem });
            })
            .catch(err => next(err));
          })
          .catch(err => next(err));

          return res.status(201).json(data);
        })
        .catch(err => next(err));

      } else {
        return res.status(422).send({ error: 'Could not edit event' });
      }
    })
    .catch(err => next(err));
}

export function getUserHandler (req, res, next) {
  getUserById(client, req.params.user_id)
  .then((user) => {
    if (user) {
      return res.json(user);
    } else {
      return res.status(422).send({ error: 'Could not get user' });
    }
  })
  .catch(err => next(err));
}

export function patchUserHandler (req, res, next) {
  const userData = req.body;
  const user_id = req.params.user_id;
  updateUser(client, user_id, userData)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not update user' });
      }
    })
    .catch(err => next(err));
}

export function postUserPhotoHandler (req, res, next) {
  const user_id = req.user.user_id;
  // const tmpFile = req.body.fileName;
  // const fileName = generateFileName(tmpFile);
  // console.log('fileName', fileName);
  // let newFile = `${os.tmpdir()}/${fileName}`; //access to temporary directory where all the files are stored
  // newFile = `${os.tmpdir()}/${fileName}`;
  let tmpFile, fileName, newFile;
  // console.log('tmpDir', newFile);
  const newForm = new formidable.IncomingForm();
  newForm.keepExtension = true;
  newForm.parse(req, function (err, fields, files) {

    if (err) {
      return next(err);
    }
    tmpFile = files.photo.path; //received file path
    console.log('pathhhh', tmpFile);
    fileName = generateFileName(files.photo.name);
    newFile = `${os.tmpdir()}/${fileName}`; //access to temporary directory where all the files are stored
    console.log('newFile stored in os.tmpdir', newFile);
    res.writeHead(200, { 'Content-type': 'text/plain' });
    res.end();
  });
  //
  newForm.on('end', function () {
    fs.rename(tmpFile, newFile, function () {
      // resize the image and upload to S3 bucket
      // 300 is the width, height will be resized accordingly
      // write method piped new resized file to the same directory
      gm(newFile).resize(300).write(newFile, function () {
        //upload to s3
        fs.readFile(newFile, function (err, buf) {
          console.log('fileName in knox', newFile);
          // let req = knoxClient.put(fileName, {
          //   'Content-Length': buf.length,
          //   'Content-Type': 'image/jpeg',
          //   'x-amz-acl': 'public-read'
          // });
          knoxClient.putFile(newFile, fileName, { 'x-amz-acl': 'public-read' }, function (err, res) {
            console.log('errrrrrrrr', err);
            console.log('ressssssss', res.statusCode);
          });

          // req.on('response', function (res) {
          //   console.log('------------', res.statusMessage, res.statusCode );
          //   if (res.statusCode === 200) {
          //     console.log('res', res);
          //     // This means that the file is in S3 bucket
          //     // save fileName to the database
          //     Promise.all([
          //       updateUserPhoto(client, user_id, fileName),
          //       getUserById(client, user_id)
          //     ])
          //       .then(([data, user]) => {
          //         // delete local file
          //         fs.unlinkSync(newFile);
          //         if (data) {
          //           if (user) {
          //             console.log('user', user);
          //             const photo_url = `https://s3.eu-west-2.amazonaws.com/spark-native/${user.photo_url}`;
          //             user.photo_url = photo_url;
          //             console.log('user with new photo_url', user);
          //             return res.json(user);
          //           }
          //         } else {
          //           return res.status(422).send({ error: 'Could not get user' });
          //         }
          //       })
          //       .catch(err => next(err));
          //   }
          // });
          // req.end(buf);
        });
      });
    });
  });
}
