import { MessageTypes, ALERT_SUCCESS, ALERT_ERROR, ALERT_CLEAR } from '../_utils/types';

interface MessageState {
  type: string
  message: string
}

const initialState: MessageState = {
  type: "",
  message: ""
}

export function alert(state = initialState, action: MessageTypes): MessageState {
  switch (action.type) {
    case ALERT_SUCCESS:
      return {
        type: 'alert-success',
        message: action.message
      };
    case ALERT_ERROR:
      return {
        type: 'alert-danger',
        message: action.message
      };
    case ALERT_CLEAR:
      return { type: "", message: ""};
    default:
      return state
  }
}