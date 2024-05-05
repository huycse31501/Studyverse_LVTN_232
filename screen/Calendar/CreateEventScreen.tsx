import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  ActivityIndicator,
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
import Constants from "expo-constants";
import DateInputField from "../../component/signin-signup/DateInputField";
import isDateValid from "../../utils/checkValidDate";
import { formatTime } from "../../utils/timeFormat";
import MemberTagList from "../../component/EventRelated/tagFamilyMember";
import * as Notifications from "expo-notifications";
import { subMinutes } from "date-fns";

type CreateEventRouteProp = RouteProp<RootStackParamList, "CreateEventScreen">;

interface CreateEventScreenProps {
  route: CreateEventRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "CreateEventScreen">;
}

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Hằng ngày", value: "1" },
  { label: "Hằng tuần", value: "2" },
  { label: "Hằng tháng", value: "3" },
];

const notiOptions: Option[] = [
  { label: "Trước 15 phút", value: "15" },
  { label: "Trước 30 phút", value: "30" },
  { label: "Trước 45 phút", value: "45" },
  { label: "Trước 1 giờ", value: "60" },
];

interface Event {
  name: string;
  timeStart: string;
  remindTime: number;
}

async function scheduleNotificationForEvent(event: Event): Promise<void> {
  const eventStartTime = new Date(event.timeStart);
  const notificationTime = subMinutes(eventStartTime, event.remindTime);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Sự kiện sắp diễn ra",
      body: `${event.name} sẽ diễn ra sau ${event.remindTime} phút.`,
    },
    trigger: notificationTime,
  });
}

