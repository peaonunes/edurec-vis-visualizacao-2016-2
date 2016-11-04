import { actionTypes } from '../actions/studentFilters';

import { Map, List } from 'immutable';

export default function studentFiltersReducer(filters = Map(), action) {
  switch (action.type) {
    case actionTypes.ADD_STUDENT_FILTER: {
      const {fieldName, allowedValues} = action.payload;

      return filters.set(fieldName, List(allowedValues));
    }
    case actionTypes.REMOVE_STUDENT_FILTER: {
      const {fieldName} = action.payload;

      return filters.remove(fieldName);
    }
    default:
      return filters;
  }
}
