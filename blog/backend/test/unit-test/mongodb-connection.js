var mongoose = require('mongoose'),
  expect = require('chai').expect,
  rfr = require('rfr'),
  config = rfr('utils/config'),
  mongoConnection = rfr('utils/mongodb-connection');

module.exports = function() {
  describe('-- GETDB CONNECTION UNIT TEST--', function() {
    before(function(done) {
      mongoose.connect(mongoConnection.getDB(), done);
    });

    after(function(done) {
      mongoose.connection.db.dropDatabase(done);
    });

    it('should return testing string', function(done) {
      var connStr = mongoConnection.getDB();

      expect(connStr).to.be.equal('mongodb://localhost/blogTest');
      done();
    });
  });
};