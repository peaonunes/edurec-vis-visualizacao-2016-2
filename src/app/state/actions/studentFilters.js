export const actionTypes = {
  ADD_STUDENT_FILTER: 'ADD_STUDENT_FILTER',
  REMOVE_STUDENT_FILTER: 'REMOVE_STUDENT_FILTER',
};

export const actionCreators = {
  addStudentFilter(fieldName, allowedValues) {
    return {
      type: actionTypes.ADD_STUDENT_FILTER,
      payload: {
        fieldName: fieldName,
        allowedValues: allowedValues,
      }
    };
  },

  removeStudentFilter(fieldName) {
    return {
      type: actionTypes.REMOVE_STUDENT_FILTER,
      payload: {
        fieldName: fieldName
      }
    };
  }
};
