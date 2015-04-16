// TODO: We need to figure out whether React will be supported natively for a reporter or if they
// will be required to pre-compile

// All subsequent files required by node with the extensions .es6, .es, .jsx and .js
// will be transformed by babel.
require('babel/register');

var _ = require('lodash');
var React = require('react');

// TODO: This reporter requires multiple files, it may be better to put each reporter in a
// directory. This also brings to light a potential issue with using the file name as the reporter
// name. What if a reporter exports an Object like `{name: 'jsHint', process: function () {...}}`?
var Report = require('./jshint-lines-of-shame/shame-report.jsx');

var formatData = function formatData (rawData) {
  return _.map(rawData, function(file) {
    var errors = _.map(file.errors, function(error) {
      return _.pick(error, ['reason', 'code', 'line', 'character']);
    });
    return {
      path: file.file,
      errors: errors
    };
  });
};

module.exports = function(results, cb) {
  // TODO: This is a bit cumbersome
  var jsHintResults = _.find(results, function(result) {
    return result.config.name === 'jshint';
  });

  // TODO: This format necessitates specific knowledge/exploration of each test you're consuming
  // Since each test will produce dramatically different output maybe an Object would be better than
  // an Array. This would also solve the cumbersome name issue above.
  var data = formatData(jsHintResults.logs.errors);

  // TODO: I am assuming this would be pulled in via the config object? Is this already possible?
  var linkRoot ='https://gecgithub01.walmart.com/GlobalProducts/atlas-common/tree/master/frontend';

  // TODO: We need to decide if the reporter itself is responsible for saving a file or if all
  // reporters should output a string and let Krabby do the deed involving fs.
  cb(React.renderToStaticMarkup(React.createElement(Report, {
    data: data,
    linkRoot: linkRoot
  })));
};
