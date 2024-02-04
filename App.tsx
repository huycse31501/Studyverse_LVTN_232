import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TextInputField from "./component/signin-signup/TextInputField";
import React, { useEffect, useState } from "react";
import PasswordInputField from "./component/signin-signup/PasswordInputField";
import DateInputField from "./component/signin-signup/DateInputField";
import AuthButton from "./component/signin-signup/AuthButton";
import { Asset } from "expo-asset";
import OptionSelector from "./component/shared/OptionSelector";
import ApplyButton from "./component/shared/ApplyButton";
import SignUp from "./screen/SignIn-SignUp/SignUp";
import SignIn from "./screen/SignIn-SignUp/SignIn";
import AppNavigator from "./component/navigator/appNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
});
