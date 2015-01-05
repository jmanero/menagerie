var FS = require('fs');
var Path = require('path');

/**
 * Data structure to manage multiple precedence schema
 */
var Environment = exports.Environment = function() {};

var PRECEDENCE = ['node', 'version', 'service', 'global'];
var DATA_DIR = Path.resolve(__dirname, '../../data');
var cache = exports.cache = {};

function deepMerge(to, from) {
  if(!(from instanceof Object)) return to;

  Object.keys(from).forEach(function(k) {
    if(from[k] instanceof Object) {
      if (!(to[k] instanceof Object)) to[k] = {};
      return deepMerge(to[k], from[k]);
    }

    to[k] = from[k];
  });

  return to;
}

/**
 * Traverse an object path of a precedence level
 *
 * @private
 */
Environment.prototype._traverse = function(level, path) {
  var node = this[level];
  for (var i = 0; i < path.length && node !== undefined; i++)
    node = node[path[i]];

  return node;
};

/**
 * Find the most precedent value on an object path
 */
Environment.prototype.get = function(path) {
  path = path.split(':');
  var value;

  for (var i = 0; i < PRECEDENCE.length && value === undefined; i++)
    value = this._traverse(PRECEDENCE[i], path);

  return value;
};

/**
 * Merge precedence levels into a single object
 */
Environment.prototype.resolve = function() {
  var attributes = {};
  for (var i = PRECEDENCE.length - 1; i >= 0; i--)
    deepMerge(attributes, this[PRECEDENCE[i]]);

  return attributes;
};

/**
 * Fetch and cache an attribute set from the datastore
 * TODO: Mock testing for development. Replace FS.readFile with AWS-SDK::S3
 */
function loadAttributes(path, callback) {
  if (cache.hasOwnProperty(path)) return callback(null, cache[path]);
  FS.readFile(Path.join(DATA_DIR, path) + '.json', function(err, data) {
    if (err && err.code == 'ENOENT') return callback(null, {});
    if (err) return callback(err);

    try {
      data = JSON.parse(data.toString('utf8'));

      // Purge Cache
      setTimeout(function() {
        delete cache[path];
      }, 5000);

      cache[path] = data;
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

/**
 * Fetch all precedence levels for a node, version, or service
 * and build an Environment object
 */
exports.get = function(service, version, node, callback) {
  if (node instanceof Function) {
    callback = node;
    node = undefined;
  } else if (version instanceof Function) {
    callback = version;
    version = undefined;
    node = undefined;
  } else if (service instanceof Function) {
    callback = service;
    service = undefined;
    version = undefined;
    node = undefined;
  }

  var env = new Environment();
  loadAttributes('global', function(err, data) {
    if (err) return callback(err);
    env.global = data;
    if (!service) return callback(null, env);

    loadAttributes(service, function(err, data) {
      if (err) return callback(err);
      env.service = data;
      if (!version) return callback(null, env);

      loadAttributes(Path.join(service, version), function(err, data) {
        if (err) return callback(err);
        env.version = data;
        if (!node) return callback(null, env);

        loadAttributes(Path.join(service, version, node), function(err, data) {
          if (err) return callback(err);
          env.node = data;
          callback(null, env);
        });
      });
    });
  });
};
