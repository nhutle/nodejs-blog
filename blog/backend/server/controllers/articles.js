var rfr = require('rfr'),
  multer = require('multer'),
  _ = require('underscore'),
  Base = rfr('server/base-restful-controller'),
  Article = Base.extend({
    dbServiceName: 'dbArticle',

    actions: {
      'upload': {
        method: 'post',
        fn: 'uploadImage'
      }
    },

    get: function(opts, callback) {
      if (opts.action) {
        return this.getById(opts, callback);
      }

      this.getArticles(opts, callback);
    },

    getArticles: function(opts, callback) {
      this.getService().getArticles(opts, callback);
    },

    getById: function(opts, callback) {
      this.getService().getArticle(opts, callback);
    },

    uploadImage: function(opts) {
      var files = _.values(opts.req.files),
          fileNames = [];

      _.each(files, function(file) {
        fileNames.push('images/' + file.name);
      });
      opts.res.send(fileNames);
    },

    post: function(opts, callback) {
      opts.data.userId = opts.req.session.userId;
      this.base(opts, callback);
    }
  });

module.exports = Article;