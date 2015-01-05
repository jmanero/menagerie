var Restify = require('restify');
var Service = require('../model/service');

exports.attach = function(server) {
  server.get('/discover/:service', function(req, res, next) {
    Service.find(req.params.service, function(err, nodes) {
      if (err) return next(err);
      if (!Object.keys(nodes).length)
        return next(new Restify.NotFoundError('Serivce ' + name + ' has no nodes'));

      res.send(nodes);
    });
  });

  server.post('/announce/:service/:version', function(req, res, next) {
    if (!req.body.id) return next(new Restify.NotAcceptableError(
      'Announcement must include an id parameter!'));
    var id = req.body.id.toString().replace('/', '.');
    var ttl = req.query.ttl || 10;

    Service.announce(req.params.service,
      req.params.version, id, ttl, req.body, function(err, node) {
        if (err) return next(err);

        res.status(202);
        res.send({
          status: 'Accepted',
          index: node.modifiedIndex,
          key: node.key
        });
      });
  });
};
