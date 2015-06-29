'use strict';

var mongoose = require('mongoose'),
  data = {};

data.inactivatedUser = {
  email: ''
};

data.activatedUser = {
  fullname: 'fullname test',
  isActivated: true,
  email: 'lanukapath@throam.com',
  password: '123456',
  avatar: '',
  _id: mongoose.Types.ObjectId('')
}