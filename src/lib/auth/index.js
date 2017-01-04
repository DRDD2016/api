import jwt from 'jwt-simple';
import client from '../../db/client';
import saveUser from './save-user';
import findUserByEmail from './find-user-by-email';

export function signup (req, res, next) {

  const firstname = req.body.firstname;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;


  if (!email || !password || !firstname || !surname) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  findUserByEmail(client, email)
    .then((userExists) => {
      if (userExists) {
        return res.status(422).send({ error: 'Email is in use' });
      }
      saveUser(client, req.body)
        .then((user_id) => {
          return res.json({ token: createToken(user_id) });
        });
    })
    .catch(err => next(err));
}

function createToken (user_id) {
  const timestamp = new Date().getTime(); // date in ms. same as Date.now()
  return jwt.encode({ sub: user_id, iat: timestamp }, process.env.SECRET_JWT);
}
