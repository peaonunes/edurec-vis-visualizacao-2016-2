import { actionTypes } from '../actions/parallelFilters';

import { Set } from 'immutable';

export default function parallelFiltersReducer(filters = Set(), action) {
    switch (action.type) {
        case actionTypes.TOGGLE_PARALLEL_FILTER:
            const { fieldName } = action.payload;

            if (filters.contains(fieldName)){
                return filters.remove(fieldName);
            } else {
                return filters.add(fieldName);
            }
        default:
            return filters;
    }
}
