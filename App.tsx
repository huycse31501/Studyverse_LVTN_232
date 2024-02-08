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
import OTPInput from "./component/shared/OTPInput";
import EventTimeline from "./component/shared/EventTimeline";
import eventSampleData from "./mockData/EventData";
import UserStatus from "./component/dashboard/DashboardStatus";
import StatusCard from "./component/dashboard/FamilyStatus";
import { userStatusData } from "./mockData/FamilyStatus";
import Footer from "./component/shared/Footer";
import StatusDashboard from "./screen/Dashboard/StatusBoard";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* <AppNavigator /> */}

      {/* <UserStatus userName="Mẹ Thỏ" status="on" />
      <EventTimeline data={eventSampleData} height={200} /> */}
      {/* <StatusCard
        FamilyStatusData={userStatusData}
        onCardPress={(x) => console.log(x)}
      /> */}
      {/* <Footer /> */}
      <StatusDashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
