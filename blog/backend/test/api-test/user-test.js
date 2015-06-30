var should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://localhost:3000/api'),
  server = supertest.agent('http://localhost:3000/api'),
  mongoose = require('mongoose'),
  async = require('async');

describe('POST /login', function() {
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
        api
          .post('/users/signup')
          .set('Accept', 'application/json')
          .send(optsInAct)
          .end(function(err, res) {
            if (err) throw err;

            callback && callback();
          });
      },
      function(callback) {
        // create mock activated user
        async.waterfall([

          function(callback) {
            api
              .post('/users/signup')
              .set('Accept', 'application/json')
              .send(optsAct)
              .end(function(err, res) {
                if (err) throw err;

                callback && callback();
              });
          },
          function(callback) {
            userService.findOne({
              email: actUser.email
            }, function(err, user) {
              if (err) return callback(err);

              callback(null, user);
            });
          },
          function(user, callback) {
            optsAct.req.headers = {};
            optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
            optsAct.req.body = {};
            optsAct.req.query = {};
            // userService.authen(optsAct, function(err, result) {
              // if (err) return callback(err);

              callback(null)
            // });
          }
        ], function(err, results) {
          callback(null);
        });
      }
    ], function(err, results) {
      done();
    })
  });

  // after(function(done) {
  //   async.parallel([

  //     function(callback) {
  //       // remove inactivated user
  //       userService.removeByField({
  //         email: 'phecrimucl@throam.com'
  //       }, callback);
  //     },
  //     function(callback) {
  //       // remove activated user
  //       userService.removeByField({
  //         email: 'prohulocle@throam.com'
  //       }, callback);
  //     }
  //   ], function(err, results) {
  //     // close db connection
  //     mongoConnection.close(done);
  //   });
  // });

  it('should login successfully', function(done) {
    var userMock = {
      email: 'leminhnhut08t1@gmail.com',
      password: '123456'
    };

    api
      .post('/users/login')
      .set('Accept', 'application/json')
      .send(userMock)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  // it('should login unsuccessfully', function(done) {
  //   var userMock = {
  //     email: 'leminhnhut08t1@gmail.com',
  //     password: 'wrong password'
  //   };

  //   api
  //     .post('/users/login')
  //     .send(userMock)
  //     .expect('Content-Type', /json/)
  //     .expect(401, done);
  // });
});