import { actionTypes } from '../actions/schoolSelection';

export default function schoolSelectionReducer(selection = null, action) {
  switch (action.type) {
    case actionTypes.SELECT_SCHOOL:
      return action.payload.school;
    case actionTypes.DESELECT_SCHOOL:
      return null;
    default:
      return selection;
  }
}