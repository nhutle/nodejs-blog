var rfr = require('rfr'),
  _ = require('underscore'),
  model = rfr('db/schemas/user'),
  Base = rfr('db/base-service'),
  crypt = rfr('utils/crypt'),
  mailer = rfr('utils/mailer'),
  token = rfr('utils/token'),
  log = rfr('utils/log'),
  User;

User = Base.extend({
  modelClass: model,

  login: function(opts, callback) {
    this.findOne({
      email: opts.data.email
    }, function(err, user) {
      var userInfo = {};

      if (err) {
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });
      }

      if (!user) {
        return callback({
          message: 'Incorrect email',
          status: 401
        });
      }

      if (!user.isActivated) {
        return callback({
          message: 'Inactivated user',
          status: 401
        });
      }

      if (!crypt.comparePwd(opts.data.password, user.password, function(err, result) {
        if (err) {
          return callback({
            message: 'A problem has been occurred during processing your data',
            status: 500
          });
        }

        if (!result) {
          return callback({
            message: 'Incorrect password',
            status: 401
          });
        }

        opts.req.session.userId = user._id;
        userInfo.fullname = user.fullname;
        userInfo.avatar = user.avatar;
        userInfo._id = user._id;
        userInfo.isAuth = true;
        callback(null, userInfo);
      }));
    });
  },

  logout: function(opts, callback) {
    opts.req.session.destroy(function(err) {
      if (err) {
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });
      }

      callback(null);
    });
  },

  create: function(opts, callback) {
    opts.data.password = crypt.encrypt(opts.data.password);
    opts.data.isActivated = false;
    this.base(opts.data, function(err, user) {
      var signUptoken;

      if (err) {
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });
      }

      signUptoken = token.geneToken(user);
      mailer.sendMail(opts.req, user, signUptoken, callback);
    });
  },

  verifyAcc: function(opts, callback) {
    var signUptoken = opts.req.body.token || opts.req.query.token || opts.req.headers['authorization'],
      self = this;

    if (!signUptoken) {
      return callback({
        message: 'There is no token provided',
        status: 400
      });
    } else {
      token.verifyToken(signUptoken, function(err, decoded) {
        if (err) {
          return callback({
            message: 'A problem has been occurred during processing your data',
            status: 500
          });
        }

        decoded.isActivated = true;
        self.update(decoded._id, decoded, callback);
      });
    }
  }
});

module.exports = User;