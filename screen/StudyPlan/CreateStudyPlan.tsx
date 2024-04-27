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
  Image,
  ActivityIndicator,
} from "react-native";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp } from "@react-navigation/native";
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
import MilestoneList from "../../component/studyPlanRelated/mileStoneRoadMap";
import {
  convertSubjectToId,
  convertSubjectsToIds,
} from "../../component/shared/constants/convertSubjectToId";
import Constants from "expo-constants";

type CreateStudyPlanRouteProp = RouteProp<
  RootStackParamList,
  "CreateStudyPlanScreen"
>;

interface CreateStudyPlanScreenProps {
  route: CreateStudyPlanRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "CreateStudyPlanScreen">;
}
const validateValidStartDate = (checkDate: string) => {
  const [day, month, year] = checkDate.split("/");
  const studyPlanStartDate = new Date(+year, +month - 1, +day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (studyPlanStartDate < today) {
    return false;
  }
  return true;
};

const validateValidEndDate = (startDate: string, endDate: string) => {
  const start = startDate.split("/").map(Number);
  const end = endDate.split("/").map(Number);
  const studyPlanStartDate = new Date(start[2], start[1] - 1, start[0]);
  const studyPlanEndDate = new Date(end[2], end[1] - 1, end[0]);

  studyPlanStartDate.setHours(0, 0, 0, 0);
  studyPlanEndDate.setHours(0, 0, 0, 0);

  return studyPlanEndDate > studyPlanStartDate;
};
let host = Constants?.expoConfig?.extra?.host;

const CreateStudyPlanScreen = ({
  route,
  navigation,
}: CreateStudyPlanScreenProps) => {
  const { userId, studyPackage } = route.params;

  const [inputs, setInputs] = useState({
    studyPlanName: {
      value: "",
      required: true,
    },
    studyPlanStartDate: {
      value: "",
      required: true,
    },
    studyPlanEndDate: {
      value: "",
      required: true,
    },
    tagsUser: {
      value: "[]",
      required: true,
    },
  });

  const [milestones, setMilestones] = useState(studyPackage?.milestones || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (studyPackage?.milestones) {
      setMilestones(studyPackage.milestones);
    }
  }, [studyPackage]);
  const deleteMilestone = (index: number) => {
    const newMilestones = milestones.filter((_: any, i: any) => i !== index);
    setMilestones(newMilestones);
  };

  const shiftLeft = (index: number) => {
    if (index > 0) {
      const newMilestones = [...milestones];
      [newMilestones[index], newMilestones[index - 1]] = [
        newMilestones[index - 1],
        newMilestones[index],
      ];
      setMilestones(newMilestones);
    }
  };

  const shiftRight = (index: number) => {
    if (index < milestones.length - 1) {
      const newMilestones = [...milestones];
      [newMilestones[index], newMilestones[index + 1]] = [
        newMilestones[index + 1],
        newMilestones[index],
      ];
      setMilestones(newMilestones);
    }
  };

  const [inputValidation, setInputValidation] = useState({
    isStudyPlanStartDateValid: validateValidStartDate(
      inputs.studyPlanStartDate.value
    ),
    isStudyPlanEndDateValid: validateValidEndDate(
      inputs.studyPlanStartDate.value,
      inputs.studyPlanEndDate.value
    ),
  });

  useEffect(() => {
    const updatedValidation = {
      isStudyPlanStartDateValid: validateValidStartDate(
        inputs.studyPlanStartDate.value
      ),
      isStudyPlanEndDateValid: validateValidEndDate(
        inputs.studyPlanStartDate.value,
        inputs.studyPlanEndDate.value
      ),
    };

    setInputValidation(updatedValidation);
  }, [inputs.studyPlanStartDate.value, inputs.studyPlanEndDate.value]);

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
      studyPlanName: {
        value: "",
        required: true,
      },
      studyPlanStartDate: {
        value: "",
        required: true,
      },
      studyPlanEndDate: {
        value: "",
        required: true,
      },
      tagsUser: {
        value: "[]",
        required: true,
      },
    });
  };
  const handleSelectedMembersChange = (selectedMemberIds: number[]) => {
    const selectedMembersString = `[${selectedMemberIds.join(",")}]`;

    setInputs((currentInputs) => ({
      ...currentInputs,
      tagsUser: {
        ...currentInputs.tagsUser,
        value: selectedMembersString,
      },
    }));
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
      Alert.alert("Thông báo", "Bạn cần nhập đủ thông tin bắt buộc");
    } else if (!allFieldsValid) {
      if (inputValidation.isStudyPlanStartDateValid === false) {
        Alert.alert("Bạn không thể tạo kế hoạch học tập trong quá khứ");
      } else if (inputValidation.isStudyPlanEndDateValid === false) {
        Alert.alert("Bạn không thể tạo kế hoạch học tập trong quá khứ");
      }
    } else {
      let requestCreateTestURL = `https://${host}/studyPlan/create`;

      try {
        const response = await fetch(requestCreateTestURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inputs.studyPlanName.value,
            startDate: inputs.studyPlanStartDate.value,
            endDate: inputs.studyPlanEndDate.value,
            subjectId: convertSubjectToId[studyPackage?.courseName],
            childrenIds: inputs.tagsUser.value,
            milestones: milestones,
          }),
        });
        const data = await response.json();
        if (data.msg == "1") {
          setIsLoading(false);
          navigation.navigate("StudyPlanInfoScreen", {
            userId: Number(userId),
            routeBefore: "CreateStudyPlanScreen",
            newPlanCreated: true,
          });
        } else {
          setIsLoading(false);
          Alert.alert("Thất bại", "Tạo kế hoạch thất bại");
        }
      } catch (e) {
        setIsLoading(false);
        Alert.alert(`Tạo kế hoạch thất bại`);
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
                navigation.navigate("StudyPlanInfoScreen", {
                  userId: Number(userId),
                  routeBefore: "StatusDashboard",
                  fromFooter: "1",
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Tạo kế hoạch mới</Text>
          <View>
            <Text style={styles.inputTitleText}>Tên kế hoạch</Text>
            <BlackBorderTextInputField
              placeHolder="Kế hoạch học tập"
              isValid
              required
              value={inputs.studyPlanName.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "studyPlanName"),
              }}
            />
          </View>
          <View>
            <Text style={styles.inputTitleText}>Môn học</Text>
            <BlackBorderTextInputField
              placeHolder=""
              isValid
              value={studyPackage?.courseName}
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
            Thời gian bắt đầu kế hoạch
          </Text>
          <View style={styles.studyPlanDateContainer}>
            <DateInputField
              required
              isValid
              placeHolder="Ngày bắt đầu"
              dateStr={inputs.studyPlanStartDate.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(
                  this,
                  "studyPlanStartDate"
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
            Thời gian kết thúc kế hoạch
          </Text>
          <View style={styles.studyPlanDateContainer}>
            <DateInputField
              required
              isValid
              placeHolder="Ngày kết thúc"
              dateStr={inputs.studyPlanEndDate.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(
                  this,
                  "studyPlanEndDate"
                ),
              }}
            />
          </View>
          <Text style={styles.noteText}>Thành viên tham gia kế hoạch</Text>

          <View style={styles.memberChoiceContainer}>
            <MemberTagList
              onSelectedMembersChange={handleSelectedMembersChange}
            />
          </View>

          {inputs.tagsUser.value !== "[]" && (
            <>
              <Text style={styles.noteText}>Tạo cột mốc học tập</Text>

              <View style={styles.mileStoneContainer}>
                <MilestoneList
                  studyPackage={{
                    ...studyPackage,
                    milestones,
                  }}
                  deleteMilestone={deleteMilestone}
                  shiftLeft={shiftLeft}
                  shiftRight={shiftRight}
                  isCreated
                />
              </View>
              <TouchableOpacity
                style={styles.addMileStoneContainer}
                onPress={() => {
                  navigation.navigate("CreateMilestoneScreen", {
                    studyPackage: studyPackage,
                    tagUser: inputs.tagsUser.value,
                    userId: userId
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/studyPlan/addMileStone.png")}
                  style={styles.addLogo}
                />
              </TouchableOpacity>
            </>
          )}
          <View style={styles.nextButtonContainer}>
            <ApplyButton label="Tạo kế hoạch" onPress={continueHandle} />
          </View>
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
  studyPlanDateContainer: {
    width: "85%",
    marginLeft: "6.5%",
    marginVertical: 10,
  },
  memberChoiceContainer: {
    paddingLeft: 25,
    marginTop: 10,
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
    marginTop: 50,
    marginBottom: 50,
  },
  mileStoneContainer: {
    marginTop: 30,
  },
  addMileStoneContainer: {
    marginRight: 70,
  },
  addLogo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginLeft: 60,
    marginTop: 10,
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
});
export default CreateStudyPlanScreen;
