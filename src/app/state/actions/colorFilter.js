export const actionTypes = {
  SET_COLOR_FILTER: 'SET_COLOR_FILTER',
};

export const actionCreators = {
  setColorFilter(colorFilter) {
    return {
      type: actionTypes.SET_COLOR_FILTER,
      payload: {
        colorFilter,
      }
    };
  }
};
