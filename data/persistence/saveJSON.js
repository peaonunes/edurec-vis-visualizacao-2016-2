var fs = require('fs');

module.exports = function (data, filePath, callback) {
  fs.writeFile(filePath, JSON.stringify(data, null, 1), function () {
    console.log(arguments);

    if (callback) {
      callback();
    }
  });
};