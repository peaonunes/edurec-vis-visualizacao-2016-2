import { createSelector } from 'reselect';
import { List } from 'immutable';

const schools = (state) => state.schools;
const schoolFilters = (state) => state.schoolFilters;
const studentFilters = (state) => state.studentFilters;

const schoolsSelector = createSelector(
  [ schools, schoolFilters ],
  (schools, schoolFilters) => {
    return schools
      .filter((school) => {
        return schoolFilters
          .reduce((aggregateValue, field) => {
            return aggregateValue && !!school.getIn(field);
          }, true);
      });
  }
);

const schoolStudentsSelector = createSelector(
  [ schoolsSelector, studentFilters ],
  (filteredSchools, studentFilters) => {
    return (schoolId) => {
      return filteredSchools
        .get(schoolId)
        .get('students', List())
        .filter((student) => {
          return studentFilters
            .reduce((aggregateValue, allowedValues, field) => {
              return aggregateValue &&
                student.has(field) &&
                allowedValues.contains(student.get(field));
            }, true);
        });
    }
  }
);

module.exports = {
  schools: schoolsSelector,
  schoolStudents: schoolStudentsSelector,
};
