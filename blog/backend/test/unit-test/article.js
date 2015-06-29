var rfr = require('rfr'),
  async = require('async'),
  chai = require('chai'),
  async = require('async'),
  mongoose = require('mongoose'),
  mongoConnection = rfr('utils/mongodb-connection'),
  CmtService = rfr('db/services/comment'),
  UserService = rfr('db/services/user'),
  ArticleService = rfr('db/services/article'),
  should = chai.should,
  expect = chai.expect,
  assert = chai.assert,
  cmtService = new CmtService(),
  userService = new UserService(),
  articleService = new ArticleService();

describe('-- GET LIST OF ARTICLES UNIT TEST--', function() {
  before(function(done) {
    mongoConnection.init(done);
  });

  after(function(done) {
    mongoConnection.close(done);
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
      expect(err).to.be.an('object');
      expect(results).to.be.equal(undefined);
      done();
    })
  })
});

describe('-- GET TOTAL PAGES UNIT TEST--', function() {
  before(function(done) {
    mongoConnection.init(done);
  });

  after(function(done) {
    mongoConnection.close(done);
  });

  it('should return a number of total page', function(done) {
    articleService.getTotalPage(function(err, results) {
      expect(err).to.be.null;
      expect(results).to.be.an('number');
      done();
    });
  });
});

describe('-- GET ARTICLES INFORMATION UNIT TEST--', function() {
  before(function(done) {
    mongoConnection.init(done);
  });

  after(function(done) {
    mongoConnection.close(done);
  });

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

  before(function(done) {
    article = {
      userId: '',
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

  it('should return list of articles', function(done) {
    var opts = {
      action: mongoose.Types.ObjectId(article._id) + '',
      req: {
        session: {
          userId: ''
        }
      }
    };

    articleService.getArticle(opts, function(err, result) {
      console.log(err);
      // expect(err).to.be.null;
      // expect(results.title).to.be.an('test title');
      done();
    });
  });
});