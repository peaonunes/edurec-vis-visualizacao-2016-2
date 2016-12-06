export const actionTypes = {
    SELECT_PARALLEL_SET : 'SELECT_PARALLEL_SET',
    RESET_PARALLEL_SET_SELECTION: 'RESET_PARALLEL_SET_SELECTION',
};

export const actionCreators = {
    selectParallel(selectedHierarchyFilters){
        return {
            type : actionTypes.SELECT_PARALLEL_SET,
            payload : {
                selectedHierarchyFilters: selectedHierarchyFilters,
            }
        }
    },

    resetParallelSetSelection() {
        return {
            type: actionTypes.RESET_PARALLEL_SET_SELECTION,
        };
    },
};
