#!/usr/bin/env node

var OS = require('os');
var Path = require('path');
var Restify = require('restify');

var client = Restify.createJsonClient({
  url: 'http://127.0.0.1:8080',
  version: '0.0.x'
});

var service = process.argv[2] || 'foo';
var version = process.argv[3] || '0.0.1';

function announce() {
  var announcement = {
    id: 'i-f00bar/' + process.pid,
    uptime: process.uptime(),
    hostname: OS.hostname(),
    port: 17726,
    instance: 'i-f00bar',
    pid: process.pid
  };
  console.log('ANNOUNCE ' + service + '@' + version + ': ' + JSON.stringify(announcement, null, 2));

  client.post(Path.join('/announce', service, version), announcement,
    function(err, req, res, obj) {
      if (err) return console.log(err);
      console.log(res.statusCode + ': ' + JSON.stringify(obj, null, 2));
    });
}

setInterval(announce, 5000);
announce();
