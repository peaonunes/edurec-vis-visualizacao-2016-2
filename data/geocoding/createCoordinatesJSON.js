var fs = require('fs');

var fetchAddressCoordinates = require('./geocoding/fetchAddressCoordinates');

module.exports = function (schoolDataJSON, destinationFile, callback) {
  var schools = JSON.parse(fs.readFileSync(schoolDataJSON));
  var schoolAddresses = schools.entries.map((school) => {
    return `${school.endereco}, ${school.endereco_numero}, ${school.bairro}, Recife, Brasil`;
  });

  fetchAddressCoordinates(schoolAddresses, function (coordinates) {
    fs.writeFileSync(path.join(__dirname, `../${destinationFile}`), JSON.stringify(coordinates, null, 1));

    if (callback) {
      callback();
    }
  });
};
