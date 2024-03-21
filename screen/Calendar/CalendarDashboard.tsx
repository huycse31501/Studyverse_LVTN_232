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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import WeekDatePicker from "../../component/shared/DateSlide";
import EventTimeline from "../../component/shared/EventTimeline";
import eventSampleData from "../../mockData/EventData";
import EventReminder from "../../component/shared/RemindEvent";
import mockEventReminder from "../../mockData/EventReminder";
import ApplyButton from "../../component/shared/ApplyButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import { formatDate } from "../../utils/formatDate";
import { avatarList } from "../../utils/listOfAvatar";

type EventInfoRouteProp = RouteProp<RootStackParamList, "EventInfoScreen">;
export interface Event {
  endDate: string;
  endTime: string;
  name: string;
  startDate: string;
  startTime: string;
}

export interface GroupedEvent {
  timeStart: string;
  timeEnd: string;
  task: string[];
}

export interface DateCountMap {
  [date: string]: {
    date: string;
    countEvent: number;
  };
}

interface EventInfoScreenProps {
  route: EventInfoRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "FamilyInfoScreen">;
}
const EventInfoScreen = ({ route, navigation }: EventInfoScreenProps) => {
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

  const [eventsData, setEventsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [listOfEvent, setListOfEvent] = useState([]);
  const [listOfRemindEvent, setListOfRemindEvent] = useState([]);
  const [listOfEventCount, setListOfEventCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const groupEvents = (events: Event[]): GroupedEvent[] => {
    const groupedEvents = events.reduce(
      (accumulator: { [key: string]: GroupedEvent }, currentEvent: Event) => {
        const timeKey = `${currentEvent.startTime}-${currentEvent.endTime}`;

        if (!accumulator[timeKey]) {
          accumulator[timeKey] = {
            timeStart: currentEvent.startTime,
            timeEnd: currentEvent.endTime,
            task: [currentEvent.name],
          };
        } else {
          accumulator[timeKey].task.push(currentEvent.name);
        }

        return accumulator;
      },
      {}
    );

    return Object.values(groupedEvents);
  };

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const requestEventList = async () => {
      let requestCreateEventURL = `http://${host}:${port}/event/${userId}`;
      try {
        const response = await fetch(requestCreateEventURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setEventsData(data);
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    };
    requestEventList();
  }, []);

  useEffect(() => {
    const processData = () => {
      const selectedDateString = selectedDate.toLocaleDateString("en-GB");

      const filteredAndFormattedEvents = eventsData
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
          };
        })
        .filter((event: any) => {
          return (
            event.startDate === selectedDateString &&
            event.endDate === selectedDateString
          );
        });

      setListOfEvent(filteredAndFormattedEvents as any);
    };

    processData();
  }, [selectedDate, eventsData]);

  useEffect(() => {
    const processData = () => {
      const eventCount = Object.values(
        eventsData
          .map((event: any) => ({
            date: formatDate(event.timeStart.split("T")[0]),
          }))
          .reduce((acc: DateCountMap, currentValue: any) => {
            const { date } = currentValue;
            if (acc[date]) {
              acc[date].countEvent += 1;
            } else {
              acc[date] = { date, countEvent: 1 };
            }
            return acc;
          }, {} as DateCountMap)
      );

      const eventReminderList = eventsData
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
            date: startDate,
            time: startTime,
            name: event.name,
            status,
          };
        })
        .filter((event: any) => {
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          const dd = String(tomorrow.getDate()).padStart(2, "0");
          const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
          const yyyy = tomorrow.getFullYear();
          const formattedTomorrow = `${dd}/${mm}/${yyyy}`;
          return event.date === formattedTomorrow;
        });
      const eventReminderListInput = eventReminderList.map((event: any) => {
        return {
          time: event.time,
          name: event.name,
          status: event.status,
        };
      });
      setListOfRemindEvent(eventReminderListInput as any);
      setListOfEventCount(eventCount as any);
      setIsLoading(false);
    };

    processData();
  }, [eventsData]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top - 15 }}>
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
                  memberToRender.userId === user?.userId
                    ? () => navigation.navigate("StatusDashboard")
                    : () =>
                        navigation.navigate("UserDetailsScreen", {
                          user: {
                            userId: userId,
                          },
                        })
                }
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri: avatarList[Number(user?.avatarId) - 1] ?? avatarList[0],
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.weekDatePickerContainer}>
            <WeekDatePicker
              listOfEventCount={listOfEventCount}
              onDateSelect={handleDateSelect}
            />
          </View>
          <View style={styles.eventContainer}>
            {!isLoading &&
              (listOfEvent.length !== 0 ? (
                <EventTimeline data={groupEvents(listOfEvent)} height={200} />
              ) : (
                <View style={styles.eventPlaceHolder}>
                  <Text style={styles.eventNotFound}>
                    Ngày đang chọn không có sự kiện gì
                  </Text>
                  <TouchableOpacity
                    style={styles.addTask}
                    onPress={() =>
                      navigation.navigate("CreateEventScreen", {
                        userId: userId,
                      })
                    }
                  >
                    <Text style={styles.addTaskText}>Thêm sự kiện</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
          <View
            style={[
              styles.remindContainer,
              listOfEvent.length === 0 && { marginTop: 40 },
            ]}
          >
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.navigate("EventRemindScreen", {
                  userId: userId,
                  routeBefore: "EventInfoScreen",
                });
              }}
            >
              <Text style={styles.remindText}>Nhắc nhở</Text>
            </TouchableOpacity>
            {listOfRemindEvent.length !== 0 && (
              <Text style={styles.remindNotForgetText}>
                Đừng bỏ lỡ những sự kiện sau vào ngày mai nhé
              </Text>
            )}
          </View>
          {listOfRemindEvent.length !== 0 ? (
            <EventReminder events={listOfRemindEvent} blueTheme height={230} />
          ) : (
            <View style={styles.eventPlaceHolder}>
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "600",
                  fontSize: 18,
                  color: "grey",
                  marginLeft: 10,
                }}
              >
                Không có sự kiện đáng lưu ý vào ngày mai
              </Text>
              <TouchableOpacity
                style={styles.addTask}
                onPress={() =>
                  navigation.navigate("CreateEventScreen", {
                    userId: userId,
                  })
                }
              ></TouchableOpacity>
            </View>
          )}
          {!(
            routeBefore === "familyMemberDetails" && user?.role === "children"
          ) && (
            <ApplyButton
              label="Tạo sự kiện"
              extraStyle={{
                width: 200,
                height: 50,
                marginVertical:
                  listOfRemindEvent.length === 0
                    ? listOfEvent.length === 0
                      ? 150
                      : 90
                    : 35,
              }}
              onPress={() =>
                navigation.navigate("CreateEventScreen", {
                  userId: userId,
                })
              }
            />
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  weekDatePickerContainer: {},
  eventContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  remindContainer: {
    paddingLeft: 30,
  },
  remindText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "700",
  },
  remindNotForgetText: {
    color: "#575A61",
    fontSize: 14,
    fontWeight: "400",
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
});

export default EventInfoScreen;
