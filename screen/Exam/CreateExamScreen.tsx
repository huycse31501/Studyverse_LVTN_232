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

type CreateExamRouteProp = RouteProp<RootStackParamList, "CreateExamScreen">;

interface CreateExamScreenProps {
  route: CreateExamRouteProp;
  navigation: StackNavigationProp<RootStackParamList, "CreateExamScreen">;
}
const validateValidDate = (checkDate: string) => {
  const [day, month, year] = checkDate.split("/");
  const examDate = new Date(+year, +month - 1, +day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (examDate < today) {
    return false;
  }
  return true;
};

const CreateExamScreen = ({ route, navigation }: CreateExamScreenProps) => {
  const { userId, previousPayload, currentQuestionList } = route.params;

  const [inputs, setInputs] = useState({
    examName: {
      value: "",
      required: true,
    },
    description: {
      value: "",
      required: false,
    },

    examTime: {
      value: "",
      required: true,
    },
    examDate: {
      value: "",
      required: true,
    },
    passPoint: {
      value: "",
      required: true,
    },
    tagsUser: {
      value: "[]",
      required: true,
    },
    tagsSubject: {
      value: [] as string[],
      required: true,
    },
  });

  const toggleTagSelection = (tagName: string) => {
    setInputs((currentInputs) => {
      const updatedTags = currentInputs.tagsSubject.value.includes(tagName)
        ? currentInputs.tagsSubject.value.filter((tag) => tag !== tagName)
        : [...currentInputs.tagsSubject.value, tagName];

      return {
        ...currentInputs,
        tagsSubject: {
          ...currentInputs.tagsSubject,
          value: updatedTags,
        },
      };
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

  const [inputValidation, setInputValidation] = useState({
    isExamDateValid: validateValidDate(inputs.examDate.value),
    isExamTimeValid: regexVault.examTime.test(inputs.examTime.value),
    isPassPointValid: regexVault.passPoint.test(inputs.passPoint.value),
  });

  useEffect(() => {
    const updatedValidation = {
      isPassPointValid:
        inputs.passPoint.value.length === 0 ||
        regexVault.passPoint.test(inputs.passPoint.value),

      isExamDateValid:
        validateValidDate(inputs.examDate.value) &&
        regexVault.DOBValidate.test(inputs.examDate.value),
      isExamTimeValid: regexVault.examTime.test(inputs.examTime.value),
    };
    setInputValidation(updatedValidation);
  }, [
    inputs.examName.value,
    inputs.examDate.value,
    inputs.examTime.value,
    inputs.passPoint.value,
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
    [inputs]
  );

  const resetInputs = () => {
    setInputs({
      examName: {
        value: "",
        required: true,
      },
      description: {
        value: "",
        required: false,
      },
      examTime: {
        value: "",
        required: true,
      },
      examDate: {
        value: "",
        required: true,
      },
      passPoint: {
        value: "",
        required: true,
      },
      tagsUser: {
        value: "[]",
        required: true,
      },
      tagsSubject: {
        value: [],
        required: true,
      },
    });
  };

  const continueHandle = () => {
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
      if (inputValidation.isExamDateValid === false) {
        Alert.alert("Bạn không thể tạo bài kiểm tra trong quá khứ");
      } else if (inputValidation.isPassPointValid === false) {
        Alert.alert(
          "Thông báo",
          "Số điểm cần để đạt bài kiểm tra phải nằm trong khoảng từ 1 đến 10"
        );
      } else if (inputValidation.isExamTimeValid === false) {
        Alert.alert("Thông báo", "Thời gian làm bài cần ở dạng HH:MM:SS");
      }
    } else {
      navigation.navigate("CreateQuestionListScreen", {
        userId: userId,
        previousPayload: inputs,
        currentQuestionList: currentQuestionList,
      });
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
                navigation.navigate("ExamInfoScreen", {
                  userId: Number(userId),
                  routeBefore: "StatusDashboard",
                  fromFooter: "1",
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Tạo bài kiểm tra</Text>
          <View>
            <Text style={styles.inputTitleText}>Tên bài kiểm tra</Text>
            <BlackBorderTextInputField
              placeHolder="Bài kiểm tra"
              isValid
              required
              value={inputs.examName.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "examName"),
              }}
            />
          </View>

          <View>
            <Text style={styles.inputTitleText}>
              Số điểm cần để vượt qua bài kiểm tra
            </Text>
            <BlackBorderTextInputField
              placeHolder="Điền số từ 1 tới 10"
              isValid
              required
              value={inputs.passPoint.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "passPoint"),
                keyboardType: "number-pad",
              }}
            />
          </View>

          <View>
            <Text style={styles.inputTitleText}>Thời gian làm bài</Text>
            <BlackBorderTextInputField
              placeHolder="Định dạng HH:MM:SS"
              isValid
              required
              value={inputs.examTime.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "examTime"),
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
            Hạn làm bài
          </Text>
          <View style={styles.examDateContainer}>
            <DateInputField
              required
              isValid
              placeHolder="Ngày nộp bài"
              dateStr={inputs.examDate.value}
              textInputConfig={{
                onChangeText: inputChangedHandler.bind(this, "examDate"),
              }}
            />
          </View>

          <Text style={styles.noteText}>Thành viên cần làm bài</Text>
          <View style={styles.memberChoiceContainer}>
            <MemberTagList
              onSelectedMembersChange={handleSelectedMembersChange}
            />
          </View>
          <Text style={styles.noteText}>Nhãn bài kiểm tra</Text>
          <View style={styles.tagContainer}>
            {listOfTags.map((tag, index) => (
              <TagToSelect
                key={index}
                name={tag}
                isSelected={inputs.tagsSubject.value.includes(tag)}
                onPress={() => toggleTagSelection(tag)}
              />
            ))}
          </View>
          <View style={styles.nextButtonContainer}>
            <ApplyButton label="Tiếp tục" onPress={continueHandle} />
          </View>
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
  examDateContainer: {
    width: "85%",
    marginLeft: "6.5%",
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
    marginTop: 30,
    marginBottom: 50,
  },
});
export default CreateExamScreen;
