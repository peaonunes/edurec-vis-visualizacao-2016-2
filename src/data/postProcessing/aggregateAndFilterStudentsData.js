var path = require('path');
var fs = require('fs');

module.exports = function aggregateAndFilterStudentData (rawStudentsData, schoolsData) {
  return rawStudentsData.reduce((aggregate, studentData) => {
    const schoolId = schoolIdForStudent(studentData, schoolsData);

    const filteredData = getOnlyDesiredKeys(studentData);

    if (schoolId) {
      aggregate[studentData['_id']] = Object.assign({ escola: schoolId }, filteredData);
    }

    return aggregate;
  }, {});
};

function schoolIdForStudent(studentData, schoolsData) {
  const result = Object.keys(schoolsData).filter((key) => {
    return schoolsData[key].nome.includes(studentData.NESCOLNOME);
  });

  if (result.length !== 1) {
    console.error(`search for school name ${studentData.NESCOLNOME} returned ${result.length} results: ${result}`);
  }

  return result[0];
}

const getOnlyDesiredKeys = (() => {
  var desiredKeysFile = path.join(__dirname, '../dataFiles/studentFields.json');
  var desiredKeyMappings = JSON.parse(fs.readFileSync(desiredKeysFile)).mappings;

  return (rawStudentData) => {
    var result = {};

    Object.keys(desiredKeyMappings).forEach((key) => {
      result[desiredKeyMappings[key]] = rawStudentData[key];
    });

    return result;
  }
})();