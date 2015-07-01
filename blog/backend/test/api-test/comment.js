var should = require('chai').should,
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest('http://localhost:3000/api'),
  rfr = require('rfr'),
  async = require('async'),
  UserService = rfr('db/services/user'),
  CommentService = rfr('db/services/comment'),
  ArticleService = rfr('db/services/article'),
  mongoConnection = rfr('utils/mongodb-connection'),
  mongoose = require('mongoose'),
  token = rfr('utils/token'),
  commentService = new CommentService(),
  articleService = new ArticleService(),
  userService = new UserService();

describe('POST /comments', function() {
  var comment, actUser;

  this.timeout(10000);

  before(function(done) {
    var optsAct, request;

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
    article = {
      title: 'test title',
      content: 'test content',
      photos: []
    };

    mongoConnection.init();
    articleService.create(article, function(err, result) {
      article._id = result._id;

      async.waterfall([

        function(callback) {
          userService.create(optsAct, function(err, user) {
            if (err) return callback(err);

            callback(null);
          });
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
          optsAct.req.body = {};
          optsAct.req.query = {};
          userService.authen(optsAct, function(err, result) {
            if (err) return callback(err);

            callback(null)
          });
        }
      ], function(err, results) {
        console.log(actUser);
        comment = {
          userId: mongoose.Types.ObjectId(actUser._id),
          articleId: mongoose.Types.ObjectId(article._id),
          content: 'test comment'
        };
        done();
      });
    });
  });

  after(function(done) {
    async.parallel([
      function(callback) {
        articleService.removeByField({
          title: 'test title'
        }, callback);
      },
      function(callback) {
        userService.removeByField({
          email: 'prohulocle@throam.com'
        }, callback);
      }
    ], function(err, results) {
      mongoConnection.close(done);
    });
  });

  it('should add a comment to the article', function(done) {
    api
      .post('/comments')
      .set('Accept', 'application/json')
      .send(comment)
      .expect(200, done);
  });
});