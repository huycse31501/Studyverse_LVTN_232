import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
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
            <Text style={styles.eventHeader}>Sự kiện hôm nay</Text>
            {false ? (
              <EventTimeline data={eventSampleData} height={200} />
            ) : (
              <View style={styles.eventPlaceHolder}>
                <Text style={styles.eventNotFound}>
                  Hiện chưa có sự kiện để hiển thị
                </Text>
                <TouchableOpacity style={styles.addTask}>
                  <Text style={styles.addTaskText}>Thêm sự kiện</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.familyStatusContainer}>
            <Text style={styles.familyStatusText}>Trạng thái gia đình </Text>

            {false ? (
              <StatusCard
                FamilyStatusData={userStatusData}
                onCardPress={(x) => {
                  console.log(x);
                  navigation.navigate("UserDetailsScreen", { user: mockUser });
                }}
              />
            ) : false ? (
              <View style={styles.familyNotLinkPlaceHolder}>
                <Text style={styles.familyNotLinkText}>
                  Tài khoản hiện chưa liên kết gia đình
                </Text>
                <TouchableOpacity style={styles.linkFamily}>
                  <Text style={styles.linkFamilyText}>Liên kết gia đình</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.familyNotFoundPlaceHolder}>
                <Text style={styles.familyNotFoundText}>
                  Gia đình hiện chưa có thành viên
                </Text>
                <TouchableOpacity style={styles.linkFamily}>
                  <Text style={styles.linkFamilyText}>Thông tin gia đình</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginTop: 10,
  },
  eventContainer: {
    paddingHorizontal: 12.5,
    paddingVertical: 10,
  },
  eventHeader: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
    color: "#000",
  },
  eventPlaceHolder: {
    marginTop: 20,
  },
  eventNotFound: {
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "grey",
  },
  addTask: {
    marginTop: 25,
    marginBottom: 15,
  },
  addTaskText: {
    alignSelf: "center",
    color: "#FF2D55",
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "#FF2D55",
    borderBottomStartRadius: 3,
  },
  familyStatusText: {
    fontWeight: "600",
    fontSize: 18,
    color: "#000",
  },
  familyNotLinkPlaceHolder: {
    marginTop: 120,
  },
  familyNotLinkText: {
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "grey",
  },
  linkFamily: {
    marginTop: 30,
  },
  linkFamilyText: {
    alignSelf: "center",
    color: "#FF2D55",
    fontSize: 18,
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "#FF2D55",
    borderBottomStartRadius: 3,
  },
  familyMemberNotFoundText: {
    marginTop: 120,
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "grey",
  },
  familyNotFoundPlaceHolder: {
    marginTop: 120,
  },
  familyNotFoundText: {
    alignSelf: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "grey",
  },
  footerContainer: {
    height: 60,
  },
});

export default StatusDashboard;
