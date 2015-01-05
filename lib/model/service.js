var ETCd = require('node-etcd');
var Path = require('path');

Logger.info('Using etcd cluster ' + Config.get('etcd:cluster'));
var client = new ETCd(Config.get('etcd:cluster'));

/**
 * TODO: Expose version states here. Data source?
 */

// TODO: Reap empty directories. These will start to pile up as versions are retired
exports.find = function(name, callback) {
  client.get(Path.join('/service', name), {
    recursive: true,
    sorted: true
  }, function(err, res) {
    if (err && err.errorCode === 100)
      return callback(null, {});
    if (err) return callback(err);
    if (!res.node.nodes || !res.node.nodes.length)
      return callback(null, {});

    var versions = {};
    res.node.nodes.forEach(function(node) {
      if (!node.nodes) return;
      versions[Path.basename(node.key)] = node.nodes.map(function(n) {
        var instance = JSON.parse(n.value);
        instance.ttl = n.ttl;

        return instance;
      });
    });

    callback(null, versions);
  });
};

exports.announce = function(name, version, id, ttl, params, callback) {
  params.serivce = name;
  params.version = version;

  client.set(Path.join('/service', name, version, id),
    JSON.stringify(params), {
      ttl: ttl
    }, function(err, res) {
      if (err) return callback(err);
      callback(null, res.node);
    });
};
