var Collection = require('../model/collection');
var Package = require('../../package.json');

exports.attach = function(app) {
  var started = Date.now();
  app.get('/status', function(req, res, next) {
    res.json({
      status: 'ok',
      mood: 'ಠ_ಠ',
      version: Package.version,
      source: Package.repository.url,
      uptime: (Date.now() - started) / 1000
    });
  });

  app.get('/store', function(req, res, next) {
    Collection.client.raw('GET', '/v2/members', null, {}, function(err, members) {
      if(err) return next(err);
      res.json(members);
    });
  });
};
