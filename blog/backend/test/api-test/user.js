var should = require('chai').should,
  expect = require('chai').expect,
  async = require('async'),
  rfr = require('rfr'),
  mongoConnection = rfr('utils/mongodb-connection'),
  token = rfr('utils/token'),
  UserService = rfr('db/services/user'),
  userService = new UserService();

module.exports = function(api, server) {
  describe('POST /users/signup', function() {
    this.timeout(10000);

    before(function(done) {
      mongoConnection.init(done);
    });

    after(function(done) {
      userService.removeByField({
        email: 'tostufrefr@throam.com'
      }, done);
    });

    it('should return null', function(done) {
      var userMock = {
        fullname: 'fullname test',
        email: 'tostufrefr@throam.com',
        password: 'password test',
        avatar: ''
      };

      api
        .post('/users/signup')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect(200, done);
    });
  });

  describe('POST /user/login', function() {
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
      var userMock = {
        email: 'wrongemail@gmail.com',
        password: 'password test'
      };

      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Incorrect email'
        }, done);
    });

    it('should return error on account of inactivated account', function(done) {
      var userMock = {
        email: 'phecrimucl@throam.com',
        password: 'password test'
      };

      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Please activate your account before trying to login'
        }, done);
    });

    it('should return error on account of incorrect password', function(done) {
      var userMock = {
        email: 'prohulocle@throam.com',
        password: 'wrong password'
      };

      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Incorrect password'
        }, done);
    });

    it('should return user\'s information', function(done) {
      var userMock = {
        email: 'prohulocle@throam.com',
        password: 'password test'
      };

      server
        .post('/users/login')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /users/logout', function() {
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
      server
        .get('/users/logout')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });

  describe('POST /users/authen', function() {
    var tokenAct, tokenInAct;

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
          tokenInAct = token.geneToken(inActUser, 30);
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
              tokenAct = token.geneToken(user, 30);
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
      api
        .get('/users/authen')
        .set('Accept', 'application/json')
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({
          message: 'There is no provided token'
        }, done);
    });

    it('should return user\'s information on account of the account is activated', function(done) {
      api
        .get('/users/authen?token=' + tokenAct)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return null on account of the account is inactivated', function(done) {
      api
        .get('/users/authen?token=' + tokenInAct)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
};