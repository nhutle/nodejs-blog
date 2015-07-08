var rfr = require('rfr'),
  async = require('async'),
  expect = require('chai').expect,
  ObjectID = require('mongodb').ObjectID,
  mongoose = require('mongoose'),
  mongoConnection = rfr('utils/mongodb-connection'),
  ArticleService = rfr('db/services/article'),
  UserService = rfr('db/services/user'),
  CmtService = rfr('db/services/comment'),
  articleService = new ArticleService(),
  userService = new UserService(),
  cmtService = new CmtService(),
  token = rfr('utils/token');

module.exports = function() {
  var article, actUser, optsAct, request, comment, inUsrArticle;

  article = {
    title: 'test title',
    content: 'test content',
    photos: []
  };
  request = {
    protocol: 'http',
    get: function(param) {
      return 'localhost';
    }
  };
  actUser = {
    fullname: 'fullname test',
    email: 'prohulocle@throam.com',
    password: 'password test',
    avatar: ''
  };
  optsAct = {
    data: actUser,
    req: request
  };
  inUsrArticle = {
    title: 'test title inUsrArticle',
    content: 'test content inUsrArticle',
    photos: []
  };

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

    it('should return bad request', function(done) {
      var opts = {
        query: {
          curPage: -1,
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

    it('should return error', function(done) {
      var curPage = 0,
        limit = 5;

      articleService.getArticlesInfo(curPage, limit, function(err, results) {
        expect(err).to.be.an('object');
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
    this.timeout(10000);

    before(function(done) {
      async.waterfall([

        function(callback) {
          userService.create(optsAct, callback);
        },
        function(callback) {
          userService.findOne({
            email: actUser.email
          }, function(err, user) {
            if (err) return callback(err);

            actUser._id = user._id;
            callback(null, user);
          });
        },
        function(user, callback) {
          optsAct.req.headers = {};
          optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
          optsAct.req.headers['authorization'] = token.geneToken(user, 30);
          optsAct.req.body = {};
          optsAct.req.query = {};
          userService.authen(optsAct, function(err, result) {
            if (err) return callback(err);

            callback(null);
          });
        },
        function(callback) {
          article.userId = actUser._id;
          articleService.create(article, function(err, result) {
            if (err) return callback(err);

            article._id = result._id;
            callback(null);
          });
        },
        function(callback) {
          articleService.create(inUsrArticle, function(err, result) {
            if (err) return callback(err);

            inUsrArticle._id = result._id;
            callback(null);
          });
        },
        function(callback) {
          var opts = {
            data: {
              userId: mongoose.Types.ObjectId(actUser._id),
              articleId: mongoose.Types.ObjectId(article._id),
              content: 'test comment'
            }
          };

          cmtService.addComment(opts, callback);
        }
      ], done);
    });

    after(function(done) {
      async.parallel([

        function(callback) {
          articleService.removeByField({
            title: 'test title'
          }, callback);
        },
        function(callback) {
          articleService.removeByField({
            title: 'test title inUsrArticle'
          }, callback);
        },
        function(callback) {
          userService.removeByField({
            email: 'prohulocle@throam.com'
          }, callback);
        },
        function(callback) {
          cmtService.removeByField({
            content: 'test comment'
          }, callback);
        }
      ], done);
    });

    it('should return 404 on account of no article', function(done) {
      var opts = {
        action: mongoose.Types.ObjectId('51bb793aca2ab77a3200000d'),
        req: {
          session: {
            userId: ''
          }
        }
      };

      articleService.getArticleInfo(opts, function(err, result) {
        expect(err.status).to.be.equal(404);
        expect(err.message).to.be.equal('no article');
        done();
      });
    });

    it('should return 400 because the article does not belong any user', function(done) {
      var opts = {
        action: mongoose.Types.ObjectId(inUsrArticle._id),
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

    it('should return 200', function(done) {
      var opts = {
        action: mongoose.Types.ObjectId(article._id),
        req: {
          session: {
            userId: ''
          }
        }
      };

      articleService.getArticleInfo(opts, function(err, result) {
        expect(err).to.be.equal(null);
        done();
      });
    });
  });

  describe('-- GET ARTICLE\'s COMMENTS UNIT TEST--', function() {
    this.timeout(10000);

    before(function(done) {
      async.waterfall([

        function(callback) {
          userService.create(optsAct, callback);
        },
        function(callback) {
          userService.findOne({
            email: actUser.email
          }, function(err, user) {
            if (err) return callback(err);

            actUser._id = user._id;
            callback(null, user);
          });
        },
        function(user, callback) {
          optsAct.req.headers = {};
          optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
          optsAct.req.headers['authorization'] = token.geneToken(user, 30);
          optsAct.req.body = {};
          optsAct.req.query = {};
          userService.authen(optsAct, function(err, result) {
            if (err) return callback(err);

            callback(null);
          });
        },
        function(callback) {
          article.userId = actUser._id;
          articleService.create(article, function(err, result) {
            if (err) return callback(err);

            article._id = result._id;
            callback(null);
          });
        },
        function(callback) {
          articleService.create(inUsrArticle, function(err, result) {
            if (err) return callback(err);

            inUsrArticle._id = result._id;
            callback(null);
          });
        },
        function(callback) {
          var opts = {
            data: {
              userId: mongoose.Types.ObjectId(actUser._id),
              articleId: mongoose.Types.ObjectId(article._id),
              content: 'test comment'
            }
          };

          cmtService.addComment(opts, callback);
        }
      ], done);
    });

    after(function(done) {
      async.parallel([

        function(callback) {
          articleService.removeByField({
            title: 'test title'
          }, callback);
        },
        function(callback) {
          articleService.removeByField({
            title: 'test title inUsrArticle'
          }, callback);
        },
        function(callback) {
          userService.removeByField({
            email: 'prohulocle@throam.com'
          }, callback);
        },
        function(callback) {
          cmtService.removeByField({
            content: 'test comment'
          }, callback);
        }
      ], done);
    });

    it('should return cmts', function(done) {
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