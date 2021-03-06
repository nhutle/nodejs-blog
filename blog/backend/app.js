var express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  multer = require('multer'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  mongoose = require('mongoose'),
  MongoStore = require('connect-mongo')(session),
  rfr = require('rfr'),
  config = rfr('utils/config'),
  Server = rfr('server/index'),

  app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '../', 'frontend/dist')));

app.use(session({
  secret: 'this-is-a-secret-string',
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  cookie: { // secure cookie
    httpOnly: true,
    secure: true
  }
}));

/*upload file*/
app.use(multer({
  dest: 'public/images',
  // putSingleFilesInArray: true,
  rename: function(fieldname, filename) {
    return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
  }
}));

new Server({
  app: app
});

module.exports = app;