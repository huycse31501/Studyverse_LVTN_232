import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignIn from "../../screen/SignIn-SignUp/SignIn";
import SignUp from "../../screen/SignIn-SignUp/SignUp";
import { StyleSheet } from "react-native";
import ForgotPassword from "../../screen/SignIn-SignUp/ForgotPassword";
import OTPScreen from "../../screen/SignIn-SignUp/OTPScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OTPScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="OTPScreen" component={OTPScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
