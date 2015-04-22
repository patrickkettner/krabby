'use strict';

var React = require('react');
var _ = require('lodash');

var Report = React.createClass({
  createLinks: function() {
    return _.map(this.props.data, function(file) {
      return (
        <div>
          <h1>{file.path}</h1>
          {
            _.map(file.errors, function(error) {
              // This doesn't generate a valid link - it is just a POC
              return <a href={this.props.linkRoot + file.path}>{error.code + ': ' + error.reason}</a>;
            }, this)
          }
        </div>
      )
    }, this);
  },

  render: function() {
    return (
      <section>
        {this.createLinks()}
      </section>
    );
  }
});

module.exports = Report;
