export const SET_USER = "SET_USER";

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export type UserActionTypes = SetUserAction;

export interface User {
  id: number;
  name: string;
}
