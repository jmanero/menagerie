var Express = require('express');
var FS = require('fs');
var HTTP = require('http');

require('../lib/config');

var app = Express();
var server = HTTP.createServer(app);

// Convert true, false, and null to primatives
app.use(function(req, res, next) {
  Object.keys(req.query).forEach(function(key) {
    switch(req.query[key]) {
      case 'true':
        req.query[key] = true;
        break;
      case 'false':
        req.query[key] = false;
        break;
      case 'null':
        req.query[key] = null;
        break;
    }
  });
  next();
});
app.use(require('body-parser').json());

require('../lib/control/cookbook').attach(app);
require('../lib/control/directory').attach(app);
require('../lib/control/status').attach(app);

try { // Try to clean up existing file handle
  if (FS.existsSync(Config.get('service:listen'))) {
    console.log('Trying to remove existing socket file ' + Config.get('service:listen'));
    FS.unlinkSync(Config.get('service:listen'));
  }
} catch(e) {
  console.log('Error cleaning up socket file');
}

server.listen(Config.get('service:listen'), function() {
  console.log('Listening for requests on ' + Config.get('service:listen'));
});
