const fs = require('fs');
const fetch = require('node-fetch');

const schools = JSON.parse(fs.readFileSync('../dataFiles/escolas2014.json'));
const baseURL = 'http://educacao.dadosabertosbr.com/api/escola/';

const destination = '../dataFiles/escolasIdeb.json';

const fetchedSchools = [];

//console.log("SCHOOLS");
//console.log(schools.entries);
var counter = 0;

var length = Object.keys(schools.entries).length;

Object.keys(schools.entries).forEach((key) => {
  var cod_inep = schools.entries[key].inep_escola;
  console.log("school id", schools.entries[key].inep_escola);

  fetch(`${baseURL}${cod_inep}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    //console.log("json");
    //console.log(json);
    fetchedSchools.push(json);
    counter++;
    console.log("counter", counter);
    if(counter == length) {
      fs.writeFile(`${destination}`, JSON.stringify(fetchedSchools, null, 1), function(err) {
        if(err)
          console.log(err);
        console.log("file was saved");
      });
    }
  })
  .catch(function(err) {
    counter++;
    console.log("counter erro", counter);
    console.log(err);
    if(counter == length) {
      fs.writeFile(`${destination}`, JSON.stringify(fetchedSchools, null, 1), function(err) {
        if(err)
          console.log(err);
        console.log("file was saved");
      });
    }
  });
});
