const d3 = require('d3');

import { schools as schoolsSelector } from '../state/selectors';

export function renderParallel(store){
    function innerRender() {
        const schools = schoolsSelector(store.getState());

        renderParallelSet(schools);
    }

    innerRender();
    store.subscribe(innerRender);
}

function renderParallelSet(schools){
    // TODO: Parallel should go here.
}
