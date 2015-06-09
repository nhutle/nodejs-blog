var bcrypt = require('bcrypt-nodejs'),
    crypt = {};

crypt.encrypt = function(pwd) {
  return bcrypt.hashSync(pwd);
};

crypt.comparePwd = function(pwd, encryptPwd, callback) {
  return bcrypt.compare(pwd, encryptPwd, callback);
};

module.exports = crypt;