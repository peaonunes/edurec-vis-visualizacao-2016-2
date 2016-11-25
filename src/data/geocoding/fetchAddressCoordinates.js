var googleMaps = require('@google/maps');

var gmapsClient = googleMaps.createClient({
  key: require('../../../config/sensitive/gmapsKey')
});

module.exports = function fetchCoordinatesFromAddressList (addressList, callback) {
  const results = [];

  function asyncForEach (array, asyncIterationFunction, index = 0) {
    if (index < 0 || index >= array.length) {
      callback(results);
    }

    asyncIterationFunction(array[index], function (error) {
      if (error) {
        throw error;
      }

      asyncForEach(array, asyncIterationFunction, index + 1);
    });
  }

  asyncForEach(addressList, function(address, callback) {
    gmapsClient.geocode({
      address: address,
    }, function (error, response) {
      if (!error) {
        results.push({
          address: response.json.results[0].formatted_address,
          geometry: response.json.results[0].geometry
        });
      }

      callback(error);
    });
  });
};

