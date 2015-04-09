var Collection = require('../model/collection');
var Resource = require('../model/resource');

exports.attach = function(app) {
  app.get('/collections', function(req, res, next) {
    Collection.list(function(err, collections) {
      if (err) next(err);
      res.json(collections);
    });
  });

  app.get('/collections/:collection', function(req, res, next) {
    Collection.of(req.params.collection).list(function(err, resources) {
      if (err) return next(err);
      res.json(resources);
    });
  });

  app.get('/collections/:collection/:resource', function(req, res, next) {
    Collection.of(req.params.collection)
      .get(req.params.resource, function(err, resources) {
        if (err) return next(err);
        res.json(resources);
      });
  });

  app.get('/collections/:collection/:resource/:version', function(req, res, next) {
    Collection.of(req.params.collection)
      .get(req.params.resource,
        req.params.version,
        function(err, resources) {
          if (err) return next(err);
          res.json(resources);
        });
  });

  app.put('/collections/:collection', function(req, res, next) {
    Collection.of(req.params.collection)
      .set(Resource.create(req.body, req.query), function(err, status) {
        if (err) return next(err);
        res.status(201).json({
          action: status.action
        });
      });
  });

  app.delete('/collections/:collection/:resource/:version', function(req, res, next) {
    Collection.of(req.params.collection)
      .del(req.params.resource,
        req.params.version,
        function(err, deleted) {
          if (err) return next(err);
          if (deleted) return res.status(204).end();
          res.status(404).end();
        });
  });
};
