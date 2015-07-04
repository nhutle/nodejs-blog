var expect = require('chai').expect,
  async = require('async'),
  rfr = require('rfr'),
  mongoConnection = rfr('utils/mongodb-connection'),
  token = rfr('utils/token'),
  UserService = rfr('db/services/user'),
  userService = new UserService();

module.exports = function(api, server) {
  var userMock,
    request,
    inActUser,
    actUser,
    optsInAct,
    optsAct,
    tokenAct,
    tokenInAct;

  userMock = {
    fullname: 'fullname test',
    email: 'tostufrefr@throam.com',
    password: 'password test',
    avatar: ''
  };
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
      api
        .post('/users/signup')
        .set('Accept', 'application/json')
        .send(userMock)
        .expect(200, done);
    });
  });

  describe('POST /users/login', function() {
    this.timeout(10000);

    before(function(done) {
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
      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({
          email: 'wrongemail@gmail.com',
          password: 'password test'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Incorrect email'
        }, done);
    });

    it('should return error on account of incorrect password', function(done) {
      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({
          email: 'prohulocle@throam.com',
          password: 'wrong password'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Incorrect password'
        }, done);
    });

    it('should return error on account of inactivated account', function(done) {
      api
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({
          email: 'phecrimucl@throam.com',
          password: 'password test'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({
          message: 'Please activate your account before trying to login'
        }, done);
    });

    it('should return user\'s information', function(done) {
      server
        .post('/users/login')
        .set('Accept', 'application/json')
        .send({
          email: 'prohulocle@throam.com',
          password: 'password test'
        })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /users/logout', function() {
    this.timeout(10000);

    it('should return null', function(done) {
      server
        .get('/users/logout')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });

  describe('POST /users/authen', function() {
    this.timeout(10000);

    before(function(done) {

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
              optsAct.req.body = {};
              optsAct.req.query = {};
              tokenAct = token.geneToken(user, 30);
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

    it('should activate user\'s account and return null if the account is inactivated', function(done) {
      api
        .get('/users/authen?token=' + tokenInAct)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
};