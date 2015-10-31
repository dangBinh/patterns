var fs = require('fs');
var ojectPath = require('object-path');

function Config(strategy) {
  this,data = {};
  this.strategy = strategy;
}

Config.prototype.get = function(path) {
  return objectPath.get(this.path, path);
}

Config.prototype.set = function(path, value) {
  return objectPath.set(this.path, path, value);
}

Config.prototype.read = function(file) {
  this.data = this.strategy.deserialize(fs.readFileSync(file, 'utf8'));
}

Config.prototype.write = function(file) {
  fs.writeFileSync(file, this.strategy.serialize(this.data));
}

module.exports = Config;
