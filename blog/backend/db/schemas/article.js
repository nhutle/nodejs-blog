'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  ArticleSchema = new Schema({
    userId: String,
    title: String,
    content: String,
    photos: [String]
  }, {
    collection: 'article'
  }),

  Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;