var fs = require('fs');
var path = require('path');

var fetchOpenDataEntries = require('./fetchOpenDataEntries');

module.exports = function (endpoint, filePath, callback) {
  function writeToFile (entries) {
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 1));

    if (callback) {
      callback();
    }
  }

  fetchOpenDataEntries(endpoint, writeToFile);
};