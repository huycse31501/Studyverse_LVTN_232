import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StatusCard from "../../component/dashboard/FamilyStatus";
import { userStatusData } from "../../mockData/FamilyStatus";
import UserStatus from "../../component/dashboard/DashboardStatus";
import eventSampleData from "../../mockData/EventData";
import EventTimeline from "../../component/shared/EventTimeline";
import Footer from "../../component/shared/Footer";
import { useNavigation } from "@react-navigation/native";
import { mockUser } from "../../mockData/UserInfo";
import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "./Details";

type StatusBoardNavigationProp = StackNavigationProp<{
  UserDetailsScreen: { user: User };
  Setting: undefined;
}>;

const StatusDashboard = () => {
  const navigation = useNavigation<StatusBoardNavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : "height"}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          extraHeight={120}
          extraScrollHeight={120}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.statusBarContainer}>
            <UserStatus
              userName="Mẹ Thỏ"
              status="on"
              onMenuPress={() => navigation.navigate("Setting")}
            />
          </View>
          <View style={styles.eventContainer}>
            <EventTimeline data={eventSampleData} height={200} />
          </View>
          <View style={styles.familyStatusContainer}>
            <StatusCard
              FamilyStatusData={userStatusData}
              onCardPress={(x) => {
                console.log(x);
                navigation.navigate("UserDetailsScreen", { user: mockUser });
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.footerContainer}>
          <Footer />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  statusBarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  familyStatusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: "5%",
  },
  eventContainer: {
    paddingHorizontal: 12.5,
    paddingVertical: 10,
    marginTop: "5%",
  },
  footerContainer: {
    height: 60,
  },
});

export default StatusDashboard;
