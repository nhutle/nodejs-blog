var _ = require('underscore'),
  rfr = require('rfr'),
  Controller;

Controller = function(opts) {
  this.db = opts.db;
  this.apis = opts.apis;
  this.controllers = {};

  this.init();
};

Controller.prototype.init = function(callback) {
  var self = this,
    app = this.app;

  _.each(this.apis, function(item) {
    var controllerClass = require('./controllers/' + item),
      controller = new controllerClass({
        db: self.db
      }),
      controllerName = item;

    self.controllers[item] = controller;
  });

  callback && callback();
};

Controller.prototype.handle = function(opts, callback) {
  var controller = this.controllers[opts.controller];

  if (controller) {
    return controller.handle(opts, callback);
  } else {
    return callback && callback('wrong request!!!');
  }
};


module.exports = Controller;