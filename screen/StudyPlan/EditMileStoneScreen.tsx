import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from "react-native";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import regexVault from "../../utils/regex";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlackBorderTextInputField from "../../component/shared/BlackBorderInputField";
import DateInputField from "../../component/signin-signup/DateInputField";
import MemberTagList from "../../component/EventRelated/tagFamilyMember";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import SelectBox from "react-native-multi-selectbox-typescript";
import Tag, { listOfTags } from "../../component/shared/Tags";
import TagToSelect from "../../component/shared/TagsToSelect";
import ApplyButton from "../../component/shared/ApplyButton";
import ToggleSwitch from "toggle-switch-react-native";
import Constants from "expo-constants";
import { isEqual } from "lodash";
import ExamToLinkMilestoneList from "../../component/studyPlanRelated/examToLinkList";
import { formatDate } from "../../utils/formatDate";
import { translateSubject } from "../../utils/subjectTranslator";

type EditMilestoneRouteProp = RouteProp<
  RootStackParamList,
  "EditMilestoneScreen"
>;

interface EditMilestoneScreenProps {
  route: EditMilestoneRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "EditMilestoneScreen">;
}
const validateValidStartDate = (checkDate: string) => {
  const [day, month, year] = checkDate.split("/");
  const MilestoneStartDate = new Date(+year, +month - 1, +day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (MilestoneStartDate < today) {
    return false;
  }
  return true;
};

const validateValidEndDate = (startDate: string, endDate: string) => {
  const start = startDate.split("/").map(Number);
  const end = endDate.split("/").map(Number);
  const MilestoneStartDate = new Date(start[2], start[1] - 1, start[0]);
  const MilestoneEndDate = new Date(end[2], end[1] - 1, end[0]);

  MilestoneStartDate.setHours(0, 0, 0, 0);
  MilestoneEndDate.setHours(0, 0, 0, 0);

  return MilestoneEndDate > MilestoneStartDate;
};

const EditMilestoneScreen = ({
  route,
  navigation,
}: EditMilestoneScreenProps) => {
  const { userId, studyPackage, index, currentMilestone } = route.params;
  let host = Constants?.expoConfig?.extra?.host;
  let port = Constants?.expoConfig?.extra?.port;
  const user = useSelector((state: RootState) => state.user.user);

  const [inputs, setInputs] = useState({
    MilestoneName: {
      value: currentMilestone.name,
      required: true,
    },
    MilestoneStartDate: {
      value: formatDate(currentMilestone.startDate),
      required: true,
    },
    MilestoneEndDate: {
      value: formatDate(currentMilestone.endDate),
      required: true,
    },
    noteContent: {
      value: currentMilestone.content,
      required: false,
    },
  });

  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );

  const [isLinkExam, setIsLinkExam] = useState(currentMilestone.test !== null);
  const [examData, setExamData] = useState();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(
    currentMilestone.test !== null ? currentMilestone.test.id : null
  );
  const handleExamSelect = (examId: number) => {
    setSelectedExamId(examId);
  };
  useEffect(() => {
    const requestExamList = async () => {
      let requestExamURL = `https://${host}/test/${user?.familyId}`;
      try {
        const response = await fetch(requestExamURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!isEqual(data, examData)) {
          setExamData(
            data?.[userId]
              ?.filter((exam: any) => {
                return exam.submissions.length === 0;
              })
              .map((exam: any) => {
                return {
                  name: exam.name,
                  examId: exam.id,
                };
              }) ?? []
          );
        }
      } catch (e) {
        console.error("Error fetching events:", e);
      }
    };
    requestExamList();
  }, [host, userId]);
  const [inputValidation, setInputValidation] = useState({
    isMilestoneStartDateValid: validateValidStartDate(
      inputs.MilestoneStartDate.value
    ),
    isMilestoneEndDateValid: validateValidEndDate(
      inputs.MilestoneStartDate.value,
      inputs.MilestoneEndDate.value
    ),
  });

  useEffect(() => {
    const updatedValidation = {
      isMilestoneStartDateValid: validateValidStartDate(
        inputs.MilestoneStartDate.value
      ),
      isMilestoneEndDateValid: validateValidEndDate(
        inputs.MilestoneStartDate.value,
        inputs.MilestoneEndDate.value
      ),
    };

    setInputValidation(updatedValidation);
  }, [inputs.MilestoneStartDate.value, inputs.MilestoneEndDate.value]);

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
    [inputs]
  );

  const resetInputs = () => {
    setInputs({
      MilestoneName: {
        value: "",
        required: true,
      },
      MilestoneStartDate: {
        value: "",
        required: true,
      },
      MilestoneEndDate: {
        value: "",
        required: true,
      },
      noteContent: {
        value: "",
        required: false,
      },
    });
  };

  const continueHandle = async () => {
    let allFieldsFilled = true;
    let allFieldsValid = Object.values(inputValidation).every((valid) => valid);

    for (const [key, value] of Object.entries(inputs)) {
      if (value.required && !value.value) {
        allFieldsFilled = false;
        break;
      }
    }

    if (!allFieldsFilled) {
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin bắt buộc");
    } else if (!allFieldsValid) {
      if (!inputValidation.isMilestoneStartDateValid) {
        Alert.alert(
          "Lỗi",
          "Bạn không thể chỉnh sửa cột mốc học tập trong quá khứ"
        );
      } else if (!inputValidation.isMilestoneEndDateValid) {
        Alert.alert("Lỗi", "Ngày kết thúc phải sau ngày bắt đầu");
      }
    } else {
      const updatedMilestone = {
        id: currentMilestone.id,
        name: inputs.MilestoneName.value,
        startDate: inputs.MilestoneStartDate.value,
        endDate: inputs.MilestoneEndDate.value,
        content: inputs.noteContent.value,
        test: isLinkExam ? { id: selectedExamId } : null,
        pass: currentMilestone.pass,
      };

      const updatedStudyPackage = {
        ...studyPackage,
        courseInfo: studyPackage.courseInfo.map((course: any) => {
          if (course.id === studyPackage.courseInfo[index].id) {
            return {
              ...course,
              milestones: course.milestones.map((milestone: any) => {
                if (milestone.id === currentMilestone.id) {
                  return updatedMilestone;
                }
                return milestone;
              }),
            };
          }
          return course;
        }),
      };
      let requestEditilestoneURL = `https://${host}/milestone/${currentMilestone.id}`;

      try {
        const response = await fetch(requestEditilestoneURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputs.MilestoneName.value,
            startDate: inputs.MilestoneStartDate.value,
            endDate: inputs.MilestoneEndDate.value,
            content: inputs.noteContent.value,
            testId: isLinkExam ? selectedExamId : null,
          }),
        });
        const data = await response.json();
        console.log(
          requestEditilestoneURL,
          data,
          JSON.stringify({
            name: inputs.MilestoneName.value,
            startDate: inputs.MilestoneStartDate.value,
            endDate: inputs.MilestoneEndDate.value,
            content: inputs.noteContent.value,
            testId: isLinkExam ? selectedExamId : null,
          })
        );
        if (data.msg == "1") {
          navigation.navigate("ViewStudyPlansScreen", {
            userId: userId,
            studyPackage: updatedStudyPackage,
            index: index,
          });
        } else {
          Alert.alert("Thất bại", "Chỉnh sửa cột mốc thất bại");
        }
      } catch (e) {
        Alert.alert(`Chỉnh sửa cột mốc thất bại`);
      }
    }
  };

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
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                resetInputs();
                navigation.navigate("ViewStudyPlansScreen", {
                  userId: userId,
                  studyPackage: studyPackage,
                  index: index,
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>
            {user?.role === "parent"
              ? isEnglishEnabled
                ? `Edit milestone`
                : `Chỉnh sửa cột mốc`
              : isEnglishEnabled
              ? `View milestone`
              : `Thông tin cột mốc`}
          </Text>
          <View>
            <Text style={styles.inputTitleText}>
              {isEnglishEnabled ? "Milestone's name" : "Tên cột mốc"}
            </Text>
            <BlackBorderTextInputField
              placeHolder={isEnglishEnabled ? "Milestone" : "Cột mốc học tập"}
              isValid
              required
              value={inputs.MilestoneName.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "MilestoneName"),
              }}
            />
          </View>
          <View>
            <Text style={styles.inputTitleText}>{isEnglishEnabled ? "Subject" : "Môn học"}</Text>
            <BlackBorderTextInputField
              placeHolder=""
              isValid
              value={isEnglishEnabled ? translateSubject(studyPackage?.coursename) : studyPackage?.courseName}
              textInputConfig={{
                editable: false,
              }}
            />
          </View>
          <Text
            style={[
              styles.inputTitleText,
              {
                marginBottom: 5,
              },
            ]}
          >
            {isEnglishEnabled ? "Milestone's start time" : "Thời gian bắt đầu cột mốc"}
          </Text>
          <View style={styles.MilestoneDateContainer}>
            <DateInputField
              required
              isValid
              placeHolder={isEnglishEnabled ? "Start time" : "Ngày bắt đầu"}
              dateStr={inputs.MilestoneStartDate.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(
                  this,
                  "MilestoneStartDate"
                ),
              }}
            />
          </View>
          <Text
            style={[
              styles.inputTitleText,
              {
                marginBottom: 5,
              },
            ]}
          >
            {isEnglishEnabled ? "Milestone's end time" : "Thời gian kết thúc cột mốc"}
          </Text>
          <View style={styles.MilestoneDateContainer}>
            <DateInputField
              required
              isValid
              placeHolder={isEnglishEnabled ? "End date" : "Ngày kết thúc"}
              dateStr={inputs.MilestoneEndDate.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(
                  this,
                  "MilestoneEndDate"
                ),
              }}
            />
          </View>
          <Text style={styles.inputTitleText}>{isEnglishEnabled ? "Note" : "Nội dung cột mốc"}</Text>

          <View style={styles.textNoticeContainer}>
            <TextInput
              value={inputs?.noteContent?.value || ""}
              onChangeText={inputChangedHandler.bind(this, "noteContent")}
              style={styles.noticeInput}
              placeholder={isEnglishEnabled ? "Note" : "Điền nội dung cột mốc"}
            />
          </View>

          {currentMilestone.pass === false && (
            <View style={styles.linkTextContainer}>
              <Text style={styles.inputTitleText}>{isEnglishEnabled ? "Link to an exam" : "Liên kết bài kiểm tra"}</Text>

              <View style={styles.toggleContainer}>
                <ToggleSwitch
                  isOn={isLinkExam}
                  onColor="#4CD964"
                  offColor="#e0dddd"
                  size="large"
                  onToggle={() => {
                    setIsLinkExam(!isLinkExam);
                  }}
                  circleColor={"#FFFFFF"}
                />
              </View>
            </View>
          )}
          {isLinkExam && (
            <ExamToLinkMilestoneList
              ExamToLinkMilestones={examData || []}
              onExamToLinkMilestoneItemPress={handleExamSelect}
              selectedExamId={selectedExamId}
            />
          )}
          {user?.role === "parent" && (
            <View style={styles.nextButtonContainer}>
              <ApplyButton label={isEnglishEnabled ? "Edit" : "Cập nhật"} onPress={continueHandle} />
            </View>
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: "row",
    backgroundColor: "#9cef76",
    height: 150,
  },
  headerContainer: {
    width: "100%",
  },
  svgCurve: {
    position: "absolute",
    width: "100%",
  },
  backButton: {
    marginTop: "6%",
    marginLeft: "7.5%",
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF2D55",
  },
  headerText: {
    alignSelf: "center",
    color: "#1E293B",
    fontWeight: "bold",
    fontSize: 24,
    marginVertical: 15,
  },
  inputTitleText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  MilestoneDateContainer: {
    width: "85%",
    marginLeft: "6.5%",
    marginVertical: 10,
  },
  noteText: {
    fontSize: 20,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 30,
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 5,
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  nextButtonContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
  textNoticeContainer: {
    backgroundColor: "#e0e6f0",
    borderRadius: 10,
    padding: 15,
    width: 330,
    height: 150,
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  noticeInput: {
    fontSize: 18,
    fontWeight: "500",
    color: "#413636",
    marginTop: 10,
    alignSelf: "center",
    width: "100%",
    height: "100%",
    textAlignVertical: "top",
  },
  linkTextContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  toggleContainer: {
    marginHorizontal: 20,
    alignSelf: "center",
    top: -5,
  },
});
export default EditMilestoneScreen;
