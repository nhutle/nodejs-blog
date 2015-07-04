var expect = require('chai').expect,
  rfr = require('rfr'),
  async = require('async'),
  mongoConnection = rfr('utils/mongodb-connection'),
  mongoose = require('mongoose'),
  token = rfr('utils/token'),
  UserService = rfr('db/services/user'),
  userService = new UserService(),
  CommentService = rfr('db/services/comment'),
  ArticleService = rfr('db/services/article'),
  commentService = new CommentService(),
  articleService = new ArticleService();

module.exports = function(api, server) {
  var comment, actUser, optsAct, request;

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

  describe('POST /comments', function() {
    this.timeout(10000);

    before(function(done) {
      mongoConnection.init();

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
            article.userId = mongoose.Types.ObjectId(user._id);
            callback(null, user);
          });
        },
        function(user, callback) {
          optsAct.req.headers = {};
          optsAct.req.headers['Authorization'] = token.geneToken(user, 30);
          optsAct.req.body = {};
          optsAct.req.query = {};
          userService.authen(optsAct, function(err, result) {
            if(err) return callback(err);

            callback(null);
          });
        },
        function(callback) {
          articleService.create(article, function(err, result) {
            if (err) return callback(err);

            article._id = result._id;
            callback(null);
          });
        }
      ], function(err, results) {
        comment = {
          userId: mongoose.Types.ObjectId(actUser._id),
          articleId: mongoose.Types.ObjectId(article._id),
          content: 'test comment'
        };
        done();
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
        },
        function(callback) {
          commentService.removeByField({
            content: 'test comment'
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
};