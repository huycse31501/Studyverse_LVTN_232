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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { formatTime } from "../../utils/timeFormat";
import Constants from "expo-constants";
import MemberTagList from "../../component/EventRelated/tagFamilyMember";

type EditEventRouteProp = RouteProp<RootStackParamList, "EditEventScreen">;

interface EditEventScreenProps {
  route: EditEventRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "FamilyInfoScreen">;
}

type Option = {
  label: string;
  value: string;
};

const notiOptions: Option[] = [
  { label: "Trước 15 phút", value: "15" },
  { label: "Trước 30 phút", value: "30" },
  { label: "Trước 45 phút", value: "45" },
  { label: "Trước 1 giờ", value: "60" },
];

const EditEventScreen = ({ route, navigation }: EditEventScreenProps) => {
  const { eventInfo, userId, routeBefore, fromFooter } = route?.params;
  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const memberToRender = totalList.filter(
    (user) => user.userId === String(userId)
  )[0];
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const [isLoading, setIsLoading] = useState(false);
  const [isEventLoopEnabled, setIsEventLoopEnabled] = useState(
    eventInfo.isLoop
  );
  const [isNotiEnabled, setIsNotiEnabled] = useState(
    eventInfo.remindTime !== 0
  );
  const [selectedNotiValue, setSelectedNotiValue] = useState(eventInfo.note);
  const [deleteMode, setDeleteMode] = useState(false);

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

  const [inputs, setInputs] = useState({
    eventName: {
      value: eventInfo.name,
      required: true,
    },
    eventDate: {
      value: eventInfo.startDate,
      required: true,
    },
    eventStartTime: {
      value: eventInfo.startTime,
      required: true,
    },
    eventEndTime: {
      value: eventInfo.endTime,
      required: true,
    },
    isLoop: {
      value: String(eventInfo.isLoop),
      required: false,
    },

    isNoti: {
      value: eventInfo.remindTime !== 0,
      required: false,
    },
    notiBefore: {
      value: eventInfo.remindTime,
      required: isNotiEnabled,
    },
    noteText: {
      value: eventInfo.note,
      required: false,
    },
    tags: {
      value: String(eventInfo.tagsToEdit),
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
    inputChangedHandler("eventStartTime", formatTime(startTime));
  };

  const handleEndTimeChange = (endTime: string) => {
    inputChangedHandler("eventEndTime", formatTime(endTime));
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
    };
    setInputValidation(updatedValidation);
  }, [
    inputs.eventName.value,
    inputs.noteText.value,
    inputs.eventDate.value,
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
    setInputs({
      eventName: {
        value: eventInfo.name,
        required: true,
      },
      eventDate: {
        value: eventInfo.startDate,
        required: true,
      },
      eventStartTime: {
        value: eventInfo.startTime,
        required: true,
      },
      eventEndTime: {
        value: eventInfo.endTime,
        required: true,
      },
      isLoop: {
        value: String(eventInfo.isLoop),
        required: false,
      },

      isNoti: {
        value: eventInfo.remindTime !== 0,
        required: false,
      },
      notiBefore: {
        value: eventInfo.remindTime,
        required: isNotiEnabled,
      },
      noteText: {
        value: eventInfo.note,
        required: false,
      },
      tags: {
        value: String(eventInfo.tagsToEdit),
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
      }
    } else {
      let requestCreateEventURL = `http://${host}:${port}/event/${eventInfo.id}`;

      try {
        const response = await fetch(requestCreateEventURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputs.eventName.value,
            date: inputs.eventDate.value,
            timeStart: inputs.eventStartTime.value,
            timeEnd: inputs.eventEndTime.value,
            isRemind: inputs.isNoti.value,
            remindTime: inputs.notiBefore.value,
            note: inputs.noteText.value,
            userId: userId,
            tagUsers: inputs.tags.value,
            isLoop: deleteMode,
          }),
        });

        const data = await response.json();
        if (data.msg == "1") {
          setIsLoading(false);
          resetInputs();
          if (routeBefore === "StatusDashboard" && fromFooter !== "1") {
            navigation.navigate("StatusDashboard");
          } else {
            navigation.navigate("EventInfoScreen", {
              userId: userId,
              routeBefore: routeBefore,
              newEventCreated: true,
            });
          }
        } else {
          setIsLoading(false);
          Alert.alert("Thất bại", "Chỉnh sửa sự kiện thất bại");
        }
      } catch (e) {
        setIsLoading(false);
        Alert.alert(`Chỉnh sửa sự kiện thất bại`);
      }
    }
  }

  async function submitCancelHandler() {
    let requestCreateEventURL = `http://${host}:${port}/event/${eventInfo.id}`;

    try {
      const response = await fetch(requestCreateEventURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deleteLoop: deleteMode,
        }),
      });

      const data = await response.json();
      if (data.msg == "1") {
        setIsLoading(false);
        resetInputs();
        if (routeBefore === "StatusDashboard" && fromFooter !== "1") {
          navigation.navigate("StatusDashboard");
        } else {
          navigation.navigate("EventInfoScreen", {
            userId: userId,
            routeBefore: routeBefore,
            newEventCreated: true,
          });
        }
      } else {
        setIsLoading(false);
        Alert.alert("Thất bại", "Xóa sự kiện thất bại");
      }
    } catch (e) {
      setIsLoading(false);
      Alert.alert(`Xóa sự kiện thất bại`);
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
                  if (routeBefore === "StatusDashboard" && fromFooter !== "1") {
                    navigation.navigate("StatusDashboard");
                  } else {
                    navigation.navigate("EventInfoScreen", {
                      userId: userId,
                      routeBefore: routeBefore,
                      newEventCreated: true,
                    });
                  }
                }}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerText}>Thông tin sự kiện</Text>
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

          {eventInfo?.isLoop ? (
            <>
              <View style={styles.eventLoopInfoContainer}>
                <Text style={styles.eventLoopInfoText}>
                  Đây là sự kiện có lặp lại nên bạn không thể thay đổi ngày và
                  giờ diễn ra
                </Text>
              </View>
            </>
          ) : (
            <>
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
            </>
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
              excludeId={userId}
              onSelectedMembersChange={handleSelectedMembersChange}
              defaultValue={eventInfo.tagsToEdit}
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
          {eventInfo?.isLoop && (
            <>
              <View style={styles.applyToAllContainer}>
                <ToggleSwitch
                  isOn={deleteMode}
                  onColor="#4CD964"
                  offColor="#e0dddd"
                  size="large"
                  onToggle={() => {
                    setDeleteMode(!deleteMode);
                  }}
                  circleColor={"#FFFFFF"}
                />
                <Text style={styles.eventLoopText}>Thay đổi toàn bộ</Text>
              </View>
              <View style={styles.eventLoopInfoApplyContainer}>
                <Text style={styles.eventLoopInfoText}>
                  Áp dụng lựa chọn trên có thể thay đổi thông tin toàn bộ những
                  sự kiện lặp trong lịch
                </Text>
              </View>
            </>
          )}
          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              flexDirection: "row",
              marginHorizontal: 30,
            }}
          >
            <ApplyButton
              label="Lưu sự kiện"
              extraStyle={{
                width: "45%",
                marginRight: 10,
              }}
              onPress={submitHandler}
            />
            <ApplyButton
              label="Xóa sự kiện"
              extraStyle={{
                width: "45%",
                marginLeft: 10,
                backgroundColor: "#F9F9F9",
                borderWidth: 2,
                borderRadius: 30,
                borderColor: "#0e0d0d7a",
              }}
              extraTextStyle={{
                color: "#2c2929",
              }}
              onPress={submitCancelHandler}
            />
          </View>
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
  eventLoopText: {
    alignSelf: "center",
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 25,
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
  eventLoopInfoContainer: {
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 25,
  },
  eventLoopInfoText: {
    alignSelf: "center",
    fontSize: 18,
    color: "#FF2D58",
    fontWeight: "500",
  },
  loopChoiceContainer: {
    marginTop: 30,
    marginLeft: 30,
  },
  memberChoiceContainer: {
    paddingLeft: 25,
  },
  applyToAllContainer: {
    flexDirection: "row",
    paddingLeft: 30,
    marginTop: 35,
  },
  eventLoopInfoApplyContainer: {
    paddingLeft: 20,
    marginTop: 25,
  },
});

export default EditEventScreen;
