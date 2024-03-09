import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import eventReducer from "./eventListReducer";
import familyReducer from "./familyMemberReducer";
import waitListReducer from "./waitListReducer";


const rootReducer = combineReducers({
  user: userReducer,
  familyMember: familyReducer,
  eventList: eventReducer,
  waitList: waitListReducer,
});

export default rootReducer;