const CreateEventScreen = ({ route, navigation }: CreateEventScreenProps) => {
  const { userId } = route.params;
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentDateFormatted = () => {
    const date = new Date();
    return [
      date.getDate().toString().padStart(2, "0"),
      (date.getMonth() + 1).toString().padStart(2, "0"),
      date.getFullYear(),
    ].join("/");
  };

  const isEndLoopDateValid = (
    eventDateStr: string,
    endLoopDateStr: string
  ): boolean => {
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    };

    const eventDate = parseDate(eventDateStr);
    const endLoopDate = parseDate(endLoopDateStr);

    const threeMonthsLater = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth() + 3,
      1
    );

    threeMonthsLater.setDate(threeMonthsLater.getDate() - 1);

    return endLoopDate >= eventDate && endLoopDate <= threeMonthsLater;
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

  const currentDateFormatted = useMemo(getCurrentDateFormatted, []);

  const [inputs, setInputs] = useState({
    eventName: {
      value: "",
      required: true,
    },
    eventDate: {
      value: currentDateFormatted,
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
      required: false,
    },
    loopInterval: {
      value: "",
      required: isEventLoopEnabled,
    },
    endLoopDate: {
      value: "",
      required: isEventLoopEnabled,
    },
    isNoti: {
      value: false,
      required: false,
    },
    notiBefore: {
      value: "",
      required: isNotiEnabled,
    },
    noteText: {
      value: "",
      required: false,
    },
    tags: {
      value: "[]",
      required: false,
    },
  });

  const [inputValidation, setInputValidation] = useState({
    isEventNameValid: regexVault.preventxssValidate.test(
      inputs.eventName.value
    ),
    isNoteTextValid: regexVault.preventxssValidate.test(inputs.noteText.value),
    isStartDateValid: validateValidDate(inputs.eventDate.value),
    isEndLoopDateValid: isEventLoopEnabled
      ? isEndLoopDateValid(inputs.eventDate.value, inputs.endLoopDate.value) &&
        regexVault.DOBValidate.test(inputs.endLoopDate.value)
      : true,
  });

  const handleStartTimeChange = (startTime: string) => {
    inputChangedHandler("eventStartTime", formatTime(startTime));
  };

  const handleEndTimeChange = (endTime: string) => {
    inputChangedHandler("eventEndTime", formatTime(endTime));
  };

  const setSelectedLoopValueAndInput = (value: string) => {
    setSelectedLoopValue(value);
    inputChangedHandler("loopInterval", value);
  };

  const setSelectedNotiValueAndInput = (value: string) => {
    setSelectedNotiValue(value);
    inputChangedHandler("notiBefore", value);
  };

  const handleSelectedMembersChange = (selectedMemberIds: number[]) => {
    const selectedMembersString = `[${selectedMemberIds.join(",")}]`;

    setInputs((currentInputs) => ({
      ...currentInputs,
      tags: {
        ...currentInputs.tags,
        value: selectedMembersString,
      },
    }));
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
      isEndLoopDateValid: isEventLoopEnabled
        ? isEndLoopDateValid(
            inputs.eventDate.value,
            inputs.endLoopDate.value
          ) && regexVault.DOBValidate.test(inputs.endLoopDate.value)
        : true,
    };
    setInputValidation(updatedValidation);
  }, [
    inputs.eventName.value,
    inputs.noteText.value,
    inputs.eventDate.value,
    inputs.endLoopDate.value,
    isEventLoopEnabled,
  ]);

  const inputChangedHandler = useCallback(
    (inputIdentifier: keyof typeof inputs, enteredValue: string) => {
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
    },
    []
  );

  const resetInputs = () => {
    setIsEventLoopEnabled(false);
    setIsNotiEnabled(false);
    setSelectedLoopValue("");
    setSelectedNotiValue("");

    setInputs({
      eventName: {
        value: "",
        required: true,
      },
      eventDate: {
        value: currentDateFormatted,
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
        required: false,
      },
      loopInterval: {
        value: "",
        required: isEventLoopEnabled,
      },
      endLoopDate: {
        value: "",
        required: isEventLoopEnabled,
      },
      isNoti: {
        value: false,
        required: false,
      },
      notiBefore: {
        value: "",
        required: isNotiEnabled,
      },
      noteText: {
        value: "",
        required: false,
      },
      tags: {
        value: "[]",
        required: false,
      },
    });
  };

  async function submitHandler() {

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
      } else if (!inputValidation.isEndLoopDateValid) {
        Alert.alert(
          "Thông báo",
          "Ngày kết thúc lặp phải nằm trong khoảng thời gian từ ngày sự kiện đến 3 tháng sau"
        );
      }
    } else {
      let requestCreateEventURL = `https://${host}/event/createEvent`;

      try {
        setIsLoading(true);
        const response = await fetch(requestCreateEventURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputs.eventName.value,
            day: inputs.eventDate.value,
            timeStart: inputs.eventStartTime.value,
            timeEnd: inputs.eventEndTime.value,
            loopMode:
              inputs.isLoop.value === "true" ? inputs.loopInterval.value : "0",
            endDate: inputs.endLoopDate.value,
            isRemind: inputs.isNoti.value,
            remindTime: inputs.notiBefore.value,
            note: inputs.noteText.value,
            userId: userId,
            tagUsers: inputs.tags.value,
          }),
        });

        const data = await response.json();
        if (data.msg == "1") {
          if (inputs.isNoti.value) {
            const event: Event = {
              name: inputs.eventName.value,
              timeStart: inputs.eventStartTime.value,
              remindTime: parseInt(inputs.notiBefore.value, 10),
            };
            await scheduleNotificationForEvent(event);
          }

          setIsLoading(false);
          resetInputs();
          navigation.navigate("EventInfoScreen", {
            userId: Number(userId),
            routeBefore: "createEvent",
            newEventCreated: true,
          });
        } else {
          setIsLoading(false);
          Alert.alert("Thất bại", "Tạo sự kiện thất bại");
        }
      } catch (e) {
        setIsLoading(false);
        Alert.alert(`Tạo sự kiện thất bại`);
      }
    }
  }
  const insets = useSafeAreaInsets();
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
                onPress={() => {
                  resetInputs();
                  navigation.navigate("StatusDashboard");
                }}
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

          <Text style={styles.timePickerText}>Chọn khung giờ</Text>
          <View style={{ height: 150 }}>
            <TimePicker
              onStartTimeSelect={handleStartTimeChange}
              onEndTimeSelect={handleEndTimeChange}
            />
          </View>

          <DatePickerBlue
            onDateSelect={(selectedDate) => {
              inputChangedHandler("eventDate", selectedDate);
            }}
          />
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
              <View style={styles.endLoopContainer}>
                <DateInputField
                  required
                  isValid
                  placeHolder="Ngày kết thúc lặp"
                  dateStr={inputs.endLoopDate.value}
                  textInputConfig={{
                    onChangeText: inputChangedHandler.bind(this, "endLoopDate"),
                  }}
                />
              </View>
            </View>
          )}
          <View style={styles.eventNotiContainer}>
            <ToggleSwitch
              isOn={isNotiEnabled}
              onColor="#4CD964"
              offColor="#e0dddd"
              size="large"
              onToggle={() => {
                inputChangedHandler(
                  "isNoti",
                  !isNotiEnabled ? "true" : "false"
                );
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
          <Text style={styles.noteText}>Những người liên quan đến sự kiện</Text>
          <View style={styles.memberChoiceContainer}>
            <MemberTagList
              isEvent
              onSelectedMembersChange={handleSelectedMembersChange}
            />
          </View>
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0b0b0d" />
        </View>
      )}
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
    marginTop: 20,
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
  loadingContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  endLoopContainer: {
    width: "85%",
    marginVertical: 20,
  },
  memberChoiceContainer: {
    paddingLeft: 25,
  },
});

export default CreateEventScreen;
