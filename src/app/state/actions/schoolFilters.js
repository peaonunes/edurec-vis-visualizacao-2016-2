export const actionTypes = {
  TOGGLE_SCHOOL_FILTER: 'TOGGLE_SCHOOL_FILTER',
};

export const actionCreators = {
  toggleSchoolFilter(fieldName) {
    return {
      type: actionTypes.TOGGLE_SCHOOL_FILTER,
      payload: {
        fieldName: fieldName,
      }
    }
  },
};
