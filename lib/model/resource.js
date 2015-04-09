var Semver = require('semver');
var UUID = require('libuuid');

var Resource = module.exports = function(options) {
  options = options || {};

  this._require('name');
  this._validate('version', Semver.clean, '0.0.1');
  this._default('instance', UUID.create);

  this._multiple = !!(options.multiple);
  this._ttl = +(options.ttl) || undefined;
};

Resource.create = function(resource, options) {
  resource.__proto__ = Resource.prototype; // jshint ignore:line
  Resource.call(resource, options);

  return resource;
};

Resource.prototype._default = function(key, value) {
  if (!this[key]) this[key] = (value instanceof Function) ? value() : value;
};

Resource.prototype._validate = function(key, validator, dvalue) {
  if (!!this[key]) this[key] = validator(this[key]);
  this._default(key, dvalue);
};

Resource.prototype._require = function(key) {
  if (!this[key]) throw ReferenceError('Resource field ' + key + ' is required!');
};

Resource.fromNode = function(node) {
  return Resource.create(JSON.parse(node.value), {
    ttl: node.ttl
  });
};

Resource.prototype.toJSON = function() {
  var resource = this;
  var json = {};

  Object.keys(this).forEach(function(key) {
    if(key[0] === '_') return;
    json[key] = resource[key];
  });

  return json;
};
