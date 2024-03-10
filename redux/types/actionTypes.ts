export const SET_USER = "SET_USER";
export const SET_FAMILY_MEMBER = "SET_FAMILY_MEMBER";
export const SET_EVENT = "SET_EVENT";
export const SET_WAIT_LIST = "SET_WAIT_LIST";
export const LOGOUT = "LOGOUT";

export interface User {
  userId?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  email?: string;
  familyId?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
  lastLogin?: string;
  accountStatus?: boolean;
  userStatus?: string;
  role?: string;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface familyMemberList {
  familyMembers: User[];
}

export interface event {
  eventName: string;
  startTime: string;
  endTime: string;
}

export interface eventList {
  events: event[];
}

export interface familyWaitList {
  waitList: User[];
}

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface SetFamilyMemberAction {
  type: typeof SET_FAMILY_MEMBER;
  payload: {
    familyMembers: User[];
  };
}

export interface SetEventAction {
  type: typeof SET_EVENT;
  payload: eventList;
}

export interface SetWaitListAction {
  type: typeof SET_WAIT_LIST;
  payload: familyWaitList;
}
export type UserActionTypes = SetUserAction | LogoutAction;
export type FamilyListAction = SetFamilyMemberAction | LogoutAction;
export type EventListAction = SetEventAction | LogoutAction;
export type WaitListAction = SetWaitListAction | LogoutAction;
