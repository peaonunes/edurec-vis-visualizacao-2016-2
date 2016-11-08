import storeFactory from './state/storeFactory';
import { actionCreators as schoolActions } from './state/actions/schools';

const d3 = require('d3');
import { renderMap } from './ui/map.js';
import { calculateSchoolGrade } from './ui/metrics.js';
import './ui/gambi.js';

const store = storeFactory();
window.store = store;

const appContent = d3.select('#content');

document.addEventListener('DOMContentLoaded', () => {
  d3.json('./escolas2015.json', (schools) => {
    Object.keys(schools.entries).forEach((schoolId) => {
      store.dispatch(schoolActions.addSchool(schools.entries[schoolId]));
    });

    d3.json('./estudantes2015.json', (students) => {
      Object.keys(students.entries).forEach((studentId) => {
        const student = students.entries[studentId];

        store.dispatch(schoolActions.addStudent(parseInt(student.escola), student));
      });

      renderMap(store);
    });
  });

  var s = calculateSchoolGrade();
  for(var i = 0; i < s.length; i++)
    console.log("grade: " + s[i].grade);
});
