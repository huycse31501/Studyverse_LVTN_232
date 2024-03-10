import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import eventReducer from "./eventListReducer";
import { familyMemberReducer } from "./familyMemberReducer";
import { waitListReducer } from "./waitListReducer";

const rootReducer = combineReducers({
  user: userReducer,
  familyMember: familyMemberReducer,
  eventList: eventReducer,
  waitList: waitListReducer,
});

export default rootReducer;
