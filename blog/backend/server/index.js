'use strict';

var _ = require('underscore'),
  rfr = require('rfr'),
  Router = rfr('server/router'),
  DatabaseManager = rfr('db'),
  mongoConnection = rfr('utils/mongodb-connection'),
  Server;

Server = function(opts) {
  var self = this,
    webapp = this.webapp = opts.app,
    db = this.db = DatabaseManager,
    router = this.router = new Router({
      db: db, // object contains needed Services
      apis: ['comments', 'articles', 'users']
    }),
    apiHandler = function(req, res, next) {
      var requestParams = _.clone({
        controller: req.params.controller,
        action: req.params.action,
        query: req.query,
        method: req.method.toLowerCase(),
        data: req.body
      });

      requestParams = _.extend(requestParams, {
        req: req,
        res: res,
        next: next
      });

      self.router.handle(requestParams, function(err, results) {
        res.set('Content-Type', 'application/json');
        if (err) {
          return res.status(err.status || 500).send(err);
        }
        res.status(200).send(results);
      });
    };

  webapp.all('/api/:controller', apiHandler);
  webapp.all('/api/:controller/:action', apiHandler);

  // init mongoose
  mongoConnection.init();
};

module.exports = Server;
