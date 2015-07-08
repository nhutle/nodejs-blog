var rfr = require('rfr'),
  async = require('async'),
  _ = require('underscore'),
  model = rfr('db/schemas/article'),
  CmtService = rfr('db/services/comment'),
  UserService = rfr('db/services/user'),
  Base = rfr('db/base-service'),
  cmtService,
  userService,
  Article;

cmtService = new CmtService();
userService = new UserService();

Article = Base.extend({
  modelClass: model,

  getArticles: function(opts, callback) {
    var self = this,
      curPage = opts.query.curPage,
      limit = opts.query.limit;

    if (limit <= 0 || curPage <= 0)
      return callback({
        status: 400,
        message: 'bad request'
      });

    async.parallel([

      function(callback) {
        self.getArticlesInfo(curPage, limit, callback);
      },
      function(callback) {
        self.getTotalPage(limit, callback);
      }
    ], function(err, results) {
      if (err) return callback(err);

      callback(null, results);
    });
  },

  getTotalPage: function(limit, callback) {
    this
      .modelClass
      .count(function(err, total) {
        if (err) return callback(err);

        total = Math.ceil(total / limit);
        callback(null, total);
      });
  },

  getArticlesInfo: function(curPage, limit, callback) {
    var countCmtTasks = [];

    this
      .modelClass
      .find()
      .skip((curPage - 1) * limit)
      .limit(limit)
      .exec(function(err, articles) {
        if (err) return callback(err);

        cmtService.countCmtArticles(articles, callback);
      });
  },

  getArticle: function(opts, callback) {
    var self = this;

    async.parallel({
      article: function(callback) {
        self.getArticleInfo(opts, callback);
      },
      cmts: function(callback) {
        self.getArticleCmts(opts, callback);
      }
    }, function(err, results) {
      if (err) return callback(err);

      results.article.cmts = results.cmts;

      callback(null, results.article);
    });
  },

  getArticleInfo: function(opts, callback) {
    var articleId = opts.action,
      self = this;

    async.waterfall([

      function(callback) {
        self.findById(articleId, function(err, article) {
          if (err) return callback(err);

          if (!article)
            return callback({
              status: 404,
              message: 'no article'
            });

          callback(null, article);
        });
      },
      function(article, callback) {
        userService.findById(article.userId, function(err, user) {
          // console.log('user--->', user);
          // console.log('err--->', err);
          if (err) return callback(err);

          if (!user)
            return callback({
              status: 400,
              message: 'the article does not belong any user'
            });

          article = article.toJSON();
          // console.log('opts.req.session.userId--->', opts.req.session.userId);
          // article.isEditable = article.userId === opts.req.session.userId ? true : false;
          article.isEditable = true;
          article.owner = user.fullname;
          callback(null, article);
        })
      }
    ], function(err, article) {
      if (err) return callback(err);

      callback(null, article);
    });
  },

  getArticleCmts: function(opts, callback) {
    var articleId = opts.action,
      self = this;

    async.waterfall([

      function(callback) {
        cmtService.find({
          articleId: articleId
        }, function(err, cmts) {
          var asyncUserTasks = [];

          if (err) return callback(err);

          _.each(cmts, function(cmt) {
            var asyncUserTask = function(callback) {
              userService.findById(cmt.userId, function(err, user) {
                var cmtUser = {};

                if (err) return callback(err);

                if (!user)
                  return callback({
                    status: 404,
                    message: 'the comment does not belong any user'
                  });

                cmtUser.content = cmt.content;
                cmtUser._id = cmt._id;
                cmtUser.user = {
                  avatar: user.avatar,
                  fullname: user.fullname
                };

                callback(null, cmtUser);
              })
            };

            asyncUserTasks.push(asyncUserTask);
          });

          async.parallel(asyncUserTasks, function(err, cmts) {
            if (err) return callback(err);

            callback(null, cmts);
          });
        });
      }
    ], function(err, cmts) {
      if (err)
        return callback({
          status: 500,
          message: 'There is an error occuring'
        });

      callback(null, cmts);
    });
  }
});

module.exports = Article;