import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppNavigator from "./component/navigator/appNavigator";
import WeekDatePicker from "./component/shared/DateSlide";
import EventReminder from "./component/shared/RemindEvent";
import mockEventReminder from "./mockData/EventReminder";

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
    backgroundColor: "#F9F9F9",
  },
});
