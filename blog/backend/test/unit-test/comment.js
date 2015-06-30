var rfr = require('rfr'),
  async = require('async'),
  chai = require('chai'),
  async = require('async'),
  mongoose = require('mongoose'),
  mongoConnection = rfr('utils/mongodb-connection'),
  CmtService = rfr('db/services/comment'),
  ArticleService = rfr('db/services/article'),
  expect = chai.expect,
  assert = chai.assert,
  cmtService = new CmtService(),
  articleService = new ArticleService();

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
    }, function(err, result) {
      mongoConnection.close(done);
    });
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

    mongoConnection.init();
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

    mongoConnection.init();
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

  it('should return  of comments', function(done) {
    var opts = {
      data: {
        userId: mongoose.Types.ObjectId("51bb793aca2ab77a3200000d"),
        articleId: mongoose.Types.ObjectId("51bb793aca2ab77a3200000d"),
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