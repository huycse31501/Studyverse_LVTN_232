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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type StatusBoardNavigationProp = StackNavigationProp<{
  UserDetailsScreen: { user: User };
  Setting: undefined;
  FamilyInfoScreen: undefined;
}>;

const getTimeDifference = (lastLogin: string) => {
  if (!lastLogin) {
    return "No recent login";
  }

  const lastLoginDate = new Date(lastLogin);
  const now = new Date();
  const timeDiff = now.getTime() - lastLoginDate.getTime();

  const minutesDiff = timeDiff / (1000 * 60);
  const hoursDiff = minutesDiff / 60;

  if (hoursDiff > 24) {
    return "Trên 1 ngày";
  } else if (hoursDiff < 1) {
    return `${minutesDiff.toFixed(0)} phút trước`;
  } else {
    return `${hoursDiff.toFixed(0)} giờ trước`;
  }
};
const StatusDashboard = () => {
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const user = useSelector((state: RootState) => state.user.user);
  // console.log(familyList);

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
              userName={String(user?.nickName)}
              status={user?.accountStatus ? "on" : "off"}
              onMenuPress={() => navigation.navigate("Setting")}
            />
          </View>
          <View style={styles.eventContainer}>
            <Text style={styles.eventHeader}>Sự kiện hôm nay</Text>
            {true ? (
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

            {Number(user?.familyId) === 0 ? (
              <View style={styles.familyNotLinkPlaceHolder}>
                <Text style={styles.familyNotLinkText}>
                  Tài khoản hiện chưa liên kết gia đình
                </Text>
                <TouchableOpacity
                  style={styles.linkFamily}
                  onPress={() => {
                    navigation.navigate("Setting");
                  }}
                >
                  <Text style={styles.linkFamilyText}>Liên kết gia đình</Text>
                </TouchableOpacity>
              </View>
            ) : Array.isArray(familyList) && familyList.length !== 0 ? (
              <StatusCard
                  FamilyStatusData={familyList.map((item: any) => ({
                  email: item.email,
                  dob: item.dateOfBirth,
                  fullname:
                    item.lastName && item.firstName
                      ? `${item.firstName} ${item.lastName}`
                      : "",
                  name: item.nickName ? String(item.nickName) : "",
                  status: item?.userStatus === "null" ? "" : item?.userStatus,
                  avatarUri:
                    item?.role === "parent"
                      ? "https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288870.jpg"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkYe42R9zF530Q3WcApmRDpP6YfQ6Ykexa3clwEWlIw&s",
                  currentStatus: item?.accountStatus ? "onl" : "off",
                  lastOnline: !item.accountStatus
                    ? getTimeDifference(item?.lastLogin)
                    : "Đang trực tuyến",
                }))}
                onCardPress={(x) => {
                  navigation.navigate("UserDetailsScreen", {
                    user: {
                      fullName: x.fullname,
                      nickname: x.name,
                      birthdate: x.dob,
                      avatarUri: x.avatarUri,
                    },
                  });
                }}
              />
            ) : (
              <View style={styles.familyNotFoundPlaceHolder}>
                <Text style={styles.familyNotFoundText}>
                  Gia đình hiện chưa có thành viên
                </Text>
                <TouchableOpacity
                  style={styles.linkFamily}
                  onPress={() => navigation.navigate("FamilyInfoScreen")}
                >
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
