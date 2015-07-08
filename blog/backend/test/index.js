'use strict';

var supertest = require('supertest'),
  api = supertest('http://localhost:3000/api'),
  server = supertest.agent('http://localhost:3000/api'),
  rfr = require('rfr'),
  // api test
  cmtAPI = rfr('test/api-test/comment')(api, server),
  articleAPI = rfr('test/api-test/article')(api, server),
  userAPI = rfr('test/api-test/user')(api, server),
  // unit test
  userUnit = rfr('test/unit-test/user')(),
  articleUnit = rfr('test/unit-test/article')(),
  cmtUnit = rfr('test/unit-test/comment')(),
  mongoConnUnit = rfr('test/unit-test/mongodb-connection')();