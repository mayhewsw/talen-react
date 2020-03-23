import { dataConstants } from '../_constants';

export function data(state = {}, action) {
  switch (action.type) {
    case dataConstants.GETALL_SUCCESS:
      return {
        items: action.data
      };
    default:
      return state
  }
}