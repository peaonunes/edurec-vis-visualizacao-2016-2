import { actionCreators as schoolFilterActions } from '../state/actions/schoolFilters';
import { actionCreators as studentFilterActions } from '../state/actions/studentFilters';

var d3 = require('d3');

export function setupDropdownElements() {
  d3.selectAll('.dropbtn')
    .on('click', function() {
      d3.select('.dropdown-content.show')
        .classed('show', false);

      d3.select(`#${this.dataset.dropdown}`)
        .classed('show', true);
    });

  d3.select(window)
    .on('click', function() {
      const {target} = d3.event;

      if (!target.matches('.dropbtn') && !target.matches('.filter-checkbox')) {
        d3.select('.dropdown-content.show')
          .classed('show', false);
      }
    });
}

export function setupFilterCheckboxes() {
  d3.selectAll('.school-filter')
    .on('change', function() {
      store.dispatch(schoolFilterActions.toggleSchoolFilter(this.value));
    });

  d3.selectAll('.student-filter')
    .on('change', function() {
      const dataField = this.dataset.field;
      const checkedOptions =
        d3.selectAll(`.student-filter[data-field="${dataField}"]`)
        .nodes()
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      store.dispatch(studentFilterActions.addStudentFilter(dataField, checkedOptions));
    });
}