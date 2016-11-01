const fs = require('fs');

const aggregateAndFilterSchoolData = require('./postProcessing/aggregateAndFilterSchoolData');
const aggregateAndFilterStudentData = require('./postProcessing/aggregateAndFilterStudentsData');

let schoolsData = JSON.parse(fs.readFileSync('dataFiles/escolas2015.json'));
let studentsData = JSON.parse(fs.readFileSync('dataFiles/estudantes2015.json'));


studentsData.entries = aggregateAndFilterStudentData(studentsData.entries, schoolsData.entries);

fs.writeFileSync('dataFiles/estudantes2015.json', JSON.stringify(studentsData, null, 1));