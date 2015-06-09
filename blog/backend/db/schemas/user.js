'use strict';

var mongoose = require('mongoose'),
  uniqueValidator = require('mongoose-unique-validator'),
  Schema = mongoose.Schema,
  UserSchema,
  User;

UserSchema = new Schema({
  fullname: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  avatar: String,
  isActivated: Boolean
}, {
  collection: 'user'
});

UserSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.'
});
User = mongoose.model('User', UserSchema);

module.exports = User;