import {
  SET_FAMILY_MEMBER,
  User,
  familyMemberList,
} from "../types/actionTypes";

export interface SetFamilyMemberAction {
  type: typeof SET_FAMILY_MEMBER;
  payload: {
    familyMembers: User[];
  };
}

export const setFamilyMember = (familyMembers: User[]): SetFamilyMemberAction => ({
  type: SET_FAMILY_MEMBER,
  payload: { familyMembers },
});