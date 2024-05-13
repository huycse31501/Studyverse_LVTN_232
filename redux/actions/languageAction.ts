import { TOGGLE_ENGLISH } from "../types/actionTypes";

export const setEnglishEnabled = (isEnabled: any) => {
    return {
      type: TOGGLE_ENGLISH,
      payload: isEnabled,
    };
  };