import { SET_USER, User, UserActionTypes } from '../types/actionTypes';

export const setUser = (user: User): UserActionTypes => ({
  type: SET_USER,
  payload: user,
});