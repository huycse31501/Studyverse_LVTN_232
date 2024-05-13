import { TOGGLE_ENGLISH } from "../types/actionTypes";

const initialState = {
    isEnglishEnabled: false,
  };
  
  const languageReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case TOGGLE_ENGLISH:
        return {
          ...state,
          isEnglishEnabled: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default languageReducer;