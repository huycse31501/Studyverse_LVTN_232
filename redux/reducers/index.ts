import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import eventReducer from "./eventListReducer";
import { familyMemberReducer } from "./familyMemberReducer";
import { waitListReducer } from "./waitListReducer";
import languageReducer from "./languageReducer";

const rootReducer = combineReducers({
  user: userReducer,
  familyMember: familyMemberReducer,
  eventList: eventReducer,
  waitList: waitListReducer,
  language: languageReducer,
});

export default rootReducer;
