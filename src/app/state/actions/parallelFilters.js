export const actionTypes = {
    TOGGLE_PARALLEL_FILTER : 'TOGGLE_PARALLEL_FILTER',
};

export const actionCreators = {
    toggleParallelFilter(fieldName){
        return {
            type: actionTypes.TOGGLE_PARALLEL_FILTER,
            payload: {
                fieldName: fieldName,
            }
        }
    },
};
