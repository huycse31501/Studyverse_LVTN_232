import { Reducer } from "redux";
import { UserActionTypes, SET_USER, User, LOGOUT } from "../types/actionTypes";

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userReducer: Reducer<UserState, UserActionTypes> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_USER:
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

export default userReducer;
