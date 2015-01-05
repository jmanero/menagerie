var Bunyan = require('bunyan');
var Path = require('path');

var config = module.exports = require('nconf');
var package = require('../package.json');

config.argv();
config.file(Path.resolve(__dirname, '../config.json'));

config.defaults({
  name: package.name,
  version: package.version,
  server: {
    listen: 8080
  },
  etcd: {
    cluster: ['127.0.0.1:2379']
  }
});

global.Config = config;
global.Logger = Bunyan.createLogger({
  name: package.name,
  version: package.version,
  level: 'trace'
});
