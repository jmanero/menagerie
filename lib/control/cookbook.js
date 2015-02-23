var Collection = require('../model/collection');

/**
 * Berkshelf API Interface
 */
exports.attach = function(app) {
  app.get('/universe', function(req, res, next) {
    Collection.of('cookbooks').list(function(err, resources) {
      if (err) return next(err);
      res.json(resources);
    });
  });
};
