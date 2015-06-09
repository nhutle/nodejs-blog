var mongoose = require('mongoose'),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  log = rfr('utils/log'),
  App = {};

App.init = function(callback) {
  mongoose.connect(config.get('database:connectionString'), function(err) {
    if (err) {
      log.error(err);
      return callback && callback(err);
    }

    log.info('connect to mongo success');
    callback && callback(); // if callback is existing -> call it.
  });
};

module.exports = App;