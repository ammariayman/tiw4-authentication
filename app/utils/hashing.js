const bcrypt = require('bcrypt');

async function hashPassword (password) {

  const saltRounds = 10;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })

  return hashedPassword
}

async function comparePassword (pwd, userPwd) {
  const ok = await new Promise((resolve, reject) => {
    bcrypt.compare(pwd, userPwd, function (err, result) {
      if (err) reject(err) 
      else resolve(result)
    });
  })

  return ok
}

  module.exports = { hashPassword, comparePassword };