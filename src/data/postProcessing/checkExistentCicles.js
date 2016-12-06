const fs = require('fs');

const students = JSON.parse(fs.readFileSync('../../../docs/estudantes2014.json'));

var v = {};

Object.keys(students.entries).forEach((key) => {
  var st = students.entries[key];
  if(!v.hasOwnProperty(st.grau)) {
    v[st.grau] = 1;
  } else {
    v[st.grau]++;
  }
});

console.log(v);
