import fs from 'fs';
import os from 'os';
import formidable from 'formidable';
import gm from 'gm';
import { s3, ses } from './amazon-clients'; //eslint-disable-line
import crypto from 'crypto';


import saveEvent from './events/save-event';
import getEvent from './events/get-event';
import getUserById from './auth/get-user-by-id';
import getUserByEmail from './auth/get-user-by-email';
import updateUser from './auth/update-user';
import updateUserPhoto from './auth/update-user-photo';
import updateUserPushInfo from './auth/update-user-pushInfo';
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
import updateResetPasswordToken from './auth/update-reset-password-token';
import compileTemplate from './compile-template';
import getUserByResetToken from './auth/get-user-by-reset-token';
import resetUserPassword from './auth/reset-user-password';
import markFeedItemAsViewed from './feed/mark-feed-item-as-viewed';
import getCategoryOptions from './events/get-category-options';
import getAllVotes from './events/get-all-votes';
import getVote from './events/get-vote';
import getCalendar from './events/get-calendar';

const domain = process.env.DOMAIN;
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain });


export function patchPushHandler (req, res, next) {
  console.log('Push req: ', req);
  const userData = req.body.user.push_info;
  console.log('userData: ', userData);
  const user_id = req.params.user_id;
  if (!userData) {
    return res.status(422).send({ error: 'Missing user data' });
  }
  updateUserPushInfo(client, user_id, userData)
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.status(422).send({ error: 'Could not update user' });
      }
    })
    .catch(err => next(err));
}

