var ETCd = require('node-etcd');
var Path = require('path');
var Resource = require('./resource');

/**
 * Namespace wrapper for a collection of resources
 */
var Collection = module.exports = function(name) {
  if (!(this instanceof Collection)) return new Collection(name);
  this.name = name;
};
Collection.of = function(name) {
  return new Collection(name);
};

// TODO Surface connection events
console.log('Connecting to cluster ' + Config.get('db:cluster'));
var c = Collection.client = new ETCd(Config.get('db:cluster'));

/**
 * List available collections
 *
 * @callback(Error, Array[Strings]) An array of collection namespaces
 */
Collection.list = function(callback) {
  c.get('/collection', function(err, data) {
    if (err && err.errorCode === 100) return callback(null, []);
    if (err) return callback(err);

    callback(null, data.node.nodes.map(function(node) {
      return Path.basename(node.key);
    }));
  });
};

/**
 * @private Construct a hash from recursive ETCd structures
 */
function eachChild(node, each) {
  if (!node.dir) return each(node);

  var values = {};
  if(!node.nodes || !node.nodes.length) return values;

  node.nodes.forEach(function(node) {
    var value = each(node);
    if (!!value) values[Path.basename(node.key)] = value;
  });

  return values;
}

/**
 * List resources in the collection
 *
 * @callback(Error, Object) A hash of `{resource{version[instance]}}`
 */
Collection.prototype.list = function(callback) {
  var collection = this;

  c.get(Path.join('/collection', this.name), {
    recursive: true
  }, function(err, data) {
    if (err && err.errorCode === 100) return callback(null, {});
    if (err) return callback(err);

    var resources = eachChild(data.node, function(node) { // Iterate over resources in collection
      return eachChild(node, function(node) { // Iterate over versions of resource
        return eachChild(node, function(node) { // Iterate over instances of resource@version
          try {
            return Resource.fromNode(node);
          } catch (e) { console.log(e); } // TODO: Surface deserialization errors
        });
      });
    });

    callback(null, resources);
  });
};

/**
 * Add a resource to a version-set
 */
Collection.prototype.set = function(resource, callback) {
  var path = ['/collection', this.name, resource.name, resource.version];
  if (resource._multiple) path.push(resource.instance);

  c.set(Path.join.apply(Path, path), JSON.stringify(resource), {
    recursive: true,
    ttl: resource._ttl
  }, callback);
};

Collection.prototype.del = function(name, version, callback) {
  var collection = this;
  var path = ['/collection', this.name, name];

  if (version instanceof Function) callback = version;
  else path.push(version);

  c.del(Path.join.apply(Path, path), {
      recursive: true
    },
    function(err, data) {
      if (err && err.errorCode === 100) return callback(null, false);
      if (err) return callback(err);
      callback(null, true);
    });
};

/**
 * Get resource@version from the collection
 */
Collection.prototype.get = function(name, version, callback) {
  var collection = this;
  var path = ['/collection', this.name, name];

  if (version instanceof Function) callback = version;
  else path.push(version);

  c.get(Path.join.apply(Path, path), {
      recursive: true
    },
    function(err, data) {
      if (err && err.errorCode === 100) return callback(null, {});
      if (err) return callback(err);

      var resources = eachChild(data.node, function(node) {
        try {
          return Resource.fromNode(node);
        } catch (e) { console.log(e); }
      });

      callback(null, resources);
    });
};
