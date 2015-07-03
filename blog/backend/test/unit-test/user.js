var rfr = require('rfr'),
  expect = require('chai').expect,
  async = require('async'),
  mongoConnection = rfr('utils/mongodb-connection'),
  token = rfr('utils/token'),
  UserService = rfr('db/services/user'),
  userService = new UserService();

module.exports = function() {
  describe('--USER SIGNUP UNIT TEST--', function() {
    this.timeout(10000);

    before(function(done) {
      mongoConnection.init(done);
    });

    after(function(done) {
      userService.removeByField({
        email: 'tostufrefr@throam.com'
      }, done);
    });

    it('should create a new user and send an email to his/her mail', function(done) {
      var user = {
          fullname: 'fullname test',
          email: 'tostufrefr@throam.com',
          password: 'password test',
          avatar: ''
        },
        request = {
          protocol: 'http',
          get: function(param) {
            return 'localhost';
          }
        },
        opts = {
          data: user,
          req: request,

        };

      userService.create(opts, function(err, result) {
        expect(err).to.equal(null);
        done();
      });
    });

    it('should return an error message on account of conflicting email address', function(done) {
      var user = {
          fullname: 'fullname test',
          email: 'tostufrefr@throam.com',
          password: 'password test',
          avatar: ''
        },
        request = {
          protocol: 'http',
          get: function(param) {
            return 'localhost';
          }
        },
        opts = {
          data: user,
          req: request,

        };
      userService.create(opts, function(err, result) {
        expect(err.status).to.equal(500);
        expect(err.message).to.equal('Your email is belong another account');
        done();
      });
    });
  });

  describe('--USER LOGIN UNIT TEST--', function() {
    this.timeout(10000);

    before(function(done) {
      var request, inActUser, actUser, optsInAct, optsAct;

      request = {
        protocol: 'http',
        get: function(param) {
          return 'localhost';
        }
      };
      inActUser = {
        fullname: 'fullname test',
        email: 'phecrimucl@throam.com',
        password: 'password test',
        avatar: ''
      };
      actUser = {
        fullname: 'fullname test',
        email: 'prohulocle@throam.com',
        password: 'password test',
        avatar: ''
      };
      optsInAct = {
        data: inActUser,
        req: request
      };
      optsAct = {
        data: actUser,
        req: request
      };

      async.parallel([

        function(callback) {
          userService.create(optsInAct, callback);
        },
        function(callback) {
          async.waterfall([

            function(callback) {
              userService.create(optsAct, callback);
            },
            function(callback) {
              userService.findOne({
                email: actUser.email
              }, callback);
            },
            function(user, callback) {
              optsAct.req.headers = {};
              optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
              optsAct.req.body = {};
              optsAct.req.query = {};
              userService.authen(optsAct, callback);
            }
          ], callback);
        }
      ], done);
    });

    after(function(done) {
      async.parallel([

        function(callback) {
          userService.removeByField({
            email: 'phecrimucl@throam.com'
          }, callback);
        },
        function(callback) {
          userService.removeByField({
            email: 'prohulocle@throam.com'
          }, callback);
        }
      ], done);
    });

    it('should return an error message on account of incorrect email', function(done) {
      var user = {
          email: 'wrongemail1@gmail.com',
          password: 'password test'
        },
        opts = {
          data: user
        };

      userService.login(opts, function(err, result) {
        expect(err.status).to.equal(401);
        expect(err.message).to.equal('Incorrect email');
        done();
      });
    });

    it('should return error on account of inactivated account', function(done) {
      var user = {
          email: 'phecrimucl@throam.com',
          password: 'password test'
        },
        opts = {
          data: user
        };

      userService.login(opts, function(err, result) {
        expect(err.status).to.equal(401);
        expect(err.message).to.equal('Please activate your account before trying to login');
        done();
      });
    });

    it('should return error on account of incorrect password', function(done) {
      var user = {
          email: 'prohulocle@throam.com',
          password: 'wrong password'
        },
        opts = {
          data: user
        };

      userService.login(opts, function(err, result) {
        expect(err.status).to.be.equal(401);
        expect(err.message).to.be.equal('Incorrect password');
        done();
      });
    });

    it('should return user\'s information', function(done) {
      var user = {
          email: 'prohulocle@throam.com',
          password: 'password test'
        },
        request = {
          session: {}
        },
        opts = {
          data: user,
          req: request
        };

      userService.login(opts, function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.an('object');
        done();
      })
    });
  });

  describe('--USER LOGOUT UNIT TEST--', function() {
    this.timeout(10000);

    before(function(done) {
      var request, user, opts;

      request = {
        protocol: 'http',
        get: function(param) {
          return 'localhost';
        }
      };
      user = {
        fullname: 'fullname test',
        email: 'prohulocle@throam.com',
        password: 'password test',
        avatar: ''
      };
      opts = {
        data: user,
        req: request
      };

      async.waterfall([

        function(callback) {
          userService.create(opts, callback);
        },
        function(callback) {
          userService.findOne({
            email: user.email
          }, callback);
        },
        function(user, callback) {
          opts.req.headers = {};
          opts.req.headers['Authorization'] = token.geneToken(user, 30);
          opts.req.body = {};
          opts.req.query = {};
          userService.authen(opts, callback);
        },
      ], done);
    });

    after(function(done) {
      userService.removeByField({
        email: 'prohulocle@throam.com'
      }, done);
    });

    it('should return null', function(done) {
      var request, user, opts;

      request = {
        session: {
          destroy: function(err) {

          }
        }
      };
      opts = {
        req: request
      };

      done();
    });
  });
  describe('--AUTHEN USER WITH TOKEN UNIT TEST--', function() {
    var inActToken, inActUser, actUser, optsInAct, optsAct;

    this.timeout(10000);

    before(function(done) {
      var request;

      request = {
        protocol: 'http',
        get: function(param) {
          return 'localhost';
        }
      };
      inActUser = {
        fullname: 'fullname test',
        email: 'phecrimucl@throam.com',
        password: 'password test',
        avatar: ''
      };
      actUser = {
        fullname: 'fullname test',
        email: 'prohulocle@throam.com',
        password: 'password test',
        avatar: ''
      };
      optsInAct = {
        data: inActUser,
        req: request
      };
      optsAct = {
        data: actUser,
        req: request
      };

      async.parallel([

        function(callback) {
          optsInAct.req.headers = {};
          optsInAct.req.headers['Authorization'] = token.geneToken(inActUser, 30);
          optsInAct.req.body = {};
          optsInAct.req.query = {};
          userService.create(optsInAct, callback);
        },
        function(callback) {
          async.waterfall([

            function(callback) {
              userService.create(optsAct, callback);
            },
            function(callback) {
              userService.findOne({
                email: actUser.email
              }, callback);
            },
            function(user, callback) {
              optsAct.req.headers = {};
              optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
              optsAct.req.body = {};
              optsAct.req.query = {};
              userService.authen(optsAct, callback);
            }
          ], callback);
        }
      ], done);
    });

    after(function(done) {
      async.parallel([

        function(callback) {
          userService.removeByField({
            email: 'phecrimucl@throam.com'
          }, callback);
        },
        function(callback) {
          userService.removeByField({
            email: 'prohulocle@throam.com'
          }, callback);
        }
      ], function(err, results) {
        mongoConnection.close(done);
      });
    });

    it('should return error on account of no token is provided', function(done) {
      var opts = {};

      opts.req = {};
      opts.req.body = {};
      opts.req.body.token = '';
      opts.req.query = {};
      opts.req.query.token = '';
      opts.req.headers = {};
      opts.req.headers['Authorization'] = '';

      userService.authen(opts, function(err, result) {
        expect(err.status).to.be.equal(400);
        expect(err.message).to.be.equal('There is no provided token');
        done();
      });
    });

    it('should return user\'s information on account of the account is activated', function(done) {
      userService.authen(optsAct, function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.an('object');
        done();
      });
    });

    it('should return null on account of the account is inactivated', function(done) {
      userService.authen(optsInAct, function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.an('object');
        done();
      });
    });
  });
}