import { Reducer } from "redux";
import { UserActionTypes, SET_USER, User } from "../types/actionTypes";

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
    default:
      return state;
  }
};

export default userReducer;
