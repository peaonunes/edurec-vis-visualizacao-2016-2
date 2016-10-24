const saveJSON = require('./persistence/saveJSON');
const fetchOpenDataEntries = require('./dataFetch/fetchOpenDataEntries');
const fetchAddressCoordinates = require('./geocoding/fetchAddressCoordinates');

const path = require('path');

const baseFolder = path.join(__dirname, 'dataFiles');

function fetchStudentsData () {
  const studentEndpoints = {
    '2015': '/api/action/datastore_search?resource_id=264f0a37-ad1c-4308-9998-4f0bd3c6561f',
  };
  const fileNamePrefix = 'estudantes';
  const fileNameSuffix = '';

  Object.keys(studentEndpoints).forEach(function (year) {
    fetchOpenDataEntries(studentEndpoints[year],
      function (data) {
        const destinationFilePath = path.join(baseFolder, `${fileNamePrefix}${year}${fileNameSuffix}.json`);

        saveJSON(data, destinationFilePath,
          function () {
            console.log(`Finished saving students file for year ${year}`);
          }
        );
      }
    );
  });
}

function fetchSchoolsData () {
  const schoolEndpoints = {
    '2015': '/api/action/datastore_search?resource_id=bb8b70d4-4204-40d3-bc77-409a1651b8b9',
  };
  const fileNamePrefix = 'escolas';
  const fileNameSuffix = '';

  Object.keys(schoolEndpoints).forEach(function (year) {
    fetchOpenDataEntries(schoolEndpoints[year],
      function (schoolData) {
        console.log(`Finished fetching schools data for year ${year}`);

        const destinationFilePath = path.join(baseFolder, `${fileNamePrefix}${year}${fileNameSuffix}.json`);

        var schoolAddresses = schoolData.entries.map((school) => {
          return `${school.endereco}, ${school.endereco_numero}, ${school.bairro}, Recife, Brasil`;
        });

        fetchAddressCoordinates(schoolAddresses, function (coordinates) {
          schoolData.forEach((school, index) => {
            school.endereco = coordinates[index];
          });

          saveJSON(schoolData, destinationFilePath,
            function () {
              console.log(`Finished saving schools file for year ${year}`);
            }
          );
        });
      }
    );
  });
}

fetchStudentsData();
fetchSchoolsData();
