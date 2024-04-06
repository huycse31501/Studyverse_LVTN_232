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
import regexVault from "../../utils/regex";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BlackBorderTextInputField from "../../component/shared/BlackBorderInputField";
import DateInputField from "../../component/signin-signup/DateInputField";
import MemberTagList from "../../component/EventRelated/tagFamilyMember";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Question } from "./DoExam";
import ApplyButton from "../../component/shared/ApplyButton";

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

type CreateQuestionListRouteProp = RouteProp<
  RootStackParamList,
  "CreateQuestionListScreen"
>;

interface CreateQuestionListScreenProps {
  route: CreateQuestionListRouteProp;
  navigation: StackNavigationProp<
    RootStackParamList,
    "CreateQuestionListScreen"
  >;
}

const CreateQuestionListScreen = ({
  route,
  navigation,
}: CreateQuestionListScreenProps) => {
  const { userId, previousPayload, currentQuestionList } = route.params;

  const user = useSelector((state: RootState) => state.user.user);
  const familyList = useSelector(
    (state: RootState) => state.familyMember.familyMembers
  );
  const totalList = user ? [...familyList, user] : familyList;
  const excludeList = totalList
    .filter((member) => member.role === "parent")
    .map((member) => Number(member.userId));
  const [inputs, setInputs] = useState(
    currentQuestionList ?? mockQuestionsList
  );

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
                navigation.navigate("CreateExamScreen", {
                  userId: Number(userId),
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Tạo bài kiểm tra</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.inputTitleText}>Danh sách câu hỏi</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CreateNewQuestionScreen", {
                  userId: userId,
                  currentQuestionList: inputs,
                  previousPayload: previousPayload,
                })
              }
            >
              <Image
                source={require("../../assets/images/shared/addQuestion.png")}
                style={styles.addIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.questionListContainer}>
            {inputs.map((question: any, index: any) => (
              <TouchableOpacity
                key={index}
                style={styles.questionContainer}
                onPress={() => {}}
              >
                <Text style={styles.questionTitleText}>
                  {question.question}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <View style={styles.nextButtonContainer}>
        <ApplyButton label="Xác nhận" onPress={() => {}} />
      </View>
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
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
  },
  addIcon: {
    width: 35,
    height: 35,
    marginLeft: 135,
    marginTop: 5,
  },
  questionListContainer: {},
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF5",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    width: "85%",
    marginLeft: 25,
  },
  questionTitleText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
export default CreateQuestionListScreen;
