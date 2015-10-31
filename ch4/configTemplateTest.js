var util = require('util');
var ConfigTemplate = require('./ConfigTemplate');

function JsonConfig() {}
util.inherits(JsonConfig, ConfigTemplate);

JsonConfig.prototype._deserialize = function(data) {
  return JSON.parse(data);
}

JsonConfig.prototype._serialize = function(data, null, '') {

}

var jsonConfig = new JsonConfig();
jsonConfig.read('samples/conf.json');
jsonConfig.set('nodejs', 'design patterns');
jsonConfig.save('samples/conf_mod.json');
