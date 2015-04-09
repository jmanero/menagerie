var Path = require('path');

var config = global.Config = module.exports = require('nconf');
var package = require('../package.json');

config.argv();
config.file(Path.resolve(__dirname, '../config/site.json'));

config.defaults({
  name: package.name,
  version: package.version,
  service: {
    listen: 2381
  },
  db: {
    cluster: ['127.0.0.1:2379']
  }
});
