var jwt = require('jsonwebtoken'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  token = {};

token.geneToken = function(data, expTime) {
  return jwt.sign(data, config.get('secretJWT'), {
    expiresInMinutes: expTime
  });
};

token.verifyToken = function(token, callback) {
  jwt.verify(token, config.get('secretJWT'), callback);
};

module.exports = token;