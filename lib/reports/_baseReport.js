var _ = require('lodash');

var KrabbyReporter = function(config) {
  this.config = _.merge({}, this.config, config);
};

KrabbyReporter.prototype.report = function() {
  throw new Error('no report defined for test');
};

KrabbyReporter.extend = require('simple-extend');

module.exports = KrabbyReporter;
