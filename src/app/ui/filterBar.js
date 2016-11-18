import { actionCreators as schoolFilterActions } from '../state/actions/schoolFilters';
import { actionCreators as studentFilterActions } from '../state/actions/studentFilters';

var d3 = require('d3');

export function setupDropdownElements() {
  d3.selectAll('.dropdown')
    .on('click', function() {
      if (!d3.event.target.matches('.filter-checkbox')) {
        const clickedDropdown = d3.select(this);
        const dropdownContent = clickedDropdown.select(`#${this.dataset.dropdown}`);
        const shouldShow = !dropdownContent.classed('show');

        d3.select('.dropdown-content.show')
          .classed('show', false);

        dropdownContent
          .classed('show', shouldShow);
      }
    });

  d3.select(window)
    .on('click', function() {
      const {target} = d3.event;

      if (!target.matches('.dropdown, .dropdown-label') && !target.matches('.filter-checkbox')) {
        d3.select('.dropdown-content.show')
          .classed('show', false);
      }
    });
}

export function setupFilterCheckboxes(store) {
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

export function adjustContentSectionPadding() {
  const topbar = d3.select('#filterBar');
  const topbarHeight = topbar.node().getBoundingClientRect().height;

  d3.select('#topbar-padding')
    .style('flex-basis', `${topbarHeight}px`);
}