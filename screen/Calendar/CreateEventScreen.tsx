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
import DatePickerBlue from "../../component/shared/DatePickerCalendar";
import TimePicker from "../../component/shared/TimePicker";
import ToggleSwitch from "toggle-switch-react-native";

type CreateEventRouteProp = RouteProp<RootStackParamList, "CreateEventScreen">;

interface CreateEventScreenProps {
  route: CreateEventRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "FamilyInfoScreen">;
}

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Hằng ngày", value: "daily" },
  { label: "Hằng tuần", value: "weekly" },
  { label: "Hằng tháng", value: "monthly" },
];

const CreateEventScreen = ({ route, navigation }: CreateEventScreenProps) => {
  //   const { user, eventRemindList, eventList, routeBefore } = route.params;
  const [isEventLoopEnabled, setIsEventLoopEnabled] = useState(false);
  const toggleSwitch = () =>
    setIsEventLoopEnabled((previousState) => !previousState);

  const [selectedLoopValue, setSelectedLoopValue] = useState("daily");

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
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
          </View>
          <Text style={styles.headerText}>Thêm sự kiện</Text>
          <DatePickerBlue />
          <Text style={styles.timePickerText}>Chọn khung giờ</Text>
          <View style={{ height: 150 }}>
            <TimePicker />
          </View>
          <View style={styles.eventLoopContainer}>
            <ToggleSwitch
              isOn={isEventLoopEnabled}
              onColor="#4CD964"
              offColor="#e0dddd"
              size="large"
              onToggle={() => setIsEventLoopEnabled(!isEventLoopEnabled)}
              circleColor={"#FFFFFF"}
            />
            <Text style={styles.eventLoopText}>Lặp lại</Text>
          </View>
          {isEventLoopEnabled && (
            <View style={styles.loopChoiceContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedLoopValue(option.value)}
                >
                  <View style={styles.circleContainer}>
                    <View
                      style={[
                        selectedLoopValue === option.value
                          ? styles.checkedCircle
                          : styles.circle,
                        ,
                      ]}
                    />
                    {selectedLoopValue === option.value && (
                      <Image
                        source={require("../../assets/images/shared/checkIcon.png")}
                        style={styles.checkedIcon}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.label,
                      selectedLoopValue === option.value &&
                        styles.selectedLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  headerText: {
    alignSelf: "center",
    color: "#1E293B",
    fontWeight: "bold",
    fontSize: 24,
    marginVertical: 15,
  },
  timePickerText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 10,
    marginBottom: 15,
  },
  eventLoopContainer: {
    flexDirection: "row",
    paddingLeft: 20,
  },
  eventLoopText: {
    alignSelf: "center",
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 25,
  },
  loopChoiceContainer: {
    marginTop: 30,
    marginLeft: 30,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  circle: {
    height: 30,
    width: 30,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkedCircle: {
    height: 30,
    width: 30,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 19,
    color: "#54595E",
    fontWeight: "500",
  },
  selectedLabel: {
    color: "#007AFF",
  },
  circleContainer: {
    flexDirection: "row",
  },
  checkedIcon: {
    position: "absolute",
    width: 15,
    height: 15,
    top: "25%",
    left: "20%",
  },
});

export default CreateEventScreen;
