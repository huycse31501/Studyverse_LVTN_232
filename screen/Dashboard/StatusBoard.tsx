import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StatusCard from "../../component/dashboard/FamilyStatus";
import { userStatusData } from "../../mockData/FamilyStatus";
import UserStatus from "../../component/dashboard/DashboardStatus";
import eventSampleData from "../../mockData/EventData";
import EventTimeline from "../../component/shared/EventTimeline";
import Footer from "../../component/shared/Footer";

const StatusDashboard = () => {
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: "20%" }}>
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
            <UserStatus userName="Mẹ Thỏ" status="on" />
          </View>
          <View style={styles.eventContainer}>
            <EventTimeline data={eventSampleData} height={200} />
          </View>
          <View style={styles.familyStatusContainer}>
            <StatusCard
              FamilyStatusData={userStatusData}
              onCardPress={(x) => console.log(x)}
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
  },
  eventContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  footerContainer: {
    height: 60,
  },
});

export default StatusDashboard;
