import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
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

type EventInfoRouteProp = RouteProp<RootStackParamList, "EventInfoScreen">;

interface EventInfoScreenProps {
  route: EventInfoRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "FamilyInfoScreen">;
}
const EventInfoScreen = ({ route, navigation }: EventInfoScreenProps) => {
  //   const { user, eventRemindList, eventList, routeBefore } = route.params;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log(date);
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
                // onPress={() => navigation.navigate("Setting")}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../assets/images/dashboard/avatar.png")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.weekDatePickerContainer}>
            <WeekDatePicker onDateSelect={handleDateSelect}/>
          </View>
          <View style={styles.eventContainer}>
            <EventTimeline data={eventSampleData} height={200} />
          </View>
          <View style={styles.remindContainer}>
            <Text style={styles.remindText}>Nhắc nhở</Text>
            <Text style={styles.remindNotForgetText}>
              Đừng bỏ lỡ những sự kiện sau vào ngày mai nhé
            </Text>
          </View>
          <EventReminder events={mockEventReminder} blueTheme height={230} />
          <ApplyButton
            label="Tạo sự kiện"
            extraStyle={{ width: 200, height: 50 }}
          />
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
    paddingBottom: 5,
  },
  remindNotForgetText: {
    color: "#575A61",
    fontSize: 14,
    fontWeight: "400",
  },
});

export default EventInfoScreen;
