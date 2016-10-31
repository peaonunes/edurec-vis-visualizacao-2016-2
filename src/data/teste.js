const fs = require('fs');

const aggregateAndFilter = require('./postProcessing/aggregateAndFilterSchoolData');

const schoolsData = JSON.parse(fs.readFileSync('dataFiles/escolas2015.json'));

console.log(aggregateAndFilter(schoolsData.entries));