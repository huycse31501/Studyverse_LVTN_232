import { Reducer } from "redux";
import { SET_WAIT_LIST, WaitListAction, familyWaitList } from "../types/actionTypes";

const initialState: familyWaitList = {
  waitList: [],
};

// Reducer
export const waitListReducer: Reducer<familyWaitList, WaitListAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_WAIT_LIST:
      return {
        ...state,
        waitList: action.payload.waitList,
      };
    default:
      return state;
  }
};
