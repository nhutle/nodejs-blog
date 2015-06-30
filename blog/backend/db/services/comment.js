var rfr = require('rfr'),
  _ = require('underscore'),
  async = require('async'),
  model = rfr('db/schemas/comment'),
  UserService = rfr('db/services/user'),
  Base = rfr('db/base-service'),
  Comment;

userService = new UserService();

Comment = Base.extend({
  modelClass: model,

  countCmtArticles: function(articles, callback) {
    var countCmtTasks = [],
      self = this;

    _.each(articles, function(article) {
      var countCmtTask = function(callback) {
        self.countCmt(article, callback);
      };

      countCmtTasks.push(countCmtTask);
    });

    async.parallel(countCmtTasks, function(err, articles) {
      if (err) return callback(err);

      callback(null, articles);
    });
  },

  countCmt: function(article, callback) {
    this.modelClass.count({
      articleId: article._id
    }, function(err, totalCmts) {
      if (err) {
        return callback(err);
      }

      article = typeof article.toJSON === 'function' ? article.toJSON() : article;
      article.totalCmts = totalCmts;
      callback(null, article);
    });
  },

  addComment: function(opts, callback) {
    var cmt = opts.data,
      self = this;

    async.parallel([

      function(callback) {
        new self.modelClass(cmt).save(function(err, cmt) {
          if (err) {
            return callback(err);
          }

          callback(null, cmt);
        });
      },

      function(callback) {
        userService.findById(cmt.userId, function(err, user) {
          if (err)
            return callback({
              status: 500,
              message: 'Unknown error'
            });

          if (!user)
            return callback({
              status: 404,
              message: 'The comment does not belong any user'
            });

          callback(null, user);
        })
      }
    ], function(err, results) {
      if (err) {
        return callback(err);
      }

      results[0] = results[0].toJSON();
      results[0].user = {
        avatar: results[1].avatar,
        fullname: results[1].fullname
      };

      console.log(results);

      callback(null, results[0]);
    });
  }
});

module.exports = Comment;