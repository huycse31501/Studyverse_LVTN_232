import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import DatePickerBlue from "../../component/shared/DatePickerCalendar";
import TimePicker from "../../component/shared/TimePicker";
import ToggleSwitch from "toggle-switch-react-native";
import { TextInput } from "react-native-gesture-handler";
import ApplyButton from "../../component/shared/ApplyButton";
import BlackBorderTextInputField from "../../component/shared/BlackBorderInputField";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import regexVault from "../../utils/regex";

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
  { label: "Hằng ngày", value: "0" },
  { label: "Hằng tuần", value: "1" },
  { label: "Hằng tháng", value: "2" },
];

const notiOptions: Option[] = [
  { label: "Trước 15 phút", value: "15" },
  { label: "Trước 30 phút", value: "30" },
  { label: "Trước 45 phút", value: "45" },
  { label: "Trước 1 giờ", value: "60" },
];
const CreateEventScreen = ({ route, navigation }: CreateEventScreenProps) => {
  //   const { user, eventRemindList, eventList, routeBefore } = route.params;

  const getCurrentDateFormatted = () => {
    const date = new Date();
    return [
      date.getDate().toString().padStart(2, "0"),
      (date.getMonth() + 1).toString().padStart(2, "0"),
      date.getFullYear(),
    ].join("/");
  };

  const validateValidDate = (checkDate: string) => {
    const [day, month, year] = checkDate.split("/");
    const eventDate = new Date(+year, +month - 1, +day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return false;
    }
    return true;
  };
  const [isEventLoopEnabled, setIsEventLoopEnabled] = useState(false);
  const [isNotiEnabled, setIsNotiEnabled] = useState(false);
  const [selectedLoopValue, setSelectedLoopValue] = useState("");
  const [selectedNotiValue, setSelectedNotiValue] = useState("");

  const [inputs, setInputs] = useState({
    eventName: {
      value: "",
      required: true,
    },
    eventDate: {
      value: getCurrentDateFormatted(),
      required: true,
    },
    eventStartTime: {
      value: "",
      required: true,
    },
    eventEndTime: {
      value: "",
      required: true,
    },
    isLoop: {
      value: "false",
      required: true,
    },
    loopInterval: {
      value: "",
      required: isEventLoopEnabled,
    },
    isNoti: {
      value: undefined,
      required: true,
    },
    notiBefore: {
      value: "",
      required: isNotiEnabled,
    },
    noteText: {
      value: "",
      required: false,
    },
  });

  const [inputValidation, setInputValidation] = useState({
    isEventNameValid: regexVault.preventxssValidate.test(
      inputs.eventName.value
    ),
    isNoteTextValid: regexVault.preventxssValidate.test(inputs.noteText.value),
    isStartDateValid: validateValidDate(inputs.eventDate.value),
  });

  const handleStartTimeChange = (startTime: string) => {
    inputChangedHandler("eventStartTime", startTime);
  };

  const handleEndTimeChange = (endTime: string) => {
    inputChangedHandler("eventEndTime", endTime);
  };

  const setSelectedLoopValueAndInput = (value: string) => {
    setSelectedLoopValue(value);
    inputChangedHandler("loopInterval", value);
  };

  const setSelectedNotiValueAndInput = (value: string) => {
    setSelectedNotiValue(value);
    inputChangedHandler("notiBefore", value);
  };

  useEffect(() => {
    const updatedValidation = {
      isNoteTextValid:
        inputs.noteText.value.length === 0 ||
        regexVault.preventxssValidate.test(inputs.noteText.value),
      isEventNameValid:
        inputs.eventName.value.length === 0 ||
        regexVault.preventxssValidate.test(inputs.eventName.value),
      isStartDateValid: validateValidDate(inputs.eventDate.value),
    };
    setInputValidation(updatedValidation);
  }, [inputs]);

  function inputChangedHandler(
    inputIdentifier: keyof typeof inputs,
    enteredValue: string
  ) {
    setInputs((curInputs) => {
      const currentInput = curInputs[inputIdentifier];

      if (currentInput) {
        return {
          ...curInputs,
          [inputIdentifier]: {
            ...currentInput,
            value: enteredValue,
          },
        };
      }

      return curInputs;
    });
  }

  async function submitHandler() {
    console.log(inputs);
    let allFieldsFilled = true;
    let allFieldsValid = Object.values(inputValidation).every((valid) => valid);

    for (const [key, value] of Object.entries(inputs)) {
      if (value.required && !value.value) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin tạo sự kiện");
    } else if (!allFieldsValid) {
      if (inputValidation.isEventNameValid === false) {
        Alert.alert("Thông báo", "Tên sự kiện không hợp lệ");
      } else if (inputValidation.isNoteTextValid === false) {
        Alert.alert("Thông báo", "Ghi chú sự kiện không hợp lệ");
      } else if (inputValidation.isStartDateValid === false) {
        Alert.alert("Bạn không thể tạo sự kiện trong quá khứ");
      }
    } else {
      setInputs({
        eventName: {
          value: "",
          required: true,
        },
        eventDate: {
          value: "",
          required: true,
        },
        eventStartTime: {
          value: "",
          required: true,
        },
        eventEndTime: {
          value: "",
          required: true,
        },
        isLoop: {
          value: "false",
          required: true,
        },
        loopInterval: {
          value: "",
          required: isEventLoopEnabled,
        },
        isNoti: {
          value: undefined,
          required: true,
        },
        notiBefore: {
          value: "",
          required: isNotiEnabled,
        },
        noteText: {
          value: "",
          required: false,
        },
      });
      setInputValidation({
        isEventNameValid: true,
        isNoteTextValid: true,
        isStartDateValid: true,
      });
    }
  }
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
          </View>
          <Text style={styles.headerText}>Thêm sự kiện</Text>
          <View style={styles.eventNameContainer}>
            <Text style={styles.timePickerText}>Tên sự kiện</Text>
            <BlackBorderTextInputField
              placeHolder="Sự kiện"
              isValid
              value={inputs.eventName.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "eventName"),
              }}
            />
          </View>
          <DatePickerBlue
            onDateSelect={(selectedDate) => {
              inputChangedHandler("eventDate", selectedDate);
            }}
          />
          <Text style={styles.timePickerText}>Chọn khung giờ</Text>
          <View style={{ height: 150 }}>
            <TimePicker
              onStartTimeSelect={handleStartTimeChange}
              onEndTimeSelect={handleEndTimeChange}
            />
          </View>
          <View style={styles.eventLoopContainer}>
            <ToggleSwitch
              isOn={isEventLoopEnabled}
              onColor="#4CD964"
              offColor="#e0dddd"
              size="large"
              onToggle={() => {
                inputChangedHandler("isLoop", String(!isEventLoopEnabled));
                setIsEventLoopEnabled(!isEventLoopEnabled);
              }}
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
                  onPress={() => setSelectedLoopValueAndInput(option.value)}
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
          <View style={styles.eventNotiContainer}>
            <ToggleSwitch
              isOn={isNotiEnabled}
              onColor="#4CD964"
              offColor="#e0dddd"
              size="large"
              onToggle={() => {
                inputChangedHandler("isNoti", String(!isNotiEnabled));
                setIsNotiEnabled(!isNotiEnabled);
              }}
              circleColor={"#FFFFFF"}
            />
            <Text style={styles.eventLoopText}>Nhắc nhở</Text>
          </View>
          {isNotiEnabled && (
            <View style={styles.loopChoiceContainer}>
              {notiOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioButtonContainer}
                  onPress={() => setSelectedNotiValueAndInput(option.value)}
                >
                  <View style={styles.circleContainer}>
                    <View
                      style={[
                        selectedNotiValue === option.value
                          ? styles.checkedCircle
                          : styles.circle,
                        ,
                      ]}
                    />
                    {selectedNotiValue === option.value && (
                      <Image
                        source={require("../../assets/images/shared/checkIcon.png")}
                        style={styles.checkedIcon}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.label,
                      selectedNotiValue === option.value &&
                        styles.selectedLabel,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <Text style={styles.noteText}>Note</Text>
          <View style={styles.textNoticeContainer}>
            <TextInput
              value={inputs.noteText.value}
              onChangeText={(text) => inputChangedHandler("noteText", text)}
              style={styles.noticeInput}
            />
          </View>
          <ApplyButton
            label="Tạo sự kiện"
            extraStyle={{ width: "50%", marginTop: 50, marginBottom: 30 }}
            onPress={submitHandler}
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
  eventNameContainer: {},
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
    marginBottom: 20,
  },
  eventLoopContainer: {
    flexDirection: "row",
    paddingLeft: 30,
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
    paddingTop: 5,
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
  eventNotiContainer: {
    flexDirection: "row",
    paddingLeft: 30,
    marginTop: 30,
  },
  textNoticeContainer: {
    backgroundColor: "#e0e6f0",
    padding: 10,
    borderRadius: 10,
    width: 330,
    height: 80,
    marginTop: 5,
    marginLeft: 30,
  },
  noticeInput: {
    fontSize: 16,
    fontWeight: "500",
    color: "#413636",
  },
  noteText: {
    fontSize: 20,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 30,
    marginBottom: 10,
  },
});

export default CreateEventScreen;
