import { CHANGE_FORM } from "../_utils/types";

export const changeForm = (newState: string) => {
  console.log("inside login/changeForm");
  return { type: CHANGE_FORM, newState };
};

export const utilActions = {
  changeForm,
};
