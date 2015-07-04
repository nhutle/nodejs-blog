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

      if (err)
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });

      if (!user)
        return callback({
          message: 'Incorrect email',
          status: 401
        });

      if (!user.isActivated)
        return callback({
          message: 'Please activate your account before trying to login',
          status: 401
        });

      crypt.comparePwd(opts.data.password, user.password, function(err, result) {
        if (err)
          return callback({
            message: 'A problem has been occurred during processing your data',
            status: 500
          });

        if (!result)
          return callback({
            message: 'Incorrect password',
            status: 401
          });

        opts.req.session.userId = user._id;
        userInfo.fullname = user.fullname;
        userInfo.avatar = user.avatar;
        userInfo._id = user._id;
        userInfo.token = token.geneToken(userInfo, 20160);
        callback(null, userInfo);
      });
    });
  },

  logout: function(opts, callback) {
    opts.req.session.destroy(function(err) {
      if (err)
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });

      callback(null);
    });
  },

  create: function(opts, callback) {
    opts.data.password = crypt.encrypt(opts.data.password);
    opts.data.isActivated = false;

    this.base(opts.data, function(err, user) {
      var signUptoken;

      if (err) {
        if (err.errors.email.message === 'unique')
          return callback({
            message: 'Your email is belong another account',
            status: 500
          })

        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });
      }
      signUptoken = token.geneToken(user, 30);
      mailer.sendMail(opts.req, user, signUptoken, callback);
    });
  },

  authen: function(opts, callback) {
    var tokenVal = opts.req.body.token || opts.req.query.token || opts.req.headers['Authorization'],
      self = this;

    if (!tokenVal)
      return callback({
        message: 'There is no provided token',
        status: 400
      });

    token.verifyToken(tokenVal, function(err, decodedUser) {
      if (err)
        return callback({
          message: 'A problem has been occurred during processing your data',
          status: 500
        });

      if (decodedUser.isActivated)
        return callback(null, {
          _id: decodedUser._id,
          fullname: decodedUser.fullname,
          avatar: decodedUser.avatar
        });

      decodedUser.isActivated = true;
      self.update(decodedUser._id, decodedUser, callback);
    });
  }
});

module.exports = User;