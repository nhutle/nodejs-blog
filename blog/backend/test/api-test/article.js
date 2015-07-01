var should = require('chai').should,
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest('http://localhost:3000/api'),
  rfr = require('rfr'),
  ArticleService = rfr('db/services/article'),
  mongoConnection = rfr('utils/mongodb-connection'),
  articleService = new ArticleService();

describe('GET /articles', function() {
  this.timeout(10000);

  before(function(done) {
    mongoConnection.init(done);
  });

  after(function(done) {
    mongoConnection.close(done);
  });

  it('should return list of articles', function(done) {
    api
      .get('/articles?curPage=1&limit=5')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should return bad request', function(done) {
    api
      .get('/articles?curPage=-1&limit=5')
      .set('Accept', 'application/json')
      .expect(500, done);
  });
});

describe('GET /articles/:id', function() {
  var article;

  this.timeout(10000);
  before(function(done) {
    article = {
      title: 'test title',
      content: 'test content',
      photos: []
    };

    mongoConnection.init();
    articleService.create(article, function(err, result) {
      article._id = result._id;
      done();
    });
  });

  after(function(done) {
    articleService.removeByField({
      title: 'test title'
    }, function(err, result) {
      mongoConnection.close(done);
    });
  });

  it('should return detail of article', function(done) {
    api
      .get('/articles/' + article._id)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});

describe('POST /articles', function() {
  var article;

  this.timeout(10000);
  before(function(done) {
    article = {
      title: 'test title',
      content: 'test content',
      photos: []
    };

    mongoConnection.init(done);
  });

  after(function(done) {
    articleService.removeByField({
      title: 'test title'
    }, function(err, result) {
      mongoConnection.close(done);
    });
  });

  it('should add a new article', function(done) {
    api
      .post('/articles/')
      .set('Accept', 'application/json')
      .send(article)
      .expect(200, done);
  });
});

describe('PUT /articles/:id', function() {
  var article;

  this.timeout(10000);
  before(function(done) {
    article = {
      title: 'test title',
      content: 'test content',
      photos: []
    };

    mongoConnection.init();
    articleService.create(article, function(err, result) {
      article._id = result._id;
      done();
    });
  });

  after(function(done) {
    articleService.removeByField({
      title: 'test title'
    }, function(err, result) {
      mongoConnection.close(done);
    });
  });

  it('should update the article', function(done) {
    article.title = 'new title';
    api
      .put('/articles/' + article._id)
      .set('Accept', 'application/json')
      .send(article)
      .expect(200, done);
  });
});