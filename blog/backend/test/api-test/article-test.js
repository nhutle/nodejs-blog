var should = require('chai').should(),
  supertest = require('supertest'),
  api = supertest('http://172.16.126.110:3000/api'),
  mongoose = require('mongoose'),
  _ = require('underscore');

// module.exports = function () {
  describe('article testcases', function() {

    before(function(done) {
      // do something
      done();
    });

    after(function(done) {
      //  do something
      done();
    });

    it('should return a list of articles', function(done) {
      api
        .post('/articles')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
// };