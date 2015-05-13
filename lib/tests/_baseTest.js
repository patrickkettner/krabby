var globby = require('globby');
var isGlob = require('is-glob');
var _ = require('lodash');

var KrabbyTest = function(config) {
  this.config = _.merge({}, this.config, config);

  this.grade = 1;
  this.files = [];

  this.logs = {
    errors: [],
    warnings: [],
    logs: [],
    debug: []
  };

  if (this.config.files && this.config.files.some(isGlob)) {
    this.config.files = globby.sync(this.config.files, {nodir: true});
  }
};

KrabbyTest.prototype.test = function() {
  throw new Error('no test defined for test');
};

KrabbyTest.extend = require('simple-extend');

module.exports = KrabbyTest;
