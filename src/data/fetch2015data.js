const saveJSON = require('./persistence/saveJSON');
const fetchOpenDataEntries = require('./dataFetch/fetchOpenDataEntries');
const fetchAddressCoordinates = require('./geocoding/fetchAddressCoordinates');
const aggregateAndFilterSchoolData = require('./postProcessing/aggregateAndFilterSchoolData');
const aggregateAndFilterStudentsData = require('./postProcessing/aggregateAndFilterStudentsData');

const path = require('path');

const baseFolder = path.join(__dirname, 'dataFiles');
const studentsFileNamePrefix = 'estudantes';
const studentsFileNameSuffix = '';
const schoolsFileNamePrefix = 'escolas';
const schoolsFileNameSuffix = '';


const studentEndpoints = {
  '2014': {
    endpoint: '/api/action/datastore_search?resource_id=0a2aec2f-9634-4408-bbb4-37e1f9c74aa1',
    keysInfoFile: 'studentFields2014.json'
  },
  // '2015': {
  //   endpoint: '/api/action/datastore_search?resource_id=264f0a37-ad1c-4308-9998-4f0bd3c6561f',
  //   keysInfoFile: 'dataFiles/studentFields.json'
  // },
};
const schoolEndpoints = {
  '2014': '/api/action/datastore_search?resource_id=e06c6c2b-9726-4c84-bfcb-aae6abb9faae',
  // '2015': '/api/action/datastore_search?resource_id=bb8b70d4-4204-40d3-bc77-409a1651b8b9',
};


function fetchStudentsDataForYear(year, callback) {
  fetchOpenDataEntries(studentEndpoints[year].endpoint, callback);
}

function fetchSchoolsDataForYear(year, callback) {
  fetchOpenDataEntries(schoolEndpoints[year], callback);
}

Object.keys(studentEndpoints).forEach((year) => {
  fetchStudentsDataForYear(year, (studentsData) => {
    if (typeof schoolEndpoints[year] !== 'string') {
      console.log(`Error: endpoint for schools in year ${year} is unavailable.`);
    } else {
      fetchSchoolsDataForYear(year, (schoolsData) => {
        console.log(`Finished fetching schools data for year ${year}`);

        var schoolAddresses = schoolsData.entries.map((school) => {
          return `${school.endereco}, ${school.endereco_numero}, ${school.bairro}, Recife, Brasil`;
        });

        fetchAddressCoordinates(schoolAddresses, (coordinates) => {
          console.log(`Finished fetching addresses for ${coordinates.length} schools`);

          schoolsData.entries.forEach((school, index) => {
            school.endereco = coordinates[index];
          });

          schoolsData.entries = aggregateAndFilterSchoolData(schoolsData.entries);
          studentsData.entries = aggregateAndFilterStudentsData(
            studentsData.entries,
            schoolsData.entries,
            path.join(baseFolder, studentEndpoints[year].keysInfoFile)
          );

          saveJSON(studentsData, path.join(baseFolder, `${studentsFileNamePrefix}${year}${studentsFileNameSuffix}.json`),
            () => {
              console.log(`Finished saving students file for year ${year}`);
            }
          );

          saveJSON(schoolsData, path.join(baseFolder, `${schoolsFileNamePrefix}${year}${schoolsFileNameSuffix}.json`),
            () => {
              console.log(`Finished saving schools file for year ${year}`);
            }
          );
        });
      });
    }
  });
});