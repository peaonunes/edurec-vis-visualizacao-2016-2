import { actionTypes } from '../actions/schools';

import { List, Map } from 'immutable';

export default function schoolsReducer(schools = Map(), action) {
  switch (action.type) {
    case actionTypes.ADD_SCHOOL:
      const { school } = action.payload;

      return schools.set(school['_id'], Map(school));
    case actionTypes.ADD_STUDENT:
      const { schoolId, student } = action.payload;

      return schools.update(schoolId, (schoolMap) => {
        return schoolMap.update('students', List(), (studentsList) => {
          return studentsList.push(Map(student));
        });
      });
    default:
      return schools;
  }
}