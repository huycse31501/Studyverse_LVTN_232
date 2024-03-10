import { Reducer } from "redux";
import { SET_FAMILY_MEMBER, SetFamilyMemberAction, User } from "../types/actionTypes";

export interface FamilyMemberState {
  familyMembers: User[];
}

const initialState: FamilyMemberState = {
  familyMembers: [],
};

export const familyMemberReducer: Reducer<FamilyMemberState, SetFamilyMemberAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_FAMILY_MEMBER:
      return {
        ...state,
        familyMembers: action.payload.familyMembers,
      };
    default:
      return state;
  }
};