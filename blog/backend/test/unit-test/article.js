var rfr = require('rfr'),
  async = require('async'),
  expect = require('chai').expect,
  ObjectID = require('mongodb').ObjectID,
  mongoose = require('mongoose'),
  mongoConnection = rfr('utils/mongodb-connection'),
  ArticleService = rfr('db/services/article'),
  articleService = new ArticleService();

module.exports = function() {
  describe('-- GET LIST OF ARTICLES UNIT TEST--', function() {
    before(function(done) {
      mongoConnection.init(done);
    });

    it('should return list of articles', function(done) {
      var opts = {
        query: {
          curPage: 1,
          limit: 5
        }
      };

      articleService.getArticles(opts, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.be.an('array');
        done();
      });
    });

    it('should return bad request', function(done) {
      var opts = {
        query: {
          curPage: -1,
          limit: 5
        }
      };

      articleService.getArticles(opts, function(err, results) {
        expect(err.status).to.be.equal(400);
        expect(err.message).to.be.equal('bad request');
        done();
      });
    });

    it('should return bad request', function(done) {
      var opts = {
        query: {
          curPage: 1,
          limit: -5
        }
      };

      articleService.getArticles(opts, function(err, results) {
        expect(err.status).to.be.equal(400);
        expect(err.message).to.be.equal('bad request');
        done();
      });
    });
  });

  describe('-- GET TOTAL PAGES UNIT TEST--', function() {
    it('should return a number of total page', function(done) {
      var limit = 5;

      articleService.getTotalPage(limit, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.be.an('number');
        done();
      });
    });
  });

  describe('-- GET ARTICLES INFORMATION UNIT TEST--', function() {
    it('should return list of articles', function(done) {
      var curPage = 1,
        limit = 5;

      articleService.getArticlesInfo(curPage, limit, function(err, results) {
        expect(err).to.be.null;
        expect(results).to.be.an('array');
        done();
      });
    });
  });

  describe('-- GET ARTICLE DETAIL UNIT TEST--', function() {
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

    it('should return detail of article', function(done) {
      var opts = {
        action: article._id,
        req: {
          session: {
            userId: ''
          }
        }
      };

      articleService.getArticle(opts, function(err, result) {
        expect(err.status).to.be.equal(400);
        expect(err.message).to.be.equal('the article does not belong any user');
        done();
      });
    });
  });

  describe('-- GET ARTICLE INFO UNIT TEST--', function() {
    var article;

    this.timeout(10000);
    before(function(done) {
      article = {
        userId: new ObjectID("51bb793aca2ab77a3200000d"),
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

    it('should return article\'s information', function(done) {
      var opts = {
        action: article._id,
        req: {
          session: {
            userId: ''
          }
        }
      };

      articleService.getArticleInfo(opts, function(err, result) {
        expect(err.status).to.be.equal(400);
        expect(err.message).to.be.equal('the article does not belong any user');
        done();
      });
    });
  });

  describe('-- GET ARTICLE\'s COMMENTS UNIT TEST--', function() {
    var article;

    this.timeout(10000);
    before(function(done) {
      article = {
        userId: new ObjectID("51bb793aca2ab77a3200000d"),
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

    it('should return article\'s information', function(done) {
      var opts = {
        action: article._id,
        req: {
          session: {
            userId: ''
          }
        }
      };

      articleService.getArticleCmts(opts, function(err, result) {
        expect(err).to.be.null;
        expect(result).to.be.an('array');
        done();
      });
    });
  });
}