'use strict';

var supertest = require('supertest'),
  api = supertest('http://localhost:3000/api'),
  server = supertest.agent('http://localhost:3000/api'),
  rfr = require('rfr'),
  // api test
  commentAPI = rfr('test/api-test/comment')(api, server),
  articleAPI = rfr('test/api-test/article')(api, server),
  userAPI = rfr('test/api-test/user')(api, server),
  // unit test
  userUnit = rfr('test/unit-test/user')(),
  article = rfr('test/unit-test/article')(),
  comment = rfr('test/unit-test/comment')();