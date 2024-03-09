import { Reducer } from "redux";
import {
  familyWaitList,
  SET_WAIT_LIST,
  WaitListAction,
} from "../types/actionTypes";

export interface WaitListState {
  waitList: familyWaitList | null;
}

const initialState: WaitListState = {
  waitList: null,
};

export const waitListReducer: Reducer<WaitListState, WaitListAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_WAIT_LIST:
      return {
        ...state,
        waitList: action.payload,
      };
    default:
      return state;
  }
};

export default waitListReducer;
