import { actionTypes } from '../actions/schools';

import Immutable, { List, Map } from 'immutable';

export default function schoolsReducer(schools = Map(), action) {
  switch (action.type) {
    case actionTypes.ADD_SCHOOL:
      const { school } = action.payload;

      return schools.set(school['_id'], Immutable.fromJS(school));
    case actionTypes.ADD_STUDENT:
      const { schoolId, student } = action.payload;

      return schools.update(schoolId, (schoolMap) => {
        return schoolMap.withMutations((mutableSchoolMap) => {
          const studentsList =
            mutableSchoolMap
              .get('students', List())
              .push(Immutable.fromJS(student));

          const approvedStudents = mutableSchoolMap.get('approvedStudents', 0);

          mutableSchoolMap
            .set('students', studentsList)
            .set('approvedStudents', approvedStudents + 1)
            .set('rank', ((approvedStudents / studentsList.size) * 100).toFixed(2));
        });
      });
    default:
      return schools;
  }
}
