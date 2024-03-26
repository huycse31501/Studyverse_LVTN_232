import { SET_USER, User, SetUserAction, LogoutAction, LOGOUT, SET_USER_STATUS, UserActionTypes } from '../types/actionTypes';

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const setUserStatus = (status: string): UserActionTypes => ({
  type: SET_USER_STATUS,
  payload: status,
});