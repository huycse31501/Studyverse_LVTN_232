import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import WeekDatePicker from "../../component/shared/DateSlide";
import EventTimeline from "../../component/shared/EventTimeline";
import eventSampleData from "../../mockData/EventData";
import EventReminder, { EventProps } from "../../component/shared/RemindEvent";
import mockEventReminder from "../../mockData/EventReminder";
import ApplyButton from "../../component/shared/ApplyButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { avatarList } from "../../utils/listOfAvatar";

type EventRemindProp = RouteProp<RootStackParamList, "EventRemindScreen">;

interface EventRemindScreenProps {
  route: EventRemindProp;
  navigation: StackNavigationProp<RootStackParamList, "EventRemindScreen">;
}
const EventRemindScreen = ({ route, navigation }: EventRemindScreenProps) => {
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const { userId, routeBefore } = route.params;

  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const memberToRender = totalList.filter(
    (user) => user.userId === String(userId)
  )[0];

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshEventList, setRefreshEventList] = useState(false);

  const [curEventChange, setCurEventChange] = useState<EventProps>();
  const [listOfEvent, setListOfEvent] = useState([]);
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );
  const requestEventList = async () => {
    let requestCreateEventURL = `https://${host}/event/${userId}`;
    try {
      const response = await fetch(requestCreateEventURL, {
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
          const selectedDateString = selectedDate.toLocaleDateString("en-GB");
          const eventReminderList = events
            .filter((event: any) => event.remindTime !== 0)
            .map((event: any) => {
              const startDateObj = new Date(event.timeStart);
              const startDate = startDateObj.toLocaleDateString("en-GB");

              const startTime = startDateObj.toTimeString().substring(0, 5);

              const currentDateTime = new Date();

              let status = "";
              if (event.success) {
                status = "complete";
              } else if (startDateObj < currentDateTime) {
                status = "incomplete";
              } else {
                status = "pending";
              }
              return {
                eventId: event.id,
                date: startDate,
                time: startTime,
                name: event.name,
                status,
              };
            })
            .filter((event: any) => {
              return event.date === selectedDateString;
            });
          const eventReminderListInput = eventReminderList.map((event: any) => {
            return {
              eventId: event.eventId,
              time: event.time,
              name: event.name,
              status: event.status,
            };
          });
          setListOfEvent(eventReminderListInput);
        } catch (e) {
          console.error("Error fetching events:", e);
        }
      })();
    }, [selectedDate, userId, refreshEventList])
  );
  useEffect(() => {
    if (refreshEventList) {
      setRefreshEventList(false);
    }
  }, [refreshEventList]);
  const [confirmCancelModalVisible, setConfirmCancelModalVisible] =
    useState(false);

  const handleEventPress = (item: EventProps) => {
    setCurEventChange(item);
    setConfirmCancelModalVisible(true);
  };

  const handleCancelButton = async () => {
    let requestUpdateEventStateURL = `https://${host}/event/${curEventChange?.eventId}/updateStatus`;
    try {
      const response = await fetch(requestUpdateEventStateURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.msg === "1") {
        setRefreshEventList(true);

        setConfirmCancelModalVisible(false);
      } else {
        console.log("Lỗi khi gọi API");
      }
    } catch (e) {
      Alert.alert("Có lỗi xảy ra trong quá trình cập nhật");
    }
  };
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
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
          <View style={styles.header}>
            <View style={styles.backButtonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={
                  routeBefore === "EventInfoScreen"
                    ? () =>
                        navigation.navigate("EventInfoScreen", {
                          userId: userId,
                          routeBefore: "EventRemindScreen",
                        })
                    : routeBefore === "familyMemberDetails"
                    ? () =>
                        navigation.navigate("UserDetailsScreen", {
                          user: {
                            userId: userId,
                          },
                        })
                    : () =>
                        navigation.navigate("EventInfoScreen", {
                          userId: userId,
                          routeBefore: "EventRemindScreen",
                        })
                }
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri:
                avatarList[Number(memberToRender?.avatarId) - 1] ?? avatarList[0]
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.weekDatePickerContainer}>
            <WeekDatePicker remind onDateSelect={handleDateSelect} onEnglish={isEnglishEnabled} />
          </View>
          <EventReminder
            events={listOfEvent}
            height={450}
            onEventItemPress={handleEventPress}
          />
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmCancelModalVisible}
        onRequestClose={() => setConfirmCancelModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setConfirmCancelModalVisible(false);
          }}
        >
          <View style={styles.cancelModalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.cancelModalView}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setConfirmCancelModalVisible(false);
                  }}
                >
                  <Image
                    source={require("../../assets/images/shared/closedModal.png")}
                    style={styles.closeIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.modalIntroText}>Xác nhận</Text>
                <Text style={styles.modalWarningText}>
                  Đánh dấu sự kiện đã hoàn thành
                </Text>
                <ApplyButton
                  extraStyle={styles.modalButton}
                  label={isEnglishEnabled ? "CONFIRM": "XÁC NHẬN"}
                  onPress={handleCancelButton}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButtonContainer: {
    marginTop: "6%",
    marginLeft: "7.5%",
  },
  backButton: {},
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF2D58",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: "7.5%",
    marginTop: "6%",
    borderRadius: 500,
  },
  weekDatePickerContainer: {
    marginBottom: 10,
  },
  cancelModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cancelModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalIntroText: {
    color: "#54595E",
    fontWeight: "600",
    fontSize: 21.5,
    alignSelf: "center",
  },
  modalButton: {
    width: 160,
    height: 50,
    marginTop: "2%",
  },
  modalWarningText: {
    color: "#54595E",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "left",
    marginTop: "7.5%",
    marginBottom: "7.5%",
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
});

export default EventRemindScreen;
