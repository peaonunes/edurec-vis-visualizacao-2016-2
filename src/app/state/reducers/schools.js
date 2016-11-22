import { actionTypes } from '../actions/schools';

import Immutable, { List, Map } from 'immutable';

export default function schoolsReducer(schools = Map(), action) {
  switch (action.type) {
    case actionTypes.ADD_SCHOOL:
      const { school } = action.payload;

      school._agua = school.agua;
      school.agua = Object.keys(school.agua).reduce((aggregate, waterSource) => {
        return aggregate || school.agua[waterSource];
      }, false);

      school._lixo = school.lixo;
      school.lixo = Object.keys(school.lixo).reduce((aggregate, trashDestination) => {
        return aggregate || school.lixo[trashDestination];
      }, false);

      school._esgoto = school.esgoto;
      school.esgoto = Object.keys(school.esgoto).reduce((aggregate, sewerDestination) => {
        return aggregate || school.esgoto[sewerDestination];
      }, false);

      school._energia = school.energia;
      school.energia = undefined;

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
