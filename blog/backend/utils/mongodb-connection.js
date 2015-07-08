var mongoose = require('mongoose'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  log = rfr('utils/log'),
  mongoConn = {};

mongoConn.getDB = function() {
  var connStr;

  if (process.env.NODE_ENV === 'production') {
    connStr = config.get('database:production:connectionString');
  } else if (process.env.NODE_ENV === 'staging') {
    connStr = config.get('database:staging:connectionString');
  } else {
    connStr = config.get('database:testing:connectionString');
  }

  return connStr;
};

mongoConn.init = function(callback) {
  var connectionString = this.getDB();

  mongoose.connect(connectionString, function(err) {
    if (err) {
      log.error(err);
      return callback && callback(err);
    }

    log.info('connect to mongo success');
    callback && callback(); // if callback is existing -> call it.
  });
};

mongoConn.close = function(callback) {
  log.info('close mongo connection');

  mongoose.connection.close(callback);
};

module.exports = mongoConn;