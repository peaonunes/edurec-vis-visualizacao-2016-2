import storeFactory from './state/storeFactory';
import stateSetup from './stateUsageExample';
import selectors from './state/selectors';
import { actionCreators as schoolFilterActions } from './state/actions/schoolFilters';
import { actionCreators as studentFilterActions } from './state/actions/studentFilters';

import Immutable, {List} from 'immutable';
const d3 = require('d3');
import { renderMap } from './ui/map.js';
import { calculateSchoolGrade } from './ui/metrics.js';
import './ui/gambi.js';

const store = storeFactory();
window.store = store;

const appContent = d3.select('#content');

document.addEventListener('DOMContentLoaded', () => {
  renderMap();

  //renderReduxExample();

  var s = calculateSchoolGrade();
  for(var i = 0; i < s.length; i++)
    console.log("grade: " + s[i].grade);
});

function renderReduxExample() {
  appContent
    .append('h1')
    .text('exemplo de uso do redux');

  appContent
    .append('button')
    .text('Apply filter A')
    .on('click', filterToggleHandler('fieldA'));

  appContent
    .append('button')
    .text('Apply filter B')
    .on('click', filterToggleHandler('fieldB'));

  function filterToggleHandler(fieldName) {
    return function() {
      const hasFilter = store.getState().schoolFilters.contains(fieldName);
      const $this = d3.select(this);

      if (hasFilter) {
        $this.text('Apply filter B');
      } else {
        $this.text('Remove filter B');
      }

      store.dispatch(schoolFilterActions.toggleSchoolFilter(fieldName));
    }
  }

  appContent
    .append('p')
    .text('Student filters');

  addStudentFilterCheckboxForFoo('bar');
  addStudentFilterCheckboxForFoo('baz');
  addStudentFilterCheckboxForFoo('qux');

  function addStudentFilterCheckboxForFoo(value) {
    appContent
      .append('br');

    const checkboxId = `foo-${value}`;

    appContent
      .append('input')
      .attr('class', 'studentFilter')
      .attr('type', 'checkbox')
      .attr('id', checkboxId)
      .attr('value', value)
      .attr('checked', true)
      .on('change', applyStudentFilters);

    appContent
      .append('label')
      .text(value)
      .attr('for', checkboxId);
  }

  function applyStudentFilters() {
    var nodes = appContent
      .selectAll('input.studentFilter')
      .nodes();

    store.dispatch(studentFilterActions.addStudentFilter('foo', nodes.filter((node) => node.checked).map((node) => node.value)));
  }

  store.subscribe(renderSchools);

  stateSetup(store);
}

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
})();

const renderStudents = (function() {
  let studentsSelector = null;

  return function(schoolDescriptions) {
    const state = store.getState();
    let currentStudentsSelector = selectors.schoolStudents(state);

    console.log('??');

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
          console.log(school);
          return studentsSelector(school.get('_id')).toArray();
        });

      studentListItems
        .exit()
        .remove();

      studentListItems = studentListItems
        .enter()
        .append('li')
        .merge(studentListItems);

      studentListItems
        .text(student => `student with id ${student.get('_id')}, foo = ${student.get('foo')}`);
    }
  }
})();
