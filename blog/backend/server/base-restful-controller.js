var oop = require('node-g3').oop,
  Base = oop.Base.extend({
    dbServiceName: null,
    dbControllerName: null,

    constructor: function(opts) {
      this.app = opts.app;
      this.db = opts.db;
    },

    get: function(opts, callback) {
      this.getService().getAll(callback);
    },

    post: function(opts, callback) {
      this.getService().create(opts.data, callback);
    },

    put: function(opts, callback) {
      this.getService().update(opts.action, opts.data, callback);
    },

    delete: function(opts, callback) {
      this.getService().remove(opts.action, callback);
    },

    getService: function() {
      return this.db[this.dbServiceName];
    },

    handle: function(opts, callback) {
      var controller = this[opts.method],
          action = opts.action;

      if (controller) {
        if(action && this.actions[action]) {
          var fn = this.actions[action].fn;

          // return this[fn].call(this, opts, callback);
          return this[fn](opts, callback);
        }

        return this[opts.method](opts, callback);
      } else {
        return callback('wrong request!!!');
      }
    }
  });

module.exports = Base;