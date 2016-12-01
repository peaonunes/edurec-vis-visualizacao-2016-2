const fs = require('fs');

const schoolsIdeb = JSON.parse(fs.readFileSync('../dataFiles/escolasIdeb.json'));

const schools = JSON.parse(fs.readFileSync('../dataFiles/escolas2014.json'));

const destination = '../dataFiles/escolas2014update.json';

var schoolsIdebSize = schoolsIdeb.length;

var media = 0;
var qtd = 0;
var mapInepIdeb = {};

//calculate media and qtd - put in dictionary cod_inep -> ideb
for(var i = 0; i < schoolsIdebSize; i++) {
  var schoolIdeb = schoolsIdeb[i];

  var ideb = schoolIdeb.idebAI;

  if(ideb && ideb != 0) {
    mapInepIdeb[schoolIdeb.cod] = schoolIdeb.idebAI;
    media += ideb;
    qtd++;
  }
}

var calculatedMedia = media / qtd;

var newSchools = schools;

Object.keys(newSchools.entries).forEach((key) => {
  var newSchool = newSchools.entries[key];

  if(mapInepIdeb.hasOwnProperty(newSchool.inep_escola)) {
    newSchool.ideb = mapInepIdeb[newSchool.inep_escola];
    newSchool.idebCidade = calculatedMedia;
  }

  newSchools[key] = newSchool;
});

fs.writeFile(`${destination}`, JSON.stringify(newSchools, null, 1), function(err) {
  if(err)
    console.log(err);
  console.log("file was saved");
});
