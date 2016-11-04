import { actionTypes } from '../actions/schoolFilters';

import { Set } from 'immutable';

export default function schoolFiltersReducer(filters = Set(), action) {
  switch (action.type) {
    case actionTypes.TOGGLE_SCHOOL_FILTER:
      const {fieldName} = action.payload;

      if (filters.contains(fieldName)) {
        return filters.remove(fieldName);
      } else {
        return filters.add(fieldName);
      }
    default:
      return filters;
  }
}
