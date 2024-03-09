import { SET_EVENT, SetEventAction, eventList } from "../types/actionTypes";

export const setEvent = (eventList: eventList): SetEventAction => ({
  type: SET_EVENT,
  payload: eventList,
});
