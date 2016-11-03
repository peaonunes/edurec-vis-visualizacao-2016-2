import { actionTypes } from '../actions/schoolFilters';

import { Set } from 'immutable';

export default function schoolFiltersReducer(filters = Set(), action) {
  switch (action.type) {
    case actionTypes.ADD_SCHOOL_FILTER:
      return filters.add(action.payload.fieldName);
    case actionTypes.REMOVE_SCHOOL_FILTER:
      return filters.remove(action.payload.fieldName);
    default:
      return filters;
  }
}
