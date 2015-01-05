var Restify = require('restify');
require('../lib/config');

var Discover = require('../lib/control/discover');
var Environment = require('../lib/control/environment');

var server = Restify.createServer({
  log: Logger,
  name: Config.get('name'),
  version: Config.get('version')
});

server.use(Restify.CORS());
server.use(Restify.dateParser());
server.use(Restify.queryParser());
server.use(Restify.bodyParser({
  mapParams: false
}));

server.use(Restify.requestLogger());
// server.use(function(req, res, next) {
//   req.log.debug(req.method + ' ' + req.url, {
//     method: req.method,
//     path: req.url,
//     client: req.socket.remoteAddress + ':' + req.socket.remotePort
//   });
//   next();
// });

// server.on('after', Restify.auditLogger({
//   log: Logger.child({
//     type: 'audit'
//   })
// }));

Discover.attach(server);
Environment.attach(server);

Logger.info('Starting service ' + Config.get('name') + '@' + Config.get('version'));
server.listen(Config.get('server:listen'), function() {
  Logger.info('Listening on port ' + Config.get('server:listen'));
});
