var _ = require('underscore'),
  rfr = require('rfr'),
  userService = rfr('db/services/user'),
  commentService = rfr('db/services/comment'),
  articleService = rfr('db/services/article'),
  classes = {
    dbUser: userService,
    dbComment: commentService,
    dbArticle: articleService
  },
  neededService = {};

_.each(classes, function(item, key) {
  neededService[key] = new item();
});

module.exports = neededService;