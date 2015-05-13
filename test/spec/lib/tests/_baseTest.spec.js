var _ = require('lodash');
var BaseTest = require('../../../../lib/tests/_baseTest.js');

describe("lib/tests/_baseTest.js", function () {
  describe('configuration', function() {
    it('should create a config property when no config is passed in', function() {
      var fakeTester = new BaseTest();

      assert(_.isEqual(fakeTester.config, {}));
    });
    it('should create a config property when only runtimeConfig is passed in', function() {
      var runtimeTestConfig = { runtime: true };
      var fakeTester = new BaseTest(runtimeTestConfig);

      assert(_.isEqual(fakeTester.config, runtimeTestConfig));
    });
    it('should create a config property when only baseConfig is passed in', function() {
      var baseTestConfig = { base: true };

      var FakeTester = BaseTest.extend({ config: baseTestConfig });
      var fakeTester = new FakeTester();

      assert(_.isEqual(fakeTester.config, baseTestConfig));
    });
    it('should not modify the config objects', function() {
      var baseTestConfig = {
        base: true,
        deep: {
          common: "base",
          bass: true
        }
      };
      var runtimeTestConfig = {
        runtime: true,
        deep: {
          common: "runtime",
          runtime: true
        }
      };
      var baseTestConfigCopy = JSON.parse(JSON.stringify(baseTestConfig));
      var runtimeTestConfigCopy = JSON.parse(JSON.stringify(runtimeTestConfig));

      var FakeTester = BaseTest.extend({ config: baseTestConfig});
      var fakeTester = new FakeTester(runtimeTestConfig);

      assert(_.isEqual(baseTestConfig, baseTestConfigCopy));
      assert(_.isEqual(runtimeTestConfig, runtimeTestConfigCopy));
    });
    it('should contain unique (deep) values from both dictionaries', function() {
      var baseTestConfig = {
        base: true,
        deep: {
          common: "base",
          bass: true
        }
      };
      var runtimeTestConfig = {
        runtime: true,
        deep: {
          common: "runtime",
          runtime: true
        }
      };

      var FakeTester = BaseTest.extend({ config: baseTestConfig });
      var fakeTester = new FakeTester(runtimeTestConfig);

      assert(fakeTester.config.deep.common === "runtime");
      assert(fakeTester.config.deep.bass === true);
      assert(fakeTester.config.deep.runtime === true);
    });
  });
  describe('default test method', function() {
    it('should have a test method', function() {
      var fakeTester = new BaseTest();
      assert(_.isFunction(fakeTester.test));
    });
    it('should throw an Error when executed', function() {
      var fakeTester = new BaseTest();
      assert.throws(fakeTester.test, /no test defined for test/);
    });
  });
});
