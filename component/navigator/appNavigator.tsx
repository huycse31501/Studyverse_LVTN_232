import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignIn from "../../screen/SignIn-SignUp/SignIn";
import SignUp from "../../screen/SignIn-SignUp/SignUp";
import { StyleSheet } from "react-native";
import ForgotPassword from "../../screen/SignIn-SignUp/ForgotPassword";
import OTPScreen from "../../screen/SignIn-SignUp/OTPScreen";
import StatusDashboard from "../../screen/Dashboard/StatusBoard";
import UserDetailsScreen, { User } from "../../screen/Dashboard/Details";
import Setting from "../../screen/Dashboard/Setting";
import FamilyInfoScreen from "../../screen/Dashboard/FamilyInfo";
import NewPasswordScreen from "../../screen/SignIn-SignUp/NewPassword";
import FamilyAcceptScreen from "../../screen/Dashboard/FamilyAccept";
import UserInformationScreen from "../../screen/Dashboard/UserInformation";
import { EventProps } from "../shared/RemindEvent";
import EventInfo from "../type/EventInfo";
import EventInfoScreen from "../../screen/Calendar/CalendarDashboard";
import EventRemindScreen from "../../screen/Calendar/EventRemindScreen";

export type RootStackParamList = {
  ForgotPassword: undefined;
  SignUp: undefined;
  SignIn: undefined;
  OTPScreen: undefined;
  StatusDashboard: undefined;
  UserDetailsScreen: { user: User };
  Setting: undefined;
  FamilyInfoScreen: undefined;
  NewPasswordScreen: undefined;
  FamilyAcceptScreen: undefined;
  UserInformationScreen: undefined;
  EventInfoScreen: {
    user: User;
    eventRemindList: EventProps[];
    eventList: EventInfo[];
    routeBefore: string;
  };
  EventRemindScreen: {
    user: User;
    eventList: EventInfo[];
    routeBefore: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
        <Stack.Screen name="StatusDashboard" component={StatusDashboard} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="FamilyInfoScreen" component={FamilyInfoScreen} />
        <Stack.Screen
          name="FamilyAcceptScreen"
          component={FamilyAcceptScreen}
        />
        <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        <Stack.Screen
          name="UserInformationScreen"
          component={UserInformationScreen}
        />
        <Stack.Screen name="EventInfoScreen" component={EventInfoScreen} />
        <Stack.Screen name="EventRemindScreen" component={EventRemindScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
