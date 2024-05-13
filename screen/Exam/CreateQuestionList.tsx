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
  Alert,
  ActivityIndicator,
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
import Constants from "expo-constants";
import { convertTimeToSeconds } from "../../utils/convertTimeToSecond";
import { minQuestionsToPass } from "../../utils/minQuestionToPass";
import {
  convertSubjectToId,
  convertSubjectsToIds,
} from "../../component/shared/constants/convertSubjectToId";
import parseStringToDate from "../../utils/parseStringToDate";

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

let host = Constants?.expoConfig?.extra?.host;
let port = Constants?.expoConfig?.extra?.port;

const CreateQuestionListScreen = ({
  route,
  navigation,
}: CreateQuestionListScreenProps) => {
  const { userId, previousPayload, currentQuestionList } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [questionList, setQuestionList] = useState(currentQuestionList)
  const isEnglishEnabled = useSelector(
    (state: RootState) => state.language.isEnglishEnabled
  );
  useEffect(() => {
    if (currentQuestionList) {
      setQuestionList(currentQuestionList);
    }
  }, [currentQuestionList]);
  const handleSubmitCreateQuestion = async () => {
    if (!currentQuestionList) {
      Alert.alert("Bài kiểm tra cần tối thiểu 1 câu hỏi");
    } else {
      let requestCreateTestURL = `https://${host}/test/createTest`;

      try {
        const response = await fetch(requestCreateTestURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: previousPayload?.examName?.value,
            description: "",
            time: convertTimeToSeconds(previousPayload?.examTime?.value),
            questionCountToPass: minQuestionsToPass(
              previousPayload?.passPoint?.value,
              questionList.length
            ),
            parentId: userId,
            tags: convertSubjectsToIds(previousPayload?.tagsSubject?.value),
            startDate: new Date(),
            endDate: parseStringToDate(previousPayload?.examDate?.value),
            image: "",
            childrenIds: previousPayload?.tagsUser?.value,
            questions: questionList.map((question: any) => {
              return {
                name: question?.question,
                type: question?.type === "multiple-choice" ? 1 : 2,
                tags: convertSubjectsToIds(question?.label),
                description: "",
                suggest: "",
                image: question?.image,
                choices:
                  question?.type === "multiple-choice"
                    ? question?.options.map((choice: any) => {
                        return {
                          content: choice,
                          image: "",
                        };
                      })
                    : [],
                answerId:
                  question?.type === "multiple-choice"
                    ? question?.answerId
                    : -1,
              };
            }),
          }),
        });
        const data = await response.json();
        if (data.msg == "1") {
          setIsLoading(false);
          navigation.navigate("ExamInfoScreen", {
            userId: Number(userId),
            routeBefore: "CreateExamScreen",
            newExamCreated: true,
          });
        } else {
          setIsLoading(false);
          Alert.alert("Thất bại", "Tạo bài kiểm tra thất bại");
        }
      } catch (e) {
        setIsLoading(false);
        Alert.alert(`Tạo bài kiểm tra thất bại`);
      }
    }
  };
  const handleRemoveQuestion = (indexToRemove: number): void => {
    const updatedQuestions: Question[] = questionList.filter((_: any, index: number) => index !== indexToRemove);
    setQuestionList(updatedQuestions);
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
                navigation.navigate("CreateExamScreen", {
                  userId: Number(userId),
                  previousPayload: previousPayload,
                  currentQuestionList: questionList,
                });
              }}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>{isEnglishEnabled ? "Create Exam" :"Tạo bài kiểm tra"}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.inputTitleText}>{isEnglishEnabled ? "Question list" :"Danh sách câu hỏi"}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CreateNewQuestionScreen", {
                  userId: userId,
                  currentQuestionList: questionList,
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
            {questionList &&
              questionList.map((question: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={styles.questionContainer}
                  onPress={() => {}}
                >
                  <Text style={styles.questionTitleText}>
                    {question.question.slice(0, 55)}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveQuestion(index)}>
                    <Image style={styles.removeQuestion} source={require("../../assets/images/shared/declineIcon.png")}/>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
      <View style={styles.nextButtonContainer}>
        <ApplyButton label={isEnglishEnabled ? "Confirm" : "Xác nhận"} onPress={handleSubmitCreateQuestion} />
      </View>
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
    justifyContent: "space-between",
  },
  questionTitleText: {
    fontSize: 16,
    fontWeight: "500",
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
  removeQuestion: {
    width: 25,
    height: 25,
  },
});
export default CreateQuestionListScreen;
