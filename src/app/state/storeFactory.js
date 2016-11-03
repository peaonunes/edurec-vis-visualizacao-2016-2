import schools from './reducers/schools';
import schoolFilters from './reducers/schoolFilters';
import studentFilters from './reducers/studentFilters';

import { combineReducers, createStore } from 'redux';

export default function storeFactory() {
  const rootReducer = combineReducers({
    schools,
    schoolFilters,
    studentFilters,
  });

  return createStore(rootReducer);
};