export function postEventHandler (req, res, next) {
  const event = req.body.event;
  if (!event) {
    return res.status(422).send({ error: 'Missing event data' });
  }
  const data = { ...event, host_user_id: req.user.user_id };
  const code = shortid.generate();
  data.code = code;
  saveEvent(client, data)
    .then((event_id) => {
      addInvitee(client, req.user.user_id, event_id)
        .then(() => {
          req.subject_user_id = req.user.user_id;
          req.event_id = event_id;
          req.informAllInvitees = false;
          req.responseStatusCode = 201;
          req.responseData = { code };
          next(); // --> updateFeeds
        })
        .catch(err => next(err));
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
}

export function deleteEventHandler (req, res, next) {
  // updateFeeds happens before this step
  deleteEvent(client, req.params.event_id)
  .then(() => {
    return res.status(204).end();
  })
  .catch(err => next(err));
}

export function getEventHandler (req, res, next) {
  getEvent(client, req.params.event_id)
  .then((event) => {
    if (event) {
      req.event = event;
      next(); // --> addRsvps
    } else {
      return res.status(422).send({ error: 'Event has been deleted' });
    }
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
      console.log('EVENT', event);
      addInvitee(client, req.user.user_id, event.event_id)
        .then(() => {
          req.event = normaliseEventKeys(event);
          next(); // --> addRsvps
        })
        .catch(err => next(err));
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

export function patchRsvpsHandler (req, res, next) {
  const rsvpStatus = req.body.status;
  if (!rsvpStatus) {
    return res.status(422).send({ error: 'Missing rsvp data' });
  }
  updateRsvp(client, req.user.user_id, req.params.event_id, rsvpStatus)
    .then(() => {
      getRsvps(client, req.params.event_id)
      .then((rsvps) => {
        req.subject_user_id = req.user.user_id;
        req.event_id = req.params.event_id;
        req.informAllInvitees = false;
        req.responseStatusCode = 201;
        req.responseData = { rsvps };
        next(); // --> updateFeeds
      })
      .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function postVoteHandler (req, res, next) {
  const user_id = req.user.user_id;
  const vote  = req.body.vote;
  const event_id = req.params.event_id;
  if (!vote) {
    return res.status(422).send({ error: 'Missing vote data' });
  }
  if (!event_id) {
    return res.status(422).send({ error: 'Missing event id' });
  }
  saveVote(client, user_id, event_id, vote)
    .then((success) => {
      if (success) {
        req.subject_user_id = req.user.user_id;
        req.event_id = req.params.event_id;
        req.informAllInvitees = false;
        req.responseStatusCode = 201;
        next(); // --> updateFeeds
      }
    })
    .catch(err => next(err));
}

export function finaliseEventHandler (req, res, next) {
  const hostEventChoices = req.body.hostEventChoices;
  const event_id = req.params.event_id;
  if (!hostEventChoices) {
    return res.status(422).send({ error: 'Missing host event choices' });
  }
  finaliseEvent(client, event_id, hostEventChoices)
    .then((data) => {
      if (data) {
        req.subject_user_id = req.user.user_id;
        req.event_id = req.params.event_id;
        req.informAllInvitees = true;
        req.responseStatusCode = 201;
        req.responseData = data;
        next(); // --> updateFeeds
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

export function editEventHandler (req, res, next) {
  const event_id = req.params.event_id;
  const event = req.body.event;

  if (!event) {
    return res.status(422).send({ error: 'Missing event data' });
  }

  editEvent(client, event_id, event)
    .then((data) => {
      if (data) {
        req.subject_user_id = req.user.user_id;
        req.event_id = event_id;
        req.informAllInvitees = true;
        req.responseStatusCode = 201;
        req.responseData = data;
        next(); // --> updateFeeds
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
  const userData = req.body.user;
  const user_id = req.params.user_id;
  if (!userData) {
    return res.status(422).send({ error: 'Missing user data' });
  }
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
        updateResetPasswordToken(client, userExists.user_id, token, tokenExpires)
        .then((userData) => {
          userData.host = req.headers.host;
          const param = {
            from: 'Spark <postmaster@mg.spark-app.net>',
            to: email,
            subject: 'Please reset the password for your Spark account',
            html: compileTemplate('resetPassword', 'html')(userData)
          };

          mailgun.messages().send(param, function (err, data) {
            if (err) {
              console.error(err.message);
              // next(err);
              return res.status(500).send({ error: 'Something went wrong' });
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
    .then((user) => {
      if (user) {
        const param = {
          from: 'Spark <postmaster@mg.spark-app.net>',
          to: user.email,
          subject: 'New Spark Password',
          html: compileTemplate('newPassword', 'html')(user)
        };
        mailgun.messages().send(param, function (err, data) {
          if (err) {
            return next(err);
          }
          console.log(data);
          res.render('reset', { message: 'Your password has been succesfully changed!', user_id });
        });
      }
    })
    .catch(err => next(err));
  }
}

export function editFeedHandler (req, res, next) {
  const feedItemId = req.body.id;
  if (!feedItemId) {
    return res.status(422).send({ error: 'Missing feed item id' });
  }
  // find feed item, flip viewed to true
  markFeedItemAsViewed(client, feedItemId)
    .then(() => res.status(204).end())
    .catch(err => next(err));
}

export function getVotesHandler (req, res, next) {
  const user_id = req.user.user_id;
  const event_id = req.params.event_id;
  if (req.query.all === null || req.query.all === undefined) {
    return res.status(422).send({ error: 'Missing query string param.' });
  }
  const shouldGetAllVotes = req.query.all === 'true';

  getCategoryOptions(client, event_id)
  .then((categoryOptions) => {
    console.log('???????',categoryOptions);
    if (categoryOptions) {
      if (shouldGetAllVotes === true) {
        console.log('getting all votes');
        getAllVotes(client, event_id, categoryOptions)
        .then((allVotes) => {
          console.log(allVotes);
          return res.send(allVotes);
        })
        .catch(err => next(err));
      } else {
        console.log('getting one vote');
        getVote(client, user_id, event_id, categoryOptions)
        .then((vote) => {
          console.log(vote);
          return res.send(vote);
        })
        .catch(err => next(err));
      }
    } else {
      return res.status(422).send({ error: 'Unknown event; no votes found' });
    }
  })
  .catch(err => next(err));
}

export function getCalendarHandler (req, res, next) {
  getCalendar(client, req.user.user_id)
  .then((calendar) => {
    if (calendar) {
      return res.send(calendar);
    }
  })
  .catch(err => next(err));
}
