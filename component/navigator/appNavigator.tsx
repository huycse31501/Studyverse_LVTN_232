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

export type RootStackParamList = {
  ForgotPassword: undefined;
  SignUp: undefined;
  SignIn: undefined;
  OTPScreen: undefined;
  StatusDashboard: undefined;
  UserDetailsScreen: { user: User };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StatusDashboard"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
