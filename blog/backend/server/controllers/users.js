var rfr = require('rfr'),
  Base = rfr('server/base-restful-controller'),
  User;

User = Base.extend({
  dbServiceName: 'dbUser',

  actions: {
    'login': {
      fn: 'login',
      method: 'post'
    },

    'signup': {
      fn: 'signup',
      method: 'post'
    },

    'logout': {
      fn: 'logout',
      method: 'get'
    },

    'upload': {
      method: 'post',
      fn: 'upload'
    },

    'verify': {
      method: 'get',
      fn: 'verifyAcc'
    }
  },

  login: function(opts, callback) {
    this.getService().login(opts, callback);
  },

  signup: function(opts, callback) {
    this.getService().create(opts, callback);
  },

  logout: function(opts, callback) {
    this.getService().logout(opts, callback);
  },

  upload: function(opts, callback) {
    callback(null, {
      image: 'images/' + opts.req.files.avatar.name
    });
  },

  verifyAcc: function(opts, callback) {
    this.getService().verifyAcc(opts, callback);
  }
});

module.exports = User;