var expect = require('chai').expect,
  rfr = require('rfr'),
  async = require('async'),
  mongoose = require('mongoose'),
  token = rfr('utils/token'),
  mongoConnection = rfr('utils/mongodb-connection'),
  ArticleService = rfr('db/services/article'),
  UserService = rfr('db/services/user'),
  CmtService = rfr('db/services/comment'),
  articleService = new ArticleService(),
  userService = new UserService(),
  cmtService = new CmtService();

module.exports = function(api, server) {
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

  describe('GET /articles', function() {
    this.timeout(10000);

    before(function(done) {
      mongoConnection.init(done);
    });

    it('should return list of articles', function(done) {
      api
        .get('/articles?curPage=1&limit=5')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should return bad request', function(done) {
      api
        .get('/articles?curPage=-1&limit=5')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should return bad request', function(done) {
      api
        .get('/articles?curPage=1&limit=-5')
        .set('Accept', 'application/json')
        .expect(400, done);
    });
  });

  describe('GET /articles/:id', function() {
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
      api
        .get('/articles/55978de192339c5f0b662ddf')
        .set('Accept', 'application/json')
        .expect(404)
        .expect({
          message: 'no article'
        }, done);
    });

    it('should return 400 because the article does not belong any user', function(done) {
      api
        .get('/articles/' + inUsrArticle._id)
        .set('Accept', 'application/json')
        .expect(400)
        .expect({
          message: 'the article does not belong any user'
        }, done);
    });

    it('should return 200', function(done) {
      api
        .get('/articles/' + article._id)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });

  describe('POST /articles', function() {
    this.timeout(10000);

    after(function(done) {
      articleService.removeByField({
        title: 'test title'
      }, done);
    });

    it('should add a new article', function(done) {
      api
        .post('/articles')
        .set('Accept', 'application/json')
        .send(article)
        .expect(200, done);
    });
  });

  describe('PUT /articles/:id', function() {
    this.timeout(10000);

    before(function(done) {
      articleService.create(article, function(err, result) {
        article._id = result._id;
        done();
      });
    });

    after(function(done) {
      articleService.removeByField({
        title: 'new title'
      }, done);
    });

    it('should update the article', function(done) {
      article.title = 'new title';
      api
        .put('/articles/' + article._id)
        .set('Accept', 'application/json')
        .send(article)
        .expect(200, done);
    });
  });

  describe('DELETE /articles/:id', function() {
    this.timeout(10000);

    before(function(done) {
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

    it('should remove the article', function(done) {
      api
        .delete('/articles/' + article._id)
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
};