import { actionTypes } from '../actions/parallelSelect';

import { Map } from 'immutable';

export default function parallelSelectReducer(parallelSelected = Map(), action) {
    switch (action.type) {
        case actionTypes.SELECT_PARALLEL_SET:
            const { selectedHierarchy } = action.payload;

            Object.keys(selectedHierarchy).forEach((key) => {
                parallelSelected.set(id, selectedHierarchy[id]);
            });

            return parallelSelected;
        default:
            return parallelSelected;
    }
}
