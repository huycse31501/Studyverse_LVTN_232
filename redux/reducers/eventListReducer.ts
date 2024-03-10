import { Reducer } from "redux";
import { eventList, EventListAction, LOGOUT, SET_EVENT } from "../types/actionTypes";

export interface EventState {
  eventList: eventList | null;
}

const initialState: EventState = {
  eventList: null,
};

export const eventReducer: Reducer<EventState, EventListAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_EVENT:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default eventReducer;
