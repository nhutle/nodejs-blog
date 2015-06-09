var jwt = require('jsonwebtoken'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  token = {};

token.geneToken = function(user) {
  return jwt.sign(user, config.get('secretJWT'), {
    expiresInMinutes: 30
  });
};

token.verifyToken = function(signUpToken, callback) {
  jwt.verify(signUpToken, config.get('secretJWT'), callback);
};

module.exports = token;