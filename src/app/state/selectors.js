import { createSelector } from 'reselect';
import { List } from 'immutable';

const schools = (state) => state.schools;
const schoolFilters = (state) => state.schoolFilters;
const studentFilters = (state) => state.studentFilters;
const parallelSelection = (state) => state.parallelSelect;

const schoolStudentsSelector = createSelector(
  [ schools, studentFilters ],
  (schools, studentFilters) => {
    return schools.map((school) => {
      return school
        .get('students', List())
        .filter((student) => {
          return studentFilters
            .reduce((aggregateValue, allowedValues, field) => {
              return aggregateValue &&
                student.has(field) &&
                allowedValues.contains(student.get(field))
            }, true)
        });
    })
  }
);

const schoolsSelector = createSelector(
  [ schoolStudentsSelector, schools, schoolFilters, parallelSelection ],
  (students, schools, schoolFilters, parallelSelection) => {
    return schools
      .filter((school, schoolId) => {
        return schoolFilters
          .reduce((aggregateValue, field) => {
            return aggregateValue &&
              !!school.getIn(field.split('.'))
          }, true)
          && !students.get(schoolId).isEmpty()
          && parallelSelection.reduce((aggregateValue, filter) => {
              return aggregateValue && filter(school);
          }, true);
      });
  }
);

module.exports = {
  schools: schoolsSelector,
  schoolStudents: schoolStudentsSelector,
};
