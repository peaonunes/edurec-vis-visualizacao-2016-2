import { actionTypes } from '../actions/colorFilter';

export default function colorFilterReducer(filter = "nota", action) {
  switch (action.type) {
    case actionTypes.SET_COLOR_FILTER:
      return action.payload.colorFilter;
    default:
      return filter;
  }
}