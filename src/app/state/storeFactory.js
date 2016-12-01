import schools from './reducers/schools';
import schoolFilters from './reducers/schoolFilters';
import studentFilters from './reducers/studentFilters';
import selectedSchool from './reducers/schoolSelection';
import parallelFilters from './reducers/parallelFilters';
import parallelSelect from './reducers/parallelSelect';
import colorFilter from './reducers/colorFilter';


import { combineReducers, createStore } from 'redux';

export default function storeFactory() {
  const rootReducer = combineReducers({
    schools,
    schoolFilters,
    studentFilters,
    selectedSchool,
    parallelFilters,
    parallelSelect,
    colorFilter,
  });

  return createStore(rootReducer);
};
