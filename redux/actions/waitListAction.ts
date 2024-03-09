import { SET_WAIT_LIST, SetWaitListAction, familyWaitList } from "../types/actionTypes";

export const setWaitList = (waitList: familyWaitList): SetWaitListAction => ({
  type: SET_WAIT_LIST,
  payload: waitList,
});