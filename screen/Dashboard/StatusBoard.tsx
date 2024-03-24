import React, { useCallback, useEffect, useState } from "react";
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
import UserStatus from "../../component/dashboard/DashboardStatus";
import EventTimeline from "../../component/shared/EventTimeline";
import Footer from "../../component/shared/Footer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { User } from "./Details";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import Constants from "expo-constants";
import { Event, GroupedEvent } from "../Calendar/CalendarDashboard";
import { useDispatch } from "react-redux";
import { setFamilyMember } from "../../redux/actions/familyAction";
import { mapUserIdsToAvatarIds } from "../../utils/mapUserIdToAvatarId";

type StatusBoardNavigationProp = StackNavigationProp<{
  UserDetailsScreen: { user: User };
  Setting: undefined;
  FamilyInfoScreen: {
    routeBefore?: string;
  };
  CreateEventScreen: {
    userId: number;
  };
}>;

const StatusDashboard = () => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;

  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const user = useSelector((state: RootState) => state.user.user);

  const navigation = useNavigation<StatusBoardNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();

  const [listOfEvent, setListOfEvent] = useState([]);
  const requestEventList = async () => {
    let requestUserEventURL = `http://${host}:${port}/event/${user?.userId}`;
    try {
      const response = await fetch(requestUserEventURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (e) {
      return [];
    }
  };
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const events = await requestEventList();
          const selectedDateString = new Date().toLocaleDateString("en-GB");

          const filteredAndFormattedEvents = events
            .map((event: any) => {
              const startDateObj = new Date(event.timeStart);
              const endDateObj = new Date(event.timeEnd);
              const startDate = startDateObj.toLocaleDateString("en-GB");
              const endDate = endDateObj.toLocaleDateString("en-GB");
              const startTime = startDateObj.toTimeString().substring(0, 5);
              const endTime = endDateObj.toTimeString().substring(0, 5);

              return {
                startDate,
                endDate,
                startTime,
                endTime,
                name: event.name,
                tags: mapUserIdsToAvatarIds(familyList, event.tagUsers),
                id: event.id,
                remindTime: event.remindTime,
                note: event.note,
                isLoop: event.loop,
                tagsToEdit: event.tagUsers,
              };
            })
            .filter((event: any) => {
              return (
                event.startDate === selectedDateString &&
                event.endDate === selectedDateString
              );
            });
          setListOfEvent(filteredAndFormattedEvents);
        } catch (e) {
          console.error("Error fetching events:", e);
        }
      })();
    }, [user, familyList])
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        let requestFamilyListURL = `http://${host}:${port}/family/getFamilyMembers/${user?.familyId}`;
        const familyListResponse = await fetch(requestFamilyListURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const familyListData = await familyListResponse.json();

        const data = familyListData.data;
        const familyListPayload = data
          .map((item: any) => ({
            userId: String(item.id),
            phoneNumber: String(item.phone),
            dateOfBirth: item.dob ? String(item.dob) : "",
            email: String(item.email),
            familyId: String(item.familyId),
            firstName: String(item.firstName),
            lastName: String(item.lastName),
            nickName: String(item.nickName) ? String(item.nickName) : "",
            lastLogin: String(item.lastLogin),
            accountStatus: item.accountStatus,
            userStatus: String(item.userStatus),
            role: String(item.role),
            avatarId: String(item.avatar),
          }))
          .filter((item: any) => item.userId !== String(user?.userId));

        dispatch(setFamilyMember(familyListPayload));
      } catch (e) {
        console.log("Error while fetching family lists", e);
      }
    };
    let id: number | null = null;

    if (user) {
      id = setInterval(fetchData, 1000) as unknown as number;
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [user]);
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
            {listOfEvent.length !== 0 ? (
              <EventTimeline
                userId={Number(user?.userId)}
                routeBefore="StatusDashboard"
                data={listOfEvent}
                height={200}
              />
            ) : (
              <View style={styles.eventPlaceHolder}>
                <Text style={styles.eventNotFound}>
                  Hôm nay bạn không có sự kiện gì
                </Text>
                <TouchableOpacity
                  style={styles.addTask}
                  onPress={() =>
                    navigation.navigate("CreateEventScreen", {
                      userId: Number(user?.userId),
                    })
                  }
                >
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
              <StatusCard />
            ) : (
              <View style={styles.familyNotFoundPlaceHolder}>
                <Text style={styles.familyNotFoundText}>
                  Gia đình hiện chưa có thành viên
                </Text>
                <TouchableOpacity
                  style={styles.linkFamily}
                  onPress={() =>
                    navigation.navigate("FamilyInfoScreen", {
                      routeBefore: "dashboard",
                    })
                  }
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
