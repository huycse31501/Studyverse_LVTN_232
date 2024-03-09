import { SET_FAMILY_MEMBER, SetFamilyMemberAction, familyMemberList } from "../types/actionTypes";

export const setFamilyMember = (
  familyMember: familyMemberList
): SetFamilyMemberAction => ({
  type: SET_FAMILY_MEMBER,
  payload: familyMember,
});
