import { UtilTypes, UtilState, CHANGE_FORM } from "../_utils/types";

const initialState: UtilState = {
  formState: {
    username: "",
    password: "",
  },
};

export function util(state = initialState, action: UtilTypes): UtilState {
  switch (action.type) {
    case CHANGE_FORM:
      return {
        formState: {
          ...state.formState,
          ...action.newState,
        },
      };
    default:
      return state;
  }
}
