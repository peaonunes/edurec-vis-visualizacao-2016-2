export const actionTypes = {
  SELECT_SCHOOL: 'SELECT_SCHOOL',
  DESELECT_SCHOOL: 'DESELECT_SCHOOL'
};

export const actionCreators = {
  selectSchool(school) {
    return {
      type: actionTypes.SELECT_SCHOOL,
      payload: {
        school: school,
      },
    };
  },

  deselectSchool() {
    return {
      type: actionTypes.DESELECT_SCHOOL,
    };
  }
};