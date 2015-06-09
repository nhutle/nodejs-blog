var rfr = require('rfr'),
  Base = rfr('server/base-restful-controller'),
  Comment = Base.extend({
    dbServiceName: 'dbComment',

    post: function(opts, callback) {
      this.getService().addComment(opts, callback);
    }
  });

module.exports = Comment;