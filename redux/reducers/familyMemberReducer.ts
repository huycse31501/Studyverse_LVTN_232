import { Reducer } from "redux";
import {
  familyMemberList,
  FamilyListAction,
  SET_FAMILY_MEMBER,
} from "../types/actionTypes";

export interface FamilyState {
  familyMemberList: familyMemberList | null;
}

const initialState: FamilyState = {
  familyMemberList: null,
};

export const familyReducer: Reducer<FamilyState, FamilyListAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_FAMILY_MEMBER:
      return {
        ...state,
        familyMemberList: action.payload,
      };
    default:
      return state;
  }
};

export default familyReducer;
