import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  RegistrationTypes,
} from "../_utils/types";

const initialState = {
  registering: false,
};

export function registration(state = initialState, action: RegistrationTypes) {
  switch (action.type) {
    case REGISTER_REQUEST:
      return { registering: !state.registering };
    case REGISTER_SUCCESS:
      return { registering: false };
    case REGISTER_FAILURE:
      return { registering: false };
    default:
      return state;
  }
}
