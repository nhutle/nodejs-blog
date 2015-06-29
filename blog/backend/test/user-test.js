var should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://172.16.126.110:3000/api'),
  mongoose = require('mongoose'),
  _ = require('underscore');

// module.exports = function () {
  describe('login testcases', function() {

    before(function(done) {
      // create user
      // do something
      done();
    });

    after(function(done) {
      //  do something
      //  remove user
      done();
    });

    //beforeEach
    //afterEach

    it('should login successfully', function(done) {
      var userMock = {
        email: 'leminhnhut08t1@gmail.com',
        password: '123456'
      };

      api
        .post('/users/login')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should login unsuccessfully', function(done) {
      var userMock = {
        email: 'leminhnhut08t1@gmail.com',
        password: 'wrong password'
      };

      api
        .post('/users/login')
        .send(userMock)
        .expect('Content-Type', /json/)
        .expect(401, done);
    });
  });
// };