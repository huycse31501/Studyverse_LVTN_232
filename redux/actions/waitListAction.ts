import {
  SET_WAIT_LIST,
  User,
} from "../types/actionTypes";

export interface SetWaitListAction {
  type: typeof SET_WAIT_LIST;
  payload: {
    waitList: User[];
  };
}

export const setWaitList = (waitList: User[]): SetWaitListAction => ({
  type: SET_WAIT_LIST,
  payload: { waitList },
});