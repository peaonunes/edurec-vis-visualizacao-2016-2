const fetch = require('node-fetch');
const fs = require('fs');

module.exports = function fetchEntries (initialEndpoint, destinationFile) {
  const baseURL = 'http://dados.recife.pe.gov.br';

  function fetchSingleEntryPage (endpoint, callback) {
    fetch(`${baseURL}${endpoint}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (json.result.records.length) {
          fetchedEntries = fetchedEntries.concat(json.result.records);
          console.log(`Fetched ${fetchedEntries.length} entries so far.`);

          if (json.result._links && json.result._links.next) {
            fetchSingleEntryPage(json.result._links.next, callback);
          }
        } else {
          callback(fetchedEntries);
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  function writeToFile (filename) {
    return function (entries) {
      fs.writeFileSync(filename, JSON.stringify(entries, null, 1));
    };
  }

  let fetchedEntries = [];

  fetchSingleEntryPage(initialEndpoint, writeToFile(destinationFile));
};