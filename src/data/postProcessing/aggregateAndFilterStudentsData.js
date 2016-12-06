var fs = require('fs');

module.exports = function aggregateAndFilterStudentData (rawStudentsData, schoolsData, keysInfoFilePath) {
  const keysInfo = JSON.parse(fs.readFileSync(keysInfoFilePath));

  return rawStudentsData.reduce((aggregate, studentData) => {
    const schoolId = schoolIdForStudent(studentData, schoolsData, keysInfo.escola);

    const filteredData = getOnlyDesiredKeys(studentData, keysInfo.mappings);

    if (schoolId) {
      aggregate[studentData['_id']] = Object.assign({ escola: schoolId }, filteredData);
    }

    return aggregate;
  }, {});
};

function schoolIdForStudent(studentData, schoolsData, schoolNameField) {
  const result = Object.keys(schoolsData).filter((key) => {
    return schoolsData[key].nome.includes(studentData[schoolNameField]);
  });

  if (result.length !== 1) {
    console.error(`search for school name ${studentData[schoolNameField]} returned ${result.length} results: ${result}`);
  }

  return result[0];
}

const getOnlyDesiredKeys = (() => {
  return (rawStudentData, desiredKeyMappings) => {
    var result = {};

    Object.keys(desiredKeyMappings).forEach((key) => {
      result[desiredKeyMappings[key]] = rawStudentData[key];
    });

    return result;
  }
})();