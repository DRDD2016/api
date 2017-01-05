import jwt from 'jwt-simple';
import client from '../../db/client';
import saveUser from './save-user';
import getUserByEmail from './get-user-by-email';

export function signup (req, res, next) {

  const firstname = req.body.firstname;
  const surname = req.body.surname;
  const email = req.body.email && req.body.email.toLowerCase();
  const password = req.body.password;

  if (!email || !password || !firstname || !surname) {
    return res.status(422).send({ error: 'All fields are required!' });
  }

  getUserByEmail(client, email)
    .then((userExists) => {
      if (userExists) {
        return res.status(422).send({ error: 'Email is in use' });
      }
      saveUser(client, req.body)
        .then((user_id) => {
          return res.status(201).json({ token: createToken(user_id) });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
}

export function login (req, res) {
  // find user, compare password, send token
  res.status(201).json(Object.assign(req.user, { token: createToken(req.user.user_id) }));
}

export function createToken (user_id) {
  const timestamp = new Date().getTime(); // date in ms. same as Date.now()
  return jwt.encode({ sub: user_id, iat: timestamp }, process.env.SECRET_JWT);
}
