import { actionTypes } from '../actions/parallelSelect';

import { List } from 'immutable';

export default function parallelSelectReducer(parallelSelected = List(), action) {
    switch (action.type) {
        case actionTypes.SELECT_PARALLEL_SET:
            const { selectedHierarchyFilters } = action.payload;
            return List(selectedHierarchyFilters);
        default:
            return parallelSelected;
    }
}
