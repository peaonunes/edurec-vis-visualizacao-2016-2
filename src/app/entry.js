import storeFactory from './state/storeFactory';
import stateSetup from './stateUsageExample';
import selectors from './state/selectors';
import { actionCreators as schoolFilterActions } from './state/actions/schoolFilters';

import Immutable, {List} from 'immutable';
const d3 = require('d3');

const store = storeFactory();

const appContent = d3.select('#content');

document.addEventListener('DOMContentLoaded', () => {
  let filterA = false;
  let filterB = false;

  appContent
    .append('h1')
    .text('exemplo de uso do redux');

  appContent
    .append('button')
    .text('Apply filter A')
    .on('click', function() {
      filterA = !filterA;
      let action;
      const $this = d3.select(this);

      if (filterA) {
        action = schoolFilterActions.addSchoolFilter('fieldA');
        $this.text('Remove filter A');
      } else {
        action = schoolFilterActions.removeSchoolFilter('fieldA');
        $this.text('Apply filter A');
      }

      store.dispatch(action);
    });

  appContent
    .append('button')
    .text('Apply filter B')
    .on('click', function() {
      filterB = !filterB;
      let action;
      const $this = d3.select(this);

      if (filterB) {
        action = schoolFilterActions.addSchoolFilter('fieldB');
        $this.text('Remove filter B');
      } else {
        action = schoolFilterActions.removeSchoolFilter('fieldB');
        $this.text('Apply filter B');
      }

      store.dispatch(action);
    });

  appContent
    .

  store.subscribe(renderSchools);

  stateSetup(store);
});

const renderSchools = (function() {
  let schoolsMap = null;
  let schoolsList = null;

  function setTitle(schoolDescriptions) {
    let titles = schoolDescriptions
      .selectAll('h2')
      .data(school => [ school.get('nome') ]);

    titles
      .enter()
      .append('h2')
      .merge(titles)
      .text(name => name);
  }

  return function() {
    const state = store.getState();
    let filteredSchools = selectors.schools(state);

    if (!Immutable.is(filteredSchools, schoolsMap)) {
      schoolsMap = filteredSchools;
      // Converto para array pra facilitar meu trabalho depois, schoolsMap é um Immutable.Map
      schoolsList = schoolsMap.toArray();

      let schoolDescriptions = appContent
        .selectAll('div.school')
        .data(schoolsList);

      schoolDescriptions
        .exit()
        .remove();

      schoolDescriptions = schoolDescriptions
        .enter()
        .append('div')
        .attr('class', 'school')
        .merge(schoolDescriptions);

      setTitle(schoolDescriptions);

      renderStudents(schoolDescriptions);
    }
  }
})();

const renderStudents = (function() {
  let studentsSelector = null;

  return function(schoolDescriptions) {
    const state = store.getState();
    let currentStudentsSelector = selectors.schoolStudents(state);

    if (!Immutable.is(studentsSelector, currentStudentsSelector)) {
      studentsSelector = currentStudentsSelector;

      let studentsList = schoolDescriptions
        .selectAll('ul')
        .data(school => [ school ]);

      studentsList = studentsList
        .enter()
        .append('ul')
        .merge(studentsList);

      let studentListItems = studentsList
        .selectAll('li')
        .data(school => {
          return school.get('students', List()).toArray();
        });

      studentListItems = studentListItems
        .enter()
        .append('li')
        .merge(studentListItems);

      studentListItems
        .text(student => `student with id ${student.get('_id')}, foo = ${student.get('foo')}`);
    }
  }
})();