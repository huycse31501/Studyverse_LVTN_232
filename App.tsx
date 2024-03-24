import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import AppNavigator from "./component/navigator/appNavigator";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import NotificationManager from "./component/notification/notificationManager";


export default function App() {

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <NotificationManager />
        <AppNavigator />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
