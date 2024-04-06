import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Touchable,
} from "react-native";
import { RootStackParamList } from "../../component/navigator/appNavigator";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Question } from "./DoExam";
import ApplyButton from "../../component/shared/ApplyButton";
import BlackBorderTextInputField from "../../component/shared/BlackBorderInputField";
import { listOfTags } from "../../component/shared/Tags";
import TagToSelect from "../../component/shared/TagsToSelect";

export const mockQuestionsList: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "What is the capital of France?",
    options: ["New York", "London", "Paris", "Tokyo"],
    label: ["Anh văn"],
  },
  {
    id: 2,
    type: "text",
    question: 'Who wrote "Romeo and Juliet"?',
    label: ["Ngữ văn"],
  },
];

type CreateNewQuestionRouteProp = RouteProp<
  RootStackParamList,
  "CreateNewQuestionScreen"
>;

interface CreateNewQuestionScreenProps {
  route: CreateNewQuestionRouteProp;
  navigation: StackNavigationProp<
    RootStackParamList,
    "CreateNewQuestionScreen"
  >;
}

const CreateNewQuestionScreen = ({
  route,
  navigation,
}: CreateNewQuestionScreenProps) => {
  const { userId, previousPayload, currentQuestionList } = route.params;

  const [questionType, setQuestionType] = useState("multiple-choice");
  const [questionTitle, setQuestionTitle] = useState("");

  const [questionOptions, setQuestionOptions] = useState(["", "", "", ""]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toggleTagSelection = (tagName: string) => {
    setSelectedTags((currentSelectedTags) => {
      if (currentSelectedTags.includes(tagName)) {
        return currentSelectedTags.filter((tag) => tag !== tagName);
      } else {
        return [...currentSelectedTags, tagName];
      }
    });
  };
  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const excludeList = totalList
    .filter((member) => member.role === "parent")
    .map((member) => Number(member.userId));
  const [inputs, setInputs] = useState(mockQuestionsList);

  const handleBackButton = () => {
    navigation.navigate("CreateQuestionListScreen", {
      userId: Number(userId),
      previousPayload: previousPayload,
      currentQuestionList: currentQuestionList,
    });
  };
  const updateOption = (index: number, value: string) => {
    setQuestionOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
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
              onPress={handleBackButton}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              disabled={questionType === "multiple-choice"}
              onPress={() => setQuestionType("multiple-choice")}
            >
              <View style={styles.buttonContainer}>
                <Text
                  style={
                    questionType === "multiple-choice"
                      ? [styles.text, styles.bold]
                      : styles.text
                  }
                >
                  Trắc nghiệm
                </Text>
                {questionType === "multiple-choice" && (
                  <View style={styles.underline} />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={questionType === "text"}
              onPress={() => setQuestionType("text")}
            >
              <View style={styles.buttonContainer}>
                <Text
                  style={
                    questionType === "text"
                      ? [styles.text, styles.bold]
                      : styles.text
                  }
                >
                  Tự luận
                </Text>
                {questionType === "text" && <View style={styles.underline} />}
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.inputTitleText}>Tiêu đề câu hỏi</Text>
            <BlackBorderTextInputField
              placeHolder="Tiêu đề"
              isValid
              required
              value={questionTitle}
              textInputConfig={{
                onChangeText: setQuestionTitle,
              }}
            />
          </View>
          {questionType === "multiple-choice" && (
            <>
              <View style={{}}>
                <Text style={styles.inputTitleText}>Đáp án</Text>
                <BlackBorderTextInputField
                  placeHolder="Lựa chọn 1"
                  isValid
                  required
                  value={questionOptions[0]}
                  textInputConfig={{
                    onChangeText: (value) => updateOption(0, value),
                  }}
                />
                <BlackBorderTextInputField
                  placeHolder="Lựa chọn 2"
                  isValid
                  required
                  value={questionOptions[1]}
                  textInputConfig={{
                    onChangeText: (value) => updateOption(1, value),
                  }}
                />
                <BlackBorderTextInputField
                  placeHolder="Lựa chọn 3"
                  isValid
                  required
                  value={questionOptions[2]}
                  textInputConfig={{
                    onChangeText: (value) => updateOption(2, value),
                  }}
                />
                <BlackBorderTextInputField
                  placeHolder="Lựa chọn 4"
                  isValid
                  required
                  value={questionOptions[3]}
                  textInputConfig={{
                    onChangeText: (value) => updateOption(3, value),
                  }}
                />
              </View>
            </>
          )}
          <Text style={styles.noteText}>Nhãn bài kiểm tra</Text>
          <View style={styles.tagContainer}>
            {listOfTags.map((tag, index) => (
              <TagToSelect
                key={index}
                name={tag}
                isSelected={selectedTags.includes(tag)}
                onPress={() => toggleTagSelection(tag)}
              />
            ))}
          </View>
          <View
            style={{
              marginTop: questionType === "multiple-choice" ? 25 : 250,
              marginBottom: 40,
            }}
          >
            <ApplyButton
              label="Tạo câu hỏi"
              onPress={() => {
                const newQuestion: Question = {
                  id: currentQuestionList.length + 1,
                  type: questionType === "multiple-choice" ? "multiple-choice" : "text",
                  question: questionTitle,
                  label: selectedTags,
                };
              
                if (questionType === 'multiple-choice') {
                  newQuestion.options = questionOptions;
                }
              
                navigation.navigate("CreateQuestionListScreen", {
                  userId: userId,
                  previousPayload: previousPayload,
                  currentQuestionList: [...currentQuestionList, newQuestion],
                });
              }}
            />
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
  inputTitleText: {
    fontSize: 19,
    color: "#1E293B",
    fontWeight: "600",
    paddingLeft: 30,
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    alignSelf: "center",
    color: "#1E293B",
    fontWeight: "bold",
    fontSize: 24,
    marginVertical: 15,
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  text: {
    color: "#FF2D55",
    fontSize: 18,
  },
  bold: {
    fontWeight: "bold",
    marginTop: 5,
  },
  underline: {
    height: 3,
    backgroundColor: "#FF0076",
    width: "100%",
    marginTop: 2,
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
});
export default CreateNewQuestionScreen;
