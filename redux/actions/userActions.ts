import { SET_USER, User, SetUserAction, LogoutAction, LOGOUT } from '../types/actionTypes';

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

