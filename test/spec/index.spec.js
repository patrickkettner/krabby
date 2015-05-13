var _ = require('lodash');
var path = require('path');
var krabby = require('../../index.js');
var JsHint = require('../../lib/tests/jshint.js');
var proxyquire = require('proxyquire').noPreserveCache();

describe('index.js', function() {
  describe('_getOptions', function() {
    it('returns a config Object identical to any valid one passed in', function() {
      var options = {
        tests: [],
        reports: [],
        'extra-option': true
      };

      var parsedOptions = krabby._getOptions(options);
      assert(_.isEqual(options, parsedOptions));
    });
    it('finds a krabby config when found inside of another object', function() {
      var options = {
        krabby: {
          tests: [],
          reports: [],
          'extra-option': true
        }
      };

      var parsedOptions = krabby._getOptions(options);
      assert(_.isEqual(options.krabby, parsedOptions));
    });
    it('throws an Error it can\'t find a config', function() {

      var krabby = proxyquire('../..', {
        fs: {
          'existsSync': function() {
            return;
          }
        },
        'find-parent-dir': {
          sync: function() {
            return;
          }
        }
      });

      assert.throws(function() {
        krabby._getOptions({});
      }, /can't find the root of the project\. go find a package\.json file/);
    });
    it('throws an Error if it can\'t load a valid config', function() {

      // mock out the existsSync to make it seem like a package.json is in
      // the same dir, but return an empty object for path.join (which gets
      // sent into `require`). @noCallThru lets proxyquire load a fake module
      var krabby = proxyquire('../..', {
        fs: {
          'existsSync': function(file) {
            return file === 'package.json';
          },
        },
        path: {
          join: function() {
            return '/krabby_test_bad_pkg.json';
          }
        },
        '/krabby_test_bad_pkg.json': {
          '@noCallThru': true
        }
      });

      assert.throws(function() {
        krabby._getOptions({});
      }, /no krabby config found\. what do you expect to happen\?/);
    });
    it('loads a package.json file from the current dir', function() {

      var krabby = proxyquire('../..', {
        fs: {
          'existsSync': function(file) {
            return file === 'package.json';
          },
        },
        path: {
          join: function() {
            return '/krabby_test_pkg.json';
          }
        },
        '/krabby_test_pkg.json': {
          krabby: {
            tests: [],
            reports: []
          },
          '@noCallThru': true
        }
      });

      assert.doesNotThrow(function() { krabby._getOptions({}); });
    });
    it('loads a krabby.json file from the current dir', function() {

      var krabby = proxyquire('../..', {
        fs: {
          'existsSync': function(file) {
            return file.match(/krabby.json$/);
          },
        },
        'find-parent-dir': {
          sync: function() {
            return '/fake';
          }
        },
        path: {
          join: function() {
            return '/krabby_test_krabby.json';
          }
        },
        '/krabby_test_krabby.json': {
          tests: [],
          reports: [],
          '@noCallThru': true
        }
      });

      assert.doesNotThrow(function() { krabby._getOptions({}); });
    });
    it('loads a krabby.json file from the current dir', function() {

      var krabby = proxyquire('../..', {
        fs: {
          'existsSync': function(file) {
            return file === 'krabby.json';
          },
        },
        path: {
          join: function() {
            return path.join(__dirname, '..', '..', 'package.json');
          }
        }
      });

      assert.doesNotThrow(function() { krabby._getOptions({}); });
    });
    it('throws an Error if config doesn\'t define an Array of tests', function() {
      var options = {
        reports: []
      };

      assert.throws(function() {
        krabby._getOptions(options);
      }, /you did't define any krabby tests. great job./);
    });
    it('throws an Error if config doesn\'t define an Array of reports', function() {
      var options = {
        tests: []
      };

      assert.throws(function() {
        krabby._getOptions(options);
      }, /you did't define any krabby reports. great job./);
    });
  });
  describe('_instantiatePlugins', function() {
    it('returns an Array of instantiated plugins', function() {
      var tests = krabby._instantiatePlugins(['jshint'], 'lib/tests');

      assert(_.isArray(tests));
      assert(tests[0] instanceof JsHint);
    });
  });
  describe('_test', function() {
    it('executes each test that is passed in');
    it('calls the callback after each test is executed');
  });
  describe('_report', function() {
    it('executes each report that is passed in');
    it('calls the callback after each test is executed');
  });
});
