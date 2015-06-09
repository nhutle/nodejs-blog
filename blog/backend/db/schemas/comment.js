'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  CommentSchema = new Schema({
    articleId: String,
    userId: String,
    content: String
  }, {
    collection: 'comment'
  }),

  Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;