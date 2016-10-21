var fs = require('fs');
var path = require('path');

var fetchOpenDataEntries = require('./fetchOpenDataEntries');

module.exports = function (endpoint, filename, callback) {
  function writeToFile (entries) {
    fs.writeFileSync(path.join(__dirname, `../${filename}`), JSON.stringify(entries, null, 1));

    if (callback) {
      callback();
    }
  }

  fetchOpenDataEntries(endpoint, writeToFile);
};