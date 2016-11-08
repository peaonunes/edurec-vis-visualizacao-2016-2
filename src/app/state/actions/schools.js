export const actionTypes = {
  ADD_SCHOOL: 'ADD_SCHOOL',
  ADD_STUDENT: 'ADD_STUDENT'
};

export const actionCreators = {
  addSchool(school) {
    return {
      type: actionTypes.ADD_SCHOOL,
      payload: {
        school: school,
      }
    };
  },

  addStudent(schoolId, student) {
    return {
      type: actionTypes.ADD_STUDENT,
      payload: {
        student: student,
        schoolId: schoolId,
      }
    };
  }
};
