const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    })
  });
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) {
        reject(err);
      } else  if (!res) {
        reject('password does not match');
      } else {
        resolve();
      }
    });
  })
};

module.exports = {
  hashPassword,
  comparePassword
};