var Async = require('async');
var Service = require('../model/service');
var Environment = require('../model/environment');

exports.attach = function(server) {
  server.get('/environment/:service/:version/:node', function(req, res, next) {
    Environment.get(req.params.service,
      req.params.version, req.params.node, function(err, env) {
        if (err) return next(err);
        var data = env.resolve();

        // Find peers
        Service.find(req.params.service, function(err, nodes) {
          if (err) return next(err);
          data.nodes = nodes;

          // If dependencies are defined, find them as well
          if(!(data.dependencies instanceof Object)) return res.send(data);
          Async.each(Object.keys(data.dependencies), function(service, done) {
            Service.find(service, function(err, nodes) {
              if (err) return done(err);

              data.dependencies[service] = {
                nodes: nodes
              };
              done();
            });
          }, function(err) {
            if (err) return next(err);
            res.send(data);
          });
        });
      });
  });
};
