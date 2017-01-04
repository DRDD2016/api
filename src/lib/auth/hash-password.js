import bcrypt from 'bcrypt';

export default function hashPassword (password) {
  return new Promise ((resolve, reject) => {

    bcrypt.genSalt(11, (err, salt) => {
      if (err) return reject(err);

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
}
