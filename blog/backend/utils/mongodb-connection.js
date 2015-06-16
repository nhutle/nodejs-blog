var mongoose = require('mongoose'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  log = rfr('utils/log'),
  App = {};

App.getDB = function() {
  return process.env.NODE_ENV === 'production' ? config.get('database:production:connectionString') : config.get('database:staging:connectionString');
};

App.init = function(callback) {
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

module.exports = App;