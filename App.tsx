import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StatusDashboard from "./screen/Dashboard/StatusBoard";
import UserDetailsScreen from "./screen/Dashboard/Details";
import { mockUser } from "./mockData/UserInfo";

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
      {/* <StatusDashboard /> */}
      <UserDetailsScreen user={mockUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
});
