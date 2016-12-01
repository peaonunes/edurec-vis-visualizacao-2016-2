export const actionTypes = {
    SELECT_PARALLEL_SET : 'SELECT_PARALLEL_SET',
};

export const actionCreators = {
    selectParallel(selectedHierarchy){
        return {
            type : actionTypes.SELECT_PARALLEL_SET,
            payload : {
                selectedHierarchy: selectedHierarchy,
            }
        }
    },
};
