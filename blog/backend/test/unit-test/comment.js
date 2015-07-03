var rfr = require('rfr'),
  async = require('async'),
  expect = require('chai').expect,
  assert = require('chai').assert,
  ObjectID = require('mongodb').ObjectID,
  mongoConnection = rfr('utils/mongodb-connection'),
  CmtService = rfr('db/services/comment'),
  ArticleService = rfr('db/services/article'),
  cmtService = new CmtService(),
  articleService = new ArticleService();

module.exports = function() {
  describe('-- GET TOTAL COMMENTS UNIT TEST--', function() {
    var article, articles = [];

    this.timeout(10000);
    before(function(done) {
      article = {
        title: 'test title',
        content: 'test content',
        photos: []
      };

      mongoConnection.init();
      articleService.create(article, function(err, result) {
        article._id = result._id;
        articles.push(article);
        done();
      });
    });

    after(function(done) {
      articleService.removeByField({
        title: 'test title'
      }, done);
    });

    it('should return total number of comments', function(done) {
      cmtService.countCmtArticles(articles, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.be.an('array');
        done();
      });
    });
  });

  describe('-- COUNT COMMENTS OF AN ARTICLE UNIT TEST--', function() {
    var article;

    this.timeout(10000);
    before(function(done) {
      article = {
        title: 'test title',
        content: 'test content',
        photos: []
      };

      articleService.create(article, function(err, result) {
        article._id = result._id;
        done();
      });
    });

    after(function(done) {
      articleService.removeByField({
        title: 'test title'
      }, done);
    });

    it('should return total comments of an article', function(done) {
      cmtService.countCmt(article, function(err, results) {
        expect(err).to.be.null;
        assert.isNumber(results.totalCmts);
        done();
      });
    });
  });

  describe('-- ADD A COMMENT UNIT TEST--', function() {
    var article;

    this.timeout(10000);
    before(function(done) {
      article = {
        title: 'test title',
        content: 'test content',
        photos: []
      };

      articleService.create(article, function(err, result) {
        article._id = result._id;
        done();
      });
    });

    after(function(done) {
      articleService.removeByField({
        title: 'test title'
      }, function(err, result) {
        mongoConnection.close(done);
      });
    });

    it('should return error because the comment does not belong any user', function(done) {
      var opts = {
        data: {
          userId: new ObjectID("51bb793aca2ab77a3200000d"),
          articleId: new ObjectID("51bb793aca2ab77a3200000d"),
          content: 'test comment'
        }
      };

      cmtService.addComment(opts, function(err, results) {
        expect(err.status).to.be.equal(404);
        expect(err.message).to.be.equal('The comment does not belong any user');
        done();
      });
    });
  });
};