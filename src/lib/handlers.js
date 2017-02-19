import PubSub from 'pubsub-js';
import fs from 'fs';
import os from 'os';
import formidable from 'formidable';
import gm from 'gm';
import { s3, ses } from './amazon-clients'; //eslint-disable-line
import crypto from 'crypto';

import { UPDATE_FEED } from '../../socket-router';
import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import getUserById from './auth/get-user-by-id';
import getUserByEmail from './auth/get-user-by-email';
import updateUser from './auth/update-user';
import updateUserPhoto from './auth/update-user-photo';
import deleteEvent from './events/delete-event';
import addInvitee from './events/add-invitee';
import getEventByCode from './events/get-event-by-code';
import saveVote from './events/save-vote';
import finaliseEvent from './events/finalise-event';
import getRsvps from './events/get-rsvps';
import getEventInvitees from './events/get-invitees-ids';
import updateRsvp from './events/update-rsvp';
import saveFeedItem from './events/save-feed-item';
import editEvent from './events/edit-event';
import buildFeedItem from './events/build-feed-item';
import normaliseEventKeys from './normalise-event-keys';
import client from '../db/client';
import shortid from 'shortid';
import generateFileName from './generate-file-name';
import extractFileExtension from './extract-file-extension';
import updateUserResetPasswordToken from './auth/update-user-reset-password-token';
import compileTemplate from './compile-template';
import getUserByResetToken from './auth/get-user-by-reset-token';
import resetUserPassword from './auth/reset-user-password';

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

export function sendResetPasswordEmail (req, res, next) {
  const email = req.body.email;

  if (!email) {
    return res.status(422).send({ error: 'Email field is required!' });
  }

  crypto.randomBytes(20, function (err, buf) {
    if (err) {
      return next(err);
    }
    const token = buf.toString('hex');
    const tokenExpires = Date.now() + 3600000; // 1 hour

    getUserByEmail(client, email)
    .then((userExists) => {
      if (userExists) {
        // update user model with resetPasswordToken = token , resetPasswordExpires
        updateUserResetPasswordToken(client, userExists.user_id, token, tokenExpires)
        .then((userData) => {
          // send the email to the user via SES Amazon
        //   var params = {
        //    Destination: { /* required */
        //      ToAddresses: [
        //        'anita@foundersandcoders.com' //change this email to the official one
        //      ]
        //    },
        //    Message: { /* required */
        //      Body: { /* required */
        //        Html: {
        //          Data: compileTemplate('resetPassword', 'html')(userData), /* required */
        //          Charset: 'utf8'
        //        },
        //        Text: {
        //          Data: compileTemplate('resetPassword', 'txt')(userData), /* required */
        //          Charset: 'utf8'
        //        }
        //      },
        //      Subject: { /* required */
        //        Data: 'Please reset the password for your Spark account', /* required */
        //        Charset: 'utf8'
        //      }
        //    },
        //    Source: 'anita@foundersandcoders.com', /* required */
        //    ReplyToAddresses: [
        //      'anita@foundersandcoders.com' //change this email to the official one
        //    ]
        //  };
        //
          const domain = process.env.DOMAIN;
          const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain });
          userData.host = req.headers.host;
          const param = {
            from: 'Anita <me@samples.mailgun.org>',
            to: process.env.TO,
            subject: 'Please reset the password for your Spark account',
            html: compileTemplate('resetPassword', 'html')(userData)
          };

          mailgun.messages().send(param, function (err, data) {
            if (err) {
              return next(err);
            } else {
              console.log(data); // successful response
              // send the response to client
              return res.status(200).send({ message: `An e-mail has been sent to ${userData.email} with further instructions.` });
            }
          });
        })
        .catch(err => next(err));
      } else {
        return res.status(422).send({ error: 'No account with that email address exists' });
      }
    })
    .catch(err => next(err));
  });
}

export function renderResetPasswordPageHandler (req, res, next) {
  const token = req.params.token;
  // find user with the correct token and check if token expired
  getUserByResetToken(client, token)
  .then((user) => {
    // get user.resetpasswordexpires and compare with current date/time
    //if token is valid redirect to reset form
    if (user) {
      if ( Date.now() > parseInt(user.reset_password_expires, 10)) {
        // token expired
        //render page that will notify the user about expiration
        res.render('expired', { message: 'Password reset token is invalid or has expired.' });
      } else {
        // still valid , redirect to the reset form
        res.render('reset', { user_id: user.user_id, message: '' });
      }
    }

  })
  .catch(err => next(err));
}

export function resetPassword (req, res, next) {
  const password = req.body.password;
  const user_id = req.body.user_id;
  const confirmPassword = req.body.confirmPassword;

  if (password.trim() !== confirmPassword.trim()) {
    res.render('reset', { message: 'Passwords must match!', user_id });
  } else if ( password.length < 4) {
    res.render('reset', { message: 'Passwords must contain at least 4 characters!', user_id });
  } else {
    resetUserPassword(client, user_id, password)
    .then((data) => {
      if (data) {
        res.render('reset', { message: 'Your password has been succesfully changed!', user_id });
      }
    })
    .catch(err => next(err));
  }
}
