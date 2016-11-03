export const actionTypes = {
  ADD_SCHOOL_FILTER: 'ADD_SCHOOL_FILTER',
  REMOVE_SCHOOL_FILTER: 'REMOVE_SCHOOL_FILTER',
};

export const actionCreators = {
  addSchoolFilter(fieldName) {
    return {
      type: actionTypes.ADD_SCHOOL_FILTER,
      payload: {
        fieldName: fieldName,
      }
    }
  },

  removeSchoolFilter(fieldName) {
    return {
      type: actionTypes.REMOVE_SCHOOL_FILTER,
      payload: {
        fieldName: fieldName
      }
    };
  }
};
