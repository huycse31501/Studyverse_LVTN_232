import { LOGOUT, LogoutAction } from "../types/actionTypes";

export const logout = (): LogoutAction => ({
    type: LOGOUT,
  });