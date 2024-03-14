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
  TouchableWithoutFeedback,
  Modal,
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

type EventRemindProp = RouteProp<RootStackParamList, "EventRemindScreen">;

interface EventRemindScreenProps {
  route: EventRemindProp;
  navigation: StackNavigationProp<RootStackParamList, "EventRemindScreen">;
}
const EventRemindScreen = ({ route, navigation }: EventRemindScreenProps) => {
  //   const { user, eventRemindList, eventList, routeBefore } = route.params;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [curEventChange, setCurEventChange] = useState<EventProps>();

  const [confirmCancelModalVisible, setConfirmCancelModalVisible] =
    useState(false);

  const handleEventPress = (item: EventProps) => {
    setCurEventChange(item);
    setConfirmCancelModalVisible(true);
  };

  const handleCancelButton = () => {
    console.log(curEventChange);
    setConfirmCancelModalVisible(false);
  };
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
            <WeekDatePicker remind onDateSelect={handleDateSelect} />
          </View>
          <EventReminder
            events={mockEventReminder}
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
                  label="XÁC NHẬN"
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
