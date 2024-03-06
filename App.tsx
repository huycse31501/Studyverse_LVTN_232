import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppNavigator from "./component/navigator/appNavigator";
import WeekDatePicker from "./component/shared/DateSlide";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* <AppNavigator /> */}
      <WeekDatePicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F9F9F9",
    marginTop: "20%",
  },
});
