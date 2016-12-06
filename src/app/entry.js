import './ui/stylesheets/app.scss';

import storeFactory from './state/storeFactory';
import { actionCreators as schoolActions } from './state/actions/schools';
import { renderMap } from './ui/map.js';
import { setupDropdownElements, setupFilterCheckboxes, adjustContentSectionPadding } from './ui/filterBar';
import { showSchoolDetails } from './ui/schoolDetails';
import { renderParallelSetsChart } from './ui/parallelSets';
import { renderFAQS } from './ui/about';

const d3 = require('d3');

const store = storeFactory();

document.addEventListener('DOMContentLoaded', () => {
  adjustContentSectionPadding();

  loadData(() => {
    renderMap(store);
    showSchoolDetails(store);
    renderParallelSetsChart(store);
    renderFAQS();
  });
});

function loadData(callback) {
  d3.json('./escolas2014.json', (schools) => {
    Object.keys(schools.entries).forEach((schoolId) => {
      store.dispatch(schoolActions.addSchool(schools.entries[schoolId]));
    });

    d3.json('./estudantes2014.json', (students) => {
      Object.keys(students.entries).forEach((studentId) => {
        const student = students.entries[studentId];

        store.dispatch(schoolActions.addStudent(parseInt(student.escola), student));
      });

      if (callback) {
        callback();
      }
    });
  });

  setupDropdownElements();
  setupFilterCheckboxes(store);
}
