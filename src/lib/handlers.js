import fs from 'fs';
import os from 'os';
import formidable from 'formidable';
import gm from 'gm';
import s3 from './s3-client';


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
import updateRsvp from './events/update-rsvp';
import editEvent from './events/edit-event';
import normaliseEventKeys from './normalise-event-keys';
import client from '../db/client';
import shortid from 'shortid';
import generateFileName from './generate-file-name';
import extractFileExtension from './extract-file-extension';


export function postEventHandler (req, res, next) { // eslint-disable-line no-unused-vars
  const event = req.body.event;
  if (!event) {
    return res.status(422).send({ error: 'Missing event data' });
  }
  const data = { ...event, host_user_id: req.user.user_id };
  const code = shortid.generate();
  data.code = code;
  saveEvent(client, data)
    .then(() => {
      req.subject_user_id = req.user.user_id;
      req.event = event;
      req.responseStatusCode = 201;
      req.responseData = code;
      next();
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
}

export function deleteEventHandler (req, res, next) {
  deleteEvent(client, req.params.event_id)
  .then((deleted_event_id) => {
    res.json(deleted_event_id);
  })
  .catch(err => next(err));
}

export function getEventHandler (req, res, next) {
  getEvent(client, req.params.event_id)
  .then((event) => {
    if (event) {
      req.event = event;
      next(); // --> `addRsvps`
    } else {
      return res.status(422).send({ error: 'Could not get event' });
    }
  })
  .catch(err => next(err));
}

export function addRsvps (req, res, next) {
  getRsvps(client, req.event.event_id)
  .then((rsvps) => {
    req.event.rsvps = rsvps;
    return req.method === 'POST' ? res.status(201).json(req.event) : res.json(req.event);
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
          req.event = normaliseEventKeys(event);
          next(); // --> `addRsvps`
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function patchRsvpsHandler (req, res, next) {
  const rsvpStatus = req.body.status;
  if (!rsvpStatus) {
    return res.status(422).send({ error: 'Missing rsvp data' });
  }
  updateRsvp(client, req.user.user_id, req.params.event_id, rsvpStatus)
    .then(() => {
      getRsvps(client, req.params.event_id)
      .then((rsvps) => {
        return res.status(201).json({ rsvps });
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
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

  editEvent(client, event_id, event)
    .then((data) => {
      if (data) {
        req.subject_user_id = req.user.user_id;
        req.event = event;
        req.responseStatusCode = 201;
        req.responseData = data;
        next();
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
  let tmpfile, filename, newfile, ext;
  const newForm = new formidable.IncomingForm();
  newForm.keepExtension = true;
  newForm.parse(req, function (err, fields, files) {

    if (err) {
      return next(err);
    }
    tmpfile = files.photo.path;
    filename = generateFileName(files.photo.name);
    ext = extractFileExtension(files.photo.name);
    newfile = `${os.tmpdir()}/${filename}`; //access to temporary directory where all the files are stored
    fs.rename(tmpfile, newfile, function () {
      // resize
      gm(newfile).resize(300).write(newfile, function () {
        //upload to s3
        fs.readFile(newfile, function (err, buf) {
          s3.putObject({
            Bucket: process.env.S3BUCKET,
            Key: filename,
            Body: buf,
            ACL: 'public-read',
            ContentType: `image/${ext}`
          }, function (err, data) {
            if (data.ETag) {
              filename = `https://s3.eu-west-2.amazonaws.com/spark-native/${filename}`;
              updateUserPhoto(client, user_id, filename)
              .then((photoObj) => {
                // delete local file
                fs.unlinkSync(newfile);
                if (photoObj) {
                  return res.status(201).json(photoObj);
                } else {
                  return res.status(422).send({ error: 'Could not get user' });
                }
              })
              .catch(err => next(err));
            }
          });
        });
      });
    });
  });
}
